export default class CookieConsent {
    $el: HTMLElement;
    $btnAccept: HTMLElement;
    $btnDecline: HTMLElement;

    constructor($el: HTMLElement) {
        this.$el = $el;
        this.$btnAccept = this.$el.querySelector('.js-cookieConsentBtnAccept')!;
        this.$btnDecline = this.$el.querySelector('.js-cookieConsentBtnDecline')!;

        this.initListeners();
    }

    initListeners(): void {
        this.$btnAccept.addEventListener('click', this.onAccept.bind(this), false);
        this.$btnDecline.addEventListener('click', this.onDecline.bind(this), false);
        this.$el.addEventListener(
            'animationend',
            () => {
                this.$el.classList.add('is-hidden');
            },
            false
        );
    }

    onAccept(): void {
        localStorage.setItem('cookie-consent', 'true');
        this.$el.classList.add('is-hide');
    }

    onDecline(): void {
        localStorage.setItem('cookie-consent', 'false');
        this.$el.classList.add('is-hide');
    }
}
