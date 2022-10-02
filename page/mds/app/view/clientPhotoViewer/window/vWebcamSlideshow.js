Ext.define('mds.view.clientPhotoViewer.window.vWebcamSlideshow',{
    extend: 'Ext.window.Window',
    id: 'customSlideshowWindow',
    modal: true,
    layout:{
		type: 'vbox',
	    align: 'stretchmax'
    },
    items:[
        {
        	xtype: 'label',
        	text: 'Custom Slideshow Recurrence',
        	cls: 'csHeader',
        	margin: 5
        },
        {
        	xtype: 'container',
        	layout:{
        		type: 'hbox'
        	},
        	margin: 5,
        	items:[
        	    {
        	    	xtype: 'container',
        	    	layout: {
        	    		type: 'vbox'
        	    	},
        	    	defaults:{
        	    	    xtype: 'datefield',
        	    	    labelWidth: 70,
        	    	    format: 'M j Y'
        	    	},
        	    	items:[
        	    	    {
    	    	        	id: 'csStartDate',
    	    	        	fieldLabel: 'Start Date'
    	    	        },
    	    	        {
    	    	        	id: 'csEndDate',
    	    	        	fieldLabel: 'End Date'
    	    	        }
        	    	]
        	    },
        	    {
        	    	xtype: 'container',
        	    	layout: {
        	    		type: 'vbox'
        	    	},
        	    	items:[
        	    	    {
        	    	        xtype: 'container',
        	    	        layout: {
        	    	    	    type:'hbox'
        	    	        },
    	    	    	    items:[
    	    	    	        {
    	    	    	        	xtype: 'radio',
    	    	    	        	name: 'csSelectionType',
    	    	    	        	cls: 'csSelectionType',
    	    	    	            boxLabel: 'Time',
    	    	    	            checked: true,
    	    	    	            margin: "0 5 0 25",
    	    	    	            inputValue: 'time',
        	    	    	        listeners:{
                	    	    		change:function(radio, hasTargetTime){
                	    	        		if (hasTargetTime){
                	    	        			Ext.getCmp("csSelectionRadioGroup").enable();
                	    	        			Ext.getCmp("csRecurrenceTypeCards").enable();
                	    	        			Ext.getCmp("csHour").enable();
                	    	        			Ext.getCmp("csMinute").enable();
                	    	        		}else{
                	    	        			Ext.getCmp("csSelectionRadioGroup").disable();
                	    	        			Ext.getCmp("csRecurrenceTypeCards").disable();
                	    	        			Ext.getCmp("csHour").disable();
                	    	        			Ext.getCmp("csMinute").disable();
                	    	        			
                	    	        		}
                	    	            }
                	    	        }
    	    	    	        },
    	    	    	        {
    	    	    	        	xtype: 'combo',
    	    	    	        	id: 'csHour',
    	    	    	        	width: 65,
    	    	    	        	store: Ext.create("Ext.data.Store", {
    	    	    	        		fields: ['text', 'value'],
        	    	                    data:[{text:'12 AM',value:0}, {text:'1 AM',value:1},  {text:'2 AM',value:2},{text:'3 AM',value:3},   {text:'4 AM',value:4},
        	    	                          {text:'5 AM',value:5},  {text:'6 AM',value:6},  {text:'7 AM',value:7},{text:'8 AM',value:8},   {text:'9 AM',value:9},
        	    	                          {text:'10 AM',value:10},{text:'11 AM',value:11},{text:'12 PM',value:12},{text:'1 PM',value:13},{text:'2 PM',value:14},
        	    	                          {text:'3 PM',value:15}, {text:'4 PM',value:16}, {text:'5 PM',value:17},{text:'6 PM',value:18}, {text:'7 PM',value:19},
        	    	                          {text:'8 PM',value:20}, {text:'9 PM',value:21}, {text:'10 PM',value:22},{text:'11 PM',value:23}]
        	    	                }),
    	    	                    valueField: 'value',
    	    	                    editable: false,
    	    	                    listeners:{
    	    	    	        		afterrender:function(combo){
    	    	                    		combo.setValue(12);
    	    	    	        		}
    	    	                    }
    	    	                },
    	    	                {
    	    	    	        	xtype: 'combo',
    	    	    	        	id: 'csMinute',
    	    	    	        	width: 45,
    	    	    	        	store: Ext.create("Ext.data.Store", {
    	    	    	        		fields: ['text', 'value'],
        	    	                    data:[{text:':00',value:0}, {text:':15',value:15},  {text:':30',value:30},{text:':45',value:45}]
        	    	                }),
    	    	                    valueField: 'value',
    	    	                    editable: false,
    	    	                    listeners:{
    	    	    	        		afterrender:function(combo){
    	    	                    		combo.setValue(0);
    	    	    	        		}
    	    	                    }
    	    	                }
    	    	    	    ]
        	    		     
        	    	    },
        	    	    {
    	    	        	xtype: 'radio',
    	    	        	name: 'csSelectionType',
    	    	        	cls: 'csSelectionType',
        	    	        boxLabel: 'All Photos',
        	    	        inputValue: 'allPhotos',
        	    	        margin: "5 5 0 25"
    	    	        },
    	    	        {
    	    	        	xtype: 'radio',
    	    	        	name: 'csSelectionType',
    	    	        	cls: 'csSelectionType',
        	    	        boxLabel: 'Commented',
        	    	        inputValue: 'commented',
        	    	        margin: "10 5 0 25"
    	    	        }  
        	    	]
        	    }
        	]
        },
        {
        	xtype: 'component',
        	flex: 1,
        	html: '<hr>',
        	margin: 5
        },
        {
        	xtype: 'container',
        	layout:{
        		type: 'hbox'
        	},
        	items:[
        	    {
        	    	xtype: 'radiogroup',
        	    	id: 'csSelectionRadioGroup',
        	    	layout: {
        	    	    type: 'vbox'
        	        },
        	        defaults:{
        	            name: 'csRecurrenceType',
        	            margin: "0 0 0 5"
        	        },
        	        items:[
        	            {
        	    	        boxLabel: 'Daily',
        	    	        inputValue: 'daily',
        	    	        checked: true
    	    	        },
    	    	        {
        	    	        boxLabel: 'Weekly',
        	    	        inputValue: 'weekly'
    	    	        },
    	    	        {
        	    	        boxLabel: 'Monthly',
        	    	        inputValue: 'monthly'
    	    	        }
        	        ],
        	        listeners:{
        	        	change:function(radioGroup, newValue, oldValue){
        	        		Ext.getCmp("csRecurrenceTypeCards").getLayout().setActiveItem(newValue.csRecurrenceType+'Card');
        	            }
        	        }
        	    },
        	    {
        	    	xtype: 'component',
        	    	flex: 1
        	    },
        	    {
        	    	xtype: 'panel',
        	    	id: 'csRecurrenceTypeCards',
        	    	layout:{
        	    	    type: 'card'
        	    	},
        	    	width: 300,
        	    	height: 200,
        	    	margin: 5,
        	    	defaults:{
        	    		margin: 5
        	    	},
        	    	items: [
            	        { 
            	        	itemId: 'dailyCard',
            	        	xtype: 'container',
            	            layout: {
            	        	    type: 'vbox'
            	            },
            	            items:[
            	                {
            	                	xtype: 'container',
            	                	layout:{
                    	        	    type: 'hbox',
                    	        	    align: 'middle'
                    	        	},
                    	        	items:[
                    	            	{
                    	            		xtype: 'numberfield',
                    	            		cls: 'csRecurrenceX',
                    	            	    fieldLabel: 'Recur every',
                    	            	    labelWidth: 70,
                    	            	    labelSeparator: '',
                    	            	    width: 130,
                    	            		value: 1,
                    	            		minValue: 1
                    	            	},
                    	            	{
                    	            		xtype: 'label',
                    	            		text: 'day(s)',
                    	            		margin: "0 0 0 5"
                    	            	}
                    	        	]
            	                },
            	                {
            	                	flex: 1,
            	                	border: 0
            	                }
            	            ]
            	        },
            	        { 
            	        	itemId: 'weeklyCard',
            	        	xtype: 'container',
            	            layout: {
            	        	    type: 'vbox'
            	            },
            	            items:[
            	                {
            	                	xtype: 'container',
            	                	layout:{
                    	        	    type: 'hbox',
                    	        	    align: 'middle'
                    	        	},
                    	        	items:[
                    	            	{
                    	            		xtype: 'numberfield',
                    	            	    cls: 'csRecurrenceX',
                    	            	    fieldLabel: 'Recur every',
                    	            	    labelWidth: 70,
                    	            	    labelSeparator: '',
                    	            	    width: 130,
                    	            		value: 1,
                    	            		minValue: 1
                    	            	},
                    	            	{
                    	            		xtype: 'label',
                    	            		text: 'week(s) on:',
                    	            		margin: "0 0 0 5"
                    	            	}
                    	        	]
            	                },
            	                {
            	                	xtype: 'checkboxgroup',
            	                	id: 'csWeekdays',
            	                	flex: 1,
            	                	layout:{
            	                		type: 'vbox'
            	                	},
            	                	margin: "5 0 0 0",
            	                	defaults:{
            	                		name: 'csWeekdays'
            	                    },
            	                    allowBlank:false,
            	                	items:[
            	                	    {
            	                	    	boxLabel: 'Sunday',
            	                	    	inputValue: 1
            	                	    },
            	                	    {
            	                	    	boxLabel: 'Monday',
            	                	    	inputValue: 2
            	                	    },
            	                	    {
            	                	    	boxLabel: 'Tuesday',
            	                	    	inputValue: 3
            	                	    },
            	                	    {
            	                	    	boxLabel: 'Wednesday',
            	                	    	inputValue: 4
            	                	    },
            	                	    {
            	                	    	boxLabel: 'Thursday',
            	                	    	inputValue: 5
            	                	    },
            	                	    {
            	                	    	boxLabel: 'Friday',
            	                	    	inputValue: 6
            	                	    },
            	                	    {
            	                	    	boxLabel: 'Saturday',
            	                	    	inputValue: 7
            	                	    }
            	                	]
            	                }
            	            ]
            	        },
            	        { 
            	        	itemId: 'monthlyCard',
            	        	xtype: 'container',
            	            layout: {
            	        	    type: 'vbox'
            	            },
            	            items:[
            	                {
            	                	xtype: 'container',
            	                	layout:{
                    	        	    type: 'hbox',
                    	        	    align: 'middle'
                    	        	},
                    	        	items:[
                    	            	{
                    	            		xtype: 'numberfield',
                    	            		id: 'csDayOfMonth',
                    	            	    fieldLabel: 'Day',
                    	            	    labelWidth: 20,
                    	            	    labelSeparator: '',
                    	            	    width: 70,
                    	            		value: 15,
                    	            		minValue: 1,
                    	            		maxValue: 31
                    	            	},
                    	            	{
                    	            		xtype: 'label',
                    	            		text: 'of every',
                    	            		margin: "0 5 0 5"
                    	            	},
                    	            	{
                    	            		xtype: 'numberfield',
                    	            		cls: 'csRecurrenceX',
                    	            	    labelSeparator: '',
                    	            	    width: 50,
                    	            		value: 1,
                    	            		minValue: 1
                    	            	},
                    	            	{
                    	            		xtype: 'label',
                    	            		text: 'month(s)',
                    	            		margin: "0 0 0 5"
                    	            	}
                    	        	]
            	                },
            	                {
            	                	flex: 1,
            	                	border: 0
            	                }
            	            ]
            	        }
            	    ]
        	    }
        	]
        },
        {
        	xtype: 'container',
        	layout:{
        		type: 'hbox'
            },
            items:[
                {
                	flex: 1,
                	border: 0
                },
                {
                	id: 'csGenerate',
                	xtype: 'button',
                	text: 'Generate',
                	margin: 5
                }       
            ]
        }
    ]
}); 
//@ sourceURL=vWebcamSlideshow.js