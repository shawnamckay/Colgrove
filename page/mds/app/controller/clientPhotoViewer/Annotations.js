Ext.define('mds.controller.clientPhotoViewer.Annotations', {
    extend: 'Ext.app.Controller',
    views: ['clientPhotoViewer.annotations.DrawComponent', 'clientPhotoViewer.annotations.sprites.selectionBox', 'clientPhotoViewer.annotations.tools.ColorpickerWindow', 'clientPhotoViewer.annotations.tools.ToolWindow', 'clientPhotoViewer.annotations.shapes.Rectangle', 'clientPhotoViewer.annotations.sprites.resizeHandle', 'clientPhotoViewer.annotations.shapes.Ellipse', 'clientPhotoViewer.annotations.shapes.Text', 'clientPhotoViewer.annotations.sprites.pointHandle', 'clientPhotoViewer.annotations.shapes.Line', 'clientPhotoViewer.annotations.shapes.Arrow', 'clientPhotoViewer.annotations.widget.imageCombo', 'clientPhotoViewer.annotations.widget.rangeCombo', 'clientPhotoViewer.annotations.sprites.Line', 'clientPhotoViewer.annotations.sprites.Arrow', 'clientPhotoViewer.annotations.tools.StrokeWidthWindow', 'clientPhotoViewer.annotations.tools.StrokeStyleWindow', 'clientPhotoViewer.annotations.sprites.TextBox'],
    stores: ['clientPhotoViewer.Annotations'],
    models: ['clientPhotoViewer.Annotation'],
    photoRecord: null,
    // ids of components that need to be put above draw component
    toFrontIDs: ['pvSideBar', 'topToolBarContainer', 'photoThumbContainerWrapper', 'topNavBar', 'pvPhotoThumbs', 'mainContainerStrip', 'viewportBottomStrip', 'viewportLeftStrip', 'viewportRightStrip', 'viewportRightStrip2'],
    disabledIDs: ['pvSideBar', 'photoThumbContainerWrapper'],
    loadDisableIDs: ['annotateBtn', 'overlayAnnotation', 'overlayRefresh', 'overlayZoomIn', 'overlayZoomOut', 'photoThumbContainerWrapper', 'photoContainerOverlay'],
    annotationsOn: true,
    hasAnnotations: false,
    init: function(){
        var controller=this;

        Ext.Loader.loadScript({
            url: 'mds/lib/math.js'
        });

        controller.control({
            '#pvImage': {
                resize: function(pvImage, width, height){
                    if (controller.resizeTimeout) window.clearTimeout(controller.resizeTimeout);
                    controller.resizeTimeout=setTimeout(function(){
                        try{
                            Ext.getCmp("annotationsDC").refreshScale(pvImage, width, height);
                        } catch(e){
                        }
                    }, 10);
                },
                move: function(pvImage, x, y){
                    try{
                        Ext.getCmp("annotationsDC").alignTo(pvImage, "tl-tl");
                    } catch(e){
                    }
                }
            },
            '#overlayCenter': {
                move: function(overlay, x, y){
                    try{
                        Ext.getCmp("annotationsDC").alignTo(Ext.getCmp("pvImage"), "tl-tl");
                    } catch(e){
                    }
                }
            },
            '#annotateBtn': {
                click: function(annotateBtn){
                    var annotationsDC=Ext.getCmp("annotationsDC");
                    if (annotateBtn.pressed){
                        annotateBtn.setText("Annotation Mode is ON");
                        annotationsDC.destroyShapes();
                        annotationsDC.setReadOnly(false);
                        annotationsDC.show();
                    } else{
                        this.endAnnotateMode();
                    }
                }
            },
            'annotationsDC': {
                aftershow: function(dc){
                    if (!dc.readOnly){
                        Ext.getCmp("overlayLeft").el.dom.style.visibility="hidden";
                        Ext.getCmp("overlayRight").el.dom.style.visibility="hidden";
                        for ( var i=0; i<this.disabledIDs.length; i++){
                            Ext.getCmp(this.disabledIDs[i]).disable();
                        }
                        this.toggleToolbar("disable");
                        dc.toFront();
                    } else{
                        Ext.getCmp("photoContainerOverlay").toFront();
                        Ext.getCmp("overlayAnnotation").toFront();
                    }

                    dc.refreshScale(Ext.getCmp("pvImage"), Ext.getCmp("pvImage").getWidth(), Ext.getCmp("pvImage").getHeight());
                    dc.alignTo("pvImage", "tl-tl");

                    var toolWindow=Ext.getCmp("annotationsTW");
                    if (!dc.readOnly){
                        if (typeof (toolWindow)==="undefined"){
                            toolWindow=Ext.create("mds.view.clientPhotoViewer.annotations.tools.ToolWindow");
                        }
                        toolWindow.show();
                        toolWindow.alignTo("pvToolBarView", "tl-bl");
                    }
                    for ( var j=0; j<controller.toFrontIDs.length; j++){
                        var cmp=Ext.getCmp(controller.toFrontIDs[j]);
                        cmp.el.dom.style.zIndex=dc.el.dom.style.zIndex-0+2;
                    }

                    if (!dc.readOnly) toolWindow.toFront();

                    var store=Ext.getStore("clientPhotoViewer.Annotations");
                    store.getProxy().setExtraParam("photo", this.getPhotoID());

                    if (controller.photoRecord.get("hasAnnotations")){
                        store.load();
                    } else{
                        store.loadData([], false);
                        store.fireEvent("load");
                    }

                    Ext.getCmp("overlayRefresh").toFront();
                    Ext.getCmp("overlayZoomOut").toFront();
                    Ext.getCmp("overlayZoomIn").toFront();
                },
                afterdestroy: function(){
                    controller.afterLoadOrDestroy();
                },
                shapesync: function(newShape, oldShape){
                    newShape.setColour(oldShape.getAttribute("stroke"));
                    newShape.setStrokeWidth(oldShape.getAttribute("stroke-width"));
                    newShape.setStrokeStyle(oldShape.getAttribute("style"));
                },
                shapeselect: function(shape){
                    Ext.getCmp("annotationsColorpicker").select(shape.getAttribute("stroke").substr(1));
                    Ext.getCmp("annotationsStrokeWidth").setValue(shape.getAttribute("stroke-width"));
                    Ext.getCmp("annotationsStrokeStyle").setValue(shape.getAttribute("style"));
                },
                'beforedestroy': function(){
                    this.beforeLoadOrDestroy();
                }
            },
            '#annotationsTW': {
                beforeclose: function(){
                    if (Ext.getStore("clientPhotoViewer.Annotations").isLoading()) return false;
                },
                close: function(){
                    Ext.getCmp("annotateBtn").toggle();
                    this.endAnnotateMode();
                },
                modechange: function(mode){
                    Ext.getCmp("annotationsDC").fireEvent("modechange", mode);
                },
                colourchange: function(colourValue){
                    Ext.getCmp("annotationsDC").fireEvent("colourchange", colourValue);
                },
                strokewidthchange: function(newValue){
                    Ext.getCmp("annotationsDC").fireEvent("strokewidthchange", newValue);
                },
                strokestylechange: function(newValue){
                    Ext.getCmp("annotationsDC").fireEvent("strokestylechange", newValue);
                },
                sharetypechange: function(ShareTypeID, MemberUIDArray){
                    Ext.getCmp("annotationsDC").fireEvent("sharetypechange", ShareTypeID, MemberUIDArray);
                }
            },
            "#overlayAnnotation": {
                click: function(btn){
                    if (btn.isDisabled()) return;

                    var annotationsDC=Ext.getCmp("annotationsDC");
                    if (!this.annotationsOn){
                        this.annotationsOn=true;
                        annotationsDC.setReadOnly(true);
                        annotationsDC.show();
                    } else{
                        this.annotationsOn=false;
                        this.endAnnotate();
                    }
                }
            }
        });

        Ext.EventManager.on(document, 'keydown', function(e){
            var dc=Ext.getCmp("annotationsDC");
            if (!dc.isHidden()&&!dc.readOnly){
                dc.fireEvent("keypress", e);
            }
        });

        Ext.getStore("clientPhotoViewer.Annotations").addListener("beforeload", function(){
            this.beforeLoadOrDestroy();
        }, this);

        Ext.getStore("clientPhotoViewer.Annotations").addListener("afterload", function(store){
            this.hasAnnotations=(store.count()?true:false);
            this.afterLoadOrDestroy();
        }, controller);

        Ext.getStore("clientPhotoViewer.Annotations").addListener("aftersave", function(store){
            this.afterSave();
        }, controller);

        this.canShare=false;
        this.canRead=true;
        this.canWrite=config.ANNOTATIONSDEMO;

        mds.app.getController("clientPhotoViewer.Controller").addListener("imageLoad", controller.onImageLoad, controller);
        mds.app.getController("clientPhotoViewer.Controller").addListener("imageReady", controller.onImageReady, controller);
        window.onbeforeunload=function(e){
            if (!Ext.getStore("clientPhotoViewer.Annotations").hasUnsavedChanges()){ return; }

            var message="Warning: annotations have not been saved. Any changes made since the last save will be lost if you continue.";
            e=e||window.event;
            // For IE and Firefox
            if (e){
                e.returnValue=message;
            }

            // For Safari
            return message;
        };
    },
    endAnnotate: function(){
        var dc=Ext.getCmp("annotationsDC");
        dc.hide();

        var callback=function(){
            var dc=Ext.getCmp("annotationsDC");
            dc.destroyShapes();
            if (mds.app.getController("clientPhotoViewer.Annotations").annotationsOn) dc.show();
        };

        this.saveCheck(callback, callback);
    },
    onImageLoad: function(record){
        // image is loaded even if record didn't actually change-- don't reload annotations
        if (this.photoRecord&&record.get("photoID")==this.photoRecord.get("photoID")&&record.get("UDEFPhotoUID")==this.photoRecord.get("UDEFPhotoUID")&&record.get("WebcamPhotoUID")==this.photoRecord.get("WebcamPhotoUID")) return;

        Ext.getCmp("annotateBtn").disable();

        var dc=Ext.getCmp("annotationsDC");

        this.photoRecord=record;
        this.photoIsUDEF=this.photoRecord.get("isUDEF");
        this.photoIsWebcam=this.photoRecord.get("isWebcam");
        this.hasAnnotations=record.get("hasAnnotations");

        if (dc.isHidden()){ return; }
        dc.hide();

        var destroyAndLoad=function(){
            dc.destroyShapes();
            dc.show();
        };

        this.saveCheck(destroyAndLoad, destroyAndLoad);
    },
    saveCheck: function(saveCallback, noSaveCallback){
        noSaveCallback();
    },
    onImageReady: function(){
        if (!this.readingAnnotationsIsAllowed()) return;

        Ext.getCmp("annotateBtn").enable();
        var dc=Ext.getCmp("annotationsDC");
        if (mds.app.getController("clientPhotoViewer.Annotations").annotationsOn&&dc.isHidden()) dc.show();
    },
    getPhotoID: function(){
        if (this.photoRecord===null){ return -1; }
        return this.photoRecord.get("id");
    },
    beforeLoadOrDestroy: function(){
        for ( var i=0; i<this.loadDisableIDs.length; i++){
            Ext.getCmp(this.loadDisableIDs[i]).addCls("noMask");
            Ext.getCmp(this.loadDisableIDs[i]).disable();
        }
    },
    afterLoadOrDestroy: function(){
        var dc=Ext.getCmp("annotationsDC");
        for ( var i=0; i<this.loadDisableIDs.length; i++){
            if (dc.readOnly||this.disabledIDs.indexOf(this.loadDisableIDs[i])==-1) Ext.getCmp(this.loadDisableIDs[i]).enable();
            Ext.getCmp(this.loadDisableIDs[i]).removeCls("noMask");
        }
        if (dc.isHidden()){
            for ( var j=0; j<this.disabledIDs.length; j++){
                Ext.getCmp(this.disabledIDs[j]).enable();
            }
            this.toggleToolbar("enable");
        }
    },
    afterSave: function(){
        var mainController=mds.app.getController("clientPhotoViewer.Controller");

        this.hasAnnotations=(Ext.getStore("clientPhotoViewer.Annotations").count()?true:false);

        if (this.hasAnnotations!=this.photoRecord.get("hasAnnotations")){
            this.photoRecord.set("hasAnnotations", this.hasAnnotations);
            mainController.loadThumbData(false);
            if (this.hasAnnotations){
                mainController.getImageOverlayAnnotation().el.dom.style.opacity=0.5;
                mainController.getImageOverlayAnnotation().show();
            } else mainController.getImageOverlayAnnotation().hide();
        }
    },
    endAnnotateMode: function(){
        Ext.getCmp("annotationsTW").hide();
        Ext.getCmp("annotationsColorpickerWindow").hide();
        Ext.getCmp("annotateBtn").setText("Annotation Mode is OFF");
        Ext.getCmp("overlayLeft").el.dom.style.visibility="visible";
        Ext.getCmp("overlayRight").el.dom.style.visibility="visible";

        Ext.getCmp("annotationsDC").setReadOnly(true);
        this.endAnnotate();
    },
    readingAnnotationsIsAllowed: function(){
        return (this.canRead&&!Ext.isIE8);
    },
    writingAnnotationsIsAllowed: function(){
        return (this.canWrite&&!Ext.isIE8);
    },
    save: function(){
        Ext.getCmp("annotationsDC").deselectAll();
        Ext.getStore("clientPhotoViewer.Annotations").save();
    },
    toggleToolbar: function(action){
        var items=Ext.getCmp("pvToolBarView").items.items;
        for ( var i=0; i<items.length; i++){
            if (items[i].id!='annotateBtn'&&items[i].xtype!="tbfill") items[i][action]();
        }
    }
});
// @ sourceURL=annotationsController.js
