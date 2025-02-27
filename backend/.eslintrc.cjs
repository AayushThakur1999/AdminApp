module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true,
  },
  parser: "@typescript-eslint/parser", // Parses TypeScript
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module", // For ES Modules
    project: "./tsconfig.json", // Links to your tsconfig
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended", // ESLint recommended rules
    "plugin:@typescript-eslint/recommended", // TypeScript recommended rules
    "plugin:@typescript-eslint/recommended-requiring-type-checking", // Type-checked rules
    "prettier", // Prettier compatibility
  ],
  rules: {
    "@typescript-eslint/no-unused-vars": "warn", // Warn on unused variables
    "@typescript-eslint/no-explicit-any": "warn", // Warn on `any` types
    "@typescript-eslint/no-floating-promises": "error", // Ensure promises are handled
    "no-console": "warn", // Warn on `console.log`
  },
};