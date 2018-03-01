import React from 'react';
import PropTypes from 'prop-types';

import style from './vtk-layout.mcss';

export default class LayoutGrid extends React.Component {
  constructor(props) {
    super(props);

    // populate by the layout stack loop below
    this.state = {};

    // Save this, as the layout config should not change
    this.config = props.initialConfig;

    this.viewRefs = {};
    this.layoutInitActiveView = {};
    this.layoutStacks = {};

    Object.keys(this.config.layouts).forEach((layoutName) => {
      const layout = this.config.layouts[layoutName];

      // set initial active view, if any
      const viewName = Object.keys(layout.views).find(
        (name) => !!layout.views[name].defaultActive
      );
      if (viewName) {
        this.layoutInitActiveView[layoutName] = viewName;
      }

      // process stacks
      const gridY = layout.grid[1];
      const tmpStacks = {};
      Object.keys(layout.views).forEach((name) => {
        const view = layout.views[name];
        const [x, y] = view.cell;
        const stackId = x * gridY + y;
        tmpStacks[stackId] = tmpStacks[stackId] || [];
        tmpStacks[stackId].push(name);
      });

      this.layoutStacks[layoutName] = {};
      Object.keys(tmpStacks).forEach((stackId) => {
        const stack = tmpStacks[stackId];
        if (stack.length > 1) {
          const id = `StackActive_${layoutName}_${stackId}`;
          stack.forEach((view) => {
            // set stack id for this view in this layout
            this.layoutStacks[layoutName][view] = id;
            // set view as visible in stack if possible
            if (layout.views[view].defaultVisible || !this.state[id]) {
              this.state[id] = view;
            }
          });
        }
      });
    });
  }

  componentDidUpdate() {
    // resize all so views fill their containing space
    Object.values(this.viewRefs)
      .filter((v) => !!v)
      .forEach((view) => view.resize());

    // activate initial view, if specified
    if (this.props.layout in this.layoutInitActiveView) {
      let viewName = this.layoutInitActiveView[this.props.layout];

      // if initial view is shadowed by another view in same stack,
      // then activate the other view.
      const stackId = this.layoutStacks[this.props.layout][viewName];
      if (stackId) {
        // if active view in stack is current view, then this is a no-op.
        viewName = this.state[stackId];
      }

      this.viewRefs[viewName].activateView();
    }
  }

  setStackView(newView) {
    const stackId = this.layoutStacks[this.props.layout][newView];
    if (stackId in this.state) {
      this.setState({ [stackId]: newView }, () => {
        this.viewRefs[newView].activateView();
      });
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
      const viewSpec = this.config.views[viewName];
      const props = Object.assign({}, viewSpec.props);
      const cellStyle = {};

      let visible = viewName in layout.views;
      if (visible) {
        const layoutSpec = layout.views[viewName];

        if (viewName in this.layoutStacks[this.props.layout]) {
          const stackId = this.layoutStacks[this.props.layout][viewName];
          visible = this.state[stackId] === viewName;
        }

        const [xCell, yCell] = layoutSpec.cell;
        Object.assign(cellStyle, {
          gridArea: `${xCell} / ${yCell} / ${xCell + 1} / ${yCell + 1}`,
        });

        Object.assign(props, layoutSpec.propOverrides);

        // set our custom stack changing function
        if (viewSpec.stackChangeFunc && props[viewSpec.stackChangeFunc]) {
          const func = props[viewSpec.stackChangeFunc];
          props[viewSpec.stackChangeFunc] = (...args) => {
            this.setStackView(func(...args));
          };
        }
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
