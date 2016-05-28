import React from 'react';
import ReactDOM from 'react-dom';
import LazyLoad from 'react-lazy-load';
import Lightbox from 'react-image-lightbox';
import JustifiedLayout from 'react-justified-layout';
import Promise from 'es6-promise'; // For older browsers http://caniuse.com/#feat=promises
import fetch from 'whatwg-fetch';
import yaml from 'js-yaml';

class Photo {
    constructor(data) {
        this.data = data;
    }
    getAspectRatio() {
        return 1.0 * this.data.size.width_o / this.data.size.height_o
    }
    toDescriptionElement() {
        return (
          <div>
            <a href={this.data.source} target="_blank">{this.data.title}</a>
            <ul style={{whiteSpace:"normal", lineHeight:"1em"}}>
              {this.data.notes.map( n => { return <li>{n}</li> })}
            </ul>
          </div>
        );
    }
}

class App extends React.Component{
    constructor(){
        super();
        this.state = {photos:null, message:"Loading"};
        this.handleResize = this.updateContainerWidth.bind(this)
    }
    componentDidMount() {
        this.updateContainerWidth();
        window.addEventListener('resize', this.handleResize);
        this.loadPhotos('kt-kitty');
    }
    componentDidUpdate(){
        this.updateContainerWidth();
    }
    componentWillUnmount(){
        window.removeEventListener('resize', this.handleResize, false);
    }
    updateContainerWidth(){
        let newWidth = ReactDOM.findDOMNode(this).clientWidth;
        if (newWidth !== this.state.containerWidth){
            this.setState({containerWidth: newWidth});
        }
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
            let data = yaml.load(text);
            let photos = data.map(obj => {return new Photo(obj)});
            this.setState({
                allPhotos: photos,
                photos: photos.slice(0),
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
                {this.state.photos ? this.renderGallery() : null}
                {this.state.isOpen ? this.renderLightbox() : null }
            </div>
        );
    }
    renderGallery() {
        let imgStyle = { width: "100%", height: "100%"};
        let imgs = this.state.photos.map((p,i) => {
            return (
              <div aspectRatio={p.getAspectRatio()} style={{backgroundColor: "silver"}}>
                <a href="#" onClick={this.openLightbox.bind(this, i)}>
                  <LazyLoad offset="200">
                    <img src={p.data.image} style={imgStyle} />
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
            mainSrc={main.data.image}
            nextSrc={next.data.image}
            prevSrc={prev.data.image}
            onCloseRequest={this.closeLightbox.bind(this)}
            onMovePrevRequest={this.movePrev.bind(this)}
            onMoveNextRequest={this.moveNext.bind(this)}
            imageTitle={main.toDescriptionElement()}
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
