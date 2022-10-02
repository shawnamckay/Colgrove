Ext.define('mds.controller.clientPhotoList.Controller', {
    extend: 'Ext.app.Controller',
    init: function(){
        var controller=this;
        var photoGroupStore=Ext.getStore('clientPhotoList.PhotoGroups');
        var photoCategoriesStore=Ext.getStore("clientPhotoList.PhotoCategories");
        this.albumStore=Ext.getStore("clientPhotoList.FlatUserAlbums");
        
        photoGroupStore.getProxy().setExtraParam("ProjectUID", (Ext.Object.fromQueryString(document.location.search)).ProjectUID);
        
        photoCategoriesStore.addListener("load", function(){
            Ext.getStore("clientPhotoList.FlatPhotoCategories").load();
        });
        photoCategoriesStore.load();

        mds.app.getController("clientPhotoList.ToolbarActions").interfaceControl=this;

        // ////History-related///////////////////////////////////////////////////
        this.historyStoreLoadListener=null;
        Ext.History.init();

        Ext.History.addListener("change", function(token){
            token=(token===null?null:decodeURI(token));

            var locationStore=Ext.getStore("clientPhotoList.Locations");

            Ext.log("History Change: "+token);
            var action=function(){
                var scroller=Ext.getCmp("photoVerticalLoadingScroller"), coverLinks=Ext.getCmp("photoCategoryCoverLinks"), actionPanel=Ext.getCmp("photoActionPanel"), bodyContainer=Ext.getCmp("bodyContainer");

                if (scroller) scroller.hide();

                if (token===null) token="";

                var tokenInfo=token.split("_");
                if (tokenInfo[2]===undefined){
                    tokenInfo[2]="";
                    tokenInfo[3]="";
                }
                var offsetCount=locationStore.allLocations.length+4;
                for ( var i=4; i<offsetCount; i++){
                    if (tokenInfo[i]===undefined) tokenInfo[i]=0;
                    else tokenInfo[i]=tokenInfo[i]-0;
                }

                if (tokenInfo[0]===""){
                    controller.onFront();
                } else{
                    var nextAction=function(){
                        photoGroupStore.setAlbumType(tokenInfo[0]);
                        photoGroupStore.setAlbumIdentifier(tokenInfo[1]);

                        var bodyContainer=Ext.getCmp("bodyContainer");
                        Ext.getCmp("photoCategoryCoverLinks").hide();

                        Ext.getCmp("pageContainer").el.dom.scrollTop=0;

                        actionPanel.show();
                        scroller.show();
                        this.selectCategory(tokenInfo[0], tokenInfo[1]);

                        photoGroupStore.load(true);
                    };
                    var startDate=Ext.Date.parse(tokenInfo[2], "Y-m-d"), endDate=Ext.Date.parse(tokenInfo[3], "Y-m-d");

                    // Change the filter on the Locations store so that any locations not available in this photo group set are filtered out--
                    // This causes these filtered locations to not appear in the location filter view

                    var locationBitArray=tokenInfo.slice(4);
                    var newNode=photoCategoriesStore.getNodeByToken(tokenInfo[0]+"_"+tokenInfo[1]);

                    if (!newNode){
                        Ext.History.add("");
                        return;
                    }

                    var nodeLocations=newNode.get("locations");

                    locationStore.bannedLocations=Ext.Array.difference(locationStore.allLocations, nodeLocations);
                    locationStore.refreshFilters();

                    // The filtered locations remain in the history token, so that if the user moves to
                    // a photo group set where those locations are available, that filter can be applied again.
                    // however, the ignored location filters are cleared out of the values passed into the photo group store.
                    for ( var j=0; j<locationBitArray.length; j++){
                        var tokenLocation=locationStore.allLocations[j];
                        if (Ext.Array.indexOf(nodeLocations, tokenLocation)==-1){
                            locationBitArray[j]=0;
                        }
                    }

                    photoGroupStore.addListener("afterfilter", nextAction, controller, {
                        single: true
                    });
                    photoGroupStore.setAllFilterTypes(startDate, endDate, locationBitArray, locationStore);

                    if (tokenInfo[2]&&tokenInfo[3]){
                        Ext.getCmp("photoGroupDateSelector").setValueByDates(startDate, endDate);
                    } else{
                        Ext.getCmp("photoGroupDateSelector").setValue("All time");
                    }

                    if (tokenInfo[0]=="U") Ext.getCmp("openPhotoUpload").show();
                    else Ext.getCmp("openPhotoUpload").hide();

                }
            };

            if (!photoGroupStore.isLoading()&&!locationStore.isLoading()){
                action();
            } else if (photoGroupStore.isLoading()){
                if (controller.historyStoreLoadListener!==null){
                    photoGroupStore.removeListener("load", controller.historyStoreLoadListener);
                }
                controller.historyStoreLoadListener=action;
                photoGroupStore.addListener("load", controller.historyStoreLoadListener, controller, {
                    single: true
                });
            } else{
                locationStore.addListener("load", action, controller, {
                    single: true
                });
            }
        }, controller);

        controller.control({
            // ////PhotoCategory-related///////////////////////////////////////////////////
            '#bodyContainer': {
                beforerender: function(container){
                    var token=Ext.History.getToken();
                    Ext.log("Initial token: "+token);
                    if (!token){
                        controller.onFront();
                    } else{
                        Ext.History.fireEvent("change", token);
                    }
                }
            },
            'photoCategoryTree': {
                load: function(tree, node, records){
                    if (typeof (((Ext.Object.fromQueryString(document.location.search)).type))!=="undefined"){
                        controller.startPhotoListWithExternalFilter();
                    }
                },
                select: controller.startPhotoListViewFromEvent
            },

            // ////Date filter///////////////////////////////////////////////////
            'photoGroupDateSelector': {
                select: function(combo){
                    var dateSelection=combo.getValue();
                    var dateStore=Ext.getStore('clientPhotoList.DateRanges');
                    var dateSelector=Ext.getCmp("photoGroupDateSelector");
                    var startDate="";
                    var endDate="";

                    if (dateSelection=="Custom"){
                        Ext.getCmp('datePickerWindow').show();
                        return;
                    } else if (dateSelection!="All time"){
                        startDate=Ext.Date.format(dateStore.getById(dateSelection).get("StartDate"), "Y-m-d");
                        endDate=Ext.Date.format(dateStore.getById(dateSelection).get("EndDate"), "Y-m-d");
                    }
                    var token=Ext.History.getToken();
                    var tokenInfo=token.split("_");
                    if (tokenInfo[0]===null){
                        tokenInfo[0]="M";
                    }
                    tokenInfo[2]=startDate;
                    tokenInfo[3]=endDate;
                    Ext.History.add(tokenInfo.join("_"));
                },
                afterender:function(){
                    this.resetDateRange();
                }
            },
            '#dateRangeConfirm': {
                click: function(){
                    var dateSelector=Ext.getCmp("photoGroupDateSelector");
                    var dateStore=Ext.getStore("clientPhotoList.DateRanges");

                    var token=Ext.History.getToken();
                    if (!token) token="M";

                    var tokenInfo=token.split("_");
                    var startDate=Ext.getCmp("startDatePicker").getValue(), endDate=Ext.getCmp("endDatePicker").getValue();
                    tokenInfo[2]=Ext.Date.format(startDate, "Y-m-d");
                    tokenInfo[3]=Ext.Date.format(endDate, "Y-m-d");

                    Ext.getCmp('datePickerWindow').hide();
                    dateSelector.addCustomValue(startDate, endDate);
                    Ext.History.add(tokenInfo.join("_"));
                }
            },
            '#dateRangeCancel': {
                click: function(){
                    if (!photoGroupStore.startDate){
                        Ext.getCmp("photoGroupDateSelector").setValue("All time");
                    } else{
                        Ext.getCmp("photoGroupDateSelector").setValueByDates(photoGroupStore.startDate, photoGroupStore.endDate);
                    }
                }
            },
            '[xtype="photoGroupDatePicker"]': {
                refresh: function(picker){
                    var token=Ext.History.getToken();
                    var minDate=null, maxDate=null;

                    if (Ext.History.getToken()){
                        var photoGroupStore=Ext.getStore('clientPhotoList.PhotoGroups');
                        minDate=photoGroupStore.getOldestUnfilteredDate();
                        maxDate=photoGroupStore.getNewestUnfilteredDate();
                    } else{
                        minDate=controller.dateRange.startDate;
                        maxDate=controller.dateRange.endDate;
                    }
                    if (minDate&&maxDate){
                        picker.setMinDate(minDate);
                        picker.setMaxDate(maxDate);

                        if (picker.getValue()>maxDate||picker.getValue()<minDate){
                            if (picker.isStartDate) picker.setValue(minDate);
                            else picker.setValue(maxDate);
                            return false;
                        }
                    }
                }
            },
            
            // ////Location filter///////////////////////////////////////////////////
            'locationFilters': {
                itemclick: function(view, record, item, index){
                    var token=Ext.History.getToken();
                    if (token===null) token="M___";
                    var tokenInfo=token.split("_");

                    var childDivs=view.el.dom.children;
                    var locationStore=Ext.getStore("clientPhotoList.Locations");

                    // create location bit array with length of all locations (not just unfiltered ones)
                    for ( var i=0; i<locationStore.allLocations.length; i++){
                        tokenInfo[i+4]=0;
                    }
                    var noItemsAreChecked=true;
                    for ( var j=0; j<childDivs.length; j++){
                        var checkbox=childDivs[j].firstChild;
                        if (item==childDivs[j]){
                            checkbox.checked=(checkbox.checked?false:true);

                            if (checkbox.checked){
                                Ext.fly(item).addCls("locationSelected");
                                noItemsAreChecked=false;
                            } else Ext.fly(item).removeCls("locationSelected");
                        }
                        // because some locations may not be visible in the view, go based of the index for when all locations are considered
                        var tokenIndex=Ext.Array.indexOf(locationStore.allLocations, checkbox.value);
                        tokenInfo[tokenIndex+4]=((checkbox.checked?1:0));
                    }
                    Ext.History.add(tokenInfo.join("_"));

                    if (noItemsAreChecked) Ext.getCmp("clearLocationFilters").hide();
                    else Ext.getCmp("clearLocationFilters").show();
                },
                refresh: function(view){
                    // when the location filter view is refreshed,
                    // re-check and re-highlight all the location filters that should be selected

                    var locationStore=Ext.getStore("clientPhotoList.Locations");
                    var token=Ext.History.getToken();
                    if (token===null) return;
                    var locationBitArray=(token.split("_")).slice(4);
                    var checkboxes=Ext.select(".location input").elements;
                    var noItemsAreChecked=true;
                    for ( var i=0; i<locationBitArray.length; i++){
                        if (locationBitArray[i]==0) continue;
                        var location=locationStore.allLocations[i];
                        for ( var j=0; j<checkboxes.length; j++){
                            if (checkboxes[j].value==location){
                                noItemsAreChecked=false;
                                checkboxes[j].checked=true;
                                Ext.fly(checkboxes[j].parentNode).addCls("locationSelected");
                            }
                        }
                    }
                    if (noItemsAreChecked) Ext.getCmp("clearLocationFilters").hide();
                    else Ext.getCmp("clearLocationFilters").show();
                }
            },
            '#clearLocationFilters': {
                click: function(){
                    var token=Ext.History.getToken();
                    if (token===null) token="M___";
                    var tokenInfo=token.split("_");

                    var checkboxes=document.getElementById("locationFilters").getElementsByTagName("input");
                    for ( var i=0; i<checkboxes.length; i++){
                        checkboxes[i].checked=false;
                    }
                    for ( var j=4; j<tokenInfo.length; j++){
                        tokenInfo[j]=0;
                    }

                    Ext.History.add(tokenInfo.join("_"));
                    Ext.getCmp("clearLocationFilters").hide();
                }
            }
        });

        // The location filter area should be hidden/shown if the filtered locations
        // are empty/non-empty
        Ext.create("mds.view.clientPhotoList.widget.DatePickerWindow");

        var locationAreaDisplayFunc=function(){
            if (this.count()){
                Ext.getCmp("locationFilterArea").show();
            } else{
                Ext.getCmp("locationFilterArea").hide();
            }
        };

        Ext.getStore('clientPhotoList.Locations').addListener("load", locationAreaDisplayFunc);
        Ext.getStore('clientPhotoList.Locations').addListener("refresh", locationAreaDisplayFunc);

        photoGroupStore.addListener("endofstore", function(){
            var tokenInfo=Ext.History.getToken().split("_"), data;

            if (tokenInfo[0]=="U"){
                data=this.snapshot;
                if (!data) data=this.data;
                if (data.items.length===0) Ext.getCmp("photoVerticalLoadingScroller").add({
                    xtype: 'component',
                    baseCls: 'noPhotosMessage',
                    html: controller.noMyPhotosHTML
                });
            } else if (tokenInfo[0]=="S"){
                var favouritesStore=Ext.getStore("A_"+tokenInfo[1]);
                data=favouritesStore.snapshot;

                if (!data) data=favouritesStore.data;
                if (data.items.length===0) Ext.getCmp("photoVerticalLoadingScroller").add({
                    xtype: 'component',
                    baseCls: 'noPhotosMessage',
                    html: controller.noMyFavouritesHTML
                });
            }
        }, photoGroupStore);
    },
    getPhotoIDsByType: function(type){
        var photoSelectors=document.getElementsByName('photoSelector');
        var ids=[];
        for ( var i=0; i<photoSelectors.length; i++){
            var id=photoSelectors[i].value;
            var photoType=id.charAt(0), photoID=id.substring(1);
            if (!isNaN(photoID)) photoID=photoID-0;
            if (photoSelectors[i].checked&&photoType==type) ids.push(photoID);
        }
        return ids;
    },
    getSelectedPhotoIDs: function(callback){
        var photoSelectors=document.getElementsByName('photoSelector');
        var ids=[];
        for ( var i=0; i<photoSelectors.length; i++){
            if (photoSelectors[i].checked) ids.push(photoSelectors[i].value);
        }
        if (callback) callback(ids);
        else return ids;
    },
    getSelectedPhotos: function(){
        var photos=[];
        var photoSelectors=document.getElementsByName('photoSelector');
        var photoGroupStore=Ext.getStore("clientPhotoList.PhotoGroups");
        for ( var i=0; i<photoSelectors.length; i++){
            if (photoSelectors[i].checked){
                var photoStore=Ext.getStore(photoGroupStore.getPhotoStoreIDFromComponentID(photoSelectors[i].parentNode.parentNode.parentNode.id));
                photos.push(photoStore.getById(photoSelectors[i].value));
            }
        }
        return photos;
    },
    startPhotoListViewFromEvent: function(view, record){
        var data=record.getData();
        var controller=mds.app.getController("clientPhotoList.Controller");
        var token=Ext.History.getToken();
        if (token===null) token="";
        var tokenInfo=token.split("_");
        tokenInfo[0]=data.type;
        tokenInfo[1]=data.id;
        Ext.History.add(tokenInfo.join("_"));
    },
    selectCategory: function(type, album){
        var tree=Ext.getCmp("photoCategoryTree");
        var path=Ext.getStore("clientPhotoList.PhotoCategories").getNodePath(type, album);

        if (path!==null){
            tree.selectPath(path);
        }
    },
    onFront: function(){
        Ext.getCmp("photoActionPanel").hide();
        Ext.getCmp("photoVerticalLoadingScroller").hide();
        Ext.getCmp("photoCategoryCoverLinks").show();
        Ext.getCmp("photoCategoryTree").getSelectionModel().deselectAll();
        Ext.getStore("clientPhotoList.PhotoGroups").clearDateRange();

        this.resetDateRange();
    },
    resetDateRange: function(){
        var catStore=Ext.getStore("clientPhotoList.PhotoCategories");
        var controller=mds.app.getController("clientPhotoList.Controller");
        if (catStore.isLoading()){
            catStore.addListener("load", controller.resetDateRange, this, {single: true});
            return;
        }
        if (!controller.dateRange)
            this.dateRange={
                startDate: new Date(catStore.proxy.reader.rawData.children[0].startDate),
                endDate: new Date(catStore.proxy.reader.rawData.children[0].endDate)
            };   
        
        var allTime=Ext.getStore("clientPhotoList.DateRanges").getById("All time");

        allTime.set("StartDate", controller.dateRange.startDate);
        allTime.set("EndDate", controller.dateRange.endDate);
        Ext.getCmp("photoGroupDateSelector").setValue("All time");
    },
    allPhotosHaveFloorplan: function(){
        var photos=this.getSelectedPhotos();
        for ( var i=0; i<photos.length; i++){
            if (!photos[i].get("HasFloorplan")){ return false; }
        }
        return true;
    },
    onFavouritePhoto: function(){
        var ele=this;
        
        if (ele.className=="favourite"){
            ele.className="notFavourite";
            ele.title='Add this photo to my Favorites';
        } else{
            ele.className="favourite";
            ele.title='Remove this photo from my Favorites';
        }
    },
    noMyFavouritesHTML: '<p style="margin-bottom:10px;">'+'<span style="font-family:\'Gill Sans\',arial,sans-serif; color: #F9F9F9; line-height: 32px; font-size:17px; font-weight:bold;">Selecting Your Favorites</span>'+'<br>To add a photo to your Favorites, simply click the star in the upper-right corner of the photo.'+'</p>'+'<p style="margin-bottom:14px;">'+'The star will turn yellow and the photo you\'ve selected will be visible both on this Favorites Tab, and in the "My Favorites" album in your Photos Tab for that project.'+'</p>'+'<p><img src="/mds/module/ClientDashboard/image/help_favorites_illustration1.jpg" width="654" height="460" alt=""></p>',
    noMyPhotosHTML: "You have not uploaded any photos for this project. Use the 'Add Photos' button on the toolbar to upload photos."
});

// fix bug in firefox
Ext.util.History.getToken=function(){
    var token=this.ready?this.currentToken:this.getHash();
    return (token===null?null:decodeURI(token));
};

//@ sourceURL=photoListController.js
