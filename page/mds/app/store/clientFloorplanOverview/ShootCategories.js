Ext.define('mds.store.clientFloorplanOverview.ShootCategories', {
  extend: 'Ext.data.TreeStore',
  fields: ["text"],
  proxy:{
    type: 'jsonp',
    url: 'index.cfm?fuseaction=aClientFloorplanOverview.getShootCategories&ProjectUID='+
    (Ext.Object.fromQueryString(document.location.search)).ProjectUID
  },
  root: {
    text: 'All Shoot Types',
    expanded: true,
    loaded:false
  },
  rootVisible:false
});