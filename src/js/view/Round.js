class Round {
    constructor() {

    }

    switchLoader() {
        const $loader = document.querySelector('.loader');
        const style = $loader.style.display;
        $loader.style.display = style === 'none' ? 'flex' : 'none';
    }
    
    setText(selector, content) {
        const $elem = document.querySelector(selector);
        $elem.innerText = content;
    }

    drawWord(word) {
        this.setText('#transcript', word);
    }

    drawTranslation(word) {
        this.setText('#translation', word);
    }

    drawEnPhrase(phrase) {
        this.setText('.data-translate', phrase);
    }

    drawRuPhrase(phrase) {
        this.setText('english-translate', phrase);
    }
}

export default Round;