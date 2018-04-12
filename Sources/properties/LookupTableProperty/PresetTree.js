import React from 'react';
import PropTypes from 'prop-types';

import 'rc-tree-select/assets/index.css';
import TreeSelect from 'rc-tree-select';

import style from './LookupTableProperty.mcss';

function caseInsensitiveFilter(input, treeNode) {
  const cmp1 = treeNode.props.title.toLowerCase();
  const cmp2 = input.toLowerCase();
  return cmp1.indexOf(cmp2) >= 0;
}

function PresetTree(props) {
  const loop = (data) =>
    data.map((item) => ({
      value: item.Name,
      label: item.Name,
      selectable: !item.Category,
      children: item.Category ? loop(item.Children) : [],
    }));
  return (
    <div className={style.treeContainer}>
      <TreeSelect
        showSearch
        treeLine
        className={style.tree}
        style={{
          backgroundImage: `url(${props.background})`,
        }}
        dropdownClassName={style.treeDropdown}
        treeData={loop(props.colormaps)}
        treeNodeLabelProp="EmptyLabel"
        filterTreeNode={caseInsensitiveFilter}
        onSelect={props.onSelect}
      />
    </div>
  );
}

PresetTree.propTypes = {
  colormaps: PropTypes.array,
  background: PropTypes.string,
  onSelect: PropTypes.func,
};

PresetTree.defaultProps = {
  colormaps: [],
  background: '',
  onSelect: () => {},
};

export default PresetTree;
