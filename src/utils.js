/**
 * Send Google Analytics event if Google Analytics is loaded.
 * @param {!string} category
 * @param {string} action
 * @param {?string} label
 * @returns {void}
 */
export function sendGoogleAnalyticsEvent(category, action, label) {
  if (window.ga) {
    window.ga('send', 'event', category, action, label);
  }
}

export function openFeedback() {
  const formUrl = `https://docs.google.com/forms/d/13YG0Yw-qcVFyk1mvz9WsBK0lIowT_sGvi4vDmzDKjuU/viewform?entry.2146921250=${encodeURIComponent(window.location.href)}&entry.111224920`;
  window.open(formUrl);
}
