export default class Nav {
    $el: HTMLElement;

    constructor($el: HTMLElement) {
        this.$el = $el;
        this.initListeners();
    }

    initListeners(): void {
        window.addEventListener('scroll', this.onScroll.bind(this), false);
    }

    onScroll(): void {
        this.$el.classList.toggle('has-scrolled', window.scrollY > 0);
    }
}
