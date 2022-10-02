Ext.define('mds.view.clientWebcamOverview.Webcam.view', {
    extend: 'Ext.view.View',
    alias: 'widget.clientWebcamOverviewWebcamView',
    id: 'clientWebcamOverviewWebcamView',
    store: 'clientWebcamOverview.Webcams',
    itemSelector: 'div .floorplan',
    tpl: new Ext.XTemplate(
        '<div class="title">Webcams</div>',
        '<tpl for="."">',
          '<div class="webcam">',
            '<a href="photoviewer.htm?PhotoGroupType=W&WebcamUID={WebcamUID}&ProjectUID='
            	+(Ext.Object.fromQueryString(document.location.search)).ProjectUID+
            	'">',
          	  '<img src="{ImageURL}"/>',
          	  '<div class="webcamTitle">{WebcamTitle}</div><br/>',
          	'</a>',
          '</div>',
        '</tpl>'
    )
});