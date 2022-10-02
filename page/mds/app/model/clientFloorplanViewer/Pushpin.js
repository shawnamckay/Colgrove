
Ext.define('mds.model.clientFloorplanViewer.Pushpin', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'PushpinUID',  type: 'string'},
        {name: 'PushpinLabel',  type: 'string'},
        {name: 'PushpinType',  type: 'number'},
        {name: 'PushpinCreationDate',  type: 'date'},
        {name: 'PushpinXCoordinate',  type: 'number'},
        {name: 'PushpinYCoordinate',  type: 'number'},
        {name: 'PushpinSymbol',  type: 'string'},
        {name: 'ShareTypeID',  type: 'number'},
        {name: 'MemberList',  type: 'string'}
    ],
    idProperty: 'PushpinUID'
});
