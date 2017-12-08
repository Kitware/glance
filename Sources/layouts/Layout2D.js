import React from 'react';
import PropTypes from 'prop-types';

// import macro                          from 'vtk.js/Sources/macro';
// import vtkActor                       from 'vtk.js/Sources/Rendering/Core/Actor';
// import vtkConcentricCylinderSource    from 'vtk.js/Sources/Filters/Sources/ConcentricCylinderSource';
// import vtkConeSource                  from 'vtk.js/Sources/Filters/Sources/ConeSource';
// import vtkDataArray                   from 'vtk.js/Sources/Common/Core/DataArray';
// import vtkGlyph3DMapper               from 'vtk.js/Sources/Rendering/Core/Glyph3DMapper';
import vtkInteractorStyleManipulator  from 'vtk.js/Sources/Interaction/Style/InteractorStyleManipulator';
// import vtkMapper                      from 'vtk.js/Sources/Rendering/Core/Mapper';
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

export default class Layout2D extends React.Component {
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

    // Closure for callback
    this.resetCamera = this.resetCamera.bind(this);
    this.resize = this.resize.bind(this);
  }

  componentDidMount() {
    this.openglRenderWindow.setContainer(this.container);
    this.interactor.initialize();
    this.interactor.bindEvents(this.container);

    this.resetCamera();
    this.resize();
    window.addEventListener('resize', this.resize);
  }

  componentWillUnmount() {
    // this.clearPipeline();
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

  render() {
    return (
      <div
        className={`${style.renderWindow} ${this.props.className}`}
        ref={((c) => { this.container = c; })}
      />);
  }
}

Layout2D.propTypes = {
  scene: PropTypes.array,
  className: PropTypes.string,
};

Layout2D.defaultProps = {
  scene: [],
  className: '',
};
