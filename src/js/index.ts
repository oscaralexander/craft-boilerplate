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
import Accordeon from './components/Accordeon';
import Analytics from './components/Analytics';
import Announcement from './components/Announcement';
import Appear from './components/Appear';
import CookieConsent from './components/CookieConsent';
import Equinox from './components/Equinox';
import Hero from './components/Hero';
import Lightbox from './components/Lightbox';
import Modal from './components/Modal';
import Nav from './components/Nav';
// import SmoothScroll from './components/SmoothScroll';
import TextSplit from './components/TextSplit';
import Ticker from './components/Ticker';

window.addEventListener('DOMContentLoaded', () => {
    window.__APP__ = new App([
        { component: Equinox, name: 'equinox' },
        { component: Appear, name: 'appear' },
        { component: Accordeon, name: 'accordeon' },
        { component: Analytics, name: 'analytics', selector: '[data-ga-event]' },
        { component: Announcement, name: 'announcement' },
        { component: CookieConsent, name: 'cookieConsent' },
        { component: Hero, name: 'hero' },
        { component: Lightbox, name: 'lightbox' },
        { component: Modal, name: 'modal' },
        { component: Nav, name: 'nav' },
        // { component: SmoothScroll, name: 'smoothScroll' },
        { component: TextSplit, name: 'textSplit' },
        { component: Ticker, name: 'ticker' },
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
