import macro from 'vtk.js/Sources/macro';
import vtkImageSlice from 'vtk.js/Sources/Rendering/Core/ImageSlice';
import vtkImageMapper from 'vtk.js/Sources/Rendering/Core/ImageMapper';
import vtkColorTransferFunction from 'vtk.js/Sources/Rendering/Core/ColorTransferFunction';
import vtkPiecewiseFunction from 'vtk.js/Sources/Common/DataModel/PiecewiseFunction';
import vtkAbstractRepresentationProxy from 'vtk.js/Sources/Proxy/Core/AbstractRepresentationProxy';
import ImagePropertyConstants from 'vtk.js/Sources/Rendering/Core/ImageProperty/Constants';

import { makeSubManager } from 'paraview-glance/src/utils';

const { InterpolationType } = ImagePropertyConstants;

// ----------------------------------------------------------------------------
// vtkLabelMapSliceRepProxy methods
// ----------------------------------------------------------------------------

function vtkLabelMapSliceRepProxy(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkLabelMapSliceRepProxy');

  const labelMapSub = makeSubManager();
  // syncSource slice -> labelmap slice
  const syncSub = makeSubManager();
  // labelmap slice -> syncSource slice
  const sliceSub = makeSubManager();

  model.mapper = vtkImageMapper.newInstance();
  model.actor = vtkImageSlice.newInstance();
  model.property = model.actor.getProperty();

  // connect rendering pipeline
  model.actor.setMapper(model.mapper);
  model.actors.push(model.actor);

  model.property.setInterpolationType(InterpolationType.NEAREST);

  model.syncSource = null;

  function updateTransferFunctions(labelmap) {
    const colorMap = labelmap.getColorMap();

    const cfun = vtkColorTransferFunction.newInstance();
    const ofun = vtkPiecewiseFunction.newInstance();

    Object.keys(colorMap).forEach((label) => {
      const l = Number(label);
      cfun.addRGBPoint(l, ...colorMap[label].slice(0, 3).map((c) => c / 255));
      ofun.addPoint(l, colorMap[label][3] / 255);
    });

    model.property.setRGBTransferFunction(cfun);
    model.property.setScalarOpacity(ofun);
  }

  function setInputData(labelmap) {
    const inputDataset = labelmap.getImageRepresentation();
    labelMapSub.sub(
      labelmap.onModified(() => updateTransferFunctions(labelmap))
    );
    updateTransferFunctions(labelmap);
    model.mapper.setInputData(inputDataset);
  }

  const bindToRepresentation = (rep) => {
    console.log('binding to', rep.getClassName());
    const sub1 = rep.onModified(() => {
      if (rep.isDeleted()) {
        // disconnect from our master slice rep
        publicAPI.setSyncSource(null);
      } else {
        const slice = rep.getSlice();
        const mode = vtkImageMapper.SlicingMode[rep.getSlicingMode()];

        model.mapper.setSlice(slice);
        model.mapper.setSlicingMode(mode);
      }
    });

    // sync from labelmap to rep
    const sub2 = publicAPI.onModified(() => {
      if (rep.isDeleted()) {
        // disconnect from our master slice rep
        publicAPI.setSyncSource(null);
      } else {
        rep.setSlice(model.mapper.getSlice());
        rep.setSlicingMode('IJKXYZ'[model.mapper.getSlicingMode()]);
      }
    });

    // first update syncs labelmap slice with sync slice
    rep.modified();

    syncSub.sub(sub1);
    sliceSub.sub(sub2);
  };

  // maybe set this on the labelmap itself? I wonder what slicer does...
  publicAPI.setSyncSource = (syncSource, view) => {
    if (model.syncSource !== syncSource) {
      model.syncSource = syncSource;

      if (syncSource && view) {
        const rep = model.proxyManager.getRepresentation(syncSource, view);
        if (rep) {
          bindToRepresentation(rep);
        }
      }

      publicAPI.modified();
      return true;
    }
    return false;
  };

  publicAPI.delete = macro.chain(publicAPI.delete, () => {
    labelMapSub.unsub();
    syncSub.unsub();
    sliceSub.unsub();
  });

  // Keep things updated
  model.sourceDependencies.push({ setInputData });
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  syncSource: null,
};

// ----------------------------------------------------------------------------

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Object methods
  vtkAbstractRepresentationProxy.extend(publicAPI, model);

  macro.setGet(publicAPI, model, ['syncSource']);

  // Object specific methods
  vtkLabelMapSliceRepProxy(publicAPI, model);

  // Proxyfy
  macro.proxyPropertyMapping(publicAPI, model, {
    visibility: { modelKey: 'actor', property: 'visibility' },
    slice: { modelKey: 'mapper', property: 'slice' },
  });
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(
  extend,
  'vtkLabelMapSliceRepProxy'
);

// ----------------------------------------------------------------------------

export default { newInstance, extend };
