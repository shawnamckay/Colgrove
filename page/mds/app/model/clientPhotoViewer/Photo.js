Ext.define('mds.model.clientPhotoViewer.Photo', {
    extend: 'Ext.data.Model',
    requires: ['mds.model.clientPhotoViewer.Comment'],
    fields: [{
        name: 'storePosition',
        type: 'numeric'
    }, {
        name: 'photoIndex',
        type: 'numeric',
        convert: function(value, record){
            return (value===undefined?record.get("storePosition"):value);
        }
    }

    , {
        name: 'photoID',
        type: 'numeric',
        defaultValue: 0
    }, {
        name: 'hotspotID',
        type: 'numeric',
        defaultValue: 0
    }
    , {
        name: 'shootUID',
        type: 'string',
        defaultValue: "00000000-0000-0000-0000-000000000000"
    }, {
        name: 'albumUID',
        type: 'string',
        defaultValue: "00000000-0000-0000-0000-000000000000"
    }, {
        name: 'UDEFPhotoUID',
        type: 'string',
        defaultValue: null
    }, {
        name: 'WebcamPhotoUID',
        type: 'string',
        defaultValue: null
    }, {
        name: 'commentThreadID',
        type: 'numeric',
        defaultValue: 0
    }

    , {
        name: 'id',
        type: 'string',
        convert: function(value, record){
            if (record.data.UDEFPhotoUID.length!==0) return 'U'+record.get("UDEFPhotoUID");
            else if (record.data.WebcamPhotoUID.length!==0) return 'W'+record.get("WebcamPhotoUID");
            else return 'P'+record.get("photoID");
        }
    }, {
        name: 'isUDEF',
        type: 'boolean',
        convert: function(v, record){
            if (record.data.UDEFPhotoUID.length===0){
                return false;
            } else return true;
        }
    }, {
        name: 'isWebcam',
        type: 'boolean',
        convert: function(v, record){
            if (record.data.WebcamPhotoUID.length===0){
                return false;
            } else return true;
        }
    }, {
        name: 'name',
        type: 'string',
        defaultValue: ""
    }, {
        name: 'floorplanDesc',
        type: 'string',
        defaultValue: ""
    }, {
        name: 'dateTaken',
        type: 'tzadate'
    }, {
        name: 'src',
        type: 'string'
    }, {
        name: 'med',
        type: 'string'
    }, {
        name: 'tmb',
        type: 'string'
    }

    , {
        name: 'floorplanUID',
        type: 'string',
        defaultValue: "0"
    }, {
        name: 'floorplanImage',
        type: 'string',
        defaultValue: null
    }, {
        name: 'floorplanImageW',
        type: 'numeric',
        defaultValue: null
    }, {
        name: 'floorplanImageH',
        type: 'numeric',
        defaultValue: null
    }, {
        name: 'floorplanOffsetLeft',
        type: 'numeric',
        defaultValue: null
    }, {
        name: 'floorplanOffsetTop',
        type: 'numeric',
        defaultValue: null
    }, {
        name: 'floorplanLabel',
        type: 'string',
        defaultValue: null
    }

    , {
        name: 'commentCount',
        type: 'numeric',
        defaultValue: '0'
    }, {
        name: 'hasAnnotations',
        type: 'numeric',
        defaultValue: '0'
    }

    , {
        name: 'isFavorite',
        type: 'boolean',
        convert: function(value){
            if (value>0) return true;
            return false;
        }
    }

    , {
        name: 'WebcamUID',
        type: 'string',
        defaultValue: null
    }, {
        name: 'Weather',
        type: 'string'
    }, {
        name: 'TemperatureF',
        type: 'numeric'
    }, {
        name: 'WindDirection',
        type: 'string'
    }, {
        name: 'WindMPH',
        type: 'numeric'
    }, {
        name: 'altitude',
        type: 'string'
    }, {
        name: 'latitude',
        type: 'string'
    }, {
        name: 'longitude',
        type: 'string'
    }, {
        name: 'IconName',
        type: 'string',
        convert: function(value, record){
            if (record.get("id").charAt(0)!="W") return "";

            var weather=record.get("Weather"), icon;

            // There doesn't seem to be a set # of weather descriptions, so guess weather based on keywords
            if (weather.indexOf("Ice")!=-1){
                if (weather.indexOf("Rain")!=-1||weather.indexOf("Drizzle")!=-1) icon="raip.png"; // rain+ice pellets
                else icon="ip.png"; // ice pellets
            } else if (weather.indexOf("Hail")!=-1){
                if (weather.indexOf("Thunderstorm")!=-1) icon="tsra.png"; // thunderstorm
                else icon="ip.png"; // ice pellets
            } else if (weather.indexOf("Snow")!=-1){
                if (weather.indexOf("Freezing")!=-1) icon="mix.png"; // mixed snow and rain
                else if (weather.indexOf("Rain")!=-1||weather.indexOf("Drizzle")!=-1) icon="rasn.png"; // rain snow
                else icon="sn.png";// snow
            } else if (weather.indexOf("Thunderstorm")!=-1){
                if (weather.indexOf("in Vicinity")!=-1) icon="hi_tsra.png"; // Thunderstorm in vicinity
                else icon="tsra.png"; // Thunderstorm
            } else if (weather.indexOf("Dust")!=-1||weather.indexOf("Sand")!=-1){
                icon="du.png"; // Dust
            } else if (weather.indexOf("Windy")!=-1&&weather.indexOf("Rain")==-1&&weather.indexOf("Fog")==-1){
                icon="wind.png"; // Fog
            } else if (weather.indexOf("Cloudy")!=-1){
                if (weather.indexOf("Partly")!=-1) icon='sct.png'; // Partly Cloudy
                else icon='bkn.png'; // Mosly Cloudy
            } else if (weather.indexOf("Fair")!=-1||weather.indexOf("Clear")!=-1){
                icon="skc.png"; // clear
            } else if (weather.indexOf("A Few Clouds")!=-1){
                icon="few.png"; // A Few Clouds
            } else if (weather.indexOf("Overcast")!=-1){
                icon="ovc.png"; // Overcast
            } else if (weather.indexOf("Smoke")!=-1){
                icon="smoke.png"; // Smoke
            } else if (weather.indexOf("Freezing")!=-1){
                if (weather.indexOf("Fog")!=-1) icon="fg.png"; // Fog
                var nRain=weather.match(/Rain/g);
                nRain=(nRain?nRain.length:0);
                var nDrizzle=weather.match(/Drizzle/g);
                nDrizzle=(nDrizzle?nDrizzle.length:0);
                if (nRain+nDrizzle>1) icon="fzrara.png"; // Freezing Rain + Rain
                else icon="fzra.png"; // Freezing Rain
            } else if (weather.indexOf("Showers")!=-1){
                if (weather.indexOf("Vicinity")!=-1) icon="hi_shwrs.png"; // Showers in Vicinity
                else icon="shra.png"; // Showers Rain
            } else if (weather.indexOf("Light Rain")!=-1||weather.indexOf("Drizzle")!=-1){
                if (weather.indexOf("Breezy")!=-1) icon="shra.png"; // Showers Rain
                else icon="lra.png"; // Light Rain
            } else if (weather.indexOf("Rain")!=-1){
                icon="ra.png"; // Rain
            } else if (weather.indexOf("Funnel Cloud")!=-1||weather.indexOf("Tornado")!=-1){
                icon="nsvrtsra.png"; // Tornado
            } else if (weather.indexOf("Haze")!=-1){
                icon="mist.png"; // Mist
            } else if (weather.indexOf("Fog")!=-1){
                icon="fg.png"; // Fog
            } else{
                icon="ovc.png"; // overcast seems to work well as default
            }

            // night icon for 19:00-06:00
            var hour=record.get("dateTaken").getHours();
            if ((hour<6||hour>19)&&icon!="smoke.png"&&icon!="fzra.png"&&icon!="ip.png"&&icon!="raip.png"&&icon!="shra.png"&&icon!="fzrara.png"&&icon!="nsvrtsra.png"&&icon!="dust.png"&&icon!="mist.png"){

                if (icon=="lra.png") icon="nra.png";
                else if (icon=="hi_shwrs.png") icon="hi_nshwrs.png";
                else if (icon=="hi_tsra.png") icon="hi_ntsra.png";
                else icon="n"+icon;
            }
            return icon;
        }
    }, {
        name: 'isSelected',
        type: 'boolean',
        defaultValue: 'false'
    } // thumb checkboxes

    // THUMB VIEW RELATED VARIABLES FOR USER CLICK ACTIONS
    , {
        name: 'tmbSelected',
        type: 'boolean',
        defaultValue: 'false'
    }],
    hasMany: {
        model: 'mds.model.clientPhotoViewer.Comment',
        name: 'getCommentStore',
        associationKey: 'commentArray'
    }
});
//@ sourceURL=Photo.js
