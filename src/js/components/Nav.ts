export default class Nav {
    $$subMenuToggles: NodeListOf<HTMLInputElement>;
    $el: HTMLElement;
    $overlay: HTMLElement;
    $menuToggle: HTMLInputElement;
    scrollY: number;

    constructor($el: HTMLElement) {
        this.$el = $el;
        this.$$subMenuToggles = this.$el.querySelectorAll('.js-navSubMenuToggle');
        this.$overlay = this.$el.querySelector('.js-navOverlay')!;
        this.$menuToggle = document.getElementById('menuToggle')! as HTMLInputElement;
        this.scrollY = window.scrollY;

        this.initListeners();
    }

    initListeners(): void {
        window.addEventListener('scroll', this.onScroll.bind(this), false);

        this.$menuToggle.addEventListener('change', () => {
            document.body.classList.toggle('is-menuVisible', this.$menuToggle.checked);
        });

        this.$overlay.addEventListener('pointerdown', () => {
            this.$menuToggle.checked = false;
        });

        this.$$subMenuToggles.forEach(($subMenuToggle) => {
            $subMenuToggle.addEventListener('change', this.onToggleSubMenu.bind(this), false);
        });
    }

    onScroll(): void {
        // this.$el.classList.toggle('has-scrolled', window.scrollY > 0);
        this.$el.classList.toggle('has-scrolled', window.scrollY > this.$el.offsetHeight);
        this.$el.classList.toggle('is-scrollingUp', this.scrollY !== 0 && window.scrollY < this.scrollY);
        this.scrollY = window.scrollY;
    }

    onToggleSubMenu(e: Event): void {
        const $subMenuToggle = e.currentTarget;

        if ($subMenuToggle instanceof HTMLInputElement) {
            const $subMenuBox = $subMenuToggle.parentNode?.querySelector('.js-navSubMenuBox');

            if ($subMenuBox instanceof HTMLElement) {
                $subMenuBox.style.maxHeight = ($subMenuToggle.checked ? $subMenuBox.scrollHeight : '0') + 'px';
            }
        }
    }

    update(): void {}
}
