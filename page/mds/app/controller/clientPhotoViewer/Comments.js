Ext.define('mds.controller.clientPhotoViewer.Comments', {
    extend: 'Ext.app.Controller',
    views: ['clientPhotoViewer.sidebar.vComments'],
    stores: ['clientPhotoViewer.Comments'],
    refs: [{
        ref: 'tplCommentDataview',
        selector: '#pvCommentDataview'
    }, {
        ref: 'txtComment',
        selector: '#txtComment'
    }, {
        ref: 'newCommentShareMemberButton',
        selector: '#newCommentShareMemberButton'
    }, {
        ref: 'commentAddButton',
        selector: '#commentAddButton'
    }],
    _defaultCommentText: 'Write a Comment ...',
    _commentTextMaxLength: 255

    ,
    init: function(){

        this.control({
            '#txtComment': {
                afterrender: function(cmp){
                    cmp.setValue(this._defaultCommentText);
                },
                focus: function(cmp, evtObj){
                    mds.app.getController("clientPhotoViewer.Controller").disableSlideshow();
                    if (cmp.getValue()==this._defaultCommentText){
                        cmp.setValue('');
                    }
                }
            }
        });
    },
    loadComments: function(){
        var commentStore=mds.app.getController("clientPhotoViewer.Controller")._selectedRecord.getCommentStore();
        var dataview=this.getTplCommentDataview();
        commentStore.sort('commentEntryDateTime', 'ASC');
        var rawData=[];
        commentStore.each(function(model, index){
            rawData[index]=model.data;
        });
        dataview.update(rawData);
        if (commentStore.getCount()>0){
            this.loadCommentShareButton();
        }
    },
    loadCommentShareButton: function(){
        var shareButton=null;
        var commentEl=null;
        var commentID=null;
        var comment=null;
        var commentStore=null;
        var qRecords=[];
        var commentElArray=Ext.query('.commentPermissions');

        if (commentElArray.length>0&&mds.app.getController("clientPhotoViewer.Controller")._selectedRecord!=null){

            commentStore=mds.app.getController("clientPhotoViewer.Controller")._selectedRecord.getCommentStore();

            Ext.Array.each(commentElArray, function(commentElement, index){
                var controller=mds.app.getController("clientPhotoViewer.Comments");
                var mainController=mds.app.getController("clientPhotoViewer.Controller");
                commentEl=Ext.get(commentElement);
                commentID=commentEl.parent('.commentContainer').id.split('_')[1];
                qRecords=commentStore.queryBy(function(record, id){
                    return record.get('commentEntryID')==commentID;
                });
                if (qRecords.getCount()){
                    comment=qRecords.getAt(0);
                }
                commentEl.setHTML('&nbsp;');
                //IF USER HAS READ PERMISSIONS DISPALY ICON IN PLACE OF BUTTON
                switch (comment.get('commentEntryShareTypeID')){
                    case 1:
                        commentEl.addCls('team');
                        break;
                    case 2:
                        commentEl.addCls('me');
                        break;
                    case 3:
                        commentEl.addCls('custom');
                        break;
                }
            });
        }
    },
    handleCommentShareEdit: function(shareObject){
        var mainController=mds.app.getController("clientPhotoViewer.Controller");
        var comment=this.getComment(shareObject.owner);
        comment.set('commentEntryShareTypeID', shareObject.selectedShareType);
        comment.set('commentMemberShareList', shareObject.selectedMemberList);
        comment.save({
            success: function(record, operation){
                if (operation.action=='update'){
                    mainController.loadThumbData();
                    this.loadComments();
                }
            },
            failure: function(record, operation){
                Ext.Msg.alert('Error!', 'Ooops. Your comment was not updated successfully.');
            },
            scope: this
        });
    },
    saveComment: function(button){
        var mainController=mds.app.getController("clientPhotoViewer.Controller");
        var commentStore=mainController._selectedRecord.getCommentStore();
        var commentType='photo';
        var newThread=true;
        var shareMemberButtonComponent=this.getNewCommentShareMemberButton();
        var MemberUIDList=[];

        //DISABLE BUTTON TO STOP MULTIPLE CLICKS
        button.setDisabled(true);

        if (mainController._selectedRecord.get('commentThreadID')>0){
            newThread=false;
        }
        if (mainController._selectedRecord.get('isUDEF')){
            commentType='udefphoto';
        } else if (mainController._selectedRecord.get('isWebcam')){
            commentType='webcamphoto';
        }
        if (shareMemberButtonComponent.getSelectedMemberArray().length>0){
            Ext.Array.each(shareMemberButtonComponent.getSelectedMemberArray(), function(model, index){
                MemberUIDList.push(model.get('MemberUID'));
            });
        }
        //VALIDATE:
        //  COMMENT IS NOT DEFAULT TEXT
        //  COMMENT LENGTH < MAX LENGTH
        //  COMMENT LENGTH > 0
        if (this.getTxtComment().value!=this._defaultCommentText&&this.getTxtComment().getValue().length<=this._commentTextMaxLength&&this.getTxtComment().getValue().length>0){
            //CREATE NEW COMMENT
            comment=Ext.create('mds.model.clientPhotoViewer.Comment', {
                commentType: commentType,
                commentThreadID: mainController._selectedRecord.get('commentThreadID'),
                commentEntryID: 0,
                commentEntryShareTypeID: shareMemberButtonComponent.getSelectedShareType(),
                commentEntryText: this.getTxtComment().getValue(),
                commentMemberShareList: MemberUIDList,
                projectUID: mainController._projectUID,
                photoID: mainController._selectedRecord.get('photoID'),
                UDEFphotoUID: mainController._selectedRecord.get('UDEFPhotoUID'),
                webcamphotoUID: mainController._selectedRecord.get('WebcamPhotoUID')
            });
            //SAVE COMMENT
            comment.save({
                success: function(record, operation){
                    if (operation.action=='create'){
                        mainController._selectedRecord.getCommentStore().add(record);
                        mainController._selectedRecord.set('commentCount', mainController._selectedRecord.getCommentStore().getCount());
                        mainController.loadThumbData();
                        this.loadComments();
                        this.getTxtComment().setValue(this._defaultCommentText);
                        if (newThread){
                            mainController._selectedRecord.set('commentThreadID', record.get('commentThreadID'));
                        }
                        button.setDisabled(false);
                    }
                },
                failure: function(record, operation){
                    Ext.Msg.alert('Error!', 'Ooops. Your comment was not added successfully.');
                },
                scope: this
            });
        } else{
            Ext.Msg.alert('Error!', 'Ooops. Please enter a comment in the area provided. Comments are limited to '+this._commentTextMaxLength+' characters.');
            this.getCommentAddButton().setDisabled(false);
        }
    },
    deleteComment: function(event, el){
        var mainController=mds.app.getController("clientPhotoViewer.Controller");
        var id=Ext.get(el).parent('.commentContainer').id.split('_')[1];
        var comment=this.getComment(id);
        comment.set('commentIsDeleted', 1);
        comment.save({
            success: function(record, operation){
                if (operation.action=='update'){
                    mainController._selectedRecord.getCommentStore().remove(record);
                    mainController._selectedRecord.set('commentCount', mainController._selectedRecord.getCommentStore().getCount());
                    mainController.loadThumbData();
                    this.loadComments();
                }
            },
            failure: function(record, operation){
                Ext.Msg.alert('Error!', 'Ooops. Your comment was not deleted successfully.');
            },
            scope: this
        });
    },
    getComment: function(commentid){
        var mainController=mds.app.getController("clientPhotoViewer.Controller");
        var commentStore=mainController._selectedRecord.getCommentStore();
        var qRecords=commentStore.queryBy(function(record, id){
            return record.get('commentEntryID')==commentid;
        });
        if (qRecords.getCount()){ return qRecords.getAt(0); }
    }
});
//@ sourceURL=CommentsController.js