var itemTpl = new Ext.XTemplate(
        '<tpl for=".">' +
            '<div class="commentContainer" id="{commentEntryID:this.commentID}">' +
                '<div class="commentText">' +
                    '<span class="commentMemberName">{commentEntryMemberName}:</span>&nbsp;{commentEntryText}' +
                '</div>' +
                '<div class="commentFooter">' +
                    '<span class="commentDate">{commentEntryDateTime:this.dateFormat} {commentEntryDateTime:this.timeFormat}</span>' +
                '</div>' +
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
            timeFormat: function(value) {
                var dt = new Date(value);
                if (!dt) {
                    return '';
                }
                return Ext.Date.format(dt, 'g:i a');
            },
            memberCanDelete: function(values){
                if(values.memberCanEdit){
                  return  '<div class="deleteCommentButton" title="Delete this comment">X</div>';
                }
            },
            commentID: function(value){
                return  'ceid_' + value;
            },
            commentShareType: function(value){
                switch(value){
                    case 1:
                        return 'team';
                        break;
                    case 2:
                        return 'me';                    
                        break;
                    case 3:
                        return 'custom';                    
                        break;
                }
            }
        }
        );
        
Ext.define('mds.view.clientPhotoViewer.sidebar.vComments', {
    extend: 'Ext.container.Container',
    xtype: 'pvComments',
    style:{'background-color':'#fff'},
    flex:1,
    config:{
        items: [
            {
                xtype:'container',
                id:'pvComments',
                layout:'vbox',
                items: [
                    {
                        xtype: 'dataview',
                        id:'pvCommentDataview',
                        tpl:itemTpl,
                        listeners:{
                            click : {
                                fn: function(e, t) {
                                    var thumbEl = Ext.get(t);
                                    mds.app.getController("clientPhotoViewer.Controller").disableSlideshow();
                                    if(thumbEl.hasCls('deleteCommentButton')){
                                        mds.app.getController("clientPhotoViewer.Comments").deleteComment(e,t);
                                    }
                                },
                                element: 'el',
                                delegate:':any(.deleteCommentButton)',
                                scope: this
                            }
                        },
                        data:[],
                        itemSelector: 'x'
                    }
                ]
            }
        ]
    }
});