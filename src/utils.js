import React from 'react';
import ReactDOM from 'react-dom';
import ResizeSensor from 'css-element-queries/src/ResizeSensor';

export const propTypesRoute = {
  children: React.PropTypes.object,
  route: React.PropTypes.object,
  params: React.PropTypes.object,
};

export class ContainerClientWidthListener {
  constructor(owner, containerRefName, statusName) {
    this.owner = owner;
    this.containerRefName = containerRefName;
    this.statusName = statusName;
    this.handleResize = this.updateContainerWidth.bind(this);
  }
  componentDidMount() {
    this.updateContainerWidth();
    this.resizeSensor = new ResizeSensor(this.owner.refs[this.containerRefName], this.handleResize);
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
    const newWidth = ReactDOM.findDOMNode(this.owner.refs[this.containerRefName]).clientWidth;
    if (newWidth !== this.owner.state.containerWidth) {
      const status = {};
      status[this.statusName] = newWidth;
      this.owner.setState(status);
    }
  }
}
