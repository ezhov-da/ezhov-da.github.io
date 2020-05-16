import React, {Component} from 'react';
import HotKeys from './HotKeys';


class HotKeysTable extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            searchText: ''
        }
    }

    render(){
        let hotKeys = this.props.hotKeys;

        let array = [];

        for(let i = 0; i < hotKeys.length; i++){
            let hotKeysData = hotKeys[i];

            if(this.props.selectedName === hotKeysData.name || this.props.selectedName =='ALL'){
                array.push(
                       <HotKeys hotKeys={hotKeysData} key={'_' + Math.random().toString(36).substr(2, 9)}/>
                );
            }
        }
        return (
          <section className="section">
            <div className="container">
               {array}
            </div>
          </section>
        );
    }
}

export default HotKeysTable;