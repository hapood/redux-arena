const context = require.context("../src", true, /\.spec\.ts?$/)
context.keys().forEach(context)
const integrationContext = require.context("./integration", true, /\.ts?$/)
integrationContext.keys().forEach(integrationContext)
