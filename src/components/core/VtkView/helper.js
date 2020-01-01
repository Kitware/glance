// ----------------------------------------------------------------------------

function getViewType(view) {
  return `${view.getProxyName()}:${view.getName()}`;
}

// ----------------------------------------------------------------------------

export default {
  getViewType,
};
