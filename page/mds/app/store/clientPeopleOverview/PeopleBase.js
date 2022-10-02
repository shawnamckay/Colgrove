Ext.define('mds.store.clientPeopleOverview.PeopleBase', {
  extend: 'Ext.data.Store',
  fields: [],
  proxy:{
    type: 'jsonp',
    url: 'index.cfm?fuseaction=aClientPeopleOverview.getPeople&ProjectUID='+(Ext.Object.fromQueryString(document.location.search)).ProjectUID
  },
  autoLoad:false,
  onProxyLoad: function( aOperation ){
    if (!aOperation.response)
      return;
    Ext.getStore('clientPeopleOverview.CompanyPeople').loadRawData(aOperation.response);
    Ext.getStore('clientPeopleOverview.AscendantPeople').loadRawData(aOperation.response);  
    Ext.getCmp('companyPeopleGrid').setTitle("People who have access to All "+this.proxy.reader.jsonData.company.title+" Projects");
    Ext.getCmp('ascendantPeopleGrid').setTitle("People who have access to this Entire Project "+this.proxy.reader.jsonData.ascendants.title);
    
    var nChildProjects=this.proxy.reader.jsonData.descendants.people.length;
    mds.app.getController("clientPeopleOverview.Controller").nChildProjects=nChildProjects;
    
    var descendantPanel=Ext.getCmp("descendantPeoplePanel");
    descendantPanel.setTitle("People who have access to some Portions of this Project "+this.proxy.reader.jsonData.descendants.title);
    
    for (var i=0; i<nChildProjects; i++){
    	var descendantStoreI=Ext.create("mds.store.clientPeopleOverview.DescendantPeople", {
    		id: "descendantStore"+i
    	});
    	descendantStoreI.loadData(this.proxy.reader.jsonData.descendants.people[i].people);
    	var descendantGridI=Ext.create("mds.view.clientPeopleOverview.Person.grid", {
    		id: "descendantGrid"+i,
    		store: descendantStoreI,
    		title: this.proxy.reader.jsonData.descendants.people[i].title
    	});
    	descendantPanel.add(descendantGridI);
    	this.fireEvent("descendantload", descendantStoreI, descendantGridI);
    };
  }
});