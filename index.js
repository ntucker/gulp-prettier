const through = require('through2'),
  gutil = require('gulp-util'),
  prettier = require('prettier'),
  applySourceMap = require('vinyl-sourcemaps-apply');

var PluginError = gutil.PluginError;

module.exports = function(opt) {
  function transform(file, encoding, callback) {
    if (file.isNull())
      return callback(null, file);
    if (file.isStream())
      return callback(new PluginError(
        'gulp-prettiest',
        'Streaming not supported'
      ));

    let data;
    let str = file.contents.toString('utf8');

    try {
      data = prettier.format(str, opt);
    } catch (err) {
      console.log('there was a fucking error b!!');
      return callback(new PluginError('gulp-prettier', err));
    }

    if (data && data.v3SourceMap && file.sourceMap) {
      applySourceMap(file, data.v3SourceMap);
      file.contents = new Buffer(data.js);
    } else {
      file.contents = new Buffer(data);
    }

    callback(null, file);
  }

  return through.obj(transform);
};
