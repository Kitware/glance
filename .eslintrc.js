const prettierConf = require('./prettier.config');

module.exports = {
    root: true,
    parserOptions: {
      parser: 'babel-eslint'
    },
    env: {
      browser: true,
    },
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    extends: [
      'airbnb-base',
      'plugin:vue/recommended',
      'plugin:prettier/recommended',
    ],
    // required to lint *.vue files
    plugins: [
      'vue',
      'prettier',
    ],
    // check if imports actually resolve
    settings: {
      'import/resolver': {
        webpack: {
          config: 'build/webpack.dev.config.js'
        }
      }
    },
    rules: {
      'prettier/prettier': ['error', prettierConf],

      'no-console': 0,
      'prefer-destructuring': 0,
      'no-plusplus': 0,
      'import/no-extraneous-dependencies': 0, // paraview-glance alias
      'linebreak-style': 0,

      // don't require .vue extension when importing
      'import/extensions': ['error', 'always', {
        js: 'never',
        vue: 'never'
      }],
      // disallow reassignment of function parameters
      // disallow parameter object manipulation except for specific exclusions
      'no-param-reassign': ['error', {
        props: true,
        ignorePropertyModificationsFor: [
          'publicAPI', // for vtkjs publicAPI
          'model', // for vtkjs model
          'state', // for vuex state
          'acc', // for reduce accumulators
          'e' // for e.returnvalue
        ]
      }],
      // allow debugger during development
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
    }
  }

