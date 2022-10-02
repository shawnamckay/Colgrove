/**
 * 
 */
Ext.define('mds.view.clientDashboard.GlobalFeedView', {
    extend: 'Ext.view.View',
    id: 'globalFeedView',
    alias: 'widget.globalFeedView',
    store: 'clientDashboard.GlobalFeeds',
    html: '<div style="width:750px;">&nbsp;</div>',
    tpl: [
        '</div>',
        '<tpl for=".">',
            '<div class="projectEntryCls">',
                '<div class="projectEntryLeft">',
                    '<div class="theFirstImageCls">',
                        '<img src="{logoURL}" class="projectIconImageCls" alt="" />',
                    '</div>',
                '</div>',
                '<div class="projectEntryRight">',
                    '<div class="projectEntryRightWrapper">',
                        '<div class="theFirstDescriptionCls">',
                            '<h5><span class="projectNameCls"><a href="../index.htm?ProjectUID={ProjectUID}" title="Enter Project">{projectTitle}</a></span> - Multivista Added {count} new photos.</h5>',
                            '<span class="theFirstDescriptionFooter">',
                                '<span class="projectAddressCls">{projectAddress}</span> <span class="feedDateCls">{date:this.dateDisplay()}</span>',
                            '</span>',
                        '</div>',
                        '<tpl for="shoots">',
                            '<div class="shootWrapper">',
                                '<div class="shootDescriptionCls">',
                                    '<div class="shootDescriptionHeader">',
                                        '<span class="plan"><a href="photoList.htm?ProjectUID={parent.ProjectUID}#C_{type}_{parent.date:date("Y-m-d")}_{parent.date:date("Y-m-d")}">{plan:this.planDisplay(values.type)}</a></span>',
                                        '<span class="type">{type}</span>',
                                    '</div>',
                                    '<div class="shootDescriptionFooter UIActionLinks">',
                                        '<a href="photoviewer.htm?ProjectUID={parent.ProjectUID}&PhotoGroupType=S&ShootUID={ShootUID}" class="UIFeedBox">',
                                            '<i class="UIFeedBoxSprite UIFeedBoxPhotoIcon"></i><span class="UIFeedBoxText">{count} Photos</span>',
                                        '</a><!-- DATA needs link to photos in photo list view -->',
                                    '</div>',
                                '</div>',
                                '<tpl if="image0ID != \'\'">',
                                    '<div class="shootImageCls">',
                                        '<div class="shootImageWrapper">',
                                            '<a href="photoviewer.htm?ProjectUID={parent.ProjectUID}&PhotoGroupType=S&ShootUID={ShootUID}&SelectedPhotoID={image0ID}">',
                                            '<img src="{image0URL}" alt="" /></a>',
                                        '</div>',
                                    '</div>',
                                '</tpl>',
                                '<tpl if="image1ID != \'\'">',
                                    '<div class="shootImageCls">',
                                        '<div class="shootImageWrapper">',
                                            '<a href="photoviewer.htm?ProjectUID={parent.ProjectUID}&PhotoGroupType=S&ShootUID={ShootUID}&SelectedPhotoID={image1ID}">',
                                            '<img src="{image1URL}" alt="" /></a>',
                                        '</div>',
                                    '</div>',
                                '</tpl>',
                                '<tpl if="image2ID != \'\'">',
                                    '<div class="shootImageCls">',
                                        '<div class="shootImageWrapper">',
                                            '<a href="photoviewer.htm?ProjectUID={parent.ProjectUID}&PhotoGroupType=S&ShootUID={ShootUID}&SelectedPhotoID={image2ID}">',
                                            '<img src="{image2URL}" alt="" /></a>',
                                        '</div>',
                                    '</div>',
                                '</tpl>',
                                '<tpl if="image3ID != \'\'">',
                                    '<div class="shootImageCls">',
                                        '<div class="shootImageWrapper">',
                                            '<a href="photoviewer.htm?ProjectUID={parent.ProjectUID}&PhotoGroupType=S&ShootUID={ShootUID}&SelectedPhotoID={image3ID}">',
                                            '<img src="{image3URL}" alt="" /></a>',
                                        '</div>',
                                    '</div>',
                                '</tpl>',
                                '<div class="clear"></div>',
                            '</div> <!-- /.shootWrapper -->',
                        '</tpl>',
                        '<div class="clear"></div>',
                    '</div> <!-- /.projectEntryRightWrapper -->',
                '</div> <!-- /.projectEntryRight -->',
            '</div> <!-- /.projectEntryCls -->',
        '</tpl>',
        {
            planDisplay: function() {
                return arguments[0] == "" ? arguments[1] : arguments[0];
            },
            // cf. http://127.0.0.1:8500/sencha/ext-4.1.1a/docs/index.html#!/api/Ext.Date
            // cf. Ext.util.Format.date() calls the Javascript Date object's parse() method to convert to Date.
            dateDisplay: function() {
                return Ext.util.Format.date(arguments[0], 'l M j, Y');
            },
            dateAlbum: function() {
                return Ext.util.Format.date(arguments[0], 'Y-m-d');
            }
        }
    ],
    requires: [
        'mds.view.clientDashboard.PreferedDashboardSelector'
    ],
    listeners: {
        boxready: function() {
            var me = this;
            me.pdSelector.append(me);
        }
    },
    initComponent: function() {
        var me = this;
        me.enableBubble('dashboardpreferenceclicked');
        var model = {
            MemberDashboardPreference: 'globalfeed'
        };
        me.pdSelector = Ext.create('mds.view.clientDashboard.PreferedDashboardSelector', {model: model});
        me.callParent(arguments);
    },
    itemSelector: ''
});