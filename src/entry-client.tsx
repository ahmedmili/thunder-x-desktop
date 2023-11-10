import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { createRoot, hydrateRoot } from "react-dom/client";

import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import store from "./Redux/store";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import "./app.scss"

const container = document.getElementById("root");

const FullApp = () => (
    <React.StrictMode>
        <Provider store={store}>
            <GoogleOAuthProvider clientId="766339492046-2vqen18b95q35487bvqgj5n3f4lse9rq.apps.googleusercontent.com">
                <I18nextProvider i18n={i18n}>
                    <Router>
                        <App />
                    </Router>
                </I18nextProvider>
            </GoogleOAuthProvider>
        </Provider>
    </React.StrictMode>
);
if (import.meta.hot || !container?.innerText) {
    const root = createRoot(container!);
    root.render(<FullApp />);
} else {
    hydrateRoot(container!, <FullApp />);
}

