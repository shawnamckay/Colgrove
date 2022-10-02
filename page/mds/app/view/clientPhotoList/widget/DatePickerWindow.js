Ext.define('mds.view.clientPhotoList.widget.DatePickerWindow', {
  extend: 'Ext.window.Window',
  id: 'datePickerWindow',
  title: 'Custom Date Range',
  modal: true,
  layout: 'vbox',
  closeAction: 'hide',
  config:{
    viewport:null,
    callback:null
  },
  items: [ 
    {
      id: 'startDatePicker',
      xtype: 'photoGroupDatePicker'
    },
    {
      id: 'endDatePicker',
      xtype: 'photoGroupDatePicker',
      isStartDate: false
    },
    {
      xtype: 'container',
      defaultType: 'button',
      width: 176,
      defaults:{
        margin: 3
      },
      layout: {
        type: 'hbox',
        pack: 'center'
      },
      items:[
        {
          id: 'dateRangeConfirm',
          text: 'OK'
        },
        {
          id: 'dateRangeCancel',
          text: 'Cancel',
          listeners:{
            click: function(){
              Ext.getCmp('datePickerWindow').hide();
            }
          }
        }
      ]
    } 
  ],
  listeners:{
    beforeshow:function(me){
      Ext.getCmp("startDatePicker").fireEvent("refresh", Ext.getCmp("startDatePicker"));
      Ext.getCmp("endDatePicker").fireEvent("refresh", Ext.getCmp("endDatePicker"));
    }
  }
});