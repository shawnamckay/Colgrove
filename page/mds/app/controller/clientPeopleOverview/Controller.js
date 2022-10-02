Ext.define('mds.controller.clientPeopleOverview.Controller', {
    extend: 'Ext.app.Controller',
    init: function(){
        var controller=this;

        controller.canEditCommentPerms=false; 

        controller.control({
            '#viewport':{
                afterrender: function(){
                    Ext.getStore("clientPeopleOverview.PeopleBase").addListener("descendantload", function(descendantStore, descendantGrid){
                        Ext.getCmp("descendantPeoplePanel").show();
                        controller.showData(descendantGrid, descendantStore);
                    });
                    Ext.getStore("clientPeopleOverview.CompanyPeople").addListener("load", function(){
                        controller.showData(Ext.getCmp('companyPeopleGrid'), this);
                    });
                    Ext.getStore("clientPeopleOverview.AscendantPeople").addListener("load", function(){
                        controller.showData(Ext.getCmp('ascendantPeopleGrid'), this);
                    });

                    Ext.getStore("clientPeopleOverview.PeopleBase").load();    
                }
            },
            '[xtype="clientPeopleOverviewPersonGrid"]': {
                cellclick: function(grid, td, cellIndex, record, tr, rowIndex){
                    if (!controller.canEditCommentPerms) return;

                    var permType, cellValue;

                    if (cellIndex==3){
                        permType="w";
                    } else if (cellIndex==4){
                        permType="r";
                    } else if (cellIndex==5){
                        permType="x";
                    } else return;

                    if (record.get(permType)) return;

                    controller.editCommentPermissions([record], (grid.panel.id!="companyPeopleGrid"?"ProjectUID":"CompanyUID"), permType);
                },
                "setAllPerms": function(me, permType){
                    Ext.Msg.confirm("Permissions Change", "OK to change permissions for all users in this list?", function(btn){
                        if (btn=="yes"){
                            controller.editCommentPermissions(me.getView().getStore().getRange(), (me.id=="companyPeopleGrid"?"CompanyUID":"ProjectUID"), permType);
                        }
                    });
                },
                viewready: function(){
                    if (!this.canEditCommentPerms){
                        var elements=Ext.select(".commentPerm").elements;
                        for ( var i=0; i<elements.length; i++){
                            Ext.fly(elements[i]).addCls("disabledCell");
                        }
                        for ( var i=3; i<=5; i++){
                            var cmp=Ext.getCmp("ascendantPeopleGrid_PermBtn"+i);
                            if (cmp) cmp.disable();
                            cmp=Ext.getCmp("companyPeopleGrid_PermBtn"+i);
                            if (cmp) cmp.disable();

                            for ( var j=0; j<this.nChildProjects; j++){
                                cmp=Ext.getCmp("descendantGrid"+j+"_PermBtn"+i);
                                if (cmp) cmp.disable();
                            }
                        }
                    }
                }
            }
        });
    },
    showData: function(grid, store){
        if (store.count()){
            grid.show();
            if ((store.getAt(0).getData()).MemberEmail!==undefined){
                for ( var i=2; i<=5; i++)
                    grid.columns[i].show();
            }
        }
    },
    editCommentPermissions: function(records, idName, permType){
        var dataArray=[];
        for ( var i=0; i<records.length; i++){
            var data={
                MemberUID: records[i].get("MemberUID"),
                CommentsPermission: permType
            }
            data[idName]=records[i].get("permID");
            dataArray.push(data);
        }
    }
});