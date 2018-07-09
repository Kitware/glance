function objEnum(names) {
  const obj = {};
  names.forEach((name) => {
    obj[name] = name;
  });
  return obj;
}

export const Actions = objEnum([
  // index
  'SAVE_STATE',

  // files
  'PROMPT_FOR_FILES',
  'OPEN_FILES',
  'OPEN_REMOTE_FILES',
  'READ_FILES',
  'FILE_HANDLE_LOAD_RESULTS', // private

  // views
  'UPDATE_LAYOUT',
  'UPDATE_VIEWS',
]);

export const Getters = objEnum([
  // files
  'FILE_TOTAL_PROGRESS',
  'FILE_RAW_FILES_LOADABLE',
  'FILE_INDETERMINATE_PROGRESS',
]);

export const Mutations = objEnum([
  // index
  'SHOW_APP',
  'SHOW_LANDING',
  'SAVING_STATE', // private

  // globalSettings
  'GLOBAL_BG',
  'GLOBAL_ORIENT_AXIS',
  'GLOBAL_ORIENT_PRESET',
  'GLOBAL_AXIS_TYPE',

  // files
  'FILE_SET_FILES', // private
  'FILE_PRELOAD', // private
  'FILE_LOAD', // private
  'FILE_ERROR', // private
  'FILE_IDLE', // private
  'FILE_SET_RAW_INFO', // private
  'FILE_SET_ERROR', // private
  'FILE_UPDATE_PROGRESS', // private

  // views
  'VIEW_SET_BACKGROUND',
  'VIEWS_SWAP_ORDER', // private
  'VIEWS_REORDER_QUAD', // private
  'SET_VIEWS', // private
  'VIEWS_INIT_DATA', // private

  // screenshots
  'TAKE_SCREENSHOT',
  'CLOSE_SCREENSHOT_DIALOG',
]);

export default {
  Actions,
  Getters,
  Mutations,
};
