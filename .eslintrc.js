module.exports = {
  "extends": "plugin:@typescript-eslint/recommended",
  "rules": {
      "no-console": ["error", {
          "allow": ["warn", "error", "info"]
      }],
      "@typescript-eslint/restrict-plus-operands": "error",
      "indent": ["error", 2],
      "linebreak-style": ["warn", "unix"],
      "quotes": ["error", "single"]
  },
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
      "project": "./tsconfig.json",
      "ecmaVersion": 2018,
      "sourceType": "srcipt"
  },
  "plugins": ["@typescript-eslint"],
  "globals": {
      // "window": true,
      "Atomics": "readonly",
      "SharedArrayBuffer": "readonly"
  },
  "env": {
      "browser": true,
      "commonjs": true,
      "es6": true,
      "mocha": true
  }
}