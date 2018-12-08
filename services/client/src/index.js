import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
import './mystyles.css';
import NavBar from './components/nav.js';
import RoomList from './components/messagecontainer/roomlist.js';

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
  }
];

const init_people = [
  "potato",
  "chip"
]


class PeopleList extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const peopleList = this.props.people.map((person) => {
      return (<Person personName={person} />)
        });
    return (
      <div id="peoplelist">
        <div id="people-list-head">
          <p class="has-text-white-ter subtile is-size-6 has-text-centered ">People</p>
        </div>
        <div id="people-list-body">
           {peopleList}
        </div>
      </div>
    )
  }
}

class Person extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <p class="has-text-grey-light is-size-6">{this.props.personName}</p>
    )
  }
}

class MessageBoxContainer extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="columns is-mobile" id="column-box">
        <div className="column is-3" id="left-column">
          <LeftColumn />
        </div>
        <div className="column is-9" id="right-column">
          <RightColumn />
        </div>
      </div>
    )
  }
}

class RightColumn extends React.Component {
  render() {
    return (
      <div>Second Column</div>
    )
  }
}

class LeftColumn extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="main">
        <RoomList rooms={init_rooms} />
        <PeopleList people={init_people} />
      </div>
    )
  }
}




class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="main">
        <div>
          <p className="title has-text-white has-text-centered">Messages</p>
          <NavBar />
        </div>
        <div className="main">
          <MessageBoxContainer />
        </div>
      </div>
    )
  }
}

ReactDOM.render(
  <App />,
  document.querySelector("#root")
);
