/**
 * CONTROLLER
 */
Ext.define('mds.controller.clientDashboard.GlobalMapViewer', {
    extend: 'mds.controller.clientDashboard.AbstractDashboardController',
    models: [
        'clientNavigation.ProjectSelector',
        //'clientDashboard.MapViewerProject',
        'clientDashboard.MapViewerProjectShoot'
    ],
    stores: [
        'clientNavigation.ProjectSelectors',
        // 'clientDashboard.MapViewerProjects',
        'clientDashboard.MapViewerProjectShoots'
    ],
    views: [
        'clientDashboard.GlobalMapViewerDisp',
        'clientDashboard.MapViewerNokiaMap',
        'clientDashboard.MapViewerProjectList'
    ],
    refs: [
        {
            ref: 'disp',
            selector: 'globalMapViewerDisp'
        },
        {
            ref: 'left',
            selector: 'mapViewerProjectList'
        },
        {
            ref: 'right',
            selector: 'mapViewerNokiaMap'
        }
    ],
    init: function(application) {
        var me = this;
        var store = me.getClientNavigationProjectSelectorsStore();
        // var store = me.getClientDashboardMapViewerProjectsStore();
        /*store.on({
            scope: me,
            load: me.onMainStoreLoad
        }); */
        me.control({
            'globalMapViewerDisp': {
                show: me.onDispShow
            },
            'mapViewerProjectList': {
                itemclick: function(that, record, item, index, e, eOpts) {
                    var el = new Ext.dom.Element(e.target);
                    if (el.up('.projectMapIconWrap')) {
                        me.onProjectListSelectionChangeShowBubble(that, [record], eOpts);
                    } else {
                        me.onProjectListSelectionChange(that, [record], eOpts);
                    }
                },
                selectionchange: me.onProjectListSelectionChangeShowBubble
            },
            'mapViewerNokiaMap': {
                mvBubbleClose: me.onNokiaMapBubbleClose,
                mvClusterClick: me.onNokiaMapMarkerClusterClick,
                mvClusterDblClick: me.onNokiaMapMarkerDblClusterClick,
                mvMapMouseup: me.onNokiaMapMapMouseup,
                mvNoizeClick: me.onNokiaMapMarkerNoizeClick,
                dashboardpreferenceclicked: me.onDashboardpreference
            }
        });
    },
    /**
     * @private
     */
    onMainStoreLoad: function(store, records) {
        var me = this;
        if (records) {
            var viewList = me.getLeft();
            //viewList.getSelectionModel().select(records[0]);
            var viewMap = me.getRight();
            viewMap.addProjectData(records);
        }
        me.getController('clientNavigation.Manager4Dashboard').fireEvent('mapviewerreday');
    },
    /**
     * @private
     */
    onProjectListSelectionChangeShowBubble: function(dataview, selections, options) {
        var me = this;
        var viewMap = me.getRight();
        if (selections && selections[0]) {
            var data = selections[0].raw;
            data.shoots = [{},{},{},{}];
            var store = me.getClientDashboardMapViewerProjectShootsStore();
            store.load({
                params: {
                    ProjectUID: data.ProjectUID,
                    top: 4
                },
                callback: function(records, operation, success) {
                    if (records) {
                        for (var i = 0; i < records.length && 4; i++) {
                            data.shoots[i] = records[i].raw;
                        }
                        viewMap.showNoizeBubble(data);
                    }
                }
            });
        } else {
            viewMap.closeBubble();
        }
    },
    /**
     * @private
     */
    doMapSelectionChange: function(record) {
        var me = this;
        var viewList = me.getLeft();
        var selectionModel = viewList.getSelectionModel();
        selectionModel.deselectAll();
        if (record && record != null) {
            selectionModel.select(record);
        } else {
            var viewMap = me.getRight();
            viewMap.closeBubble();
        }
    },
    /**
     * @private
     */
    onNokiaMapBubbleClose: function() {
        var me = this;
        me.doMapSelectionChange();
    },
    /**
     * @private
     */
    onNokiaMapMarkerClusterClick: function(dataPoints) {
        var me = this;
        var viewList = me.getLeft();
        var selectionModel = viewList.getSelectionModel();
        selectionModel.deselectAll();
        var viewMap = me.getRight();
        viewMap.showClusterBubble(dataPoints);
    },
    /**
     * @private
     */
    onNokiaMapMarkerDblClusterClick: function(dataPoints) {
        var me = this;
        var viewMap = me.getRight();
        viewMap.closeBubble();
        viewMap.zoomToClusterMarkerExtents(dataPoints);
    },
    /**
     * @private
     */
    onNokiaMapMapMouseup: function() {
        var me = this;
        me.doMapSelectionChange();
    },
    /**
     * @private
     */
    onNokiaMapMarkerNoizeClick: function(record) {
        var me = this;
        me.doMapSelectionChange(record);
    }
});