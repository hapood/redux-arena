const context = require.context("./src", true, /\.spec\.jsx?$/);
context.keys().forEach(context);
const integrationContext = require.context("./test", true, /\.jsx?$/);
integrationContext.keys().forEach(integrationContext);
