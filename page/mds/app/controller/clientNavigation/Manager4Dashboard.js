/**
 * 
 */
Ext.define('mds.controller.clientNavigation.Manager4Dashboard', {
    extend: 'Ext.app.Controller',
    stores: [
        'clientNavigation.MemberDashboardPreference',
        'clientNavigation.NavigationPreference4Dashboard',
        'clientNavigation.ProjectBreadcrumbs',
        'clientNavigation.ProjectFloorplans'
    ],
    views: [
        'clientNavigation.ClientNavigator',
        'clientNavigation.GlobalHome',
        'clientNavigation.NavigationBar4Dashboard',
        'clientNavigation.NavigationLogo',
        'clientNavigation.ProjectAdminJump'
    ],
    refs: [
        {
            ref: 'navigationBar4Dashboard',
            selector: 'navigationBar'
        }
    ],
    init: function() {
        var me = this;
        // do not assign callbacks to the 'load' events; these stores mey get loaded from multiple places.
        me.getStore('clientNavigation.MemberDashboardPreference').load({
            callback: function(records, successful, eOpts) {
                if (records && records[0] && records[0].data) {
                    me.myPreferences = records[0].data;
                    me.selectAPreferedNavigationBarButton();
                }
            }
        });
        me.control({
            'clientNavigatior': {
                render: function() {
                    me.clientNavigatiorRendered = true;
                    me.selectAPreferedNavigationBarButton();
                }
            },
            'navigationBar': {
                render: function() {
                    var view = me.getNavigationBar4Dashboard();
                    var store = me.getStore('clientNavigation.NavigationPreference4Dashboard');
                    store.load({
                        callback: function(records, successful, eOpts) {
                            if (records) {
                                for (var i = 0; i < records.length ; i++) {
                                    var alias = records[i].data.alias;
                                    var visible = records[i].data.visible;
                                    var button = view.getButtonByAlias(alias);
                                    if (button) {
                                        button.setVisible(visible);
                                    }
                                }
                            }
                        }
                    });
                },
                barNaviButtonClick: function(menuType) {
                    me.fireEvent('naviButtonClick', menuType);
                }
            }
        });
        me.init2(arguments);
        me.callParent(arguments);
    },
    listeners: {
        naviButtonClick: function() {
            var me = this;
            var dashboardDisplayManager = mds.app.getController('clientDashboard.DisplayManager');
            me.addListener('naviButtonClick', dashboardDisplayManager.onMenuSelectionChange, dashboardDisplayManager);
        },
        mapviewerreday: function() {
            var me = this;
            me.mapRendered = true;
            if (me.mapRequested && me.mapRequested == true) {
                me.getNavigationBar4Dashboard().selectMapViewerButton();
            }
        }
    },
    /**
     * @ private
     */
    selectAPreferedNavigationBarButton: function() {
        var me = this;
        if (me.myPreferences && me.clientNavigatiorRendered && me.clientNavigatiorRendered == true) {
            var defalutButton = me.myPreferences.MemberDashboardPreference.toLowerCase();
            var view = me.getNavigationBar4Dashboard();
            view.selectNone();
            if ('globalfeed' === defalutButton) {
                view.selectGlobalfeedButton();
            } else if ('mapviewer' === defalutButton) {
                me.mapRequested = true;
                if (me.mapRendered && me.mapRendered == true) {
                    view.selectMapViewerButton();
                }
            } else if ('favourites' === defalutButton) {
                view.selectGlobalFavouritesButton();
            } else if ('webcams' === defalutButton) {
                view.selectGlobalWebcamsButton();
            } else if ('globalplus' === defalutButton) {
                view.selectGlobalPlusButton();
            } else {
                view.selectGlobalfeedButton();
            }
        }
    },
    init2: function() {
        var me = this;
        Ext.util.CSS.swapStyleSheet('clientNavigation.wrap', 'mds/module/clientNavigation/wrap.css');
        var o = {};
        o.ProjectUID = (Ext.Object.fromQueryString(document.location.search)).ProjectUID;
    }
});
//@ sourceURL=Manager4Dashboard.js