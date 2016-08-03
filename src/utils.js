import ResizeSensor from 'css-element-queries/src/ResizeSensor';

export class ContainerClientWidthListener {
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
  updateContainerWidth() {
    const newWidth = this.containerGetter().clientWidth;
    if (newWidth !== this.owner.state[this.statusName]) {
      const status = {};
      status[this.statusName] = newWidth;
      this.owner.setState(status);
    }
  }
}

export function sendGoogleAnalyticsEvent(category, action, label) {
  if (window.ga) {
    window.ga('send', 'event', category, action, label);
  }
}
