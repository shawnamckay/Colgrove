Ext.define('mds.controller.clientFloorplanOverview.controller', {
    extend: 'Ext.app.Controller',
    init: function(){
        var controller=this;
        var floorplanStore=Ext.getStore("clientFloorplanOverview.Floorplans");
        controller.control({
            '#shootCategoryTree': {
                select: function(treePanel, record, index){
                    floorplanStore.clearLocationFilters();
                    floorplanStore.filterShootType(record.get("text"));
                    Ext.getStore("clientFloorplanOverview.Locations").load();
                },
                afterrender: function(treePanel){
                    treePanel.selectPath("root");
                }
            },
            'locationFilters': {
                itemclick: function(view, record, item, index){
                    var checkbox=item.firstChild;
                    checkbox.checked=(checkbox.checked?false:true);

                    if (checkbox.checked){ //add filter
                        floorplanStore.filterLocation(checkbox.value);
                        Ext.getCmp("clearLocationFilters").show();
                    } else{ //remove filter
                        floorplanStore.unfilterLocation(checkbox.value);
                        var noItemsAreChecked=true;
                        var checkboxes=Ext.select(".location input").elements;
                        for ( var i=0; i<checkboxes.length; i++){
                            if (checkboxes[i].checked){
                                noItemsAreChecked=false;
                                break;
                            }
                        }
                        if (noItemsAreChecked) Ext.getCmp("clearLocationFilters").hide();
                    }
                },
                refresh: function(){
                    Ext.getCmp("clearLocationFilters").hide();
                }
            },
            '#clearLocationFilters': {
                click: function(){
                    var checkboxes=document.getElementById("locationFilters").getElementsByTagName("input");
                    for ( var i=0; i<checkboxes.length; i++){
                        checkboxes[i].checked=false;
                    }
                    floorplanStore.clearLocationFilters();
                    Ext.getCmp("clearLocationFilters").hide();
                }
            }
        });
        floorplanStore.addListener("load", function(store){
            store.nLoadedImages=0;
            var nImages=store.count();
            for ( var i=0; i<nImages; i++){
                var url=store.getAt(i).get("ImageURL");
                var image=new Image();
                image.fid=store.getAt(i).get("FloorplanUID");
                image.url=store.getAt(i).get("ImageURL");
                image.onload=function(){
                    var img=Ext.select("#"+this.fid).elements[0];
                    if (img)
                        img.src=this.url;
                    store.nLoadedImages++;
                    if (store.nLoadedImages>=nImages) Ext.getCmp("clientFloorplanOverviewFloorplanView").updateLayout();
                }
                image.src=url;
            }
        });
    }
//@ sourceURL=FloorplanOverviewController.js
});