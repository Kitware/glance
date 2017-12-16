import macro from 'vtk.js/Sources/macro';

function stateProperties(publicAPI, model, state, defaults) {
  const modelKeys = Object.keys(defaults);
  let count = modelKeys.length;
  while (count--) {
    // Add default
    const key = modelKeys[count];
    model[key] = defaults[key];

    // Add set method
    const mapping = state[key];
    publicAPI[`set${macro.capitalize(key)}`] = (value) => {
      if (value !== model[key]) {
        model[key] = value;
        const propValues = mapping[value];
        publicAPI.updateProperties(propValues);
        publicAPI.modified();
      }
    };
  }

  // Add getter
  macro.get(publicAPI, model, modelKeys);
}

export default {
  stateProperties,
};
