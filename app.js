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

class ColorItem {
    constructor(id, name, strong, weak) {
        this.id = id
        this.name = name;
        this.strong = strong;
        this.weak = weak;
        this.active = false;
    }
    toggle() {
        this.active = !this.active;
    }
}

class ColorSelector extends React.Component {
    constructor(props) {
        super()
        this.state = {colors: props.colors};
        this.onChanged = props.onChanged;
    }
    styleBase() {
        return {
            display: "inline-block",
            margin: "0.2em 0",
            padding: "0.2em 0.5em",
            textDecoration: "none",
            color: "black",
            borderWidth: "0 0 0.25em",
        }
    }
    styleColor(c) {
        let style = this.styleBase();
        style.borderStyle = "solid";
        style.borderColor = c.active ? c.strong : c.weak;
        style.backgroundColor = c.active ? c.weak : "transparent";
        return style;
    }
    toggle(c, e){
        e.preventDefault();
        c.toggle();
        this.onChanged(this);
        this.setState({colors: this.state.colors})
    }
    clear(e) {
        if (e) e.preventDefault();
        for (let c of this.state.colors) {
            c.active = false;
        }
        this.onChanged(this);
        this.setState({colors: this.state.colors});
    }
    listActiveIds() {
        return this.state.colors.filter(c => {return c.active; }).map(c => {return c.id; });
    }
    render() {
        return <div>
          <span style={this.styleBase()}>Color filter</span>
          { this.state.colors.map((c,i) => {
              return <a href="#" style={this.styleColor(c)} onClick={this.toggle.bind(this,c)}>
                  {c.name}
              </a>
          }) }
          <a href="#" onClick={this.clear.bind(this)} style={this.styleBase()}>CLEAR</a>
        </div>;
    }
}
ColorSelector.propTypes = {
    colors: React.PropTypes.arrayOf(React.PropTypes.instanceOf(ColorItem)),
    onChanged: React.PropTypes.func,
}
ColorSelector.defaultProps = {
    colors: [
        // Color values are taken from http://www.google.com/design/spec/style/color.html#color-color-palette
        // strong=500, weak=200
        new ColorItem("red", "Red", "#f44336", "#ef9a9a"),
        new ColorItem("pink", "Pink", "#e91e63", "#f48fb1"),
        new ColorItem("orange", "Orange", "#ff9800", "#ffcc80"),
        new ColorItem("yellow", "Yellow", "#ffeb3b", "#fff59d"),
        new ColorItem("green", "Green", "#4caf50", "#a5d6a7"),
        new ColorItem("blue", "Blue", "#2196f3", "#90caf9"),
        new ColorItem("purple", "Purple", "#9c27b0", "#ce93d8"),
        new ColorItem("brown", "Brown", "#795548", "#bcaaa4"),
        new ColorItem("black", "Black", "#9e9e9e", "#eeeeee"),
        new ColorItem("grey", "Grey", "#9e9e9e", "#eeeeee"),
        new ColorItem("silver", "Silver", "#9e9e9e", "#eeeeee"),
        new ColorItem("white", "White", "#9e9e9e", "#eeeeee"),
        new ColorItem("gold", "Gold", "#ffc107", "#ffe082"),
    ],
    onChanged: function(sender){},
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
    colorChanged(sender) {
        let colors = sender.listActiveIds();
        if (colors.length == 0 ){
            this.setState({photos: this.state.allPhotos});
        } else {
            let photos = this.state.allPhotos.filter(p => {
                for (let c of colors) {
                    if (p.data.tags.indexOf("color:"+c) < 0) return false;
                }
                return true;
            });
            this.setState({photos: photos});
        }
    }
    render(){
        return(
            <div className="App">
                <ColorSelector onChanged={this.colorChanged.bind(this)} />
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
                  <LazyLoad offset={200}>
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
