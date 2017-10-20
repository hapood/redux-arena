const context = require.context("../src", true, /\.spec\.tsx?$/);
context.keys().forEach(context);
const integrationContext = require.context(
  "./integration",
  true,
  /\.spec\.tsx?$/
);
integrationContext.keys().forEach(integrationContext);
