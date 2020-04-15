import vtkLabelMap from 'paraview-glance/src/vtk/LabelMap';

export function copyImageToLabelMap(vtkImage) {
  /* eslint-disable-next-line import/no-named-as-default-member */
  const lm = vtkLabelMap.newInstance(
    vtkImage.get('direction', 'origin', 'spacing')
  );
  lm.setDimensions(vtkImage.getDimensions());
  lm.computeTransforms();
  lm.getPointData().setScalars(vtkImage.getPointData().getScalars());
  return lm;
}

export default function postProcessDataset(ds, meta = {}) {
  if (meta.glanceDataType === 'vtkLabelMap') {
    const lm = copyImageToLabelMap(ds);
    if (meta.colorMap) {
      lm.setColorMap(meta.colorMap);
    }
    return lm;
  }
  return ds;
}
