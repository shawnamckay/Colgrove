
Ext.define('mds.view.clientFileManager.EditFileWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.editFileWindow',
    title: 'File Details',
    modal: true,
    resizable: true,
    height: 300,
    width: 550,

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            border: false, 
         layout: { type: 'vbox', align: 'stretch'},
            items: [{
                xtype: 'container',
                width: '100%',
                flex: 1,
                style: {
                 backgroundColor: 'white',
                 paddingTop: '10px',
                 paddingLeft: '10px',
                 paddingRight: '10px',
                 paddingBottom: '5px'
             },
                layout: {
                    type: 'hbox', align: 'middel'
                },
                items: [{
                    xtype: 'image',
                    id: 'editFileSymbol',
                    width: 40,
                    height: 40,
                    autoEl: 'div'
                },
                {
                    xtype: 'container',
                    flex: 1,
                    id: 'editFileDetails',
                    tpl: '<tpl>' +
                    '<p><a href="{1}" target="_blank">{0}</a> &nbsp;&nbsp;{6:fileSize}</p>' +
                    '<p>Created by: {2} on {3:date("F d, Y - g:i a")}</p>' +
                    '<p>Last edited by: {4} on {5:date("F d, Y - g:i a")}</p>' +
                '</tpl>'
                }]
            },
            {
             xtype: 'tabpanel',
             id: 'fileMetaPanel',
             layout: 'fit',
             flex: 2,
             hidden: true,
                style: {
                    backgroundColor: 'white'
                },   
             //layout: { type: 'vbox', align: 'stretch'},
             items: [
                 {
                  xtype: 'gridpanel',
                  title: 'File versions',
                  id: 'versionsGrid',
                  store: 'clientFileManager.Versions',
                  columns: [{
                      text: 'File name',
                            dataIndex: 'DocumentFilename',
                            flex: 2
                  },{
                            xtype: "datecolumn",
                      text: 'Date',
                            dataIndex: 'DocumentLastEditedDate',
                            format: "F d, Y - g:i a", 
                            flex: 1
                  },{
                      text: 'Actions',
                         xtype: 'actioncolumn',
                         sortable: false,
                         hideable: false,
                         menuDisabled: true,
                      width: 50,
                      items: [
                          {
                              icon: 'mds/module/clientFileManager/image/icons/download.png',
                                 tooltip: 'Download this version',
                                    iconCls: 'mousepointer'
                          },
                          {
                              icon: 'mds/module/clientFileManager/image/icons/newrecurevent.png',
                              tooltip: 'Revert to this version',
                                    iconCls: 'mousepointer'
                          }
                      ]
                  }]
                 },
                 {
                     xtype: 'gridpanel',
                     title: 'Locations',
                     id: 'pushpinsGrid',
                     store: 'clientFileManager.Pushpins',
                        columns: [{
                            text: 'Floorplan name',
                            dataIndex: 'FloorplanTitle',
                            flex: 2
                        },{
                            text: 'Location name',
                            dataIndex: 'PushpinLabel',
                            flex: 1
                        }]
                 }
             ]
            
            }],
            
            
            buttons: [
               {
                    text: 'OK',
                    id: 'cancelEditFile'
                }
            ]
        });

        me.callParent(arguments);
    }

});


