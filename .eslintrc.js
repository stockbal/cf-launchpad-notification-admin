module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true,
    es2020: true,
    jest: true,
    mocha: true
  },
  extends: [
    "prettier",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking"
  ],
  globals: {
    SELECT: true,
    INSERT: true,
    UPDATE: true,
    DELETE: true,
    CREATE: true,
    DROP: true,
    CDL: true,
    CQL: true,
    CXL: true,
    cds: true
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.eslint.json",
    tsconfigRootDir: __dirname
  },
  plugins: ["prettier", "@typescript-eslint/eslint-plugin"],
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    // "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    // "@typescript-eslint/no-floating-promises": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unsafe-argument": "off",
    "@typescript-eslint/ban-types": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "no-prototype-builtins": "off",
    "prettier/prettier": ["error"]
  }
};
