Ext.define('mds.view.clientWebcamLive.Description', {
    extend: 'Ext.view.View',
    id: 'description',
    
    tpl: new Ext.XTemplate(
        '<tpl for=".">',
            '<img id="projectImage" src="{ProjectImage}">',
            '<div id="descriptionText">',
                '<div class="title"><a title="Return to Project: {ProjectTitle}" href="../index.htm?ProjectUID={ProjectUID}">{ProjectTitle}</a></div>',
                '<div class="title">{WebcamLabel}</div>',
                '<div>{[this.getTitle()]}</div>',
            '</div>',
         '</tpl>',
         {
             getTitle:function(){
                 return (document.location.href.indexOf("aClientWebcam.live")!=-1?"Live Stream":"Timelapse");
             }
         }
    )
});