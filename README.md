jasmine-coberturareporter
=========================

Cobertura coverage compatible output for Jasmine tests.

Usage
-----
 * Download jscoverage (protip: Chef Cookbook)
 * Download PhantomJS (protip: Chef Cookbook)
 * Run jsCoverage to instrument the javascript files you want to run coverage for
 * Include the instrumented files in your test runner page
 * Add the jasmine-coberturareporter as a reporter in your test runner page
 * Tell jasmine-coberturareporter where you want the XML report and where your source files live
 * Run through something like PhantomJS through the included `phantom-testrunner.js` file


Example Test Runner
-------------------
	<!doctype html>
	<html>
	<head>
		<title>Test Runner</title>

		<script type="text/javascript" src="js/lib/jasmine-1.2.0/jasmine.js"></script>
		<script type="text/javascript" src="js/lib/jasmine-1.2.0/jasmine-html.js"></script>
		<script type="text/javascript" src="js/lib/jasmine.cobertura-reporter.js"></script>

		<script type="text/javascript" src="js-instrumented/file-to-test.js"></script>
	</head>

	<body>
		<script type="text/javascript">
			jasmine.getEnv().addReporter(new jasmine.TrivialReporter());
			jasmine.getEnv().addReporter(new jasmine.CoberturaReporter('./reports/', 'public/js/'));
			jasmine.getEnv().execute();
		</script>
	</body>
	</html>


Example command
---------------
Stick this up your Jenkins (or equivalent CI environment):
	
	# Run jscoverage to instrument javascript source files
	jscoverage public/js/ public/js-instrumented/

	# Run phantomJS through the testrunner
	phantomjs phantom-testrunner.js $WORKSPACE/public/test-runner.html


Other recommended outputs
-------------------------
This combines well with [jasmine-junitreporter](https://github.com/larrymyers/jasmine-reporters) and [jasmine-consolereporter](https://github.com/larrymyers/jasmine-reporters) to give you both a meaningful output on the console and subsequent jUnit XML to breakdown the output spec-by-spec.


Aknowledgements
---------------
The structure of the reporter was built-on the [jscoverage-reporter](https://github.com/NeoPhi/jscoverage-reporter) project by Daniel Rinehart.

The included phantom-testrunner.js is taken from the [jasmine-reporters](https://github.com/larrymyers/jasmine-reporters) project by Larry Myers.
