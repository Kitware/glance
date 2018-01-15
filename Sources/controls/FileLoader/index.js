import React from 'react';
import PropTypes from 'prop-types';

import { Button, Icon } from 'antd';

import vtkSource from '../../pipeline/Source';
import ReaderFactory from '../../io/ReaderFactory';
import RawReader from './RawReader';
import style from './FileLoader.mcss';

export default class FileLoader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
    };

    // Closure for callback
    this.addDataset = this.addDataset.bind(this);
    this.loadFile = this.loadFile.bind(this);
    this.updateReader = this.updateReader.bind(this);
  }

  loadFile() {
    ReaderFactory.openFile(
      ['raw'].concat(ReaderFactory.listSupportedExtensions()),
      (file) => {
        ReaderFactory.loadFile(file).then(
          (reader) => {
            const source = vtkSource.newInstance();
            source.setInput(reader);
            source.setName(file.name);
            this.props.pipelineManager.addSource(source);
            this.props.pipelineManager.addSourceToViews(source.getProxyId());

            if (this.props.pipelineManager.getNumberOfSources() === 1) {
              this.props.pipelineManager.resetCameraViews();
            }
            this.setState({ file: null });
            this.props.updateTab('pipeline');
          },
          () => {
            // No reader found
            this.setState({ file });
          }
        );
      }
    );
  }

  addDataset(ds) {
    if (!ds) {
      this.setState({ file: null });
      return;
    }
    const source = vtkSource.newInstance();
    source.setDataset(ds);
    source.setName(this.state.file.name);

    this.props.pipelineManager.addSource(source);
    this.props.pipelineManager.addSourceToViews(source.getProxyId());

    if (this.props.pipelineManager.getNumberOfSources() === 1) {
      this.props.pipelineManager.resetCameraViews();
    }
    this.setState({ file: null });
    this.props.updateTab('pipeline');
  }

  updateReader(e) {
    const ext = e.target.value;
    console.log('use reader', ext);
    this.setState({ file: null });
  }

  render() {
    return (
      <div className={style.content}>
        <Button onClick={this.loadFile}>
          <Icon type="upload" /> Load local file
        </Button>
        {this.state.file ? (
          <RawReader file={this.state.file} addDataset={this.addDataset} />
        ) : null}
      </div>
    );
  }
}

FileLoader.propTypes = {
  pipelineManager: PropTypes.object,
  updateTab: PropTypes.func,
};

FileLoader.defaultProps = {
  pipelineManager: null,
  updateTab: () => {},
};
