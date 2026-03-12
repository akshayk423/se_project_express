module.exports = {
  env: {
    es2021: true,
    node: true,
  },

  // Add the necessary extensions.
  extends: 'airbnb-base',
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs};'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
    'implicit-arrow-linebreak': 'off',
    'function-paren-newline': 'off',
    'object-curly-newline': 'off',
    'no-unused-vars': ['error', { argsIgnorePattern: 'next' }],
    // Disable newline-per-chained-call to avoid false positives for Joi chains
    // (e.g. `.messages({...})`) that Prettier sometimes formats on one line.
    'newline-per-chained-call': 'off',
  },
};
