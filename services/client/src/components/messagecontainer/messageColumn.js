import React from 'react';
import ActiveGroupBox from "./messageBox.js";
import { MessageInput } from "./messageBox.js";


class MessageColumn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      "currentMessages":[],
      "messageInput":""
    };
    this.handleChange = this.handleChange.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }
  fetchMessages() {
    console.log("fetching messages")
    this.props.socket.emit("requestMessages", {
      "targetRoom": this.props.activeRoom
    });
    console.log(this.props.activeRoom);
  }
  componentDidMount() {
    console.log("component mounted")
    this.fetchMessages();

    this.props.socket.on("roomMessages", (data) => {
      console.log(data);
      this.setState({
        "currentMessages": data.messages
      });
    })
    this.props.socket.on("newMessage", (data) => {
      if (data.targetRoom == this.props.activeRoom) {
        const newMessageArray = [...this.state.currentMessages, data.message];
        this.setState({
          "currentMessages": newMessageArray
        });
      }
    });
  }
  handleChange(data) {
    this.setState({
      "messageInput": data.target.value
    });
  }

  sendMessage() {
    this.props.socket.emit("sendMessage", {
      "targetRoom": this.props.activeRoom,
      "message": this.state.messageInput
    });
    this.setState({
      "messageInput": ""
    });
  }

  render() {
    return (
        <div className="column message-box is-paddingless" id="message-column">
          <div id="message-box-head">
            <p className="has-text-white-ter has-text-centered is-size-5">Message Group</p>
          </div>
          <ActiveGroupBox messageList={this.state.currentMessages} />
          <MessageInput
            val={this.state.messageInput}
            chng={this.handleChange}
            click={this.sendMessage}
          />
        </div>
    )
  }
}

export default MessageColumn;
