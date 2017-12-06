module.exports = {
  extends: ['airbnb'], // , 'prettier'
  rules: {
    'max-len': ["warn", 160, 4, {"ignoreUrls": true}],
    'no-multi-spaces': ["error", { exceptions: { "ImportDeclaration": true } }],
    'no-param-reassign': ["error", { props: false }],
    'no-unused-vars': ["error", { args: 'none' }],
    'react/jsx-filename-extension': ["error", { "extensions": [".js"] }],
    'no-mixed-operators': ["error", {"allowSamePrecedence": true}],

    // Not for us ;-)
    'import/no-extraneous-dependencies': 0,
    'jsx-a11y/label-has-for': 0,
    'no-console': 0,
    'no-plusplus': 0,
    'linebreak-style': 0,
  },
  // plugins: [
  //   'prettier'
  // ],
  'settings': {
    'import/resolver': 'webpack'
  },
  env: {
    browser: true,
  },
  // rules: {
  //   'prettier/prettier': [
  //     'error', {
  //       printWidth: 100,
  //       singleQuote: true,
  //       trailingComma: "es5"
  //     }
  //   ],
  // }
};
