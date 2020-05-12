import React, {Component} from 'react';

class Tags extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            selectedName: 'ALL'
        }

        this.onSelectTag = this.onSelectTag.bind(this);
    }

    render(){
            let arrayTags = [];

            let compareDesc = function compareDesc( a, b ) {
              if ( a.count < b.count ){
                return 1;
              }
              if ( a.count > b.count ){
                return -1;
              }
              return 0;
            }

            let tag = this.state.selectedName === 'ALL' ? 'tag is-danger' : 'tag is-light';
            arrayTags.push(
              <div key={'_' + Math.random().toString(36).substr(2, 9)} className="control">
                <div className="tags has-addons">
                  <a className={tag} onClick={() => this.onSelectTag('ALL')}>{'ВСЕ'}</a>
                </div>
              </div>
            );

            this.props.tags.sort(compareDesc);

            for(let i = 0; i < this.props.tags.length; i++){
                let context = this.props.tags[i];

                let tag = this.state.selectedName === context.name ? 'tag is-danger' : 'tag is-light';

                arrayTags.push(
                  <div key={i} className="control">
                    <div className="tags has-addons">
                      <a className={tag} onClick={() => this.onSelectTag(context.name)}>{context.name}</a>
                      <span className="tag is-primary is-light">{context.count}</span>
                    </div>
                  </div>
                );
            }

            let component  = <div className="field is-grouped is-grouped-multiline">
             {arrayTags}
           </div>;
        return (
              <section className="section">
                    {component}
              </section>
        );
    }

    onSelectTag(name){
        this.setState({
            selectedName: name
        });
        this.props.onSelect(name);
    }

}

export default Tags;