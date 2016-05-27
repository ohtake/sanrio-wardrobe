import React from 'react';
import ReactDOM from 'react-dom';
import JustifiedLayout from 'justified-layout';
import Lightbox from 'react-lightbox-component';
import Promise from 'es6-promise'; // For older browsers http://caniuse.com/#feat=promises
import fetch from 'whatwg-fetch';
import yaml from 'js-yaml';

class App extends React.Component{
    constructor(){
        super();
        this.state = {photos:null, message:"Loading"};
    }
    componentDidMount() {
        this.loadPhotos('kt-kitty');
    }
    loadPhotos(file){
        window.fetch(file + '.yaml').then( res => {
            if (res.ok) {
                return res.text();
            } else {
                let error = new Error(res.statusText);
                error.response = res;
                throw error;
            }
        }).then(text => {
            this.setPhotos(yaml.load(text))
        }).catch(ex => {
            this.setState({
                photos: null,
                message: ex.toString()
            });
        });
    }
    setPhotos(data) {
        let photos = data.map(obj => {
            let aspectRatio = 1.0 * obj.size.width_o / obj.size.height_o;
            return {
                title: obj.title,
                src: obj.image,
                width: obj.size.width_o,
                height: obj.size.height_o,
                aspectRatio: aspectRatio,
                description: (
                  <div>
                    <a href={obj.source} target="_blank">{obj.title}</a>
                    <ul>{obj.notes.map( n => { return <li>{n}</li> })}</ul>
                  </div>
                )
            };
        });
        this.setState({
            photos: photos,
            message: null
        });
    }
    render(){
        return(
            <div className="App">
                {this.state.message ? <div>{this.state.message}</div> : null}
                {this.state.photos ? this.renderGallery() : null}
            </div>
        );
    }
    renderGallery(){
        let geometory = JustifiedLayout(this.state.photos.map(p => { return p.aspectRatio; }), {targetRowHeight:80});
        let imgs = this.state.photos.map(p => {
            return {src:p.src, title: p.title, description: p.description};
        });
        let renderImageFunc = (idx, image, toggleLightbox, width, height) => {
          return (
            <img
              key={idx}
              src={ !!image.thumbnail ? image.thumbnail : image.src }
              className='lightbox-img-thumbnail'
              style={{width: geometory.boxes[idx].width, height: geometory.boxes[idx].height, top: geometory.boxes[idx].top, left: geometory.boxes[idx].left, position: "absolute"}}
              alt={image.title}
              onClick={toggleLightbox.bind(null, idx)} />
          );
        };
        return (
          <div style={{position: "absolute"}}>
            <Lightbox.Lightbox images={imgs} renderImageFunc={renderImageFunc}/>
          </div>
        );
    }
};

ReactDOM.render(<App />, document.getElementById('app'));
