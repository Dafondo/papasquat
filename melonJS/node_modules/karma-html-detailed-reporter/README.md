# Karma HTML Detailed Reporter

[![Build status](https://ci.appveyor.com/api/projects/status/jmewfgra4pcnam0n?svg=true)](https://ci.appveyor.com/project/a11smiles/gulp-config-transform)

The Karma HTML Detailed Reporter is the most comprehensive reporter for Karma and Jasmine.  The reporter provides a dashboard detailing specification runs.  This plugin is under active development and additional features are being rapidly added to the plugin. 

## Installation
While a preprocessor is under development, the plugin currently includes only a reporter.
The installation of the reporter is very easy.

It is easiest to add `karma-html-detailed-reporter` as a devDependency in your `package.json`.
```json
{
    "devDependencies": {
        "karma": "^0.13.15",
        "karma-jasmine": "^0.3.6",
        "karma-html-detailed-reporter": "^1.1.4"
    }
}
```
Or, you can add it with the following command:
```bash
npm install karma-html-detailed-reporter --save-dev
```

## Configuration
```javascript
// karma.conf.js
module.exports = function(config) {
    config.set({
        frameworks: ['jasmine'],                  // Required for the test runner
        
        reporters: ['progress', 'htmlDetailed'],  // Add 'htmlDetailed' as a reporter
        
        browsers: ['Chrome', 'PhantomJS'],        // Define your browser(s)
        
        plugins: [			   
            'karma-jasmine',                      // Required plugin
            'karma-chrome-launcher',              // Launches Chrome
            'karma-phantomjs-launcher',           // Launches PhantomJS
            'karma-html-detailed-reporter'        // Adds plugin
        ]
    
        // Optionally, configure the reporter
        htmlDetailed: {
            splitResults: true
        }
    });
}
```

**NOTE:** At least one browser is required for the reporter to run.  Shown above are examples of two possible options (e.g. PhantomJS, Chrome).
         
## Options
#### autoReload
**Type:** Boolean  
**Default:** `true`  
**Description:** Enables/disables the refresh to start automatically.

#### dir
**Type:** String  
**Default:** `./_reports`  
**Description:** Sets the reports output base path.  

#### refreshTimeout
**Type:** Number  
**Default:** `1000`  
**Description:** Sets the refresh timeout (in milliseconds) for the page.

#### splitResults
**Type:** Boolean  
**Default:** `true`  
**Description:** Determines whether the results are split into a separate file for each browser.  

#### showSuccess
**Type:** Boolean  
**Default:** `true`  
**Description:** Determines whether the detailed results of the successfull tests are default shown or hidden in the browser (you are able to toggle live in the browser)

#### showFailed
**Type:** Boolean  
**Default:** `true`  
**Description:** Determines whether the detailed results of the failed tests are default shown or hidden in the browser (you are able to toggle live in the browser)

#### showSkipped
**Type:** Boolean  
**Default:** `true`  
**Description:** Determines whether the detailed results of the skipped tests are default shown or hidden in the browser (you are able to toggle live in the browser)

#### useHostedBootstrap
**Type:** Boolean  
**Default:** `false`  
**Description:** Determines whether to use the hosted versions of Boostrap and jQuery.  If testing within a CI build (e.g. TFS, Jenkins, TeamCity), setting this to `true` would allow you to see the reports while the builders do not maintain node modules.  

## License
Karma HTML Detailed Reporter is released under the [MIT License](http://www.opensource.org/licenses/MIT).

## Development
The Karma HTML Detailed Reporter project is developed and maintained by [Joshua Davis](http://jdav.is).
