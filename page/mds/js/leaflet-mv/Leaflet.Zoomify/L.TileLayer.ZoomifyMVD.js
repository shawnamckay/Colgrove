/*
 * MVLeaflet.TileLayer.Zoomify display Zoomify tiles with Leaflet
 */
MVLeaflet.TileLayer.Zoomify = MVLeaflet.TileLayer.extend({ 
	options: {
		continuousWorld: true,
		tolerance: 0.1,
		tileSize: 256,
		tileExtension: '.png'
	},

	initialize: function (url, options) {
		options = MVLeaflet.setOptions(this, options);
		this._url = url;

    	var imageSize = MVLeaflet.point(options.width, options.height),
	    	tileSize = options.tileSize, tileExtension = options.tileExtension;

    	this._imageSize = [imageSize];
		this._tileSize = [tileSize];
    	this._gridSize = [this._getGridSize(imageSize)];
		this._tileExtension = [tileExtension];

        while (parseInt(imageSize.x) > tileSize || parseInt(imageSize.y) > tileSize) {
        	imageSize = imageSize.divideBy(2).floor();
        	this._imageSize.push(imageSize);
        	this._gridSize.push(this._getGridSize(imageSize));
        }

		this._imageSize.reverse();
		this._gridSize.reverse();

        this.options.maxZoom = this._gridSize.length - 1;
		this.options.maxNativeZoom = this._gridSize.length - 1;

	},

	onAdd: function (map) {
		MVLeaflet.TileLayer.prototype.onAdd.call(this, map);

		var mapSize = map.getSize(),
			zoom = this._getBestFitZoom(mapSize),
			imageSize = this._imageSize[zoom],
			center = map.options.crs.pointToLatLng(MVLeaflet.point(imageSize.x / 2, imageSize.y / 2), zoom);

		map.setView(center, zoom, true);
	},

	_getGridSize: function (imageSize) {
		var tileSize = this.options.tileSize;
		return MVLeaflet.point(Math.ceil(imageSize.x / tileSize), Math.ceil(imageSize.y / tileSize));
	},

	_getBestFitZoom: function (mapSize) {
		var tolerance = this.options.tolerance,
			zoom = this._imageSize.length - 1,
			imageSize, zoom;

		while (zoom) {
			imageSize = this._imageSize[zoom];
			if (imageSize.x * tolerance < mapSize.x && imageSize.y * tolerance < mapSize.y) {
				return zoom;
			}			
			zoom--;
		}

		return zoom;
	},

	_tileShouldBeLoaded: function (tilePoint) {
		var shouldLoad = false;
		var gridSize = this._gridSize[this._roundZoom()];
		if ((tilePoint.x + ':' + tilePoint.y) in this._tiles) {
			shouldLoad = false; // already loaded
		} else {
			shouldLoad = (tilePoint.x >= 0 && tilePoint.x < gridSize.x && tilePoint.y >= 0 && tilePoint.y < gridSize.y);
		}
		
		return shouldLoad;
	},
	
	_roundZoom: function () {
		var gridLevel = Math.round(this._map.getZoom());
		var maxGridSize = this._gridSize.length -1;
		if (gridLevel > maxGridSize) {
			gridLevel = maxGridSize
		}
		return gridLevel;
	},

	_addTile: function (tilePoint, container) {
		var tilePos = this._getTilePos(tilePoint),
			tile = this._getTile(),
			zoom = this._roundZoom(),
			mapZoom = this._map.getZoom(),
			imageSize = this._imageSize[zoom],
			gridSize = this._gridSize[zoom],
			tileSize = this.options.tileSize;
			
		var zoomDiff = this._map.getZoom() + 1 - this._gridSize.length;
		//console.log("--------------------------");
		//console.log("zoom: " + zoom);
		//console.log("mapZoom: " + mapZoom);
		//console.log("zoomDiff: " + zoomDiff);
		var dScale = Math.pow(2,zoomDiff);
		//console.log("dScale: " + dScale);
		
		//console.log("tilePoint.x: " + tilePoint.x);
		//console.log("tilePoint.y: " + tilePoint.y);
		//console.log("gridSize.x: " + gridSize.x);
		//console.log("gridSize.y: " + gridSize.y);

		if (zoomDiff > 0) {
			if (tilePoint.x === gridSize.x - 1) {
				tile.style.width = (imageSize.x - (tileSize * (gridSize.x - 1))) * (dScale) + 'px';
			} 

			if (tilePoint.y === gridSize.y - 1) {
				tile.style.height = (imageSize.y - (tileSize * (gridSize.y - 1))) * (dScale) + 'px';			
			} 
		} else {
			if (tilePoint.x === gridSize.x - 1) {
				tile.style.width = imageSize.x - (tileSize * (gridSize.x - 1)) + 'px';
			} 

			if (tilePoint.y === gridSize.y - 1) {
				tile.style.height = imageSize.y - (tileSize * (gridSize.y - 1)) + 'px';			
			} 
		}

		MVLeaflet.DomUtil.setPosition(tile, tilePos, MVLeaflet.Browser.chrome || MVLeaflet.Browser.android23);

		this._tiles[tilePoint.x + ':' + tilePoint.y] = tile;
		this._loadTile(tile, tilePoint);

		if (tile.parentNode !== this._tileContainer) {
			container.appendChild(tile);
		}
	},
	
	getTileUrl: function (tilePoint) {
		var tileUrl = this._url + 'tilegroup' + this._getTileGroup(tilePoint) + '/' + this._roundZoom() + '-' + tilePoint.x + '-' + tilePoint.y + '.png';
		//console.log(tileUrl);
		return tileUrl;
	},

	_getTileGroup: function (tilePoint) {
		var zoom = this._roundZoom(),
			num = 0,
			gridSize;

		for (z = 0; z < zoom; z++) {
			gridSize = this._gridSize[z];
			num += gridSize.x * gridSize.y; 
		}	

		num += tilePoint.y * this._gridSize[zoom].x + tilePoint.x;
      	return Math.floor(num / 256);
	}

});

MVLeaflet.tileLayer.zoomify = function (url, options) {
	return new MVLeaflet.TileLayer.Zoomify(url, options);
};