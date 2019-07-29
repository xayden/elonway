import React, { Component, Fragment } from 'react';

export default class FollowingTimer extends Component {
  constructor(props) {
    super(props);
    this.state = { followingTimers: this.props.timers || [], isAdding: false, timerName: '' };
    this.keys = { ESC: 27, ENTER: 13 };
    this.input = React.createRef();

    this.validTimers = this.props.validTimers;
  }

  isValidName = name => {
    if (parseInt(name) <= this.validTimers.length && '#' + parseInt(name) !== this.props.thisTimer) {
      return true;
    } else {
      return false;
    }
  };

  handleClick = () => {
    this.setState({ isAdding: true });
  };

  handleChange = e => {
    this.setState({ name: e.target.value });
  };

  handleKeyDown = e => {
    if (e.which === this.keys.ESC) {
      this.setState({ name: '', isAdding: false });
    } else if (e.which === this.keys.ENTER) {
      if (this.isValidName(this.state.name)) {
        const timer = this.validTimers.filter(t => t._id === '#' + this.state.name)[0];
        this.props.addFollowingTimer(timer._id + ' ' + timer.name);
      }
      this.setState({ name: '', isAdding: false });
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.isAdding && this.state.isAdding) {
      const node = this.input.current;
      node.focus();
      node.select();
    } else if (prevProps.validTimers !== this.props.validTimers) {
      //updating this.validTimers manually :/
      this.validTimers = this.props.validTimers;
    }
  }

  render() {
    return (
      <Fragment>
        <ul>
          {this.props.followingTimers.map(t => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        {this.state.isAdding && (
          <input
            ref={this.input}
            name="name"
            type="text"
            value={this.state.name}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyDown}
          />
        )}
        <button onClick={this.handleClick}>Add timer</button>
      </Fragment>
    );
  }
}
