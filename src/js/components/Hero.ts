import gsap from 'gsap';

export default class Hero {
    $$backdrops: NodeListOf<HTMLElement>;
    $el: HTMLElement;
    $backdrops: HTMLElement;
    interval: number | null;
    numBackdrops: number;
    timeout: number | null;

    constructor($el: HTMLElement) {
        this.$el = $el;
        this.$$backdrops = this.$el.querySelectorAll('.js-heroBackdrop');
        this.$backdrops = this.$el.querySelector('.js-heroBackdrops')!;
        this.interval = null;
        this.numBackdrops = this.$$backdrops.length;
        this.timeout = +(this.$el.dataset.heroTimeout ?? 5000);

        // Set loaded state when top image is loaded
        const $lastBackdropImg = this.$backdrops.querySelector('.js-heroBackdrop:last-child img');

        if ($lastBackdropImg instanceof HTMLImageElement) {
            if ($lastBackdropImg.complete) {
                this.$el.classList.add('is-loaded');
            }

            $lastBackdropImg.onload = () => {
                this.$el.classList.add('is-loaded');
            };
        } else {
            this.$el.classList.add('is-loaded');
        }

        // Set event listeners
        this.initListeners();

        // Go! 🚀
        this.start();
    }

    initListeners(): void {
        this.$el.addEventListener(
            'equinox:toggle',
            ((e: CustomEvent) => {
                if (e.detail.isVisible) {
                    this.start();
                } else {
                    this.stop();
                }
            }) as EventListener,
            false
        );

        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                this.start();
            } else {
                this.stop();
            }
        });
    }

    showNext(): void {
        const $first = this.$backdrops.querySelector('.js-heroBackdrop');

        if ($first instanceof HTMLElement) {
            if (!this.$el.classList.contains('is-animating')) {
                this.$el.classList.add('is-animating');
            }

            this.$backdrops.appendChild($first);
        }
    }

    start(): void {
        if (this.interval === null && this.timeout && this.numBackdrops > 1) {
            this.interval = setInterval(this.showNext.bind(this), this.timeout);
        }
    }

    stop(): void {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }
}
