type AppBinding = {
    component: AppComponent;
    name: string;
    options?: AppOptions;
};

type AppComponent = new (...args: any[]) => unknown;

type AppOptions = { [key: string]: boolean | number | string };

export default class App {
    bindings: AppBinding[];

    constructor(bindings: AppBinding[] = []) {
        this.bindings = bindings;
        this.init();
    }

    bind($root: Document | HTMLElement, name: string, component: AppComponent, options: AppOptions): void {
        $root.querySelectorAll(`.js-${name}`).forEach(($el) => {
            $el.__APP__ ||= {};

            if ($el.__APP__[name] === undefined) {
                $el.__APP__[name] = new component($el, options);
            }
        });
    }

    bindAll($root: Document | HTMLElement): void {
        this.bindings.forEach((binding) => {
            this.bind($root, binding.name, binding.component, binding.options || {});
        });
    }

    init(): void {
        const mutationObserver = new MutationObserver((mutations) => {
            let targets: HTMLElement[] = [];

            mutations.forEach((mutationRecord) => {
                if (mutationRecord.target instanceof HTMLElement) {
                    if (!targets.includes(mutationRecord.target)) {
                        this.bindAll(mutationRecord.target);
                        targets.push(mutationRecord.target);
                    }
                }
            });

            document.body.dispatchEvent(
                new CustomEvent('domchanged', {
                    detail: {
                        targets,
                    },
                })
            );
        });

        mutationObserver.observe(document.documentElement, {
            childList: true,
            subtree: true,
        });

        this.bindAll(document);
    }
}
