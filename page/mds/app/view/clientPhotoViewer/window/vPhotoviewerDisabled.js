Ext.define('mds.view.clientPhotoViewer.window.vPhotoviewerDisabled',{
    extend: 'Ext.window.Window',
    xtype: 'windowPhotoviewerDisabled',
    id: 'windowPhotoviewerDisabled',
    layout: {type:'vbox',align:'stretch'},
    title: 'Error',
    modal: true,
    disabled:true,
    overflowY:'auto',
    width: 300,
    height: 100,
    closable:false,
    items:[
        {
            xtype: 'container'
            ,html: 'Message Text Goes Here!'
            ,width: 250
            ,id:'photoviewerMessages'
        }
    ]    
    ,bbar: [
        '->',
        { 
            xtype: 'button'
            ,text: 'Go to Dashboard' 
            ,id:'bbarPhotoviewerDisabled'
            ,disabled:false
        }
    ]
});