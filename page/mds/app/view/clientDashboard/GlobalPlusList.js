/**
 * Global means "of my account", so that "of all projects in my account".
 */
Ext.define('mds.view.clientDashboard.GlobalPlusList', {
    extend: 'mds.view.clientDashboard.SidebarProjectList',
    alias: 'widget.globalPlusList',
    id: 'globalPlusList',
    store: 'clientDashboard.GlobalPluses'
});