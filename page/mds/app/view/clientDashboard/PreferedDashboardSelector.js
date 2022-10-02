/**
    CONST: {
        GLOBALWEBCAMS: 'webcams',
        GLOBALFEED: 'globalfeed',
        GLOBALFAVOURITES: 'favourites',
        GLOBALMAPVIEWER: 'mapviewer'
    },
 */
Ext.define('mds.view.clientDashboard.PreferedDashboardSelector', {
    // extend: 'Ext.Base',
    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.model = cfg.model;
        me.preference = {};
        me.template = new Ext.Template(me.myHtml);
        me.callParent();
    },
    append: function(view) {
        var me = this;
        var myModel = me.model;
        var myPreference = me.preference;
        me.myNode = me.template.append(Ext.getDom(view.id));
    },
    setPreference: function(model) {
        var me = this;
        me.preference = model;
        var node = new Ext.dom.Element(me.myNode);
        if (me.model.MemberDashboardPreference == me.preference.MemberDashboardPreference) {
            node.removeCls('visible');
        } else {
            node.addCls('visible');
        }
    }
});