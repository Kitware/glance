import { mapState, mapActions } from 'vuex';

import PopUp from 'paraview-glance/src/components/widgets/PopUp';
import PalettePicker from 'paraview-glance/src/components/widgets/PalettePicker';
import SourceSelect from 'paraview-glance/src/components/widgets/SourceSelect';
import SvgIcon from 'paraview-glance/src/components/widgets/SvgIcon';
import { WIDGETS } from 'paraview-glance/src/palette';

import AngleMeasurementTool from 'paraview-glance/src/components/tools/MeasurementTools/tools/AngleMeasurementTool';
import RulerMeasurementTool from 'paraview-glance/src/components/tools/MeasurementTools/tools/RulerMeasurementTool';
import TextAnnotationTool from 'paraview-glance/src/components/tools/MeasurementTools/tools/TextAnnotationTool';

// ----------------------------------------------------------------------------

const ToolList = [
  {
    name: '2D Angle',
    icon: 'angle-tool',
    component: AngleMeasurementTool,
  },
  {
    name: '2D Ruler',
    icon: 'length-tool',
    component: RulerMeasurementTool,
  },
  {
    name: '2D Text',
    icon: 'text-tool',
    component: TextAnnotationTool,
  },
];

// ----------------------------------------------------------------------------

const ComponentToTool = {};
ToolList.forEach((tool) => {
  ComponentToTool[tool.component.name] = tool;
});

// ----------------------------------------------------------------------------

export default {
  name: 'MeasurementTools',
  props: ['enabled'],
  components: {
    PopUp,
    PalettePicker,
    SvgIcon,
    SourceSelect,
  },
  inject: ['$notify'],
  data() {
    return {
      uiToolList: ToolList,
      activeToolIndex: undefined,
      activeToolId: -1,
      targetPid: -1,
      pendingTool: null,
      palette: WIDGETS,
    };
  },
  computed: {
    ...mapState('widgets', ['measurements']),
    tools() {
      // format:
      // { name:str, component:str, data:{} }
      let tools = [];
      if (this.measurements[this.targetPid]) {
        const measurements = this.measurements[this.targetPid];
        tools = tools.concat(
          measurements.map((m) => ({
            ...ComponentToTool[m.componentName],
            data: m.data,
          }))
        );
      }

      if (this.pendingTool) {
        tools = tools.concat(this.pendingTool);
      }

      return tools;
    },
    targetProxy() {
      return this.$proxyManager.getProxyById(this.targetPid);
    },
  },
  watch: {
    enabled(enable) {
      if (enable) {
        this.enableActiveTool();
      } else {
        this.clearActiveTool();
      }
    },
    targetPid() {
      if (this.enabled) {
        this.clearActiveTool();
      }
    },
  },
  methods: {
    ...mapActions('widgets', [
      'addMeasurementTool',
      'removeMeasurementTool',
      'updateMeasurementTool',
    ]),
    filterImageData(source) {
      return (
        source.getProxyName() === 'TrivialProducer' &&
        source.getType() === 'vtkImageData'
      );
    },
    setTargetDataset(sourceId) {
      this.targetPid = sourceId;
    },
    toggleActiveTool(toolIndex) {
      if (this.enabled) {
        if (toolIndex === undefined) {
          this.$emit('enable', false);
        } else {
          this.removeTool(this.activeToolIndex);
          this.activeToolIndex = toolIndex;
          this.enableActiveTool();
        }
      } else if (toolIndex !== undefined) {
        this.activeToolIndex = toolIndex;
        this.$emit('enable', true);
      }
    },
    enableActiveTool() {
      if (this.targetPid !== -1 && this.activeToolIndex !== undefined) {
        this.pendingTool = ToolList[this.activeToolIndex];
      }
    },
    clearActiveTool() {
      this.pendingTool = null;
      this.activeToolIndex = undefined;
      this.activeToolId = -1;
    },
    removeTool(index) {
      if (this.pendingTool && index === this.tools.length - 1) {
        this.pendingTool = null;
        this.clearActiveTool();
      } else {
        this.removeMeasurementTool({
          datasetId: this.targetPid,
          index,
        });
      }
    },
    saveToolData(toolIndex, data) {
      // If pendingTool's data is saved, that means we need to commit
      // pendingTool to the store.
      if (this.pendingTool && toolIndex === this.tools.length - 1) {
        this.addMeasurementTool({
          datasetId: this.targetPid,
          componentName: this.pendingTool.component.name,
          data,
        });
        this.pendingTool = null;
        this.$emit('enable', false);
      } else {
        this.updateMeasurementTool({
          datasetId: this.targetPid,
          index: toolIndex,
          data,
        });
      }
    },
    upload() {
      if (this.targetProxy) {
        this.$root.$emit('girder_upload_measurements', this.targetPid);
        this.$notify('Measurements uploaded');
      }
    },
  },
};
