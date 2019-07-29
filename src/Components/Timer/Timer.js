import React, { Component } from 'react';

export default class Timer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hours: this.props.hours,
      minutes: this.props.minutes,
      seconds: this.props.seconds,
      editing: ''
    };

    this.keys = { ESC: 27, ENTER: 13 };
  }

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  save = (hours, minutes, seconds) => {
    this.props.setTimer(hours, minutes, seconds);
    this.setState({ hours, minutes, seconds, editing: '' });
  };

  handleKeyDown = e => {
    const { hours, minutes, seconds } = this.state;
    if (e.which === this.keys.ESC) {
      this.setState({ editing: '' });
    } else if (e.which === this.keys.ENTER) {
      this.save(hours, minutes, seconds);
    }
  };

  handleDoubleClick = name => {
    this.setState({ editing: name });
  };

  componentDidUpdate(preProps, prevState) {
    if (!prevState.editing && this.state.editing) {
      const node = document.getElementById(this.state.editing);
      node.focus();
      node.select();
    }
  }

  render() {
    return (
      <div className={'text-center my-4 ' + this.props.bgColor}>
        {this.state.editing === 'hours' ? (
          <input
            id="hours"
            name="hours"
            type="text"
            className="h1 text-dark"
            style={{
              height: 53,
              width: 45
            }}
            value={this.state.hours}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyDown}
            onBlur={() => this.save(this.state.hours, this.state.minutes, this.state.seconds)}
          />
        ) : (
          <span className="h1" onDoubleClick={() => this.handleDoubleClick('hours')}>
            {this.props.hours}
          </span>
        )}
        <span className="h1"> : </span>
        {this.state.editing === 'minutes' ? (
          <input
            id="minutes"
            name="minutes"
            type="text"
            className="h1 text-dark"
            style={{
              height: 53,
              width: 45
            }}
            value={this.state.minutes}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyDown}
            onBlur={() => this.save(this.state.hours, this.state.minutes, this.state.seconds)}
          />
        ) : (
          <span className="h1" onDoubleClick={() => this.handleDoubleClick('minutes')}>
            {this.props.minutes}
          </span>
        )}
        <span className="h1"> : </span>
        {this.state.editing === 'seconds' ? (
          <input
            id="seconds"
            name="seconds"
            type="text"
            className="h1 text-dark"
            style={{
              height: 53,
              width: 45
            }}
            value={this.state.seconds}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyDown}
            onBlur={() => this.save(this.state.hours, this.state.minutes, this.state.seconds)}
          />
        ) : (
          <span className="h1" onDoubleClick={() => this.handleDoubleClick('seconds')}>
            {this.props.seconds}
          </span>
        )}
        <br />
        {/* <button onClick={this.props.switchPlayState}>
          {this.props.isPaused ? 'Continue ▶️' : 'Pause ⏸️'}
        </button> */}
      </div>
    );
  }
}
