/**
 * MODEL
 */
Ext.define('mds.model.clientNavigation.ProjectSelector', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name:'projectTitle',
            type:'string'
        },
        {
            name:'projectAddress',
            type:'string'
        },
        {
            name:'ProjectName',
            type:'string'
        },
        {
            name:'ProjectAddress1',
            type:'string'
        },
        {
            name:'ProjectAddress2',
            type:'string'
        },
        {
            name:'ProjectLatitude',
            type:'float'
        },
        {
            name:'ProjectLongitude',
            type:'float'
        },
        {
            name:'ProjectUID',
            type:'string'
        },
        {
            name:'lastUpdate',
            type:'string'
        },
        {
            name:'imageURL',
            type:'string'
        },
        {
            name:'image16URL',
            type:'string'
        },
        {
            name:'image24URL',
            type:'string'
        },
        {
            name:'image32URL',
            type:'string'
        },
        {
            name:'image64URL',
            type:'string'
        },
        {
            name:'companyLogoURL',
            type:'string',
            defaultValue: ''
        },
        {
            name:'companyLogoHeight',
            type:'int',
            defaultValue: 0
        },
        {
            name:'companyLogoWidth',
            type:'int',
            defaultValue: 0
        },
        {
            name:'projectLogoURL',
            type:'string',
            defaultValue: ''
        },
        {
            name:'projectLogoHeight',
            type:'int',
            defaultValue: 0
        },
        {
            name:'projectLogoWidth',
            type:'int',
            defaultValue: 0
        }
    ]
});
