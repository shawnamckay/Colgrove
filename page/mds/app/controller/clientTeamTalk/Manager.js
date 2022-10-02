/**
 * 
 */
Ext.define('mds.controller.clientTeamTalk.Manager', {
    extend: 'Ext.app.Controller',
    stores: [
        'clientTeamTalk.GetTeamTalk'
    ],
    views: [
        'clientTeamTalk.ClientTeamTalk',
        'clientTeamTalk.ClientTeamTalkList',
        'clientTeamTalk.ClientTeamTalkView'
    ],
    init: function() {
        var me = this;
        var store = me.getStore('clientTeamTalk.GetTeamTalk');
        store.load({});
        me.callParent(arguments);
    }
});
