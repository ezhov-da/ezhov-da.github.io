import React, {Component} from 'react';

class DownloadCondition extends React.Component{
    constructor(props){
        super(props);

        this.state={
            selectedRadio: 'countRadio',
            inputValue: ''
        }
        this.onSelectedRadio = this.onSelectedRadio.bind(this);
        this.onInput = this.onInput.bind(this);
        this.notifyChange = this.notifyChange.bind(this);
        this.typeByRadio = this.typeByRadio.bind(this);
    }

    render(){

        let text = '';

        if (this.state.selectedRadio ==='countRadio'){
            text = "Введите допустимое количество скачиваний";
        } else if(this.state.selectedRadio==='timeRadio'){
            text = "Введите допустимое время доступа в формате число_(s - секунды | m - минуты | h - часы)";
        } else if(this.state.selectedRadio==='dateRadio'){
            text = "Введите дату до которой будет предоставлен доступ в формате 'YYYY-MM-DD HH:mm:ss'";
        }

        return (
            <div className="section">

            <h2 className="subtitle">Ограничение на скачивание</h2>
                <div className="container">
                    <div className="level">
                        <div className="level-item">
                            <div className="field">
                              <div className="control">
                                <label className="radio">
                                  <input type="radio" name="type" onClick={this.onSelectedRadio} defaultChecked={this.state.selectedRadio === 'countRadio'} value="countRadio"/>
                                  Количество скачиваний
                                </label>
                                <label className="radio">
                                  <input type="radio" name="type" onClick={this.onSelectedRadio} defaultChecked={this.state.selectedRadio === 'timeRadio'} value="timeRadio"/>
                                  Время
                                </label>
                                <label className="radio">
                                  <input type="radio" name="type" onClick={this.onSelectedRadio} defaultChecked={this.state.selectedRadio === 'dateRadio'} value="dateRadio"/>
                                  Дата
                                </label>
                              </div>
                            </div>
                        </div>
                    </div>
                    <div>{text}</div>
                    <div className="field">
                      <div className="control">
                        <input className="input" type="text" placeholder={text} onChange={this.onInput}/>
                      </div>
                    </div>
                </div>
            </div>
        )
    }

    onSelectedRadio(e){
        let type = this.typeByRadio(e.target.value);

        this.notifyChange(
            type,
            this.state.inputValue
        );

        this.setState({
            selectedRadio: e.target.value
        });

    }

    typeByRadio(radio){
       return  radio === 'countRadio' ? 'count' : radio === 'timeRadio' ? 'time' : 'date';
    }

    onInput(e){
        this.notifyChange(
            this.typeByRadio(this.state.selectedRadio),
            e.target.value
        );

        this.setState({
            inputValue: e.target.value
        });
    }

    notifyChange(type, value){
        let notify = {
            type: type,
            value: value
        }

        console.log(notify);

        this.props.onChange(notify);
    }

}

export default DownloadCondition;