/*
  Copyright (c) 2012 Eric S. Theise
  
  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated 
  documentation files (the "Software"), to deal in the Software without restriction, including without limitation the 
  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit 
  persons to whom the Software is furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the 
  Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE 
  WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR 
  COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR 
  OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
    
MVLeaflet.Rrose = MVLeaflet.Popup.extend({

  _initLayout:function () {
    var prefix = 'leaflet-rrose',
      container = this._container = MVLeaflet.DomUtil.create('div', prefix + ' ' + this.options.className + ' leaflet-zoom-animated'),
      closeButton, wrapper;

    if (this.options.closeButton) {
      closeButton = this._closeButton = MVLeaflet.DomUtil.create('a', prefix + '-close-button', container);
      closeButton.href = '#close';
      closeButton.innerHTML = '&#215;';

      MVLeaflet.DomEvent.on(closeButton, 'click', this._onCloseButtonClick, this);
    }

    // Set the pixel distances from the map edges at which popups are too close and need to be re-oriented.
    var x_bound = 160, y_bound = 280;
    // Determine the alternate direction to pop up; north mimics Leaflet's default behavior, so we initialize to that.
    this.options.position = 'n';
    // Then see if the point is too far north...
    var y_diff = y_bound - this._map.latLngToContainerPoint(this._latlng).y;
    if (y_diff > 0) {
      this.options.position = 's'
    }
    // or too far east...
    var x_diff = this._map.latLngToContainerPoint(this._latlng).x - (this._map.getSize().x - x_bound);
    if (x_diff > 0) {
      this.options.position += 'w'
    } else {
    // or too far west.
      x_diff = x_bound - this._map.latLngToContainerPoint(this._latlng).x;
      if (x_diff > 0) {
        this.options.position += 'e'
      }
    }

    // Create the necessary DOM elements in the correct order. Pure 'n' and 's' conditions need only one class for styling, others need two.
    if (/s/.test(this.options.position)) {
      if (this.options.position === 's') {
        this._tipContainer = MVLeaflet.DomUtil.create('div', prefix + '-tip-container', container);
        wrapper = this._wrapper = MVLeaflet.DomUtil.create('div', prefix + '-content-wrapper', container);
      } 
      else {
        this._tipContainer = MVLeaflet.DomUtil.create('div', prefix + '-tip-container' + ' ' + prefix + '-tip-container-' + this.options.position, container);
        wrapper = this._wrapper = MVLeaflet.DomUtil.create('div', prefix + '-content-wrapper' + ' ' + prefix + '-content-wrapper-' + this.options.position, container);
      }
      this._tip = MVLeaflet.DomUtil.create('div', prefix + '-tip' + ' ' + prefix + '-tip-' + this.options.position, this._tipContainer);
      MVLeaflet.DomEvent.disableClickPropagation(wrapper);
      this._contentNode = MVLeaflet.DomUtil.create('div', prefix + '-content', wrapper);
      MVLeaflet.DomEvent.on(this._contentNode, 'mousewheel', MVLeaflet.DomEvent.stopPropagation);
    } 
    else {
      if (this.options.position === 'n') {
        wrapper = this._wrapper = MVLeaflet.DomUtil.create('div', prefix + '-content-wrapper', container);
        this._tipContainer = MVLeaflet.DomUtil.create('div', prefix + '-tip-container', container);
      } 
      else {
        wrapper = this._wrapper = MVLeaflet.DomUtil.create('div', prefix + '-content-wrapper' + ' ' + prefix + '-content-wrapper-' + this.options.position, container);
        this._tipContainer = MVLeaflet.DomUtil.create('div', prefix + '-tip-container' + ' ' + prefix + '-tip-container-' + this.options.position, container);
      }
      MVLeaflet.DomEvent.disableClickPropagation(wrapper);
      this._contentNode = MVLeaflet.DomUtil.create('div', prefix + '-content', wrapper);
      MVLeaflet.DomEvent.on(this._contentNode, 'mousewheel', MVLeaflet.DomEvent.stopPropagation);
      this._tip = MVLeaflet.DomUtil.create('div', prefix + '-tip' + ' ' + prefix + '-tip-' + this.options.position, this._tipContainer);
    }

  },

  _updatePosition:function () {
    var pos = this._map.latLngToLayerPoint(this._latlng),
      is3d = MVLeaflet.Browser.any3d,
      offset = this.options.offset;

    if (is3d) {
      MVLeaflet.DomUtil.setPosition(this._container, pos);
    }

    if (/s/.test(this.options.position)) {
      this._containerBottom = -this._container.offsetHeight - offset.y - 10 - (is3d ? 0 : pos.y);
    } else {
      this._containerBottom = + offset.y - (is3d ? 0 : pos.y);
    }

    if (/e/.test(this.options.position)) {
      this._containerLeft = offset.x + (is3d ? 0 : pos.x);
    } 
    else if (/w/.test(this.options.position)) {
      this._containerLeft = -Math.round(this._containerWidth) + offset.x + (is3d ? 0 : pos.x);
    } 
    else {
      this._containerLeft = -Math.round(this._containerWidth / 2) + offset.x + (is3d ? 0 : pos.x);
    }

    if (!/s/.test(this.options.position)) {
        this._container.style.bottom = this._containerBottom + 'px';
    } else {
        this._container.style.top = '15px';
    }
    this._container.style.left = this._containerLeft + 'px';
  }

});
