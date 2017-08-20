const context = require.context("../src", true, /\.spec\.js?$/);
context.keys().forEach(context);
const integrationContext = require.context("./integration", true, /\.js?$/);
integrationContext.keys().forEach(integrationContext);
