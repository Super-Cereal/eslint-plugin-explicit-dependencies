const path = require('path');

/** Taking aliases from tsconfig */
function getTSAliases(currentDir) {
  // Finding the nearest tsconfig.json
  let tsConfig;
  try {
    const tsConfigPath = findup.sync(currentDir, "tsconfig.json");
    tsConfig = require(path.join(tsConfigPath, "tsconfig.json"));
  } catch (e) {}

  let aliases = [];
  if (tsConfig && tsConfig.compilerOptions && tsConfig.compilerOptions.paths) {
    // if a specified smth like "utils/*", then removing the excess
    aliases = Object.keys(tsConfig.compilerOptions.paths).map((key) =>
      key.includes("/*") ? key.split("/*")[0] : key
    );
  }

  return aliases;
}

// Removing properties of the prototype
const memo = Object.create(null);
memo.fundup = false;

function isBuiltIn(name) {
  if (name in memo) {
    return memo[name];
  }

  try {
    return (memo[name] = require.resolve(name) === name);
  } catch (e) {
    return (memo[name] = false);
  }
}

function isInDeps(pkg, opts, moduleName) {
  const typesModuleName = `@types/${moduleName}`;

  const findInDeps = (deps) =>
    deps && (deps[moduleName] || deps[typesModuleName]);

  // If the module is in package.json
  return Boolean(
    findInDeps(pkg.dependencies) ||
      (opts.optional && findInDeps(pkg.optionalDependencies)) ||
      (opts.peer && findInDeps(pkg.peerDependencies)) ||
      (opts.dev && findInDeps(pkg.devDependencies))
  );
}

module.exports = {
  findup,
  getTSAliasesRegexp,
  isBuiltIn,
  isInDeps,
};
