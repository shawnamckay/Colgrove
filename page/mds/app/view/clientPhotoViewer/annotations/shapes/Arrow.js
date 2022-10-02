Ext.define('mds.view.clientPhotoViewer.annotations.shapes.Arrow', {
    extend: 'mds.view.clientPhotoViewer.annotations.shapes.Line',
    initConfig:function(config){
        var lineConfig=this.initLineConfig(config);
        var baseShape=Ext.create('mds.view.clientPhotoViewer.annotations.sprites.Arrow', lineConfig);
        this.add("base0", baseShape);
        this.show(true);
    },
    getType:function(){
    	return "arrow";
    }
});
    