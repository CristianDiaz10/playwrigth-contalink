module.exports = {
  theme: 'bootstrap',
  jsonFile: 'reports/cucumber_report.json',
  output: 'reports/cucumber_report.html',
  reportSuiteAsScenarios: true,
  launchReport: true,
  metadata: {
    "App Name": "Contalink UI",
    "Test Environment": "QA",
    "Browser": process.env.BROWSER || "Chrome",
    "Platform": "Windows",
    "Executed": "Local",
  },
};