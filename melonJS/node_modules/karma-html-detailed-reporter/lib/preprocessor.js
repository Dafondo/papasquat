var istanbul = require('istanbul');

var HtmlDetailedPreprocessor = function(logger, config) {
  'use strict';
  
  var log = logger.create('htmlDetailed.preprocessor');
  var preprocessorConfig = config.htmlDetailed || {};
  var basePath = config.basePath;
  var reporters = config.reporters;
  var instrumenter;
  
  if (!!preprocessorConfig.minify) {
      log.debug('minify is true');
      instrumenter = new istanbul.Instrumenter();
  } else {
      log.debug('minify is false');
      instrumenter = new istanbul.Instrumenter({ noCompact : true });
  }
  
  // if coverage reporter is not used, do not preprocess the files
  if (reporters.indexOf('htmlDetailed') === -1) {
    return function(content, _, done) {
      done(content);
    };
  }

  return function(content, file, done) {
    log.debug('Processing "%s".', file.originalPath);

    var jsPath = file.originalPath.replace(basePath + '/', './');

    instrumenter.instrument(content, jsPath, function(err, instrumentedCode) {
      if(err) {
        log.error('%s\n  at %s', err.message, file.originalPath);
      }

      done(instrumentedCode);
    });
  };
};

HtmlDetailedPreprocessor.$inject = ['logger', 'config'];

module.exports = HtmlDetailedPreprocessor;