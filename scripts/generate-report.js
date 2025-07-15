const reporter = require('cucumber-html-reporter');

const options = {
  theme: 'bootstrap',
  jsonFile: 'reports/cucumber_report.json',  // Aquí lee el archivo JSON con resultados
  output: 'reports/cucumber_report.html',    // Aquí generará el reporte HTML
  reportSuiteAsScenarios: true,
  launchReport: true,
};

reporter.generate(options);