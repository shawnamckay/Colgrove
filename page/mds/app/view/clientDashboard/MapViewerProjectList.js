/**
 * 
 */
Ext.define('mds.view.clientDashboard.MapViewerProjectList', {
    extend: 'Ext.view.View',
    alias: 'widget.mapViewerProjectList',
    border: false,
    cls: 'sidebarProjectList',
    itemSelector: '.project',
    store: 'clientNavigation.ProjectSelectors',
    tpl: [
        '<div class="top"><span>My Projects</span></div>',
        '<tpl for=".">',
            '<div class="project">',
                '<div class="projectMapIconWrap" title="Show on map"><div class="projectMapIcon"><img src="/mds/module/clientDashboard/image/map_marker_plain.png" alt=""></div></div>',
                '<div class="projectContent hasFilter" title="Enter project">',
                    '<div class="projectIcon"><img src="{image32URL}" height="32" width="32"></div>',
                    '<div><span class="projectTitle"><a href="index.cfm?fuseaction=aClientNavigation.ProjectGateway&ProjectUID={ProjectUID}">{projectTitle}</a></span></div>',
                    '<div><span class="projectAddress">{projectAddress}</span></div>',
                '</div>',
            '</div>',
        '</tpl>'
    ]
});
