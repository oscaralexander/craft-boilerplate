/**
 * https://www.thyngster.com/tracking-google-analytics-4-events-using-data-attributes
 */

export default class Analytics {
    $el: HTMLElement;
    dataLayer: { [key: string]: string };

    constructor($el: HTMLElement) {
        this.$el = $el;

        if (!$el.dataset.gaEvent) {
            return;
        }

        this.dataLayer = {
            event: $el.dataset.gaEvent,
        };

        Object.entries($el.dataset).forEach((attr) => {
            const [key, value] = attr;
            const match = key.match('gaParam(.+)');

            if (match && match[1]) {
                const param = this.unCamelCase(match[1]);
                this.dataLayer[param] = value ?? '';
            }
        });

        this.initListeners();
    }

    initListeners(): void {
        this.$el.addEventListener('click', (e) => {
            window.dataLayer.push(this.dataLayer);
        });
    }

    unCamelCase(string: string, separator: string = '_'): string {
        return string
            .replace(/([a-z\d])([A-Z])/g, '$1' + separator + '$2')
            .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1' + separator + '$2')
            .toLowerCase();
    }
}
