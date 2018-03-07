import React from 'react';
import PropTypes from 'prop-types';

import StatelessPipelineEditor from './Stateless';

export default class PipelineEditor extends React.Component {
  constructor(props) {
    super(props);

    // Closure for callback
    this.onGitChange = this.onGitChange.bind(this);
    this.onApply = this.onApply.bind(this);
    this.flush = () => this.forceUpdate();

    this.subscriptions = [props.proxyManager.onModified(this.flush)];
  }

  componentWillUnmount() {
    while (this.subscriptions.length) {
      this.subscriptions.pop().unsubscribe();
    }
  }

  onGitChange(e) {
    const { id } = e.changeSet[0];
    const source = this.props.proxyManager.getProxyById(id);
    if (e.type === 'visibility') {
      const { visible } = e.changeSet[0];
      const view = this.props.proxyManager.getActiveView();
      const rep = this.props.proxyManager.getRepresentation(source, view);
      rep.setVisibility(visible);
    } else if (e.type === 'delete') {
      this.props.proxyManager.deleteProxy(source);
    } else if (e.type === 'active') {
      this.props.proxyManager.setActiveSource(source);
    }
    this.props.proxyManager.renderAllViews();
    setTimeout(this.flush, 0);
  }

  onApply(e) {
    this.props.proxyManager.applyChanges(e);
    setTimeout(this.flush, 0);
  }

  render() {
    const activeSource = this.props.proxyManager.getActiveSource();
    const actives = activeSource ? [activeSource.getProxyId()] : [];
    return (
      <StatelessPipelineEditor
        proxyManager={this.props.proxyManager}
        actives={actives}
        onGitChange={this.onGitChange}
        onApply={this.onApply}
      />
    );
  }
}

PipelineEditor.propTypes = {
  proxyManager: PropTypes.object.isRequired,
};

PipelineEditor.defaultProps = {};
