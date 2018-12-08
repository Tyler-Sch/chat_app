import React from 'react';
import ReactDOM from 'react-dom';


class NavBar extends React.Component {
  render() {
    return (
      <nav className="breadcrumb  is-large is-centered is-hidden-tablet">
        <ul>
          <li><a href="#">Rooms</a></li>
          <li><a href="#">People</a></li>
        </ul>
      </nav>
    )
  }
}

export default NavBar;
