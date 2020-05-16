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
                <tr>
                  <td>{element.key}</td>
                  <td>{element.value}</td>
                </tr>
            );
        });

        return (
           <div class="box">
                <p>{hotKeys.name}</p>
                <table class="table is-fullwidth">
                  <tbody>
                    {trArray}
                  </tbody>
                </table>
            </div>
        )
    }
}

export default HotKey;