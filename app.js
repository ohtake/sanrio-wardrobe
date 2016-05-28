import React from 'react';
import ReactDOM from 'react-dom';
import LazyLoad from 'react-lazy-load';
import Lightbox from 'react-image-lightbox';
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
                    <ul style={{whiteSpace:"normal", lineHeight:"1em"}}>{obj.notes.map( n => { return <li>{n}</li> })}</ul>
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
                {this.state.isOpen ? this.renderLightbox() : null }
            </div>
        );
    }
    renderGallery() {
        let imgStyle = { width: "100%", height: "100%"};
        let imgs = this.state.photos.map((p,i) => {
            return (
              <div aspectRatio={p.aspectRatio} style={{backgroundColor: "silver"}}>
                <a href="#" onClick={this.openLightbox.bind(this, i)}>
                  <LazyLoad offset="200">
                    <img src={p.src} style={imgStyle} />
                  </LazyLoad>
                </a>
              </div>
            );
        });
        return <JustifiedLayout targetRowHeight="80" containerWidth={this.state.containerWidth}>{imgs}</JustifiedLayout>;
    }

    renderLightbox() {
        let index = this.state.index;
        let len = this.state.photos.length;
        let main = this.state.photos[index];
        let next = this.state.photos[(index + 1)%len];
        let prev = this.state.photos[(index + len - 1) % len];
        return <Lightbox
            mainSrc={main.src}
            nextSrc={next.src}
            prevSrc={prev.src}
            onCloseRequest={this.closeLightbox.bind(this)}
            onMovePrevRequest={this.movePrev.bind(this)}
            onMoveNextRequest={this.moveNext.bind(this)}
            imageTitle={main.lightboxImage.caption}
        />;
    }
    openLightbox(i, e) {
        e.preventDefault();
        this.setState({ isOpen: true, index: i });
    }
    closeLightbox() {
        this.setState({ isOpen: false });
    }
    moveNext() {
        this.setState({ index: (this.state.index + 1) % this.state.photos.length });
    }
    movePrev() {
        this.setState({ index: (this.state.index + this.state.photos.length - 1) % this.state.photos.length });
    }
};

ReactDOM.render(<App />, document.getElementById('app'));
