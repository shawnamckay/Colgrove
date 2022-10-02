
Ext.define('mds.view.clientFileManager.ProjectFileList', {
    extend: 'Ext.view.View',
    alias: 'widget.fmProjectFileList',
    id: 'fmProjectFileList',
    border: true,
    padding: 5,
    cls: 'documentList',
    itemSelector: 'div.document',
    multiSelect: true,
    store: 'clientFileManager.ProjectFiles',
    
    initComponent: function() {
        var me = this;
        
        Ext.applyIf(me, {
            tpl: [
                '<tpl for=".">',
                    '<div class="document">',
                        '<table width="100%">',
                            '<tr width="100%">',
                                '<td rowspan="3" align="left" class="documentSymbol"> <img src="{DocumentSymbol}" /></td><td colspan="2" class="documentFilename">{DocumentFilename}</td><td align="right"></td>',
                             '</tr><tr>',
                             "<tpl if='DocumentMimeType == \"folder\"'>",
                             	'<td></td><td class="documentSize">folder</td><td align="right"></td>',
                             '</tpl>',
                             "<tpl if='DocumentMimeType != \"folder\"'>",
                             	'<td></td><td class="documentSize">{DocumentFileSize:fileSize}</td><td align="right"></td>',
                             '</tpl>',
                             '</tr><tr>',
                                '<td></td><td align="left" > {DocumentCreatorName} updated {DocumentLastEditedDate:date("F d, Y")}</td><td align="right"></td>',
                             '</tr>',
                         '</table>',
                    '</div>',
                '</tpl>'
            ]
        });
        me.callParent(arguments);
    }
});
