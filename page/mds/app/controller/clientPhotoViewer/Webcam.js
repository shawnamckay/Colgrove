Ext.define('mds.controller.clientPhotoViewer.Webcam', {
    extend: 'Ext.app.Controller',
    views: [
            'clientPhotoViewer.sidebar.vWebcam',
            'clientWebcamLive.Weather',
            'clientPhotoViewer.window.vWebcamSlideshow'
    ],
    stores: ['clientPhotoViewer.Webcams', 'clientPhotoViewer.WebcamPhotos'],

    ProjectUID: null,
    WebcamUID: null,
    AlbumUID: null,
    PhotoGroupType: null,
    Webcam: null,
    WebcamDateString: null,

    stype: null,

    onLaunch: function(){
        var pageParams=Ext.Object.fromQueryString(document.location.search);
        this.ProjectUID=pageParams.ProjectUID;
        this.WebcamUID=pageParams.WebcamUID;
        this.AlbumUID=pageParams.AlbumUID;
        this.PhotoGroupType=pageParams.PhotoGroupType;
        this.stype=pageParams.stype;

        Ext.getStore("clientPhotoViewer.Project").addListener("load", function(store){
            this.Project=store.getAt(0);
            this.fireEvent("projectset");
        }, this, {
            single: true
        });

        if (this.PhotoGroupType=='A'||this.PhotoGroupType=='X'){
            Ext.getStore("clientPhotoViewer.Photos").addListener("load", function(photoStore){
                if (photoStore.query("isWebcam", true).length>0){
                    Ext.getStore("clientPhotoViewer.Webcams").load({
                        params: {
                            ProjectUID: this.ProjectUID,
                            AlbumUID: this.AlbumUID
                        }
                    });
                }
            }, this);
        } else if (this.PhotoGroupType=='W'){
            var webcamStore=Ext.getStore("clientPhotoViewer.Webcams");
            webcamStore.addListener("load", function(){
                mds.app.getController('clientPhotoViewer.Controller').loadPhotosStoreParams(Ext.getStore("clientPhotoViewer.Photos"));
                Ext.getStore("clientPhotoViewer.Photos").load();
            });
            webcamStore.load({
                params: {
                    ProjectUID: this.ProjectUID,
                    WebcamUID: this.WebcamUID
                }
            });
        }

        this.control({
            '#webcamCalendar': {
                select: function(picker, date){
                    var time=(this.record?Ext.Date.format(this.record.get("dateTaken"), "Hi"):"1200");
                    document.location.href="photoviewer.htm?ProjectUID="+this.ProjectUID+"&PhotoGroupType=W&WebcamUID="+this.WebcamUID+"&PhotoGroupDate="+Ext.Date.format(date, "Y-m-d")+"&SelectedPhotoTime="+time;
                }
            },
            "#webcamTime": {
                select: function(combo, records){
                    var mainController=mds.app.getController("clientPhotoViewer.Controller");
                    mainController._lastSelectedRecord=mainController._selectedRecord;
                    mainController._selectedRecord=records[0];
                    mainController.loadSelectedImage();
                },
                beforerender: function(){
                    var pageParams=(Ext.Object.fromQueryString(document.location.search));
                    if (this.stype=='time'){
                        var webcamTimeCombo=Ext.getCmp("webcamTime");
                        if (pageParams.stype=='time'){
                            webcamTimeCombo.tpl=Ext.create('Ext.XTemplate', '<tpl for=".">', '<div class="x-boundlist-item">{dateTaken:date("M j Y")}</div>', '</tpl>');
                            webcamTimeCombo.displayTpl=Ext.create('Ext.XTemplate', '<tpl for=".">', '{dateTaken:date("M j Y")}', '</tpl>');
                        }
                        webcamTimeCombo.store=Ext.getStore('clientPhotoViewer.Photos');
                    }
                }
            },
            '#gotoTimelapse': {
                click: function(){
                    document.location.href="webcamTimelapse.htm?ProjectUID="+this.ProjectUID+"&WebcamUID="+this.WebcamUID;
                }
            },
            '#customSlideshowWindow': {
                afterrender: function(){
                    var startDate=Ext.getCmp("csStartDate"), endDate=Ext.getCmp("csEndDate");
                    startDate.setMinValue(this.Webcam.get("FirstPhotoDate"));
                    startDate.setMaxValue(this.Webcam.get("MostRecentPhotoDate"));
                    endDate.setMinValue(this.Webcam.get("FirstPhotoDate"));
                    endDate.setMaxValue(this.Webcam.get("MostRecentPhotoDate"));
                    endDate.setValue(this.Webcam.get("MostRecentPhotoDate"));

                    var defaultStartDate=Ext.Date.add(this.Webcam.get("MostRecentPhotoDate"), Ext.Date.MONTH, -1);
                    if (!Ext.Date.between(defaultStartDate, this.Webcam.get("FirstPhotoDate"), this.Webcam.get("MostRecentPhotoDate"))){
                        defaultStartDate=this.Webcam.get("MostRecentPhotoDate");
                    }
                    startDate.setValue(defaultStartDate);
                }
            },
            '#csStartDate': {
                change: function(startDate, newValue){
                    if (newValue.getTime()<this.Webcam.get("FirstPhotoDate").getTime()) startDate.setValue(this.Webcam.get("FirstPhotoDate"));
                    else if (newValue.getTime()>this.Webcam.get("MostRecentPhotoDate").getTime()) startDate.setValue(this.Webcam.get("MostRecentPhotoDate"));
                    else Ext.getCmp("csEndDate").setMinValue(newValue);
                }
            },
            '#csEndDate': {
                change: function(endDate, newValue){
                    if (newValue.getTime()<this.Webcam.get("FirstPhotoDate").getTime()) endDate.setValue(this.Webcam.get("FirstPhotoDate"));
                    else if (newValue.getTime()>this.Webcam.get("MostRecentPhotoDate").getTime()) endDate.setValue(this.Webcam.get("MostRecentPhotoDate"));
                    else Ext.getCmp("csStartDate").setMaxValue(newValue);
                }
            },
            '#csGenerate': {
                click: function(){
                    if (!Ext.getCmp("csStartDate").isValid()||!Ext.getCmp("csEndDate").isValid()){
                        Ext.Msg.alert("Validation Error", "A valid date range must be entered.");
                        return;
                    }
                    var params={
                        ProjectUID: this.ProjectUID,
                        PhotoGroupType: 'C',
                        WebcamUID: this.WebcamUID,
                        start: Ext.Date.format(Ext.getCmp("csStartDate").getValue(), 'Y-m-d'),
                        end: Ext.Date.format(Ext.getCmp("csEndDate").getValue(), 'Y-m-d'),
                        stype: Ext.getCmp(Ext.select(".csSelectionType.x-form-cb-checked").elements[0].id).inputValue
                    };
                    if (params.stype=="time"){
                        params.rtype=Ext.getCmp(Ext.select("#csSelectionRadioGroup .x-form-cb-checked").elements[0].id).inputValue;
                        if (params.rtype=='weekly'){
                            params.wd=Ext.getCmp("csWeekdays").getValue().csWeekdays;
                            if (params.wd===undefined){
                                Ext.Msg.alert("Validation Error", "At least one day of the week most be chosen.");
                                return;
                            }
                        }

                        params.h=Ext.getCmp("csHour").getValue();
                        params.m=Ext.getCmp("csMinute").getValue();

                        var card=Ext.getCmp("csRecurrenceTypeCards").getLayout().getActiveItem();
                        params.x=Ext.getCmp(Ext.select("#"+card.id+" .csRecurrenceX").elements[0].id).getValue();

                        if (params.rtype=='monthly'){
                            params.d=Ext.getCmp("csDayOfMonth").getValue();
                        }
                    }
                    document.location.href="photoviewer.htm?"+Ext.Object.toQueryString(params);
                }
            },
            '#createSlideshowAction': {
                click: function(){
                    var window=Ext.getCmp("customSlideshowWindow");
                    if (!window) window=Ext.create('mds.view.clientPhotoViewer.window.vWebcamSlideshow');
                    window.show();
                }
            },
            '#viewTimelapseAction': {
                click: function(){
                    document.location.href=this.Webcam.get("TimelapseURL");
                }
            }
        });
    },
    loadWebcam: function(record){
        if (!this.Project){
            this.addListener("projectset", function(){this.loadWebcam(record);}, this, {single: true});
            return;
        }
        var webcamStore=Ext.getStore("clientPhotoViewer.Webcams");
        if (webcamStore.isLoading()){
            webcamStore.addListener("load", function(){
                this.loadWebcam(record);
            }, this, {
                single: true
            });
            return;
        }
        var projectStore=Ext.getStore("clientPhotoViewer.Project");
        if (projectStore.isLoading()){
            projectStore.addListener("load", function(){
                this.loadWebcam(record);
            }, this, {
                single: true
            });
            return;
        }
        this.record=record;

        if (record&&!record.get("isWebcam")){
            Ext.select(".floorplanSpecific").each(function(el){
                Ext.getCmp(el.dom.id).show();
            });
            Ext.select(".webcamSpecific").each(function(el){
                Ext.getCmp(el.dom.id).hide();
            });

            Ext.getCmp("tplSideBarTopProject").update(this.Project.getData());
            return;
        }
        Ext.select(".floorplanSpecific").each(function(el){
            Ext.getCmp(el.dom.id).hide();
        });
        Ext.select(".webcamSpecific").each(function(el){
            Ext.getCmp(el.dom.id).show();
        });

        // Load webcam data if none was set, or if previous photo had different webcam
        if (!this.Webcam||this.Webcam.get("WebcamUID")!=record.get("WebcamUID")){
            if (record) this.Webcam=webcamStore.query("WebcamUID", record.get("WebcamUID")).items[0];
            else this.Webcam=webcamStore.getAt(0);

            this.WebcamUID=this.Webcam.get("WebcamUID");

            var webcamCalendar=Ext.getCmp("webcamCalendar");
            webcamCalendar.setMinDate(this.Webcam.get("FirstPhotoDate"));
            webcamCalendar.setMaxDate(this.Webcam.get("MostRecentPhotoDate"));
        }
        //if (!this.Webcam.get("WebcamIsStreaming")) Ext.getCmp("webcamModeToggleButton").disable();

        if (record){
            var recordDateString=Ext.Date.format(record.get("dateTaken"), "Y-m-d");
            if (this.stype!='time'&&(!this.WebcamDateString||recordDateString!=this.WebcamDateString)){
                this.WebcamDateString=recordDateString;

                var webcamPhotosOnSameDay=Ext.getStore("clientPhotoViewer.Photos").queryBy(function(record, id){
                    return ((record.get("WebcamUID").toLowerCase()==this.Webcam.get("WebcamUID").toLowerCase()&&recordDateString==Ext.Date.format(record.get("dateTaken"), "Y-m-d"))?true:false);
                }, this);
                var wpStore=Ext.getStore("clientPhotoViewer.WebcamPhotos");
                wpStore.removeAll();
                for ( var i=0; i<webcamPhotosOnSameDay.items.length; i++){
                    wpStore.add(webcamPhotosOnSameDay.items[i]);
                }
                Ext.getCmp("weather").update(record.getData());
                Ext.getCmp("webcamCalendar").setValue(record.get("dateTaken"));
            }
            Ext.getCmp("webcamTime").setValue(record.get("dateTaken"));
        } else{
            Ext.getCmp("webcamTime").hide();
            Ext.select("#pvToolBarView :not(.webcamSpecific)").each(function(el){
                var cmp=Ext.getCmp(el.dom.id);
                if (cmp&&cmp.xtype!="tbfill") cmp.disable();
            });
            mds.app.getController("clientPhotoViewer.Controller").toggleThumbNav(false);
            Ext.getCmp("photoContainerOverlay").disable();
        }
        Ext.getCmp("tplSideBarTopProject").update({
            projectTitle: this.Project.get("projectTitle"),
            projectAddress: this.Webcam.get("WebcamLabel")
        });
        Ext.getCmp("pvWebcam").show();
    }
});
// @ sourceURL=WebcamArchiveController.js
