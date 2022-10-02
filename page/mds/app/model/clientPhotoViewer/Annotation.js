Ext.define('mds.model.clientPhotoViewer.Annotation', {
  extend: 'Ext.data.Model',
  fields:[
    { name:'AnnotationUID', type:'string'},
    { name:'Type', type:'string'},
    { name:'Attr0', type:'auto', defaultValue: undefined},
    { name:'Attr1', type:'auto', defaultValue: undefined},
    { name:'Attr2', type:'auto', defaultValue: undefined},
    { name:'Attr3', type:'auto', defaultValue: undefined},
    { name:'Attr4', type:'auto', defaultValue: undefined},
    { name:'Attr5', type:'auto', defaultValue: undefined},
    { name:'Attr6', type:'auto', defaultValue: undefined},
    { name:'Attr7', type:'auto', defaultValue: undefined},
    { name:'Attr8', type:'auto', defaultValue: undefined},
    { name:'Attr9', type:'auto', defaultValue: undefined},
    { name:'Attr10', type:'auto', defaultValue: undefined},
    { name:'Attr11', type:'auto', defaultValue: undefined},
    { name:'ShareTypeID', type:'numeric', defaultValue: 1},
    { name:'MemberUIDArray', type:'array', defaultValue: []},
    { name:'ReadOnly', type:'boolean', defaultValue: false}
  ],
  idProperty: "AnnotationUID",
  setShape:function(shape){
	  this.shape=shape;
	  this.set("Type", shape.getType());
	  this.updateFields();
	  shape.addListener("datachanged", this.updateFields, this);
  },
  updateFields:function(){
      for (var i=0; i<this.shape.shapeAttributes.length; i++){
		  this.set("Attr"+i, this.shape.getAttribute(this.shape.shapeAttributes[i]));
	  }
  },
  destroy:function(){
	  this.shape.destroy();
  },
  createShape:function(){
      var config={};
      config.model=this;
      var type=this.get("Type");
      var uppercaseType=type.substring(0, 1).toUpperCase()+type.substring(1); //had to change names of files to uppercase
      this.shape=Ext.create('mds.view.clientPhotoViewer.annotations.shapes.'+uppercaseType, config);
      this.shape.addListener("datachanged", this.updateFields, this);
  }
});
//@ sourceURL=annotationModel.js