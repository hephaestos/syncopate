import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App.js";
import './scss/global'
require('file-loader?name=[name].[ext]!./index.html');
ReactDOM.render(<App />, document.getElementById("root"));