export default class Ticker {
    $el: HTMLImageElement;

    constructor($el: HTMLImageElement) {
        this.$el = $el;

        this.initListeners();
    }

    animate(): void {}

    initListeners(): void {
        const resizeObserver = new ResizeObserver(() => this.update());
        resizeObserver.observe(this.$el);
    }

    update(): void {
        console.log('update');
    }
}
