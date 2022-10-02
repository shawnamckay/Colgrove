Ext.define('mds.view.clientWebcamLive.CloseButton', {
    extend: 'Ext.container.Container',
    id: 'closeButtonLink',
    xtype: 'viewerclosebutton',
    autoEl: 'a',
    layout: {
        type: 'hbox'
    },
    items: [
        {
            xtype: 'component',
            id: 'closeRefId',
            width: 160,
            height: 15,
            margin: "2 0 0 0"
        }
    ],
    listeners: {
    	afterrender: function(me){
   		
            var myFuseaction = mdslib.getFuseaction(); 
            var currentQSO = Ext.Object.fromQueryString(document.location.search);            
            var closeComp = Ext.getCmp('closeRefId');
            closeComp.getEl(closeComp).setHTML('<em>Return to Previous Page</em> &raquo;');
            
            var referrerFilename = document.referrer.replace(/^.*[\\\/]/, '');
            var referrerQueryString = '';
                
            var split = referrerFilename.split("?");
            if (split.length > 1) {
                referrerFilename = split[0];
                referrerQueryString = split[1];
            }
            
            if (document.referrer && myFuseaction != "aClientWebcam.timelapse" && referrerFilename != 'clientFloorplanOverview.htm') { //&& myFuseaction != "aClientPhotoViewer.view"
                me.el.dom.href = document.referrer;
            }
            //if from floorplanviewer ...
            else if ( referrerFilename == 'clientFloorplanOverview.htm') {
                me.el.dom.href = 'clientFloorplanOverview.htm?' + referrerQueryString;
            }
            else if ( myFuseaction == "aClientWebcam.timelapse" || currentQSO.PhotoGroupType == 'W' || currentQSO.PhotoGroupType == 'C') {
                me.el.dom.href = 'webcamOverview.htm?ProjectUID='+currentQSO.ProjectUID;
            } 
            // Otherwise go to project gateway.
            else {
                me.el.dom.href = "../index.htm?ProjectUID="+currentQSO.ProjectUID;
            }            
        }
    }
});