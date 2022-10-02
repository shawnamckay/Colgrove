Ext.define('mds.store.clientPhotoList.DateRanges', {
    extend: 'Ext.data.Store',
    model: 'mds.model.clientPhotoList.DateRange',
    constructor: function(){
        this.loading=true;
        this.setDateToMidnight=function(date){
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            date.setMilliseconds(0);
            return date;
        };
        this.nDaysAgo=function(n){
            return this.setDateToMidnight(Ext.Date.add(new Date(), Ext.Date.DAY, (-1*n)));
        };
        this.startOfMonthNMonthsAgo=function(n){
            var d=Ext.Date.add(new Date(), Ext.Date.MONTH, -1*n);
            d.setDate(1);
            return this.setDateToMidnight(d);
        }
        this.endOfMonthNMonthsAgo=function(n){
            return Ext.Date.add(this.startOfMonthNMonthsAgo(n-1), Ext.Date.DAY, -1);
        }

        var data=[];

        data.push({
            Label: 'Custom',
            StartDate: null,
            EndDate: null
        });

        data.push({
            Label: 'Last 14 days',
            StartDate: this.nDaysAgo(14),
            EndDate: new Date()
        });

        data.push({
            Label: 'This month',
            StartDate: this.startOfMonthNMonthsAgo(0),
            EndDate: new Date()
        });

        data.push({
            Label: 'Last 30 days',
            StartDate: this.nDaysAgo(30),
            EndDate: new Date()
        });

        data.push({
            Label: 'Last Month',
            StartDate: this.startOfMonthNMonthsAgo(1),
            EndDate: this.endOfMonthNMonthsAgo(1)
        });

        data.push({
            Label: 'Last 3 Months',
            StartDate: this.startOfMonthNMonthsAgo(3),
            EndDate: this.endOfMonthNMonthsAgo(1)
        });

        data.push({
            Label: 'All time',
            StartDate: null,
            EndDate: null
        });

        this.data=data;
        this.callParent(arguments);
        this.loading=false;
        this.fireEvent("load", this);
    }
});