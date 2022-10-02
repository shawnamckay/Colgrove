Ext.define('mds.view.clientWebcamLive.WebcamThumbs', {
    id: 'webcamThumbs',
    extend: 'Ext.view.View',

    store: 'clientWebcamOverview.Webcams',

    tpl: Ext.create('Ext.XTemplate',
        '<div class="title">Other Project Webcams</div>',
        '<tpl for="."">',
            '<tpl if="WebcamUID!=(Ext.Object.fromQueryString(document.location.search)).WebcamUID">',
                '<div class="webcamThumb">',
                    '<a href="{[this.getPage()]}?WebcamUID={WebcamUID}&ProjectUID=',
                        (Ext.Object.fromQueryString(document.location.search)).ProjectUID,
                        '">',
                        '<img src="{ImageURL}" title="{WebcamTitle}"/>',
                    '</a>',
                '</div>',
            '</tpl>',
        '</tpl>',
        {
            getPage:function(){
                return document.location.href.match("[^/]*\.html?")[0];
            }
        }
    ),
    itemSelector: '.webcamThumb'
});