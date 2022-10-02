Ext.define('mds.store.clientPeopleOverview.AscendantPeople', {
  extend: 'Ext.data.Store',
  model: 'mds.model.clientPeopleOverview.Person',
  proxy: {
    type: 'direct',
      reader: {
      type: 'json',
      root: 'ascendants.people'
    }
  },
  sorters:{
      property: 'MemberLastName',
      direction: 'ASC'
  }
});