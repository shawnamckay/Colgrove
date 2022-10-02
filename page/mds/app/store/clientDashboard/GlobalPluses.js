/**
 * MODEL
 */
Ext.define('mds.store.clientDashboard.GlobalPluses', {
    extend: 'Ext.data.Store',
    model: 'mds.model.clientDashboard.MapViewerProject',
    data: [
        {
            projectTitle: 'Another',
            projectAddress: '',
            ProjectName: 'ProjectName',
            ProjectAddress1: 'ProjectAddress1',
            ProjectAddress2: 'ProjectAddress2',
            ProjectLatitude: 'ProjectLatitude',
            ProjectLongitude: 'ProjectLongitude',
            ProjectUID: 'globalPlusViewAnother',
            lastUpdate: 'lastUpdate',
            imageURL: 'imageURL',
            image16URL: 'image16URL',
            image24URL: 'image24URL',
            image32URL: 'mds/image/project_icon32.jpg',
            image64URL: 'image64URL'
        },
        {
            projectTitle: 'Floorplans Or Photos',
            projectAddress: '',
            ProjectName: 'ProjectName',
            ProjectAddress1: 'ProjectAddress1',
            ProjectAddress2: 'ProjectAddress2',
            ProjectLatitude: 'ProjectLatitude',
            ProjectLongitude: 'ProjectLongitude',
            ProjectUID: 'globalPlusViewFloorplansOrPhotos',
            lastUpdate: 'lastUpdate',
            imageURL: 'imageURL',
            image16URL: 'image16URL',
            image24URL: 'image24URL',
            image32URL: 'mds/image/project_icon32.jpg',
            image64URL: 'image64URL'
        },
        {
            projectTitle: 'Navigation Bar Button',
            projectAddress: 'Choose a prefered Navigation Bar button.',
            ProjectName: 'ProjectName',
            ProjectAddress1: 'ProjectAddress1',
            ProjectAddress2: 'ProjectAddress2',
            ProjectLatitude: 'ProjectLatitude',
            ProjectLongitude: 'ProjectLongitude',
            ProjectUID: 'globalPlusViewNavigationBarPreference',
            lastUpdate: 'lastUpdate',
            imageURL: 'imageURL',
            image16URL: 'image16URL',
            image24URL: 'image24URL',
            image32URL: 'mds/image/project_icon32.jpg',
            image64URL: 'image64URL'
        }
    ],
    autoLoad: true
});
