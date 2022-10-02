Ext.define('mds.view.clientWebcamTimelapse.Timelapse', {
    id: 'player',
    extend: 'Ext.Component',
    controls: true,
    
    tpl: new Ext.XTemplate(
        '<tpl for=".">',
            '<video controls>',
                '<source src="{TimelapseURL}">',
            '</video>',
        '</tpl>'
    ),

    Webcam: null,
    viewport: null,

    load: function(webcam, viewport, supressResize){
        var me=Ext.getCmp("player");
        me.Webcam=webcam;
        me.viewport=viewport;
        
        var v=document.createElement('video');
        if (!v.canPlayType || !v.canPlayType('video/mp4').replace(/no/, '')){
            this.el.dom.innerHTML="Browser does not support embedded playback in offline mode. Please use the 'Save' command on the toolbar to access the video file.";
            return;
        }
            
        
        me.update(me.Webcam);
        
        if (!supressResize)
            me.resize();
    },
    resize: function(){
        var me=this;
        if (!me.Webcam) return;

        me.staticHSpace=me.viewport.getStaticHSpace();
        me.staticVSpace=me.viewport.getStaticVSpace();

        var maxHSpace=me.viewport.width-me.staticHSpace;
        var maxVSpace=me.viewport.height-me.staticVSpace;

        var height=Math.min(maxVSpace, me.Webcam.StreamHeight);
        var width=(height/this.Webcam.StreamHeight)*this.Webcam.StreamWidth;

        if (width>maxHSpace){
            width=maxHSpace;
            height=(width/me.Webcam.StreamWidth)*me.Webcam.StreamHeight;
        }

        me.setHeight(height);
        me.setWidth(width);
    }

});
