class Puzzle {
    constructor() {

    }

    createPuzzleElement(word) {
        const $boxWord = document.createElement('span');
        $boxWord.classList.add('word');
        $boxWord.innerText = word;
        return $boxWord;
    }

    drawPuzzle(selector, arrPhrase) {
        const $wordsBox = document.querySelector(selector);
        $wordsBox.innerHTML = '';
        arrPhrase.forEach((el) => {
            $wordsBox.appendChild(this.createPuzzleElement(el));
        });
    }

    reDrawPuzzle(inArr, outArr) {
        this.drawPuzzle('.words', inArr);
        this.drawPuzzle('.boxes', outArr);
    }
}

export default Puzzle;