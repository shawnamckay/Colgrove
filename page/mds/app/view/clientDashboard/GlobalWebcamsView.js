/**
 *  JSON: [
 *      {
 *          projectTitle :
 *          projectAddress :
 *          ProjectUID :
 *          logoURL :
 *          webcams : [
 *              {
 *                  WebcamUID :
 *                  webcamTitle :
 *                  imageURL :
 *              },
 *              ...
 *          ]
 *      },
 *      ...
 *  ]
 */
Ext.define('mds.view.clientDashboard.GlobalWebcamsView', {
    extend: 'Ext.view.View',
    id: 'globalWebcamsView',
    alias: 'widget.globalWebcamsView',
    store: 'clientDashboard.GlobalWebcams',
    width: '82%',
    tpl: [
        '<tpl if="values.length == 0">',
            '<div style="padding: 24px; width: 540px;">',
                '<p style="margin-bottom:20px;">',
                  '<span style="font-family:\'Gill Sans\',arial,sans-serif; font-size:17px; font-weight:bold;">Your Webcams Tab</span>',
                  '<br>The Webcams Tab makes it easy to browse the latest views from your live webcams.',
                '</p>',
                '<p style="margin-bottom:10px;">',
                  '<span style="font-family:\'Gill Sans\',arial,sans-serif; font-size:17px; font-weight:bold;">The Multivista Advantage</span>',
                  '<br>Multivista Webcam provides anytime access to live conditions of your jobsite, perfect for broad site overviews of current conditions and construction activity.',
                '</p>',
                '<p style="margin-bottom:10px;">',
                  'We help coordinate every detail, from webcam setup to hosting your video footage and monitoring the camera 24/7/365 for quick and easy troubleshooting.',
                '</p>',
                '<p style="margin-bottom:10px;">',
                  'When you choose Multivista\'s construction webcams for your project, you are choosing a well-developed and respected project information platform. We upload, link, manage and host all of your content for you, allowing you to interact with your content and your project team anytime, anywhere.',
                '</p>',
                '<p style="margin-bottom:30px;">',
                  '<a href="http://www.multivista.com/services/construction-webcams" target="_blank">Learn more on our website</a> or <a href="http://www.multivista.com/contact" target="_blank">contact your local multivista office</a> for more information.',
                '</p>',
                '<p><a href="http://www.multivista.com/services/construction-webcams" target="_blank"><img src="assets/images/campaigns/login_rhs_banner_webcam.png" height="315" width="430" alt=""></a></p>',
            '</div>',
        '</tpl>',
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
                            '<h5><span class="projectNameCls"><a href="../index.htm?ProjectUID={ProjectUID}" title="Enter project">{projectTitle}</a></span> <!--<span class="webcamsCountClass">({[values.webcams.length]})</span>--></h5>',
                        '</div>',
                        '<span class="theFirstDescriptionFooter">',
                                '<span class="projectAddressCls">{projectAddress}</span>',
                        '</span>',
                        '<div class="webcamsItemWrapper">',
                        '<tpl for="webcams">',
                            '<div class="item">',
                                '<div class="itemInner">',
                                    '<div class="webcamImageWrap">',
                                        '<a href="photoviewer.htm&ProjectUID={parent.ProjectUID}&PhotoGroupType=W&WebcamUID={WebcamUID}"><img src="{imageURL}" alt="" /></a>',
                                    '</div>',
                                    '<span class="webcamTitle">',
                                        '<a href="photoviewer.htm&ProjectUID={parent.ProjectUID}&PhotoGroupType=W&WebcamUID={WebcamUID}">{webcamTitle}</a>',
                                    '</span>',
                                '</div>',
                            '</div>',
                        '</tpl>',
                        '</div>',
                        '<div class="clear"></div>',
                    '</div> <!-- /.projectEntryRightWrapper -->',
                '</div> <!-- /.projectEntryRight -->',
            '</div> <!-- /.projectEntryCls -->',
        '</tpl>'
    ],
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
            MemberDashboardPreference: 'webcams'
        };
        me.pdSelector = Ext.create('mds.view.clientDashboard.PreferedDashboardSelector', {model: model});
        me.callParent(arguments);
    },
    itemSelector: ''
});