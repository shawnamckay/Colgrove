Ext.define('mds.view.clientPhotoList.widget.DateSelector', {
    id: 'photoGroupDateSelector',
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.photoGroupDateSelector',
    fieldLabel: 'Date Taken',
    queryMode:'local',
    labelSeparator:'',
    labelAlign: 'top',
    labelCls: 'sidebarLabel',
    store: 'clientPhotoList.DateRanges',
    nDefaultChoices: 7,
    displayField: 'Label',
    valueField: 'Label',
    width: 205,
    margin: 7.5,
    fieldStyle: 'height:35px;',
    fieldSubTpl: Ext.create('Ext.XTemplate',
      '<div class="{hiddenDataCls}" role="presentation"></div>',
      '<div id="{id}" type="{type}" ',
        'class="{fieldCls} {typeCls}" autocomplete="off"',
        '<tpl if="fieldStyle"> style="{fieldStyle}"</tpl>',
      '></div>',
      '</div>'
    ),
    displayTpl: Ext.create('Ext.XTemplate',
      '<tpl for=".">',
          '<div class="dateSelectorDescription">{Label}</div><div class="dateSelectorDate">{StartDate:date("M j, Y")} - {EndDate:date("M j, Y")}</div>',
      '</tpl>'
    ),
    setRawValue: function(value) {
      var me = this;
      value = Ext.value(value, '');
      me.rawValue = value;
  
      if (me.inputEl) {
          me.inputEl.dom.innerHTML = value;
      }
      return value;
  },
  getRawValue: function(arguments){
      if (!this.inputEl || !this.inputEl.dom || !this.inputEl.dom.firstChild)
          return "";
      return this.inputEl.dom.firstChild.innerHTML;
  },
  setValueByDates:function(startDate, endDate){
	  var count=this.store.getCount();
	  
      for (var i=count-1; i>=0; i--){
      	var dateRecord=this.store.getAt(i);
      	if (Ext.Date.format(dateRecord.get("StartDate"), "Y-m-d")==Ext.Date.format(startDate, "Y-m-d") &&
      		Ext.Date.format(dateRecord.get("EndDate"), "Y-m-d")==Ext.Date.format(endDate, "Y-m-d")){
      		this.setValue(dateRecord.get("Label"));
      		return;
      	}
      }
      this.addCustomValue(startDate, endDate);
  },
  addCustomValue:function(startDate, endDate){
	  var label="Custom: "+Ext.Date.format(startDate, "d/m/Y")+"-"+Ext.Date.format(endDate, "d/m/Y");
      var newDateChoice=Ext.create("mds.model.clientPhotoList.DateRange", {
          StartDate: startDate,
       	  EndDate: endDate,
          Label: label
      });
      this.store.add(newDateChoice);
      this.setValue(label);
  },
  setValue:function(value){
	  if (!this.isVisible()){
		  this.addListener("afterrender", function(){this.setValue(value);}, this, {single:true});
	  }else{
		  this.callParent(arguments);
	  }  
  }
});