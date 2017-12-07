import 'babel-polyfill';

import ReactDOM from 'react-dom';
import React from 'react';
import MainView from './MainView';

const mountNode = document.querySelector('.root-container');

ReactDOM.render(<MainView />, mountNode);
