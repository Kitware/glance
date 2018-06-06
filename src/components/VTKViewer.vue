<script>
import VTKViewer2D from '@/components/VTKViewer2D';
import VTKViewer3D from '@/components/VTKViewer3D';

const viewTypes = {
  '2D': VTKViewer2D,
  '3D': VTKViewer3D,
};

const VTKViewer = {
  functional: true,
  props: {
    type: {
      type: String,
      required: true,
      validator: (v) => v in viewTypes,
    },
  },
  render(createElement, context) {
    return createElement(
      viewTypes[context.props.type],
      context.data,
      context.children
    );
  },
};

export default VTKViewer;
</script>
