/**
 * 
 */
Ext.define('mds.view.clientNavigation.NavigationBar4Dashboard', {
    extend: 'mds.view.clientNavigation.AbstractNavigationBar',
    alias: 'widget.navigationBar',
    items: [],
    initComponent: function() {
        var me = this;
        me.createDashboardNavigationMenu();
        me.callParent(arguments);
    },
    /**
     * @private
     */
    createDashboardNavigationMenu: function() {
        var me = this;
        me.globalfeedButton = me.createDashboardButton('Activity', 'globalfeed');
        me.globalmapviewerButton = me.createDashboardButton('Map', 'globalmapviewer');
        me.favouritesButton = me.createDashboardButton('Favorites', 'favourites');
        me.webcamsButton = me.createDashboardButton('Webcams', 'webcams');
        me.videosButton = me.createDashboardButton('Videos', 'videos');

        me.endcapButton = Ext.create('Ext.button.Button', {
            xtype: 'button',
            id: 'projectNavigationBtnEndcap',
            width: 3
        });
        me.items = [
            me.globalfeedButton,
            me.globalmapviewerButton,
            me.favouritesButton,
            me.webcamsButton,
            me.videosButton,
            me.endcapButton
        ];
        me.setButtonByAlias('globalfeed', me.globalfeedButton);
        me.setButtonByAlias('mapviewer', me.globalmapviewerButton);
        me.setButtonByAlias('favourites', me.favouritesButton);
        me.setButtonByAlias('webcams', me.webcamsButton);
        me.setButtonByAlias('videos', me.videosButton);
        me.setButtonByAlias('endcap', me.endcapButton);
    },
    listeners: {
        buttonclick: {
            fn: function(button, arg) {
               var me = this;
               me.onButtonclick(button, arg);
            }
        }
    },
    onButtonclick: function(button, arg) { 
        var me = this;
        for (var i = 0; i < me.items.length; i++) {
            me.items.items[i].removeCls('projectNavigationMainButtonCurrentCls');
        }
        if (button && button != null) {
            button.addCls('projectNavigationMainButtonCurrentCls');
        }
        me.fireEvent('barNaviButtonClick', arg);
    },
    selectGlobalfeedButton: function(arg) {
        var me = this;
        me.globalfeedButton.fireButtonclick(me.globalfeedButton);
    },
    selectMapViewerButton: function(arg) {
        var me = this;
        me.globalmapviewerButton.fireButtonclick(me.globalmapviewerButton);
    },
    selectGlobalFavouritesButton: function(arg) {
        var me = this;
        me.favouritesButton.fireButtonclick(me.favouritesButton);
    },
    selectGlobalWebcamsButton: function(arg) {
        var me = this;
        me.webcamsButton.fireButtonclick(me.webcamsButton);
    },
    selectGlobalWebcamsButton: function(arg) {
        var me = this;
        me.videosButton.fireButtonclick(me.videosButton);
    },
    selectNone: function(arg) {
        var me = this;
        me.enableBubble('buttonclick');
        me.fireEvent('buttonclick', null, '');
    },
    /**
     * @private
     */
    createDashboardButton: function(buttonText, eventName) {
        var me = this;
        return Ext.create('Ext.button.Button', {
            text: buttonText,
            cls: 'projectNavigationMainButtonCls',
            handler: function(button, e) {
                var me = this;
                me.fireButtonclick(button);
            },
            fireButtonclick: function(button) {
                button.enableBubble('buttonclick');
                button.fireEvent('buttonclick', button, eventName);
            },
            height: me.buttonHeight,
            hidden: (buttonText=='Videos'?false:true)
        });
    }
});