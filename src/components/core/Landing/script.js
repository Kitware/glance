import samples from 'paraview-glance/src/samples';
import DragAndDrop from 'paraview-glance/src/components/widgets/DragAndDrop';

export default {
  name: 'Landing',
  components: {
    DragAndDrop,
  },
  data() {
    return {
      samples,
    };
  },
};
