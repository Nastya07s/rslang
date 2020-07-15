export default {
  setText(selector, content, style) {
    const elem = document.querySelector(selector);
    elem.classList.add(style);
    elem.innerText = content;
    setTimeout(() => {
      elem.classList.remove(style);
    }, 2000);
  },

  drawWord(word) {
    this.setText('#transcript', word, 'tracking-in-expand');
  },

  drawTranscript(word) {
    this.setText('#transcript-2', word, 'tracking-in-expand');
  },

  drawTranslation(word) {
    this.setText('#translation', word, 'tracking-in-expand');
  },

  drawEnPhrase(phrase) {
    this.setText('.english-translate', phrase, 'tracking-in-expand');
  },

  drawRuPhrase(phrase) {
    this.setText('.data-translate', phrase, 'tracking-in-expand');
  },

  fadeIn(nodeCopy, duration) {
    const node = nodeCopy;
    if (getComputedStyle(node).display !== 'none') return;
    if (node.style.display === 'none') {
      node.style.display = '';
    } else {
      node.style.display = 'block';
    }
    node.style.opacity = 0;
    const start = performance.now();
    requestAnimationFrame(function tick(timestamp) {
      const easing = (timestamp - start) / duration;
      node.style.opacity = Math.min(easing, 1);
      if (easing < 1) {
        requestAnimationFrame(tick);
      } else {
        node.style.opacity = '';
      }
    });
  },

  fadeOut(node, duration) {
    const nodeCopy = node;
    nodeCopy.style.opacity = 1;
    const start = performance.now();

    requestAnimationFrame(function tick(timestamp) {
      const easing = (timestamp - start) / duration;
      nodeCopy.style.opacity = Math.max(1 - easing, 0);
      if (easing < 1) {
        requestAnimationFrame(tick);
      } else {
        nodeCopy.style.opacity = '';
        nodeCopy.style.display = 'none';
      }
    });
  },
};
