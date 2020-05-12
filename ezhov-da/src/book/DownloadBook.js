import React, {Component} from 'react';
import axios from 'axios';
import qs from 'querystring';
import Preloader from '../Preloader';


class DownloadBook extends React.Component{
    constructor(props){
        super(props);

        this.state={
            startDownload: false,
            completeDownload: false,
            url: '',
            qr: ''
        }

        var self = this;

        this.download = this.download.bind(this);
    }

     render(){
        let downloadComponent;

        if (this.state.completeDownload && !this.state.startDownload){
            downloadComponent = <div>
                <div className="level">
                    <div className="level-item">
                        <figure className="image is-128x128">
                          <img src={this.state.qr}/>
                        </figure>

                    </div>
                </div>
                <div className="level">
                    <div className="level-item">
                        <a href={this.state.url}>Скачать</a>
                    </div>
                </div>

            </div>
        }

        return (
              <section className="section">
                <div className="container">
                  <h1 className="title">Скачать</h1>
                    <div className="field">
                      <div className="control">
                        <input className="input" type="text" placeholder="Логин" ref={(el) => this._login = el}/>
                      </div>
                    </div>
                    <div className="field">
                      <div className="control">
                        <input className="input" type="password" placeholder="Пароль" ref={(el) => this._password = el}/>
                      </div>
                    </div>
                      <div className="control">
                        <button className="button is-link" onClick={() => this.download(this.props.book.id)}>Скачать</button>
                      </div>
                </div>
                <div className="container">
                    {this.state.startDownload ? <Preloader/> : downloadComponent}
                </div>
              </section>
        )
     }

    async download(bookId) {
        this.setState({
            startDownload: true,
        });

        let bodyFormData = new FormData();
        bodyFormData.set('id', bookId);
        bodyFormData.set('login', this._login.value);
        bodyFormData.set('password', this._password.value);

        const requestBody = {
          id: bookId,
          login: this._login.value,
          password: this._password.value
        }

         axios({
            method: 'post',
            url: 'https://prog-tools.ru:8445/library/rest/books/book/link',
            data: qs.stringify(requestBody),
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            })
            .then(response => {
                this.setState({
                    startDownload: false,
                    completeDownload: true,
                    url: response.data.url,
                    qr: response.data.qr,
                });
            })
            .catch(function (response) {
                console.log(response);
            });

            }
        }

export default DownloadBook;