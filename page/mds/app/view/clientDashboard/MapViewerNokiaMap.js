/**
 * require :
 * <script type="text/javascript" src="https://api.maps.nokia.com/2.2.3/jsl.js?with=all" charset="utf-8"></script>
 *      http://www.developer.nokia.com/Community/Discussion/showthread.php?238852-moved-Asynchronously-map-API-load-issue
 *
 * events :
 *      mvNoizeClick: fired when a noize marker, not a cluster marker, is clicked.
 *      mvMapMouseup: fired when the map is clicked and the mouse click is 'up'.
 *      mvBubbleClose: fired when the bubble's close is clicked.
 */
Ext.define('mds.view.clientDashboard.MapViewerNokiaMap', {
    extend: 'Ext.container.Container',
    alias: 'widget.mapViewerNokiaMap',
    requires: [
        'mds.view.clientDashboard.MapViewerBubble',
        'mds.view.clientDashboard.MapViewerClusterBubble',
        'mds.view.clientDashboard.MapViewerControllerUnit',
        'mds.view.clientDashboard.PreferedDashboardSelector'
    ],
    id: 'mapViewerNokiaMap',
    listeners: {
        afterrender: function() {
            var me = this;
            me.myInitMap();
            me.pdSelector.append(me);
        }
    },
    // @private
    myInitMap: function() {
        return;
        var me = this;
        // Nokia maps API credentials - Cory's Credentials'
        nokia.Settings.set('appId', '7UFNh3ZpzKm70q81ZDvS'); 
        nokia.Settings.set('authenticationToken', 'rTECaA20uHUPMzfwqKD_-A');
        me.infoBubbles = new nokia.maps.map.component.InfoBubbles();
        me.infoBubbles.options.defaultWidth = 200;
        me.infoBubbles.options.autoClose = true; // default:true
        me.map = new nokia.maps.map.Display(Ext.getDom(me.id), {
            center: [41.9, -97.85],
            zoomLevel: 4,
            baseMapType: nokia.maps.map.Display.NORMAL,
            components: [
                new nokia.maps.map.component.TypeSelector(),
                new nokia.maps.map.component.zoom.DoubleClick(),
                new nokia.maps.map.component.panning.Drag(),
                //new nokia.maps.map.component.ZoomBar(),
                new nokia.maps.map.component.zoom.MouseWheel(),
                me.infoBubbles
            ]
        });
        me.markers = new nokia.maps.map.Container();
        me.noizeBubble = new mds.view.clientDashboard.MapViewerBubble();
        me.clusterBubble = new mds.view.clientDashboard.MapViewerClusterBubble();
        // Change cursor to pointer on hover to give more visual feedback - marker must have a defined title
        me.map.addListener('mouseover', function(evt) {
            changeCursor(evt.target, 'pointer');
        });
        // Return the cursor to normal if the marker which has a title loses focus.
        me.map.addListener('mouseout', function(evt) {
            changeCursor(evt.target, 'default');
        });
        /**
         * cf. mapviewchange,mapviewchangeend,mapviewchangestart,resize,resizeend,resizestart
         */
        me.map.addListener('resize', function(evt) {
            if (!me.doneInit || me.doneInit == false) {
                me.doneInit = me.zoomToGlobalMarkerExtents();
            }
        });
        // Get click outside info bubble to close bubble
        me.map.addListener('mouseup', function(evt) {
            if (evt.stopImmediatePropagation) {
                evt.stopImmediatePropagation(); // Mozilla
            } else if (window.evt) {
                window.evt.cancelBubble = true;
            }
            me.fireEvent('mvMapMouseup');
        });
        me.map.addListener('mousedown', function(evt) {
            if (evt.cancel) {
                // http://api.maps.nokia.com/en/apireference/2.2.0/symbols/nokia.maps.dom.MouseEvent.html
                evt.cancel();
                //evt.preventDevault();
                //evt.preventUnload();
                //evt.stopImmediatePropagation();
                //evt.stopPropagation();
            }
        });
        // Change Mouse Cursor
        var changeCursor = function (target, cursor) {
            if (target.title !== undefined && (target.title == 'mvNoize' || target.title == 'mvCluster')) {
                document.body.style.cursor = cursor;
            }
        };
        /**
         * Create an instance of ClusterProvider. It uses the default display theme (an
         * instance of nokia.maps.clustering.MarkerTheme).
         * The code sets 
         *      - eps: the epsilon distance (the radius within which data points are
         *          considered for clustering)
         *      - minPts: the smallest number of points can exist within
         *          the epsilon distance that can exist as individual noise points (not
         *          clustered),
         *      - dataPoints: representing the data points to use for cluster creation. 
         *          Here it is an empty array since the actual data points are provided dynamically.
         */
        me.clusterProvider = new nokia.maps.clustering.ClusterProvider(me.map, {
            eps: 16,
            theme: {
                //dataPoints: {nokia.maps.clustering.IClusterPoint[] | nokia.maps.clustering.Cluster}
                getClusterPresentation: function (dataPoints) {
                    var coordinate = dataPoints.getBounds().getCenter();
                    var marker = new nokia.maps.map.StandardMarker(coordinate, {
                        text: dataPoints.getSize(),
                        shape: 'balloon',
                        brush: new nokia.maps.util.Brush({
                            color: '#FFFFFF',
                            fill: 'solid'
                        }),
                        pen: new nokia.maps.util.Pen({
                            strokeColor: '#E95C13'
                        }),
                        textPen: new nokia.maps.util.Pen({
                            strokeColor: '#0D104D'
                        }),
                        visibility: true,
                        anchor: new nokia.maps.util.Point(15, 34),
                        title: 'mvCluster'
                    });
                    marker.addListener('click', function (evt) {
                        if (evt.stopImmediatePropagation) {
                            evt.stopImmediatePropagation();
                        } else if (window.evt) {
                            window.evt.cancelBubble = true;
                        }
                        me.fireEvent('mvClusterClick', dataPoints);
                    });
                    marker.addListener('dblclick', function (evt) {
                        if (evt.stopImmediatePropagation) {
                            evt.stopImmediatePropagation();
                        } else if (window.evt) {
                            window.evt.cancelBubble = true;
                        }
                        me.fireEvent('mvClusterDblClick', dataPoints);
                    });
                    return marker;
                },
                getNoisePresentation: function (dataPoint) {
                    var coordinate = new nokia.maps.geo.Coordinate(dataPoint.latitude, dataPoint.longitude);
                    var marker = new nokia.maps.map.Marker(coordinate,{
                        visibility: true,
                        icon: '/mds/module/clientDashboard/image/map_marker.png', // 26px X 32px
                        anchor: new nokia.maps.util.Point(15, 32),
                        title: 'mvNoize'
                    });
                    marker.addListener('click', function (evt) {
                        if (evt.stopImmediatePropagation) {
                            evt.stopImmediatePropagation();
                        } else if (window.evt) {
                            window.evt.cancelBubble = true;
                        }
                        me.fireEvent('mvNoizeClick', dataPoint.record);
                    });
                    return marker;
                }
            }
        });
        new mds.view.clientDashboard.MapViewerControllerUnit().append(me);
    },
    /**
     * records:[mds.model.clientDashboard.MapViewerProject]
     */
    addProjectData: function(records) {
        var me = this;
        for (var i = 0; i < records.length; i++) {
            (function (record) {
                if (!record.raw.ProjectLatitude || !record.raw.ProjectLongitude) {
                    return;
                }
                var dataPoint = { // nokia.maps.clustering.IClusterPoint + record
                    latitude: record.raw.ProjectLatitude,
                    longitude: record.raw.ProjectLongitude,
                    record: record
                };
                me.clusterProvider.add(dataPoint);
                me.markers.objects.add(new nokia.maps.map.Marker(dataPoint));
            })(records[i]);
        }
        me.clusterProvider.cluster();
    },
    showClusterBubble: function(dataPoints) {
        var me = this;
        me.closeBubble();
        me.myBubble = me.infoBubbles.initBubble(function() {
            me.fireEvent('mvBubbleClose');
        }, false);
        var points = dataPoints.getPoints();
        var content =  me.clusterBubble.apply(points);
        me.myBubble.update(content, dataPoints.getBounds().getCenter());
        me.myBubble.open();
    },
    showNoizeBubble: function(data) {
        var me = this;
        var lat = data.ProjectLatitude;
        var lng = data.ProjectLongitude;
        if (nokia.maps.geo.Coordinate.isValid(lat, lng)) {
            var content =  me.noizeBubble.apply(data);
            var coordinate = new nokia.maps.geo.Coordinate(lat, lng);
            me.closeBubble();
            me.myBubble = me.infoBubbles.initBubble(function() {
                me.fireEvent('mvBubbleClose');
            }, false);
            me.myBubble.update(content, coordinate);
            me.myBubble.open();
        }
    },
    closeBubble: function() {
        var me = this;
        if (me.myBubble && me.myBubble.close) {
            me.myBubble.close();
        }
    },
    /**
     * Returns false if map view has not been initialized and having 0s as its
     * height and width. When visibility of the view is changed, ie. show() or
     * hide() is called, height and width are changed to 0s to real numbers.
     */
    zoomToGlobalMarkerExtents: function() {
        var me = this;
        if (me.map.height != 0 && me.map.width != 0) {
            var boundingBox = me.markers.getBoundingBox();
            me.map.zoomTo(boundingBox);
            return true;
        }
        return false;
    },
    zoomToClusterMarkerExtents: function(dataPoints) {
        var me = this;
        var boundingBox = dataPoints.getBounds();
        me.map.zoomTo(boundingBox);
    },
    initComponent: function() {
        var me = this;
        me.enableBubble('dashboardpreferenceclicked');
        var model = {
            MemberDashboardPreference: 'mapviewer'
        };
        me.pdSelector = Ext.create('mds.view.clientDashboard.PreferedDashboardSelector', {model: model});
        me.callParent(arguments);
    }
});