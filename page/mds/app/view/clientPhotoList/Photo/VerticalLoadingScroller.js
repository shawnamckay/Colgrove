Ext.define('mds.view.clientPhotoList.Photo.VerticalLoadingScroller', {
    // ///config/////
    extend: 'Ext.container.Container',
    id: 'photoVerticalLoadingScroller',
    width: "100%",
    threshold: 300,
    nPhotosToLoadAtOnce: 20,
    photoTemplate: new Ext.XTemplate(
        '<div class="managedPhotoInner">',
            '<a class="managedPhotoImageLink" href="photoviewer.htm?ProjectUID={[this.ProjectUID()]}&PhotoGroupType={[this.photoGroupType(values)]}&{[this.idParamString(values)]}&{[this.photoParamString(values)]}">',
                '<img class="managedPhotoImage" src="{ImageURL}" title="{[this.photoTitle(values)]}">',
            '</a>',
            '<div class="managedPhotoCheckboxWrap"  {[ this.hide() ]}>',
                '<input class="managedPhotoCheckbox" type="checkbox" name="photoSelector" value="{id}">',
            '</div>',
            '<div class="managedPhotoFavoriteWrap"  {[ this.hide() ]}>',
                '<a class="{[ this.favouriteClass(values) ]} managedPhotoFavorite" title="{[ this.favouriteTooltip(values) ]} "></a>',
            '</div>',
            '<tpl if="values.CommentCount">',
                '<div class="managedPhotoCommentWrap">',
                    '<div title="{CommentCount} comment(s)" class="managedPhotoNComments">{CommentCount}</div>',
                '</div>',
            '</tpl>',
            '<tpl if="values.HasAnnotations">',
                '<div class="managedPhotoAnnotationWrap">',
                    '<img src="mds/image/annotation.png" class="managedPhotoAnnotation" title="Photo is annotated">',
                '</div>',
            '</tpl>',
        '</div>', {
        photoTitle: function(values){
            var title=Ext.Date.format(values.PhotoDate, "F j, Y");
            if (values.PhotoNumber!==null) title+=" - Photo "+values.PhotoNumber;
            return title;
        },
        favouriteClass: function(values){
            return 'notFavourite';
        },
        favouriteTooltip:function(values){
            if (!Ext.getStore("clientPhotoList.PhotoCategories").favouritesStore)
                return "";
            return (Ext.getStore("clientPhotoList.PhotoCategories").favouritesStore.contains(values.id)?'Remove this photo from my Favorites':
                'Add this photo to my Favorites');
        },
        photoGroupType: function(values){
            return values.photoStoreID.charAt(0);
        },
        idParamString: function(values){
            var photoGroupType=this.photoGroupType(values);
            var string="";
            if (photoGroupType=="S") string="ShootUID=";
            else if (photoGroupType=="A") string="AlbumUID=";
            else if (photoGroupType=="U") string="MemberUID=";

            var splitID=values.photoStoreID.split("_");
            string+=(splitID)[1];

            if (photoGroupType=="U") string+="&PhotoGroupDate="+(splitID)[2];

            return string;
        },
        photoParamString: function(values){
            var photoType=values.id.charAt(0);
            var id=values.id.substring(1);

            if (photoType=="U") return "SelectedUDEFPhotoUID="+id;
            else if (photoType=="P") return "SelectedPhotoID="+id;
            return "SelectedWebcamPhotoUID="+id;
        },
        ProjectUID: function(){
            return (Ext.Object.fromQueryString(document.location.search)).ProjectUID;
        },
        hide:function(){
            return (config.SHOWPHOTOLISTFAVSANDCHECKBOXES?"":'style="display:none;"');   
        }
    }),
    
    constructor:function(config){
        if (!window.config.SHOWPHOTOLISTTOOLBAR)
            config.padding="0 0 40 0";
        this.callParent(arguments);
    },

    updateLayout: function(){
        if (this.updateLayoutOK) this.callParent(arguments);
    },

    forceUpdateLayout: function(){
        this.updateLayoutOK=true;
        this.updateLayout();
        this.updateLayoutOK=false;
    },

    reload: function(){
        Ext.log("SCROLLER RELOAD");
        Ext.log("-------");
        this.lastPhotoGroup=null;
        this.removeAll(true);
        this.reachedEnd=false;
        this.addItems();
    },

    needsMorePhotos: function(){
        var threshold=this.getScrollHeightFromBottom();
        return (((this.nCurrentlyLoadingPhotos===0&&!this.reachedEnd&&(threshold<=this.threshold*3||this.getHeight()<=this.ownerCt.ownerCt.ownerCt.getHeight())))?true:false);
    },

    emptyComponentBuffer: function(){
        var scroller=this;
        
        var afterImgResolved=function(){
            scroller.nCurrentlyLoadedPhotos++;
            if (scroller.nCurrentlyLoadedPhotos>=scroller.nPhotosToLoadAtOnce){
                var threshold=scroller.getScrollHeightFromBottom();
                if (threshold<=0&&!scroller.reachedEnd){
                    scroller.addItems();
                } else{
                    scroller.nCurrentlyLoadingPhotos=0;
                    document.getElementById("loadDiv").style.visibility="hidden";
                }
            }
        };
        
        var photoGroupStore=Ext.getStore('clientPhotoList.PhotoGroups');
        var photoDataBufferLength=this.photoDataBuffer.length;
        scroller.nCurrentlyLoadingPhotos=photoDataBufferLength;
        while (this.photoDataBuffer.length){
            var photoData=this.photoDataBuffer.shift();
            if (!scroller.lastPhotoGroup||!scroller.lastPhotoGroup.equals(photoData.photoGroup)){ // first photo of a group
                scroller.lastPhotoGroup=photoData.photoGroup;
                scroller.photoGroupContainer=Ext.create('Ext.container.Container', {
                    cls: 'photoGroupSection',
                    id: photoData.photoGroup.get("PhotoGroupType")+"_"+photoData.photoGroup.get("id")+(photoData.photoGroup.get("PhotoGroupDate")?"_"+Ext.Date.format(photoData.photoGroup.get("PhotoGroupDate"), "Y-m-d"):"")+"_section"
                });
                scroller.add(scroller.photoGroupContainer);
                scroller.photoGroupContainer.add({
                    xtype: 'container',
                    cls: 'photoGroupLabelWrap',
                    items: [{
                        xtype: 'container',
                        baseCls: 'photoGroupLabel',
                        items: [{
                            xtype: 'component',

                            html: (photoData.photoGroup.get("FormattedDate")?photoData.photoGroup.get("Label")+" - "+photoData.photoGroup.get("FormattedDate"):photoData.photoGroup.get("Label"))
                        }]
                    }]
                });
                scroller.photoGroupContainer.add({
                    cls: 'photoGroupDescription',
                    xtype: 'component',
                    html: photoData.photoGroup.get("Description")
                });

                if (photoData.photoGroup.get("userCanEditAlbum")&&!photoData.photoGroup.get("IsSystemAlbum")){
                    var settingsButton=Ext.create("mds.view.sharePermissions.SettingsButton", {
                        objectID: photoData.photoGroup.get("AlbumUID"),
                        ShareTypeID: photoData.photoGroup.get("ShareTypeID")
                    });
                    scroller.photoGroupContainer.child().child().add(settingsButton);
                }
            }
            photoData.photo.data.photoStoreID=photoGroupStore.getPhotoStoreID(photoData.photoGroup);
            var componentID=photoGroupStore.getComponentID(photoData.photoGroup, photoData.photo);
            var managedPhoto=Ext.create('Ext.Component', {
                id: componentID,
                baseCls: 'managedPhoto',
                tpl: this.photoTemplate,
                data: photoData.photo.data,
                style: "visibility:hidden"
            });
            scroller.photoGroupContainer.add(managedPhoto);
            managedPhoto.addListener("afterrender", function(managedPhoto){
                var img=this.el.dom.getElementsByTagName("img")[0];
                if (!img) return;
                img.onload=function(){
                    afterImgResolved();
                    if (!managedPhoto.el) return;
                    managedPhoto.el.dom.style.visibility="visible";
                };
                img.onerror=function(){
                    if (img.src.indexOf("missingImage.gif")==-1&&img.src.indexOf("UDEFPhotos")==-1&&img.src.indexOf("thumbs")==-1){
                        img.src=img.src.replace("medium", "thumbs");
                    } else{
                        Ext.getCmp(img.parentNode.parentNode.parentNode.id).destroy();
                        afterImgResolved();
                    }
                };
                var controller=mds.app.getController("clientPhotoList.Controller");

                var favouritesButton=Ext.select(".managedPhotoFavorite", false, managedPhoto.el.dom).elements[0];
                if (favouritesButton) favouritesButton.onclick=controller.onFavouritePhoto;

            }, managedPhoto, {
                single: true
            });
        }
        scroller.forceUpdateLayout();

        Ext.getCmp('sideContainer').enable();
        Ext.getCmp('photoCategoryCoverLinks').unmask();
        Ext.getCmp('photoVerticalLoadingScroller').unmask();
        Ext.getCmp("bodyContainer").unmask();
    },

    addItems: function(){
        var photoGroupStore=Ext.getStore('clientPhotoList.PhotoGroups');
        var scroller=this;
        this.photoDataBuffer=[];
        this.photoDataBufferCount=0;
        scroller.nCurrentlyLoadedPhotos=0;
        scroller.nCurrentlyLoadingPhotos=1;
        document.getElementById("loadDiv").style.visibility="visible";

        var callback=function(photoData){
            if (photoData===null){
                scroller.reachedEnd=true;
                document.getElementById("loadDiv").style.visibility="hidden";
                scroller.emptyComponentBuffer();
                return;
            }
            scroller.photoDataBuffer[scroller.photoDataBufferCount]=photoData;
            scroller.photoDataBufferCount++;
            if (scroller.photoDataBufferCount==scroller.nPhotosToLoadAtOnce) scroller.emptyComponentBuffer();
            else photoGroupStore.getNextPhoto(callback);
        };

        photoGroupStore.getNextPhoto(callback);
    },

    listeners: {
        boxready: function(ct){
            var store=this.store;
            var me=this;
            ct.ownerCt.ownerCt.ownerCt.el.on('scroll', function(){
                var threshold=ct.getScrollHeightFromBottom();
                if (threshold<=ct.threshold&&ct.needsMorePhotos()){
                    ct.addItems();
                }
            });
        }
    },
    getScrollHeightFromBottom: function(){
        return this.getHeight()-this.ownerCt.ownerCt.ownerCt.el.getScroll().top-this.ownerCt.ownerCt.ownerCt.getHeight()+1;
    },
    getRecord: function(dom){
        var photoInfo=dom.id.split("_");
        return (photoInfo[0]=="U"?Ext.getStore(photoInfo[0]+"_"+photoInfo[1]+"_"+photoInfo[2]).getById(photoInfo[3]):
            Ext.getStore(photoInfo[0]+"_"+photoInfo[1]).getById(photoInfo[2]));
    }
});
//@ sourceURL=photoListScroller.js
