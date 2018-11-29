import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';



class Message extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <p>{this.props.message}</p>
  }
}

class InputForm extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <form onSubmit={this.props.addMessage}>
        <div className='field'>
          <input
          name="messageInput"
          placeholder="message?"
          type="text"
          className="input is-small"
          value={this.props.currentVal}
          onChange={this.props.handleChange}
           />

        </div>
        <input type="submit" className="button is-primary is-small" value="submit" />
      </form>
    )
  }

}

class Logout extends React.Component {
  constructor(props) {
    super(props);
    this.handleclick = this.handleclick.bind(this);
  }
  handleclick() {
    this.props.sock.emit('logoff',{"logoff":true});
  }
  render() {
    return (
      <button class="is-text" onClick={this.handleclick}> logout</button>
    )
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      "messages":[],
      "message":""
    };

    this.socket = io("http://localhost");
    this.addMessage = this.addMessage.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);

  }
  componentDidMount() {

    this.socket.on('gotMessage',(data) => {
      const message = data.newMessage;
      const new_arr = this.state.messages.concat(message);
      this.setState({
        'messages' : new_arr
      });
    })
    this.socket.on('logOffProcessed', (data) => {
        window.location = 'chat/login';
    })
    this.socket.on('connect_response', (data) => {
        console.log(data);
        if (data.authenticated == false) {
            window.location = 'chat/login';
      }
      this.setState({
        'messages':data.messages
      })
    })

  }

  addMessage(event) {
    event.preventDefault();
    this.socket.emit("sendMessage", {'message':this.state.message});
    this.setState({"message":""});
  }
  handleInputChange(event) {
    this.setState({'message':event.target.value});

  }
  render() {
    return (
      <selection className='selection'>
        <Logout sock={this.socket} />
        <div className="container">
          <div className="column is-one-third">
            <h1 className="title">hi!</h1>
            {this.state.messages.map((m) => {
              return <Message message={m} />
            })}
          </div>
          <InputForm
          addMessage={this.addMessage}
          currentVal={this.state.message}
          handleChange={this.handleInputChange}
           />
        </div>
      </selection>
    )
  }
}

ReactDOM.render(
  <App />,
  document.querySelector("#root")
);
