import '@css/app.scss';

import App from './App';
import CookieConsent from './components/CookieConsent';
import Nav from './components/Nav';

window.__APP__ = new App([
    { component: CookieConsent, name: 'cookieConsent' },
    { component: Nav, name: 'nav' },
]);

// Vite HMR
// @ts-ignore
if (import.meta.hot) {
    // @ts-ignore
    import.meta.hot.accept(() => {
        console.log('HMR');
    });
}
