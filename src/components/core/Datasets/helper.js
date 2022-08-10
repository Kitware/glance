import { mapState } from 'vuex';
import macro from '@kitware/vtk.js/macro';

const MAX_SLIDER_STEPS = 500;

// ----------------------------------------------------------------------------
// Global standalone methods
// ----------------------------------------------------------------------------

/* eslint-disable no-param-reassign */
function extractDomains(domains, uiList) {
  for (let i = 0; i < uiList.length; i++) {
    const { name } = uiList[i];
    if (name && uiList[i].domain) {
      const { domain } = uiList[i];
      domains[name] = { ...domain };
      if (domain.step && domain.step === 'any') {
        if (Number.isInteger(domain.min) && Number.isInteger(domain.max)) {
          domains[name].step = 0.01;
        } else {
          domains[name].step = (domain.max - domain.min) / MAX_SLIDER_STEPS;
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

  // Look on source
  const source = self.$proxyManager.getProxyById(self.sourceId);
  if (source[methodName]) {
    proxies.push(source);
  }

  // Look on the representations
  const myRepresentations = self.$proxyManager
    .getRepresentations()
    .filter((r) => r.getInput() === self.source);
  for (let i = 0; i < myRepresentations.length; i++) {
    const representation = myRepresentations[i];
    if (representation[methodName]) {
      proxies.push(representation);
    }
  }

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

function addWatchers(vm, fields, onChange) {
  const subscriptions = [];
  for (let i = 0; i < fields.length; i++) {
    const { name } = fields[i];
    subscriptions.push(
      vm.$watch(name, (newValue) => {
        vm.updateProxies(name, newValue, onChange && onChange[name]);
      })
    );
  }
  return subscriptions;
}

// ----------------------------------------------------------------------------
// Factory
// ----------------------------------------------------------------------------

function generateComponent(
  name,
  fields,
  dependOnLayout = false,
  options = {
    onChange: {},
    onUpdate: [],
  }
) {
  const computed = computedGenerator(fields);
  const extraMethods = {};
  // TODO is this used?
  Object.keys(computed).forEach((prop) => {
    extraMethods[`get${macro.capitalize(prop)}`] = computed[prop].get;
    extraMethods[`set${macro.capitalize(prop)}`] = computed[prop].set;
  });

  return {
    name,
    props: ['sourceId'],
    data() {
      return dataGenerator(fields);
    },
    computed: {
      ...computed,
      ...mapState('views', {
        viewOrder: (state) => state.viewOrder,
      }),
      source() {
        return this.$proxyManager.getProxyById(this.sourceId);
      },
    },
    watch: {
      viewOrder() {
        if (dependOnLayout) {
          this.$nextTick(this.$forceUpdate);
        }
      },
    },
    proxyManagerHooks: {
      onProxyModified(proxy) {
        if (
          proxy.isA('vtkAbstractRepresentationProxy') &&
          proxy.getInput() &&
          proxy.getInput() === this.source
        ) {
          this.updateData();
        }
      },
      onProxyCreated(info) {
        const { proxyGroup, proxy } = info;
        if (
          proxyGroup === 'Representations' &&
          proxy.getInput() === this.source
        ) {
          this.updateAll();
        }
      },
    },
    created() {
      this.subscriptions = addWatchers(this, fields, options.onChange);
    },
    mounted() {
      this.updateAll();
    },
    beforeDestroy() {
      while (this.subscriptions.length) {
        this.subscriptions.pop()();
      }
    },
    methods: {
      ...extraMethods,
      updateAll() {
        this.updateDomains();
        this.updateData();
        if (options.onUpdate) {
          for (let i = 0; i < options.onUpdate.length; i++) {
            this[options.onUpdate[i]]();
          }
        }
      },
      updateDomains() {
        if (this.inUpdateDomains) {
          return;
        }

        this.inUpdateDomains = true;
        const myRepresentations = this.$proxyManager
          .getRepresentations()
          .filter((r) => r.getInput() === this.source);

        const objs = [this.$proxyManager.getProxyById(this.sourceId)].concat(
          myRepresentations
        );
        const myDomains = {};
        while (objs.length) {
          const uiList = objs.pop().getReferenceByName('ui');
          extractDomains(myDomains, uiList);
        }
        this.inUpdateDomains = false;
        this.domains = myDomains;
      },
      updateData() {
        if (this.inUpdateData) {
          return;
        }
        this.inUpdateData = true;

        for (let i = 0; i < this.fields.length; i++) {
          const { name: fieldName } = this.fields[i];
          const methodName = `get${macro.capitalize(fieldName)}`;
          const proxies = findProxiesWithMethod(this, methodName);
          if (proxies.length) {
            const newValue = proxies[0][methodName]();
            if (this[fieldName] !== newValue) {
              this[fieldName] = newValue;
            }
          }
        }
        this.inUpdateData = false;
      },
      updateProxies(fieldName, value, onChange) {
        const methodName = `set${macro.capitalize(fieldName)}`;
        const proxies = findProxiesWithMethod(this, methodName);
        let changeDetected = !proxies.length;

        while (proxies.length) {
          changeDetected = proxies.pop()[methodName](value) || changeDetected;
        }
        if (changeDetected && onChange && this[onChange]) {
          this[onChange](fieldName, value);
        }
      },
    },
  };
}

// ----------------------------------------------------------------------------

export default {
  generateComponent,
  findProxiesWithMethod,
};
