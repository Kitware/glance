import { Events } from 'paraview-glance/src/constants';

function onMounted() {
  this.$eventBus.$on(Events.MSG_INFO, this.showInfo);
  this.$eventBus.$on(Events.MSG_ERROR, this.showError);
}

function onBeforeDestroy() {
  this.$eventBus.$off(Events.MSG_INFO, this.showInfo);
  this.$eventBus.$off(Events.MSG_ERROR, this.showError);
}

function showError(msg) {
  console.log(msg);
  this.show('error', msg);
}

function showInfo(msg) {
  this.show('info', msg);
}

function show(color, msg) {
  this.color = color;
  this.text = msg;
  this.snackbar = true;
}

const Notification = {
  data: () => ({
    snackbar: false,
    text: '',
    color: 'info',
  }),
  mounted() {
    this.$nextTick(this.onMounted);
  },
  beforeDestroy() {
    this.onBeforeDestroy();
  },
  methods: {
    onMounted,
    onBeforeDestroy,
    showError,
    showInfo,
    show,
  },
};

export default Notification;
