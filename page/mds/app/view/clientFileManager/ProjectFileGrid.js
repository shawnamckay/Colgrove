Ext.define('mds.view.clientFileManager.ProjectFileGrid', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.fmProjectFileGrid',
    id: 'fmProjectFileGrid',
    //multiSelect: true,
    store: 'clientFileManager.ProjectFiles',
    rootVisible: false,
    sortOnLoad: true,
    rowLines: true,
    viewConfig: {
        loadMask: true,
        plugins: {
            ptype: 'treeviewdragdrop',
            ddGroup: 'reParent',
            enableDrag: true,
            enableDrop: true,
            appendOnly: true
        },

        getRowClass: function(record, index){
            var p=record.get('PushpinCount');
            if (p>0){
                return 'has-pins';
            } else{
                return 'has-no-pins';
            }
        },

        listeners: {
            cellclick: function(view, cell, cellIndex, record, row, rowIndex, e){
                var linkClicked=(e.getTarget(null, 1, true).hasCls('x-file-icon')||e.getTarget(null, 1, true).hasCls('x-file-name'));
                // var clickedDataIndex = view.panel.headerCt.getHeaderAtIndex(cellIndex).dataIndex;
                if (linkClicked){
                    this.up('fmProjectFileGrid').getSelectionModel().deselectAll();
                    this.up('fmProjectFileGrid').fireEvent('fileclicked', record);
                }
            },
            beforedrop: function(node, data, overModel, dropPos, dropFunc, opts){
                if (overModel.get('isFolder')){
                    this.droppedRecords=data.records;
                    data.records=[];
                } else{
                    this.droppedRecords=[];
                    data.records=[];
                }
            },
            drop: function(node, data, overModel, dropPos, opts){
                Ext.iterate(this.droppedRecords, function(record){
                    record.set('DocumentParent', overModel.get('DocumentID'));
                });
                this.up('fmProjectFileGrid').fireEvent('dropsuccess');
                this.droppedRecords=undefined;
            },
            nodedragover: function(targetNode, position, dragData){
                if (!targetNode.get('isFolder')){
                    return false;
                } else{
                    var isGoodParent=true;
                    Ext.iterate(dragData.records, function(record){
                        if (targetNode.get('DocumentID')==record.get('DocumentID')||targetNode.get('DocumentParent')==record.get('DocumentID')){
                            isGoodParent=false;
                        }
                    });
                    return isGoodParent;
                }
            }
        }
    },
    columns: [{
        text: '',
        width: 40,
        sortable: false,
        hideable: false,
        menuDisabled: true,
        renderer: function(value){
            return '<img class="x-file-icon" src="'+value+'">';
        },
        dataIndex: 'DocumentSymbol'
    }, {
        text: 'File name',
        dataIndex: 'DocumentFilename',
        flex: 1,
        renderer: function(value){
            return '<a class="x-file-name">'+value+'</a>';
        }
    }, {
        text: 'Details',
        xtype: 'actioncolumn',
        tdCls: 'x-edit-cell',
        sortable: false,
        hideable: false,
        menuDisabled: true,
        hidden: false,
        width: 50,
        renderer: function(value, metaData, record){
            if (record.get('DocumentIsDeleted')){
                this.items[0].icon='';
                this.items[0].tooltip='';
            } else{
                this.items[0].icon='mds/module/clientFileManager/image/icons/edit.png';
                this.items[0].tooltip='File Details';
            }
        }
    }, {
        text: 'Locations',
        xtype: 'actioncolumn',
        dataIndex: 'PushpinCount',
        width: 60,
        tdCls: 'x-pinned-cell',
        renderer: function(value){
            var val='';
            if (value>0){
                this.items[0].icon='mds/module/clientFileManager/image/pin_fileGrid.png';
                this.items[0].tooltip='This file is attached to '+value+' hotspot(s)';
                if (value<10){
                    val='&nbsp;'+value;
                } else{
                    val=value;
                }
            } else{
                this.items[0].icon='';
                this.items[0].tooltip='';
            }
            return val;
        }
    }, {
        text: 'Updated date',
        dataIndex: 'DocumentLastEditedDate',
        format: "F d, Y - g:i a",
        xtype: "datecolumn",
        width: 180
    }, {
        text: 'Created by',
        dataIndex: 'DocumentCreatorName',
        width: 120
    }, {
        text: 'File type',
        dataIndex: 'DocumentTypeName'
    }, {
        text: 'Size',
        dataIndex: 'DocumentFileSize',
        renderer: Ext.util.Format.fileSize
    }],

    initComponent: function(){
        var me=this;

        me.callParent(arguments);

    }
});

//@ sourceURL=ProjectFileGrid.js
