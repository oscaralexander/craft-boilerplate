('use strict');

import { gsap } from 'gsap';

type LightboxRect = {
    height: number;
    width: number;
    x: number;
    y: number;
    scrollX?: number;
    scrollY?: number;
};

type LightboxImgProperties = {
    caption: string | null;
    height: number;
    src: string | null;
    width: number;
};

export default class Lightbox {
    $$siblings: NodeListOf<HTMLImageElement>;
    $el: HTMLImageElement;
    $lightbox: HTMLElement;
    $figure: HTMLElement;
    $figcaption: HTMLElement;
    $overlay: HTMLElement;
    $paginateNext: HTMLButtonElement;
    $paginatePrev: HTMLButtonElement;
    currentSiblingIndex: number | null;
    duration: number;
    funcOnKeyDown: (e: KeyboardEvent) => void;
    funcOnResize: () => void;
    funcOnScroll: () => void;
    isAnimating: boolean;
    isOpen: boolean;
    isPaginating: boolean;
    group: string | null;
    props: LightboxImgProperties;

    constructor($el: HTMLImageElement) {
        this.$el = $el;
        this.currentSiblingIndex = null;
        this.duration = 350;
        this.funcOnKeyDown = this.onKeyDown.bind(this);
        this.funcOnResize = this.onResize.bind(this);
        this.funcOnScroll = this.onScroll.bind(this);
        this.group = this.$el.dataset.lightboxGroup ?? null;
        this.isAnimating = false;
        this.isOpen = false;
        this.isPaginating = false;
        this.props = this.getImgProperties();

        if (this.group) {
            this.$$siblings = document.querySelectorAll(`[data-lightbox-group="${this.group}"]`);
            this.currentSiblingIndex = this.getSiblingIndex();
        }

        this.initListeners();
    }

    animate(): void {
        this.isAnimated = false;
        this.isAnimating = true;
        const rect = this.getAnimationRect();

        gsap.to(this.$figure, {
            ...rect,
            duration: this.duration / 1000,
            ease: 'power2.easeInOut',
            onComplete: () => {
                if (!this.isOpen) {
                    window.addEventListener('keydown', this.funcOnKeyDown, true);
                    window.addEventListener('resize', this.funcOnResize, true);
                    window.addEventListener('scroll', this.funcOnScroll, true);
                }

                this.isAnimated = true;
                this.isAnimating = false;
                this.isOpen = true;
            },
        });
    }

    getAnimationRect(): LightboxRect {
        const rect = this.getThumbnailRect();

        const style = window.getComputedStyle(this.$lightbox);
        const paddingX = parseInt(style.paddingLeft);
        const paddingY = parseInt(style.paddingTop);
        const maxHeight = window.innerHeight - paddingY * 2;
        const maxWidth = window.innerWidth - paddingX * 2;
        let { height, width } = this.props;

        if (this.props.height > maxHeight || this.props.width > maxWidth) {
            const ratio = Math.min(maxWidth / this.props.width, maxHeight / this.props.height);
            height = this.props.height * ratio;
            width = this.props.width * ratio;
        }

        return {
            height,
            width,
            x: (maxWidth - width) * 0.5 + paddingX - rect.x,
            y: (maxHeight - height) * 0.5 + paddingY - rect.y,
        };
    }

    getImgProperties(): LightboxImgProperties {
        const $el = this.currentSiblingIndex !== null ? this.$$siblings.item(this.currentSiblingIndex) : this.$el;

        return {
            caption: $el.dataset.lightboxCaption?.trim() ?? null,
            height: +($el.dataset.lightboxHeight ?? 0),
            src: $el.dataset.lightboxSrc?.trim() ?? null,
            width: +($el.dataset.lightboxWidth ?? 0),
        };
    }

    getSiblingIndex(): number | null {
        let currentSiblingIndex: number | null = null;

        if (this.$$siblings.length) {
            this.$$siblings.forEach(($sibling, i) => {
                if ($sibling === this.$el) {
                    currentSiblingIndex = i;
                }
            });
        }

        return currentSiblingIndex;
    }

    getThumbnailRect(): LightboxRect {
        const $el = this.currentSiblingIndex !== null ? this.$$siblings.item(this.currentSiblingIndex) : this.$el;
        const rect = $el.getBoundingClientRect();

        return {
            height: rect.height,
            width: rect.width,
            x: rect.x,
            y: rect.y,
            scrollX: window.scrollX,
            scrollY: window.scrollY,
        };
    }

    hide(): void {
        // Remove event listeners
        window.removeEventListener('keydown', this.funcOnKeyDown, true);
        window.removeEventListener('resize', this.funcOnResize, true);
        window.removeEventListener('scroll', this.funcOnScroll, true);

        this.isAnimating = true;
        this.isAnimated = false;

        // Remove overlay
        this.$overlay.classList.add('remove');

        // Remove UI
        if (this.$paginateNext && this.$paginatePrev) {
            this.$paginateNext.classList.add('remove');
            this.$paginatePrev.classList.add('remove');
        }

        // Revert image
        gsap.to(this.$figure, {
            duration: this.duration / 1000,
            ease: 'power2.easeInOut',
            height: this.$lightbox.offsetHeight,
            onComplete: () => {
                // Clean up
                this.reset();
            },
            width: this.$lightbox.offsetWidth,
            x: 0,
            y: 0,
        });
    }

    initListeners(): void {
        this.$el.addEventListener('click', this.onClick.bind(this), false);
    }

    onClick(e: PointerEvent): void {
        const rect = this.getThumbnailRect();
        const style = window.getComputedStyle(this.$el);

        this.$el.style.visibility = 'hidden';

        // Create lightbox overlay element
        this.$overlay = document.createElement('div');
        this.$overlay.addEventListener('click', this.onOverlayClick.bind(this), false);
        this.$overlay.classList.add('lightboxOverlay');

        // Create lightbox element
        this.$lightbox = document.createElement('div');
        this.$lightbox.className = 'lightbox';
        this.$lightbox.style.height = `${rect.height}px`;
        this.$lightbox.style.left = `${rect.x + (rect.scrollX ?? 0)}px`;
        this.$lightbox.style.top = `${rect.y + (rect.scrollY ?? 0)}px`;
        this.$lightbox.style.width = `${rect.width}px`;

        // Create figure element
        this.$figure = document.createElement('figure');
        this.$figure.className = 'lightbox__figure';
        this.$figure.style.backgroundImage = `url(${this.$el.src})`;
        this.$figure.style.borderRadius = style.borderRadius;
        this.$figure.style.height = `${rect.height}px`;
        this.$figure.style.width = `${rect.width}px`;

        // Create figcaption element
        this.$figcaption = document.createElement('figcaption');

        // Add elements to DOM
        this.$figure.appendChild(this.$figcaption);
        this.$lightbox.appendChild(this.$figure);
        document.body.appendChild(this.$overlay);
        document.body.appendChild(this.$lightbox);

        // Create pagination
        if (this.$$siblings.length) {
            this.$paginateNext = document.createElement('button');
            this.$paginateNext.addEventListener('click', this.showNext.bind(this), false);
            this.$paginateNext.className = 'lightboxPaginateNext';

            this.$paginatePrev = document.createElement('button');
            this.$paginatePrev.addEventListener('click', this.showPrev.bind(this), false);
            this.$paginatePrev.className = 'lightboxPaginatePrev';

            document.body.appendChild(this.$paginatePrev);
            document.body.appendChild(this.$paginateNext);
        }

        this.show();
    }

    onImgAnimationEnd(e: AnimationEvent): void {
        if (e.animationName === 'lightboxImgFadeIn') {
            const $$images = this.$figure.querySelectorAll('img:not(:last-child)');
            $$images.forEach(($img) => $img.remove());
        }
    }

    onKeyDown(e: KeyboardEvent): void {
        if (e.key === 'ArrowLeft') {
            this.showPrev();
        }

        if (e.key === 'ArrowRight') {
            this.showNext();
        }

        if (e.key === 'Escape') {
            this.hide();
        }
    }

    onOverlayClick(e: PointerEvent): void {
        this.hide();
    }

    onResize(): void {
        // window.removeEventListener('keydown', this.funcOnKeyDown, true);
        // window.removeEventListener('resize', this.funcOnResize, true);
        // window.removeEventListener('scroll', this.funcOnScroll, true);
        // this.$overlay.remove();
        // this.reset();
    }

    onScroll(): void {
        this.hide();
    }

    reset(): void {
        // Restore visibility
        if (this.currentSiblingIndex !== null) {
            this.$$siblings.item(this.currentSiblingIndex).style.visibility = 'visible';
        }

        if (this.$paginateNext && this.$paginatePrev) {
            this.$paginateNext.remove();
            this.$paginatePrev.remove();
        }

        this.$el.style.visibility = 'visible';
        this.$lightbox.remove();
        this.$overlay.remove();
        this.currentSiblingIndex = this.getSiblingIndex();
        this.isAnimating = false;
        this.isPaginating = false;
        this.isOpen = false;
    }

    show(): void {
        this.props = this.getImgProperties();

        if (this.isPaginating) {
            // Update thumbnail visibility
            this.$$siblings.forEach(($sibling, i) => {
                $sibling.style.visibility = i === this.currentSiblingIndex ? 'hidden' : 'visible';
            });

            this.updateLightbox();
        }

        window.requestAnimationFrame(() => {
            if (this.props.src) {
                // Set loading state
                this.isLoading = true;

                // Load hi-res image
                const $img = new Image();
                $img.addEventListener('animationend', this.onImgAnimationEnd.bind(this), false);
                $img.onload = () => {
                    this.$figure.appendChild($img);
                    this.isLoading = false;

                    // Remove excess images
                    const $$images = this.$figure.querySelectorAll('img:not(:last-child)');
                    $$images.forEach(($img) => $img.remove());

                    // Set caption
                    if (this.props.caption !== '') {
                        this.$figcaption.textContent = this.props.caption;
                    }

                    this.animate();
                };
                $img.src = this.props.src;
            }
        });
    }

    showNext(): void {
        if (this.isAnimating) {
            return;
        }

        if (this.currentSiblingIndex !== null) {
            this.currentSiblingIndex++;

            if (this.currentSiblingIndex === this.$$siblings.length) {
                this.currentSiblingIndex = 0;
            }

            this.$paginateNext?.focus();
            this.isPaginating = true;
            this.show();
        }
    }

    showPrev(): void {
        if (this.isAnimating) {
            return;
        }

        if (this.currentSiblingIndex !== null) {
            this.currentSiblingIndex--;

            if (this.currentSiblingIndex === -1) {
                this.currentSiblingIndex = this.$$siblings.length - 1;
            }

            this.$paginatePrev?.focus();
            this.isPaginating = true;
            this.show();
        }
    }

    updateLightbox(): void {
        const thumbnailRect = this.getThumbnailRect();

        // Update lightbox position and dimensions
        this.$lightbox.style.left = `${thumbnailRect.x + window.scrollX}px`;
        this.$lightbox.style.height = `${thumbnailRect.height}px`;
        this.$lightbox.style.top = `${thumbnailRect.y + window.scrollY}px`;
        this.$lightbox.style.width = `${thumbnailRect.width}px`;

        // Recalculate figure offset
        const figureRect = this.$figure.getBoundingClientRect();
        const x = (window.innerWidth - figureRect.width) * 0.5 - thumbnailRect.x;
        const y = (window.innerHeight - figureRect.height) * 0.5 - thumbnailRect.y;

        // Update position with GSAP
        gsap.set(this.$figure, { x, y });
    }

    /**
     * Getters & setters
     */

    get isAnimated(): boolean {
        return this.$lightbox.classList.contains('is-animated');
    }

    set isAnimated(isAnimated: boolean) {
        this.$lightbox.classList.toggle('is-animated', isAnimated);
    }

    get isLoading(): boolean {
        return this.$lightbox.classList.contains('is-loading');
    }

    set isLoading(isLoading: boolean) {
        this.$lightbox.classList.toggle('is-loading', isLoading);
    }
}
