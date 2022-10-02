Ext.define('mds.controller.clientPhotoViewer.Windows', {
    extend: 'Ext.app.Controller',
    views: [
    // 'clientPhotoViewer.window.vAlbumWindow'
    'clientPhotoViewer.window.vPhotoviewerDisabled'],
    stores: ['clientPhotoViewer.Albums'],
    refs: [
    // WINDOW COMPONENTS
    {
        ref: 'disablePhotoviewerWindow',
        selector: 'windowPhotoviewerDisabled',
        xtype: 'windowPhotoviewerDisabled',
        autoCreate: true
    }

    // 'DISABLE PHOTOVIEWER' WINDOW
    , {
        ref: 'photoviewerMessages',
        selector: '#photoviewerMessages'
    }

    // MISC
    , {
        ref: 'toolbar',
        selector: 'pvToolBarView'
    }, {
        ref: 'photoviewinner',
        selector: '#pvPhotoViewInner'
    }, {
        ref: 'image',
        selector: '#pvImage'
    }]
    // MAIN CONTROLLER VARIABLES
    ,
    _projectUID: null,
    _lazyStore: null

    // THIS CONTROLLER VARIABLES
    ,
    _windowMode: 'select',
    albumStore: null,
    MAXSAVEDPHOTOS: 10

    ,
    init: function(){
        // SET 'THIS' CONTROLLERS VARIABLES BY REFERENCING MAIN CONTROLLER WHERE APPLICABLE
        this._projectUID=mds.app.getController("clientPhotoViewer.Controller")._projectUID;
        this._lazyStore=mds.app.getController("clientPhotoViewer.Controller")._lazyStore;
        this.albumStore=Ext.getStore("clientPhotoViewer.Albums");
        var me=this;
        this.control({
            '#bbarPhotoviewerDisabled': {
                click: function(){
                    document.location.href='/?fuseaction=aClientDashboard.home';
                }
            }
        });
        mds.app.getController("clientPhotoList.ToolbarActions").interfaceControl=this;
    },
    onLaunch: function(){
        var mainController=mds.app.getController("clientPhotoViewer.Controller");
    },
    getPrintZoomInformation: function(){
        var view=this.getPhotoviewinner();
        var viewWidth=view.getWidth();
        var viewHeight=view.getHeight();

        var info={
            x: 0,
            y: 0,
            realWidth: mds.app.getController("clientPhotoViewer.Controller")._naturalWidth,
            realHeight: mds.app.getController("clientPhotoViewer.Controller")._naturalHeight,
            viewWidth: mds.app.getController("clientPhotoViewer.Controller")._naturalWidth,
            viewHeight: mds.app.getController("clientPhotoViewer.Controller")._naturalHeight
        };

        var photo=this.getImage();
        var photoCurrentWidth=photo.getWidth();
        var photoCurrentHeight=photo.getHeight();

        if (photoCurrentWidth<=viewWidth&&photoCurrentHeight<=viewHeight){ return info; }
        var viewerToReal=mds.app.getController("clientPhotoViewer.Controller")._naturalHeight/photoCurrentHeight;
        info.viewWidth=viewWidth;
        info.viewHeight=viewHeight;

        var viewPosition=view.getPosition();
        var photoPosition=photo.getPosition();
        photoPosition[0]-=viewPosition[0];
        photoPosition[1]-=viewPosition[1];

        if (photoPosition[0]>viewPosition[0]){
            info.viewWidth-=photoPosition[0];
        }

        if (photoPosition[1]>viewPosition[1]){
            info.viewHeight-=photoPosition[1];
        }

        var photoRight=photoPosition[0]+photoCurrentWidth;
        var viewRight=viewPosition[0]+viewWidth;
        if (photoRight<viewRight){
            info.viewWidth-=(viewRight-photoRight);
        }

        var photoBottom=photoPosition[1]+photoCurrentHeight;
        var viewBottom=viewPosition[1]+viewHeight;
        if (photoBottom<viewBottom){
            info.viewHeight-=(viewBottom-photoBottom);
        }

        info.realWidth=info.viewWidth*viewerToReal;
        info.realHeight=info.viewHeight*viewerToReal;

        info.x=Math.max(0, photoPosition[0]*-1*viewerToReal);
        info.y=Math.max(0, photoPosition[1]*-1*viewerToReal);

        return info;
    },
    getSelectedPhotoIDs: function(callback){
        var ids=[];

        this._lazyStore.each(function(record){
            if (record.get('isSelected')){
                ids.push(record.get('id'));
            }
        });

        if (ids.length<1){
            ids.push(mds.app.getController("clientPhotoViewer.Controller")._selectedRecord.get("id"));
        }
        if (callback) callback(ids);
        else return ids;
    },
    allPhotosHaveFloorplan: function(){
        var photos=this.getSelectedPhotoIDs();
        for ( var i=0; i<photos.length; i++){
            var record=this._lazyStore.getById(photos[i]);
            if (record.get('floorplanUID')=="0") return false;
        }
        return true;
    },
    getPhotoIDsByType: function(type){
        var ids=[];
        this._lazyStore.each(function(record){
            if (record.get('isSelected')){
                var id=record.get("id");
                var photoType=id.charAt(0), photoID=id.substring(1);
                if (photoType==type) ids.push(photoID);
            }
        });
        if (ids.length<1){
            var id=mds.app.getController("clientPhotoViewer.Controller")._selectedRecord.get("id");
            var photoType=id.charAt(0), photoID=id.substring(1);
            if (photoType==type) ids.push(photoID);
        }
        return ids;
    }
});