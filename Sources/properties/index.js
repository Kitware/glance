import React from 'react';
import PropertyFactory from 'paraviewweb/src/React/Properties/PropertyFactory';

import ColorByProperty from './ColorByProperty';
import ColorProperty from './ColorProperty';
import ExecuteProperty from './ExecuteProperty';
import LookupTableProperty from './LookupTableProperty';
import PiecewiseFunctionProperty from './PiecewiseFunctionProperty';

PropertyFactory.updateWidgetMapping('Color', (prop, viewData, onChange) => (
  <ColorProperty
    key={prop.data.id}
    data={prop.data}
    ui={prop.ui}
    viewData={viewData}
    show={prop.show}
    onChange={onChange || prop.onChange}
  />
));

PropertyFactory.updateWidgetMapping('ColorBy', (prop, viewData, onChange) => (
  <ColorByProperty
    key={prop.data.id}
    data={prop.data}
    ui={prop.ui}
    viewData={viewData}
    show={prop.show}
    onChange={onChange || prop.onChange}
  />
));

PropertyFactory.updateWidgetMapping(
  'LookupTableProperty',
  (prop, viewData, onChange) => (
    <LookupTableProperty
      key={prop.data.id}
      data={prop.data}
      ui={prop.ui}
      viewData={viewData}
      show={prop.show}
      onChange={onChange || prop.onChange}
    />
  )
);

PropertyFactory.updateWidgetMapping(
  'PiecewiseFunctionProperty',
  (prop, viewData, onChange) => (
    <PiecewiseFunctionProperty
      key={prop.data.id}
      data={prop.data}
      ui={prop.ui}
      viewData={viewData}
      show={prop.show}
      onChange={onChange || prop.onChange}
    />
  )
);

PropertyFactory.updateWidgetMapping(
  'ExecuteProperty',
  (prop, viewData, onChange) => (
    <ExecuteProperty
      key={prop.data.id}
      data={prop.data}
      ui={prop.ui}
      viewData={viewData}
      show={prop.show}
      onChange={onChange || prop.onChange}
    />
  )
);
