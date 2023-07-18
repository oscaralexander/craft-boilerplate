import gsap from 'gsap';

export default class Hero {
    $el: HTMLElement;
    $$images: NodeListOf<HTMLElement>;
    $images: HTMLElement;
    currentImageIndex: number;
    numImages: number;

    constructor($el: HTMLElement) {
        this.$el = $el;

        this.$$images = this.$el.querySelectorAll('.js-heroImage');
        this.$images = this.$el.querySelector('.js-heroImages')!;
        this.currentImageIndex = 0;
        this.isInteracted = false;
        this.numImages = this.$$images.length;

        console.log(this.numImages);

        this.initListeners();
    }

    getElementByIndexAttr($$elements: NodeListOf<HTMLElement>, index: number): HTMLElement | undefined {
        const $el = Array.from($$elements).find(($el) => {
            const i: number | null = Number($el.dataset.index ?? null);

            if (i !== null) {
                return i === index;
            }

            return false;
        });

        return $el;
    }

    initListeners(): void {}

    showImage(index: number): void {
        if (index === this.currentImageIndex) return;

        const $image = this.$images.querySelector(`[data-index="${index}"]`);
        // const $nextImageBullet = this.getElementByIndexAttr(this.$$caseNavItems, index);

        // Deactivate all nav items
        // this.$$nextImageBullets.forEach(($nextImageBullet) => $caseNavItem.classList.remove('is-active'));

        // Active next nav item
        // if ($nextNavItem) {
        //     $nextNavItem.classList.add('is-active');
        // }

        // Animate images
        if ($image) {
            this.$images.append($image);

            gsap.fromTo(
                this.$images,
                {
                    '--progress-in': 1,
                    '--progress-out': 0,
                },
                {
                    '--progress-in': 0,
                    '--progress-out': 1,
                    duration: 0.75,
                    ease: 'power2.inOut',
                }
            );
        }

        this.currentImageIndex = index;
    }

    /**
     * Getters & setters
     */

    get isInteracted(): boolean {
        return this.$el.classList.contains('is-interacted');
    }

    set isInteracted(isInteracted: boolean) {
        this.$el.classList.toggle('is-interacted', isInteracted);
    }
}
