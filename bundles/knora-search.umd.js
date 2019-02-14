(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/router'), require('@angular/animations'), require('@angular/forms'), require('@knora/core'), require('jdnconvertiblecalendar'), require('@angular/material'), require('jdnconvertiblecalendardateadapter'), require('@angular/common'), require('@angular/platform-browser/animations'), require('@knora/action'), require('@knora/viewer')) :
    typeof define === 'function' && define.amd ? define('@knora/search', ['exports', '@angular/core', '@angular/router', '@angular/animations', '@angular/forms', '@knora/core', 'jdnconvertiblecalendar', '@angular/material', 'jdnconvertiblecalendardateadapter', '@angular/common', '@angular/platform-browser/animations', '@knora/action', '@knora/viewer'], factory) :
    (factory((global.knora = global.knora || {}, global.knora.search = {}),global.ng.core,global.ng.router,global.ng.animations,global.ng.forms,null,null,global.ng.material,null,global.ng.common,global.ng.platformBrowser.animations,null,null));
}(this, (function (exports,core,router,animations,forms,core$1,jdnconvertiblecalendar,material,jdnconvertiblecalendardateadapter,common,animations$1,action,viewer) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    function __values(o) {
        var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
        if (m)
            return m.call(o);
        return {
            next: function () {
                if (o && i >= o.length)
                    o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
    }

    var SearchComponent = /** @class */ (function () {
        function SearchComponent(_route, _router, _eleRef) {
            this._route = _route;
            this._router = _router;
            this._eleRef = _eleRef;
            this.route = '/search';
            this.searchPanelFocus = false;
            this.prevSearch = JSON.parse(localStorage.getItem('prevSearch'));
            this.focusOnSimple = 'inactive';
            this.focusOnExtended = 'inactive';
            this.searchLabel = 'Search';
            this.showSimpleSearch = true;
        }
        SearchComponent.prototype.ngOnInit = function () {
        };
        /**
         * @ignore
         * Do search on Enter click, reset search on Escape
         * @param search_ele
         * @param event
         * @returns void
         */
        SearchComponent.prototype.onKey = function (search_ele, event) {
            this.focusOnSimple = 'active';
            this.prevSearch = JSON.parse(localStorage.getItem('prevSearch'));
            if (this.searchQuery && (event.key === 'Enter' || event.keyCode === 13 || event.which === 13)) {
                this.doSearch(search_ele);
            }
            if (event.key === 'Escape' || event.keyCode === 27 || event.which === 27) {
                this.resetSearch(search_ele);
            }
        };
        /**
         * Realise a simple search
         * @param {HTMLElement} search_ele
         * @returns void
         */
        SearchComponent.prototype.doSearch = function (search_ele) {
            var e_1, _a;
            if (this.searchQuery !== undefined && this.searchQuery !== null) {
                this.toggleMenu('simpleSearch');
                this._router.navigate([this.route + '/fulltext/' + this.searchQuery]);
                // this._router.navigate(['/search/fulltext/' + this.searchQuery], { relativeTo: this._route });
                // push the search query into the local storage prevSearch array (previous search)
                // to have a list of recent search requests
                var existingPrevSearch = JSON.parse(localStorage.getItem('prevSearch'));
                if (existingPrevSearch === null) {
                    existingPrevSearch = [];
                }
                var i = 0;
                try {
                    for (var existingPrevSearch_1 = __values(existingPrevSearch), existingPrevSearch_1_1 = existingPrevSearch_1.next(); !existingPrevSearch_1_1.done; existingPrevSearch_1_1 = existingPrevSearch_1.next()) {
                        var entry = existingPrevSearch_1_1.value;
                        // remove entry, if exists already
                        if (this.searchQuery === entry) {
                            existingPrevSearch.splice(i, 1);
                        }
                        i++;
                    }
                }
                catch (e_1_1) {
                    e_1 = { error: e_1_1 };
                }
                finally {
                    try {
                        if (existingPrevSearch_1_1 && !existingPrevSearch_1_1.done && (_a = existingPrevSearch_1.return))
                            _a.call(existingPrevSearch_1);
                    }
                    finally {
                        if (e_1)
                            throw e_1.error;
                    }
                }
                existingPrevSearch.push(this.searchQuery);
                localStorage.setItem('prevSearch', JSON.stringify(existingPrevSearch));
                // TODO: save the previous search queries somewhere in the user's profile
            }
            else {
                search_ele.focus();
                this.prevSearch = JSON.parse(localStorage.getItem('prevSearch'));
            }
        };
        /**
         * @ignore
         *
         * Reset the search
         * @param {HTMLElement} search_ele
         * @returns void
         */
        SearchComponent.prototype.resetSearch = function (search_ele) {
            this.searchQuery = null;
            search_ele.focus();
            this.focusOnSimple = 'inactive';
            this.searchPanelFocus = !this.searchPanelFocus;
        };
        /**
         * @ignore
         *
         * Realise a previous search
         * @param {string} query
         * @returns void
         */
        SearchComponent.prototype.doPrevSearch = function (query) {
            this.searchQuery = query;
            this._router.navigate([this.route + '/fulltext/' + query], { relativeTo: this._route });
            this.toggleMenu('simpleSearch');
        };
        /**
         * @ignore
         *
         * Reset previous searches - the whole previous search or specific item by name
         * @param {string} name term of the search
         * @returns void
         */
        SearchComponent.prototype.resetPrevSearch = function (name) {
            if (name === void 0) {
                name = null;
            }
            if (name) {
                // delete only this item with the name ...
                var i = this.prevSearch.indexOf(name);
                this.prevSearch.splice(i, 1);
                localStorage.setItem('prevSearch', JSON.stringify(this.prevSearch));
            }
            else {
                // delete the whole "previous search" array
                localStorage.removeItem('prevSearch');
            }
            this.prevSearch = JSON.parse(localStorage.getItem('prevSearch'));
        };
        /**
         * @ignore
         * Set simple focus to active
         *
         * @returns void
         */
        SearchComponent.prototype.setFocus = function () {
            this.prevSearch = JSON.parse(localStorage.getItem('prevSearch'));
            this.focusOnSimple = 'active';
            this.searchPanelFocus = !this.searchPanelFocus;
        };
        /**
         * @ignore
         *
         * Switch according to the focus between simple or extended search
         *
         * @param {string} name 2 cases: simpleSearch or extendedSearch
         * @returns void
         */
        SearchComponent.prototype.toggleMenu = function (name) {
            switch (name) {
                case 'simpleSearch':
                    this.prevSearch = JSON.parse(localStorage.getItem('prevSearch'));
                    this.focusOnSimple = (this.focusOnSimple === 'active' ? 'inactive' : 'active');
                    this.showSimpleSearch = true;
                    break;
                case 'extendedSearch':
                    this.focusOnExtended = (this.focusOnExtended === 'active' ? 'inactive' : 'active');
                    this.showSimpleSearch = false;
                    break;
            }
        };
        SearchComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'kui-search',
                        template: "<div class=\"search-bar-elements\">\n\n    <!-- the next element - div.extended-search-panel - is a hidden dropdown filter menu -->\n\n    <div class=\"search-panel\" [class.active]=\"searchPanelFocus\">\n        <div>\n            <button class=\"prefix\" (click)=\"doSearch(search)\">\n                <mat-icon>search</mat-icon>\n            </button>\n        </div>\n\n        <div class=\"input-field\">\n            <input #search autocomplete=\"off\" type=\"search\" [placeholder]=\"searchLabel\" [(ngModel)]=\"searchQuery\" name=\"search\" (keyup.esc)=\"resetSearch(search)\" (keyup)=\"onKey(search, $event)\" (click)=\"setFocus()\" (focus)=\"toggleMenu('simpleSearch')\" [disabled]=\"focusOnExtended === 'active'\" />\n        </div>\n\n        <!-- switch button: on some focus we need a close button for the simple or extended panel -->\n        <div>\n            <button class=\"suffix\" *ngIf=\"focusOnSimple === 'active'\" (click)=\"resetSearch(search)\">\n                <mat-icon>close</mat-icon>\n            </button>\n            <button class=\"suffix\" *ngIf=\"focusOnSimple === 'inactive'\">\n            </button>\n        </div>\n\n        <!-- the search panel has two \"dropdown\" menus: one for simple search and another one for the extended search -->\n        <div class=\"kui-menu simple-search\" [@simpleSearchMenu]=\"focusOnSimple\" *ngIf=\"showSimpleSearch\">\n            <mat-list class=\"kui-previous-search-list\">\n                <mat-list-item *ngFor=\"let item of prevSearch | kuiReverse; let i=index\">\n                    <h4 mat-line *ngIf=\"i<10\" (click)=\"doPrevSearch(item)\">{{item}}</h4>\n                    <button mat-icon-button (click)=\"resetPrevSearch(item)\">\n                        <mat-icon aria-label=\"close\">close</mat-icon>\n                    </button>\n                </mat-list-item>\n            </mat-list>\n            <button mat-stroked-button color=\"accent\" class=\"right\" (click)=\"resetPrevSearch()\" *ngIf=\"prevSearch\">Clear</button>\n        </div>\n\n        <div class=\"kui-menu extended-search\" [@extendedSearchMenu]=\"focusOnExtended\">\n            <div class=\"kui-menu-header\">\n                <span class=\"kui-menu-title\">\n                    <h4>Advanced search</h4>\n                </span>\n                <span class=\"kui-menu-action\">\n                    <button mat-icon-button (click)=\"toggleMenu('extendedSearch')\">\n                        <mat-icon>close</mat-icon>\n                    </button>\n                </span>\n            </div>\n            <div class=\"extended-search-box\">\n                <kui-extended-search [route]=\"route\" (toggleExtendedSearchForm)=\"toggleMenu('extendedSearch')\"></kui-extended-search>\n            </div>\n        </div>\n    </div>\n\n    <!-- Extended search button to display the extended search form in the search panel -->\n    <button mat-button type=\"button\" color=\"primary\" class=\"advanced-search-button\" (click)=\"toggleMenu('extendedSearch')\">\n        advanced\n    </button>\n\n</div>",
                        styles: ["input[type=search]::-webkit-search-cancel-button,input[type=search]::-webkit-search-decoration,input[type=search]::-webkit-search-results-button,input[type=search]::-webkit-search-results-decoration{display:none}input[type=search]{-moz-appearance:none;-webkit-appearance:none}.center{display:block;margin-left:auto;margin-right:auto}.close{right:12px}.extended-search-box{margin:12px}.advanced-search-button{margin-left:10px}.full-width{width:100%}.hide{display:none}.inactive,.mute{color:#7a7a7a}.search-panel{background-color:#f9f9f9;border-radius:4px;display:inline-flex;height:40px;width:680px;z-index:10}.search-panel:hover{box-shadow:0 1px 3px rgba(0,0,0,.5)}.search-panel div.input-field{flex:1}.search-panel div.input-field input{border-style:none;font-size:14pt;height:38px;position:absolute;width:calc(100% - 80px)}.search-panel div.input-field input:active,.search-panel div.input-field input:focus{outline:0}.search-panel div .prefix,.search-panel div .suffix{background-color:#fff;border-radius:3px;border-style:none;color:rgba(41,41,41,.4);cursor:pointer;height:38px;outline:0;position:relative;width:40px}.search-panel div .prefix:active,.search-panel div .suffix:active{color:#515151}.search-panel.active{box-shadow:0 1px 3px rgba(0,0,0,.5)}.kui-menu{box-shadow:0 3px 5px -1px rgba(11,11,11,.2),0 6px 10px 0 rgba(11,11,11,.14),0 1px 18px 0 rgba(11,11,11,.12);background-color:#f9f9f9;border-radius:4px;position:absolute}.kui-menu .kui-menu-header{background-color:#f9f9f9;border-top-left-radius:4px;border-top-right-radius:4px;display:inline-block;height:48px;width:100%}.kui-menu .kui-menu-header .kui-menu-title{float:left;font-size:14px;font-weight:400;margin-top:4px;padding:12px}.kui-menu .kui-menu-header .kui-menu-action{float:right;margin:4px}.kui-menu.extended-search,.kui-menu.simple-search{min-height:680px;width:680px}.kui-menu.simple-search{padding-top:60px;z-index:-1}.kui-menu.simple-search .kui-previous-search-list .mat-list-item{cursor:pointer}.kui-menu.simple-search .kui-previous-search-list .mat-list-item:hover{background-color:#f9f9f9}.kui-menu.simple-search .kui-previous-search-list .mat-list-item:hover mat-icon{display:block}.kui-menu.simple-search .kui-previous-search-list .mat-list-item mat-icon{display:none}.kui-menu.simple-search .right{margin-top:12px;margin-left:16px}.kui-menu.extended-search{z-index:20}.search-bar-elements{z-index:100}.show{display:block}@media screen and (max-width:1024px){.search-panel{width:480px}.search-panel div.input-field input{width:calc(480px - 80px)}.kui-menu.extended-search,.kui-menu.simple-search{width:480px}}@media screen and (max-width:768px){.search-panel{width:calc(480px - 160px)}.search-panel div.input-field input{width:calc(480px - 160px - 80px)}.kui-menu.extended-search,.kui-menu.simple-search{width:calc(480px - 80px)}}"],
                        animations: [
                            animations.trigger('simpleSearchMenu', [
                                animations.state('inactive', animations.style({ display: 'none' })),
                                animations.state('active', animations.style({ display: 'block' })),
                                animations.transition('inactive => true', animations.animate('100ms ease-in')),
                                animations.transition('true => inactive', animations.animate('100ms ease-out'))
                            ]),
                            animations.trigger('extendedSearchMenu', [
                                animations.state('inactive', animations.style({ display: 'none' })),
                                animations.state('active', animations.style({ display: 'block' })),
                                animations.transition('inactive => true', animations.animate('100ms ease-in')),
                                animations.transition('true => inactive', animations.animate('100ms ease-out'))
                            ]),
                        ]
                    },] },
        ];
        /** @nocollapse */
        SearchComponent.ctorParameters = function () {
            return [
                { type: router.ActivatedRoute },
                { type: router.Router },
                { type: core.ElementRef }
            ];
        };
        SearchComponent.propDecorators = {
            route: [{ type: core.Input }]
        };
        return SearchComponent;
    }());

    var SearchPanelComponent = /** @class */ (function () {
        function SearchPanelComponent() {
            this.route = '/search';
            this.showMenu = false;
            this.focusOnExtended = 'inactive';
        }
        /**
         * Show or hide the extended search menu
         *
         * @returns void
         */
        SearchPanelComponent.prototype.toggleMenu = function () {
            this.showMenu = !this.showMenu;
            this.focusOnExtended = (this.focusOnExtended === 'active' ? 'inactive' : 'active');
        };
        SearchPanelComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'kui-search-panel',
                        template: "<div class=\"kui-search-panel\">\n\n    <div class=\"kui-search-bar\">\n\n        <div class=\"fulltext-search\">\n            <kui-fulltext-search [route]=\"route\"></kui-fulltext-search>\n        </div>\n\n        <div *ngIf=\"showMenu\" [@extendedSearchMenu]=\"focusOnExtended\" class=\"kui-menu extended-search\">\n            <div class=\"kui-menu-header\">\n                <span class=\"kui-menu-title\">\n                    <h4>Advanced search</h4>\n                </span>\n                <span class=\"kui-menu-action\">\n                    <button mat-icon-button (click)=\"toggleMenu()\">\n                        <mat-icon>close</mat-icon>\n                    </button>\n                </span>\n            </div>\n            <div class=\"extended-search-box\">\n                <kui-extended-search [route]=\"route\" (toggleExtendedSearchForm)=\"toggleMenu()\"></kui-extended-search>\n            </div>\n        </div>\n\n    </div>\n\n    <div class=\"advanced-btn\">\n        <button mat-button color=\"primary\" (click)=\"toggleMenu()\">advanced</button>\n    </div>\n\n</div>",
                        styles: [".advanced-btn{margin-left:10px}.kui-search-panel{display:flex;position:relative;z-index:100}.kui-search-bar{background-color:#f9f9f9;border-radius:4px;display:inline-flex;height:40px;position:relative;z-index:10}.kui-search-bar:hover{box-shadow:0 1px 3px rgba(0,0,0,.5)}.kui-menu{box-shadow:0 3px 5px -1px rgba(11,11,11,.2),0 6px 10px 0 rgba(11,11,11,.14),0 1px 18px 0 rgba(11,11,11,.12);background-color:#f9f9f9;border-radius:4px;position:absolute}.kui-menu .kui-menu-header{background-color:#f9f9f9;border-top-left-radius:4px;border-top-right-radius:4px;display:inline-block;height:48px;width:100%}.kui-menu .kui-menu-header .kui-menu-title{float:left;font-size:14px;font-weight:400;margin-top:4px;padding:12px}.kui-menu .kui-menu-header .kui-menu-action{float:right;margin:4px}.kui-menu.extended-search{min-height:680px;width:680px;z-index:20}.extended-search-box{margin:12px}@media screen and (max-width:1024px){.kui-search-bar{width:480px}.kui-search-bar div.input-field input{width:calc(480px - 80px)}.fulltext-search,.kui-menu.extended-search{width:480px}}@media screen and (max-width:768px){.kui-search-bar{width:calc(480px - 160px)}.kui-search-bar div.input-field input{width:calc(480px - 160px - 80px)}.fulltext-search,.kui-menu.extended-search{width:calc(480px - 80px)}}"],
                        animations: [
                            animations.trigger('extendedSearchMenu', [
                                animations.state('inactive', animations.style({ display: 'none' })),
                                animations.state('active', animations.style({ display: 'block' })),
                                animations.transition('inactive => active', animations.animate('100ms ease-in')),
                                animations.transition('active => inactive', animations.animate('100ms ease-out'))
                            ])
                        ]
                    },] },
        ];
        /** @nocollapse */
        SearchPanelComponent.ctorParameters = function () { return []; };
        SearchPanelComponent.propDecorators = {
            route: [{ type: core.Input }]
        };
        return SearchPanelComponent;
    }());

    var FulltextSearchComponent = /** @class */ (function () {
        function FulltextSearchComponent(_route, _router) {
            this._route = _route;
            this._router = _router;
            this.route = '/search';
            this.showSimpleSearch = true;
            this.searchPanelFocus = false;
            this.prevSearch = JSON.parse(localStorage.getItem('prevSearch'));
            this.focusOnSimple = 'inactive';
            this.searchLabel = 'Search';
        }
        FulltextSearchComponent.prototype.ngOnInit = function () {
        };
        /**
         * @ignore
         * Do search on Enter click, reset search on Escape
         * @param search_ele
         * @param event
         * @returns void
         */
        FulltextSearchComponent.prototype.onKey = function (search_ele, event) {
            this.focusOnSimple = 'active';
            this.prevSearch = JSON.parse(localStorage.getItem('prevSearch'));
            if (this.searchQuery && (event.key === 'Enter' || event.keyCode === 13 || event.which === 13)) {
                this.doSearch(search_ele);
            }
            if (event.key === 'Escape' || event.keyCode === 27 || event.which === 27) {
                this.resetSearch(search_ele);
            }
        };
        /**
         * Realise a simple search
         * @param {HTMLElement} search_ele
         * @returns void
         */
        FulltextSearchComponent.prototype.doSearch = function (search_ele) {
            var e_1, _a;
            if (this.searchQuery !== undefined && this.searchQuery !== null) {
                this.toggleMenu();
                this._router.navigate([this.route + '/fulltext/' + this.searchQuery]);
                // this._router.navigate(['/search/fulltext/' + this.searchQuery], { relativeTo: this._route });
                // push the search query into the local storage prevSearch array (previous search)
                // to have a list of recent search requests
                var existingPrevSearch = JSON.parse(localStorage.getItem('prevSearch'));
                if (existingPrevSearch === null) {
                    existingPrevSearch = [];
                }
                var i = 0;
                try {
                    for (var existingPrevSearch_1 = __values(existingPrevSearch), existingPrevSearch_1_1 = existingPrevSearch_1.next(); !existingPrevSearch_1_1.done; existingPrevSearch_1_1 = existingPrevSearch_1.next()) {
                        var entry = existingPrevSearch_1_1.value;
                        // remove entry, if exists already
                        if (this.searchQuery === entry) {
                            existingPrevSearch.splice(i, 1);
                        }
                        i++;
                    }
                }
                catch (e_1_1) {
                    e_1 = { error: e_1_1 };
                }
                finally {
                    try {
                        if (existingPrevSearch_1_1 && !existingPrevSearch_1_1.done && (_a = existingPrevSearch_1.return))
                            _a.call(existingPrevSearch_1);
                    }
                    finally {
                        if (e_1)
                            throw e_1.error;
                    }
                }
                existingPrevSearch.push(this.searchQuery);
                localStorage.setItem('prevSearch', JSON.stringify(existingPrevSearch));
            }
            else {
                search_ele.focus();
                this.prevSearch = JSON.parse(localStorage.getItem('prevSearch'));
            }
        };
        /**
         * Reset the search
         * @param {HTMLElement} search_ele
         * @returns void
         */
        FulltextSearchComponent.prototype.resetSearch = function (search_ele) {
            this.searchQuery = null;
            search_ele.focus();
            this.focusOnSimple = 'inactive';
            this.searchPanelFocus = !this.searchPanelFocus;
        };
        /**
         * Switch according to the focus between simple or extended search
         *
         * @param {string} name 2 cases: simpleSearch or extendedSearch
         * @returns void
         */
        FulltextSearchComponent.prototype.toggleMenu = function () {
            this.prevSearch = JSON.parse(localStorage.getItem('prevSearch'));
            this.focusOnSimple = (this.focusOnSimple === 'active' ? 'inactive' : 'active');
            this.showSimpleSearch = true;
        };
        /**
         * Set simple focus to active
         *
         * @returns void
         */
        FulltextSearchComponent.prototype.setFocus = function () {
            this.prevSearch = JSON.parse(localStorage.getItem('prevSearch'));
            this.focusOnSimple = 'active';
            this.searchPanelFocus = !this.searchPanelFocus;
        };
        /**
         * Realise a previous search
         * @param {string} query
         * @returns void
         */
        FulltextSearchComponent.prototype.doPrevSearch = function (query) {
            this.searchQuery = query;
            this._router.navigate([this.route + '/fulltext/' + query], { relativeTo: this._route });
            this.toggleMenu();
        };
        /**
         * Reset previous searches - the whole previous search or specific item by name
         * @param {string} name term of the search
         * @returns void
         */
        FulltextSearchComponent.prototype.resetPrevSearch = function (name) {
            if (name === void 0) {
                name = null;
            }
            if (name) {
                // delete only this item with the name ...
                var i = this.prevSearch.indexOf(name);
                this.prevSearch.splice(i, 1);
                localStorage.setItem('prevSearch', JSON.stringify(this.prevSearch));
            }
            else {
                // delete the whole "previous search" array
                localStorage.removeItem('prevSearch');
            }
            this.prevSearch = JSON.parse(localStorage.getItem('prevSearch'));
        };
        FulltextSearchComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'kui-fulltext-search',
                        template: "<div class=\"search-bar-elements\">\n\n    <div class=\"fulltext-search-bar\" [class.active]=\"searchPanelFocus\">\n        <div>\n            <button class=\"prefix\" (click)=\"doSearch(search)\">\n                <mat-icon>search</mat-icon>\n            </button>\n        </div>\n\n        <div class=\"input-field\">\n            <input #search autocomplete=\"off\" type=\"search\" [placeholder]=\"searchLabel\" [(ngModel)]=\"searchQuery\" name=\"search\" (keyup.esc)=\"resetSearch(search)\" (keyup)=\"onKey(search, $event)\" (click)=\"setFocus()\" (focus)=\"toggleMenu()\" />\n        </div>\n\n        <!-- switch button: on some focus we need a close button for the simple -->\n        <div>\n            <button class=\"suffix\" *ngIf=\"focusOnSimple === 'active'\" (click)=\"resetSearch(search)\">\n                <mat-icon>close</mat-icon>\n            </button>\n            <button class=\"suffix\" *ngIf=\"focusOnSimple === 'inactive'\"></button>\n        </div>\n\n        <!-- \"dropdown\" menu for simple search -->\n        <div class=\"kui-menu simple-search\" [@fulltextSearchMenu]=\"focusOnSimple\" *ngIf=\"showSimpleSearch\">\n            <mat-list class=\"kui-previous-search-list\">\n                <mat-list-item *ngFor=\"let item of prevSearch | kuiReverse; let i=index\">\n                    <h4 mat-line *ngIf=\"i<10\" (click)=\"doPrevSearch(item)\">{{item}}</h4>\n                    <button mat-icon-button (click)=\"resetPrevSearch(item)\">\n                        <mat-icon aria-label=\"close\">close</mat-icon>\n                    </button>\n                </mat-list-item>\n            </mat-list>\n            <button mat-stroked-button color=\"accent\" class=\"right\" (click)=\"resetPrevSearch()\" *ngIf=\"prevSearch\">Clear</button>\n        </div>\n\n    </div>\n</div>",
                        styles: ["input[type=search]::-webkit-search-cancel-button,input[type=search]::-webkit-search-decoration,input[type=search]::-webkit-search-results-button,input[type=search]::-webkit-search-results-decoration{display:none}input[type=search]{-moz-appearance:none;-webkit-appearance:none}.full-width{width:100%}.close{right:12px}.hide{display:none}.show{display:block}.search-bar-elements{display:flex;position:relative;z-index:100}.inactive{color:#7a7a7a}.fulltext-search-bar{background-color:#f9f9f9;border-radius:4px;display:inline-flex;height:40px;position:relative;width:680px;z-index:10}.fulltext-search-bar:hover{box-shadow:0 1px 3px rgba(0,0,0,.5)}.fulltext-search-bar div.input-field{flex:1}.fulltext-search-bar div.input-field input{border-style:none;font-size:14pt;height:38px;position:absolute;width:calc(100% - 80px)}.fulltext-search-bar div.input-field input:active,.fulltext-search-bar div.input-field input:focus{outline:0}.fulltext-search-bar div .prefix,.fulltext-search-bar div .suffix{background-color:#fff;border-radius:3px;border-style:none;color:rgba(41,41,41,.4);cursor:pointer;height:38px;outline:0;position:relative;width:40px}.fulltext-search-bar div .prefix:active,.fulltext-search-bar div .suffix:active{color:#515151}.fulltext-search-bar div.active{box-shadow:0 1px 3px rgba(0,0,0,.5)}.kui-menu{box-shadow:0 3px 5px -1px rgba(11,11,11,.2),0 6px 10px 0 rgba(11,11,11,.14),0 1px 18px 0 rgba(11,11,11,.12);background-color:#f9f9f9;border-radius:4px;position:absolute}.kui-menu.simple-search{min-height:680px;width:680px;padding-top:60px;z-index:-1}.kui-menu.simple-search .kui-previous-search-list .mat-list-item{cursor:pointer}.kui-menu.simple-search .kui-previous-search-list .mat-list-item:hover{background-color:#f9f9f9}.kui-menu.simple-search .kui-previous-search-list .mat-list-item:hover mat-icon{display:block}.kui-menu.simple-search .kui-previous-search-list .mat-list-item mat-icon{display:none}.kui-menu.simple-search .right{margin-top:12px;margin-left:16px}@media screen and (max-width:1024px){.fulltext-search-bar{width:480px}.fulltext-search-bar div.input-field input{width:calc(480px - 80px)}.kui-menu.simple-search{width:480px}}@media screen and (max-width:768px){.fulltext-search-bar{width:calc(480px - 160px)}.fulltext-search-bar div.input-field input{width:calc(480px - 160px - 80px)}.kui-menu.simple-search{width:calc(480px - 80px)}}"],
                        animations: [
                            animations.trigger('fulltextSearchMenu', [
                                animations.state('inactive', animations.style({ display: 'none' })),
                                animations.state('active', animations.style({ display: 'block' })),
                                animations.transition('inactive => active', animations.animate('100ms ease-in')),
                                animations.transition('active => inactive', animations.animate('100ms ease-out'))
                            ])
                        ]
                    },] },
        ];
        /** @nocollapse */
        FulltextSearchComponent.ctorParameters = function () {
            return [
                { type: router.ActivatedRoute },
                { type: router.Router }
            ];
        };
        FulltextSearchComponent.propDecorators = {
            route: [{ type: core.Input }]
        };
        return FulltextSearchComponent;
    }());

    var ExtendedSearchComponent = /** @class */ (function () {
        function ExtendedSearchComponent(fb, _route, _router, _cacheService, _gravSearchService) {
            this.fb = fb;
            this._route = _route;
            this._router = _router;
            this._cacheService = _cacheService;
            this._gravSearchService = _gravSearchService;
            // trigger toggle for extended search form
            this.toggleExtendedSearchForm = new core.EventEmitter();
            // all available ontologies
            this.ontologies = [];
            // properties specified by the user
            this.activeProperties = [];
            // resource classes for the selected ontology
            this.resourceClasses = [];
            this.result = new core$1.ReadResourcesSequence([], 0);
            // form validation status
            this.formValid = false;
        }
        ExtendedSearchComponent.prototype.ngOnInit = function () {
            var _this = this;
            // parent form is empty, it gets passed to the child components
            this.form = this.fb.group({});
            // if form status changes, re-run validation
            this.form.statusChanges.subscribe(function (data) {
                _this.formValid = _this.validateForm();
                // console.log(this.form);
            });
            // initialize ontologies to be used for the ontologies selection in the search form
            this.initializeOntologies();
        };
        /**
         * Add a property to the search form.
         * @returns void
         */
        ExtendedSearchComponent.prototype.addProperty = function () {
            this.activeProperties.push(true);
        };
        /**
         * Remove the last property from the search form.
         * @returns void
         */
        ExtendedSearchComponent.prototype.removeProperty = function () {
            this.activeProperties.splice(-1, 1);
        };
        /**
         * Gets all available ontologies for the search form.
         * @returns void
         */
        ExtendedSearchComponent.prototype.initializeOntologies = function () {
            var _this = this;
            this._cacheService.getOntologiesMetadata().subscribe(function (ontologies) {
                _this.ontologies = ontologies;
            });
        };
        /**
         * Once an ontology has been selected, gets its classes and properties.
         * The classes and properties will be made available to the user for selection.
         *
         * @param ontologyIri Iri of the ontology chosen by the user.
         * @returns void
         */
        ExtendedSearchComponent.prototype.getResourceClassesAndPropertiesForOntology = function (ontologyIri) {
            var _this = this;
            // reset active resource class definition
            this.activeResourceClass = undefined;
            // reset specified properties
            this.activeProperties = [];
            this.activeOntology = ontologyIri;
            this._cacheService.getEntityDefinitionsForOntologies([ontologyIri]).subscribe(function (ontoInfo) {
                _this.resourceClasses = ontoInfo.getResourceClassesAsArray(true);
                _this.properties = ontoInfo.getProperties();
            });
        };
        /**
         * Once a resource class has been selected, gets its properties.
         * The properties will be made available to the user for selection.
         *
         * @param resourceClassIri
         * @returns void
         */
        ExtendedSearchComponent.prototype.getPropertiesForResourceClass = function (resourceClassIri) {
            var _this = this;
            // reset specified properties
            this.activeProperties = [];
            // if the client undoes the selection of a resource class, use the active ontology as a fallback
            if (resourceClassIri === null) {
                this.getResourceClassesAndPropertiesForOntology(this.activeOntology);
            }
            else {
                this._cacheService.getResourceClassDefinitions([resourceClassIri]).subscribe(function (ontoInfo) {
                    _this.properties = ontoInfo.getProperties();
                    _this.activeResourceClass = ontoInfo.getResourceClasses()[resourceClassIri];
                });
            }
        };
        /**
         * Validates form and returns its status (boolean).
         */
        ExtendedSearchComponent.prototype.validateForm = function () {
            // check that either a resource class is selected or at least one property is specified
            return this.form.valid &&
                (this.propertyComponents.length > 0 || (this.resourceClassComponent !== undefined && this.resourceClassComponent.getResourceClassSelected() !== false));
        };
        /**
         * Resets the form (selected resource class and specified properties) preserving the active ontology.
         */
        ExtendedSearchComponent.prototype.resetForm = function () {
            if (this.activeOntology !== undefined) {
                this.getResourceClassesAndPropertiesForOntology(this.activeOntology);
            }
        };
        /**
         * Creates a GravSearch query with the given form values and calls the extended search route.
         */
        ExtendedSearchComponent.prototype.submit = function () {
            if (!this.formValid)
                return; // check that from is valid
            var resClassOption = this.resourceClassComponent.getResourceClassSelected();
            var resClass;
            if (resClassOption !== false) {
                resClass = resClassOption;
            }
            var properties = this.propertyComponents.map(function (propComp) {
                return propComp.getPropertySelectedWithValue();
            });
            var gravsearch = this._gravSearchService.createGravsearchQuery(properties, resClass, 0);
            this._router.navigate([this.route + '/extended/', gravsearch], { relativeTo: this._route });
            // toggle extended search form
            this.toggleExtendedSearchForm.emit(true);
        };
        ExtendedSearchComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'kui-extended-search',
                        template: "<form [formGroup]=\"form\" (ngSubmit)=\"submit()\">\n\n  <div>\n    <kui-select-ontology *ngIf=\"ontologies.length > 0\" [formGroup]=\"form\" [ontologies]=\"ontologies\" (ontologySelected)=\"getResourceClassesAndPropertiesForOntology($event)\"></kui-select-ontology>\n  </div>\n\n  <div class=\"select-resource-class\" *ngIf=\"resourceClasses?.length > 0\">\n    <kui-select-resource-class #resourceClass [formGroup]=\"form\" [resourceClasses]=\"resourceClasses\" (resourceClassSelectedEvent)=\"getPropertiesForResourceClass($event)\"></kui-select-resource-class>\n  </div>\n\n  <div class=\"select-property\" *ngIf=\"properties !== undefined\">\n    <div *ngFor=\"let prop of activeProperties; let i = index\">\n\n      <kui-select-property #property [activeResourceClass]=\"activeResourceClass\" [formGroup]=\"form\" [index]=\"i\" [properties]=\"properties\"></kui-select-property>\n\n    </div>\n  </div>\n\n\n  <div>\n    <button mat-mini-fab class=\"property-buttons add-property-button\" color=\"primary\" type=\"button\" (click)=\"addProperty()\" [disabled]=\"activeOntology === undefined || activeProperties.length >= 4\">\n      <mat-icon aria-label=\"add a property\">add</mat-icon>\n    </button>\n\n    <button mat-mini-fab class=\"property-buttons remove-property-button\" color=\"primary\" type=\"button\" (click)=\"removeProperty()\" [disabled]=\"activeProperties.length == 0\">\n      <mat-icon aria-label=\"remove property\">remove</mat-icon>\n    </button>\n  </div>\n\n  <!--  <div>\n    <button mat-icon-button type=\"button\" (click)=\"resetForm()\" [disabled]=\"this.activeOntology === undefined\">\n      <mat-icon aria-label=\"reset query form\">clear</mat-icon>\n    </button>\n\n    <button mat-icon-button type=\"submit\" [disabled]=\"!formValid\">\n      <mat-icon aria-label=\"submit query\">send</mat-icon>\n    </button>\n  </div> -->\n\n  <button class=\"extended-buttons extended-search-button\" mat-stroked-button color=\"primary\" type=\"submit\" [disabled]=\"!formValid\">\n    Search\n  </button>\n  <button class=\"extended-buttons reset\" mat-stroked-button type=\"button\" (click)=\"resetForm()\" [disabled]=\"this.activeOntology === undefined\">\n    Reset\n  </button>\n\n\n</form>\n",
                        styles: [".add-property-button{margin-right:5px}.extended-buttons{margin-top:25px}.extended-search-button{margin-right:5px}.property-buttons{margin-top:25px}.select-property{margin-left:22px}.select-resource-class{margin-left:12px}"]
                    },] },
        ];
        /** @nocollapse */
        ExtendedSearchComponent.ctorParameters = function () {
            return [
                { type: forms.FormBuilder, decorators: [{ type: core.Inject, args: [forms.FormBuilder,] }] },
                { type: router.ActivatedRoute },
                { type: router.Router },
                { type: core$1.OntologyCacheService },
                { type: core$1.GravsearchGenerationService }
            ];
        };
        ExtendedSearchComponent.propDecorators = {
            route: [{ type: core.Input }],
            toggleExtendedSearchForm: [{ type: core.Output }],
            resourceClassComponent: [{ type: core.ViewChild, args: ['resourceClass',] }],
            propertyComponents: [{ type: core.ViewChildren, args: ['property',] }]
        };
        return ExtendedSearchComponent;
    }());

    var SelectOntologyComponent = /** @class */ (function () {
        function SelectOntologyComponent(fb) {
            this.fb = fb;
            this.ontologySelected = new core.EventEmitter();
        }
        SelectOntologyComponent.prototype.ngOnInit = function () {
            var _this = this;
            // build a form for the named graph selection
            this.form = this.fb.group({
                ontology: [null, forms.Validators.required]
            });
            // emit Iri of the ontology when being selected
            this.form.valueChanges.subscribe(function (data) {
                _this.ontologySelected.emit(data.ontology);
            });
            // add form to the parent form group
            this.formGroup.addControl('ontology', this.form);
        };
        SelectOntologyComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'kui-select-ontology',
                        template: "<mat-form-field *ngIf=\"ontologies.length > 0\">\n  <mat-select placeholder=\"Ontology\" [formControl]=\"form.controls['ontology']\">\n      <mat-option *ngFor=\"let onto of ontologies\" [value]=\"onto.id\">{{ onto.label }}</mat-option>\n  </mat-select>\n</mat-form-field>\n",
                        styles: [""]
                    },] },
        ];
        /** @nocollapse */
        SelectOntologyComponent.ctorParameters = function () {
            return [
                { type: forms.FormBuilder, decorators: [{ type: core.Inject, args: [forms.FormBuilder,] }] }
            ];
        };
        SelectOntologyComponent.propDecorators = {
            formGroup: [{ type: core.Input }],
            ontologies: [{ type: core.Input }],
            ontologySelected: [{ type: core.Output }]
        };
        return SelectOntologyComponent;
    }());

    // https://stackoverflow.com/questions/45661010/dynamic-nested-reactive-form-expressionchangedafterithasbeencheckederror
    var resolvedPromise = Promise.resolve(null);
    var SelectPropertyComponent = /** @class */ (function () {
        function SelectPropertyComponent(fb) {
            this.fb = fb;
        }
        Object.defineProperty(SelectPropertyComponent.prototype, "properties", {
            get: function () {
                return this._properties;
            },
            // setter method for properties when being updated by parent component
            set: function (value) {
                this.propertySelected = undefined; // reset selected property (overwriting any previous selection)
                this._properties = value;
                this.updatePropertiesArray();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SelectPropertyComponent.prototype, "activeResourceClass", {
            // setter method for selected resource class
            set: function (value) {
                this._activeResourceClass = value;
            },
            enumerable: true,
            configurable: true
        });
        SelectPropertyComponent.prototype.ngOnInit = function () {
            var _this = this;
            // build a form for the property selection
            this.form = this.fb.group({
                property: [null, forms.Validators.required],
                isSortCriterion: [false, forms.Validators.required]
            });
            // update the selected property
            this.form.valueChanges.subscribe(function (data) {
                var propIri = data.property;
                _this.propertySelected = _this._properties[propIri];
            });
            resolvedPromise.then(function () {
                _this.propIndex = 'property' + _this.index;
                // add form to the parent form group
                _this.formGroup.addControl(_this.propIndex, _this.form);
            });
        };
        SelectPropertyComponent.prototype.ngOnDestroy = function () {
            var _this = this;
            // remove form from the parent form group
            resolvedPromise.then(function () {
                _this.formGroup.removeControl(_this.propIndex);
            });
        };
        /**
         * Indicates if property can be used as a sort criterion.
         * Property has to have cardinality or max cardinality 1 for the chosen resource class.
         *
         * We cannot sort by properties whose cardinality is greater than 1.
         * Return boolean
         */
        SelectPropertyComponent.prototype.sortCriterion = function () {
            var _this = this;
            // check if a resource class is selected and if the property's cardinality is 1 for the selected resource class
            if (this._activeResourceClass !== undefined && this.propertySelected !== undefined && !this.propertySelected.isLinkProperty) {
                var cardinalities = this._activeResourceClass.cardinalities.filter(function (card) {
                    // cardinality 1 or max occurrence 1
                    return card.property === _this.propertySelected.id
                        && card.value === 1
                        && (card.occurrence === core$1.CardinalityOccurrence.card || card.occurrence === core$1.CardinalityOccurrence.maxCard);
                });
                return cardinalities.length === 1;
            }
            else {
                return false;
            }
        };
        /**
         * Updates the properties array that is accessed by the template.
         */
        SelectPropertyComponent.prototype.updatePropertiesArray = function () {
            // represent the properties as an array to be accessed by the template
            var propsArray = [];
            for (var propIri in this._properties) {
                if (this._properties.hasOwnProperty(propIri)) {
                    var prop = this._properties[propIri];
                    // only list editable props that are not link value props
                    if (prop.isEditable && !prop.isLinkValueProperty) {
                        propsArray.push(this._properties[propIri]);
                    }
                }
            }
            // sort properties by label (ascending)
            propsArray.sort(core$1.OntologyInformation.sortFunc);
            this.propertiesAsArray = propsArray;
        };
        /**
         * Returns the selected property with the specified value.
         */
        SelectPropertyComponent.prototype.getPropertySelectedWithValue = function () {
            var propVal = this.specifyPropertyValue.getComparisonOperatorAndValueLiteralForProperty();
            var isSortCriterion = false;
            // only non linking properties can be used for sorting
            if (!this.propertySelected.isLinkProperty) {
                isSortCriterion = this.form.value.isSortCriterion;
            }
            return new core$1.PropertyWithValue(this.propertySelected, propVal, isSortCriterion);
        };
        SelectPropertyComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'kui-select-property',
                        template: "<mat-form-field class=\"search-property-field\" *ngIf=\"propertiesAsArray?.length > 0\">\n  <mat-select placeholder=\"Properties\" [formControl]=\"form.controls['property']\">\n    <mat-option *ngFor=\"let prop of propertiesAsArray\" [value]=\"prop.id\">{{ prop.label }}</mat-option>\n  </mat-select>\n</mat-form-field>\n\n<kui-specify-property-value #specifyPropertyValue [formGroup]=\"form\" *ngIf=\"propertySelected !== undefined\" [property]=\"propertySelected\"></kui-specify-property-value>\n\n<mat-checkbox matTooltip=\"Sort criterion\" *ngIf=\"propertySelected !== undefined && sortCriterion()\" [formControl]=\"form.controls['isSortCriterion']\"></mat-checkbox>",
                        styles: [".search-property-field{margin-right:8px}"]
                    },] },
        ];
        /** @nocollapse */
        SelectPropertyComponent.ctorParameters = function () {
            return [
                { type: forms.FormBuilder, decorators: [{ type: core.Inject, args: [forms.FormBuilder,] }] }
            ];
        };
        SelectPropertyComponent.propDecorators = {
            formGroup: [{ type: core.Input }],
            index: [{ type: core.Input }],
            properties: [{ type: core.Input }],
            activeResourceClass: [{ type: core.Input }],
            specifyPropertyValue: [{ type: core.ViewChild, args: ['specifyPropertyValue',] }]
        };
        return SelectPropertyComponent;
    }());

    // https://stackoverflow.com/questions/45661010/dynamic-nested-reactive-form-expressionchangedafterithasbeencheckederror
    var resolvedPromise$1 = Promise.resolve(null);
    var SpecifyPropertyValueComponent = /** @class */ (function () {
        function SpecifyPropertyValueComponent(fb) {
            this.fb = fb;
            this.KnoraConstants = core$1.KnoraConstants;
            // available comparison operators for the property
            this.comparisonOperators = [];
        }
        Object.defineProperty(SpecifyPropertyValueComponent.prototype, "property", {
            // getter method for this._property
            get: function () {
                return this._property;
            },
            // setter method for the property chosen by the user
            set: function (prop) {
                this.comparisonOperatorSelected = undefined; // reset to initial state
                this._property = prop;
                this.resetComparisonOperators(); // reset comparison operators for given property (overwriting any previous selection)
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Resets the comparison operators for this._property.
         */
        SpecifyPropertyValueComponent.prototype.resetComparisonOperators = function () {
            // depending on object class, set comparison operators and value entry field
            if (this._property.isLinkProperty) {
                this.propertyValueType = core$1.KnoraConstants.Resource;
            }
            else {
                this.propertyValueType = this._property.objectType;
            }
            switch (this.propertyValueType) {
                case core$1.KnoraConstants.TextValue:
                    this.comparisonOperators = [new core$1.Like(), new core$1.Match(), new core$1.Equals(), new core$1.NotEquals(), new core$1.Exists()];
                    break;
                case core$1.KnoraConstants.BooleanValue:
                case core$1.KnoraConstants.Resource:
                case core$1.KnoraConstants.UriValue:
                case core$1.KnoraConstants.IntervalValue:
                    this.comparisonOperators = [new core$1.Equals(), new core$1.NotEquals(), new core$1.Exists()];
                    break;
                case core$1.KnoraConstants.IntValue:
                case core$1.KnoraConstants.DecimalValue:
                case core$1.KnoraConstants.DateValue:
                    this.comparisonOperators = [new core$1.Equals(), new core$1.NotEquals(), new core$1.LessThan(), new core$1.LessThanEquals(), new core$1.GreaterThan(), new core$1.GreaterThanEquals(), new core$1.Exists()];
                    break;
                case core$1.KnoraConstants.ListValue:
                case core$1.KnoraConstants.GeomValue:
                case core$1.KnoraConstants.FileValue:
                case core$1.KnoraConstants.AudioFileValue:
                case core$1.KnoraConstants.StillImageFileValue:
                case core$1.KnoraConstants.DDDFileValue:
                case core$1.KnoraConstants.MovingImageFileValue:
                case core$1.KnoraConstants.TextFileValue:
                case core$1.KnoraConstants.ColorValue:
                    this.comparisonOperators = [new core$1.Exists()];
                    break;
                default:
                    console.log('ERROR: Unsupported value type ' + this._property.objectType);
            }
        };
        SpecifyPropertyValueComponent.prototype.ngOnInit = function () { };
        SpecifyPropertyValueComponent.prototype.ngOnChanges = function () {
            var _this = this;
            // build a form for comparison operator selection
            this.form = this.fb.group({
                comparisonOperator: [null, forms.Validators.required]
            });
            // store comparison operator when selected
            this.form.valueChanges.subscribe(function (data) {
                _this.comparisonOperatorSelected = data.comparisonOperator;
            });
            resolvedPromise$1.then(function () {
                // remove from the parent form group (clean reset)
                _this.formGroup.removeControl('comparisonOperator');
                // add form to the parent form group
                _this.formGroup.addControl('comparisonOperator', _this.form);
            });
        };
        /**
         * Gets the specified comparison operator and value for the property.
         *
         * returns {ComparisonOperatorAndValue} the comparison operator and the specified value
         */
        SpecifyPropertyValueComponent.prototype.getComparisonOperatorAndValueLiteralForProperty = function () {
            // return value (literal or IRI) from the child component
            var value;
            // comparison operator 'Exists' does not require a value
            if (this.comparisonOperatorSelected.getClassName() !== 'Exists') {
                value = this.propertyValueComponent.getValue();
            }
            // return the comparison operator and the specified value
            return new core$1.ComparisonOperatorAndValue(this.comparisonOperatorSelected, value);
        };
        SpecifyPropertyValueComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'kui-specify-property-value',
                        template: "<mat-form-field class=\"search-operator-field\" *ngIf=\"comparisonOperators?.length > 0\">\n    <mat-select placeholder=\"Comparison Operator\" [formControl]=\"form.controls['comparisonOperator']\">\n        <mat-option *ngFor=\"let compOp of comparisonOperators\" [value]=\"compOp\">{{ compOp.label }}</mat-option>\n    </mat-select>\n</mat-form-field>\n\n<!-- select apt component for value specification using a switch case statement-->\n<span\n    *ngIf=\"comparisonOperatorSelected !== undefined && comparisonOperatorSelected !== null && comparisonOperatorSelected.getClassName() != 'Exists'\"\n    [ngSwitch]=\"propertyValueType\">\n  <boolean-value #propertyValue [formGroup]=\"form\" *ngSwitchCase=\"KnoraConstants.BooleanValue\"></boolean-value>\n  <date-value #propertyValue [formGroup]=\"form\" *ngSwitchCase=\"KnoraConstants.DateValue\"></date-value>\n  <decimal-value #propertyValue [formGroup]=\"form\" *ngSwitchCase=\"KnoraConstants.DecimalValue\"></decimal-value>\n  <integer-value #propertyValue [formGroup]=\"form\" *ngSwitchCase=\"KnoraConstants.IntValue\"></integer-value>\n  <link-value #propertyValue [formGroup]=\"form\" [restrictResourceClass]=\"property.objectType\"\n              *ngSwitchCase=\"KnoraConstants.Resource\"></link-value>\n  <text-value #propertyValue [formGroup]=\"form\" *ngSwitchCase=\"KnoraConstants.TextValue\"></text-value>\n  <uri-value #propertyValue [formGroup]=\"form\" *ngSwitchCase=\"KnoraConstants.UriValue\"></uri-value>\n\n    <!-- TODO: Resource: handle linking properties with target class restriction: access property member to get objectClass via property() getter method -->\n  <span *ngSwitchDefault=\"\">Not supported {{propertyValueType}}</span>\n</span>\n",
                        styles: [".search-operator-field{margin-right:8px}"]
                    },] },
        ];
        /** @nocollapse */
        SpecifyPropertyValueComponent.ctorParameters = function () {
            return [
                { type: forms.FormBuilder, decorators: [{ type: core.Inject, args: [forms.FormBuilder,] }] }
            ];
        };
        SpecifyPropertyValueComponent.propDecorators = {
            formGroup: [{ type: core.Input }],
            propertyValueComponent: [{ type: core.ViewChild, args: ['propertyValue',] }],
            property: [{ type: core.Input }]
        };
        return SpecifyPropertyValueComponent;
    }());

    // https://stackoverflow.com/questions/45661010/dynamic-nested-reactive-form-expressionchangedafterithasbeencheckederror
    var resolvedPromise$2 = Promise.resolve(null);
    var BooleanValueComponent = /** @class */ (function () {
        function BooleanValueComponent(fb) {
            this.fb = fb;
            this.type = core$1.KnoraConstants.BooleanValue;
        }
        BooleanValueComponent.prototype.ngOnInit = function () {
            var _this = this;
            this.form = this.fb.group({
                booleanValue: [false, forms.Validators.compose([forms.Validators.required])]
            });
            resolvedPromise$2.then(function () {
                // add form to the parent form group
                _this.formGroup.addControl('propValue', _this.form);
            });
        };
        BooleanValueComponent.prototype.ngOnDestroy = function () {
            var _this = this;
            // remove form from the parent form group
            resolvedPromise$2.then(function () {
                _this.formGroup.removeControl('propValue');
            });
        };
        BooleanValueComponent.prototype.getValue = function () {
            return new core$1.ValueLiteral(String(this.form.value.booleanValue), core$1.KnoraConstants.xsdBoolean);
        };
        BooleanValueComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'boolean-value',
                        template: "<mat-checkbox [formControl]=\"form.controls['booleanValue']\"></mat-checkbox>\n",
                        styles: [""]
                    },] },
        ];
        /** @nocollapse */
        BooleanValueComponent.ctorParameters = function () {
            return [
                { type: forms.FormBuilder, decorators: [{ type: core.Inject, args: [forms.FormBuilder,] }] }
            ];
        };
        BooleanValueComponent.propDecorators = {
            formGroup: [{ type: core.Input }]
        };
        return BooleanValueComponent;
    }());

    /** Custom header component containing a calendar format switcher */
    var HeaderComponent = /** @class */ (function () {
        function HeaderComponent(_calendar, _dateAdapter, fb) {
            this._calendar = _calendar;
            this._dateAdapter = _dateAdapter;
            this.fb = fb;
            // a list of supported calendar formats (Gregorian and Julian)
            this.supportedCalendarFormats = jdnconvertiblecalendar.JDNConvertibleCalendar.supportedCalendars;
        }
        HeaderComponent.prototype.ngOnInit = function () {
            var _this = this;
            // get the currently active calendar format from the date adapter
            if (this._dateAdapter instanceof jdnconvertiblecalendardateadapter.JDNConvertibleCalendarDateAdapter) {
                this.activeFormat = this._dateAdapter.activeCalendarFormat;
            }
            else {
                console.log('date adapter is expected to be an instance of JDNConvertibleCalendarDateAdapter');
            }
            // build a form for the calendar format selection
            this.form = this.fb.group({
                calendar: [this.activeFormat, forms.Validators.required]
            });
            // do the conversion when the user selects another calendar format
            this.form.valueChanges.subscribe(function (data) {
                // pass the target calendar format to the conversion method
                _this.convertDate(data.calendar);
            });
        };
        /**
         * Converts the date into the target format.
         *
         * @param calendar the target calendar format.
         */
        HeaderComponent.prototype.convertDate = function (calendar) {
            if (this._dateAdapter instanceof jdnconvertiblecalendardateadapter.JDNConvertibleCalendarDateAdapter) {
                // convert the date into the target calendar format
                var convertedDate = this._dateAdapter.convertCalendarFormat(this._calendar.activeDate, calendar);
                // set the new date
                this._calendar.activeDate = convertedDate;
                // select the new date in the datepicker UI
                this._calendar._dateSelected(convertedDate);
                // update view after calendar format conversion
                var view = this._calendar.currentView === 'month' ? this._calendar.monthView :
                    (this._calendar.currentView === 'year' ? this._calendar.yearView : this._calendar.multiYearView);
                view.ngAfterContentInit();
            }
            else {
                console.log('date adapter is expected to be an instance of JDNConvertibleCalendarDateAdapter');
            }
        };
        HeaderComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'kui-calendar-header',
                        template: "\n      <mat-select placeholder=\"Calendar Format\" [formControl]=\"form.controls['calendar']\">\n        <mat-option *ngFor=\"let cal of supportedCalendarFormats\" [value]=\"cal\">{{cal}}</mat-option>\n      </mat-select>\n      <mat-calendar-header></mat-calendar-header>\n    ",
                        styles: []
                    },] },
        ];
        /** @nocollapse */
        HeaderComponent.ctorParameters = function () {
            return [
                { type: material.MatCalendar, decorators: [{ type: core.Host }] },
                { type: material.DateAdapter },
                { type: forms.FormBuilder, decorators: [{ type: core.Inject, args: [forms.FormBuilder,] }] }
            ];
        };
        return HeaderComponent;
    }());

    // https://stackoverflow.com/questions/45661010/dynamic-nested-reactive-form-expressionchangedafterithasbeencheckederror
    var resolvedPromise$3 = Promise.resolve(null);
    var DateValueComponent = /** @class */ (function () {
        function DateValueComponent(fb) {
            this.fb = fb;
            this.type = core$1.KnoraConstants.DateValue;
            // custom header for the datepicker
            this.headerComponent = HeaderComponent;
        }
        DateValueComponent.prototype.ngOnInit = function () {
            var _this = this;
            // init datepicker
            this.form = this.fb.group({
                dateValue: [null, forms.Validators.compose([forms.Validators.required])]
            });
            this.form.valueChanges.subscribe(function (data) {
                // console.log(data.dateValue);
            });
            resolvedPromise$3.then(function () {
                // add form to the parent form group
                _this.formGroup.addControl('propValue', _this.form);
            });
        };
        DateValueComponent.prototype.ngOnDestroy = function () {
            var _this = this;
            // remove form from the parent form group
            resolvedPromise$3.then(function () {
                _this.formGroup.removeControl('propValue');
            });
        };
        DateValueComponent.prototype.getValue = function () {
            var dateObj = this.form.value.dateValue;
            // get calendar format
            var calendarFormat = dateObj.calendarName;
            // get calendar period
            var calendarPeriod = dateObj.toCalendarPeriod();
            // get the date
            var dateString = calendarFormat.toUpperCase() + ":" + calendarPeriod.periodStart.year + "-" + calendarPeriod.periodStart.month + "-" + calendarPeriod.periodStart.day + ":" + calendarPeriod.periodEnd.year + "-" + calendarPeriod.periodEnd.month + "-" + calendarPeriod.periodEnd.day;
            return new core$1.ValueLiteral(String(dateString), core$1.KnoraConstants.DateValue);
        };
        DateValueComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'date-value',
                        template: "<mat-form-field>\n    <kuiJdnDatepicker>\n        <input matInput [matDatepicker]=\"picker\" placeholder=\"Choose a date\" [formControl]=\"form.controls['dateValue']\">\n        <mat-datepicker #picker [calendarHeaderComponent]=\"headerComponent\"></mat-datepicker>\n    </kuiJdnDatepicker>\n    <mat-datepicker-toggle matSuffix [for]=\"picker\"></mat-datepicker-toggle>\n</mat-form-field>",
                        styles: [""]
                    },] },
        ];
        /** @nocollapse */
        DateValueComponent.ctorParameters = function () {
            return [
                { type: forms.FormBuilder, decorators: [{ type: core.Inject, args: [forms.FormBuilder,] }] }
            ];
        };
        DateValueComponent.propDecorators = {
            formGroup: [{ type: core.Input }]
        };
        return DateValueComponent;
    }());

    // https://stackoverflow.com/questions/45661010/dynamic-nested-reactive-form-expressionchangedafterithasbeencheckederror
    var resolvedPromise$4 = Promise.resolve(null);
    var DecimalValueComponent = /** @class */ (function () {
        function DecimalValueComponent(fb) {
            this.fb = fb;
            this.type = core$1.KnoraConstants.DecimalValue;
        }
        DecimalValueComponent.prototype.ngOnInit = function () {
            var _this = this;
            this.form = this.fb.group({
                decimalValue: [null, forms.Validators.compose([forms.Validators.required])]
            });
            resolvedPromise$4.then(function () {
                // add form to the parent form group
                _this.formGroup.addControl('propValue', _this.form);
            });
        };
        DecimalValueComponent.prototype.ngOnDestroy = function () {
            var _this = this;
            // remove form from the parent form group
            resolvedPromise$4.then(function () {
                _this.formGroup.removeControl('propValue');
            });
        };
        DecimalValueComponent.prototype.getValue = function () {
            return new core$1.ValueLiteral(String(this.form.value.decimalValue), core$1.KnoraConstants.xsdDecimal);
        };
        DecimalValueComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'decimal-value',
                        template: "<mat-form-field>\n    <input matInput [formControl]=\"form.controls['decimalValue']\" placeholder=\"Decimal value\" value=\"\" type=\"number\">\n</mat-form-field>\n",
                        styles: [""]
                    },] },
        ];
        /** @nocollapse */
        DecimalValueComponent.ctorParameters = function () {
            return [
                { type: forms.FormBuilder, decorators: [{ type: core.Inject, args: [forms.FormBuilder,] }] }
            ];
        };
        DecimalValueComponent.propDecorators = {
            formGroup: [{ type: core.Input }]
        };
        return DecimalValueComponent;
    }());

    // https://stackoverflow.com/questions/45661010/dynamic-nested-reactive-form-expressionchangedafterithasbeencheckederror
    var resolvedPromise$5 = Promise.resolve(null);
    var IntegerValueComponent = /** @class */ (function () {
        function IntegerValueComponent(fb) {
            this.fb = fb;
            this.type = core$1.KnoraConstants.IntValue;
        }
        IntegerValueComponent.prototype.ngOnInit = function () {
            var _this = this;
            this.form = this.fb.group({
                integerValue: [null, forms.Validators.compose([forms.Validators.required, forms.Validators.pattern(/^-?\d+$/)])] // only allow for integer values (no fractions)
            });
            resolvedPromise$5.then(function () {
                // add form to the parent form group
                _this.formGroup.addControl('propValue', _this.form);
            });
        };
        IntegerValueComponent.prototype.ngOnDestroy = function () {
            var _this = this;
            // remove form from the parent form group
            resolvedPromise$5.then(function () {
                _this.formGroup.removeControl('propValue');
            });
        };
        IntegerValueComponent.prototype.getValue = function () {
            return new core$1.ValueLiteral(String(this.form.value.integerValue), core$1.KnoraConstants.xsdInteger);
        };
        IntegerValueComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'integer-value',
                        template: "<mat-form-field>\n    <input matInput [formControl]=\"form.controls['integerValue']\" placeholder=\"Integer value\" value=\"\" type=\"number\">\n</mat-form-field>\n",
                        styles: [""]
                    },] },
        ];
        /** @nocollapse */
        IntegerValueComponent.ctorParameters = function () {
            return [
                { type: forms.FormBuilder, decorators: [{ type: core.Inject, args: [forms.FormBuilder,] }] }
            ];
        };
        IntegerValueComponent.propDecorators = {
            formGroup: [{ type: core.Input }]
        };
        return IntegerValueComponent;
    }());

    var jsonld = require('jsonld');
    // https://stackoverflow.com/questions/45661010/dynamic-nested-reactive-form-expressionchangedafterithasbeencheckederror
    var resolvedPromise$6 = Promise.resolve(null);
    var LinkValueComponent = /** @class */ (function () {
        function LinkValueComponent(fb, _searchService, _cacheService) {
            this.fb = fb;
            this._searchService = _searchService;
            this._cacheService = _cacheService;
            this.type = core$1.KnoraConstants.LinkValue;
        }
        Object.defineProperty(LinkValueComponent.prototype, "restrictResourceClass", {
            get: function () {
                return this._restrictToResourceClass;
            },
            set: function (value) {
                this._restrictToResourceClass = value;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Displays a selected resource using its label.
         *
         * @param resource the resource to be displayed (or no selection yet).
         * @returns
         */
        LinkValueComponent.prototype.displayResource = function (resource) {
            // null is the initial value (no selection yet)
            if (resource !== null) {
                return resource.label;
            }
        };
        /**
         * Search for resources whose labels contain the given search term, restricting to to the given properties object constraint.
         *
         * @param searchTerm
         */
        LinkValueComponent.prototype.searchByLabel = function (searchTerm) {
            var _this = this;
            // at least 3 characters are required
            if (searchTerm.length >= 3) {
                this._searchService.searchByLabelReadResourceSequence(searchTerm, this._restrictToResourceClass).subscribe(function (result) {
                    _this.resources = result.resources;
                }, function (err) {
                    console.log('JSONLD of full resource request could not be expanded:' + err);
                });
            }
            else {
                // clear selection
                this.resources = undefined;
            }
        };
        /**
         * Checks that the selection is a [[ReadResource]].
         *
         * Surprisingly, [null] has to be returned if the value is valid: https://angular.io/guide/form-validation#custom-validators
         *
         * @param the form element whose value has to be checked.
         * @returns
         */
        LinkValueComponent.prototype.validateResource = function (c) {
            var isValidResource = (c.value instanceof core$1.ReadResource);
            if (isValidResource) {
                return null;
            }
            else {
                return {
                    noResource: {
                        value: c.value
                    }
                };
            }
        };
        LinkValueComponent.prototype.ngOnInit = function () {
            var _this = this;
            this.form = this.fb.group({
                resource: [null, forms.Validators.compose([
                        forms.Validators.required,
                        this.validateResource
                    ])]
            });
            this.form.valueChanges.subscribe(function (data) {
                _this.searchByLabel(data.resource);
            });
            resolvedPromise$6.then(function () {
                // add form to the parent form group
                _this.formGroup.addControl('propValue', _this.form);
            });
        };
        LinkValueComponent.prototype.ngOnDestroy = function () {
            var _this = this;
            // remove form from the parent form group
            resolvedPromise$6.then(function () {
                _this.formGroup.removeControl('propValue');
            });
        };
        LinkValueComponent.prototype.getValue = function () {
            return new core$1.IRI(this.form.value.resource.id);
        };
        LinkValueComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'link-value',
                        template: "<mat-form-field>\n    <input matInput placeholder=\"resource\" aria-label=\"resource\" [matAutocomplete]=\"auto\" [formControl]=\"form.controls['resource']\">\n    <mat-autocomplete #auto=\"matAutocomplete\" [displayWith]=\"displayResource\">\n        <mat-option *ngFor=\"let res of resources\" [value]=\"res\">\n            {{res?.label}}\n        </mat-option>\n    </mat-autocomplete>\n</mat-form-field>\n",
                        styles: [""]
                    },] },
        ];
        /** @nocollapse */
        LinkValueComponent.ctorParameters = function () {
            return [
                { type: forms.FormBuilder, decorators: [{ type: core.Inject, args: [forms.FormBuilder,] }] },
                { type: core$1.SearchService },
                { type: core$1.OntologyCacheService }
            ];
        };
        LinkValueComponent.propDecorators = {
            formGroup: [{ type: core.Input }],
            restrictResourceClass: [{ type: core.Input }]
        };
        return LinkValueComponent;
    }());

    // https://stackoverflow.com/questions/45661010/dynamic-nested-reactive-form-expressionchangedafterithasbeencheckederror
    var resolvedPromise$7 = Promise.resolve(null);
    var TextValueComponent = /** @class */ (function () {
        function TextValueComponent(fb) {
            this.fb = fb;
            this.type = core$1.KnoraConstants.TextValue;
        }
        TextValueComponent.prototype.ngOnInit = function () {
            var _this = this;
            this.form = this.fb.group({
                textValue: [null, forms.Validators.required]
            });
            resolvedPromise$7.then(function () {
                // add form to the parent form group
                _this.formGroup.addControl('propValue', _this.form);
            });
        };
        TextValueComponent.prototype.ngOnDestroy = function () {
            var _this = this;
            // remove form from the parent form group
            resolvedPromise$7.then(function () {
                _this.formGroup.removeControl('propValue');
            });
        };
        TextValueComponent.prototype.getValue = function () {
            return new core$1.ValueLiteral(String(this.form.value.textValue), core$1.KnoraConstants.xsdString);
        };
        TextValueComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'text-value',
                        template: "<mat-form-field>\n    <input matInput [formControl]=\"form.controls['textValue']\" placeholder=\"text value\" value=\"\">\n</mat-form-field>\n",
                        styles: [""]
                    },] },
        ];
        /** @nocollapse */
        TextValueComponent.ctorParameters = function () {
            return [
                { type: forms.FormBuilder, decorators: [{ type: core.Inject, args: [forms.FormBuilder,] }] }
            ];
        };
        TextValueComponent.propDecorators = {
            formGroup: [{ type: core.Input }]
        };
        return TextValueComponent;
    }());

    // https://stackoverflow.com/questions/45661010/dynamic-nested-reactive-form-expressionchangedafterithasbeencheckederror
    var resolvedPromise$8 = Promise.resolve(null);
    var UriValueComponent = /** @class */ (function () {
        function UriValueComponent(fb) {
            this.fb = fb;
            this.type = core$1.KnoraConstants.UriValue;
        }
        UriValueComponent.prototype.ngOnInit = function () {
            var _this = this;
            this.form = this.fb.group({
                uriValue: [null, forms.Validators.compose([forms.Validators.required, forms.Validators.pattern(core$1.Utils.RegexUrl)])]
            });
            resolvedPromise$8.then(function () {
                // add form to the parent form group
                _this.formGroup.addControl('propValue', _this.form);
            });
        };
        UriValueComponent.prototype.ngOnDestroy = function () {
            var _this = this;
            // remove form from the parent form group
            resolvedPromise$8.then(function () {
                _this.formGroup.removeControl('propValue');
            });
        };
        UriValueComponent.prototype.getValue = function () {
            return new core$1.ValueLiteral(String(this.form.value.uriValue), core$1.KnoraConstants.xsdUri);
        };
        UriValueComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'uri-value',
                        template: "<mat-form-field>\n    <input matInput [formControl]=\"form.controls['uriValue']\" placeholder=\"URI\" value=\"\">\n</mat-form-field>\n",
                        styles: [""]
                    },] },
        ];
        /** @nocollapse */
        UriValueComponent.ctorParameters = function () {
            return [
                { type: forms.FormBuilder, decorators: [{ type: core.Inject, args: [forms.FormBuilder,] }] }
            ];
        };
        UriValueComponent.propDecorators = {
            formGroup: [{ type: core.Input }]
        };
        return UriValueComponent;
    }());

    // https://stackoverflow.com/questions/45661010/dynamic-nested-reactive-form-expressionchangedafterithasbeencheckederror
    var resolvedPromise$9 = Promise.resolve(null);
    var SelectResourceClassComponent = /** @class */ (function () {
        function SelectResourceClassComponent(fb) {
            this.fb = fb;
            // event emitted to parent component once a resource class is selected by the user
            this.resourceClassSelectedEvent = new core.EventEmitter();
        }
        Object.defineProperty(SelectResourceClassComponent.prototype, "resourceClasses", {
            // getter method for resource classes (used in template)
            get: function () {
                return this._resourceClasses;
            },
            // setter method for resource classes when being updated by parent component
            set: function (value) {
                this.resourceClassSelected = undefined; // reset on updates
                this._resourceClasses = value;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Returns the Iri of the selected resource class.
         *
         * @returns the Iri of the selected resource class or false in case no resource class is selected.
         */
        SelectResourceClassComponent.prototype.getResourceClassSelected = function () {
            if (this.resourceClassSelected !== undefined && this.resourceClassSelected !== null) {
                return this.resourceClassSelected;
            }
            else {
                return false;
            }
        };
        /**
         * Initalizes the FormGroup for the resource class selection.
         * The initial value is set to null.
         */
        SelectResourceClassComponent.prototype.initForm = function () {
            var _this = this;
            // build a form for the resource class selection
            this.form = this.fb.group({
                resourceClass: [null] // resource class selection is optional
            });
            // store and emit Iri of the resource class when selected
            this.form.valueChanges.subscribe(function (data) {
                _this.resourceClassSelected = data.resourceClass;
                _this.resourceClassSelectedEvent.emit(_this.resourceClassSelected);
            });
        };
        SelectResourceClassComponent.prototype.ngOnInit = function () {
            this.initForm();
            // add form to the parent form group
            this.formGroup.addControl('resourceClass', this.form);
        };
        SelectResourceClassComponent.prototype.ngOnChanges = function () {
            var _this = this;
            if (this.form !== undefined) {
                // resource classes have been reinitialized
                // reset form
                resolvedPromise$9.then(function () {
                    // remove this form from the parent form group
                    _this.formGroup.removeControl('resourceClass');
                    _this.initForm();
                    // add form to the parent form group
                    _this.formGroup.addControl('resourceClass', _this.form);
                });
            }
        };
        SelectResourceClassComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'kui-select-resource-class',
                        template: "<mat-form-field *ngIf=\"resourceClasses.length > 0\">\n  <mat-select placeholder=\"Resource Class\" [formControl]=\"form.controls['resourceClass']\">\n    <mat-option [value]=\"null\">no selection</mat-option>\n    <!-- undo selection of a resource class -->\n    <mat-option *ngFor=\"let resourceClass of resourceClasses\" [value]=\"resourceClass.id\">{{ resourceClass.label }}</mat-option>\n  </mat-select>\n</mat-form-field>",
                        styles: [""]
                    },] },
        ];
        /** @nocollapse */
        SelectResourceClassComponent.ctorParameters = function () {
            return [
                { type: forms.FormBuilder, decorators: [{ type: core.Inject, args: [forms.FormBuilder,] }] }
            ];
        };
        SelectResourceClassComponent.propDecorators = {
            formGroup: [{ type: core.Input }],
            resourceClasses: [{ type: core.Input }],
            resourceClassSelectedEvent: [{ type: core.Output }]
        };
        return SelectResourceClassComponent;
    }());

    var KuiSearchModule = /** @class */ (function () {
        function KuiSearchModule() {
        }
        KuiSearchModule.decorators = [
            { type: core.NgModule, args: [{
                        imports: [
                            common.CommonModule,
                            animations$1.BrowserAnimationsModule,
                            material.MatAutocompleteModule,
                            material.MatButtonModule,
                            material.MatCheckboxModule,
                            material.MatDatepickerModule,
                            material.MatFormFieldModule,
                            material.MatInputModule,
                            material.MatIconModule,
                            material.MatListModule,
                            material.MatSelectModule,
                            material.MatTooltipModule,
                            forms.FormsModule,
                            forms.ReactiveFormsModule,
                            core$1.KuiCoreModule,
                            action.KuiActionModule,
                            viewer.KuiViewerModule,
                            jdnconvertiblecalendardateadapter.MatJDNConvertibleCalendarDateAdapterModule
                        ],
                        declarations: [
                            SearchComponent,
                            SelectOntologyComponent,
                            ExtendedSearchComponent,
                            SelectResourceClassComponent,
                            SelectPropertyComponent,
                            SpecifyPropertyValueComponent,
                            BooleanValueComponent,
                            DateValueComponent,
                            DecimalValueComponent,
                            IntegerValueComponent,
                            LinkValueComponent,
                            TextValueComponent,
                            UriValueComponent,
                            HeaderComponent,
                            FulltextSearchComponent,
                            SearchPanelComponent
                        ],
                        exports: [
                            SearchComponent,
                            SearchPanelComponent,
                            FulltextSearchComponent,
                            ExtendedSearchComponent,
                            DateValueComponent
                        ],
                        entryComponents: [
                            HeaderComponent
                        ]
                    },] },
        ];
        return KuiSearchModule;
    }());

    /*
     * Public API Surface of search
     */

    /**
     * Generated bundle index. Do not edit.
     */

    exports.SearchComponent = SearchComponent;
    exports.SearchPanelComponent = SearchPanelComponent;
    exports.FulltextSearchComponent = FulltextSearchComponent;
    exports.ExtendedSearchComponent = ExtendedSearchComponent;
    exports.SelectOntologyComponent = SelectOntologyComponent;
    exports.SelectPropertyComponent = SelectPropertyComponent;
    exports.SpecifyPropertyValueComponent = SpecifyPropertyValueComponent;
    exports.BooleanValueComponent = BooleanValueComponent;
    exports.DateValueComponent = DateValueComponent;
    exports.HeaderComponent = HeaderComponent;
    exports.DecimalValueComponent = DecimalValueComponent;
    exports.IntegerValueComponent = IntegerValueComponent;
    exports.LinkValueComponent = LinkValueComponent;
    exports.TextValueComponent = TextValueComponent;
    exports.UriValueComponent = UriValueComponent;
    exports.SelectResourceClassComponent = SelectResourceClassComponent;
    exports.KuiSearchModule = KuiSearchModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia25vcmEtc2VhcmNoLnVtZC5qcy5tYXAiLCJzb3VyY2VzIjpbbnVsbCwibmc6Ly9Aa25vcmEvc2VhcmNoL2xpYi9zZWFyY2guY29tcG9uZW50LnRzIiwibmc6Ly9Aa25vcmEvc2VhcmNoL2xpYi9zZWFyY2gtcGFuZWwvc2VhcmNoLXBhbmVsLmNvbXBvbmVudC50cyIsIm5nOi8vQGtub3JhL3NlYXJjaC9saWIvZnVsbHRleHQtc2VhcmNoL2Z1bGx0ZXh0LXNlYXJjaC5jb21wb25lbnQudHMiLCJuZzovL0Brbm9yYS9zZWFyY2gvbGliL2V4dGVuZGVkLXNlYXJjaC9leHRlbmRlZC1zZWFyY2guY29tcG9uZW50LnRzIiwibmc6Ly9Aa25vcmEvc2VhcmNoL2xpYi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LW9udG9sb2d5L3NlbGVjdC1vbnRvbG9neS5jb21wb25lbnQudHMiLCJuZzovL0Brbm9yYS9zZWFyY2gvbGliL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3QtcHJvcGVydHkvc2VsZWN0LXByb3BlcnR5LmNvbXBvbmVudC50cyIsIm5nOi8vQGtub3JhL3NlYXJjaC9saWIvZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1wcm9wZXJ0eS9zcGVjaWZ5LXByb3BlcnR5LXZhbHVlL3NwZWNpZnktcHJvcGVydHktdmFsdWUuY29tcG9uZW50LnRzIiwibmc6Ly9Aa25vcmEvc2VhcmNoL2xpYi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXByb3BlcnR5L3NwZWNpZnktcHJvcGVydHktdmFsdWUvYm9vbGVhbi12YWx1ZS9ib29sZWFuLXZhbHVlLmNvbXBvbmVudC50cyIsIm5nOi8vQGtub3JhL3NlYXJjaC9saWIvZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1wcm9wZXJ0eS9zcGVjaWZ5LXByb3BlcnR5LXZhbHVlL2RhdGUtdmFsdWUvaGVhZGVyLWNhbGVuZGFyL2hlYWRlci1jYWxlbmRhci5jb21wb25lbnQudHMiLCJuZzovL0Brbm9yYS9zZWFyY2gvbGliL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3QtcHJvcGVydHkvc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZS9kYXRlLXZhbHVlL2RhdGUtdmFsdWUuY29tcG9uZW50LnRzIiwibmc6Ly9Aa25vcmEvc2VhcmNoL2xpYi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXByb3BlcnR5L3NwZWNpZnktcHJvcGVydHktdmFsdWUvZGVjaW1hbC12YWx1ZS9kZWNpbWFsLXZhbHVlLmNvbXBvbmVudC50cyIsIm5nOi8vQGtub3JhL3NlYXJjaC9saWIvZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1wcm9wZXJ0eS9zcGVjaWZ5LXByb3BlcnR5LXZhbHVlL2ludGVnZXItdmFsdWUvaW50ZWdlci12YWx1ZS5jb21wb25lbnQudHMiLCJuZzovL0Brbm9yYS9zZWFyY2gvbGliL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3QtcHJvcGVydHkvc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZS9saW5rLXZhbHVlL2xpbmstdmFsdWUuY29tcG9uZW50LnRzIiwibmc6Ly9Aa25vcmEvc2VhcmNoL2xpYi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXByb3BlcnR5L3NwZWNpZnktcHJvcGVydHktdmFsdWUvdGV4dC12YWx1ZS90ZXh0LXZhbHVlLmNvbXBvbmVudC50cyIsIm5nOi8vQGtub3JhL3NlYXJjaC9saWIvZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1wcm9wZXJ0eS9zcGVjaWZ5LXByb3BlcnR5LXZhbHVlL3VyaS12YWx1ZS91cmktdmFsdWUuY29tcG9uZW50LnRzIiwibmc6Ly9Aa25vcmEvc2VhcmNoL2xpYi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXJlc291cmNlLWNsYXNzL3NlbGVjdC1yZXNvdXJjZS1jbGFzcy5jb21wb25lbnQudHMiLCJuZzovL0Brbm9yYS9zZWFyY2gvbGliL3NlYXJjaC5tb2R1bGUudHMiLCJuZzovL0Brbm9yYS9zZWFyY2gvcHVibGljX2FwaS50cyIsIm5nOi8vQGtub3JhL3NlYXJjaC9rbm9yYS1zZWFyY2gudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbkNvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG5MaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2VcclxudGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGVcclxuTGljZW5zZSBhdCBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuXHJcblRISVMgQ09ERSBJUyBQUk9WSURFRCBPTiBBTiAqQVMgSVMqIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTllcclxuS0lORCwgRUlUSEVSIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIFdJVEhPVVQgTElNSVRBVElPTiBBTlkgSU1QTElFRFxyXG5XQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgVElUTEUsIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLFxyXG5NRVJDSEFOVEFCTElUWSBPUiBOT04tSU5GUklOR0VNRU5ULlxyXG5cclxuU2VlIHRoZSBBcGFjaGUgVmVyc2lvbiAyLjAgTGljZW5zZSBmb3Igc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zXHJcbmFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuLyogZ2xvYmFsIFJlZmxlY3QsIFByb21pc2UgKi9cclxuXHJcbnZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24oZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXh0ZW5kcyhkLCBiKSB7XHJcbiAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19hc3NpZ24gPSBmdW5jdGlvbigpIHtcclxuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiBfX2Fzc2lnbih0KSB7XHJcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSkgdFtwXSA9IHNbcF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3Jlc3QocywgZSkge1xyXG4gICAgdmFyIHQgPSB7fTtcclxuICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSAmJiBlLmluZGV4T2YocCkgPCAwKVxyXG4gICAgICAgIHRbcF0gPSBzW3BdO1xyXG4gICAgaWYgKHMgIT0gbnVsbCAmJiB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9PT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBwID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzKTsgaSA8IHAubGVuZ3RoOyBpKyspIGlmIChlLmluZGV4T2YocFtpXSkgPCAwKVxyXG4gICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcclxuICAgIHJldHVybiB0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcGFyYW0ocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpIHtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5tZXRhZGF0YSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUmVmbGVjdC5tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0ZXIodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZ2VuZXJhdG9yKHRoaXNBcmcsIGJvZHkpIHtcclxuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XHJcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xyXG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcclxuICAgICAgICB3aGlsZSAoXykgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xyXG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XHJcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxyXG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHBvcnRTdGFyKG0sIGV4cG9ydHMpIHtcclxuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKCFleHBvcnRzLmhhc093blByb3BlcnR5KHApKSBleHBvcnRzW3BdID0gbVtwXTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fdmFsdWVzKG8pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXSwgaSA9IDA7XHJcbiAgICBpZiAobSkgcmV0dXJuIG0uY2FsbChvKTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAobyAmJiBpID49IG8ubGVuZ3RoKSBvID0gdm9pZCAwO1xyXG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogbyAmJiBvW2krK10sIGRvbmU6ICFvIH07XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVhZChvLCBuKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl07XHJcbiAgICBpZiAoIW0pIHJldHVybiBvO1xyXG4gICAgdmFyIGkgPSBtLmNhbGwobyksIHIsIGFyID0gW10sIGU7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHdoaWxlICgobiA9PT0gdm9pZCAwIHx8IG4tLSA+IDApICYmICEociA9IGkubmV4dCgpKS5kb25lKSBhci5wdXNoKHIudmFsdWUpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGVycm9yKSB7IGUgPSB7IGVycm9yOiBlcnJvciB9OyB9XHJcbiAgICBmaW5hbGx5IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAociAmJiAhci5kb25lICYmIChtID0gaVtcInJldHVyblwiXSkpIG0uY2FsbChpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxseSB7IGlmIChlKSB0aHJvdyBlLmVycm9yOyB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZCgpIHtcclxuICAgIGZvciAodmFyIGFyID0gW10sIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIGFyID0gYXIuY29uY2F0KF9fcmVhZChhcmd1bWVudHNbaV0pKTtcclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXQodikge1xyXG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBfX2F3YWl0ID8gKHRoaXMudiA9IHYsIHRoaXMpIDogbmV3IF9fYXdhaXQodik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jR2VuZXJhdG9yKHRoaXNBcmcsIF9hcmd1bWVudHMsIGdlbmVyYXRvcikge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBnID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pLCBpLCBxID0gW107XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaWYgKGdbbl0pIGlbbl0gPSBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKGEsIGIpIHsgcS5wdXNoKFtuLCB2LCBhLCBiXSkgPiAxIHx8IHJlc3VtZShuLCB2KTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHJlc3VtZShuLCB2KSB7IHRyeSB7IHN0ZXAoZ1tuXSh2KSk7IH0gY2F0Y2ggKGUpIHsgc2V0dGxlKHFbMF1bM10sIGUpOyB9IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAocikgeyByLnZhbHVlIGluc3RhbmNlb2YgX19hd2FpdCA/IFByb21pc2UucmVzb2x2ZShyLnZhbHVlLnYpLnRoZW4oZnVsZmlsbCwgcmVqZWN0KSA6IHNldHRsZShxWzBdWzJdLCByKTsgfVxyXG4gICAgZnVuY3Rpb24gZnVsZmlsbCh2YWx1ZSkgeyByZXN1bWUoXCJuZXh0XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gcmVqZWN0KHZhbHVlKSB7IHJlc3VtZShcInRocm93XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKGYsIHYpIHsgaWYgKGYodiksIHEuc2hpZnQoKSwgcS5sZW5ndGgpIHJlc3VtZShxWzBdWzBdLCBxWzBdWzFdKTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0RlbGVnYXRvcihvKSB7XHJcbiAgICB2YXIgaSwgcDtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiwgZnVuY3Rpb24gKGUpIHsgdGhyb3cgZTsgfSksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaVtuXSA9IG9bbl0gPyBmdW5jdGlvbiAodikgeyByZXR1cm4gKHAgPSAhcCkgPyB7IHZhbHVlOiBfX2F3YWl0KG9bbl0odikpLCBkb25lOiBuID09PSBcInJldHVyblwiIH0gOiBmID8gZih2KSA6IHY7IH0gOiBmOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jVmFsdWVzKG8pIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgbSA9IG9bU3ltYm9sLmFzeW5jSXRlcmF0b3JdLCBpO1xyXG4gICAgcmV0dXJuIG0gPyBtLmNhbGwobykgOiAobyA9IHR5cGVvZiBfX3ZhbHVlcyA9PT0gXCJmdW5jdGlvblwiID8gX192YWx1ZXMobykgOiBvW1N5bWJvbC5pdGVyYXRvcl0oKSwgaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGkpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlbbl0gPSBvW25dICYmIGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7IHYgPSBvW25dKHYpLCBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCB2LmRvbmUsIHYudmFsdWUpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgZCwgdikgeyBQcm9taXNlLnJlc29sdmUodikudGhlbihmdW5jdGlvbih2KSB7IHJlc29sdmUoeyB2YWx1ZTogdiwgZG9uZTogZCB9KTsgfSwgcmVqZWN0KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tYWtlVGVtcGxhdGVPYmplY3QoY29va2VkLCByYXcpIHtcclxuICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvb2tlZCwgXCJyYXdcIiwgeyB2YWx1ZTogcmF3IH0pOyB9IGVsc2UgeyBjb29rZWQucmF3ID0gcmF3OyB9XHJcbiAgICByZXR1cm4gY29va2VkO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0U3Rhcihtb2QpIHtcclxuICAgIGlmIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpIHJldHVybiBtb2Q7XHJcbiAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoT2JqZWN0Lmhhc093blByb3BlcnR5LmNhbGwobW9kLCBrKSkgcmVzdWx0W2tdID0gbW9kW2tdO1xyXG4gICAgcmVzdWx0LmRlZmF1bHQgPSBtb2Q7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnREZWZhdWx0KG1vZCkge1xyXG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBkZWZhdWx0OiBtb2QgfTtcclxufVxyXG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIEVsZW1lbnRSZWYsIElucHV0LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFjdGl2YXRlZFJvdXRlLCBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHtcbiAgICBhbmltYXRlLFxuICAgIHN0YXRlLFxuICAgIHN0eWxlLFxuICAgIHRyYW5zaXRpb24sXG4gICAgdHJpZ2dlclxufSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdrdWktc2VhcmNoJyxcbiAgICB0ZW1wbGF0ZTogYDxkaXYgY2xhc3M9XCJzZWFyY2gtYmFyLWVsZW1lbnRzXCI+XG5cbiAgICA8IS0tIHRoZSBuZXh0IGVsZW1lbnQgLSBkaXYuZXh0ZW5kZWQtc2VhcmNoLXBhbmVsIC0gaXMgYSBoaWRkZW4gZHJvcGRvd24gZmlsdGVyIG1lbnUgLS0+XG5cbiAgICA8ZGl2IGNsYXNzPVwic2VhcmNoLXBhbmVsXCIgW2NsYXNzLmFjdGl2ZV09XCJzZWFyY2hQYW5lbEZvY3VzXCI+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwicHJlZml4XCIgKGNsaWNrKT1cImRvU2VhcmNoKHNlYXJjaClcIj5cbiAgICAgICAgICAgICAgICA8bWF0LWljb24+c2VhcmNoPC9tYXQtaWNvbj5cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8ZGl2IGNsYXNzPVwiaW5wdXQtZmllbGRcIj5cbiAgICAgICAgICAgIDxpbnB1dCAjc2VhcmNoIGF1dG9jb21wbGV0ZT1cIm9mZlwiIHR5cGU9XCJzZWFyY2hcIiBbcGxhY2Vob2xkZXJdPVwic2VhcmNoTGFiZWxcIiBbKG5nTW9kZWwpXT1cInNlYXJjaFF1ZXJ5XCIgbmFtZT1cInNlYXJjaFwiIChrZXl1cC5lc2MpPVwicmVzZXRTZWFyY2goc2VhcmNoKVwiIChrZXl1cCk9XCJvbktleShzZWFyY2gsICRldmVudClcIiAoY2xpY2spPVwic2V0Rm9jdXMoKVwiIChmb2N1cyk9XCJ0b2dnbGVNZW51KCdzaW1wbGVTZWFyY2gnKVwiIFtkaXNhYmxlZF09XCJmb2N1c09uRXh0ZW5kZWQgPT09ICdhY3RpdmUnXCIgLz5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPCEtLSBzd2l0Y2ggYnV0dG9uOiBvbiBzb21lIGZvY3VzIHdlIG5lZWQgYSBjbG9zZSBidXR0b24gZm9yIHRoZSBzaW1wbGUgb3IgZXh0ZW5kZWQgcGFuZWwgLS0+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwic3VmZml4XCIgKm5nSWY9XCJmb2N1c09uU2ltcGxlID09PSAnYWN0aXZlJ1wiIChjbGljayk9XCJyZXNldFNlYXJjaChzZWFyY2gpXCI+XG4gICAgICAgICAgICAgICAgPG1hdC1pY29uPmNsb3NlPC9tYXQtaWNvbj5cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cInN1ZmZpeFwiICpuZ0lmPVwiZm9jdXNPblNpbXBsZSA9PT0gJ2luYWN0aXZlJ1wiPlxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDwhLS0gdGhlIHNlYXJjaCBwYW5lbCBoYXMgdHdvIFwiZHJvcGRvd25cIiBtZW51czogb25lIGZvciBzaW1wbGUgc2VhcmNoIGFuZCBhbm90aGVyIG9uZSBmb3IgdGhlIGV4dGVuZGVkIHNlYXJjaCAtLT5cbiAgICAgICAgPGRpdiBjbGFzcz1cImt1aS1tZW51IHNpbXBsZS1zZWFyY2hcIiBbQHNpbXBsZVNlYXJjaE1lbnVdPVwiZm9jdXNPblNpbXBsZVwiICpuZ0lmPVwic2hvd1NpbXBsZVNlYXJjaFwiPlxuICAgICAgICAgICAgPG1hdC1saXN0IGNsYXNzPVwia3VpLXByZXZpb3VzLXNlYXJjaC1saXN0XCI+XG4gICAgICAgICAgICAgICAgPG1hdC1saXN0LWl0ZW0gKm5nRm9yPVwibGV0IGl0ZW0gb2YgcHJldlNlYXJjaCB8IGt1aVJldmVyc2U7IGxldCBpPWluZGV4XCI+XG4gICAgICAgICAgICAgICAgICAgIDxoNCBtYXQtbGluZSAqbmdJZj1cImk8MTBcIiAoY2xpY2spPVwiZG9QcmV2U2VhcmNoKGl0ZW0pXCI+e3tpdGVtfX08L2g0PlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIG1hdC1pY29uLWJ1dHRvbiAoY2xpY2spPVwicmVzZXRQcmV2U2VhcmNoKGl0ZW0pXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bWF0LWljb24gYXJpYS1sYWJlbD1cImNsb3NlXCI+Y2xvc2U8L21hdC1pY29uPlxuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L21hdC1saXN0LWl0ZW0+XG4gICAgICAgICAgICA8L21hdC1saXN0PlxuICAgICAgICAgICAgPGJ1dHRvbiBtYXQtc3Ryb2tlZC1idXR0b24gY29sb3I9XCJhY2NlbnRcIiBjbGFzcz1cInJpZ2h0XCIgKGNsaWNrKT1cInJlc2V0UHJldlNlYXJjaCgpXCIgKm5nSWY9XCJwcmV2U2VhcmNoXCI+Q2xlYXI8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBjbGFzcz1cImt1aS1tZW51IGV4dGVuZGVkLXNlYXJjaFwiIFtAZXh0ZW5kZWRTZWFyY2hNZW51XT1cImZvY3VzT25FeHRlbmRlZFwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImt1aS1tZW51LWhlYWRlclwiPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwia3VpLW1lbnUtdGl0bGVcIj5cbiAgICAgICAgICAgICAgICAgICAgPGg0PkFkdmFuY2VkIHNlYXJjaDwvaDQ+XG4gICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwia3VpLW1lbnUtYWN0aW9uXCI+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gbWF0LWljb24tYnV0dG9uIChjbGljayk9XCJ0b2dnbGVNZW51KCdleHRlbmRlZFNlYXJjaCcpXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bWF0LWljb24+Y2xvc2U8L21hdC1pY29uPlxuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJleHRlbmRlZC1zZWFyY2gtYm94XCI+XG4gICAgICAgICAgICAgICAgPGt1aS1leHRlbmRlZC1zZWFyY2ggW3JvdXRlXT1cInJvdXRlXCIgKHRvZ2dsZUV4dGVuZGVkU2VhcmNoRm9ybSk9XCJ0b2dnbGVNZW51KCdleHRlbmRlZFNlYXJjaCcpXCI+PC9rdWktZXh0ZW5kZWQtc2VhcmNoPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuXG4gICAgPCEtLSBFeHRlbmRlZCBzZWFyY2ggYnV0dG9uIHRvIGRpc3BsYXkgdGhlIGV4dGVuZGVkIHNlYXJjaCBmb3JtIGluIHRoZSBzZWFyY2ggcGFuZWwgLS0+XG4gICAgPGJ1dHRvbiBtYXQtYnV0dG9uIHR5cGU9XCJidXR0b25cIiBjb2xvcj1cInByaW1hcnlcIiBjbGFzcz1cImFkdmFuY2VkLXNlYXJjaC1idXR0b25cIiAoY2xpY2spPVwidG9nZ2xlTWVudSgnZXh0ZW5kZWRTZWFyY2gnKVwiPlxuICAgICAgICBhZHZhbmNlZFxuICAgIDwvYnV0dG9uPlxuXG48L2Rpdj5gLFxuICAgIHN0eWxlczogW2BpbnB1dFt0eXBlPXNlYXJjaF06Oi13ZWJraXQtc2VhcmNoLWNhbmNlbC1idXR0b24saW5wdXRbdHlwZT1zZWFyY2hdOjotd2Via2l0LXNlYXJjaC1kZWNvcmF0aW9uLGlucHV0W3R5cGU9c2VhcmNoXTo6LXdlYmtpdC1zZWFyY2gtcmVzdWx0cy1idXR0b24saW5wdXRbdHlwZT1zZWFyY2hdOjotd2Via2l0LXNlYXJjaC1yZXN1bHRzLWRlY29yYXRpb257ZGlzcGxheTpub25lfWlucHV0W3R5cGU9c2VhcmNoXXstbW96LWFwcGVhcmFuY2U6bm9uZTstd2Via2l0LWFwcGVhcmFuY2U6bm9uZX0uY2VudGVye2Rpc3BsYXk6YmxvY2s7bWFyZ2luLWxlZnQ6YXV0bzttYXJnaW4tcmlnaHQ6YXV0b30uY2xvc2V7cmlnaHQ6MTJweH0uZXh0ZW5kZWQtc2VhcmNoLWJveHttYXJnaW46MTJweH0uYWR2YW5jZWQtc2VhcmNoLWJ1dHRvbnttYXJnaW4tbGVmdDoxMHB4fS5mdWxsLXdpZHRoe3dpZHRoOjEwMCV9LmhpZGV7ZGlzcGxheTpub25lfS5pbmFjdGl2ZSwubXV0ZXtjb2xvcjojN2E3YTdhfS5zZWFyY2gtcGFuZWx7YmFja2dyb3VuZC1jb2xvcjojZjlmOWY5O2JvcmRlci1yYWRpdXM6NHB4O2Rpc3BsYXk6aW5saW5lLWZsZXg7aGVpZ2h0OjQwcHg7d2lkdGg6NjgwcHg7ei1pbmRleDoxMH0uc2VhcmNoLXBhbmVsOmhvdmVye2JveC1zaGFkb3c6MCAxcHggM3B4IHJnYmEoMCwwLDAsLjUpfS5zZWFyY2gtcGFuZWwgZGl2LmlucHV0LWZpZWxke2ZsZXg6MX0uc2VhcmNoLXBhbmVsIGRpdi5pbnB1dC1maWVsZCBpbnB1dHtib3JkZXItc3R5bGU6bm9uZTtmb250LXNpemU6MTRwdDtoZWlnaHQ6MzhweDtwb3NpdGlvbjphYnNvbHV0ZTt3aWR0aDpjYWxjKDEwMCUgLSA4MHB4KX0uc2VhcmNoLXBhbmVsIGRpdi5pbnB1dC1maWVsZCBpbnB1dDphY3RpdmUsLnNlYXJjaC1wYW5lbCBkaXYuaW5wdXQtZmllbGQgaW5wdXQ6Zm9jdXN7b3V0bGluZTowfS5zZWFyY2gtcGFuZWwgZGl2IC5wcmVmaXgsLnNlYXJjaC1wYW5lbCBkaXYgLnN1ZmZpeHtiYWNrZ3JvdW5kLWNvbG9yOiNmZmY7Ym9yZGVyLXJhZGl1czozcHg7Ym9yZGVyLXN0eWxlOm5vbmU7Y29sb3I6cmdiYSg0MSw0MSw0MSwuNCk7Y3Vyc29yOnBvaW50ZXI7aGVpZ2h0OjM4cHg7b3V0bGluZTowO3Bvc2l0aW9uOnJlbGF0aXZlO3dpZHRoOjQwcHh9LnNlYXJjaC1wYW5lbCBkaXYgLnByZWZpeDphY3RpdmUsLnNlYXJjaC1wYW5lbCBkaXYgLnN1ZmZpeDphY3RpdmV7Y29sb3I6IzUxNTE1MX0uc2VhcmNoLXBhbmVsLmFjdGl2ZXtib3gtc2hhZG93OjAgMXB4IDNweCByZ2JhKDAsMCwwLC41KX0ua3VpLW1lbnV7Ym94LXNoYWRvdzowIDNweCA1cHggLTFweCByZ2JhKDExLDExLDExLC4yKSwwIDZweCAxMHB4IDAgcmdiYSgxMSwxMSwxMSwuMTQpLDAgMXB4IDE4cHggMCByZ2JhKDExLDExLDExLC4xMik7YmFja2dyb3VuZC1jb2xvcjojZjlmOWY5O2JvcmRlci1yYWRpdXM6NHB4O3Bvc2l0aW9uOmFic29sdXRlfS5rdWktbWVudSAua3VpLW1lbnUtaGVhZGVye2JhY2tncm91bmQtY29sb3I6I2Y5ZjlmOTtib3JkZXItdG9wLWxlZnQtcmFkaXVzOjRweDtib3JkZXItdG9wLXJpZ2h0LXJhZGl1czo0cHg7ZGlzcGxheTppbmxpbmUtYmxvY2s7aGVpZ2h0OjQ4cHg7d2lkdGg6MTAwJX0ua3VpLW1lbnUgLmt1aS1tZW51LWhlYWRlciAua3VpLW1lbnUtdGl0bGV7ZmxvYXQ6bGVmdDtmb250LXNpemU6MTRweDtmb250LXdlaWdodDo0MDA7bWFyZ2luLXRvcDo0cHg7cGFkZGluZzoxMnB4fS5rdWktbWVudSAua3VpLW1lbnUtaGVhZGVyIC5rdWktbWVudS1hY3Rpb257ZmxvYXQ6cmlnaHQ7bWFyZ2luOjRweH0ua3VpLW1lbnUuZXh0ZW5kZWQtc2VhcmNoLC5rdWktbWVudS5zaW1wbGUtc2VhcmNoe21pbi1oZWlnaHQ6NjgwcHg7d2lkdGg6NjgwcHh9Lmt1aS1tZW51LnNpbXBsZS1zZWFyY2h7cGFkZGluZy10b3A6NjBweDt6LWluZGV4Oi0xfS5rdWktbWVudS5zaW1wbGUtc2VhcmNoIC5rdWktcHJldmlvdXMtc2VhcmNoLWxpc3QgLm1hdC1saXN0LWl0ZW17Y3Vyc29yOnBvaW50ZXJ9Lmt1aS1tZW51LnNpbXBsZS1zZWFyY2ggLmt1aS1wcmV2aW91cy1zZWFyY2gtbGlzdCAubWF0LWxpc3QtaXRlbTpob3ZlcntiYWNrZ3JvdW5kLWNvbG9yOiNmOWY5Zjl9Lmt1aS1tZW51LnNpbXBsZS1zZWFyY2ggLmt1aS1wcmV2aW91cy1zZWFyY2gtbGlzdCAubWF0LWxpc3QtaXRlbTpob3ZlciBtYXQtaWNvbntkaXNwbGF5OmJsb2NrfS5rdWktbWVudS5zaW1wbGUtc2VhcmNoIC5rdWktcHJldmlvdXMtc2VhcmNoLWxpc3QgLm1hdC1saXN0LWl0ZW0gbWF0LWljb257ZGlzcGxheTpub25lfS5rdWktbWVudS5zaW1wbGUtc2VhcmNoIC5yaWdodHttYXJnaW4tdG9wOjEycHg7bWFyZ2luLWxlZnQ6MTZweH0ua3VpLW1lbnUuZXh0ZW5kZWQtc2VhcmNoe3otaW5kZXg6MjB9LnNlYXJjaC1iYXItZWxlbWVudHN7ei1pbmRleDoxMDB9LnNob3d7ZGlzcGxheTpibG9ja31AbWVkaWEgc2NyZWVuIGFuZCAobWF4LXdpZHRoOjEwMjRweCl7LnNlYXJjaC1wYW5lbHt3aWR0aDo0ODBweH0uc2VhcmNoLXBhbmVsIGRpdi5pbnB1dC1maWVsZCBpbnB1dHt3aWR0aDpjYWxjKDQ4MHB4IC0gODBweCl9Lmt1aS1tZW51LmV4dGVuZGVkLXNlYXJjaCwua3VpLW1lbnUuc2ltcGxlLXNlYXJjaHt3aWR0aDo0ODBweH19QG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDo3NjhweCl7LnNlYXJjaC1wYW5lbHt3aWR0aDpjYWxjKDQ4MHB4IC0gMTYwcHgpfS5zZWFyY2gtcGFuZWwgZGl2LmlucHV0LWZpZWxkIGlucHV0e3dpZHRoOmNhbGMoNDgwcHggLSAxNjBweCAtIDgwcHgpfS5rdWktbWVudS5leHRlbmRlZC1zZWFyY2gsLmt1aS1tZW51LnNpbXBsZS1zZWFyY2h7d2lkdGg6Y2FsYyg0ODBweCAtIDgwcHgpfX1gXSxcbiAgICBhbmltYXRpb25zOiBbXG4gICAgICAgIHRyaWdnZXIoJ3NpbXBsZVNlYXJjaE1lbnUnLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgIHN0YXRlKCdpbmFjdGl2ZScsIHN0eWxlKHsgZGlzcGxheTogJ25vbmUnIH0pKSxcbiAgICAgICAgICAgICAgICBzdGF0ZSgnYWN0aXZlJywgc3R5bGUoeyBkaXNwbGF5OiAnYmxvY2snIH0pKSxcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uKCdpbmFjdGl2ZSA9PiB0cnVlJywgYW5pbWF0ZSgnMTAwbXMgZWFzZS1pbicpKSxcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uKCd0cnVlID0+IGluYWN0aXZlJywgYW5pbWF0ZSgnMTAwbXMgZWFzZS1vdXQnKSlcbiAgICAgICAgICAgIF1cbiAgICAgICAgKSxcbiAgICAgICAgdHJpZ2dlcignZXh0ZW5kZWRTZWFyY2hNZW51JyxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICBzdGF0ZSgnaW5hY3RpdmUnLCBzdHlsZSh7IGRpc3BsYXk6ICdub25lJyB9KSksXG4gICAgICAgICAgICAgICAgc3RhdGUoJ2FjdGl2ZScsIHN0eWxlKHsgZGlzcGxheTogJ2Jsb2NrJyB9KSksXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbignaW5hY3RpdmUgPT4gdHJ1ZScsIGFuaW1hdGUoJzEwMG1zIGVhc2UtaW4nKSksXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbigndHJ1ZSA9PiBpbmFjdGl2ZScsIGFuaW1hdGUoJzEwMG1zIGVhc2Utb3V0JykpXG4gICAgICAgICAgICBdXG4gICAgICAgICksXG4gICAgXVxufSlcblxuLyoqXG4gKiBDb250YWlucyBtZXRob2RzIHRvIHJlYWxpc2UsIHJlc2V0IG5ldyBvciBwcmV2aW91cyBzaW1wbGUgc2VhcmNoZXMuXG4gKi9cbmV4cG9ydCBjbGFzcyBTZWFyY2hDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gICAgQElucHV0KCkgcm91dGU6IHN0cmluZyA9ICcvc2VhcmNoJztcblxuICAgIHNlYXJjaFF1ZXJ5OiBzdHJpbmc7XG5cbiAgICBzZWFyY2hQYW5lbEZvY3VzOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBwcmV2U2VhcmNoOiBzdHJpbmdbXSA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3ByZXZTZWFyY2gnKSk7XG5cbiAgICBmb2N1c09uU2ltcGxlOiBzdHJpbmcgPSAnaW5hY3RpdmUnO1xuICAgIGZvY3VzT25FeHRlbmRlZDogc3RyaW5nID0gJ2luYWN0aXZlJztcblxuICAgIHNlYXJjaExhYmVsOiBzdHJpbmcgPSAnU2VhcmNoJztcblxuICAgIHNob3dTaW1wbGVTZWFyY2g6IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBfcm91dGU6IEFjdGl2YXRlZFJvdXRlLFxuICAgICAgICBwcml2YXRlIF9yb3V0ZXI6IFJvdXRlcixcbiAgICAgICAgcHJpdmF0ZSBfZWxlUmVmOiBFbGVtZW50UmVmKSB7XG5cbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaWdub3JlXG4gICAgICogRG8gc2VhcmNoIG9uIEVudGVyIGNsaWNrLCByZXNldCBzZWFyY2ggb24gRXNjYXBlXG4gICAgICogQHBhcmFtIHNlYXJjaF9lbGVcbiAgICAgKiBAcGFyYW0gZXZlbnRcbiAgICAgKiBAcmV0dXJucyB2b2lkXG4gICAgICovXG4gICAgb25LZXkoc2VhcmNoX2VsZTogSFRNTEVsZW1lbnQsIGV2ZW50KTogdm9pZCB7XG4gICAgICAgIHRoaXMuZm9jdXNPblNpbXBsZSA9ICdhY3RpdmUnO1xuICAgICAgICB0aGlzLnByZXZTZWFyY2ggPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdwcmV2U2VhcmNoJykpO1xuICAgICAgICBpZiAodGhpcy5zZWFyY2hRdWVyeSAmJiAoZXZlbnQua2V5ID09PSAnRW50ZXInIHx8IGV2ZW50LmtleUNvZGUgPT09IDEzIHx8IGV2ZW50LndoaWNoID09PSAxMykpIHtcbiAgICAgICAgICAgIHRoaXMuZG9TZWFyY2goc2VhcmNoX2VsZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGV2ZW50LmtleSA9PT0gJ0VzY2FwZScgfHwgZXZlbnQua2V5Q29kZSA9PT0gMjcgfHwgZXZlbnQud2hpY2ggPT09IDI3KSB7XG4gICAgICAgICAgICB0aGlzLnJlc2V0U2VhcmNoKHNlYXJjaF9lbGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVhbGlzZSBhIHNpbXBsZSBzZWFyY2hcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBzZWFyY2hfZWxlXG4gICAgICogQHJldHVybnMgdm9pZFxuICAgICAqL1xuICAgIGRvU2VhcmNoKHNlYXJjaF9lbGU6IEhUTUxFbGVtZW50KTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLnNlYXJjaFF1ZXJ5ICE9PSB1bmRlZmluZWQgJiYgdGhpcy5zZWFyY2hRdWVyeSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy50b2dnbGVNZW51KCdzaW1wbGVTZWFyY2gnKTtcbiAgICAgICAgICAgIHRoaXMuX3JvdXRlci5uYXZpZ2F0ZShbdGhpcy5yb3V0ZSArICcvZnVsbHRleHQvJyArIHRoaXMuc2VhcmNoUXVlcnldKTtcblxuICAgICAgICAgICAgLy8gdGhpcy5fcm91dGVyLm5hdmlnYXRlKFsnL3NlYXJjaC9mdWxsdGV4dC8nICsgdGhpcy5zZWFyY2hRdWVyeV0sIHsgcmVsYXRpdmVUbzogdGhpcy5fcm91dGUgfSk7XG5cbiAgICAgICAgICAgIC8vIHB1c2ggdGhlIHNlYXJjaCBxdWVyeSBpbnRvIHRoZSBsb2NhbCBzdG9yYWdlIHByZXZTZWFyY2ggYXJyYXkgKHByZXZpb3VzIHNlYXJjaClcbiAgICAgICAgICAgIC8vIHRvIGhhdmUgYSBsaXN0IG9mIHJlY2VudCBzZWFyY2ggcmVxdWVzdHNcbiAgICAgICAgICAgIGxldCBleGlzdGluZ1ByZXZTZWFyY2g6IHN0cmluZ1tdID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncHJldlNlYXJjaCcpKTtcbiAgICAgICAgICAgIGlmIChleGlzdGluZ1ByZXZTZWFyY2ggPT09IG51bGwpIHsgZXhpc3RpbmdQcmV2U2VhcmNoID0gW107IH1cbiAgICAgICAgICAgIGxldCBpOiBudW1iZXIgPSAwO1xuICAgICAgICAgICAgZm9yIChjb25zdCBlbnRyeSBvZiBleGlzdGluZ1ByZXZTZWFyY2gpIHtcbiAgICAgICAgICAgICAgICAvLyByZW1vdmUgZW50cnksIGlmIGV4aXN0cyBhbHJlYWR5XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc2VhcmNoUXVlcnkgPT09IGVudHJ5KSB7IGV4aXN0aW5nUHJldlNlYXJjaC5zcGxpY2UoaSwgMSk7IH1cbiAgICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGV4aXN0aW5nUHJldlNlYXJjaC5wdXNoKHRoaXMuc2VhcmNoUXVlcnkpO1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3ByZXZTZWFyY2gnLCBKU09OLnN0cmluZ2lmeShleGlzdGluZ1ByZXZTZWFyY2gpKTtcbiAgICAgICAgICAgIC8vIFRPRE86IHNhdmUgdGhlIHByZXZpb3VzIHNlYXJjaCBxdWVyaWVzIHNvbWV3aGVyZSBpbiB0aGUgdXNlcidzIHByb2ZpbGVcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2VhcmNoX2VsZS5mb2N1cygpO1xuICAgICAgICAgICAgdGhpcy5wcmV2U2VhcmNoID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncHJldlNlYXJjaCcpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBpZ25vcmVcbiAgICAgKlxuICAgICAqIFJlc2V0IHRoZSBzZWFyY2hcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBzZWFyY2hfZWxlXG4gICAgICogQHJldHVybnMgdm9pZFxuICAgICAqL1xuICAgIHJlc2V0U2VhcmNoKHNlYXJjaF9lbGU6IEhUTUxFbGVtZW50KTogdm9pZCB7XG4gICAgICAgIHRoaXMuc2VhcmNoUXVlcnkgPSBudWxsO1xuICAgICAgICBzZWFyY2hfZWxlLmZvY3VzKCk7XG4gICAgICAgIHRoaXMuZm9jdXNPblNpbXBsZSA9ICdpbmFjdGl2ZSc7XG4gICAgICAgIHRoaXMuc2VhcmNoUGFuZWxGb2N1cyA9ICF0aGlzLnNlYXJjaFBhbmVsRm9jdXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGlnbm9yZVxuICAgICAqXG4gICAgICogUmVhbGlzZSBhIHByZXZpb3VzIHNlYXJjaFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBxdWVyeVxuICAgICAqIEByZXR1cm5zIHZvaWRcbiAgICAgKi9cbiAgICBkb1ByZXZTZWFyY2gocXVlcnk6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICB0aGlzLnNlYXJjaFF1ZXJ5ID0gcXVlcnk7XG4gICAgICAgIHRoaXMuX3JvdXRlci5uYXZpZ2F0ZShbdGhpcy5yb3V0ZSArICcvZnVsbHRleHQvJyArIHF1ZXJ5XSwgeyByZWxhdGl2ZVRvOiB0aGlzLl9yb3V0ZSB9KTtcbiAgICAgICAgdGhpcy50b2dnbGVNZW51KCdzaW1wbGVTZWFyY2gnKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaWdub3JlXG4gICAgICpcbiAgICAgKiBSZXNldCBwcmV2aW91cyBzZWFyY2hlcyAtIHRoZSB3aG9sZSBwcmV2aW91cyBzZWFyY2ggb3Igc3BlY2lmaWMgaXRlbSBieSBuYW1lXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgdGVybSBvZiB0aGUgc2VhcmNoXG4gICAgICogQHJldHVybnMgdm9pZFxuICAgICAqL1xuICAgIHJlc2V0UHJldlNlYXJjaChuYW1lOiBzdHJpbmcgPSBudWxsKTogdm9pZCB7XG4gICAgICAgIGlmIChuYW1lKSB7XG4gICAgICAgICAgICAvLyBkZWxldGUgb25seSB0aGlzIGl0ZW0gd2l0aCB0aGUgbmFtZSAuLi5cbiAgICAgICAgICAgIGNvbnN0IGk6IG51bWJlciA9IHRoaXMucHJldlNlYXJjaC5pbmRleE9mKG5hbWUpO1xuICAgICAgICAgICAgdGhpcy5wcmV2U2VhcmNoLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdwcmV2U2VhcmNoJywgSlNPTi5zdHJpbmdpZnkodGhpcy5wcmV2U2VhcmNoKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBkZWxldGUgdGhlIHdob2xlIFwicHJldmlvdXMgc2VhcmNoXCIgYXJyYXlcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCdwcmV2U2VhcmNoJyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wcmV2U2VhcmNoID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncHJldlNlYXJjaCcpKTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBpZ25vcmVcbiAgICAgKiBTZXQgc2ltcGxlIGZvY3VzIHRvIGFjdGl2ZVxuICAgICAqXG4gICAgICogQHJldHVybnMgdm9pZFxuICAgICAqL1xuICAgIHNldEZvY3VzKCk6IHZvaWQge1xuICAgICAgICB0aGlzLnByZXZTZWFyY2ggPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdwcmV2U2VhcmNoJykpO1xuICAgICAgICB0aGlzLmZvY3VzT25TaW1wbGUgPSAnYWN0aXZlJztcbiAgICAgICAgdGhpcy5zZWFyY2hQYW5lbEZvY3VzID0gIXRoaXMuc2VhcmNoUGFuZWxGb2N1cztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaWdub3JlXG4gICAgICpcbiAgICAgKiBTd2l0Y2ggYWNjb3JkaW5nIHRvIHRoZSBmb2N1cyBiZXR3ZWVuIHNpbXBsZSBvciBleHRlbmRlZCBzZWFyY2hcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIDIgY2FzZXM6IHNpbXBsZVNlYXJjaCBvciBleHRlbmRlZFNlYXJjaFxuICAgICAqIEByZXR1cm5zIHZvaWRcbiAgICAgKi9cbiAgICB0b2dnbGVNZW51KG5hbWU6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICBzd2l0Y2ggKG5hbWUpIHtcbiAgICAgICAgICAgIGNhc2UgJ3NpbXBsZVNlYXJjaCc6XG4gICAgICAgICAgICAgICAgdGhpcy5wcmV2U2VhcmNoID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncHJldlNlYXJjaCcpKTtcbiAgICAgICAgICAgICAgICB0aGlzLmZvY3VzT25TaW1wbGUgPSAodGhpcy5mb2N1c09uU2ltcGxlID09PSAnYWN0aXZlJyA/ICdpbmFjdGl2ZScgOiAnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5zaG93U2ltcGxlU2VhcmNoID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2V4dGVuZGVkU2VhcmNoJzpcbiAgICAgICAgICAgICAgICB0aGlzLmZvY3VzT25FeHRlbmRlZCA9ICh0aGlzLmZvY3VzT25FeHRlbmRlZCA9PT0gJ2FjdGl2ZScgPyAnaW5hY3RpdmUnIDogJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2hvd1NpbXBsZVNlYXJjaCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgYW5pbWF0ZSwgc3RhdGUsIHN0eWxlLCB0cmFuc2l0aW9uLCB0cmlnZ2VyIH0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2t1aS1zZWFyY2gtcGFuZWwnLFxuICB0ZW1wbGF0ZTogYDxkaXYgY2xhc3M9XCJrdWktc2VhcmNoLXBhbmVsXCI+XG5cbiAgICA8ZGl2IGNsYXNzPVwia3VpLXNlYXJjaC1iYXJcIj5cblxuICAgICAgICA8ZGl2IGNsYXNzPVwiZnVsbHRleHQtc2VhcmNoXCI+XG4gICAgICAgICAgICA8a3VpLWZ1bGx0ZXh0LXNlYXJjaCBbcm91dGVdPVwicm91dGVcIj48L2t1aS1mdWxsdGV4dC1zZWFyY2g+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgKm5nSWY9XCJzaG93TWVudVwiIFtAZXh0ZW5kZWRTZWFyY2hNZW51XT1cImZvY3VzT25FeHRlbmRlZFwiIGNsYXNzPVwia3VpLW1lbnUgZXh0ZW5kZWQtc2VhcmNoXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwia3VpLW1lbnUtaGVhZGVyXCI+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJrdWktbWVudS10aXRsZVwiPlxuICAgICAgICAgICAgICAgICAgICA8aDQ+QWR2YW5jZWQgc2VhcmNoPC9oND5cbiAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJrdWktbWVudS1hY3Rpb25cIj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBtYXQtaWNvbi1idXR0b24gKGNsaWNrKT1cInRvZ2dsZU1lbnUoKVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPG1hdC1pY29uPmNsb3NlPC9tYXQtaWNvbj5cbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZXh0ZW5kZWQtc2VhcmNoLWJveFwiPlxuICAgICAgICAgICAgICAgIDxrdWktZXh0ZW5kZWQtc2VhcmNoIFtyb3V0ZV09XCJyb3V0ZVwiICh0b2dnbGVFeHRlbmRlZFNlYXJjaEZvcm0pPVwidG9nZ2xlTWVudSgpXCI+PC9rdWktZXh0ZW5kZWQtc2VhcmNoPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgPC9kaXY+XG5cbiAgICA8ZGl2IGNsYXNzPVwiYWR2YW5jZWQtYnRuXCI+XG4gICAgICAgIDxidXR0b24gbWF0LWJ1dHRvbiBjb2xvcj1cInByaW1hcnlcIiAoY2xpY2spPVwidG9nZ2xlTWVudSgpXCI+YWR2YW5jZWQ8L2J1dHRvbj5cbiAgICA8L2Rpdj5cblxuPC9kaXY+YCxcbiAgc3R5bGVzOiBbYC5hZHZhbmNlZC1idG57bWFyZ2luLWxlZnQ6MTBweH0ua3VpLXNlYXJjaC1wYW5lbHtkaXNwbGF5OmZsZXg7cG9zaXRpb246cmVsYXRpdmU7ei1pbmRleDoxMDB9Lmt1aS1zZWFyY2gtYmFye2JhY2tncm91bmQtY29sb3I6I2Y5ZjlmOTtib3JkZXItcmFkaXVzOjRweDtkaXNwbGF5OmlubGluZS1mbGV4O2hlaWdodDo0MHB4O3Bvc2l0aW9uOnJlbGF0aXZlO3otaW5kZXg6MTB9Lmt1aS1zZWFyY2gtYmFyOmhvdmVye2JveC1zaGFkb3c6MCAxcHggM3B4IHJnYmEoMCwwLDAsLjUpfS5rdWktbWVudXtib3gtc2hhZG93OjAgM3B4IDVweCAtMXB4IHJnYmEoMTEsMTEsMTEsLjIpLDAgNnB4IDEwcHggMCByZ2JhKDExLDExLDExLC4xNCksMCAxcHggMThweCAwIHJnYmEoMTEsMTEsMTEsLjEyKTtiYWNrZ3JvdW5kLWNvbG9yOiNmOWY5Zjk7Ym9yZGVyLXJhZGl1czo0cHg7cG9zaXRpb246YWJzb2x1dGV9Lmt1aS1tZW51IC5rdWktbWVudS1oZWFkZXJ7YmFja2dyb3VuZC1jb2xvcjojZjlmOWY5O2JvcmRlci10b3AtbGVmdC1yYWRpdXM6NHB4O2JvcmRlci10b3AtcmlnaHQtcmFkaXVzOjRweDtkaXNwbGF5OmlubGluZS1ibG9jaztoZWlnaHQ6NDhweDt3aWR0aDoxMDAlfS5rdWktbWVudSAua3VpLW1lbnUtaGVhZGVyIC5rdWktbWVudS10aXRsZXtmbG9hdDpsZWZ0O2ZvbnQtc2l6ZToxNHB4O2ZvbnQtd2VpZ2h0OjQwMDttYXJnaW4tdG9wOjRweDtwYWRkaW5nOjEycHh9Lmt1aS1tZW51IC5rdWktbWVudS1oZWFkZXIgLmt1aS1tZW51LWFjdGlvbntmbG9hdDpyaWdodDttYXJnaW46NHB4fS5rdWktbWVudS5leHRlbmRlZC1zZWFyY2h7bWluLWhlaWdodDo2ODBweDt3aWR0aDo2ODBweDt6LWluZGV4OjIwfS5leHRlbmRlZC1zZWFyY2gtYm94e21hcmdpbjoxMnB4fUBtZWRpYSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6MTAyNHB4KXsua3VpLXNlYXJjaC1iYXJ7d2lkdGg6NDgwcHh9Lmt1aS1zZWFyY2gtYmFyIGRpdi5pbnB1dC1maWVsZCBpbnB1dHt3aWR0aDpjYWxjKDQ4MHB4IC0gODBweCl9LmZ1bGx0ZXh0LXNlYXJjaCwua3VpLW1lbnUuZXh0ZW5kZWQtc2VhcmNoe3dpZHRoOjQ4MHB4fX1AbWVkaWEgc2NyZWVuIGFuZCAobWF4LXdpZHRoOjc2OHB4KXsua3VpLXNlYXJjaC1iYXJ7d2lkdGg6Y2FsYyg0ODBweCAtIDE2MHB4KX0ua3VpLXNlYXJjaC1iYXIgZGl2LmlucHV0LWZpZWxkIGlucHV0e3dpZHRoOmNhbGMoNDgwcHggLSAxNjBweCAtIDgwcHgpfS5mdWxsdGV4dC1zZWFyY2gsLmt1aS1tZW51LmV4dGVuZGVkLXNlYXJjaHt3aWR0aDpjYWxjKDQ4MHB4IC0gODBweCl9fWBdLFxuICBhbmltYXRpb25zOiBbXG4gICAgdHJpZ2dlcignZXh0ZW5kZWRTZWFyY2hNZW51JyxcbiAgICAgIFtcbiAgICAgICAgc3RhdGUoJ2luYWN0aXZlJywgc3R5bGUoeyBkaXNwbGF5OiAnbm9uZScgfSkpLFxuICAgICAgICBzdGF0ZSgnYWN0aXZlJywgc3R5bGUoeyBkaXNwbGF5OiAnYmxvY2snIH0pKSxcbiAgICAgICAgdHJhbnNpdGlvbignaW5hY3RpdmUgPT4gYWN0aXZlJywgYW5pbWF0ZSgnMTAwbXMgZWFzZS1pbicpKSxcbiAgICAgICAgdHJhbnNpdGlvbignYWN0aXZlID0+IGluYWN0aXZlJywgYW5pbWF0ZSgnMTAwbXMgZWFzZS1vdXQnKSlcbiAgICAgIF1cbiAgICApXG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgU2VhcmNoUGFuZWxDb21wb25lbnQge1xuXG4gIEBJbnB1dCgpIHJvdXRlOiBzdHJpbmcgPSAnL3NlYXJjaCc7XG4gIHNob3dNZW51OiBib29sZWFuID0gZmFsc2U7XG4gIGZvY3VzT25FeHRlbmRlZDogc3RyaW5nID0gJ2luYWN0aXZlJztcblxuICBjb25zdHJ1Y3RvcigpIHsgfVxuXG4gIC8qKlxuICAgKiBTaG93IG9yIGhpZGUgdGhlIGV4dGVuZGVkIHNlYXJjaCBtZW51XG4gICAqXG4gICAqIEByZXR1cm5zIHZvaWRcbiAgICovXG4gIHRvZ2dsZU1lbnUoKTogdm9pZCB7XG4gICAgdGhpcy5zaG93TWVudSA9ICF0aGlzLnNob3dNZW51O1xuICAgIHRoaXMuZm9jdXNPbkV4dGVuZGVkID0gKHRoaXMuZm9jdXNPbkV4dGVuZGVkID09PSAnYWN0aXZlJyA/ICdpbmFjdGl2ZScgOiAnYWN0aXZlJyk7XG4gIH1cbn1cbiIsImltcG9ydCB7IGFuaW1hdGUsIHN0YXRlLCBzdHlsZSwgdHJhbnNpdGlvbiwgdHJpZ2dlciB9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZSwgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdrdWktZnVsbHRleHQtc2VhcmNoJyxcbiAgICB0ZW1wbGF0ZTogYDxkaXYgY2xhc3M9XCJzZWFyY2gtYmFyLWVsZW1lbnRzXCI+XG5cbiAgICA8ZGl2IGNsYXNzPVwiZnVsbHRleHQtc2VhcmNoLWJhclwiIFtjbGFzcy5hY3RpdmVdPVwic2VhcmNoUGFuZWxGb2N1c1wiPlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cInByZWZpeFwiIChjbGljayk9XCJkb1NlYXJjaChzZWFyY2gpXCI+XG4gICAgICAgICAgICAgICAgPG1hdC1pY29uPnNlYXJjaDwvbWF0LWljb24+XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBjbGFzcz1cImlucHV0LWZpZWxkXCI+XG4gICAgICAgICAgICA8aW5wdXQgI3NlYXJjaCBhdXRvY29tcGxldGU9XCJvZmZcIiB0eXBlPVwic2VhcmNoXCIgW3BsYWNlaG9sZGVyXT1cInNlYXJjaExhYmVsXCIgWyhuZ01vZGVsKV09XCJzZWFyY2hRdWVyeVwiIG5hbWU9XCJzZWFyY2hcIiAoa2V5dXAuZXNjKT1cInJlc2V0U2VhcmNoKHNlYXJjaClcIiAoa2V5dXApPVwib25LZXkoc2VhcmNoLCAkZXZlbnQpXCIgKGNsaWNrKT1cInNldEZvY3VzKClcIiAoZm9jdXMpPVwidG9nZ2xlTWVudSgpXCIgLz5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPCEtLSBzd2l0Y2ggYnV0dG9uOiBvbiBzb21lIGZvY3VzIHdlIG5lZWQgYSBjbG9zZSBidXR0b24gZm9yIHRoZSBzaW1wbGUgLS0+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwic3VmZml4XCIgKm5nSWY9XCJmb2N1c09uU2ltcGxlID09PSAnYWN0aXZlJ1wiIChjbGljayk9XCJyZXNldFNlYXJjaChzZWFyY2gpXCI+XG4gICAgICAgICAgICAgICAgPG1hdC1pY29uPmNsb3NlPC9tYXQtaWNvbj5cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cInN1ZmZpeFwiICpuZ0lmPVwiZm9jdXNPblNpbXBsZSA9PT0gJ2luYWN0aXZlJ1wiPjwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8IS0tIFwiZHJvcGRvd25cIiBtZW51IGZvciBzaW1wbGUgc2VhcmNoIC0tPlxuICAgICAgICA8ZGl2IGNsYXNzPVwia3VpLW1lbnUgc2ltcGxlLXNlYXJjaFwiIFtAZnVsbHRleHRTZWFyY2hNZW51XT1cImZvY3VzT25TaW1wbGVcIiAqbmdJZj1cInNob3dTaW1wbGVTZWFyY2hcIj5cbiAgICAgICAgICAgIDxtYXQtbGlzdCBjbGFzcz1cImt1aS1wcmV2aW91cy1zZWFyY2gtbGlzdFwiPlxuICAgICAgICAgICAgICAgIDxtYXQtbGlzdC1pdGVtICpuZ0Zvcj1cImxldCBpdGVtIG9mIHByZXZTZWFyY2ggfCBrdWlSZXZlcnNlOyBsZXQgaT1pbmRleFwiPlxuICAgICAgICAgICAgICAgICAgICA8aDQgbWF0LWxpbmUgKm5nSWY9XCJpPDEwXCIgKGNsaWNrKT1cImRvUHJldlNlYXJjaChpdGVtKVwiPnt7aXRlbX19PC9oND5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBtYXQtaWNvbi1idXR0b24gKGNsaWNrKT1cInJlc2V0UHJldlNlYXJjaChpdGVtKVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPG1hdC1pY29uIGFyaWEtbGFiZWw9XCJjbG9zZVwiPmNsb3NlPC9tYXQtaWNvbj5cbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9tYXQtbGlzdC1pdGVtPlxuICAgICAgICAgICAgPC9tYXQtbGlzdD5cbiAgICAgICAgICAgIDxidXR0b24gbWF0LXN0cm9rZWQtYnV0dG9uIGNvbG9yPVwiYWNjZW50XCIgY2xhc3M9XCJyaWdodFwiIChjbGljayk9XCJyZXNldFByZXZTZWFyY2goKVwiICpuZ0lmPVwicHJldlNlYXJjaFwiPkNsZWFyPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgPC9kaXY+XG48L2Rpdj5gLFxuICAgIHN0eWxlczogW2BpbnB1dFt0eXBlPXNlYXJjaF06Oi13ZWJraXQtc2VhcmNoLWNhbmNlbC1idXR0b24saW5wdXRbdHlwZT1zZWFyY2hdOjotd2Via2l0LXNlYXJjaC1kZWNvcmF0aW9uLGlucHV0W3R5cGU9c2VhcmNoXTo6LXdlYmtpdC1zZWFyY2gtcmVzdWx0cy1idXR0b24saW5wdXRbdHlwZT1zZWFyY2hdOjotd2Via2l0LXNlYXJjaC1yZXN1bHRzLWRlY29yYXRpb257ZGlzcGxheTpub25lfWlucHV0W3R5cGU9c2VhcmNoXXstbW96LWFwcGVhcmFuY2U6bm9uZTstd2Via2l0LWFwcGVhcmFuY2U6bm9uZX0uZnVsbC13aWR0aHt3aWR0aDoxMDAlfS5jbG9zZXtyaWdodDoxMnB4fS5oaWRle2Rpc3BsYXk6bm9uZX0uc2hvd3tkaXNwbGF5OmJsb2NrfS5zZWFyY2gtYmFyLWVsZW1lbnRze2Rpc3BsYXk6ZmxleDtwb3NpdGlvbjpyZWxhdGl2ZTt6LWluZGV4OjEwMH0uaW5hY3RpdmV7Y29sb3I6IzdhN2E3YX0uZnVsbHRleHQtc2VhcmNoLWJhcntiYWNrZ3JvdW5kLWNvbG9yOiNmOWY5Zjk7Ym9yZGVyLXJhZGl1czo0cHg7ZGlzcGxheTppbmxpbmUtZmxleDtoZWlnaHQ6NDBweDtwb3NpdGlvbjpyZWxhdGl2ZTt3aWR0aDo2ODBweDt6LWluZGV4OjEwfS5mdWxsdGV4dC1zZWFyY2gtYmFyOmhvdmVye2JveC1zaGFkb3c6MCAxcHggM3B4IHJnYmEoMCwwLDAsLjUpfS5mdWxsdGV4dC1zZWFyY2gtYmFyIGRpdi5pbnB1dC1maWVsZHtmbGV4OjF9LmZ1bGx0ZXh0LXNlYXJjaC1iYXIgZGl2LmlucHV0LWZpZWxkIGlucHV0e2JvcmRlci1zdHlsZTpub25lO2ZvbnQtc2l6ZToxNHB0O2hlaWdodDozOHB4O3Bvc2l0aW9uOmFic29sdXRlO3dpZHRoOmNhbGMoMTAwJSAtIDgwcHgpfS5mdWxsdGV4dC1zZWFyY2gtYmFyIGRpdi5pbnB1dC1maWVsZCBpbnB1dDphY3RpdmUsLmZ1bGx0ZXh0LXNlYXJjaC1iYXIgZGl2LmlucHV0LWZpZWxkIGlucHV0OmZvY3Vze291dGxpbmU6MH0uZnVsbHRleHQtc2VhcmNoLWJhciBkaXYgLnByZWZpeCwuZnVsbHRleHQtc2VhcmNoLWJhciBkaXYgLnN1ZmZpeHtiYWNrZ3JvdW5kLWNvbG9yOiNmZmY7Ym9yZGVyLXJhZGl1czozcHg7Ym9yZGVyLXN0eWxlOm5vbmU7Y29sb3I6cmdiYSg0MSw0MSw0MSwuNCk7Y3Vyc29yOnBvaW50ZXI7aGVpZ2h0OjM4cHg7b3V0bGluZTowO3Bvc2l0aW9uOnJlbGF0aXZlO3dpZHRoOjQwcHh9LmZ1bGx0ZXh0LXNlYXJjaC1iYXIgZGl2IC5wcmVmaXg6YWN0aXZlLC5mdWxsdGV4dC1zZWFyY2gtYmFyIGRpdiAuc3VmZml4OmFjdGl2ZXtjb2xvcjojNTE1MTUxfS5mdWxsdGV4dC1zZWFyY2gtYmFyIGRpdi5hY3RpdmV7Ym94LXNoYWRvdzowIDFweCAzcHggcmdiYSgwLDAsMCwuNSl9Lmt1aS1tZW51e2JveC1zaGFkb3c6MCAzcHggNXB4IC0xcHggcmdiYSgxMSwxMSwxMSwuMiksMCA2cHggMTBweCAwIHJnYmEoMTEsMTEsMTEsLjE0KSwwIDFweCAxOHB4IDAgcmdiYSgxMSwxMSwxMSwuMTIpO2JhY2tncm91bmQtY29sb3I6I2Y5ZjlmOTtib3JkZXItcmFkaXVzOjRweDtwb3NpdGlvbjphYnNvbHV0ZX0ua3VpLW1lbnUuc2ltcGxlLXNlYXJjaHttaW4taGVpZ2h0OjY4MHB4O3dpZHRoOjY4MHB4O3BhZGRpbmctdG9wOjYwcHg7ei1pbmRleDotMX0ua3VpLW1lbnUuc2ltcGxlLXNlYXJjaCAua3VpLXByZXZpb3VzLXNlYXJjaC1saXN0IC5tYXQtbGlzdC1pdGVte2N1cnNvcjpwb2ludGVyfS5rdWktbWVudS5zaW1wbGUtc2VhcmNoIC5rdWktcHJldmlvdXMtc2VhcmNoLWxpc3QgLm1hdC1saXN0LWl0ZW06aG92ZXJ7YmFja2dyb3VuZC1jb2xvcjojZjlmOWY5fS5rdWktbWVudS5zaW1wbGUtc2VhcmNoIC5rdWktcHJldmlvdXMtc2VhcmNoLWxpc3QgLm1hdC1saXN0LWl0ZW06aG92ZXIgbWF0LWljb257ZGlzcGxheTpibG9ja30ua3VpLW1lbnUuc2ltcGxlLXNlYXJjaCAua3VpLXByZXZpb3VzLXNlYXJjaC1saXN0IC5tYXQtbGlzdC1pdGVtIG1hdC1pY29ue2Rpc3BsYXk6bm9uZX0ua3VpLW1lbnUuc2ltcGxlLXNlYXJjaCAucmlnaHR7bWFyZ2luLXRvcDoxMnB4O21hcmdpbi1sZWZ0OjE2cHh9QG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDoxMDI0cHgpey5mdWxsdGV4dC1zZWFyY2gtYmFye3dpZHRoOjQ4MHB4fS5mdWxsdGV4dC1zZWFyY2gtYmFyIGRpdi5pbnB1dC1maWVsZCBpbnB1dHt3aWR0aDpjYWxjKDQ4MHB4IC0gODBweCl9Lmt1aS1tZW51LnNpbXBsZS1zZWFyY2h7d2lkdGg6NDgwcHh9fUBtZWRpYSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6NzY4cHgpey5mdWxsdGV4dC1zZWFyY2gtYmFye3dpZHRoOmNhbGMoNDgwcHggLSAxNjBweCl9LmZ1bGx0ZXh0LXNlYXJjaC1iYXIgZGl2LmlucHV0LWZpZWxkIGlucHV0e3dpZHRoOmNhbGMoNDgwcHggLSAxNjBweCAtIDgwcHgpfS5rdWktbWVudS5zaW1wbGUtc2VhcmNoe3dpZHRoOmNhbGMoNDgwcHggLSA4MHB4KX19YF0sXG4gICAgYW5pbWF0aW9uczogW1xuICAgICAgICB0cmlnZ2VyKCdmdWxsdGV4dFNlYXJjaE1lbnUnLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgIHN0YXRlKCdpbmFjdGl2ZScsIHN0eWxlKHsgZGlzcGxheTogJ25vbmUnIH0pKSxcbiAgICAgICAgICAgICAgICBzdGF0ZSgnYWN0aXZlJywgc3R5bGUoeyBkaXNwbGF5OiAnYmxvY2snIH0pKSxcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uKCdpbmFjdGl2ZSA9PiBhY3RpdmUnLCBhbmltYXRlKCcxMDBtcyBlYXNlLWluJykpLFxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb24oJ2FjdGl2ZSA9PiBpbmFjdGl2ZScsIGFuaW1hdGUoJzEwMG1zIGVhc2Utb3V0JykpXG4gICAgICAgICAgICBdXG4gICAgICAgIClcbiAgICBdXG59KVxuZXhwb3J0IGNsYXNzIEZ1bGx0ZXh0U2VhcmNoQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcblxuICAgIEBJbnB1dCgpIHJvdXRlOiBzdHJpbmcgPSAnL3NlYXJjaCc7XG5cbiAgICBzZWFyY2hRdWVyeTogc3RyaW5nO1xuXG4gICAgc2hvd1NpbXBsZVNlYXJjaDogYm9vbGVhbiA9IHRydWU7XG5cbiAgICBzZWFyY2hQYW5lbEZvY3VzOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBwcmV2U2VhcmNoOiBzdHJpbmdbXSA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3ByZXZTZWFyY2gnKSk7XG5cbiAgICBmb2N1c09uU2ltcGxlOiBzdHJpbmcgPSAnaW5hY3RpdmUnO1xuXG4gICAgc2VhcmNoTGFiZWw6IHN0cmluZyA9ICdTZWFyY2gnO1xuXG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9yb3V0ZTogQWN0aXZhdGVkUm91dGUsXG4gICAgICAgIHByaXZhdGUgX3JvdXRlcjogUm91dGVyKSB7XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKSB7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBAaWdub3JlXG4gICAgICogRG8gc2VhcmNoIG9uIEVudGVyIGNsaWNrLCByZXNldCBzZWFyY2ggb24gRXNjYXBlXG4gICAgICogQHBhcmFtIHNlYXJjaF9lbGVcbiAgICAgKiBAcGFyYW0gZXZlbnRcbiAgICAgKiBAcmV0dXJucyB2b2lkXG4gICAgICovXG4gICAgb25LZXkoc2VhcmNoX2VsZTogSFRNTEVsZW1lbnQsIGV2ZW50KTogdm9pZCB7XG4gICAgICAgIHRoaXMuZm9jdXNPblNpbXBsZSA9ICdhY3RpdmUnO1xuICAgICAgICB0aGlzLnByZXZTZWFyY2ggPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdwcmV2U2VhcmNoJykpO1xuICAgICAgICBpZiAodGhpcy5zZWFyY2hRdWVyeSAmJiAoZXZlbnQua2V5ID09PSAnRW50ZXInIHx8IGV2ZW50LmtleUNvZGUgPT09IDEzIHx8IGV2ZW50LndoaWNoID09PSAxMykpIHtcbiAgICAgICAgICAgIHRoaXMuZG9TZWFyY2goc2VhcmNoX2VsZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGV2ZW50LmtleSA9PT0gJ0VzY2FwZScgfHwgZXZlbnQua2V5Q29kZSA9PT0gMjcgfHwgZXZlbnQud2hpY2ggPT09IDI3KSB7XG4gICAgICAgICAgICB0aGlzLnJlc2V0U2VhcmNoKHNlYXJjaF9lbGUpO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBSZWFsaXNlIGEgc2ltcGxlIHNlYXJjaFxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHNlYXJjaF9lbGVcbiAgICAgKiBAcmV0dXJucyB2b2lkXG4gICAgICovXG4gICAgZG9TZWFyY2goc2VhcmNoX2VsZTogSFRNTEVsZW1lbnQpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuc2VhcmNoUXVlcnkgIT09IHVuZGVmaW5lZCAmJiB0aGlzLnNlYXJjaFF1ZXJ5ICE9PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLnRvZ2dsZU1lbnUoKTtcbiAgICAgICAgICAgIHRoaXMuX3JvdXRlci5uYXZpZ2F0ZShbdGhpcy5yb3V0ZSArICcvZnVsbHRleHQvJyArIHRoaXMuc2VhcmNoUXVlcnldKTtcblxuICAgICAgICAgICAgLy8gdGhpcy5fcm91dGVyLm5hdmlnYXRlKFsnL3NlYXJjaC9mdWxsdGV4dC8nICsgdGhpcy5zZWFyY2hRdWVyeV0sIHsgcmVsYXRpdmVUbzogdGhpcy5fcm91dGUgfSk7XG5cbiAgICAgICAgICAgIC8vIHB1c2ggdGhlIHNlYXJjaCBxdWVyeSBpbnRvIHRoZSBsb2NhbCBzdG9yYWdlIHByZXZTZWFyY2ggYXJyYXkgKHByZXZpb3VzIHNlYXJjaClcbiAgICAgICAgICAgIC8vIHRvIGhhdmUgYSBsaXN0IG9mIHJlY2VudCBzZWFyY2ggcmVxdWVzdHNcbiAgICAgICAgICAgIGxldCBleGlzdGluZ1ByZXZTZWFyY2g6IHN0cmluZ1tdID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncHJldlNlYXJjaCcpKTtcbiAgICAgICAgICAgIGlmIChleGlzdGluZ1ByZXZTZWFyY2ggPT09IG51bGwpIHsgZXhpc3RpbmdQcmV2U2VhcmNoID0gW107IH1cbiAgICAgICAgICAgIGxldCBpOiBudW1iZXIgPSAwO1xuICAgICAgICAgICAgZm9yIChjb25zdCBlbnRyeSBvZiBleGlzdGluZ1ByZXZTZWFyY2gpIHtcbiAgICAgICAgICAgICAgICAvLyByZW1vdmUgZW50cnksIGlmIGV4aXN0cyBhbHJlYWR5XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc2VhcmNoUXVlcnkgPT09IGVudHJ5KSB7IGV4aXN0aW5nUHJldlNlYXJjaC5zcGxpY2UoaSwgMSk7IH1cbiAgICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBleGlzdGluZ1ByZXZTZWFyY2gucHVzaCh0aGlzLnNlYXJjaFF1ZXJ5KTtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdwcmV2U2VhcmNoJywgSlNPTi5zdHJpbmdpZnkoZXhpc3RpbmdQcmV2U2VhcmNoKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZWFyY2hfZWxlLmZvY3VzKCk7XG4gICAgICAgICAgICB0aGlzLnByZXZTZWFyY2ggPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdwcmV2U2VhcmNoJykpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVzZXQgdGhlIHNlYXJjaFxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHNlYXJjaF9lbGVcbiAgICAgKiBAcmV0dXJucyB2b2lkXG4gICAgICovXG4gICAgcmVzZXRTZWFyY2goc2VhcmNoX2VsZTogSFRNTEVsZW1lbnQpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zZWFyY2hRdWVyeSA9IG51bGw7XG4gICAgICAgIHNlYXJjaF9lbGUuZm9jdXMoKTtcbiAgICAgICAgdGhpcy5mb2N1c09uU2ltcGxlID0gJ2luYWN0aXZlJztcbiAgICAgICAgdGhpcy5zZWFyY2hQYW5lbEZvY3VzID0gIXRoaXMuc2VhcmNoUGFuZWxGb2N1cztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTd2l0Y2ggYWNjb3JkaW5nIHRvIHRoZSBmb2N1cyBiZXR3ZWVuIHNpbXBsZSBvciBleHRlbmRlZCBzZWFyY2hcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIDIgY2FzZXM6IHNpbXBsZVNlYXJjaCBvciBleHRlbmRlZFNlYXJjaFxuICAgICAqIEByZXR1cm5zIHZvaWRcbiAgICAgKi9cbiAgICB0b2dnbGVNZW51KCk6IHZvaWQge1xuICAgICAgICB0aGlzLnByZXZTZWFyY2ggPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdwcmV2U2VhcmNoJykpO1xuICAgICAgICB0aGlzLmZvY3VzT25TaW1wbGUgPSAodGhpcy5mb2N1c09uU2ltcGxlID09PSAnYWN0aXZlJyA/ICdpbmFjdGl2ZScgOiAnYWN0aXZlJyk7XG4gICAgICAgIHRoaXMuc2hvd1NpbXBsZVNlYXJjaCA9IHRydWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0IHNpbXBsZSBmb2N1cyB0byBhY3RpdmVcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHZvaWRcbiAgICAgKi9cbiAgICBzZXRGb2N1cygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5wcmV2U2VhcmNoID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncHJldlNlYXJjaCcpKTtcbiAgICAgICAgdGhpcy5mb2N1c09uU2ltcGxlID0gJ2FjdGl2ZSc7XG4gICAgICAgIHRoaXMuc2VhcmNoUGFuZWxGb2N1cyA9ICF0aGlzLnNlYXJjaFBhbmVsRm9jdXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVhbGlzZSBhIHByZXZpb3VzIHNlYXJjaFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBxdWVyeVxuICAgICAqIEByZXR1cm5zIHZvaWRcbiAgICAgKi9cbiAgICBkb1ByZXZTZWFyY2gocXVlcnk6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICB0aGlzLnNlYXJjaFF1ZXJ5ID0gcXVlcnk7XG4gICAgICAgIHRoaXMuX3JvdXRlci5uYXZpZ2F0ZShbdGhpcy5yb3V0ZSArICcvZnVsbHRleHQvJyArIHF1ZXJ5XSwgeyByZWxhdGl2ZVRvOiB0aGlzLl9yb3V0ZSB9KTtcbiAgICAgICAgdGhpcy50b2dnbGVNZW51KCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVzZXQgcHJldmlvdXMgc2VhcmNoZXMgLSB0aGUgd2hvbGUgcHJldmlvdXMgc2VhcmNoIG9yIHNwZWNpZmljIGl0ZW0gYnkgbmFtZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIHRlcm0gb2YgdGhlIHNlYXJjaFxuICAgICAqIEByZXR1cm5zIHZvaWRcbiAgICAgKi9cbiAgICByZXNldFByZXZTZWFyY2gobmFtZTogc3RyaW5nID0gbnVsbCk6IHZvaWQge1xuICAgICAgICBpZiAobmFtZSkge1xuICAgICAgICAgICAgLy8gZGVsZXRlIG9ubHkgdGhpcyBpdGVtIHdpdGggdGhlIG5hbWUgLi4uXG4gICAgICAgICAgICBjb25zdCBpOiBudW1iZXIgPSB0aGlzLnByZXZTZWFyY2guaW5kZXhPZihuYW1lKTtcbiAgICAgICAgICAgIHRoaXMucHJldlNlYXJjaC5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncHJldlNlYXJjaCcsIEpTT04uc3RyaW5naWZ5KHRoaXMucHJldlNlYXJjaCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gZGVsZXRlIHRoZSB3aG9sZSBcInByZXZpb3VzIHNlYXJjaFwiIGFycmF5XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgncHJldlNlYXJjaCcpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucHJldlNlYXJjaCA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3ByZXZTZWFyY2gnKSk7XG5cbiAgICB9XG59XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgSW5qZWN0LCBJbnB1dCwgT25Jbml0LCBPdXRwdXQsIFF1ZXJ5TGlzdCwgVmlld0NoaWxkLCBWaWV3Q2hpbGRyZW4gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFjdGl2YXRlZFJvdXRlLCBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgRm9ybUJ1aWxkZXIsIEZvcm1Hcm91cCB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7XG4gICAgR3JhdnNlYXJjaEdlbmVyYXRpb25TZXJ2aWNlLFxuICAgIE9udG9sb2d5Q2FjaGVTZXJ2aWNlLFxuICAgIE9udG9sb2d5SW5mb3JtYXRpb24sXG4gICAgT250b2xvZ3lNZXRhZGF0YSxcbiAgICBQcm9wZXJ0aWVzLFxuICAgIFByb3BlcnR5V2l0aFZhbHVlLFxuICAgIFJlYWRSZXNvdXJjZXNTZXF1ZW5jZSxcbiAgICBSZXNvdXJjZUNsYXNzXG59IGZyb20gJ0Brbm9yYS9jb3JlJztcbmltcG9ydCB7IFNlbGVjdFByb3BlcnR5Q29tcG9uZW50IH0gZnJvbSAnLi9zZWxlY3QtcHJvcGVydHkvc2VsZWN0LXByb3BlcnR5LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBTZWxlY3RSZXNvdXJjZUNsYXNzQ29tcG9uZW50IH0gZnJvbSAnLi9zZWxlY3QtcmVzb3VyY2UtY2xhc3Mvc2VsZWN0LXJlc291cmNlLWNsYXNzLmNvbXBvbmVudCc7XG5cblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdrdWktZXh0ZW5kZWQtc2VhcmNoJyxcbiAgICB0ZW1wbGF0ZTogYDxmb3JtIFtmb3JtR3JvdXBdPVwiZm9ybVwiIChuZ1N1Ym1pdCk9XCJzdWJtaXQoKVwiPlxuXG4gIDxkaXY+XG4gICAgPGt1aS1zZWxlY3Qtb250b2xvZ3kgKm5nSWY9XCJvbnRvbG9naWVzLmxlbmd0aCA+IDBcIiBbZm9ybUdyb3VwXT1cImZvcm1cIiBbb250b2xvZ2llc109XCJvbnRvbG9naWVzXCIgKG9udG9sb2d5U2VsZWN0ZWQpPVwiZ2V0UmVzb3VyY2VDbGFzc2VzQW5kUHJvcGVydGllc0Zvck9udG9sb2d5KCRldmVudClcIj48L2t1aS1zZWxlY3Qtb250b2xvZ3k+XG4gIDwvZGl2PlxuXG4gIDxkaXYgY2xhc3M9XCJzZWxlY3QtcmVzb3VyY2UtY2xhc3NcIiAqbmdJZj1cInJlc291cmNlQ2xhc3Nlcz8ubGVuZ3RoID4gMFwiPlxuICAgIDxrdWktc2VsZWN0LXJlc291cmNlLWNsYXNzICNyZXNvdXJjZUNsYXNzIFtmb3JtR3JvdXBdPVwiZm9ybVwiIFtyZXNvdXJjZUNsYXNzZXNdPVwicmVzb3VyY2VDbGFzc2VzXCIgKHJlc291cmNlQ2xhc3NTZWxlY3RlZEV2ZW50KT1cImdldFByb3BlcnRpZXNGb3JSZXNvdXJjZUNsYXNzKCRldmVudClcIj48L2t1aS1zZWxlY3QtcmVzb3VyY2UtY2xhc3M+XG4gIDwvZGl2PlxuXG4gIDxkaXYgY2xhc3M9XCJzZWxlY3QtcHJvcGVydHlcIiAqbmdJZj1cInByb3BlcnRpZXMgIT09IHVuZGVmaW5lZFwiPlxuICAgIDxkaXYgKm5nRm9yPVwibGV0IHByb3Agb2YgYWN0aXZlUHJvcGVydGllczsgbGV0IGkgPSBpbmRleFwiPlxuXG4gICAgICA8a3VpLXNlbGVjdC1wcm9wZXJ0eSAjcHJvcGVydHkgW2FjdGl2ZVJlc291cmNlQ2xhc3NdPVwiYWN0aXZlUmVzb3VyY2VDbGFzc1wiIFtmb3JtR3JvdXBdPVwiZm9ybVwiIFtpbmRleF09XCJpXCIgW3Byb3BlcnRpZXNdPVwicHJvcGVydGllc1wiPjwva3VpLXNlbGVjdC1wcm9wZXJ0eT5cblxuICAgIDwvZGl2PlxuICA8L2Rpdj5cblxuXG4gIDxkaXY+XG4gICAgPGJ1dHRvbiBtYXQtbWluaS1mYWIgY2xhc3M9XCJwcm9wZXJ0eS1idXR0b25zIGFkZC1wcm9wZXJ0eS1idXR0b25cIiBjb2xvcj1cInByaW1hcnlcIiB0eXBlPVwiYnV0dG9uXCIgKGNsaWNrKT1cImFkZFByb3BlcnR5KClcIiBbZGlzYWJsZWRdPVwiYWN0aXZlT250b2xvZ3kgPT09IHVuZGVmaW5lZCB8fCBhY3RpdmVQcm9wZXJ0aWVzLmxlbmd0aCA+PSA0XCI+XG4gICAgICA8bWF0LWljb24gYXJpYS1sYWJlbD1cImFkZCBhIHByb3BlcnR5XCI+YWRkPC9tYXQtaWNvbj5cbiAgICA8L2J1dHRvbj5cblxuICAgIDxidXR0b24gbWF0LW1pbmktZmFiIGNsYXNzPVwicHJvcGVydHktYnV0dG9ucyByZW1vdmUtcHJvcGVydHktYnV0dG9uXCIgY29sb3I9XCJwcmltYXJ5XCIgdHlwZT1cImJ1dHRvblwiIChjbGljayk9XCJyZW1vdmVQcm9wZXJ0eSgpXCIgW2Rpc2FibGVkXT1cImFjdGl2ZVByb3BlcnRpZXMubGVuZ3RoID09IDBcIj5cbiAgICAgIDxtYXQtaWNvbiBhcmlhLWxhYmVsPVwicmVtb3ZlIHByb3BlcnR5XCI+cmVtb3ZlPC9tYXQtaWNvbj5cbiAgICA8L2J1dHRvbj5cbiAgPC9kaXY+XG5cbiAgPCEtLSAgPGRpdj5cbiAgICA8YnV0dG9uIG1hdC1pY29uLWJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgKGNsaWNrKT1cInJlc2V0Rm9ybSgpXCIgW2Rpc2FibGVkXT1cInRoaXMuYWN0aXZlT250b2xvZ3kgPT09IHVuZGVmaW5lZFwiPlxuICAgICAgPG1hdC1pY29uIGFyaWEtbGFiZWw9XCJyZXNldCBxdWVyeSBmb3JtXCI+Y2xlYXI8L21hdC1pY29uPlxuICAgIDwvYnV0dG9uPlxuXG4gICAgPGJ1dHRvbiBtYXQtaWNvbi1idXR0b24gdHlwZT1cInN1Ym1pdFwiIFtkaXNhYmxlZF09XCIhZm9ybVZhbGlkXCI+XG4gICAgICA8bWF0LWljb24gYXJpYS1sYWJlbD1cInN1Ym1pdCBxdWVyeVwiPnNlbmQ8L21hdC1pY29uPlxuICAgIDwvYnV0dG9uPlxuICA8L2Rpdj4gLS0+XG5cbiAgPGJ1dHRvbiBjbGFzcz1cImV4dGVuZGVkLWJ1dHRvbnMgZXh0ZW5kZWQtc2VhcmNoLWJ1dHRvblwiIG1hdC1zdHJva2VkLWJ1dHRvbiBjb2xvcj1cInByaW1hcnlcIiB0eXBlPVwic3VibWl0XCIgW2Rpc2FibGVkXT1cIiFmb3JtVmFsaWRcIj5cbiAgICBTZWFyY2hcbiAgPC9idXR0b24+XG4gIDxidXR0b24gY2xhc3M9XCJleHRlbmRlZC1idXR0b25zIHJlc2V0XCIgbWF0LXN0cm9rZWQtYnV0dG9uIHR5cGU9XCJidXR0b25cIiAoY2xpY2spPVwicmVzZXRGb3JtKClcIiBbZGlzYWJsZWRdPVwidGhpcy5hY3RpdmVPbnRvbG9neSA9PT0gdW5kZWZpbmVkXCI+XG4gICAgUmVzZXRcbiAgPC9idXR0b24+XG5cblxuPC9mb3JtPlxuYCxcbiAgICBzdHlsZXM6IFtgLmFkZC1wcm9wZXJ0eS1idXR0b257bWFyZ2luLXJpZ2h0OjVweH0uZXh0ZW5kZWQtYnV0dG9uc3ttYXJnaW4tdG9wOjI1cHh9LmV4dGVuZGVkLXNlYXJjaC1idXR0b257bWFyZ2luLXJpZ2h0OjVweH0ucHJvcGVydHktYnV0dG9uc3ttYXJnaW4tdG9wOjI1cHh9LnNlbGVjdC1wcm9wZXJ0eXttYXJnaW4tbGVmdDoyMnB4fS5zZWxlY3QtcmVzb3VyY2UtY2xhc3N7bWFyZ2luLWxlZnQ6MTJweH1gXVxufSlcbmV4cG9ydCBjbGFzcyBFeHRlbmRlZFNlYXJjaENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcm91dGUgLSBSb3V0ZSBhZnRlciBzZWFyY2hcbiAgICAgKi9cbiAgICBASW5wdXQoKSByb3V0ZTtcblxuICAgIC8vIHRyaWdnZXIgdG9nZ2xlIGZvciBleHRlbmRlZCBzZWFyY2ggZm9ybVxuICAgIEBPdXRwdXQoKSB0b2dnbGVFeHRlbmRlZFNlYXJjaEZvcm0gPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KCk7XG5cbiAgICAvLyBhbGwgYXZhaWxhYmxlIG9udG9sb2dpZXNcbiAgICBvbnRvbG9naWVzOiBBcnJheTxPbnRvbG9neU1ldGFkYXRhPiA9IFtdO1xuXG4gICAgLy8gb250b2xvZ3kgY2hvc2VuIGJ5IHRoZSB1c2VyXG4gICAgYWN0aXZlT250b2xvZ3k6IHN0cmluZztcblxuICAgIC8vIHByb3BlcnRpZXMgc3BlY2lmaWVkIGJ5IHRoZSB1c2VyXG4gICAgYWN0aXZlUHJvcGVydGllczogYm9vbGVhbltdID0gW107XG5cbiAgICAvLyByZXNvdXJjZSBjbGFzc2VzIGZvciB0aGUgc2VsZWN0ZWQgb250b2xvZ3lcbiAgICByZXNvdXJjZUNsYXNzZXM6IEFycmF5PFJlc291cmNlQ2xhc3M+ID0gW107XG5cbiAgICAvLyBkZWZpbml0aW9uIG9mIHRoZSBzZWxlY3RlZCByZXNvdXJjZSBjbGFzcywgaWYgc2V0LlxuICAgIGFjdGl2ZVJlc291cmNlQ2xhc3M6IFJlc291cmNlQ2xhc3M7XG5cbiAgICAvLyBwcm9wZXJ0aWVzIGZvciB0aGUgc2VsZWN0ZWQgb250b2xvZ3kgb3Igc2VsZWN0ZWQgcmVzb3VyY2UgY2xhc3NcbiAgICBwcm9wZXJ0aWVzOiBQcm9wZXJ0aWVzO1xuXG4gICAgcmVzdWx0OiBSZWFkUmVzb3VyY2VzU2VxdWVuY2UgPSBuZXcgUmVhZFJlc291cmNlc1NlcXVlbmNlKFtdLCAwKTtcblxuICAgIC8vIHJlZmVyZW5jZSB0byB0aGUgY29tcG9uZW50IHRoYXQgY29udHJvbHMgdGhlIHJlc291cmNlIGNsYXNzIHNlbGVjdGlvblxuICAgIEBWaWV3Q2hpbGQoJ3Jlc291cmNlQ2xhc3MnKSByZXNvdXJjZUNsYXNzQ29tcG9uZW50OiBTZWxlY3RSZXNvdXJjZUNsYXNzQ29tcG9uZW50O1xuXG4gICAgLy8gcmVmZXJlbmNlIHRvIHRoZSBjb21wb25lbnQgY29udHJvbGxpbmcgdGhlIHByb3BlcnR5IHNlbGVjdGlvblxuICAgIEBWaWV3Q2hpbGRyZW4oJ3Byb3BlcnR5JykgcHJvcGVydHlDb21wb25lbnRzOiBRdWVyeUxpc3Q8U2VsZWN0UHJvcGVydHlDb21wb25lbnQ+O1xuXG4gICAgLy8gRm9ybUdyb3VwICh1c2VkIGFzIHBhcmVudCBmb3IgY2hpbGQgY29tcG9uZW50cylcbiAgICBmb3JtOiBGb3JtR3JvdXA7XG5cbiAgICAvLyBmb3JtIHZhbGlkYXRpb24gc3RhdHVzXG4gICAgZm9ybVZhbGlkID0gZmFsc2U7XG5cbiAgICBjb25zdHJ1Y3RvcihASW5qZWN0KEZvcm1CdWlsZGVyKSBwcml2YXRlIGZiOiBGb3JtQnVpbGRlcixcbiAgICAgICAgcHJpdmF0ZSBfcm91dGU6IEFjdGl2YXRlZFJvdXRlLFxuICAgICAgICBwcml2YXRlIF9yb3V0ZXI6IFJvdXRlcixcbiAgICAgICAgcHJpdmF0ZSBfY2FjaGVTZXJ2aWNlOiBPbnRvbG9neUNhY2hlU2VydmljZSxcbiAgICAgICAgcHJpdmF0ZSBfZ3JhdlNlYXJjaFNlcnZpY2U6IEdyYXZzZWFyY2hHZW5lcmF0aW9uU2VydmljZSkge1xuICAgIH1cblxuICAgIG5nT25Jbml0KCkge1xuXG4gICAgICAgIC8vIHBhcmVudCBmb3JtIGlzIGVtcHR5LCBpdCBnZXRzIHBhc3NlZCB0byB0aGUgY2hpbGQgY29tcG9uZW50c1xuICAgICAgICB0aGlzLmZvcm0gPSB0aGlzLmZiLmdyb3VwKHt9KTtcblxuICAgICAgICAvLyBpZiBmb3JtIHN0YXR1cyBjaGFuZ2VzLCByZS1ydW4gdmFsaWRhdGlvblxuICAgICAgICB0aGlzLmZvcm0uc3RhdHVzQ2hhbmdlcy5zdWJzY3JpYmUoKGRhdGEpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZm9ybVZhbGlkID0gdGhpcy52YWxpZGF0ZUZvcm0oKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuZm9ybSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGluaXRpYWxpemUgb250b2xvZ2llcyB0byBiZSB1c2VkIGZvciB0aGUgb250b2xvZ2llcyBzZWxlY3Rpb24gaW4gdGhlIHNlYXJjaCBmb3JtXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZU9udG9sb2dpZXMoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBZGQgYSBwcm9wZXJ0eSB0byB0aGUgc2VhcmNoIGZvcm0uXG4gICAgICogQHJldHVybnMgdm9pZFxuICAgICAqL1xuICAgIGFkZFByb3BlcnR5KCk6IHZvaWQge1xuICAgICAgICB0aGlzLmFjdGl2ZVByb3BlcnRpZXMucHVzaCh0cnVlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgdGhlIGxhc3QgcHJvcGVydHkgZnJvbSB0aGUgc2VhcmNoIGZvcm0uXG4gICAgICogQHJldHVybnMgdm9pZFxuICAgICAqL1xuICAgIHJlbW92ZVByb3BlcnR5KCk6IHZvaWQge1xuICAgICAgICB0aGlzLmFjdGl2ZVByb3BlcnRpZXMuc3BsaWNlKC0xLCAxKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIGFsbCBhdmFpbGFibGUgb250b2xvZ2llcyBmb3IgdGhlIHNlYXJjaCBmb3JtLlxuICAgICAqIEByZXR1cm5zIHZvaWRcbiAgICAgKi9cbiAgICBpbml0aWFsaXplT250b2xvZ2llcygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fY2FjaGVTZXJ2aWNlLmdldE9udG9sb2dpZXNNZXRhZGF0YSgpLnN1YnNjcmliZShcbiAgICAgICAgICAgIChvbnRvbG9naWVzOiBBcnJheTxPbnRvbG9neU1ldGFkYXRhPikgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMub250b2xvZ2llcyA9IG9udG9sb2dpZXM7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBPbmNlIGFuIG9udG9sb2d5IGhhcyBiZWVuIHNlbGVjdGVkLCBnZXRzIGl0cyBjbGFzc2VzIGFuZCBwcm9wZXJ0aWVzLlxuICAgICAqIFRoZSBjbGFzc2VzIGFuZCBwcm9wZXJ0aWVzIHdpbGwgYmUgbWFkZSBhdmFpbGFibGUgdG8gdGhlIHVzZXIgZm9yIHNlbGVjdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBvbnRvbG9neUlyaSBJcmkgb2YgdGhlIG9udG9sb2d5IGNob3NlbiBieSB0aGUgdXNlci5cbiAgICAgKiBAcmV0dXJucyB2b2lkXG4gICAgICovXG4gICAgZ2V0UmVzb3VyY2VDbGFzc2VzQW5kUHJvcGVydGllc0Zvck9udG9sb2d5KG9udG9sb2d5SXJpOiBzdHJpbmcpOiB2b2lkIHtcblxuICAgICAgICAvLyByZXNldCBhY3RpdmUgcmVzb3VyY2UgY2xhc3MgZGVmaW5pdGlvblxuICAgICAgICB0aGlzLmFjdGl2ZVJlc291cmNlQ2xhc3MgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgLy8gcmVzZXQgc3BlY2lmaWVkIHByb3BlcnRpZXNcbiAgICAgICAgdGhpcy5hY3RpdmVQcm9wZXJ0aWVzID0gW107XG5cbiAgICAgICAgdGhpcy5hY3RpdmVPbnRvbG9neSA9IG9udG9sb2d5SXJpO1xuXG4gICAgICAgIHRoaXMuX2NhY2hlU2VydmljZS5nZXRFbnRpdHlEZWZpbml0aW9uc0Zvck9udG9sb2dpZXMoW29udG9sb2d5SXJpXSkuc3Vic2NyaWJlKFxuICAgICAgICAgICAgKG9udG9JbmZvOiBPbnRvbG9neUluZm9ybWF0aW9uKSA9PiB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnJlc291cmNlQ2xhc3NlcyA9IG9udG9JbmZvLmdldFJlc291cmNlQ2xhc3Nlc0FzQXJyYXkodHJ1ZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9wZXJ0aWVzID0gb250b0luZm8uZ2V0UHJvcGVydGllcygpO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBPbmNlIGEgcmVzb3VyY2UgY2xhc3MgaGFzIGJlZW4gc2VsZWN0ZWQsIGdldHMgaXRzIHByb3BlcnRpZXMuXG4gICAgICogVGhlIHByb3BlcnRpZXMgd2lsbCBiZSBtYWRlIGF2YWlsYWJsZSB0byB0aGUgdXNlciBmb3Igc2VsZWN0aW9uLlxuICAgICAqXG4gICAgICogQHBhcmFtIHJlc291cmNlQ2xhc3NJcmlcbiAgICAgKiBAcmV0dXJucyB2b2lkXG4gICAgICovXG4gICAgZ2V0UHJvcGVydGllc0ZvclJlc291cmNlQ2xhc3MocmVzb3VyY2VDbGFzc0lyaTogc3RyaW5nKTogdm9pZCB7XG5cbiAgICAgICAgLy8gcmVzZXQgc3BlY2lmaWVkIHByb3BlcnRpZXNcbiAgICAgICAgdGhpcy5hY3RpdmVQcm9wZXJ0aWVzID0gW107XG5cbiAgICAgICAgLy8gaWYgdGhlIGNsaWVudCB1bmRvZXMgdGhlIHNlbGVjdGlvbiBvZiBhIHJlc291cmNlIGNsYXNzLCB1c2UgdGhlIGFjdGl2ZSBvbnRvbG9neSBhcyBhIGZhbGxiYWNrXG4gICAgICAgIGlmIChyZXNvdXJjZUNsYXNzSXJpID09PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmdldFJlc291cmNlQ2xhc3Nlc0FuZFByb3BlcnRpZXNGb3JPbnRvbG9neSh0aGlzLmFjdGl2ZU9udG9sb2d5KTtcbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgdGhpcy5fY2FjaGVTZXJ2aWNlLmdldFJlc291cmNlQ2xhc3NEZWZpbml0aW9ucyhbcmVzb3VyY2VDbGFzc0lyaV0pLnN1YnNjcmliZShcbiAgICAgICAgICAgICAgICAob250b0luZm86IE9udG9sb2d5SW5mb3JtYXRpb24pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9wZXJ0aWVzID0gb250b0luZm8uZ2V0UHJvcGVydGllcygpO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWN0aXZlUmVzb3VyY2VDbGFzcyA9IG9udG9JbmZvLmdldFJlc291cmNlQ2xhc3NlcygpW3Jlc291cmNlQ2xhc3NJcmldO1xuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcblxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBWYWxpZGF0ZXMgZm9ybSBhbmQgcmV0dXJucyBpdHMgc3RhdHVzIChib29sZWFuKS5cbiAgICAgKi9cbiAgICBwcml2YXRlIHZhbGlkYXRlRm9ybSgpIHtcblxuICAgICAgICAvLyBjaGVjayB0aGF0IGVpdGhlciBhIHJlc291cmNlIGNsYXNzIGlzIHNlbGVjdGVkIG9yIGF0IGxlYXN0IG9uZSBwcm9wZXJ0eSBpcyBzcGVjaWZpZWRcbiAgICAgICAgcmV0dXJuIHRoaXMuZm9ybS52YWxpZCAmJlxuICAgICAgICAgICAgKHRoaXMucHJvcGVydHlDb21wb25lbnRzLmxlbmd0aCA+IDAgfHwgKHRoaXMucmVzb3VyY2VDbGFzc0NvbXBvbmVudCAhPT0gdW5kZWZpbmVkICYmIHRoaXMucmVzb3VyY2VDbGFzc0NvbXBvbmVudC5nZXRSZXNvdXJjZUNsYXNzU2VsZWN0ZWQoKSAhPT0gZmFsc2UpKTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlc2V0cyB0aGUgZm9ybSAoc2VsZWN0ZWQgcmVzb3VyY2UgY2xhc3MgYW5kIHNwZWNpZmllZCBwcm9wZXJ0aWVzKSBwcmVzZXJ2aW5nIHRoZSBhY3RpdmUgb250b2xvZ3kuXG4gICAgICovXG4gICAgcmVzZXRGb3JtKCkge1xuICAgICAgICBpZiAodGhpcy5hY3RpdmVPbnRvbG9neSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLmdldFJlc291cmNlQ2xhc3Nlc0FuZFByb3BlcnRpZXNGb3JPbnRvbG9neSh0aGlzLmFjdGl2ZU9udG9sb2d5KTtcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIEdyYXZTZWFyY2ggcXVlcnkgd2l0aCB0aGUgZ2l2ZW4gZm9ybSB2YWx1ZXMgYW5kIGNhbGxzIHRoZSBleHRlbmRlZCBzZWFyY2ggcm91dGUuXG4gICAgICovXG4gICAgc3VibWl0KCkge1xuXG4gICAgICAgIGlmICghdGhpcy5mb3JtVmFsaWQpIHJldHVybjsgLy8gY2hlY2sgdGhhdCBmcm9tIGlzIHZhbGlkXG5cbiAgICAgICAgY29uc3QgcmVzQ2xhc3NPcHRpb24gPSB0aGlzLnJlc291cmNlQ2xhc3NDb21wb25lbnQuZ2V0UmVzb3VyY2VDbGFzc1NlbGVjdGVkKCk7XG5cbiAgICAgICAgbGV0IHJlc0NsYXNzO1xuXG4gICAgICAgIGlmIChyZXNDbGFzc09wdGlvbiAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHJlc0NsYXNzID0gcmVzQ2xhc3NPcHRpb247XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwcm9wZXJ0aWVzOiBQcm9wZXJ0eVdpdGhWYWx1ZVtdID0gdGhpcy5wcm9wZXJ0eUNvbXBvbmVudHMubWFwKFxuICAgICAgICAgICAgKHByb3BDb21wKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb3BDb21wLmdldFByb3BlcnR5U2VsZWN0ZWRXaXRoVmFsdWUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcblxuICAgICAgICBjb25zdCBncmF2c2VhcmNoID0gdGhpcy5fZ3JhdlNlYXJjaFNlcnZpY2UuY3JlYXRlR3JhdnNlYXJjaFF1ZXJ5KHByb3BlcnRpZXMsIHJlc0NsYXNzLCAwKTtcblxuICAgICAgICB0aGlzLl9yb3V0ZXIubmF2aWdhdGUoW3RoaXMucm91dGUgKyAnL2V4dGVuZGVkLycsIGdyYXZzZWFyY2hdLCB7IHJlbGF0aXZlVG86IHRoaXMuX3JvdXRlIH0pO1xuXG4gICAgICAgIC8vIHRvZ2dsZSBleHRlbmRlZCBzZWFyY2ggZm9ybVxuICAgICAgICB0aGlzLnRvZ2dsZUV4dGVuZGVkU2VhcmNoRm9ybS5lbWl0KHRydWUpO1xuXG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgSW5qZWN0LCBJbnB1dCwgT25Jbml0LCBPdXRwdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE9udG9sb2d5TWV0YWRhdGEgfSBmcm9tICdAa25vcmEvY29yZSc7XG5pbXBvcnQgeyBGb3JtQnVpbGRlciwgRm9ybUdyb3VwLCBWYWxpZGF0b3JzIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdrdWktc2VsZWN0LW9udG9sb2d5JyxcbiAgdGVtcGxhdGU6IGA8bWF0LWZvcm0tZmllbGQgKm5nSWY9XCJvbnRvbG9naWVzLmxlbmd0aCA+IDBcIj5cbiAgPG1hdC1zZWxlY3QgcGxhY2Vob2xkZXI9XCJPbnRvbG9neVwiIFtmb3JtQ29udHJvbF09XCJmb3JtLmNvbnRyb2xzWydvbnRvbG9neSddXCI+XG4gICAgICA8bWF0LW9wdGlvbiAqbmdGb3I9XCJsZXQgb250byBvZiBvbnRvbG9naWVzXCIgW3ZhbHVlXT1cIm9udG8uaWRcIj57eyBvbnRvLmxhYmVsIH19PC9tYXQtb3B0aW9uPlxuICA8L21hdC1zZWxlY3Q+XG48L21hdC1mb3JtLWZpZWxkPlxuYCxcbiAgc3R5bGVzOiBbYGBdXG59KVxuZXhwb3J0IGNsYXNzIFNlbGVjdE9udG9sb2d5Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcblxuICBASW5wdXQoKSBmb3JtR3JvdXA6IEZvcm1Hcm91cDtcblxuICBASW5wdXQoKSBvbnRvbG9naWVzOiBBcnJheTxPbnRvbG9neU1ldGFkYXRhPjtcblxuICBAT3V0cHV0KCkgb250b2xvZ3lTZWxlY3RlZCA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nPigpO1xuXG4gIGZvcm06IEZvcm1Hcm91cDtcblxuICBjb25zdHJ1Y3RvcihASW5qZWN0KEZvcm1CdWlsZGVyKSBwcml2YXRlIGZiOiBGb3JtQnVpbGRlcikgeyB9XG5cbiAgbmdPbkluaXQoKSB7XG5cbiAgICAvLyBidWlsZCBhIGZvcm0gZm9yIHRoZSBuYW1lZCBncmFwaCBzZWxlY3Rpb25cbiAgICB0aGlzLmZvcm0gPSB0aGlzLmZiLmdyb3VwKHtcbiAgICAgIG9udG9sb2d5OiBbbnVsbCwgVmFsaWRhdG9ycy5yZXF1aXJlZF1cbiAgICB9KTtcblxuICAgIC8vIGVtaXQgSXJpIG9mIHRoZSBvbnRvbG9neSB3aGVuIGJlaW5nIHNlbGVjdGVkXG4gICAgdGhpcy5mb3JtLnZhbHVlQ2hhbmdlcy5zdWJzY3JpYmUoKGRhdGEpID0+IHtcbiAgICAgIHRoaXMub250b2xvZ3lTZWxlY3RlZC5lbWl0KGRhdGEub250b2xvZ3kpO1xuICAgIH0pO1xuXG4gICAgLy8gYWRkIGZvcm0gdG8gdGhlIHBhcmVudCBmb3JtIGdyb3VwXG4gICAgdGhpcy5mb3JtR3JvdXAuYWRkQ29udHJvbCgnb250b2xvZ3knLCB0aGlzLmZvcm0pO1xuXG4gIH1cblxufVxuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBJbmplY3QsIElucHV0LCBPbkRlc3Ryb3ksIE9uSW5pdCwgVmlld0NoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICAgIENhcmRpbmFsaXR5LFxuICAgIENhcmRpbmFsaXR5T2NjdXJyZW5jZSxcbiAgICBDb21wYXJpc29uT3BlcmF0b3JBbmRWYWx1ZSxcbiAgICBQcm9wZXJ0aWVzLFxuICAgIFByb3BlcnR5LFxuICAgIFByb3BlcnR5V2l0aFZhbHVlLFxuICAgIFJlc291cmNlQ2xhc3Ncbn0gZnJvbSAnQGtub3JhL2NvcmUnO1xuaW1wb3J0IHsgRm9ybUJ1aWxkZXIsIEZvcm1Hcm91cCwgVmFsaWRhdG9ycyB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IFNwZWNpZnlQcm9wZXJ0eVZhbHVlQ29tcG9uZW50IH0gZnJvbSAnLi9zcGVjaWZ5LXByb3BlcnR5LXZhbHVlL3NwZWNpZnktcHJvcGVydHktdmFsdWUuY29tcG9uZW50JztcbmltcG9ydCB7IE9udG9sb2d5SW5mb3JtYXRpb24gfSBmcm9tICdAa25vcmEvY29yZSc7XG5cblxuLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNDU2NjEwMTAvZHluYW1pYy1uZXN0ZWQtcmVhY3RpdmUtZm9ybS1leHByZXNzaW9uY2hhbmdlZGFmdGVyaXRoYXNiZWVuY2hlY2tlZGVycm9yXG5jb25zdCByZXNvbHZlZFByb21pc2UgPSBQcm9taXNlLnJlc29sdmUobnVsbCk7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAna3VpLXNlbGVjdC1wcm9wZXJ0eScsXG4gICAgdGVtcGxhdGU6IGA8bWF0LWZvcm0tZmllbGQgY2xhc3M9XCJzZWFyY2gtcHJvcGVydHktZmllbGRcIiAqbmdJZj1cInByb3BlcnRpZXNBc0FycmF5Py5sZW5ndGggPiAwXCI+XG4gIDxtYXQtc2VsZWN0IHBsYWNlaG9sZGVyPVwiUHJvcGVydGllc1wiIFtmb3JtQ29udHJvbF09XCJmb3JtLmNvbnRyb2xzWydwcm9wZXJ0eSddXCI+XG4gICAgPG1hdC1vcHRpb24gKm5nRm9yPVwibGV0IHByb3Agb2YgcHJvcGVydGllc0FzQXJyYXlcIiBbdmFsdWVdPVwicHJvcC5pZFwiPnt7IHByb3AubGFiZWwgfX08L21hdC1vcHRpb24+XG4gIDwvbWF0LXNlbGVjdD5cbjwvbWF0LWZvcm0tZmllbGQ+XG5cbjxrdWktc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZSAjc3BlY2lmeVByb3BlcnR5VmFsdWUgW2Zvcm1Hcm91cF09XCJmb3JtXCIgKm5nSWY9XCJwcm9wZXJ0eVNlbGVjdGVkICE9PSB1bmRlZmluZWRcIiBbcHJvcGVydHldPVwicHJvcGVydHlTZWxlY3RlZFwiPjwva3VpLXNwZWNpZnktcHJvcGVydHktdmFsdWU+XG5cbjxtYXQtY2hlY2tib3ggbWF0VG9vbHRpcD1cIlNvcnQgY3JpdGVyaW9uXCIgKm5nSWY9XCJwcm9wZXJ0eVNlbGVjdGVkICE9PSB1bmRlZmluZWQgJiYgc29ydENyaXRlcmlvbigpXCIgW2Zvcm1Db250cm9sXT1cImZvcm0uY29udHJvbHNbJ2lzU29ydENyaXRlcmlvbiddXCI+PC9tYXQtY2hlY2tib3g+YCxcbiAgICBzdHlsZXM6IFtgLnNlYXJjaC1wcm9wZXJ0eS1maWVsZHttYXJnaW4tcmlnaHQ6OHB4fWBdXG59KVxuZXhwb3J0IGNsYXNzIFNlbGVjdFByb3BlcnR5Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuXG4gICAgLy8gcGFyZW50IEZvcm1Hcm91cFxuICAgIEBJbnB1dCgpIGZvcm1Hcm91cDogRm9ybUdyb3VwO1xuXG4gICAgLy8gaW5kZXggb2YgdGhlIGdpdmVuIHByb3BlcnR5ICh1bmlxdWUpXG4gICAgQElucHV0KCkgaW5kZXg6IG51bWJlcjtcblxuICAgIC8vIHNldHRlciBtZXRob2QgZm9yIHByb3BlcnRpZXMgd2hlbiBiZWluZyB1cGRhdGVkIGJ5IHBhcmVudCBjb21wb25lbnRcbiAgICBASW5wdXQoKVxuICAgIHNldCBwcm9wZXJ0aWVzKHZhbHVlOiBQcm9wZXJ0aWVzKSB7XG4gICAgICAgIHRoaXMucHJvcGVydHlTZWxlY3RlZCA9IHVuZGVmaW5lZDsgLy8gcmVzZXQgc2VsZWN0ZWQgcHJvcGVydHkgKG92ZXJ3cml0aW5nIGFueSBwcmV2aW91cyBzZWxlY3Rpb24pXG4gICAgICAgIHRoaXMuX3Byb3BlcnRpZXMgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy51cGRhdGVQcm9wZXJ0aWVzQXJyYXkoKTtcbiAgICB9XG5cbiAgICBnZXQgcHJvcGVydGllcygpIHtcbiAgICAgICByZXR1cm4gdGhpcy5fcHJvcGVydGllcztcbiAgICB9XG5cbiAgICBfYWN0aXZlUmVzb3VyY2VDbGFzczogUmVzb3VyY2VDbGFzcztcblxuICAgIC8vIHNldHRlciBtZXRob2QgZm9yIHNlbGVjdGVkIHJlc291cmNlIGNsYXNzXG4gICAgQElucHV0KClcbiAgICBzZXQgYWN0aXZlUmVzb3VyY2VDbGFzcyh2YWx1ZTogUmVzb3VyY2VDbGFzcykge1xuICAgICAgICB0aGlzLl9hY3RpdmVSZXNvdXJjZUNsYXNzID0gdmFsdWU7XG4gICAgfVxuXG4gICAgLy8gcmVmZXJlbmNlIHRvIGNoaWxkIGNvbXBvbmVudDogY29tYmluYXRpb24gb2YgY29tcGFyaXNvbiBvcGVyYXRvciBhbmQgdmFsdWUgZm9yIGNob3NlbiBwcm9wZXJ0eVxuICAgIEBWaWV3Q2hpbGQoJ3NwZWNpZnlQcm9wZXJ0eVZhbHVlJykgc3BlY2lmeVByb3BlcnR5VmFsdWU6IFNwZWNpZnlQcm9wZXJ0eVZhbHVlQ29tcG9uZW50O1xuXG4gICAgLy8gcHJvcGVydGllcyB0aGF0IGNhbiBiZSBzZWxlY3RlZCBmcm9tXG4gICAgcHJpdmF0ZSBfcHJvcGVydGllczogUHJvcGVydGllcztcblxuICAgIC8vIHByb3BlcnRpZXMgYXMgYW4gQXJyYXkgc3RydWN0dXJlIChiYXNlZCBvbiB0aGlzLnByb3BlcnRpZXMpXG4gICAgcHJvcGVydGllc0FzQXJyYXk6IEFycmF5PFByb3BlcnR5PjtcblxuICAgIC8vIHJlcHJlc2VudHMgdGhlIGN1cnJlbnRseSBzZWxlY3RlZCBwcm9wZXJ0eVxuICAgIHByb3BlcnR5U2VsZWN0ZWQ6IFByb3BlcnR5O1xuXG4gICAgZm9ybTogRm9ybUdyb3VwO1xuXG4gICAgLy8gdW5pcXVlIG5hbWUgZm9yIHRoaXMgcHJvcGVydHkgdG8gYmUgdXNlZCBpbiB0aGUgcGFyZW50IEZvcm1Hcm91cFxuICAgIHByb3BJbmRleDogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IoQEluamVjdChGb3JtQnVpbGRlcikgcHJpdmF0ZSBmYjogRm9ybUJ1aWxkZXIpIHtcblxuICAgIH1cblxuICAgIG5nT25Jbml0KCkge1xuXG4gICAgICAgIC8vIGJ1aWxkIGEgZm9ybSBmb3IgdGhlIHByb3BlcnR5IHNlbGVjdGlvblxuICAgICAgICB0aGlzLmZvcm0gPSB0aGlzLmZiLmdyb3VwKHtcbiAgICAgICAgICAgIHByb3BlcnR5OiBbbnVsbCwgVmFsaWRhdG9ycy5yZXF1aXJlZF0sXG4gICAgICAgICAgICBpc1NvcnRDcml0ZXJpb246IFtmYWxzZSwgVmFsaWRhdG9ycy5yZXF1aXJlZF1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gdXBkYXRlIHRoZSBzZWxlY3RlZCBwcm9wZXJ0eVxuICAgICAgICB0aGlzLmZvcm0udmFsdWVDaGFuZ2VzLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcHJvcElyaSA9IGRhdGEucHJvcGVydHk7XG4gICAgICAgICAgICB0aGlzLnByb3BlcnR5U2VsZWN0ZWQgPSB0aGlzLl9wcm9wZXJ0aWVzW3Byb3BJcmldO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXNvbHZlZFByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnByb3BJbmRleCA9ICdwcm9wZXJ0eScgKyB0aGlzLmluZGV4O1xuXG4gICAgICAgICAgICAvLyBhZGQgZm9ybSB0byB0aGUgcGFyZW50IGZvcm0gZ3JvdXBcbiAgICAgICAgICAgIHRoaXMuZm9ybUdyb3VwLmFkZENvbnRyb2wodGhpcy5wcm9wSW5kZXgsIHRoaXMuZm9ybSk7XG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG5cbiAgICAgICAgLy8gcmVtb3ZlIGZvcm0gZnJvbSB0aGUgcGFyZW50IGZvcm0gZ3JvdXBcbiAgICAgICAgcmVzb2x2ZWRQcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5mb3JtR3JvdXAucmVtb3ZlQ29udHJvbCh0aGlzLnByb3BJbmRleCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEluZGljYXRlcyBpZiBwcm9wZXJ0eSBjYW4gYmUgdXNlZCBhcyBhIHNvcnQgY3JpdGVyaW9uLlxuICAgICAqIFByb3BlcnR5IGhhcyB0byBoYXZlIGNhcmRpbmFsaXR5IG9yIG1heCBjYXJkaW5hbGl0eSAxIGZvciB0aGUgY2hvc2VuIHJlc291cmNlIGNsYXNzLlxuICAgICAqXG4gICAgICogV2UgY2Fubm90IHNvcnQgYnkgcHJvcGVydGllcyB3aG9zZSBjYXJkaW5hbGl0eSBpcyBncmVhdGVyIHRoYW4gMS5cbiAgICAgKiBSZXR1cm4gYm9vbGVhblxuICAgICAqL1xuICAgIHNvcnRDcml0ZXJpb24oKSB7XG5cbiAgICAgICAgLy8gY2hlY2sgaWYgYSByZXNvdXJjZSBjbGFzcyBpcyBzZWxlY3RlZCBhbmQgaWYgdGhlIHByb3BlcnR5J3MgY2FyZGluYWxpdHkgaXMgMSBmb3IgdGhlIHNlbGVjdGVkIHJlc291cmNlIGNsYXNzXG4gICAgICAgIGlmICh0aGlzLl9hY3RpdmVSZXNvdXJjZUNsYXNzICE9PSB1bmRlZmluZWQgJiYgdGhpcy5wcm9wZXJ0eVNlbGVjdGVkICE9PSB1bmRlZmluZWQgJiYgIXRoaXMucHJvcGVydHlTZWxlY3RlZC5pc0xpbmtQcm9wZXJ0eSkge1xuXG4gICAgICAgICAgICBjb25zdCBjYXJkaW5hbGl0aWVzOiBDYXJkaW5hbGl0eVtdID0gdGhpcy5fYWN0aXZlUmVzb3VyY2VDbGFzcy5jYXJkaW5hbGl0aWVzLmZpbHRlcihcbiAgICAgICAgICAgICAgICAoY2FyZDogQ2FyZGluYWxpdHkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gY2FyZGluYWxpdHkgMSBvciBtYXggb2NjdXJyZW5jZSAxXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjYXJkLnByb3BlcnR5ID09PSB0aGlzLnByb3BlcnR5U2VsZWN0ZWQuaWRcbiAgICAgICAgICAgICAgICAgICAgICAgICYmIGNhcmQudmFsdWUgPT09IDFcbiAgICAgICAgICAgICAgICAgICAgICAgICYmIChjYXJkLm9jY3VycmVuY2UgPT09IENhcmRpbmFsaXR5T2NjdXJyZW5jZS5jYXJkIHx8IGNhcmQub2NjdXJyZW5jZSA9PT0gQ2FyZGluYWxpdHlPY2N1cnJlbmNlLm1heENhcmQpXG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICByZXR1cm4gY2FyZGluYWxpdGllcy5sZW5ndGggPT09IDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFVwZGF0ZXMgdGhlIHByb3BlcnRpZXMgYXJyYXkgdGhhdCBpcyBhY2Nlc3NlZCBieSB0aGUgdGVtcGxhdGUuXG4gICAgICovXG4gICAgcHJpdmF0ZSB1cGRhdGVQcm9wZXJ0aWVzQXJyYXkoKSB7XG5cbiAgICAgICAgLy8gcmVwcmVzZW50IHRoZSBwcm9wZXJ0aWVzIGFzIGFuIGFycmF5IHRvIGJlIGFjY2Vzc2VkIGJ5IHRoZSB0ZW1wbGF0ZVxuICAgICAgICBjb25zdCBwcm9wc0FycmF5ID0gW107XG5cbiAgICAgICAgZm9yIChjb25zdCBwcm9wSXJpIGluIHRoaXMuX3Byb3BlcnRpZXMpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9wcm9wZXJ0aWVzLmhhc093blByb3BlcnR5KHByb3BJcmkpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcHJvcCA9IHRoaXMuX3Byb3BlcnRpZXNbcHJvcElyaV07XG5cbiAgICAgICAgICAgICAgICAvLyBvbmx5IGxpc3QgZWRpdGFibGUgcHJvcHMgdGhhdCBhcmUgbm90IGxpbmsgdmFsdWUgcHJvcHNcbiAgICAgICAgICAgICAgICBpZiAocHJvcC5pc0VkaXRhYmxlICYmICFwcm9wLmlzTGlua1ZhbHVlUHJvcGVydHkpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvcHNBcnJheS5wdXNoKHRoaXMuX3Byb3BlcnRpZXNbcHJvcElyaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHNvcnQgcHJvcGVydGllcyBieSBsYWJlbCAoYXNjZW5kaW5nKVxuICAgICAgICBwcm9wc0FycmF5LnNvcnQoT250b2xvZ3lJbmZvcm1hdGlvbi5zb3J0RnVuYyk7XG5cbiAgICAgICAgdGhpcy5wcm9wZXJ0aWVzQXNBcnJheSA9IHByb3BzQXJyYXk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgc2VsZWN0ZWQgcHJvcGVydHkgd2l0aCB0aGUgc3BlY2lmaWVkIHZhbHVlLlxuICAgICAqL1xuICAgIGdldFByb3BlcnR5U2VsZWN0ZWRXaXRoVmFsdWUoKTogUHJvcGVydHlXaXRoVmFsdWUge1xuXG4gICAgICAgIGNvbnN0IHByb3BWYWw6IENvbXBhcmlzb25PcGVyYXRvckFuZFZhbHVlID0gdGhpcy5zcGVjaWZ5UHJvcGVydHlWYWx1ZS5nZXRDb21wYXJpc29uT3BlcmF0b3JBbmRWYWx1ZUxpdGVyYWxGb3JQcm9wZXJ0eSgpO1xuXG4gICAgICAgIGxldCBpc1NvcnRDcml0ZXJpb24gPSBmYWxzZTtcblxuICAgICAgICAvLyBvbmx5IG5vbiBsaW5raW5nIHByb3BlcnRpZXMgY2FuIGJlIHVzZWQgZm9yIHNvcnRpbmdcbiAgICAgICAgaWYgKCF0aGlzLnByb3BlcnR5U2VsZWN0ZWQuaXNMaW5rUHJvcGVydHkpIHtcbiAgICAgICAgICAgIGlzU29ydENyaXRlcmlvbiA9IHRoaXMuZm9ybS52YWx1ZS5pc1NvcnRDcml0ZXJpb247XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IFByb3BlcnR5V2l0aFZhbHVlKHRoaXMucHJvcGVydHlTZWxlY3RlZCwgcHJvcFZhbCwgaXNTb3J0Q3JpdGVyaW9uKTtcblxuICAgIH1cblxuXG59XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIEluamVjdCwgSW5wdXQsIE9uQ2hhbmdlcywgT25Jbml0LCBWaWV3Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEZvcm1CdWlsZGVyLCBGb3JtR3JvdXAsIFZhbGlkYXRvcnMgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge1xuICAgIENvbXBhcmlzb25PcGVyYXRvcixcbiAgICBDb21wYXJpc29uT3BlcmF0b3JBbmRWYWx1ZSxcbiAgICBFcXVhbHMsXG4gICAgRXhpc3RzLFxuICAgIEdyZWF0ZXJUaGFuLFxuICAgIEdyZWF0ZXJUaGFuRXF1YWxzLFxuICAgIEtub3JhQ29uc3RhbnRzLFxuICAgIExlc3NUaGFuLFxuICAgIExlc3NUaGFuRXF1YWxzLFxuICAgIExpa2UsXG4gICAgTWF0Y2gsXG4gICAgTm90RXF1YWxzLFxuICAgIFByb3BlcnR5LFxuICAgIFByb3BlcnR5VmFsdWUsXG4gICAgVmFsdWVcbn0gZnJvbSAnQGtub3JhL2NvcmUnO1xuXG5cbi8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzQ1NjYxMDEwL2R5bmFtaWMtbmVzdGVkLXJlYWN0aXZlLWZvcm0tZXhwcmVzc2lvbmNoYW5nZWRhZnRlcml0aGFzYmVlbmNoZWNrZWRlcnJvclxuY29uc3QgcmVzb2x2ZWRQcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKG51bGwpO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ2t1aS1zcGVjaWZ5LXByb3BlcnR5LXZhbHVlJyxcbiAgICB0ZW1wbGF0ZTogYDxtYXQtZm9ybS1maWVsZCBjbGFzcz1cInNlYXJjaC1vcGVyYXRvci1maWVsZFwiICpuZ0lmPVwiY29tcGFyaXNvbk9wZXJhdG9ycz8ubGVuZ3RoID4gMFwiPlxuICAgIDxtYXQtc2VsZWN0IHBsYWNlaG9sZGVyPVwiQ29tcGFyaXNvbiBPcGVyYXRvclwiIFtmb3JtQ29udHJvbF09XCJmb3JtLmNvbnRyb2xzWydjb21wYXJpc29uT3BlcmF0b3InXVwiPlxuICAgICAgICA8bWF0LW9wdGlvbiAqbmdGb3I9XCJsZXQgY29tcE9wIG9mIGNvbXBhcmlzb25PcGVyYXRvcnNcIiBbdmFsdWVdPVwiY29tcE9wXCI+e3sgY29tcE9wLmxhYmVsIH19PC9tYXQtb3B0aW9uPlxuICAgIDwvbWF0LXNlbGVjdD5cbjwvbWF0LWZvcm0tZmllbGQ+XG5cbjwhLS0gc2VsZWN0IGFwdCBjb21wb25lbnQgZm9yIHZhbHVlIHNwZWNpZmljYXRpb24gdXNpbmcgYSBzd2l0Y2ggY2FzZSBzdGF0ZW1lbnQtLT5cbjxzcGFuXG4gICAgKm5nSWY9XCJjb21wYXJpc29uT3BlcmF0b3JTZWxlY3RlZCAhPT0gdW5kZWZpbmVkICYmIGNvbXBhcmlzb25PcGVyYXRvclNlbGVjdGVkICE9PSBudWxsICYmIGNvbXBhcmlzb25PcGVyYXRvclNlbGVjdGVkLmdldENsYXNzTmFtZSgpICE9ICdFeGlzdHMnXCJcbiAgICBbbmdTd2l0Y2hdPVwicHJvcGVydHlWYWx1ZVR5cGVcIj5cbiAgPGJvb2xlYW4tdmFsdWUgI3Byb3BlcnR5VmFsdWUgW2Zvcm1Hcm91cF09XCJmb3JtXCIgKm5nU3dpdGNoQ2FzZT1cIktub3JhQ29uc3RhbnRzLkJvb2xlYW5WYWx1ZVwiPjwvYm9vbGVhbi12YWx1ZT5cbiAgPGRhdGUtdmFsdWUgI3Byb3BlcnR5VmFsdWUgW2Zvcm1Hcm91cF09XCJmb3JtXCIgKm5nU3dpdGNoQ2FzZT1cIktub3JhQ29uc3RhbnRzLkRhdGVWYWx1ZVwiPjwvZGF0ZS12YWx1ZT5cbiAgPGRlY2ltYWwtdmFsdWUgI3Byb3BlcnR5VmFsdWUgW2Zvcm1Hcm91cF09XCJmb3JtXCIgKm5nU3dpdGNoQ2FzZT1cIktub3JhQ29uc3RhbnRzLkRlY2ltYWxWYWx1ZVwiPjwvZGVjaW1hbC12YWx1ZT5cbiAgPGludGVnZXItdmFsdWUgI3Byb3BlcnR5VmFsdWUgW2Zvcm1Hcm91cF09XCJmb3JtXCIgKm5nU3dpdGNoQ2FzZT1cIktub3JhQ29uc3RhbnRzLkludFZhbHVlXCI+PC9pbnRlZ2VyLXZhbHVlPlxuICA8bGluay12YWx1ZSAjcHJvcGVydHlWYWx1ZSBbZm9ybUdyb3VwXT1cImZvcm1cIiBbcmVzdHJpY3RSZXNvdXJjZUNsYXNzXT1cInByb3BlcnR5Lm9iamVjdFR5cGVcIlxuICAgICAgICAgICAgICAqbmdTd2l0Y2hDYXNlPVwiS25vcmFDb25zdGFudHMuUmVzb3VyY2VcIj48L2xpbmstdmFsdWU+XG4gIDx0ZXh0LXZhbHVlICNwcm9wZXJ0eVZhbHVlIFtmb3JtR3JvdXBdPVwiZm9ybVwiICpuZ1N3aXRjaENhc2U9XCJLbm9yYUNvbnN0YW50cy5UZXh0VmFsdWVcIj48L3RleHQtdmFsdWU+XG4gIDx1cmktdmFsdWUgI3Byb3BlcnR5VmFsdWUgW2Zvcm1Hcm91cF09XCJmb3JtXCIgKm5nU3dpdGNoQ2FzZT1cIktub3JhQ29uc3RhbnRzLlVyaVZhbHVlXCI+PC91cmktdmFsdWU+XG5cbiAgICA8IS0tIFRPRE86IFJlc291cmNlOiBoYW5kbGUgbGlua2luZyBwcm9wZXJ0aWVzIHdpdGggdGFyZ2V0IGNsYXNzIHJlc3RyaWN0aW9uOiBhY2Nlc3MgcHJvcGVydHkgbWVtYmVyIHRvIGdldCBvYmplY3RDbGFzcyB2aWEgcHJvcGVydHkoKSBnZXR0ZXIgbWV0aG9kIC0tPlxuICA8c3BhbiAqbmdTd2l0Y2hEZWZhdWx0PVwiXCI+Tm90IHN1cHBvcnRlZCB7e3Byb3BlcnR5VmFsdWVUeXBlfX08L3NwYW4+XG48L3NwYW4+XG5gLFxuICAgIHN0eWxlczogW2Auc2VhcmNoLW9wZXJhdG9yLWZpZWxke21hcmdpbi1yaWdodDo4cHh9YF1cbn0pXG5leHBvcnQgY2xhc3MgU3BlY2lmeVByb3BlcnR5VmFsdWVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcyB7XG5cbiAgICBLbm9yYUNvbnN0YW50cyA9IEtub3JhQ29uc3RhbnRzO1xuXG4gICAgLy8gcGFyZW50IEZvcm1Hcm91cFxuICAgIEBJbnB1dCgpIGZvcm1Hcm91cDogRm9ybUdyb3VwO1xuXG4gICAgQFZpZXdDaGlsZCgncHJvcGVydHlWYWx1ZScpIHByb3BlcnR5VmFsdWVDb21wb25lbnQ6IFByb3BlcnR5VmFsdWU7XG5cbiAgICAvLyBzZXR0ZXIgbWV0aG9kIGZvciB0aGUgcHJvcGVydHkgY2hvc2VuIGJ5IHRoZSB1c2VyXG4gICAgQElucHV0KClcbiAgICBzZXQgcHJvcGVydHkocHJvcDogUHJvcGVydHkpIHtcbiAgICAgICAgdGhpcy5jb21wYXJpc29uT3BlcmF0b3JTZWxlY3RlZCA9IHVuZGVmaW5lZDsgLy8gcmVzZXQgdG8gaW5pdGlhbCBzdGF0ZVxuICAgICAgICB0aGlzLl9wcm9wZXJ0eSA9IHByb3A7XG4gICAgICAgIHRoaXMucmVzZXRDb21wYXJpc29uT3BlcmF0b3JzKCk7IC8vIHJlc2V0IGNvbXBhcmlzb24gb3BlcmF0b3JzIGZvciBnaXZlbiBwcm9wZXJ0eSAob3ZlcndyaXRpbmcgYW55IHByZXZpb3VzIHNlbGVjdGlvbilcbiAgICB9XG5cbiAgICAvLyBnZXR0ZXIgbWV0aG9kIGZvciB0aGlzLl9wcm9wZXJ0eVxuICAgIGdldCBwcm9wZXJ0eSgpOiBQcm9wZXJ0eSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wcm9wZXJ0eTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9wcm9wZXJ0eTogUHJvcGVydHk7XG5cbiAgICBmb3JtOiBGb3JtR3JvdXA7XG5cbiAgICAvLyBhdmFpbGFibGUgY29tcGFyaXNvbiBvcGVyYXRvcnMgZm9yIHRoZSBwcm9wZXJ0eVxuICAgIGNvbXBhcmlzb25PcGVyYXRvcnM6IEFycmF5PENvbXBhcmlzb25PcGVyYXRvcj4gPSBbXTtcblxuICAgIC8vIGNvbXBhcmlzb24gb3BlcmF0b3Igc2VsZWN0ZWQgYnkgdGhlIHVzZXJcbiAgICBjb21wYXJpc29uT3BlcmF0b3JTZWxlY3RlZDogQ29tcGFyaXNvbk9wZXJhdG9yO1xuXG4gICAgLy8gdGhlIHR5cGUgb2YgdGhlIHByb3BlcnR5XG4gICAgcHJvcGVydHlWYWx1ZVR5cGU7XG5cbiAgICBjb25zdHJ1Y3RvcihASW5qZWN0KEZvcm1CdWlsZGVyKSBwcml2YXRlIGZiOiBGb3JtQnVpbGRlcikge1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlc2V0cyB0aGUgY29tcGFyaXNvbiBvcGVyYXRvcnMgZm9yIHRoaXMuX3Byb3BlcnR5LlxuICAgICAqL1xuICAgIHJlc2V0Q29tcGFyaXNvbk9wZXJhdG9ycygpIHtcblxuICAgICAgICAvLyBkZXBlbmRpbmcgb24gb2JqZWN0IGNsYXNzLCBzZXQgY29tcGFyaXNvbiBvcGVyYXRvcnMgYW5kIHZhbHVlIGVudHJ5IGZpZWxkXG4gICAgICAgIGlmICh0aGlzLl9wcm9wZXJ0eS5pc0xpbmtQcm9wZXJ0eSkge1xuICAgICAgICAgICAgdGhpcy5wcm9wZXJ0eVZhbHVlVHlwZSA9IEtub3JhQ29uc3RhbnRzLlJlc291cmNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wcm9wZXJ0eVZhbHVlVHlwZSA9IHRoaXMuX3Byb3BlcnR5Lm9iamVjdFR5cGU7XG4gICAgICAgIH1cblxuICAgICAgICBzd2l0Y2ggKHRoaXMucHJvcGVydHlWYWx1ZVR5cGUpIHtcblxuICAgICAgICAgICAgY2FzZSBLbm9yYUNvbnN0YW50cy5UZXh0VmFsdWU6XG4gICAgICAgICAgICAgICAgdGhpcy5jb21wYXJpc29uT3BlcmF0b3JzID0gW25ldyBMaWtlKCksIG5ldyBNYXRjaCgpLCBuZXcgRXF1YWxzKCksIG5ldyBOb3RFcXVhbHMoKSwgbmV3IEV4aXN0cygpXTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSBLbm9yYUNvbnN0YW50cy5Cb29sZWFuVmFsdWU6XG4gICAgICAgICAgICBjYXNlIEtub3JhQ29uc3RhbnRzLlJlc291cmNlOlxuICAgICAgICAgICAgY2FzZSBLbm9yYUNvbnN0YW50cy5VcmlWYWx1ZTpcbiAgICAgICAgICAgIGNhc2UgS25vcmFDb25zdGFudHMuSW50ZXJ2YWxWYWx1ZTpcbiAgICAgICAgICAgICAgICB0aGlzLmNvbXBhcmlzb25PcGVyYXRvcnMgPSBbbmV3IEVxdWFscygpLCBuZXcgTm90RXF1YWxzKCksIG5ldyBFeGlzdHMoKV07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgS25vcmFDb25zdGFudHMuSW50VmFsdWU6XG4gICAgICAgICAgICBjYXNlIEtub3JhQ29uc3RhbnRzLkRlY2ltYWxWYWx1ZTpcbiAgICAgICAgICAgIGNhc2UgS25vcmFDb25zdGFudHMuRGF0ZVZhbHVlOlxuICAgICAgICAgICAgICAgIHRoaXMuY29tcGFyaXNvbk9wZXJhdG9ycyA9IFtuZXcgRXF1YWxzKCksIG5ldyBOb3RFcXVhbHMoKSwgbmV3IExlc3NUaGFuKCksIG5ldyBMZXNzVGhhbkVxdWFscygpLCBuZXcgR3JlYXRlclRoYW4oKSwgbmV3IEdyZWF0ZXJUaGFuRXF1YWxzKCksIG5ldyBFeGlzdHMoKV07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgS25vcmFDb25zdGFudHMuTGlzdFZhbHVlOlxuICAgICAgICAgICAgY2FzZSBLbm9yYUNvbnN0YW50cy5HZW9tVmFsdWU6XG4gICAgICAgICAgICBjYXNlIEtub3JhQ29uc3RhbnRzLkZpbGVWYWx1ZTpcbiAgICAgICAgICAgIGNhc2UgS25vcmFDb25zdGFudHMuQXVkaW9GaWxlVmFsdWU6XG4gICAgICAgICAgICBjYXNlIEtub3JhQ29uc3RhbnRzLlN0aWxsSW1hZ2VGaWxlVmFsdWU6XG4gICAgICAgICAgICBjYXNlIEtub3JhQ29uc3RhbnRzLkREREZpbGVWYWx1ZTpcbiAgICAgICAgICAgIGNhc2UgS25vcmFDb25zdGFudHMuTW92aW5nSW1hZ2VGaWxlVmFsdWU6XG4gICAgICAgICAgICBjYXNlIEtub3JhQ29uc3RhbnRzLlRleHRGaWxlVmFsdWU6XG4gICAgICAgICAgICBjYXNlIEtub3JhQ29uc3RhbnRzLkNvbG9yVmFsdWU6XG4gICAgICAgICAgICAgICAgdGhpcy5jb21wYXJpc29uT3BlcmF0b3JzID0gW25ldyBFeGlzdHMoKV07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0VSUk9SOiBVbnN1cHBvcnRlZCB2YWx1ZSB0eXBlICcgKyB0aGlzLl9wcm9wZXJ0eS5vYmplY3RUeXBlKTtcblxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHsgfVxuXG4gICAgbmdPbkNoYW5nZXMoKSB7XG5cbiAgICAgICAgLy8gYnVpbGQgYSBmb3JtIGZvciBjb21wYXJpc29uIG9wZXJhdG9yIHNlbGVjdGlvblxuICAgICAgICB0aGlzLmZvcm0gPSB0aGlzLmZiLmdyb3VwKHtcbiAgICAgICAgICAgIGNvbXBhcmlzb25PcGVyYXRvcjogW251bGwsIFZhbGlkYXRvcnMucmVxdWlyZWRdXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIHN0b3JlIGNvbXBhcmlzb24gb3BlcmF0b3Igd2hlbiBzZWxlY3RlZFxuICAgICAgICB0aGlzLmZvcm0udmFsdWVDaGFuZ2VzLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jb21wYXJpc29uT3BlcmF0b3JTZWxlY3RlZCA9IGRhdGEuY29tcGFyaXNvbk9wZXJhdG9yO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXNvbHZlZFByb21pc2UudGhlbigoKSA9PiB7XG5cbiAgICAgICAgICAgIC8vIHJlbW92ZSBmcm9tIHRoZSBwYXJlbnQgZm9ybSBncm91cCAoY2xlYW4gcmVzZXQpXG4gICAgICAgICAgICB0aGlzLmZvcm1Hcm91cC5yZW1vdmVDb250cm9sKCdjb21wYXJpc29uT3BlcmF0b3InKTtcblxuICAgICAgICAgICAgLy8gYWRkIGZvcm0gdG8gdGhlIHBhcmVudCBmb3JtIGdyb3VwXG4gICAgICAgICAgICB0aGlzLmZvcm1Hcm91cC5hZGRDb250cm9sKCdjb21wYXJpc29uT3BlcmF0b3InLCB0aGlzLmZvcm0pO1xuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIHNwZWNpZmllZCBjb21wYXJpc29uIG9wZXJhdG9yIGFuZCB2YWx1ZSBmb3IgdGhlIHByb3BlcnR5LlxuICAgICAqXG4gICAgICogcmV0dXJucyB7Q29tcGFyaXNvbk9wZXJhdG9yQW5kVmFsdWV9IHRoZSBjb21wYXJpc29uIG9wZXJhdG9yIGFuZCB0aGUgc3BlY2lmaWVkIHZhbHVlXG4gICAgICovXG4gICAgZ2V0Q29tcGFyaXNvbk9wZXJhdG9yQW5kVmFsdWVMaXRlcmFsRm9yUHJvcGVydHkoKTogQ29tcGFyaXNvbk9wZXJhdG9yQW5kVmFsdWUge1xuICAgICAgICAvLyByZXR1cm4gdmFsdWUgKGxpdGVyYWwgb3IgSVJJKSBmcm9tIHRoZSBjaGlsZCBjb21wb25lbnRcbiAgICAgICAgbGV0IHZhbHVlOiBWYWx1ZTtcblxuICAgICAgICAvLyBjb21wYXJpc29uIG9wZXJhdG9yICdFeGlzdHMnIGRvZXMgbm90IHJlcXVpcmUgYSB2YWx1ZVxuICAgICAgICBpZiAodGhpcy5jb21wYXJpc29uT3BlcmF0b3JTZWxlY3RlZC5nZXRDbGFzc05hbWUoKSAhPT0gJ0V4aXN0cycpIHtcbiAgICAgICAgICAgIHZhbHVlID0gdGhpcy5wcm9wZXJ0eVZhbHVlQ29tcG9uZW50LmdldFZhbHVlKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyByZXR1cm4gdGhlIGNvbXBhcmlzb24gb3BlcmF0b3IgYW5kIHRoZSBzcGVjaWZpZWQgdmFsdWVcbiAgICAgICAgcmV0dXJuIG5ldyBDb21wYXJpc29uT3BlcmF0b3JBbmRWYWx1ZSh0aGlzLmNvbXBhcmlzb25PcGVyYXRvclNlbGVjdGVkLCB2YWx1ZSk7XG5cbiAgICB9XG5cbn1cblxuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBJbmplY3QsIElucHV0LCBPbkRlc3Ryb3ksIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRm9ybUJ1aWxkZXIsIEZvcm1Hcm91cCwgVmFsaWRhdG9ycyB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IEtub3JhQ29uc3RhbnRzLCBQcm9wZXJ0eVZhbHVlLCBWYWx1ZSwgVmFsdWVMaXRlcmFsIH0gZnJvbSAnQGtub3JhL2NvcmUnO1xuXG4vLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy80NTY2MTAxMC9keW5hbWljLW5lc3RlZC1yZWFjdGl2ZS1mb3JtLWV4cHJlc3Npb25jaGFuZ2VkYWZ0ZXJpdGhhc2JlZW5jaGVja2VkZXJyb3JcbmNvbnN0IHJlc29sdmVkUHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZShudWxsKTtcblxuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ2Jvb2xlYW4tdmFsdWUnLFxuICAgIHRlbXBsYXRlOiBgPG1hdC1jaGVja2JveCBbZm9ybUNvbnRyb2xdPVwiZm9ybS5jb250cm9sc1snYm9vbGVhblZhbHVlJ11cIj48L21hdC1jaGVja2JveD5cbmAsXG4gICAgc3R5bGVzOiBbYGBdXG59KVxuZXhwb3J0IGNsYXNzIEJvb2xlYW5WYWx1ZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95LCBQcm9wZXJ0eVZhbHVlIHtcblxuICAgIC8vIHBhcmVudCBGb3JtR3JvdXBcbiAgICBASW5wdXQoKSBmb3JtR3JvdXA6IEZvcm1Hcm91cDtcblxuICAgIHR5cGUgPSBLbm9yYUNvbnN0YW50cy5Cb29sZWFuVmFsdWU7XG5cbiAgICBmb3JtOiBGb3JtR3JvdXA7XG5cbiAgICBjb25zdHJ1Y3RvcihASW5qZWN0KEZvcm1CdWlsZGVyKSBwcml2YXRlIGZiOiBGb3JtQnVpbGRlcikge1xuXG4gICAgfVxuXG4gICAgbmdPbkluaXQoKSB7XG5cbiAgICAgICAgdGhpcy5mb3JtID0gdGhpcy5mYi5ncm91cCh7XG4gICAgICAgICAgICBib29sZWFuVmFsdWU6IFtmYWxzZSwgVmFsaWRhdG9ycy5jb21wb3NlKFtWYWxpZGF0b3JzLnJlcXVpcmVkXSldXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJlc29sdmVkUHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIC8vIGFkZCBmb3JtIHRvIHRoZSBwYXJlbnQgZm9ybSBncm91cFxuICAgICAgICAgICAgdGhpcy5mb3JtR3JvdXAuYWRkQ29udHJvbCgncHJvcFZhbHVlJywgdGhpcy5mb3JtKTtcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcblxuICAgICAgICAvLyByZW1vdmUgZm9ybSBmcm9tIHRoZSBwYXJlbnQgZm9ybSBncm91cFxuICAgICAgICByZXNvbHZlZFByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZvcm1Hcm91cC5yZW1vdmVDb250cm9sKCdwcm9wVmFsdWUnKTtcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBnZXRWYWx1ZSgpOiBWYWx1ZSB7XG4gICAgICAgIHJldHVybiBuZXcgVmFsdWVMaXRlcmFsKFN0cmluZyh0aGlzLmZvcm0udmFsdWUuYm9vbGVhblZhbHVlKSwgS25vcmFDb25zdGFudHMueHNkQm9vbGVhbik7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBEaXJlY3RpdmUsIEhvc3QsIEluamVjdCwgSW5wdXQsIE9uRGVzdHJveSwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBGb3JtQnVpbGRlciwgRm9ybUdyb3VwLCBWYWxpZGF0b3JzIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgS25vcmFDb25zdGFudHMsIFByb3BlcnR5VmFsdWUsIFZhbHVlLCBWYWx1ZUxpdGVyYWwgfSBmcm9tICdAa25vcmEvY29yZSc7XG5pbXBvcnQgeyBHcmVnb3JpYW5DYWxlbmRhckRhdGUsIEpETkNvbnZlcnRpYmxlQ2FsZW5kYXIsIEpETlBlcmlvZCB9IGZyb20gJ2pkbmNvbnZlcnRpYmxlY2FsZW5kYXInO1xuaW1wb3J0IHsgRGF0ZUFkYXB0ZXIsIE1BVF9EQVRFX0xPQ0FMRSwgTWF0Q2FsZW5kYXIgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbCc7XG5pbXBvcnQgeyBKRE5Db252ZXJ0aWJsZUNhbGVuZGFyRGF0ZUFkYXB0ZXIgfSBmcm9tICdqZG5jb252ZXJ0aWJsZWNhbGVuZGFyZGF0ZWFkYXB0ZXInO1xuXG4vKiogQ3VzdG9tIGhlYWRlciBjb21wb25lbnQgY29udGFpbmluZyBhIGNhbGVuZGFyIGZvcm1hdCBzd2l0Y2hlciAqL1xuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdrdWktY2FsZW5kYXItaGVhZGVyJyxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgPG1hdC1zZWxlY3QgcGxhY2Vob2xkZXI9XCJDYWxlbmRhciBGb3JtYXRcIiBbZm9ybUNvbnRyb2xdPVwiZm9ybS5jb250cm9sc1snY2FsZW5kYXInXVwiPlxuICAgICAgICA8bWF0LW9wdGlvbiAqbmdGb3I9XCJsZXQgY2FsIG9mIHN1cHBvcnRlZENhbGVuZGFyRm9ybWF0c1wiIFt2YWx1ZV09XCJjYWxcIj57e2NhbH19PC9tYXQtb3B0aW9uPlxuICAgICAgPC9tYXQtc2VsZWN0PlxuICAgICAgPG1hdC1jYWxlbmRhci1oZWFkZXI+PC9tYXQtY2FsZW5kYXItaGVhZGVyPlxuICAgIGAsXG4gICAgc3R5bGVzOiBbXVxufSlcbmV4cG9ydCBjbGFzcyBIZWFkZXJDb21wb25lbnQ8RD4gaW1wbGVtZW50cyBPbkluaXQge1xuICAgIGNvbnN0cnVjdG9yKEBIb3N0KCkgcHJpdmF0ZSBfY2FsZW5kYXI6IE1hdENhbGVuZGFyPEpETkNvbnZlcnRpYmxlQ2FsZW5kYXI+LFxuICAgICAgICBwcml2YXRlIF9kYXRlQWRhcHRlcjogRGF0ZUFkYXB0ZXI8SkROQ29udmVydGlibGVDYWxlbmRhcj4sXG4gICAgICAgIEBJbmplY3QoRm9ybUJ1aWxkZXIpIHByaXZhdGUgZmI6IEZvcm1CdWlsZGVyKSB7XG4gICAgfVxuXG4gICAgZm9ybTogRm9ybUdyb3VwO1xuXG4gICAgLy8gYSBsaXN0IG9mIHN1cHBvcnRlZCBjYWxlbmRhciBmb3JtYXRzIChHcmVnb3JpYW4gYW5kIEp1bGlhbilcbiAgICBzdXBwb3J0ZWRDYWxlbmRhckZvcm1hdHMgPSBKRE5Db252ZXJ0aWJsZUNhbGVuZGFyLnN1cHBvcnRlZENhbGVuZGFycztcblxuICAgIC8vIHRoZSBjdXJyZW50bHkgYWN0aXZlIGNhbGVuZGFyIGZvcm1hdFxuICAgIGFjdGl2ZUZvcm1hdDtcblxuICAgIG5nT25Jbml0KCkge1xuXG4gICAgICAgIC8vIGdldCB0aGUgY3VycmVudGx5IGFjdGl2ZSBjYWxlbmRhciBmb3JtYXQgZnJvbSB0aGUgZGF0ZSBhZGFwdGVyXG4gICAgICAgIGlmICh0aGlzLl9kYXRlQWRhcHRlciBpbnN0YW5jZW9mIEpETkNvbnZlcnRpYmxlQ2FsZW5kYXJEYXRlQWRhcHRlcikge1xuICAgICAgICAgICAgdGhpcy5hY3RpdmVGb3JtYXQgPSB0aGlzLl9kYXRlQWRhcHRlci5hY3RpdmVDYWxlbmRhckZvcm1hdDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdkYXRlIGFkYXB0ZXIgaXMgZXhwZWN0ZWQgdG8gYmUgYW4gaW5zdGFuY2Ugb2YgSkROQ29udmVydGlibGVDYWxlbmRhckRhdGVBZGFwdGVyJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBidWlsZCBhIGZvcm0gZm9yIHRoZSBjYWxlbmRhciBmb3JtYXQgc2VsZWN0aW9uXG4gICAgICAgIHRoaXMuZm9ybSA9IHRoaXMuZmIuZ3JvdXAoe1xuICAgICAgICAgICAgY2FsZW5kYXI6IFt0aGlzLmFjdGl2ZUZvcm1hdCwgVmFsaWRhdG9ycy5yZXF1aXJlZF1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gZG8gdGhlIGNvbnZlcnNpb24gd2hlbiB0aGUgdXNlciBzZWxlY3RzIGFub3RoZXIgY2FsZW5kYXIgZm9ybWF0XG4gICAgICAgIHRoaXMuZm9ybS52YWx1ZUNoYW5nZXMuc3Vic2NyaWJlKChkYXRhKSA9PiB7XG4gICAgICAgICAgICAvLyBwYXNzIHRoZSB0YXJnZXQgY2FsZW5kYXIgZm9ybWF0IHRvIHRoZSBjb252ZXJzaW9uIG1ldGhvZFxuICAgICAgICAgICAgdGhpcy5jb252ZXJ0RGF0ZShkYXRhLmNhbGVuZGFyKTtcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDb252ZXJ0cyB0aGUgZGF0ZSBpbnRvIHRoZSB0YXJnZXQgZm9ybWF0LlxuICAgICAqXG4gICAgICogQHBhcmFtIGNhbGVuZGFyIHRoZSB0YXJnZXQgY2FsZW5kYXIgZm9ybWF0LlxuICAgICAqL1xuICAgIGNvbnZlcnREYXRlKGNhbGVuZGFyOiAnR3JlZ29yaWFuJyB8ICdKdWxpYW4nKSB7XG5cbiAgICAgICAgaWYgKHRoaXMuX2RhdGVBZGFwdGVyIGluc3RhbmNlb2YgSkROQ29udmVydGlibGVDYWxlbmRhckRhdGVBZGFwdGVyKSB7XG5cbiAgICAgICAgICAgIC8vIGNvbnZlcnQgdGhlIGRhdGUgaW50byB0aGUgdGFyZ2V0IGNhbGVuZGFyIGZvcm1hdFxuICAgICAgICAgICAgY29uc3QgY29udmVydGVkRGF0ZSA9IHRoaXMuX2RhdGVBZGFwdGVyLmNvbnZlcnRDYWxlbmRhckZvcm1hdCh0aGlzLl9jYWxlbmRhci5hY3RpdmVEYXRlLCBjYWxlbmRhcik7XG5cbiAgICAgICAgICAgIC8vIHNldCB0aGUgbmV3IGRhdGVcbiAgICAgICAgICAgIHRoaXMuX2NhbGVuZGFyLmFjdGl2ZURhdGUgPSBjb252ZXJ0ZWREYXRlO1xuXG4gICAgICAgICAgICAvLyBzZWxlY3QgdGhlIG5ldyBkYXRlIGluIHRoZSBkYXRlcGlja2VyIFVJXG4gICAgICAgICAgICB0aGlzLl9jYWxlbmRhci5fZGF0ZVNlbGVjdGVkKGNvbnZlcnRlZERhdGUpO1xuXG4gICAgICAgICAgICAvLyB1cGRhdGUgdmlldyBhZnRlciBjYWxlbmRhciBmb3JtYXQgY29udmVyc2lvblxuICAgICAgICAgICAgY29uc3QgdmlldyA9IHRoaXMuX2NhbGVuZGFyLmN1cnJlbnRWaWV3ID09PSAnbW9udGgnID8gdGhpcy5fY2FsZW5kYXIubW9udGhWaWV3IDpcbiAgICAgICAgICAgICAgICAodGhpcy5fY2FsZW5kYXIuY3VycmVudFZpZXcgPT09ICd5ZWFyJyA/IHRoaXMuX2NhbGVuZGFyLnllYXJWaWV3IDogdGhpcy5fY2FsZW5kYXIubXVsdGlZZWFyVmlldyk7XG5cbiAgICAgICAgICAgIHZpZXcubmdBZnRlckNvbnRlbnRJbml0KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZGF0ZSBhZGFwdGVyIGlzIGV4cGVjdGVkIHRvIGJlIGFuIGluc3RhbmNlIG9mIEpETkNvbnZlcnRpYmxlQ2FsZW5kYXJEYXRlQWRhcHRlcicpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBIb3N0LCBJbmplY3QsIElucHV0LCBPbkRlc3Ryb3ksIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRm9ybUJ1aWxkZXIsIEZvcm1Hcm91cCwgVmFsaWRhdG9ycyB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuaW1wb3J0IHsgS25vcmFDb25zdGFudHMsIFByb3BlcnR5VmFsdWUsIFZhbHVlLCBWYWx1ZUxpdGVyYWwgfSBmcm9tICdAa25vcmEvY29yZSc7XG5pbXBvcnQgeyBHcmVnb3JpYW5DYWxlbmRhckRhdGUsIEpETkNvbnZlcnRpYmxlQ2FsZW5kYXIsIEpETlBlcmlvZCB9IGZyb20gJ2pkbmNvbnZlcnRpYmxlY2FsZW5kYXInO1xuaW1wb3J0IHsgSGVhZGVyQ29tcG9uZW50IH0gZnJvbSAnLi9oZWFkZXItY2FsZW5kYXIvaGVhZGVyLWNhbGVuZGFyLmNvbXBvbmVudCc7XG5cbi8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzQ1NjYxMDEwL2R5bmFtaWMtbmVzdGVkLXJlYWN0aXZlLWZvcm0tZXhwcmVzc2lvbmNoYW5nZWRhZnRlcml0aGFzYmVlbmNoZWNrZWRlcnJvclxuY29uc3QgcmVzb2x2ZWRQcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKG51bGwpO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ2RhdGUtdmFsdWUnLFxuICAgIHRlbXBsYXRlOiBgPG1hdC1mb3JtLWZpZWxkPlxuICAgIDxrdWlKZG5EYXRlcGlja2VyPlxuICAgICAgICA8aW5wdXQgbWF0SW5wdXQgW21hdERhdGVwaWNrZXJdPVwicGlja2VyXCIgcGxhY2Vob2xkZXI9XCJDaG9vc2UgYSBkYXRlXCIgW2Zvcm1Db250cm9sXT1cImZvcm0uY29udHJvbHNbJ2RhdGVWYWx1ZSddXCI+XG4gICAgICAgIDxtYXQtZGF0ZXBpY2tlciAjcGlja2VyIFtjYWxlbmRhckhlYWRlckNvbXBvbmVudF09XCJoZWFkZXJDb21wb25lbnRcIj48L21hdC1kYXRlcGlja2VyPlxuICAgIDwva3VpSmRuRGF0ZXBpY2tlcj5cbiAgICA8bWF0LWRhdGVwaWNrZXItdG9nZ2xlIG1hdFN1ZmZpeCBbZm9yXT1cInBpY2tlclwiPjwvbWF0LWRhdGVwaWNrZXItdG9nZ2xlPlxuPC9tYXQtZm9ybS1maWVsZD5gLFxuICAgIHN0eWxlczogW2BgXVxufSlcbmV4cG9ydCBjbGFzcyBEYXRlVmFsdWVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgUHJvcGVydHlWYWx1ZSB7XG5cbiAgICAvLyBwYXJlbnQgRm9ybUdyb3VwXG4gICAgQElucHV0KCkgZm9ybUdyb3VwOiBGb3JtR3JvdXA7XG5cbiAgICB0eXBlID0gS25vcmFDb25zdGFudHMuRGF0ZVZhbHVlO1xuXG4gICAgZm9ybTogRm9ybUdyb3VwO1xuXG4gICAgLy8gY3VzdG9tIGhlYWRlciBmb3IgdGhlIGRhdGVwaWNrZXJcbiAgICBoZWFkZXJDb21wb25lbnQgPSBIZWFkZXJDb21wb25lbnQ7XG5cbiAgICBjb25zdHJ1Y3RvcihASW5qZWN0KEZvcm1CdWlsZGVyKSBwcml2YXRlIGZiOiBGb3JtQnVpbGRlcikge1xuICAgIH1cblxuICAgIG5nT25Jbml0KCkge1xuXG4gICAgICAgIC8vIGluaXQgZGF0ZXBpY2tlclxuICAgICAgICB0aGlzLmZvcm0gPSB0aGlzLmZiLmdyb3VwKHtcbiAgICAgICAgICAgIGRhdGVWYWx1ZTogW251bGwsIFZhbGlkYXRvcnMuY29tcG9zZShbVmFsaWRhdG9ycy5yZXF1aXJlZF0pXVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmZvcm0udmFsdWVDaGFuZ2VzLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZGF0YS5kYXRlVmFsdWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXNvbHZlZFByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAvLyBhZGQgZm9ybSB0byB0aGUgcGFyZW50IGZvcm0gZ3JvdXBcbiAgICAgICAgICAgIHRoaXMuZm9ybUdyb3VwLmFkZENvbnRyb2woJ3Byb3BWYWx1ZScsIHRoaXMuZm9ybSk7XG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG5cbiAgICAgICAgLy8gcmVtb3ZlIGZvcm0gZnJvbSB0aGUgcGFyZW50IGZvcm0gZ3JvdXBcbiAgICAgICAgcmVzb2x2ZWRQcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5mb3JtR3JvdXAucmVtb3ZlQ29udHJvbCgncHJvcFZhbHVlJyk7XG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgZ2V0VmFsdWUoKTogVmFsdWUge1xuXG4gICAgICAgIGNvbnN0IGRhdGVPYmo6IEpETkNvbnZlcnRpYmxlQ2FsZW5kYXIgPSB0aGlzLmZvcm0udmFsdWUuZGF0ZVZhbHVlO1xuXG4gICAgICAgIC8vIGdldCBjYWxlbmRhciBmb3JtYXRcbiAgICAgICAgY29uc3QgY2FsZW5kYXJGb3JtYXQgPSBkYXRlT2JqLmNhbGVuZGFyTmFtZTtcbiAgICAgICAgLy8gZ2V0IGNhbGVuZGFyIHBlcmlvZFxuICAgICAgICBjb25zdCBjYWxlbmRhclBlcmlvZCA9IGRhdGVPYmoudG9DYWxlbmRhclBlcmlvZCgpO1xuICAgICAgICAvLyBnZXQgdGhlIGRhdGVcbiAgICAgICAgY29uc3QgZGF0ZVN0cmluZyA9IGAke2NhbGVuZGFyRm9ybWF0LnRvVXBwZXJDYXNlKCl9OiR7Y2FsZW5kYXJQZXJpb2QucGVyaW9kU3RhcnQueWVhcn0tJHtjYWxlbmRhclBlcmlvZC5wZXJpb2RTdGFydC5tb250aH0tJHtjYWxlbmRhclBlcmlvZC5wZXJpb2RTdGFydC5kYXl9OiR7Y2FsZW5kYXJQZXJpb2QucGVyaW9kRW5kLnllYXJ9LSR7Y2FsZW5kYXJQZXJpb2QucGVyaW9kRW5kLm1vbnRofS0ke2NhbGVuZGFyUGVyaW9kLnBlcmlvZEVuZC5kYXl9YDtcblxuICAgICAgICByZXR1cm4gbmV3IFZhbHVlTGl0ZXJhbChTdHJpbmcoZGF0ZVN0cmluZyksIEtub3JhQ29uc3RhbnRzLkRhdGVWYWx1ZSk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBJbmplY3QsIElucHV0LCBPbkRlc3Ryb3ksIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRm9ybUJ1aWxkZXIsIEZvcm1Hcm91cCwgVmFsaWRhdG9ycyB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IEtub3JhQ29uc3RhbnRzLCBQcm9wZXJ0eVZhbHVlLCBWYWx1ZSwgVmFsdWVMaXRlcmFsIH0gZnJvbSAnQGtub3JhL2NvcmUnO1xuXG4vLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy80NTY2MTAxMC9keW5hbWljLW5lc3RlZC1yZWFjdGl2ZS1mb3JtLWV4cHJlc3Npb25jaGFuZ2VkYWZ0ZXJpdGhhc2JlZW5jaGVja2VkZXJyb3JcbmNvbnN0IHJlc29sdmVkUHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZShudWxsKTtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdkZWNpbWFsLXZhbHVlJyxcbiAgICB0ZW1wbGF0ZTogYDxtYXQtZm9ybS1maWVsZD5cbiAgICA8aW5wdXQgbWF0SW5wdXQgW2Zvcm1Db250cm9sXT1cImZvcm0uY29udHJvbHNbJ2RlY2ltYWxWYWx1ZSddXCIgcGxhY2Vob2xkZXI9XCJEZWNpbWFsIHZhbHVlXCIgdmFsdWU9XCJcIiB0eXBlPVwibnVtYmVyXCI+XG48L21hdC1mb3JtLWZpZWxkPlxuYCxcbiAgICBzdHlsZXM6IFtgYF1cbn0pXG5leHBvcnQgY2xhc3MgRGVjaW1hbFZhbHVlQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3ksIFByb3BlcnR5VmFsdWUge1xuXG4gICAgLy8gcGFyZW50IEZvcm1Hcm91cFxuICAgIEBJbnB1dCgpIGZvcm1Hcm91cDogRm9ybUdyb3VwO1xuXG4gICAgdHlwZSA9IEtub3JhQ29uc3RhbnRzLkRlY2ltYWxWYWx1ZTtcblxuICAgIGZvcm06IEZvcm1Hcm91cDtcblxuICAgIGNvbnN0cnVjdG9yKEBJbmplY3QoRm9ybUJ1aWxkZXIpIHByaXZhdGUgZmI6IEZvcm1CdWlsZGVyKSB7XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKSB7XG5cbiAgICAgICAgdGhpcy5mb3JtID0gdGhpcy5mYi5ncm91cCh7XG4gICAgICAgICAgICBkZWNpbWFsVmFsdWU6IFtudWxsLCBWYWxpZGF0b3JzLmNvbXBvc2UoW1ZhbGlkYXRvcnMucmVxdWlyZWRdKV1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmVzb2x2ZWRQcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgLy8gYWRkIGZvcm0gdG8gdGhlIHBhcmVudCBmb3JtIGdyb3VwXG4gICAgICAgICAgICB0aGlzLmZvcm1Hcm91cC5hZGRDb250cm9sKCdwcm9wVmFsdWUnLCB0aGlzLmZvcm0pO1xuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCkge1xuXG4gICAgICAgIC8vIHJlbW92ZSBmb3JtIGZyb20gdGhlIHBhcmVudCBmb3JtIGdyb3VwXG4gICAgICAgIHJlc29sdmVkUHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZm9ybUdyb3VwLnJlbW92ZUNvbnRyb2woJ3Byb3BWYWx1ZScpO1xuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIGdldFZhbHVlKCk6IFZhbHVlIHtcblxuICAgICAgICByZXR1cm4gbmV3IFZhbHVlTGl0ZXJhbChTdHJpbmcodGhpcy5mb3JtLnZhbHVlLmRlY2ltYWxWYWx1ZSksIEtub3JhQ29uc3RhbnRzLnhzZERlY2ltYWwpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IENvbXBvbmVudCwgSW5qZWN0LCBJbnB1dCwgT25EZXN0cm95LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEZvcm1CdWlsZGVyLCBGb3JtR3JvdXAsIFZhbGlkYXRvcnMgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBLbm9yYUNvbnN0YW50cywgUHJvcGVydHlWYWx1ZSwgVmFsdWUsIFZhbHVlTGl0ZXJhbCB9IGZyb20gJ0Brbm9yYS9jb3JlJztcblxuLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNDU2NjEwMTAvZHluYW1pYy1uZXN0ZWQtcmVhY3RpdmUtZm9ybS1leHByZXNzaW9uY2hhbmdlZGFmdGVyaXRoYXNiZWVuY2hlY2tlZGVycm9yXG5jb25zdCByZXNvbHZlZFByb21pc2UgPSBQcm9taXNlLnJlc29sdmUobnVsbCk7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnaW50ZWdlci12YWx1ZScsXG4gICAgdGVtcGxhdGU6IGA8bWF0LWZvcm0tZmllbGQ+XG4gICAgPGlucHV0IG1hdElucHV0IFtmb3JtQ29udHJvbF09XCJmb3JtLmNvbnRyb2xzWydpbnRlZ2VyVmFsdWUnXVwiIHBsYWNlaG9sZGVyPVwiSW50ZWdlciB2YWx1ZVwiIHZhbHVlPVwiXCIgdHlwZT1cIm51bWJlclwiPlxuPC9tYXQtZm9ybS1maWVsZD5cbmAsXG4gICAgc3R5bGVzOiBbYGBdXG59KVxuZXhwb3J0IGNsYXNzIEludGVnZXJWYWx1ZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95LCBQcm9wZXJ0eVZhbHVlIHtcblxuICAgIC8vIHBhcmVudCBGb3JtR3JvdXBcbiAgICBASW5wdXQoKSBmb3JtR3JvdXA6IEZvcm1Hcm91cDtcblxuICAgIHR5cGUgPSBLbm9yYUNvbnN0YW50cy5JbnRWYWx1ZTtcblxuICAgIGZvcm06IEZvcm1Hcm91cDtcblxuICAgIGNvbnN0cnVjdG9yKEBJbmplY3QoRm9ybUJ1aWxkZXIpIHByaXZhdGUgZmI6IEZvcm1CdWlsZGVyKSB7XG5cbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHtcblxuICAgICAgICB0aGlzLmZvcm0gPSB0aGlzLmZiLmdyb3VwKHtcbiAgICAgICAgICAgIGludGVnZXJWYWx1ZTogW251bGwsIFZhbGlkYXRvcnMuY29tcG9zZShbVmFsaWRhdG9ycy5yZXF1aXJlZCwgVmFsaWRhdG9ycy5wYXR0ZXJuKC9eLT9cXGQrJC8pXSldIC8vIG9ubHkgYWxsb3cgZm9yIGludGVnZXIgdmFsdWVzIChubyBmcmFjdGlvbnMpXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJlc29sdmVkUHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIC8vIGFkZCBmb3JtIHRvIHRoZSBwYXJlbnQgZm9ybSBncm91cFxuICAgICAgICAgICAgdGhpcy5mb3JtR3JvdXAuYWRkQ29udHJvbCgncHJvcFZhbHVlJywgdGhpcy5mb3JtKTtcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcblxuICAgICAgICAvLyByZW1vdmUgZm9ybSBmcm9tIHRoZSBwYXJlbnQgZm9ybSBncm91cFxuICAgICAgICByZXNvbHZlZFByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZvcm1Hcm91cC5yZW1vdmVDb250cm9sKCdwcm9wVmFsdWUnKTtcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBnZXRWYWx1ZSgpOiBWYWx1ZSB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBWYWx1ZUxpdGVyYWwoU3RyaW5nKHRoaXMuZm9ybS52YWx1ZS5pbnRlZ2VyVmFsdWUpLCBLbm9yYUNvbnN0YW50cy54c2RJbnRlZ2VyKTtcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IENvbXBvbmVudCwgSW5qZWN0LCBJbnB1dCwgT25EZXN0cm95LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEZvcm1CdWlsZGVyLCBGb3JtQ29udHJvbCwgRm9ybUdyb3VwLCBWYWxpZGF0b3JzIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtcbiAgICBBcGlTZXJ2aWNlUmVzdWx0LFxuICAgIENvbnZlcnRKU09OTEQsXG4gICAgSVJJLFxuICAgIEtub3JhQ29uc3RhbnRzLFxuICAgIE9udG9sb2d5Q2FjaGVTZXJ2aWNlLFxuICAgIFByb3BlcnR5VmFsdWUsXG4gICAgUmVhZFJlc291cmNlLFxuICAgIFJlYWRSZXNvdXJjZXNTZXF1ZW5jZSxcbiAgICBTZWFyY2hTZXJ2aWNlLFxuICAgIFZhbHVlXG59IGZyb20gJ0Brbm9yYS9jb3JlJztcblxuZGVjbGFyZSBsZXQgcmVxdWlyZTogYW55OyAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzM0NzMwMDEwL2FuZ3VsYXIyLTUtbWludXRlLWluc3RhbGwtYnVnLXJlcXVpcmUtaXMtbm90LWRlZmluZWRcbmNvbnN0IGpzb25sZCA9IHJlcXVpcmUoJ2pzb25sZCcpO1xuXG4vLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy80NTY2MTAxMC9keW5hbWljLW5lc3RlZC1yZWFjdGl2ZS1mb3JtLWV4cHJlc3Npb25jaGFuZ2VkYWZ0ZXJpdGhhc2JlZW5jaGVja2VkZXJyb3JcbmNvbnN0IHJlc29sdmVkUHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZShudWxsKTtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdsaW5rLXZhbHVlJyxcbiAgICB0ZW1wbGF0ZTogYDxtYXQtZm9ybS1maWVsZD5cbiAgICA8aW5wdXQgbWF0SW5wdXQgcGxhY2Vob2xkZXI9XCJyZXNvdXJjZVwiIGFyaWEtbGFiZWw9XCJyZXNvdXJjZVwiIFttYXRBdXRvY29tcGxldGVdPVwiYXV0b1wiIFtmb3JtQ29udHJvbF09XCJmb3JtLmNvbnRyb2xzWydyZXNvdXJjZSddXCI+XG4gICAgPG1hdC1hdXRvY29tcGxldGUgI2F1dG89XCJtYXRBdXRvY29tcGxldGVcIiBbZGlzcGxheVdpdGhdPVwiZGlzcGxheVJlc291cmNlXCI+XG4gICAgICAgIDxtYXQtb3B0aW9uICpuZ0Zvcj1cImxldCByZXMgb2YgcmVzb3VyY2VzXCIgW3ZhbHVlXT1cInJlc1wiPlxuICAgICAgICAgICAge3tyZXM/LmxhYmVsfX1cbiAgICAgICAgPC9tYXQtb3B0aW9uPlxuICAgIDwvbWF0LWF1dG9jb21wbGV0ZT5cbjwvbWF0LWZvcm0tZmllbGQ+XG5gLFxuICAgIHN0eWxlczogW2BgXVxufSlcbmV4cG9ydCBjbGFzcyBMaW5rVmFsdWVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgUHJvcGVydHlWYWx1ZSB7XG5cbiAgICAvLyBwYXJlbnQgRm9ybUdyb3VwXG4gICAgQElucHV0KCkgZm9ybUdyb3VwOiBGb3JtR3JvdXA7XG5cbiAgICB0eXBlID0gS25vcmFDb25zdGFudHMuTGlua1ZhbHVlO1xuXG4gICAgZm9ybTogRm9ybUdyb3VwO1xuXG4gICAgcmVzb3VyY2VzOiBSZWFkUmVzb3VyY2VbXTtcblxuICAgIHByaXZhdGUgX3Jlc3RyaWN0VG9SZXNvdXJjZUNsYXNzOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKVxuICAgIHNldCByZXN0cmljdFJlc291cmNlQ2xhc3ModmFsdWU6IHN0cmluZykge1xuICAgICAgICB0aGlzLl9yZXN0cmljdFRvUmVzb3VyY2VDbGFzcyA9IHZhbHVlO1xuICAgIH1cblxuICAgIGdldCByZXN0cmljdFJlc291cmNlQ2xhc3MoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9yZXN0cmljdFRvUmVzb3VyY2VDbGFzcztcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihASW5qZWN0KEZvcm1CdWlsZGVyKSBwcml2YXRlIGZiOiBGb3JtQnVpbGRlciwgcHJpdmF0ZSBfc2VhcmNoU2VydmljZTogU2VhcmNoU2VydmljZSwgcHJpdmF0ZSBfY2FjaGVTZXJ2aWNlOiBPbnRvbG9neUNhY2hlU2VydmljZSkge1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRGlzcGxheXMgYSBzZWxlY3RlZCByZXNvdXJjZSB1c2luZyBpdHMgbGFiZWwuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcmVzb3VyY2UgdGhlIHJlc291cmNlIHRvIGJlIGRpc3BsYXllZCAob3Igbm8gc2VsZWN0aW9uIHlldCkuXG4gICAgICogQHJldHVybnNcbiAgICAgKi9cbiAgICBkaXNwbGF5UmVzb3VyY2UocmVzb3VyY2U6IFJlYWRSZXNvdXJjZSB8IG51bGwpIHtcblxuICAgICAgICAvLyBudWxsIGlzIHRoZSBpbml0aWFsIHZhbHVlIChubyBzZWxlY3Rpb24geWV0KVxuICAgICAgICBpZiAocmVzb3VyY2UgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNvdXJjZS5sYWJlbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNlYXJjaCBmb3IgcmVzb3VyY2VzIHdob3NlIGxhYmVscyBjb250YWluIHRoZSBnaXZlbiBzZWFyY2ggdGVybSwgcmVzdHJpY3RpbmcgdG8gdG8gdGhlIGdpdmVuIHByb3BlcnRpZXMgb2JqZWN0IGNvbnN0cmFpbnQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc2VhcmNoVGVybVxuICAgICAqL1xuICAgIHNlYXJjaEJ5TGFiZWwoc2VhcmNoVGVybTogc3RyaW5nKSB7XG5cbiAgICAgICAgLy8gYXQgbGVhc3QgMyBjaGFyYWN0ZXJzIGFyZSByZXF1aXJlZFxuICAgICAgICBpZiAoc2VhcmNoVGVybS5sZW5ndGggPj0gMykge1xuXG4gICAgICAgICAgICB0aGlzLl9zZWFyY2hTZXJ2aWNlLnNlYXJjaEJ5TGFiZWxSZWFkUmVzb3VyY2VTZXF1ZW5jZShzZWFyY2hUZXJtLCB0aGlzLl9yZXN0cmljdFRvUmVzb3VyY2VDbGFzcykuc3Vic2NyaWJlKFxuICAgICAgICAgICAgICAgIChyZXN1bHQ6IFJlYWRSZXNvdXJjZXNTZXF1ZW5jZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc291cmNlcyA9IHJlc3VsdC5yZXNvdXJjZXM7XG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnSlNPTkxEIG9mIGZ1bGwgcmVzb3VyY2UgcmVxdWVzdCBjb3VsZCBub3QgYmUgZXhwYW5kZWQ6JyArIGVycik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGNsZWFyIHNlbGVjdGlvblxuICAgICAgICAgICAgdGhpcy5yZXNvdXJjZXMgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyB0aGF0IHRoZSBzZWxlY3Rpb24gaXMgYSBbW1JlYWRSZXNvdXJjZV1dLlxuICAgICAqXG4gICAgICogU3VycHJpc2luZ2x5LCBbbnVsbF0gaGFzIHRvIGJlIHJldHVybmVkIGlmIHRoZSB2YWx1ZSBpcyB2YWxpZDogaHR0cHM6Ly9hbmd1bGFyLmlvL2d1aWRlL2Zvcm0tdmFsaWRhdGlvbiNjdXN0b20tdmFsaWRhdG9yc1xuICAgICAqXG4gICAgICogQHBhcmFtIHRoZSBmb3JtIGVsZW1lbnQgd2hvc2UgdmFsdWUgaGFzIHRvIGJlIGNoZWNrZWQuXG4gICAgICogQHJldHVybnNcbiAgICAgKi9cbiAgICB2YWxpZGF0ZVJlc291cmNlKGM6IEZvcm1Db250cm9sKSB7XG5cbiAgICAgICAgY29uc3QgaXNWYWxpZFJlc291cmNlID0gKGMudmFsdWUgaW5zdGFuY2VvZiBSZWFkUmVzb3VyY2UpO1xuXG4gICAgICAgIGlmIChpc1ZhbGlkUmVzb3VyY2UpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBub1Jlc291cmNlOiB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBjLnZhbHVlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgbmdPbkluaXQoKSB7XG4gICAgICAgIHRoaXMuZm9ybSA9IHRoaXMuZmIuZ3JvdXAoe1xuICAgICAgICAgICAgcmVzb3VyY2U6IFtudWxsLCBWYWxpZGF0b3JzLmNvbXBvc2UoW1xuICAgICAgICAgICAgICAgIFZhbGlkYXRvcnMucmVxdWlyZWQsXG4gICAgICAgICAgICAgICAgdGhpcy52YWxpZGF0ZVJlc291cmNlXG4gICAgICAgICAgICBdKV1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5mb3JtLnZhbHVlQ2hhbmdlcy5zdWJzY3JpYmUoKGRhdGEpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2VhcmNoQnlMYWJlbChkYXRhLnJlc291cmNlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmVzb2x2ZWRQcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgLy8gYWRkIGZvcm0gdG8gdGhlIHBhcmVudCBmb3JtIGdyb3VwXG4gICAgICAgICAgICB0aGlzLmZvcm1Hcm91cC5hZGRDb250cm9sKCdwcm9wVmFsdWUnLCB0aGlzLmZvcm0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcblxuICAgICAgICAvLyByZW1vdmUgZm9ybSBmcm9tIHRoZSBwYXJlbnQgZm9ybSBncm91cFxuICAgICAgICByZXNvbHZlZFByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZvcm1Hcm91cC5yZW1vdmVDb250cm9sKCdwcm9wVmFsdWUnKTtcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBnZXRWYWx1ZSgpOiBWYWx1ZSB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBJUkkodGhpcy5mb3JtLnZhbHVlLnJlc291cmNlLmlkKTtcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IENvbXBvbmVudCwgSW5qZWN0LCBJbnB1dCwgT25EZXN0cm95LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgRm9ybUJ1aWxkZXIsIEZvcm1Hcm91cCwgVmFsaWRhdG9ycyB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IEtub3JhQ29uc3RhbnRzLCBQcm9wZXJ0eVZhbHVlLCBWYWx1ZSwgVmFsdWVMaXRlcmFsIH0gZnJvbSAnQGtub3JhL2NvcmUnO1xuXG4vLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy80NTY2MTAxMC9keW5hbWljLW5lc3RlZC1yZWFjdGl2ZS1mb3JtLWV4cHJlc3Npb25jaGFuZ2VkYWZ0ZXJpdGhhc2JlZW5jaGVja2VkZXJyb3JcbmNvbnN0IHJlc29sdmVkUHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZShudWxsKTtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICd0ZXh0LXZhbHVlJyxcbiAgICB0ZW1wbGF0ZTogYDxtYXQtZm9ybS1maWVsZD5cbiAgICA8aW5wdXQgbWF0SW5wdXQgW2Zvcm1Db250cm9sXT1cImZvcm0uY29udHJvbHNbJ3RleHRWYWx1ZSddXCIgcGxhY2Vob2xkZXI9XCJ0ZXh0IHZhbHVlXCIgdmFsdWU9XCJcIj5cbjwvbWF0LWZvcm0tZmllbGQ+XG5gLFxuICAgIHN0eWxlczogW2BgXVxufSlcbmV4cG9ydCBjbGFzcyBUZXh0VmFsdWVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgUHJvcGVydHlWYWx1ZSB7XG5cbiAgICAvLyBwYXJlbnQgRm9ybUdyb3VwXG4gICAgQElucHV0KCkgZm9ybUdyb3VwOiBGb3JtR3JvdXA7XG5cbiAgICB0eXBlID0gS25vcmFDb25zdGFudHMuVGV4dFZhbHVlO1xuXG4gICAgZm9ybTogRm9ybUdyb3VwO1xuXG4gICAgY29uc3RydWN0b3IoQEluamVjdChGb3JtQnVpbGRlcikgcHJpdmF0ZSBmYjogRm9ybUJ1aWxkZXIpIHtcblxuICAgIH1cblxuICAgIG5nT25Jbml0KCkge1xuXG4gICAgICAgIHRoaXMuZm9ybSA9IHRoaXMuZmIuZ3JvdXAoe1xuICAgICAgICAgICAgdGV4dFZhbHVlOiBbbnVsbCwgVmFsaWRhdG9ycy5yZXF1aXJlZF1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmVzb2x2ZWRQcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgLy8gYWRkIGZvcm0gdG8gdGhlIHBhcmVudCBmb3JtIGdyb3VwXG4gICAgICAgICAgICB0aGlzLmZvcm1Hcm91cC5hZGRDb250cm9sKCdwcm9wVmFsdWUnLCB0aGlzLmZvcm0pO1xuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCkge1xuXG4gICAgICAgIC8vIHJlbW92ZSBmb3JtIGZyb20gdGhlIHBhcmVudCBmb3JtIGdyb3VwXG4gICAgICAgIHJlc29sdmVkUHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZm9ybUdyb3VwLnJlbW92ZUNvbnRyb2woJ3Byb3BWYWx1ZScpO1xuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIGdldFZhbHVlKCk6IFZhbHVlIHtcblxuICAgICAgICByZXR1cm4gbmV3IFZhbHVlTGl0ZXJhbChTdHJpbmcodGhpcy5mb3JtLnZhbHVlLnRleHRWYWx1ZSksIEtub3JhQ29uc3RhbnRzLnhzZFN0cmluZyk7XG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIEluamVjdCwgSW5wdXQsIE9uRGVzdHJveSwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IEZvcm1CdWlsZGVyLCBGb3JtR3JvdXAsIFZhbGlkYXRvcnMgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBLbm9yYUNvbnN0YW50cywgUHJvcGVydHlWYWx1ZSwgVXRpbHMsIFZhbHVlLCBWYWx1ZUxpdGVyYWwgfSBmcm9tICdAa25vcmEvY29yZSc7XG5cbi8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzQ1NjYxMDEwL2R5bmFtaWMtbmVzdGVkLXJlYWN0aXZlLWZvcm0tZXhwcmVzc2lvbmNoYW5nZWRhZnRlcml0aGFzYmVlbmNoZWNrZWRlcnJvclxuY29uc3QgcmVzb2x2ZWRQcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKG51bGwpO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3VyaS12YWx1ZScsXG4gICAgdGVtcGxhdGU6IGA8bWF0LWZvcm0tZmllbGQ+XG4gICAgPGlucHV0IG1hdElucHV0IFtmb3JtQ29udHJvbF09XCJmb3JtLmNvbnRyb2xzWyd1cmlWYWx1ZSddXCIgcGxhY2Vob2xkZXI9XCJVUklcIiB2YWx1ZT1cIlwiPlxuPC9tYXQtZm9ybS1maWVsZD5cbmAsXG4gICAgc3R5bGVzOiBbYGBdXG59KVxuZXhwb3J0IGNsYXNzIFVyaVZhbHVlQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3ksIFByb3BlcnR5VmFsdWUge1xuXG4gICAgLy8gcGFyZW50IEZvcm1Hcm91cFxuICAgIEBJbnB1dCgpIGZvcm1Hcm91cDogRm9ybUdyb3VwO1xuXG4gICAgdHlwZSA9IEtub3JhQ29uc3RhbnRzLlVyaVZhbHVlO1xuXG4gICAgZm9ybTogRm9ybUdyb3VwO1xuXG4gICAgY29uc3RydWN0b3IoQEluamVjdChGb3JtQnVpbGRlcikgcHJpdmF0ZSBmYjogRm9ybUJ1aWxkZXIpIHtcblxuICAgIH1cblxuICAgIG5nT25Jbml0KCkge1xuXG4gICAgICAgIHRoaXMuZm9ybSA9IHRoaXMuZmIuZ3JvdXAoe1xuICAgICAgICAgICAgdXJpVmFsdWU6IFtudWxsLCBWYWxpZGF0b3JzLmNvbXBvc2UoW1ZhbGlkYXRvcnMucmVxdWlyZWQsIFZhbGlkYXRvcnMucGF0dGVybihVdGlscy5SZWdleFVybCldKV1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmVzb2x2ZWRQcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgLy8gYWRkIGZvcm0gdG8gdGhlIHBhcmVudCBmb3JtIGdyb3VwXG4gICAgICAgICAgICB0aGlzLmZvcm1Hcm91cC5hZGRDb250cm9sKCdwcm9wVmFsdWUnLCB0aGlzLmZvcm0pO1xuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCkge1xuXG4gICAgICAgIC8vIHJlbW92ZSBmb3JtIGZyb20gdGhlIHBhcmVudCBmb3JtIGdyb3VwXG4gICAgICAgIHJlc29sdmVkUHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZm9ybUdyb3VwLnJlbW92ZUNvbnRyb2woJ3Byb3BWYWx1ZScpO1xuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIGdldFZhbHVlKCk6IFZhbHVlIHtcblxuICAgICAgICByZXR1cm4gbmV3IFZhbHVlTGl0ZXJhbChTdHJpbmcodGhpcy5mb3JtLnZhbHVlLnVyaVZhbHVlKSwgS25vcmFDb25zdGFudHMueHNkVXJpKTtcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbmplY3QsIElucHV0LCBPbkNoYW5nZXMsIE9uSW5pdCwgT3V0cHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBGb3JtQnVpbGRlciwgRm9ybUdyb3VwLCBWYWxpZGF0b3JzIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgUmVzb3VyY2VDbGFzcyB9IGZyb20gJ0Brbm9yYS9jb3JlJztcblxuLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNDU2NjEwMTAvZHluYW1pYy1uZXN0ZWQtcmVhY3RpdmUtZm9ybS1leHByZXNzaW9uY2hhbmdlZGFmdGVyaXRoYXNiZWVuY2hlY2tlZGVycm9yXG5jb25zdCByZXNvbHZlZFByb21pc2UgPSBQcm9taXNlLnJlc29sdmUobnVsbCk7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAna3VpLXNlbGVjdC1yZXNvdXJjZS1jbGFzcycsXG4gICAgdGVtcGxhdGU6IGA8bWF0LWZvcm0tZmllbGQgKm5nSWY9XCJyZXNvdXJjZUNsYXNzZXMubGVuZ3RoID4gMFwiPlxuICA8bWF0LXNlbGVjdCBwbGFjZWhvbGRlcj1cIlJlc291cmNlIENsYXNzXCIgW2Zvcm1Db250cm9sXT1cImZvcm0uY29udHJvbHNbJ3Jlc291cmNlQ2xhc3MnXVwiPlxuICAgIDxtYXQtb3B0aW9uIFt2YWx1ZV09XCJudWxsXCI+bm8gc2VsZWN0aW9uPC9tYXQtb3B0aW9uPlxuICAgIDwhLS0gdW5kbyBzZWxlY3Rpb24gb2YgYSByZXNvdXJjZSBjbGFzcyAtLT5cbiAgICA8bWF0LW9wdGlvbiAqbmdGb3I9XCJsZXQgcmVzb3VyY2VDbGFzcyBvZiByZXNvdXJjZUNsYXNzZXNcIiBbdmFsdWVdPVwicmVzb3VyY2VDbGFzcy5pZFwiPnt7IHJlc291cmNlQ2xhc3MubGFiZWwgfX08L21hdC1vcHRpb24+XG4gIDwvbWF0LXNlbGVjdD5cbjwvbWF0LWZvcm0tZmllbGQ+YCxcbiAgICBzdHlsZXM6IFtgYF1cbn0pXG5leHBvcnQgY2xhc3MgU2VsZWN0UmVzb3VyY2VDbGFzc0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzIHtcblxuICAgIEBJbnB1dCgpIGZvcm1Hcm91cDogRm9ybUdyb3VwO1xuXG4gICAgLy8gc2V0dGVyIG1ldGhvZCBmb3IgcmVzb3VyY2UgY2xhc3NlcyB3aGVuIGJlaW5nIHVwZGF0ZWQgYnkgcGFyZW50IGNvbXBvbmVudFxuICAgIEBJbnB1dCgpXG4gICAgc2V0IHJlc291cmNlQ2xhc3Nlcyh2YWx1ZTogQXJyYXk8UmVzb3VyY2VDbGFzcz4pIHtcbiAgICAgICAgdGhpcy5yZXNvdXJjZUNsYXNzU2VsZWN0ZWQgPSB1bmRlZmluZWQ7IC8vIHJlc2V0IG9uIHVwZGF0ZXNcbiAgICAgICAgdGhpcy5fcmVzb3VyY2VDbGFzc2VzID0gdmFsdWU7XG4gICAgfVxuXG4gICAgLy8gZ2V0dGVyIG1ldGhvZCBmb3IgcmVzb3VyY2UgY2xhc3NlcyAodXNlZCBpbiB0ZW1wbGF0ZSlcbiAgICBnZXQgcmVzb3VyY2VDbGFzc2VzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcmVzb3VyY2VDbGFzc2VzO1xuICAgIH1cblxuICAgIC8vIGV2ZW50IGVtaXR0ZWQgdG8gcGFyZW50IGNvbXBvbmVudCBvbmNlIGEgcmVzb3VyY2UgY2xhc3MgaXMgc2VsZWN0ZWQgYnkgdGhlIHVzZXJcbiAgICBAT3V0cHV0KCkgcmVzb3VyY2VDbGFzc1NlbGVjdGVkRXZlbnQgPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oKTtcblxuICAgIC8vIGF2YWlsYWJsZSByZXNvdXJjZSBjbGFzc2VzIGZvciBzZWxlY3Rpb25cbiAgICBwcml2YXRlIF9yZXNvdXJjZUNsYXNzZXM6IEFycmF5PFJlc291cmNlQ2xhc3M+O1xuXG4gICAgLy8gc3RvcmVzIHRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgcmVzb3VyY2UgY2xhc3NcbiAgICBwcml2YXRlIHJlc291cmNlQ2xhc3NTZWxlY3RlZDogc3RyaW5nO1xuXG4gICAgZm9ybTogRm9ybUdyb3VwO1xuXG4gICAgY29uc3RydWN0b3IoQEluamVjdChGb3JtQnVpbGRlcikgcHJpdmF0ZSBmYjogRm9ybUJ1aWxkZXIpIHtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBJcmkgb2YgdGhlIHNlbGVjdGVkIHJlc291cmNlIGNsYXNzLlxuICAgICAqXG4gICAgICogQHJldHVybnMgdGhlIElyaSBvZiB0aGUgc2VsZWN0ZWQgcmVzb3VyY2UgY2xhc3Mgb3IgZmFsc2UgaW4gY2FzZSBubyByZXNvdXJjZSBjbGFzcyBpcyBzZWxlY3RlZC5cbiAgICAgKi9cbiAgICBnZXRSZXNvdXJjZUNsYXNzU2VsZWN0ZWQoKTogYW55IHtcbiAgICAgICAgaWYgKHRoaXMucmVzb3VyY2VDbGFzc1NlbGVjdGVkICE9PSB1bmRlZmluZWQgJiYgdGhpcy5yZXNvdXJjZUNsYXNzU2VsZWN0ZWQgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlQ2xhc3NTZWxlY3RlZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEluaXRhbGl6ZXMgdGhlIEZvcm1Hcm91cCBmb3IgdGhlIHJlc291cmNlIGNsYXNzIHNlbGVjdGlvbi5cbiAgICAgKiBUaGUgaW5pdGlhbCB2YWx1ZSBpcyBzZXQgdG8gbnVsbC5cbiAgICAgKi9cbiAgICBwcml2YXRlIGluaXRGb3JtKCkge1xuICAgICAgICAvLyBidWlsZCBhIGZvcm0gZm9yIHRoZSByZXNvdXJjZSBjbGFzcyBzZWxlY3Rpb25cbiAgICAgICAgdGhpcy5mb3JtID0gdGhpcy5mYi5ncm91cCh7XG4gICAgICAgICAgICByZXNvdXJjZUNsYXNzOiBbbnVsbF0gLy8gcmVzb3VyY2UgY2xhc3Mgc2VsZWN0aW9uIGlzIG9wdGlvbmFsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIHN0b3JlIGFuZCBlbWl0IElyaSBvZiB0aGUgcmVzb3VyY2UgY2xhc3Mgd2hlbiBzZWxlY3RlZFxuICAgICAgICB0aGlzLmZvcm0udmFsdWVDaGFuZ2VzLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5yZXNvdXJjZUNsYXNzU2VsZWN0ZWQgPSBkYXRhLnJlc291cmNlQ2xhc3M7XG4gICAgICAgICAgICB0aGlzLnJlc291cmNlQ2xhc3NTZWxlY3RlZEV2ZW50LmVtaXQodGhpcy5yZXNvdXJjZUNsYXNzU2VsZWN0ZWQpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHtcblxuICAgICAgICB0aGlzLmluaXRGb3JtKCk7XG5cbiAgICAgICAgLy8gYWRkIGZvcm0gdG8gdGhlIHBhcmVudCBmb3JtIGdyb3VwXG4gICAgICAgIHRoaXMuZm9ybUdyb3VwLmFkZENvbnRyb2woJ3Jlc291cmNlQ2xhc3MnLCB0aGlzLmZvcm0pO1xuXG4gICAgfVxuXG4gICAgbmdPbkNoYW5nZXMoKSB7XG5cbiAgICAgICAgaWYgKHRoaXMuZm9ybSAhPT0gdW5kZWZpbmVkKSB7XG5cbiAgICAgICAgICAgIC8vIHJlc291cmNlIGNsYXNzZXMgaGF2ZSBiZWVuIHJlaW5pdGlhbGl6ZWRcbiAgICAgICAgICAgIC8vIHJlc2V0IGZvcm1cbiAgICAgICAgICAgIHJlc29sdmVkUHJvbWlzZS50aGVuKCgpID0+IHtcblxuICAgICAgICAgICAgICAgIC8vIHJlbW92ZSB0aGlzIGZvcm0gZnJvbSB0aGUgcGFyZW50IGZvcm0gZ3JvdXBcbiAgICAgICAgICAgICAgICB0aGlzLmZvcm1Hcm91cC5yZW1vdmVDb250cm9sKCdyZXNvdXJjZUNsYXNzJyk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmluaXRGb3JtKCk7XG5cbiAgICAgICAgICAgICAgICAvLyBhZGQgZm9ybSB0byB0aGUgcGFyZW50IGZvcm0gZ3JvdXBcbiAgICAgICAgICAgICAgICB0aGlzLmZvcm1Hcm91cC5hZGRDb250cm9sKCdyZXNvdXJjZUNsYXNzJywgdGhpcy5mb3JtKTtcblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBCcm93c2VyQW5pbWF0aW9uc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXIvYW5pbWF0aW9ucyc7XG5pbXBvcnQge1xuICAgIE1hdEF1dG9jb21wbGV0ZU1vZHVsZSxcbiAgICBNYXRCdXR0b25Nb2R1bGUsXG4gICAgTWF0Q2hlY2tib3hNb2R1bGUsXG4gICAgTWF0RGF0ZXBpY2tlck1vZHVsZSxcbiAgICBNYXRGb3JtRmllbGRNb2R1bGUsXG4gICAgTWF0SWNvbk1vZHVsZSwgTWF0SW5wdXRNb2R1bGUsXG4gICAgTWF0TGlzdE1vZHVsZSxcbiAgICBNYXRTZWxlY3RNb2R1bGUsXG4gICAgTWF0VG9vbHRpcE1vZHVsZVxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbCc7XG5cbmltcG9ydCB7IEZvcm1zTW9kdWxlLCBSZWFjdGl2ZUZvcm1zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgS3VpQ29yZU1vZHVsZSB9IGZyb20gJ0Brbm9yYS9jb3JlJztcbmltcG9ydCB7IEt1aUFjdGlvbk1vZHVsZSB9IGZyb20gJ0Brbm9yYS9hY3Rpb24nO1xuaW1wb3J0IHsgS3VpVmlld2VyTW9kdWxlIH0gZnJvbSAnQGtub3JhL3ZpZXdlcic7XG5cbmltcG9ydCB7IE1hdEpETkNvbnZlcnRpYmxlQ2FsZW5kYXJEYXRlQWRhcHRlck1vZHVsZSB9IGZyb20gJ2pkbmNvbnZlcnRpYmxlY2FsZW5kYXJkYXRlYWRhcHRlcic7XG5cbmltcG9ydCB7IFNlYXJjaENvbXBvbmVudCB9IGZyb20gJy4vc2VhcmNoLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBGdWxsdGV4dFNlYXJjaENvbXBvbmVudCB9IGZyb20gJy4vZnVsbHRleHQtc2VhcmNoL2Z1bGx0ZXh0LXNlYXJjaC5jb21wb25lbnQnO1xuaW1wb3J0IHsgU2VhcmNoUGFuZWxDb21wb25lbnQgfSBmcm9tICcuL3NlYXJjaC1wYW5lbC9zZWFyY2gtcGFuZWwuY29tcG9uZW50JztcbmltcG9ydCB7IEV4dGVuZGVkU2VhcmNoQ29tcG9uZW50IH0gZnJvbSAnLi9leHRlbmRlZC1zZWFyY2gvZXh0ZW5kZWQtc2VhcmNoLmNvbXBvbmVudCc7XG5cbmltcG9ydCB7IFNlbGVjdE9udG9sb2d5Q29tcG9uZW50IH0gZnJvbSAnLi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LW9udG9sb2d5L3NlbGVjdC1vbnRvbG9neS5jb21wb25lbnQnO1xuaW1wb3J0IHsgU2VsZWN0UmVzb3VyY2VDbGFzc0NvbXBvbmVudCB9IGZyb20gJy4vZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1yZXNvdXJjZS1jbGFzcy9zZWxlY3QtcmVzb3VyY2UtY2xhc3MuY29tcG9uZW50JztcbmltcG9ydCB7IFNlbGVjdFByb3BlcnR5Q29tcG9uZW50IH0gZnJvbSAnLi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXByb3BlcnR5L3NlbGVjdC1wcm9wZXJ0eS5jb21wb25lbnQnO1xuaW1wb3J0IHsgU3BlY2lmeVByb3BlcnR5VmFsdWVDb21wb25lbnQgfSBmcm9tICcuL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3QtcHJvcGVydHkvc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZS9zcGVjaWZ5LXByb3BlcnR5LXZhbHVlLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBCb29sZWFuVmFsdWVDb21wb25lbnQgfSBmcm9tICcuL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3QtcHJvcGVydHkvc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZS9ib29sZWFuLXZhbHVlL2Jvb2xlYW4tdmFsdWUuY29tcG9uZW50JztcbmltcG9ydCB7IERhdGVWYWx1ZUNvbXBvbmVudCB9IGZyb20gJy4vZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1wcm9wZXJ0eS9zcGVjaWZ5LXByb3BlcnR5LXZhbHVlL2RhdGUtdmFsdWUvZGF0ZS12YWx1ZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgRGVjaW1hbFZhbHVlQ29tcG9uZW50IH0gZnJvbSAnLi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXByb3BlcnR5L3NwZWNpZnktcHJvcGVydHktdmFsdWUvZGVjaW1hbC12YWx1ZS9kZWNpbWFsLXZhbHVlLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBJbnRlZ2VyVmFsdWVDb21wb25lbnQgfSBmcm9tICcuL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3QtcHJvcGVydHkvc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZS9pbnRlZ2VyLXZhbHVlL2ludGVnZXItdmFsdWUuY29tcG9uZW50JztcbmltcG9ydCB7IExpbmtWYWx1ZUNvbXBvbmVudCB9IGZyb20gJy4vZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1wcm9wZXJ0eS9zcGVjaWZ5LXByb3BlcnR5LXZhbHVlL2xpbmstdmFsdWUvbGluay12YWx1ZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgVGV4dFZhbHVlQ29tcG9uZW50IH0gZnJvbSAnLi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXByb3BlcnR5L3NwZWNpZnktcHJvcGVydHktdmFsdWUvdGV4dC12YWx1ZS90ZXh0LXZhbHVlLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBVcmlWYWx1ZUNvbXBvbmVudCB9IGZyb20gJy4vZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1wcm9wZXJ0eS9zcGVjaWZ5LXByb3BlcnR5LXZhbHVlL3VyaS12YWx1ZS91cmktdmFsdWUuY29tcG9uZW50JztcbmltcG9ydCB7IEhlYWRlckNvbXBvbmVudCB9IGZyb20gJy4vZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1wcm9wZXJ0eS9zcGVjaWZ5LXByb3BlcnR5LXZhbHVlL2RhdGUtdmFsdWUvaGVhZGVyLWNhbGVuZGFyL2hlYWRlci1jYWxlbmRhci5jb21wb25lbnQnO1xuXG5cbkBOZ01vZHVsZSh7XG4gICAgaW1wb3J0czogW1xuICAgICAgICBDb21tb25Nb2R1bGUsXG4gICAgICAgIEJyb3dzZXJBbmltYXRpb25zTW9kdWxlLFxuICAgICAgICBNYXRBdXRvY29tcGxldGVNb2R1bGUsXG4gICAgICAgIE1hdEJ1dHRvbk1vZHVsZSxcbiAgICAgICAgTWF0Q2hlY2tib3hNb2R1bGUsXG4gICAgICAgIE1hdERhdGVwaWNrZXJNb2R1bGUsXG4gICAgICAgIE1hdEZvcm1GaWVsZE1vZHVsZSxcbiAgICAgICAgTWF0SW5wdXRNb2R1bGUsXG4gICAgICAgIE1hdEljb25Nb2R1bGUsXG4gICAgICAgIE1hdExpc3RNb2R1bGUsXG4gICAgICAgIE1hdFNlbGVjdE1vZHVsZSxcbiAgICAgICAgTWF0VG9vbHRpcE1vZHVsZSxcbiAgICAgICAgRm9ybXNNb2R1bGUsXG4gICAgICAgIFJlYWN0aXZlRm9ybXNNb2R1bGUsXG4gICAgICAgIEt1aUNvcmVNb2R1bGUsXG4gICAgICAgIEt1aUFjdGlvbk1vZHVsZSxcbiAgICAgICAgS3VpVmlld2VyTW9kdWxlLFxuICAgICAgICBNYXRKRE5Db252ZXJ0aWJsZUNhbGVuZGFyRGF0ZUFkYXB0ZXJNb2R1bGVcbiAgICBdLFxuICAgIGRlY2xhcmF0aW9uczogW1xuICAgICAgICBTZWFyY2hDb21wb25lbnQsXG4gICAgICAgIFNlbGVjdE9udG9sb2d5Q29tcG9uZW50LFxuICAgICAgICBFeHRlbmRlZFNlYXJjaENvbXBvbmVudCxcbiAgICAgICAgU2VsZWN0UmVzb3VyY2VDbGFzc0NvbXBvbmVudCxcbiAgICAgICAgU2VsZWN0UHJvcGVydHlDb21wb25lbnQsXG4gICAgICAgIFNwZWNpZnlQcm9wZXJ0eVZhbHVlQ29tcG9uZW50LFxuICAgICAgICBCb29sZWFuVmFsdWVDb21wb25lbnQsXG4gICAgICAgIERhdGVWYWx1ZUNvbXBvbmVudCxcbiAgICAgICAgRGVjaW1hbFZhbHVlQ29tcG9uZW50LFxuICAgICAgICBJbnRlZ2VyVmFsdWVDb21wb25lbnQsXG4gICAgICAgIExpbmtWYWx1ZUNvbXBvbmVudCxcbiAgICAgICAgVGV4dFZhbHVlQ29tcG9uZW50LFxuICAgICAgICBVcmlWYWx1ZUNvbXBvbmVudCxcbiAgICAgICAgSGVhZGVyQ29tcG9uZW50LFxuICAgICAgICBGdWxsdGV4dFNlYXJjaENvbXBvbmVudCxcbiAgICAgICAgU2VhcmNoUGFuZWxDb21wb25lbnRcbiAgICBdLFxuICAgIGV4cG9ydHM6IFtcbiAgICAgICAgU2VhcmNoQ29tcG9uZW50LFxuICAgICAgICBTZWFyY2hQYW5lbENvbXBvbmVudCxcbiAgICAgICAgRnVsbHRleHRTZWFyY2hDb21wb25lbnQsXG4gICAgICAgIEV4dGVuZGVkU2VhcmNoQ29tcG9uZW50LFxuICAgICAgICBEYXRlVmFsdWVDb21wb25lbnRcbiAgICBdLFxuICAgIGVudHJ5Q29tcG9uZW50czogW1xuICAgICAgICBIZWFkZXJDb21wb25lbnRcbiAgICBdXG59KVxuZXhwb3J0IGNsYXNzIEt1aVNlYXJjaE1vZHVsZSB7XG59XG4iLCIvKlxuICogUHVibGljIEFQSSBTdXJmYWNlIG9mIHNlYXJjaFxuICovXG5cbmV4cG9ydCAqIGZyb20gJy4vbGliL3NlYXJjaC5jb21wb25lbnQnO1xuZXhwb3J0ICogZnJvbSAnLi9saWIvc2VhcmNoLXBhbmVsL3NlYXJjaC1wYW5lbC5jb21wb25lbnQnO1xuZXhwb3J0ICogZnJvbSAnLi9saWIvZnVsbHRleHQtc2VhcmNoL2Z1bGx0ZXh0LXNlYXJjaC5jb21wb25lbnQnO1xuXG5leHBvcnQgKiBmcm9tICcuL2xpYi9leHRlbmRlZC1zZWFyY2gvZXh0ZW5kZWQtc2VhcmNoLmNvbXBvbmVudCc7XG5leHBvcnQgKiBmcm9tICcuL2xpYi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LW9udG9sb2d5L3NlbGVjdC1vbnRvbG9neS5jb21wb25lbnQnO1xuZXhwb3J0ICogZnJvbSAnLi9saWIvZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1wcm9wZXJ0eS9zZWxlY3QtcHJvcGVydHkuY29tcG9uZW50JztcbmV4cG9ydCAqIGZyb20gJy4vbGliL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3QtcHJvcGVydHkvc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZS9zcGVjaWZ5LXByb3BlcnR5LXZhbHVlLmNvbXBvbmVudCc7XG5leHBvcnQgKiBmcm9tICcuL2xpYi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXByb3BlcnR5L3NwZWNpZnktcHJvcGVydHktdmFsdWUvYm9vbGVhbi12YWx1ZS9ib29sZWFuLXZhbHVlLmNvbXBvbmVudCc7XG5leHBvcnQgKiBmcm9tICcuL2xpYi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXByb3BlcnR5L3NwZWNpZnktcHJvcGVydHktdmFsdWUvZGF0ZS12YWx1ZS9kYXRlLXZhbHVlLmNvbXBvbmVudCc7XG5leHBvcnQgKiBmcm9tICcuL2xpYi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXByb3BlcnR5L3NwZWNpZnktcHJvcGVydHktdmFsdWUvZGF0ZS12YWx1ZS9oZWFkZXItY2FsZW5kYXIvaGVhZGVyLWNhbGVuZGFyLmNvbXBvbmVudCc7XG5leHBvcnQgKiBmcm9tICcuL2xpYi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXByb3BlcnR5L3NwZWNpZnktcHJvcGVydHktdmFsdWUvZGVjaW1hbC12YWx1ZS9kZWNpbWFsLXZhbHVlLmNvbXBvbmVudCc7XG5leHBvcnQgKiBmcm9tICcuL2xpYi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXByb3BlcnR5L3NwZWNpZnktcHJvcGVydHktdmFsdWUvaW50ZWdlci12YWx1ZS9pbnRlZ2VyLXZhbHVlLmNvbXBvbmVudCc7XG5leHBvcnQgKiBmcm9tICcuL2xpYi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXByb3BlcnR5L3NwZWNpZnktcHJvcGVydHktdmFsdWUvbGluay12YWx1ZS9saW5rLXZhbHVlLmNvbXBvbmVudCc7XG5leHBvcnQgKiBmcm9tICcuL2xpYi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXByb3BlcnR5L3NwZWNpZnktcHJvcGVydHktdmFsdWUvdGV4dC12YWx1ZS90ZXh0LXZhbHVlLmNvbXBvbmVudCc7XG5leHBvcnQgKiBmcm9tICcuL2xpYi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXByb3BlcnR5L3NwZWNpZnktcHJvcGVydHktdmFsdWUvdXJpLXZhbHVlL3VyaS12YWx1ZS5jb21wb25lbnQnO1xuZXhwb3J0ICogZnJvbSAnLi9saWIvZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1yZXNvdXJjZS1jbGFzcy9zZWxlY3QtcmVzb3VyY2UtY2xhc3MuY29tcG9uZW50JztcblxuZXhwb3J0ICogZnJvbSAnLi9saWIvc2VhcmNoLm1vZHVsZSc7XG4iLCIvKipcbiAqIEdlbmVyYXRlZCBidW5kbGUgaW5kZXguIERvIG5vdCBlZGl0LlxuICovXG5cbmV4cG9ydCAqIGZyb20gJy4vcHVibGljX2FwaSc7XG4iXSwibmFtZXMiOlsidHNsaWJfMS5fX3ZhbHVlcyIsIkNvbXBvbmVudCIsInRyaWdnZXIiLCJzdGF0ZSIsInN0eWxlIiwidHJhbnNpdGlvbiIsImFuaW1hdGUiLCJBY3RpdmF0ZWRSb3V0ZSIsIlJvdXRlciIsIkVsZW1lbnRSZWYiLCJJbnB1dCIsIkV2ZW50RW1pdHRlciIsIlJlYWRSZXNvdXJjZXNTZXF1ZW5jZSIsIkZvcm1CdWlsZGVyIiwiSW5qZWN0IiwiT250b2xvZ3lDYWNoZVNlcnZpY2UiLCJHcmF2c2VhcmNoR2VuZXJhdGlvblNlcnZpY2UiLCJPdXRwdXQiLCJWaWV3Q2hpbGQiLCJWaWV3Q2hpbGRyZW4iLCJWYWxpZGF0b3JzIiwiQ2FyZGluYWxpdHlPY2N1cnJlbmNlIiwiT250b2xvZ3lJbmZvcm1hdGlvbiIsIlByb3BlcnR5V2l0aFZhbHVlIiwicmVzb2x2ZWRQcm9taXNlIiwiS25vcmFDb25zdGFudHMiLCJMaWtlIiwiTWF0Y2giLCJFcXVhbHMiLCJOb3RFcXVhbHMiLCJFeGlzdHMiLCJMZXNzVGhhbiIsIkxlc3NUaGFuRXF1YWxzIiwiR3JlYXRlclRoYW4iLCJHcmVhdGVyVGhhbkVxdWFscyIsIkNvbXBhcmlzb25PcGVyYXRvckFuZFZhbHVlIiwiVmFsdWVMaXRlcmFsIiwiSkROQ29udmVydGlibGVDYWxlbmRhciIsIkpETkNvbnZlcnRpYmxlQ2FsZW5kYXJEYXRlQWRhcHRlciIsIk1hdENhbGVuZGFyIiwiSG9zdCIsIkRhdGVBZGFwdGVyIiwiUmVhZFJlc291cmNlIiwiSVJJIiwiU2VhcmNoU2VydmljZSIsIlV0aWxzIiwiTmdNb2R1bGUiLCJDb21tb25Nb2R1bGUiLCJCcm93c2VyQW5pbWF0aW9uc01vZHVsZSIsIk1hdEF1dG9jb21wbGV0ZU1vZHVsZSIsIk1hdEJ1dHRvbk1vZHVsZSIsIk1hdENoZWNrYm94TW9kdWxlIiwiTWF0RGF0ZXBpY2tlck1vZHVsZSIsIk1hdEZvcm1GaWVsZE1vZHVsZSIsIk1hdElucHV0TW9kdWxlIiwiTWF0SWNvbk1vZHVsZSIsIk1hdExpc3RNb2R1bGUiLCJNYXRTZWxlY3RNb2R1bGUiLCJNYXRUb29sdGlwTW9kdWxlIiwiRm9ybXNNb2R1bGUiLCJSZWFjdGl2ZUZvcm1zTW9kdWxlIiwiS3VpQ29yZU1vZHVsZSIsIkt1aUFjdGlvbk1vZHVsZSIsIkt1aVZpZXdlck1vZHVsZSIsIk1hdEpETkNvbnZlcnRpYmxlQ2FsZW5kYXJEYXRlQWRhcHRlck1vZHVsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0lBQUE7Ozs7Ozs7Ozs7Ozs7O0FBY0Esc0JBNEZ5QixDQUFDO1FBQ3RCLElBQUksQ0FBQyxHQUFHLE9BQU8sTUFBTSxLQUFLLFVBQVUsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbEUsSUFBSSxDQUFDO1lBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hCLE9BQU87WUFDSCxJQUFJLEVBQUU7Z0JBQ0YsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNO29CQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQztnQkFDbkMsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxD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