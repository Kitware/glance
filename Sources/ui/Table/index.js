import React from 'react';
import PropTypes from 'prop-types';

import style from './Table.mcss';

function onResize(ev) {
  ev.stopPropagation();

  const th = ev.target.parentNode;
  // table > thead > tr > th
  const table = th.parentNode.parentNode.parentNode;
  const tableWidth = parseInt(getComputedStyle(table).width, 10);
  const thWidth = parseInt(getComputedStyle(th).width, 10);
  const startX = ev.pageX;

  function onMouseMove(e) {
    e.stopPropagation();
    const delta = e.pageX - startX;
    const newThWidth = Math.max(thWidth + delta, 3);
    const newTableWidth = tableWidth + delta;

    th.style.width = `${newThWidth}px`;
    // Update table width to get scrolling if table overflows wrapper
    table.style.width = `${newTableWidth}px`;
  }

  function onMouseUp(e) {
    e.stopPropagation();
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
}

/**
 * Column spec:
 *  {
 *    key: unique ID for this column
 *    dataKey: key refers to the property per datum
 *    label: any renderable
 *    resizable: is column resizable
 *    render: func(colValue, rowRecord)
 *    columnClass: classname to apply to all cells in a column (incl header)
 *  }
 */

function Table(props) {
  const header = props.columns.map((col) => {
    let resizeHandle = null;
    if (col.resizable) {
      resizeHandle = (
        <div
          className={style.resizeHandle}
          style={{
            right: -Math.floor(props.resizeHandleWidth / 2),
            width: props.resizeHandleWidth,
          }}
          onMouseDown={onResize}
        />
      );
    }

    return (
      <th key={col.key} className={col.columnClass}>
        <div className={style.headerCell}>{col.label}</div>
        {resizeHandle}
      </th>
    );
  });

  const rows = props.data.map((item) => {
    const cells = props.columns.map((col) => {
      const value = item[col.dataKey];
      const content = col.render ? col.render(value, item) : value;
      const reactKey = `${col.dataKey}::${item.key}`;

      return (
        <td key={reactKey} className={col.columnClass}>
          {content}
        </td>
      );
    });

    return <tr key={item.key}>{cells}</tr>;
  });

  return (
    <div className={`${style.wrapper} ${props.className}`}>
      <table className={style.table}>
        <thead>
          <tr>{header}</tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
}

Table.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  resizeHandleWidth: PropTypes.number,
  className: PropTypes.string,
};

Table.defaultProps = {
  columns: [],
  data: [],
  resizeHandleWidth: 24, // px
  className: '',
};

export default Table;
