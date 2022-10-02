Ext.define('mds.view.clientFileManager.FileManagerDetail', {
    extend: 'Ext.container.Container',
    alias: 'widget.fmDetail',
    id: 'fmDetail',
    style: 'background-color: white',
    height: '100%',
    layout: {
        type: 'vbox',
        align: 'stretch',
        pack: 'start'
    },
    width: '100%',
    items: [
        {
            xtype: 'fmDetailToolbar'
        },
        {
            xtype: 'fmFileDetailList',
            flex: 1,
            layout: 'fit',
            border: '0 1 1 1',
            overflowY: 'auto',
            style: {
                backgroundColor: 'white',
                borderColor: 'gray',
                borderStyle: 'solid'
            }
        }
    ]
});
