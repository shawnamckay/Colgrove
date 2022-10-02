/**
 */
Ext.define('mds.view.clientNavigation.NavigationBarMegamenu', {
    extend: 'Ext.menu.Menu',
    id: 'floorplanMegamenu',
    myStore: 'clientNavigation.ProjectFloorplans',
    constructor: function(){
        var me=this;
        me.callParent(arguments);

        me.myStore=Ext.data.StoreManager.lookup(me.myStore||'ext-empty-store'); // cf. Ext.view.AbstractView

        if (me.myStore.count()) me.items.items[0].update(me.myStore.getRange());
        else{
            me.myStore.on('load', function(store, records, successful, eOpts){
                me.items.items[0].update(records);
            });
        }
    },
    plain: true,
    resetMax: function(){
        var me=this;
        me.maxHeight=window.innerHeight-140;
        me.maxWidth=window.innerWidth-260;
    },
    maxHeight: 0,
    maxWidth: 0,
    layout: {
        type: 'vbox',
        align: 'stretch',
        reserveScrollbar: true,
        manageOverflow: 2
    },
    hideCollapseTool: true,
    overflowY: 'auto',
    items: {
        xtype: 'container',
        cls: 'floorplanMegamenuWrap',
        tpl: new Ext.XTemplate('<tpl for=".">', '<tpl for="raw">', '<div class="dropMenuColumnWrap">', '<div class="dropMenuColumn">', '<p class="dropMenuColumnTitle">{text}</p>', '<ul class="dropMenuColumnList">', '<tpl for="list">', '<li><a href="{[this.fixURL(values)]}" target="_top">{text}</a></li>', '</tpl>', '</ul>', '</div>', '</div>', '</tpl>', '</tpl>', {
            fixURL: function(values){
                var qs=Ext.Object.fromQueryString(values.url.split("?")[1]);
                return "clientFloorplanViewer.htm?ProjectUID="+qs.ProjectUID+"&FloorplanUID="+qs.FloorplanUID;
            }
        })
    }
});