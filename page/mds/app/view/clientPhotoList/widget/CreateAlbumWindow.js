Ext.define('mds.view.clientPhotoList.widget.CreateAlbumWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.createAlbumWindow',
    id: 'createAlbumWindow',
    title: 'Album Settings',
    layout: {
      type: 'vbox',
      align: 'stretch'
    },
    modal: true,
    closeAction: "destroy",
    bodyPadding: 5,
    defaults:{
      labelWidth: 110
    },
    items:[
      {
        id: 'newAlbumName',
        xtype: 'textfield',
        fieldLabel: 'Album Name',
        allowBlank: false,
        maxLength: 255,
        enforceMaxLength:true,
        width: 380
      },
      {
        id: 'newAlbumDescription',
        xtype: 'textareafield',
        fieldLabel: 'Album Description',
        maxLength: 255,
        enforceMaxLength:true,
        width: 380
      },
      {
          xtype: 'container',
    	  layout: 'hbox',
    	  margin: '10 0 10 0',
    	  items:[
    	      {
    	    	  xtype: 'component',
    	    	  html: 'Sharing Settings:',
    	    	  margin: '2 20 0 0'
    	      }
    	  ]
      },
      {
    	  xtype: 'container',
    	  layout:{
    	  	type: 'hbox',
    	  	align: 'stretch'
    	  },
    	  margin: '5 0 0 0',
    	  items:[
    	      {
                  id: 'deleteAlbumAction',
                  xtype: 'button',
                  text: 'Delete Album',
                  icon: 'mds/image/icon/delete.png',
                  hidden: true
              },
              { xtype: 'tbfill' },
    	      {
                  id: 'saveNewAlbumAction',
                  xtype: 'button',
                  text: 'Save',
                  icon: 'mds/image/icon/disk_blue.png'
              }
    	  ]	  
      }
    ]
});