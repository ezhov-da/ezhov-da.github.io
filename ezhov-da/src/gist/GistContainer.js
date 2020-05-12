import React, {Component} from 'react';
import Tags from '../Tags';
import Preloader from '../Preloader';
import GistTable from './GistTable';
import axios from 'axios';


class GistContainer extends React.Component{
    constructor(props){
        super(props);

        this.state= {
            isLoad: true,
            tableContext: [],
            knowledges: [],
            selectedType: 'ALL'
        }

        this.onSelectTag = this.onSelectTag.bind(this);
    }

    render(){

    let component;

             if(this.state.isLoad){
                component = <Preloader/>



             } else {
               component =
                   <div className="container">
                       <Tags tags={this.state.tableContext} onSelect={this.onSelectTag}/>
                       <GistTable gists={this.state.knowledges} selectedName={this.state.selectedType}/>
                   </div>;
             }
        return (
          <section className="section">
                {component}
          </section>
        );
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
            url = 'gists.json';
        } else {
            url = 'https://prog-tools.ru:64646/knowledges';
        }

        axios.get(url)
            .then(data => {
                this.setState({
                    isLoad: false,
                    tableContext: data.data.tableContext,
                    knowledges: data.data.knowledges
                });

            })
            .catch(err => console.log(err));
    }
}

export default GistContainer;