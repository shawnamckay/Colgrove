/**
 * 
 */
Ext.define('mds.view.clientDashboard.SidebarProjectList', {
    extend: 'Ext.view.View',
    //alias: 'widget.sidebarProjectList',
    border: false,
    cls: 'sidebarProjectList',
    itemSelector: '.project',
    store: 'clientNavigation.ProjectSelectors',
    tpl: [
        '<div class="top"><span>My Projects</span></div>',
        '<tpl for=".">',
            '<div class="project">',
                '<div class="projectContent" title="Enter project">',
                    '<div class="projectIcon"><img src="{image32URL}" height="32" width="32"></div>',
                    '<div><span class="projectTitle">{projectTitle}</span></div>',
                    '<div><span class="projectAddress">{projectAddress}</span></div>',
                '</div>',
            '</div>',
        '</tpl>'
    ]
});
