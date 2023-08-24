import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default class TextSplit {
    $el: HTMLElement;
    content: string;

    constructor($el: HTMLElement) {
        this.$el = $el;
        this.content = (this.$el.textContent ?? '').trim();

        this.split();
        this.initListeners();
    }

    initListeners(): void {
        const resizeObserver = new ResizeObserver(([entry]) => {
            this.updateLineIndexes();
        });

        resizeObserver.observe(this.$el);
    }

    split(): void {
        const words = this.content.split(' ');
        let charCounter = -1;
        let wordCounter = -1;
        this.$el.innerHTML = '';

        words.forEach((word) => {
            const $word = document.createElement('span');
            $word.className = 'word';
            $word.style.setProperty('--word-index', String(++wordCounter));
            this.$el.appendChild($word);

            word.split('').forEach((char) => {
                const $char = document.createElement('span');
                $char.className = 'char';
                $char.style.setProperty('--char-index', String(++charCounter));
                $char.textContent = char;
                $word.appendChild($char);
            });
        });

        this.$el.style.setProperty('--num-chars', String(charCounter));
        this.$el.style.setProperty('--num-words', String(wordCounter));
        this.updateLineIndexes();

        ScrollTrigger.create({
            once: true,
            toggleClass: 'is-textSplitVisible',
            trigger: this.$el,
        });
    }

    updateLineIndexes(): void {
        const $$words = this.$el.querySelectorAll('.word');
        let currentOffsetTop = -1;
        let lineCounter = -1;

        $$words.forEach(($word) => {
            if ($word instanceof HTMLElement) {
                if ($word.offsetTop !== currentOffsetTop) {
                    currentOffsetTop = $word.offsetTop;
                    lineCounter++;
                }

                $word.style.setProperty('--line-index', String(lineCounter));
            }
        });

        this.$el.style.setProperty('--num-lines', String(lineCounter));
    }
}
