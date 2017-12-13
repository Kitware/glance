import React from 'react';
import PropTypes from 'prop-types';

// import macro                          from 'vtk.js/Sources/macro';
import vtkActor                       from 'vtk.js/Sources/Rendering/Core/Actor';
// import vtkConcentricCylinderSource    from 'vtk.js/Sources/Filters/Sources/ConcentricCylinderSource';
// import vtkConeSource                  from 'vtk.js/Sources/Filters/Sources/ConeSource';
// import vtkDataArray                   from 'vtk.js/Sources/Common/Core/DataArray';
// import vtkGlyph3DMapper               from 'vtk.js/Sources/Rendering/Core/Glyph3DMapper';
import vtkInteractorStyleManipulator  from 'vtk.js/Sources/Interaction/Style/InteractorStyleManipulator';
import vtkMapper                      from 'vtk.js/Sources/Rendering/Core/Mapper';
import vtkOpenGLRenderWindow          from 'vtk.js/Sources/Rendering/OpenGL/RenderWindow';
// import vtkPolyData                    from 'vtk.js/Sources/Common/DataModel/PolyData';
import vtkRenderer                    from 'vtk.js/Sources/Rendering/Core/Renderer';
import vtkRenderWindow                from 'vtk.js/Sources/Rendering/Core/RenderWindow';
import vtkRenderWindowInteractor      from 'vtk.js/Sources/Rendering/Core/RenderWindowInteractor';
import vtkTrackballPan                from 'vtk.js/Sources/Interaction/Manipulators/TrackballPan';
import vtkTrackballRoll               from 'vtk.js/Sources/Interaction/Manipulators/TrackballRoll';
import vtkTrackballRotate             from 'vtk.js/Sources/Interaction/Manipulators/TrackballRotate';
import vtkTrackballZoom               from 'vtk.js/Sources/Interaction/Manipulators/TrackballZoom';

import style from './vtk-layout.mcss';

export default class Layout3D extends React.Component {
  constructor(props) {
    super(props);

    // Setup vtk.js objects
    this.renderWindow = vtkRenderWindow.newInstance();
    this.renderer = vtkRenderer.newInstance({ background: [0, 0, 0] });
    this.renderWindow.addRenderer(this.renderer);

    this.openglRenderWindow = vtkOpenGLRenderWindow.newInstance();
    this.renderWindow.addView(this.openglRenderWindow);

    this.interactor = vtkRenderWindowInteractor.newInstance();
    this.interactor.setView(this.openglRenderWindow);

    this.interactorStyle = vtkInteractorStyleManipulator.newInstance();
    this.interactor.setInteractorStyle(this.interactorStyle);

    this.interactorStyle.removeAllManipulators();
    // Rotate
    this.interactorStyle.addManipulator(vtkTrackballRotate.newInstance());
    // Pan
    this.interactorStyle.addManipulator(vtkTrackballPan.newInstance({ shift: true }));
    // Zoom
    this.interactorStyle.addManipulator(vtkTrackballZoom.newInstance({ control: true }));
    this.interactorStyle.addManipulator(vtkTrackballZoom.newInstance({ alt: true }));
    // Roll
    this.interactorStyle.addManipulator(vtkTrackballRoll.newInstance({ shift: true, control: true }));
    this.interactorStyle.addManipulator(vtkTrackballRoll.newInstance({ shift: true, alt: true }));

    this.renderingPipeline = {};

    // Closure for callback
    this.resetCamera = this.resetCamera.bind(this);
    this.resize = this.resize.bind(this);
  }

  componentDidMount() {
    this.openglRenderWindow.setContainer(this.container);
    this.interactor.initialize();
    this.interactor.bindEvents(this.container);

    this.processProperties(this.props);

    this.resetCamera();
    this.resize();
    window.addEventListener('resize', this.resize);
  }

  componentWillReceiveProps(nextProps) {
    this.processProperties(nextProps);
  }

  componentWillUnmount() {
    this.clearPipeline();
    window.removeEventListener('resize', this.resize);
    this.interactor.unbindEvents(this.container);
    this.openglRenderWindow.setContainer(null);
  }

  resize() {
    if (this.container) {
      const dims = this.container.getBoundingClientRect();
      this.openglRenderWindow.setSize(Math.floor(dims.width), Math.floor(dims.height));
      this.renderWindow.render();
    }
  }

  resetCamera() {
    this.renderer.resetCamera();
    this.interactorStyle.setCenterOfRotation(this.renderer.getActiveCamera().getFocalPoint());
    this.renderer.resetCameraClippingRange();
    this.renderWindow.render();
  }

  clearPipeline() {
    Object.keys(this.renderingPipeline).forEach((id) => {
      const item = this.renderingPipeline[id];
      this.renderer.removeActor(item.actor);
    });
  }

  processProperties(props) {
    const { scene: oldScene } = this.props;
    const { scene: newScene } = props;
    const oldIds = oldScene.map(item => item.id);
    const newIdSet = new Set(newScene.map(item => item.id));
    const removed = oldIds.filter(id => !newIdSet.has(id));

    let count = props.scene.length;
    while (count--) {
      const { id, source, visible } = props.scene[count];
      if (!this.renderingPipeline[id]) {
        const actor = vtkActor.newInstance();
        const mapper = vtkMapper.newInstance();
        actor.setMapper(mapper);
        mapper.setInputData(source.getOutputData(0));

        this.renderingPipeline[id] = { id, source, mapper, actor };
        this.renderer.addActor(actor);
        this.resetCamera();
      }

      this.renderingPipeline[id].actor.setVisibility(visible);
    }

    for (let i = 0; i < removed.length; ++i) {
      const id = removed[i];
      this.renderer.removeActor(this.renderingPipeline[id].actor);
      delete this.renderingPipeline[id];
    }

    this.renderWindow.render();
  }

  render() {
    return (
      <div
        className={`${style.renderWindow} ${this.props.className}`}
        ref={((c) => { this.container = c; })}
      />);
  }
}

Layout3D.propTypes = {
  scene: PropTypes.array,
  className: PropTypes.string,
};

Layout3D.defaultProps = {
  scene: [],
  className: '',
};
