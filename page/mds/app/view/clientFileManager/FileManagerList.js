Ext.define('mds.view.clientFileManager.FileManagerList', {
    extend: 'Ext.container.Container',
    alias: 'widget.fmList',
    id: 'fmList',
    style: 'background-color: white',
    height: '100%',
    layout: {
        type: 'vbox',
        align: 'stretch',
        pack: 'start'
    },
    width: '100%',
    items: [
        /*{
            xtype: 'fmToolbar'
        },*/
        {
            xtype: 'fmProjectFileGrid',
            flex: 1,
            layout: 'fit',
            border: '0 1 1 1',
            overflowY: 'auto',
            style: {
                backgroundColor: 'white'
                //borderColor: 'gray',
                //borderStyle: 'solid'
            }
        }
    ]
});
