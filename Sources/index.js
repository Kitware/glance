import 'babel-polyfill';
import 'font-awesome/css/font-awesome.css';

import ReactDOM from 'react-dom';
import React from 'react';
import MainView from './MainView';

const mountNode = document.querySelector('.root-container');

ReactDOM.render(<MainView />, mountNode);
