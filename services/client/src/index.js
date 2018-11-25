import React from 'react';
import ReactDOM from 'react-dom';


const App = () => {
  return (
    <selection className="selection">
      <div className="container">
        <div className="column is-one-third">
          <br />
          <h1 className="title is-1 is-1">All Users</h1>
          <hr /> <br />
        </div>
      </div>
    </selection>
  )
};

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
