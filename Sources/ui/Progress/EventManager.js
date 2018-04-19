function EventManager() {
  const events = Object.create(null);

  const off = (name, cb) => {
    const l = events[name] || [];
    const i = l.indexOf(cb);
    if (i > -1) {
      l.splice(i, 1);
    }
  };

  const on = (name, cb) => {
    events[name] = events[name] || [];
    events[name].push(cb);
    return () => off(name, cb);
  };

  const invoke = (name, ...args) => {
    (events[name] || []).forEach((cb) => setTimeout(() => cb(...args), 0));
  };

  return {
    on,
    off,
    invoke,
  };
}

export default EventManager();
