import VtkFieldData from 'paraview-glance/src/components/widgets/dataset/Information/FieldData';
import VtkImageData from 'paraview-glance/src/components/widgets/dataset/Information/ImageData';
import VtkMolecule from 'paraview-glance/src/components/widgets/dataset/Information/Molecule';
import VtkPolyData from 'paraview-glance/src/components/widgets/dataset/Information/PolyData';

export default {
  props: ['source'],
  components: {
    VtkFieldData,
    VtkImageData,
    VtkMolecule,
    VtkPolyData,
  },
  computed: {
    available() {
      if (this.source) {
        const ds = this.source.getDataset();
        if (ds && ds.isA) {
          return ds.isA('vtkPolyData') || ds.isA('vtkImageData');
        }
      }
      return false;
    },
  },
};
