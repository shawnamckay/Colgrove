MVLeaflet.CRS.Multivista = MVLeaflet.extend({}, MVLeaflet.CRS, {
	projection: MVLeaflet.Projection.LonLat,
	transformation: new MVLeaflet.Transformation(.25, 0, .25, 0),

	scale: function (zoom) {
		return Math.pow(2, zoom);
	},

	distance: function (latlng1, latlng2) {
		var dx = latlng2.lng - latlng1.lng,
		    dy = latlng2.lat - latlng1.lat;

		return Math.sqrt(dx * dx + dy * dy);
	},

	infinite: true
});