function pixelValue(measurement) {
  switch (measurement.pixel.type) {
    case 'color': {
      const [r, g, b] = measurement.pixel.value;
      return `R: ${r}, G: ${g}, B: ${b}`;
    }
    case 'grayscale': {
      const { sp, mo } = measurement.pixel.value;
      return `SP: ${sp}, MO: ${mo}`;
    }
    default:
      return null;
  }
}

export default function valueFromMeasurement(toolName, measurement) {
  switch (toolName) {
    case 'length':
      return measurement.length || 0;
    case 'angle':
      return measurement.angle || 0;
    case 'probe':
      return pixelValue(measurement);
    case 'ellipticalRoi':
      return '(none)';
    default:
      return null;
  }
}
