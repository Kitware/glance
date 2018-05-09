export const GLANCE_DATA = 'glanceData';

export const ToolTypes = {
  Mouse: 0,
  MouseWheel: 1,
  Keyboard: 2,
  Touch: 3,
};

export const MouseButtons = {
  Left: 1,
  Middle: 2,
  Right: 4,
};

export const InputSources = {
  [ToolTypes.Mouse]: 'mouseInput',
  [ToolTypes.MouseWheel]: 'mouseWheelInput',
  [ToolTypes.Keyboard]: 'keyboardInput',
  [ToolTypes.Touch]: 'touchInput',
};

export default {
  GLANCE_DATA,
  ToolTypes,
  MouseButtons,
  InputSources,
};
