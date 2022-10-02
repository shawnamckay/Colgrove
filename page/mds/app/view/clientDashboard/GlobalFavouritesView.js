/**
 *  JSON: [
 *      {
 *          projectTitle :
 *          projectAddress :
 *          logoSrc :
 *          count :
 *          images : [
 *              {
 *                  href :
 *                  src :
 *              },
 *              ...
 *          ]
 *      },
 *      ...
 *  ]
 */
Ext.define('mds.view.clientDashboard.GlobalFavouritesView', {
    extend: 'Ext.view.View',
    id: 'globalFavouritesView',
    alias: 'widget.globalFavouritesView',
    store: 'clientDashboard.GlobalFavourites',
    width: '82%',
    tpl: new Ext.XTemplate(
        '<tpl if="values.length == 0">',
        '<div style="padding: 24px; width: 540px;">',
            '<p style="margin-bottom:10px;">',
              '<span style="font-family:\'Gill Sans\',arial,sans-serif; font-size:17px; font-weight:bold;">Your Favorites Tab</span>',
              '<br>The Favorites Tab makes it easy to get back to your favorite photos.',
            '</p>',
            '<p style="margin-bottom:10px;">',
              '<span style="font-family:\'Gill Sans\',arial,sans-serif; font-size:17px; font-weight:bold;">Selecting Your Favorites</span>',
              '<br>To add a photo to your Favorites, simply click the star in the upper-right corner of the photo.',
            '</p>',
            '<p style="margin-bottom:20px;">',
              'The star will turn yellow and the photo you\'ve selected will be visible both on this Favorites Tab, and in the "My Favorites" album in your Photos Tab for that project.',
            '</p>',
            '<p><img src="/mds/module/ClientDashboard/image/help_favorites_illustration1.jpg" width="654" height="460" alt=""></p>',
        '</div>',
        '</tpl>',
        '<tpl for=".">',
            '<div class="projectEntryCls">',
                '<div class="projectEntryLeft">',
                    '<div class="theFirstImageCls">',
                        '<img src="{logoSrc}" class="projectIconImageCls" alt="" />',
                    '</div>',
                '</div>',
                '<div class="projectEntryRight">',
                    '<div class="projectEntryRightWrapper">',
                        '<div class="theFirstDescriptionCls">',
                            '<h5><span class="projectNameCls"><a href="../index.htm?ProjectUID={ProjectUID}" title="Enter Project">{projectTitle}</a></span> <!--<span class="favouritesCountClass">({[values.images.length]})</span>--></h5>',
                        '</div>',
                        '<span class="theFirstDescriptionFooter">',
                                '<span class="projectAddressCls">{projectAddress}</span>',
                        '</span>',
                        '<div class="favouritesItemWrapper">',
                        '<tpl for="images">',
                            '<div class="item">',
                                '<div class="itemInner">',
                                    '<a href="photoviewer.htm?ProjectUID={parent.ProjectUID}&AlbumUID={parent.favoritesAlbumUID}&PhotoGroupType=A&{[this.getSelectedPhotoText(values)]}"><img src="{src}" alt="" /></a>',
                                '</div>',
                            '</div>',
                        '</tpl>',
                        '</div>',
                        '<div class="clear"></div>',
                    '</div> <!-- /.projectEntryRightWrapper -->',
                '</div> <!-- /.projectEntryRight -->',
            '</div> <!-- /.projectEntryCls -->',
        '</tpl>', {
            getSelectedPhotoText:function(values){
                return (values.PhotoID?"SelectedPhotoID="+values.PhotoID:(values.UDEFPhotoUID?"SelectedUDEFPhotoUID="+values.UDEFPhotoUID:
                    "SelectedWebcamPhotoUID="+values.WebcamPhotoUID));
            }
        }
    ),
    requires: [
        'mds.view.clientDashboard.PreferedDashboardSelector'
    ],
    listeners: {
        afterrender: function() {
            var me = this;
            me.pdSelector.append(me);
        }
    },
    initComponent: function() {
        var me = this;
        me.enableBubble('dashboardpreferenceclicked');
        var model = {
            MemberDashboardPreference: 'favourites'
        };
        me.pdSelector = Ext.create('mds.view.clientDashboard.PreferedDashboardSelector', {model: model});
        me.callParent(arguments);
    },
    itemSelector: ''
});