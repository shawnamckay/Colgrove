/**
 * 
 */
Ext.define('mds.view.clientNavigation.AbstractNavigationBar', {
    extend: 'Ext.toolbar.Toolbar',
//    alias: 'widget.navigationBar', // it does not work
    id: 'projectNavigation', // common 'id' for css
    height: 37,
    buttonHeight: 37,
    aliasButtons: [],
    getButtonByAlias: function(alias) {
        var me = this;
        return me.aliasButtons[alias];
    },
    setButtonByAlias: function(alias, button) {
        var me = this;
        me.aliasButtons[alias] = button;
    }
});