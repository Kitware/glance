import React from 'react';
import PropTypes from 'prop-types';

import style from './Menu.mcss';

function MenuItem(props) {
  const classes = [style.menuItem, props.className];
  if (props.active) {
    classes.push(style.itemActive);
  }
  return (
    <li
      className={classes.join(' ')}
      onClick={props.onClick}
      style={props.style}
    >
      {props.children}
    </li>
  );
}

MenuItem.propTypes = {
  active: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.any,
  onClick: PropTypes.func,
};

MenuItem.defaultProps = {
  active: false,
  className: '',
  style: {},
  children: [],
  onClick: () => {},
};

function Menu(props) {
  const classes = [
    style.menu,
    props.horizontal ? style.horizontal : style.vertical,
    props.className,
  ];

  const children = props.children.map((comp) =>
    React.cloneElement(
      comp,
      Object.assign({}, comp.props, {
        active: props.selectedKey === comp.key,
        onClick: props.onSelect.bind(null, comp.key),
      })
    )
  );

  return (
    <ul
      className={classes.join(' ')}
      role="menu"
      tabIndex="0"
      style={props.style}
    >
      {children}
    </ul>
  );
}

Menu.Item = MenuItem;

Menu.propTypes = {
  selectedKey: PropTypes.any,
  horizontal: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.any,
  onSelect: PropTypes.func,
};

Menu.defaultProps = {
  selectedKey: null,
  horizontal: false,
  className: '',
  style: {},
  children: [],
  onSelect: () => {},
};

export default Menu;
