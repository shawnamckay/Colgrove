/**
 * JSON: (record.data)
 *   ProjectUID
 *   projectTitle
 *   image16URL
 *   image24URL
 *   image32URL
 *   image64URL
 *   shoots
 *     ProjectShootTypeDisplayLabel
 *     ShootDate
 *     ShootUID
 *   
 */
Ext.define('mds.view.clientDashboard.MapViewerClusterBubble', {
    extend: 'Ext.XTemplate',
    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        cfg = {}; // I decided no constructor arguments allowed!
        me.callParent([Ext.apply(me.myHtml, cfg)]);
    },
    // @private
    myHtml: [
        '<table width="260" border="0" cellspacing="0" cellpadding="0">',
        '<tpl for=".">',
            '<tr>',
            '<td><a class="bubble_projectIcon" style="height:32px;width:32px;" href="index.cfm?fuseaction=aClientNavigation.ProjectGateway&ProjectUID={record.data.ProjectUID}">',
                '<img src="{record.data.image32URL}" class="" alt="{record.data.projectTitle}"/>',
            '</a></td>',
            '<td>&nbsp;</td>',
            '<td class="bubble_title"  style="vertical-align:middle;"><a href="index.cfm?fuseaction=aClientNavigation.ProjectGateway&ProjectUID={record.data.ProjectUID}">{record.data.projectTitle}</a></td>',
            '</tr>',
        '</tpl>',
        '</table>'
    ]
});