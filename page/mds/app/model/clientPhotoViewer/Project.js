Ext.define('mds.model.clientPhotoViewer.Project', {
    extend: 'Ext.data.Model'
    ,fields: [
        {name: 'ProjectUID',        type: 'string'}
        ,{name: 'projectTitle',     type: 'string'}
        ,{name: 'projectAddress',   type: 'string'}
        ,{name: 'projectImg',       type: 'string'}
    ]
});