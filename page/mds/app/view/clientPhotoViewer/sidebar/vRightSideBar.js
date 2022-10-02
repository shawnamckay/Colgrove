
Ext.define('mds.view.clientPhotoViewer.sidebar.vRightSideBar', {
    extend: 'Ext.container.Container'
    ,xtype: 'pvSideBar'
    ,id:'pvSideBar'
    ,width: 298
    ,layout:{type:'vbox',align:'stretch'}
    ,config:{
        items: [
            {
                xtype:'container'
                ,id:'sidebarTopRoundCorner'
                ,height:20
            },
            {
                xtype:'container'
                ,height:60
                ,id:'tplSideBarTop'
                ,items:[
                    {
                        xtype:'container'
                        ,id:'tplSideBarTopProjectImg'
                        ,tpl: new Ext.XTemplate(
                            '<img src="{projectImg}" width="50" height="50"/>'
                        )
                        ,data:{'projectImg':''}
                    },                   
                    {
                        xtype:'container'
                        ,id:'tplSideBarTopProject'
                        ,width: 215
                        ,tpl: new Ext.XTemplate(
                            '<div><span class="projectTitle"><a title="Return to Project: {projectTitle}" href="../index.htm?ProjectUID={ProjectUID}">{projectTitle}</a></span></div>' +
                            '<div><span class="projectAddress">{projectAddress}</span></div>'
                        )
                        ,data:{'projectTitle':''}
                    }
                ]
            },
            {
                xtype: 'container'
                ,id:'tplSideBarTopPhoto'
                ,width: 215
                ,tpl: new Ext.XTemplate(
                    '<div><span title="{name}">{name}</span></div>' +
                    '<div>{floorplanDesc}</div>'
                )
                ,data:{}
            },
            {
                xtype: 'tbtext'
                ,id:'tplPhotoInfoName'
                ,width: 215
                ,tpl: new Ext.XTemplate(
                    '<span>{dateTaken:this.dateFormat} {[this.getPhotoDescription(values)]}</span>' +
                    '<div>{[this.getGPSData(values)]}</div>'
                    ,{
                        dateFormat: function(value) {
                            var dt = new Date(value);
                            if (!dt) {
                                return '';
                            }
                            return Ext.Date.format(dt, 'F j, Y');
                        },
                        getPhotoDescription: function(values){
                            if (values.isWebcam)
                                return Ext.Date.format(values.dateTaken, "g:i A");
                            else
                                return "- Photo "+values.photoIndex;
                        },
                        getGPSData: function(values) {
                            var gpsData = '';

                            if (values.latitude != '' || values.longitude != '' || values.altitude != '') {
                                gpsData = "GPS Position:";

                                if (values.latitude != '') {
                                    gpsData += ' Lat. ' + values.latitude;
                                }

                                if (values.longitude != '') {
                                    gpsData += ' Long. ' + values.longitude;
                                }

                                if (values.altitude != '') {
                                    gpsData += ' Elev. ' + values.altitude + ' ASL';
                                }
                            }

                            return gpsData;
                        }
                    }
                )
                ,data:{}
            }, 
            /*
            {
                xtype:'container'
                ,height:60
                ,id:'tplSideBarTop'
                ,items:[
                    {
                        xtype:'container'
                        ,id:'tplSideBarTopProjectImg'
                        ,tpl: new Ext.XTemplate(
                            '<img src="{projectImg}" width="50" height="50"/>'
                        )
                        ,data:{'projectImg':''}
                    },                   
                    {
                        xtype:'container'
                        ,id:'tplSideBarTopProject'
                        ,width:215
                        ,tpl: new Ext.XTemplate(
                            '<div><span class="projectTitle"><a title="Return to Project: {projectTitle}" href="../index.htm?ProjectUID={ProjectUID}">{projectTitle}</a></span></div>' +
                            '<div><span class="projectAddress">{projectAddress}</span></div>'
                        )
                        ,data:{'projectTitle':''}
                    },
                    {
                        xtype:'container'
                        ,id:'tplSideBarTopPhoto'
                        ,width:215
                        ,tpl: new Ext.XTemplate(
                            '<div><span class="projectShootCls" title="{name}">{name}</span></div>' +
                            '<div>{floorplanDesc}</div>'
                        )
                        ,data:{}
                    }
                ]
            },           
            {
                xtype: 'tbtext'
                ,id:'tplPhotoInfoName'
                ,width:215
                ,tpl: new Ext.XTemplate(
                    '<span>{dateTaken:this.dateFormat} {[this.getPhotoDescription(values)]}</span>'
                    ,{
                        dateFormat: function(value) {
                            var dt = new Date(value);
                            if (!dt) {
                                return '';
                            }
                            return Ext.Date.format(dt, 'F j, Y');
                        },
                        getPhotoDescription:function(values){
                        	if (values.isWebcam)
                        		return Ext.Date.format(values.dateTaken, "g:i A");
                        	else
                        		return "- Photo "+values.photoIndex;
                        }
                    }
                )
                ,data:{}
            },   */          
            {
                xtype: 'pvComments'
            },
            {
                xtype: 'container'
                ,height:12
                ,id:'pvSideBarStrip'
            },
            {
                xtype: 'container'
                ,id:'tplSideBarFloorplan'
                ,hidden:true
                ,tpl: new Ext.XTemplate(
                    '<span>{floorplanLabel} <a href="clientFloorplanViewer.htm?ProjectUID={[this.getProjectUID()]}&FloorplanUID={floorplanUID}&hotspotID={hotspotID}">Go to Floorplan &raquo; </a></span>'
                    ,{
                        getProjectUID: function() {
                            var urlParams = Ext.Object.fromQueryString(document.location.search);
                            var ProjectUID = urlParams.ProjectUID ? urlParams.ProjectUID : '00000000-0000-0000-0000-000000000000';
                            return ProjectUID;
                        }
                    })
                ,data:{'floorplanLabel': ''}
            },
            {
                xtype:'container'
                ,height:282
                ,id:'hotspotWrapper'
                ,items: [
                    {
                        xtype:'image'
                        ,id: 'hotspotContainer'
                        ,width:30
                        ,height:30
                        ,hidden:true
                        ,src: 'mds/image/hotspot_highlight.png'
                        ,style:{opacity:'.5', position:'absolute','z-index':'99999999'}
                    },
                    {
                        xtype: 'pvFloorPlan'
                    },
                    {
                        xtype: 'pvWebcam'
                    }
                ]
            }
        ]
    }
});
//@ sourceURL=vRightSideBar.js