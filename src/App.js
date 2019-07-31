import React, { Component, Fragment } from 'react';

import TimerWraper from './Components/Timer/TimerWraper';
import WastedTime from './Components/Timer/WastedTime';

const shortid = require('shortid');

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timers: [
        // {
        //   _id: '#1',
        //   name: '40 Mins Work',
        //   tags: [],
        //   startTime: 0,
        //   currentTime: 0
        // }
      ],
      isPlaying: false,
      doReset: false,
      currentPlayingTimer: '',
      puasedTimer: '',
      finishedTimer: '',
      wastedTime: 0,
      isWastedTimePaused: true,
      audioTimer: 20000,
      isAdding: false,
      rounds: 0,
      name: ''
    };

    this.defaultTimer = {
      startTime: 0,
      sound: 'tom'
    };
    this.keys = { ESC: 27, ENTER: 13 };
    this.input = React.createRef();
  }

  componentDidMount() {
    this.setState({
      timers: JSON.parse(localStorage.getItem('timers')) || []
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.isAdding && this.state.isAdding) {
      const node = this.input.current;
      node.focus();
      node.select();
    }
  }

  _addTimer = () => {
    const newTimers = [
      ...this.state.timers,
      { ...this.defaultTimer, name: this.state.name, _id: shortid.generate() }
    ];
    this.setState({ timers: newTimers });
    this.setState({ name: '', isAdding: false });
    localStorage.setItem('timers', JSON.stringify(newTimers));
  };

  handleAddTimer = () => {
    if (this.state.isAdding) {
      this._addTimer();
    } else {
      this.setState({ isAdding: true });
    }
  };

  handleDeleteTimer = () => {
    this.setState({ isDeleting: true });
  };

  handleCancel = () => {
    this.setState({ isAdding: false, isDeleting: false });
  };

  handleChange = e => {
    this.setState({ name: e.target.value });
  };

  handleKeyDown = e => {
    if (e.which === this.keys.ESC) {
      this.setState({ name: '', isAdding: false });
    } else if (e.which === this.keys.ENTER) {
      this._addTimer();
    }
  };

  onTimerUpdate = newTimer => {
    const oldTimerIdx = this.state.timers.findIndex(t => t._id === newTimer._id);
    const updatedTimers = [
      ...this.state.timers.slice(0, oldTimerIdx),
      newTimer,
      ...this.state.timers.slice(oldTimerIdx + 1)
    ];

    this.setState({ timers: updatedTimers });
    localStorage.removeItem('timers');
    localStorage.setItem('timers', JSON.stringify(updatedTimers));
  };

  onDelete = id => {
    const timerIdx = this.state.timers.findIndex(t => t._id === id);
    const updatedTimers = [...this.state.timers.slice(0, timerIdx), ...this.state.timers.slice(timerIdx + 1)];

    this.setState({ timers: updatedTimers });
    localStorage.removeItem('timers');
    localStorage.setItem('timers', JSON.stringify(updatedTimers));
  };

  startWastedTimer = () => {
    this.wastedTime = setInterval(() => {
      this.setState(prevState => ({ wastedTime: prevState.wastedTime + 1000 }));
    }, 1000);
  };

  pauseWastedTimer = () => {
    clearInterval(this.wastedTime);
    delete this.wastedTime;
    this.setState({ isWastedTimePaused: true });
  };

  resumeWastedTimer = () => {
    if (!this.wastedTime) this.startWastedTimer();
    this.setState({ isWastedTimePaused: false });
  };

  handlePauseWastedTime = () => {
    this.pauseWastedTimer();
    this.setState({ isWastedTimePaused: true });
  };

  startTimer = () => {
    if (this.state.timers[0]) {
      this.setState({ isPlaying: true, currentPlayingTimer: this.state.timers[0]._id, doReset: false });
    }
  };

  startNextTimer = () => {
    const nextTimerIdx = this.state.timers.findIndex(t => t._id === this.state.finishedTimer) + 1;
    let updatedState = {};

    if (nextTimerIdx < this.state.timers.length) {
      updatedState = {
        currentPlayingTimer: this.state.timers[nextTimerIdx]._id,
        puasedTimer: '',
        finishedTimer: ''
      };
    } else if (this.state.timers[0]) {
      updatedState = {
        currentPlayingTimer: this.state.timers[0]._id,
        puasedTimer: '',
        finishedTimer: '',
        rounds: this.state.rounds + 1
      };
    }

    this.setState({ ...updatedState, audioTimer: 20000 });
    this._stopAudio();
  };

  pauseTimer = () => {
    this.setState(prevState => ({ currentPlayingTimer: '', puasedTimer: prevState.currentPlayingTimer }));
  };

  resumeTimer = () => {
    this.setState(prevState => ({ currentPlayingTimer: prevState.puasedTimer, puasedTimer: '' }));
  };

  resetTimer = () => {
    this.pauseWastedTimer();
    this.setState({
      timers: JSON.parse(localStorage.getItem('timers')) || [],
      isPlaying: false,
      currentPlayingTimer: '',
      puasedTimer: '',
      finishedTimer: '',
      wastedTime: 0,
      audioTimer: 20000,
      isWastedTimePaused: true,
      doReset: true,
      rounds: 0
    });
    this._stopAudio();
  };

  onTimerFinish = () => {
    const finishedTimer = this.state.timers.find(t => t._id === this.state.currentPlayingTimer);
    this.audio = document.getElementById('audio_' + finishedTimer._id);

    this.setState(prevState => ({
      currentPlayingTimer: '',
      pausedTimer: '',
      finishedTimer: prevState.currentPlayingTimer
    }));

    this._startAudio();
  };

  switchPlayState = () => {
    if (this.state.currentPlayingTimer) {
      this.pauseTimer();
    } else {
      this.resumeTimer();
    }
  };

  _startAudio = () => {
    this.audio.play();
    this.audioTime = setInterval(() => {
      if (this.state.audioTimer <= 0) {
        this._stopAudio();
      } else {
        this.setState(prevState => ({ audioTimer: prevState.audioTimer - 1000 }));
      }
    }, 1000);
  };

  _stopAudio = () => {
    if (this.audioTime) {
      this.audio.pause();
      this.audio.currentTime = 0;
      clearInterval(this.audioTime);
    }
  };

  render() {
    return (
      <div className="container-fluid p-4">
        <div className="row">
          <div className="col-12 col-md-3">
            {this.state.finishedTimer && (
              <div className="alert alert-success" role="alert">
                <strong>
                  {
                    this.state.timers[this.state.timers.findIndex(t => t._id === this.state.finishedTimer)]
                      .name
                  }
                </strong>{' '}
                timer has finished playing
                <button className="btn btn-success ml-2" onClick={this.startNextTimer}>
                  Continue
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="row">
          {this.state.timers.map(t => (
            <TimerWraper
              key={t._id}
              timer={t}
              timers={this.state.timers}
              isPlaying={this.state.isPlaying}
              currentPlayingTimer={this.state.currentPlayingTimer}
              resumeWastedTimer={this.resumeWastedTimer}
              pauseWastedTimer={this.pauseWastedTimer}
              onTimerFinish={this.onTimerFinish}
              onTimerUpdate={this.onTimerUpdate}
              onReset={this.state.doReset}
              onDelete={this.onDelete}
            />
          ))}
          <div className="col-sm-12 col-md-6 col-lg-4 mb-4">
            <div className="row no-gutters">
              {this.state.isPlaying ? (
                <button className="btn btn btn-warning mb-3 shadow-sm w-150" onClick={this.switchPlayState}>
                  {this.state.currentPlayingTimer ? 'Pause ⏸️' : 'Continue ▶️'}
                </button>
              ) : (
                <button className="btn btn btn-warning mb-3 shadow-sm w-150" onClick={this.startTimer}>
                  Start ▶️
                </button>
              )}
            </div>
            <div className="row no-gutters">
              <button className="btn btn btn-danger mb-3 shadow-sm w-150" onClick={this.resetTimer}>
                Reset 🏁️
              </button>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12 col-md-6 col-lg-4 mb-4 form-inline">
            {this.state.isAdding && (
              <Fragment>
                <input
                  ref={this.input}
                  name="name"
                  type="text"
                  value={this.state.name}
                  className="form-control mr-2"
                  style={{
                    height: 38,
                    width: 150
                  }}
                  onChange={this.handleChange}
                  onKeyDown={this.handleKeyDown}
                />
                <button className="btn btn-danger mr-2" onClick={this.handleCancel}>
                  X
                </button>
              </Fragment>
            )}
            <button className="btn btn-primary w-150" onClick={this.handleAddTimer}>
              Add Timer
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12 col-md-4 col-lg-3 mt-4">
            <div className="bg-dark text-white rounded shadow-sm p-3">
              <div className="text-center my-4">
                <h2 className="text-muted">Finished Rounds</h2>
                <h1>{this.state.rounds}</h1>
              </div>
            </div>
          </div>
          <div className="col-sm-12 col-md-4 col-lg-3 mt-4">
            {this.state.timers.length !== 0 && (
              <WastedTime
                wastedTime={this.state.wastedTime}
                handlePauseWastedTime={this.handlePauseWastedTime}
                isWastedTimePaused={this.state.isWastedTimePaused}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}
