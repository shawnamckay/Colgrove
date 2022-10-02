/**
 * 
 */
Ext.define('mds.view.clientTeamTalk.ClientTeamTalk', {
    extend: 'Ext.container.Container',
    alias: 'widget.clientTeamTalk',
    hidden: false,
    id: 'clientTeamTalk',
    flex: 11,
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    items: [
        {
            xtype: 'clientTeamTalkList',
            width: 225
        },
        {
            xtype: 'clientTeamTalkView'
        }
    ],
    initComponent: function() {
        var me = this;
        me.callParent(arguments);
    }
});