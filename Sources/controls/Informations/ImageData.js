import React from 'react';
import PropTypes from 'prop-types';

import CollapsibleWidget from 'paraviewweb/src/React/Widgets/CollapsibleWidget';

import style from './Informations.mcss';

export default function ImageData(props) {
  return (
    <CollapsibleWidget title="ImageData">
      <section className={style.section}>
        <label className={style.label}>Origin</label>
        <span className={style.value}>
          {props.dataset.getOrigin().join(' ')}
        </span>
      </section>
      <section className={style.section}>
        <label className={style.label}>Dimensions</label>
        <span className={style.value}>
          {props.dataset.getDimensions().join(' x ')}
        </span>
      </section>
      <section className={style.section}>
        <label className={style.label}>Spacing</label>
        <span className={style.value}>
          {props.dataset.getSpacing().join(' ')}
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
      <section className={style.section}>
        <label className={style.label}>Direction</label>
      </section>
      <section className={style.section}>
        <span className={style.multiValue}>
          {props.dataset.getDirection()[0]}
        </span>
        <span className={style.multiValue}>
          {props.dataset.getDirection()[1]}
        </span>
        <span className={style.multiValue}>
          {props.dataset.getDirection()[2]}
        </span>
      </section>
      <section className={style.section}>
        <span className={style.multiValue}>
          {props.dataset.getDirection()[3]}
        </span>
        <span className={style.multiValue}>
          {props.dataset.getDirection()[4]}
        </span>
        <span className={style.multiValue}>
          {props.dataset.getDirection()[5]}
        </span>
      </section>
      <section className={style.section}>
        <span className={style.multiValue}>
          {props.dataset.getDirection()[6]}
        </span>
        <span className={style.multiValue}>
          {props.dataset.getDirection()[7]}
        </span>
        <span className={style.multiValue}>
          {props.dataset.getDirection()[8]}
        </span>
      </section>
    </CollapsibleWidget>
  );
}

ImageData.propTypes = {
  dataset: PropTypes.object,
};

ImageData.defaultProps = {
  dataset: null,
};
