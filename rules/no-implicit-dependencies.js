"use strict";

const path = require("path");
const findup = require("findup");

const utils = require("./utils");

module.exports = {
  meta: {
    schema: [
      {
        type: "object",
        properties: {
          optional: {
            type: "boolean",
          },
          peer: {
            type: "boolean",
          },
          dev: {
            type: "boolean",
          },

          allowBuiltin: {
            type: "boolean",
          },
          ignore: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create: (context) => {
    const currentDir = path.dirname(context.getFilename());

    // Finding the nearest package.json
    const rootPath = findup.sync(currentDir, "package.json");
    const pkg = require(path.join(rootPath, "package.json"));

    const tsAliases = utils.getTSAliases(currentDir);

    const checkModuleName = (name, node) => {
      let moduleName;

      // Ignore dynamic arguments
      if (!name || typeof name !== "string") {
        return;
      }

      if (name[0] !== "." && name[0] !== "/") {
        // Parse module name from scope packages and deep requires
        if (name[0] === "@") {
          moduleName = name.split("/").slice(0, 2).join("/");
        } else {
          moduleName = name.split("/")[0];
        }

        // Check dependencies
        const opts = context.options[0] || {};

        if (
          // If it is a built-in node module
          (opts.allowBuiltin && utils.isBuiltIn(moduleName)) ||
          // If the module is in the list of tsconfig aliases
          tsAliases.includes(moduleName) ||
          // If the module is in the list of explicitly ignored
          opts.ignore?.includes(moduleName) ||
          // If the module is in package.json
          utils.isInDeps(pkg, opts, moduleName)
        ) {
          return;
        }

        context.report({
          node,
          message: `Module "${moduleName}" is not listed as a dependency in package.json or alias in tsconfig.json`,
        });
      }
    };

    return {
      "CallExpression:exit": (node) => {
        if (node.callee.name === "require") {
          const name = node.arguments[0].value;
          checkModuleName(name, node);
        }
      },
      "ImportDeclaration:exit": (node) => {
        const name = node.source.value;
        checkModuleName(name, node);
      },
    };
  },
};
