(function() {
  var ZoomifyLayer,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ZoomifyLayer = (function(_super) {
    'Implement Zoomify layer for Cloudmade\'s Leaflet library';
    __extends(ZoomifyLayer, _super);

    function ZoomifyLayer(url, imageProperties, options) {
      if (options == null) {
        options = {};
      }
      this.options = options;
      this.baseUrl = url;
      if (!((imageProperties.width != null) && (imageProperties.height != null))) {
        throw 'width and height must be defined';
      }
      this.imageProperties = {
        width: imageProperties.width,
        height: imageProperties.height,
        tilesize: imageProperties.tilesize || 256,
        tileextension: imageProperties.tileextension || ".png"
      };
      this._initTiers();
      this.options.minZoom = 0;
      this.options.maxZoom = this.numOfTiers() - 1;
    }

    ZoomifyLayer.prototype._getTierForResolution = function(resolution) {
      var lambda;
      lambda = function(x, r) {
        if (r < resolution) {
          return lambda(x + 1, r * 2);
        }
        return x;
      };
      return this.numOfTiers() - lambda(0, 1) - 1;
    };

    ZoomifyLayer.prototype._getSizeForTier = function(tier) {
      var r;
      r = Math.pow(2, this.numOfTiers() - tier - 1);
      return [Math.ceil(this.imageProperties.width / r), Math.ceil(this.imageProperties.height / r)];
    };

    ZoomifyLayer.prototype.onAdd = function(map) {
      var layerSize, offset, r, size, tier;
      ZoomifyLayer.__super__.onAdd.call(this, map);
      size = map.getSize();
      r = Math.max(Math.ceil(this.imageProperties.width / size.x), Math.ceil(this.imageProperties.height / size.y));
      tier = this._getTierForResolution(r);
      layerSize = this._getSizeForTier(tier);
      offset = [(size.x - layerSize[0]) / 2, (size.y - layerSize[1]) / 2];
      window.ll = map.options.crs.pointToLatLng(new L.Point(size.x / 2 - offset[0], size.y / 2 - offset[1]), tier);
      return map.setView(ll, tier);
    };

    ZoomifyLayer.prototype._createTile = function() {
      var tile;
      tile = document.createElement('img');
      tile.setAttribute('class', 'leaflet-tile');
      tile.onselectstart = tile.onmousemove = L.Util.falseFn;
      return tile;
    };

    ZoomifyLayer.prototype._addTilesFromCenterOut = function(bounds) {
      var center, fragment, i, j, point, queue, tilesToLoad, _i, _j, _k, _ref, _ref1, _ref2, _ref3;
      queue = [];
      center = bounds.getCenter();
      for (j = _i = _ref = bounds.min.y, _ref1 = bounds.max.y; _ref <= _ref1 ? _i <= _ref1 : _i >= _ref1; j = _ref <= _ref1 ? ++_i : --_i) {
        for (i = _j = _ref2 = bounds.min.x, _ref3 = bounds.max.x; _ref2 <= _ref3 ? _j <= _ref3 : _j >= _ref3; i = _ref2 <= _ref3 ? ++_j : --_j) {
          point = new L.Point(i, j);
          if (this._tileShouldBeLoaded(point)) {
            queue.push(point);
          }
        }
      }
      tilesToLoad = queue.length;
      if (tilesToLoad === 0) {
        return;
      }
      queue.sort(function(a, b) {
        return a.distanceTo(center) - b.distanceTo(center);
      });
      fragment = document.createDocumentFragment();
      if (!this._tilesToLoad) {
        this.fire('loading');
      }
      this._tilesToLoad += tilesToLoad;
      for (i = _k = 0; 0 <= tilesToLoad ? _k < tilesToLoad : _k > tilesToLoad; i = 0 <= tilesToLoad ? ++_k : --_k) {
        this._addTile(queue[i], fragment);
      }
      return this._tileContainer.appendChild(fragment);
    };

    ZoomifyLayer.prototype._tileShouldBeLoaded = function(point) {
      var tier;
      if (point.x >= 0 && point.y >= 0) {
        tier = this._getZoomForUrl();
        return point.x <= this._tiers[tier][0] && point.y <= this._tiers[tier][1];
      }
      return false;
    };

    ZoomifyLayer.prototype._getTilePos = function(tilePoint) {
      var origin;
      origin = this._map.getPixelOrigin();
      return tilePoint.multiplyBy(this.imageProperties.tilesize).subtract(origin);
    };

    ZoomifyLayer.prototype._update = function(e) {
      var bounds, nwTilePoint, seTilePoint, tileBounds, tileSize, zoom;
      if (this._map == null) {
        return;
      }
      bounds = this._map.getPixelBounds();
      zoom = this._map.getZoom();
      tileSize = this.imageProperties.tilesize;
      if (zoom > this.options.maxZoom || zoom < this.options.minZoom) {
        return;
      }
      nwTilePoint = new L.Point(Math.floor(bounds.min.x / tileSize), Math.floor(bounds.min.y / tileSize));
      seTilePoint = new L.Point(Math.floor(bounds.max.x / tileSize), Math.floor(bounds.max.y / tileSize));
      tileBounds = new L.Bounds(nwTilePoint, seTilePoint);
      this._addTilesFromCenterOut(tileBounds);
      if (this.options.unloadInvisibleTiles || this.options.reuseTiles) {
        return this._removeOtherTiles(tileBounds);
      }
    };

    ZoomifyLayer.prototype._initTiers = function() {
      var hf, i, scaledTileSize, x, y, _ref;
      hf = function(size, tilesize, k) {
        if (size % tilesize / k < 1) {
          return Math.floor(size / tilesize);
        }
        return Math.ceil(size / tilesize);
      };
      this._tiers = [];
      scaledTileSize = this.imageProperties.tilesize / 2;
      _ref = [-1, 3, 2], i = _ref[0], x = _ref[1], y = _ref[2];
      while (Math.max(x, y) > 1) {
        i += 1;
        scaledTileSize *= 2;
        x = hf(this.imageProperties.width, scaledTileSize, i + 1);
        y = hf(this.imageProperties.height, scaledTileSize, i + 1);
        this._tiers.push([x - 1, y - 1, x * y]);
      }
      this._tiers.reverse();
      return this._numOfTiers = i + 1;
    };

    ZoomifyLayer.prototype.numOfTiers = function() {
      var a, i;
      if (this._numOfTiers == null) {
        i = 0;
        a = Math.ceil(Math.max(this.imageProperties.width, this.imageProperties.height) / this.imageProperties.tilesize);
        while (a > 1) {
          i += 1;
          a = Math.ceil(a / 2);
        }
        this._numOfTiers = i + 1;
        this._numOfTiers = i;
      }
      return this._numOfTiers;
    };

    ZoomifyLayer.prototype._tileGroupNumber = function(x, y, tier) {
      var height, i, idx, numOfTiers, tileSize, width, _i;
      numOfTiers = this.numOfTiers();
      width = this.imageProperties.width;
      height = this.imageProperties.height;
      tileSize = this.imageProperties.tilesize;
      idx = 0;
      for (i = _i = 0; 0 <= tier ? _i < tier : _i > tier; i = 0 <= tier ? ++_i : --_i) {
        idx += this._tiers[i][2];
      }
      idx += y * this._tiers[tier][0] + x;
      return Math.floor(idx / 256);
    };

    ZoomifyLayer.prototype._getZoomForUrl = function() {
      var zoom;
      if (this.imageProperties != null) {
        zoom = this._map.getZoom();
        return zoom;
      }
      return 0;
    };

    ZoomifyLayer.prototype._adjustTilePoint = function(tilePoint) {
      return tilePoint;
    };

    ZoomifyLayer.prototype.getTileUrl = function(tilePoint, zoom) {
      var tileGroup, x, y, z;
      x = tilePoint.x;
      y = tilePoint.y;
      z = this._getZoomForUrl();
      tileGroup = this._tileGroupNumber(x, y, z);
      return this.baseUrl + ("TileGroup" + tileGroup + "/" + z + "-" + x + "-" + y + ".jpg");
    };

    return ZoomifyLayer;

  })(L.TileLayer);

  window.ZoomifyLayer = ZoomifyLayer;

}).call(this);