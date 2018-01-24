import React from 'react';
import PropTypes from 'prop-types';

import { Button, Icon } from 'antd';

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
    ReaderFactory.openFiles(
      ['raw'].concat(ReaderFactory.listSupportedExtensions()),
      (files) => {
        ReaderFactory.loadFiles(files).then(
          (readers) => {
            for (let i = 0; i < readers.length; i++) {
              const { reader, sourceType, name } = readers[i];
              if (reader) {
                const source = this.props.proxyManager.createProxy(
                  'Sources',
                  'TrivialProducer',
                  { name }
                );
                source.setInputAlgorithm(reader, sourceType);
                this.props.proxyManager.createRepresentationInAllViews(source);
                this.props.proxyManager.renderAllViews();
              }
            }
            this.setState({ file: null });
            this.props.updateTab('pipeline');
          },
          () => {
            // No reader found
            if (files.length === 1) {
              this.setState({ file: files[0] });
            } else {
              this.setState({ file: null });
            }
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
    const source = this.props.proxyManager.createProxy(
      'Sources',
      'TrivialProducer',
      { name: this.state.file.name }
    );
    source.setInputData(ds);

    this.props.proxyManager.createRepresentationInAllViews(source);
    this.props.proxyManager.renderAllViews();
    this.setState({ file: null });
    this.props.updateTab('pipeline');
  }

  updateReader(e) {
    this.setState({ file: null });
  }

  render() {
    return (
      <div className={style.content}>
        <Button onClick={this.loadFile}>
          <Icon type="upload" /> Load local file
        </Button>
        <label className={style.supportedFiles}>
          {ReaderFactory.listSupportedExtensions()
            .map((ext) => `*.${ext}`)
            .join(', ')}
        </label>
        {this.state.file ? (
          <RawReader file={this.state.file} addDataset={this.addDataset} />
        ) : null}
      </div>
    );
  }
}

FileLoader.propTypes = {
  proxyManager: PropTypes.object,
  updateTab: PropTypes.func,
};

FileLoader.defaultProps = {
  proxyManager: null,
  updateTab: () => {},
};
