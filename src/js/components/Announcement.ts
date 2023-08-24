export default class Announcement {
    $el: HTMLElement;
    $close: HTMLButtonElement;

    constructor($el: HTMLElement) {
        this.$el = $el;
        this.$close = this.$el.querySelector('.js-announcementClose')!;

        if (localStorage.getItem('announcement-hidden') === 'true') {
            this.$el.remove();
            return;
        }

        document.body.classList.add('has-announcement');
        this.initListeners();
    }

    initListeners(): void {
        this.$close.addEventListener(
            'click',
            () => {
                localStorage.setItem('announcement-hidden', 'true');
                this.$el.style.maxHeight = this.$el.scrollHeight + 'px';

                window.requestAnimationFrame(() => {
                    this.$el.classList.add('is-hiding');
                });
            },
            false
        );

        this.$el.addEventListener(
            'transitionend',
            (e: TransitionEvent) => {
                if (e.propertyName === 'max-height') {
                    document.body.classList.remove('has-announcement');
                    this.$el.remove();
                }
            },
            false
        );
    }
}
