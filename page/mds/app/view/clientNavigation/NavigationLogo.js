/**
*/
Ext.define('mds.view.clientNavigation.NavigationLogo', {
    extend: 'Ext.container.Container',
    alias: 'widget.navigationLogo',
    hidden: true,
    cls: 'navigationLogo',
    data: [
        {src: ''}
    ],
    tpl: new Ext.XTemplate(
        '<tpl for=".">',
            '<img src="{src}" alt="">',
        '</tpl>'
    ),
    set: function(src, height, width) {
        var me = this;
        if (!src || src == '' || !height || height == 0 || !width || width == 0) {
            return;
        }
        me.setVisible(true);
        me.update([{src: src}]);
        me.setWidth(width * 50 / height); // height:50px
    }
});
