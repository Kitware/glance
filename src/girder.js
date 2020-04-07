// https://github.com/girder/girder_web_components
import Vue from 'vue';
import Girder, { RestClient } from '@girder/components/src';
import vtkURLExtract from 'vtk.js/Sources/Common/Core/URLExtract';

// Install the Vue plugin that lets us use the components
Vue.use(Girder);

// This connects to another server if the VUE_APP_API_ROOT
// environment variable is set at build-time
const { girderRoute } = vtkURLExtract.extractURLParameters();

let apiRoot =
  girderRoute ||
  process.env.VUE_APP_API_ROOT ||
  'https://data.kitware.com/api/v1';

let apiRootChanged = false;

function checkAPIValidity(root) {
  try {
    const req = new XMLHttpRequest();
    req.open('GET', `${root}/system/check`, false);
    req.send();
    if (req.status !== 200) {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
  return true;
}
if (!checkAPIValidity(apiRoot)) {
  alert(
    `The server ${apiRoot} did not respond correctly.\
 This could be because the url is wrong, the server is down, or because its\
 CORS policy does not permit access from this website.\
 Paraview Glance is defaulting to https://data.kitware.com/api/v1.\
 Hint: for localhost, try: https://localhost:9000/api/v1`
  );
  apiRootChanged = true;
  apiRoot = 'https://data.kitware.com/api/v1';
}

// Create the axios-based client to be used for all API requests
const girderRest = new RestClient({
  apiRoot,
});
girderRest.apiRootChanged = apiRootChanged;
girderRest.fetchUser();

// This is passed to our Vue instance; it will be available in all components
const GirderProvider = {
  girderRest,
};
export default GirderProvider;
