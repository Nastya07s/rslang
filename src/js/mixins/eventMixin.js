/* eslint-disable no-underscore-dangle */

const eventMixin = {
  on(eventName, handler) {
    if (!this._eventHandlers) this._eventHandlers = {};
    if (!this._eventHandlers[eventName]) {
      this._eventHandlers[eventName] = [];
    }
    this._eventHandlers[eventName].push(handler);
  },

  off(eventName) {
    const handlers = this._eventHandlers && this._eventHandlers[eventName];
    if (!handlers) return;
    handlers.length = 0;
  },

  emit(eventName, ...args) {
    if (!this._eventHandlers || !this._eventHandlers[eventName]) {
      return;
    }

    this._eventHandlers[eventName].forEach((handler) => handler.apply(this, args));
  },
};

export default eventMixin;
