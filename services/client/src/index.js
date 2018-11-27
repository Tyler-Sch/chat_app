import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';



class Message extends React.Component {
  constructor(props) {
    super(props);
    this.handleclick = this.handleclick.bind(this)
  }
  handleclick(e) {
    this.props.sock.emit('sendMessage',{'message':'sending from react client'})
    console.log(this.props)
  }
  componentDidMount() {
    this.props.sock.emit('test',{'madeUpData':'gotIt'});
    console.log('data sent');
    this.props.sock.on('test_passed', (e) => {
      console.log('data recieved');
      console.log(e);
    })
  }

  render() {
    return <p onClick={this.handleclick}> {this.props.message}</p>
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {"messages":['test1','test2']};
    this.socket = io("http://localhost");

  }
  componentDidMount() {
    //console.log('mounted');

    //this.socket.emit('test',{'madeUpData':"gotIt"});
    //console.log('data sent');
    //this.socket.on('test_passed', (e) => {
    //  console.log("data recieved");
    //  console.log(e);

    this.socket.on('gotMessage',(data) => {
      const message = data.newMessage;
      console.log(message);
      const new_arr = this.state.messages.concat(message);
      console.log(new_arr[0])
      this.setState({
        'messages' : new_arr
      });
    })
  }
  render() {
    return (
      <selection className='selection'>
        <div className="container">
          <div className="column is-one-third">
            <h1 className="title">hi!</h1>
            {this.state.messages.map((m) => {
              return <Message message={m} sock={this.socket} />
            })}
          </div>
        </div>
      </selection>
    )
  }
}

ReactDOM.render(
  <App />,
  document.querySelector("#root")
);
