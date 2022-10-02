/**
 * JSON:
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
Ext.define('mds.view.clientDashboard.MapViewerBubble', {
    extend: 'Ext.XTemplate',
    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        cfg = {}; // I decided no constructor arguments allowed!
        me.callParent([Ext.apply(me.myHtml, cfg)]);
    },
    // @private
    myHtml: [
        '<p class="bubble_title"><a href="index.cfm?fuseaction=aClientNavigation.ProjectGateway&ProjectUID={ProjectUID}">{projectTitle}</a></p>',
        '<a class="bubble_projectIcon" href="index.cfm?fuseaction=aClientNavigation.ProjectGateway&ProjectUID={ProjectUID}">',
            '<img src="{image64URL}" class="bubble_proj_img" alt="{projectTitle}"/>',
        '</a>',
        '<table width="260" border="0" cellspacing="0" cellpadding="0">',
        '<tr class="header"><td width="80">Date</td><td>Shoot Details</td></tr>',
        '<tpl for="shoots">',
            '<tr><td>{ShootDate:this.dateDisplay()}</td>',
            '<td><a href="index.cfm?fuseaction=aClientPhotoViewer.view&ProjectUID={parent.ProjectUID}&ShootUID={ShootUID}&PhotoGroupType=S" target="_self" >{ProjectShootTypeDisplayLabel}</a></td></tr>',
        '</tpl>',
        '</table>',
        {
            // cf. Ext.Date
            // cf. Ext.util.Format.date() calls the Javascript Date object's parse() method to convert to Date.
            dateDisplay: function(value) {
                return Ext.util.Format.date(value, 'M j, Y');
            }
        }
    ]
});