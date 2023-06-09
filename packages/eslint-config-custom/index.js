module.exports = {
  plugins: [
    "eslint-plugin-import",
    "@typescript-eslint",
    "prettier",
    "react",
    "react-hooks",
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier",
  ],
  rules: {
    "prettier/prettier": "error",
    "@typescript-eslint/ban-types": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-unnecessary-type-constraint": "off",
    "react/react-in-jsx-scope": "off",
    "react/no-children-prop": "warn",
    "react-hooks/rules-of-hooks": "warn",
    "react/prop-types": "off",
    "react/display-name": "off",
    "react/no-unescaped-entities": "off",
    "@next/next/no-html-link-for-pages": "off",
    "react/jsx-key": "off",
    "no-undef": "off",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
