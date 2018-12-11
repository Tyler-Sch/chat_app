import React from 'react';


class ActiveGroupBox extends React.Component {
  // need a key for map
  constructor(props) {
    super(props);
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
      <article id="message-tile">
        <div className="columns is-mobile">
          <p className="column is-size-5 has-text-success">{this.props.messageInfo.author}</p>
          <p className="column is-narrow is-size-7 has-text-success">{this.props.messageInfo.time}</p>
        </div>
        <p className="has-text-white-ter">{this.props.messageInfo.message}</p>
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
