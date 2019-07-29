import React from 'react';

import Timer from './Timer';

class TimerWraper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: '',
      name: '',
      startTime: 0,
      currentTime: 0,
      sound: '',
      hours: 0,
      minutes: 0,
      seconds: 0,
      isPaused: true,
      editing: false,
      newName: ''
    };

    this.input = React.createRef();
    this.keys = { ESC: 27, ENTER: 13 };
  }

  componentDidMount() {
    const { timer } = this.props;
    this.setState({
      _id: timer._id,
      name: timer.name,
      sound: timer.sound,
      startTime: parseInt(timer.startTime),
      currentTime: parseInt(timer.currentTime) || parseInt(timer.startTime)
    });
  }

  componentWillUnmount() {
    this.pause();
  }

  start = () => {
    this.timer = setInterval(() => {
      this.setState(prevState => {
        if (prevState.currentTime <= 0) {
          this.props.onTimerFinish(); // react throws an error in the console for this!
          this.setState({ currentTime: this.state.startTime });
          return this.pause();
        } else return { currentTime: prevState.currentTime - 1000 };
      });
    }, 1000);
  };

  pause = () => {
    clearInterval(this.timer);
    delete this.timer;
    this.props.resumeWastedTimer();
  };

  resume = () => {
    if (!this.timer) this.start();
    this.props.pauseWastedTimer();
  };

  handleClick = () => {
    if (this.state.isPaused) this.resume();
    else this.pause();
    this.setState(prevState => ({ isPaused: !prevState.isPaused }));
  };

  setTimer = (hours, minutes, seconds) => {
    const ms = seconds * 1000 + minutes * 60 * 1000 + hours * 60 * 60 * 1000;
    this.setState({ startTime: ms, currentTime: ms, hours, minutes, seconds });

    if (ms !== this.state.startTime) {
      const newTimer = {
        _id: this.state._id,
        name: this.state.name,
        startTime: ms,
        currentTime: ms,
        sound: this.state.sound
      };
      this.props.onTimerUpdate(newTimer);
    }
  };

  handleChange = e => {
    this.setState({ newName: e.target.value });
  };

  handleKeyDown = e => {
    if (e.which === this.keys.ESC) {
      this.cancelEdit();
    } else if (e.which === this.keys.ENTER) {
      const newTimer = {
        _id: this.state._id,
        name: this.state.newName,
        startTime: this.state.startTime,
        currentTime: this.state.currentTime,
        sound: this.state.sound
      };
      this.setState({ ...newTimer, newName: '', editing: false });
      this.props.onTimerUpdate(newTimer);
    }
  };

  handleEdit = () => {
    this.setState({ editing: true, newName: this.state.name });
  };

  cancelEdit = () => {
    this.setState({ newName: '', editing: false });
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.onReset) {
      this.setState({ currentTime: this.state.startTime });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.currentPlayingTimer !== this.state._id &&
      this.props.currentPlayingTimer === this.state._id
    ) {
      this.resume();
    } else if (
      prevProps.currentPlayingTimer === this.state._id &&
      this.props.currentPlayingTimer !== this.state._id
    ) {
      this.pause();
    } else if (!prevState.editing && this.state.editing) {
      const node = this.input.current;
      node.focus();
      node.select();
    }
  }

  setSound = e => {
    const newTimer = {
      _id: this.state._id,
      name: this.state.name,
      startTime: this.state.startTime,
      currentTime: this.state.currentTime,
      sound: e.target.innerHTML
    };

    this.props.onTimerUpdate(newTimer);
    this.setState({ sound: e.target.innerHTML });
  };

  render() {
    let seconds = Math.floor((this.state.currentTime / 1000) % 60),
      minutes = Math.floor((this.state.currentTime / (1000 * 60)) % 60),
      hours = Math.floor((this.state.currentTime / (1000 * 60 * 60)) % 24);

    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    return (
      <div className="col-sm-12 col-md-4 col-lg-3 mb-4">
        <div className="bg-dark text-white rounded shadow-sm p-3">
          <div className="form-inline">
            {this.state.editing ? (
              <input
                ref={this.input}
                name="name"
                type="text"
                value={this.state.newName}
                className="form-control mr-2"
                style={{
                  height: 38,
                  width: 150
                }}
                onChange={this.handleChange}
                onKeyDown={this.handleKeyDown}
                onBlur={this.cancelEdit}
              />
            ) : (
              <h3 onDoubleClick={this.handleEdit}>{this.state.name}</h3>
            )}
          </div>
          {/* <h3>{this.state.name}</h3> */}
          <Timer
            hours={hours}
            minutes={minutes}
            seconds={seconds}
            setTimer={this.setTimer}
            switchPlayState={this.handleClick}
            isPaused={this.state.isPaused}
            bgColor={this.props.currentPlayingTimer === this.state._id ? 'text-warning' : 'text-white'}
          />
          <div className="dropdown">
            <button
              className="btn btn-block btn-outline-success dropdown-toggle"
              type="button"
              id="dropdownMenuButton"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              {this.state.sound || '-- Select an audio -- '}
            </button>
            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <li className="dropdown-item" onClick={this.setSound}>
                clap
              </li>
              <li className="dropdown-item" onClick={this.setSound}>
                hihat
              </li>
              <li className="dropdown-item" onClick={this.setSound}>
                kick
              </li>
              <li className="dropdown-item" onClick={this.setSound}>
                openhat
              </li>
              <li className="dropdown-item" onClick={this.setSound}>
                boom
              </li>
              <li className="dropdown-item" onClick={this.setSound}>
                ride
              </li>
              <li className="dropdown-item" onClick={this.setSound}>
                snare
              </li>
              <li className="dropdown-item" onClick={this.setSound}>
                tom
              </li>
              <li className="dropdown-item" onClick={this.setSound}>
                tink
              </li>
            </div>
          </div>
          <button
            className="btn btn-block btn-danger mt-2"
            onClick={() => this.props.onDelete(this.state._id)}
          >
            Delete
          </button>
        </div>
      </div>
    );
  }
}

export default TimerWraper;
