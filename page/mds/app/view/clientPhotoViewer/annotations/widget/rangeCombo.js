Ext.define("mds.view.clientPhotoViewer.annotations.widget.rangeCombo", {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.rangeCombo',
    constructor:function(config){
        config.store=Ext.create("Ext.data.Store", {
        	fields: ['value', 'display'],
        	idProperty: 'value',
        	data: []
        });
        var imageCombo=this;
        for (var i=config.min; i<=config.max; i++){
        	config.store.add({value: i, display:i+config.unit});
        }
        this.callParent(arguments);
    },
    queryMode: 'local',
    valueField: 'value',
    displayField: 'display',
    editable: false,
    autoSelect: true
});
