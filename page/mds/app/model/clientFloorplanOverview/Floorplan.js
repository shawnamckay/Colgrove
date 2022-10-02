Ext.define('mds.model.clientFloorplanOverview.Floorplan', {
  extend: 'Ext.data.Model',
  fields:['FloorplanUID', 'ImageURL', 'ProjectShootTypeLabel', 'FloorplanDescription'],
  idProperty:'FloorplanUID'
});