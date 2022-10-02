Ext.define('mds.view.clientFloorplanOverview.Floorplan.view', {
    extend: 'Ext.view.View',
    alias: 'widget.clientFloorplanOverviewFloorplanView',
    id: 'clientFloorplanOverviewFloorplanView',
    store: 'clientFloorplanOverview.Floorplans',
    itemSelector: 'div .floorplan',
    tpl: new Ext.XTemplate(
        '<tpl for="."">',
          '{[this.title(xindex, values)]}',
          '<div class="floorplanCover">',
            '<a href="clientFloorplanViewer.htm?ProjectUID={[this.ProjectUID()]}&FloorplanUID={FloorplanUID}">',
          	  '<img id="{FloorplanUID}" class="floorplanCoverImage" src="{ImageURL}">',
          	  '<div class="floorplanCoverLabel"><span>{FloorplanDescription}</span></div>',
          	'</a>',
          '</div>',
        '</tpl>',
      {
        ProjectUID:function(){
          return (Ext.Object.fromQueryString(document.location.search)).ProjectUID;
        },
        title:function(index, values){
          index--;
          var store=Ext.getStore("clientFloorplanOverview.Floorplans");
          return ((index===0 || store.getAt(index-1).get("ProjectShootTypeLabel")!=values.ProjectShootTypeLabel)?'<br/><div class="title">'+values.ProjectShootTypeLabel+'</div>':'');
        }
        
      }
    )
});