MVLeaflet.Control.ZoomMin = MVLeaflet.Control.Zoom.extend({
  options: {
    position: "topleft",
    zoomInText: "+",
    zoomInTitle: "Zoom in",
    zoomOutText: "-",
    zoomOutTitle: "Zoom out",
    zoomMinText: "Zoom min",
    zoomMinTitle: "Zoom min"
  },

  onAdd: function (map) {
    var zoomName = "leaflet-control-zoom"
      , container = MVLeaflet.DomUtil.create("div", zoomName + " leaflet-bar")
      , options = this.options

    this._map = map

    this._zoomInButton = this._createButton(options.zoomInText, options.zoomInTitle,
     zoomName + '-in', container, this._zoomIn, this)

    this._zoomOutButton = this._createButton(options.zoomOutText, options.zoomOutTitle,
     zoomName + '-out', container, this._zoomOut, this)

    this._zoomMinButton = this._createButton(options.zoomMinText, options.zoomMinTitle,
     zoomName + '-min', container, this._zoomMin, this)

    this._updateDisabled()
    map.on('zoomend zoomlevelschange', this._updateDisabled, this)

    return container
  },

  _zoomMin: function () {
    this._map.setZoom(this._map.getMinZoom())
  },

  _updateDisabled: function () {
    var map = this._map
      , className = "leaflet-disabled"

    MVLeaflet.DomUtil.removeClass(this._zoomInButton, className)
    MVLeaflet.DomUtil.removeClass(this._zoomOutButton, className)
    MVLeaflet.DomUtil.removeClass(this._zoomMinButton, className)

    if (map._zoom === map.getMinZoom()) {
      MVLeaflet.DomUtil.addClass(this._zoomOutButton, className)
    }

    if (map._zoom === map.getMaxZoom()) {
      MVLeaflet.DomUtil.addClass(this._zoomInButton, className)
    }

    if (map._zoom === map.getMinZoom()) {
      MVLeaflet.DomUtil.addClass(this._zoomMinButton, className)
    }
  }
})