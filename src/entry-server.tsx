import { GoogleOAuthProvider } from '@react-oauth/google';
import ReactDOMServer from 'react-dom/server';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';
import store from './Redux/store';
import i18n from "./i18n";
import "./app.scss"

export function render(url: string) {
  const html = ReactDOMServer.renderToString(
    <Provider store={store}>
      <GoogleOAuthProvider clientId="766339492046-2vqen18b95q35487bvqgj5n3f4lse9rq.apps.googleusercontent.com">
        <I18nextProvider i18n={i18n}>
          <StaticRouter location={url} >

            <App />
          </StaticRouter>
        </I18nextProvider>
      </GoogleOAuthProvider>
    </Provider>
  )
  return { html }
}
