import React from 'react';
import PropTypes from 'prop-types';

import GitTreeWidget from 'paraviewweb/src/React/Widgets/GitTreeWidget';
import ProxyEditorWidget from 'paraviewweb/src/React/Widgets/ProxyEditorWidget';

import ColorBy from './ColorBy';

import style from '../../pv-explorer.mcss';

export default function PipelineEditor(props) {
  return (
    <div className={style.leftPaneContent}>
      <div className={style.pipeline}>
        <GitTreeWidget
          nodes={props.pipelineManager.listSources()}
          actives={props.actives}
          onChange={props.onGitChange}
          width={props.width}
          enableDelete
        />
      </div>
      <ProxyEditorWidget
        sections={props.pipelineManager.getSections()}
        onCollapseChange={props.pipelineManager.updateCollapseState}
        onApply={props.onApply}
        autoApply
      >
        <ColorBy pipelineManager={props.pipelineManager} />
      </ProxyEditorWidget>
    </div>
  );
}

PipelineEditor.propTypes = {
  pipelineManager: PropTypes.object,
  actives: PropTypes.array,
  width: PropTypes.number,
  onGitChange: PropTypes.func,
  onApply: PropTypes.func,
};

PipelineEditor.defaultProps = {
  pipelineManager: null,
  actives: [],
  width: 300,
  onGitChange: () => {},
  onApply: () => {},
};
