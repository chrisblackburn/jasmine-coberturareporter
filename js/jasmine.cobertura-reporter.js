/**
 * Jasmine Cobertura reporter
 *
 * Generates Cobertura compatible coverage output for Jasmine specs.
 * 
 * Copyright 2012, Chris Blackburn <christopher.blackburn@gmail.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function() {
  if (!jasmine) {
    throw new Exception('jasmine library does not exist in global namespace!');
  }

  // When running in node setup the global variable JSCoverage looks for
  try {
    if (global && !global.top) {
      global.top = {};
    }
  } catch(e) {}

  // writeFile from: https://github.com/larrymyers/jasmine-reporters
  var writeFile = function(filename, text) {
    // Rhino
    try {
      var out = new java.io.BufferedWriter(new java.io.FileWriter(filename));
      out.write(text);
      out.close();
      return;
    } catch (e) {}
    // PhantomJS, via a method injected by phantomjs-testrunner.js
    try {
      __phantom_writeFile(filename, text);
      return;
    } catch (f) {}
    // Node.js
    try {
      var fs = require('fs');
      var fd = fs.openSync(filename, 'w');
      fs.writeSync(fd, text, 0);
      fs.closeSync(fd);
      return;
    } catch (g) {}
  };

  var round = function(num, dec) {
    return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
  };

  var getStats = function(coverage) {
    var lines,
        stats = {};
    stats.total_lines = 0;
    stats.total_hits = 0;
    stats.files = [];

    for (file in coverage) {
      if (coverage.hasOwnProperty(file)) {
        stats.files[file] = {};
        stats.files[file]['file_name'] = file;
        stats.files[file]['total_lines'] = 0;
        stats.files[file]['total_hits'] = 0;
        stats.files[file]['lines'] = {};

        for (entry in coverage[file]) {
          line = coverage[file][entry];

          stats.total_lines += 1;
          stats.files[file]['total_lines'] += 1;

          if (line > 0) {
            stats.total_hits += 1;
            stats.files[file]['total_hits'] += 1;
          }

          stats.files[file]['lines'][entry] = line;
        }
      }
    }

    return stats;
  };

  var writeCoberturaReport = function(savePath, sourcePath, coverage) {
    var stats = getStats(coverage);

    xml = [];
    xml.push('<?xml version="1.0" ?>');
    xml.push("<!DOCTYPE coverage SYSTEM 'http://cobertura.sourceforge.net/xml/coverage-03.dtd'>");
    xml.push('<coverage>');
    xml.push('<sources>');
    xml.push('<source>');
    xml.push(sourcePath);
    xml.push('</source>');
    xml.push('</sources>');
    xml.push('<packages>');
    xml.push('<package branch-rate="0" complexity="0.0" line-rate="' + round((stats.total_hits / stats.total_lines), 2) + '" name="javascript">');
    xml.push('<classes>');

    for (file in stats.files) {
      file = stats.files[file];
      xml.push('<class branch-rate="0" complexity="0.0" filename="' + file.file_name + '" line-rate="' + round((file.total_hits / file.total_lines), 2) + '" name="' + file.file_name + '">');
      xml.push('<lines>');

      for (lineNum in file.lines) {
        line = file.lines[lineNum];
        xml.push('<line branch="false" hits="' + line + '" number="' + lineNum + '" />');
      }

      xml.push('</lines>');
      xml.push('</class>');
    }

    xml.push('</classes>');
    xml.push('</package>');
    xml.push('</packages>');
    xml.push('</coverage>');

    writeFile(savePath + '/coverage.xml', xml.join('\n'));
  };

  var getCoverage = function() {
    try {
      return top._$jscoverage;
    } catch(e) {}
    return {};
  };

  var CoberturaReporter = function(savePath, sourcePath) {
    this.savePath = savePath || '';
    this.sourcePath = sourcePath || '';
  };

  CoberturaReporter.prototype = {
    reportSpecStarting: function(spec) {
    },

    reportSpecResults: function(spec) {
    },

    reportSuiteResults: function(suite) {
    },

    reportRunnerResults: function(runner) {
      var coverage = getCoverage();
      writeCoberturaReport(this.savePath, this.sourcePath, coverage);
    },

    log: function(str) {
      var console = jasmine.getGlobal().console;

      if (console && console.log) {
        console.log(str);
      }
    }
  };

  jasmine.CoberturaReporter = CoberturaReporter;
}());