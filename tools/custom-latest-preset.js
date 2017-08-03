const latest = require("babel-preset-latest").buildPreset;

module.exports = {
  presets: [
    [
      "latest",
      {
        es2015: {
          modules: process.env.BABEL_ENV === "es" ? false : "commonjs"
        }
      }
    ]
  ]
};
