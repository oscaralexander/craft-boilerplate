import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

gsap.registerPlugin(ScrollTrigger);

export default class SmoothScroll {
    $el: HTMLElement;
    lenis: Lenis;

    constructor($el: HTMLElement) {
        this.$el = $el;

        /**
         * https://github.com/studio-freight/lenis
         * https://greensock.com/docs/v3/Plugins/ScrollTrigger
         */
        this.lenis = new Lenis({
            lerp: 0.25,
        });

        this.lenis.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
            this.lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);

        window.requestAnimationFrame(this.requestAnimationFrame.bind(this));
    }

    requestAnimationFrame(time: number): void {
        this.lenis.raf(time);
        window.requestAnimationFrame(this.requestAnimationFrame.bind(this));
    }
}
