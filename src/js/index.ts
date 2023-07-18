import '@css/app.scss';

declare global {
    interface Element {
        __APP__: { [key: string]: unknown };
    }

    interface Window {
        __APP__: App;
    }
}

import App from './App';
import Announcement from './components/Announcement';
import Hero from './components/Hero';
import CookieConsent from './components/CookieConsent';
import Nav from './components/Nav';

window.addEventListener('DOMContentLoaded', () => {
    window.__APP__ = new App([
        { component: Announcement, name: 'announcement' },
        { component: CookieConsent, name: 'cookieConsent' },
        { component: Hero, name: 'hero' },
        { component: Nav, name: 'nav' },
    ]);
});

// Vite HMR
// @ts-ignore
if (import.meta.hot) {
    // @ts-ignore
    import.meta.hot.accept(() => {
        console.log('HMR');
    });
}
