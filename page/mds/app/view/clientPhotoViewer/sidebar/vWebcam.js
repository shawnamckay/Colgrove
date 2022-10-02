Ext.define('mds.view.clientPhotoViewer.sidebar.vWebcam', {
    extend: 'Ext.container.Container',
    xtype: 'pvWebcam',
    id: 'pvWebcam',
    cls: 'webcamSpecific',
    hidden: true,
    layout: {
        type: 'hbox'
    },
    width: '100%',
    height: '100%',
    items: [{
        xtype: 'container',
        layout: {
            type: 'vbox',
            align: 'stretchmax'
        },
        margin: 10,
        items: [{
            xtype: 'datepicker',
            id: 'webcamCalendar',
            showToday: false
        }, {
            xtype: 'combo',
            id: 'webcamTime',
            store: 'clientPhotoViewer.WebcamPhotos',
            queryMode: 'local',
            editable: false,
            valueField: 'dateTaken',
            margin: "10 0 0 0",
            width: 200,
            tpl: Ext.create('Ext.XTemplate', '<tpl for=".">', '<div class="x-boundlist-item">{dateTaken:date("g:i A")}</div>', '</tpl>'),
            displayTpl: Ext.create('Ext.XTemplate', '<tpl for=".">', '{dateTaken:date("g:i A")}', '</tpl>')
        }]
    },{
        xtype: 'weather',
        flex: 1,
        margin: "10 10 0 0"
    }]

});