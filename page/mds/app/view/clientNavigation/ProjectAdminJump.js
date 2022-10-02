/**
 */
Ext.define('mds.view.clientNavigation.ProjectAdminJump', {
    extend: 'Ext.form.Panel',
    alias: 'widget.projectAdminJump',
    id: 'projectAdminJump',
    bodyCls: 'body',
    hidden: true,
    layout: {
        type: 'hbox',
        align: 'middle'
    },
    items: [
        {
            xtype: 'button',
            text: 'View',
            handler: function() {
                var me = this;
                var form = me.up('form').getForm();
                if (form.isValid()) {
                    me.enableBubble('clickv');
                    me.fireEvent('clickv', form.getValues().ProjectID);
                } else {
                    alert('You must enter positive integer.');
                }
            }
        },
        {
            xtype: 'textfield',
            name: 'ProjectID',
            enableKeyEvents: true,
            allowBlank: false,
            minLength: 1,
            maxLength: 6,
            width: 50,
            regex: /^[0-9]+$/, // between '0' to '9'
            listeners: {
                keyup: function(that, e, eOps) {
                    var me = that;
                    if (e.getKey() == e.ENTER) {
                        var form = me.up('form').getForm();
                        if (form.isValid()) {
                            me.enableBubble('clicke');
                            me.fireEvent('clicke', form.getValues().ProjectID);
                        } else {
                            alert('You must enter positive integer.');
                        }
                    }
                }
            }
        },
        {
            xtype: 'button',
            text: 'Edit',
            handler: function() {
                var me = this;
                var form = me.up('form').getForm();
                if (form.isValid()) {
                    me.enableBubble('clicke');
                    me.fireEvent('clicke', form.getValues().ProjectID);
                } else {
                    alert('You must enter positive integer.');
                }
            }
        }
    ],
    listeners: {
        clicke: function(ProjectID) {
            var me = this;
            me.fireEvent('clickedit', ProjectID);
        },
        clickv: function(ProjectID) {
            var me = this;
            me.fireEvent('clickview', ProjectID);
        }
    },
    initComponent: function() {
        var me = this;
        me.callParent(arguments);
    },
    setMemberRole: function(memberRole) {
        var me = this;
        me.setVisible(memberRole != 'client');
    }
});