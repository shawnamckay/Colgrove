Ext.define('mds.store.clientNavigation.ProjectBreadcrumbs', {
    extend: 'Ext.data.Store',
    fields: [
        { name:'display', type:'string' },
        { name:'homepageIcon32', type:'string' },
        { name:'url', type:'string', convert:function(value, record){
            if (!value) return value;
            var query=Ext.Object.fromQueryString(value.split("?")[1]);
            if(null == query.FloorplanUID){             
                return "clientFloorplanViewer.htm?ProjectUID="+query.ProjectUID
            }else{              
                return "clientFloorplanViewer.htm?ProjectUID="+query.ProjectUID+"&FloorplanUID="+query.FloorplanUID;
            }
        } }
    ],
    proxy: {
        type: 'jsonp',
        url: 'index.cfm?fuseaction=aClientNavigation.getProjectBreadcrumb',
        limitParam: undefined,
        pageParam: undefined,
        startParam: undefined,
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    listeners: {
        // beforeload(Ext.data.Store store, Ext.data.Operation operation, Object eOpts)
        beforeload: function() {
            var me = this;
            var search = (Ext.Object.fromQueryString(document.location.search));
            var searchP = search.ProjectUID ? search.ProjectUID : '00000000-0000-0000-0000-000000000000';
            var ajaxProxy = me.getProxy();
            ajaxProxy.setExtraParam('ProjectUID', searchP);
        }
    },
    autoLoad: false
});