/** @type {import("eslint").Linter.Config} */
/* eslint-disable @next/next/no-server-import-in-client */
const config = {
  parser: "@typescript-eslint/parser",
  parserOptions: { project: true },
  extends: [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked"
  ],
  rules: {
    // ✅ 删除这一行，如果你用了 eslint-config-next，会自动启用它
    // "@next/next/no-server-import-in-client": "error",
    
    "@typescript-eslint/array-type": "off",
    "@typescript-eslint/consistent-type-definitions": "off",
    "@typescript-eslint/consistent-type-imports": [
      "warn",
      { prefer: "type-imports", fixStyle: "inline-type-imports" },
    ],
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/require-await": "off",
    "@typescript-eslint/no-misused-promises": [
      "error",
      { checksVoidReturn: { attributes: false } },
    ],
  },
};

module.exports = config;
