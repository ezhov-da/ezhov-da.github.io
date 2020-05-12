import React, {Component} from 'react';
import GistContainer from './gist/GistContainer';
import BookContainer from './book/BookContainer';

import {
    Route,
    NavLink,
    HashRouter
} from 'react-router-dom';

class App extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
      return (
      <HashRouter>
        <div className="container">
            <nav className="navbar" role="navigation" aria-label="main navigation">
              <div className="navbar-brand">
                <a className="navbar-item" href="https://github.com/ezhov-da">
                 ezhov-da
                </a>
              </div>
            </nav>

            <div className="tabs is-centered">

              <ul>
                <li><NavLink exact={true} activeStyle={{borderBottomColor: "#3273dc", color: "#3273dc"}} to="/">Мои Gist</NavLink></li>
                <li><NavLink activeStyle={{borderBottomColor: "#3273dc", color: "#3273dc"}} to="/books">Книги</NavLink></li>
              </ul>
            </div>

            <div>
                <Route exact={true} path="/" component={GistContainer}/>
                <Route path="/books" component={BookContainer}/>
            </div>
        </div>
        </HashRouter>
      );
  }
}

export default App;
