Ext.define('mds.store.clientPeopleOverview.DescendantPeople', {
  extend: 'Ext.data.Store',
  model: 'mds.model.clientPeopleOverview.Person',
  sorters:{
    property: 'MemberLastName',
    direction: 'ASC'
  }
});