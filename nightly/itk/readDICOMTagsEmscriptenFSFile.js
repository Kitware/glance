var readDICOMTagsEmscriptenFSFile = function readDICOMTagsEmscriptenFSFile(tagReaderModule, fileName) {
  var tags = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var tagReader = new tagReaderModule.ITKDICOMTagReader();
  tagReader.SetFileName(fileName);
  var tagMap = new Map();

  if (Array.isArray(tags)) {
    for (var i = 0; i < tags.length; i++) {
      var key = tags[i];
      tagMap.set(key, tagReader.ReadTag(key.toLowerCase()));
    }
  } else {
    var allTagsMap = tagReader.ReadAllTags();
    var keys = allTagsMap.keys();

    for (var _i = 0; _i < keys.size(); _i++) {
      var _key = keys.get(_i);

      tagMap.set(_key, allTagsMap.get(_key));
    }
  }

  return tagMap;
};

module.exports = readDICOMTagsEmscriptenFSFile;