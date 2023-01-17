import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {Provider, provider} from "react-redux";
// import store from "./redux/store";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
 <React.StrictMode>
    <App />
  </React.StrictMode>
);