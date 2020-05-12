import React, {Component} from 'react';

class Gist extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        let gist = this.props.gist;

       let name = gist.name;

       let names = name.split('-');

       let resultName = names.length > 1? names[1] : name;


        return (
                <div className="box">
                    <nav className="level">
                     <div className="level-left">
                       <div className="level-item">
                         <p className="subtitle is-5">
                           <strong>{resultName}</strong>
                         </p>
                       </div>
                   </div>

                     <div className="level-right">
                       <p className="level-item"><a href={gist.url}>Открыть Gist</a></p>
                       <p className="level-item"><a href={gist.rawUrl}>Сырые данные</a></p>
                     </div>
                    </nav>


                  <article className="media">
                    <div className="media-content">
                      <div className="content">
                        <p>
                           {gist.description}
                        </p>
                      </div>
                    </div>
                  </article>
                </div>
        );
    }
}

export default Gist;