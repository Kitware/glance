import macro from 'vtk.js/Sources/macro';
import vtkImageSlice from 'vtk.js/Sources/Rendering/Core/ImageSlice';
import vtkImageMapper from 'vtk.js/Sources/Rendering/Core/ImageMapper';
import vtkColorTransferFunction from 'vtk.js/Sources/Rendering/Core/ColorTransferFunction';
import vtkPiecewiseFunction from 'vtk.js/Sources/Common/DataModel/PiecewiseFunction';
import vtkAbstractRepresentationProxy from 'vtk.js/Sources/Proxy/Core/AbstractRepresentationProxy';
import ImagePropertyConstants from 'vtk.js/Sources/Rendering/Core/ImageProperty/Constants';

import utils from 'paraview-glance/src/utils';

const { makeSubManager } = utils;
const { InterpolationType } = ImagePropertyConstants;

// ----------------------------------------------------------------------------
// vtkLabelMapSliceRepProxy methods
// ----------------------------------------------------------------------------

function vtkLabelMapSliceRepProxy(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkLabelMapSliceRepProxy');

  const labelMapSub = makeSubManager();
  const masterSliceSub = makeSubManager();
  const labelMapSliceSub = makeSubManager();

  model.mapper = vtkImageMapper.newInstance();
  model.actor = vtkImageSlice.newInstance();
  model.property = model.actor.getProperty();

  // connect rendering pipeline
  model.actor.setMapper(model.mapper);
  model.actors.push(model.actor);

  model.property.setInterpolationType(InterpolationType.NEAREST);

  model.masterSliceRep = null;

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

  publicAPI.setMasterSlice = (masterSliceRep) => {
    if (model.masterSliceRep !== masterSliceRep) {
      if (model.masterSliceRep) {
        masterSliceSub.unsub();
        labelMapSliceSub.unsub();
      }

      model.masterSliceRep = masterSliceRep;

      if (masterSliceRep) {
        // sync from master to labelmap
        masterSliceSub.sub(
          masterSliceRep.onModified(() => {
            const slice = masterSliceRep.getSlice();
            const mode =
              vtkImageMapper.SlicingMode[masterSliceRep.getSlicingMode()];

            model.mapper.setSlice(slice);
            model.mapper.setSlicingMode(mode);
          })
        );

        // sync from labelmap to master
        labelMapSliceSub.sub(
          publicAPI.onModified(() => {
            masterSliceRep.setSlice(model.mapper.getSlice());
            masterSliceRep.setSlicingMode(
              'IJKXYZ'[model.mapper.getSlicingMode()]
            );
          })
        );

        // first update syncs labelmap slice with master slice
        masterSliceRep.modified();

        publicAPI.modified();
      }
    }
  };

  publicAPI.delete = macro.chain(publicAPI.delete, () => {
    labelMapSub.unsub();
    masterSliceSub.unsub();
    labelMapSliceSub.unsub();
  });

  // Keep things updated
  model.sourceDependencies.push({ setInputData });
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {};

// ----------------------------------------------------------------------------

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Object methods
  vtkAbstractRepresentationProxy.extend(publicAPI, model);

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
