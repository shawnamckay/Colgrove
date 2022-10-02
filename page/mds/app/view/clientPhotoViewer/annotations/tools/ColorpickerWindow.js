Ext.define("mds.view.clientPhotoViewer.annotations.tools.ColorpickerWindow", {
    extend: 'mds.view.clientPhotoViewer.annotations.tools.PropertyWindow',
    id: 'annotationsColorpickerWindow',
    title: 'Stroke Colour',
    items:[
        {
        	xtype: 'colorpicker',
        	id: 'annotationsColorpicker'
        }
    ]
});
