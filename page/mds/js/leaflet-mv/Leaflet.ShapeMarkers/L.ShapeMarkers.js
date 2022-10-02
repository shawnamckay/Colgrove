// Compatible with Leaflet 0.7.3
MVLeaflet.SquareMarker = MVLeaflet.CircleMarker.extend({

	getPathString: function() {
		var p = this._point,
			r = this._radius;
		if (this._checkIfEmpty()) {
			return '';
		}
		if (MVLeaflet.Browser.svg) {
			return "M " + (p.x - r) + " " + (p.y - r) + " L " + (p.x + r) + " " + (p.y - r) + " L" + (p.x + r) + " " + (p.y + r) +
				   " L" + (p.x - r) + " " + (p.y + r) + " L" + (p.x - r) + " " + (p.y - r);
		}
	}

});

MVLeaflet.squareMarker = function(latlng, options) {
	return new MVLeaflet.SquareMarker(latlng, options);
};

MVLeaflet.DiamondMarker = MVLeaflet.CircleMarker.extend({

	getPathString: function() {
		var p = this._point,
			r = this._radius;
		if (this._checkIfEmpty()) {
			return '';
		}
		if (MVLeaflet.Browser.svg) {
			return "M " + (p.x - r) + " " + p.y + " L " + p.x + " " + (p.y - r) + " L" + (p.x + r) + " " + p.y +
				   " L" + p.x + " " + (p.y + r) + " L" + (p.x - r) + " " + p.y;
		}
	}

});

MVLeaflet.diamondMarker = function(latlng, options) {
	return new MVLeaflet.DiamondMarker(latlng, options);
};

MVLeaflet.TriangleMarker = MVLeaflet.CircleMarker.extend({

	getPathString: function() {
		var p = this._point,
			r = this._radius;
		if (this._checkIfEmpty()) {
			return '';
		}
		if (MVLeaflet.Browser.svg) {
			return "M" + (p.x - r) + " " + (p.y + r) + " L" + p.x + " " + (p.y - r) + " L" + (p.x + r) + " " + (p.y + r) + " Z";
		}
	}

});

MVLeaflet.triangleMarker = function(latlng, options) {
	return new MVLeaflet.TriangleMarker(latlng, options);
};