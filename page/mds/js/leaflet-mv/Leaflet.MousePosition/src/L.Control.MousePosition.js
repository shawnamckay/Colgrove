MVLeaflet.Control.MousePosition = MVLeaflet.Control.extend({
  options: {
    position: 'bottomleft',
    separator: ' : ',
    emptyString: 'Unavailable',
    lngFirst: false,
    numDigits: 5,
    lngFormatter: undefined,
    latFormatter: undefined,
    prefix: ""
  },

  onAdd: function (map) {
    this._container = MVLeaflet.DomUtil.create('div', 'leaflet-control-mouseposition');
    MVLeaflet.DomEvent.disableClickPropagation(this._container);
    map.on('mousemove', this._onMouseMove, this);
    this._container.innerHTML2=this.options.emptyString;
    return this._container;
  },

  onRemove: function (map) {
    map.off('mousemove', this._onMouseMove);
  },

  _onMouseMove: function (e) {
    var lng = this.options.lngFormatter ? this.options.lngFormatter(e.latlng.lng) : MVLeaflet.Util.formatNum(e.latlng.lng, this.options.numDigits);
    var lat = this.options.latFormatter ? this.options.latFormatter(e.latlng.lat) : MVLeaflet.Util.formatNum(e.latlng.lat, this.options.numDigits);
    var value = this.options.lngFirst ? lng + this.options.separator + lat : lat + this.options.separator + lng;
    var prefixAndValue = this.options.prefix + ' ' + value;
    this._container.innerHTML2 = prefixAndValue;
  }

});

MVLeaflet.Map.mergeOptions({
    positionControl: false
});

MVLeaflet.Map.addInitHook(function () {
    if (this.options.positionControl) {
        this.positionControl = new MVLeaflet.Control.MousePosition();
        this.addControl(this.positionControl);
    }
});

MVLeaflet.control.mousePosition = function (options) {
    return new MVLeaflet.Control.MousePosition(options);
};
