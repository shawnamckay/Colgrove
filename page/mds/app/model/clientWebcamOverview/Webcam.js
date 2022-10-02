Ext.define('mds.model.clientWebcamOverview.Webcam', {
  extend: 'Ext.data.Model',
  fields:['WebcamUID', 'WebcamTitle', 'ImageURL'],
  idProperty:'WebcamUID'
});