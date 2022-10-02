Ext.define('mds.store.clientPhotoViewer.Annotations', {
    extend: 'Ext.data.Store',
    model: 'mds.model.clientPhotoViewer.Annotation',
    autoLoad: false,
    proxy: {
        type: 'jsonp',
        api: {
            create: 'index.cfm?fuseaction=aClientPhotoViewer.addAnnotations',
            read: 'index.cfm?fuseaction=aClientPhotoViewer.getAnnotations',
            update: 'index.cfm?fuseaction=aClientPhotoViewer.updateAnnotations',
            destroy: 'index.cfm?fuseaction=aClientPhotoViewer.deleteAnnotations'
        },
        extraParams: {
            ProjectUID: (Ext.Object.fromQueryString(document.location.search)).ProjectUID
        }
    },
    listeners: {
        load: function(){
            var count=this.count();
            for ( var i=0; i<count; i++){
                this.getAt(i).createShape();
            }
            this.fireEvent("afterload", this);
        }
    },
    removeAt: function(i){
        var annotation=this.getAt(i);
        if (annotation){
            annotation.destroy();
            delete annotation;
        }
        this.callParent(arguments);
    },
    failure: function(batch, options){
        //For some reason, Ext doesn't seem to be setting error messages for my batch operations. For now, a blanket error message...
        Ext.MessageBox.alert('', 'An error occurred while saving annotations.', function(){
            Ext.getStore("clientPhotoViewer.Annotations").fireEvent("aftersave");
        });
    },
    success: function(batch, options){
        Ext.MessageBox.alert('', 'Save was successful.', function(){
            Ext.getStore("clientPhotoViewer.Annotations").fireEvent("aftersave", Ext.getStore("clientPhotoViewer.Annotations"));
        });
    },
    save: function(){
        var me=this;
        me.sync({
            failure: me.failure,
            success: me.success
        });
    },
    hasUnsavedChanges: function(){
        return ((this.getModifiedRecords().length||this.getRemovedRecords().length)?true:false);
    }
});

//sometimes syncs cause an error... this prevents that-- don't know root of problem
Ext.data.Connection.override({
    onStateChange: function(request){
        if (!request.xhr){ return }
        ;
        return this.callParent(arguments);
    }
});