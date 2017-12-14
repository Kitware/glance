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

    // Not for vtk.js
    // 'import/no-extraneous-dependencies': ["error", { "devDependencies": true }],
    'import/no-extraneous-dependencies': 0,
    'import/no-unresolved': 0,
    'import/extensions': 0,
    'import/no-named-as-default': 0,
    'import/no-named-as-default-member': 0,

    // tmp for dev
    'class-methods-use-this': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    'react/forbid-prop-types': 0,
    'react/no-unused-prop-types': 0,
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
