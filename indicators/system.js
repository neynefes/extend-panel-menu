/*
    This file is part of Extend Panel Menu

    Extend Panel Menu is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Extend Panel Menu is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Extend Panel Menu.  If not, see <http://www.gnu.org/licenses/>.

    Copyright 2017 Julio Galvan
*/

const St = imports.gi.St;
const Clutter = imports.gi.Clutter;
const PopupMenu = imports.ui.popupMenu;
const Lang = imports.lang;
const GLib = imports.gi.GLib;
const Gettext = imports.gettext.domain("extend-panel-menu");
const _ = Gettext.gettext;
const Extension = imports.misc.extensionUtils.getCurrentExtension();
const CustomButton = Extension.imports.indicators.button.CustomButton;

const UserIndicator = new Lang.Class({
    Name: "UserIndicator",
    Extends: CustomButton,

    _init: function () {
        this.parent("UserIndicator");
        this._system = new imports.ui.status.system.Indicator();
        this._screencast = new imports.ui.status.screencast.Indicator();

        let username = GLib.get_real_name();
        this._nameLabel = new St.Label({
            text: username,
            y_align: Clutter.ActorAlign.CENTER,
            style_class: "panel-status-menu-box"
        });
        this._userIcon = new St.Icon({
            icon_name: "avatar-default-symbolic",
            style_class: "system-status-icon"
        });
        this.box.add_child(this._screencast.indicators);
        this.box.add_child(this._userIcon);
        this.box.add_child(this._nameLabel);

        this._session = this._system._session;
        this._loginManager = this._system._loginManager;

        this.menu.box.set_width(270);

        //////////////////////////////////////////////////////////////
        // MENU
        let about = new PopupMenu.PopupMenuItem(_("About This Computer"));
        about.connect("activate", Lang.bind(this, this._openApp, "gnome-info-panel.desktop"));
        this.menu.addMenuItem(about);

        let help = new PopupMenu.PopupMenuItem(_("GNOME Help"));
        help.connect("activate", Lang.bind(this, this._openApp, "yelp.desktop"));
        this.menu.addMenuItem(help);

        this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem()); // SEPARATOR

        let settings = new PopupMenu.PopupMenuItem(_("System Settings"));
        settings.connect("activate", Lang.bind(this, this._openApp, "gnome-control-center.desktop"));
        this.menu.addMenuItem(settings);

        let extsettings = new PopupMenu.PopupMenuItem(_("Extension Settings"));
        extsettings.connect("activate", Lang.bind(this, this._openApp, "gnome-shell-extension-prefs.desktop"));
        this.menu.addMenuItem(extsettings);


        this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem()); // SEPARATOR

        let lock = new PopupMenu.PopupMenuItem(_("Lock"));
        lock.connect("activate", Lang.bind(this, this._system._onLockScreenClicked));
        this.menu.addMenuItem(lock);
        if (!this._system._lockScreenAction.visible) {
            lock.actor.hide();
        }

        let switchuser = new PopupMenu.PopupMenuItem(_("Switch User"));
        switchuser.connect("activate", Lang.bind(this, this._system._onLoginScreenActivate));
        this.menu.addMenuItem(switchuser);
        if (!this._system._updateSwitchUser) {
            switchuser.actor.hide();
        }

        this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem()); // SEPARATOR

        let logout = new PopupMenu.PopupMenuItem(_("Log Out"));
        logout.connect("activate", Lang.bind(this, this._system._onQuitSessionActivate));
        this.menu.addMenuItem(logout);
        if (!this._system._updateLogout) {
            logout.actor.hide();
        }

        let account = new PopupMenu.PopupMenuItem(_("Account Settings"));
        account.connect("activate", Lang.bind(this, this._openApp, "gnome-user-accounts-panel.desktop"));
        this.menu.addMenuItem(account);

        this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem()); // SEPARATOR

        //////////////
        // INCONCLUSIVE
        //this.orientation = new PopupMenu.PopupMenuItem(_("Orientation Lock"));
        //this.orientation.connect("activate", Lang.bind(this, this._system._onOrientationLockClicked));
        //this.menu.addMenuItem(this.orientation);
        //if (!this._system._orientationLockAction.visible) {
        //    this.orientation.actor.hide();
        //}
        ///////////////

        let suspend = new PopupMenu.PopupMenuItem(_("Suspend"));
        suspend.connect("activate", Lang.bind(this, this._system._onSuspendClicked));
        this.menu.addMenuItem(suspend);
        if (!this._system._suspendAction.visible) {
            suspend.actor.hide();
        }

        let power = new PopupMenu.PopupMenuItem(_("Power Off"));
        power.connect("activate", Lang.bind(this, this._system._onPowerOffClicked));
        this.menu.addMenuItem(power);
        if (!this._system._powerOffAction.visible) {
            power.actor.hide();
        }
    },
    changeLabel: function (label) {
        if (label == "") {
            label = GLib.get_real_name();
        }
        this._nameLabel.set_text(label);
    },
    changeIcon: function (enabled) {
        if (enabled) {
            this._userIcon.show();
            this._nameLabel.hide();
        } else {
            this._userIcon.hide();
            this._nameLabel.show();
        }
    }
});