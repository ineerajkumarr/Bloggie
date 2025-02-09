import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { store, persistor } from "./store/store.js";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import "@fontsource/pacifico"; // Loads Pacifico font
import "@fontsource/ubuntu"; // Loads Ubuntu font
import "@fontsource/nunito"; // Loads Nunito font
import "@fontsource/dosis"; // Loads Dosis font

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
