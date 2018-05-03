function RemoteControl() {
  const triggers = Object.create(null);

  const addTrigger = (name, triggerFunc) => {
    triggers[name] = triggerFunc;
  };

  const delTrigger = (name) => delete triggers[name];

  const trigger = (name, ...args) => {
    if (name in triggers) {
      return triggers[name](...args);
    }
    return undefined;
  };

  return {
    addTrigger,
    delTrigger,
    trigger,
  };
}

export default RemoteControl;
