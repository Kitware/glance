function callAndEmpty(l) {
  while (l.length) {
    l.pop()();
  }
}

export default class Settings {
  constructor(keyPrefix = 'settings') {
    this.keyPrefix = keyPrefix;
    this.storeSettingsMap = {};
    this.store = null;
    this.storeWatchers = [];
  }

  key(name) {
    if (this.keyPrefix) {
      return `${this.keyPrefix}.${name}`;
    }
    return name;
  }

  get(name) {
    const result = window.localStorage.getItem(this.key(name));
    if (result === null) {
      return undefined;
    }
    return JSON.parse(result);
  }

  set(name, value) {
    return window.localStorage.setItem(this.key(name), JSON.stringify(value));
  }

  syncWithStore(store, syncInfo) {
    callAndEmpty(this.storeWatchers);
    this.store = store;
    this.storeSettingsMap = syncInfo;

    const settingNames = Object.keys(syncInfo);
    // localStorage -> store
    settingNames.forEach((name) => {
      const value = this.get(name);
      if (value !== undefined) {
        const { set } = syncInfo[name];
        set(value);
      }
    });

    // store -> localStorage
    this.storeWatchers = settingNames.map((name) => {
      const { get } = syncInfo[name];
      return store.watch(get, (value) => this.set(name, value));
    });
  }

  delete() {
    callAndEmpty(this.storeWatchers);
    this.storeSettingsMap = {};
    this.store = null;
  }
}
