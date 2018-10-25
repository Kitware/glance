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
  'RESTORE_APP_STATE',
  'RESET_WORKSPACE',
  'RESET_ACTIVE_CAMERA',

  // files
  'PROMPT_FOR_FILES',
  'OPEN_FILES',
  'OPEN_REMOTE_FILES',
  'FETCH_REMOTE',
  'LOAD_STATE', // private

  // views
  'UPDATE_LAYOUT',
  'UPDATE_VIEWS',
  'INIT_VIEWS_DATA',

  // screenshots
  'TAKE_SCREENSHOT',
]);

export const Getters = objEnum([
  // files
  'FILE_TOTAL_PROGRESS',
  'FILE_RAW_FILES_LOADABLE',
  'FILE_INDETERMINATE_PROGRESS',

  // views
  'VIEWS',
]);

export const Mutations = objEnum([
  // index
  'SHOW_APP',
  'SHOW_LANDING',
  'ADD_PANEL',
  'SAVING_STATE', // private
  'LOADING_STATE', // private

  // globalSettings
  'GLOBAL_BG',
  'GLOBAL_ORIENT_AXIS',
  'GLOBAL_ORIENT_PRESET',
  'GLOBAL_AXIS_TYPE',

  // files
  'FILE_SET_URLS', // private
  'FILE_SET_FILES', // private
  'FILE_PRELOAD', // private
  'FILE_LOAD', // private
  'FILE_ERROR', // private
  'FILE_IDLE', // private
  'FILE_SET_RAW_INFO', // private
  'FILE_CLEAR_RAW_INFO', // private
  'FILE_SET_ERROR', // private
  'FILE_UPDATE_PROGRESS', // private

  // views
  'VIEW_SET_BACKGROUND',
  'VIEWS_SWAP_ORDER', // private
  'VIEWS_REORDER_QUAD', // private
  'SET_VIEW_COUNT', // private

  // screenshots
  'OPEN_SCREENSHOT_DIALOG',
  'CLOSE_SCREENSHOT_DIALOG',
]);

export default {
  Actions,
  Getters,
  Mutations,
};
