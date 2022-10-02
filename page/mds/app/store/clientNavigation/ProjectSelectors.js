Ext.define('mds.store.clientNavigation.ProjectSelectors', {
    extend: 'Ext.data.Store',
    model: 'mds.model.clientNavigation.ProjectSelector',
    storeId: 'projects',
    proxy: {
        type: 'jsonp',
        limitParam: undefined,
        pageParam: undefined,
        startParam: undefined,
        url: 'index.cfm?fuseaction=aClientNavigation.ProjectNavigation',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    autoLoad: true
});