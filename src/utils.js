import ResizeSensor from 'css-element-queries/src/ResizeSensor';

export
/**
 * It monitors container width and setStatus when changed.
 *
 * Do not forget to call component lifecyle methods.
 */
class ContainerClientWidthListener {
  /**
   * Function to get element to monitor
   * (jsdoc-to-assert does not support callback?)
   * @callback containerGetter
   * @returns {HTMLElement} element
   */
  /**
   * @param {React.Element} owner React element
   * @param {containerGetter} containerGetter Function to get element to monitor
   * @param {string} statusName Status name to set the container width
   */
  constructor(owner, containerGetter, statusName) {
    this.owner = owner;
    this.containerGetter = containerGetter;
    this.statusName = statusName;
    this.handleResize = this.updateContainerWidth.bind(this);
  }
  componentDidMount() {
    this.updateContainerWidth();
    this.resizeSensor = new ResizeSensor(this.containerGetter(), this.handleResize);
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.owner.state[this.statusName] !== prevState[this.statusName]) {
      // Visibility change of scrollbar may trigger this event.
      // If this handler changes container width, it may change scrollbar visibility.
      // There is a condition of infinite flippings of scrollbar visibility.
      return;
    }
    this.updateContainerWidth();
  }
  componentWillUnmount() {
    this.resizeSensor.detach();
  }
  /** @private */
  updateContainerWidth() {
    const newWidth = this.containerGetter().clientWidth;
    if (newWidth !== this.owner.state[this.statusName]) {
      const status = {};
      status[this.statusName] = newWidth;
      this.owner.setState(status);
    }
  }
}

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
