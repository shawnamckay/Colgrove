Ext.define('mds.model.clientPhotoList.PhotoCategory', {
    extend: 'Ext.data.Model',
    fields: [{
        name: "value",
        mapping: "text"
    }, {
        name: "count"
    }, {
        name: "text",
        convert: function(value, record){
            return "<span class='photoCategoryName' title='"+value+" ("+record.get("count")+" photos)'>"+value+"</span> <span class='photoCategoryCount'>("+record.get("count")+")</span>";
        }
    }, "type", "id", {
        name: "nodeID",
        convert: function(value, record){
            if (!record.get("id")){ return record.get("type"); }
            return record.get("type")+"-"+record.get("id");
        }
    }, {
        name: "leaf",
        type: "boolean"
    }, {
        name: "expanded",
        type: "boolean"
    }, "photoURL", "subgroupLabel", "locations", {
        name: "startDate",
        type: "tzadate"
    }, {
        name: "endDate",
        type: "tzadate"
    }],
    idProperty: "nodeID",
    addNToCount: function(n){
        this.setCount(this.get("count")+n);
    },
    setCount: function(n){
        var dom=Ext.getCmp("photoCategoryTree").getView().getNode(this);
        var classes=dom.className;
        this.set("count", n);
        this.set("text", this.get("value")); // refreshes display
        if (this.parentNode){
            if (this.parentNode.get("type")!="X") this.parentNode.addNToCount(n);
        }
        dom.className=classes; // stop classes from being altered by this operation
    },
    addChild: function(child){
        this.appendChild(child);
        this.addNToCount(child.get("count"));
    }
});