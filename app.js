import React from 'react';
import ReactDOM from 'react-dom';
import Lightbox from 'react-images';
import Gallery from 'react-photo-gallery';
import $ from 'jquery';
import _ from 'lodash';
import yaml from 'js-yaml'

class App extends React.Component{
    constructor(){
        super();
        this.state = {photos:null, pageNum:1, totalPages:1, loadedAll: false};

        this.handleScroll = this.handleScroll.bind(this);
        this.loadMorePhotos = this.loadMorePhotos.bind(this);
    }
    componentDidMount() {
        this.loadMorePhotos();
        this.loadMorePhotos = _.debounce(this.loadMorePhotos, 200);
        window.addEventListener('scroll', this.handleScroll);
    }
    handleScroll(){
        if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 50)) {
            this.loadMorePhotos();
        }
    }
    loadMorePhotos(e){
        if (e){
            e.preventDefault();
        }
        if (this.state.pageNum > this.state.totalPages){
            this.setState({loadedAll: true});
            return;
        }
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
                photos: this.state.photos ? this.state.photos.concat(photos) : photos,
                pageNum: this.state.pageNum + 1,
                totalPages: 1
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
        if (this.state.photos && this.state.loadedAll){
            return(
                <div className="App">
                    {this.renderGallery()}
                </div>
            );
        } else if (this.state.photos) {
             return(
                 <div className="App">
                     {this.renderGallery()}
                     <div className="loading-msg" id="msg-loading-more">Loading</div>
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
