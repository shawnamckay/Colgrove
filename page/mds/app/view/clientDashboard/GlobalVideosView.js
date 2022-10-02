Ext.define('mds.view.clientDashboard.GlobalVideosView', {
    extend: 'Ext.view.View',
    id: 'globalVideosView',
    alias: 'widget.globalVideosView',
    data:[
        {
            title: 'Multivista Video Overview',
            length: '2:10',
            img: '../videos/montage.png',
            link: '../videos/montage.wmv'
        },
        {
            title: "Architect's Walk-Through",
            length: '0:27',
            img: '../videos/architects.png',
            link: '../videos/architects.wmv'
        },
        {
            title: 'Stadium Beam Placement',
            length: '0:37',
            img: '../videos/stadium.png',
            link: '../videos/stadium.wmv'
        },
        {
            title: 'Building Management Systems Part 1',
            length: '0:41',
            img: '../videos/bmsoverview.png',
            link: '../videos/bmsoverview.wmv'
        },
        {
            title: 'Building Management Systems Part 2',
            length: '0:38',
            img: '../videos/bmsoverview2.png',
            link: '../videos/bmsoverview2.wmv'
        },
        {
            title: 'HVAC and Mechanical Walk-Through',
            length: '0:44',
            img: '../videos/hvac.png',
            link: '../videos/hvac.wmv'
        },
        {
            title: 'Structural Wall Tilt-Up',
            length: '0:27',
            img: '../videos/tilt-up.png',
            link: '../videos/tilt-up.wmv'
        }
    
    ],
    margin: "20 10 10 10",
    width: '82%',
    tpl: [
        '<tpl for=".">',
            '<div class="item" style="display:inline-block;margin:10px;">',
                '<div class="itemInner">',
                    '<div class="WebcamImageWrap">',
                        '<a href="{link}"><img src="{img}" alt="" style="max-width:300px" /></a>',
                    '</div>',
                    '<div class="WebcamTitle" style="text-align:center;">',
                        '<a href="{link}">{title}<br/>{length}</a>',
                    '</div>',
                '</div>',
            '</div>',
        '</tpl>'
    ],
    requires: [
        'mds.view.clientDashboard.PreferedDashboardSelector'
    ],
    listeners: {
        afterrender: function() {
            var me = this;
            me.pdSelector.append(me);
        }
    },
    initComponent: function() {
        var me = this;
        me.enableBubble('dashboardpreferenceclicked');
        var model = {
            MemberDashboardPreference: 'Videos'
        };
        me.pdSelector = Ext.create('mds.view.clientDashboard.PreferedDashboardSelector', {model: model});
        me.callParent(arguments);
    },
    itemSelector: ''
});