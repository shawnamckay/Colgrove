/**
 * 
 */
Ext.define('mds.view.clientTeamTalk.ClientTeamTalkView', {
    extend: 'Ext.container.Container',
    alias: 'widget.clientTeamTalkView',
    hidden: false,
    id: 'clientTeamTalkView',
    flex: 11,
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    overflowY: 'scroll',
    overflowX: 'hidden',
    items: [
        {
            xtype: 'label',
            text: 'TeamTalk View'
        }
    ],
    initComponent: function() {
        var me = this;
        me.callParent(arguments);
    }
});