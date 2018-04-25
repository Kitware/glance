import React from 'react';
import PropTypes from 'prop-types';

import vtkDataArray from 'vtk.js/Sources/Common/Core/DataArray';
import vtkImageData from 'vtk.js/Sources/Common/DataModel/ImageData';

import UI from '../../ui';

import style from './RawReader.mcss';

const { Button } = UI;

const BYTE_SIZES = {
  Int8Array: 1,
  Uint8Array: 1,
  Int16Array: 2,
  Uint16Array: 2,
  Int32Array: 4,
  Uint32Array: 4,
  Float32Array: 4,
  Float64Array: 8,
};

export default class RawReader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      size: 0,
      dimensions: [1, 1, 1, 1],
      spacing: [1, 1, 1],
      type: 'Uint8Array',
      loading: false,
    };

    if (props.file) {
      const io = new FileReader();
      io.onload = (e) => {
        this.setState({ byteArray: io.result, size: io.result.byteLength });
      };
      io.readAsArrayBuffer(props.file);
    }

    // Closure for callback
    this.onDimensionChange = this.onDimensionChange.bind(this);
    this.onSpacingChange = this.onSpacingChange.bind(this);
    this.onTypeChange = this.onTypeChange.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onLoad = this.onLoad.bind(this);
  }

  onDimensionChange(e) {
    const value = Number(e.target.value);
    const index = Number(e.target.dataset.index);
    const { dimensions } = this.state;
    dimensions[index] = value;
    this.setState({ dimensions });
  }

  onSpacingChange(e) {
    const value = Number(e.target.value);
    const index = Number(e.target.dataset.index);
    const { spacing } = this.state;
    spacing[index] = value;
    this.setState({ spacing });
  }

  onTypeChange(e) {
    const type = e.target.value;
    const { dimensions } = this.state;
    dimensions[3] = BYTE_SIZES[type];
    this.setState({ dimensions, type });
  }

  onCancel() {
    this.props.addDataset(null);
  }

  onLoad() {
    this.setState({ loading: true }, () => {
      setTimeout(() => {
        const dataset = vtkImageData.newInstance({
          spacing: this.state.spacing,
          extent: [
            0,
            this.state.dimensions[0] - 1,
            0,
            this.state.dimensions[1] - 1,
            0,
            this.state.dimensions[2] - 1,
          ],
        });
        const scalar = vtkDataArray.newInstance({
          name: 'scalar',
          values: new window[this.state.type](this.state.byteArray),
        });
        dataset.getPointData().setScalars(scalar);
        this.props.addDataset(dataset);
      }, 100);
    });
  }

  render() {
    const userDim =
      this.state.dimensions[0] *
      this.state.dimensions[1] *
      this.state.dimensions[2] *
      this.state.dimensions[3];
    return (
      <div className={style.constainer}>
        <section className={style.section}>
          <div className={style.label} style={{ textAlign: 'center' }}>
            {this.props.file.name}
          </div>
        </section>
        <section className={style.section}>
          <label className={style.label}>Number of bytes</label>
          <span>{this.state.size}</span>
        </section>
        <section className={style.section}>
          <label className={style.label}>Data type</label>
          <select
            className={style.type}
            value={this.state.type}
            onChange={this.onTypeChange}
          >
            <option value="Int8Array">Integer 8</option>
            <option value="Uint8Array">Unsigned Integer 8</option>
            <option value="Int16Array">Integer 16</option>
            <option value="Uint16Array">Unsigned Integer 16</option>
            <option value="Int32Array">Integer 32</option>
            <option value="Uint32Array">Usigned Integer 32</option>
            <option value="Float32Array">Float</option>
            <option value="Float64Array">Double</option>
          </select>
        </section>
        <section className={style.section}>
          <label className={style.label}>Dimensions</label>
          <label
            className={userDim !== this.state.size ? style.size : style.hidden}
          >
            {this.state.size / userDim}
          </label>
        </section>
        <section className={style.section}>
          <input
            className={style.number}
            type="number"
            min="1"
            max={this.state.size}
            value={this.state.dimensions[0]}
            data-index="0"
            onChange={this.onDimensionChange}
          />
          <input
            className={style.number}
            type="number"
            min="1"
            max={this.state.size}
            value={this.state.dimensions[1]}
            data-index="1"
            onChange={this.onDimensionChange}
          />
          <input
            className={style.number}
            type="number"
            min="1"
            max={this.state.size}
            value={this.state.dimensions[2]}
            data-index="2"
            onChange={this.onDimensionChange}
          />
        </section>
        <section className={style.section}>
          <label className={style.label}>Spacing</label>
        </section>
        <section className={style.section}>
          <input
            className={style.number}
            type="number"
            value={this.state.spacing[0]}
            data-index="0"
            step="any"
            onChange={this.onSpacingChange}
          />
          <input
            className={style.number}
            type="number"
            value={this.state.spacing[1]}
            data-index="1"
            step="any"
            onChange={this.onSpacingChange}
          />
          <input
            className={style.number}
            type="number"
            value={this.state.spacing[2]}
            step="any"
            data-index="2"
            onChange={this.onSpacingChange}
          />
        </section>
        <section className={style.section}>
          <Button
            className={style.button}
            onClick={this.onCancel}
            style={{ marginRight: '5px' }}
          >
            Cancel
          </Button>
          <Button
            className={style.button}
            onClick={this.onLoad}
            disabled={userDim !== this.state.size || this.state.loading}
            style={{ marginLeft: '5px' }}
          >
            Read
          </Button>
        </section>
      </div>
    );
  }
}

RawReader.propTypes = {
  addDataset: PropTypes.func,
  file: PropTypes.object,
};

RawReader.defaultProps = {
  addDataset: null,
  file: null,
};
