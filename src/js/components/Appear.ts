import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default class Appear {
    $el: HTMLElement;

    constructor($el: HTMLElement) {
        this.$el = $el;

        ScrollTrigger.create({
            once: true,
            start: 'top 90%',
            toggleClass: 'is-appear',
            trigger: this.$el,
        });
    }
}
