Ext.define('mds.view.clientPhotoList.Album.AddPhotosToAlbumWindow', {
    extend: 'Ext.window.Window',
    id: "addPhotosToAlbumWindow",
    title: 'Add Photos To Album',
    layout: {
        type: 'vbox',
        align: 'stretchmax'
    },
    modal: true,
    bodyPadding: 5,
    items: [{
        xtype: 'radiogroup',
        layout: 'vbox',
        id: 'albumExistingOrNewOption',
        defaults: {
            name: 'albumExistingOrNewOption'
        },
        items: [{
            inputValue: 'new',
            boxLabel: 'New Album',
            checked: true,
            listeners: {
                change: function(radioBtn, newValue, oldValue){
                    if (newValue===true){
                        Ext.getCmp('existingAlbumsCheckboxes').setDisabled(true);
                        Ext.getCmp("addPhotosToAlbumNextAction").setText("Next >");
                    }
                }
            }
        }, {
            inputValue: 'existing',
            boxLabel: 'Existing Album',
            listeners: {
                change: function(radioBtn, newValue, oldValue){
                    if (newValue===true){
                        Ext.getCmp('existingAlbumsCheckboxes').setDisabled(false);
                        Ext.getCmp("addPhotosToAlbumNextAction").setText("Save");
                    }
                }
            }
        }]
    }, {
        id: 'existingAlbumsCheckboxes',
        xtype: 'dataview',
        itemSelector: 'input',
        disabled: true,
        minWidth: 300,
        tpl: new Ext.XTemplate('<table><tbody>', '<tpl for=".">', '<tpl if="xindex % 2 === 1">', '<tr>', '</tpl>', '<td style="padding:4px 15px 4px 15px"><input type="radio" name="existingAlbums" value="{AlbumUID}" <tpl if="xindex === 1">checked</tpl> /> {AlbumName}</td>', '<tpl if="xindex % 2 === 0">', '<tr>', '</tpl>', '</tpl>', '</tbody></table>')
    }, {
        xtype: 'container',
        flex: 1,
        layout: {
            type: 'hbox',
            pack: 'end'
        },
        margin: "5 0 0 0",
        items: [{
            id: 'addPhotosToAlbumNextAction',
            xtype: 'button',
            text: 'Next >',
            width: 45
        }]
    }

    ],
    getAlbumUID: function(){
        var radios=document.getElementsByName("existingAlbums");
        for ( var i=0; i<radios.length; i++){
            if (radios[i].checked) return radios[i].value;
        }
    }
});