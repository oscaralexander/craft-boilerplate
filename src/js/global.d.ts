import App from './App';

declare global {
    interface Element {
        __APP__: { [key: string]: unknown };
    }

    interface Window {
        __APP__: App;
    }
}
