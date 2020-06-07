import React, {Component} from 'react';
import GistContainer from './gist/GistContainer';
import BookContainer from './book/BookContainer';
import HotKeysContainer from './hotkeys/HotKeysContainer';

import {
    Route,
    NavLink,
    HashRouter,
    Redirect
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
              </div>
            </nav>

            <div className="level">
                <div className="level-item">
                    <figure class="image is-128x128">
                      <img class="is-rounded" src="/avatar.jpg"/>
                    </figure>
                </div>
            </div>

            <div className="level">
                <div className="level-item">
                    <span class="icon has-text-info">
                        <a href="https://github.com/ezhov-da">
                            <i class="fab fa-github" aria-hidden="true"/>
                        </a>
                    </span>
                    <span class="icon has-text-info">
                        <a href="https://www.linkedin.com/in/ezhovda">
                            <i class="fab fa-linkedin" aria-hidden="true"/>
                        </a>
                    </span>
                </div>
            </div>

            <div className="tabs is-centered">
              <ul>
                <li><NavLink exact={true} activeStyle={{borderBottomColor: "#3273dc", color: "#3273dc"}} to="/gists">Мои Gist</NavLink></li>
                <li><NavLink activeStyle={{borderBottomColor: "#3273dc", color: "#3273dc"}} to="/books">Книги</NavLink></li>
                <li><NavLink activeStyle={{borderBottomColor: "#3273dc", color: "#3273dc"}} to="/hotkeys">Команды</NavLink></li>
              </ul>
            </div>

            <div>
                <Route exact={true} path="/" render={({location}) => {
                        return <Redirect
                                    to={{
                                      pathname: "/gists",
                                      state: { from: location }
                                    }}
                                  />
                    }
                }/>
                <Route path="/gists" component={GistContainer}/>
                <Route path="/books" component={BookContainer}/>
                <Route path="/hotkeys" component={HotKeysContainer}/>
            </div>
        </div>
        </HashRouter>
      );
  }
}

export default App;
