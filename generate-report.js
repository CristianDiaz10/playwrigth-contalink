// generate-report.js
const path = require('path');
const reporter = require('cucumber-html-reporter');

const options = {
  theme: 'bootstrap',

  // ➜ Siempre construimos las rutas con path.join y process.cwd()
  //    para que funcionen sin importar dónde se ejecute el script
  jsonFile: path.join(process.cwd(), 'reports', 'cucumber_report.json'),
  output:  path.join(process.cwd(), 'reports', 'cucumber_report.html'),

  reportSuiteAsScenarios: true,

  // ➜ Desactivado en CI; si lo deseas en local puedes pasarlo
  //    a true temporalmente, no afecta la generación del archivo.
  launchReport: false,

  metadata: {
    'App Version'      : '1.0.0',
    'Test Environment' : 'QA',
    'Browser'          : process.env.BROWSER || 'Chrome',
    'Platform'         : process.platform,
    'Executed'         : process.env.GITHUB_ACTIONS ? 'CI' : 'Local',
  },
};

reporter.generate(options);
console.log('✅ Reporte HTML generado en:', options.output);