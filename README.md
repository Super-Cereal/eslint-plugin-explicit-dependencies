## edu-eslint/explicit-dependencies

A rule for ESLint that checks that all dependencies in your project are explicitly specified either in the `package.json`, or in `tsconfig.json` as aliases

Based on a solution distributed under the MIT license https://github.com/lennym/eslint-plugin-implicit-dependencies

### Extension of the original solution

- Taught the rule to approve aliases from the nearest `tsconfig.json` file
- Taught the rule to approve `@types/{moduleName}` fron the `package.json`
- Added the `ignore` option if you need to ignore certain modules
- Added the `allowBuiltin` option if you need to approve the built-in node modules
- Got rid of the `builtin-modules` dependency by defining the `isBuiltIn` function

## Options

### Dependencies: dev, peer, optional 

By default "explicit-dependencies" will only look for dependencies in the dependencies section of your package.json. You can include dev, peer and optional dependencies by configuring the rule to include those sections as follows:

```javascript
rules: {
  'explicit-dependencies/explicit': [
    'error',
    { dev: true, peer: true, optional: true }
  ]
}
```

### Builtin server modules

To support builtin server modules, add `allowBuiltin` to the rule configuration (default is `false')

```javascript
rules: {
  'explicit-dependencies/explicit': [
    'error',
    { allowBuiltin: true }
  ]
}
```

### Skipping dependencies

By default, aliases from the nearest `tsconfig.json` are allowed (inherited aliases are not taken into account yet)

To disable the error for a specific package, add `ignore` to the rule configuration.

```javascript
rules: {
  'explicit-dependencies/explicit': [
    'error',
    { ignore: ['entities', 'utils'] }
  ]
}
```
