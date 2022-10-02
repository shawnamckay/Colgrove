/**
 * 
 */
Ext.define('mds.controller.clientNavigation.Manager', {
    extend: 'Ext.app.Controller',
    models: ['clientNavigation.NavigationPreference4Project', 'clientNavigation.NavigationBar4Project'],
    stores: ['clientNavigation.MemberProjectPreference', 'clientNavigation.NavigationPreference4Project', 'clientNavigation.ProjectBreadcrumbs', 'clientNavigation.ProjectFloorplans'],
    views: ['clientNavigation.ClientNavigator', 'clientNavigation.GlobalHome', 'clientNavigation.NavigationBar', 'clientNavigation.NavigationLogo', 'clientNavigation.ProjectBreadcrumb', 'clientNavigation.ProjectAdminJump'],
    refs: [{
        ref: 'navigationBar',
        selector: 'navigationBar'
    }, {
        ref: 'projectBreadcrumb',
        selector: 'projectBreadcrumb'
    }, {
        ref: 'clientNavigatorCompanyImage',
        selector: '#clientNavigatorCompanyImage'
    }, {
        ref: 'clientNavigatorProjectImage',
        selector: '#clientNavigatorProjectImage'
    }],
    init: function(){
        var me=this;
        me.getClientNavigationProjectBreadcrumbsStore().load();
        me.getClientNavigationProjectFloorplansStore().load();
        me.control({
            'navigationBar': {
                afterrender: function(){
                    var view=me.getNavigationBar();
                    var store=me.getStore('clientNavigation.NavigationPreference4Project');
                    store.load({
                        callback: function(records, successful, eOpts){
                            if (successful&&records){
                                var record=records[0];
                                var associatedData=records[0].getAssociatedData();
                                for ( var i=0; i<associatedData.navigationBar4Project.length; i++){
                                    var data=associatedData.navigationBar4Project[i];
                                    var button=view.getButtonByAlias(data.alias);
                                    if (button && button.setVisible){
                                        button.setVisible(data.visible);
                                        var elA=Ext.DomQuery.selectNode('a', button.getEl().dom);
                                        if (data.alias=='externallink'){
                                            button.setText(data.DisplayLabel);
                                            // cf. clientNavigation/projectNavigation.css html #projectNavigation .ebuilder
                                            button.addCls(data.CSSClass);
                                            elA.href=data.LinkURL;
                                        }
                                        if (elA)
                                            elA.target=data.NewWindow==1?'_blank':'_top';
                                    }
                                }
                                me.getClientNavigatorCompanyImage().set(records[0].get('companyLogoURL'), records[0].get('companyLogoHeight'), records[0].get('companyLogoWidth'));
                                me.getClientNavigatorProjectImage().set(records[0].get('projectLogoURL'), records[0].get('projectLogoHeight'), records[0].get('projectLogoWidth'));
                            }
                        }
                    });
                }
            }
        });
        me.init2(arguments);
        me.callParent(arguments);
    },
    init2: function(){
        var me=this;
        Ext.util.CSS.swapStyleSheet('clientNavigation.wrap', 'mds/module/clientNavigation/wrap.css');
        var o={};
        o.ProjectUID=(Ext.Object.fromQueryString(document.location.search)).ProjectUID;
    }
});
//@ sourceURL=clientNavigationManager.js
