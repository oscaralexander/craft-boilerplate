export default class Nav {
    $$subMenuToggles: NodeListOf<HTMLInputElement>;
    $el: HTMLElement;
    $overlay: HTMLElement;
    $menuToggle: HTMLInputElement;
    scrollDirection: 'down' | 'up';
    scrollY: number;

    constructor($el: HTMLElement) {
        this.$el = $el;
        this.$$subMenuToggles = this.$el.querySelectorAll('.js-navSubMenuToggle');
        this.$overlay = this.$el.querySelector('.js-navOverlay')!;
        this.$menuToggle = document.getElementById('menuToggle')! as HTMLInputElement;
        this.scrollDirection = 'down';
        this.scrollY = window.scrollY;

        this.initListeners();
    }

    initListeners(): void {
        window.addEventListener(
            'scroll',
            () => {
                const scrollDirection = this.scrollY > 0 && window.scrollY < this.scrollY ? 'up' : 'down';

                if (scrollDirection !== this.scrollDirection) {
                    this.$el.classList.toggle('is-scrollingUp', scrollDirection === 'up');
                    this.scrollDirection = scrollDirection;
                }

                this.$el.classList.toggle('is-sticky', window.scrollY > this.$el.offsetTop - window.scrollY);
                this.scrollY = window.scrollY;
            },
            false
        );

        this.$menuToggle.addEventListener('change', () => {
            document.body.classList.toggle('is-menuVisible', this.$menuToggle.checked);
        });

        this.$overlay.addEventListener('pointerdown', () => {
            this.$menuToggle.checked = false;
        });

        this.$$subMenuToggles.forEach(($subMenuToggle) => {
            $subMenuToggle.addEventListener('click', this.onToggleSubMenu.bind(this), true);
        });
    }

    onToggleSubMenu(e: Event): void {
        e.preventDefault();
        const $subMenuToggle = e.currentTarget;

        if ($subMenuToggle instanceof HTMLElement) {
            const $subMenu = $subMenuToggle.parentElement?.querySelector('.js-navSubMenu');
            const isExpanded = $subMenuToggle.getAttribute('aria-expanded') === 'true';

            if ($subMenu instanceof HTMLElement) {
                $subMenu.style.maxHeight = `${isExpanded ? 0 : $subMenu.scrollHeight}px`;
            }

            $subMenuToggle.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
        }
    }
}
