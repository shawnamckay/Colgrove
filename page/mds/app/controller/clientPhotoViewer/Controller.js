Ext.define('mds.controller.clientPhotoViewer.Controller', {
    extend: 'Ext.app.Controller',
    views: ['clientPhotoViewer.vMain', 
        'clientPhotoViewer.vPhoto', 
        'clientPhotoViewer.vThumbs', 
        'clientPhotoViewer.overlay.vPhotoOverlay', 
        'clientPhotoViewer.overlay.vLeftOverlay', 
        'clientPhotoViewer.overlay.vRightOverlay', 
        'clientPhotoViewer.toolbar.vImgToolbarTop', 
        'clientPhotoViewer.sidebar.vRightSideBar', 
        'clientPhotoViewer.sidebar.vFloorPlan',
        'clientPhotoViewer.toolbar.button.DateLocationToggle'
        ],
    stores: ['clientPhotoViewer.Photos', 'clientPhotoViewer.Project', 'clientPhotoViewer.PhotosSubset'],
    refs: [{ref: 'image',selector: '#pvImage'}, 
        {ref: 'photoviewinner',selector: '#pvPhotoViewInner'}, 
        {ref: 'photoContainer',selector: '#photoContainer'}, 
        {ref: 'photoThumbContainer',selector: '#photoThumbContainer'}, 
        {ref: 'thumbView',selector: 'pvPhotoThumbs'}, 
        {ref: 'thumbWrapper',selector: '#photoThumbContainerWrapper'}, 
        {ref: 'imageOverlay',selector: '#photoContainerOverlay'}, 
        {ref: 'imageOverlayC',selector: '#overlayCenter'}, 
        {ref: 'imageOverlayL',selector: '#overlayLeft'}, 
        {ref: 'imageOverlayR',selector: '#overlayRight'}, 
        {ref: 'imageOverlayZoomIn',selector: '#overlayZoomIn'}, 
        {ref: 'imageOverlayZoomOut',selector: '#overlayZoomOut'}, 
        {ref: 'imageOverlayRefresh',selector: '#overlayRefresh'}, 
        {ref: 'imageOverlayAnnotation',selector: '#overlayAnnotation'}, 
        {ref: 'tplPhotoInfoName',selector: '#tplPhotoInfoName'}, 
        {ref: 'tplSideBarTopProjectImg',selector: '#tplSideBarTopProjectImg'}, 
        {ref: 'tplSideBarTopProject',selector: '#tplSideBarTopProject'}, 
        {ref: 'tplSideBarTopPhoto',selector: '#tplSideBarTopPhoto'}, 
        {ref: 'tplSideBarFloorplan',selector: '#tplSideBarFloorplan'}, 
        {ref: 'toolbarTmbCount',selector: '#tplSelectedTmbCount'}, 
        {ref: 'toolbarModeSelectionButton',selector: '#dateLocationToggleButton'},
        {ref: 'floorplanView',selector: '#pvFloorPlan'}, 
        {ref: 'floorplanImage',selector: '#pvFloorplanImg'}, 
        {ref: 'floorplanContainer',selector: '#floorplanContainer'}, 
        {ref: 'hotspotContainer',selector: '#hotspotContainer'}, 
        {ref: 'addCommentView',selector: '#pvAddComment'}
        ],
    //CONTROLLER VARIABLES
    //IMAGE
    _imageWidth: 0,
    _imageHeight: 0,
    _naturalWidth: null,
    _naturalHeight: null,

    //ZOOM & OVERLAY 
    _zoomFactor: 1.25,
    _zoomInCount: 0,
    _zoomOutCount: 0,
    _zoomOutMax: 0,
    _zoomInMax: 20,
    _chevronBuffer: 130,

    //STORE
    _photoGroupType: 's',
    _shootUID: null,
    _albumUID: null,
    _projectUID: null,
    _photoGroupDate: null,
    _selectedPhotoID: null,

    //LAZY STORE
    _lazyStore: null,
    _lazyLoadNumberOfRecords: 60,
    _lastSelectedRecord: null,
    _selectedRecord: null,
    _selectedRecordIndex: 0,
    _initLoad: false,

    //THUMBS
    _thumbsLoading: true,
    _thumbCount: 0,
    _manualScroll: false,

    //SLIDESHOW
    _slideshowIsOn: false,

    //MISC
    _backURL: null,
    _memberPermission: null,
    
    init: function(){
        //GET VARIABLES FROM THE URL QUERY STRING AND SET THEM IN THE CONTROLLERS SCOPE FOR USE
        var urlParams=(Ext.Object.fromQueryString(document.location.search));
        this._photoGroupType=urlParams.PhotoGroupType?urlParams.PhotoGroupType:'';
        this._shootUID=urlParams.ShootUID?urlParams.ShootUID:'';
        this._albumUID=urlParams.AlbumUID?urlParams.AlbumUID:'';
        this._webcamUID=urlParams.WebcamUID?urlParams.WebcamUID:'';
        this._projectUID=urlParams.ProjectUID?urlParams.ProjectUID:'';
        this._memberUID=urlParams.MemberUID?urlParams.MemberUID:'';
        this._photoGroupDate=urlParams.PhotoGroupDate?urlParams.PhotoGroupDate:'1-1-1900';
        this._selectedPhotoID=urlParams.SelectedPhotoID?urlParams.SelectedPhotoID:0;
        this._selectedUDEFPhotoUID=urlParams.SelectedUDEFPhotoUID?urlParams.SelectedUDEFPhotoUID:null;
        this._selectedWebcamPhotoUID=urlParams.SelectedWebcamPhotoUID?urlParams.SelectedWebcamPhotoUID:null;
        this._selectedPhotoTime=urlParams.SelectedPhotoTime?urlParams.SelectedPhotoTime:null;

        //CREATE EMPTY STORE FOR LAZY LOADING OF RECORDS FROM THE PHOTOS STORE AND MAKE IT A PROPERTY OF THE CONTROLLER
        this._lazyStore=Ext.getStore("clientPhotoViewer.PhotosSubset");

        // add custom events to the application scope that are referenced in views as listeners
        this.application.on({
            clickLeftOverlay: function(){this.disableSlideshow();this.previousImage(true);},
            clickRightOverlay: function(){this.disableSlideshow();this.nextImage(true);},
            imgLoad: this.imageIsLoaded,
            thumbScroll: this.handleScroll,
            mouseWheelZoom: function(layer, eventObj, element){this.disableSlideshow();this.mouseWheelZoom(layer, eventObj, element);},
            overlayCDblClick: function(element, eventObj, htmlElement){this.disableSlideshow();this.overlayCDblClick(element, eventObj, htmlElement);},
            overlayCDrag: function(element){this.getImage().getEl().setPositioning(element.getPositioning());},
            overlayCDragMouseUp: function(element){element.removeCls('overlayCenterDrag');},
            overlayCDragMouseDown: function(element){this.disableSlideshow();element.addCls('overlayCenterDrag');},
            dateLocationToggleButton: function(window,extObj,el){this.disableSlideshow();this.modeSelection(window,extObj,el);},
            zoomClick: function(w, evtObj, el){this.disableSlideshow();this.zoomClick(w, evtObj, el);
            },
            scope: this
        });

        this.keyNavManager=new Ext.util.KeyMap({
            target: Ext.getBody(),
            eventName: 'keypress',
            processEvent: function(event){
                mds.app.getController("clientPhotoViewer.Controller").disableSlideshow();
                return event;
            }
        });

        this.keyNavArrows=new Ext.util.KeyNav({
            target: Ext.getBody(),
            left: function(e){
                this.thumbsArrowKeys(e);
                return true;
            },
            right: function(e){
                this.thumbsArrowKeys(e);
                return true;
            },
            scope: this
        });

        this.control({
            '#pvImage': {
                resize: function(img){
                    this._imageHeight=img.getHeight();
                    this._imageWidth=img.getWidth();
                }
            },
            '#pvToolBarView > button': {
                click: function(el){
                    if (el.id!='slideshowButton'){
                        this.disableSlideshow();
                    }
                    return true;
                }
            },
            '#photoContainer': {
                resize: this.refreshPhotoContainer
            },
            '#saveBtn': {
                click: function(){
                    window.open(pvImage.src);
                }                
            }
        });
    },
    onLaunch: function(){
        this.getClientPhotoViewerPhotosStore().on({
            beforeload: this.loadPhotosStoreParams,
            load: this.lazyLoadPhotos,
            scope: this
        });
        this.getClientPhotoViewerProjectStore().on({
            load: function(store, records){
                if (null!=records){
                    this.getTplSideBarTopProject().update(store.getAt(0).data);
                    this.getTplSideBarTopProjectImg().update(store.getAt(0).data);
                }
            },
            scope: this
        });
        if (this._photoGroupType!='W'){
            this.getClientPhotoViewerPhotosStore().load();
        }
    },
    loadPermissionViews: function(store, records){
        this._memberPermission=store.getAt(0);
        commentController=mds.app.getController('clientPhotoViewer.Comments');

        //MAKE VIEW CHANGES WHERE APPLICABLE
        if (this._memberPermission.get('comment').write){

            //COMMENT SIDEBAR VIEWS
            this.getAddCommentView().setVisible(true);
            if (!this._memberPermission.get('userCanShare')){
                commentController.getNewCommentShareMemberButton().setSelectedShareType(2);
                commentController.getNewCommentShareMemberButton().setDisabled(true);
            }
            var albumStore=Ext.getStore("clientPhotoViewer.Albums");
            albumStore.addListener("load", function(store){
                this._favsAlbumUID=store.proxy.reader.rawData[0].AlbumUID; //favs is first album
            }, this, {
                single: true
            });
            Ext.getStore("clientPhotoViewer.Albums").load({
                params: {
                    ProjectUID: this._projectUID
                }
            });
        }
        //DISABLE OR HIDE VIEW ELEMENTS
        else{
            //TOOLBAR
            Ext.getCmp("saveToAlbumAction").hide();
        }
    },
    loadThumbData: function(loadThumbImages){
        this._thumbCount=0;
        var thumbView=this.getThumbView();
        var data=this._lazyStore.data;
        var rawData=[];
        var controller=mds.app.getController('clientPhotoViewer.Controller');
        data.each(function(model, index){
            rawData[index]=model.data;
            if (loadThumbImages){
                controller.thumbLoadListener(model);
            }
        });
        thumbView.update(rawData);
    },
    thumbLoadListener: function(record){
        var tmb=record.get('tmb');
        var controller=mds.app.getController('clientPhotoViewer.Controller');
        var imageObjectTmb=new Image();

        imageObjectTmb.onload=function(){
            controller._thumbCount++;
            if (controller._thumbCount==controller._lazyStore.getCount()){
                controller._thumbsLoading=false;
            }
            if (!controller._thumbsLoading){
                if (controller._initLoad&&!controller._manualScroll||controller._initLoad){
                    controller.scrollToRecord();
                }
                if (controller._manualScroll){
                    controller._manualScroll=false;
                }
                controller.toggleThumbNav(false);
            }
        }
        imageObjectTmb.onerror=function(){
            delete imageObjectTmb;
        }
        imageObjectTmb.onabort=function(){
            delete imageObjectTmb;
        }
        imageObjectTmb.src=tmb;
    },
    thumbSelect: function(record){
        //VIEW UPDATES
        if (this._lastSelectedRecord!=null){
            var thumbLast=Ext.get('tmb_'+this._lastSelectedRecord.get('storePosition')).removeCls('thumbSelected');
        }
        var thumb=Ext.get('tmb_'+record.get('storePosition')).addCls('thumbSelected');

        //LAZY STORE UPDATES
        this._lazyStore.each(function(model, index){
            model.set('tmbSelected', false);
        });
        record.set('tmbSelected', true);
    },
    thumbClick: function(evtObj, el){
        var storePosition=el.id.split('_')[1];
        var record=this._lazyStore.queryBy(function(record, id){
            return record.get('storePosition')==storePosition;
        }).getAt(0);
        this._lastSelectedRecord=this._selectedRecord;
        this._selectedRecord=record;
        this.loadSelectedImage();
    },
    thumbCheckbox: function(evtObj, el){
        this.getToolbarTmbCount().show();
        var counter=0;
        var parent=Ext.get(el).findParent('.thumbContainer');
        var storePosition=parent.id.split('_')[1];
        var parentEl=Ext.get(parent);
        var record=this._lazyStore.queryBy(function(record, id){
            return record.get('storePosition')==storePosition;
        }).getAt(0);
        //UPDATE LAZY STORE
        if (el.checked){
            record.set('isSelected', true);
            parentEl.addCls('thumbChecked');
        } else{
            record.set('isSelected', false);
            parentEl.removeCls('thumbChecked');
        }

        //COUNT NUMBER OF CHECKED THUMBS
        this._lazyStore.each(function(model, index){
            if (model.get('isSelected')){
                counter++;
            }
        });
        //UPDATE VIEW TEMPLATE IN TOOLBAR
        if (counter){
            this.getToolbarTmbCount().update({
                'selectedThumbCount': counter
            });
        } else{
            this.getToolbarTmbCount().hide();
        }
    },
    clearSelectedThumbs: function(){
        this._lazyStore.each(function(model, index){
            model.set('isSelected', false);
        });
        this.loadThumbData(false);
        this.getToolbarTmbCount().update({
            'selectedThumbCount': 0
        });
        this.getToolbarTmbCount().hide();
    },
    lazyLoadPhotos: function(store, records){
        this.getSelectedRecord(store);
        var thumbCount=store.getCount();
        var selectedThumbIndex=this._selectedRecordIndex;
        var startIndexPos=Math.floor(this._lazyLoadNumberOfRecords/2);
        var endIndexPos=Math.ceil(this._lazyLoadNumberOfRecords/2);
        var lazyRecords=null;

        //LOADING OF IMAGES
        this._initLoad=true;

        //LOAD MASK
        this.toggleThumbNav(true);

        //LAZY LOAD NOT REQUIRED
        if (thumbCount<=this._lazyLoadNumberOfRecords){
            lazyRecords=store.getRange(0, thumbCount);
            this._lazyStore.add(lazyRecords);
            this._lazyStore.sort('storePosition', 'ASC');
        }
        //LAZY LOAD LOGIC
        if (thumbCount>this._lazyLoadNumberOfRecords){
            var startPos=0;
            var endPos=thumbCount-1;

            //GET START POSITION
            if ((selectedThumbIndex-startIndexPos)>0){
                startPos=selectedThumbIndex-startIndexPos;
            }
            //GET END POSITION
            if ((selectedThumbIndex+endIndexPos)<thumbCount-1){
                endPos=selectedThumbIndex+endIndexPos;
            }
            //GET RANGE OF RECORDS
            lazyRecords=store.getRange(startPos, endPos);
            //ADD RECORDS TO LAZY STORE
            this._lazyStore.add(lazyRecords);
            this._lazyStore.sort('storePosition', 'ASC');
        }
        this.loadImageOverlay();
        this.loadThumbData(true);
        this.loadSelectedImage();
    },
    lazyLoadMorePhotos: function(direction){
        var startPos=null;
        var endPos=null;
        var startIndexPos=Math.floor(this._lazyLoadNumberOfRecords/2);
        var endIndexPos=Math.ceil(this._lazyLoadNumberOfRecords/2);
        var parentStore=this.getClientPhotoViewerPhotosStore();
        var lazyRecords=[];

        //RELOADING OF IMAGES
        if (!this._manualScroll){
            this._initLoad=true;
        }

        //LOAD MASK
        this.toggleThumbNav(true);

        //RESET THE THUMB IMAGE LOADING BOOLEAN
        this._thumbsLoading=true;

        switch (direction){
            case 'left':
                endPos=this._lazyStore.first().get('storePosition')-2;
                startPos=endPos-startIndexPos;
                if (startPos<0){
                    startPos=0;
                }
                if (this._lazyStore.first().get('storePosition')!=parentStore.first().get('storePosition')){
                    lazyRecords=parentStore.getRange(startPos, endPos);
                    this._lazyStore.add(lazyRecords);
                    this._lazyStore.sort('storePosition', 'ASC');
                    this.loadThumbData(true);
                } else{
                    this._initLoad=false;
                }
                break;

            case 'right':
                startPos=this._lazyStore.last().get('storePosition');
                endPos=startPos+endIndexPos;
                if (endPos>parentStore.getCount()){
                    endPos=parentStore.getCount();
                }
                if (this._lazyStore.last().get('storePosition')!=parentStore.last().get('storePosition')){
                    lazyRecords=parentStore.getRange(startPos, endPos);
                    this._lazyStore.add(lazyRecords);
                    this._lazyStore.sort('storePosition', 'ASC');
                    this.loadThumbData(true);
                } else{
                    this._initLoad=false;
                }
                break;

            case 'all':
                if (this._lazyStore.count()==parentStore.count()){
                    this._initLoad=false;
                    break;
                }
                if (this._selectedRecord.get('storePosition')==1){
                    var startPos=this._lazyStore.last().get('storePosition');
                    var endPos=parentStore.last().get('storePosition');
                }
                if (this._selectedRecord.get('storePosition')==parentStore.last().get('storePosition')){
                    var startPos=0;
                    var endPos=this._lazyStore.first().get('storePosition')-2;
                }
                lazyRecords=parentStore.getRange(startPos, endPos);
                if (lazyRecords.length){
                    this._lazyStore.add(lazyRecords);
                    this._lazyStore.sort('storePosition', 'ASC');
                    this.loadThumbData(true);
                } else{
                    this._initLoad=false;
                }
                break;
        }

        //CHECK IF RECORDS WERE ADDED; IF NONE WERE ADDED TURN OFF LOADING MASK
        if (lazyRecords.length==0&&!this._initLoad){
            this._thumbsLoading=false;
            this.toggleThumbNav(false);
        }
    },
    loadPhotosStoreParams: function(store, operation, eOpts){
        var group=this._photoGroupType;
        var shootUID=this._shootUID;
        var albumUID=this._albumUID;
        var webcamUID=this._webcamUID;
        var projectUID=this._projectUID;
        var photoGroupDate=this._photoGroupDate;
        var memberUID=this._memberUID;

        if (group.toLowerCase()=='u'){
            store.getProxy().setExtraParam('photoGroupDate', photoGroupDate);
            store.getProxy().setExtraParam('memberUID', memberUID);
        } else if (group.toLowerCase()=='w'){
            if (photoGroupDate=="1-1-1900"){
                //this._photoGroupDate=Ext.Date.format(Ext.getStore("clientPhotoViewer.Webcams").getAt(0).get("MostRecentPhotoDate"), 'Y-m-d');
            	//AR: bug fix for multiple webcam per project;lookup by id rather than position
            	this._photoGroupDate=Ext.Date.format(Ext.getStore("clientPhotoViewer.Webcams").getById(webcamUID).get("MostRecentPhotoDate"), 'Y-m-d');
                photoGroupDate=this._photoGroupDate;
            }
            store.getProxy().setExtraParam('photoGroupDate', photoGroupDate);
            store.getProxy().setExtraParam('webcamUID', webcamUID);
        } else if (group.toLowerCase()=='c'){
            store.getProxy().setExtraParam('webcamUID', webcamUID);
            var qs=(Ext.Object.fromQueryString(document.location.search));
            var params=['start', 'end', 'stype', 'h', 'm', 'rtype', 'x', 'wd', 'd'];
            for ( var i=0; i<params.length; i++){
                if (qs[params[i]]!==undefined) store.getProxy().setExtraParam(params[i], qs[params[i]]);
            }
        }else if (group.toLowerCase()=='p'){
            store.getProxy().setExtraParam('pushpinUID', (Ext.Object.fromQueryString(document.location.search)).PushpinUID);    
        }
        store.getProxy().setExtraParam('shootUID', shootUID);
        store.getProxy().setExtraParam('albumUID', albumUID);
        store.getProxy().setExtraParam('projectUID', projectUID);
        store.getProxy().setExtraParam('groupType', group);
    },
    loadSelectedImage: function(){
        var image=this.getImage();
        var thumbView=this.getThumbView();
        var record=this._selectedRecord;
        var src='';
        var imageObject=new Image();
        var controller=this;
        if (record!=null){
            src=record.get('src');

            //LARGE IMAGE ONLOAD
            imageObject.onload=function(){
                controller._naturalWidth=height=imageObject.width;
                controller._naturalHeight=height=imageObject.height;
                image.getEl().fadeIn();
                image.setSrc(src);
                delete imageObject;
                controller.fireEvent("imageReady");
            }
            controller._zoomInCount=0;
            controller._zoomOutCount=0;
            controller.fireEvent("imageLoad", record);
            imageObject.src=src;

            controller.refreshViews(record);
            controller.thumbSelect(record);
            controller.loadFloorplan();
            mds.app.getController("clientPhotoViewer.Webcam").loadWebcam(record);

            if (!controller._thumbsLoading){
                controller.scrollToRecord();
            }

            //LOAD ANNOTATIONS
            if (record.get('hasAnnotations')>0&&mds.app.getController("clientPhotoViewer.Annotations").readingAnnotationsIsAllowed()){
                controller.getImageOverlayAnnotation().show();
                controller.getImageOverlayAnnotation().getEl().setStyle({
                    'opacity': '.5'
                });
            } else{
                controller.getImageOverlayAnnotation().hide();
            }

            //LOAD COMMENTS
            if (record.getCommentStore().getCount()>0){
                mds.app.getController("clientPhotoViewer.Comments").loadComments();
            } else{
                mds.app.getController("clientPhotoViewer.Comments").getTplCommentDataview().update([]);
            }
            //PRELOAD THE NEXT OR PREVIOUS IMAGE
            controller.preloadPrevNextHiResImages(record);
        } else{
            //THERE WAS NO RECORD SET ON LOAD!!!
            switch (this._photoGroupType.toLowerCase()){
                case 'w':
                    Ext.Msg.alert("", "There are no photos are available for the selected day.");
                    mds.app.getController("clientPhotoViewer.Webcam").loadWebcam(null);
                    break;
                case 'c':
                    Ext.Msg.alert("", "No photos matched the provided criteria.");
                    mds.app.getController("clientPhotoViewer.Webcam").loadWebcam(null);
                    break;
                default:
                    this.disablePhotoViewer();

            }
        }
    },
    loadFloorplan: function(){
        if (this._selectedRecord.get('floorplanImage').length==0){
            this.getTplSideBarFloorplan().hide();
            this.getHotspotContainer().hide();
            this.getFloorplanContainer().hide();
            Ext.getCmp("pvFloorPlan").hide();
            this.getToolbarModeSelectionButton().setDisabled(true);
            //this.getToolbarModeToggleLabelLocation().setDisabled(true);
            //this.getToolbarModeToggleLabelDate().setDisabled(true);
            return;
        } else{
            Ext.getCmp("pvFloorPlan").show();
            this.getFloorplanView().show();
            this.getTplSideBarFloorplan().show();
            this.getFloorplanContainer().show();
            this.getHotspotContainer().show();
            this.getHotspotContainer().center();
            this.getToolbarModeSelectionButton().setDisabled(false);
            //this.getToolbarModeToggleLabelLocation().setDisabled(false);
            //this.getToolbarModeToggleLabelDate().setDisabled(false);
            this.floorplanOffset(this._selectedRecord);
        }
    },
    imageIsLoaded: function(window, event, element, fireevent){
        var overlayC=this.getImageOverlayC();
        var imageElement=Ext.get(element);
        this._imageWidth=element.width;
        this._imageHeight=element.height;
        this.refreshImage();
        //APPLY CENTER OVERLAY ON IMAGE FOR DRAGGING
        if (overlayC.isVisible()){
            overlayC.getEl().setBox(imageElement.getBox());
        }
    },
    preloadPrevNextHiResImages: function(record){
        var store=this.getClientPhotoViewerPhotosStore();
        var index=store.indexOf(record);
        var prevRecord='', nextRecord='';
        var prevImage=new Image(), nextImage=new Image();
        if (store.count()>=3){
            if (index==0){
                prevRecord=store.last();
                nextRecord=store.getAt(1);
            } else if (index==(store.getCount()-1)){
                prevRecord=store.getAt(index-1);
                nextRecord=store.first();
            } else{
                prevRecord=store.getAt(index-1);
                nextRecord=store.getAt(index+1);
            }
            prevImage.src=prevRecord.get('src');
            nextImage.src=nextRecord.get('src');
        }
    },
    handleScroll: function(window, eventObject, htmlEl){
        var element=Ext.get(htmlEl);
        var elementScrollWidth=htmlEl.scrollWidth;
        var elementwidth=element.getWidth();
        var buffer=0;
        var threshold=(elementScrollWidth-elementwidth)-buffer;

        if (element.getScroll().left==buffer&&!this._thumbsLoading){
            this.lazyLoadMorePhotos('left', false);
        }
        if (element.getScroll().left==threshold&&!this._thumbsLoading){
            this.lazyLoadMorePhotos('right', false);
        }
    },
    scrollToRecord: function(){
        if (this._selectedRecord!=null){
            var selectedNodeEl=Ext.get('tmb_'+this._selectedRecord.get('storePosition'));
            var parentContainerEl=this.getPhotoThumbContainer().getEl();
            var viewWidth=this.getPhotoContainer().getWidth();
            if (selectedNodeEl){
                var theOffsetLeft=selectedNodeEl.dom.offsetLeft;
                var theScrollLeft=parentContainerEl.getScroll().left;
                var theScrollAreaWidth=parentContainerEl.getWidth();
                if ((theOffsetLeft+selectedNodeEl.getWidth())>theScrollLeft+theScrollAreaWidth||theOffsetLeft<theScrollLeft||this._initLoad){
                    parentContainerEl.scrollTo('left', theOffsetLeft-(viewWidth/2-selectedNodeEl.getWidth()/2));
                }
                if (this._initLoad){
                    this._initLoad=false;
                }
            }
        }
    },
    thumbsArrowKeys: function(eventObject){
        var record=null;
        var el=Ext.get(eventObject.getTarget());
        var keyCode=eventObject.getKey();
        this.disableSlideshow();
        if (eventObject.isNavKeyPress()&&el.dom.name!='newComment'){
            if (!this.getThumbWrapper().isDisabled()||!this._thumbsLoading){
                switch (keyCode){
                    case 37: //LEFT ARROW KEY
                        record=this.previousImage(false);
                        if (record.get('storePosition')==1) this.lazyLoadMorePhotos('all', true);
                        break;
                    case 39: //RIGHT ARROW KEY
                        record=this.nextImage(false);
                        if (record.get('storePosition')==this.getClientPhotoViewerPhotosStore().last().get('storePosition')) this.lazyLoadMorePhotos('all', true);
                        break;
                }
                this.loadSelectedImage();
            }
        }
        return true;
    },
    refreshImage: function(){
        var innerView=this.getPhotoviewinner();
        var image=this.getImage();
        var zoomIn=null;
        var zoomFactor=null;
        //GET ZOOM STATE
        if (image.getHeight()>innerView.getHeight()){
            zoomIn=true;
            zoomFactor=image.getHeight()/innerView.getHeight();
        } else if (image.getHeight()<innerView.getHeight()){
            zoomIn=false;
            zoomFactor=innerView.getHeight()/image.getHeight();
        }
        ;
        //SET HEIGHT BASED ON ZOOM STATE
        if (null!=zoomIn){
            if (zoomIn){
                image.setHeight(image.getHeight()/zoomFactor);
            } else if (!zoomIn){
                image.setHeight(image.getHeight()*zoomFactor);
            }
        } else{
            image.setHeight(innerView.getHeight());
        }
        //POSITION
        var offsetLeft=innerView.getWidth()/2-(this._imageWidth/2);
        image.setPosition(offsetLeft, 0);
    },
    refreshViews: function(record){
        this.getTplPhotoInfoName().update(record.data);
        this.getTplSideBarTopPhoto().update(record.data);
        this.getTplSideBarFloorplan().update(record.data);
    },
    refreshPhotoContainer: function(){
        //REFRESH IMAGE
        this.refreshImage();
        //RESET ZOOM
        this._zoomInCount=0;
        this._zoomOutCount=0;
        //REFRESH OVERLAYS

        //If annotating, don't put overlay on top of annotations canvas
        if (Ext.getCmp("annotationsDC").readOnly) this.loadImageOverlay();

        if (this.getImageOverlayC().isVisible()){
            this.getImageOverlayC().getEl().setBox(this.getImage().getBox());
        }
        //REFRESH FLOORPLAN
        if (null!=this._selectedRecord){
            this.floorplanOffset(this._selectedRecord);
            this.getHotspotContainer().center();
        }
    },
    getSelectedRecord: function(store){
        var selectedRecord='';
        var selectedPhotoID=this._selectedPhotoID;
        var selectedUDEF=this._selectedUDEFPhotoUID;
        var selectedWebcam=this._selectedWebcamPhotoUID;
        var index=0;
        var selectedRecordIndex=index;
        //SELECTED IMAGE
        if (selectedPhotoID>0){
            var qRecords=store.queryBy(function(record, id){
                return record.get('photoID')==selectedPhotoID;
            });
            if (qRecords.getCount()){
                selectedRecord=qRecords.getAt(0);
                selectedRecordIndex=store.indexOf(selectedRecord);
            } else{
                selectedRecord=store.getAt(index);
            }
        }
        //SELECTED UDEF IMAGE
        else if (selectedUDEF!=null){
            var qRecords=store.queryBy(function(record, id){
                return record.get('UDEFPhotoUID')==selectedUDEF;
            });
            if (qRecords.getCount()){
                selectedRecord=qRecords.getAt(0);
                selectedRecordIndex=store.indexOf(selectedRecord);
            } else{
                selectedRecord=store.getAt(index);
            }
        } else if (selectedWebcam!=null){
            var qRecords=store.queryBy(function(record, id){
                return record.get('WebcamPhotoUID')==selectedWebcam;
            });
            if (qRecords.getCount()){
                selectedRecord=qRecords.getAt(0);
                selectedRecordIndex=store.indexOf(selectedRecord);
            } else{
                selectedRecord=store.getAt(index);
            }
        } else if (this._selectedPhotoTime!=null){
            var targetDateTaken=Ext.Date.parse(this._photoGroupDate+" "+this._selectedPhotoTime, "Y-m-d Hi");
            var count=store.count();
            var bestRecord=null;
            var bestDiff=null;

            for ( var i=0; i<count; i++){
                var record=store.getAt(i);
                var diff=Math.abs(record.get("dateTaken").getTime()-targetDateTaken.getTime());
                if (bestRecord==null||diff<bestDiff){
                    bestRecord=record;
                    bestDiff=diff;
                }
                if (bestDiff===0||diff>bestDiff) break;
            }
            selectedRecord=bestRecord;
            selectedRecordIndex=store.indexOf(selectedRecord);
        } else if (store.getCount()>0){
            selectedRecord=store.getAt(index);
        }
        try{
            if (selectedRecord.isValid()){
                this._selectedRecord=selectedRecord;
                this._selectedRecordIndex=selectedRecordIndex;
                Ext.getCmp("pvToolBarView").enable();
            }
        } catch(err){
            this._selectedRecord=null;
        }
    },
    floorplanOffset: function(record){
        if (record.get('floorplanImage').length>0){
            var floorPlan=this.getFloorplanImage();
            var leftOffset=117;
            var topOffset=128;
            floorPlan.setSrc(record.get('floorplanImage'));
            floorPlan.setWidth(record.get('floorplanImageW'));
            floorPlan.setHeight(record.get('floorplanImageH'));
            this.getFloorplanContainer().setPosition((record.get('floorplanOffsetLeft')+leftOffset), record.get('floorplanOffsetTop')+topOffset, false);
        }
    },
    loadImageOverlay: function(){
        var imageOverlay=this.getImageOverlay().show();
        var container=this.getPhotoContainer();
        var overlayL=this.getImageOverlayL();
        var overlayR=this.getImageOverlayR();
        var overlayZoomIn=this.getImageOverlayZoomIn().show().getEl();
        var overlayZoomOut=this.getImageOverlayZoomOut().show().getEl();
        var overlayRefresh=this.getImageOverlayRefresh().show().getEl();
        var overlayAnnotation=this.getImageOverlayAnnotation().show().getEl();

        var yPos=(container.getHeight());
        imageOverlay.setPosition(0, 0);
        imageOverlay.setWidth(container.getWidth());
        imageOverlay.setHeight(container.getHeight());
        //LEFT AND RIGHT NAVIGATION CHEVRONS
        overlayL.getEl().setWidth(this._chevronBuffer);
        overlayR.getEl().setWidth(this._chevronBuffer);
        overlayR.getEl().setX(container.getWidth()-this._chevronBuffer);
        //OVERLAY BUTTONS
        overlayZoomOut.setX((container.getWidth()/2-(overlayZoomOut.getWidth()+5)));
        overlayZoomOut.setY(container.getHeight()-5);
        overlayZoomIn.setX((container.getWidth()/2+5));
        overlayZoomIn.setY(container.getHeight()-5);
        overlayRefresh.setX((container.getWidth()/2-(overlayZoomOut.getWidth()+65)));
        overlayRefresh.setY(container.getHeight()-5);
        overlayAnnotation.setX((container.getWidth()/2-(overlayZoomOut.getWidth()+120)));
        overlayAnnotation.setY(container.getHeight()-5);
        if (this._selectedRecord!=null){
            if (!this._selectedRecord.get('hasAnnotations')){
                this.getImageOverlayAnnotation().hide();
            }
        }
    },
    previousImage: function(doLoad){
        var store=this._lazyStore;
        var record=this._selectedRecord;
        var index=store.indexOf(record);
        var prevRecord='';
        if (index==0){
            if (record.get('storePosition')==1){
                this.lazyLoadMorePhotos('all', true);
                prevRecord=store.last();
            } else{
                prevRecord=store.getAt(store.indexOf(record)-1);
            }
        } else{
            prevRecord=store.getAt(index-1);
        }
        this._lastSelectedRecord=this._selectedRecord;
        this._selectedRecord=prevRecord;

        if (doLoad){
            this.loadSelectedImage();
        } else{
            return prevRecord;
        }
    },
    nextImage: function(doLoad){
        var store=this._lazyStore;
        var record=this._selectedRecord;
        var index=store.indexOf(record);
        var nextRecord='';
        if (index==(store.count()-1)){
            if (record.get('storePosition')==this.getClientPhotoViewerPhotosStore().last().get('storePosition')){
                this.lazyLoadMorePhotos('all', true);
                nextRecord=store.first();
            } else{
                nextRecord=store.getAt(store.indexOf(record)+1);
            }
        } else{
            nextRecord=store.getAt(index+1);
        }
        this._lastSelectedRecord=this._selectedRecord;
        this._selectedRecord=nextRecord;

        if (doLoad){
            this.loadSelectedImage();
        } else{
            return nextRecord;
        }
    },
    overlayCDblClick: function(element, eventObj, htmlElement){
        //MOUSE CURSOR VARIABLES
        var point=eventObj.getPoint();
        var overlayElement=Ext.get(element);
        var pointRelativeX=(point.x-overlayElement.getX());
        var pointRelativeY=(point.y-overlayElement.getY());
        //IMAGE AND OVERLAY VARIABLES
        var image=this.getImage();
        var overlayC=this.getImageOverlayC();
        if (!eventObj.hasModifier()){
            if (this._zoomInCount<=this._zoomInMax){
                if (this._zoomInCount!=this._zoomInMax){
                    this._zoomOutCount=this._zoomOutCount-1;
                    this._zoomInCount=this._zoomInCount+1;
                } else return;
                // ADJUST IMAGE SIZE
                image.setHeight(this._imageHeight*this._zoomFactor);
                //REPOSITION RELATIVE TO MOUSE
                image.getEl().moveTo(image.getBox().x-((pointRelativeX*this._zoomFactor)-pointRelativeX), image.getBox().y-((pointRelativeY*this._zoomFactor)-pointRelativeY));
                // RESIZE AND POSITION CENTER IMAGE OVERLAY FOR DRAGGING
                overlayC.getEl().setBox(image.getEl().getBox());
            }
        } else{
            if (this._zoomOutCount<=this._zoomOutMax){
                if (this._zoomOutCount!=this._zoomOutMax){
                    this._zoomOutCount=this._zoomOutCount+1;
                    this._zoomInCount=this._zoomInCount-1;
                } else return;
                // ADJUST IMAGE SIZE
                image.setHeight(this._imageHeight/this._zoomFactor);
                //REPOSITION RELATIVE TO MOUSE
                image.getEl().moveTo(image.getBox().x-((pointRelativeX/this._zoomFactor)-pointRelativeX), image.getBox().y-((pointRelativeY/this._zoomFactor)-pointRelativeY));
                // RESIZE AND POSITION CENTER IMAGE OVERLAY FOR DRAGGING
                overlayC.getEl().setBox(image.getEl().getBox());
            }
        }
    },
    zoomClick: function(w, evtObj, el){
        switch (el.id){
            case 'overlayZoomOut':
                this.zoomOut();
                break;
            case 'overlayZoomIn':
                this.zoomIn();
                break;
        }
    },
    zoomOut: function(){
        var image=this.getImage();
        var overlayC=this.getImageOverlayC();
        var innerViewH=this.getPhotoviewinner().getHeight();
        var innerViewW=this.getPhotoviewinner().getWidth();

        if (this._zoomOutCount<=this._zoomOutMax){
            if (this._zoomOutCount!=this._zoomOutMax){
                this._zoomOutCount=this._zoomOutCount+1;
                this._zoomInCount=this._zoomInCount-1;
            } else return;
            // ADJUST IMAGE SIZE
            image.setHeight(this._imageHeight/this._zoomFactor);
            //REPOSITION TO CENTER OF VIEW
            image.setPosition((innerViewW/2-this._imageWidth/2), (innerViewH/2-this._imageHeight/2));
            // RESIZE AND POSITION CENTER IMAGE OVERLAY FOR DRAGGING
            overlayC.getEl().setBox(image.getEl().getBox());
        }
    },
    zoomIn: function(){
        var image=this.getImage();
        var overlayC=this.getImageOverlayC();
        var innerViewH=this.getPhotoviewinner().getHeight();
        var innerViewW=this.getPhotoviewinner().getWidth();

        if (this._zoomInCount<=this._zoomInMax){
            if (this._zoomInCount!=this._zoomInMax){
                this._zoomOutCount=this._zoomOutCount-1;
                this._zoomInCount=this._zoomInCount+1;
            } else return;
            // ADJUST IMAGE SIZE
            image.setHeight(this._imageHeight*this._zoomFactor);
            //REPOSITION TO CENTER OF VIEW
            image.setPosition((innerViewW/2-this._imageWidth/2), (innerViewH/2-this._imageHeight/2));
            // RESIZE AND POSITION CENTER IMAGE OVERLAY FOR DRAGGING
            overlayC.getEl().setBox(image.getEl().getBox());
        }
    },
    mouseWheelZoom: function(layer, eventObj, element){
        //MOUSE CURSOR VARIABLES
        var point=eventObj.getPoint();
        var overlayElement=Ext.get(element);
        var pointRelativeX=(point.x-overlayElement.getX());
        var pointRelativeY=(point.y-overlayElement.getY());
        //IMAGE AND OVERLAY VARIABLES
        var image=this.getImage();
        var overlayC=this.getImageOverlayC();

        //ONLY ACTIVATE 'MOUSE RELATIVE' ZOOM IF CURSOR IS OVER THE IMAGE OTHERWISE ZOOM WILL BE BASED ON CENTER OF VIEW
        if (overlayElement.id=='overlayCenter'){
            //ZOOM IN
            if (eventObj.getWheelDelta()>0){
                if (this._zoomInCount<=this._zoomInMax){
                    if (this._zoomInCount!=this._zoomInMax){
                        this._zoomOutCount=this._zoomOutCount-1;
                        this._zoomInCount=this._zoomInCount+1;
                    } else return;
                    // ADJUST IMAGE SIZE
                    image.setHeight(this._imageHeight*this._zoomFactor);
                    //REPOSITION RELATIVE TO MOUSE
                    image.getEl().moveTo(image.getBox().x-((pointRelativeX*this._zoomFactor)-pointRelativeX), image.getBox().y-((pointRelativeY*this._zoomFactor)-pointRelativeY));
                    // RESIZE AND POSITION CENTER IMAGE OVERLAY FOR DRAGGING
                    overlayC.getEl().setBox(image.getEl().getBox());
                }
            }
            //ZOOM OUT
            else{
                if (this._zoomOutCount<=this._zoomOutMax){
                    if (this._zoomOutCount!=this._zoomOutMax){
                        this._zoomOutCount=this._zoomOutCount+1;
                        this._zoomInCount=this._zoomInCount-1;
                    } else return;
                    // ADJUST IMAGE SIZE
                    image.setHeight(this._imageHeight/this._zoomFactor);
                    //REPOSITION RELATIVE TO MOUSE
                    image.getEl().moveTo(image.getBox().x-((pointRelativeX/this._zoomFactor)-pointRelativeX), image.getBox().y-((pointRelativeY/this._zoomFactor)-pointRelativeY));
                    // RESIZE AND POSITION CENTER IMAGE OVERLAY FOR DRAGGING
                    overlayC.getEl().setBox(image.getEl().getBox());
                }
            }
        }
        //MOUSE IS OUTSIDE THE IMAGE OVERLAY THEREFORE DEFAULT ZOOM TO CENTER OF IMAGE
        else{
            if (eventObj.getWheelDelta()>0){
                this.zoomIn();
            } else{
                this.zoomOut();
            }
        }
    }
    ,modeSelection: function(window, extObj, el) {
		if (el.newState == 'Location') {
            this._photoGroupType  = 'h';
            this._selectedPhotoID = this._selectedRecord.get('photoID');
            this.getClientPhotoViewerPhotosStore().getProxy().setExtraParam('hotspotID', this._selectedRecord.get('hotspotID'));
        }
        else if (el.newState == 'Date'){
            this._photoGroupType  = 's';
            this._shootUID = this._selectedRecord.get('shootUID');
            this._selectedPhotoID = this._selectedRecord.get('photoID');
        }
        this._lastSelectedRecord = null;
        this._lazyStore.removeAll();
        this.getClientPhotoViewerPhotosStore().removeAll();
        this.getClientPhotoViewerPhotosStore().load();
        
    },
    getImageWidth: function(){
        return this._naturalWidth;
    },
    getImageHeight: function(){
        return this._naturalHeight;
    },
    toggleThumbNav: function(boolValue){
        if (boolValue){
            this.getThumbWrapper().setLoading(true);
            this.getImageOverlayL().hide();
            this.getImageOverlayR().hide();
        } else{
            this.getThumbWrapper().setLoading(false);
            this.getImageOverlayL().show();
            this.getImageOverlayR().show();
            this.loadImageOverlay();
        }
    },
    disablePhotoViewer: function(){
        var windowController=mds.app.getController("clientPhotoViewer.Windows");
        windowController.getDisablePhotoviewerWindow().enable().show();
        windowController.getPhotoviewerMessages().getEl().setHTML('There was an error loading the photo viewer.');
    },
    disableSlideshow: function(){
        var slideshowController=mds.app.getController("clientPhotoViewer.Slideshow");
        if (this._slideshowIsOn){
            slideshowController.pauseSlideshow();
        }
        return true;
    }
});
//@ sourceURL=PhotoViewerController.js