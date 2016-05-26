import React from 'react';
import ReactDOM from 'react-dom';
import Lightbox from 'react-images';
import Gallery from 'react-photo-gallery';
import $ from 'jquery';
import yaml from 'js-yaml'

class App extends React.Component{
    constructor(){
        super();
        this.state = {photos:null};
    }
    componentDidMount() {
        this.loadMorePhotos();
    }
    loadMorePhotos(){
        $.ajax({
          url: 'kt-kitty.yaml',
          dataType: 'text',
          cache: false,
          success: function(data) {
            data = yaml.load(data)
            let photos = data.map(function(obj,i){
                let aspectRatio = 1.0 * obj.size.width_o / obj.size.height_o;
                return {
                    src: obj.image,
                    width: obj.size.width_o,
                    height: obj.size.height_o,
                    aspectRatio: aspectRatio,
                    lightboxImage:{src: obj.image, caption: obj.title}
                };
            });
            this.setState({
                photos: photos
            });
          }.bind(this),
          error: function(xhr, status, err) {
              console.error(status, err.toString());
          }.bind(this)
        });
    }
    renderGallery(){
        return(
            <Gallery photos={this.state.photos} />
        );
    }
    render(){
        // no loading sign if its all loaded
        if (this.state.photos){
            return(
                <div className="App">
                    {this.renderGallery()}
                </div>
            );
        } else {
            return(
                <div className="App">
                     <div id="msg-app-loading" className="loading-msg">Loading</div>
                </div>
            );
        }
    }
};

ReactDOM.render(<App />, document.getElementById('app'));
