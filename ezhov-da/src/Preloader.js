import React, {Component} from 'react';

class Preloader extends React.Component{

    render(){
        return (
             <div className="container">
                <nav className="level">
                    <div className="level-item">
                        <figure className="image is-64x64 center">
                            <img src="preloader.gif"/>
                        </figure>
                    </div>
                </nav>
            </div>
        )
    }

}

export default Preloader;