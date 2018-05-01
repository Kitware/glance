import EventManager from './EventManager';
import MessageCycler from './MessageCycler';
import ProgressContainer from './ProgressContainer';

const active = Object.create(null);
const cycler = MessageCycler(2); // cycle very 2 sec

function update() {
  const states = Object.values(active);
  const total = states.map((p) => p.percent).reduce((sum, v) => sum + v, 0);
  const percent = total / (states.length || 1);

  EventManager.invoke('visible', !!states.length);
  if (percent > 0) {
    EventManager.invoke('percent', percent);
  }
}

function setIndeterminate(state) {
  EventManager.invoke('visible', state);
  EventManager.invoke('indeterminate', state);
}

function setPercent(key, p) {
  if (key in active) {
    active[key].percent = p;
    update();
  }
}

function start(key, message) {
  if (!(key in active)) {
    active[key] = {
      percent: 0,
    };
    cycler.addMessage(message);
  }

  if (!cycler.started) {
    cycler.start();
  }

  update();
}

function end(key) {
  if (key in active) {
    delete active[key];
    update();
  }
  cycler.end();
}

export default {
  setIndeterminate,
  setPercent,
  start,
  end,
  ProgressContainer,
};
