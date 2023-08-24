'use strict';

export default class Accordeon {
    $$siblings: NodeListOf<HTMLElement> | null;
    $el: HTMLElement;
    $button: HTMLButtonElement | null;
    $content: HTMLElement | null;
    group: string | null;

    constructor($el: HTMLElement) {
        this.$el = $el;
        this.$$siblings = null;
        this.$button = this.$el.querySelector('button[aria-expanded]');
        this.$content = null;
        this.group = this.$el.dataset.accordeonGroup ?? null;

        if (this.$button) {
            const contentId = this.$button.getAttribute('aria-controls');

            if (contentId) {
                this.$content = document.getElementById(contentId)!;

                if (this.$content) {
                    this.initListeners();
                }
            }
        }

        if (this.group) {
            this.$$siblings = document.querySelectorAll(`[data-accordeon-group="${this.group}"]`);
        }
    }

    initListeners(): void {
        if (this.$button) {
            this.$button.addEventListener(
                'click',
                () => {
                    this.toggle();
                },
                false
            );
        }

        document.addEventListener(
            'accordeon:toggle',
            ((e: CustomEvent) => {
                if (e.target !== this.$el) {
                    if (e.detail.group === this.group) {
                        this.isExpanded = false;
                    }
                }
            }) as EventListener,
            false
        );
    }

    toggle(): void {
        this.isExpanded = !this.isExpanded;

        this.$el.dispatchEvent(
            new CustomEvent('accordeon:toggle', {
                bubbles: true,
                detail: {
                    group: this.group,
                    isExpanded: this.isExpanded,
                },
            })
        );
    }

    /**
     * Getters & setters
     */

    get isExpanded(): boolean {
        return this.$el.classList.contains('is-expanded');
    }

    set isExpanded(isExpanded: boolean) {
        this.$el.classList.toggle('is-expanded', isExpanded);

        if (this.$button) {
            this.$button.setAttribute('aria-expanded', String(isExpanded));
        }

        if (this.$content) {
            if (isExpanded) {
                this.$content.style.maxHeight = this.$content.scrollHeight + 'px';
                this.$content.removeAttribute('hidden');
            } else {
                this.$content.setAttribute('hidden', '');
            }
        }
    }
}
