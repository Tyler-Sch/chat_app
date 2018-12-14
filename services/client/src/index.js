import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
import './mystyles.css';
import NavBar from './components/nav.js';
import RoomList from './components/messagecontainer/roomlist.js';
import PeopleList from "./components/messagecontainer/peoplelist.js";
import MessageColumn from "./components/messagecontainer/messageColumn.js";
import Logout from "./components/logout.js"

const init_people = [
  "potato",
  "chip"
]

class MessageBoxContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      "rooms": [],
      "currentRoomActive": this.props.activeGroup
    };
    this.handleActiveGroupChange = this.handleActiveGroupChange.bind(this);
    // this is probably the place for the logic
    // if they dont have a room picked
  }

  componentDidMount() {
    this.props.socket.on("newMessage", (data) => {
      // this function handles sorting roomlist and activating
      // has_seen parameter which changes color of text when use has
      // a new message
      if (data.targetRoom != this.state.currentRoomActive) {
        const roomsTemp = this.sortRoomList(data.targetRoom, 1, false)
        this.setState({
          "rooms": roomsTemp
        });
      }
    });

    this.props.socket.on("roomListInit",(data) => {
      const rooms = data;
      if (this.props.activeGroup == "") {
        const initSelectedRoomName = this.props.activeGroup;
        const rooms = this.sortRoomList(data, initSelectedRoomName, 0, true);
        console.log("triggered");
      }


      this.setState({
        "rooms": rooms
      });
    })
    this.fetchUserRooms();
  }
  handleActiveGroupChange(e) {
    const newSelectedGroup = e.target.getAttribute("name");
    const roomsTemp = this.sortRoomList(this.state.rooms,newSelectedGroup, 0, true)
    this.setState({
      "currentRoomActive": newSelectedGroup,
      "rooms": roomsTemp
    });
  }
  sortRoomList(roomList, name, newPosition, checked) {
    const indexOfRoom = roomList.findIndex(i => i.groupName == name);
    const roomsTemp = roomList.slice(0,roomList.length);
    const selectedRoom = roomsTemp.splice(indexOfRoom, 1)[0];
    if (checked == false) {
      selectedRoom.has_checked = false;
    }
    else {
      selectedRoom.has_checked = true;
    }
    roomsTemp.splice(newPosition, 0, selectedRoom);
    return roomsTemp;

  }
  fetchUserRooms() {
    this.props.socket.emit("requestRoomList", {
      "username": this.props.username,
      "currentRoomActive": this.state.currentRoomActive
    });
  }

  render() {

    return (
      <div className="columns is-mobile" id="column-box">
        <div className="column is-4" id="left-column">
        <div id="leftcolumn">
          <RoomList
            rooms={this.state.rooms}
            handleRoomChange={this.handleActiveGroupChange}
           />
          <PeopleList people={init_people} />
        </div>
        </div>
        <div className="column is-8" id="right-column">
          <MessageColumn
            socket={this.props.socket}
            activeRoom={this.state.currentRoomActive}
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
