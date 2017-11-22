const fs = require("fs-extra");
const path = require("path");
const ts = require("typescript");

const files = [
  "README.md",
  "LICENSE",
  "subModules/tools",
  "subModules/ActionTypes",
  "subModules/effects"
];

// make sure we're in the right folder
process.chdir(path.resolve(__dirname, ".."));

const binFolder = path.resolve("node_modules/.bin/");
const buildFolder = "build";

fs.removeSync(buildFolder);

function runTypeScriptBuild(outDir, target, moduleKind) {
  console.log(
    `Running typescript build (target: ${
      ts.ScriptTarget[target]
    }, moduleKind: ${moduleKind}) in ${outDir}/`
  );

  const tsConfig = path.resolve("tsconfig.json");
  const json = ts.parseConfigFileTextToJson(
    tsConfig,
    ts.sys.readFile(tsConfig),
    true
  );

  const { options } = ts.parseJsonConfigFileContent(
    json.config,
    ts.sys,
    path.dirname(tsConfig)
  );

  options.target = target;
  options.outDir = outDir;
  options.paths = undefined;

  options.module = moduleKind;
  options.declarationDir = path.resolve(outDir);
  options.sourceMap = false;

  const rootFile = path.resolve("src", "index.ts");
  const host = ts.createCompilerHost(options, true);
  const prog = ts.createProgram([rootFile], options, host);
  const result = prog.emit();
  if (result.emitSkipped) {
    const message = result.diagnostics
      .map(
        d =>
          `${ts.DiagnosticCategory[d.category]} ${d.code} (${d.file}:${
            d.start
          }): ${d.messageText}`
      )
      .join("\n");

    throw new Error(`Failed to compile typescript:\n\n${message}`);
  }
}

function copyFile(file) {
  return new Promise(resolve => {
    fs.copy(file, path.resolve(buildFolder, path.basename(file)), err => {
      if (err) throw err;
      resolve();
    });
  }).then(() => console.log(`Copied ${file} to ${buildFolder}`));
}

function createPackageFile() {
  return new Promise(resolve => {
    fs.readFile(path.resolve("package.json"), "utf8", (err, data) => {
      if (err) {
        throw err;
      }
      resolve(data);
    });
  })
    .then(data => JSON.parse(data))
    .then(packageData => {
      const {
        name,
        author,
        version,
        description,
        keywords,
        repository,
        license,
        bugs,
        homepage,
        peerDependencies,
        dependencies
      } = packageData;

      const minimalPackage = {
        name,
        author,
        version,
        description,
        main: "lib/index.js",
        module: "es/index.js",
        "jsnext:main": "es/index.js",
        typings: "es/index.d.ts",
        keywords,
        repository,
        license,
        bugs,
        homepage,
        peerDependencies,
        dependencies
      };

      return new Promise(resolve => {
        const buildPath = path.resolve(`${buildFolder}/package.json`);
        const data = JSON.stringify(minimalPackage, null, 2);
        fs.writeFile(buildPath, data, err => {
          if (err) throw err;
          console.log(`Created package.json in ${buildPath}`);
          resolve();
        });
      });
    });
}

function build() {
  let buildCJSPromise = new Promise(resolve => {
    runTypeScriptBuild(
      `${buildFolder}/lib`,
      ts.ScriptTarget.ES5,
      ts.ModuleKind.CommonJS
    );
    resolve();
  });
  let buildESPromise = new Promise(resolve => {
    runTypeScriptBuild(
      `${buildFolder}/es`,
      ts.ScriptTarget.ES5,
      ts.ModuleKind.ES2015
    );
    resolve();
  });
  return Promise.all([buildCJSPromise, buildESPromise]).then(() =>
    Promise.all(files.map(file => copyFile(file))).then(() =>
      createPackageFile()
    )
  );
}

build().catch(e => {
  console.error(e);
  if (e.frame) {
    console.error(e.frame);
  }
  process.exit(1);
});
