/**
 */
Ext.define('mds.view.clientDashboard.MapViewerControllerUnit', {
    // extend: 'Ext.Base',
    constructor: function() {
        var me = this;
        me.template = new Ext.Template(me.myHtml);
        me.callParent();
    },
    append: function(nokiaMap) {
        var me = this;
        var id = nokiaMap.id, map = nokiaMap.map;
        var newNode = me.template.append(Ext.getDom(id));
        Ext.getDom('zoomIn').onclick = function() {
            map.set('zoomLevel', map.zoomLevel + 1);
        };
        Ext.getDom('zoomOut').onclick = function() {
            map.set('zoomLevel', map.zoomLevel - 1);
        };
        Ext.getDom('center').onclick = function () {
            nokiaMap.zoomToGlobalMarkerExtents();
        };
        Ext.getDom('panLeft').onclick = function () {
            map.pan(0, 0, -120, 0, 'default');
        };
        Ext.getDom('panRight').onclick = function () {
            map.pan(0, 0, 120, 0, 'default');
        };
        Ext.getDom('panUp').onclick = function () {
            map.pan(0, 0, 0, -120, 'default');
        };
        Ext.getDom('panDown').onclick = function () {
            map.pan(0, 0, 0, 120, 'default');
        };
        return newNode;
    },
    /**
     *  @private
     */
    myHtml: [
        '<div id="mapShadow">',
             '<div class="mapShadow-h">',
                '<div class="mapShadow h1 o1 btm"></div>',
                '<div class="mapShadow h2 o2 btm"></div>',
                '<div class="mapShadow h3 o3 btm"></div>',
                '<div class="mapShadow h4 o4 btm"></div>',
                '<div class="mapShadow h5 o5 btm"></div>',
            '</div>',
            '<div class="mapShadow-v">',
                '<div class="mapShadow v1 o1"></div>',
                '<div class="mapShadow v2 o2"></div>',
                '<div class="mapShadow v3 o3"></div>',
                '<div class="mapShadow v4 o4"></div>',
                '<div class="mapShadow v5 o5"></div>',
            '</div>',
        '</div>',
        '<div id="pc">',
            '<div id="panUp" title="Pan up"></div>',
            '<div id="panLeft" title="Pan left"></div>',
            '<div id="center" title="Reset view"></div>',
            '<div id="panRight" title="Pan right"></div>',
            '<div id="panDown" title="Pan down"></div>',
        '</div>',
        '<div id="zc">',
            '<div id="zoomIn" title="Zoom in"></div>',
            '<div id="zoomOut" title="Zoom out"></div>',
        '</div>'
    ]
});