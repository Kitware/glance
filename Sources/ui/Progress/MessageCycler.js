import EventManager from './EventManager';

function MessageCycler(period) {
  const messages = [];
  let index = 0;
  let timer = null;

  const cycleMessages = () => {
    if (messages.length) {
      EventManager.invoke('message', messages[index]);
      index = (index + 1) % messages.length;
    }
  };

  const start = () => {
    if (!timer && messages.length) {
      index = 0;
      timer = setInterval(cycleMessages, period * 1000);
      cycleMessages();
    }
  };

  const end = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  const addMessage = (message) => {
    messages.push(message);
  };

  const removeMessage = (message) => {
    const i = messages.indexOf(message);
    if (i > -1) {
      messages.splice(i, 1);
    }
  };

  return {
    addMessage,
    removeMessage,
    start,
    end,
    get started() {
      return !!timer;
    },
  };
}

export default MessageCycler;
