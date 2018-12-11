import React from 'react';

class Logout extends React.Component {
  constructor(props) {
    super(props);
    this.handleclick = this.handleclick.bind(this);
  }
  handleclick() {
    window.location = "/chat/logout";
  }
  render() {
    return (
      <button
        onClick={this.handleclick}
        className="button is-danger is-small is-outlined"
        id="logout">
        logout
      </button>
    )
  }
}

export default Logout;
