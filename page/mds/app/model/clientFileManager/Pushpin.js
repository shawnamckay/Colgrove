
Ext.define('mds.model.clientFileManager.Pushpin', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'PushpinUID',  type: 'string'},
        {name: 'FloorplanUID',  type: 'string'},
        {name: 'FloorplanTitle',  type: 'string'},
        {name: 'PushpinLabel',  type: 'string'}
    ],
    idProperty: 'PushpinUID'
});
