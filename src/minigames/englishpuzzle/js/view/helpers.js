export default {
  setText(selector, content) {
    const elem = document.querySelector(selector);
    elem.innerText = content;
  },

  drawWord(word) {
    this.setText('#transcript', word);
  },

  drawTranscript(word) {
    this.setText('#transcript-2', word);
  },

  drawTranslation(word) {
    this.setText('#translation', word);
  },

  drawEnPhrase(phrase) {
    this.setText('.english-translate', phrase);
  },

  drawRuPhrase(phrase) {
    this.setText('.data-translate', phrase);
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
