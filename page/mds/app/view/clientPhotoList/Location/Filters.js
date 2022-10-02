Ext.define('mds.view.clientPhotoList.Location.Filters', {
    extend: 'Ext.view.View',
    alias: 'widget.locationFilters',
    id: 'locationFilters',
    store: 'clientPhotoList.Locations',
    itemSelector: 'div.location',
    margin: "0 0 0 10px",
    tpl: new Ext.XTemplate(
      '<tpl for=".">',
        '<div class="location"><input type="checkbox" value="{Location}" onclick="this.checked=(this.checked)?false:true;"> {Location}</div>',
      '</tpl>'
    )
});