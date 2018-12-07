import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
import './mystyles.css';

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <p className="is-size-1">Hey there</p>
      </div>
    )
  }
}

ReactDOM.render(
  <App />,
  document.querySelector("#root")
);
