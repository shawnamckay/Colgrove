Ext.define('mds.view.clientPhotoList.Photo.Drag', {
    extend: 'Ext.dd.DDProxy',
    createFrame: function(){
        var self=this, body=document.body, img, s;

        if (!body||!body.firstChild){
            setTimeout(function(){
                self.createFrame();
            }, 50);
            return;
        }

        img=this.getDragEl();

        if (!img){
            img=document.createElement("img");
            img.id=this.dragElId;
            img.className="photoDragObject";

            // appendChild can blow up IE if invoked prior to the window load event
            // while rendering a table. It is possible there are other scenarios
            // that would cause this to happen as well.
            body.insertBefore(img, body.firstChild);
        }
    },
    showFrame: function(iPageX, iPageY){
        var el=this.getEl(), dragEl=this.getDragEl(), s=dragEl.style;

        dragEl.src=Ext.select("#"+el.id+" img.managedPhotoImage").elements[0].src;
        s.visibility="visible";
    },
    b4MouseDown: function(e){
        var x=e.getPageX(), y=e.getPageY();
        this.setDelta(0, 0);
        this.setDragElPos(x, y);
    },
    startDrag: function(x, y){
        Ext.select(".maskOnDrag").each(function(i){
            Ext.fly(i.dom).mask();
        });
        Ext.select(".photoDropTarget").each(function(i){
            Ext.fly(i.dom).addCls("duringDrag");
        });
        Ext.select(".invalidPhotoDropTarget").each(function(i){
            Ext.fly(i.dom).addCls("duringDrag");
        });
    },
    endDrag: function(e){
        Ext.select(".dragOver").each(function(i){
            Ext.fly(i.dom).removeCls("dragOver");
        });
        Ext.select(".maskOnDrag").each(function(i){
            Ext.fly(i.dom).unmask();
        });
        Ext.select(".photoDropTarget").each(function(i){
            Ext.fly(i.dom).removeCls("duringDrag");
        });
        Ext.select(".invalidPhotoDropTarget").each(function(i){
            Ext.fly(i.dom).removeCls("duringDrag");
        });
    },
    autoScroll: function(dragElX, dragElY, dragElHeight, dragElWidth){
        if (this.scroll){
            var page=Ext.getCmp("pageContainer"), pageBox=page.getBox(), pageBottom=pageBox.y+pageBox.height, dragElBottom=dragElY+dragElHeight, toBot=(pageBottom-dragElBottom), toTop=dragElY-pageBox.y, threshold=40, scrollAmt=(document.all)?80:30;
            if (toBot<threshold) page.scrollBy(0, scrollAmt);
            else if (toTop<threshold) page.scrollBy(0, scrollAmt*-1);
        }
    },
    onDragDrop: function(e, id){
        Ext.select(".dragOver").each(function(i){
            Ext.fly(i.dom).removeCls("dragOver");
        });
        var targetID=(id.split("_"))[1];
        var photoRecord=Ext.getCmp("photoVerticalLoadingScroller").getRecord(this.getEl());
        mds.app.getController("clientPhotoList.Controller").fireEvent("photodrag", photoRecord, targetID);
    },
    onDragEnter: function(e, id){
        Ext.select(".dragOver").each(function(i){
            Ext.fly(i.dom).removeCls("dragOver");
        });
        var dom=document.getElementById(id);
        Ext.fly(dom).addCls('dragOver');
        Ext.fly(this.getDragEl()).addCls("overValidTarget");
    },
    onDragOut: function(e, id){
        Ext.select(".dragOver").each(function(i){
            Ext.fly(i.dom).removeCls("dragOver");
        });
        var dom=document.getElementById(id);
        Ext.fly(dom).removeCls('dragOver');
        Ext.fly(this.getDragEl()).removeCls("overValidTarget");
    }
});
// @ sourceURL=Drag.js
