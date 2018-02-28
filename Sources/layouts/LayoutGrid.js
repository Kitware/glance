import React from 'react';
import PropTypes from 'prop-types';

import style from './vtk-layout.mcss';

export default class LayoutGrid extends React.Component {
  constructor(props) {
    super(props);

    // Save this, as the layout config should not change
    this.config = props.initialConfig;

    this.viewRefs = {};
    this.layoutInitActiveView = {};

    Object.keys(this.config.layouts).forEach((layoutName) => {
      const layout = this.config.layouts[layoutName];

      // set initial active view, if any
      const viewName = Object.keys(layout.views).find(
        (name) => !!layout.views[name].defaultActive
      );
      if (viewName) {
        this.layoutInitActiveView[layoutName] = viewName;
      }
    });
  }

  componentDidUpdate() {
    // resize all so views fill their containing space
    Object.values(this.viewRefs)
      .filter((v) => !!v)
      .forEach((view) => view.resize());

    // activate initial view, if specified
    if (this.props.layout in this.layoutInitActiveView) {
      const viewName = this.layoutInitActiveView[this.props.layout];
      this.viewRefs[viewName].activateView();
    }
  }

  setViewRef(name, ref) {
    this.viewRefs[name] = ref;
  }

  render() {
    const layout = this.config.layouts[this.props.layout];

    const [xRows, yRows] = layout.grid;
    const rootStyles = {
      gridTemplate: `repeat(${xRows}, 1fr) / repeat(${yRows}, 1fr)`,
    };

    const views = Object.keys(this.config.views).map((viewName) => {
      const visible = viewName in layout.views;
      const viewSpec = this.config.views[viewName];
      const props = Object.assign({}, viewSpec.props);
      const cellStyle = {};

      if (visible) {
        const layoutSpec = layout.views[viewName];

        const [xCell, yCell] = layoutSpec.cell;
        Object.assign(cellStyle, {
          gridArea: `${xCell} / ${yCell} / ${xCell + 1} / ${yCell + 1}`,
        });

        Object.assign(props, layoutSpec.propOverrides);
      }

      return (
        <div
          className={visible ? style.viewContainer : style.hiddenViewContainer}
          style={cellStyle}
          key={viewName}
        >
          <viewSpec.component
            ref={(r) => this.setViewRef(viewName, r)}
            proxyManager={this.props.proxyManager}
            {...props}
          />
        </div>
      );
    });

    return (
      <div
        className={`${style.layoutRoot} ${this.props.className}`}
        style={rootStyles}
      >
        {views}
      </div>
    );
  }
}

LayoutGrid.propTypes = {
  initialConfig: PropTypes.object.isRequired,
  layout: PropTypes.string.isRequired,
  proxyManager: PropTypes.object,
  className: PropTypes.string,
};

LayoutGrid.defaultProps = {
  proxyManager: null,
  className: '',
};
