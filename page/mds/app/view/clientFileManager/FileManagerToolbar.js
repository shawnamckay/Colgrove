Ext.define('mds.view.clientFileManager.FileManagerToolbar', {
    extend: 'Ext.container.Container',
    alias: 'widget.fmToolbar',
    id: 'fmToolbar',
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
            width: 250,
            height: 50,
            border: '1 1 0 1',
            style: {
                borderColor: 'grey',
                borderStyle: 'solid',
                backgroundColor: 'white'
            },
            items: [
                {
                    xtype: 'container',
                    margin: '15 15 0 15',
                    html: 'parent folder name'
                },
                {
                    xtype: 'button',
                    text: 'Back up (folder)',
                    id: 'folderUpButton',
                    margin: '15 10 0 0'
                } 
            ]
        },
        {
            xtype: 'container',
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
            width: 500,
            items: [
                /*{
                    xtype: 'combobox',
                    width: 180,
                    margin: '15 15 0 15',
                    editable: false,
                    data: {label: 'test', label: 'test2'}
                },
                {
                    xtype: 'textfield',
                    label: 'Search',
                    width: 180,
                    margin: '15 15 0 15'
                },*/
                {
                    xtype: 'button',
                    text: 'Upload',
                    id: 'uploadButton',
                    margin: '15 10 0 15'
                },
                {
                    xtype: 'button',
                    text: 'Create Folder',
                    id: 'createFolderButton',
                    margin: '15 10 0 0'
                }
            ]
        },  
        {
            xtype: 'container',
            layout: {
                type: 'hbox',
                align: 'right',
                pack: 'end'
            },
            border: '0 0 1 0',
            style: {
                borderColor: 'gray',
                borderStyle: 'solid'
            },
            height: 50,
            flex: 2,
            items: [
                
                {
                    xtype: 'button',
                    text: 'Download',
                    margin: '15 10 0 0'
                },
                {
                    xtype: 'button',
                    text: 'Delete',
                    id: 'deleteFilesButton',
                    margin: '15 10 0 0'
                }
            ]
        }
    ]
});
