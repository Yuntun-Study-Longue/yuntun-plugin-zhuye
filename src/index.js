import './public-path';
import './app/utils/interceptors';
import React from "react";
import ReactDOM, { hydrate } from "react-dom";
import { Provider } from "react-redux";
import Loadable from "react-loadable";
import { Frontload } from "react-frontload";
import { ConnectedRouter } from "connected-react-router";
import createStore from "./store";

import App from "./app/app";
// import "./index.css";

// Create a store and get back itself and its history object
const { store, history } = createStore();

// Running locally, we should run on a <ConnectedRouter /> rather than on a <StaticRouter /> like on the server
// Let's also let React Frontload explicitly know we're not rendering on the server here
const Application = (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Frontload noServerRender={true}>
        <App />
      </Frontload>
    </ConnectedRouter>
  </Provider>
);

const root = document.querySelector("#root");

function render(props) {
  const { container } = props;
  ReactDOM.render(Application, container ? container.querySelector('#root') : root);
}

if (!window.__POWERED_BY_QIANKUN__) {
  render({});
}

// if (root.hasChildNodes() === true) {
//   // If it's an SSR, we use hydrate to get fast page loads by just
//   // attaching event listeners after the initial render
//   // Loadable.preloadReady().then(() => {
//     render(Application, root);
//   // });
// } else {
//   // If we're not running on the server, just render like normal
//   render(Application, root);
// }

export async function bootstrap() {
  console.log('[react16] react app bootstraped');
}

export async function mount(props) {
  console.log('[react16] props from main framework', props);
  render(props);
}

export async function unmount(props) {
  const { container } = props;
  ReactDOM.unmountComponentAtNode(container ? container.querySelector('#root') : root);
}