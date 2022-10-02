MVLeaflet.HotspotMarker = MVLeaflet.Polygon.extend({

    options: {
        radius: 8,
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 1,
        rotation: 0,
        halo: 0
    },

    initialize: function (latlng, options) {
        options = MVLeaflet.setOptions(this, options);

        var angle = options.rotation;

        MVLeaflet.Polygon.prototype.initialize.call(this, this.getChevronPoints(latlng, angle), options);

    },

    getChevronPoints: function (latlng, angle) {
        return [
            this.rotatePoint(MVLeaflet.latLng(latlng.lat - (11 + this.options.halo), latlng.lng - (0 + this.options.halo)), latlng, angle), // tip
            this.rotatePoint(MVLeaflet.latLng(latlng.lat + (11 + this.options.halo), latlng.lng - (6 + this.options.halo)), latlng, angle), // left side
            this.rotatePoint(MVLeaflet.latLng(latlng.lat + (8  + this.options.halo) , latlng.lng - (0  + 0)), latlng, angle), // left to middle
            this.rotatePoint(MVLeaflet.latLng(latlng.lat + (11 + this.options.halo), latlng.lng + (6 + this.options.halo)), latlng, angle), // middle to lower right
            this.rotatePoint(MVLeaflet.latLng(latlng.lat - (11 + this.options.halo), latlng.lng + (0 + this.options.halo)), latlng, angle) // lower right back to tip
        ];
    },

    rotatePoint: function (point, origin, angle) {
        var pointX = point.lng;
        var pointY = point.lat;
        var originX = origin.lng;
        var originY = origin.lat;
        var angle = angle * Math.PI / 180.0;

        return MVLeaflet.latLng( Math.sin(angle) * (pointX-originX) + Math.cos(angle) * (pointY-originY) + originY, Math.cos(angle) * (pointX-originX) - Math.sin(angle) * (pointY-originY) + originX );

    }

});

MVLeaflet.hotspotMarker = function (latlng, options) {
    return new MVLeaflet.HotspotMarker(latlng, options);
};

MVLeaflet.HotareaMarker = MVLeaflet.Polygon.extend({

    options: {
        radius: 8,
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 1,
        rotation: 0,
        halo: 0
    },

    initialize: function (latlng, options) {
        options = MVLeaflet.setOptions(this, options);

        var angle = options.rotation;
        var width = options.width;
        var height = options.height;

        MVLeaflet.Polygon.prototype.initialize.call(this, this.getRectanglePoints(latlng, width, height, angle), options);

    },

    getRectanglePoints: function (latlng, width, height, angle) {
        return [
            this.rotatePoint(MVLeaflet.latLng(latlng.lat, latlng.lng), latlng, angle), // upper left
            this.rotatePoint(MVLeaflet.latLng(latlng.lat, latlng.lng + width), latlng, angle), // upper right
            this.rotatePoint(MVLeaflet.latLng(latlng.lat + height, latlng.lng + width), latlng, angle), // lower right
            this.rotatePoint(MVLeaflet.latLng(latlng.lat + height, latlng.lng), latlng, angle) // lower left
        ];
    },

    rotatePoint: function (point, origin, angle) {
        var pointX = point.lng;
        var pointY = point.lat;
        var originX = origin.lng;
        var originY = origin.lat;
        var angle = angle * Math.PI / 180.0;

        return MVLeaflet.latLng( Math.sin(angle) * (pointX-originX) + Math.cos(angle) * (pointY-originY) + originY, Math.cos(angle) * (pointX-originX) - Math.sin(angle) * (pointY-originY) + originX );

    }

});

MVLeaflet.hotareaMarker = function (latlng, options) {
    return new MVLeaflet.HotareaMarker(latlng, options);
};

MVLeaflet.HotCircleMarker = MVLeaflet.CircleMarker.extend({

    options: {
        radius: 8,
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 1,
        rotation: 0,
        halo: 0
    },

    initialize: function (latlng, options) {
        options = MVLeaflet.setOptions(this, options);
        MVLeaflet.CircleMarker.prototype.initialize.call(this, latlng, options);
    }

});

MVLeaflet.hotCircleMarker = function (latlng, options) {
    return new MVLeaflet.HotCircleMarker(latlng, options);
};

/**
 * The Pano icon marker - it combines 3 markers in 1:
 *  - a transparent background marker to catch mouse events (clicks)
 *  - a path layer that draws (stroke only) the circular portions of the pano icon
 *  - a path layer that fills the arrow heads and center circle.
 */
MVLeaflet.PanoMarker = MVLeaflet.FeatureGroup.extend({

    initialize: function (latlng, options) {
        if (options && (options.layers !== undefined) && (options.layers.length > 0)) {
            MVLeaflet.LayerGroup.prototype.initialize.call(this, options.layers);
        } else {
            this._layers = {};
        }
        this._options = this._defaults(options);

        // This circle fills the area behind the pano icon so that it is all clickable
        this._bgLayer = new MVLeaflet.PanoBgCircleMarker(latlng, {
            clickable: options.bgClickable,
            radius: this._options.bgRadius,
            stroke: false,
			fillOpacity: 1,	
			fillColor: '#FFFFFF', 
			className: 'panoMarkerBg',
	        title: options.title || ''
        });
		this.addLayer(this._bgLayer);

        // This layer draws the pano icon path (stroke only, no fill)
        this._circleLayer = new MVLeaflet.PanoCircleMarker(latlng, this._options);
		this.addLayer(this._circleLayer);
		// This layer fills the arrow heads and center circle
        this._arrowLayer = new MVLeaflet.PanoArrowMarker(latlng, this._options);
		this.addLayer(this._arrowLayer);
    },

    _defaults: function(options) {
        options.bgClickable = (options.clickable != false);
        options.clickable = false;
        options.radius = (options.radius > 0 ? options.radius : 16);
        options.bgRadius = Math.ceil(options.radius * 1.3);
        options.color = options.color || "#E65E25";
        options.weight = Math.max(1, Math.floor(options.radius / 6));
        options.stroke = true;
        options.opacity = ((options.opacity > 1) && (options.opacity <= 1) ? options.opacity : 1);
        options.fill = false;
        options.clickable = false;
        options.pointerEvents = "none";
        options.lineCap = "square";
        options.lineJoin = "miter";
        return options;
    },
	
	setRadius: function(radius) {
		this._bgLayer.setRadius(Math.ceil(radius * 1.3));
		this._circleLayer.setRadius(radius);
		this._circleLayer.setStyle({ weight: Math.max(1, Math.round(radius / 6)) });
		this._arrowLayer.setRadius(radius);
		this._arrowLayer.setStyle({ weight: Math.max(1, Math.round(radius / 6)) });
	},
	
	getRadius: function() {
		return this._circleLayer.getRadius();
	},
	
	setLatLng: function(latlng) {
		this._bgLayer.setLatLng(latlng);
		this._circleLayer.setLatLng(latlng);
		this._arrowLayer.setLatLng(latlng);
	},
	
	getLatLng: function() {
		return this._circleLayer.getLatLng();
	},
	
	bringToFront: function() {
		this._bgLayer.bringToFront();
		this._circleLayer.bringToFront();
		this._arrowLayer.bringToFront();
	},
	
	bringToBack: function() {
		this._arrowLayer.bringToBack();
		this._circleLayer.bringToBack();
		this._bgLayer.bringToBack();
	},
		
	closePopup: function() {
		this._bgLayer.closePopup.call(this._bgLayer);
	}

});

MVLeaflet.panoMarker = function(latlng, options) {
    return new MVLeaflet.PanoMarker(latlng, options);
};


/**
 * Extends CircleMarker to allow for a tooltip/title element.
 */
MVLeaflet.PanoBgCircleMarker = MVLeaflet.CircleMarker.extend({

	initialize: function(latlng, options) {
		MVLeaflet.CircleMarker.prototype.initialize.call(this, latlng, options);
	},

	_initPath: function() {
		MVLeaflet.CircleMarker.prototype._initPath.apply(this, arguments);
		// To have a tooltip on a <path> element, you need to add a child <title> element, but it must be done before it's added to the dom I think...
		if (this.options && this.options.title && this._path) {
			var title = this._createElement("title");
			title.innerHTML = this.options.title;
			this._path.appendChild(title);
		}
	}

});


/**
 * Draws the circular portion of the pano icon (stroke only).
 */
MVLeaflet.PanoCircleMarker = MVLeaflet.CircleMarker.extend({
    //color: '#E65E25'  // orange
    //color: '#70D549'  // green
    //color: '#9B9B9B'  // gray
    initialize: function (latlng, options) {
        MVLeaflet.CircleMarker.prototype.initialize.call(this, latlng, options);
    },

    getPathString: function() {
        var p = this._point,
            r = this._radius;

        if (this._checkIfEmpty()) {
            return '';
        }

        if (MVLeaflet.Browser.svg) {
            var path = '';
            // Right hand arc
            var p1 = this.getPointOnCircle(-75, p, r);
            var p2 = this.getPointOnCircle(75, p, r);
            path += ' M' + p1.x + ',' + p1.y +
                'A' + r + ',' + r + ',0,0,1,' +
                p2.x.toFixed(3) + ',' + p2.y.toFixed(3);

            // Left hand arc
            var p3 = this.getPointOnCircle(105, p, r);
            var p4 = this.getPointOnCircle(255, p, r);
            path += ' M' + p3.x + ',' + p3.y +
                'A' + r + ',' + r + ',0,0,1,' +
                p4.x.toFixed(3) + ',' + p4.y.toFixed(3);

            return path;
        }
        // Fall back to a circle
        return MVLeaflet.CircleMarker.prototype.getPathString.call(this);
    },

    getPointOnCircle: function(degrees, p, r) {
        var theta = degrees * Math.PI / 180.0;
        var x = p.x + (r * Math.cos(theta));
        var y = p.y + (r * Math.sin(theta));
        return { x: x, y: y };
	}

});

/**
 * Draws the pano icon arrow heads and the center circle - these path elements are filled in.
 */
MVLeaflet.PanoArrowMarker = MVLeaflet.CircleMarker.extend({

    initialize: function (latlng, options) {
        // This one fills in the same opacity as the circle stroke
        options.fill = true;
        options.fillColor = options.color;
        options.fillOpacity = options.opacity;
        MVLeaflet.CircleMarker.prototype.initialize.call(this, latlng, options);
    },

    getPathString: function() {
        var p = this._point,
            r = this._radius;

        if (this._checkIfEmpty()) {
            return '';
        }

        if (MVLeaflet.Browser.svg) {
            var p2 = this.getPointOnCircle(75, p, r);
            var p4 = this.getPointOnCircle(255, p, r);

            var path = 'M ' + p2.x + ' ' + p2.y;
            // Right arrow
            var a1 = this.getPointOnCircle(40, p, r);
            var rIn = r - (r * 0.2);
            var rOut = r + (r * 0.175);
            var a2 = this.getPointOnCircle(25, p, rIn);
            var a3 = this.getPointOnCircle(35, p, rOut);
            path += ' L ' + a2.x + ' ' + a2.y + ' L ' + a1.x + ' ' + a1.y + ' L ' + a3.x + ' ' + a3.y + ' L ' + p2.x + ' ' + p2.y;

            // Left arrow
            path += ' M ' + p4.x + ' ' + p4.y;
            var a4 = this.getPointOnCircle(220, p, r);
            var rIn2 = r - (r * 0.2);
            var rOut2 = r + (r * 0.175);
            var a5 = this.getPointOnCircle(205, p, rIn2);
            var a6 = this.getPointOnCircle(215, p, rOut2);
            path += ' L ' + a5.x + ' ' + a5.y + ' L ' + a4.x + ' ' + a4.y + ' L ' + a6.x + ' ' + a6.y + ' L ' + p4.x + ' ' + p4.y;

            // Center circle
            var cr = (r < 8 ? 1 : (r >= 18 ? 3 : 2));
            path += ' M ' + p.x + ' ' + (p.y - cr) + 'A' + cr + ',' + cr + ',0,1,1,' + (p.x - 0.1) + ',' + (p.y - cr);

            return path;
        }
        return '';
    },

    getPointOnCircle: function(degrees, p, r) {
        var theta = degrees * Math.PI / 180.0;
        var x = p.x + (r * Math.cos(theta));
        var y = p.y + (r * Math.sin(theta));
        return { x: x, y: y };
    }

});


/**
 * Extends CircleMarker but the weight is proportional to the radius (1/3).
 */
MVLeaflet.PanoScanMarker = MVLeaflet.CircleMarker.extend({

	initialize: function(latlng, options) {
		if (options && (options.radius > 0) && (options.weight === undefined) && (options.fixedWeight !== true)) {
			options.weight = Math.max(1, Math.floor(options.radius / 3));
		}
		MVLeaflet.CircleMarker.prototype.initialize.call(this, latlng, options);
	},

	setRadius: function(radius) {
		// Need this check otherwise we get in an infinite loop of calling setRadius
		if (radius != this.options.radius) {
			this.options.radius = radius;
			MVLeaflet.CircleMarker.prototype.setRadius.call(this, radius);
			// Note that calling this.setStyle calls setRadius!
			if (this.options.fixedWeight !== true) {
				this.setStyle({weight: Math.max(1, Math.floor(radius / 3))});
			}
		}
	},

	_initPath: function() {
		MVLeaflet.CircleMarker.prototype._initPath.apply(this, arguments);
		// To have a tooltip on a <path> element, you need to add a child <title> element, but it must be done before it's added to the dom I think...
		if (this.options && this.options.title && this._path) {
			var title = this._createElement("title");
			title.innerHTML = this.options.title;
			this._path.appendChild(title);
		}
	}

});

MVLeaflet.panoScanMarker = function(latlng, options) {
	return new MVLeaflet.PanoScanMarker(latlng, options);
};

