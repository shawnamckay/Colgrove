Ext.define('mds.view.clientFileManager.FileDetailToolbar', {
    extend: 'Ext.container.Container',
    alias: 'widget.fmDetailToolbar',
    id: 'fmDetailToolbar',
    style: 'background-color: #DBDBE4',
    layout: {
        type: 'hbox',
        align: 'left'
    },
    width: '100%',
    height: 50,
    items: [
        {
            xtype: 'container',
            layout: {
                type: 'hbox',
                align: 'left'
            },
            style: {
                borderColor: 'grey',
                borderStyle: 'solid',
                backgroundColor: 'white'
            },
            width: 200,
            height: 50,
            border: '1 1 0 1',
            items: {
                xtype: 'button',
                text: 'Back up (folder)',
                id: 'detailBack',
                margin: '15 0 0 15'
        	}
        },
        {
            xtype: 'container',
            flex: 1,
            layout: {
                type: 'hbox',
                align: 'left',
                pack: 'start'
            },
            border: '0 0 1 0',
            style: {
                borderColor: 'gray',
                borderStyle: 'solid'
            },
            height: 50,
            items: [


            ]
        }
    ]
});
