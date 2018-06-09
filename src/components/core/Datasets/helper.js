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
    return self.source[methodName];
  }

  // Look in the views
  const allViews = self.proxyManager.getViews();
  for (let i = 0; i < allViews.length; i++) {
    const view = allViews[i];
    if (view[methodName]) {
      return view[methodName];
    }
  }

  // Look on the representations
  const myRepresentations = allViews.map((v) =>
    self.proxyManager.getRepresentation(self.source, v)
  );
  for (let i = 0; i < myRepresentations.length; i++) {
    const representation = myRepresentations[i];
    if (representation[methodName]) {
      return representation[methodName];
    }
  }

  // Not found
  return null;
}

// ----------------------------------------------------------------------------

function dataGenerator(fields) {
  const data = { fields, domains: {} };
  for (let i = 0; i < fields.length; i++) {
    const { name, initialValue } = fields[i];
    data[name] = initialValue;
  }
  return data;
}

// ----------------------------------------------------------------------------

function proxyUpdated(fieldName, value) {
  const methodName = `set${macro.capitalize(fieldName)}`;
  const setter = findProxyWithMethod(this, methodName);
  if (setter) {
    console.log('proxyUpdated', this.source.getName(), methodName, value);
    setter(value);
  } else {
    console.log('could not find proxy for fieldName', fieldName);
  }
}

// ----------------------------------------------------------------------------

export function addWatchers(instance, fields) {
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
  console.log('updateDomains', this.source.getName());
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

function updateData() {
  if (this.inUpdateData) {
    return;
  }
  this.inUpdateData = true;
  console.log('updateData', this.source.getName());
  for (let i = 0; i < this.fields.length; i++) {
    const { name } = this.fields[i];
    const methodName = `get${macro.capitalize(name)}`;
    const getter = findProxyWithMethod(this, methodName);
    if (getter) {
      const newValue = getter();
      if (this[name] !== newValue) {
        console.log(` - ${name}: ${newValue}`);
        this[name] = newValue;
      }
    }
  }
  this.inUpdateData = false;
}

// ----------------------------------------------------------------------------
// Factory
// ----------------------------------------------------------------------------

function generateComponent(fields) {
  return {
    inject: ['proxyManager'],
    props: ['source'],
    methods: {
      updateDomains,
      updateData,
    },
    data: function data() {
      return dataGenerator(fields);
    },
    created() {
      this.subscritions = addWatchers(this, fields);
      this.subscritions.push(
        this.proxyManager.onProxyRegistrationChange(() => {
          this.updateDomains();
          this.updateData();
        }).unsubscribe
      );
    },
    mounted() {
      this.updateDomains();
      this.updateData();
    },
    beforeDestroy() {
      while (this.subscritions.length) {
        this.subscritions.pop()();
      }
    },
  };
}

// ----------------------------------------------------------------------------

export default {
  generateComponent,
};
