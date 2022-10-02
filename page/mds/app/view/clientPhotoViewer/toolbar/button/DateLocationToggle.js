
Ext.define('mds.view.clientPhotoViewer.toolbar.button.DateLocationToggle', {
    extend: 'Ext.container.ButtonGroup',
    alias: 'widget.dateLocationToggle',

    baseCls: 'x-sbtn',

    buttonCls: 'x-sbtn',

    unstyled: true,

    frame: false,

    initComponent: function() {
        var me = this;
        
        me.callParent(arguments);
        
        //me.activeItem = (me.activeItem + 1 > me.items.length) ? 0 : me.activeItem;
		me.activeItem = 0;
        
        me.items.each(function(el, c) {
            if (me.items.length === 1) {
                el.addCls(me.buttonCls +'-single');
            } else {
                var cls = c == 0 ? me.buttonCls +'-first ' + me.buttonCls + '-selected' : (c == me.items.length - 1 ? me.buttonCls +'-last' : me.buttonCls +'-item');
                el.addCls(cls);
            }
        });
    },
	
    onBeforeAdd: function(component)
    {
    }
});