Ext.define('mds.model.clientPeopleOverview.Person', {
  extend: 'Ext.data.Model',
  fields:[
          'MemberFirstName',
          'MemberLastName',
          'MemberUID',
          {
        	  name: 'MemberEmail',
        	  defaultValue: undefined
          },
          'CommentsPermission',
          {
        	  name: 'w',
        	  convert: function(value, record){
        	      return record.get("CommentsPermission")=='w';
        	  }	  
          },
          {
        	  name: 'r',
        	  convert: function(value, record){
        	      return record.get("CommentsPermission")=='r';
        	  }	  
          },
          {
        	  name: 'x',
        	  convert: function(value, record){
        	  return record.get("CommentsPermission")=='x';
        	  }	  
          },
          'permID'
  ]  
});