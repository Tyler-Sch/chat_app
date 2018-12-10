import React from 'react';

class PeopleList extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const peopleList = this.props.people.map((person) => {
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
