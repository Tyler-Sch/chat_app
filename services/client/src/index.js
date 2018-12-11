import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
import './mystyles.css';
import NavBar from './components/nav.js';
import RoomList from './components/messagecontainer/roomlist.js';
import PeopleList from "./components/messagecontainer/peoplelist.js";
import ActiveGroupBox from "./components/messagecontainer/messageBox.js";
import { MessageInput } from "./components/messagecontainer/messageBox.js";
import Logout from "./components/logout.js"

const init_rooms = [
  {
    "room":"bunnies",
    "has_checked":false,
  },
  {
    "room":"chessClub",
    "has_checked":true
  },
  {
    "room":"testRoom",
    "has_checked":false
    },
    {
      "room":"bunnies",
      "has_checked":false,
    },
    {
      "room":"chessClub",
      "has_checked":true
    },
    {
      "room":"testRoom",
      "has_checked":false
    },
    {
      "room":"bunnies",
      "has_checked":false,
    },
    {
      "room":"chessClub",
      "has_checked":true
    },
    {
      "room":"testRoom",
      "has_checked":false
    }
];

const init_people = [
  "potato",
  "chip"
]

const sampleMessages = [
  {"message_group_name":"bunnies",
   "messages": [
    {
      "username":"potato",
      "time":"3:47",
      "message":"hello there",
    },
    {
      "username":"chipz",
      "time":"3:48",
      "message":"I see you!"
    },
     {
       "username":"potato",
       "time":"3:50",
       "message":"I see you too! Checking for a lot of text a lot of text so much text what can you do? do you wrap or just increase the width of the whole page?"
     },
     {
       "username":"potato",
       "time":"3:51",
       "message":"hello there",
     },
     {
       "username":"chipz",
       "time":"3:52",
       "message":"I see you!"
     },
      {
        "username":"potato",
        "time":"3:53",
        "message":"I see you too! Checking for a lot of text a lot of text so much text what can you do? do you wrap or just increase the width of the whole page?"
      },
      {
        "username":"potato",
        "time":"3:54",
        "message":"hello there",
      },
      {
        "username":"chipz",
        "time":"3:56",
        "message":"I see you!"
      },
       {
         "username":"potato",
         "time":"3:57",
         "message":"I see you too! Checking for a lot of text a lot of text so much text what can you do? do you wrap or just increase the width of the whole page?"
       },
       {
         "username":"potato",
         "time":"3:58",
         "message":"hello there",
       },
       {
         "username":"chipz",
         "time":"3:59",
         "message":"I see you!"
       },
        {
          "username":"potato",
          "time":"3:60",
          "message":"I see you too! Checking for a lot of text a lot of text so much text what can you do? do you wrap or just increase the width of the whole page?"
        }

   ]
  }
]




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

class MessageBoxContainer extends React.Component {
  constructor(props) {
    super(props);
  }
  fetchUserRooms() {
    this.props.socket.send("requestRoomList", {
      "username": this.props.username,
      "currentRoomActive": this.props.activeGroup
    })
  }
  componentDidMount() {
    console.log(this.props);
  }
  render() {

    return (
      <div className="columns is-mobile" id="column-box">
        <div className="column is-4" id="left-column">
        <div id="leftcolumn">
          <RoomList rooms={init_rooms} />
          <PeopleList people={init_people} />
        </div>
        </div>
        <div className="column is-8" id="right-column">
          <MessageColumn
            socket={this.props.socket}
            activeRoom={this.props.activeGroup}
          />
        </div>
      </div>
    )
  }
}



class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      "username":"",
      "is_authenticated":false,
      "selectedGroupAtLog":"",
      "userId":""
    };
    // this probably needs to be updated for deployment
    this.socket = io("http://localhost");
  }

  componentDidMount() {

    this.socket.on('connect_response', (data) => {
      if (data.authenticated == false) {
        window.location = 'chat/login';
      } else {
        this.setState({
          "username": data.username,
          "userId": data.userId,
          "is_authenticated": true,
          "selectedGroupAtLog": data.selectedGroup
        });
      }
      console.log(this.state);
    });

  }

  render() {
    if (this.state.username == ""){
      return <div />
    }
    return (
      <div id="main">
        <div id="main-head">
          <p className="title has-text-white level-left">Messages</p>
          <Logout />
        </div>
        <div id="main-body" >
          <MessageBoxContainer
            socket={this.socket}
            username={this.state.username}
            activeGroup={this.state.selectedGroupAtLog}
          />
        </div>
      </div>
    )
  }
}

ReactDOM.render(
  <App />,
  document.querySelector("#root")
);
