import React from 'react';

class PeopleList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      "people":[]
    };
  }
  fetchPeople(roomName) {
    this.props.socket.emit("getPeopleList", {
      "targetRoom": roomName
    });
    console.log("attempting to fetch people");
    console.log(this.props.activeRoom);
  }
  componentDidMount() {
    this.props.socket.on("newPeopleList", data => {
      console.log("newPeopleList fired")
      this.setState({
        "people": data.people
      });
    });
    this.fetchPeople(this.props.activeRoom);
  }

  componentDidUpdate(prevProps) {
    if (this.props.activeRoom !== prevProps.activeRoom) {
      this.fetchPeople(this.props.activeRoom);
    }
  }



  render() {
    const peopleList = this.state.people.map((person) => {
      return (<Person key={person} personName={person} />)
        });
    return (
      <div id="peoplelist">
        <div id="people-list-head">
          <p className="has-text-white-ter subtile is-size-6 has-text-centered ">People</p>
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
      <p className="has-text-grey-light is-size-6">{this.props.personName}</p>
    )
  }
}

export default PeopleList;
