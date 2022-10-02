Ext.define('mds.store.clientPhotoList.PhotoGroups', {
    extend: 'Ext.data.Store',
    model: 'mds.model.clientPhotoList.PhotoGroup',
    autoLoad: false,
    proxy: {
        type: 'jsonp',
        url: 'index.cfm?fuseaction=aClientPhotoList.getPhotoGroups'
    },
    ////////// Variables //////////  
    groupIndex: -1,
    startDate: null,
    endDate: null,
    newestUnfilteredDate: null,
    oldestUnfilteredDate: null,
    locationArray: [],
    storeNeedsLoad: true,

    ////////// Sorters //////////
    sortOnLoad: true,
    sortOnFilter: true,
    sorters: [{
        sorterFn: function(photoGroup1, photoGroup2){
            var categoryType=Ext.History.getToken().split("_")[0];
            if (categoryType=='Y'||categoryType=='P'||categoryType=='S'||categoryType=='A') //My Albums / Project Team Albums / album-- presorted
            return 0;

            var newestDate1=photoGroup1.get("newestPhotoDate");
            var newestDate2=photoGroup2.get("newestPhotoDate");

            if (!newestDate1) return -1;
            if (!newestDate2) return 1;

            var newestDate1=newestDate1.getTime();
            var newestDate2=newestDate2.getTime();
            if (newestDate1==newestDate2){
                if (!photoGroup1.get("PhotoGroupDate")) return -1;
                if (!photoGroup2.get("PhotoGroupDate")) return 1;
                return 0;
            }
            return ((newestDate1<newestDate2)?-1:1);
        },
        direction: 'DESC'
    }],
    //////////Filters //////////
    dateFilter: new Ext.util.Filter({
        id: 'date',
        filterFn: function(PhotoGroup){
            var photoGroupStore=Ext.getStore('clientPhotoList.PhotoGroups');
            return ((PhotoGroup.get("oldestPhotoDate")&&photoGroupStore.startDate<=PhotoGroup.get("newestPhotoDate")&&photoGroupStore.endDate>=PhotoGroup.get("oldestPhotoDate"))?true:false);
        }
    }),
    locationFilter: new Ext.util.Filter({
        id: 'location',
        filterFn: function(PhotoGroup){
            if (PhotoGroup.get("PhotoGroupType")=='U') //user-defined photos have no location
            return false;

            var location=PhotoGroup.get("Location"); //location is specified for multivista shoot photo groups (location="" for slideshows)

            if (location==null) //need to look at individual photos for inclusion if photo group doesn't have single location
            return true;

            //if location is specified in photo group then return true iff location is in filter location array-- slideshows->return false
            return (Ext.Array.indexOf(Ext.getStore('clientPhotoList.PhotoGroups').locationArray, location)!=-1?true:false);
        }
    }),
    refreshFilters: function(){
        this.callParent(arguments);
        var count=this.count();
        for ( var i=0; i<count; i++){
            var photoGroup=this.getAt(i);
            var photoStore=this.getPhotoStore(photoGroup);
            if (photoStore) photoStore.refreshFilters();
        }
    },
    clearDateRange: function(){
        Ext.log("PG clearDateRange");
        var me=this;

        me.startDate=undefined;
        me.endDate=undefined;

        if (!me.removeFilter("date")) return false;

        var count=this.count();
        for ( var i=0; i<count; i++){
            var photoGroup=me.getAt(i);
            var photoStore=me.getPhotoStore(photoGroup);
            if (photoStore&&photoStore.clearDateRange){
                photoStore.clearDateRange();
            }
        }
        return true;
    },
    setDateRange: function(startDate, endDate){
        Ext.log("PG setDateRange");
        var me=this;

        var madeChange=((Ext.Date.format(me.startDate, "Y-m-d")!=Ext.Date.format(startDate, "Y-m-d")||Ext.Date.format(me.endDate, "Y-m-d")!=Ext.Date.format(endDate, "Y-m-d"))?true:false);

        if (!madeChange) return false;

        me.startDate=startDate;
        me.endDate=endDate;

        me.addFilter(me.dateFilter);

        var count=this.count();
        for ( var i=0; i<count; i++){
            var photoGroup=me.getAt(i);
            var photoStore=me.getPhotoStore(photoGroup);
            if (photoStore&&photoStore.setDateRange){
                photoStore.setDateRange();
            }
        }
        return true;
    },
    addLocationFilter: function(location){
        var me=this;

        if (Ext.Array.indexOf(me.locationArray, location)!=-1) return false;

        me.locationArray.push(location);

        var madeChange=me.addFilter(me.locationFilter);

        var count=me.count();
        for ( var i=0; i<count; i++){
            var photoGroup=me.getAt(i);
            var photoStore=me.getPhotoStore(photoGroup);
            if (photoStore&&photoStore.setLocationFilter){
                photoStore.setLocationFilter(location);
            }
        }
        return true;
    },
    removeLocationFilter: function(location){
        var me=this;

        var index=Ext.Array.indexOf(me.locationArray, location);

        if (index==-1) return false;

        me.locationArray.splice(index, 1);

        if (me.locationArray.length==0) //remove filter if no locations are left to filter by
        me.clearLocationFilters();

        var count=me.count();
        for ( var i=0; i<count; i++){
            var photoGroup=me.getAt(i);
            var photoStore=me.getPhotoStore(photoGroup);
            if (photoStore&&photoStore.refreshLocationFilter){
                photoStore.refreshLocationFilter();
            }
        }
        return true;
    },
    clearLocationFilters: function(){
        var me=this;
        this.locationArray=[];
        if (!me.removeFilter("location")) return false;

        var count=me.count();
        for ( var i=0; i<count; i++){
            var photoGroup=me.getAt(i);
            var photoStore=me.getPhotoStore(photoGroup);
            if (photoStore&&photoStore.clearLocationFilter){
                photoStore.clearLocationFilter();
            }
        }
        return true;
    },
    setLocationFiltersByArray: function(locationArray, locationStore){
        var madeChange=false;
        for ( var i=0; i<locationArray.length; i++){
            var location=locationStore.allLocations[i];
            if (locationArray[i]){
                madeChange=(this.addLocationFilter(location)||madeChange);
            } else{
                madeChange=(this.removeLocationFilter(location)||madeChange);
            }
        }
        return madeChange;
    },
    setAllFilterTypes: function(startDate, endDate, locationArray, locationStore){
        this.suppressRefresh=true;
        this.showLoading();
        var madeChange=false;
        if (startDate) madeChange=this.setDateRange(startDate, endDate);
        else{
            madeChange=this.clearDateRange();
        }

        madeChange=(this.setLocationFiltersByArray(locationArray, locationStore)||madeChange);
        this.refreshFilters();
        this.suppressRefresh=false;
        this.fireEvent("afterfilter");
    },
    setNewestUnfilteredDate: function(){
        var data=this.snapshot;
        if (!data) data=this.data;

        var count=data.items.length;
        if (!count){
            this.newestUnfilteredDate=null;
            return null;
        }
        var newestDate=null;

        for ( var i=0; i<count; i++){
            var nextDate=data.items[i].data.newestPhotoDate;
            if (!nextDate) continue;
            if (newestDate==null||nextDate>newestDate) newestDate=nextDate;
        }
        this.newestUnfilteredDate=newestDate;
        Ext.getStore("clientPhotoList.DateRanges").getById("All time").set("EndDate", this.newestUnfilteredDate);
    },
    setOldestUnfilteredDate: function(){
        var data=this.snapshot;
        if (!data) data=this.data;

        var count=data.items.length;
        if (!count){
            this.oldestUnfilteredDate=null;
            return null;
        }
        var oldestDate=null;

        for ( var i=0; i<count; i++){
            var nextDate=data.items[i].data.oldestPhotoDate;
            if (!nextDate) continue;
            if (oldestDate==null||nextDate<oldestDate) oldestDate=nextDate;
        }
        this.oldestUnfilteredDate=oldestDate;
        Ext.getStore("clientPhotoList.DateRanges").getById("All time").set("StartDate", this.oldestUnfilteredDate);
    },
    getNewestUnfilteredDate: function(){
        return this.newestUnfilteredDate;
    },
    getOldestUnfilteredDate: function(){
        return this.oldestUnfilteredDate;
    },
    //////////Management //////////  
    setAlbumIdentifier: function(albumName){ //album name / shoot category or null
        var store=this;
        var proxy=store.getProxy();
        if (proxy.extraParams.album!=albumName){
            this.storeNeedsLoad=true;
        }
        proxy.setExtraParam("album", albumName);
    },
    setAlbumType: function(albumType){ //album name / shoot category or null
        var store=this;
        var proxy=store.getProxy();
        if (proxy.extraParams.type!=albumType){
            this.storeNeedsLoad=true;
        }
        proxy.setExtraParam("type", albumType);
    },
    getPhotoStoreID: function(photoGroup){
        var photoGroupType=photoGroup.get("PhotoGroupType");
        var id=photoGroupType+"_"+photoGroup.get("id");

        if (photoGroupType=="U") id+="_"+Ext.Date.format(photoGroup.get("PhotoGroupDate"), 'Y-m-d')

        return id;
    },
    getPhotoStoreIDFromAlbumUID: function(AlbumUID){
        return ("A_"+AlbumUID);
    },
    getPhotoStoreIDFromComponentID: function(componentID){
        var cidSplit=componentID.split("_");
        var id=cidSplit[0]+"_"+cidSplit[1];
        if (cidSplit[0]=="U") id+="_"+cidSplit[2];
        return id;
    },
    getComponentID: function(photoGroup, photo){
        return (this.getPhotoStoreID(photoGroup)+"_"+photo.get("id"));
    },
    getComponent: function(photoStore, photo){
        var id=photoStore.storeId+"_"+photo.get("id");
        return Ext.getCmp(id);
    },
    getPhotoStore: function(photoGroup){
        return Ext.getStore(this.getPhotoStoreID(photoGroup));
    },
    //////////Photo Retrieval //////////  
    loadPhotoGroup: function(photoGroup, callback){
        var me=this;

        if (!photoGroup&&callback){ //no more photo groups
            this.fireEvent("endofstore");
            Ext.log("no more photo groups");
            callback(null);
        } else if (me.getPhotoStore(photoGroup)&&me.getPhotoStore(photoGroup).loaded){ //this group already has photos loaded
            me.getNextPhoto(callback);
        } else{ //need to load photo data
            document.getElementById("loadDiv").style.visibility="visible";
            var newPhotoStore=me.getPhotoStore(photoGroup);
            if (!newPhotoStore) newPhotoStore=me.createPhotoStore(photoGroup);

            if (callback){
                var onPhotoStoreLoad=function(){
                    var photo=newPhotoStore.getNextPhoto();
                    if (!photo){
                        me.loadPhotoGroup(me.getAt(++me.groupIndex), callback);
                    } else{
                        callback({
                            photo: photo,
                            photoGroup: photoGroup
                        });
                    }
                    document.getElementById("loadDiv").style.visibility="hidden";
                    newPhotoStore.removeListener("load", onPhotoStoreLoad);
                };
                newPhotoStore.addListener("load", onPhotoStoreLoad, this, {
                    single: true
                });
            }
            newPhotoStore.load();
        }
    },
    createPhotoStore: function(photoGroup){
        var me=this;
        var photoGroupType=photoGroup.get("PhotoGroupType");
        var photoStoreType=((photoGroupType=="S")?'mds.store.clientPhotoList.ShootPhotos':(photoGroupType=="A"?'mds.store.clientPhotoList.AlbumPhotos':'mds.store.clientPhotoList.UDEFPhotos'));

        var config={
            id: this.getPhotoStoreID(photoGroup),
            sourceID: photoGroup.get("id")
        };
        Ext.log("creating photo store:"+config.id+"...");

        if (photoGroupType=="U") config.date=photoGroup.get("PhotoGroupDate");

        var photoStore=Ext.create(photoStoreType, config);

        if (me.locationArray.length&&photoStore.setLocationFilter) photoStore.setLocationFilter();

        if (me.startDate&&me.endDate&&photoStore.setDateRange) photoStore.setDateRange();

        var token=Ext.History.getToken();
        var onFavs=false;
        if (token){
            var splitToken=(token).split("_");
            if (splitToken[0]=="S"&&splitToken[1]==photoGroup.get("id")) Ext.getStore("clientPhotoList.PhotoCategories").favouritesStore=photoStore;
        }

        Ext.log("done creating photo store");
        return photoStore;
    },
    getNextPhoto: function(callback){
        var photoGroupStore=this;
        var photoGroup=photoGroupStore.getAt(photoGroupStore.groupIndex);
        if (photoGroup){
            var photoStore=photoGroupStore.getPhotoStore(photoGroup);
            var photo=photoStore.getNextPhoto();
            if (photo){
                if (callback) callback({
                    photo: photo,
                    photoGroup: photoGroup
                });
                return;
            }
        }
        photoGroupStore.loadPhotoGroup(photoGroupStore.getAt(++photoGroupStore.groupIndex), callback);
    },
    //////////Listeners //////////  
    listeners: {
        refresh: function(){
            if (this.suppressRefresh) return;
            Ext.log("REFRESH");
            this.groupIndex=-1;
            var count=this.count();
            for ( var i=0; i<count; i++){
                var photoGroup=this.getAt(i);
                var photoStore=this.getPhotoStore(photoGroup);
                if (photoStore) photoStore.reset();
            }
            this.fireEvent("afterrefresh");
        },
        afterrefresh: function(){
            this.reloadScroller();
        },
        beforeload: function(){
            this.showLoading();
        },
        load: function(){
            Ext.log("LOAD");
            this.groupIndex=-1;

            this.setNewestUnfilteredDate();
            this.setOldestUnfilteredDate();
            var dateSelector=Ext.getCmp("photoGroupDateSelector");

            dateSelector.setValue(dateSelector.getValue()); //refreshes date range in date selector display

            var count=this.count();
            for ( var i=0; i<count; i++){
                var photoGroup=this.getAt(i);
                var photoStore=this.getPhotoStore(photoGroup);
                if (photoStore){
                    var photoStoreChanged=false;
                    if (this.startDate&&this.endDate&&photoStore.setDateRange){
                        photoStore.setDateRange();
                        photoStoreChanged=true;
                    }
                    if (this.locationArray.length&&photoStore.refreshLocationFilter){
                        photoStore.refreshLocationFilter();
                        photoStoreChanged=true;
                    }
                    if (photoStoreChanged) photoStore.refreshFilters();
                }
            }
            this.storeNeedsLoad=false;
        }
    },
    showLoading: function(){
        Ext.getCmp('sideContainer').disable();
        Ext.getCmp("photoCategoryCoverLinks").mask();
        document.getElementById("loadDiv").style.visibility="visible";
    },
    reloadScroller: function(){
        var scroller=Ext.getCmp('photoVerticalLoadingScroller');
        if (scroller) scroller.reload();
    },
    sort: function(){
        Ext.log("SORT");
        this.callParent(arguments);
    },
    load: function(force){
        if (!force&&!this.storeNeedsLoad){ return false; }
        this.callParent(arguments);
        return true;
    }
});

//@ sourceURL=photoListPhotoGroupsStore.js