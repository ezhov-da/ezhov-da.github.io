import React, {Component} from 'react';
import Gist from './Gist';


class GistTable extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            searchText: ''
        }

        this.changeInput = this.changeInput.bind(this);
        this.isNameContains = this.isNameContains.bind(this);
        this.clearSearch = this.clearSearch.bind(this);
    }

    render(){
        let gists = this.props.gists;

        let array = [];

        for(let i = 0; i < gists.length; i++){
            let gist = gists[i];

            if(this.props.selectedName === gist.type || this.props.selectedName =='ALL'){
                if(this.state.searchText !== '' && this.state.searchText.length > 2){
                    let contains = this.isNameContains(gist.name, this.state.searchText);
                    if(contains){
                        array.push(
                               <Gist gist={gist} key={'_' + Math.random().toString(36).substr(2, 9)}/>
                        );
                    }
                } else {
                    array.push(
                           <Gist gist={gist} key={'_' + Math.random().toString(36).substr(2, 9)}/>
                    );
                }
            }
        }

        return (
          <section className="section">
            <div className="container">
            <div className="columns">
              <div className="column is-11">
                    <input className="input" type="text" placeholder="Введите слово или слова через пробел" value={this.state.searchText} onChange={this.changeInput}/>
                </div>
              <div className="column">
              <a className="button" onClick={this.clearSearch}>Очистить</a>
              </div>
            </div>
               {array}
            </div>
          </section>
        );
    }

    changeInput(e){
        this.setState({
            searchText: e.target.value
        });
    }

    clearSearch(){
        this.setState({
            searchText: ''
        });
    }

    isNameContains(sourceString, filterText) {
        var booleanContains = false;
        if (filterText !== '') {
            if (filterText.indexOf(' ') !== -1) {
                //получаем массив слов
                var arrayFindWords = filterText.trim().split(' ');
                booleanContains = true;
                for (let findWord in arrayFindWords) {
                    if (findWord !== '') {
                        if (sourceString.indexOf(arrayFindWords[findWord]) === -1) {
                            booleanContains = false;
                            break;
                        }
                    }
                }
            } else {
                booleanContains =
                    sourceString
                        .toLowerCase()
                        .indexOf(filterText.toLowerCase()) !== -1;
            }
        } else {
            booleanContains = true;
        }

        return booleanContains;
    }
}

export default GistTable;