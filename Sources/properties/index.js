import React from 'react';
import PropertyFactory from 'paraviewweb/src/React/Properties/PropertyFactory';

import ColorProperty from './ColorProperty';

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
