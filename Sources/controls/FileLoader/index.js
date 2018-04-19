import React from 'react';
import PropTypes from 'prop-types';

import { toast } from 'react-toastify';

import UI from '../../ui';
import ReaderFactory from '../../io/ReaderFactory';
import RawReader from './RawReader';
import DragAndDrop from './DragAndDrop';
import Demos from './demos';

import style from './FileLoader.mcss';

const { Button, FaIcon, Messages, Progress } = UI;

export default class FileLoader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
    };

    // Closure for callback
    this.addDataset = this.addDataset.bind(this);
    this.openFile = this.openFile.bind(this);
    this.loadFiles = this.loadFiles.bind(this);
    this.updateReader = this.updateReader.bind(this);
  }

  openFile() {
    ReaderFactory.openFiles(
      ['raw'].concat(ReaderFactory.listSupportedExtensions()),
      this.loadFiles
    );
  }

  loadFiles(files) {
    Progress.setIndeterminate(true);

    ReaderFactory.loadFiles(files)
      .then((readers) => {
        Progress.setIndeterminate(false);

        ReaderFactory.registerReadersToProxyManager(
          readers,
          this.props.proxyManager
        );
        this.setState({ file: null });
        this.props.updateTab('pipeline');
      })
      .catch((error) => {
        if (error) {
          toast.error(Messages.LoadFailure);
        }
        // No reader found
        if (files.length === 1) {
          this.setState({ file: files[0] });
        } else {
          this.setState({ file: null });
        }
      });
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

  openRemoteDataset(name, url) {
    const progressId = `url-${name}`;

    const progressCallback = (event) => {
      const progressPercent = Math.round(100 * event.loaded / event.total);
      Progress.setPercent(progressId, progressPercent);
    };

    Progress.start(progressId, `Downloading ${name}...`);
    ReaderFactory.downloadDataset(name, url, progressCallback)
      .then(({ reader, sourceType }) => {
        ReaderFactory.registerReadersToProxyManager(
          [{ reader, name, sourceType }],
          this.props.proxyManager
        );
        Progress.end(progressId);
        this.props.updateTab('pipeline');
      })
      .catch((error) => {
        Progress.end(progressId);
        console.error(error);
      });
  }

  render() {
    const demos = Demos.map((demo) => (
      <div
        key={demo.name}
        className={style.demo}
        onClick={() => this.openRemoteDataset(demo.name, demo.url)}
      >
        <img
          className={style.demoImage}
          src={demo.image}
          alt={`${demo.name} Demo`}
        />
        <div className={style.demoText}>{demo.name}</div>
      </div>
    ));

    return (
      <div className={style.content}>
        <Button onClick={this.openFile} style={{ flex: '0 0 100%' }}>
          <FaIcon type="upload" style={{ paddingRight: '10px' }} />
          Load or drop file
        </Button>
        <label className={style.supportedFiles}>
          {ReaderFactory.listSupportedExtensions()
            .map((ext) => `*.${ext}`)
            .join(', ')}
        </label>
        {this.state.file ? (
          <RawReader file={this.state.file} addDataset={this.addDataset} />
        ) : null}
        <div className={style.title}>Sample data</div>
        <div className={style.demoData}>{demos}</div>
        <DragAndDrop target=".paraview-glance-root" onDrop={this.loadFiles} />
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
