Ext.define("mds.view.clientPhotoViewer.annotations.widget.imageCombo", {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.imageCombo',
    constructor:function(config){
        config.store=Ext.create("Ext.data.Store", {
        	fields: ['src', 'value'],
        	idProperty: 'value',
        	data: []
        });
        var imageCombo=this;
        for (var i=0; i<config.data.length; i++){
        	config.store.add(config.data[i]);
        }
        this.callParent(arguments);
    },
    queryMode: 'local',
    valueField: 'value',
    autoSelect: true,
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
            '<img src="{src}"/><div style="display:none">{value}</div>',
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
    getRawValue: function(){
        if (!this.inputEl || !this.inputEl.dom || !this.inputEl.dom.lastChild)
            return "";
        return this.inputEl.dom.lastChild.innerHTML;
    },
    listConfig:{
        itemTpl: '<img src="{src}"/>'
    },
    listeners:{
    	afterrender:function(imageCombo){
    		if (imageCombo.store.count() && (typeof(imageCombo.defaultValue)!=="undefined")){
    			imageCombo.select(imageCombo.defaultValue);
    	    }
        }
    }
});
