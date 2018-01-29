import React from 'react';
import PropTypes from 'prop-types';

import GitTreeWidget from 'paraviewweb/src/React/Widgets/GitTreeWidget';
import ProxyEditorWidget from 'paraviewweb/src/React/Widgets/ProxyEditorWidget';

import style from '../../pv-explorer.mcss';

function convertSourcesToPipelineItems(sources) {
  return sources.map((source) => {
    const view = source.getProxyManager().getActiveView();
    const visible = view
      ? source
          .getProxyManager()
          .getRepresentation(source, view)
          .isVisible()
      : false;
    const parent = source.getInputProxy()
      ? source.getInputProxy().getProxyId()
      : '0';
    return {
      name: source.getName(),
      type: source.getType(),
      id: source.getProxyId(),
      parent,
      visible,
    };
  });
}

export default function StatelessPipelineEditor(props) {
  return (
    <div className={style.leftPaneContent}>
      <div className={style.pipeline}>
        <GitTreeWidget
          nodes={convertSourcesToPipelineItems(props.proxyManager.getSources())}
          actives={props.actives}
          onChange={props.onGitChange}
          width={props.width}
          enableDelete
        />
      </div>
      <ProxyEditorWidget
        sections={props.proxyManager.getSections()}
        onCollapseChange={props.proxyManager.updateCollapseState}
        onApply={props.onApply}
        autoApply
      />
    </div>
  );
}

StatelessPipelineEditor.propTypes = {
  proxyManager: PropTypes.object,
  actives: PropTypes.array,
  width: PropTypes.number,
  onGitChange: PropTypes.func,
  onApply: PropTypes.func,
};

StatelessPipelineEditor.defaultProps = {
  proxyManager: null,
  actives: [],
  width: 290,
  onGitChange: () => {},
  onApply: () => {},
};
