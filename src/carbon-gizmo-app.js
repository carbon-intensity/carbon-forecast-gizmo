import 'core-js/es6/map';
import 'core-js/es6/set';

import React from "react";
import ReactDOM from "react-dom";
import Timeline from './components/Timeline';

const app = document.getElementById("app");

app ? ReactDOM.render(<Timeline />, app) : false;