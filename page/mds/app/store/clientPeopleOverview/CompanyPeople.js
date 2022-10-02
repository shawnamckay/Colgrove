Ext.define('mds.store.clientPeopleOverview.CompanyPeople', {
  extend: 'Ext.data.Store',
  model: 'mds.model.clientPeopleOverview.Person',
  proxy: {
    type: 'direct',
      reader: {
      type: 'json',
      root: 'company.people'
    }
  },
  sorters:{
    property: 'MemberLastName',
    direction: 'ASC'
  }
});