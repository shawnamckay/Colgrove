/**
 * 
 */
Ext.define('mds.view.clientNavigation.NavigationBar', {
    extend: 'mds.view.clientNavigation.AbstractNavigationBar',
    alias: 'widget.navigationBar',
    requires: [
        'mds.view.clientNavigation.NavigationBarMegamenu'
    ],
    initComponent: function() {
        var me = this;
        me.menu = Ext.create('mds.view.clientNavigation.NavigationBarMegamenu', {});
        var search = (Ext.Object.fromQueryString(document.location.search));
        var projectUID = search.ProjectUID ? search.ProjectUID : '00000000-0000-0000-0000-000000000000';
        me.createProjectNavigationMenu(projectUID, mdslib.getFuseaction());
        me.callParent(arguments);
    },
    listeners: {
        resize: {
            fn: function(component, width, height, oldWidth, oldHeight, eOpts) {
                var me = this;
                me.menu.resetMax();
            }
        }
    },
    /**
     * @private
     */
    createProjectNavigationMenu: function(projectUID, fuseaction) {
        var me = this;
        me.dashboardButton = me.createProjectNavigationButton('Home', 'aClientDashboard.home', undefined, undefined, undefined, 'dashboard.htm'),
        me.photosButton = me.createProjectNavigationButton('Photos', 'aClientPhotoList.home', projectUID, fuseaction, 'aClientPhotoList.', "photoList.htm"),
        me.floorplanButton = Ext.create('Ext.button.Button', {
            hidden: true,
            text: 'Floorplans',
            id: 'projectNavigationBtnFloorplans',
            baseParams: {
                ProjectUID: projectUID
            },
            menu: me.menu,
            listeners: {
                mouseover: {
                    fn: function() {
                        new Ext.util.DelayedTask(hideMenuTask.cancel, me).delay(400);
                        showMenuTask.delay(400);
                    }
                },
                mouseout: {
                    fn: function() {
                        hideMenuTask.delay(250);
                        showMenuTask.cancel();
                    }
                }
            },
            height: 37,
            href: 'floorplanOverview.htm',
            hrefTarget: '',
            /**
             * http://127.0.0.1:8500/sencha/ext-4.1.1a/docs/index.html#!/api/Ext.button.Button-event-focus
             */
            cls: (function() {
               if (fuseaction.toLowerCase().indexOf('aClientFloorplanOverview.'.toLowerCase()) == -1 && 
                   fuseaction.toLowerCase().indexOf('aClientFloorplanViewer.'.toLowerCase()) == -1) {
                   return me.getCurrentButtonClass('aaa', 'bbb');
               }
               return me.getCurrentButtonClass('aaa', 'aaa');
           })()
        });
        var showMenuTask = new Ext.util.DelayedTask(me.floorplanButton.showMenu, me.floorplanButton);
        var hideMenuTask = new Ext.util.DelayedTask(me.floorplanButton.hideMenu, me.floorplanButton);
        me.menu.on({
            mouseover: {
                fn: function() {
                    hideMenuTask.cancel();
                },
                scope: me.menu
            },
            mouseleave: {
                fn: function() {
                    hideMenuTask.delay(250);
                },
                scope: me.menu
            }
        });
        me.teamTalkButton = me.createProjectNavigationButton('TeamTalk', 'aClientTeamTalk.home', projectUID, fuseaction, 'aClientTeamTalk.'),
        me.filesButton = me.createProjectNavigationButton('Files', 'aClientFileManager.view', projectUID, fuseaction, 'aClientFileManager', 'fileManager.htm'),
        me.webcamsButton = me.createProjectNavigationButton('Webcams', 'aClientWebcam.home', projectUID, fuseaction, 'aClientWebcam.', 'webcamOverview.htm'),
        me.peopleButton = me.createProjectNavigationButton('People', 'aClientPeopleOverview.home', projectUID, fuseaction, 'aClientPeopleOverview.', 'peopleOverview.htm'),
        me.videosButton = me.createProjectNavigationButton('Videos', 'aClientVideo.home', projectUID, fuseaction, 'aClientVideo.', 'clientVideo.htm'),
        me.externalLinkButton = Ext.create('Ext.button.Button', {
            hidden: true,
            xtype: 'button',
            text: 'ExternalLink',
            cls: me.getCurrentButtonClass('aa', 'bb'),
            height: me.buttonHeight,
            href: 'http://www.multivista.com',
            hrefTarget: '_blank'
        });
        me.endcapButton = Ext.create('Ext.button.Button', {
            xtype: 'button',
            id: 'projectNavigationBtnEndcap',
            width: 3
        });
        me.setButtonByAlias('dashboard', me.dashboardButton);
        me.setButtonByAlias('photos', me.photosButton);
        me.setButtonByAlias('floorplans', me.floorplanButton);
        me.setButtonByAlias('teamtalk', me.teamTalkButton);
        me.setButtonByAlias('files', me.filesButton);
        me.setButtonByAlias('videos', me.videosButton);
        me.setButtonByAlias('webcams', me.webcamsButton);
        me.setButtonByAlias('people', me.peopleButton);
        me.setButtonByAlias('externallink', me.externalLinkButton);
        me.setButtonByAlias('endcap', me.endcapButton);
        me.setButtonByAlias('projectedit', me.projectEditButton);
        me.items = [
            me.dashboardButton,
            me.photosButton,
            me.floorplanButton,
            me.teamTalkButton,
            me.filesButton,
            me.videosButton,
            me.webcamsButton,
            me.peopleButton,
            me.externalLinkButton,
            me.endcapButton,
            '->',
            me.projectEditButton
        ];
    },
    /**
     * @private
     */
    createProjectNavigationButton: function(buttonText, fuseaction, projectUID, currentFuseaction, match, page) {
        var me = this;
        var baseParams = (!projectUID || '' == projectUID) ? {
        } : {
            ProjectUID: projectUID
        };
        return Ext.create('Ext.button.Button', {
            hidden: true,
            xtype: 'button',
            text: buttonText,
            baseParams: baseParams,
            cls: me.getCurrentButtonClass(currentFuseaction, match),
            height: me.buttonHeight,
            href: page,
            hrefTarget: ''
        });
    },
    /**
     * @private
     */
    getCurrentButtonClass: function(fuseaction, match) {
        return !fuseaction || !match || '' == match || fuseaction.toLowerCase().indexOf(match.toLowerCase()) == -1?
            'projectNavigationMainButtonCls' : 'projectNavigationMainButtonCurrentCls';
    }
});