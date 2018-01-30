import React from 'react';
import PropTypes from 'prop-types';

import { Button } from 'antd';

/* eslint-disable react/no-danger */
/* eslint-disable react/no-unused-prop-types */
export default class ExecuteProperty extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      helpOpen: false,
      ui: props.ui,
    };

    // Callback binding
    this.onClick = this.onClick.bind(this);
  }

  componentWillMount() {
    const newState = {};
    if (this.props.ui.default && !this.props.data.value) {
      newState.data = this.state.data;
      newState.data.value = this.props.ui.default;
    }

    if (Object.keys(newState).length > 0) {
      this.setState(newState);
    }
  }

  componentWillReceiveProps(nextProps) {
    const data = nextProps.data;

    if (this.state.data !== data) {
      this.setState({
        data,
      });
    }
  }

  onClick() {
    if (this.props.onChange) {
      this.props.onChange({
        id: this.state.data.id,
        value: '__command_execute__',
      });
    }
  }

  render() {
    return (
      <Button
        style={{ width: 'calc(100% - 20px)', margin: '0 10px' }}
        onClick={this.onClick}
        disabled={this.props.data.value[0] === false ? 'disabled' : ''}
      >
        {this.state.ui.label}
      </Button>
    );
  }
}

ExecuteProperty.propTypes = {
  data: PropTypes.object.isRequired,
  help: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  show: PropTypes.func,
  ui: PropTypes.object.isRequired,
  viewData: PropTypes.object,
};

ExecuteProperty.defaultProps = {
  name: '',
  help: '',
  onChange: () => {},
  show: () => true,
  viewData: {},
};
