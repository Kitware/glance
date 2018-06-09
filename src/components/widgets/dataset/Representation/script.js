import { FIELDS, FIELD_NAMES } from 'paraview-glance/src/components/widgets/dataset/Representation/constants';
import proxyHelpers from 'paraview-glance/src/helpers/proxy';

export default {
  inject: ['proxyManager'],
  props: ['source'],
  methods: proxyHelpers.componentMethods,
  data() {
    return proxyHelpers.dataGenerator(FIELDS);
  },
  created() {
    this.subscritions = proxyHelpers.addWatchers(this, FIELDS);
    this.subscritions.push(this.proxyManager.onProxyRegistrationChange(() => {
      this.updateDomains();
    }).unsubscribe);
  },
  beforeDestroy() {
    while(this.subscritions.length) {
      this.subscritions.pop()();
    }
  },
};
