Ext.define('mds.view.clientPeopleOverview.Person.grid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.clientPeopleOverviewPersonGrid',
    store: Ext.getStore('clientPeopleOverview.CompanyPeople'),
    margin: 14,
    hidden: true,
    layout: "fit",
    columns:[
      {
          text: 'First Name',
          dataIndex: 'MemberFirstName',
          flex: 1
      },
      {
          text: 'Last Name',
          dataIndex: 'MemberLastName',
          flex: 1
      },
      {
          text: 'Email',
          dataIndex: 'MemberEmail',
          flex: 1,
          hidden: true
      },
      {
          text: 'READ / WRITE',
          dataIndex: 'w',
          width: 125,
          menuDisabled: true,
          sortable: false,
          hidden: true,
          baseCls: 'x-unselectable x-column-header-align-left x-box-item x-column-header x-unselectable-default commentPerm',
          tdCls: 'commentPerm',
          renderer: function(isTrue){
    	  	return (isTrue?'<img src="mds/image/checkmark.png">':"");
          }
      },
      {
          text: 'READ',
          dataIndex: 'r',
          width: 80,
          hidden: true,
          menuDisabled: true,
          sortable: false,
          baseCls: 'x-unselectable x-column-header-align-left x-box-item x-column-header x-unselectable-default commentPerm',
          tdCls: 'commentPerm',
          renderer: function(isTrue){
  	  	      return (isTrue?'<img src="mds/image/checkmark.png">':"");
          }
      },
      {
          text: 'NONE',
          dataIndex: 'x',
          width: 81,
          hidden: true,
          menuDisabled: true,
          sortable: false,
          baseCls: 'x-unselectable x-column-header-align-left x-box-item x-column-header x-unselectable-default commentPerm',
          tdCls: 'commentPerm',
          renderer: function(isTrue){
    	  	      return (isTrue?'<img src="mds/image/forbidden.png">':"");
          }
      }
    ],
    viewConfig:{
	    markDirty: false
    },
    listeners:{
		afterrender:function(gridPanel){
    	    var icons=["mds/image/checkmark.png", "mds/image/checkmark.png", "mds/image/forbidden.png"];
    	    var permTypes=["w", "r", "x"];
    		for (var i=3; i<=5; i++){
    			var el=this.columns[i].el;
    			
    			Ext.create("Ext.button.Button", {
    				id: this.id+"_PermBtn"+i,
    				icon: icons[i-3],
    				height: 27,
    				width: 27,
    				renderTo:el,
    				cls: "commentPermBtn "+permTypes[i-3],
    				iconCls: "commentPermBtn",
    				listeners: {
    					click:function(btn){
    					    var permType="x";
    					    if (btn.hasCls("w"))
    					    	permType="w";
    					    else if (btn.hasCls("r"))
    					    	permType="r";
    					    gridPanel.fireEvent("setAllPerms", gridPanel, permType);
    					}
    				}
    					
    			});
    		}
		}
    }
});