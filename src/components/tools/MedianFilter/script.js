import runPipelineBrowser from 'itk/runPipelineBrowser';
import IOTypes from 'itk/IOTypes';
import macro from '@kitware/vtk.js/macro';
import ITKHelper from 'paraview-glance/src/vtk/ITKHelper';

import { Portal } from '@linusborg/vue-simple-portal';

import SourceSelect from 'paraview-glance/src/components/widgets/SourceSelect';
import { createRepresentationInAllViews } from 'paraview-glance/src/utils';

const { vtkErrorMacro } = macro;
const NEW_IMAGE = -2;

// ----------------------------------------------------------------------------

export default {
  name: 'MedianFilter',
  components: {
    SourceSelect,
    Portal,
  },
  props: ['enabled'],
  data() {
    return {
      targetImageId: -1,
      outputImageId: -1,
      imageList: [],
      blurRadius: 1,
      running: false,
      webWorker: null,
      error: null,
      editingOutputName: false,
      editableOutputImageName: '',
      snackbar: {
        show: false,
        type: '',
        msg: '',
      },
    };
  },
  computed: {
    targetImage() {
      return this.$proxyManager.getProxyById(this.targetImageId);
    },
    outputImage() {
      return this.$proxyManager.getProxyById(this.outputImageId);
    },
    outputImageSelection() {
      if (this.outputImage) {
        return {
          name: this.outputImage.getName(),
          proxyId: this.outputImageId,
        };
      }
      return null;
    },
    buttonDisabled() {
      return this.running || !this.outputImage;
    },
  },
  watch: {
    targetImageId() {
      if (this.targetImageId === this.outputImageId) {
        this.outputImageId = -1;
      }
      this.refreshImageList();
    },
    outputImage() {
      if (this.outputImage) {
        this.editableOutputImageName = this.outputImage.getName();
      } else {
        this.editableOutputImageName = '';
      }
    },
    editableOutputImageName(name) {
      if (this.outputImage) {
        this.outputImage.setName(name);
      }
    },
  },
  proxyManagerHooks: {
    onProxyModified() {
      this.refreshImageList();
    },
    onProxyCreated() {
      this.refreshImageList();
    },
    onProxyDeleted({ proxyId }) {
      if (proxyId === this.targetImageId) {
        this.targetImageId = -1;
      }
      if (proxyId === this.outputImageId) {
        this.outputImageId = -1;
      }
    },
  },
  mounted() {
    this.refreshImageList();
  },
  methods: {
    filterImages(source) {
      return (
        source.getProxyName() === 'TrivialProducer' &&
        source.getType() === 'vtkImageData'
      );
    },
    setTargetImage(sourceId) {
      this.targetImageId = sourceId;
    },
    setOutputImage(selectionId) {
      if (selectionId === NEW_IMAGE) {
        const proxy = this.createOutputImageProxy();
        this.outputImageId = proxy.getProxyId();
      } else {
        this.outputImageId = selectionId;
      }

      // hide edit field if we are switching output images
      this.editingOutputName = false;
    },
    refreshImageList() {
      const list = this.$proxyManager
        .getSources()
        .filter((s) => s.getProxyId() !== this.targetImageId)
        .map((source) => ({
          name: source.getName(),
          proxyId: source.getProxyId(),
        }));
      this.imageList = [
        {
          name: 'Create image',
          proxyId: NEW_IMAGE,
        },
      ].concat(list);
    },
    createOutputImageProxy() {
      const proxy = this.$proxyManager.createProxy(
        'Sources',
        'TrivialProducer',
        {
          name: `Median filter of ${this.targetImage.getName()}`,
        }
      );
      return proxy;
    },
    runBlur() {
      const itkImage = ITKHelper.convertVtkToItkImage(
        this.targetImage.getDataset()
      );
      // prevent source data neutering
      itkImage.data = itkImage.data.slice(0);

      this.running = true;

      const radius = String(this.blurRadius);
      runPipelineBrowser(
        this.webWorker,
        'itkfiltering', // executable
        ['medianfilter', 'input.json', 'output.json', radius], // args
        [{ path: 'output.json', type: IOTypes.Image }], // output
        [{ path: 'input.json', type: IOTypes.Image, data: itkImage }] // input
      )
        .then((result) => {
          this.webWorker = result.webWorker;
          if (!this.outputImage) {
            const proxy = this.createOutputImageProxy();
            this.outputImageId = proxy.getProxyId();
          }

          const itkOutImage = result.outputs[0].data;
          itkOutImage.data = new Float32Array(itkOutImage.data);

          const vtkImage = ITKHelper.convertItkToVtkImage(itkOutImage);

          this.outputImage.setInputData(vtkImage);
          if (this.targetImage.getKey('girderProvenance')) {
            this.outputImage.setKey(
              'girderProvenance',
              this.targetImage.getKey('girderProvenance')
            );
          }
          createRepresentationInAllViews(this.$proxyManager, this.outputImage);
          this.$proxyManager.renderAllViews();

          this.running = false;
          this.showSnack({
            type: 'success',
            msg: 'Median filter done!',
          });
        })
        .catch((error) => {
          vtkErrorMacro(`Median filter error: ${error.message}`);
          this.error = error;
          this.showSnack({
            type: 'error',
            msg: 'Median filter error!',
          });
        });
    },
    showSnack({ type, msg }) {
      this.snackbar.show = true;
      this.snackbar.type = type;
      this.snackbar.msg = msg;
    },
    editOutputImageName() {
      if (this.outputImage) {
        this.editingOutputName = !this.editingOutputName;
      }
    },
    deleteOutputImage() {
      this.$proxyManager.deleteProxy(this.outputImage);
    },
  },
};
