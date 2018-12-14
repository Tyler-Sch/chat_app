import React from 'react';


class ActiveGroupBox extends React.Component {
  // need a key for map
  constructor(props) {
    super(props);
  }
  scrollToBottom() {
    this.messagesEnd.scrollIntoView();
  }
  componentDidMount() {
    this.scrollToBottom();
  }
  componentDidUpdate() {
    this.messagesEnd.scrollIntoView();
  }

  render() {
    const messages = this.props.messageList.map((message) => {
      return (
        <MessageTile key={message.message_id} messageInfo={message} />
      )
    });

    return (
      <div className="message-box is-paddingless is-marginless">
        {messages}
        <div ref={(el) => { this.messagesEnd = el; }}></div>
      </div>

    )
  }
}

class MessageTile extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <article className="message-tile">
        <div
          className="columns is-mobile message-tile-head"
          style={{ paddingBottom: 0, marginBottom: "-.8em" }}
        >
          <p className="column is-size-5 has-text-success">{this.props.messageInfo.author}</p>
          <p className="column is-narrow is-size-7 has-text-success">{this.props.messageInfo.time}</p>
        </div>
        <p className="has-text-white-ter message-text">{this.props.messageInfo.message}</p>
      </article>

    )
  }
}

class MessageInput extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div id="message-box-input">
        <div className="field has-addons">
          <div className="control is-expanded">
            <input
              className="input"
              type="text"
              placeholder="Enter message"
              value={this.props.val}
              onChange={this.props.chng}
              onKeyDown={this.props.waitForEnter}
            />
          </div>
          <div className="control">
            <button onClick={this.props.click} className="button is-info">send</button>
          </div>
         </div>
        </div>
    )
  }
}

export default ActiveGroupBox;
export { MessageInput };
