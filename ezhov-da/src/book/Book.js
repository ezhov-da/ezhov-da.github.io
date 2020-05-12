import React, {Component} from 'react';
import DownloadBook from './DownloadBook';

class Book extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            isShowDownload: false
        }
        this.showDownload = this.showDownload.bind(this);
    }

    render(){
        let book = this.props.book;

       let name = book.name;

       let names = name.split('-');

       let resultName = names.length > 1? names[1] : name;

        let downloadComponent = this.state.isShowDownload ? <DownloadBook book={book}/> : ''

        let icon =<div key={'_' + Math.random().toString(36).substr(2, 9)} className="media-right">
                <span className="icon is-large" onClick={this.showDownload}>
                    <span className={this.state.isShowDownload ? 'fas fa-angle-up' : 'fas fa-angle-down'}></span>
                </span>
            </div>

        return (
                <div className="box">
                    <div className="media">
                      <div className="media-left">
                        <figure className="image">
                          <img src={book.previewLink} alt="Placeholder image"/>
                        </figure>
                      </div>
                      <div className="media-content">
                        <p className="title is-4">{book.name}</p>
                        <p className="subtitle is-6">{book.group}</p>
                      </div>
                      <div className="media-right">
                      {icon}
                      </div>
                    </div>
                   {downloadComponent}
                </div>
        );
    }

    showDownload(){
        let invert = !this.state.isShowDownload;

        this.setState({
            isShowDownload : invert
        });
    }
}

export default Book;