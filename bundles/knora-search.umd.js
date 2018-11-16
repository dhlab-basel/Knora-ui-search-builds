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

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var SearchComponent = (function () {
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
        /**
         * @return {?}
         */
        SearchComponent.prototype.ngOnInit = /**
         * @return {?}
         */
            function () {
            };
        /**
         *
         * @param search_ele
         * @param event
         */
        /**
         *
         * @param {?} search_ele
         * @param {?} event
         * @return {?}
         */
        SearchComponent.prototype.onKey = /**
         *
         * @param {?} search_ele
         * @param {?} event
         * @return {?}
         */
            function (search_ele, event) {
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
         * @param search_ele
         */
        /**
         * Realise a simple search
         * @param {?} search_ele
         * @return {?}
         */
        SearchComponent.prototype.doSearch = /**
         * Realise a simple search
         * @param {?} search_ele
         * @return {?}
         */
            function (search_ele) {
                if (this.searchQuery !== undefined && this.searchQuery !== null) {
                    this.toggleMenu('simpleSearch');
                    this._router.navigate([this.route + '/fulltext/' + this.searchQuery]);
                    /** @type {?} */
                    var existingPrevSearch = JSON.parse(localStorage.getItem('prevSearch'));
                    if (existingPrevSearch === null) {
                        existingPrevSearch = [];
                    }
                    /** @type {?} */
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
                var e_1, _a;
            };
        /**
         * Reset the search
         * @param search_ele
         */
        /**
         * Reset the search
         * @param {?} search_ele
         * @return {?}
         */
        SearchComponent.prototype.resetSearch = /**
         * Reset the search
         * @param {?} search_ele
         * @return {?}
         */
            function (search_ele) {
                this.searchQuery = null;
                search_ele.focus();
                this.focusOnSimple = 'inactive';
                this.searchPanelFocus = !this.searchPanelFocus;
            };
        /**
         * Realise a previous search
         * @param query
         */
        /**
         * Realise a previous search
         * @param {?} query
         * @return {?}
         */
        SearchComponent.prototype.doPrevSearch = /**
         * Realise a previous search
         * @param {?} query
         * @return {?}
         */
            function (query) {
                this.searchQuery = query;
                this._router.navigate([this.route + '/fulltext/' + query], { relativeTo: this._route });
                this.toggleMenu('simpleSearch');
            };
        /**
         * Reset previous searches - the whole previous search or specific item by name
         * @param name
         */
        /**
         * Reset previous searches - the whole previous search or specific item by name
         * @param {?=} name
         * @return {?}
         */
        SearchComponent.prototype.resetPrevSearch = /**
         * Reset previous searches - the whole previous search or specific item by name
         * @param {?=} name
         * @return {?}
         */
            function (name) {
                if (name === void 0) {
                    name = null;
                }
                if (name) {
                    /** @type {?} */
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
         * Set simple focus to active
         */
        /**
         * Set simple focus to active
         * @return {?}
         */
        SearchComponent.prototype.setFocus = /**
         * Set simple focus to active
         * @return {?}
         */
            function () {
                this.prevSearch = JSON.parse(localStorage.getItem('prevSearch'));
                this.focusOnSimple = 'active';
                this.searchPanelFocus = !this.searchPanelFocus;
            };
        /**
         * Switch according to the focus between simple or extended search
         * @param name
         */
        /**
         * Switch according to the focus between simple or extended search
         * @param {?} name
         * @return {?}
         */
        SearchComponent.prototype.toggleMenu = /**
         * Switch according to the focus between simple or extended search
         * @param {?} name
         * @return {?}
         */
            function (name) {
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
                        template: "<div class=\"search-bar-elements\">\n\n    <!-- the next element - div.extended-search-panel - is a hidden dropdown filter menu -->\n\n    <div class=\"search-panel\" [class.active]=\"searchPanelFocus\">\n        <div>\n            <button class=\"prefix\" (click)=\"doSearch(search)\">\n                <mat-icon>search</mat-icon>\n            </button>\n        </div>\n\n        <div class=\"input-field\">\n            <input #search autocomplete=\"off\" type=\"search\" [placeholder]=\"searchLabel\" [(ngModel)]=\"searchQuery\" name=\"search\" (keyup.esc)=\"resetSearch(search)\"\n                (keyup)=\"onKey(search, $event)\" (click)=\"setFocus()\" (focus)=\"toggleMenu('simpleSearch')\" [disabled]=\"focusOnExtended === 'active'\"\n            />\n        </div>\n\n        <!-- switch button: on some focus we need a close button for the simple or extended panel -->\n        <div>\n            <button class=\"suffix\" *ngIf=\"focusOnSimple === 'active'\" (click)=\"resetSearch(search)\">\n                <mat-icon>close</mat-icon>\n            </button>\n            <button class=\"suffix\" *ngIf=\"focusOnSimple === 'inactive'\">\n            </button>\n        </div>\n\n        <!-- the search panel has two \"dropdown\" menus: one for simple search and another one for the extended search -->\n        <div class=\"salsah-menu simple-search\" [@simpleSearchMenu]=\"focusOnSimple\" *ngIf=\"showSimpleSearch\">\n            <mat-list class=\"salsah-previous-search-list\">\n                <mat-list-item *ngFor=\"let item of prevSearch | reverse; let i=index\">\n                    <h4 mat-line *ngIf=\"i<10\" (click)=\"doPrevSearch(item)\">{{item}}</h4>\n                    <button mat-icon-button (click)=\"resetPrevSearch(item)\">\n                        <mat-icon aria-label=\"close\">clear</mat-icon>\n                    </button>\n                </mat-list-item>\n            </mat-list>\n            <button mat-stroked-button color=\"accent\" class=\"right\" (click)=\"resetPrevSearch()\" *ngIf=\"prevSearch\">Clear</button>\n        </div>\n\n        <div class=\"salsah-menu extended-search\" [@extendedSearchMenu]=\"focusOnExtended\">\n            <div class=\"salsah-menu-header\">\n                <span class=\"salsah-menu-title\">\n                    <h4>Advanced search</h4>\n                </span>\n                <span class=\"salsah-menu-action\">\n                    <button mat-icon-button (click)=\"toggleMenu('extendedSearch')\">\n                        <mat-icon>close</mat-icon>\n                    </button>\n                </span>\n            </div>\n            <div class=\"extended-search-box\">\n                <kui-extended-search [route]=\"route\" (toggleExtendedSearchForm)=\"toggleMenu('extendedSearch')\"></kui-extended-search>\n            </div>\n        </div>\n    </div>\n\n    <!-- Extended search button to display the extended search form in the search panel -->\n    <button mat-button type=\"button\" color=\"primary\" class=\"advanced-search-button\" (click)=\"toggleMenu('extendedSearch')\">\n        advanced\n    </button>\n\n</div>\n",
                        styles: ["input[type=search]::-webkit-search-cancel-button,input[type=search]::-webkit-search-decoration,input[type=search]::-webkit-search-results-button,input[type=search]::-webkit-search-results-decoration{display:none}input[type=search]{-moz-appearance:none;-webkit-appearance:none}.center{display:block;margin-left:auto;margin-right:auto}.close{right:12px}.extended-search-box{margin:12px}.advanced-search-button{margin-left:10px}.full-width{width:100%}.hide{display:none}.inactive,.mute{color:#7a7a7a}.search-panel{background-color:#f9f9f9;border-radius:4px;display:inline-flex;height:40px;position:relative;width:720px;z-index:10}.search-panel:hover{box-shadow:0 1px 3px rgba(0,0,0,.5)}.search-panel div.input-field{flex:1}.search-panel div.input-field input{border-style:none;font-size:14pt;height:38px;position:absolute;width:640px}.search-panel div.input-field input:active,.search-panel div.input-field input:focus{outline:0}.search-panel div .prefix,.search-panel div .suffix{background-color:#fff;border-radius:3px;border-style:none;color:rgba(41,41,41,.4);cursor:pointer;height:38px;outline:0;position:relative;width:40px}.search-panel div .prefix:active,.search-panel div .suffix:active{color:#515151}.search-panel.active{box-shadow:0 1px 3px rgba(0,0,0,.5)}.salsah-menu{box-shadow:0 3px 5px -1px rgba(11,11,11,.2),0 6px 10px 0 rgba(11,11,11,.14),0 1px 18px 0 rgba(11,11,11,.12);background-color:#f9f9f9;border-radius:4px;position:absolute}.salsah-menu .salsah-menu-header{background-color:#f9f9f9;border-top-left-radius:4px;border-top-right-radius:4px;display:inline-block;height:48px;width:100%}.salsah-menu .salsah-menu-header .salsah-menu-title{float:left;font-size:14px;font-weight:400;margin-top:4px;padding:12px}.salsah-menu .salsah-menu-header .salsah-menu-action{float:right;margin:4px}.salsah-menu.extended-search,.salsah-menu.simple-search{min-height:720px;width:720px}.salsah-menu.simple-search{padding-top:60px;z-index:-1}.salsah-menu.simple-search .salsah-previous-search-list .mat-list-item{cursor:pointer}.salsah-menu.simple-search .salsah-previous-search-list .mat-list-item:hover{background-color:#f9f9f9}.salsah-menu.simple-search .salsah-previous-search-list .mat-list-item:hover mat-icon{display:block}.salsah-menu.simple-search .salsah-previous-search-list .mat-list-item mat-icon{display:none}.salsah-menu.simple-search .right{margin-top:12px;margin-left:16px}.salsah-menu.extended-search{z-index:20}.search-bar-elements{display:flex}.show{display:block}"],
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

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var ExtendedSearchComponent = (function () {
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
        /**
         * @return {?}
         */
        ExtendedSearchComponent.prototype.ngOnInit = /**
         * @return {?}
         */
            function () {
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
         */
        /**
         * Add a property to the search form.
         * @return {?}
         */
        ExtendedSearchComponent.prototype.addProperty = /**
         * Add a property to the search form.
         * @return {?}
         */
            function () {
                this.activeProperties.push(true);
            };
        /**
         * Remove the last property from the search form.
         */
        /**
         * Remove the last property from the search form.
         * @return {?}
         */
        ExtendedSearchComponent.prototype.removeProperty = /**
         * Remove the last property from the search form.
         * @return {?}
         */
            function () {
                this.activeProperties.splice(-1, 1);
            };
        /**
         * Gets all available ontologies for the search form.
         */
        /**
         * Gets all available ontologies for the search form.
         * @return {?}
         */
        ExtendedSearchComponent.prototype.initializeOntologies = /**
         * Gets all available ontologies for the search form.
         * @return {?}
         */
            function () {
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
         */
        /**
         * Once an ontology has been selected, gets its classes and properties.
         * The classes and properties will be made available to the user for selection.
         *
         * @param {?} ontologyIri Iri of the ontology chosen by the user.
         * @return {?}
         */
        ExtendedSearchComponent.prototype.getResourceClassesAndPropertiesForOntology = /**
         * Once an ontology has been selected, gets its classes and properties.
         * The classes and properties will be made available to the user for selection.
         *
         * @param {?} ontologyIri Iri of the ontology chosen by the user.
         * @return {?}
         */
            function (ontologyIri) {
                var _this = this;
                // reset active resource class definition
                this.activeResourceClass = undefined;
                // reset specified properties
                this.activeProperties = [];
                this.activeOntology = ontologyIri;
                this._cacheService.getEntityDefinitionsForOntologies([ontologyIri]).subscribe(function (ontoInfo) {
                    _this.resourceClasses = ontoInfo.getResourceClassesAsArray();
                    _this.properties = ontoInfo.getProperties();
                });
            };
        /**
         * Once a resource class has been selected, gets its properties.
         * The properties will be made available to the user for selection.
         *
         * @param resourceClassIri
         */
        /**
         * Once a resource class has been selected, gets its properties.
         * The properties will be made available to the user for selection.
         *
         * @param {?} resourceClassIri
         * @return {?}
         */
        ExtendedSearchComponent.prototype.getPropertiesForResourceClass = /**
         * Once a resource class has been selected, gets its properties.
         * The properties will be made available to the user for selection.
         *
         * @param {?} resourceClassIri
         * @return {?}
         */
            function (resourceClassIri) {
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
         * @return {?}
         */
        ExtendedSearchComponent.prototype.validateForm = /**
         * Validates form and returns its status (boolean).
         * @return {?}
         */
            function () {
                // check that either a resource class is selected or at least one property is specified
                return this.form.valid &&
                    (this.propertyComponents.length > 0 || (this.resourceClassComponent !== undefined && this.resourceClassComponent.getResourceClassSelected() !== false));
            };
        /**
         * Resets the form (selected resource class and specified properties) preserving the active ontology.
         */
        /**
         * Resets the form (selected resource class and specified properties) preserving the active ontology.
         * @return {?}
         */
        ExtendedSearchComponent.prototype.resetForm = /**
         * Resets the form (selected resource class and specified properties) preserving the active ontology.
         * @return {?}
         */
            function () {
                if (this.activeOntology !== undefined) {
                    this.getResourceClassesAndPropertiesForOntology(this.activeOntology);
                }
            };
        /**
         * Creates a GravSearch query with the given form values and calls the extended search route.
         */
        /**
         * Creates a GravSearch query with the given form values and calls the extended search route.
         * @return {?}
         */
        ExtendedSearchComponent.prototype.submit = /**
         * Creates a GravSearch query with the given form values and calls the extended search route.
         * @return {?}
         */
            function () {
                if (!this.formValid)
                    return;
                /** @type {?} */
                var resClassOption = this.resourceClassComponent.getResourceClassSelected();
                /** @type {?} */
                var resClass;
                if (resClassOption !== false) {
                    resClass = resClassOption;
                }
                /** @type {?} */
                var properties = this.propertyComponents.map(function (propComp) {
                    return propComp.getPropertySelectedWithValue();
                });
                /** @type {?} */
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

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var SelectOntologyComponent = (function () {
        function SelectOntologyComponent(fb) {
            this.fb = fb;
            this.ontologySelected = new core.EventEmitter();
        }
        /**
         * @return {?}
         */
        SelectOntologyComponent.prototype.ngOnInit = /**
         * @return {?}
         */
            function () {
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

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /** @type {?} */
    var resolvedPromise = Promise.resolve(null);
    var SelectPropertyComponent = (function () {
        function SelectPropertyComponent(fb) {
            this.fb = fb;
        }
        Object.defineProperty(SelectPropertyComponent.prototype, "properties", {
            get: /**
             * @return {?}
             */ function () {
                return this._properties;
            },
            // setter method for properties when being updated by parent component
            set: /**
             * @param {?} value
             * @return {?}
             */ function (value) {
                this.propertySelected = undefined; // reset selected property (overwriting any previous selection)
                this._properties = value;
                this.updatePropertiesArray();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SelectPropertyComponent.prototype, "activeResourceClass", {
            // setter method for selected resource class
            set: /**
             * @param {?} value
             * @return {?}
             */ function (value) {
                this._activeResourceClass = value;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @return {?}
         */
        SelectPropertyComponent.prototype.ngOnInit = /**
         * @return {?}
         */
            function () {
                var _this = this;
                // build a form for the property selection
                this.form = this.fb.group({
                    property: [null, forms.Validators.required],
                    isSortCriterion: [false, forms.Validators.required]
                });
                // update the selected property
                this.form.valueChanges.subscribe(function (data) {
                    /** @type {?} */
                    var propIri = data.property;
                    _this.propertySelected = _this._properties[propIri];
                });
                resolvedPromise.then(function () {
                    _this.propIndex = 'property' + _this.index;
                    // add form to the parent form group
                    // add form to the parent form group
                    _this.formGroup.addControl(_this.propIndex, _this.form);
                });
            };
        /**
         * @return {?}
         */
        SelectPropertyComponent.prototype.ngOnDestroy = /**
         * @return {?}
         */
            function () {
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
        /**
         * Indicates if property can be used as a sort criterion.
         * Property has to have cardinality or max cardinality 1 for the chosen resource class.
         *
         * We cannot sort by properties whose cardinality is greater than 1.
         * Return boolean
         * @return {?}
         */
        SelectPropertyComponent.prototype.sortCriterion = /**
         * Indicates if property can be used as a sort criterion.
         * Property has to have cardinality or max cardinality 1 for the chosen resource class.
         *
         * We cannot sort by properties whose cardinality is greater than 1.
         * Return boolean
         * @return {?}
         */
            function () {
                var _this = this;
                // check if a resource class is selected and if the property's cardinality is 1 for the selected resource class
                if (this._activeResourceClass !== undefined && this.propertySelected !== undefined && !this.propertySelected.isLinkProperty) {
                    /** @type {?} */
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
         * @return {?}
         */
        SelectPropertyComponent.prototype.updatePropertiesArray = /**
         * Updates the properties array that is accessed by the template.
         * @return {?}
         */
            function () {
                /** @type {?} */
                var propsArray = [];
                for (var propIri in this._properties) {
                    if (this._properties.hasOwnProperty(propIri)) {
                        /** @type {?} */
                        var prop = this._properties[propIri];
                        // only list editable props that are not link value props
                        if (prop.isEditable && !prop.isLinkValueProperty) {
                            propsArray.push(this._properties[propIri]);
                        }
                    }
                }
                this.propertiesAsArray = propsArray;
            };
        /**
         * Returns the selected property with the specified value.
         */
        /**
         * Returns the selected property with the specified value.
         * @return {?}
         */
        SelectPropertyComponent.prototype.getPropertySelectedWithValue = /**
         * Returns the selected property with the specified value.
         * @return {?}
         */
            function () {
                /** @type {?} */
                var propVal = this.specifyPropertyValue.getComparisonOperatorAndValueLiteralForProperty();
                /** @type {?} */
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

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /** @type {?} */
    var resolvedPromise$1 = Promise.resolve(null);
    var SpecifyPropertyValueComponent = (function () {
        function SpecifyPropertyValueComponent(fb) {
            this.fb = fb;
            this.KnoraConstants = core$1.KnoraConstants;
            // available comparison operators for the property
            this.comparisonOperators = [];
        }
        Object.defineProperty(SpecifyPropertyValueComponent.prototype, "property", {
            // getter method for this._property
            get: /**
             * @return {?}
             */ function () {
                return this._property;
            },
            // setter method for the property chosen by the user
            set: /**
             * @param {?} prop
             * @return {?}
             */ function (prop) {
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
        /**
         * Resets the comparison operators for this._property.
         * @return {?}
         */
        SpecifyPropertyValueComponent.prototype.resetComparisonOperators = /**
         * Resets the comparison operators for this._property.
         * @return {?}
         */
            function () {
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
        /**
         * @return {?}
         */
        SpecifyPropertyValueComponent.prototype.ngOnInit = /**
         * @return {?}
         */
            function () { };
        /**
         * @return {?}
         */
        SpecifyPropertyValueComponent.prototype.ngOnChanges = /**
         * @return {?}
         */
            function () {
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
                    // remove from the parent form group (clean reset)
                    _this.formGroup.removeControl('comparisonOperator');
                    // add form to the parent form group
                    // add form to the parent form group
                    _this.formGroup.addControl('comparisonOperator', _this.form);
                });
            };
        /**
         * Gets the specified comparison operator and value for the property.
         *
         * returns {ComparisonOperatorAndValue} the comparison operator and the specified value
         */
        /**
         * Gets the specified comparison operator and value for the property.
         *
         * returns {ComparisonOperatorAndValue} the comparison operator and the specified value
         * @return {?}
         */
        SpecifyPropertyValueComponent.prototype.getComparisonOperatorAndValueLiteralForProperty = /**
         * Gets the specified comparison operator and value for the property.
         *
         * returns {ComparisonOperatorAndValue} the comparison operator and the specified value
         * @return {?}
         */
            function () {
                /** @type {?} */
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

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /** @type {?} */
    var resolvedPromise$2 = Promise.resolve(null);
    var BooleanValueComponent = (function () {
        function BooleanValueComponent(fb) {
            this.fb = fb;
            this.type = core$1.KnoraConstants.BooleanValue;
        }
        /**
         * @return {?}
         */
        BooleanValueComponent.prototype.ngOnInit = /**
         * @return {?}
         */
            function () {
                var _this = this;
                this.form = this.fb.group({
                    booleanValue: [false, forms.Validators.compose([forms.Validators.required])]
                });
                resolvedPromise$2.then(function () {
                    // add form to the parent form group
                    // add form to the parent form group
                    _this.formGroup.addControl('propValue', _this.form);
                });
            };
        /**
         * @return {?}
         */
        BooleanValueComponent.prototype.ngOnDestroy = /**
         * @return {?}
         */
            function () {
                var _this = this;
                // remove form from the parent form group
                resolvedPromise$2.then(function () {
                    _this.formGroup.removeControl('propValue');
                });
            };
        /**
         * @return {?}
         */
        BooleanValueComponent.prototype.getValue = /**
         * @return {?}
         */
            function () {
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

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * Custom header component containing a calendar format switcher
     * @template D
     */
    var HeaderComponent = (function () {
        function HeaderComponent(_calendar, _dateAdapter, fb) {
            this._calendar = _calendar;
            this._dateAdapter = _dateAdapter;
            this.fb = fb;
            // a list of supported calendar formats (Gregorian and Julian)
            this.supportedCalendarFormats = jdnconvertiblecalendar.JDNConvertibleCalendar.supportedCalendars;
        }
        /**
         * @return {?}
         */
        HeaderComponent.prototype.ngOnInit = /**
         * @return {?}
         */
            function () {
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
                    // pass the target calendar format to the conversion method
                    _this.convertDate(data.calendar);
                });
            };
        /**
         * Converts the date into the target format.
         *
         * @param calendar the target calendar format.
         */
        /**
         * Converts the date into the target format.
         *
         * @param {?} calendar the target calendar format.
         * @return {?}
         */
        HeaderComponent.prototype.convertDate = /**
         * Converts the date into the target format.
         *
         * @param {?} calendar the target calendar format.
         * @return {?}
         */
            function (calendar) {
                if (this._dateAdapter instanceof jdnconvertiblecalendardateadapter.JDNConvertibleCalendarDateAdapter) {
                    /** @type {?} */
                    var convertedDate = this._dateAdapter.convertCalendarFormat(this._calendar.activeDate, calendar);
                    // set the new date
                    this._calendar.activeDate = convertedDate;
                    // select the new date in the datepicker UI
                    this._calendar._dateSelected(convertedDate);
                    /** @type {?} */
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

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /** @type {?} */
    var resolvedPromise$3 = Promise.resolve(null);
    var DateValueComponent = (function () {
        function DateValueComponent(fb) {
            this.fb = fb;
            this.type = core$1.KnoraConstants.DateValue;
            // custom header for the datepicker
            this.headerComponent = HeaderComponent;
        }
        /**
         * @return {?}
         */
        DateValueComponent.prototype.ngOnInit = /**
         * @return {?}
         */
            function () {
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
                    // add form to the parent form group
                    _this.formGroup.addControl('propValue', _this.form);
                });
            };
        /**
         * @return {?}
         */
        DateValueComponent.prototype.ngOnDestroy = /**
         * @return {?}
         */
            function () {
                var _this = this;
                // remove form from the parent form group
                resolvedPromise$3.then(function () {
                    _this.formGroup.removeControl('propValue');
                });
            };
        /**
         * @return {?}
         */
        DateValueComponent.prototype.getValue = /**
         * @return {?}
         */
            function () {
                /** @type {?} */
                var dateObj = this.form.value.dateValue;
                /** @type {?} */
                var calendarFormat = dateObj.calendarName;
                /** @type {?} */
                var calendarPeriod = dateObj.toCalendarPeriod();
                /** @type {?} */
                var dateString = calendarFormat.toUpperCase() + ":" + calendarPeriod.periodStart.year + "-" + calendarPeriod.periodStart.month + "-" + calendarPeriod.periodStart.day + ":" + calendarPeriod.periodEnd.year + "-" + calendarPeriod.periodEnd.month + "-" + calendarPeriod.periodEnd.day;
                return new core$1.ValueLiteral(String(dateString), core$1.KnoraConstants.DateValue);
            };
        DateValueComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'date-value',
                        template: "<mat-form-field>\n    <jdn-datepicker>\n        <input matInput [matDatepicker]=\"picker\" placeholder=\"Choose a date\" [formControl]=\"form.controls['dateValue']\">\n        <mat-datepicker #picker [calendarHeaderComponent]=\"headerComponent\"></mat-datepicker>\n    </jdn-datepicker>\n    <mat-datepicker-toggle matSuffix [for]=\"picker\"></mat-datepicker-toggle>\n</mat-form-field>",
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

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /** @type {?} */
    var resolvedPromise$4 = Promise.resolve(null);
    var DecimalValueComponent = (function () {
        function DecimalValueComponent(fb) {
            this.fb = fb;
            this.type = core$1.KnoraConstants.DecimalValue;
        }
        /**
         * @return {?}
         */
        DecimalValueComponent.prototype.ngOnInit = /**
         * @return {?}
         */
            function () {
                var _this = this;
                this.form = this.fb.group({
                    decimalValue: [null, forms.Validators.compose([forms.Validators.required])]
                });
                resolvedPromise$4.then(function () {
                    // add form to the parent form group
                    // add form to the parent form group
                    _this.formGroup.addControl('propValue', _this.form);
                });
            };
        /**
         * @return {?}
         */
        DecimalValueComponent.prototype.ngOnDestroy = /**
         * @return {?}
         */
            function () {
                var _this = this;
                // remove form from the parent form group
                resolvedPromise$4.then(function () {
                    _this.formGroup.removeControl('propValue');
                });
            };
        /**
         * @return {?}
         */
        DecimalValueComponent.prototype.getValue = /**
         * @return {?}
         */
            function () {
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

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /** @type {?} */
    var resolvedPromise$5 = Promise.resolve(null);
    var IntegerValueComponent = (function () {
        function IntegerValueComponent(fb) {
            this.fb = fb;
            this.type = core$1.KnoraConstants.IntValue;
        }
        /**
         * @return {?}
         */
        IntegerValueComponent.prototype.ngOnInit = /**
         * @return {?}
         */
            function () {
                var _this = this;
                this.form = this.fb.group({
                    integerValue: [null, forms.Validators.compose([forms.Validators.required, forms.Validators.pattern(/^-?\d+$/)])] // only allow for integer values (no fractions)
                });
                resolvedPromise$5.then(function () {
                    // add form to the parent form group
                    // add form to the parent form group
                    _this.formGroup.addControl('propValue', _this.form);
                });
            };
        /**
         * @return {?}
         */
        IntegerValueComponent.prototype.ngOnDestroy = /**
         * @return {?}
         */
            function () {
                var _this = this;
                // remove form from the parent form group
                resolvedPromise$5.then(function () {
                    _this.formGroup.removeControl('propValue');
                });
            };
        /**
         * @return {?}
         */
        IntegerValueComponent.prototype.getValue = /**
         * @return {?}
         */
            function () {
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

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /** @type {?} */
    var jsonld = require('jsonld');
    /** @type {?} */
    var resolvedPromise$6 = Promise.resolve(null);
    var LinkValueComponent = (function () {
        function LinkValueComponent(fb, _searchService, _cacheService) {
            this.fb = fb;
            this._searchService = _searchService;
            this._cacheService = _cacheService;
            this.type = core$1.KnoraConstants.LinkValue;
        }
        Object.defineProperty(LinkValueComponent.prototype, "restrictResourceClass", {
            get: /**
             * @return {?}
             */ function () {
                return this._restrictToResourceClass;
            },
            set: /**
             * @param {?} value
             * @return {?}
             */ function (value) {
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
        /**
         * Displays a selected resource using its label.
         *
         * @param {?} resource the resource to be displayed (or no selection yet).
         * @return {?}
         */
        LinkValueComponent.prototype.displayResource = /**
         * Displays a selected resource using its label.
         *
         * @param {?} resource the resource to be displayed (or no selection yet).
         * @return {?}
         */
            function (resource) {
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
        /**
         * Search for resources whose labels contain the given search term, restricting to to the given properties object constraint.
         *
         * @param {?} searchTerm
         * @return {?}
         */
        LinkValueComponent.prototype.searchByLabel = /**
         * Search for resources whose labels contain the given search term, restricting to to the given properties object constraint.
         *
         * @param {?} searchTerm
         * @return {?}
         */
            function (searchTerm) {
                var _this = this;
                // at least 3 characters are required
                if (searchTerm.length >= 3) {
                    this._searchService.searchByLabel(searchTerm, this._restrictToResourceClass).subscribe(function (result) {
                        /** @type {?} */
                        var promises = jsonld.promises;
                        /** @type {?} */
                        var promise = promises.compact(result.body, {});
                        promise.then(function (compacted) {
                            /** @type {?} */
                            var resourceSeq = core$1.ConvertJSONLD.createReadResourcesSequenceFromJsonLD(compacted);
                            _this.resources = resourceSeq.resources;
                        }, function (err) {
                            console.log('JSONLD of full resource request could not be expanded:' + err);
                        });
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
        /**
         * Checks that the selection is a [[ReadResource]].
         *
         * Surprisingly, [null] has to be returned if the value is valid: https://angular.io/guide/form-validation#custom-validators
         *
         * @param {?} c
         * @return {?}
         */
        LinkValueComponent.prototype.validateResource = /**
         * Checks that the selection is a [[ReadResource]].
         *
         * Surprisingly, [null] has to be returned if the value is valid: https://angular.io/guide/form-validation#custom-validators
         *
         * @param {?} c
         * @return {?}
         */
            function (c) {
                /** @type {?} */
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
        /**
         * @return {?}
         */
        LinkValueComponent.prototype.ngOnInit = /**
         * @return {?}
         */
            function () {
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
                    // add form to the parent form group
                    _this.formGroup.addControl('propValue', _this.form);
                });
            };
        /**
         * @return {?}
         */
        LinkValueComponent.prototype.ngOnDestroy = /**
         * @return {?}
         */
            function () {
                var _this = this;
                // remove form from the parent form group
                resolvedPromise$6.then(function () {
                    _this.formGroup.removeControl('propValue');
                });
            };
        /**
         * @return {?}
         */
        LinkValueComponent.prototype.getValue = /**
         * @return {?}
         */
            function () {
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

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /** @type {?} */
    var resolvedPromise$7 = Promise.resolve(null);
    var TextValueComponent = (function () {
        function TextValueComponent(fb) {
            this.fb = fb;
            this.type = core$1.KnoraConstants.TextValue;
        }
        /**
         * @return {?}
         */
        TextValueComponent.prototype.ngOnInit = /**
         * @return {?}
         */
            function () {
                var _this = this;
                this.form = this.fb.group({
                    textValue: [null, forms.Validators.required]
                });
                resolvedPromise$7.then(function () {
                    // add form to the parent form group
                    // add form to the parent form group
                    _this.formGroup.addControl('propValue', _this.form);
                });
            };
        /**
         * @return {?}
         */
        TextValueComponent.prototype.ngOnDestroy = /**
         * @return {?}
         */
            function () {
                var _this = this;
                // remove form from the parent form group
                resolvedPromise$7.then(function () {
                    _this.formGroup.removeControl('propValue');
                });
            };
        /**
         * @return {?}
         */
        TextValueComponent.prototype.getValue = /**
         * @return {?}
         */
            function () {
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

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /** @type {?} */
    var resolvedPromise$8 = Promise.resolve(null);
    var UriValueComponent = (function () {
        function UriValueComponent(fb) {
            this.fb = fb;
            this.type = core$1.KnoraConstants.UriValue;
        }
        /**
         * @return {?}
         */
        UriValueComponent.prototype.ngOnInit = /**
         * @return {?}
         */
            function () {
                var _this = this;
                this.form = this.fb.group({
                    uriValue: [null, forms.Validators.compose([forms.Validators.required, forms.Validators.pattern(core$1.Utils.RegexUrl)])]
                });
                resolvedPromise$8.then(function () {
                    // add form to the parent form group
                    // add form to the parent form group
                    _this.formGroup.addControl('propValue', _this.form);
                });
            };
        /**
         * @return {?}
         */
        UriValueComponent.prototype.ngOnDestroy = /**
         * @return {?}
         */
            function () {
                var _this = this;
                // remove form from the parent form group
                resolvedPromise$8.then(function () {
                    _this.formGroup.removeControl('propValue');
                });
            };
        /**
         * @return {?}
         */
        UriValueComponent.prototype.getValue = /**
         * @return {?}
         */
            function () {
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

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /** @type {?} */
    var resolvedPromise$9 = Promise.resolve(null);
    var SelectResourceClassComponent = (function () {
        function SelectResourceClassComponent(fb) {
            this.fb = fb;
            // event emitted to parent component once a resource class is selected by the user
            this.resourceClassSelectedEvent = new core.EventEmitter();
        }
        Object.defineProperty(SelectResourceClassComponent.prototype, "resourceClasses", {
            // getter method for resource classes (used in template)
            get: /**
             * @return {?}
             */ function () {
                return this._resourceClasses;
            },
            // setter method for resource classes when being updated by parent component
            set: /**
             * @param {?} value
             * @return {?}
             */ function (value) {
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
        /**
         * Returns the Iri of the selected resource class.
         *
         * @return {?} the Iri of the selected resource class or false in case no resource class is selected.
         */
        SelectResourceClassComponent.prototype.getResourceClassSelected = /**
         * Returns the Iri of the selected resource class.
         *
         * @return {?} the Iri of the selected resource class or false in case no resource class is selected.
         */
            function () {
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
         * @return {?}
         */
        SelectResourceClassComponent.prototype.initForm = /**
         * Initalizes the FormGroup for the resource class selection.
         * The initial value is set to null.
         * @return {?}
         */
            function () {
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
        /**
         * @return {?}
         */
        SelectResourceClassComponent.prototype.ngOnInit = /**
         * @return {?}
         */
            function () {
                this.initForm();
                // add form to the parent form group
                this.formGroup.addControl('resourceClass', this.form);
            };
        /**
         * @return {?}
         */
        SelectResourceClassComponent.prototype.ngOnChanges = /**
         * @return {?}
         */
            function () {
                var _this = this;
                if (this.form !== undefined) {
                    // resource classes have been reinitialized
                    // reset form
                    resolvedPromise$9.then(function () {
                        // remove this form from the parent form group
                        // remove this form from the parent form group
                        _this.formGroup.removeControl('resourceClass');
                        _this.initForm();
                        // add form to the parent form group
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

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var KuiSearchModule = (function () {
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
                            HeaderComponent
                        ],
                        exports: [SearchComponent],
                        entryComponents: [
                            HeaderComponent
                        ]
                    },] },
        ];
        return KuiSearchModule;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */

    exports.SearchComponent = SearchComponent;
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia25vcmEtc2VhcmNoLnVtZC5qcy5tYXAiLCJzb3VyY2VzIjpbbnVsbCwibmc6Ly9Aa25vcmEvc2VhcmNoL2xpYi9zZWFyY2guY29tcG9uZW50LnRzIiwibmc6Ly9Aa25vcmEvc2VhcmNoL2xpYi9leHRlbmRlZC1zZWFyY2gvZXh0ZW5kZWQtc2VhcmNoLmNvbXBvbmVudC50cyIsIm5nOi8vQGtub3JhL3NlYXJjaC9saWIvZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1vbnRvbG9neS9zZWxlY3Qtb250b2xvZ3kuY29tcG9uZW50LnRzIiwibmc6Ly9Aa25vcmEvc2VhcmNoL2xpYi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXByb3BlcnR5L3NlbGVjdC1wcm9wZXJ0eS5jb21wb25lbnQudHMiLCJuZzovL0Brbm9yYS9zZWFyY2gvbGliL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3QtcHJvcGVydHkvc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZS9zcGVjaWZ5LXByb3BlcnR5LXZhbHVlLmNvbXBvbmVudC50cyIsIm5nOi8vQGtub3JhL3NlYXJjaC9saWIvZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1wcm9wZXJ0eS9zcGVjaWZ5LXByb3BlcnR5LXZhbHVlL2Jvb2xlYW4tdmFsdWUvYm9vbGVhbi12YWx1ZS5jb21wb25lbnQudHMiLCJuZzovL0Brbm9yYS9zZWFyY2gvbGliL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3QtcHJvcGVydHkvc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZS9kYXRlLXZhbHVlL2hlYWRlci1jYWxlbmRhci9oZWFkZXItY2FsZW5kYXIuY29tcG9uZW50LnRzIiwibmc6Ly9Aa25vcmEvc2VhcmNoL2xpYi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXByb3BlcnR5L3NwZWNpZnktcHJvcGVydHktdmFsdWUvZGF0ZS12YWx1ZS9kYXRlLXZhbHVlLmNvbXBvbmVudC50cyIsIm5nOi8vQGtub3JhL3NlYXJjaC9saWIvZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1wcm9wZXJ0eS9zcGVjaWZ5LXByb3BlcnR5LXZhbHVlL2RlY2ltYWwtdmFsdWUvZGVjaW1hbC12YWx1ZS5jb21wb25lbnQudHMiLCJuZzovL0Brbm9yYS9zZWFyY2gvbGliL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3QtcHJvcGVydHkvc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZS9pbnRlZ2VyLXZhbHVlL2ludGVnZXItdmFsdWUuY29tcG9uZW50LnRzIiwibmc6Ly9Aa25vcmEvc2VhcmNoL2xpYi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXByb3BlcnR5L3NwZWNpZnktcHJvcGVydHktdmFsdWUvbGluay12YWx1ZS9saW5rLXZhbHVlLmNvbXBvbmVudC50cyIsIm5nOi8vQGtub3JhL3NlYXJjaC9saWIvZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1wcm9wZXJ0eS9zcGVjaWZ5LXByb3BlcnR5LXZhbHVlL3RleHQtdmFsdWUvdGV4dC12YWx1ZS5jb21wb25lbnQudHMiLCJuZzovL0Brbm9yYS9zZWFyY2gvbGliL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3QtcHJvcGVydHkvc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZS91cmktdmFsdWUvdXJpLXZhbHVlLmNvbXBvbmVudC50cyIsIm5nOi8vQGtub3JhL3NlYXJjaC9saWIvZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1yZXNvdXJjZS1jbGFzcy9zZWxlY3QtcmVzb3VyY2UtY2xhc3MuY29tcG9uZW50LnRzIiwibmc6Ly9Aa25vcmEvc2VhcmNoL2xpYi9zZWFyY2gubW9kdWxlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qISAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5Db3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlXHJcbnRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlXHJcbkxpY2Vuc2UgYXQgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcblxyXG5USElTIENPREUgSVMgUFJPVklERUQgT04gQU4gKkFTIElTKiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZXHJcbktJTkQsIEVJVEhFUiBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBXSVRIT1VUIExJTUlUQVRJT04gQU5ZIElNUExJRURcclxuV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIFRJVExFLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSxcclxuTUVSQ0hBTlRBQkxJVFkgT1IgTk9OLUlORlJJTkdFTUVOVC5cclxuXHJcblNlZSB0aGUgQXBhY2hlIFZlcnNpb24gMi4wIExpY2Vuc2UgZm9yIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9uc1xyXG5hbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXHJcbi8qIGdsb2JhbCBSZWZsZWN0LCBQcm9taXNlICovXHJcblxyXG52YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4dGVuZHMoZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fYXNzaWduID0gZnVuY3Rpb24oKSB7XHJcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gX19hc3NpZ24odCkge1xyXG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpIHRbcF0gPSBzW3BdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdDtcclxuICAgIH1cclxuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZXN0KHMsIGUpIHtcclxuICAgIHZhciB0ID0ge307XHJcbiAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkgJiYgZS5pbmRleE9mKHApIDwgMClcclxuICAgICAgICB0W3BdID0gc1twXTtcclxuICAgIGlmIChzICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgcCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocyk7IGkgPCBwLmxlbmd0aDsgaSsrKSBpZiAoZS5pbmRleE9mKHBbaV0pIDwgMClcclxuICAgICAgICAgICAgdFtwW2ldXSA9IHNbcFtpXV07XHJcbiAgICByZXR1cm4gdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcclxuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xyXG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcclxuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3BhcmFtKHBhcmFtSW5kZXgsIGRlY29yYXRvcikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIGtleSkgeyBkZWNvcmF0b3IodGFyZ2V0LCBrZXksIHBhcmFtSW5kZXgpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKSB7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdGVyKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2dlbmVyYXRvcih0aGlzQXJnLCBib2R5KSB7XHJcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xyXG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcclxuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XHJcbiAgICAgICAgd2hpbGUgKF8pIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcclxuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XHJcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcclxuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cclxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXhwb3J0U3RhcihtLCBleHBvcnRzKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmICghZXhwb3J0cy5oYXNPd25Qcm9wZXJ0eShwKSkgZXhwb3J0c1twXSA9IG1bcF07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3ZhbHVlcyhvKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl0sIGkgPSAwO1xyXG4gICAgaWYgKG0pIHJldHVybiBtLmNhbGwobyk7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKG8gJiYgaSA+PSBvLmxlbmd0aCkgbyA9IHZvaWQgMDtcclxuICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IG8gJiYgb1tpKytdLCBkb25lOiAhbyB9O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3JlYWQobywgbikge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdO1xyXG4gICAgaWYgKCFtKSByZXR1cm4gbztcclxuICAgIHZhciBpID0gbS5jYWxsKG8pLCByLCBhciA9IFtdLCBlO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICB3aGlsZSAoKG4gPT09IHZvaWQgMCB8fCBuLS0gPiAwKSAmJiAhKHIgPSBpLm5leHQoKSkuZG9uZSkgYXIucHVzaChyLnZhbHVlKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlcnJvcikgeyBlID0geyBlcnJvcjogZXJyb3IgfTsgfVxyXG4gICAgZmluYWxseSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKHIgJiYgIXIuZG9uZSAmJiAobSA9IGlbXCJyZXR1cm5cIl0pKSBtLmNhbGwoaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbmFsbHkgeyBpZiAoZSkgdGhyb3cgZS5lcnJvcjsgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWQoKSB7XHJcbiAgICBmb3IgKHZhciBhciA9IFtdLCBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKylcclxuICAgICAgICBhciA9IGFyLmNvbmNhdChfX3JlYWQoYXJndW1lbnRzW2ldKSk7XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0KHYpIHtcclxuICAgIHJldHVybiB0aGlzIGluc3RhbmNlb2YgX19hd2FpdCA/ICh0aGlzLnYgPSB2LCB0aGlzKSA6IG5ldyBfX2F3YWl0KHYpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0dlbmVyYXRvcih0aGlzQXJnLCBfYXJndW1lbnRzLCBnZW5lcmF0b3IpIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgZyA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSwgaSwgcSA9IFtdO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlmIChnW25dKSBpW25dID0gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChhLCBiKSB7IHEucHVzaChbbiwgdiwgYSwgYl0pID4gMSB8fCByZXN1bWUobiwgdik7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiByZXN1bWUobiwgdikgeyB0cnkgeyBzdGVwKGdbbl0odikpOyB9IGNhdGNoIChlKSB7IHNldHRsZShxWzBdWzNdLCBlKTsgfSB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKHIpIHsgci52YWx1ZSBpbnN0YW5jZW9mIF9fYXdhaXQgPyBQcm9taXNlLnJlc29sdmUoci52YWx1ZS52KS50aGVuKGZ1bGZpbGwsIHJlamVjdCkgOiBzZXR0bGUocVswXVsyXSwgcik7IH1cclxuICAgIGZ1bmN0aW9uIGZ1bGZpbGwodmFsdWUpIHsgcmVzdW1lKFwibmV4dFwiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHJlamVjdCh2YWx1ZSkgeyByZXN1bWUoXCJ0aHJvd1wiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShmLCB2KSB7IGlmIChmKHYpLCBxLnNoaWZ0KCksIHEubGVuZ3RoKSByZXN1bWUocVswXVswXSwgcVswXVsxXSk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNEZWxlZ2F0b3Iobykge1xyXG4gICAgdmFyIGksIHA7XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIsIGZ1bmN0aW9uIChlKSB7IHRocm93IGU7IH0pLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuLCBmKSB7IGlbbl0gPSBvW25dID8gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIChwID0gIXApID8geyB2YWx1ZTogX19hd2FpdChvW25dKHYpKSwgZG9uZTogbiA9PT0gXCJyZXR1cm5cIiB9IDogZiA/IGYodikgOiB2OyB9IDogZjsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY1ZhbHVlcyhvKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIG0gPSBvW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSwgaTtcclxuICAgIHJldHVybiBtID8gbS5jYWxsKG8pIDogKG8gPSB0eXBlb2YgX192YWx1ZXMgPT09IFwiZnVuY3Rpb25cIiA/IF9fdmFsdWVzKG8pIDogb1tTeW1ib2wuaXRlcmF0b3JdKCksIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpKTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpW25dID0gb1tuXSAmJiBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkgeyB2ID0gb1tuXSh2KSwgc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgdi5kb25lLCB2LnZhbHVlKTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShyZXNvbHZlLCByZWplY3QsIGQsIHYpIHsgUHJvbWlzZS5yZXNvbHZlKHYpLnRoZW4oZnVuY3Rpb24odikgeyByZXNvbHZlKHsgdmFsdWU6IHYsIGRvbmU6IGQgfSk7IH0sIHJlamVjdCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWFrZVRlbXBsYXRlT2JqZWN0KGNvb2tlZCwgcmF3KSB7XHJcbiAgICBpZiAoT2JqZWN0LmRlZmluZVByb3BlcnR5KSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb29rZWQsIFwicmF3XCIsIHsgdmFsdWU6IHJhdyB9KTsgfSBlbHNlIHsgY29va2VkLnJhdyA9IHJhdzsgfVxyXG4gICAgcmV0dXJuIGNvb2tlZDtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydFN0YXIobW9kKSB7XHJcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xyXG4gICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKE9iamVjdC5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZCwgaykpIHJlc3VsdFtrXSA9IG1vZFtrXTtcclxuICAgIHJlc3VsdC5kZWZhdWx0ID0gbW9kO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0RGVmYXVsdChtb2QpIHtcclxuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgZGVmYXVsdDogbW9kIH07XHJcbn1cclxuIiwiLyogQ29weXJpZ2h0IMOCwqkgMjAxNiBMdWthcyBSb3NlbnRoYWxlciwgQW5kcsODwqkgS2lsY2hlbm1hbm4sIEFuZHJlYXMgQWVzY2hsaW1hbm4sXG4gKiBTb2ZpYSBHZW9yZ2Frb3BvdWxvdSwgSXZhbiBTdWJvdGljLCBCZW5qYW1pbiBHZWVyLCBUb2JpYXMgU2Nod2VpemVyLlxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgU0FMU0FILlxuICogU0FMU0FIIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAqIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZFxuICogYnkgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiAqIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG4gKiBTQUxTQUggaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAqIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljXG4gKiBMaWNlbnNlIGFsb25nIHdpdGggU0FMU0FILiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICogKi9cblxuaW1wb3J0IHsgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBJbnB1dCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZSwgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7XG4gICAgYW5pbWF0ZSxcbiAgICBzdGF0ZSxcbiAgICBzdHlsZSxcbiAgICB0cmFuc2l0aW9uLFxuICAgIHRyaWdnZXJcbn0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAna3VpLXNlYXJjaCcsXG4gICAgdGVtcGxhdGU6IGA8ZGl2IGNsYXNzPVwic2VhcmNoLWJhci1lbGVtZW50c1wiPlxuXG4gICAgPCEtLSB0aGUgbmV4dCBlbGVtZW50IC0gZGl2LmV4dGVuZGVkLXNlYXJjaC1wYW5lbCAtIGlzIGEgaGlkZGVuIGRyb3Bkb3duIGZpbHRlciBtZW51IC0tPlxuXG4gICAgPGRpdiBjbGFzcz1cInNlYXJjaC1wYW5lbFwiIFtjbGFzcy5hY3RpdmVdPVwic2VhcmNoUGFuZWxGb2N1c1wiPlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cInByZWZpeFwiIChjbGljayk9XCJkb1NlYXJjaChzZWFyY2gpXCI+XG4gICAgICAgICAgICAgICAgPG1hdC1pY29uPnNlYXJjaDwvbWF0LWljb24+XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBjbGFzcz1cImlucHV0LWZpZWxkXCI+XG4gICAgICAgICAgICA8aW5wdXQgI3NlYXJjaCBhdXRvY29tcGxldGU9XCJvZmZcIiB0eXBlPVwic2VhcmNoXCIgW3BsYWNlaG9sZGVyXT1cInNlYXJjaExhYmVsXCIgWyhuZ01vZGVsKV09XCJzZWFyY2hRdWVyeVwiIG5hbWU9XCJzZWFyY2hcIiAoa2V5dXAuZXNjKT1cInJlc2V0U2VhcmNoKHNlYXJjaClcIlxuICAgICAgICAgICAgICAgIChrZXl1cCk9XCJvbktleShzZWFyY2gsICRldmVudClcIiAoY2xpY2spPVwic2V0Rm9jdXMoKVwiIChmb2N1cyk9XCJ0b2dnbGVNZW51KCdzaW1wbGVTZWFyY2gnKVwiIFtkaXNhYmxlZF09XCJmb2N1c09uRXh0ZW5kZWQgPT09ICdhY3RpdmUnXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDwhLS0gc3dpdGNoIGJ1dHRvbjogb24gc29tZSBmb2N1cyB3ZSBuZWVkIGEgY2xvc2UgYnV0dG9uIGZvciB0aGUgc2ltcGxlIG9yIGV4dGVuZGVkIHBhbmVsIC0tPlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cInN1ZmZpeFwiICpuZ0lmPVwiZm9jdXNPblNpbXBsZSA9PT0gJ2FjdGl2ZSdcIiAoY2xpY2spPVwicmVzZXRTZWFyY2goc2VhcmNoKVwiPlxuICAgICAgICAgICAgICAgIDxtYXQtaWNvbj5jbG9zZTwvbWF0LWljb24+XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJzdWZmaXhcIiAqbmdJZj1cImZvY3VzT25TaW1wbGUgPT09ICdpbmFjdGl2ZSdcIj5cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8IS0tIHRoZSBzZWFyY2ggcGFuZWwgaGFzIHR3byBcImRyb3Bkb3duXCIgbWVudXM6IG9uZSBmb3Igc2ltcGxlIHNlYXJjaCBhbmQgYW5vdGhlciBvbmUgZm9yIHRoZSBleHRlbmRlZCBzZWFyY2ggLS0+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJzYWxzYWgtbWVudSBzaW1wbGUtc2VhcmNoXCIgW0BzaW1wbGVTZWFyY2hNZW51XT1cImZvY3VzT25TaW1wbGVcIiAqbmdJZj1cInNob3dTaW1wbGVTZWFyY2hcIj5cbiAgICAgICAgICAgIDxtYXQtbGlzdCBjbGFzcz1cInNhbHNhaC1wcmV2aW91cy1zZWFyY2gtbGlzdFwiPlxuICAgICAgICAgICAgICAgIDxtYXQtbGlzdC1pdGVtICpuZ0Zvcj1cImxldCBpdGVtIG9mIHByZXZTZWFyY2ggfCByZXZlcnNlOyBsZXQgaT1pbmRleFwiPlxuICAgICAgICAgICAgICAgICAgICA8aDQgbWF0LWxpbmUgKm5nSWY9XCJpPDEwXCIgKGNsaWNrKT1cImRvUHJldlNlYXJjaChpdGVtKVwiPnt7aXRlbX19PC9oND5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBtYXQtaWNvbi1idXR0b24gKGNsaWNrKT1cInJlc2V0UHJldlNlYXJjaChpdGVtKVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPG1hdC1pY29uIGFyaWEtbGFiZWw9XCJjbG9zZVwiPmNsZWFyPC9tYXQtaWNvbj5cbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9tYXQtbGlzdC1pdGVtPlxuICAgICAgICAgICAgPC9tYXQtbGlzdD5cbiAgICAgICAgICAgIDxidXR0b24gbWF0LXN0cm9rZWQtYnV0dG9uIGNvbG9yPVwiYWNjZW50XCIgY2xhc3M9XCJyaWdodFwiIChjbGljayk9XCJyZXNldFByZXZTZWFyY2goKVwiICpuZ0lmPVwicHJldlNlYXJjaFwiPkNsZWFyPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgY2xhc3M9XCJzYWxzYWgtbWVudSBleHRlbmRlZC1zZWFyY2hcIiBbQGV4dGVuZGVkU2VhcmNoTWVudV09XCJmb2N1c09uRXh0ZW5kZWRcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzYWxzYWgtbWVudS1oZWFkZXJcIj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNhbHNhaC1tZW51LXRpdGxlXCI+XG4gICAgICAgICAgICAgICAgICAgIDxoND5BZHZhbmNlZCBzZWFyY2g8L2g0PlxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNhbHNhaC1tZW51LWFjdGlvblwiPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIG1hdC1pY29uLWJ1dHRvbiAoY2xpY2spPVwidG9nZ2xlTWVudSgnZXh0ZW5kZWRTZWFyY2gnKVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPG1hdC1pY29uPmNsb3NlPC9tYXQtaWNvbj5cbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZXh0ZW5kZWQtc2VhcmNoLWJveFwiPlxuICAgICAgICAgICAgICAgIDxrdWktZXh0ZW5kZWQtc2VhcmNoIFtyb3V0ZV09XCJyb3V0ZVwiICh0b2dnbGVFeHRlbmRlZFNlYXJjaEZvcm0pPVwidG9nZ2xlTWVudSgnZXh0ZW5kZWRTZWFyY2gnKVwiPjwva3VpLWV4dGVuZGVkLXNlYXJjaD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cblxuICAgIDwhLS0gRXh0ZW5kZWQgc2VhcmNoIGJ1dHRvbiB0byBkaXNwbGF5IHRoZSBleHRlbmRlZCBzZWFyY2ggZm9ybSBpbiB0aGUgc2VhcmNoIHBhbmVsIC0tPlxuICAgIDxidXR0b24gbWF0LWJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY29sb3I9XCJwcmltYXJ5XCIgY2xhc3M9XCJhZHZhbmNlZC1zZWFyY2gtYnV0dG9uXCIgKGNsaWNrKT1cInRvZ2dsZU1lbnUoJ2V4dGVuZGVkU2VhcmNoJylcIj5cbiAgICAgICAgYWR2YW5jZWRcbiAgICA8L2J1dHRvbj5cblxuPC9kaXY+XG5gLFxuICAgIHN0eWxlczogW2BpbnB1dFt0eXBlPXNlYXJjaF06Oi13ZWJraXQtc2VhcmNoLWNhbmNlbC1idXR0b24saW5wdXRbdHlwZT1zZWFyY2hdOjotd2Via2l0LXNlYXJjaC1kZWNvcmF0aW9uLGlucHV0W3R5cGU9c2VhcmNoXTo6LXdlYmtpdC1zZWFyY2gtcmVzdWx0cy1idXR0b24saW5wdXRbdHlwZT1zZWFyY2hdOjotd2Via2l0LXNlYXJjaC1yZXN1bHRzLWRlY29yYXRpb257ZGlzcGxheTpub25lfWlucHV0W3R5cGU9c2VhcmNoXXstbW96LWFwcGVhcmFuY2U6bm9uZTstd2Via2l0LWFwcGVhcmFuY2U6bm9uZX0uY2VudGVye2Rpc3BsYXk6YmxvY2s7bWFyZ2luLWxlZnQ6YXV0bzttYXJnaW4tcmlnaHQ6YXV0b30uY2xvc2V7cmlnaHQ6MTJweH0uZXh0ZW5kZWQtc2VhcmNoLWJveHttYXJnaW46MTJweH0uYWR2YW5jZWQtc2VhcmNoLWJ1dHRvbnttYXJnaW4tbGVmdDoxMHB4fS5mdWxsLXdpZHRoe3dpZHRoOjEwMCV9LmhpZGV7ZGlzcGxheTpub25lfS5pbmFjdGl2ZSwubXV0ZXtjb2xvcjojN2E3YTdhfS5zZWFyY2gtcGFuZWx7YmFja2dyb3VuZC1jb2xvcjojZjlmOWY5O2JvcmRlci1yYWRpdXM6NHB4O2Rpc3BsYXk6aW5saW5lLWZsZXg7aGVpZ2h0OjQwcHg7cG9zaXRpb246cmVsYXRpdmU7d2lkdGg6NzIwcHg7ei1pbmRleDoxMH0uc2VhcmNoLXBhbmVsOmhvdmVye2JveC1zaGFkb3c6MCAxcHggM3B4IHJnYmEoMCwwLDAsLjUpfS5zZWFyY2gtcGFuZWwgZGl2LmlucHV0LWZpZWxke2ZsZXg6MX0uc2VhcmNoLXBhbmVsIGRpdi5pbnB1dC1maWVsZCBpbnB1dHtib3JkZXItc3R5bGU6bm9uZTtmb250LXNpemU6MTRwdDtoZWlnaHQ6MzhweDtwb3NpdGlvbjphYnNvbHV0ZTt3aWR0aDo2NDBweH0uc2VhcmNoLXBhbmVsIGRpdi5pbnB1dC1maWVsZCBpbnB1dDphY3RpdmUsLnNlYXJjaC1wYW5lbCBkaXYuaW5wdXQtZmllbGQgaW5wdXQ6Zm9jdXN7b3V0bGluZTowfS5zZWFyY2gtcGFuZWwgZGl2IC5wcmVmaXgsLnNlYXJjaC1wYW5lbCBkaXYgLnN1ZmZpeHtiYWNrZ3JvdW5kLWNvbG9yOiNmZmY7Ym9yZGVyLXJhZGl1czozcHg7Ym9yZGVyLXN0eWxlOm5vbmU7Y29sb3I6cmdiYSg0MSw0MSw0MSwuNCk7Y3Vyc29yOnBvaW50ZXI7aGVpZ2h0OjM4cHg7b3V0bGluZTowO3Bvc2l0aW9uOnJlbGF0aXZlO3dpZHRoOjQwcHh9LnNlYXJjaC1wYW5lbCBkaXYgLnByZWZpeDphY3RpdmUsLnNlYXJjaC1wYW5lbCBkaXYgLnN1ZmZpeDphY3RpdmV7Y29sb3I6IzUxNTE1MX0uc2VhcmNoLXBhbmVsLmFjdGl2ZXtib3gtc2hhZG93OjAgMXB4IDNweCByZ2JhKDAsMCwwLC41KX0uc2Fsc2FoLW1lbnV7Ym94LXNoYWRvdzowIDNweCA1cHggLTFweCByZ2JhKDExLDExLDExLC4yKSwwIDZweCAxMHB4IDAgcmdiYSgxMSwxMSwxMSwuMTQpLDAgMXB4IDE4cHggMCByZ2JhKDExLDExLDExLC4xMik7YmFja2dyb3VuZC1jb2xvcjojZjlmOWY5O2JvcmRlci1yYWRpdXM6NHB4O3Bvc2l0aW9uOmFic29sdXRlfS5zYWxzYWgtbWVudSAuc2Fsc2FoLW1lbnUtaGVhZGVye2JhY2tncm91bmQtY29sb3I6I2Y5ZjlmOTtib3JkZXItdG9wLWxlZnQtcmFkaXVzOjRweDtib3JkZXItdG9wLXJpZ2h0LXJhZGl1czo0cHg7ZGlzcGxheTppbmxpbmUtYmxvY2s7aGVpZ2h0OjQ4cHg7d2lkdGg6MTAwJX0uc2Fsc2FoLW1lbnUgLnNhbHNhaC1tZW51LWhlYWRlciAuc2Fsc2FoLW1lbnUtdGl0bGV7ZmxvYXQ6bGVmdDtmb250LXNpemU6MTRweDtmb250LXdlaWdodDo0MDA7bWFyZ2luLXRvcDo0cHg7cGFkZGluZzoxMnB4fS5zYWxzYWgtbWVudSAuc2Fsc2FoLW1lbnUtaGVhZGVyIC5zYWxzYWgtbWVudS1hY3Rpb257ZmxvYXQ6cmlnaHQ7bWFyZ2luOjRweH0uc2Fsc2FoLW1lbnUuZXh0ZW5kZWQtc2VhcmNoLC5zYWxzYWgtbWVudS5zaW1wbGUtc2VhcmNoe21pbi1oZWlnaHQ6NzIwcHg7d2lkdGg6NzIwcHh9LnNhbHNhaC1tZW51LnNpbXBsZS1zZWFyY2h7cGFkZGluZy10b3A6NjBweDt6LWluZGV4Oi0xfS5zYWxzYWgtbWVudS5zaW1wbGUtc2VhcmNoIC5zYWxzYWgtcHJldmlvdXMtc2VhcmNoLWxpc3QgLm1hdC1saXN0LWl0ZW17Y3Vyc29yOnBvaW50ZXJ9LnNhbHNhaC1tZW51LnNpbXBsZS1zZWFyY2ggLnNhbHNhaC1wcmV2aW91cy1zZWFyY2gtbGlzdCAubWF0LWxpc3QtaXRlbTpob3ZlcntiYWNrZ3JvdW5kLWNvbG9yOiNmOWY5Zjl9LnNhbHNhaC1tZW51LnNpbXBsZS1zZWFyY2ggLnNhbHNhaC1wcmV2aW91cy1zZWFyY2gtbGlzdCAubWF0LWxpc3QtaXRlbTpob3ZlciBtYXQtaWNvbntkaXNwbGF5OmJsb2NrfS5zYWxzYWgtbWVudS5zaW1wbGUtc2VhcmNoIC5zYWxzYWgtcHJldmlvdXMtc2VhcmNoLWxpc3QgLm1hdC1saXN0LWl0ZW0gbWF0LWljb257ZGlzcGxheTpub25lfS5zYWxzYWgtbWVudS5zaW1wbGUtc2VhcmNoIC5yaWdodHttYXJnaW4tdG9wOjEycHg7bWFyZ2luLWxlZnQ6MTZweH0uc2Fsc2FoLW1lbnUuZXh0ZW5kZWQtc2VhcmNoe3otaW5kZXg6MjB9LnNlYXJjaC1iYXItZWxlbWVudHN7ZGlzcGxheTpmbGV4fS5zaG93e2Rpc3BsYXk6YmxvY2t9YF0sXG4gICAgYW5pbWF0aW9uczogW1xuICAgICAgICB0cmlnZ2VyKCdzaW1wbGVTZWFyY2hNZW51JyxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICBzdGF0ZSgnaW5hY3RpdmUnLCBzdHlsZSh7IGRpc3BsYXk6ICdub25lJyB9KSksXG4gICAgICAgICAgICAgICAgc3RhdGUoJ2FjdGl2ZScsIHN0eWxlKHsgZGlzcGxheTogJ2Jsb2NrJyB9KSksXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbignaW5hY3RpdmUgPT4gdHJ1ZScsIGFuaW1hdGUoJzEwMG1zIGVhc2UtaW4nKSksXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbigndHJ1ZSA9PiBpbmFjdGl2ZScsIGFuaW1hdGUoJzEwMG1zIGVhc2Utb3V0JykpXG4gICAgICAgICAgICBdXG4gICAgICAgICksXG4gICAgICAgIHRyaWdnZXIoJ2V4dGVuZGVkU2VhcmNoTWVudScsXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgc3RhdGUoJ2luYWN0aXZlJywgc3R5bGUoeyBkaXNwbGF5OiAnbm9uZScgfSkpLFxuICAgICAgICAgICAgICAgIHN0YXRlKCdhY3RpdmUnLCBzdHlsZSh7IGRpc3BsYXk6ICdibG9jaycgfSkpLFxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb24oJ2luYWN0aXZlID0+IHRydWUnLCBhbmltYXRlKCcxMDBtcyBlYXNlLWluJykpLFxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb24oJ3RydWUgPT4gaW5hY3RpdmUnLCBhbmltYXRlKCcxMDBtcyBlYXNlLW91dCcpKVxuICAgICAgICAgICAgXVxuICAgICAgICApLFxuICAgIF1cbn0pXG5cblxuZXhwb3J0IGNsYXNzIFNlYXJjaENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgICBASW5wdXQoKSByb3V0ZTogc3RyaW5nID0gJy9zZWFyY2gnO1xuXG4gICAgc2VhcmNoUXVlcnk6IHN0cmluZztcblxuICAgIHNlYXJjaFBhbmVsRm9jdXM6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIHByZXZTZWFyY2g6IHN0cmluZ1tdID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncHJldlNlYXJjaCcpKTtcblxuICAgIGZvY3VzT25TaW1wbGU6IHN0cmluZyA9ICdpbmFjdGl2ZSc7XG4gICAgZm9jdXNPbkV4dGVuZGVkOiBzdHJpbmcgPSAnaW5hY3RpdmUnO1xuXG4gICAgc2VhcmNoTGFiZWw6IHN0cmluZyA9ICdTZWFyY2gnO1xuXG4gICAgc2hvd1NpbXBsZVNlYXJjaDogYm9vbGVhbiA9IHRydWU7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9yb3V0ZTogQWN0aXZhdGVkUm91dGUsXG4gICAgICAgIHByaXZhdGUgX3JvdXRlcjogUm91dGVyLFxuICAgICAgICBwcml2YXRlIF9lbGVSZWY6IEVsZW1lbnRSZWYpIHtcblxuICAgIH1cblxuICAgIG5nT25Jbml0KCkge1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIHNlYXJjaF9lbGVcbiAgICAgKiBAcGFyYW0gZXZlbnRcbiAgICAgKi9cbiAgICBvbktleShzZWFyY2hfZWxlOiBIVE1MRWxlbWVudCwgZXZlbnQpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5mb2N1c09uU2ltcGxlID0gJ2FjdGl2ZSc7XG4gICAgICAgIHRoaXMucHJldlNlYXJjaCA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3ByZXZTZWFyY2gnKSk7XG4gICAgICAgIGlmICh0aGlzLnNlYXJjaFF1ZXJ5ICYmIChldmVudC5rZXkgPT09ICdFbnRlcicgfHwgZXZlbnQua2V5Q29kZSA9PT0gMTMgfHwgZXZlbnQud2hpY2ggPT09IDEzKSkge1xuICAgICAgICAgICAgdGhpcy5kb1NlYXJjaChzZWFyY2hfZWxlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXZlbnQua2V5ID09PSAnRXNjYXBlJyB8fCBldmVudC5rZXlDb2RlID09PSAyNyB8fCBldmVudC53aGljaCA9PT0gMjcpIHtcbiAgICAgICAgICAgIHRoaXMucmVzZXRTZWFyY2goc2VhcmNoX2VsZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZWFsaXNlIGEgc2ltcGxlIHNlYXJjaFxuICAgICAqIEBwYXJhbSBzZWFyY2hfZWxlXG4gICAgICovXG4gICAgZG9TZWFyY2goc2VhcmNoX2VsZTogSFRNTEVsZW1lbnQpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuc2VhcmNoUXVlcnkgIT09IHVuZGVmaW5lZCAmJiB0aGlzLnNlYXJjaFF1ZXJ5ICE9PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLnRvZ2dsZU1lbnUoJ3NpbXBsZVNlYXJjaCcpO1xuICAgICAgICAgICAgdGhpcy5fcm91dGVyLm5hdmlnYXRlKFt0aGlzLnJvdXRlICsgJy9mdWxsdGV4dC8nICsgdGhpcy5zZWFyY2hRdWVyeV0pO1xuXG4gICAgICAgICAgICAvLyB0aGlzLl9yb3V0ZXIubmF2aWdhdGUoWycvc2VhcmNoL2Z1bGx0ZXh0LycgKyB0aGlzLnNlYXJjaFF1ZXJ5XSwgeyByZWxhdGl2ZVRvOiB0aGlzLl9yb3V0ZSB9KTtcblxuICAgICAgICAgICAgLy8gcHVzaCB0aGUgc2VhcmNoIHF1ZXJ5IGludG8gdGhlIGxvY2FsIHN0b3JhZ2UgcHJldlNlYXJjaCBhcnJheSAocHJldmlvdXMgc2VhcmNoKVxuICAgICAgICAgICAgLy8gdG8gaGF2ZSBhIGxpc3Qgb2YgcmVjZW50IHNlYXJjaCByZXF1ZXN0c1xuICAgICAgICAgICAgbGV0IGV4aXN0aW5nUHJldlNlYXJjaDogc3RyaW5nW10gPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdwcmV2U2VhcmNoJykpO1xuICAgICAgICAgICAgaWYgKGV4aXN0aW5nUHJldlNlYXJjaCA9PT0gbnVsbCkgeyBleGlzdGluZ1ByZXZTZWFyY2ggPSBbXTsgfVxuICAgICAgICAgICAgbGV0IGk6IG51bWJlciA9IDA7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIGV4aXN0aW5nUHJldlNlYXJjaCkge1xuICAgICAgICAgICAgICAgIC8vIHJlbW92ZSBlbnRyeSwgaWYgZXhpc3RzIGFscmVhZHlcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zZWFyY2hRdWVyeSA9PT0gZW50cnkpIHsgZXhpc3RpbmdQcmV2U2VhcmNoLnNwbGljZShpLCAxKTsgfVxuICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZXhpc3RpbmdQcmV2U2VhcmNoLnB1c2godGhpcy5zZWFyY2hRdWVyeSk7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncHJldlNlYXJjaCcsIEpTT04uc3RyaW5naWZ5KGV4aXN0aW5nUHJldlNlYXJjaCkpO1xuICAgICAgICAgICAgLy8gVE9ETzogc2F2ZSB0aGUgcHJldmlvdXMgc2VhcmNoIHF1ZXJpZXMgc29tZXdoZXJlIGluIHRoZSB1c2VyJ3MgcHJvZmlsZVxuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZWFyY2hfZWxlLmZvY3VzKCk7XG4gICAgICAgICAgICB0aGlzLnByZXZTZWFyY2ggPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdwcmV2U2VhcmNoJykpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVzZXQgdGhlIHNlYXJjaFxuICAgICAqIEBwYXJhbSBzZWFyY2hfZWxlXG4gICAgICovXG4gICAgcmVzZXRTZWFyY2goc2VhcmNoX2VsZTogSFRNTEVsZW1lbnQpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zZWFyY2hRdWVyeSA9IG51bGw7XG4gICAgICAgIHNlYXJjaF9lbGUuZm9jdXMoKTtcbiAgICAgICAgdGhpcy5mb2N1c09uU2ltcGxlID0gJ2luYWN0aXZlJztcbiAgICAgICAgdGhpcy5zZWFyY2hQYW5lbEZvY3VzID0gIXRoaXMuc2VhcmNoUGFuZWxGb2N1cztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZWFsaXNlIGEgcHJldmlvdXMgc2VhcmNoXG4gICAgICogQHBhcmFtIHF1ZXJ5XG4gICAgICovXG4gICAgZG9QcmV2U2VhcmNoKHF1ZXJ5OiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zZWFyY2hRdWVyeSA9IHF1ZXJ5O1xuICAgICAgICB0aGlzLl9yb3V0ZXIubmF2aWdhdGUoW3RoaXMucm91dGUgKyAnL2Z1bGx0ZXh0LycgKyBxdWVyeV0sIHsgcmVsYXRpdmVUbzogdGhpcy5fcm91dGUgfSk7XG4gICAgICAgIHRoaXMudG9nZ2xlTWVudSgnc2ltcGxlU2VhcmNoJyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVzZXQgcHJldmlvdXMgc2VhcmNoZXMgLSB0aGUgd2hvbGUgcHJldmlvdXMgc2VhcmNoIG9yIHNwZWNpZmljIGl0ZW0gYnkgbmFtZVxuICAgICAqIEBwYXJhbSBuYW1lXG4gICAgICovXG4gICAgcmVzZXRQcmV2U2VhcmNoKG5hbWU6IHN0cmluZyA9IG51bGwpOiB2b2lkIHtcbiAgICAgICAgaWYgKG5hbWUpIHtcbiAgICAgICAgICAgIC8vIGRlbGV0ZSBvbmx5IHRoaXMgaXRlbSB3aXRoIHRoZSBuYW1lIC4uLlxuICAgICAgICAgICAgY29uc3QgaTogbnVtYmVyID0gdGhpcy5wcmV2U2VhcmNoLmluZGV4T2YobmFtZSk7XG4gICAgICAgICAgICB0aGlzLnByZXZTZWFyY2guc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3ByZXZTZWFyY2gnLCBKU09OLnN0cmluZ2lmeSh0aGlzLnByZXZTZWFyY2gpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGRlbGV0ZSB0aGUgd2hvbGUgXCJwcmV2aW91cyBzZWFyY2hcIiBhcnJheVxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ3ByZXZTZWFyY2gnKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnByZXZTZWFyY2ggPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdwcmV2U2VhcmNoJykpO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0IHNpbXBsZSBmb2N1cyB0byBhY3RpdmVcbiAgICAgKi9cbiAgICBzZXRGb2N1cygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5wcmV2U2VhcmNoID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncHJldlNlYXJjaCcpKTtcbiAgICAgICAgdGhpcy5mb2N1c09uU2ltcGxlID0gJ2FjdGl2ZSc7XG4gICAgICAgIHRoaXMuc2VhcmNoUGFuZWxGb2N1cyA9ICF0aGlzLnNlYXJjaFBhbmVsRm9jdXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3dpdGNoIGFjY29yZGluZyB0byB0aGUgZm9jdXMgYmV0d2VlbiBzaW1wbGUgb3IgZXh0ZW5kZWQgc2VhcmNoXG4gICAgICogQHBhcmFtIG5hbWVcbiAgICAgKi9cbiAgICB0b2dnbGVNZW51KG5hbWU6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICBzd2l0Y2ggKG5hbWUpIHtcbiAgICAgICAgICAgIGNhc2UgJ3NpbXBsZVNlYXJjaCc6XG4gICAgICAgICAgICAgICAgdGhpcy5wcmV2U2VhcmNoID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncHJldlNlYXJjaCcpKTtcbiAgICAgICAgICAgICAgICB0aGlzLmZvY3VzT25TaW1wbGUgPSAodGhpcy5mb2N1c09uU2ltcGxlID09PSAnYWN0aXZlJyA/ICdpbmFjdGl2ZScgOiAnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5zaG93U2ltcGxlU2VhcmNoID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2V4dGVuZGVkU2VhcmNoJzpcbiAgICAgICAgICAgICAgICB0aGlzLmZvY3VzT25FeHRlbmRlZCA9ICh0aGlzLmZvY3VzT25FeHRlbmRlZCA9PT0gJ2FjdGl2ZScgPyAnaW5hY3RpdmUnIDogJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2hvd1NpbXBsZVNlYXJjaCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIEluamVjdCwgSW5wdXQsIE9uSW5pdCwgT3V0cHV0LCBRdWVyeUxpc3QsIFZpZXdDaGlsZCwgVmlld0NoaWxkcmVuIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZSwgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IEZvcm1CdWlsZGVyLCBGb3JtR3JvdXAgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge1xuICAgIEdyYXZzZWFyY2hHZW5lcmF0aW9uU2VydmljZSxcbiAgICBPbnRvbG9neUNhY2hlU2VydmljZSxcbiAgICBPbnRvbG9neUluZm9ybWF0aW9uLFxuICAgIE9udG9sb2d5TWV0YWRhdGEsXG4gICAgUHJvcGVydGllcyxcbiAgICBQcm9wZXJ0eVdpdGhWYWx1ZSxcbiAgICBSZWFkUmVzb3VyY2VzU2VxdWVuY2UsXG4gICAgUmVzb3VyY2VDbGFzc1xufSBmcm9tICdAa25vcmEvY29yZSc7XG5pbXBvcnQgeyBTZWxlY3RQcm9wZXJ0eUNvbXBvbmVudCB9IGZyb20gJy4vc2VsZWN0LXByb3BlcnR5L3NlbGVjdC1wcm9wZXJ0eS5jb21wb25lbnQnO1xuaW1wb3J0IHsgU2VsZWN0UmVzb3VyY2VDbGFzc0NvbXBvbmVudCB9IGZyb20gJy4vc2VsZWN0LXJlc291cmNlLWNsYXNzL3NlbGVjdC1yZXNvdXJjZS1jbGFzcy5jb21wb25lbnQnO1xuXG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAna3VpLWV4dGVuZGVkLXNlYXJjaCcsXG4gICAgdGVtcGxhdGU6IGA8Zm9ybSBbZm9ybUdyb3VwXT1cImZvcm1cIiAobmdTdWJtaXQpPVwic3VibWl0KClcIj5cblxuICA8ZGl2PlxuICAgIDxrdWktc2VsZWN0LW9udG9sb2d5ICpuZ0lmPVwib250b2xvZ2llcy5sZW5ndGggPiAwXCIgW2Zvcm1Hcm91cF09XCJmb3JtXCIgW29udG9sb2dpZXNdPVwib250b2xvZ2llc1wiIChvbnRvbG9neVNlbGVjdGVkKT1cImdldFJlc291cmNlQ2xhc3Nlc0FuZFByb3BlcnRpZXNGb3JPbnRvbG9neSgkZXZlbnQpXCI+PC9rdWktc2VsZWN0LW9udG9sb2d5PlxuICA8L2Rpdj5cblxuICA8ZGl2IGNsYXNzPVwic2VsZWN0LXJlc291cmNlLWNsYXNzXCIgKm5nSWY9XCJyZXNvdXJjZUNsYXNzZXM/Lmxlbmd0aCA+IDBcIj5cbiAgICA8a3VpLXNlbGVjdC1yZXNvdXJjZS1jbGFzcyAjcmVzb3VyY2VDbGFzcyBbZm9ybUdyb3VwXT1cImZvcm1cIiBbcmVzb3VyY2VDbGFzc2VzXT1cInJlc291cmNlQ2xhc3Nlc1wiIChyZXNvdXJjZUNsYXNzU2VsZWN0ZWRFdmVudCk9XCJnZXRQcm9wZXJ0aWVzRm9yUmVzb3VyY2VDbGFzcygkZXZlbnQpXCI+PC9rdWktc2VsZWN0LXJlc291cmNlLWNsYXNzPlxuICA8L2Rpdj5cblxuICA8ZGl2IGNsYXNzPVwic2VsZWN0LXByb3BlcnR5XCIgKm5nSWY9XCJwcm9wZXJ0aWVzICE9PSB1bmRlZmluZWRcIj5cbiAgICA8ZGl2ICpuZ0Zvcj1cImxldCBwcm9wIG9mIGFjdGl2ZVByb3BlcnRpZXM7IGxldCBpID0gaW5kZXhcIj5cblxuICAgICAgPGt1aS1zZWxlY3QtcHJvcGVydHkgI3Byb3BlcnR5IFthY3RpdmVSZXNvdXJjZUNsYXNzXT1cImFjdGl2ZVJlc291cmNlQ2xhc3NcIiBbZm9ybUdyb3VwXT1cImZvcm1cIiBbaW5kZXhdPVwiaVwiIFtwcm9wZXJ0aWVzXT1cInByb3BlcnRpZXNcIj48L2t1aS1zZWxlY3QtcHJvcGVydHk+XG5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG5cblxuICA8ZGl2PlxuICAgIDxidXR0b24gbWF0LW1pbmktZmFiIGNsYXNzPVwicHJvcGVydHktYnV0dG9ucyBhZGQtcHJvcGVydHktYnV0dG9uXCIgY29sb3I9XCJwcmltYXJ5XCIgdHlwZT1cImJ1dHRvblwiIChjbGljayk9XCJhZGRQcm9wZXJ0eSgpXCIgW2Rpc2FibGVkXT1cImFjdGl2ZU9udG9sb2d5ID09PSB1bmRlZmluZWQgfHwgYWN0aXZlUHJvcGVydGllcy5sZW5ndGggPj0gNFwiPlxuICAgICAgPG1hdC1pY29uIGFyaWEtbGFiZWw9XCJhZGQgYSBwcm9wZXJ0eVwiPmFkZDwvbWF0LWljb24+XG4gICAgPC9idXR0b24+XG5cbiAgICA8YnV0dG9uIG1hdC1taW5pLWZhYiBjbGFzcz1cInByb3BlcnR5LWJ1dHRvbnMgcmVtb3ZlLXByb3BlcnR5LWJ1dHRvblwiIGNvbG9yPVwicHJpbWFyeVwiIHR5cGU9XCJidXR0b25cIiAoY2xpY2spPVwicmVtb3ZlUHJvcGVydHkoKVwiIFtkaXNhYmxlZF09XCJhY3RpdmVQcm9wZXJ0aWVzLmxlbmd0aCA9PSAwXCI+XG4gICAgICA8bWF0LWljb24gYXJpYS1sYWJlbD1cInJlbW92ZSBwcm9wZXJ0eVwiPnJlbW92ZTwvbWF0LWljb24+XG4gICAgPC9idXR0b24+XG4gIDwvZGl2PlxuXG4gIDwhLS0gIDxkaXY+XG4gICAgPGJ1dHRvbiBtYXQtaWNvbi1idXR0b24gdHlwZT1cImJ1dHRvblwiIChjbGljayk9XCJyZXNldEZvcm0oKVwiIFtkaXNhYmxlZF09XCJ0aGlzLmFjdGl2ZU9udG9sb2d5ID09PSB1bmRlZmluZWRcIj5cbiAgICAgIDxtYXQtaWNvbiBhcmlhLWxhYmVsPVwicmVzZXQgcXVlcnkgZm9ybVwiPmNsZWFyPC9tYXQtaWNvbj5cbiAgICA8L2J1dHRvbj5cblxuICAgIDxidXR0b24gbWF0LWljb24tYnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBbZGlzYWJsZWRdPVwiIWZvcm1WYWxpZFwiPlxuICAgICAgPG1hdC1pY29uIGFyaWEtbGFiZWw9XCJzdWJtaXQgcXVlcnlcIj5zZW5kPC9tYXQtaWNvbj5cbiAgICA8L2J1dHRvbj5cbiAgPC9kaXY+IC0tPlxuXG4gIDxidXR0b24gY2xhc3M9XCJleHRlbmRlZC1idXR0b25zIGV4dGVuZGVkLXNlYXJjaC1idXR0b25cIiBtYXQtc3Ryb2tlZC1idXR0b24gY29sb3I9XCJwcmltYXJ5XCIgdHlwZT1cInN1Ym1pdFwiIFtkaXNhYmxlZF09XCIhZm9ybVZhbGlkXCI+XG4gICAgU2VhcmNoXG4gIDwvYnV0dG9uPlxuICA8YnV0dG9uIGNsYXNzPVwiZXh0ZW5kZWQtYnV0dG9ucyByZXNldFwiIG1hdC1zdHJva2VkLWJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgKGNsaWNrKT1cInJlc2V0Rm9ybSgpXCIgW2Rpc2FibGVkXT1cInRoaXMuYWN0aXZlT250b2xvZ3kgPT09IHVuZGVmaW5lZFwiPlxuICAgIFJlc2V0XG4gIDwvYnV0dG9uPlxuXG5cbjwvZm9ybT5cbmAsXG4gICAgc3R5bGVzOiBbYC5hZGQtcHJvcGVydHktYnV0dG9ue21hcmdpbi1yaWdodDo1cHh9LmV4dGVuZGVkLWJ1dHRvbnN7bWFyZ2luLXRvcDoyNXB4fS5leHRlbmRlZC1zZWFyY2gtYnV0dG9ue21hcmdpbi1yaWdodDo1cHh9LnByb3BlcnR5LWJ1dHRvbnN7bWFyZ2luLXRvcDoyNXB4fS5zZWxlY3QtcHJvcGVydHl7bWFyZ2luLWxlZnQ6MjJweH0uc2VsZWN0LXJlc291cmNlLWNsYXNze21hcmdpbi1sZWZ0OjEycHh9YF1cbn0pXG5leHBvcnQgY2xhc3MgRXh0ZW5kZWRTZWFyY2hDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gICAgQElucHV0KCkgcm91dGU7XG5cbiAgICAvLyB0cmlnZ2VyIHRvZ2dsZSBmb3IgZXh0ZW5kZWQgc2VhcmNoIGZvcm1cbiAgICBAT3V0cHV0KCkgdG9nZ2xlRXh0ZW5kZWRTZWFyY2hGb3JtID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xuXG4gICAgLy8gYWxsIGF2YWlsYWJsZSBvbnRvbG9naWVzXG4gICAgb250b2xvZ2llczogQXJyYXk8T250b2xvZ3lNZXRhZGF0YT4gPSBbXTtcblxuICAgIC8vIG9udG9sb2d5IGNob3NlbiBieSB0aGUgdXNlclxuICAgIGFjdGl2ZU9udG9sb2d5OiBzdHJpbmc7XG5cbiAgICAvLyBwcm9wZXJ0aWVzIHNwZWNpZmllZCBieSB0aGUgdXNlclxuICAgIGFjdGl2ZVByb3BlcnRpZXM6IGJvb2xlYW5bXSA9IFtdO1xuXG4gICAgLy8gcmVzb3VyY2UgY2xhc3NlcyBmb3IgdGhlIHNlbGVjdGVkIG9udG9sb2d5XG4gICAgcmVzb3VyY2VDbGFzc2VzOiBBcnJheTxSZXNvdXJjZUNsYXNzPiA9IFtdO1xuXG4gICAgLy8gZGVmaW5pdGlvbiBvZiB0aGUgc2VsZWN0ZWQgcmVzb3VyY2UgY2xhc3MsIGlmIHNldC5cbiAgICBhY3RpdmVSZXNvdXJjZUNsYXNzOiBSZXNvdXJjZUNsYXNzO1xuXG4gICAgLy8gcHJvcGVydGllcyBmb3IgdGhlIHNlbGVjdGVkIG9udG9sb2d5IG9yIHNlbGVjdGVkIHJlc291cmNlIGNsYXNzXG4gICAgcHJvcGVydGllczogUHJvcGVydGllcztcblxuICAgIHJlc3VsdDogUmVhZFJlc291cmNlc1NlcXVlbmNlID0gbmV3IFJlYWRSZXNvdXJjZXNTZXF1ZW5jZShbXSwgMCk7XG5cbiAgICAvLyByZWZlcmVuY2UgdG8gdGhlIGNvbXBvbmVudCB0aGF0IGNvbnRyb2xzIHRoZSByZXNvdXJjZSBjbGFzcyBzZWxlY3Rpb25cbiAgICBAVmlld0NoaWxkKCdyZXNvdXJjZUNsYXNzJykgcmVzb3VyY2VDbGFzc0NvbXBvbmVudDogU2VsZWN0UmVzb3VyY2VDbGFzc0NvbXBvbmVudDtcblxuICAgIC8vIHJlZmVyZW5jZSB0byB0aGUgY29tcG9uZW50IGNvbnRyb2xsaW5nIHRoZSBwcm9wZXJ0eSBzZWxlY3Rpb25cbiAgICBAVmlld0NoaWxkcmVuKCdwcm9wZXJ0eScpIHByb3BlcnR5Q29tcG9uZW50czogUXVlcnlMaXN0PFNlbGVjdFByb3BlcnR5Q29tcG9uZW50PjtcblxuICAgIC8vIEZvcm1Hcm91cCAodXNlZCBhcyBwYXJlbnQgZm9yIGNoaWxkIGNvbXBvbmVudHMpXG4gICAgZm9ybTogRm9ybUdyb3VwO1xuXG4gICAgLy8gZm9ybSB2YWxpZGF0aW9uIHN0YXR1c1xuICAgIGZvcm1WYWxpZCA9IGZhbHNlO1xuXG4gICAgY29uc3RydWN0b3IoQEluamVjdChGb3JtQnVpbGRlcikgcHJpdmF0ZSBmYjogRm9ybUJ1aWxkZXIsXG4gICAgICAgIHByaXZhdGUgX3JvdXRlOiBBY3RpdmF0ZWRSb3V0ZSxcbiAgICAgICAgcHJpdmF0ZSBfcm91dGVyOiBSb3V0ZXIsXG4gICAgICAgIHByaXZhdGUgX2NhY2hlU2VydmljZTogT250b2xvZ3lDYWNoZVNlcnZpY2UsXG4gICAgICAgIHByaXZhdGUgX2dyYXZTZWFyY2hTZXJ2aWNlOiBHcmF2c2VhcmNoR2VuZXJhdGlvblNlcnZpY2UpIHtcbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHtcblxuICAgICAgICAvLyBwYXJlbnQgZm9ybSBpcyBlbXB0eSwgaXQgZ2V0cyBwYXNzZWQgdG8gdGhlIGNoaWxkIGNvbXBvbmVudHNcbiAgICAgICAgdGhpcy5mb3JtID0gdGhpcy5mYi5ncm91cCh7fSk7XG5cbiAgICAgICAgLy8gaWYgZm9ybSBzdGF0dXMgY2hhbmdlcywgcmUtcnVuIHZhbGlkYXRpb25cbiAgICAgICAgdGhpcy5mb3JtLnN0YXR1c0NoYW5nZXMuc3Vic2NyaWJlKChkYXRhKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZvcm1WYWxpZCA9IHRoaXMudmFsaWRhdGVGb3JtKCk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLmZvcm0pO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBpbml0aWFsaXplIG9udG9sb2dpZXMgdG8gYmUgdXNlZCBmb3IgdGhlIG9udG9sb2dpZXMgc2VsZWN0aW9uIGluIHRoZSBzZWFyY2ggZm9ybVxuICAgICAgICB0aGlzLmluaXRpYWxpemVPbnRvbG9naWVzKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIGEgcHJvcGVydHkgdG8gdGhlIHNlYXJjaCBmb3JtLlxuICAgICAqL1xuICAgIGFkZFByb3BlcnR5KCkge1xuICAgICAgICB0aGlzLmFjdGl2ZVByb3BlcnRpZXMucHVzaCh0cnVlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgdGhlIGxhc3QgcHJvcGVydHkgZnJvbSB0aGUgc2VhcmNoIGZvcm0uXG4gICAgICovXG4gICAgcmVtb3ZlUHJvcGVydHkoKSB7XG4gICAgICAgIHRoaXMuYWN0aXZlUHJvcGVydGllcy5zcGxpY2UoLTEsIDEpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgYWxsIGF2YWlsYWJsZSBvbnRvbG9naWVzIGZvciB0aGUgc2VhcmNoIGZvcm0uXG4gICAgICovXG4gICAgaW5pdGlhbGl6ZU9udG9sb2dpZXMoKSB7XG4gICAgICAgIHRoaXMuX2NhY2hlU2VydmljZS5nZXRPbnRvbG9naWVzTWV0YWRhdGEoKS5zdWJzY3JpYmUoXG4gICAgICAgICAgICAob250b2xvZ2llczogQXJyYXk8T250b2xvZ3lNZXRhZGF0YT4pID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLm9udG9sb2dpZXMgPSBvbnRvbG9naWVzO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogT25jZSBhbiBvbnRvbG9neSBoYXMgYmVlbiBzZWxlY3RlZCwgZ2V0cyBpdHMgY2xhc3NlcyBhbmQgcHJvcGVydGllcy5cbiAgICAgKiBUaGUgY2xhc3NlcyBhbmQgcHJvcGVydGllcyB3aWxsIGJlIG1hZGUgYXZhaWxhYmxlIHRvIHRoZSB1c2VyIGZvciBzZWxlY3Rpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gb250b2xvZ3lJcmkgSXJpIG9mIHRoZSBvbnRvbG9neSBjaG9zZW4gYnkgdGhlIHVzZXIuXG4gICAgICovXG4gICAgZ2V0UmVzb3VyY2VDbGFzc2VzQW5kUHJvcGVydGllc0Zvck9udG9sb2d5KG9udG9sb2d5SXJpOiBzdHJpbmcpOiB2b2lkIHtcblxuICAgICAgICAvLyByZXNldCBhY3RpdmUgcmVzb3VyY2UgY2xhc3MgZGVmaW5pdGlvblxuICAgICAgICB0aGlzLmFjdGl2ZVJlc291cmNlQ2xhc3MgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgLy8gcmVzZXQgc3BlY2lmaWVkIHByb3BlcnRpZXNcbiAgICAgICAgdGhpcy5hY3RpdmVQcm9wZXJ0aWVzID0gW107XG5cbiAgICAgICAgdGhpcy5hY3RpdmVPbnRvbG9neSA9IG9udG9sb2d5SXJpO1xuXG4gICAgICAgIHRoaXMuX2NhY2hlU2VydmljZS5nZXRFbnRpdHlEZWZpbml0aW9uc0Zvck9udG9sb2dpZXMoW29udG9sb2d5SXJpXSkuc3Vic2NyaWJlKFxuICAgICAgICAgICAgKG9udG9JbmZvOiBPbnRvbG9neUluZm9ybWF0aW9uKSA9PiB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnJlc291cmNlQ2xhc3NlcyA9IG9udG9JbmZvLmdldFJlc291cmNlQ2xhc3Nlc0FzQXJyYXkoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BlcnRpZXMgPSBvbnRvSW5mby5nZXRQcm9wZXJ0aWVzKCk7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE9uY2UgYSByZXNvdXJjZSBjbGFzcyBoYXMgYmVlbiBzZWxlY3RlZCwgZ2V0cyBpdHMgcHJvcGVydGllcy5cbiAgICAgKiBUaGUgcHJvcGVydGllcyB3aWxsIGJlIG1hZGUgYXZhaWxhYmxlIHRvIHRoZSB1c2VyIGZvciBzZWxlY3Rpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcmVzb3VyY2VDbGFzc0lyaVxuICAgICAqL1xuICAgIGdldFByb3BlcnRpZXNGb3JSZXNvdXJjZUNsYXNzKHJlc291cmNlQ2xhc3NJcmk6IHN0cmluZykge1xuXG4gICAgICAgIC8vIHJlc2V0IHNwZWNpZmllZCBwcm9wZXJ0aWVzXG4gICAgICAgIHRoaXMuYWN0aXZlUHJvcGVydGllcyA9IFtdO1xuXG4gICAgICAgIC8vIGlmIHRoZSBjbGllbnQgdW5kb2VzIHRoZSBzZWxlY3Rpb24gb2YgYSByZXNvdXJjZSBjbGFzcywgdXNlIHRoZSBhY3RpdmUgb250b2xvZ3kgYXMgYSBmYWxsYmFja1xuICAgICAgICBpZiAocmVzb3VyY2VDbGFzc0lyaSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5nZXRSZXNvdXJjZUNsYXNzZXNBbmRQcm9wZXJ0aWVzRm9yT250b2xvZ3kodGhpcy5hY3RpdmVPbnRvbG9neSk7XG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIHRoaXMuX2NhY2hlU2VydmljZS5nZXRSZXNvdXJjZUNsYXNzRGVmaW5pdGlvbnMoW3Jlc291cmNlQ2xhc3NJcmldKS5zdWJzY3JpYmUoXG4gICAgICAgICAgICAgICAgKG9udG9JbmZvOiBPbnRvbG9neUluZm9ybWF0aW9uKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvcGVydGllcyA9IG9udG9JbmZvLmdldFByb3BlcnRpZXMoKTtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFjdGl2ZVJlc291cmNlQ2xhc3MgPSBvbnRvSW5mby5nZXRSZXNvdXJjZUNsYXNzZXMoKVtyZXNvdXJjZUNsYXNzSXJpXTtcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVmFsaWRhdGVzIGZvcm0gYW5kIHJldHVybnMgaXRzIHN0YXR1cyAoYm9vbGVhbikuXG4gICAgICovXG4gICAgcHJpdmF0ZSB2YWxpZGF0ZUZvcm0oKSB7XG5cbiAgICAgICAgLy8gY2hlY2sgdGhhdCBlaXRoZXIgYSByZXNvdXJjZSBjbGFzcyBpcyBzZWxlY3RlZCBvciBhdCBsZWFzdCBvbmUgcHJvcGVydHkgaXMgc3BlY2lmaWVkXG4gICAgICAgIHJldHVybiB0aGlzLmZvcm0udmFsaWQgJiZcbiAgICAgICAgICAgICh0aGlzLnByb3BlcnR5Q29tcG9uZW50cy5sZW5ndGggPiAwIHx8ICh0aGlzLnJlc291cmNlQ2xhc3NDb21wb25lbnQgIT09IHVuZGVmaW5lZCAmJiB0aGlzLnJlc291cmNlQ2xhc3NDb21wb25lbnQuZ2V0UmVzb3VyY2VDbGFzc1NlbGVjdGVkKCkgIT09IGZhbHNlKSk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXNldHMgdGhlIGZvcm0gKHNlbGVjdGVkIHJlc291cmNlIGNsYXNzIGFuZCBzcGVjaWZpZWQgcHJvcGVydGllcykgcHJlc2VydmluZyB0aGUgYWN0aXZlIG9udG9sb2d5LlxuICAgICAqL1xuICAgIHJlc2V0Rm9ybSgpIHtcbiAgICAgICAgaWYgKHRoaXMuYWN0aXZlT250b2xvZ3kgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5nZXRSZXNvdXJjZUNsYXNzZXNBbmRQcm9wZXJ0aWVzRm9yT250b2xvZ3kodGhpcy5hY3RpdmVPbnRvbG9neSk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBHcmF2U2VhcmNoIHF1ZXJ5IHdpdGggdGhlIGdpdmVuIGZvcm0gdmFsdWVzIGFuZCBjYWxscyB0aGUgZXh0ZW5kZWQgc2VhcmNoIHJvdXRlLlxuICAgICAqL1xuICAgIHN1Ym1pdCgpIHtcblxuICAgICAgICBpZiAoIXRoaXMuZm9ybVZhbGlkKSByZXR1cm47IC8vIGNoZWNrIHRoYXQgZnJvbSBpcyB2YWxpZFxuXG4gICAgICAgIGNvbnN0IHJlc0NsYXNzT3B0aW9uID0gdGhpcy5yZXNvdXJjZUNsYXNzQ29tcG9uZW50LmdldFJlc291cmNlQ2xhc3NTZWxlY3RlZCgpO1xuXG4gICAgICAgIGxldCByZXNDbGFzcztcblxuICAgICAgICBpZiAocmVzQ2xhc3NPcHRpb24gIT09IGZhbHNlKSB7XG4gICAgICAgICAgICByZXNDbGFzcyA9IHJlc0NsYXNzT3B0aW9uO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcHJvcGVydGllczogUHJvcGVydHlXaXRoVmFsdWVbXSA9IHRoaXMucHJvcGVydHlDb21wb25lbnRzLm1hcChcbiAgICAgICAgICAgIChwcm9wQ29tcCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBwcm9wQ29tcC5nZXRQcm9wZXJ0eVNlbGVjdGVkV2l0aFZhbHVlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG5cbiAgICAgICAgY29uc3QgZ3JhdnNlYXJjaCA9IHRoaXMuX2dyYXZTZWFyY2hTZXJ2aWNlLmNyZWF0ZUdyYXZzZWFyY2hRdWVyeShwcm9wZXJ0aWVzLCByZXNDbGFzcywgMCk7XG5cbiAgICAgICAgdGhpcy5fcm91dGVyLm5hdmlnYXRlKFt0aGlzLnJvdXRlICsgJy9leHRlbmRlZC8nLCBncmF2c2VhcmNoXSwgeyByZWxhdGl2ZVRvOiB0aGlzLl9yb3V0ZSB9KTtcblxuICAgICAgICAvLyB0b2dnbGUgZXh0ZW5kZWQgc2VhcmNoIGZvcm1cbiAgICAgICAgdGhpcy50b2dnbGVFeHRlbmRlZFNlYXJjaEZvcm0uZW1pdCh0cnVlKTtcblxuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIEluamVjdCwgSW5wdXQsIE9uSW5pdCwgT3V0cHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPbnRvbG9neU1ldGFkYXRhIH0gZnJvbSAnQGtub3JhL2NvcmUnO1xuaW1wb3J0IHsgRm9ybUJ1aWxkZXIsIEZvcm1Hcm91cCwgVmFsaWRhdG9ycyB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAna3VpLXNlbGVjdC1vbnRvbG9neScsXG4gIHRlbXBsYXRlOiBgPG1hdC1mb3JtLWZpZWxkICpuZ0lmPVwib250b2xvZ2llcy5sZW5ndGggPiAwXCI+XG4gIDxtYXQtc2VsZWN0IHBsYWNlaG9sZGVyPVwiT250b2xvZ3lcIiBbZm9ybUNvbnRyb2xdPVwiZm9ybS5jb250cm9sc1snb250b2xvZ3knXVwiPlxuICAgICAgPG1hdC1vcHRpb24gKm5nRm9yPVwibGV0IG9udG8gb2Ygb250b2xvZ2llc1wiIFt2YWx1ZV09XCJvbnRvLmlkXCI+e3sgb250by5sYWJlbCB9fTwvbWF0LW9wdGlvbj5cbiAgPC9tYXQtc2VsZWN0PlxuPC9tYXQtZm9ybS1maWVsZD5cbmAsXG4gIHN0eWxlczogW2BgXVxufSlcbmV4cG9ydCBjbGFzcyBTZWxlY3RPbnRvbG9neUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgQElucHV0KCkgZm9ybUdyb3VwOiBGb3JtR3JvdXA7XG5cbiAgQElucHV0KCkgb250b2xvZ2llczogQXJyYXk8T250b2xvZ3lNZXRhZGF0YT47XG5cbiAgQE91dHB1dCgpIG9udG9sb2d5U2VsZWN0ZWQgPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oKTtcblxuICBmb3JtOiBGb3JtR3JvdXA7XG5cbiAgY29uc3RydWN0b3IoQEluamVjdChGb3JtQnVpbGRlcikgcHJpdmF0ZSBmYjogRm9ybUJ1aWxkZXIpIHsgfVxuXG4gIG5nT25Jbml0KCkge1xuXG4gICAgLy8gYnVpbGQgYSBmb3JtIGZvciB0aGUgbmFtZWQgZ3JhcGggc2VsZWN0aW9uXG4gICAgdGhpcy5mb3JtID0gdGhpcy5mYi5ncm91cCh7XG4gICAgICBvbnRvbG9neTogW251bGwsIFZhbGlkYXRvcnMucmVxdWlyZWRdXG4gICAgfSk7XG5cbiAgICAvLyBlbWl0IElyaSBvZiB0aGUgb250b2xvZ3kgd2hlbiBiZWluZyBzZWxlY3RlZFxuICAgIHRoaXMuZm9ybS52YWx1ZUNoYW5nZXMuc3Vic2NyaWJlKChkYXRhKSA9PiB7XG4gICAgICB0aGlzLm9udG9sb2d5U2VsZWN0ZWQuZW1pdChkYXRhLm9udG9sb2d5KTtcbiAgICB9KTtcblxuICAgIC8vIGFkZCBmb3JtIHRvIHRoZSBwYXJlbnQgZm9ybSBncm91cFxuICAgIHRoaXMuZm9ybUdyb3VwLmFkZENvbnRyb2woJ29udG9sb2d5JywgdGhpcy5mb3JtKTtcblxuICB9XG5cbn1cbiIsImltcG9ydCB7IENvbXBvbmVudCwgSW5qZWN0LCBJbnB1dCwgT25EZXN0cm95LCBPbkluaXQsIFZpZXdDaGlsZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgICBDYXJkaW5hbGl0eSxcbiAgICBDYXJkaW5hbGl0eU9jY3VycmVuY2UsXG4gICAgQ29tcGFyaXNvbk9wZXJhdG9yQW5kVmFsdWUsXG4gICAgUHJvcGVydGllcyxcbiAgICBQcm9wZXJ0eSxcbiAgICBQcm9wZXJ0eVdpdGhWYWx1ZSxcbiAgICBSZXNvdXJjZUNsYXNzXG59IGZyb20gJ0Brbm9yYS9jb3JlJztcbmltcG9ydCB7IEZvcm1CdWlsZGVyLCBGb3JtR3JvdXAsIFZhbGlkYXRvcnMgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBTcGVjaWZ5UHJvcGVydHlWYWx1ZUNvbXBvbmVudCB9IGZyb20gJy4vc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZS9zcGVjaWZ5LXByb3BlcnR5LXZhbHVlLmNvbXBvbmVudCc7XG5cblxuLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNDU2NjEwMTAvZHluYW1pYy1uZXN0ZWQtcmVhY3RpdmUtZm9ybS1leHByZXNzaW9uY2hhbmdlZGFmdGVyaXRoYXNiZWVuY2hlY2tlZGVycm9yXG5jb25zdCByZXNvbHZlZFByb21pc2UgPSBQcm9taXNlLnJlc29sdmUobnVsbCk7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAna3VpLXNlbGVjdC1wcm9wZXJ0eScsXG4gICAgdGVtcGxhdGU6IGA8bWF0LWZvcm0tZmllbGQgY2xhc3M9XCJzZWFyY2gtcHJvcGVydHktZmllbGRcIiAqbmdJZj1cInByb3BlcnRpZXNBc0FycmF5Py5sZW5ndGggPiAwXCI+XG4gIDxtYXQtc2VsZWN0IHBsYWNlaG9sZGVyPVwiUHJvcGVydGllc1wiIFtmb3JtQ29udHJvbF09XCJmb3JtLmNvbnRyb2xzWydwcm9wZXJ0eSddXCI+XG4gICAgPG1hdC1vcHRpb24gKm5nRm9yPVwibGV0IHByb3Agb2YgcHJvcGVydGllc0FzQXJyYXlcIiBbdmFsdWVdPVwicHJvcC5pZFwiPnt7IHByb3AubGFiZWwgfX08L21hdC1vcHRpb24+XG4gIDwvbWF0LXNlbGVjdD5cbjwvbWF0LWZvcm0tZmllbGQ+XG5cbjxrdWktc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZSAjc3BlY2lmeVByb3BlcnR5VmFsdWUgW2Zvcm1Hcm91cF09XCJmb3JtXCIgKm5nSWY9XCJwcm9wZXJ0eVNlbGVjdGVkICE9PSB1bmRlZmluZWRcIiBbcHJvcGVydHldPVwicHJvcGVydHlTZWxlY3RlZFwiPjwva3VpLXNwZWNpZnktcHJvcGVydHktdmFsdWU+XG5cbjxtYXQtY2hlY2tib3ggbWF0VG9vbHRpcD1cIlNvcnQgY3JpdGVyaW9uXCIgKm5nSWY9XCJwcm9wZXJ0eVNlbGVjdGVkICE9PSB1bmRlZmluZWQgJiYgc29ydENyaXRlcmlvbigpXCIgW2Zvcm1Db250cm9sXT1cImZvcm0uY29udHJvbHNbJ2lzU29ydENyaXRlcmlvbiddXCI+PC9tYXQtY2hlY2tib3g+YCxcbiAgICBzdHlsZXM6IFtgLnNlYXJjaC1wcm9wZXJ0eS1maWVsZHttYXJnaW4tcmlnaHQ6OHB4fWBdXG59KVxuZXhwb3J0IGNsYXNzIFNlbGVjdFByb3BlcnR5Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuXG4gICAgLy8gcGFyZW50IEZvcm1Hcm91cFxuICAgIEBJbnB1dCgpIGZvcm1Hcm91cDogRm9ybUdyb3VwO1xuXG4gICAgLy8gaW5kZXggb2YgdGhlIGdpdmVuIHByb3BlcnR5ICh1bmlxdWUpXG4gICAgQElucHV0KCkgaW5kZXg6IG51bWJlcjtcblxuICAgIC8vIHNldHRlciBtZXRob2QgZm9yIHByb3BlcnRpZXMgd2hlbiBiZWluZyB1cGRhdGVkIGJ5IHBhcmVudCBjb21wb25lbnRcbiAgICBASW5wdXQoKVxuICAgIHNldCBwcm9wZXJ0aWVzKHZhbHVlOiBQcm9wZXJ0aWVzKSB7XG4gICAgICAgIHRoaXMucHJvcGVydHlTZWxlY3RlZCA9IHVuZGVmaW5lZDsgLy8gcmVzZXQgc2VsZWN0ZWQgcHJvcGVydHkgKG92ZXJ3cml0aW5nIGFueSBwcmV2aW91cyBzZWxlY3Rpb24pXG4gICAgICAgIHRoaXMuX3Byb3BlcnRpZXMgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy51cGRhdGVQcm9wZXJ0aWVzQXJyYXkoKTtcbiAgICB9XG5cbiAgICBnZXQgcHJvcGVydGllcygpIHtcbiAgICAgICByZXR1cm4gdGhpcy5fcHJvcGVydGllcztcbiAgICB9XG5cbiAgICBfYWN0aXZlUmVzb3VyY2VDbGFzczogUmVzb3VyY2VDbGFzcztcblxuICAgIC8vIHNldHRlciBtZXRob2QgZm9yIHNlbGVjdGVkIHJlc291cmNlIGNsYXNzXG4gICAgQElucHV0KClcbiAgICBzZXQgYWN0aXZlUmVzb3VyY2VDbGFzcyh2YWx1ZTogUmVzb3VyY2VDbGFzcykge1xuICAgICAgICB0aGlzLl9hY3RpdmVSZXNvdXJjZUNsYXNzID0gdmFsdWU7XG4gICAgfVxuXG4gICAgLy8gcmVmZXJlbmNlIHRvIGNoaWxkIGNvbXBvbmVudDogY29tYmluYXRpb24gb2YgY29tcGFyaXNvbiBvcGVyYXRvciBhbmQgdmFsdWUgZm9yIGNob3NlbiBwcm9wZXJ0eVxuICAgIEBWaWV3Q2hpbGQoJ3NwZWNpZnlQcm9wZXJ0eVZhbHVlJykgc3BlY2lmeVByb3BlcnR5VmFsdWU6IFNwZWNpZnlQcm9wZXJ0eVZhbHVlQ29tcG9uZW50O1xuXG4gICAgLy8gcHJvcGVydGllcyB0aGF0IGNhbiBiZSBzZWxlY3RlZCBmcm9tXG4gICAgcHJpdmF0ZSBfcHJvcGVydGllczogUHJvcGVydGllcztcblxuICAgIC8vIHByb3BlcnRpZXMgYXMgYW4gQXJyYXkgc3RydWN0dXJlIChiYXNlZCBvbiB0aGlzLnByb3BlcnRpZXMpXG4gICAgcHJvcGVydGllc0FzQXJyYXk6IEFycmF5PFByb3BlcnR5PjtcblxuICAgIC8vIHJlcHJlc2VudHMgdGhlIGN1cnJlbnRseSBzZWxlY3RlZCBwcm9wZXJ0eVxuICAgIHByb3BlcnR5U2VsZWN0ZWQ6IFByb3BlcnR5O1xuXG4gICAgZm9ybTogRm9ybUdyb3VwO1xuXG4gICAgLy8gdW5pcXVlIG5hbWUgZm9yIHRoaXMgcHJvcGVydHkgdG8gYmUgdXNlZCBpbiB0aGUgcGFyZW50IEZvcm1Hcm91cFxuICAgIHByb3BJbmRleDogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IoQEluamVjdChGb3JtQnVpbGRlcikgcHJpdmF0ZSBmYjogRm9ybUJ1aWxkZXIpIHtcblxuICAgIH1cblxuICAgIG5nT25Jbml0KCkge1xuXG4gICAgICAgIC8vIGJ1aWxkIGEgZm9ybSBmb3IgdGhlIHByb3BlcnR5IHNlbGVjdGlvblxuICAgICAgICB0aGlzLmZvcm0gPSB0aGlzLmZiLmdyb3VwKHtcbiAgICAgICAgICAgIHByb3BlcnR5OiBbbnVsbCwgVmFsaWRhdG9ycy5yZXF1aXJlZF0sXG4gICAgICAgICAgICBpc1NvcnRDcml0ZXJpb246IFtmYWxzZSwgVmFsaWRhdG9ycy5yZXF1aXJlZF1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gdXBkYXRlIHRoZSBzZWxlY3RlZCBwcm9wZXJ0eVxuICAgICAgICB0aGlzLmZvcm0udmFsdWVDaGFuZ2VzLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcHJvcElyaSA9IGRhdGEucHJvcGVydHk7XG4gICAgICAgICAgICB0aGlzLnByb3BlcnR5U2VsZWN0ZWQgPSB0aGlzLl9wcm9wZXJ0aWVzW3Byb3BJcmldO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXNvbHZlZFByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnByb3BJbmRleCA9ICdwcm9wZXJ0eScgKyB0aGlzLmluZGV4O1xuXG4gICAgICAgICAgICAvLyBhZGQgZm9ybSB0byB0aGUgcGFyZW50IGZvcm0gZ3JvdXBcbiAgICAgICAgICAgIHRoaXMuZm9ybUdyb3VwLmFkZENvbnRyb2wodGhpcy5wcm9wSW5kZXgsIHRoaXMuZm9ybSk7XG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG5cbiAgICAgICAgLy8gcmVtb3ZlIGZvcm0gZnJvbSB0aGUgcGFyZW50IGZvcm0gZ3JvdXBcbiAgICAgICAgcmVzb2x2ZWRQcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5mb3JtR3JvdXAucmVtb3ZlQ29udHJvbCh0aGlzLnByb3BJbmRleCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEluZGljYXRlcyBpZiBwcm9wZXJ0eSBjYW4gYmUgdXNlZCBhcyBhIHNvcnQgY3JpdGVyaW9uLlxuICAgICAqIFByb3BlcnR5IGhhcyB0byBoYXZlIGNhcmRpbmFsaXR5IG9yIG1heCBjYXJkaW5hbGl0eSAxIGZvciB0aGUgY2hvc2VuIHJlc291cmNlIGNsYXNzLlxuICAgICAqXG4gICAgICogV2UgY2Fubm90IHNvcnQgYnkgcHJvcGVydGllcyB3aG9zZSBjYXJkaW5hbGl0eSBpcyBncmVhdGVyIHRoYW4gMS5cbiAgICAgKiBSZXR1cm4gYm9vbGVhblxuICAgICAqL1xuICAgIHNvcnRDcml0ZXJpb24oKSB7XG5cbiAgICAgICAgLy8gY2hlY2sgaWYgYSByZXNvdXJjZSBjbGFzcyBpcyBzZWxlY3RlZCBhbmQgaWYgdGhlIHByb3BlcnR5J3MgY2FyZGluYWxpdHkgaXMgMSBmb3IgdGhlIHNlbGVjdGVkIHJlc291cmNlIGNsYXNzXG4gICAgICAgIGlmICh0aGlzLl9hY3RpdmVSZXNvdXJjZUNsYXNzICE9PSB1bmRlZmluZWQgJiYgdGhpcy5wcm9wZXJ0eVNlbGVjdGVkICE9PSB1bmRlZmluZWQgJiYgIXRoaXMucHJvcGVydHlTZWxlY3RlZC5pc0xpbmtQcm9wZXJ0eSkge1xuXG4gICAgICAgICAgICBjb25zdCBjYXJkaW5hbGl0aWVzOiBDYXJkaW5hbGl0eVtdID0gdGhpcy5fYWN0aXZlUmVzb3VyY2VDbGFzcy5jYXJkaW5hbGl0aWVzLmZpbHRlcihcbiAgICAgICAgICAgICAgICAoY2FyZDogQ2FyZGluYWxpdHkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gY2FyZGluYWxpdHkgMSBvciBtYXggb2NjdXJyZW5jZSAxXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjYXJkLnByb3BlcnR5ID09PSB0aGlzLnByb3BlcnR5U2VsZWN0ZWQuaWRcbiAgICAgICAgICAgICAgICAgICAgICAgICYmIGNhcmQudmFsdWUgPT09IDFcbiAgICAgICAgICAgICAgICAgICAgICAgICYmIChjYXJkLm9jY3VycmVuY2UgPT09IENhcmRpbmFsaXR5T2NjdXJyZW5jZS5jYXJkIHx8IGNhcmQub2NjdXJyZW5jZSA9PT0gQ2FyZGluYWxpdHlPY2N1cnJlbmNlLm1heENhcmQpXG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICByZXR1cm4gY2FyZGluYWxpdGllcy5sZW5ndGggPT09IDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFVwZGF0ZXMgdGhlIHByb3BlcnRpZXMgYXJyYXkgdGhhdCBpcyBhY2Nlc3NlZCBieSB0aGUgdGVtcGxhdGUuXG4gICAgICovXG4gICAgcHJpdmF0ZSB1cGRhdGVQcm9wZXJ0aWVzQXJyYXkoKSB7XG5cbiAgICAgICAgLy8gcmVwcmVzZW50IHRoZSBwcm9wZXJ0aWVzIGFzIGFuIGFycmF5IHRvIGJlIGFjY2Vzc2VkIGJ5IHRoZSB0ZW1wbGF0ZVxuICAgICAgICBjb25zdCBwcm9wc0FycmF5ID0gW107XG5cbiAgICAgICAgZm9yIChjb25zdCBwcm9wSXJpIGluIHRoaXMuX3Byb3BlcnRpZXMpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9wcm9wZXJ0aWVzLmhhc093blByb3BlcnR5KHByb3BJcmkpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcHJvcCA9IHRoaXMuX3Byb3BlcnRpZXNbcHJvcElyaV07XG5cbiAgICAgICAgICAgICAgICAvLyBvbmx5IGxpc3QgZWRpdGFibGUgcHJvcHMgdGhhdCBhcmUgbm90IGxpbmsgdmFsdWUgcHJvcHNcbiAgICAgICAgICAgICAgICBpZiAocHJvcC5pc0VkaXRhYmxlICYmICFwcm9wLmlzTGlua1ZhbHVlUHJvcGVydHkpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvcHNBcnJheS5wdXNoKHRoaXMuX3Byb3BlcnRpZXNbcHJvcElyaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucHJvcGVydGllc0FzQXJyYXkgPSBwcm9wc0FycmF5O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIHNlbGVjdGVkIHByb3BlcnR5IHdpdGggdGhlIHNwZWNpZmllZCB2YWx1ZS5cbiAgICAgKi9cbiAgICBnZXRQcm9wZXJ0eVNlbGVjdGVkV2l0aFZhbHVlKCk6IFByb3BlcnR5V2l0aFZhbHVlIHtcblxuICAgICAgICBjb25zdCBwcm9wVmFsOiBDb21wYXJpc29uT3BlcmF0b3JBbmRWYWx1ZSA9IHRoaXMuc3BlY2lmeVByb3BlcnR5VmFsdWUuZ2V0Q29tcGFyaXNvbk9wZXJhdG9yQW5kVmFsdWVMaXRlcmFsRm9yUHJvcGVydHkoKTtcblxuICAgICAgICBsZXQgaXNTb3J0Q3JpdGVyaW9uID0gZmFsc2U7XG5cbiAgICAgICAgLy8gb25seSBub24gbGlua2luZyBwcm9wZXJ0aWVzIGNhbiBiZSB1c2VkIGZvciBzb3J0aW5nXG4gICAgICAgIGlmICghdGhpcy5wcm9wZXJ0eVNlbGVjdGVkLmlzTGlua1Byb3BlcnR5KSB7XG4gICAgICAgICAgICBpc1NvcnRDcml0ZXJpb24gPSB0aGlzLmZvcm0udmFsdWUuaXNTb3J0Q3JpdGVyaW9uO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wZXJ0eVdpdGhWYWx1ZSh0aGlzLnByb3BlcnR5U2VsZWN0ZWQsIHByb3BWYWwsIGlzU29ydENyaXRlcmlvbik7XG5cbiAgICB9XG5cblxufVxuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBJbmplY3QsIElucHV0LCBPbkNoYW5nZXMsIE9uSW5pdCwgVmlld0NoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBGb3JtQnVpbGRlciwgRm9ybUdyb3VwLCBWYWxpZGF0b3JzIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtcbiAgICBDb21wYXJpc29uT3BlcmF0b3IsXG4gICAgQ29tcGFyaXNvbk9wZXJhdG9yQW5kVmFsdWUsXG4gICAgRXF1YWxzLFxuICAgIEV4aXN0cyxcbiAgICBHcmVhdGVyVGhhbixcbiAgICBHcmVhdGVyVGhhbkVxdWFscyxcbiAgICBLbm9yYUNvbnN0YW50cyxcbiAgICBMZXNzVGhhbixcbiAgICBMZXNzVGhhbkVxdWFscyxcbiAgICBMaWtlLFxuICAgIE1hdGNoLFxuICAgIE5vdEVxdWFscyxcbiAgICBQcm9wZXJ0eSxcbiAgICBQcm9wZXJ0eVZhbHVlLFxuICAgIFZhbHVlXG59IGZyb20gJ0Brbm9yYS9jb3JlJztcblxuXG4vLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy80NTY2MTAxMC9keW5hbWljLW5lc3RlZC1yZWFjdGl2ZS1mb3JtLWV4cHJlc3Npb25jaGFuZ2VkYWZ0ZXJpdGhhc2JlZW5jaGVja2VkZXJyb3JcbmNvbnN0IHJlc29sdmVkUHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZShudWxsKTtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdrdWktc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZScsXG4gICAgdGVtcGxhdGU6IGA8bWF0LWZvcm0tZmllbGQgY2xhc3M9XCJzZWFyY2gtb3BlcmF0b3ItZmllbGRcIiAqbmdJZj1cImNvbXBhcmlzb25PcGVyYXRvcnM/Lmxlbmd0aCA+IDBcIj5cbiAgICA8bWF0LXNlbGVjdCBwbGFjZWhvbGRlcj1cIkNvbXBhcmlzb24gT3BlcmF0b3JcIiBbZm9ybUNvbnRyb2xdPVwiZm9ybS5jb250cm9sc1snY29tcGFyaXNvbk9wZXJhdG9yJ11cIj5cbiAgICAgICAgPG1hdC1vcHRpb24gKm5nRm9yPVwibGV0IGNvbXBPcCBvZiBjb21wYXJpc29uT3BlcmF0b3JzXCIgW3ZhbHVlXT1cImNvbXBPcFwiPnt7IGNvbXBPcC5sYWJlbCB9fTwvbWF0LW9wdGlvbj5cbiAgICA8L21hdC1zZWxlY3Q+XG48L21hdC1mb3JtLWZpZWxkPlxuXG48IS0tIHNlbGVjdCBhcHQgY29tcG9uZW50IGZvciB2YWx1ZSBzcGVjaWZpY2F0aW9uIHVzaW5nIGEgc3dpdGNoIGNhc2Ugc3RhdGVtZW50LS0+XG48c3BhblxuICAgICpuZ0lmPVwiY29tcGFyaXNvbk9wZXJhdG9yU2VsZWN0ZWQgIT09IHVuZGVmaW5lZCAmJiBjb21wYXJpc29uT3BlcmF0b3JTZWxlY3RlZCAhPT0gbnVsbCAmJiBjb21wYXJpc29uT3BlcmF0b3JTZWxlY3RlZC5nZXRDbGFzc05hbWUoKSAhPSAnRXhpc3RzJ1wiXG4gICAgW25nU3dpdGNoXT1cInByb3BlcnR5VmFsdWVUeXBlXCI+XG4gIDxib29sZWFuLXZhbHVlICNwcm9wZXJ0eVZhbHVlIFtmb3JtR3JvdXBdPVwiZm9ybVwiICpuZ1N3aXRjaENhc2U9XCJLbm9yYUNvbnN0YW50cy5Cb29sZWFuVmFsdWVcIj48L2Jvb2xlYW4tdmFsdWU+XG4gIDxkYXRlLXZhbHVlICNwcm9wZXJ0eVZhbHVlIFtmb3JtR3JvdXBdPVwiZm9ybVwiICpuZ1N3aXRjaENhc2U9XCJLbm9yYUNvbnN0YW50cy5EYXRlVmFsdWVcIj48L2RhdGUtdmFsdWU+XG4gIDxkZWNpbWFsLXZhbHVlICNwcm9wZXJ0eVZhbHVlIFtmb3JtR3JvdXBdPVwiZm9ybVwiICpuZ1N3aXRjaENhc2U9XCJLbm9yYUNvbnN0YW50cy5EZWNpbWFsVmFsdWVcIj48L2RlY2ltYWwtdmFsdWU+XG4gIDxpbnRlZ2VyLXZhbHVlICNwcm9wZXJ0eVZhbHVlIFtmb3JtR3JvdXBdPVwiZm9ybVwiICpuZ1N3aXRjaENhc2U9XCJLbm9yYUNvbnN0YW50cy5JbnRWYWx1ZVwiPjwvaW50ZWdlci12YWx1ZT5cbiAgPGxpbmstdmFsdWUgI3Byb3BlcnR5VmFsdWUgW2Zvcm1Hcm91cF09XCJmb3JtXCIgW3Jlc3RyaWN0UmVzb3VyY2VDbGFzc109XCJwcm9wZXJ0eS5vYmplY3RUeXBlXCJcbiAgICAgICAgICAgICAgKm5nU3dpdGNoQ2FzZT1cIktub3JhQ29uc3RhbnRzLlJlc291cmNlXCI+PC9saW5rLXZhbHVlPlxuICA8dGV4dC12YWx1ZSAjcHJvcGVydHlWYWx1ZSBbZm9ybUdyb3VwXT1cImZvcm1cIiAqbmdTd2l0Y2hDYXNlPVwiS25vcmFDb25zdGFudHMuVGV4dFZhbHVlXCI+PC90ZXh0LXZhbHVlPlxuICA8dXJpLXZhbHVlICNwcm9wZXJ0eVZhbHVlIFtmb3JtR3JvdXBdPVwiZm9ybVwiICpuZ1N3aXRjaENhc2U9XCJLbm9yYUNvbnN0YW50cy5VcmlWYWx1ZVwiPjwvdXJpLXZhbHVlPlxuXG4gICAgPCEtLSBUT0RPOiBSZXNvdXJjZTogaGFuZGxlIGxpbmtpbmcgcHJvcGVydGllcyB3aXRoIHRhcmdldCBjbGFzcyByZXN0cmljdGlvbjogYWNjZXNzIHByb3BlcnR5IG1lbWJlciB0byBnZXQgb2JqZWN0Q2xhc3MgdmlhIHByb3BlcnR5KCkgZ2V0dGVyIG1ldGhvZCAtLT5cbiAgPHNwYW4gKm5nU3dpdGNoRGVmYXVsdD1cIlwiPk5vdCBzdXBwb3J0ZWQge3twcm9wZXJ0eVZhbHVlVHlwZX19PC9zcGFuPlxuPC9zcGFuPlxuYCxcbiAgICBzdHlsZXM6IFtgLnNlYXJjaC1vcGVyYXRvci1maWVsZHttYXJnaW4tcmlnaHQ6OHB4fWBdXG59KVxuZXhwb3J0IGNsYXNzIFNwZWNpZnlQcm9wZXJ0eVZhbHVlQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMge1xuXG4gICAgS25vcmFDb25zdGFudHMgPSBLbm9yYUNvbnN0YW50cztcblxuICAgIC8vIHBhcmVudCBGb3JtR3JvdXBcbiAgICBASW5wdXQoKSBmb3JtR3JvdXA6IEZvcm1Hcm91cDtcblxuICAgIEBWaWV3Q2hpbGQoJ3Byb3BlcnR5VmFsdWUnKSBwcm9wZXJ0eVZhbHVlQ29tcG9uZW50OiBQcm9wZXJ0eVZhbHVlO1xuXG4gICAgLy8gc2V0dGVyIG1ldGhvZCBmb3IgdGhlIHByb3BlcnR5IGNob3NlbiBieSB0aGUgdXNlclxuICAgIEBJbnB1dCgpXG4gICAgc2V0IHByb3BlcnR5KHByb3A6IFByb3BlcnR5KSB7XG4gICAgICAgIHRoaXMuY29tcGFyaXNvbk9wZXJhdG9yU2VsZWN0ZWQgPSB1bmRlZmluZWQ7IC8vIHJlc2V0IHRvIGluaXRpYWwgc3RhdGVcbiAgICAgICAgdGhpcy5fcHJvcGVydHkgPSBwcm9wO1xuICAgICAgICB0aGlzLnJlc2V0Q29tcGFyaXNvbk9wZXJhdG9ycygpOyAvLyByZXNldCBjb21wYXJpc29uIG9wZXJhdG9ycyBmb3IgZ2l2ZW4gcHJvcGVydHkgKG92ZXJ3cml0aW5nIGFueSBwcmV2aW91cyBzZWxlY3Rpb24pXG4gICAgfVxuXG4gICAgLy8gZ2V0dGVyIG1ldGhvZCBmb3IgdGhpcy5fcHJvcGVydHlcbiAgICBnZXQgcHJvcGVydHkoKTogUHJvcGVydHkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcHJvcGVydHk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfcHJvcGVydHk6IFByb3BlcnR5O1xuXG4gICAgZm9ybTogRm9ybUdyb3VwO1xuXG4gICAgLy8gYXZhaWxhYmxlIGNvbXBhcmlzb24gb3BlcmF0b3JzIGZvciB0aGUgcHJvcGVydHlcbiAgICBjb21wYXJpc29uT3BlcmF0b3JzOiBBcnJheTxDb21wYXJpc29uT3BlcmF0b3I+ID0gW107XG5cbiAgICAvLyBjb21wYXJpc29uIG9wZXJhdG9yIHNlbGVjdGVkIGJ5IHRoZSB1c2VyXG4gICAgY29tcGFyaXNvbk9wZXJhdG9yU2VsZWN0ZWQ6IENvbXBhcmlzb25PcGVyYXRvcjtcblxuICAgIC8vIHRoZSB0eXBlIG9mIHRoZSBwcm9wZXJ0eVxuICAgIHByb3BlcnR5VmFsdWVUeXBlO1xuXG4gICAgY29uc3RydWN0b3IoQEluamVjdChGb3JtQnVpbGRlcikgcHJpdmF0ZSBmYjogRm9ybUJ1aWxkZXIpIHtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXNldHMgdGhlIGNvbXBhcmlzb24gb3BlcmF0b3JzIGZvciB0aGlzLl9wcm9wZXJ0eS5cbiAgICAgKi9cbiAgICByZXNldENvbXBhcmlzb25PcGVyYXRvcnMoKSB7XG5cbiAgICAgICAgLy8gZGVwZW5kaW5nIG9uIG9iamVjdCBjbGFzcywgc2V0IGNvbXBhcmlzb24gb3BlcmF0b3JzIGFuZCB2YWx1ZSBlbnRyeSBmaWVsZFxuICAgICAgICBpZiAodGhpcy5fcHJvcGVydHkuaXNMaW5rUHJvcGVydHkpIHtcbiAgICAgICAgICAgIHRoaXMucHJvcGVydHlWYWx1ZVR5cGUgPSBLbm9yYUNvbnN0YW50cy5SZXNvdXJjZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucHJvcGVydHlWYWx1ZVR5cGUgPSB0aGlzLl9wcm9wZXJ0eS5vYmplY3RUeXBlO1xuICAgICAgICB9XG5cbiAgICAgICAgc3dpdGNoICh0aGlzLnByb3BlcnR5VmFsdWVUeXBlKSB7XG5cbiAgICAgICAgICAgIGNhc2UgS25vcmFDb25zdGFudHMuVGV4dFZhbHVlOlxuICAgICAgICAgICAgICAgIHRoaXMuY29tcGFyaXNvbk9wZXJhdG9ycyA9IFtuZXcgTGlrZSgpLCBuZXcgTWF0Y2goKSwgbmV3IEVxdWFscygpLCBuZXcgTm90RXF1YWxzKCksIG5ldyBFeGlzdHMoKV07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgS25vcmFDb25zdGFudHMuQm9vbGVhblZhbHVlOlxuICAgICAgICAgICAgY2FzZSBLbm9yYUNvbnN0YW50cy5SZXNvdXJjZTpcbiAgICAgICAgICAgIGNhc2UgS25vcmFDb25zdGFudHMuVXJpVmFsdWU6XG4gICAgICAgICAgICBjYXNlIEtub3JhQ29uc3RhbnRzLkludGVydmFsVmFsdWU6XG4gICAgICAgICAgICAgICAgdGhpcy5jb21wYXJpc29uT3BlcmF0b3JzID0gW25ldyBFcXVhbHMoKSwgbmV3IE5vdEVxdWFscygpLCBuZXcgRXhpc3RzKCldO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIEtub3JhQ29uc3RhbnRzLkludFZhbHVlOlxuICAgICAgICAgICAgY2FzZSBLbm9yYUNvbnN0YW50cy5EZWNpbWFsVmFsdWU6XG4gICAgICAgICAgICBjYXNlIEtub3JhQ29uc3RhbnRzLkRhdGVWYWx1ZTpcbiAgICAgICAgICAgICAgICB0aGlzLmNvbXBhcmlzb25PcGVyYXRvcnMgPSBbbmV3IEVxdWFscygpLCBuZXcgTm90RXF1YWxzKCksIG5ldyBMZXNzVGhhbigpLCBuZXcgTGVzc1RoYW5FcXVhbHMoKSwgbmV3IEdyZWF0ZXJUaGFuKCksIG5ldyBHcmVhdGVyVGhhbkVxdWFscygpLCBuZXcgRXhpc3RzKCldO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIEtub3JhQ29uc3RhbnRzLkxpc3RWYWx1ZTpcbiAgICAgICAgICAgIGNhc2UgS25vcmFDb25zdGFudHMuR2VvbVZhbHVlOlxuICAgICAgICAgICAgY2FzZSBLbm9yYUNvbnN0YW50cy5GaWxlVmFsdWU6XG4gICAgICAgICAgICBjYXNlIEtub3JhQ29uc3RhbnRzLkF1ZGlvRmlsZVZhbHVlOlxuICAgICAgICAgICAgY2FzZSBLbm9yYUNvbnN0YW50cy5TdGlsbEltYWdlRmlsZVZhbHVlOlxuICAgICAgICAgICAgY2FzZSBLbm9yYUNvbnN0YW50cy5ERERGaWxlVmFsdWU6XG4gICAgICAgICAgICBjYXNlIEtub3JhQ29uc3RhbnRzLk1vdmluZ0ltYWdlRmlsZVZhbHVlOlxuICAgICAgICAgICAgY2FzZSBLbm9yYUNvbnN0YW50cy5UZXh0RmlsZVZhbHVlOlxuICAgICAgICAgICAgY2FzZSBLbm9yYUNvbnN0YW50cy5Db2xvclZhbHVlOlxuICAgICAgICAgICAgICAgIHRoaXMuY29tcGFyaXNvbk9wZXJhdG9ycyA9IFtuZXcgRXhpc3RzKCldO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdFUlJPUjogVW5zdXBwb3J0ZWQgdmFsdWUgdHlwZSAnICsgdGhpcy5fcHJvcGVydHkub2JqZWN0VHlwZSk7XG5cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgbmdPbkluaXQoKSB7IH1cblxuICAgIG5nT25DaGFuZ2VzKCkge1xuXG4gICAgICAgIC8vIGJ1aWxkIGEgZm9ybSBmb3IgY29tcGFyaXNvbiBvcGVyYXRvciBzZWxlY3Rpb25cbiAgICAgICAgdGhpcy5mb3JtID0gdGhpcy5mYi5ncm91cCh7XG4gICAgICAgICAgICBjb21wYXJpc29uT3BlcmF0b3I6IFtudWxsLCBWYWxpZGF0b3JzLnJlcXVpcmVkXVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBzdG9yZSBjb21wYXJpc29uIG9wZXJhdG9yIHdoZW4gc2VsZWN0ZWRcbiAgICAgICAgdGhpcy5mb3JtLnZhbHVlQ2hhbmdlcy5zdWJzY3JpYmUoKGRhdGEpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY29tcGFyaXNvbk9wZXJhdG9yU2VsZWN0ZWQgPSBkYXRhLmNvbXBhcmlzb25PcGVyYXRvcjtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmVzb2x2ZWRQcm9taXNlLnRoZW4oKCkgPT4ge1xuXG4gICAgICAgICAgICAvLyByZW1vdmUgZnJvbSB0aGUgcGFyZW50IGZvcm0gZ3JvdXAgKGNsZWFuIHJlc2V0KVxuICAgICAgICAgICAgdGhpcy5mb3JtR3JvdXAucmVtb3ZlQ29udHJvbCgnY29tcGFyaXNvbk9wZXJhdG9yJyk7XG5cbiAgICAgICAgICAgIC8vIGFkZCBmb3JtIHRvIHRoZSBwYXJlbnQgZm9ybSBncm91cFxuICAgICAgICAgICAgdGhpcy5mb3JtR3JvdXAuYWRkQ29udHJvbCgnY29tcGFyaXNvbk9wZXJhdG9yJywgdGhpcy5mb3JtKTtcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBzcGVjaWZpZWQgY29tcGFyaXNvbiBvcGVyYXRvciBhbmQgdmFsdWUgZm9yIHRoZSBwcm9wZXJ0eS5cbiAgICAgKlxuICAgICAqIHJldHVybnMge0NvbXBhcmlzb25PcGVyYXRvckFuZFZhbHVlfSB0aGUgY29tcGFyaXNvbiBvcGVyYXRvciBhbmQgdGhlIHNwZWNpZmllZCB2YWx1ZVxuICAgICAqL1xuICAgIGdldENvbXBhcmlzb25PcGVyYXRvckFuZFZhbHVlTGl0ZXJhbEZvclByb3BlcnR5KCk6IENvbXBhcmlzb25PcGVyYXRvckFuZFZhbHVlIHtcbiAgICAgICAgLy8gcmV0dXJuIHZhbHVlIChsaXRlcmFsIG9yIElSSSkgZnJvbSB0aGUgY2hpbGQgY29tcG9uZW50XG4gICAgICAgIGxldCB2YWx1ZTogVmFsdWU7XG5cbiAgICAgICAgLy8gY29tcGFyaXNvbiBvcGVyYXRvciAnRXhpc3RzJyBkb2VzIG5vdCByZXF1aXJlIGEgdmFsdWVcbiAgICAgICAgaWYgKHRoaXMuY29tcGFyaXNvbk9wZXJhdG9yU2VsZWN0ZWQuZ2V0Q2xhc3NOYW1lKCkgIT09ICdFeGlzdHMnKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHRoaXMucHJvcGVydHlWYWx1ZUNvbXBvbmVudC5nZXRWYWx1ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcmV0dXJuIHRoZSBjb21wYXJpc29uIG9wZXJhdG9yIGFuZCB0aGUgc3BlY2lmaWVkIHZhbHVlXG4gICAgICAgIHJldHVybiBuZXcgQ29tcGFyaXNvbk9wZXJhdG9yQW5kVmFsdWUodGhpcy5jb21wYXJpc29uT3BlcmF0b3JTZWxlY3RlZCwgdmFsdWUpO1xuXG4gICAgfVxuXG59XG5cbiIsImltcG9ydCB7IENvbXBvbmVudCwgSW5qZWN0LCBJbnB1dCwgT25EZXN0cm95LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEZvcm1CdWlsZGVyLCBGb3JtR3JvdXAsIFZhbGlkYXRvcnMgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBLbm9yYUNvbnN0YW50cywgUHJvcGVydHlWYWx1ZSwgVmFsdWUsIFZhbHVlTGl0ZXJhbCB9IGZyb20gJ0Brbm9yYS9jb3JlJztcblxuLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNDU2NjEwMTAvZHluYW1pYy1uZXN0ZWQtcmVhY3RpdmUtZm9ybS1leHByZXNzaW9uY2hhbmdlZGFmdGVyaXRoYXNiZWVuY2hlY2tlZGVycm9yXG5jb25zdCByZXNvbHZlZFByb21pc2UgPSBQcm9taXNlLnJlc29sdmUobnVsbCk7XG5cblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdib29sZWFuLXZhbHVlJyxcbiAgICB0ZW1wbGF0ZTogYDxtYXQtY2hlY2tib3ggW2Zvcm1Db250cm9sXT1cImZvcm0uY29udHJvbHNbJ2Jvb2xlYW5WYWx1ZSddXCI+PC9tYXQtY2hlY2tib3g+XG5gLFxuICAgIHN0eWxlczogW2BgXVxufSlcbmV4cG9ydCBjbGFzcyBCb29sZWFuVmFsdWVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgUHJvcGVydHlWYWx1ZSB7XG5cbiAgICAvLyBwYXJlbnQgRm9ybUdyb3VwXG4gICAgQElucHV0KCkgZm9ybUdyb3VwOiBGb3JtR3JvdXA7XG5cbiAgICB0eXBlID0gS25vcmFDb25zdGFudHMuQm9vbGVhblZhbHVlO1xuXG4gICAgZm9ybTogRm9ybUdyb3VwO1xuXG4gICAgY29uc3RydWN0b3IoQEluamVjdChGb3JtQnVpbGRlcikgcHJpdmF0ZSBmYjogRm9ybUJ1aWxkZXIpIHtcblxuICAgIH1cblxuICAgIG5nT25Jbml0KCkge1xuXG4gICAgICAgIHRoaXMuZm9ybSA9IHRoaXMuZmIuZ3JvdXAoe1xuICAgICAgICAgICAgYm9vbGVhblZhbHVlOiBbZmFsc2UsIFZhbGlkYXRvcnMuY29tcG9zZShbVmFsaWRhdG9ycy5yZXF1aXJlZF0pXVxuICAgICAgICB9KTtcblxuICAgICAgICByZXNvbHZlZFByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAvLyBhZGQgZm9ybSB0byB0aGUgcGFyZW50IGZvcm0gZ3JvdXBcbiAgICAgICAgICAgIHRoaXMuZm9ybUdyb3VwLmFkZENvbnRyb2woJ3Byb3BWYWx1ZScsIHRoaXMuZm9ybSk7XG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG5cbiAgICAgICAgLy8gcmVtb3ZlIGZvcm0gZnJvbSB0aGUgcGFyZW50IGZvcm0gZ3JvdXBcbiAgICAgICAgcmVzb2x2ZWRQcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5mb3JtR3JvdXAucmVtb3ZlQ29udHJvbCgncHJvcFZhbHVlJyk7XG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgZ2V0VmFsdWUoKTogVmFsdWUge1xuICAgICAgICByZXR1cm4gbmV3IFZhbHVlTGl0ZXJhbChTdHJpbmcodGhpcy5mb3JtLnZhbHVlLmJvb2xlYW5WYWx1ZSksIEtub3JhQ29uc3RhbnRzLnhzZEJvb2xlYW4pO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IENvbXBvbmVudCwgRGlyZWN0aXZlLCBIb3N0LCBJbmplY3QsIElucHV0LCBPbkRlc3Ryb3ksIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRm9ybUJ1aWxkZXIsIEZvcm1Hcm91cCwgVmFsaWRhdG9ycyB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IEtub3JhQ29uc3RhbnRzLCBQcm9wZXJ0eVZhbHVlLCBWYWx1ZSwgVmFsdWVMaXRlcmFsIH0gZnJvbSAnQGtub3JhL2NvcmUnO1xuaW1wb3J0IHsgR3JlZ29yaWFuQ2FsZW5kYXJEYXRlLCBKRE5Db252ZXJ0aWJsZUNhbGVuZGFyLCBKRE5QZXJpb2QgfSBmcm9tICdqZG5jb252ZXJ0aWJsZWNhbGVuZGFyJztcbmltcG9ydCB7IERhdGVBZGFwdGVyLCBNQVRfREFURV9MT0NBTEUsIE1hdENhbGVuZGFyIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwnO1xuaW1wb3J0IHsgSkROQ29udmVydGlibGVDYWxlbmRhckRhdGVBZGFwdGVyIH0gZnJvbSAnamRuY29udmVydGlibGVjYWxlbmRhcmRhdGVhZGFwdGVyJztcblxuLyoqIEN1c3RvbSBoZWFkZXIgY29tcG9uZW50IGNvbnRhaW5pbmcgYSBjYWxlbmRhciBmb3JtYXQgc3dpdGNoZXIgKi9cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAna3VpLWNhbGVuZGFyLWhlYWRlcicsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgIDxtYXQtc2VsZWN0IHBsYWNlaG9sZGVyPVwiQ2FsZW5kYXIgRm9ybWF0XCIgW2Zvcm1Db250cm9sXT1cImZvcm0uY29udHJvbHNbJ2NhbGVuZGFyJ11cIj5cbiAgICAgICAgPG1hdC1vcHRpb24gKm5nRm9yPVwibGV0IGNhbCBvZiBzdXBwb3J0ZWRDYWxlbmRhckZvcm1hdHNcIiBbdmFsdWVdPVwiY2FsXCI+e3tjYWx9fTwvbWF0LW9wdGlvbj5cbiAgICAgIDwvbWF0LXNlbGVjdD5cbiAgICAgIDxtYXQtY2FsZW5kYXItaGVhZGVyPjwvbWF0LWNhbGVuZGFyLWhlYWRlcj5cbiAgICBgLFxuICAgIHN0eWxlczogW11cbn0pXG5leHBvcnQgY2xhc3MgSGVhZGVyQ29tcG9uZW50PEQ+IGltcGxlbWVudHMgT25Jbml0IHtcbiAgICBjb25zdHJ1Y3RvcihASG9zdCgpIHByaXZhdGUgX2NhbGVuZGFyOiBNYXRDYWxlbmRhcjxKRE5Db252ZXJ0aWJsZUNhbGVuZGFyPixcbiAgICAgICAgcHJpdmF0ZSBfZGF0ZUFkYXB0ZXI6IERhdGVBZGFwdGVyPEpETkNvbnZlcnRpYmxlQ2FsZW5kYXI+LFxuICAgICAgICBASW5qZWN0KEZvcm1CdWlsZGVyKSBwcml2YXRlIGZiOiBGb3JtQnVpbGRlcikge1xuICAgIH1cblxuICAgIGZvcm06IEZvcm1Hcm91cDtcblxuICAgIC8vIGEgbGlzdCBvZiBzdXBwb3J0ZWQgY2FsZW5kYXIgZm9ybWF0cyAoR3JlZ29yaWFuIGFuZCBKdWxpYW4pXG4gICAgc3VwcG9ydGVkQ2FsZW5kYXJGb3JtYXRzID0gSkROQ29udmVydGlibGVDYWxlbmRhci5zdXBwb3J0ZWRDYWxlbmRhcnM7XG5cbiAgICAvLyB0aGUgY3VycmVudGx5IGFjdGl2ZSBjYWxlbmRhciBmb3JtYXRcbiAgICBhY3RpdmVGb3JtYXQ7XG5cbiAgICBuZ09uSW5pdCgpIHtcblxuICAgICAgICAvLyBnZXQgdGhlIGN1cnJlbnRseSBhY3RpdmUgY2FsZW5kYXIgZm9ybWF0IGZyb20gdGhlIGRhdGUgYWRhcHRlclxuICAgICAgICBpZiAodGhpcy5fZGF0ZUFkYXB0ZXIgaW5zdGFuY2VvZiBKRE5Db252ZXJ0aWJsZUNhbGVuZGFyRGF0ZUFkYXB0ZXIpIHtcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlRm9ybWF0ID0gdGhpcy5fZGF0ZUFkYXB0ZXIuYWN0aXZlQ2FsZW5kYXJGb3JtYXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZGF0ZSBhZGFwdGVyIGlzIGV4cGVjdGVkIHRvIGJlIGFuIGluc3RhbmNlIG9mIEpETkNvbnZlcnRpYmxlQ2FsZW5kYXJEYXRlQWRhcHRlcicpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gYnVpbGQgYSBmb3JtIGZvciB0aGUgY2FsZW5kYXIgZm9ybWF0IHNlbGVjdGlvblxuICAgICAgICB0aGlzLmZvcm0gPSB0aGlzLmZiLmdyb3VwKHtcbiAgICAgICAgICAgIGNhbGVuZGFyOiBbdGhpcy5hY3RpdmVGb3JtYXQsIFZhbGlkYXRvcnMucmVxdWlyZWRdXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGRvIHRoZSBjb252ZXJzaW9uIHdoZW4gdGhlIHVzZXIgc2VsZWN0cyBhbm90aGVyIGNhbGVuZGFyIGZvcm1hdFxuICAgICAgICB0aGlzLmZvcm0udmFsdWVDaGFuZ2VzLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xuICAgICAgICAgICAgLy8gcGFzcyB0aGUgdGFyZ2V0IGNhbGVuZGFyIGZvcm1hdCB0byB0aGUgY29udmVyc2lvbiBtZXRob2RcbiAgICAgICAgICAgIHRoaXMuY29udmVydERhdGUoZGF0YS5jYWxlbmRhcik7XG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ29udmVydHMgdGhlIGRhdGUgaW50byB0aGUgdGFyZ2V0IGZvcm1hdC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBjYWxlbmRhciB0aGUgdGFyZ2V0IGNhbGVuZGFyIGZvcm1hdC5cbiAgICAgKi9cbiAgICBjb252ZXJ0RGF0ZShjYWxlbmRhcjogJ0dyZWdvcmlhbicgfCAnSnVsaWFuJykge1xuXG4gICAgICAgIGlmICh0aGlzLl9kYXRlQWRhcHRlciBpbnN0YW5jZW9mIEpETkNvbnZlcnRpYmxlQ2FsZW5kYXJEYXRlQWRhcHRlcikge1xuXG4gICAgICAgICAgICAvLyBjb252ZXJ0IHRoZSBkYXRlIGludG8gdGhlIHRhcmdldCBjYWxlbmRhciBmb3JtYXRcbiAgICAgICAgICAgIGNvbnN0IGNvbnZlcnRlZERhdGUgPSB0aGlzLl9kYXRlQWRhcHRlci5jb252ZXJ0Q2FsZW5kYXJGb3JtYXQodGhpcy5fY2FsZW5kYXIuYWN0aXZlRGF0ZSwgY2FsZW5kYXIpO1xuXG4gICAgICAgICAgICAvLyBzZXQgdGhlIG5ldyBkYXRlXG4gICAgICAgICAgICB0aGlzLl9jYWxlbmRhci5hY3RpdmVEYXRlID0gY29udmVydGVkRGF0ZTtcblxuICAgICAgICAgICAgLy8gc2VsZWN0IHRoZSBuZXcgZGF0ZSBpbiB0aGUgZGF0ZXBpY2tlciBVSVxuICAgICAgICAgICAgdGhpcy5fY2FsZW5kYXIuX2RhdGVTZWxlY3RlZChjb252ZXJ0ZWREYXRlKTtcblxuICAgICAgICAgICAgLy8gdXBkYXRlIHZpZXcgYWZ0ZXIgY2FsZW5kYXIgZm9ybWF0IGNvbnZlcnNpb25cbiAgICAgICAgICAgIGNvbnN0IHZpZXcgPSB0aGlzLl9jYWxlbmRhci5jdXJyZW50VmlldyA9PT0gJ21vbnRoJyA/IHRoaXMuX2NhbGVuZGFyLm1vbnRoVmlldyA6XG4gICAgICAgICAgICAgICAgKHRoaXMuX2NhbGVuZGFyLmN1cnJlbnRWaWV3ID09PSAneWVhcicgPyB0aGlzLl9jYWxlbmRhci55ZWFyVmlldyA6IHRoaXMuX2NhbGVuZGFyLm11bHRpWWVhclZpZXcpO1xuXG4gICAgICAgICAgICB2aWV3Lm5nQWZ0ZXJDb250ZW50SW5pdCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2RhdGUgYWRhcHRlciBpcyBleHBlY3RlZCB0byBiZSBhbiBpbnN0YW5jZSBvZiBKRE5Db252ZXJ0aWJsZUNhbGVuZGFyRGF0ZUFkYXB0ZXInKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCB7IENvbXBvbmVudCwgSG9zdCwgSW5qZWN0LCBJbnB1dCwgT25EZXN0cm95LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEZvcm1CdWlsZGVyLCBGb3JtR3JvdXAsIFZhbGlkYXRvcnMgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbmltcG9ydCB7IEtub3JhQ29uc3RhbnRzLCBQcm9wZXJ0eVZhbHVlLCBWYWx1ZSwgVmFsdWVMaXRlcmFsIH0gZnJvbSAnQGtub3JhL2NvcmUnO1xuaW1wb3J0IHsgR3JlZ29yaWFuQ2FsZW5kYXJEYXRlLCBKRE5Db252ZXJ0aWJsZUNhbGVuZGFyLCBKRE5QZXJpb2QgfSBmcm9tICdqZG5jb252ZXJ0aWJsZWNhbGVuZGFyJztcbmltcG9ydCB7IEhlYWRlckNvbXBvbmVudCB9IGZyb20gJy4vaGVhZGVyLWNhbGVuZGFyL2hlYWRlci1jYWxlbmRhci5jb21wb25lbnQnO1xuXG4vLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy80NTY2MTAxMC9keW5hbWljLW5lc3RlZC1yZWFjdGl2ZS1mb3JtLWV4cHJlc3Npb25jaGFuZ2VkYWZ0ZXJpdGhhc2JlZW5jaGVja2VkZXJyb3JcbmNvbnN0IHJlc29sdmVkUHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZShudWxsKTtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdkYXRlLXZhbHVlJyxcbiAgICB0ZW1wbGF0ZTogYDxtYXQtZm9ybS1maWVsZD5cbiAgICA8amRuLWRhdGVwaWNrZXI+XG4gICAgICAgIDxpbnB1dCBtYXRJbnB1dCBbbWF0RGF0ZXBpY2tlcl09XCJwaWNrZXJcIiBwbGFjZWhvbGRlcj1cIkNob29zZSBhIGRhdGVcIiBbZm9ybUNvbnRyb2xdPVwiZm9ybS5jb250cm9sc1snZGF0ZVZhbHVlJ11cIj5cbiAgICAgICAgPG1hdC1kYXRlcGlja2VyICNwaWNrZXIgW2NhbGVuZGFySGVhZGVyQ29tcG9uZW50XT1cImhlYWRlckNvbXBvbmVudFwiPjwvbWF0LWRhdGVwaWNrZXI+XG4gICAgPC9qZG4tZGF0ZXBpY2tlcj5cbiAgICA8bWF0LWRhdGVwaWNrZXItdG9nZ2xlIG1hdFN1ZmZpeCBbZm9yXT1cInBpY2tlclwiPjwvbWF0LWRhdGVwaWNrZXItdG9nZ2xlPlxuPC9tYXQtZm9ybS1maWVsZD5gLFxuICAgIHN0eWxlczogW2BgXVxufSlcbmV4cG9ydCBjbGFzcyBEYXRlVmFsdWVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgUHJvcGVydHlWYWx1ZSB7XG5cbiAgICAvLyBwYXJlbnQgRm9ybUdyb3VwXG4gICAgQElucHV0KCkgZm9ybUdyb3VwOiBGb3JtR3JvdXA7XG5cbiAgICB0eXBlID0gS25vcmFDb25zdGFudHMuRGF0ZVZhbHVlO1xuXG4gICAgZm9ybTogRm9ybUdyb3VwO1xuXG4gICAgLy8gY3VzdG9tIGhlYWRlciBmb3IgdGhlIGRhdGVwaWNrZXJcbiAgICBoZWFkZXJDb21wb25lbnQgPSBIZWFkZXJDb21wb25lbnQ7XG5cbiAgICBjb25zdHJ1Y3RvcihASW5qZWN0KEZvcm1CdWlsZGVyKSBwcml2YXRlIGZiOiBGb3JtQnVpbGRlcikge1xuICAgIH1cblxuICAgIG5nT25Jbml0KCkge1xuXG4gICAgICAgIC8vIGluaXQgZGF0ZXBpY2tlclxuICAgICAgICB0aGlzLmZvcm0gPSB0aGlzLmZiLmdyb3VwKHtcbiAgICAgICAgICAgIGRhdGVWYWx1ZTogW251bGwsIFZhbGlkYXRvcnMuY29tcG9zZShbVmFsaWRhdG9ycy5yZXF1aXJlZF0pXVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmZvcm0udmFsdWVDaGFuZ2VzLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZGF0YS5kYXRlVmFsdWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXNvbHZlZFByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAvLyBhZGQgZm9ybSB0byB0aGUgcGFyZW50IGZvcm0gZ3JvdXBcbiAgICAgICAgICAgIHRoaXMuZm9ybUdyb3VwLmFkZENvbnRyb2woJ3Byb3BWYWx1ZScsIHRoaXMuZm9ybSk7XG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG5cbiAgICAgICAgLy8gcmVtb3ZlIGZvcm0gZnJvbSB0aGUgcGFyZW50IGZvcm0gZ3JvdXBcbiAgICAgICAgcmVzb2x2ZWRQcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5mb3JtR3JvdXAucmVtb3ZlQ29udHJvbCgncHJvcFZhbHVlJyk7XG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgZ2V0VmFsdWUoKTogVmFsdWUge1xuXG4gICAgICAgIGNvbnN0IGRhdGVPYmo6IEpETkNvbnZlcnRpYmxlQ2FsZW5kYXIgPSB0aGlzLmZvcm0udmFsdWUuZGF0ZVZhbHVlO1xuXG4gICAgICAgIC8vIGdldCBjYWxlbmRhciBmb3JtYXRcbiAgICAgICAgY29uc3QgY2FsZW5kYXJGb3JtYXQgPSBkYXRlT2JqLmNhbGVuZGFyTmFtZTtcbiAgICAgICAgLy8gZ2V0IGNhbGVuZGFyIHBlcmlvZFxuICAgICAgICBjb25zdCBjYWxlbmRhclBlcmlvZCA9IGRhdGVPYmoudG9DYWxlbmRhclBlcmlvZCgpO1xuICAgICAgICAvLyBnZXQgdGhlIGRhdGVcbiAgICAgICAgY29uc3QgZGF0ZVN0cmluZyA9IGAke2NhbGVuZGFyRm9ybWF0LnRvVXBwZXJDYXNlKCl9OiR7Y2FsZW5kYXJQZXJpb2QucGVyaW9kU3RhcnQueWVhcn0tJHtjYWxlbmRhclBlcmlvZC5wZXJpb2RTdGFydC5tb250aH0tJHtjYWxlbmRhclBlcmlvZC5wZXJpb2RTdGFydC5kYXl9OiR7Y2FsZW5kYXJQZXJpb2QucGVyaW9kRW5kLnllYXJ9LSR7Y2FsZW5kYXJQZXJpb2QucGVyaW9kRW5kLm1vbnRofS0ke2NhbGVuZGFyUGVyaW9kLnBlcmlvZEVuZC5kYXl9YDtcblxuICAgICAgICByZXR1cm4gbmV3IFZhbHVlTGl0ZXJhbChTdHJpbmcoZGF0ZVN0cmluZyksIEtub3JhQ29uc3RhbnRzLkRhdGVWYWx1ZSk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBJbmplY3QsIElucHV0LCBPbkRlc3Ryb3ksIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRm9ybUJ1aWxkZXIsIEZvcm1Hcm91cCwgVmFsaWRhdG9ycyB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IEtub3JhQ29uc3RhbnRzLCBQcm9wZXJ0eVZhbHVlLCBWYWx1ZSwgVmFsdWVMaXRlcmFsIH0gZnJvbSAnQGtub3JhL2NvcmUnO1xuXG4vLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy80NTY2MTAxMC9keW5hbWljLW5lc3RlZC1yZWFjdGl2ZS1mb3JtLWV4cHJlc3Npb25jaGFuZ2VkYWZ0ZXJpdGhhc2JlZW5jaGVja2VkZXJyb3JcbmNvbnN0IHJlc29sdmVkUHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZShudWxsKTtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdkZWNpbWFsLXZhbHVlJyxcbiAgICB0ZW1wbGF0ZTogYDxtYXQtZm9ybS1maWVsZD5cbiAgICA8aW5wdXQgbWF0SW5wdXQgW2Zvcm1Db250cm9sXT1cImZvcm0uY29udHJvbHNbJ2RlY2ltYWxWYWx1ZSddXCIgcGxhY2Vob2xkZXI9XCJEZWNpbWFsIHZhbHVlXCIgdmFsdWU9XCJcIiB0eXBlPVwibnVtYmVyXCI+XG48L21hdC1mb3JtLWZpZWxkPlxuYCxcbiAgICBzdHlsZXM6IFtgYF1cbn0pXG5leHBvcnQgY2xhc3MgRGVjaW1hbFZhbHVlQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3ksIFByb3BlcnR5VmFsdWUge1xuXG4gICAgLy8gcGFyZW50IEZvcm1Hcm91cFxuICAgIEBJbnB1dCgpIGZvcm1Hcm91cDogRm9ybUdyb3VwO1xuXG4gICAgdHlwZSA9IEtub3JhQ29uc3RhbnRzLkRlY2ltYWxWYWx1ZTtcblxuICAgIGZvcm06IEZvcm1Hcm91cDtcblxuICAgIGNvbnN0cnVjdG9yKEBJbmplY3QoRm9ybUJ1aWxkZXIpIHByaXZhdGUgZmI6IEZvcm1CdWlsZGVyKSB7XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKSB7XG5cbiAgICAgICAgdGhpcy5mb3JtID0gdGhpcy5mYi5ncm91cCh7XG4gICAgICAgICAgICBkZWNpbWFsVmFsdWU6IFtudWxsLCBWYWxpZGF0b3JzLmNvbXBvc2UoW1ZhbGlkYXRvcnMucmVxdWlyZWRdKV1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmVzb2x2ZWRQcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgLy8gYWRkIGZvcm0gdG8gdGhlIHBhcmVudCBmb3JtIGdyb3VwXG4gICAgICAgICAgICB0aGlzLmZvcm1Hcm91cC5hZGRDb250cm9sKCdwcm9wVmFsdWUnLCB0aGlzLmZvcm0pO1xuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCkge1xuXG4gICAgICAgIC8vIHJlbW92ZSBmb3JtIGZyb20gdGhlIHBhcmVudCBmb3JtIGdyb3VwXG4gICAgICAgIHJlc29sdmVkUHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZm9ybUdyb3VwLnJlbW92ZUNvbnRyb2woJ3Byb3BWYWx1ZScpO1xuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIGdldFZhbHVlKCk6IFZhbHVlIHtcblxuICAgICAgICByZXR1cm4gbmV3IFZhbHVlTGl0ZXJhbChTdHJpbmcodGhpcy5mb3JtLnZhbHVlLmRlY2ltYWxWYWx1ZSksIEtub3JhQ29uc3RhbnRzLnhzZERlY2ltYWwpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IENvbXBvbmVudCwgSW5qZWN0LCBJbnB1dCwgT25EZXN0cm95LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEZvcm1CdWlsZGVyLCBGb3JtR3JvdXAsIFZhbGlkYXRvcnMgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBLbm9yYUNvbnN0YW50cywgUHJvcGVydHlWYWx1ZSwgVmFsdWUsIFZhbHVlTGl0ZXJhbCB9IGZyb20gJ0Brbm9yYS9jb3JlJztcblxuLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNDU2NjEwMTAvZHluYW1pYy1uZXN0ZWQtcmVhY3RpdmUtZm9ybS1leHByZXNzaW9uY2hhbmdlZGFmdGVyaXRoYXNiZWVuY2hlY2tlZGVycm9yXG5jb25zdCByZXNvbHZlZFByb21pc2UgPSBQcm9taXNlLnJlc29sdmUobnVsbCk7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnaW50ZWdlci12YWx1ZScsXG4gICAgdGVtcGxhdGU6IGA8bWF0LWZvcm0tZmllbGQ+XG4gICAgPGlucHV0IG1hdElucHV0IFtmb3JtQ29udHJvbF09XCJmb3JtLmNvbnRyb2xzWydpbnRlZ2VyVmFsdWUnXVwiIHBsYWNlaG9sZGVyPVwiSW50ZWdlciB2YWx1ZVwiIHZhbHVlPVwiXCIgdHlwZT1cIm51bWJlclwiPlxuPC9tYXQtZm9ybS1maWVsZD5cbmAsXG4gICAgc3R5bGVzOiBbYGBdXG59KVxuZXhwb3J0IGNsYXNzIEludGVnZXJWYWx1ZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95LCBQcm9wZXJ0eVZhbHVlIHtcblxuICAgIC8vIHBhcmVudCBGb3JtR3JvdXBcbiAgICBASW5wdXQoKSBmb3JtR3JvdXA6IEZvcm1Hcm91cDtcblxuICAgIHR5cGUgPSBLbm9yYUNvbnN0YW50cy5JbnRWYWx1ZTtcblxuICAgIGZvcm06IEZvcm1Hcm91cDtcblxuICAgIGNvbnN0cnVjdG9yKEBJbmplY3QoRm9ybUJ1aWxkZXIpIHByaXZhdGUgZmI6IEZvcm1CdWlsZGVyKSB7XG5cbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHtcblxuICAgICAgICB0aGlzLmZvcm0gPSB0aGlzLmZiLmdyb3VwKHtcbiAgICAgICAgICAgIGludGVnZXJWYWx1ZTogW251bGwsIFZhbGlkYXRvcnMuY29tcG9zZShbVmFsaWRhdG9ycy5yZXF1aXJlZCwgVmFsaWRhdG9ycy5wYXR0ZXJuKC9eLT9cXGQrJC8pXSldIC8vIG9ubHkgYWxsb3cgZm9yIGludGVnZXIgdmFsdWVzIChubyBmcmFjdGlvbnMpXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJlc29sdmVkUHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIC8vIGFkZCBmb3JtIHRvIHRoZSBwYXJlbnQgZm9ybSBncm91cFxuICAgICAgICAgICAgdGhpcy5mb3JtR3JvdXAuYWRkQ29udHJvbCgncHJvcFZhbHVlJywgdGhpcy5mb3JtKTtcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcblxuICAgICAgICAvLyByZW1vdmUgZm9ybSBmcm9tIHRoZSBwYXJlbnQgZm9ybSBncm91cFxuICAgICAgICByZXNvbHZlZFByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZvcm1Hcm91cC5yZW1vdmVDb250cm9sKCdwcm9wVmFsdWUnKTtcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBnZXRWYWx1ZSgpOiBWYWx1ZSB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBWYWx1ZUxpdGVyYWwoU3RyaW5nKHRoaXMuZm9ybS52YWx1ZS5pbnRlZ2VyVmFsdWUpLCBLbm9yYUNvbnN0YW50cy54c2RJbnRlZ2VyKTtcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IENvbXBvbmVudCwgSW5qZWN0LCBJbnB1dCwgT25EZXN0cm95LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEZvcm1CdWlsZGVyLCBGb3JtQ29udHJvbCwgRm9ybUdyb3VwLCBWYWxpZGF0b3JzIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtcbiAgICBBcGlTZXJ2aWNlUmVzdWx0LFxuICAgIENvbnZlcnRKU09OTEQsXG4gICAgSVJJLFxuICAgIEtub3JhQ29uc3RhbnRzLFxuICAgIE9udG9sb2d5Q2FjaGVTZXJ2aWNlLFxuICAgIFByb3BlcnR5VmFsdWUsXG4gICAgUmVhZFJlc291cmNlLFxuICAgIFJlYWRSZXNvdXJjZXNTZXF1ZW5jZSxcbiAgICBTZWFyY2hTZXJ2aWNlLFxuICAgIFZhbHVlXG59IGZyb20gJ0Brbm9yYS9jb3JlJztcblxuZGVjbGFyZSBsZXQgcmVxdWlyZTogYW55OyAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzM0NzMwMDEwL2FuZ3VsYXIyLTUtbWludXRlLWluc3RhbGwtYnVnLXJlcXVpcmUtaXMtbm90LWRlZmluZWRcbmNvbnN0IGpzb25sZCA9IHJlcXVpcmUoJ2pzb25sZCcpO1xuXG4vLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy80NTY2MTAxMC9keW5hbWljLW5lc3RlZC1yZWFjdGl2ZS1mb3JtLWV4cHJlc3Npb25jaGFuZ2VkYWZ0ZXJpdGhhc2JlZW5jaGVja2VkZXJyb3JcbmNvbnN0IHJlc29sdmVkUHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZShudWxsKTtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdsaW5rLXZhbHVlJyxcbiAgICB0ZW1wbGF0ZTogYDxtYXQtZm9ybS1maWVsZD5cbiAgICA8aW5wdXQgbWF0SW5wdXQgcGxhY2Vob2xkZXI9XCJyZXNvdXJjZVwiIGFyaWEtbGFiZWw9XCJyZXNvdXJjZVwiIFttYXRBdXRvY29tcGxldGVdPVwiYXV0b1wiIFtmb3JtQ29udHJvbF09XCJmb3JtLmNvbnRyb2xzWydyZXNvdXJjZSddXCI+XG4gICAgPG1hdC1hdXRvY29tcGxldGUgI2F1dG89XCJtYXRBdXRvY29tcGxldGVcIiBbZGlzcGxheVdpdGhdPVwiZGlzcGxheVJlc291cmNlXCI+XG4gICAgICAgIDxtYXQtb3B0aW9uICpuZ0Zvcj1cImxldCByZXMgb2YgcmVzb3VyY2VzXCIgW3ZhbHVlXT1cInJlc1wiPlxuICAgICAgICAgICAge3tyZXM/LmxhYmVsfX1cbiAgICAgICAgPC9tYXQtb3B0aW9uPlxuICAgIDwvbWF0LWF1dG9jb21wbGV0ZT5cbjwvbWF0LWZvcm0tZmllbGQ+XG5gLFxuICAgIHN0eWxlczogW2BgXVxufSlcbmV4cG9ydCBjbGFzcyBMaW5rVmFsdWVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgUHJvcGVydHlWYWx1ZSB7XG5cbiAgICAvLyBwYXJlbnQgRm9ybUdyb3VwXG4gICAgQElucHV0KCkgZm9ybUdyb3VwOiBGb3JtR3JvdXA7XG5cbiAgICB0eXBlID0gS25vcmFDb25zdGFudHMuTGlua1ZhbHVlO1xuXG4gICAgZm9ybTogRm9ybUdyb3VwO1xuXG4gICAgcmVzb3VyY2VzOiBSZWFkUmVzb3VyY2VbXTtcblxuICAgIHByaXZhdGUgX3Jlc3RyaWN0VG9SZXNvdXJjZUNsYXNzOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKVxuICAgIHNldCByZXN0cmljdFJlc291cmNlQ2xhc3ModmFsdWU6IHN0cmluZykge1xuICAgICAgICB0aGlzLl9yZXN0cmljdFRvUmVzb3VyY2VDbGFzcyA9IHZhbHVlO1xuICAgIH1cblxuICAgIGdldCByZXN0cmljdFJlc291cmNlQ2xhc3MoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9yZXN0cmljdFRvUmVzb3VyY2VDbGFzcztcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihASW5qZWN0KEZvcm1CdWlsZGVyKSBwcml2YXRlIGZiOiBGb3JtQnVpbGRlciwgcHJpdmF0ZSBfc2VhcmNoU2VydmljZTogU2VhcmNoU2VydmljZSwgcHJpdmF0ZSBfY2FjaGVTZXJ2aWNlOiBPbnRvbG9neUNhY2hlU2VydmljZSkge1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRGlzcGxheXMgYSBzZWxlY3RlZCByZXNvdXJjZSB1c2luZyBpdHMgbGFiZWwuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcmVzb3VyY2UgdGhlIHJlc291cmNlIHRvIGJlIGRpc3BsYXllZCAob3Igbm8gc2VsZWN0aW9uIHlldCkuXG4gICAgICogQHJldHVybnNcbiAgICAgKi9cbiAgICBkaXNwbGF5UmVzb3VyY2UocmVzb3VyY2U6IFJlYWRSZXNvdXJjZSB8IG51bGwpIHtcblxuICAgICAgICAvLyBudWxsIGlzIHRoZSBpbml0aWFsIHZhbHVlIChubyBzZWxlY3Rpb24geWV0KVxuICAgICAgICBpZiAocmVzb3VyY2UgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNvdXJjZS5sYWJlbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNlYXJjaCBmb3IgcmVzb3VyY2VzIHdob3NlIGxhYmVscyBjb250YWluIHRoZSBnaXZlbiBzZWFyY2ggdGVybSwgcmVzdHJpY3RpbmcgdG8gdG8gdGhlIGdpdmVuIHByb3BlcnRpZXMgb2JqZWN0IGNvbnN0cmFpbnQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc2VhcmNoVGVybVxuICAgICAqL1xuICAgIHNlYXJjaEJ5TGFiZWwoc2VhcmNoVGVybTogc3RyaW5nKSB7XG5cbiAgICAgICAgLy8gYXQgbGVhc3QgMyBjaGFyYWN0ZXJzIGFyZSByZXF1aXJlZFxuICAgICAgICBpZiAoc2VhcmNoVGVybS5sZW5ndGggPj0gMykge1xuXG4gICAgICAgICAgICB0aGlzLl9zZWFyY2hTZXJ2aWNlLnNlYXJjaEJ5TGFiZWwoc2VhcmNoVGVybSwgdGhpcy5fcmVzdHJpY3RUb1Jlc291cmNlQ2xhc3MpLnN1YnNjcmliZShcbiAgICAgICAgICAgICAgICAocmVzdWx0OiBBcGlTZXJ2aWNlUmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHByb21pc2VzID0ganNvbmxkLnByb21pc2VzO1xuICAgICAgICAgICAgICAgICAgICAvLyBjb21wYWN0IEpTT04tTEQgdXNpbmcgYW4gZW1wdHkgY29udGV4dDogZXhwYW5kcyBhbGwgSXJpc1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwcm9taXNlID0gcHJvbWlzZXMuY29tcGFjdChyZXN1bHQuYm9keSwge30pO1xuXG4gICAgICAgICAgICAgICAgICAgIHByb21pc2UudGhlbigoY29tcGFjdGVkKSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc291cmNlU2VxOiBSZWFkUmVzb3VyY2VzU2VxdWVuY2UgPSBDb252ZXJ0SlNPTkxELmNyZWF0ZVJlYWRSZXNvdXJjZXNTZXF1ZW5jZUZyb21Kc29uTEQoY29tcGFjdGVkKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNvdXJjZXMgPSByZXNvdXJjZVNlcS5yZXNvdXJjZXM7XG5cbiAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnSlNPTkxEIG9mIGZ1bGwgcmVzb3VyY2UgcmVxdWVzdCBjb3VsZCBub3QgYmUgZXhwYW5kZWQ6JyArIGVycik7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGNsZWFyIHNlbGVjdGlvblxuICAgICAgICAgICAgdGhpcy5yZXNvdXJjZXMgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyB0aGF0IHRoZSBzZWxlY3Rpb24gaXMgYSBbW1JlYWRSZXNvdXJjZV1dLlxuICAgICAqXG4gICAgICogU3VycHJpc2luZ2x5LCBbbnVsbF0gaGFzIHRvIGJlIHJldHVybmVkIGlmIHRoZSB2YWx1ZSBpcyB2YWxpZDogaHR0cHM6Ly9hbmd1bGFyLmlvL2d1aWRlL2Zvcm0tdmFsaWRhdGlvbiNjdXN0b20tdmFsaWRhdG9yc1xuICAgICAqXG4gICAgICogQHBhcmFtIHRoZSBmb3JtIGVsZW1lbnQgd2hvc2UgdmFsdWUgaGFzIHRvIGJlIGNoZWNrZWQuXG4gICAgICogQHJldHVybnNcbiAgICAgKi9cbiAgICB2YWxpZGF0ZVJlc291cmNlKGM6IEZvcm1Db250cm9sKSB7XG5cbiAgICAgICAgY29uc3QgaXNWYWxpZFJlc291cmNlID0gKGMudmFsdWUgaW5zdGFuY2VvZiBSZWFkUmVzb3VyY2UpO1xuXG4gICAgICAgIGlmIChpc1ZhbGlkUmVzb3VyY2UpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBub1Jlc291cmNlOiB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBjLnZhbHVlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgbmdPbkluaXQoKSB7XG4gICAgICAgIHRoaXMuZm9ybSA9IHRoaXMuZmIuZ3JvdXAoe1xuICAgICAgICAgICAgcmVzb3VyY2U6IFtudWxsLCBWYWxpZGF0b3JzLmNvbXBvc2UoW1xuICAgICAgICAgICAgICAgIFZhbGlkYXRvcnMucmVxdWlyZWQsXG4gICAgICAgICAgICAgICAgdGhpcy52YWxpZGF0ZVJlc291cmNlXG4gICAgICAgICAgICBdKV1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5mb3JtLnZhbHVlQ2hhbmdlcy5zdWJzY3JpYmUoKGRhdGEpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2VhcmNoQnlMYWJlbChkYXRhLnJlc291cmNlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmVzb2x2ZWRQcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgLy8gYWRkIGZvcm0gdG8gdGhlIHBhcmVudCBmb3JtIGdyb3VwXG4gICAgICAgICAgICB0aGlzLmZvcm1Hcm91cC5hZGRDb250cm9sKCdwcm9wVmFsdWUnLCB0aGlzLmZvcm0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcblxuICAgICAgICAvLyByZW1vdmUgZm9ybSBmcm9tIHRoZSBwYXJlbnQgZm9ybSBncm91cFxuICAgICAgICByZXNvbHZlZFByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZvcm1Hcm91cC5yZW1vdmVDb250cm9sKCdwcm9wVmFsdWUnKTtcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBnZXRWYWx1ZSgpOiBWYWx1ZSB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBJUkkodGhpcy5mb3JtLnZhbHVlLnJlc291cmNlLmlkKTtcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IENvbXBvbmVudCwgSW5qZWN0LCBJbnB1dCwgT25EZXN0cm95LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgRm9ybUJ1aWxkZXIsIEZvcm1Hcm91cCwgVmFsaWRhdG9ycyB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IEtub3JhQ29uc3RhbnRzLCBQcm9wZXJ0eVZhbHVlLCBWYWx1ZSwgVmFsdWVMaXRlcmFsIH0gZnJvbSAnQGtub3JhL2NvcmUnO1xuXG4vLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy80NTY2MTAxMC9keW5hbWljLW5lc3RlZC1yZWFjdGl2ZS1mb3JtLWV4cHJlc3Npb25jaGFuZ2VkYWZ0ZXJpdGhhc2JlZW5jaGVja2VkZXJyb3JcbmNvbnN0IHJlc29sdmVkUHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZShudWxsKTtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICd0ZXh0LXZhbHVlJyxcbiAgICB0ZW1wbGF0ZTogYDxtYXQtZm9ybS1maWVsZD5cbiAgICA8aW5wdXQgbWF0SW5wdXQgW2Zvcm1Db250cm9sXT1cImZvcm0uY29udHJvbHNbJ3RleHRWYWx1ZSddXCIgcGxhY2Vob2xkZXI9XCJ0ZXh0IHZhbHVlXCIgdmFsdWU9XCJcIj5cbjwvbWF0LWZvcm0tZmllbGQ+XG5gLFxuICAgIHN0eWxlczogW2BgXVxufSlcbmV4cG9ydCBjbGFzcyBUZXh0VmFsdWVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgUHJvcGVydHlWYWx1ZSB7XG5cbiAgICAvLyBwYXJlbnQgRm9ybUdyb3VwXG4gICAgQElucHV0KCkgZm9ybUdyb3VwOiBGb3JtR3JvdXA7XG5cbiAgICB0eXBlID0gS25vcmFDb25zdGFudHMuVGV4dFZhbHVlO1xuXG4gICAgZm9ybTogRm9ybUdyb3VwO1xuXG4gICAgY29uc3RydWN0b3IoQEluamVjdChGb3JtQnVpbGRlcikgcHJpdmF0ZSBmYjogRm9ybUJ1aWxkZXIpIHtcblxuICAgIH1cblxuICAgIG5nT25Jbml0KCkge1xuXG4gICAgICAgIHRoaXMuZm9ybSA9IHRoaXMuZmIuZ3JvdXAoe1xuICAgICAgICAgICAgdGV4dFZhbHVlOiBbbnVsbCwgVmFsaWRhdG9ycy5yZXF1aXJlZF1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmVzb2x2ZWRQcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgLy8gYWRkIGZvcm0gdG8gdGhlIHBhcmVudCBmb3JtIGdyb3VwXG4gICAgICAgICAgICB0aGlzLmZvcm1Hcm91cC5hZGRDb250cm9sKCdwcm9wVmFsdWUnLCB0aGlzLmZvcm0pO1xuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCkge1xuXG4gICAgICAgIC8vIHJlbW92ZSBmb3JtIGZyb20gdGhlIHBhcmVudCBmb3JtIGdyb3VwXG4gICAgICAgIHJlc29sdmVkUHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZm9ybUdyb3VwLnJlbW92ZUNvbnRyb2woJ3Byb3BWYWx1ZScpO1xuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIGdldFZhbHVlKCk6IFZhbHVlIHtcblxuICAgICAgICByZXR1cm4gbmV3IFZhbHVlTGl0ZXJhbChTdHJpbmcodGhpcy5mb3JtLnZhbHVlLnRleHRWYWx1ZSksIEtub3JhQ29uc3RhbnRzLnhzZFN0cmluZyk7XG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIEluamVjdCwgSW5wdXQsIE9uRGVzdHJveSwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IEZvcm1CdWlsZGVyLCBGb3JtR3JvdXAsIFZhbGlkYXRvcnMgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBLbm9yYUNvbnN0YW50cywgUHJvcGVydHlWYWx1ZSwgVXRpbHMsIFZhbHVlLCBWYWx1ZUxpdGVyYWwgfSBmcm9tICdAa25vcmEvY29yZSc7XG5cbi8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzQ1NjYxMDEwL2R5bmFtaWMtbmVzdGVkLXJlYWN0aXZlLWZvcm0tZXhwcmVzc2lvbmNoYW5nZWRhZnRlcml0aGFzYmVlbmNoZWNrZWRlcnJvclxuY29uc3QgcmVzb2x2ZWRQcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKG51bGwpO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3VyaS12YWx1ZScsXG4gICAgdGVtcGxhdGU6IGA8bWF0LWZvcm0tZmllbGQ+XG4gICAgPGlucHV0IG1hdElucHV0IFtmb3JtQ29udHJvbF09XCJmb3JtLmNvbnRyb2xzWyd1cmlWYWx1ZSddXCIgcGxhY2Vob2xkZXI9XCJVUklcIiB2YWx1ZT1cIlwiPlxuPC9tYXQtZm9ybS1maWVsZD5cbmAsXG4gICAgc3R5bGVzOiBbYGBdXG59KVxuZXhwb3J0IGNsYXNzIFVyaVZhbHVlQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3ksIFByb3BlcnR5VmFsdWUge1xuXG4gICAgLy8gcGFyZW50IEZvcm1Hcm91cFxuICAgIEBJbnB1dCgpIGZvcm1Hcm91cDogRm9ybUdyb3VwO1xuXG4gICAgdHlwZSA9IEtub3JhQ29uc3RhbnRzLlVyaVZhbHVlO1xuXG4gICAgZm9ybTogRm9ybUdyb3VwO1xuXG4gICAgY29uc3RydWN0b3IoQEluamVjdChGb3JtQnVpbGRlcikgcHJpdmF0ZSBmYjogRm9ybUJ1aWxkZXIpIHtcblxuICAgIH1cblxuICAgIG5nT25Jbml0KCkge1xuXG4gICAgICAgIHRoaXMuZm9ybSA9IHRoaXMuZmIuZ3JvdXAoe1xuICAgICAgICAgICAgdXJpVmFsdWU6IFtudWxsLCBWYWxpZGF0b3JzLmNvbXBvc2UoW1ZhbGlkYXRvcnMucmVxdWlyZWQsIFZhbGlkYXRvcnMucGF0dGVybihVdGlscy5SZWdleFVybCldKV1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmVzb2x2ZWRQcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgLy8gYWRkIGZvcm0gdG8gdGhlIHBhcmVudCBmb3JtIGdyb3VwXG4gICAgICAgICAgICB0aGlzLmZvcm1Hcm91cC5hZGRDb250cm9sKCdwcm9wVmFsdWUnLCB0aGlzLmZvcm0pO1xuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCkge1xuXG4gICAgICAgIC8vIHJlbW92ZSBmb3JtIGZyb20gdGhlIHBhcmVudCBmb3JtIGdyb3VwXG4gICAgICAgIHJlc29sdmVkUHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZm9ybUdyb3VwLnJlbW92ZUNvbnRyb2woJ3Byb3BWYWx1ZScpO1xuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIGdldFZhbHVlKCk6IFZhbHVlIHtcblxuICAgICAgICByZXR1cm4gbmV3IFZhbHVlTGl0ZXJhbChTdHJpbmcodGhpcy5mb3JtLnZhbHVlLnVyaVZhbHVlKSwgS25vcmFDb25zdGFudHMueHNkVXJpKTtcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbmplY3QsIElucHV0LCBPbkNoYW5nZXMsIE9uSW5pdCwgT3V0cHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBGb3JtQnVpbGRlciwgRm9ybUdyb3VwLCBWYWxpZGF0b3JzIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgUmVzb3VyY2VDbGFzcyB9IGZyb20gJ0Brbm9yYS9jb3JlJztcblxuLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNDU2NjEwMTAvZHluYW1pYy1uZXN0ZWQtcmVhY3RpdmUtZm9ybS1leHByZXNzaW9uY2hhbmdlZGFmdGVyaXRoYXNiZWVuY2hlY2tlZGVycm9yXG5jb25zdCByZXNvbHZlZFByb21pc2UgPSBQcm9taXNlLnJlc29sdmUobnVsbCk7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAna3VpLXNlbGVjdC1yZXNvdXJjZS1jbGFzcycsXG4gICAgdGVtcGxhdGU6IGA8bWF0LWZvcm0tZmllbGQgKm5nSWY9XCJyZXNvdXJjZUNsYXNzZXMubGVuZ3RoID4gMFwiPlxuICA8bWF0LXNlbGVjdCBwbGFjZWhvbGRlcj1cIlJlc291cmNlIENsYXNzXCIgW2Zvcm1Db250cm9sXT1cImZvcm0uY29udHJvbHNbJ3Jlc291cmNlQ2xhc3MnXVwiPlxuICAgIDxtYXQtb3B0aW9uIFt2YWx1ZV09XCJudWxsXCI+bm8gc2VsZWN0aW9uPC9tYXQtb3B0aW9uPlxuICAgIDwhLS0gdW5kbyBzZWxlY3Rpb24gb2YgYSByZXNvdXJjZSBjbGFzcyAtLT5cbiAgICA8bWF0LW9wdGlvbiAqbmdGb3I9XCJsZXQgcmVzb3VyY2VDbGFzcyBvZiByZXNvdXJjZUNsYXNzZXNcIiBbdmFsdWVdPVwicmVzb3VyY2VDbGFzcy5pZFwiPnt7IHJlc291cmNlQ2xhc3MubGFiZWwgfX08L21hdC1vcHRpb24+XG4gIDwvbWF0LXNlbGVjdD5cbjwvbWF0LWZvcm0tZmllbGQ+YCxcbiAgICBzdHlsZXM6IFtgYF1cbn0pXG5leHBvcnQgY2xhc3MgU2VsZWN0UmVzb3VyY2VDbGFzc0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzIHtcblxuICAgIEBJbnB1dCgpIGZvcm1Hcm91cDogRm9ybUdyb3VwO1xuXG4gICAgLy8gc2V0dGVyIG1ldGhvZCBmb3IgcmVzb3VyY2UgY2xhc3NlcyB3aGVuIGJlaW5nIHVwZGF0ZWQgYnkgcGFyZW50IGNvbXBvbmVudFxuICAgIEBJbnB1dCgpXG4gICAgc2V0IHJlc291cmNlQ2xhc3Nlcyh2YWx1ZTogQXJyYXk8UmVzb3VyY2VDbGFzcz4pIHtcbiAgICAgICAgdGhpcy5yZXNvdXJjZUNsYXNzU2VsZWN0ZWQgPSB1bmRlZmluZWQ7IC8vIHJlc2V0IG9uIHVwZGF0ZXNcbiAgICAgICAgdGhpcy5fcmVzb3VyY2VDbGFzc2VzID0gdmFsdWU7XG4gICAgfVxuXG4gICAgLy8gZ2V0dGVyIG1ldGhvZCBmb3IgcmVzb3VyY2UgY2xhc3NlcyAodXNlZCBpbiB0ZW1wbGF0ZSlcbiAgICBnZXQgcmVzb3VyY2VDbGFzc2VzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcmVzb3VyY2VDbGFzc2VzO1xuICAgIH1cblxuICAgIC8vIGV2ZW50IGVtaXR0ZWQgdG8gcGFyZW50IGNvbXBvbmVudCBvbmNlIGEgcmVzb3VyY2UgY2xhc3MgaXMgc2VsZWN0ZWQgYnkgdGhlIHVzZXJcbiAgICBAT3V0cHV0KCkgcmVzb3VyY2VDbGFzc1NlbGVjdGVkRXZlbnQgPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oKTtcblxuICAgIC8vIGF2YWlsYWJsZSByZXNvdXJjZSBjbGFzc2VzIGZvciBzZWxlY3Rpb25cbiAgICBwcml2YXRlIF9yZXNvdXJjZUNsYXNzZXM6IEFycmF5PFJlc291cmNlQ2xhc3M+O1xuXG4gICAgLy8gc3RvcmVzIHRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgcmVzb3VyY2UgY2xhc3NcbiAgICBwcml2YXRlIHJlc291cmNlQ2xhc3NTZWxlY3RlZDogc3RyaW5nO1xuXG4gICAgZm9ybTogRm9ybUdyb3VwO1xuXG4gICAgY29uc3RydWN0b3IoQEluamVjdChGb3JtQnVpbGRlcikgcHJpdmF0ZSBmYjogRm9ybUJ1aWxkZXIpIHtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBJcmkgb2YgdGhlIHNlbGVjdGVkIHJlc291cmNlIGNsYXNzLlxuICAgICAqXG4gICAgICogQHJldHVybnMgdGhlIElyaSBvZiB0aGUgc2VsZWN0ZWQgcmVzb3VyY2UgY2xhc3Mgb3IgZmFsc2UgaW4gY2FzZSBubyByZXNvdXJjZSBjbGFzcyBpcyBzZWxlY3RlZC5cbiAgICAgKi9cbiAgICBnZXRSZXNvdXJjZUNsYXNzU2VsZWN0ZWQoKTogYW55IHtcbiAgICAgICAgaWYgKHRoaXMucmVzb3VyY2VDbGFzc1NlbGVjdGVkICE9PSB1bmRlZmluZWQgJiYgdGhpcy5yZXNvdXJjZUNsYXNzU2VsZWN0ZWQgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlQ2xhc3NTZWxlY3RlZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEluaXRhbGl6ZXMgdGhlIEZvcm1Hcm91cCBmb3IgdGhlIHJlc291cmNlIGNsYXNzIHNlbGVjdGlvbi5cbiAgICAgKiBUaGUgaW5pdGlhbCB2YWx1ZSBpcyBzZXQgdG8gbnVsbC5cbiAgICAgKi9cbiAgICBwcml2YXRlIGluaXRGb3JtKCkge1xuICAgICAgICAvLyBidWlsZCBhIGZvcm0gZm9yIHRoZSByZXNvdXJjZSBjbGFzcyBzZWxlY3Rpb25cbiAgICAgICAgdGhpcy5mb3JtID0gdGhpcy5mYi5ncm91cCh7XG4gICAgICAgICAgICByZXNvdXJjZUNsYXNzOiBbbnVsbF0gLy8gcmVzb3VyY2UgY2xhc3Mgc2VsZWN0aW9uIGlzIG9wdGlvbmFsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIHN0b3JlIGFuZCBlbWl0IElyaSBvZiB0aGUgcmVzb3VyY2UgY2xhc3Mgd2hlbiBzZWxlY3RlZFxuICAgICAgICB0aGlzLmZvcm0udmFsdWVDaGFuZ2VzLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5yZXNvdXJjZUNsYXNzU2VsZWN0ZWQgPSBkYXRhLnJlc291cmNlQ2xhc3M7XG4gICAgICAgICAgICB0aGlzLnJlc291cmNlQ2xhc3NTZWxlY3RlZEV2ZW50LmVtaXQodGhpcy5yZXNvdXJjZUNsYXNzU2VsZWN0ZWQpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHtcblxuICAgICAgICB0aGlzLmluaXRGb3JtKCk7XG5cbiAgICAgICAgLy8gYWRkIGZvcm0gdG8gdGhlIHBhcmVudCBmb3JtIGdyb3VwXG4gICAgICAgIHRoaXMuZm9ybUdyb3VwLmFkZENvbnRyb2woJ3Jlc291cmNlQ2xhc3MnLCB0aGlzLmZvcm0pO1xuXG4gICAgfVxuXG4gICAgbmdPbkNoYW5nZXMoKSB7XG5cbiAgICAgICAgaWYgKHRoaXMuZm9ybSAhPT0gdW5kZWZpbmVkKSB7XG5cbiAgICAgICAgICAgIC8vIHJlc291cmNlIGNsYXNzZXMgaGF2ZSBiZWVuIHJlaW5pdGlhbGl6ZWRcbiAgICAgICAgICAgIC8vIHJlc2V0IGZvcm1cbiAgICAgICAgICAgIHJlc29sdmVkUHJvbWlzZS50aGVuKCgpID0+IHtcblxuICAgICAgICAgICAgICAgIC8vIHJlbW92ZSB0aGlzIGZvcm0gZnJvbSB0aGUgcGFyZW50IGZvcm0gZ3JvdXBcbiAgICAgICAgICAgICAgICB0aGlzLmZvcm1Hcm91cC5yZW1vdmVDb250cm9sKCdyZXNvdXJjZUNsYXNzJyk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmluaXRGb3JtKCk7XG5cbiAgICAgICAgICAgICAgICAvLyBhZGQgZm9ybSB0byB0aGUgcGFyZW50IGZvcm0gZ3JvdXBcbiAgICAgICAgICAgICAgICB0aGlzLmZvcm1Hcm91cC5hZGRDb250cm9sKCdyZXNvdXJjZUNsYXNzJywgdGhpcy5mb3JtKTtcblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBCcm93c2VyQW5pbWF0aW9uc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXIvYW5pbWF0aW9ucyc7XG5pbXBvcnQge1xuICAgIE1hdEF1dG9jb21wbGV0ZU1vZHVsZSxcbiAgICBNYXRCdXR0b25Nb2R1bGUsXG4gICAgTWF0Q2hlY2tib3hNb2R1bGUsXG4gICAgTWF0RGF0ZXBpY2tlck1vZHVsZSxcbiAgICBNYXRGb3JtRmllbGRNb2R1bGUsXG4gICAgTWF0SWNvbk1vZHVsZSwgTWF0SW5wdXRNb2R1bGUsXG4gICAgTWF0TGlzdE1vZHVsZSxcbiAgICBNYXRTZWxlY3RNb2R1bGUsXG4gICAgTWF0VG9vbHRpcE1vZHVsZVxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbCc7XG5cbmltcG9ydCB7IEZvcm1zTW9kdWxlLCBSZWFjdGl2ZUZvcm1zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgS3VpQ29yZU1vZHVsZSB9IGZyb20gJ0Brbm9yYS9jb3JlJztcbmltcG9ydCB7IEt1aUFjdGlvbk1vZHVsZSB9IGZyb20gJ0Brbm9yYS9hY3Rpb24nO1xuaW1wb3J0IHsgS3VpVmlld2VyTW9kdWxlIH0gZnJvbSAnQGtub3JhL3ZpZXdlcic7XG5cbmltcG9ydCB7IE1hdEpETkNvbnZlcnRpYmxlQ2FsZW5kYXJEYXRlQWRhcHRlck1vZHVsZSB9IGZyb20gJ2pkbmNvbnZlcnRpYmxlY2FsZW5kYXJkYXRlYWRhcHRlcic7XG5cbmltcG9ydCB7IFNlYXJjaENvbXBvbmVudCB9IGZyb20gJy4vc2VhcmNoLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBFeHRlbmRlZFNlYXJjaENvbXBvbmVudCB9IGZyb20gJy4vZXh0ZW5kZWQtc2VhcmNoL2V4dGVuZGVkLXNlYXJjaC5jb21wb25lbnQnO1xuXG5pbXBvcnQgeyBTZWxlY3RPbnRvbG9neUNvbXBvbmVudCB9IGZyb20gJy4vZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1vbnRvbG9neS9zZWxlY3Qtb250b2xvZ3kuY29tcG9uZW50JztcbmltcG9ydCB7IFNlbGVjdFJlc291cmNlQ2xhc3NDb21wb25lbnQgfSBmcm9tICcuL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3QtcmVzb3VyY2UtY2xhc3Mvc2VsZWN0LXJlc291cmNlLWNsYXNzLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBTZWxlY3RQcm9wZXJ0eUNvbXBvbmVudCB9IGZyb20gJy4vZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1wcm9wZXJ0eS9zZWxlY3QtcHJvcGVydHkuY29tcG9uZW50JztcbmltcG9ydCB7IFNwZWNpZnlQcm9wZXJ0eVZhbHVlQ29tcG9uZW50IH0gZnJvbSAnLi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXByb3BlcnR5L3NwZWNpZnktcHJvcGVydHktdmFsdWUvc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgQm9vbGVhblZhbHVlQ29tcG9uZW50IH0gZnJvbSAnLi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXByb3BlcnR5L3NwZWNpZnktcHJvcGVydHktdmFsdWUvYm9vbGVhbi12YWx1ZS9ib29sZWFuLXZhbHVlLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBEYXRlVmFsdWVDb21wb25lbnQgfSBmcm9tICcuL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3QtcHJvcGVydHkvc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZS9kYXRlLXZhbHVlL2RhdGUtdmFsdWUuY29tcG9uZW50JztcbmltcG9ydCB7IERlY2ltYWxWYWx1ZUNvbXBvbmVudCB9IGZyb20gJy4vZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1wcm9wZXJ0eS9zcGVjaWZ5LXByb3BlcnR5LXZhbHVlL2RlY2ltYWwtdmFsdWUvZGVjaW1hbC12YWx1ZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgSW50ZWdlclZhbHVlQ29tcG9uZW50IH0gZnJvbSAnLi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXByb3BlcnR5L3NwZWNpZnktcHJvcGVydHktdmFsdWUvaW50ZWdlci12YWx1ZS9pbnRlZ2VyLXZhbHVlLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBMaW5rVmFsdWVDb21wb25lbnQgfSBmcm9tICcuL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3QtcHJvcGVydHkvc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZS9saW5rLXZhbHVlL2xpbmstdmFsdWUuY29tcG9uZW50JztcbmltcG9ydCB7IFRleHRWYWx1ZUNvbXBvbmVudCB9IGZyb20gJy4vZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1wcm9wZXJ0eS9zcGVjaWZ5LXByb3BlcnR5LXZhbHVlL3RleHQtdmFsdWUvdGV4dC12YWx1ZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgVXJpVmFsdWVDb21wb25lbnQgfSBmcm9tICcuL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3QtcHJvcGVydHkvc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZS91cmktdmFsdWUvdXJpLXZhbHVlLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBIZWFkZXJDb21wb25lbnQgfSBmcm9tICcuL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3QtcHJvcGVydHkvc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZS9kYXRlLXZhbHVlL2hlYWRlci1jYWxlbmRhci9oZWFkZXItY2FsZW5kYXIuY29tcG9uZW50JztcblxuXG5ATmdNb2R1bGUoe1xuICAgIGltcG9ydHM6IFtcbiAgICAgICAgQ29tbW9uTW9kdWxlLFxuICAgICAgICBCcm93c2VyQW5pbWF0aW9uc01vZHVsZSxcbiAgICAgICAgTWF0QXV0b2NvbXBsZXRlTW9kdWxlLFxuICAgICAgICBNYXRCdXR0b25Nb2R1bGUsXG4gICAgICAgIE1hdENoZWNrYm94TW9kdWxlLFxuICAgICAgICBNYXREYXRlcGlja2VyTW9kdWxlLFxuICAgICAgICBNYXRGb3JtRmllbGRNb2R1bGUsXG4gICAgICAgIE1hdElucHV0TW9kdWxlLFxuICAgICAgICBNYXRJY29uTW9kdWxlLFxuICAgICAgICBNYXRMaXN0TW9kdWxlLFxuICAgICAgICBNYXRTZWxlY3RNb2R1bGUsXG4gICAgICAgIE1hdFRvb2x0aXBNb2R1bGUsXG4gICAgICAgIEZvcm1zTW9kdWxlLFxuICAgICAgICBSZWFjdGl2ZUZvcm1zTW9kdWxlLFxuICAgICAgICBLdWlDb3JlTW9kdWxlLFxuICAgICAgICBLdWlBY3Rpb25Nb2R1bGUsXG4gICAgICAgIEt1aVZpZXdlck1vZHVsZSxcbiAgICAgICAgTWF0SkROQ29udmVydGlibGVDYWxlbmRhckRhdGVBZGFwdGVyTW9kdWxlXG4gICAgXSxcbiAgICBkZWNsYXJhdGlvbnM6IFtcbiAgICAgICAgU2VhcmNoQ29tcG9uZW50LFxuICAgICAgICBTZWxlY3RPbnRvbG9neUNvbXBvbmVudCxcbiAgICAgICAgRXh0ZW5kZWRTZWFyY2hDb21wb25lbnQsXG4gICAgICAgIFNlbGVjdFJlc291cmNlQ2xhc3NDb21wb25lbnQsXG4gICAgICAgIFNlbGVjdFByb3BlcnR5Q29tcG9uZW50LFxuICAgICAgICBTcGVjaWZ5UHJvcGVydHlWYWx1ZUNvbXBvbmVudCxcbiAgICAgICAgQm9vbGVhblZhbHVlQ29tcG9uZW50LFxuICAgICAgICBEYXRlVmFsdWVDb21wb25lbnQsXG4gICAgICAgIERlY2ltYWxWYWx1ZUNvbXBvbmVudCxcbiAgICAgICAgSW50ZWdlclZhbHVlQ29tcG9uZW50LFxuICAgICAgICBMaW5rVmFsdWVDb21wb25lbnQsXG4gICAgICAgIFRleHRWYWx1ZUNvbXBvbmVudCxcbiAgICAgICAgVXJpVmFsdWVDb21wb25lbnQsXG4gICAgICAgIEhlYWRlckNvbXBvbmVudFxuICAgIF0sXG4gICAgZXhwb3J0czogW1NlYXJjaENvbXBvbmVudF0sXG4gICAgZW50cnlDb21wb25lbnRzOiBbXG4gICAgICAgIEhlYWRlckNvbXBvbmVudFxuICAgIF1cbn0pXG5leHBvcnQgY2xhc3MgS3VpU2VhcmNoTW9kdWxlIHtcbn1cbiJdLCJuYW1lcyI6WyJ0c2xpYl8xLl9fdmFsdWVzIiwiQ29tcG9uZW50IiwidHJpZ2dlciIsInN0YXRlIiwic3R5bGUiLCJ0cmFuc2l0aW9uIiwiYW5pbWF0ZSIsIkFjdGl2YXRlZFJvdXRlIiwiUm91dGVyIiwiRWxlbWVudFJlZiIsIklucHV0IiwiRXZlbnRFbWl0dGVyIiwiUmVhZFJlc291cmNlc1NlcXVlbmNlIiwiRm9ybUJ1aWxkZXIiLCJJbmplY3QiLCJPbnRvbG9neUNhY2hlU2VydmljZSIsIkdyYXZzZWFyY2hHZW5lcmF0aW9uU2VydmljZSIsIk91dHB1dCIsIlZpZXdDaGlsZCIsIlZpZXdDaGlsZHJlbiIsIlZhbGlkYXRvcnMiLCJDYXJkaW5hbGl0eU9jY3VycmVuY2UiLCJQcm9wZXJ0eVdpdGhWYWx1ZSIsInJlc29sdmVkUHJvbWlzZSIsIktub3JhQ29uc3RhbnRzIiwiTGlrZSIsIk1hdGNoIiwiRXF1YWxzIiwiTm90RXF1YWxzIiwiRXhpc3RzIiwiTGVzc1RoYW4iLCJMZXNzVGhhbkVxdWFscyIsIkdyZWF0ZXJUaGFuIiwiR3JlYXRlclRoYW5FcXVhbHMiLCJDb21wYXJpc29uT3BlcmF0b3JBbmRWYWx1ZSIsIlZhbHVlTGl0ZXJhbCIsIkpETkNvbnZlcnRpYmxlQ2FsZW5kYXIiLCJKRE5Db252ZXJ0aWJsZUNhbGVuZGFyRGF0ZUFkYXB0ZXIiLCJNYXRDYWxlbmRhciIsIkhvc3QiLCJEYXRlQWRhcHRlciIsIkNvbnZlcnRKU09OTEQiLCJSZWFkUmVzb3VyY2UiLCJJUkkiLCJTZWFyY2hTZXJ2aWNlIiwiVXRpbHMiLCJOZ01vZHVsZSIsIkNvbW1vbk1vZHVsZSIsIkJyb3dzZXJBbmltYXRpb25zTW9kdWxlIiwiTWF0QXV0b2NvbXBsZXRlTW9kdWxlIiwiTWF0QnV0dG9uTW9kdWxlIiwiTWF0Q2hlY2tib3hNb2R1bGUiLCJNYXREYXRlcGlja2VyTW9kdWxlIiwiTWF0Rm9ybUZpZWxkTW9kdWxlIiwiTWF0SW5wdXRNb2R1bGUiLCJNYXRJY29uTW9kdWxlIiwiTWF0TGlzdE1vZHVsZSIsIk1hdFNlbGVjdE1vZHVsZSIsIk1hdFRvb2x0aXBNb2R1bGUiLCJGb3Jtc01vZHVsZSIsIlJlYWN0aXZlRm9ybXNNb2R1bGUiLCJLdWlDb3JlTW9kdWxlIiwiS3VpQWN0aW9uTW9kdWxlIiwiS3VpVmlld2VyTW9kdWxlIiwiTWF0SkROQ29udmVydGlibGVDYWxlbmRhckRhdGVBZGFwdGVyTW9kdWxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7SUFBQTs7Ozs7Ozs7Ozs7Ozs7QUFjQSxzQkE0RnlCLENBQUM7UUFDdEIsSUFBSSxDQUFDLEdBQUcsT0FBTyxNQUFNLEtBQUssVUFBVSxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFB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