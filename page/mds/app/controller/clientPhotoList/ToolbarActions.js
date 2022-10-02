Ext.define('mds.controller.clientPhotoList.ToolbarActions', {
    extend: 'Ext.app.Controller',
    requires:['mds.view.clientPhotoList.widget.PrintSelectionWindow'],
    init: function(){
        // interfaceControl has
        // getSelectedPhotoIDs- returns array of selected photo ids ('P'/'U'/'W' plus PhotoID/UDEFPhotoUID/WebcamPhotoUID
        // allPhotosHaveFloorplan- returns true if all selected photos have a floorplan, false otherwise
        this.control({
            '#emailPhotosAction': {
                click: function(){
                    var photos=this.interfaceControl.getSelectedPhotoIDs();
                    var nPhotos=photos.length;

                    if (nPhotos>this.MAXEXPORTPHOTOS){
                        Ext.Msg.alert("", "Please select at most "+this.MAXEXPORTPHOTOS+" photos to print at once ("+(nPhotos-this.MAXEXPORTPHOTOS)+" photo(s) must be deselected).");
                        return;
                    }
                    if (this.interfaceControl.allPhotosHaveFloorplan("email")){
                        this.getExportWindow("email").show();
                    } else{
                        this.requestEmailExport("standard", photos);
                    }
                }
            },
            '#printPhotosAction': {
                click: function(){
                    this.getExportWindow("print").show();
                }
            },
            '#printSelectionWindow': {
                choosetype: function(printType, printSelectionWindow){
                    printSelectionWindow.hide();

                    if (printSelectionWindow.action=='print'){
                        if (printType=="4view"){
                            window.open("../examples/4View.pdf",'_blank');
                        } else{
                            window.open("../examples/standard.pdf",'_blank');
                        }
                    } else if (printSelectionWindow.action=='email'){
                        this.requestEmailExport(printType);
                    }
                }
            },
            '#viewPhotosAction': {
                click: function(){
                    document.location.href="photoviewer.htm?ProjectUID="+(Ext.Object.fromQueryString(document.location.search)).ProjectUID+"&PhotoGroupType=X";
                }
            },
            '#saveToAlbumAction': {
                click: function(){
                    if (this.interfaceControl.albumStore.hasNonSystemAlbums()){
                        var albumWindow=Ext.create("mds.view.clientPhotoList.Album.AddPhotosToAlbumWindow");
                        Ext.getCmp("existingAlbumsCheckboxes").store=this.interfaceControl.albumStore;
                        albumWindow.show();
                    } else mds.app.getController("clientPhotoList.ToolbarActions").makeAlbum();
                }
            },
            '#addPhotosToAlbumNextAction': {
                click: function(){
                    if (Ext.getCmp("albumExistingOrNewOption").getChecked()[0].inputValue=="new") this.makeAlbum();
                    else this.makeAlbum(Ext.getCmp("addPhotosToAlbumWindow").getAlbumUID());
                }
            },
            '#saveNewAlbumAction': {
                click: function(){
                    if (this.albumSettingsAreValid()) this.saveAlbum();
                }
            },
            '#saveToComputerAction': {
                click: function(){
                    document.location.href="../examples/MultivistaPhotos.zip";
                }
            }
        });
    },
    requestEmailExport: function(type, photos){
        var URL=(type=="standard"?"../examples/email-standard/index.html":"../examples/email-4View/index.html");
        Ext.MessageBox.show({
            title: 'Export Successful!',
            msg: 'Your image may be viewed for the next 7 days at: <br/><br/><a href="'+URL+'" target="_blank">'+URL+'</a><br/><br/>'+'Click <a href="mailto:?body=Dear%20Colleague,%0A%0AThis%20link%20will%20take%20you%20to%20a%20photo%20of%20our%20project%20currently%20under%20construction:%0A%0A'+URL+'&subject=Multivista%20Photo%20Export%20page." target="_blank">here</a> to send this link via your email program.',
            buttons: Ext.MessageBox.OK
        });
    },
    getExportWindow: function(action){
        var exportWindow=Ext.getCmp('printSelectionWindow');
        if (!exportWindow) exportWindow=Ext.create("mds.view.clientPhotoList.widget.PrintSelectionWindow", {
            action: action
        });
        else exportWindow.action=action;
        return exportWindow;
    },
    makeAlbum: function(AlbumUID){
        var addPhotosToAlbumWindow=Ext.getCmp("addPhotosToAlbumWindow");
        if (addPhotosToAlbumWindow) addPhotosToAlbumWindow.destroy();

        var me=this;
        var callback=function(photos){
            var albumData={};
            albumData.photos=photos;
            if (AlbumUID){
                albumData.AlbumUID=AlbumUID;
            }
            me.interfaceControl.editAlbum=Ext.create('mds.model.clientPhotoList.Album', albumData);
            if (!AlbumUID) Ext.create("mds.view.clientPhotoList.widget.CreateAlbumWindow").show();
            else me.saveAlbum();
        };
        me.interfaceControl.getSelectedPhotoIDs(callback);
    },
    albumSettingsAreValid: function(){
        if (!Ext.getCmp('newAlbumName').isValid()){
            Ext.Msg.alert("", "Please enter a valid album name.");
            return false;
        }
        this.interfaceControl.editAlbum.set("AlbumName", Ext.getCmp('newAlbumName').value);
        this.interfaceControl.editAlbum.set("AlbumDescription", Ext.getCmp('newAlbumDescription').value);

        return true;
    },
    saveAlbum: function(){
        var me=this;
        this.interfaceControl.editAlbum.save({
            success: function(record, operation){
                var data=Ext.JSON.decode(operation.response.responseText).data;

                var AlbumUID=(data.AlbumUID?data.AlbumUID:me.interfaceControl.editAlbum.get("AlbumUID"));

                if (data.AlbumUID){
                    me.interfaceControl.fireEvent("newalbum", record, data);
                    me.showAddPhotosConfirm(AlbumUID, 'Album was successfully created.');
                } else{
                    me.interfaceControl.fireEvent("updatedalbum", record, data);
                    me.showAddPhotosConfirm(record.get("AlbumUID"), 'Album was successfully updated.');
                }
                var createAlbumWindow=Ext.getCmp("createAlbumWindow");
                if (createAlbumWindow) createAlbumWindow.destroy();
                var addPhotosToAlbumWindow=Ext.getCmp("addPhotosToAlbumWindow");
                if (addPhotosToAlbumWindow) addPhotosToAlbumWindow.destroy();
            },
            failure: function(record, operation){
                var error=operation.getError();
                if (typeof (error)!=="string") Ext.Msg.alert("", "An unexpected error has occurred.");
                else Ext.Msg.alert("", error);
            }
        });
    }
});
// @ sourceURL=ToolbarActionsController.js
