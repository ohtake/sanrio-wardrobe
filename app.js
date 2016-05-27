import React from 'react';
import ReactDOM from 'react-dom';
import Lightbox from 'react-images';
import Gallery from 'react-photo-gallery';
import Promise from 'es6-promise'; // For older browsers http://caniuse.com/#feat=promises
import fetch from 'whatwg-fetch';
import yaml from 'js-yaml'

class App extends React.Component{
    constructor(){
        super();
        this.state = {photos:null, message:"Loading"};
    }
    componentDidMount() {
        this.loadMorePhotos();
    }
    loadMorePhotos(){
        window.fetch('kt-kitty.yaml').then( res => {
            if (res.ok) {
                return res.text();
            } else {
                let error = new Error(res.statusText);
                error.response = res;
                throw error;
            }
        }).then(text => {
            let data = yaml.load(text);
            let photos = data.map(function(obj,i){
                let aspectRatio = 1.0 * obj.size.width_o / obj.size.height_o;
                let notes = obj.notes.map( n => {
                  return <li>{n}</li>
                })
                return {
                    src: obj.image,
                    width: obj.size.width_o,
                    height: obj.size.height_o,
                    aspectRatio: aspectRatio,
                    lightboxImage:{src: obj.image, caption: (
                      <div>
                        <a href={obj.source} target="_blank">{obj.title}</a>
                        <ul>{notes}</ul>
                      </div>
                    )}
                };
            });
            this.setState({
                photos: photos,
                message: null
            });
        }).catch(ex => {
            this.setState({
                photos: null,
                message: ex.toString()
            });
        });
    }
    render(){
        return(
            <div className="App">
                {this.state.message ? <div>{this.state.message}</div> : null}
                {this.state.photos ? <Gallery photos={this.state.photos} /> : null}
            </div>
        );
    }
};

ReactDOM.render(<App />, document.getElementById('app'));
