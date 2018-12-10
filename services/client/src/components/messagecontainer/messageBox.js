import React from 'react';


class ActiveGroupBox extends React.Component {
  // need a key for map
  constructor(props) {
    super(props);
  }

  render() {
    const messages = this.props.messageList.map((message) => {
      return (
        <MessageTile messageInfo={message} />
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
        <div class="columns is-mobile">
          <p class="column is-size-5 has-text-success">{this.props.messageInfo.username}</p>
          <p class="column is-narrow is-size-7 has-text-success">{this.props.messageInfo.time}</p>
        </div>
        <p class="has-text-white-ter">{this.props.messageInfo.message}</p>
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
        <div class="field has-addons">
          <div class="control is-expanded">
            <input class="input" type="text" placeholder="Find a repository" />
          </div>
          <div class="control">
            <button class="button is-info">send</button>
          </div>
         </div>
        </div>
    )
  }
}

export default ActiveGroupBox;
export { MessageInput };
