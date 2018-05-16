import macro, { vtkErrorMacro } from 'vtk.js/Sources/macro';

import vtkImageCroppingRegionsWidget from 'vtk.js/Sources/Interaction/Widgets/ImageCroppingRegionsWidget';

function ImageCrop(publicAPI, model) {
  model.widgets = [];
  model.subscriptions = [];

  function makeWidget(interactor, imageMapper, view) {
    const widget = vtkImageCroppingRegionsWidget.newInstance();
    widget.setInteractor(interactor);
    widget.setHandleSize(model.handleSize);
    // doesn't matter if slicing mode is IJK or XYZ, hence the mod 3
    widget.setSliceOrientation(imageMapper.getSlicingMode() % 3);
    widget.setSlice(imageMapper.getSlice());
    return widget;
  }

  publicAPI.init = () => {
    if (!model.proxyManager) {
      vtkErrorMacro('No proxy manager provided');
      return false;
    }

    const source = model.proxyManager.getActiveSource();
    if (!source) {
      return false;
    }

    const views = model.proxyManager.getViews();

    // create widgets for each image slice view
    for (let i = 0; i < views.length; ++i) {
      const view = views[i];
      const rep = model.proxyManager.getRepresentation(source, view);
      if (rep && view.isA('vtkView2DProxy')) {
        const imageMapper = rep.getMapper();

        const widget = makeWidget(view.getInteractor(), imageMapper);
        model.widgets.push(widget);

        model.subscriptions.push(
          imageMapper.onModified(() => widget.setSlice(imageMapper.getSlice()))
        );
      }
    }

    // assign volume mapper to widgets and enable
    for (let i = 0; i < views.length; ++i) {
      const view = views[i];
      const rep = model.proxyManager.getRepresentation(source, view);
      if (rep && rep.getMapper() && rep.getMapper().isA('vtkVolumeMapper')) {
        model.widgets.forEach((widget) => {
          widget.setVolumeMapper(rep.getMapper());
          widget.setEnabled(true);
        });
        // only use first found volume mapper
        break;
      }
    }

    // after enabling, add listeners for plane synchronization
    model.widgets.forEach((widget) =>
      model.subscriptions.push(
        widget.onCroppingPlanesPositionChanged(() =>
          publicAPI.syncPlanes(widget)
        )
      )
    );

    // set representation properties after enabling the widget
    publicAPI.setOpacity(model.opacity);
    publicAPI.setEdgeColor(model.edgeColor);

    // render
    model.widgets.forEach((widget) => widget.getInteractor().render());

    return true;
  };

  publicAPI.syncPlanes = (invokeSource) => {
    const planes = invokeSource.getWidgetRep().getPlanePositions();
    model.widgets.filter((w) => w !== invokeSource).forEach((widget) => {
      widget.getWidgetRep().setPlanePositions(...planes);
      widget.getInteractor().render();
    });
  };

  publicAPI.setHandleSize = macro.chain(
    (size) => model.widgets.forEach((widget) => widget.setHandleSize(size)),
    publicAPI.setHandleSize
  );

  publicAPI.setOpacity = macro.chain(
    (opacity) =>
      model.widgets.forEach((widget) =>
        widget.getWidgetRep().setOpacity(opacity)
      ),
    publicAPI.setOpacity
  );

  publicAPI.setEdgeColor = macro.chain(
    (edgeColor) =>
      model.widgets.forEach((widget) =>
        widget.getWidgetRep().setEdgeColor(edgeColor)
      ),
    publicAPI.setEdgeColor
  );

  publicAPI.delete = macro.chain(() => {
    while (model.subscriptions.length) {
      model.subscriptions.pop().unsubscribe();
    }
    model.widgets.forEach((widget) => {
      widget.setEnabled(false);
      widget.getInteractor().render();
    });
  }, publicAPI.delete);
}

const DEFAULT_VALUES = {
  handleSize: 8,
  opacity: 0.5,
  edgeColor: [1.0, 0.0, 0.0],
};

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  macro.obj(publicAPI, model);
  macro.setGet(publicAPI, model, ['handleSize', 'opacity', 'edgeColor']);

  ImageCrop(publicAPI, model);
}

export const newInstance = macro.newInstance(extend, 'ImageCrop');

export default { newInstance, extend };
