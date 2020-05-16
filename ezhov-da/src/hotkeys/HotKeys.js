import React, {Component} from 'react';

class HotKey extends React.Component{
    constructor(props){
        super(props);
    }

    render (){
        let hotKeys = this.props.hotKeys;

        let trArray = [];

        hotKeys.items.forEach(element => {
            trArray.push(
                <tr key={'_' + Math.random().toString(36).substr(2, 9)}>
                  <td>{element.key}</td>
                  <td>{element.value}</td>
                </tr>
            );
        });

        return (
           <div className="box">
                <nav className="level">
                    <div className="level-item">
                    <p className="subtitle is-5">
                            <strong>{hotKeys.name}</strong>
                          </p>
                    </div>
                </nav>
                <table className="table is-fullwidth">
                  <tbody>
                    {trArray}
                  </tbody>
                </table>
            </div>
        )
    }
}

export default HotKey;