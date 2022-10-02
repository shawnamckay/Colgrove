MVLeaflet.NumberedDivIcon = MVLeaflet.Icon.extend({
	options: {
    iconUrl: 'mds/module/clientFileManager/image/comment.png',
    number: '',
    shadowUrl: null,
    iconSize: new MVLeaflet.Point(20, 20),
		iconAnchor: new MVLeaflet.Point(0, 20),
		popupAnchor: new MVLeaflet.Point(0, 0),
		/*
		iconAnchor: (Point)
		popupAnchor: (Point)
		*/
		className: 'leaflet-div-icon'
	},

	createIcon: function () {
		var div = document.createElement('div');
		var img = this._createImg(this.options['iconUrl']);
		var numdiv = document.createElement('div');
		numdiv.setAttribute ( "class", "number" );
		numdiv.innerHTML = this.options['number'] || '';
		div.appendChild ( img );
		div.appendChild ( numdiv );
		this._setIconStyles(div, 'icon');
		return div;
	},
 
	//you could change this to add a shadow like in the normal marker if you really wanted
	createShadow: function () {
		return null;
	}
});