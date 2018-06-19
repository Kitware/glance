import macro from 'vtk.js/Sources/macro';
import vtkListenerHelper from 'paraview-glance/src/ListenerHelper';
import { Events } from 'paraview-glance/src/constants';

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

function findProxiesWithMethod(self, methodName) {
  const proxies = [];
  // Look on the source
  if (self.source[methodName]) {
    proxies.push(self.source);
  }

  // Look in the views
  const allViews = self.proxyManager.getViews();
  for (let i = 0; i < allViews.length; i++) {
    const view = allViews[i];
    if (view[methodName]) {
      proxies.push(view);
    }
  }

  // Look on the representations
  const myRepresentations = self.proxyManager
    .getRepresentations()
    .filter((r) => r.getInput() === self.source);
  for (let i = 0; i < myRepresentations.length; i++) {
    const representation = myRepresentations[i];
    if (representation[methodName]) {
      proxies.push(representation);
    }
  }

  // Not found
  // console.log(`found ${proxies.length} functions for ${methodName}`);
  return proxies;
}

// ----------------------------------------------------------------------------

function dataGenerator(fields) {
  const data = { fields, domains: {} };
  for (let i = 0; i < fields.length; i++) {
    const { name, initialValue, computed } = fields[i];
    if (!computed) {
      data[name] = initialValue;
    }
  }
  return data;
}

// ----------------------------------------------------------------------------

function computedGenerator(fields) {
  const computedMethods = {};
  for (let i = 0; i < fields.length; i++) {
    const { name, computed } = fields[i];
    if (computed) {
      computedMethods[name] = computed;
    }
  }
  return computedMethods;
}
// ----------------------------------------------------------------------------

function proxyUpdated(fieldName, onChange, value) {
  const methodName = `set${macro.capitalize(fieldName)}`;
  const proxies = findProxiesWithMethod(this, methodName);
  let changeDetected = !proxies.length;
  // console.log(
  //   `proxyUpdated (x${
  //     proxies.length
  //   }) ${this.source.getName()}.${methodName}(${value})`
  // );
  while (proxies.length) {
    changeDetected = proxies.pop()[methodName](value) || changeDetected;
  }
  if (changeDetected && onChange && this[onChange]) {
    this[onChange](fieldName, value);
  }
}

// ----------------------------------------------------------------------------

export function addWatchers(instance, fields, onChange) {
  const subscriptions = [];
  for (let i = 0; i < fields.length; i++) {
    const { name } = fields[i];
    subscriptions.push(
      instance.$watch(
        name,
        proxyUpdated.bind(instance, name, onChange && onChange[name])
      )
    );
  }
  return subscriptions;
}

// ----------------------------------------------------------------------------
// Generic component methods
// ----------------------------------------------------------------------------

function updateDomains() {
  if (this.inUpdateDomains) {
    return;
  }
  // console.log(
  //   'updateDomains',
  //   this.source.getName(),
  //   '- views:',
  //   this.proxyManager.getViews().length
  // );
  this.inUpdateDomains = true;
  const allViews = this.proxyManager.getViews();
  const myRepresentations = this.proxyManager
    .getRepresentations()
    .filter((r) => r.getInput() === this.source);

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
  // console.log('updateData', this.source.getName());
  for (let i = 0; i < this.fields.length; i++) {
    const { name } = this.fields[i];
    const methodName = `get${macro.capitalize(name)}`;
    const proxies = findProxiesWithMethod(this, methodName);
    if (proxies.length) {
      const newValue = proxies[0][methodName]();
      if (this[name] !== newValue) {
        // console.log(` - ${name}: ${newValue}`);
        this[name] = newValue;
      }
    }
  }
  this.inUpdateData = false;
}

// ----------------------------------------------------------------------------

function getProxyWithFields() {
  const allProxies = new Set();
  for (let i = 0; i < this.fields.length; i++) {
    const { name } = this.fields[i];
    const methodName = `get${macro.capitalize(name)}`;
    const proxies = findProxiesWithMethod(this, methodName);
    proxies.forEach((p) => allProxies.add(p));
  }
  return Array.from(allProxies);
}

// ----------------------------------------------------------------------------
// Factory
// ----------------------------------------------------------------------------

function generateComponent(
  fields,
  dependOnLayout = false,
  options = {
    onChange: {},
    onUpdate: [],
  }
) {
  const computed = computedGenerator(fields);
  const methods = {
    updateDomains,
    updateData,
    getProxyWithFields,
  };
  Object.keys(computed).forEach((name) => {
    methods[`get${macro.capitalize(name)}`] = computed[name].get;
    methods[`set${macro.capitalize(name)}`] = computed[name].set;
  });
  return {
    inject: ['proxyManager'],
    props: ['source'],
    methods,
    data: function data() {
      return dataGenerator(fields);
    },
    computed,
    created() {
      this.listenerHelper = vtkListenerHelper.newInstance(
        () => {
          this.updateData();
          this.$nextTick(this.$forceUpdate);
        },
        () => this.getProxyWithFields()
      );

      this.subscriptions = addWatchers(this, fields, options.onChange);
      this.subscriptions.push(
        this.proxyManager.onProxyRegistrationChange(() => {
          this.updateDomains();
          this.updateData();
          if (options.onUpdate) {
            for (let i = 0; i < options.onUpdate.length; i++) {
              this[options.onUpdate[i]]();
            }
          }
          this.listenerHelper.resetListeners();
        }).unsubscribe
      );
    },
    mounted() {
      this.updateDomains();
      this.updateData();
      if (options.onUpdate) {
        for (let i = 0; i < options.onUpdate.length; i++) {
          this[options.onUpdate[i]]();
        }
      }
      if (dependOnLayout) {
        this.$globalBus.$on(Events.LAYOUT_CHANGE, () => {
          this.$nextTick(this.$forceUpdate);
        });
      }
    },
    beforeDestroy() {
      this.listenerHelper.removeListeners();
      if (dependOnLayout) {
        this.$globalBus.$off(Events.LAYOUT_CHANGE, this.$forceUpdate);
      }
      while (this.subscriptions.length) {
        this.subscriptions.pop()();
      }
    },
  };
}

// ----------------------------------------------------------------------------

export default {
  generateComponent,
  findProxiesWithMethod,
};
