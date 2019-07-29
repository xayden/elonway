import React, { Component, Fragment } from 'react';

export default class Tag extends Component {
  constructor(props) {
    super(props);
    this.state = { name: '', isAdding: false };
    this.keys = { ESC: 27, ENTER: 13 };
    this.input = React.createRef();
  }

  handleClick = () => {
    if (this.state.isAdding && this.state.name) {
      this.props.addTag(this.state.name);
      this.setState({ isAdding: false });
    } else {
      this.setState({ isAdding: true });
    }
  };

  handleCancel = () => {
    this.setState({ isAdding: false });
  };

  handleChange = e => {
    this.setState({ name: e.target.value });
  };

  handleKeyDown = e => {
    if (e.which === this.keys.ESC) {
      this.setState({ name: '', isAdding: false });
    } else if (e.which === this.keys.ENTER) {
      this.props.addTag(this.state.name);
      this.setState({ name: '', isAdding: false });
    }
  };

  componentDidUpdate(preProps, prevState) {
    if (!prevState.isAdding && this.state.isAdding) {
      const node = this.input.current;
      node.focus();
      node.select();
    }
  }

  render() {
    return (
      <div className="form-inline">
        {this.props.tags.map(t => (
          <span key={t}> {t}</span>
        ))}
        {this.state.isAdding && (
          <Fragment>
            <input
              ref={this.input}
              name="name"
              type="text"
              value={this.state.name}
              className="form-control mr-2"
              style={{
                height: 31,
                width: 100
              }}
              onChange={this.handleChange}
              onKeyDown={this.handleKeyDown}
            />
            <button className="btn btn-sm btn-danger mr-1" onClick={this.handleCancel}>
              X
            </button>
          </Fragment>
        )}
        <button className="btn btn-sm btn-outline-success" onClick={this.handleClick}>
          Add tag
        </button>
      </div>
    );
  }
}
