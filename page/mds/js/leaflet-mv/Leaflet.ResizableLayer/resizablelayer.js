/*
 * This class uses the Multivista X,Y coordinates.
 */
MVLeaflet.ResizableLayer = MVLeaflet.LayerGroup.extend({
	includes: MVLeaflet.Mixin.Events,

    addTo: function(map) {
        this._map = map;
        map.addLayer(this);
        this._mapZoomEndListener = this.mapZoomEnd.bind(this);
        map.on("zoomend", this._mapZoomEndListener);
        this._createElements();
        return this;
    },

    mapZoomEnd: function(ev) {
        this._resize();
    },

	/**
	 * Returns the min x, min y, max x, max y values
	 * @returns {{x1: (number|*), y1: (number|*), x2: (number|*), y2: (number|*)}}
	 */
	getBounds: function() {
        return { x1: this._minX, y1: this._minY, x2: this._maxX, y2: this._maxY };
    },

    /**
     * Sets the min x, min y, max x, max y values.
     * @param x1
     * @param y1
     * @param x2
     * @param y2
     */
    setBounds: function(x1, y1, x2, y2) {
        this._minX = Math.min(x1, x2);
        this._maxX = Math.max(x1, x2);
        this._minY = Math.min(y1, y2);
        this._maxY = Math.max(y1, y2);
	    //console.log("setBounds", this._minX, this._minY, this._maxX, this._maxY);

        if (this._neLatLng != null) {
            // Update
            this._setLatLng(this._neLatLng, this._minY, this._maxX);
            this._setLatLng(this._nwLatLng, this._minY, this._minX);
            this._setLatLng(this._seLatLng, this._maxY, this._maxX);
            this._setLatLng(this._swLatLng, this._maxY, this._minX);
            this._setLatLng(this._moveLatLng, this._minY, this._minX);
        } else {
            this._neLatLng = MVLeaflet.latLng(this._minY, this._maxX);
            this._nwLatLng = MVLeaflet.latLng(this._minY, this._minX);
            this._seLatLng = MVLeaflet.latLng(this._maxY, this._maxX);
            this._swLatLng = MVLeaflet.latLng(this._maxY, this._minX);
            this._moveLatLng = MVLeaflet.latLng(this._minY, this._minX);
        }
        this._yDiff = Math.abs(this._maxY - this._minY);
        this._xDiff = Math.abs(this._maxX - this._minX);
        this._resize();
        return this;
    },

	move: function(x1Delta, y1Delta, x2Delta, y2Delta) {
    	var bounds = this.getBounds();
    	if ((x1Delta != 0) || (y1Delta != 0) || (x2Delta != 0) || (y2Delta != 0)) {
	        var oldBounds = this.getBounds();
		    this.setBounds(oldBounds.x1 + x1Delta, oldBounds.y1 + y1Delta, oldBounds.x2 + x2Delta, oldBounds.y2 + y2Delta);
		    bounds = this.getBounds();
		    this.fire("resize", {oldBounds: oldBounds, bounds: bounds});
	    }
	    return bounds;
	},

	hide: function() {
        this._hideElements();
	},

	show: function() {
    	this._showElements();
	},

    _createElements: function() {
        this._areaMarker = this._createResizeAreaMarker(this._cloneLatLng(this._nwLatLng));
        this._nwMarker = this._createResizeHandleMarker(this._cloneLatLng(this._nwLatLng), "nw");
        this._neMarker = this._createResizeHandleMarker(this._cloneLatLng(this._neLatLng), "ne");
        this._swMarker = this._createResizeHandleMarker(this._cloneLatLng(this._swLatLng), "sw");
        this._seMarker = this._createResizeHandleMarker(this._cloneLatLng(this._seLatLng), "se");
        this._markers = [ this._areaMarker, this._nwMarker, this._neMarker, this._swMarker, this._seMarker ];
        this._resize();
    },

	_hideElements: function() {
    	if (this._markers) {
		    for (var i = 0; i < this._markers.length; i++) {
		    	var marker = this._markers[i];
		    	if (marker._icon) {
		    		marker._icon.style.display = "none";
			    }
		    }
	    }
	},

	_showElements: function() {
    	if (this._markers) {
		    for (var i = 0; i < this._markers.length; i++) {
		    	var marker = this._markers[i];
		    	if (marker._icon) {
		    		marker._icon.style.display = "block";
			    }
		    }
	    } else {
    		this._createElements();
	    }
	},

    _resize: function() {
        if (this._map && this._areaMarker) {
            var marker = this._areaMarker;
            this._setMarkerLatLng(marker, this._nwLatLng);
            var swPoint = this._map.latLngToLayerPoint(this._swLatLng);
            var nePoint = this._map.latLngToLayerPoint(this._neLatLng);
            var width = Math.abs(nePoint.x - swPoint.x);
            var height = Math.abs(nePoint.y - swPoint.y);
            if (marker && marker._icon) {
                //console.log("Area size", width, height);
                marker._icon.style.width = Math.max(10, width) + "px";
                marker._icon.style.height = Math.max(10, height) + "px";
            }

            this._setMarkerLatLng(this._nwMarker, this._nwLatLng);
            this._setMarkerLatLng(this._neMarker, this._neLatLng);
            this._setMarkerLatLng(this._swMarker, this._swLatLng);
            this._setMarkerLatLng(this._seMarker, this._seLatLng);
        }
    },

    _setMarkerLatLng: function(marker, latlng, fireMoveEvent) {
        if (marker && marker._latlng && latlng && (marker !== this._dragMarker)) {
            if (fireMoveEvent) {
                marker.setLatLng(latlng);
            } else {
                if (this._copyLatLng(marker._latlng, latlng)) {
                    marker.update();
                } else {
                    //console.log("No change to marker position", marker.resizeName);
                }
            }
        }
    },

    _copyLatLng: function(target, source) {
        return (source ? this._setLatLng(target, source.lat, source.lng) : false);
    },

    _setLatLng: function(latlng, newLat, newLng) {
        if (latlng && ((latlng.lat !== newLat) || (latlng.lng !== newLng))) {
            latlng.lat = newLat;
            latlng.lng = newLng;
            return true;
        }
        return false;
    },

	_cloneLatLng: function(latlng) {
    	return new MVLeaflet.LatLng(latlng.lat, latlng.lng, latlng.alt);
	},

    _createResizeAreaMarker: function(latlng) {
        var marker = MVLeaflet.marker(latlng, {
            draggable: true,
            icon: MVLeaflet.divIcon({
                className: "leaflet-resize-area"
            })
        });

        marker.resizeName = "area";
        this.addDragListeners(marker);
        marker.addTo(this);
        return marker;
    },

	_createMoveHandlerMarker: function(latlng) {
    	var marker = MVLeaflet.marker(latlng, {
    		draggable: true,
		    icon: MVLeaflet.divIcon({
			    className: "leaflet-resize-move-handle",
			    iconSize: [17,17]
		    })
	    });
    	marker.resizeName = "move";
    	this.addDragListeners(marker);
    	marker.addTo(this);
    	return marker;
	},

    _createResizeHandleMarker: function(latlng, className) {
        var marker = MVLeaflet.marker(latlng, {
            draggable: true,
            icon: MVLeaflet.divIcon({
                iconSize: [10, 10],
                className: "leaflet-resize-handle " + className
            })
        });

        marker.resizeName = className;
        this.addDragListeners(marker);
        marker.addTo(this);
        return marker;
    },

    addDragListeners: function(marker) {
        this._dragStartListener = this._dragStartHandler.bind(this);
        this._dragListener = this._dragHandler.bind(this);
        this._dragEndListener = this._dragEndHandler.bind(this);
        marker.on("dragstart", this._dragStartListener);
        marker.on("drag", this._dragListener);
        marker.on("dragend", this._dragEndListener);
    },

    _dragStartHandler: function(ev) {
        //console.log("Drag start", ev, this);
        this._dragMarker = ev.target;
        this._oldBounds = this.getBounds();
        this._dragStartLatLng = this._cloneLatLng(this._dragMarker.getLatLng());
        var name = this._dragMarker.resizeName;
        this._dragArea = (name === "area");
        //this._dragArea = (name === "move");
        this._dragNW = (name === "nw");
        this._dragNE = (name === "ne");
        this._dragSW = (name === "sw");
        this._dragSE = (name === "se");
        //console.log("Starting drag", this._dragArea, this._dragNW, this._dragNE, this._dragSW, this._dragSE);
        this._map.dragging.disable();
    },

    _dragHandler: function(ev) {
        if (this._dragMarker) {
            var latlng = ev.latlng || ev.target.getLatLng();

            if (this._dragArea) {
                // All 4 corners moved
                this.setBounds(latlng.lng, latlng.lat, latlng.lng + this._xDiff, latlng.lat + this._yDiff);
            } else {
                var minY = latlng.lat, minX = latlng.lng, maxY = latlng.lat, maxX = latlng.lng;
                if (this._dragNW) {
                    // SE doesn't change, maxY and maxX don't change
                    maxY = this._seLatLng.lat;
                    maxX = this._seLatLng.lng;
                } else if (this._dragNE) {
                    // SW doesn't change, maxY and minX don't change
                    maxY = this._swLatLng.lat;
                    minX = this._swLatLng.lng;
                } else if (this._dragSE) {
                    // NW doesn't change, minY and minX don't change
                    minY = this._nwLatLng.lat;
                    minX = this._nwLatLng.lng;
                } else if (this._dragSW) {
                    // NE doesn't change, maxLat and maxLng don't change
                    minY = this._neLatLng.lat;
                    maxX = this._neLatLng.lng;
                }
                this.setBounds(minX, minY, maxX, maxY);
            }
        }
    },

    _dragEndHandler: function(ev) {
        //console.log("Drag end", ev);
        var oldBounds = this._oldBounds;
        this._oldBounds = null;
        this._dragMarker = null;
        this._dragArea = this._dragNW = this._dragNE = this._dragSW = this._dragSE = false;
        this._map.dragging.enable();

        this.fire("resize", { oldBounds: oldBounds, bounds: this.getBounds() });
    }

});

MVLeaflet.resizableLayer = function(options) {
    return new MVLeaflet.ResizableLayer(options);
};

//# sourceURL=resizablelayer.js