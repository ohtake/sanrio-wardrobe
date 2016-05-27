import React from 'react';
import ReactDOM from 'react-dom';
import JustifiedLayout from 'react-justified-layout';
import Promise from 'es6-promise'; // For older browsers http://caniuse.com/#feat=promises
import fetch from 'whatwg-fetch';
import yaml from 'js-yaml';

class App extends React.Component{
    constructor(){
        super();
        this.state = {photos:null, message:"Loading"};
        this.handleResizeHandler = this.handleResize.bind(this)
    }
    componentDidMount() {
        this.setState({containerWidth: Math.floor(ReactDOM.findDOMNode(this).clientWidth)});
        window.addEventListener('resize', this.handleResizeHandler);
        this.loadPhotos('kt-kitty');
    }
    componentDidUpdate(){
        if (ReactDOM.findDOMNode(this).clientWidth !== this.state.containerWidth){
            this.setState({containerWidth: Math.floor(ReactDOM.findDOMNode(this).clientWidth)});
        }
    }
    componentWillUnmount(){
        window.removeEventListener('resize', this.handleResizeHandler, false);
    }
    handleResize(e){
        this.setState({containerWidth: Math.floor(ReactDOM.findDOMNode(this).clientWidth)});
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
                source: obj.source,
                src: obj.image,
                width: obj.size.width_o,
                height: obj.size.height_o,
                aspectRatio: aspectRatio,
                lightboxImage: { src: obj.image, caption: (
                  <div>
                    <a href={obj.source} target="_blank">{obj.title}</a>
                    <ul>{obj.notes.map( n => { return <li>{n}</li> })}</ul>
                  </div>
                )}
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
    renderGallery() {
        let imgStyle = { width: "100%", height: "100%"};
        let imgs = this.state.photos.map(p => {
            return (
              <div aspectRatio={p.aspectRatio}>
                <a href={p.source} target="_blank">
                  <img src={p.src} style={imgStyle} />
                </a>
              </div>
            );
        });
        return <JustifiedLayout targetRowHeight="80" containerWidth={this.state.containerWidth}>{imgs}</JustifiedLayout>;
    }
};

ReactDOM.render(<App />, document.getElementById('app'));
