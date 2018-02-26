import React from 'react';
import PropTypes from 'prop-types';

import vtkPiecewiseGaussianWidget from 'vtk.js/Sources/Interaction/Widgets/PiecewiseGaussianWidget';

import style from 'paraviewweb/style/ReactProperties/CellProperty.mcss';

/* eslint-disable react/no-danger */
/* eslint-disable react/no-unused-prop-types */
export default class PiecewiseFunctionProperty extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      helpOpen: false,
      ui: props.ui,
    };

    this.piecewiseWidget = vtkPiecewiseGaussianWidget.newInstance({
      numberOfBins: 256,
      size: [300, 150],
    });

    this.piecewiseWidget.updateStyle({
      backgroundColor: 'rgba(255, 255, 255, 0.6)',
      histogramColor: 'rgba(100, 100, 100, 0.5)',
      strokeColor: 'rgb(0, 0, 0)',
      activeColor: 'rgb(255, 255, 255)',
      handleColor: 'rgb(50, 150, 50)',
      buttonDisableFillColor: 'rgba(255, 255, 255, 0.5)',
      buttonDisableStrokeColor: 'rgba(0, 0, 0, 0.5)',
      buttonStrokeColor: 'rgba(0, 0, 0, 1)',
      buttonFillColor: 'rgba(255, 255, 255, 1)',
      strokeWidth: 2,
      activeStrokeWidth: 3,
      buttonStrokeWidth: 1.5,
      handleWidth: 3,
      iconSize: 0,
      padding: 10,
    });

    // Callback binding
    this.onOpacityChange = this.onOpacityChange.bind(this);
    this.updateWidget = this.updateWidget.bind(this);

    // Subscription handling
    this.subscriptions = [];
    this.widgetSubscriptions = [
      this.piecewiseWidget.onOpacityChange(() => {
        this.onOpacityChange();
      }),
      this.piecewiseWidget.onAnimation((animating) => {
        const pwfproxy = this.props.data.value[0];
        if (pwfproxy) {
          pwfproxy.getProxyManager().setAnimationOnAllViews(animating);
        }
      }),
    ];
  }

  componentWillMount() {
    const newState = {};
    if (this.props.ui.default && !this.props.data.value) {
      newState.data = this.state.data;
      newState.data.value = this.props.ui.default;
    }

    if (Object.keys(newState).length > 0) {
      this.setState(newState, this.updateWidget);
    }
  }

  componentDidMount() {
    this.piecewiseWidget.setContainer(this.widgetContainer);
    this.piecewiseWidget.bindMouseListeners();
    this.updateWidget();
  }

  componentWillReceiveProps(nextProps) {
    while (this.subscriptions.length) {
      this.subscriptions.pop().unsubscribe();
    }

    const data = nextProps.data;
    if (this.state.data !== data) {
      this.setState({ data }, this.updateWidget);
    }
  }

  componentDidUpdate() {
    this.piecewiseWidget.render();
  }

  componentWillUnmount() {
    while (this.widgetSubscriptions.length) {
      this.widgetSubscriptions.pop().unsubscribe();
    }
    while (this.subscriptions.length) {
      this.subscriptions.pop().unsubscribe();
    }

    this.piecewiseWidget.unbindMouseListeners();
    this.piecewiseWidget.setContainer(null);
  }

  onOpacityChange() {
    const pwfproxy = this.props.data.value[0];
    if (pwfproxy) {
      pwfproxy.setGaussians(
        this.piecewiseWidget.getReferenceByName('gaussians')
      );
    }
  }

  updateWidget() {
    const pwfProxy = this.props.data.value[0];
    if (pwfProxy) {
      const lut = pwfProxy.getLookupTableProxy().getLookupTable();
      this.piecewiseWidget.setGaussians(pwfProxy.getGaussians());
      this.piecewiseWidget.setDataArray(
        Float32Array.from(pwfProxy.getDataRange())
      );
      this.piecewiseWidget.setColorTransferFunction(lut);
      this.subscriptions.push(
        lut.onModified(() => {
          this.piecewiseWidget.render();
        })
      );
      this.piecewiseWidget.render();
    }
  }

  render() {
    if (!this.props.data.value[0]) {
      return null;
    }
    return (
      <div
        className={this.props.show(this.props.viewData) ? '' : style.hidden}
        ref={(c) => {
          this.widgetContainer = c;
        }}
      />
    );
  }
}

PiecewiseFunctionProperty.propTypes = {
  data: PropTypes.object.isRequired,
  help: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  show: PropTypes.func,
  ui: PropTypes.object.isRequired,
  viewData: PropTypes.object,
};

PiecewiseFunctionProperty.defaultProps = {
  name: '',
  help: '',
  onChange: () => {},
  show: () => true,
  viewData: {},
};
