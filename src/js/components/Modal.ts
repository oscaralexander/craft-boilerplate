interface ModalEvent extends CustomEvent {
    detail: {
        modal: Modal;
    };
}

export default class Modal {
    $$trigger: NodeListOf<HTMLElement>;
    $$triggerHide: NodeListOf<HTMLElement>;
    $dialog: HTMLElement;
    $el: HTMLElement;

    constructor($el: HTMLElement) {
        this.$el = $el;

        const id = $el.id ?? '';
        this.$$trigger = document.querySelectorAll(`[data-modal-show="${id}"], a[href="#${id}"]`);
        this.$$triggerHide = $el.querySelectorAll('.js-modalHide, a[href="#hide"]');
        this.$dialog = $el.querySelector('[role="dialog"]')!;

        this.initListeners();
    }

    initListeners() {
        this.$el.addEventListener('click', this.onClick.bind(this), false);

        this.$$trigger.forEach(($trigger) => {
            $trigger.addEventListener('click', (e: Event) => {
                e.preventDefault();
                this.show();
            });
        });

        this.$$triggerHide.forEach(($triggerHide) => {
            $triggerHide.addEventListener('click', (e: Event) => {
                e.preventDefault();
                this.hide();
            });
        });

        document.addEventListener('keydown', this.onKeyDown.bind(this), false);
    }

    hide() {
        if (this.isVisible) {
            this.$el.dispatchEvent(
                new CustomEvent('modal:hide', {
                    detail: {
                        modal: this,
                    },
                })
            );

            // Reset forms
            this.$el.querySelectorAll('form').forEach(($form) => $form.reset());

            document.body.classList.remove('has-modal');
            this.$dialog.ariaModal = 'false';
            this.isVisible = false;
        }
    }

    onClick(e: Event): void {
        if (e.target === e.currentTarget) {
            this.hide();
        }
    }

    onHideAll(e: ModalEvent): void {
        if (e.detail.modal !== this) {
            this.hide();
        }
    }

    onInputKeyDown(e: KeyboardEvent) {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.submit();
        }
    }

    onKeyDown(e: KeyboardEvent) {
        if (e.key === 'Escape') {
            this.hide();
        }
    }

    onSubmitClick(e) {
        e.preventDefault();
        this.submit();
    }

    show() {
        document.dispatchEvent(
            new CustomEvent('modal:hideall', {
                detail: {
                    modal: this,
                },
            })
        );

        document.body.classList.add('has-modal');
        this.$dialog.ariaModal = 'true';
        this.isVisible = true;

        window.requestAnimationFrame(() => {
            this.$el.dispatchEvent(
                new CustomEvent('modal:show', {
                    detail: {
                        modal: this,
                    },
                })
            );
        });
    }

    submit() {
        this.$el.dispatchEvent(
            new CustomEvent('modal:submit', {
                detail: {
                    modal: this,
                },
            })
        );
    }

    /**
     * Getters & setters
     */

    get isVisible(): boolean {
        return this.$el.classList.contains('is-visible');
    }

    set isVisible(isVisible: boolean) {
        this.$el.classList.toggle('is-visible', isVisible);
    }
}
