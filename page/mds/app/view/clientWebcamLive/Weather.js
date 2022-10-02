Ext.define('mds.view.clientWebcamLive.Weather', {
    id: 'weather',
    alias: 'widget.weather',
    extend: 'Ext.Component',
    
    data: null,

    tpl: Ext.create('Ext.XTemplate',
        '<img src="mds/image/noaa/{IconName}">',
        '<div class="weatherFullDescription">',
            '<div class="weatherDescription">',
            	'{Weather}',
            '</div>',
            '<div class="temperature">',
            	'{[this.getTemperature(values)]}',
            '</div>',
            '<div class="windDescription">',
            	'{[this.getWind(values)]}',
            '</div>',
        '</div>',
        {
        	getTemperature:function(values){
        		return (values.TemperatureF!=""?values.TemperatureF+"&deg;F":"");
        	},
        	getWind:function(values){
        		return ((values.WindDirection!="" && values.WindMPH!="")?values.WindDirection+" at "+values.WindMPH+" MPH":"");
        	}
        }
    ) 
});