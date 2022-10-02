Ext.define('mds.view.clientPhotoList.PhotoCategory.CoverLinks', {
    extend: 'Ext.view.View',
    id: 'photoCategoryCoverLinks',
    store: 'clientPhotoList.FlatPhotoCategories',
    tpl:new Ext.XTemplate(
        '<tpl for=".">',
    	    '<div class="photoCoverLinksSection">',
    	    	'<div class="photoGroupLabelWrap">',
    	    		'<div class="photoCategoryItem photoGroupLabel">{value}</div>',
    	    	'</div>',
    	    	'<tpl for="children">',
    	    		'<div class="photoCategoryWrap">',
    	    			'<div class="photoCategoryItem photoCategory" onclick="mds.app.getController(\'clientPhotoList.Controller\').selectCategory(\'{type}\', \'{id}\')">',
    	    				'<img class="stack" title="{value}" src="{photoURL}" onerror="Ext.getCmp(\'photoCategoryCoverLinks\').onerror(this)">',
    	    				'<div class="photoCategoryItemLabel">',			
    	    					'<span>{value}</span>', 
    	    				'</div>',
    	    			'</div>',
    	        	'</div>',
    	        '</tpl>',
    	    '</div>',
        '</tpl>'
     ),
    itemSelector: 'x',
    onerror:function(img){
        if (img.src.indexOf("missingImage.gif")==-1 && img.src.indexOf("UDEFPhotos")==-1 && img.src.indexOf("thumbs")==-1){
            img.style.minWidth="201px";
            img.style.minHeight="201px";
            img.src=img.src.replace("medium", "thumbs");
        }else{
          img.src="mds/image/missingImage.gif";
        }
     }
});