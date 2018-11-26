import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';



class Message extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <p> {this.props.message}</p>
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {"messages":['test1','test2']}

  }
  componentDidMount() {
    console.log('mounted');
    var socket = io("http://localhost");
    socket.emit('test',{'madeUpData':"gotIt"});
    console.log('data sent');
    socket.on('test_passed', (e) => {
      console.log("data recieved");
      console.log(e);
    })
    socket.on('gotMessage',(data) => {
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
              return <Message message={m} />
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
