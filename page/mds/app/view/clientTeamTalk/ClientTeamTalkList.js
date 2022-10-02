/**
 * 
 */
Ext.define('mds.view.clientTeamTalk.ClientTeamTalkList', {
    extend: 'Ext.container.Container',
    alias: 'widget.clientTeamTalkList',
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    items: [
        {
            xtype: 'label',
            text: 'TeamTalk List'
        }
    ],
    initComponent: function() {
        var me = this;
        me.callParent(arguments);
    }
});
