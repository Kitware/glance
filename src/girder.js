// https://github.com/girder/girder_web_components
import Vue from 'vue';
import Girder, { RestClient } from '@girder/components/src';
import vtkURLExtract from '@kitware/vtk.js/Common/Core/URLExtract';

// Install the Vue plugin that lets us use the components
Vue.use(Girder);

// URL parameters to change Girder API root URL, or to disable it completely
const { girderRoute, noGirder } = vtkURLExtract.extractURLParameters();
// Create the axios-based client to be used for all API requests
const apiRoot = girderRoute || 'https://data.kitware.com/api/v1';
const girderRest = noGirder
  ? undefined
  : new RestClient({
      apiRoot,
    });

if (girderRest) {
  girderRest.fetchUser();
}

// This is passed to our Vue instance; it will be available in all components
const GirderProvider = {
  girderRest,
};
export default GirderProvider;
