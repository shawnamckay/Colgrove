Ext.define('mds.controller.clientPhotoViewer.Slideshow', {
    extend: 'Ext.app.Controller'
    ,refs:[{ref: 'slideshowButton',selector: '#slideshowButton'}]
    
    //SLIDESHOW PROPERTIES
    ,_slideInterval: 4000 //in milliseconds
    
    ,init: function(){
               
        this.control({
            '#slideshowButton':{
                click:this.handleSlideshowButton
            }
        }); 
    },
    handleSlideshowButton:function(button,eventObject){
        if(button.iconCls == 'slideshowStart'){
            this.startSlideshow();
        }else{
            this.pauseSlideshow();                        
        }
    },
    startSlideshow:function(){
        var doInterval = function() {
            mds.app.getController("clientPhotoViewer.Controller").nextImage(true);
        };
        this.interval = window.setInterval(doInterval, this._slideInterval);
        mds.app.getController("clientPhotoViewer.Controller")._slideshowIsOn = true;
        this.getSlideshowButton().setIconCls('slideshowPause');
    },
    pauseSlideshow:function(){
        if (!this.interval) return;
        clearInterval(this.interval);
        delete this["interval"];
        mds.app.getController("clientPhotoViewer.Controller")._slideshowIsOn = false;
        this.getSlideshowButton().setIconCls('slideshowStart');
    }
})