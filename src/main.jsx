import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store,{persistor}  from "./store/index.js";
import { BrowserRouter as Router } from "react-router-dom";
import React from "react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Router>
          <App />
      </Router>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
