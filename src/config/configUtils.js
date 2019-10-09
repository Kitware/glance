// ----------------------------------------------------------------------------

function createProxyDefinition(
  classFactory,
  ui = [],
  links = [],
  definitionOptions = {},
  props = {}
) {
  return {
    class: classFactory,
    options: { links, ui, ...definitionOptions },
    props,
  };
}

// ----------------------------------------------------------------------------

function activateOnCreate(def) {
  /* eslint-disable no-param-reassign */
  def.options.activateOnCreate = true;
  return def;
}

// ----------------------------------------------------------------------------

function deepCopyPath(rootObj, pathSpec) {
  const path = typeof pathSpec === 'string' ? pathSpec.split('.') : pathSpec;
  const newRootObj = { ...rootObj };

  let obj = newRootObj;
  while (path.length) {
    const prop = path.shift();
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      if (obj[prop] instanceof Array) {
        // handles case when prop is an array
        obj[prop] = Array.from(obj[prop]);
      } else {
        // copy as object
        obj[prop] = { ...obj[prop] };
      }
      obj = obj[prop];
    } else {
      throw new Error(`Invalid property path given: ${path}`);
    }
  }

  return newRootObj;
}

// ----------------------------------------------------------------------------

function objAssignPath(rootObj, pathSpec, value) {
  const path = typeof pathSpec === 'string' ? pathSpec.split('.') : pathSpec;
  let obj = rootObj;

  while (path.length > 1) {
    const prop = path.shift();
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      obj = obj[prop];
    } else {
      throw new Error(`Invalid property path given: ${path}`);
    }
  }

  if (path.length === 1) {
    const lastProp = path.shift();
    obj[lastProp] = value;
  } else {
    throw new Error(`Invalid property path given: ${path}`);
  }
}

// ----------------------------------------------------------------------------
export default {
  createProxyDefinition,
  activateOnCreate,
  deepCopyPath,
  objAssignPath,
};
