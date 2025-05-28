// A simplified version of GSAP's SplitText for React
export class SplitText {
    constructor(target, options = {}) {
        this.target = typeof target === 'string'
            ? document.querySelector(target)
            : target;

        this.options = {
            type: options.type || 'chars,words,lines',
            ...options
        };

        this.originalHTML = this.target.innerHTML;
        this.chars = [];
        this.words = [];
        this.lines = [];

        this.split();
    }

    split() {
        if (!this.target) return;

        const types = this.options.type.split(',');
        const text = this.target.textContent;
        let html = '';

        // Split into words and chars
        const words = text.split(' ');

        if (types.includes('words') || types.includes('chars')) {
            words.forEach((word, wordIndex) => {
                let wordHTML = '';

                if (types.includes('chars')) {
                    for (let i = 0; i < word.length; i++) {
                        const char = word[i];
                        wordHTML += `<span class="char char-${this.chars.length}">${char}</span>`;
                        this.chars.push(null); // Will be populated with DOM elements later
                    }
                } else {
                    wordHTML = word;
                }

                html += `<span class="word word-${wordIndex}">${wordHTML}</span>`;
                if (wordIndex < words.length - 1) html += ' ';
                this.words.push(null); // Will be populated with DOM elements later
            });

            this.target.innerHTML = html;

            // Populate chars and words arrays with DOM elements
            if (types.includes('chars')) {
                this.chars = Array.from(this.target.querySelectorAll('.char'));
            }

            if (types.includes('words')) {
                this.words = Array.from(this.target.querySelectorAll('.word'));
            }
        }

        // Split into lines (requires words to be split first)
        if (types.includes('lines') && this.words.length) {
            let currentLine = [];
            let currentTop = this.words[0].offsetTop;

            this.words.forEach((word, i) => {
                if (word.offsetTop !== currentTop) {
                    // New line detected
                    this.wrapLine(currentLine);
                    currentLine = [word];
                    currentTop = word.offsetTop;
                } else {
                    currentLine.push(word);
                }

                // Handle the last line
                if (i === this.words.length - 1) {
                    this.wrapLine(currentLine);
                }
            });

            // Populate lines array with DOM elements
            this.lines = Array.from(this.target.querySelectorAll('.line'));
        }
    }

    wrapLine(wordsInLine) {
        if (!wordsInLine.length) return;

        const lineWrapper = document.createElement('span');
        lineWrapper.className = `line line-${this.lines.length}`;

        // Insert the line wrapper before the first word in the line
        wordsInLine[0].parentNode.insertBefore(lineWrapper, wordsInLine[0]);

        // Move all words in this line into the wrapper
        wordsInLine.forEach(word => {
            lineWrapper.appendChild(word);
        });
    }

    revert() {
        if (this.target) {
            this.target.innerHTML = this.originalHTML;
        }
    }
}