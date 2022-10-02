/**
 */
Ext.define('mds.view.clientNavigation.ProjectBreadcrumb', {
    extend: 'Ext.view.View',
    alias: 'widget.projectBreadcrumb',
    id: 'navigationBreadcrumb',
    store: 'clientNavigation.ProjectBreadcrumbs',
    tpl: new Ext.XTemplate(
        '<tpl for=".">',
            '<tpl if="xindex !== 1">',
                '<span class="arrow">&nbsp;&gt;&nbsp;</span>',
            '</tpl>',
            '<tpl if="xindex === xcount">',
                '<img src="{homepageIcon32}" style="vertical-align:middle" width="32" height="32" border="1"/>&nbsp;',
                '{display}',
            '<tpl else>',
                '<a href="{url}" target="_top">{display}</a>',
            '</tpl>',
        '</tpl>'
    ),
    itemSelector: '',
    initComponent: function() {
        var me = this;
        me.callParent(arguments);
    }
});