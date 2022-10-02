Ext.define('mds.controller.clientFileManager.Controller', {
    extend: 'Ext.app.Controller',
    models: [],
    stores: ['clientFileManager.ProjectFiles', 'clientFileManager.ProjectFolders', 'clientFileManager.Pushpins', 'clientFileManager.Versions'],
    views: ['clientFileManager.ClientFileManagerDisp', 'clientFileManager.FileManagerTree', 'clientFileManager.FileManagerList', 'clientFileManager.FileManagerDetail', 'clientFileManager.FileManagerToolbar', 'clientFileManager.FileDetailToolbar', 'clientFileManager.ProjectFileGrid', 'clientFileManager.FileDetailList', 'clientFileManager.EditFileWindow', 'clientFileManager.EditFolderWindow'],
    refs: [{
        ref: 'fileList',
        selector: 'fmList'
    }, {
        ref: 'folderTree',
        selector: 'fmTree'
    }, {
        ref: 'fileDetail',
        selector: 'fmDetail'
    }, {
        ref: 'fileGrid',
        selector: 'fmProjectFileGrid'
    }, {
        ref: 'deleteFilesButton',
        selector: '#deleteFilesButton'
    }, {
        ref: 'downloadFilesButton',
        selector: '#downloadFilesButton'
    }, {
        ref: 'createFolderButton',
        selector: '#createFolderButton'
    }, {
        ref: 'uploadButton',
        selector: '#uploadButton'
    }, {
        ref: 'recycleBinButton',
        selector: '#recycleBinButton'
    }, {
        ref: 'uploadShareButton',
        selector: '#shareButton'
    }, {
        ref: 'newFolderShareButton',
        selector: '#newFolderShareButton'
    }, {
        ref: 'newFolderNameField',
        selector: '#folderNameField'
    }, {
        ref: 'editFolderShareButton',
        selector: '#editFolderShareButton'
    }, {
        ref: 'editFolderNameField',
        selector: '#editFolderNameField'
    }, {
        ref: 'editFileShareButton',
        selector: '#editFileShareButton'
    }, {
        ref: 'editFileDetails',
        selector: '#editFileDetails'
    }, {
        ref: 'editFileSymbol',
        selector: '#editFileSymbol'
    }, {
        ref: 'storageMeter',
        selector: '#storageQuota'
    }],

    init: function(){

        this.userCanShare=false;
        this.userCanRead=false;
        this.userCanWrite=false;

        this._selectedRecord=null;
        this._uploadMode=null;

        this.projectUID=(Ext.Object.fromQueryString(document.location.search)).ProjectUID;
        this.currentFolderID=0;
        this.currentParentID=0;
        this.previousParentID=0;
        this.isRecycleBinMode=false;
        this.quotaMaxedOut=false;

        this.application.on({
            scope: this
        });

        this.getClientFileManagerProjectFilesStore().on({
            load: this.fileStoreLoaded,
            beforeload: this.fileStoreBeforeLoad,
            write: this.fileStoreWrite,
            scope: this
        });

        this.control({

            '#createFolderButton': {
                click: function(){
                    this.openCreateFolder();
                }
            },

            '#uploadButton': {
                click: function(){
                    this.openFileUploadWindow('new');
                }
            },

            '#addVersion': {
                click: function(){
                    this.openFileUploadWindow('versioned');
                }
            },

            '#folderUpButton': {
                click: function(){
                    if (this.currentFolderID!=0){
                        var selRecord=this.getFolderTree().getSelectionModel().getSelection()[0].parentNode;
                        var parentID=selRecord.get('DocumentUID');
                        if (parentID=='root'){
                            parentID=0;
                        } else{
                            this.getFolderTree().expandNode(selRecord, true);
                        }
                        this.getFolderTree().getSelectionModel().select(selRecord, false, true);
                        this.getFolderFiles(parentID);
                    }
                }
            },

            '#createFolder': {
                click: function(){
                    this.createNewFolder();
                }
            },

            '#saveFolder': {
                click: function(){
                    this.saveFolderChange();
                }
            },

            '#saveFile': {
                click: function(){
                    this.saveFileChange();
                }
            },

            '#cancelFolder': {
                click: function(){
                    this.closeCreateFolder();
                }
            },

            '#cancelEditFolder': {
                click: function(){
                    this.closeEditFolder();
                }
            },

            '#cancelEditFile': {
                click: function(){
                    this.closeEditFile();
                }
            },

            '#recycleBinButton': {
                click: function(){
                    this.getDeletedFiles();
                }
            },

            '#downloadFilesButton': {
                click: function(){
                    var selections=this.getFileGrid().getSelectionModel().getSelection();
                    var selectionsList=""
                    Ext.iterate(selections, function(record){
                        selectionsList+=record.get('DocumentUID')+",";
                    });
                    var maxFilesSize=1024*1024*100; // 100 mb
                    Ext.Ajax.request({
                        url: '?fuseaction=aClientFileManager.checkZipDownloadSize',
                        params: {
                            documentList: selectionsList
                        },
                        success: function(response){
                            var me=this;
                            var message="";
                            var title="";
                            var downloadTotalSize=Ext.JSON.decode(response.responseText).data;

                            title='Confirm Download';
                            message='Are you sure you want to download '+me.formatFileSize(downloadTotalSize)+' of files? <br /><br /> Your download will take a few seconds to get started.'

                            var selections=me.getFileGrid().getSelectionModel().getSelection();
                            if (selections.length>0){
                                if (downloadTotalSize<maxFilesSize){
                                    Ext.MessageBox.confirm(title, message, function(btn){
                                        if (btn==='yes'){
                                            me.downloadSelectedFiles();
                                        }
                                    });
                                } else{
                                    Ext.MessageBox.alert('Maximum size exceeded', 'You are trying to download '+me.formatFileSize(downloadTotalSize)+' of data, and the system currently allows<br /> a maximum of '+me.formatFileSize(maxFilesSize)+'. Please narrow your selection and try again.');
                                }
                            } else{
                                Ext.MessageBox.alert(title, 'No files are currently selected.');
                            }
                        },
                        scope: this
                    });
                }
            },

            '#deleteFilesButton': {
                click: function(){
                    var me=this;
                    var message="";
                    var title="";
                    if (this.isRecycleBinMode){
                        title='Confirm Un-delete';
                        message='Are you sure you want move selected file(s) out of the recycle bin and back to their original location?'
                    } else{
                        title='Confirm Delete';
                        message='Are you sure you want move selected file(s) to the recycle bin?'
                    }

                    var selections=this.getFileGrid().getSelectionModel().getSelection();
                    if (selections.length>0){
                        Ext.MessageBox.confirm(title, message, function(btn){
                            if (btn==='yes'){
                                me.deleteSelectedFiles();
                            }
                        });
                    } else{
                        Ext.MessageBox.alert(title, 'No files are currently selected.');
                    }
                }
            },

            'fmProjectFileGrid': {
                fileclicked: function(record){
                    this.selectFile(record);
                },
                dropsuccess: function(){
                    this.getClientFileManagerProjectFilesStore().save();
                }

            },

            'fmProjectFileGrid actioncolumn': {
                click: function(grid, view, recordIndex, cellIndex, item, e){
                    var record=grid.getStore().getAt(recordIndex);
                    if (!record.get('DocumentIsDeleted')){
                        if (cellIndex==2&&record.get('DocumentMimeType')=='folder'){
                            this.openEditFolder(record);
                        }
                        if (cellIndex==2&&record.get('DocumentMimeType')!='folder'){
                            this.openEditFile(record, 'version');
                        }
                        if (cellIndex==3&&record.get('PushpinCount')>0){
                            this.openEditFile(record, 'pushpin');
                        }
                    }
                }
            },

            'fmTree': {
                select: function(view, record, index, eOpts){
                    this.selectFile(record);
                },
                dropsuccess: function(){
                    this.getClientFileManagerProjectFilesStore().save();
                }
            },

            '#detailBack': {
                click: function(){
                    this.getFileList().show();
                    this.getFileDetail().hide();
                }
            },

            '#pushpinsGrid': {
                itemclick: function(view, record, h, ind, evt){
                    var projectUID=(Ext.Object.fromQueryString(document.location.search)).ProjectUID;
                    var floorplanUID=record.get('FloorplanUID');
                    var pushpinUID=record.get('PushpinUID');
                    window.location='clientFloorplanViewer.htm?ProjectUID='+projectUID+'&FloorplanUID='+floorplanUID+'&pushpinUID='+pushpinUID;
                }
            }

        })

    },

    onLaunch: function(){
        this.getFolderFiles(this.currentFolderID);
        this.getProjectFolders(0);
    },

    getPermissions: function(prop){
        var permissionsObj={
            'userCanShare': this.userCanShare,
            'userCanRead': this.userCanRead,
            'userCanWrite': this.userCanWrite
        };
        return permissionsObj[prop];
    },

    permissionsStoreLoaded: function(store, records, successful, eOpts){
        this.userCanShare=false;
        this.userCanRead=true;
        this.userCanWrite=false;
        this.enableUIFeatures();
    },

    fileStoreLoaded: function(store, node, records, successful, eOpts){

    },

    fileStoreBeforeLoad: function(store, operation, eOpts){

    },

    quotaStoreBeforeLoad: function(store, operation, eOpts){
        var projectUID=(Ext.Object.fromQueryString(document.location.search)).ProjectUID;
        store.getProxy().setExtraParam('projectID', projectUID);
    },

    fileStoreWrite: function(store, operation, eOpts){
        if (!this.isRecycleBinMode){
            this.getFolderFiles(this.currentFolderID);
            this.getProjectFolders(0);
        } else{
            this.getDeletedFiles();
            this.getProjectFolders(0);
        }
    },

    getFolderFiles: function(parentFolderID){
        this.currentFolderID=parentFolderID;
        this.getClientFileManagerProjectFilesStore().getProxy().setExtraParam('projectID', (Ext.Object.fromQueryString(document.location.search)).ProjectUID);
        this.getClientFileManagerProjectFilesStore().getProxy().setExtraParam('parentFolderID', parentFolderID);
        this.getClientFileManagerProjectFilesStore().read();
        this.isRecycleBinMode=false;
        this.setRecycleBinMode();
    },

    getProjectFolders: function(parentFolderID){
        this.getClientFileManagerProjectFoldersStore().getProxy().setExtraParam('projectID', (Ext.Object.fromQueryString(document.location.search)).ProjectUID);
        this.getClientFileManagerProjectFoldersStore().getProxy().setExtraParam('parentFolderID', parentFolderID);
        this.getClientFileManagerProjectFoldersStore().read();
    },

    openCreateFolder: function(){
        this.createFolderWindow=Ext.create('mds.view.clientFileManager.CreateFolderWindow', {}).show();
    },

    openEditFolder: function(record){
        this._selectedRecord=record;
        this.editFolderWindow=Ext.create('widget.editFolderWindow', {}).show();
        this.getEditFolderNameField().setValue(record.get('DocumentFilename'));
    },

    openEditFile: function(record){
        this._selectedRecord=record;
        this.editFileWindow=Ext.create('mds.view.clientFileManager.EditFileWindow', {}).show();
        this.getEditFileDetails().update([record.get('DocumentFilename'), record.get('DocumentURL'), record.get('DocumentCreatorName'), record.get('DocumentCreationDate'), record.get('DocumentLastEditorName'), record.get('DocumentLastEditedDate'), record.get('DocumentFileSize')]);
        this.getEditFileSymbol().setSrc(record.get('DocumentSymbol'));
        if (record.get('VersionCount')>0){
            this.editFileWindow.down('#fileMetaPanel').show();
            this.editFileWindow.down('#versionsGrid').getStore().loadRecords(record.getVersionStore().getRange());
        } else{
            this.editFileWindow.down('#versionsGrid').destroy();
        }
        if (record.get('PushpinCount')>0){
            this.editFileWindow.down('#fileMetaPanel').show();
            this.editFileWindow.down('#pushpinsGrid').getStore().loadRecords(record.getPushpinStore().getRange());
        } else{
            this.editFileWindow.down('#pushpinsGrid').destroy();
        }
        // this.editFileWindow.down('#versionsGrid').setVisible(record.get('VersionCount') > 0);
        // this.editFileWindow.down('#pushpinsGrid').setVisible(record.get('PushpinCount') > 0);
    },

    setRecycleBinMode: function(){
    },

    saveFolderChange: function(){
        var record=this._selectedRecord;
        record.set('DocumentFilename', this.getEditFolderNameField().getValue());
        record.set('ShareTypeID', this.getEditFolderShareButton().getSelectedShareType());
        record.set('MemberList', this.getEditFolderShareButton().getSelectedMemberList());
        this.getClientFileManagerProjectFilesStore().save();
        this.closeEditFolder();
    },

    saveFileChange: function(){
        var record=this._selectedRecord;
        // record.set('DocumentFilename', this.getEditFolderNameField().getValue());
        record.set('ShareTypeID', this.getEditFileShareButton().getSelectedShareType());
        record.set('MemberList', this.getEditFileShareButton().getSelectedMemberList());
        this.getClientFileManagerProjectFilesStore().save();
        this.closeEditFile();
    },

    deleteSelectedFiles: function(){
        var selections=this.getFileGrid().getSelectionModel().getSelection();
        var isDeleting=!this.isRecycleBinMode;
        Ext.iterate(selections, function(record){
            record.set('DocumentIsDeleted', isDeleting);
        });
        this.getClientFileManagerProjectFilesStore().save();
    },

    downloadSelectedFiles: function(){
        var selections=this.getFileGrid().getSelectionModel().getSelection();
        var selectionsList=""
        Ext.iterate(selections, function(record){
            selectionsList+=record.get('DocumentUID')+",";
        });

        var zipURL="?fuseaction=aClientFileManager.downloadFiles&documentList="+selectionsList;
        window.location=zipURL;

    },

    selectFile: function(record){
        if (record.get('DocumentMimeType')=='folder'){
            if (record.get('DocumentUID')=='root'){
                this.currentFolderID=0;
            } else{
                this.currentFolderID=record.get('DocumentUID');
            }
            var selRecord=this.getFolderTree().getStore().getById(this.currentFolderID);
            if (this.currentFolderID!=0){
                this.getFolderTree().getSelectionModel().select(selRecord, false, true);
                this.getFolderTree().expandNode(selRecord, true);
            }
            this.getFolderFiles(this.currentFolderID);
        } else{
            window.open(record.get('DocumentURL'), "_blank");
        }
    },

    closeCreateFolder: function(){
        this.createFolderWindow.close();
    },

    closeEditFolder: function(){
        this.editFolderWindow.close();
    },

    closeEditFile: function(){
        this.editFileWindow.close();
    },

    folderCreateComplete: function(){
        //this.getClientFileManagerProjectFilesStore().read();
        //this.getClientFileManagerProjectFoldersStore().read();
        this.getFolderFiles(this.currentFolderID)
        this.getProjectFolders(0);
        this.createFolderWindow.close();
    },

    enableUIFeatures: function(){
        this.getCreateFolderButton().setVisible(this.userCanWrite);
        this.getUploadButton().setVisible(this.userCanWrite);
        this.getDeleteFilesButton().setVisible(this.userCanWrite);
        this.getRecycleBinButton().setVisible(this.userCanWrite);
        this.getFileGrid().columns[2].setVisible(this.userCanWrite);
    },

    formatFileSize: function(size){
        var sizes=['bytes', 'KB', 'MB', 'GB', 'TB'], bytesInKB=1024;

        if (size===0){
            return 0+' '+sizes[0];
        } else if (size<0){ return 'n/a'; }
        var pow=Math.floor(Math.log(size)/Math.log(bytesInKB));
        if (pow>=sizes.length){
            pow=sizes.length-1;
        }
        var rounded=(size/Math.pow(bytesInKB, pow)).toFixed(1);
        if (rounded%1===0){
            rounded=parseInt(rounded);
        }
        return rounded+' '+sizes[pow];
    }

});

//@ sourceURL=fileManagerController.js