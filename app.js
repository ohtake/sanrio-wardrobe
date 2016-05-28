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
    inferLargeImage() {
        let url = this.data.image;
        if (url.indexOf(".staticflickr.com/") >= 0) {
            return url.replace(".jpg", "_b.jpg"); // b => 1024
        } else if (url.indexOf(".googleusercontent.com/") >= 0) {
            return url.replace("/s500/", "/s1024/");
        } else {
            return url;
        }
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
        return <JustifiedLayout targetRowHeight={72} containerPadding={0} boxSpacing={6} containerWidth={this.state.containerWidth}>{imgs}</JustifiedLayout>;
    }

    renderLightbox() {
        let index = this.state.index;
        let len = this.state.photos.length;
        let main = this.state.photos[index];
        let next = this.state.photos[(index + 1)%len];
        let prev = this.state.photos[(index + len - 1) % len];
        let description = (
          <div>
            <span>{main.data.title}</span>
            {this.state.showDescription ?
              <ul style={{whiteSpace:"normal", lineHeight:"1em"}}>
                {main.data.notes.map( n => { return <li>{n}</li> })}
              </ul>
              : null}
          </div>
        );
        return <Lightbox
            mainSrc={main.inferLargeImage()}
            nextSrc={next.inferLargeImage()}
            prevSrc={prev.inferLargeImage()}
            mainSrcThumbnail={main.data.image}
            nextSrcThumbnail={next.data.image}
            prevSrcThumbnail={prev.data.image}
            onCloseRequest={this.closeLightbox.bind(this)}
            onMovePrevRequest={this.movePrev.bind(this)}
            onMoveNextRequest={this.moveNext.bind(this)}
            toolbarButtons={[
              <a href={main.data.source} target="_blank">Web</a>,
              <a href="#" onClick={this.toggleDescription.bind(this)}>Desc</a>
            ]}
            imageTitle={description}
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
    toggleDescription(e) {
        e.preventDefault();
        let val = this.state.showDescription;
        this.setState({ showDescription: !val });
    }
};

ReactDOM.render(<App />, document.getElementById('app'));
