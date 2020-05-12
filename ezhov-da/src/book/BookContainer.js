import React, {Component} from 'react';
import Tags from '../Tags';
import BookTable from './BookTable';
import Preloader from '../Preloader';
import axios from 'axios';


class BookContainer extends React.Component{
    constructor(props){
        super(props);

        this.state= {
            isLoad: true,
            books: [],
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

                let books = this.state.books;
                let tagsBook = [];

                const grouped = this.groupBy(books, book => book.group);
                for (let [k, v] of grouped) {
                  tagsBook.push({name: k, count: v});
                }

               component =
                   <div className="container">
                       <Tags tags={tagsBook} onSelect={this.onSelectTag}/>
                       <BookTable books={this.state.books} selectedName={this.state.selectedType}/>
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
            url = 'books.json';
        } else {
            url = 'https://prog-tools.ru:8445/library/rest/books';
        }

        axios.get(url)
            .then(data => {
                this.setState({
                    isLoad: false,
                    books: data.data.books,
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

export default BookContainer;