Ext.define('mds.controller.clientWebcamTimelapse.Controller', {
    extend: 'Ext.app.Controller',

    ProjectUID: "",
    WebcamUID: "",

    Webcam: null,

    init: function(){
        var queryStringData=Ext.Object.fromQueryString(document.location.search);
        this.WebcamUID=queryStringData.WebcamUID;
        this.ProjectUID=queryStringData.ProjectUID;
        
        Ext.getStore("clientWebcamOverview.Webcams").addListener("load", function(store){
             if (store.count()>1){
                 Ext.getCmp("webcamThumbs").show();
                 var thumbsHeight=Ext.getCmp("webcamThumbs").getHeight();
                 Ext.select(".webcamThumb.border", true).each(function(e){
                     thumbsHeight+=e.getHeight();
                 });
                 Ext.getCmp("viewport").thumbsHeight=thumbsHeight;
                 Ext.getCmp("player").resize();
             }
        });

        this.control({
            '#viewport': {
                resize: function(){
                    Ext.getCmp("player").resize();
                },
                afterrender:function(){
                    mdslib.doAjaxRequest({
                        url: 'index.cfm?fuseaction=aClientWebcam.getWebcam',
                        params: {
                            WebcamUID: this.WebcamUID
                        },
                        successCallback: function(data){
                            var controller=mds.app.getController("clientWebcamTimelapse.Controller");

                            controller.Webcam=data;
                            
                            if (controller.Webcam.MostRecentPhotoDate){
                                var dsSplit=controller.Webcam.MostRecentPhotoDate.split(" ");
                                if (dsSplit.length>4) dsSplit.pop();
                                controller.Webcam.MostRecentPhotoDate=new Date(dsSplit.join(" "));
                            }
                            
                            data.ProjectUID=controller.ProjectUID;

                            var description=Ext.getCmp("description");
                            if (description) description.update(data);
                            
                            var player=Ext.getCmp("player");
                            if (player) player.load(data, Ext.getCmp("viewport"));
                        },
                        noResponseCallback: function(){
                            Ext.Msg.alert("", "Webcam is currently unavailable");
                        }
                    });    
                }
            },
            '#gotoArchive': {
                click: function(){
                    document.location.href="photoviewer.htm?ProjectUID="+this.ProjectUID+"&PhotoGroupType=W&WebcamUID="+this.WebcamUID+"&PhotoGroupDate="+Ext.Date.format(this.Webcam.MostRecentPhotoDate, "Y-m-d"); //+"&SelectedPhotoTime=1200" //AR: causes pv to fail when no noon image exists
                }
            },
            '#saveTimelapseAction': {
                click: function(){
                    window.open(this.Webcam.TimelapseURL, "_blank");
                }
            },
            '#description':{
                render:function(description){
                    if (this.Webcam && !description.data)
                        description.update(this.Webcam);
                }   
            },
            '#player':{
                render:function(player){
                    if (this.Webcam && !player.data)
                        player.update(this.Webcam);    
                }
            }
        });
    }
});
//@ sourceURL=WebcamTimelapseController.js
