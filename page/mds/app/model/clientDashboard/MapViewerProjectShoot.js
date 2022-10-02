/**
 * MODEL
 */
Ext.define('mds.model.clientDashboard.MapViewerProjectShoot', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name:'ProjectShootTypeDisplayLabel',
            type:'string'
        },
        {
            name:'ShootDate',
            type:'string'
        },
        {
            name:'ShootUID',
            type:'string'
        }
    ]
});
