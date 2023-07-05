import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { store } from './Redux/store';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <GoogleOAuthProvider clientId='766339492046-2vqen18b95q35487bvqgj5n3f4lse9rq.apps.googleusercontent.com'>
        <I18nextProvider i18n={i18n}>
          <Router>
            <App />
          </Router>
        </I18nextProvider>
      </GoogleOAuthProvider>
    </Provider>
  </React.StrictMode>
);
