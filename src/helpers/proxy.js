import macro from 'vtk.js/Sources/macro';

const MAX_SLIDER_STEPS = 500;

// ----------------------------------------------------------------------------
// Global standalone methods
// ----------------------------------------------------------------------------

/* eslint-disable no-param-reassign */
function extractDomains(domains, uiList) {
  for (let i = 0; i < uiList.length; i++) {
    if (uiList[i].name && uiList[i].domain) {
      const { domain } = uiList[i];
      domains[uiList[i].name] = Object.assign({}, domain);
      if (domain.step && domain.step === 'any') {
        if (Number.isInteger(domain.min) && Number.isInteger(domain.max)) {
          domains[uiList[i].name].step = 1;
        } else {
          domains[uiList[i].name].step =
            (domain.max - domain.min) / MAX_SLIDER_STEPS;
        }
      }
    } else if (uiList[i].children) {
      extractDomains(domains, uiList[i].children);
    }
  }
}
/* eslint-enable no-param-reassign */

// ----------------------------------------------------------------------------

function findProxyWithMethod(self, methodName) {
  // Look on the source
  if (self.source[methodName]) {
    return self.source;
  }

  // Look in the views
  const allViews = self.proxyManager.getViews();
  for (let i = 0; i < allViews.length; i++) {
    const view = allViews[i];
    if (view[methodName]) {
      return view;
    }
  }

  // Look on the representations
  const myRepresentations = allViews.map((v) =>
    self.proxyManager.getRepresentation(self.source, v)
  );
  for (let i = 0; i < myRepresentations.length; i++) {
    const representation = myRepresentations[i];
    if (representation[methodName]) {
      return representation;
    }
  }

  // Not found
  return null;
}

// ----------------------------------------------------------------------------

function dataGenerator(fields) {
  const data = { domains: {} };
  for (let i = 0; i < fields.length; i++) {
    const { name, initialValue } = fields[i];
    data[name] = initialValue;
  }
  return data;
}

// ----------------------------------------------------------------------------

function proxyUpdated(fieldName, value) {
  const methodName = `set${macro.capitalize(fieldName)}`;
  const proxyToUpdate = findProxyWithMethod(this, methodName);
  if (proxyToUpdate) {
    proxyToUpdate[methodName](value);
  } else {
    console.log('could not find proxy for fieldName', fieldName);
  }
}

// ----------------------------------------------------------------------------

function addWatchers(instance, fields) {
  const subscritions = [];
  for (let i = 0; i < fields.length; i++) {
    const { name } = fields[i];
    subscritions.push(instance.$watch(name, proxyUpdated.bind(instance, name)));
  }
  return subscritions;
}

// ----------------------------------------------------------------------------
// Generic component methods
// ----------------------------------------------------------------------------

function updateDomains() {
  if (this.inUpdateDomains) {
    return;
  }
  this.inUpdateDomains = true;
  const allViews = this.proxyManager.getViews();
  const myRepresentations = allViews.map((v) =>
    this.proxyManager.getRepresentation(this.source, v)
  );
  const myDomains = {};
  const objectsToControls = [this.source].concat(myRepresentations, allViews);
  while (objectsToControls.length) {
    const uiList = objectsToControls.pop().getReferenceByName('ui');
    extractDomains(myDomains, uiList);
  }
  this.inUpdateDomains = false;
  this.domains = myDomains;
}

// ----------------------------------------------------------------------------

export default {
  componentMethods: {
    updateDomains,
  },
  dataGenerator,
  addWatchers,
};
