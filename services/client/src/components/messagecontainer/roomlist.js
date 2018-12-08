import React from 'react';




class RoomList extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const inner = this.props.rooms.map((i) => {
      return <RoomTile roomInfo={i} />
    });
    return (
      <div class="is-marginless" id="roomlist">
        <div id="room-list-head">
           <p class="has-text-white-ter subtile is-size-6 has-text-centered ">Rooms</p>
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
      <div class="RoomTile">
        {this.props.roomInfo.has_checked == true ? (
          <p class="has-text-grey-light is-size-5">{this.props.roomInfo.room}</p>
        ):(
          <p class="has-text-danger is-size-5">{this.props.roomInfo.room}</p>
        )}
     </div>
    )
  }
}

export default RoomList;
