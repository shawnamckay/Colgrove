Ext.define('mds.view.clientFileManager.ClientFileManagerDisp', {
    extend: 'Ext.container.Container',
    alias: 'widget.clientFileManagerDisp',
    id: 'clientFileManagerDisp',
    style: 'background-color: white',
    layout: 'border',
    flex: 1,
    bodyBorder: false,
    defaults: {
        collapsible: false,
        split: true,
        bodyPadding: 0
    },
    items: [
        {
            xtype: 'toolbar',
            split: false,
            region: 'north',
            items: [
                {
                    text: 'Up',
                    id: 'folderUpButton',
                    icon: 'mds/module/clientFileManager/image/icons/folder_up.png'
            	},
            	{ 	
            	    xtype: 'tbspacer', 
            	    width: 170 
        	    },
           	 	'-',
                {
                    text: 'Create folder',
                    id: 'createFolderButton',
                    icon: 'mds/module/clientFileManager/image/icons/folder_new.png',
                    hidden: true
                },
            	{
                    text: 'Upload files',
                    id: 'uploadButton',
                    icon: 'mds/module/clientFileManager/image/icons/file_upload.png',
                    hidden: true
                }
            ]
        },
        {
            xtype: 'panel',
            region: 'west',
            width: 225,
            height: '100%',
            layout: 'fit',
            style: 'background-color: #DBDBE4',
            items: {
            	xtype: 'fmTree'
        	}
        },
        {
            xtype: 'panel',
            style: 'background-color: white',
            flex: 1,
            region: 'center',
            layout: 'fit',
            items: [
            	{
            	    xtype: 'fmList'
            	},
            	{
            	    xtype: 'fmDetail',
            	    hidden: true
            	}
        	]
        }
    ]

});


