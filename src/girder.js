// https://github.com/girder/girder_web_components
import Vue from 'vue';
import Girder, { RestClient } from '@girder/components/src';
import vtkURLExtract from '@kitware/vtk.js/Common/Core/URLExtract';

// Install the Vue plugin that lets us use the components
Vue.use(Girder);

// This connects to another server if the VUE_APP_API_ROOT
// environment variable is set at build-time
const { girderRoute } = vtkURLExtract.extractURLParameters();

const apiRoot = girderRoute || 'https://data.kitware.com/api/v1';

// Create the axios-based client to be used for all API requests
const girderRest = new RestClient({
  apiRoot,
});
girderRest.fetchUser();

// This is passed to our Vue instance; it will be available in all components
const GirderProvider = {
  girderRest,
};
export default GirderProvider;
