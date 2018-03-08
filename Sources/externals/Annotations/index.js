import AnnotationControl from './AnnotationControl';

export function registerToGlance(Glance) {
  if (Glance) {
    Glance.registerControlTab(
      'Annotations',
      AnnotationControl,
      1,
      'pencil-alt'
    );
  }
}

export default {
  registerToGlance,
};

const Glance = (typeof window === 'undefined' ? {} : window).Glance;
registerToGlance(Glance);
