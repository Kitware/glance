import React from 'react';
import PropTypes from 'prop-types';

import CollapsibleWidget from 'paraviewweb/src/React/Widgets/CollapsibleWidget';

import style from './Informations.mcss';

function formatNumbers(n) {
  const sections = [];
  let size = n;
  while (size > 1000) {
    sections.push(`000${size % 1000}`.slice(-3));
    size = Math.floor(size / 1000);
  }
  if (size > 0) {
    sections.push(size);
  }
  sections.reverse();
  return sections.join("'");
}

export default function PolyData(props) {
  return (
    <CollapsibleWidget title="PolyData">
      <section className={style.section}>
        <label className={style.label}>Number of points</label>
        <span className={style.value}>
          {formatNumbers(props.dataset.getPoints().getNumberOfPoints())}
        </span>
      </section>
      <section className={style.section}>
        <label className={style.label}>Number of cells</label>
        <span className={style.value}>
          {formatNumbers(props.dataset.getNumberOfCells())}
        </span>
      </section>
      <section className={style.section}>
        <label className={style.label}>Bounds</label>
      </section>
      <section className={style.section}>
        <label className={style.shortLabel}>X</label>
        <span className={style.multiValue}>{props.dataset.getBounds()[0]}</span>
        <span className={style.multiValue}>{props.dataset.getBounds()[1]}</span>
      </section>
      <section className={style.section}>
        <label className={style.shortLabel}>Y</label>
        <span className={style.multiValue}>{props.dataset.getBounds()[2]}</span>
        <span className={style.multiValue}>{props.dataset.getBounds()[3]}</span>
      </section>
      <section className={style.section}>
        <label className={style.shortLabel}>Z</label>
        <span className={style.multiValue}>{props.dataset.getBounds()[4]}</span>
        <span className={style.multiValue}>{props.dataset.getBounds()[5]}</span>
      </section>
    </CollapsibleWidget>
  );
}

PolyData.propTypes = {
  dataset: PropTypes.object,
};

PolyData.defaultProps = {
  dataset: null,
};
