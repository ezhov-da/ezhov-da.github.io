import React, {Component} from 'react';
import Tags from '../Tags';
import Preloader from '../Preloader';
import HotKeysTable from './HotKeysTable';
import axios from 'axios';


class HotKeysContainer extends React.Component{
    constructor(props){
        super(props);

        this.state= {
            isLoad: true,
            hotKeys: [],
            selectedType: 'ALL'
        }

        this.onSelectTag = this.onSelectTag.bind(this);
        this.groupBy = this.groupBy.bind(this);
    }

    render(){
        let component;

         if(this.state.isLoad){
            component = <Preloader/>
         } else {
             let tagsHotKeys = [];

            this.state.hotKeys.forEach(element => tagsHotKeys.push({name: element.name, count: element.items.length}))

            component =
               <div className="container">
                   <Tags tags={tagsHotKeys} onSelect={this.onSelectTag}/>
                   <HotKeysTable hotKeys={this.state.hotKeys} selectedName={this.state.selectedType}/>
               </div>;
         }

        return (
          <section className="section">
                {component}
          </section>
        )
    }

    onSelectTag(nameTag){
        this.setState({
            selectedType: nameTag
        });
    }

    async componentDidMount() {
        var isLocal = (window.location.hostname === 'localhost' && window.location.port === '3000');
        let url;
        if(isLocal){
            url = 'hotkeys.json';
        } else {
            url = 'https://raw.githubusercontent.com/ezhov-da/hot-keys/master/hot-keys.json';
        }

        axios.get(url)
            .then(data => {
                console.log(data.data.groups);

                this.setState({
                    isLoad: false,
                    hotKeys: data.data.groups
                });

            })
            .catch(err => console.log(err));
    }

    groupBy(list, keyGetter) {
        const map = new Map();
        list.forEach((item) => {
             const key = keyGetter(item);
             let index = map.get(key);
             if (!index) {
                 map.set(key, 1);
             } else {
                map.set(key, ++index);
             }
        });
        return map;
    }
}

export default HotKeysContainer;