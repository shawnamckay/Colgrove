Ext.define('mds.view.clientPhotoList.widget.PhotoActionPanel', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.photoActionPanel',
    id: 'photoActionPanel',
    disabled: true,
    floating: true,
    border: 0,
    items: [{
        xtype: 'button',
        id: 'viewPhotosAction',
        text: 'View',
        icon: 'mds/image/icon/open_photoviewer.png',
        tooltip: 'View selected photos',
        cls: 'checkedPhotoActions'
    }, {
        id: 'savePhotosAction',
        text: 'Save',
        icon: 'mds/image/icon/disk_blue.png',
        tooltip: 'Save selected photos to computer/album',
        xtype: 'splitbutton',
        cls: 'checkedPhotoActions',
        menu: {
            xtype: 'menu',
            items: [{
                id: 'saveToComputerAction',
                text: 'To Computer',
                icon: 'mds/image/icon/disk_blue.png'
            }, {
                id: 'saveToAlbumAction',
                text: 'To Album',
                icon: 'mds/image/icon/folder_go.png',
                hidden: true
            }]
        }
    }, {
        text: 'Print',
        id: 'printPhotosAction',
        icon: 'mds/image/icon/printer_blue.png',
        tooltip: 'Print selected photos',
        cls: 'checkedPhotoActions'
    }, {
        text: 'Email',
        id: 'emailPhotosAction',
        icon: 'mds/image/icon/email_link.png',
        tooltip: 'Email selected photos',
        cls: 'checkedPhotoActions'
    }, {
        text: 'Remove from Album',
        id: 'removePhotosAction',
        icon: 'mds/image/icon/remove.png',
        tooltip: 'Remove selected photos from album',
        cls: 'checkedPhotoActions hideOnZeroChecked',
        hidden: true
    }, {
        text: 'Delete Photos',
        id: 'deletePhotosAction',
        icon: 'mds/image/icon/remove.png',
        tooltip: 'Delete selected photos',
        cls: 'checkedPhotoActions hideOnZeroChecked',
        hidden: true
    }, {
        text: 'Change Settings',
        id: 'updatePhotosAction',
        icon: 'mds/image/icon/VisibleUnknownSmall.png',
        tooltip: 'Change name and/or permissions for selected photos',
        cls: 'checkedPhotoActions hideOnZeroChecked',
        hidden: true,
        ShareTypeID: -1,
        MemberUIDs: null,
        setShareTypeID: function(ShareTypeID){
            this.ShareTypeID=ShareTypeID;
            if (this.ShareTypeID==1) this.setIcon("mds/image/icon/VisibleAllSmall.png");
            else if (this.ShareTypeID==2) this.setIcon("mds/image/icon/VisibleMeSmall.png");
            else if (this.ShareTypeID==3){
                this.setIcon("mds/image/icon/VisibleSelectedSmall.png");
            } else this.setIcon("mds/image/icon/VisibleUnknownSmall.png");
        },
        listeners: {
            hide: function(me){
                me.ShareTypeID=-1;
                me.MemberUIDs=null;
            }
        }
    }, {
        text: 'Add Photos',
        id: 'openPhotoUpload',
        icon: 'mds/module/clientFileManager/image/icons/folder_new.png'
    }, {
        xtype: 'container',
        id: 'clearSelectedAction',
        hidden: true,
        style: {
            cursor: 'default'
        },
        tpl: new Ext.XTemplate('<span class="selectedPhotoCount"><img src="mds/image/checkmark.png" width="13" height="13"/> {selectedPhotoCount} Photo{selectedThumbCount:this.chkCount} Selected</span>'+'&nbsp;&nbsp;<span id="clearSelectedLink"><a style="cursor:pointer">Clear</a></span>', {
            chkCount: function(value){
                if (value>1) return 's';
            }
        }),
        listeners: {
            click: {
                fn: function(e, t){
                    var cmp=Ext.getCmp("clearSelectedAction");
                    cmp.fireEvent("click", cmp);
                },
                element: 'el',
                delegate: '#clearSelectedLink',
                scope: this
            },
            afterrender: function(){
                this.update({
                    selectedPhotoCount: 0
                });
            }
        }
    }],
    disable: function(){
        Ext.select(".checkedPhotoActions").each(function(ele){
            Ext.getCmp(ele.dom.id).disable();
        });
    },
    enable: function(){
        Ext.select(".checkedPhotoActions").each(function(ele){
            Ext.getCmp(ele.dom.id).enable();
        });
    },
    show:function(){
        if (!config.SHOWPHOTOLISTTOOLBAR) return;
        this.callParent(arguments);
    },
    listeners: {
        show: function(){
            this.alignTo("sideContainer", "tl-tr");
            this.setWidth(Ext.getCmp("bodyContainer").getWidth());
        }
    }
});
