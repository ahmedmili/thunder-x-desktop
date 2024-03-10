import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { Provider } from "react-redux";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { I18nextProvider } from "react-i18next";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import store from "./Redux/store";
import "./app.scss";
import i18n from "./i18n";
interface CustomWindow extends Window {
    __INITIAL_DATA__?: any; // Adjust the type accordingly
}
const initialData = (window as CustomWindow).__INITIAL_DATA__;

const container = document.getElementById("root");

const FullApp = () => (
        <Provider store={store}>
            <GoogleOAuthProvider clientId="766339492046-2vqen18b95q35487bvqgj5n3f4lse9rq.apps.googleusercontent.com">
                <I18nextProvider i18n={i18n}>
                    <Router>
                        <App initialData={initialData} />
                    </Router>
                </I18nextProvider>
            </GoogleOAuthProvider>
        </Provider>
);
if (import.meta.hot || !container?.innerText) {
    const root = createRoot(container!);
    root.render(<FullApp />);
} else {
    hydrateRoot(container!, <FullApp />);
}
