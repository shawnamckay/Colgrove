var itemTpl = new Ext.XTemplate(
        '<tpl for=".">' +
        '<div class="thumbContainer {tmbSelected:this.isTmbSelected} {isSelected:this.isChecked}" id="tmb_{storePosition}">' +
            '<div class="annotation" {hasAnnotations:this.hasAnnotations} title="Photo has annotations"></div>' +
            '<div class="comment" {[this.hasComments(values)]} title="Photo has {commentCount} comment(s)" ><span>{commentCount}</span></div>' +
            '<img src="{tmb}" alt="" title="{dateTaken:this.dateFormat} &#13;{[this.getPhotoDescription(values)]} " class="imgTmb"' + 
            'onload="(function(el){if(el.width>el.height){Ext.get(Ext.get(el).findParent(\'.thumbContainer\')).addCls(\'landscape\')}else{Ext.get(Ext.get(el).findParent(\'.thumbContainer\')).addCls(\'portrait\')}})(this);"  />' +
        '</div>' +
        '</tpl>'
        ,{
            dateFormat: function(value) {
                var dt = new Date(value);
                if (!dt) {
                    return '';
                }
                return Ext.Date.format(dt, 'F j, Y');
            },
            isSelected:function(values){
                if(values.isSelected){
                    return 'checked="checked"';
                }else{
                    return ;
                }
            },
            isChecked:function(value){
                if(value){
                    return 'thumbChecked';
                }else{
                    return ;
                }
            },
            isTmbSelected:function(value){
                if(value){
                    return 'thumbSelected';
                }else{
                    return ;
                }
            },
            hasAnnotations:function(value){
                if(value > 0){
                    return 'style="display:inline;"';
                }else{
                    return 'style="display:none;"';
                }
            },
            hasComments:function(values){
                if(values.commentCount > 0 && values.hasAnnotations > 0){
                    return 'style="display:inline;left:25px !important;"';
                }
                else if(values.commentCount > 0 && !values.hasAnnotations){
                    return 'style="display:inline;left:5px !important;"';
                }else{
                    return 'style="display:none;"';
                }
            },
            getPhotoDescription:function(values){
            	var photoGroupType=mds.app.getController("clientPhotoViewer.Controller")._photoGroupType;
            	if (photoGroupType=='W' || photoGroupType=='C')
            		return Ext.Date.format(values.dateTaken, "g:i A");
            	else
            		return "Photo "+values.photoIndex;
            }
        });

Ext.define('mds.view.clientPhotoViewer.vThumbs', {
    extend: 'Ext.container.Container'
    ,xtype : 'pvPhotoThumbs'
    ,id : 'pvPhotoThumbs'
    ,layout:'auto'
    ,tpl:itemTpl
    ,style:{margin:'10px 0 0 0'}
    ,listeners:{
        click : {
            fn: function(e,t) {
                var mainController = mds.app.getController('clientPhotoViewer.Controller');
                mainController.disableSlideshow();
                var thumbEl = Ext.get(t);
                if(thumbEl.hasCls('thumbContainer')){mainController.thumbClick(e,t);}
                else if(thumbEl.hasCls('favStar')){mainController.thumbFavorite(e,t);}
                else if(thumbEl.hasCls('tmbChk')){mainController.thumbCheckbox(e,t);}
            },
            element: 'el',
            delegate:':any(.thumbContainer|.favStar|.tmbChk|.checkboxWrap)',
            scope: this
        },        
        mouseover : {
            fn: function(e, t) {
                Ext.fly(t).addCls('thumbHover');
            },
            element: 'el',
            delegate:'.thumbContainer',
            scope: this
        },
        mouseout : {
            fn: function(e, t) {
                Ext.fly(t).removeCls('thumbHover');
            },
            element: 'el',
            delegate:'.thumbContainer',
            scope: this
        }
    }
});
//@ sourceURL=PhotoViewerThumbs.js