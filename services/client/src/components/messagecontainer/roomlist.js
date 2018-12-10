import React from 'react';




class RoomList extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const inner = this.props.rooms.map((i) => {
      return <RoomTile key={i} roomInfo={i} />
    });
    return (
      <div className="" id="roomlist">
        <div id="room-list-head">
           <p className="has-text-white-ter subtile is-size-6 has-text-centered ">Rooms</p>
        </div>
        <div id="roomlist-body">
        {inner}
        </div>
      </div>

    )
  }
}

class RoomTile extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="RoomTile">
        {this.props.roomInfo.has_checked == true ? (
          <p className="has-text-grey-light is-size-5 has-text-left">{this.props.roomInfo.room}</p>
        ):(
          <p className="has-text-danger is-size-5">{this.props.roomInfo.room}</p>
        )}
     </div>
    )
  }
}

export default RoomList;
