import React from 'react';
import PropTypes from 'prop-types';

import UI from '../../ui';

import style from './Filters.mcss';

const { Menu } = UI;

export default class Filters extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filterMap: props.proxyManager.getProxyConfiguration().filters,
      filters: [],
    };

    // Closure for callback
    this.onClick = this.onClick.bind(this);
    this.updateActiveSource = this.updateActiveSource.bind(this);
  }

  componentWillMount() {
    this.subscription = this.props.proxyManager.onActiveSourceChange(
      this.updateActiveSource
    );
    this.updateActiveSource();
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
    if (this.sourceSubscription) {
      this.sourceSubscription.unsubscribe();
      this.sourceSubscription = null;
    }
  }

  onClick(key) {
    const inputProxy = this.props.proxyManager.getActiveSource();
    if (inputProxy) {
      const filter = this.props.proxyManager.createProxy('Sources', key, {
        inputProxy,
        name: key,
      });
      this.props.proxyManager.setActiveSource(filter);
      this.props.proxyManager.createRepresentationInAllViews(filter);
      this.props.proxyManager.renderAllViews();
      this.props.updateTab('pipeline');
    }
  }

  updateActiveSource() {
    if (this.sourceSubscription) {
      this.sourceSubscription.unsubscribe();
      this.sourceSubscription = null;
    }
    const activeSource = this.props.proxyManager.getActiveSource();
    const activeType = activeSource ? activeSource.getType() : '';
    const filters = this.state.filterMap[activeType] || [];
    if (activeSource) {
      this.sourceSubscription = activeSource.onModified(
        this.updateActiveSource
      );
    }
    this.setState({ filters });
  }

  render() {
    return (
      <Menu onSelect={this.onClick} selectable={false}>
        {this.state.filters.map((name) => (
          <Menu.Item className={style.filterItem} key={name}>
            {name}
          </Menu.Item>
        ))}
      </Menu>
    );
  }
}

Filters.propTypes = {
  proxyManager: PropTypes.object.isRequired,
  updateTab: PropTypes.func,
};

Filters.defaultProps = {
  updateTab: () => {},
};
