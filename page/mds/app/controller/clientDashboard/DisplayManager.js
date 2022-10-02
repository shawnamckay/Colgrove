/**
 * 
 */
Ext.define('mds.controller.clientDashboard.DisplayManager', {
    extend: 'Ext.app.Controller',
    views: [
        'clientDashboard.ClientDashboard'
    ],
    init: function(application) {
        var me = this;
        me.favourites = mds.app.getController('clientDashboard.GlobalFavourites');
        me.globalfeed = mds.app.getController('clientDashboard.GlobalFeed');
        me.mapviewer = mds.app.getController('clientDashboard.GlobalMapViewer');
        me.plus = mds.app.getController('clientDashboard.GlobalPlus');
        me.webcams = mds.app.getController('clientDashboard.GlobalWebcams');
        me.videos = mds.app.getController('clientDashboard.GlobalVideos');
    },
    onMenuSelectionChange: function(menuType) {
        var me = this;
        if ('dashboard' == menuType) {
            me.favourites.hide();
            me.globalfeed.hide();
            me.mapviewer.hide();
            me.plus.hide();
            me.webcams.hide();
            me.videos.hide();
        } else if ('favourites' == menuType) {
            me.favourites.show();
            me.globalfeed.hide();
            me.mapviewer.hide();
            me.plus.hide();
            me.webcams.hide();
            me.videos.hide();
        } else if ('globalfeed' == menuType) {
            me.favourites.hide();
            me.globalfeed.show();
            me.mapviewer.hide();
            me.plus.hide();
            me.webcams.hide();
            me.videos.hide();
        } else if ('globalplus' == menuType) {
            me.favourites.hide();
            me.globalfeed.hide();
            me.mapviewer.hide();
            me.plus.show();
            me.webcams.hide();
            me.videos.hide();
        } else if ('globalmapviewer' == menuType) {
            me.favourites.hide();
            me.globalfeed.hide();
            me.mapviewer.show();
            me.plus.hide();
            me.webcams.hide();
            me.videos.hide();
        } else if ('webcams' == menuType) {
            me.favourites.hide();
            me.globalfeed.hide();
            me.mapviewer.hide();
            me.plus.hide();
            me.webcams.show();
            me.videos.hide();
        } else if ('videos' == menuType) {
            me.favourites.hide();
            me.globalfeed.hide();
            me.mapviewer.hide();
            me.plus.hide();
            me.webcams.hide();
            me.videos.show();
        } else{
            me.favourites.hide();
            me.globalfeed.hide();
            me.mapviewer.hide();
            me.plus.hide();
            me.webcams.hide();
            me.videos.hide();
        }
    }
});
//@ sourceURL=DisplayManager.js