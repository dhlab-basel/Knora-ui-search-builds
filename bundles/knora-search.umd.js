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
                        template: "<div class=\"search-bar-elements\">\n\n    <!-- the next element - div.extended-search-panel - is a hidden dropdown filter menu -->\n\n    <div class=\"search-panel\" [class.active]=\"searchPanelFocus\">\n        <div>\n            <button class=\"prefix\" (click)=\"doSearch(search)\">\n                <mat-icon>search</mat-icon>\n            </button>\n        </div>\n\n        <div class=\"input-field\">\n            <input #search autocomplete=\"off\" type=\"search\" [placeholder]=\"searchLabel\" [(ngModel)]=\"searchQuery\" name=\"search\" (keyup.esc)=\"resetSearch(search)\" (keyup)=\"onKey(search, $event)\" (click)=\"setFocus()\" (focus)=\"toggleMenu('simpleSearch')\" [disabled]=\"focusOnExtended === 'active'\" />\n        </div>\n\n        <!-- switch button: on some focus we need a close button for the simple or extended panel -->\n        <div>\n            <button class=\"suffix\" *ngIf=\"focusOnSimple === 'active'\" (click)=\"resetSearch(search)\">\n                <mat-icon>close</mat-icon>\n            </button>\n            <button class=\"suffix\" *ngIf=\"focusOnSimple === 'inactive'\">\n            </button>\n        </div>\n\n        <!-- the search panel has two \"dropdown\" menus: one for simple search and another one for the extended search -->\n        <div class=\"salsah-menu simple-search\" [@simpleSearchMenu]=\"focusOnSimple\" *ngIf=\"showSimpleSearch\">\n            <mat-list class=\"salsah-previous-search-list\">\n                <mat-list-item *ngFor=\"let item of prevSearch | kuiReverse; let i=index\">\n                    <h4 mat-line *ngIf=\"i<10\" (click)=\"doPrevSearch(item)\">{{item}}</h4>\n                    <button mat-icon-button (click)=\"resetPrevSearch(item)\">\n                        <mat-icon aria-label=\"close\">close</mat-icon>\n                    </button>\n                </mat-list-item>\n            </mat-list>\n            <button mat-stroked-button color=\"accent\" class=\"right\" (click)=\"resetPrevSearch()\" *ngIf=\"prevSearch\">Clear</button>\n        </div>\n\n        <div class=\"salsah-menu extended-search\" [@extendedSearchMenu]=\"focusOnExtended\">\n            <div class=\"salsah-menu-header\">\n                <span class=\"salsah-menu-title\">\n                    <h4>Advanced search</h4>\n                </span>\n                <span class=\"salsah-menu-action\">\n                    <button mat-icon-button (click)=\"toggleMenu('extendedSearch')\">\n                        <mat-icon>close</mat-icon>\n                    </button>\n                </span>\n            </div>\n            <div class=\"extended-search-box\">\n                <kui-extended-search [route]=\"route\" (toggleExtendedSearchForm)=\"toggleMenu('extendedSearch')\"></kui-extended-search>\n            </div>\n        </div>\n    </div>\n\n    <!-- Extended search button to display the extended search form in the search panel -->\n    <button mat-button type=\"button\" color=\"primary\" class=\"advanced-search-button\" (click)=\"toggleMenu('extendedSearch')\">\n        advanced\n    </button>\n\n</div>",
                        styles: ["input[type=search]::-webkit-search-cancel-button,input[type=search]::-webkit-search-decoration,input[type=search]::-webkit-search-results-button,input[type=search]::-webkit-search-results-decoration{display:none}input[type=search]{-moz-appearance:none;-webkit-appearance:none}.center{display:block;margin-left:auto;margin-right:auto}.close{right:12px}.extended-search-box{margin:12px}.advanced-search-button{margin-left:10px}.full-width{width:100%}.hide{display:none}.inactive,.mute{color:#7a7a7a}.search-panel{background-color:#f9f9f9;border-radius:4px;display:inline-flex;height:40px;position:relative;width:680px;z-index:10}.search-panel:hover{box-shadow:0 1px 3px rgba(0,0,0,.5)}.search-panel div.input-field{flex:1}.search-panel div.input-field input{border-style:none;font-size:14pt;height:38px;position:absolute;width:calc(100% - 80px)}.search-panel div.input-field input:active,.search-panel div.input-field input:focus{outline:0}.search-panel div .prefix,.search-panel div .suffix{background-color:#fff;border-radius:3px;border-style:none;color:rgba(41,41,41,.4);cursor:pointer;height:38px;outline:0;position:relative;width:40px}.search-panel div .prefix:active,.search-panel div .suffix:active{color:#515151}.search-panel.active{box-shadow:0 1px 3px rgba(0,0,0,.5)}.salsah-menu{box-shadow:0 3px 5px -1px rgba(11,11,11,.2),0 6px 10px 0 rgba(11,11,11,.14),0 1px 18px 0 rgba(11,11,11,.12);background-color:#f9f9f9;border-radius:4px;position:absolute}.salsah-menu .salsah-menu-header{background-color:#f9f9f9;border-top-left-radius:4px;border-top-right-radius:4px;display:inline-block;height:48px;width:100%}.salsah-menu .salsah-menu-header .salsah-menu-title{float:left;font-size:14px;font-weight:400;margin-top:4px;padding:12px}.salsah-menu .salsah-menu-header .salsah-menu-action{float:right;margin:4px}.salsah-menu.extended-search,.salsah-menu.simple-search{min-height:680px;width:680px}.salsah-menu.simple-search{padding-top:60px;z-index:-1}.salsah-menu.simple-search .salsah-previous-search-list .mat-list-item{cursor:pointer}.salsah-menu.simple-search .salsah-previous-search-list .mat-list-item:hover{background-color:#f9f9f9}.salsah-menu.simple-search .salsah-previous-search-list .mat-list-item:hover mat-icon{display:block}.salsah-menu.simple-search .salsah-previous-search-list .mat-list-item mat-icon{display:none}.salsah-menu.simple-search .right{margin-top:12px;margin-left:16px}.salsah-menu.extended-search{z-index:20}.search-bar-elements{display:flex}.show{display:block}@media screen and (max-width:1024px){.search-panel{width:480px}.search-panel div.input-field input{width:calc(480px - 80px)}.salsah-menu.extended-search,.salsah-menu.simple-search{width:480px}}@media screen and (max-width:768px){.search-panel{width:calc(480px - 160px)}.search-panel div.input-field input{width:calc(480px - 160px - 80px)}.salsah-menu.extended-search,.salsah-menu.simple-search{width:calc(480px - 80px)}}"],
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
                _this.resourceClasses = ontoInfo.getResourceClassesAsArray();
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
                this._searchService.searchByLabel(searchTerm, this._restrictToResourceClass).subscribe(function (result) {
                    var promises = jsonld.promises;
                    // compact JSON-LD using an empty context: expands all Iris
                    var promise = promises.compact(result.body, {});
                    promise.then(function (compacted) {
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

    /*
     * Public API Surface of search
     */

    /**
     * Generated bundle index. Do not edit.
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia25vcmEtc2VhcmNoLnVtZC5qcy5tYXAiLCJzb3VyY2VzIjpbbnVsbCwibmc6Ly9Aa25vcmEvc2VhcmNoL2xpYi9zZWFyY2guY29tcG9uZW50LnRzIiwibmc6Ly9Aa25vcmEvc2VhcmNoL2xpYi9leHRlbmRlZC1zZWFyY2gvZXh0ZW5kZWQtc2VhcmNoLmNvbXBvbmVudC50cyIsIm5nOi8vQGtub3JhL3NlYXJjaC9saWIvZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1vbnRvbG9neS9zZWxlY3Qtb250b2xvZ3kuY29tcG9uZW50LnRzIiwibmc6Ly9Aa25vcmEvc2VhcmNoL2xpYi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXByb3BlcnR5L3NlbGVjdC1wcm9wZXJ0eS5jb21wb25lbnQudHMiLCJuZzovL0Brbm9yYS9zZWFyY2gvbGliL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3QtcHJvcGVydHkvc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZS9zcGVjaWZ5LXByb3BlcnR5LXZhbHVlLmNvbXBvbmVudC50cyIsIm5nOi8vQGtub3JhL3NlYXJjaC9saWIvZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1wcm9wZXJ0eS9zcGVjaWZ5LXByb3BlcnR5LXZhbHVlL2Jvb2xlYW4tdmFsdWUvYm9vbGVhbi12YWx1ZS5jb21wb25lbnQudHMiLCJuZzovL0Brbm9yYS9zZWFyY2gvbGliL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3QtcHJvcGVydHkvc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZS9kYXRlLXZhbHVlL2hlYWRlci1jYWxlbmRhci9oZWFkZXItY2FsZW5kYXIuY29tcG9uZW50LnRzIiwibmc6Ly9Aa25vcmEvc2VhcmNoL2xpYi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXByb3BlcnR5L3NwZWNpZnktcHJvcGVydHktdmFsdWUvZGF0ZS12YWx1ZS9kYXRlLXZhbHVlLmNvbXBvbmVudC50cyIsIm5nOi8vQGtub3JhL3NlYXJjaC9saWIvZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1wcm9wZXJ0eS9zcGVjaWZ5LXByb3BlcnR5LXZhbHVlL2RlY2ltYWwtdmFsdWUvZGVjaW1hbC12YWx1ZS5jb21wb25lbnQudHMiLCJuZzovL0Brbm9yYS9zZWFyY2gvbGliL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3QtcHJvcGVydHkvc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZS9pbnRlZ2VyLXZhbHVlL2ludGVnZXItdmFsdWUuY29tcG9uZW50LnRzIiwibmc6Ly9Aa25vcmEvc2VhcmNoL2xpYi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXByb3BlcnR5L3NwZWNpZnktcHJvcGVydHktdmFsdWUvbGluay12YWx1ZS9saW5rLXZhbHVlLmNvbXBvbmVudC50cyIsIm5nOi8vQGtub3JhL3NlYXJjaC9saWIvZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1wcm9wZXJ0eS9zcGVjaWZ5LXByb3BlcnR5LXZhbHVlL3RleHQtdmFsdWUvdGV4dC12YWx1ZS5jb21wb25lbnQudHMiLCJuZzovL0Brbm9yYS9zZWFyY2gvbGliL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3QtcHJvcGVydHkvc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZS91cmktdmFsdWUvdXJpLXZhbHVlLmNvbXBvbmVudC50cyIsIm5nOi8vQGtub3JhL3NlYXJjaC9saWIvZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1yZXNvdXJjZS1jbGFzcy9zZWxlY3QtcmVzb3VyY2UtY2xhc3MuY29tcG9uZW50LnRzIiwibmc6Ly9Aa25vcmEvc2VhcmNoL2xpYi9zZWFyY2gubW9kdWxlLnRzIiwibmc6Ly9Aa25vcmEvc2VhcmNoL3B1YmxpY19hcGkudHMiLCJuZzovL0Brbm9yYS9zZWFyY2gva25vcmEtc2VhcmNoLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qISAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5Db3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlXHJcbnRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlXHJcbkxpY2Vuc2UgYXQgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcblxyXG5USElTIENPREUgSVMgUFJPVklERUQgT04gQU4gKkFTIElTKiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZXHJcbktJTkQsIEVJVEhFUiBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBXSVRIT1VUIExJTUlUQVRJT04gQU5ZIElNUExJRURcclxuV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIFRJVExFLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSxcclxuTUVSQ0hBTlRBQkxJVFkgT1IgTk9OLUlORlJJTkdFTUVOVC5cclxuXHJcblNlZSB0aGUgQXBhY2hlIFZlcnNpb24gMi4wIExpY2Vuc2UgZm9yIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9uc1xyXG5hbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXHJcbi8qIGdsb2JhbCBSZWZsZWN0LCBQcm9taXNlICovXHJcblxyXG52YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4dGVuZHMoZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fYXNzaWduID0gZnVuY3Rpb24oKSB7XHJcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gX19hc3NpZ24odCkge1xyXG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpIHRbcF0gPSBzW3BdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdDtcclxuICAgIH1cclxuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZXN0KHMsIGUpIHtcclxuICAgIHZhciB0ID0ge307XHJcbiAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkgJiYgZS5pbmRleE9mKHApIDwgMClcclxuICAgICAgICB0W3BdID0gc1twXTtcclxuICAgIGlmIChzICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgcCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocyk7IGkgPCBwLmxlbmd0aDsgaSsrKSBpZiAoZS5pbmRleE9mKHBbaV0pIDwgMClcclxuICAgICAgICAgICAgdFtwW2ldXSA9IHNbcFtpXV07XHJcbiAgICByZXR1cm4gdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcclxuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xyXG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcclxuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3BhcmFtKHBhcmFtSW5kZXgsIGRlY29yYXRvcikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIGtleSkgeyBkZWNvcmF0b3IodGFyZ2V0LCBrZXksIHBhcmFtSW5kZXgpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKSB7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdGVyKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2dlbmVyYXRvcih0aGlzQXJnLCBib2R5KSB7XHJcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xyXG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcclxuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XHJcbiAgICAgICAgd2hpbGUgKF8pIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcclxuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XHJcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcclxuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cclxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXhwb3J0U3RhcihtLCBleHBvcnRzKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmICghZXhwb3J0cy5oYXNPd25Qcm9wZXJ0eShwKSkgZXhwb3J0c1twXSA9IG1bcF07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3ZhbHVlcyhvKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl0sIGkgPSAwO1xyXG4gICAgaWYgKG0pIHJldHVybiBtLmNhbGwobyk7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKG8gJiYgaSA+PSBvLmxlbmd0aCkgbyA9IHZvaWQgMDtcclxuICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IG8gJiYgb1tpKytdLCBkb25lOiAhbyB9O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3JlYWQobywgbikge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdO1xyXG4gICAgaWYgKCFtKSByZXR1cm4gbztcclxuICAgIHZhciBpID0gbS5jYWxsKG8pLCByLCBhciA9IFtdLCBlO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICB3aGlsZSAoKG4gPT09IHZvaWQgMCB8fCBuLS0gPiAwKSAmJiAhKHIgPSBpLm5leHQoKSkuZG9uZSkgYXIucHVzaChyLnZhbHVlKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlcnJvcikgeyBlID0geyBlcnJvcjogZXJyb3IgfTsgfVxyXG4gICAgZmluYWxseSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKHIgJiYgIXIuZG9uZSAmJiAobSA9IGlbXCJyZXR1cm5cIl0pKSBtLmNhbGwoaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbmFsbHkgeyBpZiAoZSkgdGhyb3cgZS5lcnJvcjsgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWQoKSB7XHJcbiAgICBmb3IgKHZhciBhciA9IFtdLCBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKylcclxuICAgICAgICBhciA9IGFyLmNvbmNhdChfX3JlYWQoYXJndW1lbnRzW2ldKSk7XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0KHYpIHtcclxuICAgIHJldHVybiB0aGlzIGluc3RhbmNlb2YgX19hd2FpdCA/ICh0aGlzLnYgPSB2LCB0aGlzKSA6IG5ldyBfX2F3YWl0KHYpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0dlbmVyYXRvcih0aGlzQXJnLCBfYXJndW1lbnRzLCBnZW5lcmF0b3IpIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgZyA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSwgaSwgcSA9IFtdO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlmIChnW25dKSBpW25dID0gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChhLCBiKSB7IHEucHVzaChbbiwgdiwgYSwgYl0pID4gMSB8fCByZXN1bWUobiwgdik7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiByZXN1bWUobiwgdikgeyB0cnkgeyBzdGVwKGdbbl0odikpOyB9IGNhdGNoIChlKSB7IHNldHRsZShxWzBdWzNdLCBlKTsgfSB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKHIpIHsgci52YWx1ZSBpbnN0YW5jZW9mIF9fYXdhaXQgPyBQcm9taXNlLnJlc29sdmUoci52YWx1ZS52KS50aGVuKGZ1bGZpbGwsIHJlamVjdCkgOiBzZXR0bGUocVswXVsyXSwgcik7IH1cclxuICAgIGZ1bmN0aW9uIGZ1bGZpbGwodmFsdWUpIHsgcmVzdW1lKFwibmV4dFwiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHJlamVjdCh2YWx1ZSkgeyByZXN1bWUoXCJ0aHJvd1wiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShmLCB2KSB7IGlmIChmKHYpLCBxLnNoaWZ0KCksIHEubGVuZ3RoKSByZXN1bWUocVswXVswXSwgcVswXVsxXSk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNEZWxlZ2F0b3Iobykge1xyXG4gICAgdmFyIGksIHA7XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIsIGZ1bmN0aW9uIChlKSB7IHRocm93IGU7IH0pLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuLCBmKSB7IGlbbl0gPSBvW25dID8gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIChwID0gIXApID8geyB2YWx1ZTogX19hd2FpdChvW25dKHYpKSwgZG9uZTogbiA9PT0gXCJyZXR1cm5cIiB9IDogZiA/IGYodikgOiB2OyB9IDogZjsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY1ZhbHVlcyhvKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIG0gPSBvW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSwgaTtcclxuICAgIHJldHVybiBtID8gbS5jYWxsKG8pIDogKG8gPSB0eXBlb2YgX192YWx1ZXMgPT09IFwiZnVuY3Rpb25cIiA/IF9fdmFsdWVzKG8pIDogb1tTeW1ib2wuaXRlcmF0b3JdKCksIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpKTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpW25dID0gb1tuXSAmJiBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkgeyB2ID0gb1tuXSh2KSwgc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgdi5kb25lLCB2LnZhbHVlKTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShyZXNvbHZlLCByZWplY3QsIGQsIHYpIHsgUHJvbWlzZS5yZXNvbHZlKHYpLnRoZW4oZnVuY3Rpb24odikgeyByZXNvbHZlKHsgdmFsdWU6IHYsIGRvbmU6IGQgfSk7IH0sIHJlamVjdCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWFrZVRlbXBsYXRlT2JqZWN0KGNvb2tlZCwgcmF3KSB7XHJcbiAgICBpZiAoT2JqZWN0LmRlZmluZVByb3BlcnR5KSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb29rZWQsIFwicmF3XCIsIHsgdmFsdWU6IHJhdyB9KTsgfSBlbHNlIHsgY29va2VkLnJhdyA9IHJhdzsgfVxyXG4gICAgcmV0dXJuIGNvb2tlZDtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydFN0YXIobW9kKSB7XHJcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xyXG4gICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKE9iamVjdC5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZCwgaykpIHJlc3VsdFtrXSA9IG1vZFtrXTtcclxuICAgIHJlc3VsdC5kZWZhdWx0ID0gbW9kO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0RGVmYXVsdChtb2QpIHtcclxuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgZGVmYXVsdDogbW9kIH07XHJcbn1cclxuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBJbnB1dCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZSwgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7XG4gICAgYW5pbWF0ZSxcbiAgICBzdGF0ZSxcbiAgICBzdHlsZSxcbiAgICB0cmFuc2l0aW9uLFxuICAgIHRyaWdnZXJcbn0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAna3VpLXNlYXJjaCcsXG4gICAgdGVtcGxhdGU6IGA8ZGl2IGNsYXNzPVwic2VhcmNoLWJhci1lbGVtZW50c1wiPlxuXG4gICAgPCEtLSB0aGUgbmV4dCBlbGVtZW50IC0gZGl2LmV4dGVuZGVkLXNlYXJjaC1wYW5lbCAtIGlzIGEgaGlkZGVuIGRyb3Bkb3duIGZpbHRlciBtZW51IC0tPlxuXG4gICAgPGRpdiBjbGFzcz1cInNlYXJjaC1wYW5lbFwiIFtjbGFzcy5hY3RpdmVdPVwic2VhcmNoUGFuZWxGb2N1c1wiPlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cInByZWZpeFwiIChjbGljayk9XCJkb1NlYXJjaChzZWFyY2gpXCI+XG4gICAgICAgICAgICAgICAgPG1hdC1pY29uPnNlYXJjaDwvbWF0LWljb24+XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBjbGFzcz1cImlucHV0LWZpZWxkXCI+XG4gICAgICAgICAgICA8aW5wdXQgI3NlYXJjaCBhdXRvY29tcGxldGU9XCJvZmZcIiB0eXBlPVwic2VhcmNoXCIgW3BsYWNlaG9sZGVyXT1cInNlYXJjaExhYmVsXCIgWyhuZ01vZGVsKV09XCJzZWFyY2hRdWVyeVwiIG5hbWU9XCJzZWFyY2hcIiAoa2V5dXAuZXNjKT1cInJlc2V0U2VhcmNoKHNlYXJjaClcIiAoa2V5dXApPVwib25LZXkoc2VhcmNoLCAkZXZlbnQpXCIgKGNsaWNrKT1cInNldEZvY3VzKClcIiAoZm9jdXMpPVwidG9nZ2xlTWVudSgnc2ltcGxlU2VhcmNoJylcIiBbZGlzYWJsZWRdPVwiZm9jdXNPbkV4dGVuZGVkID09PSAnYWN0aXZlJ1wiIC8+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDwhLS0gc3dpdGNoIGJ1dHRvbjogb24gc29tZSBmb2N1cyB3ZSBuZWVkIGEgY2xvc2UgYnV0dG9uIGZvciB0aGUgc2ltcGxlIG9yIGV4dGVuZGVkIHBhbmVsIC0tPlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cInN1ZmZpeFwiICpuZ0lmPVwiZm9jdXNPblNpbXBsZSA9PT0gJ2FjdGl2ZSdcIiAoY2xpY2spPVwicmVzZXRTZWFyY2goc2VhcmNoKVwiPlxuICAgICAgICAgICAgICAgIDxtYXQtaWNvbj5jbG9zZTwvbWF0LWljb24+XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJzdWZmaXhcIiAqbmdJZj1cImZvY3VzT25TaW1wbGUgPT09ICdpbmFjdGl2ZSdcIj5cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8IS0tIHRoZSBzZWFyY2ggcGFuZWwgaGFzIHR3byBcImRyb3Bkb3duXCIgbWVudXM6IG9uZSBmb3Igc2ltcGxlIHNlYXJjaCBhbmQgYW5vdGhlciBvbmUgZm9yIHRoZSBleHRlbmRlZCBzZWFyY2ggLS0+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJzYWxzYWgtbWVudSBzaW1wbGUtc2VhcmNoXCIgW0BzaW1wbGVTZWFyY2hNZW51XT1cImZvY3VzT25TaW1wbGVcIiAqbmdJZj1cInNob3dTaW1wbGVTZWFyY2hcIj5cbiAgICAgICAgICAgIDxtYXQtbGlzdCBjbGFzcz1cInNhbHNhaC1wcmV2aW91cy1zZWFyY2gtbGlzdFwiPlxuICAgICAgICAgICAgICAgIDxtYXQtbGlzdC1pdGVtICpuZ0Zvcj1cImxldCBpdGVtIG9mIHByZXZTZWFyY2ggfCBrdWlSZXZlcnNlOyBsZXQgaT1pbmRleFwiPlxuICAgICAgICAgICAgICAgICAgICA8aDQgbWF0LWxpbmUgKm5nSWY9XCJpPDEwXCIgKGNsaWNrKT1cImRvUHJldlNlYXJjaChpdGVtKVwiPnt7aXRlbX19PC9oND5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBtYXQtaWNvbi1idXR0b24gKGNsaWNrKT1cInJlc2V0UHJldlNlYXJjaChpdGVtKVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPG1hdC1pY29uIGFyaWEtbGFiZWw9XCJjbG9zZVwiPmNsb3NlPC9tYXQtaWNvbj5cbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9tYXQtbGlzdC1pdGVtPlxuICAgICAgICAgICAgPC9tYXQtbGlzdD5cbiAgICAgICAgICAgIDxidXR0b24gbWF0LXN0cm9rZWQtYnV0dG9uIGNvbG9yPVwiYWNjZW50XCIgY2xhc3M9XCJyaWdodFwiIChjbGljayk9XCJyZXNldFByZXZTZWFyY2goKVwiICpuZ0lmPVwicHJldlNlYXJjaFwiPkNsZWFyPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgY2xhc3M9XCJzYWxzYWgtbWVudSBleHRlbmRlZC1zZWFyY2hcIiBbQGV4dGVuZGVkU2VhcmNoTWVudV09XCJmb2N1c09uRXh0ZW5kZWRcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzYWxzYWgtbWVudS1oZWFkZXJcIj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNhbHNhaC1tZW51LXRpdGxlXCI+XG4gICAgICAgICAgICAgICAgICAgIDxoND5BZHZhbmNlZCBzZWFyY2g8L2g0PlxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNhbHNhaC1tZW51LWFjdGlvblwiPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIG1hdC1pY29uLWJ1dHRvbiAoY2xpY2spPVwidG9nZ2xlTWVudSgnZXh0ZW5kZWRTZWFyY2gnKVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPG1hdC1pY29uPmNsb3NlPC9tYXQtaWNvbj5cbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZXh0ZW5kZWQtc2VhcmNoLWJveFwiPlxuICAgICAgICAgICAgICAgIDxrdWktZXh0ZW5kZWQtc2VhcmNoIFtyb3V0ZV09XCJyb3V0ZVwiICh0b2dnbGVFeHRlbmRlZFNlYXJjaEZvcm0pPVwidG9nZ2xlTWVudSgnZXh0ZW5kZWRTZWFyY2gnKVwiPjwva3VpLWV4dGVuZGVkLXNlYXJjaD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cblxuICAgIDwhLS0gRXh0ZW5kZWQgc2VhcmNoIGJ1dHRvbiB0byBkaXNwbGF5IHRoZSBleHRlbmRlZCBzZWFyY2ggZm9ybSBpbiB0aGUgc2VhcmNoIHBhbmVsIC0tPlxuICAgIDxidXR0b24gbWF0LWJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY29sb3I9XCJwcmltYXJ5XCIgY2xhc3M9XCJhZHZhbmNlZC1zZWFyY2gtYnV0dG9uXCIgKGNsaWNrKT1cInRvZ2dsZU1lbnUoJ2V4dGVuZGVkU2VhcmNoJylcIj5cbiAgICAgICAgYWR2YW5jZWRcbiAgICA8L2J1dHRvbj5cblxuPC9kaXY+YCxcbiAgICBzdHlsZXM6IFtgaW5wdXRbdHlwZT1zZWFyY2hdOjotd2Via2l0LXNlYXJjaC1jYW5jZWwtYnV0dG9uLGlucHV0W3R5cGU9c2VhcmNoXTo6LXdlYmtpdC1zZWFyY2gtZGVjb3JhdGlvbixpbnB1dFt0eXBlPXNlYXJjaF06Oi13ZWJraXQtc2VhcmNoLXJlc3VsdHMtYnV0dG9uLGlucHV0W3R5cGU9c2VhcmNoXTo6LXdlYmtpdC1zZWFyY2gtcmVzdWx0cy1kZWNvcmF0aW9ue2Rpc3BsYXk6bm9uZX1pbnB1dFt0eXBlPXNlYXJjaF17LW1vei1hcHBlYXJhbmNlOm5vbmU7LXdlYmtpdC1hcHBlYXJhbmNlOm5vbmV9LmNlbnRlcntkaXNwbGF5OmJsb2NrO21hcmdpbi1sZWZ0OmF1dG87bWFyZ2luLXJpZ2h0OmF1dG99LmNsb3Nle3JpZ2h0OjEycHh9LmV4dGVuZGVkLXNlYXJjaC1ib3h7bWFyZ2luOjEycHh9LmFkdmFuY2VkLXNlYXJjaC1idXR0b257bWFyZ2luLWxlZnQ6MTBweH0uZnVsbC13aWR0aHt3aWR0aDoxMDAlfS5oaWRle2Rpc3BsYXk6bm9uZX0uaW5hY3RpdmUsLm11dGV7Y29sb3I6IzdhN2E3YX0uc2VhcmNoLXBhbmVse2JhY2tncm91bmQtY29sb3I6I2Y5ZjlmOTtib3JkZXItcmFkaXVzOjRweDtkaXNwbGF5OmlubGluZS1mbGV4O2hlaWdodDo0MHB4O3Bvc2l0aW9uOnJlbGF0aXZlO3dpZHRoOjY4MHB4O3otaW5kZXg6MTB9LnNlYXJjaC1wYW5lbDpob3Zlcntib3gtc2hhZG93OjAgMXB4IDNweCByZ2JhKDAsMCwwLC41KX0uc2VhcmNoLXBhbmVsIGRpdi5pbnB1dC1maWVsZHtmbGV4OjF9LnNlYXJjaC1wYW5lbCBkaXYuaW5wdXQtZmllbGQgaW5wdXR7Ym9yZGVyLXN0eWxlOm5vbmU7Zm9udC1zaXplOjE0cHQ7aGVpZ2h0OjM4cHg7cG9zaXRpb246YWJzb2x1dGU7d2lkdGg6Y2FsYygxMDAlIC0gODBweCl9LnNlYXJjaC1wYW5lbCBkaXYuaW5wdXQtZmllbGQgaW5wdXQ6YWN0aXZlLC5zZWFyY2gtcGFuZWwgZGl2LmlucHV0LWZpZWxkIGlucHV0OmZvY3Vze291dGxpbmU6MH0uc2VhcmNoLXBhbmVsIGRpdiAucHJlZml4LC5zZWFyY2gtcGFuZWwgZGl2IC5zdWZmaXh7YmFja2dyb3VuZC1jb2xvcjojZmZmO2JvcmRlci1yYWRpdXM6M3B4O2JvcmRlci1zdHlsZTpub25lO2NvbG9yOnJnYmEoNDEsNDEsNDEsLjQpO2N1cnNvcjpwb2ludGVyO2hlaWdodDozOHB4O291dGxpbmU6MDtwb3NpdGlvbjpyZWxhdGl2ZTt3aWR0aDo0MHB4fS5zZWFyY2gtcGFuZWwgZGl2IC5wcmVmaXg6YWN0aXZlLC5zZWFyY2gtcGFuZWwgZGl2IC5zdWZmaXg6YWN0aXZle2NvbG9yOiM1MTUxNTF9LnNlYXJjaC1wYW5lbC5hY3RpdmV7Ym94LXNoYWRvdzowIDFweCAzcHggcmdiYSgwLDAsMCwuNSl9LnNhbHNhaC1tZW51e2JveC1zaGFkb3c6MCAzcHggNXB4IC0xcHggcmdiYSgxMSwxMSwxMSwuMiksMCA2cHggMTBweCAwIHJnYmEoMTEsMTEsMTEsLjE0KSwwIDFweCAxOHB4IDAgcmdiYSgxMSwxMSwxMSwuMTIpO2JhY2tncm91bmQtY29sb3I6I2Y5ZjlmOTtib3JkZXItcmFkaXVzOjRweDtwb3NpdGlvbjphYnNvbHV0ZX0uc2Fsc2FoLW1lbnUgLnNhbHNhaC1tZW51LWhlYWRlcntiYWNrZ3JvdW5kLWNvbG9yOiNmOWY5Zjk7Ym9yZGVyLXRvcC1sZWZ0LXJhZGl1czo0cHg7Ym9yZGVyLXRvcC1yaWdodC1yYWRpdXM6NHB4O2Rpc3BsYXk6aW5saW5lLWJsb2NrO2hlaWdodDo0OHB4O3dpZHRoOjEwMCV9LnNhbHNhaC1tZW51IC5zYWxzYWgtbWVudS1oZWFkZXIgLnNhbHNhaC1tZW51LXRpdGxle2Zsb2F0OmxlZnQ7Zm9udC1zaXplOjE0cHg7Zm9udC13ZWlnaHQ6NDAwO21hcmdpbi10b3A6NHB4O3BhZGRpbmc6MTJweH0uc2Fsc2FoLW1lbnUgLnNhbHNhaC1tZW51LWhlYWRlciAuc2Fsc2FoLW1lbnUtYWN0aW9ue2Zsb2F0OnJpZ2h0O21hcmdpbjo0cHh9LnNhbHNhaC1tZW51LmV4dGVuZGVkLXNlYXJjaCwuc2Fsc2FoLW1lbnUuc2ltcGxlLXNlYXJjaHttaW4taGVpZ2h0OjY4MHB4O3dpZHRoOjY4MHB4fS5zYWxzYWgtbWVudS5zaW1wbGUtc2VhcmNoe3BhZGRpbmctdG9wOjYwcHg7ei1pbmRleDotMX0uc2Fsc2FoLW1lbnUuc2ltcGxlLXNlYXJjaCAuc2Fsc2FoLXByZXZpb3VzLXNlYXJjaC1saXN0IC5tYXQtbGlzdC1pdGVte2N1cnNvcjpwb2ludGVyfS5zYWxzYWgtbWVudS5zaW1wbGUtc2VhcmNoIC5zYWxzYWgtcHJldmlvdXMtc2VhcmNoLWxpc3QgLm1hdC1saXN0LWl0ZW06aG92ZXJ7YmFja2dyb3VuZC1jb2xvcjojZjlmOWY5fS5zYWxzYWgtbWVudS5zaW1wbGUtc2VhcmNoIC5zYWxzYWgtcHJldmlvdXMtc2VhcmNoLWxpc3QgLm1hdC1saXN0LWl0ZW06aG92ZXIgbWF0LWljb257ZGlzcGxheTpibG9ja30uc2Fsc2FoLW1lbnUuc2ltcGxlLXNlYXJjaCAuc2Fsc2FoLXByZXZpb3VzLXNlYXJjaC1saXN0IC5tYXQtbGlzdC1pdGVtIG1hdC1pY29ue2Rpc3BsYXk6bm9uZX0uc2Fsc2FoLW1lbnUuc2ltcGxlLXNlYXJjaCAucmlnaHR7bWFyZ2luLXRvcDoxMnB4O21hcmdpbi1sZWZ0OjE2cHh9LnNhbHNhaC1tZW51LmV4dGVuZGVkLXNlYXJjaHt6LWluZGV4OjIwfS5zZWFyY2gtYmFyLWVsZW1lbnRze2Rpc3BsYXk6ZmxleH0uc2hvd3tkaXNwbGF5OmJsb2NrfUBtZWRpYSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6MTAyNHB4KXsuc2VhcmNoLXBhbmVse3dpZHRoOjQ4MHB4fS5zZWFyY2gtcGFuZWwgZGl2LmlucHV0LWZpZWxkIGlucHV0e3dpZHRoOmNhbGMoNDgwcHggLSA4MHB4KX0uc2Fsc2FoLW1lbnUuZXh0ZW5kZWQtc2VhcmNoLC5zYWxzYWgtbWVudS5zaW1wbGUtc2VhcmNoe3dpZHRoOjQ4MHB4fX1AbWVkaWEgc2NyZWVuIGFuZCAobWF4LXdpZHRoOjc2OHB4KXsuc2VhcmNoLXBhbmVse3dpZHRoOmNhbGMoNDgwcHggLSAxNjBweCl9LnNlYXJjaC1wYW5lbCBkaXYuaW5wdXQtZmllbGQgaW5wdXR7d2lkdGg6Y2FsYyg0ODBweCAtIDE2MHB4IC0gODBweCl9LnNhbHNhaC1tZW51LmV4dGVuZGVkLXNlYXJjaCwuc2Fsc2FoLW1lbnUuc2ltcGxlLXNlYXJjaHt3aWR0aDpjYWxjKDQ4MHB4IC0gODBweCl9fWBdLFxuICAgIGFuaW1hdGlvbnM6IFtcbiAgICAgICAgdHJpZ2dlcignc2ltcGxlU2VhcmNoTWVudScsXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgc3RhdGUoJ2luYWN0aXZlJywgc3R5bGUoeyBkaXNwbGF5OiAnbm9uZScgfSkpLFxuICAgICAgICAgICAgICAgIHN0YXRlKCdhY3RpdmUnLCBzdHlsZSh7IGRpc3BsYXk6ICdibG9jaycgfSkpLFxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb24oJ2luYWN0aXZlID0+IHRydWUnLCBhbmltYXRlKCcxMDBtcyBlYXNlLWluJykpLFxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb24oJ3RydWUgPT4gaW5hY3RpdmUnLCBhbmltYXRlKCcxMDBtcyBlYXNlLW91dCcpKVxuICAgICAgICAgICAgXVxuICAgICAgICApLFxuICAgICAgICB0cmlnZ2VyKCdleHRlbmRlZFNlYXJjaE1lbnUnLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgIHN0YXRlKCdpbmFjdGl2ZScsIHN0eWxlKHsgZGlzcGxheTogJ25vbmUnIH0pKSxcbiAgICAgICAgICAgICAgICBzdGF0ZSgnYWN0aXZlJywgc3R5bGUoeyBkaXNwbGF5OiAnYmxvY2snIH0pKSxcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uKCdpbmFjdGl2ZSA9PiB0cnVlJywgYW5pbWF0ZSgnMTAwbXMgZWFzZS1pbicpKSxcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uKCd0cnVlID0+IGluYWN0aXZlJywgYW5pbWF0ZSgnMTAwbXMgZWFzZS1vdXQnKSlcbiAgICAgICAgICAgIF1cbiAgICAgICAgKSxcbiAgICBdXG59KVxuXG4vKipcbiAqIENvbnRhaW5zIG1ldGhvZHMgdG8gcmVhbGlzZSwgcmVzZXQgbmV3IG9yIHByZXZpb3VzIHNpbXBsZSBzZWFyY2hlcy5cbiAqL1xuZXhwb3J0IGNsYXNzIFNlYXJjaENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgICBASW5wdXQoKSByb3V0ZTogc3RyaW5nID0gJy9zZWFyY2gnO1xuXG4gICAgc2VhcmNoUXVlcnk6IHN0cmluZztcblxuICAgIHNlYXJjaFBhbmVsRm9jdXM6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIHByZXZTZWFyY2g6IHN0cmluZ1tdID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncHJldlNlYXJjaCcpKTtcblxuICAgIGZvY3VzT25TaW1wbGU6IHN0cmluZyA9ICdpbmFjdGl2ZSc7XG4gICAgZm9jdXNPbkV4dGVuZGVkOiBzdHJpbmcgPSAnaW5hY3RpdmUnO1xuXG4gICAgc2VhcmNoTGFiZWw6IHN0cmluZyA9ICdTZWFyY2gnO1xuXG4gICAgc2hvd1NpbXBsZVNlYXJjaDogYm9vbGVhbiA9IHRydWU7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9yb3V0ZTogQWN0aXZhdGVkUm91dGUsXG4gICAgICAgIHByaXZhdGUgX3JvdXRlcjogUm91dGVyLFxuICAgICAgICBwcml2YXRlIF9lbGVSZWY6IEVsZW1lbnRSZWYpIHtcblxuICAgIH1cblxuICAgIG5nT25Jbml0KCkge1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBpZ25vcmVcbiAgICAgKiBEbyBzZWFyY2ggb24gRW50ZXIgY2xpY2ssIHJlc2V0IHNlYXJjaCBvbiBFc2NhcGVcbiAgICAgKiBAcGFyYW0gc2VhcmNoX2VsZVxuICAgICAqIEBwYXJhbSBldmVudFxuICAgICAqIEByZXR1cm5zIHZvaWRcbiAgICAgKi9cbiAgICBvbktleShzZWFyY2hfZWxlOiBIVE1MRWxlbWVudCwgZXZlbnQpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5mb2N1c09uU2ltcGxlID0gJ2FjdGl2ZSc7XG4gICAgICAgIHRoaXMucHJldlNlYXJjaCA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3ByZXZTZWFyY2gnKSk7XG4gICAgICAgIGlmICh0aGlzLnNlYXJjaFF1ZXJ5ICYmIChldmVudC5rZXkgPT09ICdFbnRlcicgfHwgZXZlbnQua2V5Q29kZSA9PT0gMTMgfHwgZXZlbnQud2hpY2ggPT09IDEzKSkge1xuICAgICAgICAgICAgdGhpcy5kb1NlYXJjaChzZWFyY2hfZWxlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXZlbnQua2V5ID09PSAnRXNjYXBlJyB8fCBldmVudC5rZXlDb2RlID09PSAyNyB8fCBldmVudC53aGljaCA9PT0gMjcpIHtcbiAgICAgICAgICAgIHRoaXMucmVzZXRTZWFyY2goc2VhcmNoX2VsZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZWFsaXNlIGEgc2ltcGxlIHNlYXJjaFxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHNlYXJjaF9lbGVcbiAgICAgKiBAcmV0dXJucyB2b2lkXG4gICAgICovXG4gICAgZG9TZWFyY2goc2VhcmNoX2VsZTogSFRNTEVsZW1lbnQpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuc2VhcmNoUXVlcnkgIT09IHVuZGVmaW5lZCAmJiB0aGlzLnNlYXJjaFF1ZXJ5ICE9PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLnRvZ2dsZU1lbnUoJ3NpbXBsZVNlYXJjaCcpO1xuICAgICAgICAgICAgdGhpcy5fcm91dGVyLm5hdmlnYXRlKFt0aGlzLnJvdXRlICsgJy9mdWxsdGV4dC8nICsgdGhpcy5zZWFyY2hRdWVyeV0pO1xuXG4gICAgICAgICAgICAvLyB0aGlzLl9yb3V0ZXIubmF2aWdhdGUoWycvc2VhcmNoL2Z1bGx0ZXh0LycgKyB0aGlzLnNlYXJjaFF1ZXJ5XSwgeyByZWxhdGl2ZVRvOiB0aGlzLl9yb3V0ZSB9KTtcblxuICAgICAgICAgICAgLy8gcHVzaCB0aGUgc2VhcmNoIHF1ZXJ5IGludG8gdGhlIGxvY2FsIHN0b3JhZ2UgcHJldlNlYXJjaCBhcnJheSAocHJldmlvdXMgc2VhcmNoKVxuICAgICAgICAgICAgLy8gdG8gaGF2ZSBhIGxpc3Qgb2YgcmVjZW50IHNlYXJjaCByZXF1ZXN0c1xuICAgICAgICAgICAgbGV0IGV4aXN0aW5nUHJldlNlYXJjaDogc3RyaW5nW10gPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdwcmV2U2VhcmNoJykpO1xuICAgICAgICAgICAgaWYgKGV4aXN0aW5nUHJldlNlYXJjaCA9PT0gbnVsbCkgeyBleGlzdGluZ1ByZXZTZWFyY2ggPSBbXTsgfVxuICAgICAgICAgICAgbGV0IGk6IG51bWJlciA9IDA7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIGV4aXN0aW5nUHJldlNlYXJjaCkge1xuICAgICAgICAgICAgICAgIC8vIHJlbW92ZSBlbnRyeSwgaWYgZXhpc3RzIGFscmVhZHlcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zZWFyY2hRdWVyeSA9PT0gZW50cnkpIHsgZXhpc3RpbmdQcmV2U2VhcmNoLnNwbGljZShpLCAxKTsgfVxuICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZXhpc3RpbmdQcmV2U2VhcmNoLnB1c2godGhpcy5zZWFyY2hRdWVyeSk7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncHJldlNlYXJjaCcsIEpTT04uc3RyaW5naWZ5KGV4aXN0aW5nUHJldlNlYXJjaCkpO1xuICAgICAgICAgICAgLy8gVE9ETzogc2F2ZSB0aGUgcHJldmlvdXMgc2VhcmNoIHF1ZXJpZXMgc29tZXdoZXJlIGluIHRoZSB1c2VyJ3MgcHJvZmlsZVxuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZWFyY2hfZWxlLmZvY3VzKCk7XG4gICAgICAgICAgICB0aGlzLnByZXZTZWFyY2ggPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdwcmV2U2VhcmNoJykpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVzZXQgdGhlIHNlYXJjaFxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHNlYXJjaF9lbGVcbiAgICAgKiBAcmV0dXJucyB2b2lkXG4gICAgICovXG4gICAgcmVzZXRTZWFyY2goc2VhcmNoX2VsZTogSFRNTEVsZW1lbnQpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zZWFyY2hRdWVyeSA9IG51bGw7XG4gICAgICAgIHNlYXJjaF9lbGUuZm9jdXMoKTtcbiAgICAgICAgdGhpcy5mb2N1c09uU2ltcGxlID0gJ2luYWN0aXZlJztcbiAgICAgICAgdGhpcy5zZWFyY2hQYW5lbEZvY3VzID0gIXRoaXMuc2VhcmNoUGFuZWxGb2N1cztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZWFsaXNlIGEgcHJldmlvdXMgc2VhcmNoXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHF1ZXJ5XG4gICAgICogQHJldHVybnMgdm9pZFxuICAgICAqL1xuICAgIGRvUHJldlNlYXJjaChxdWVyeTogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc2VhcmNoUXVlcnkgPSBxdWVyeTtcbiAgICAgICAgdGhpcy5fcm91dGVyLm5hdmlnYXRlKFt0aGlzLnJvdXRlICsgJy9mdWxsdGV4dC8nICsgcXVlcnldLCB7IHJlbGF0aXZlVG86IHRoaXMuX3JvdXRlIH0pO1xuICAgICAgICB0aGlzLnRvZ2dsZU1lbnUoJ3NpbXBsZVNlYXJjaCcpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlc2V0IHByZXZpb3VzIHNlYXJjaGVzIC0gdGhlIHdob2xlIHByZXZpb3VzIHNlYXJjaCBvciBzcGVjaWZpYyBpdGVtIGJ5IG5hbWVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSB0ZXJtIG9mIHRoZSBzZWFyY2hcbiAgICAgKiBAcmV0dXJucyB2b2lkXG4gICAgICovXG4gICAgcmVzZXRQcmV2U2VhcmNoKG5hbWU6IHN0cmluZyA9IG51bGwpOiB2b2lkIHtcbiAgICAgICAgaWYgKG5hbWUpIHtcbiAgICAgICAgICAgIC8vIGRlbGV0ZSBvbmx5IHRoaXMgaXRlbSB3aXRoIHRoZSBuYW1lIC4uLlxuICAgICAgICAgICAgY29uc3QgaTogbnVtYmVyID0gdGhpcy5wcmV2U2VhcmNoLmluZGV4T2YobmFtZSk7XG4gICAgICAgICAgICB0aGlzLnByZXZTZWFyY2guc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3ByZXZTZWFyY2gnLCBKU09OLnN0cmluZ2lmeSh0aGlzLnByZXZTZWFyY2gpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGRlbGV0ZSB0aGUgd2hvbGUgXCJwcmV2aW91cyBzZWFyY2hcIiBhcnJheVxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ3ByZXZTZWFyY2gnKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnByZXZTZWFyY2ggPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdwcmV2U2VhcmNoJykpO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0IHNpbXBsZSBmb2N1cyB0byBhY3RpdmVcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHZvaWRcbiAgICAgKi9cbiAgICBzZXRGb2N1cygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5wcmV2U2VhcmNoID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncHJldlNlYXJjaCcpKTtcbiAgICAgICAgdGhpcy5mb2N1c09uU2ltcGxlID0gJ2FjdGl2ZSc7XG4gICAgICAgIHRoaXMuc2VhcmNoUGFuZWxGb2N1cyA9ICF0aGlzLnNlYXJjaFBhbmVsRm9jdXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3dpdGNoIGFjY29yZGluZyB0byB0aGUgZm9jdXMgYmV0d2VlbiBzaW1wbGUgb3IgZXh0ZW5kZWQgc2VhcmNoXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAyIGNhc2VzOiBzaW1wbGVTZWFyY2ggb3IgZXh0ZW5kZWRTZWFyY2hcbiAgICAgKiBAcmV0dXJucyB2b2lkXG4gICAgICovXG4gICAgdG9nZ2xlTWVudShuYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgc3dpdGNoIChuYW1lKSB7XG4gICAgICAgICAgICBjYXNlICdzaW1wbGVTZWFyY2gnOlxuICAgICAgICAgICAgICAgIHRoaXMucHJldlNlYXJjaCA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3ByZXZTZWFyY2gnKSk7XG4gICAgICAgICAgICAgICAgdGhpcy5mb2N1c09uU2ltcGxlID0gKHRoaXMuZm9jdXNPblNpbXBsZSA9PT0gJ2FjdGl2ZScgPyAnaW5hY3RpdmUnIDogJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2hvd1NpbXBsZVNlYXJjaCA9IHRydWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdleHRlbmRlZFNlYXJjaCc6XG4gICAgICAgICAgICAgICAgdGhpcy5mb2N1c09uRXh0ZW5kZWQgPSAodGhpcy5mb2N1c09uRXh0ZW5kZWQgPT09ICdhY3RpdmUnID8gJ2luYWN0aXZlJyA6ICdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dTaW1wbGVTZWFyY2ggPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCB7IENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbmplY3QsIElucHV0LCBPbkluaXQsIE91dHB1dCwgUXVlcnlMaXN0LCBWaWV3Q2hpbGQsIFZpZXdDaGlsZHJlbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWN0aXZhdGVkUm91dGUsIFJvdXRlciB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBGb3JtQnVpbGRlciwgRm9ybUdyb3VwIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtcbiAgICBHcmF2c2VhcmNoR2VuZXJhdGlvblNlcnZpY2UsXG4gICAgT250b2xvZ3lDYWNoZVNlcnZpY2UsXG4gICAgT250b2xvZ3lJbmZvcm1hdGlvbixcbiAgICBPbnRvbG9neU1ldGFkYXRhLFxuICAgIFByb3BlcnRpZXMsXG4gICAgUHJvcGVydHlXaXRoVmFsdWUsXG4gICAgUmVhZFJlc291cmNlc1NlcXVlbmNlLFxuICAgIFJlc291cmNlQ2xhc3Ncbn0gZnJvbSAnQGtub3JhL2NvcmUnO1xuaW1wb3J0IHsgU2VsZWN0UHJvcGVydHlDb21wb25lbnQgfSBmcm9tICcuL3NlbGVjdC1wcm9wZXJ0eS9zZWxlY3QtcHJvcGVydHkuY29tcG9uZW50JztcbmltcG9ydCB7IFNlbGVjdFJlc291cmNlQ2xhc3NDb21wb25lbnQgfSBmcm9tICcuL3NlbGVjdC1yZXNvdXJjZS1jbGFzcy9zZWxlY3QtcmVzb3VyY2UtY2xhc3MuY29tcG9uZW50JztcblxuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ2t1aS1leHRlbmRlZC1zZWFyY2gnLFxuICAgIHRlbXBsYXRlOiBgPGZvcm0gW2Zvcm1Hcm91cF09XCJmb3JtXCIgKG5nU3VibWl0KT1cInN1Ym1pdCgpXCI+XG5cbiAgPGRpdj5cbiAgICA8a3VpLXNlbGVjdC1vbnRvbG9neSAqbmdJZj1cIm9udG9sb2dpZXMubGVuZ3RoID4gMFwiIFtmb3JtR3JvdXBdPVwiZm9ybVwiIFtvbnRvbG9naWVzXT1cIm9udG9sb2dpZXNcIiAob250b2xvZ3lTZWxlY3RlZCk9XCJnZXRSZXNvdXJjZUNsYXNzZXNBbmRQcm9wZXJ0aWVzRm9yT250b2xvZ3koJGV2ZW50KVwiPjwva3VpLXNlbGVjdC1vbnRvbG9neT5cbiAgPC9kaXY+XG5cbiAgPGRpdiBjbGFzcz1cInNlbGVjdC1yZXNvdXJjZS1jbGFzc1wiICpuZ0lmPVwicmVzb3VyY2VDbGFzc2VzPy5sZW5ndGggPiAwXCI+XG4gICAgPGt1aS1zZWxlY3QtcmVzb3VyY2UtY2xhc3MgI3Jlc291cmNlQ2xhc3MgW2Zvcm1Hcm91cF09XCJmb3JtXCIgW3Jlc291cmNlQ2xhc3Nlc109XCJyZXNvdXJjZUNsYXNzZXNcIiAocmVzb3VyY2VDbGFzc1NlbGVjdGVkRXZlbnQpPVwiZ2V0UHJvcGVydGllc0ZvclJlc291cmNlQ2xhc3MoJGV2ZW50KVwiPjwva3VpLXNlbGVjdC1yZXNvdXJjZS1jbGFzcz5cbiAgPC9kaXY+XG5cbiAgPGRpdiBjbGFzcz1cInNlbGVjdC1wcm9wZXJ0eVwiICpuZ0lmPVwicHJvcGVydGllcyAhPT0gdW5kZWZpbmVkXCI+XG4gICAgPGRpdiAqbmdGb3I9XCJsZXQgcHJvcCBvZiBhY3RpdmVQcm9wZXJ0aWVzOyBsZXQgaSA9IGluZGV4XCI+XG5cbiAgICAgIDxrdWktc2VsZWN0LXByb3BlcnR5ICNwcm9wZXJ0eSBbYWN0aXZlUmVzb3VyY2VDbGFzc109XCJhY3RpdmVSZXNvdXJjZUNsYXNzXCIgW2Zvcm1Hcm91cF09XCJmb3JtXCIgW2luZGV4XT1cImlcIiBbcHJvcGVydGllc109XCJwcm9wZXJ0aWVzXCI+PC9rdWktc2VsZWN0LXByb3BlcnR5PlxuXG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuXG5cbiAgPGRpdj5cbiAgICA8YnV0dG9uIG1hdC1taW5pLWZhYiBjbGFzcz1cInByb3BlcnR5LWJ1dHRvbnMgYWRkLXByb3BlcnR5LWJ1dHRvblwiIGNvbG9yPVwicHJpbWFyeVwiIHR5cGU9XCJidXR0b25cIiAoY2xpY2spPVwiYWRkUHJvcGVydHkoKVwiIFtkaXNhYmxlZF09XCJhY3RpdmVPbnRvbG9neSA9PT0gdW5kZWZpbmVkIHx8IGFjdGl2ZVByb3BlcnRpZXMubGVuZ3RoID49IDRcIj5cbiAgICAgIDxtYXQtaWNvbiBhcmlhLWxhYmVsPVwiYWRkIGEgcHJvcGVydHlcIj5hZGQ8L21hdC1pY29uPlxuICAgIDwvYnV0dG9uPlxuXG4gICAgPGJ1dHRvbiBtYXQtbWluaS1mYWIgY2xhc3M9XCJwcm9wZXJ0eS1idXR0b25zIHJlbW92ZS1wcm9wZXJ0eS1idXR0b25cIiBjb2xvcj1cInByaW1hcnlcIiB0eXBlPVwiYnV0dG9uXCIgKGNsaWNrKT1cInJlbW92ZVByb3BlcnR5KClcIiBbZGlzYWJsZWRdPVwiYWN0aXZlUHJvcGVydGllcy5sZW5ndGggPT0gMFwiPlxuICAgICAgPG1hdC1pY29uIGFyaWEtbGFiZWw9XCJyZW1vdmUgcHJvcGVydHlcIj5yZW1vdmU8L21hdC1pY29uPlxuICAgIDwvYnV0dG9uPlxuICA8L2Rpdj5cblxuICA8IS0tICA8ZGl2PlxuICAgIDxidXR0b24gbWF0LWljb24tYnV0dG9uIHR5cGU9XCJidXR0b25cIiAoY2xpY2spPVwicmVzZXRGb3JtKClcIiBbZGlzYWJsZWRdPVwidGhpcy5hY3RpdmVPbnRvbG9neSA9PT0gdW5kZWZpbmVkXCI+XG4gICAgICA8bWF0LWljb24gYXJpYS1sYWJlbD1cInJlc2V0IHF1ZXJ5IGZvcm1cIj5jbGVhcjwvbWF0LWljb24+XG4gICAgPC9idXR0b24+XG5cbiAgICA8YnV0dG9uIG1hdC1pY29uLWJ1dHRvbiB0eXBlPVwic3VibWl0XCIgW2Rpc2FibGVkXT1cIiFmb3JtVmFsaWRcIj5cbiAgICAgIDxtYXQtaWNvbiBhcmlhLWxhYmVsPVwic3VibWl0IHF1ZXJ5XCI+c2VuZDwvbWF0LWljb24+XG4gICAgPC9idXR0b24+XG4gIDwvZGl2PiAtLT5cblxuICA8YnV0dG9uIGNsYXNzPVwiZXh0ZW5kZWQtYnV0dG9ucyBleHRlbmRlZC1zZWFyY2gtYnV0dG9uXCIgbWF0LXN0cm9rZWQtYnV0dG9uIGNvbG9yPVwicHJpbWFyeVwiIHR5cGU9XCJzdWJtaXRcIiBbZGlzYWJsZWRdPVwiIWZvcm1WYWxpZFwiPlxuICAgIFNlYXJjaFxuICA8L2J1dHRvbj5cbiAgPGJ1dHRvbiBjbGFzcz1cImV4dGVuZGVkLWJ1dHRvbnMgcmVzZXRcIiBtYXQtc3Ryb2tlZC1idXR0b24gdHlwZT1cImJ1dHRvblwiIChjbGljayk9XCJyZXNldEZvcm0oKVwiIFtkaXNhYmxlZF09XCJ0aGlzLmFjdGl2ZU9udG9sb2d5ID09PSB1bmRlZmluZWRcIj5cbiAgICBSZXNldFxuICA8L2J1dHRvbj5cblxuXG48L2Zvcm0+XG5gLFxuICAgIHN0eWxlczogW2AuYWRkLXByb3BlcnR5LWJ1dHRvbnttYXJnaW4tcmlnaHQ6NXB4fS5leHRlbmRlZC1idXR0b25ze21hcmdpbi10b3A6MjVweH0uZXh0ZW5kZWQtc2VhcmNoLWJ1dHRvbnttYXJnaW4tcmlnaHQ6NXB4fS5wcm9wZXJ0eS1idXR0b25ze21hcmdpbi10b3A6MjVweH0uc2VsZWN0LXByb3BlcnR5e21hcmdpbi1sZWZ0OjIycHh9LnNlbGVjdC1yZXNvdXJjZS1jbGFzc3ttYXJnaW4tbGVmdDoxMnB4fWBdXG59KVxuZXhwb3J0IGNsYXNzIEV4dGVuZGVkU2VhcmNoQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSByb3V0ZSAtIFJvdXRlIGFmdGVyIHNlYXJjaFxuICAgICAqL1xuICAgIEBJbnB1dCgpIHJvdXRlO1xuXG4gICAgLy8gdHJpZ2dlciB0b2dnbGUgZm9yIGV4dGVuZGVkIHNlYXJjaCBmb3JtXG4gICAgQE91dHB1dCgpIHRvZ2dsZUV4dGVuZGVkU2VhcmNoRm9ybSA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oKTtcblxuICAgIC8vIGFsbCBhdmFpbGFibGUgb250b2xvZ2llc1xuICAgIG9udG9sb2dpZXM6IEFycmF5PE9udG9sb2d5TWV0YWRhdGE+ID0gW107XG5cbiAgICAvLyBvbnRvbG9neSBjaG9zZW4gYnkgdGhlIHVzZXJcbiAgICBhY3RpdmVPbnRvbG9neTogc3RyaW5nO1xuXG4gICAgLy8gcHJvcGVydGllcyBzcGVjaWZpZWQgYnkgdGhlIHVzZXJcbiAgICBhY3RpdmVQcm9wZXJ0aWVzOiBib29sZWFuW10gPSBbXTtcblxuICAgIC8vIHJlc291cmNlIGNsYXNzZXMgZm9yIHRoZSBzZWxlY3RlZCBvbnRvbG9neVxuICAgIHJlc291cmNlQ2xhc3NlczogQXJyYXk8UmVzb3VyY2VDbGFzcz4gPSBbXTtcblxuICAgIC8vIGRlZmluaXRpb24gb2YgdGhlIHNlbGVjdGVkIHJlc291cmNlIGNsYXNzLCBpZiBzZXQuXG4gICAgYWN0aXZlUmVzb3VyY2VDbGFzczogUmVzb3VyY2VDbGFzcztcblxuICAgIC8vIHByb3BlcnRpZXMgZm9yIHRoZSBzZWxlY3RlZCBvbnRvbG9neSBvciBzZWxlY3RlZCByZXNvdXJjZSBjbGFzc1xuICAgIHByb3BlcnRpZXM6IFByb3BlcnRpZXM7XG5cbiAgICByZXN1bHQ6IFJlYWRSZXNvdXJjZXNTZXF1ZW5jZSA9IG5ldyBSZWFkUmVzb3VyY2VzU2VxdWVuY2UoW10sIDApO1xuXG4gICAgLy8gcmVmZXJlbmNlIHRvIHRoZSBjb21wb25lbnQgdGhhdCBjb250cm9scyB0aGUgcmVzb3VyY2UgY2xhc3Mgc2VsZWN0aW9uXG4gICAgQFZpZXdDaGlsZCgncmVzb3VyY2VDbGFzcycpIHJlc291cmNlQ2xhc3NDb21wb25lbnQ6IFNlbGVjdFJlc291cmNlQ2xhc3NDb21wb25lbnQ7XG5cbiAgICAvLyByZWZlcmVuY2UgdG8gdGhlIGNvbXBvbmVudCBjb250cm9sbGluZyB0aGUgcHJvcGVydHkgc2VsZWN0aW9uXG4gICAgQFZpZXdDaGlsZHJlbigncHJvcGVydHknKSBwcm9wZXJ0eUNvbXBvbmVudHM6IFF1ZXJ5TGlzdDxTZWxlY3RQcm9wZXJ0eUNvbXBvbmVudD47XG5cbiAgICAvLyBGb3JtR3JvdXAgKHVzZWQgYXMgcGFyZW50IGZvciBjaGlsZCBjb21wb25lbnRzKVxuICAgIGZvcm06IEZvcm1Hcm91cDtcblxuICAgIC8vIGZvcm0gdmFsaWRhdGlvbiBzdGF0dXNcbiAgICBmb3JtVmFsaWQgPSBmYWxzZTtcblxuICAgIGNvbnN0cnVjdG9yKEBJbmplY3QoRm9ybUJ1aWxkZXIpIHByaXZhdGUgZmI6IEZvcm1CdWlsZGVyLFxuICAgICAgICBwcml2YXRlIF9yb3V0ZTogQWN0aXZhdGVkUm91dGUsXG4gICAgICAgIHByaXZhdGUgX3JvdXRlcjogUm91dGVyLFxuICAgICAgICBwcml2YXRlIF9jYWNoZVNlcnZpY2U6IE9udG9sb2d5Q2FjaGVTZXJ2aWNlLFxuICAgICAgICBwcml2YXRlIF9ncmF2U2VhcmNoU2VydmljZTogR3JhdnNlYXJjaEdlbmVyYXRpb25TZXJ2aWNlKSB7XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKSB7XG5cbiAgICAgICAgLy8gcGFyZW50IGZvcm0gaXMgZW1wdHksIGl0IGdldHMgcGFzc2VkIHRvIHRoZSBjaGlsZCBjb21wb25lbnRzXG4gICAgICAgIHRoaXMuZm9ybSA9IHRoaXMuZmIuZ3JvdXAoe30pO1xuXG4gICAgICAgIC8vIGlmIGZvcm0gc3RhdHVzIGNoYW5nZXMsIHJlLXJ1biB2YWxpZGF0aW9uXG4gICAgICAgIHRoaXMuZm9ybS5zdGF0dXNDaGFuZ2VzLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5mb3JtVmFsaWQgPSB0aGlzLnZhbGlkYXRlRm9ybSgpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2codGhpcy5mb3JtKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gaW5pdGlhbGl6ZSBvbnRvbG9naWVzIHRvIGJlIHVzZWQgZm9yIHRoZSBvbnRvbG9naWVzIHNlbGVjdGlvbiBpbiB0aGUgc2VhcmNoIGZvcm1cbiAgICAgICAgdGhpcy5pbml0aWFsaXplT250b2xvZ2llcygpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZCBhIHByb3BlcnR5IHRvIHRoZSBzZWFyY2ggZm9ybS5cbiAgICAgKiBAcmV0dXJucyB2b2lkXG4gICAgICovXG4gICAgYWRkUHJvcGVydHkoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuYWN0aXZlUHJvcGVydGllcy5wdXNoKHRydWUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbW92ZSB0aGUgbGFzdCBwcm9wZXJ0eSBmcm9tIHRoZSBzZWFyY2ggZm9ybS5cbiAgICAgKiBAcmV0dXJucyB2b2lkXG4gICAgICovXG4gICAgcmVtb3ZlUHJvcGVydHkoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuYWN0aXZlUHJvcGVydGllcy5zcGxpY2UoLTEsIDEpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgYWxsIGF2YWlsYWJsZSBvbnRvbG9naWVzIGZvciB0aGUgc2VhcmNoIGZvcm0uXG4gICAgICogQHJldHVybnMgdm9pZFxuICAgICAqL1xuICAgIGluaXRpYWxpemVPbnRvbG9naWVzKCk6IHZvaWQge1xuICAgICAgICB0aGlzLl9jYWNoZVNlcnZpY2UuZ2V0T250b2xvZ2llc01ldGFkYXRhKCkuc3Vic2NyaWJlKFxuICAgICAgICAgICAgKG9udG9sb2dpZXM6IEFycmF5PE9udG9sb2d5TWV0YWRhdGE+KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5vbnRvbG9naWVzID0gb250b2xvZ2llcztcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE9uY2UgYW4gb250b2xvZ3kgaGFzIGJlZW4gc2VsZWN0ZWQsIGdldHMgaXRzIGNsYXNzZXMgYW5kIHByb3BlcnRpZXMuXG4gICAgICogVGhlIGNsYXNzZXMgYW5kIHByb3BlcnRpZXMgd2lsbCBiZSBtYWRlIGF2YWlsYWJsZSB0byB0aGUgdXNlciBmb3Igc2VsZWN0aW9uLlxuICAgICAqXG4gICAgICogQHBhcmFtIG9udG9sb2d5SXJpIElyaSBvZiB0aGUgb250b2xvZ3kgY2hvc2VuIGJ5IHRoZSB1c2VyLlxuICAgICAqIEByZXR1cm5zIHZvaWRcbiAgICAgKi9cbiAgICBnZXRSZXNvdXJjZUNsYXNzZXNBbmRQcm9wZXJ0aWVzRm9yT250b2xvZ3kob250b2xvZ3lJcmk6IHN0cmluZyk6IHZvaWQge1xuXG4gICAgICAgIC8vIHJlc2V0IGFjdGl2ZSByZXNvdXJjZSBjbGFzcyBkZWZpbml0aW9uXG4gICAgICAgIHRoaXMuYWN0aXZlUmVzb3VyY2VDbGFzcyA9IHVuZGVmaW5lZDtcblxuICAgICAgICAvLyByZXNldCBzcGVjaWZpZWQgcHJvcGVydGllc1xuICAgICAgICB0aGlzLmFjdGl2ZVByb3BlcnRpZXMgPSBbXTtcblxuICAgICAgICB0aGlzLmFjdGl2ZU9udG9sb2d5ID0gb250b2xvZ3lJcmk7XG5cbiAgICAgICAgdGhpcy5fY2FjaGVTZXJ2aWNlLmdldEVudGl0eURlZmluaXRpb25zRm9yT250b2xvZ2llcyhbb250b2xvZ3lJcmldKS5zdWJzY3JpYmUoXG4gICAgICAgICAgICAob250b0luZm86IE9udG9sb2d5SW5mb3JtYXRpb24pID0+IHtcblxuICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VDbGFzc2VzID0gb250b0luZm8uZ2V0UmVzb3VyY2VDbGFzc2VzQXNBcnJheSgpO1xuICAgICAgICAgICAgICAgIHRoaXMucHJvcGVydGllcyA9IG9udG9JbmZvLmdldFByb3BlcnRpZXMoKTtcblxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogT25jZSBhIHJlc291cmNlIGNsYXNzIGhhcyBiZWVuIHNlbGVjdGVkLCBnZXRzIGl0cyBwcm9wZXJ0aWVzLlxuICAgICAqIFRoZSBwcm9wZXJ0aWVzIHdpbGwgYmUgbWFkZSBhdmFpbGFibGUgdG8gdGhlIHVzZXIgZm9yIHNlbGVjdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSByZXNvdXJjZUNsYXNzSXJpXG4gICAgICogQHJldHVybnMgdm9pZFxuICAgICAqL1xuICAgIGdldFByb3BlcnRpZXNGb3JSZXNvdXJjZUNsYXNzKHJlc291cmNlQ2xhc3NJcmk6IHN0cmluZyk6IHZvaWQge1xuXG4gICAgICAgIC8vIHJlc2V0IHNwZWNpZmllZCBwcm9wZXJ0aWVzXG4gICAgICAgIHRoaXMuYWN0aXZlUHJvcGVydGllcyA9IFtdO1xuXG4gICAgICAgIC8vIGlmIHRoZSBjbGllbnQgdW5kb2VzIHRoZSBzZWxlY3Rpb24gb2YgYSByZXNvdXJjZSBjbGFzcywgdXNlIHRoZSBhY3RpdmUgb250b2xvZ3kgYXMgYSBmYWxsYmFja1xuICAgICAgICBpZiAocmVzb3VyY2VDbGFzc0lyaSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5nZXRSZXNvdXJjZUNsYXNzZXNBbmRQcm9wZXJ0aWVzRm9yT250b2xvZ3kodGhpcy5hY3RpdmVPbnRvbG9neSk7XG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIHRoaXMuX2NhY2hlU2VydmljZS5nZXRSZXNvdXJjZUNsYXNzRGVmaW5pdGlvbnMoW3Jlc291cmNlQ2xhc3NJcmldKS5zdWJzY3JpYmUoXG4gICAgICAgICAgICAgICAgKG9udG9JbmZvOiBPbnRvbG9neUluZm9ybWF0aW9uKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvcGVydGllcyA9IG9udG9JbmZvLmdldFByb3BlcnRpZXMoKTtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFjdGl2ZVJlc291cmNlQ2xhc3MgPSBvbnRvSW5mby5nZXRSZXNvdXJjZUNsYXNzZXMoKVtyZXNvdXJjZUNsYXNzSXJpXTtcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVmFsaWRhdGVzIGZvcm0gYW5kIHJldHVybnMgaXRzIHN0YXR1cyAoYm9vbGVhbikuXG4gICAgICovXG4gICAgcHJpdmF0ZSB2YWxpZGF0ZUZvcm0oKSB7XG5cbiAgICAgICAgLy8gY2hlY2sgdGhhdCBlaXRoZXIgYSByZXNvdXJjZSBjbGFzcyBpcyBzZWxlY3RlZCBvciBhdCBsZWFzdCBvbmUgcHJvcGVydHkgaXMgc3BlY2lmaWVkXG4gICAgICAgIHJldHVybiB0aGlzLmZvcm0udmFsaWQgJiZcbiAgICAgICAgICAgICh0aGlzLnByb3BlcnR5Q29tcG9uZW50cy5sZW5ndGggPiAwIHx8ICh0aGlzLnJlc291cmNlQ2xhc3NDb21wb25lbnQgIT09IHVuZGVmaW5lZCAmJiB0aGlzLnJlc291cmNlQ2xhc3NDb21wb25lbnQuZ2V0UmVzb3VyY2VDbGFzc1NlbGVjdGVkKCkgIT09IGZhbHNlKSk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXNldHMgdGhlIGZvcm0gKHNlbGVjdGVkIHJlc291cmNlIGNsYXNzIGFuZCBzcGVjaWZpZWQgcHJvcGVydGllcykgcHJlc2VydmluZyB0aGUgYWN0aXZlIG9udG9sb2d5LlxuICAgICAqL1xuICAgIHJlc2V0Rm9ybSgpIHtcbiAgICAgICAgaWYgKHRoaXMuYWN0aXZlT250b2xvZ3kgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5nZXRSZXNvdXJjZUNsYXNzZXNBbmRQcm9wZXJ0aWVzRm9yT250b2xvZ3kodGhpcy5hY3RpdmVPbnRvbG9neSk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBHcmF2U2VhcmNoIHF1ZXJ5IHdpdGggdGhlIGdpdmVuIGZvcm0gdmFsdWVzIGFuZCBjYWxscyB0aGUgZXh0ZW5kZWQgc2VhcmNoIHJvdXRlLlxuICAgICAqL1xuICAgIHN1Ym1pdCgpIHtcblxuICAgICAgICBpZiAoIXRoaXMuZm9ybVZhbGlkKSByZXR1cm47IC8vIGNoZWNrIHRoYXQgZnJvbSBpcyB2YWxpZFxuXG4gICAgICAgIGNvbnN0IHJlc0NsYXNzT3B0aW9uID0gdGhpcy5yZXNvdXJjZUNsYXNzQ29tcG9uZW50LmdldFJlc291cmNlQ2xhc3NTZWxlY3RlZCgpO1xuXG4gICAgICAgIGxldCByZXNDbGFzcztcblxuICAgICAgICBpZiAocmVzQ2xhc3NPcHRpb24gIT09IGZhbHNlKSB7XG4gICAgICAgICAgICByZXNDbGFzcyA9IHJlc0NsYXNzT3B0aW9uO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcHJvcGVydGllczogUHJvcGVydHlXaXRoVmFsdWVbXSA9IHRoaXMucHJvcGVydHlDb21wb25lbnRzLm1hcChcbiAgICAgICAgICAgIChwcm9wQ29tcCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBwcm9wQ29tcC5nZXRQcm9wZXJ0eVNlbGVjdGVkV2l0aFZhbHVlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG5cbiAgICAgICAgY29uc3QgZ3JhdnNlYXJjaCA9IHRoaXMuX2dyYXZTZWFyY2hTZXJ2aWNlLmNyZWF0ZUdyYXZzZWFyY2hRdWVyeShwcm9wZXJ0aWVzLCByZXNDbGFzcywgMCk7XG5cbiAgICAgICAgdGhpcy5fcm91dGVyLm5hdmlnYXRlKFt0aGlzLnJvdXRlICsgJy9leHRlbmRlZC8nLCBncmF2c2VhcmNoXSwgeyByZWxhdGl2ZVRvOiB0aGlzLl9yb3V0ZSB9KTtcblxuICAgICAgICAvLyB0b2dnbGUgZXh0ZW5kZWQgc2VhcmNoIGZvcm1cbiAgICAgICAgdGhpcy50b2dnbGVFeHRlbmRlZFNlYXJjaEZvcm0uZW1pdCh0cnVlKTtcblxuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIEluamVjdCwgSW5wdXQsIE9uSW5pdCwgT3V0cHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPbnRvbG9neU1ldGFkYXRhIH0gZnJvbSAnQGtub3JhL2NvcmUnO1xuaW1wb3J0IHsgRm9ybUJ1aWxkZXIsIEZvcm1Hcm91cCwgVmFsaWRhdG9ycyB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAna3VpLXNlbGVjdC1vbnRvbG9neScsXG4gIHRlbXBsYXRlOiBgPG1hdC1mb3JtLWZpZWxkICpuZ0lmPVwib250b2xvZ2llcy5sZW5ndGggPiAwXCI+XG4gIDxtYXQtc2VsZWN0IHBsYWNlaG9sZGVyPVwiT250b2xvZ3lcIiBbZm9ybUNvbnRyb2xdPVwiZm9ybS5jb250cm9sc1snb250b2xvZ3knXVwiPlxuICAgICAgPG1hdC1vcHRpb24gKm5nRm9yPVwibGV0IG9udG8gb2Ygb250b2xvZ2llc1wiIFt2YWx1ZV09XCJvbnRvLmlkXCI+e3sgb250by5sYWJlbCB9fTwvbWF0LW9wdGlvbj5cbiAgPC9tYXQtc2VsZWN0PlxuPC9tYXQtZm9ybS1maWVsZD5cbmAsXG4gIHN0eWxlczogW2BgXVxufSlcbmV4cG9ydCBjbGFzcyBTZWxlY3RPbnRvbG9neUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgQElucHV0KCkgZm9ybUdyb3VwOiBGb3JtR3JvdXA7XG5cbiAgQElucHV0KCkgb250b2xvZ2llczogQXJyYXk8T250b2xvZ3lNZXRhZGF0YT47XG5cbiAgQE91dHB1dCgpIG9udG9sb2d5U2VsZWN0ZWQgPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oKTtcblxuICBmb3JtOiBGb3JtR3JvdXA7XG5cbiAgY29uc3RydWN0b3IoQEluamVjdChGb3JtQnVpbGRlcikgcHJpdmF0ZSBmYjogRm9ybUJ1aWxkZXIpIHsgfVxuXG4gIG5nT25Jbml0KCkge1xuXG4gICAgLy8gYnVpbGQgYSBmb3JtIGZvciB0aGUgbmFtZWQgZ3JhcGggc2VsZWN0aW9uXG4gICAgdGhpcy5mb3JtID0gdGhpcy5mYi5ncm91cCh7XG4gICAgICBvbnRvbG9neTogW251bGwsIFZhbGlkYXRvcnMucmVxdWlyZWRdXG4gICAgfSk7XG5cbiAgICAvLyBlbWl0IElyaSBvZiB0aGUgb250b2xvZ3kgd2hlbiBiZWluZyBzZWxlY3RlZFxuICAgIHRoaXMuZm9ybS52YWx1ZUNoYW5nZXMuc3Vic2NyaWJlKChkYXRhKSA9PiB7XG4gICAgICB0aGlzLm9udG9sb2d5U2VsZWN0ZWQuZW1pdChkYXRhLm9udG9sb2d5KTtcbiAgICB9KTtcblxuICAgIC8vIGFkZCBmb3JtIHRvIHRoZSBwYXJlbnQgZm9ybSBncm91cFxuICAgIHRoaXMuZm9ybUdyb3VwLmFkZENvbnRyb2woJ29udG9sb2d5JywgdGhpcy5mb3JtKTtcblxuICB9XG5cbn1cbiIsImltcG9ydCB7IENvbXBvbmVudCwgSW5qZWN0LCBJbnB1dCwgT25EZXN0cm95LCBPbkluaXQsIFZpZXdDaGlsZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgICBDYXJkaW5hbGl0eSxcbiAgICBDYXJkaW5hbGl0eU9jY3VycmVuY2UsXG4gICAgQ29tcGFyaXNvbk9wZXJhdG9yQW5kVmFsdWUsXG4gICAgUHJvcGVydGllcyxcbiAgICBQcm9wZXJ0eSxcbiAgICBQcm9wZXJ0eVdpdGhWYWx1ZSxcbiAgICBSZXNvdXJjZUNsYXNzXG59IGZyb20gJ0Brbm9yYS9jb3JlJztcbmltcG9ydCB7IEZvcm1CdWlsZGVyLCBGb3JtR3JvdXAsIFZhbGlkYXRvcnMgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBTcGVjaWZ5UHJvcGVydHlWYWx1ZUNvbXBvbmVudCB9IGZyb20gJy4vc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZS9zcGVjaWZ5LXByb3BlcnR5LXZhbHVlLmNvbXBvbmVudCc7XG5cblxuLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNDU2NjEwMTAvZHluYW1pYy1uZXN0ZWQtcmVhY3RpdmUtZm9ybS1leHByZXNzaW9uY2hhbmdlZGFmdGVyaXRoYXNiZWVuY2hlY2tlZGVycm9yXG5jb25zdCByZXNvbHZlZFByb21pc2UgPSBQcm9taXNlLnJlc29sdmUobnVsbCk7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAna3VpLXNlbGVjdC1wcm9wZXJ0eScsXG4gICAgdGVtcGxhdGU6IGA8bWF0LWZvcm0tZmllbGQgY2xhc3M9XCJzZWFyY2gtcHJvcGVydHktZmllbGRcIiAqbmdJZj1cInByb3BlcnRpZXNBc0FycmF5Py5sZW5ndGggPiAwXCI+XG4gIDxtYXQtc2VsZWN0IHBsYWNlaG9sZGVyPVwiUHJvcGVydGllc1wiIFtmb3JtQ29udHJvbF09XCJmb3JtLmNvbnRyb2xzWydwcm9wZXJ0eSddXCI+XG4gICAgPG1hdC1vcHRpb24gKm5nRm9yPVwibGV0IHByb3Agb2YgcHJvcGVydGllc0FzQXJyYXlcIiBbdmFsdWVdPVwicHJvcC5pZFwiPnt7IHByb3AubGFiZWwgfX08L21hdC1vcHRpb24+XG4gIDwvbWF0LXNlbGVjdD5cbjwvbWF0LWZvcm0tZmllbGQ+XG5cbjxrdWktc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZSAjc3BlY2lmeVByb3BlcnR5VmFsdWUgW2Zvcm1Hcm91cF09XCJmb3JtXCIgKm5nSWY9XCJwcm9wZXJ0eVNlbGVjdGVkICE9PSB1bmRlZmluZWRcIiBbcHJvcGVydHldPVwicHJvcGVydHlTZWxlY3RlZFwiPjwva3VpLXNwZWNpZnktcHJvcGVydHktdmFsdWU+XG5cbjxtYXQtY2hlY2tib3ggbWF0VG9vbHRpcD1cIlNvcnQgY3JpdGVyaW9uXCIgKm5nSWY9XCJwcm9wZXJ0eVNlbGVjdGVkICE9PSB1bmRlZmluZWQgJiYgc29ydENyaXRlcmlvbigpXCIgW2Zvcm1Db250cm9sXT1cImZvcm0uY29udHJvbHNbJ2lzU29ydENyaXRlcmlvbiddXCI+PC9tYXQtY2hlY2tib3g+YCxcbiAgICBzdHlsZXM6IFtgLnNlYXJjaC1wcm9wZXJ0eS1maWVsZHttYXJnaW4tcmlnaHQ6OHB4fWBdXG59KVxuZXhwb3J0IGNsYXNzIFNlbGVjdFByb3BlcnR5Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuXG4gICAgLy8gcGFyZW50IEZvcm1Hcm91cFxuICAgIEBJbnB1dCgpIGZvcm1Hcm91cDogRm9ybUdyb3VwO1xuXG4gICAgLy8gaW5kZXggb2YgdGhlIGdpdmVuIHByb3BlcnR5ICh1bmlxdWUpXG4gICAgQElucHV0KCkgaW5kZXg6IG51bWJlcjtcblxuICAgIC8vIHNldHRlciBtZXRob2QgZm9yIHByb3BlcnRpZXMgd2hlbiBiZWluZyB1cGRhdGVkIGJ5IHBhcmVudCBjb21wb25lbnRcbiAgICBASW5wdXQoKVxuICAgIHNldCBwcm9wZXJ0aWVzKHZhbHVlOiBQcm9wZXJ0aWVzKSB7XG4gICAgICAgIHRoaXMucHJvcGVydHlTZWxlY3RlZCA9IHVuZGVmaW5lZDsgLy8gcmVzZXQgc2VsZWN0ZWQgcHJvcGVydHkgKG92ZXJ3cml0aW5nIGFueSBwcmV2aW91cyBzZWxlY3Rpb24pXG4gICAgICAgIHRoaXMuX3Byb3BlcnRpZXMgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy51cGRhdGVQcm9wZXJ0aWVzQXJyYXkoKTtcbiAgICB9XG5cbiAgICBnZXQgcHJvcGVydGllcygpIHtcbiAgICAgICByZXR1cm4gdGhpcy5fcHJvcGVydGllcztcbiAgICB9XG5cbiAgICBfYWN0aXZlUmVzb3VyY2VDbGFzczogUmVzb3VyY2VDbGFzcztcblxuICAgIC8vIHNldHRlciBtZXRob2QgZm9yIHNlbGVjdGVkIHJlc291cmNlIGNsYXNzXG4gICAgQElucHV0KClcbiAgICBzZXQgYWN0aXZlUmVzb3VyY2VDbGFzcyh2YWx1ZTogUmVzb3VyY2VDbGFzcykge1xuICAgICAgICB0aGlzLl9hY3RpdmVSZXNvdXJjZUNsYXNzID0gdmFsdWU7XG4gICAgfVxuXG4gICAgLy8gcmVmZXJlbmNlIHRvIGNoaWxkIGNvbXBvbmVudDogY29tYmluYXRpb24gb2YgY29tcGFyaXNvbiBvcGVyYXRvciBhbmQgdmFsdWUgZm9yIGNob3NlbiBwcm9wZXJ0eVxuICAgIEBWaWV3Q2hpbGQoJ3NwZWNpZnlQcm9wZXJ0eVZhbHVlJykgc3BlY2lmeVByb3BlcnR5VmFsdWU6IFNwZWNpZnlQcm9wZXJ0eVZhbHVlQ29tcG9uZW50O1xuXG4gICAgLy8gcHJvcGVydGllcyB0aGF0IGNhbiBiZSBzZWxlY3RlZCBmcm9tXG4gICAgcHJpdmF0ZSBfcHJvcGVydGllczogUHJvcGVydGllcztcblxuICAgIC8vIHByb3BlcnRpZXMgYXMgYW4gQXJyYXkgc3RydWN0dXJlIChiYXNlZCBvbiB0aGlzLnByb3BlcnRpZXMpXG4gICAgcHJvcGVydGllc0FzQXJyYXk6IEFycmF5PFByb3BlcnR5PjtcblxuICAgIC8vIHJlcHJlc2VudHMgdGhlIGN1cnJlbnRseSBzZWxlY3RlZCBwcm9wZXJ0eVxuICAgIHByb3BlcnR5U2VsZWN0ZWQ6IFByb3BlcnR5O1xuXG4gICAgZm9ybTogRm9ybUdyb3VwO1xuXG4gICAgLy8gdW5pcXVlIG5hbWUgZm9yIHRoaXMgcHJvcGVydHkgdG8gYmUgdXNlZCBpbiB0aGUgcGFyZW50IEZvcm1Hcm91cFxuICAgIHByb3BJbmRleDogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IoQEluamVjdChGb3JtQnVpbGRlcikgcHJpdmF0ZSBmYjogRm9ybUJ1aWxkZXIpIHtcblxuICAgIH1cblxuICAgIG5nT25Jbml0KCkge1xuXG4gICAgICAgIC8vIGJ1aWxkIGEgZm9ybSBmb3IgdGhlIHByb3BlcnR5IHNlbGVjdGlvblxuICAgICAgICB0aGlzLmZvcm0gPSB0aGlzLmZiLmdyb3VwKHtcbiAgICAgICAgICAgIHByb3BlcnR5OiBbbnVsbCwgVmFsaWRhdG9ycy5yZXF1aXJlZF0sXG4gICAgICAgICAgICBpc1NvcnRDcml0ZXJpb246IFtmYWxzZSwgVmFsaWRhdG9ycy5yZXF1aXJlZF1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gdXBkYXRlIHRoZSBzZWxlY3RlZCBwcm9wZXJ0eVxuICAgICAgICB0aGlzLmZvcm0udmFsdWVDaGFuZ2VzLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcHJvcElyaSA9IGRhdGEucHJvcGVydHk7XG4gICAgICAgICAgICB0aGlzLnByb3BlcnR5U2VsZWN0ZWQgPSB0aGlzLl9wcm9wZXJ0aWVzW3Byb3BJcmldO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXNvbHZlZFByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnByb3BJbmRleCA9ICdwcm9wZXJ0eScgKyB0aGlzLmluZGV4O1xuXG4gICAgICAgICAgICAvLyBhZGQgZm9ybSB0byB0aGUgcGFyZW50IGZvcm0gZ3JvdXBcbiAgICAgICAgICAgIHRoaXMuZm9ybUdyb3VwLmFkZENvbnRyb2wodGhpcy5wcm9wSW5kZXgsIHRoaXMuZm9ybSk7XG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG5cbiAgICAgICAgLy8gcmVtb3ZlIGZvcm0gZnJvbSB0aGUgcGFyZW50IGZvcm0gZ3JvdXBcbiAgICAgICAgcmVzb2x2ZWRQcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5mb3JtR3JvdXAucmVtb3ZlQ29udHJvbCh0aGlzLnByb3BJbmRleCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEluZGljYXRlcyBpZiBwcm9wZXJ0eSBjYW4gYmUgdXNlZCBhcyBhIHNvcnQgY3JpdGVyaW9uLlxuICAgICAqIFByb3BlcnR5IGhhcyB0byBoYXZlIGNhcmRpbmFsaXR5IG9yIG1heCBjYXJkaW5hbGl0eSAxIGZvciB0aGUgY2hvc2VuIHJlc291cmNlIGNsYXNzLlxuICAgICAqXG4gICAgICogV2UgY2Fubm90IHNvcnQgYnkgcHJvcGVydGllcyB3aG9zZSBjYXJkaW5hbGl0eSBpcyBncmVhdGVyIHRoYW4gMS5cbiAgICAgKiBSZXR1cm4gYm9vbGVhblxuICAgICAqL1xuICAgIHNvcnRDcml0ZXJpb24oKSB7XG5cbiAgICAgICAgLy8gY2hlY2sgaWYgYSByZXNvdXJjZSBjbGFzcyBpcyBzZWxlY3RlZCBhbmQgaWYgdGhlIHByb3BlcnR5J3MgY2FyZGluYWxpdHkgaXMgMSBmb3IgdGhlIHNlbGVjdGVkIHJlc291cmNlIGNsYXNzXG4gICAgICAgIGlmICh0aGlzLl9hY3RpdmVSZXNvdXJjZUNsYXNzICE9PSB1bmRlZmluZWQgJiYgdGhpcy5wcm9wZXJ0eVNlbGVjdGVkICE9PSB1bmRlZmluZWQgJiYgIXRoaXMucHJvcGVydHlTZWxlY3RlZC5pc0xpbmtQcm9wZXJ0eSkge1xuXG4gICAgICAgICAgICBjb25zdCBjYXJkaW5hbGl0aWVzOiBDYXJkaW5hbGl0eVtdID0gdGhpcy5fYWN0aXZlUmVzb3VyY2VDbGFzcy5jYXJkaW5hbGl0aWVzLmZpbHRlcihcbiAgICAgICAgICAgICAgICAoY2FyZDogQ2FyZGluYWxpdHkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gY2FyZGluYWxpdHkgMSBvciBtYXggb2NjdXJyZW5jZSAxXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjYXJkLnByb3BlcnR5ID09PSB0aGlzLnByb3BlcnR5U2VsZWN0ZWQuaWRcbiAgICAgICAgICAgICAgICAgICAgICAgICYmIGNhcmQudmFsdWUgPT09IDFcbiAgICAgICAgICAgICAgICAgICAgICAgICYmIChjYXJkLm9jY3VycmVuY2UgPT09IENhcmRpbmFsaXR5T2NjdXJyZW5jZS5jYXJkIHx8IGNhcmQub2NjdXJyZW5jZSA9PT0gQ2FyZGluYWxpdHlPY2N1cnJlbmNlLm1heENhcmQpXG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICByZXR1cm4gY2FyZGluYWxpdGllcy5sZW5ndGggPT09IDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFVwZGF0ZXMgdGhlIHByb3BlcnRpZXMgYXJyYXkgdGhhdCBpcyBhY2Nlc3NlZCBieSB0aGUgdGVtcGxhdGUuXG4gICAgICovXG4gICAgcHJpdmF0ZSB1cGRhdGVQcm9wZXJ0aWVzQXJyYXkoKSB7XG5cbiAgICAgICAgLy8gcmVwcmVzZW50IHRoZSBwcm9wZXJ0aWVzIGFzIGFuIGFycmF5IHRvIGJlIGFjY2Vzc2VkIGJ5IHRoZSB0ZW1wbGF0ZVxuICAgICAgICBjb25zdCBwcm9wc0FycmF5ID0gW107XG5cbiAgICAgICAgZm9yIChjb25zdCBwcm9wSXJpIGluIHRoaXMuX3Byb3BlcnRpZXMpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9wcm9wZXJ0aWVzLmhhc093blByb3BlcnR5KHByb3BJcmkpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcHJvcCA9IHRoaXMuX3Byb3BlcnRpZXNbcHJvcElyaV07XG5cbiAgICAgICAgICAgICAgICAvLyBvbmx5IGxpc3QgZWRpdGFibGUgcHJvcHMgdGhhdCBhcmUgbm90IGxpbmsgdmFsdWUgcHJvcHNcbiAgICAgICAgICAgICAgICBpZiAocHJvcC5pc0VkaXRhYmxlICYmICFwcm9wLmlzTGlua1ZhbHVlUHJvcGVydHkpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvcHNBcnJheS5wdXNoKHRoaXMuX3Byb3BlcnRpZXNbcHJvcElyaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucHJvcGVydGllc0FzQXJyYXkgPSBwcm9wc0FycmF5O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIHNlbGVjdGVkIHByb3BlcnR5IHdpdGggdGhlIHNwZWNpZmllZCB2YWx1ZS5cbiAgICAgKi9cbiAgICBnZXRQcm9wZXJ0eVNlbGVjdGVkV2l0aFZhbHVlKCk6IFByb3BlcnR5V2l0aFZhbHVlIHtcblxuICAgICAgICBjb25zdCBwcm9wVmFsOiBDb21wYXJpc29uT3BlcmF0b3JBbmRWYWx1ZSA9IHRoaXMuc3BlY2lmeVByb3BlcnR5VmFsdWUuZ2V0Q29tcGFyaXNvbk9wZXJhdG9yQW5kVmFsdWVMaXRlcmFsRm9yUHJvcGVydHkoKTtcblxuICAgICAgICBsZXQgaXNTb3J0Q3JpdGVyaW9uID0gZmFsc2U7XG5cbiAgICAgICAgLy8gb25seSBub24gbGlua2luZyBwcm9wZXJ0aWVzIGNhbiBiZSB1c2VkIGZvciBzb3J0aW5nXG4gICAgICAgIGlmICghdGhpcy5wcm9wZXJ0eVNlbGVjdGVkLmlzTGlua1Byb3BlcnR5KSB7XG4gICAgICAgICAgICBpc1NvcnRDcml0ZXJpb24gPSB0aGlzLmZvcm0udmFsdWUuaXNTb3J0Q3JpdGVyaW9uO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wZXJ0eVdpdGhWYWx1ZSh0aGlzLnByb3BlcnR5U2VsZWN0ZWQsIHByb3BWYWwsIGlzU29ydENyaXRlcmlvbik7XG5cbiAgICB9XG5cblxufVxuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBJbmplY3QsIElucHV0LCBPbkNoYW5nZXMsIE9uSW5pdCwgVmlld0NoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBGb3JtQnVpbGRlciwgRm9ybUdyb3VwLCBWYWxpZGF0b3JzIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtcbiAgICBDb21wYXJpc29uT3BlcmF0b3IsXG4gICAgQ29tcGFyaXNvbk9wZXJhdG9yQW5kVmFsdWUsXG4gICAgRXF1YWxzLFxuICAgIEV4aXN0cyxcbiAgICBHcmVhdGVyVGhhbixcbiAgICBHcmVhdGVyVGhhbkVxdWFscyxcbiAgICBLbm9yYUNvbnN0YW50cyxcbiAgICBMZXNzVGhhbixcbiAgICBMZXNzVGhhbkVxdWFscyxcbiAgICBMaWtlLFxuICAgIE1hdGNoLFxuICAgIE5vdEVxdWFscyxcbiAgICBQcm9wZXJ0eSxcbiAgICBQcm9wZXJ0eVZhbHVlLFxuICAgIFZhbHVlXG59IGZyb20gJ0Brbm9yYS9jb3JlJztcblxuXG4vLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy80NTY2MTAxMC9keW5hbWljLW5lc3RlZC1yZWFjdGl2ZS1mb3JtLWV4cHJlc3Npb25jaGFuZ2VkYWZ0ZXJpdGhhc2JlZW5jaGVja2VkZXJyb3JcbmNvbnN0IHJlc29sdmVkUHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZShudWxsKTtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdrdWktc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZScsXG4gICAgdGVtcGxhdGU6IGA8bWF0LWZvcm0tZmllbGQgY2xhc3M9XCJzZWFyY2gtb3BlcmF0b3ItZmllbGRcIiAqbmdJZj1cImNvbXBhcmlzb25PcGVyYXRvcnM/Lmxlbmd0aCA+IDBcIj5cbiAgICA8bWF0LXNlbGVjdCBwbGFjZWhvbGRlcj1cIkNvbXBhcmlzb24gT3BlcmF0b3JcIiBbZm9ybUNvbnRyb2xdPVwiZm9ybS5jb250cm9sc1snY29tcGFyaXNvbk9wZXJhdG9yJ11cIj5cbiAgICAgICAgPG1hdC1vcHRpb24gKm5nRm9yPVwibGV0IGNvbXBPcCBvZiBjb21wYXJpc29uT3BlcmF0b3JzXCIgW3ZhbHVlXT1cImNvbXBPcFwiPnt7IGNvbXBPcC5sYWJlbCB9fTwvbWF0LW9wdGlvbj5cbiAgICA8L21hdC1zZWxlY3Q+XG48L21hdC1mb3JtLWZpZWxkPlxuXG48IS0tIHNlbGVjdCBhcHQgY29tcG9uZW50IGZvciB2YWx1ZSBzcGVjaWZpY2F0aW9uIHVzaW5nIGEgc3dpdGNoIGNhc2Ugc3RhdGVtZW50LS0+XG48c3BhblxuICAgICpuZ0lmPVwiY29tcGFyaXNvbk9wZXJhdG9yU2VsZWN0ZWQgIT09IHVuZGVmaW5lZCAmJiBjb21wYXJpc29uT3BlcmF0b3JTZWxlY3RlZCAhPT0gbnVsbCAmJiBjb21wYXJpc29uT3BlcmF0b3JTZWxlY3RlZC5nZXRDbGFzc05hbWUoKSAhPSAnRXhpc3RzJ1wiXG4gICAgW25nU3dpdGNoXT1cInByb3BlcnR5VmFsdWVUeXBlXCI+XG4gIDxib29sZWFuLXZhbHVlICNwcm9wZXJ0eVZhbHVlIFtmb3JtR3JvdXBdPVwiZm9ybVwiICpuZ1N3aXRjaENhc2U9XCJLbm9yYUNvbnN0YW50cy5Cb29sZWFuVmFsdWVcIj48L2Jvb2xlYW4tdmFsdWU+XG4gIDxkYXRlLXZhbHVlICNwcm9wZXJ0eVZhbHVlIFtmb3JtR3JvdXBdPVwiZm9ybVwiICpuZ1N3aXRjaENhc2U9XCJLbm9yYUNvbnN0YW50cy5EYXRlVmFsdWVcIj48L2RhdGUtdmFsdWU+XG4gIDxkZWNpbWFsLXZhbHVlICNwcm9wZXJ0eVZhbHVlIFtmb3JtR3JvdXBdPVwiZm9ybVwiICpuZ1N3aXRjaENhc2U9XCJLbm9yYUNvbnN0YW50cy5EZWNpbWFsVmFsdWVcIj48L2RlY2ltYWwtdmFsdWU+XG4gIDxpbnRlZ2VyLXZhbHVlICNwcm9wZXJ0eVZhbHVlIFtmb3JtR3JvdXBdPVwiZm9ybVwiICpuZ1N3aXRjaENhc2U9XCJLbm9yYUNvbnN0YW50cy5JbnRWYWx1ZVwiPjwvaW50ZWdlci12YWx1ZT5cbiAgPGxpbmstdmFsdWUgI3Byb3BlcnR5VmFsdWUgW2Zvcm1Hcm91cF09XCJmb3JtXCIgW3Jlc3RyaWN0UmVzb3VyY2VDbGFzc109XCJwcm9wZXJ0eS5vYmplY3RUeXBlXCJcbiAgICAgICAgICAgICAgKm5nU3dpdGNoQ2FzZT1cIktub3JhQ29uc3RhbnRzLlJlc291cmNlXCI+PC9saW5rLXZhbHVlPlxuICA8dGV4dC12YWx1ZSAjcHJvcGVydHlWYWx1ZSBbZm9ybUdyb3VwXT1cImZvcm1cIiAqbmdTd2l0Y2hDYXNlPVwiS25vcmFDb25zdGFudHMuVGV4dFZhbHVlXCI+PC90ZXh0LXZhbHVlPlxuICA8dXJpLXZhbHVlICNwcm9wZXJ0eVZhbHVlIFtmb3JtR3JvdXBdPVwiZm9ybVwiICpuZ1N3aXRjaENhc2U9XCJLbm9yYUNvbnN0YW50cy5VcmlWYWx1ZVwiPjwvdXJpLXZhbHVlPlxuXG4gICAgPCEtLSBUT0RPOiBSZXNvdXJjZTogaGFuZGxlIGxpbmtpbmcgcHJvcGVydGllcyB3aXRoIHRhcmdldCBjbGFzcyByZXN0cmljdGlvbjogYWNjZXNzIHByb3BlcnR5IG1lbWJlciB0byBnZXQgb2JqZWN0Q2xhc3MgdmlhIHByb3BlcnR5KCkgZ2V0dGVyIG1ldGhvZCAtLT5cbiAgPHNwYW4gKm5nU3dpdGNoRGVmYXVsdD1cIlwiPk5vdCBzdXBwb3J0ZWQge3twcm9wZXJ0eVZhbHVlVHlwZX19PC9zcGFuPlxuPC9zcGFuPlxuYCxcbiAgICBzdHlsZXM6IFtgLnNlYXJjaC1vcGVyYXRvci1maWVsZHttYXJnaW4tcmlnaHQ6OHB4fWBdXG59KVxuZXhwb3J0IGNsYXNzIFNwZWNpZnlQcm9wZXJ0eVZhbHVlQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMge1xuXG4gICAgS25vcmFDb25zdGFudHMgPSBLbm9yYUNvbnN0YW50cztcblxuICAgIC8vIHBhcmVudCBGb3JtR3JvdXBcbiAgICBASW5wdXQoKSBmb3JtR3JvdXA6IEZvcm1Hcm91cDtcblxuICAgIEBWaWV3Q2hpbGQoJ3Byb3BlcnR5VmFsdWUnKSBwcm9wZXJ0eVZhbHVlQ29tcG9uZW50OiBQcm9wZXJ0eVZhbHVlO1xuXG4gICAgLy8gc2V0dGVyIG1ldGhvZCBmb3IgdGhlIHByb3BlcnR5IGNob3NlbiBieSB0aGUgdXNlclxuICAgIEBJbnB1dCgpXG4gICAgc2V0IHByb3BlcnR5KHByb3A6IFByb3BlcnR5KSB7XG4gICAgICAgIHRoaXMuY29tcGFyaXNvbk9wZXJhdG9yU2VsZWN0ZWQgPSB1bmRlZmluZWQ7IC8vIHJlc2V0IHRvIGluaXRpYWwgc3RhdGVcbiAgICAgICAgdGhpcy5fcHJvcGVydHkgPSBwcm9wO1xuICAgICAgICB0aGlzLnJlc2V0Q29tcGFyaXNvbk9wZXJhdG9ycygpOyAvLyByZXNldCBjb21wYXJpc29uIG9wZXJhdG9ycyBmb3IgZ2l2ZW4gcHJvcGVydHkgKG92ZXJ3cml0aW5nIGFueSBwcmV2aW91cyBzZWxlY3Rpb24pXG4gICAgfVxuXG4gICAgLy8gZ2V0dGVyIG1ldGhvZCBmb3IgdGhpcy5fcHJvcGVydHlcbiAgICBnZXQgcHJvcGVydHkoKTogUHJvcGVydHkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcHJvcGVydHk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfcHJvcGVydHk6IFByb3BlcnR5O1xuXG4gICAgZm9ybTogRm9ybUdyb3VwO1xuXG4gICAgLy8gYXZhaWxhYmxlIGNvbXBhcmlzb24gb3BlcmF0b3JzIGZvciB0aGUgcHJvcGVydHlcbiAgICBjb21wYXJpc29uT3BlcmF0b3JzOiBBcnJheTxDb21wYXJpc29uT3BlcmF0b3I+ID0gW107XG5cbiAgICAvLyBjb21wYXJpc29uIG9wZXJhdG9yIHNlbGVjdGVkIGJ5IHRoZSB1c2VyXG4gICAgY29tcGFyaXNvbk9wZXJhdG9yU2VsZWN0ZWQ6IENvbXBhcmlzb25PcGVyYXRvcjtcblxuICAgIC8vIHRoZSB0eXBlIG9mIHRoZSBwcm9wZXJ0eVxuICAgIHByb3BlcnR5VmFsdWVUeXBlO1xuXG4gICAgY29uc3RydWN0b3IoQEluamVjdChGb3JtQnVpbGRlcikgcHJpdmF0ZSBmYjogRm9ybUJ1aWxkZXIpIHtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXNldHMgdGhlIGNvbXBhcmlzb24gb3BlcmF0b3JzIGZvciB0aGlzLl9wcm9wZXJ0eS5cbiAgICAgKi9cbiAgICByZXNldENvbXBhcmlzb25PcGVyYXRvcnMoKSB7XG5cbiAgICAgICAgLy8gZGVwZW5kaW5nIG9uIG9iamVjdCBjbGFzcywgc2V0IGNvbXBhcmlzb24gb3BlcmF0b3JzIGFuZCB2YWx1ZSBlbnRyeSBmaWVsZFxuICAgICAgICBpZiAodGhpcy5fcHJvcGVydHkuaXNMaW5rUHJvcGVydHkpIHtcbiAgICAgICAgICAgIHRoaXMucHJvcGVydHlWYWx1ZVR5cGUgPSBLbm9yYUNvbnN0YW50cy5SZXNvdXJjZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucHJvcGVydHlWYWx1ZVR5cGUgPSB0aGlzLl9wcm9wZXJ0eS5vYmplY3RUeXBlO1xuICAgICAgICB9XG5cbiAgICAgICAgc3dpdGNoICh0aGlzLnByb3BlcnR5VmFsdWVUeXBlKSB7XG5cbiAgICAgICAgICAgIGNhc2UgS25vcmFDb25zdGFudHMuVGV4dFZhbHVlOlxuICAgICAgICAgICAgICAgIHRoaXMuY29tcGFyaXNvbk9wZXJhdG9ycyA9IFtuZXcgTGlrZSgpLCBuZXcgTWF0Y2goKSwgbmV3IEVxdWFscygpLCBuZXcgTm90RXF1YWxzKCksIG5ldyBFeGlzdHMoKV07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgS25vcmFDb25zdGFudHMuQm9vbGVhblZhbHVlOlxuICAgICAgICAgICAgY2FzZSBLbm9yYUNvbnN0YW50cy5SZXNvdXJjZTpcbiAgICAgICAgICAgIGNhc2UgS25vcmFDb25zdGFudHMuVXJpVmFsdWU6XG4gICAgICAgICAgICBjYXNlIEtub3JhQ29uc3RhbnRzLkludGVydmFsVmFsdWU6XG4gICAgICAgICAgICAgICAgdGhpcy5jb21wYXJpc29uT3BlcmF0b3JzID0gW25ldyBFcXVhbHMoKSwgbmV3IE5vdEVxdWFscygpLCBuZXcgRXhpc3RzKCldO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIEtub3JhQ29uc3RhbnRzLkludFZhbHVlOlxuICAgICAgICAgICAgY2FzZSBLbm9yYUNvbnN0YW50cy5EZWNpbWFsVmFsdWU6XG4gICAgICAgICAgICBjYXNlIEtub3JhQ29uc3RhbnRzLkRhdGVWYWx1ZTpcbiAgICAgICAgICAgICAgICB0aGlzLmNvbXBhcmlzb25PcGVyYXRvcnMgPSBbbmV3IEVxdWFscygpLCBuZXcgTm90RXF1YWxzKCksIG5ldyBMZXNzVGhhbigpLCBuZXcgTGVzc1RoYW5FcXVhbHMoKSwgbmV3IEdyZWF0ZXJUaGFuKCksIG5ldyBHcmVhdGVyVGhhbkVxdWFscygpLCBuZXcgRXhpc3RzKCldO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIEtub3JhQ29uc3RhbnRzLkxpc3RWYWx1ZTpcbiAgICAgICAgICAgIGNhc2UgS25vcmFDb25zdGFudHMuR2VvbVZhbHVlOlxuICAgICAgICAgICAgY2FzZSBLbm9yYUNvbnN0YW50cy5GaWxlVmFsdWU6XG4gICAgICAgICAgICBjYXNlIEtub3JhQ29uc3RhbnRzLkF1ZGlvRmlsZVZhbHVlOlxuICAgICAgICAgICAgY2FzZSBLbm9yYUNvbnN0YW50cy5TdGlsbEltYWdlRmlsZVZhbHVlOlxuICAgICAgICAgICAgY2FzZSBLbm9yYUNvbnN0YW50cy5ERERGaWxlVmFsdWU6XG4gICAgICAgICAgICBjYXNlIEtub3JhQ29uc3RhbnRzLk1vdmluZ0ltYWdlRmlsZVZhbHVlOlxuICAgICAgICAgICAgY2FzZSBLbm9yYUNvbnN0YW50cy5UZXh0RmlsZVZhbHVlOlxuICAgICAgICAgICAgY2FzZSBLbm9yYUNvbnN0YW50cy5Db2xvclZhbHVlOlxuICAgICAgICAgICAgICAgIHRoaXMuY29tcGFyaXNvbk9wZXJhdG9ycyA9IFtuZXcgRXhpc3RzKCldO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdFUlJPUjogVW5zdXBwb3J0ZWQgdmFsdWUgdHlwZSAnICsgdGhpcy5fcHJvcGVydHkub2JqZWN0VHlwZSk7XG5cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgbmdPbkluaXQoKSB7IH1cblxuICAgIG5nT25DaGFuZ2VzKCkge1xuXG4gICAgICAgIC8vIGJ1aWxkIGEgZm9ybSBmb3IgY29tcGFyaXNvbiBvcGVyYXRvciBzZWxlY3Rpb25cbiAgICAgICAgdGhpcy5mb3JtID0gdGhpcy5mYi5ncm91cCh7XG4gICAgICAgICAgICBjb21wYXJpc29uT3BlcmF0b3I6IFtudWxsLCBWYWxpZGF0b3JzLnJlcXVpcmVkXVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBzdG9yZSBjb21wYXJpc29uIG9wZXJhdG9yIHdoZW4gc2VsZWN0ZWRcbiAgICAgICAgdGhpcy5mb3JtLnZhbHVlQ2hhbmdlcy5zdWJzY3JpYmUoKGRhdGEpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY29tcGFyaXNvbk9wZXJhdG9yU2VsZWN0ZWQgPSBkYXRhLmNvbXBhcmlzb25PcGVyYXRvcjtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmVzb2x2ZWRQcm9taXNlLnRoZW4oKCkgPT4ge1xuXG4gICAgICAgICAgICAvLyByZW1vdmUgZnJvbSB0aGUgcGFyZW50IGZvcm0gZ3JvdXAgKGNsZWFuIHJlc2V0KVxuICAgICAgICAgICAgdGhpcy5mb3JtR3JvdXAucmVtb3ZlQ29udHJvbCgnY29tcGFyaXNvbk9wZXJhdG9yJyk7XG5cbiAgICAgICAgICAgIC8vIGFkZCBmb3JtIHRvIHRoZSBwYXJlbnQgZm9ybSBncm91cFxuICAgICAgICAgICAgdGhpcy5mb3JtR3JvdXAuYWRkQ29udHJvbCgnY29tcGFyaXNvbk9wZXJhdG9yJywgdGhpcy5mb3JtKTtcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBzcGVjaWZpZWQgY29tcGFyaXNvbiBvcGVyYXRvciBhbmQgdmFsdWUgZm9yIHRoZSBwcm9wZXJ0eS5cbiAgICAgKlxuICAgICAqIHJldHVybnMge0NvbXBhcmlzb25PcGVyYXRvckFuZFZhbHVlfSB0aGUgY29tcGFyaXNvbiBvcGVyYXRvciBhbmQgdGhlIHNwZWNpZmllZCB2YWx1ZVxuICAgICAqL1xuICAgIGdldENvbXBhcmlzb25PcGVyYXRvckFuZFZhbHVlTGl0ZXJhbEZvclByb3BlcnR5KCk6IENvbXBhcmlzb25PcGVyYXRvckFuZFZhbHVlIHtcbiAgICAgICAgLy8gcmV0dXJuIHZhbHVlIChsaXRlcmFsIG9yIElSSSkgZnJvbSB0aGUgY2hpbGQgY29tcG9uZW50XG4gICAgICAgIGxldCB2YWx1ZTogVmFsdWU7XG5cbiAgICAgICAgLy8gY29tcGFyaXNvbiBvcGVyYXRvciAnRXhpc3RzJyBkb2VzIG5vdCByZXF1aXJlIGEgdmFsdWVcbiAgICAgICAgaWYgKHRoaXMuY29tcGFyaXNvbk9wZXJhdG9yU2VsZWN0ZWQuZ2V0Q2xhc3NOYW1lKCkgIT09ICdFeGlzdHMnKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHRoaXMucHJvcGVydHlWYWx1ZUNvbXBvbmVudC5nZXRWYWx1ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcmV0dXJuIHRoZSBjb21wYXJpc29uIG9wZXJhdG9yIGFuZCB0aGUgc3BlY2lmaWVkIHZhbHVlXG4gICAgICAgIHJldHVybiBuZXcgQ29tcGFyaXNvbk9wZXJhdG9yQW5kVmFsdWUodGhpcy5jb21wYXJpc29uT3BlcmF0b3JTZWxlY3RlZCwgdmFsdWUpO1xuXG4gICAgfVxuXG59XG5cbiIsImltcG9ydCB7IENvbXBvbmVudCwgSW5qZWN0LCBJbnB1dCwgT25EZXN0cm95LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEZvcm1CdWlsZGVyLCBGb3JtR3JvdXAsIFZhbGlkYXRvcnMgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBLbm9yYUNvbnN0YW50cywgUHJvcGVydHlWYWx1ZSwgVmFsdWUsIFZhbHVlTGl0ZXJhbCB9IGZyb20gJ0Brbm9yYS9jb3JlJztcblxuLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNDU2NjEwMTAvZHluYW1pYy1uZXN0ZWQtcmVhY3RpdmUtZm9ybS1leHByZXNzaW9uY2hhbmdlZGFmdGVyaXRoYXNiZWVuY2hlY2tlZGVycm9yXG5jb25zdCByZXNvbHZlZFByb21pc2UgPSBQcm9taXNlLnJlc29sdmUobnVsbCk7XG5cblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdib29sZWFuLXZhbHVlJyxcbiAgICB0ZW1wbGF0ZTogYDxtYXQtY2hlY2tib3ggW2Zvcm1Db250cm9sXT1cImZvcm0uY29udHJvbHNbJ2Jvb2xlYW5WYWx1ZSddXCI+PC9tYXQtY2hlY2tib3g+XG5gLFxuICAgIHN0eWxlczogW2BgXVxufSlcbmV4cG9ydCBjbGFzcyBCb29sZWFuVmFsdWVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgUHJvcGVydHlWYWx1ZSB7XG5cbiAgICAvLyBwYXJlbnQgRm9ybUdyb3VwXG4gICAgQElucHV0KCkgZm9ybUdyb3VwOiBGb3JtR3JvdXA7XG5cbiAgICB0eXBlID0gS25vcmFDb25zdGFudHMuQm9vbGVhblZhbHVlO1xuXG4gICAgZm9ybTogRm9ybUdyb3VwO1xuXG4gICAgY29uc3RydWN0b3IoQEluamVjdChGb3JtQnVpbGRlcikgcHJpdmF0ZSBmYjogRm9ybUJ1aWxkZXIpIHtcblxuICAgIH1cblxuICAgIG5nT25Jbml0KCkge1xuXG4gICAgICAgIHRoaXMuZm9ybSA9IHRoaXMuZmIuZ3JvdXAoe1xuICAgICAgICAgICAgYm9vbGVhblZhbHVlOiBbZmFsc2UsIFZhbGlkYXRvcnMuY29tcG9zZShbVmFsaWRhdG9ycy5yZXF1aXJlZF0pXVxuICAgICAgICB9KTtcblxuICAgICAgICByZXNvbHZlZFByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAvLyBhZGQgZm9ybSB0byB0aGUgcGFyZW50IGZvcm0gZ3JvdXBcbiAgICAgICAgICAgIHRoaXMuZm9ybUdyb3VwLmFkZENvbnRyb2woJ3Byb3BWYWx1ZScsIHRoaXMuZm9ybSk7XG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG5cbiAgICAgICAgLy8gcmVtb3ZlIGZvcm0gZnJvbSB0aGUgcGFyZW50IGZvcm0gZ3JvdXBcbiAgICAgICAgcmVzb2x2ZWRQcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5mb3JtR3JvdXAucmVtb3ZlQ29udHJvbCgncHJvcFZhbHVlJyk7XG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgZ2V0VmFsdWUoKTogVmFsdWUge1xuICAgICAgICByZXR1cm4gbmV3IFZhbHVlTGl0ZXJhbChTdHJpbmcodGhpcy5mb3JtLnZhbHVlLmJvb2xlYW5WYWx1ZSksIEtub3JhQ29uc3RhbnRzLnhzZEJvb2xlYW4pO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IENvbXBvbmVudCwgRGlyZWN0aXZlLCBIb3N0LCBJbmplY3QsIElucHV0LCBPbkRlc3Ryb3ksIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRm9ybUJ1aWxkZXIsIEZvcm1Hcm91cCwgVmFsaWRhdG9ycyB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IEtub3JhQ29uc3RhbnRzLCBQcm9wZXJ0eVZhbHVlLCBWYWx1ZSwgVmFsdWVMaXRlcmFsIH0gZnJvbSAnQGtub3JhL2NvcmUnO1xuaW1wb3J0IHsgR3JlZ29yaWFuQ2FsZW5kYXJEYXRlLCBKRE5Db252ZXJ0aWJsZUNhbGVuZGFyLCBKRE5QZXJpb2QgfSBmcm9tICdqZG5jb252ZXJ0aWJsZWNhbGVuZGFyJztcbmltcG9ydCB7IERhdGVBZGFwdGVyLCBNQVRfREFURV9MT0NBTEUsIE1hdENhbGVuZGFyIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwnO1xuaW1wb3J0IHsgSkROQ29udmVydGlibGVDYWxlbmRhckRhdGVBZGFwdGVyIH0gZnJvbSAnamRuY29udmVydGlibGVjYWxlbmRhcmRhdGVhZGFwdGVyJztcblxuLyoqIEN1c3RvbSBoZWFkZXIgY29tcG9uZW50IGNvbnRhaW5pbmcgYSBjYWxlbmRhciBmb3JtYXQgc3dpdGNoZXIgKi9cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAna3VpLWNhbGVuZGFyLWhlYWRlcicsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgIDxtYXQtc2VsZWN0IHBsYWNlaG9sZGVyPVwiQ2FsZW5kYXIgRm9ybWF0XCIgW2Zvcm1Db250cm9sXT1cImZvcm0uY29udHJvbHNbJ2NhbGVuZGFyJ11cIj5cbiAgICAgICAgPG1hdC1vcHRpb24gKm5nRm9yPVwibGV0IGNhbCBvZiBzdXBwb3J0ZWRDYWxlbmRhckZvcm1hdHNcIiBbdmFsdWVdPVwiY2FsXCI+e3tjYWx9fTwvbWF0LW9wdGlvbj5cbiAgICAgIDwvbWF0LXNlbGVjdD5cbiAgICAgIDxtYXQtY2FsZW5kYXItaGVhZGVyPjwvbWF0LWNhbGVuZGFyLWhlYWRlcj5cbiAgICBgLFxuICAgIHN0eWxlczogW11cbn0pXG5leHBvcnQgY2xhc3MgSGVhZGVyQ29tcG9uZW50PEQ+IGltcGxlbWVudHMgT25Jbml0IHtcbiAgICBjb25zdHJ1Y3RvcihASG9zdCgpIHByaXZhdGUgX2NhbGVuZGFyOiBNYXRDYWxlbmRhcjxKRE5Db252ZXJ0aWJsZUNhbGVuZGFyPixcbiAgICAgICAgcHJpdmF0ZSBfZGF0ZUFkYXB0ZXI6IERhdGVBZGFwdGVyPEpETkNvbnZlcnRpYmxlQ2FsZW5kYXI+LFxuICAgICAgICBASW5qZWN0KEZvcm1CdWlsZGVyKSBwcml2YXRlIGZiOiBGb3JtQnVpbGRlcikge1xuICAgIH1cblxuICAgIGZvcm06IEZvcm1Hcm91cDtcblxuICAgIC8vIGEgbGlzdCBvZiBzdXBwb3J0ZWQgY2FsZW5kYXIgZm9ybWF0cyAoR3JlZ29yaWFuIGFuZCBKdWxpYW4pXG4gICAgc3VwcG9ydGVkQ2FsZW5kYXJGb3JtYXRzID0gSkROQ29udmVydGlibGVDYWxlbmRhci5zdXBwb3J0ZWRDYWxlbmRhcnM7XG5cbiAgICAvLyB0aGUgY3VycmVudGx5IGFjdGl2ZSBjYWxlbmRhciBmb3JtYXRcbiAgICBhY3RpdmVGb3JtYXQ7XG5cbiAgICBuZ09uSW5pdCgpIHtcblxuICAgICAgICAvLyBnZXQgdGhlIGN1cnJlbnRseSBhY3RpdmUgY2FsZW5kYXIgZm9ybWF0IGZyb20gdGhlIGRhdGUgYWRhcHRlclxuICAgICAgICBpZiAodGhpcy5fZGF0ZUFkYXB0ZXIgaW5zdGFuY2VvZiBKRE5Db252ZXJ0aWJsZUNhbGVuZGFyRGF0ZUFkYXB0ZXIpIHtcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlRm9ybWF0ID0gdGhpcy5fZGF0ZUFkYXB0ZXIuYWN0aXZlQ2FsZW5kYXJGb3JtYXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZGF0ZSBhZGFwdGVyIGlzIGV4cGVjdGVkIHRvIGJlIGFuIGluc3RhbmNlIG9mIEpETkNvbnZlcnRpYmxlQ2FsZW5kYXJEYXRlQWRhcHRlcicpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gYnVpbGQgYSBmb3JtIGZvciB0aGUgY2FsZW5kYXIgZm9ybWF0IHNlbGVjdGlvblxuICAgICAgICB0aGlzLmZvcm0gPSB0aGlzLmZiLmdyb3VwKHtcbiAgICAgICAgICAgIGNhbGVuZGFyOiBbdGhpcy5hY3RpdmVGb3JtYXQsIFZhbGlkYXRvcnMucmVxdWlyZWRdXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGRvIHRoZSBjb252ZXJzaW9uIHdoZW4gdGhlIHVzZXIgc2VsZWN0cyBhbm90aGVyIGNhbGVuZGFyIGZvcm1hdFxuICAgICAgICB0aGlzLmZvcm0udmFsdWVDaGFuZ2VzLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xuICAgICAgICAgICAgLy8gcGFzcyB0aGUgdGFyZ2V0IGNhbGVuZGFyIGZvcm1hdCB0byB0aGUgY29udmVyc2lvbiBtZXRob2RcbiAgICAgICAgICAgIHRoaXMuY29udmVydERhdGUoZGF0YS5jYWxlbmRhcik7XG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ29udmVydHMgdGhlIGRhdGUgaW50byB0aGUgdGFyZ2V0IGZvcm1hdC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBjYWxlbmRhciB0aGUgdGFyZ2V0IGNhbGVuZGFyIGZvcm1hdC5cbiAgICAgKi9cbiAgICBjb252ZXJ0RGF0ZShjYWxlbmRhcjogJ0dyZWdvcmlhbicgfCAnSnVsaWFuJykge1xuXG4gICAgICAgIGlmICh0aGlzLl9kYXRlQWRhcHRlciBpbnN0YW5jZW9mIEpETkNvbnZlcnRpYmxlQ2FsZW5kYXJEYXRlQWRhcHRlcikge1xuXG4gICAgICAgICAgICAvLyBjb252ZXJ0IHRoZSBkYXRlIGludG8gdGhlIHRhcmdldCBjYWxlbmRhciBmb3JtYXRcbiAgICAgICAgICAgIGNvbnN0IGNvbnZlcnRlZERhdGUgPSB0aGlzLl9kYXRlQWRhcHRlci5jb252ZXJ0Q2FsZW5kYXJGb3JtYXQodGhpcy5fY2FsZW5kYXIuYWN0aXZlRGF0ZSwgY2FsZW5kYXIpO1xuXG4gICAgICAgICAgICAvLyBzZXQgdGhlIG5ldyBkYXRlXG4gICAgICAgICAgICB0aGlzLl9jYWxlbmRhci5hY3RpdmVEYXRlID0gY29udmVydGVkRGF0ZTtcblxuICAgICAgICAgICAgLy8gc2VsZWN0IHRoZSBuZXcgZGF0ZSBpbiB0aGUgZGF0ZXBpY2tlciBVSVxuICAgICAgICAgICAgdGhpcy5fY2FsZW5kYXIuX2RhdGVTZWxlY3RlZChjb252ZXJ0ZWREYXRlKTtcblxuICAgICAgICAgICAgLy8gdXBkYXRlIHZpZXcgYWZ0ZXIgY2FsZW5kYXIgZm9ybWF0IGNvbnZlcnNpb25cbiAgICAgICAgICAgIGNvbnN0IHZpZXcgPSB0aGlzLl9jYWxlbmRhci5jdXJyZW50VmlldyA9PT0gJ21vbnRoJyA/IHRoaXMuX2NhbGVuZGFyLm1vbnRoVmlldyA6XG4gICAgICAgICAgICAgICAgKHRoaXMuX2NhbGVuZGFyLmN1cnJlbnRWaWV3ID09PSAneWVhcicgPyB0aGlzLl9jYWxlbmRhci55ZWFyVmlldyA6IHRoaXMuX2NhbGVuZGFyLm11bHRpWWVhclZpZXcpO1xuXG4gICAgICAgICAgICB2aWV3Lm5nQWZ0ZXJDb250ZW50SW5pdCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2RhdGUgYWRhcHRlciBpcyBleHBlY3RlZCB0byBiZSBhbiBpbnN0YW5jZSBvZiBKRE5Db252ZXJ0aWJsZUNhbGVuZGFyRGF0ZUFkYXB0ZXInKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCB7IENvbXBvbmVudCwgSG9zdCwgSW5qZWN0LCBJbnB1dCwgT25EZXN0cm95LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEZvcm1CdWlsZGVyLCBGb3JtR3JvdXAsIFZhbGlkYXRvcnMgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbmltcG9ydCB7IEtub3JhQ29uc3RhbnRzLCBQcm9wZXJ0eVZhbHVlLCBWYWx1ZSwgVmFsdWVMaXRlcmFsIH0gZnJvbSAnQGtub3JhL2NvcmUnO1xuaW1wb3J0IHsgR3JlZ29yaWFuQ2FsZW5kYXJEYXRlLCBKRE5Db252ZXJ0aWJsZUNhbGVuZGFyLCBKRE5QZXJpb2QgfSBmcm9tICdqZG5jb252ZXJ0aWJsZWNhbGVuZGFyJztcbmltcG9ydCB7IEhlYWRlckNvbXBvbmVudCB9IGZyb20gJy4vaGVhZGVyLWNhbGVuZGFyL2hlYWRlci1jYWxlbmRhci5jb21wb25lbnQnO1xuXG4vLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy80NTY2MTAxMC9keW5hbWljLW5lc3RlZC1yZWFjdGl2ZS1mb3JtLWV4cHJlc3Npb25jaGFuZ2VkYWZ0ZXJpdGhhc2JlZW5jaGVja2VkZXJyb3JcbmNvbnN0IHJlc29sdmVkUHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZShudWxsKTtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdkYXRlLXZhbHVlJyxcbiAgICB0ZW1wbGF0ZTogYDxtYXQtZm9ybS1maWVsZD5cbiAgICA8a3VpSmRuRGF0ZXBpY2tlcj5cbiAgICAgICAgPGlucHV0IG1hdElucHV0IFttYXREYXRlcGlja2VyXT1cInBpY2tlclwiIHBsYWNlaG9sZGVyPVwiQ2hvb3NlIGEgZGF0ZVwiIFtmb3JtQ29udHJvbF09XCJmb3JtLmNvbnRyb2xzWydkYXRlVmFsdWUnXVwiPlxuICAgICAgICA8bWF0LWRhdGVwaWNrZXIgI3BpY2tlciBbY2FsZW5kYXJIZWFkZXJDb21wb25lbnRdPVwiaGVhZGVyQ29tcG9uZW50XCI+PC9tYXQtZGF0ZXBpY2tlcj5cbiAgICA8L2t1aUpkbkRhdGVwaWNrZXI+XG4gICAgPG1hdC1kYXRlcGlja2VyLXRvZ2dsZSBtYXRTdWZmaXggW2Zvcl09XCJwaWNrZXJcIj48L21hdC1kYXRlcGlja2VyLXRvZ2dsZT5cbjwvbWF0LWZvcm0tZmllbGQ+YCxcbiAgICBzdHlsZXM6IFtgYF1cbn0pXG5leHBvcnQgY2xhc3MgRGF0ZVZhbHVlQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3ksIFByb3BlcnR5VmFsdWUge1xuXG4gICAgLy8gcGFyZW50IEZvcm1Hcm91cFxuICAgIEBJbnB1dCgpIGZvcm1Hcm91cDogRm9ybUdyb3VwO1xuXG4gICAgdHlwZSA9IEtub3JhQ29uc3RhbnRzLkRhdGVWYWx1ZTtcblxuICAgIGZvcm06IEZvcm1Hcm91cDtcblxuICAgIC8vIGN1c3RvbSBoZWFkZXIgZm9yIHRoZSBkYXRlcGlja2VyXG4gICAgaGVhZGVyQ29tcG9uZW50ID0gSGVhZGVyQ29tcG9uZW50O1xuXG4gICAgY29uc3RydWN0b3IoQEluamVjdChGb3JtQnVpbGRlcikgcHJpdmF0ZSBmYjogRm9ybUJ1aWxkZXIpIHtcbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHtcblxuICAgICAgICAvLyBpbml0IGRhdGVwaWNrZXJcbiAgICAgICAgdGhpcy5mb3JtID0gdGhpcy5mYi5ncm91cCh7XG4gICAgICAgICAgICBkYXRlVmFsdWU6IFtudWxsLCBWYWxpZGF0b3JzLmNvbXBvc2UoW1ZhbGlkYXRvcnMucmVxdWlyZWRdKV1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5mb3JtLnZhbHVlQ2hhbmdlcy5zdWJzY3JpYmUoKGRhdGEpID0+IHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGRhdGEuZGF0ZVZhbHVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmVzb2x2ZWRQcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgLy8gYWRkIGZvcm0gdG8gdGhlIHBhcmVudCBmb3JtIGdyb3VwXG4gICAgICAgICAgICB0aGlzLmZvcm1Hcm91cC5hZGRDb250cm9sKCdwcm9wVmFsdWUnLCB0aGlzLmZvcm0pO1xuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCkge1xuXG4gICAgICAgIC8vIHJlbW92ZSBmb3JtIGZyb20gdGhlIHBhcmVudCBmb3JtIGdyb3VwXG4gICAgICAgIHJlc29sdmVkUHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZm9ybUdyb3VwLnJlbW92ZUNvbnRyb2woJ3Byb3BWYWx1ZScpO1xuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIGdldFZhbHVlKCk6IFZhbHVlIHtcblxuICAgICAgICBjb25zdCBkYXRlT2JqOiBKRE5Db252ZXJ0aWJsZUNhbGVuZGFyID0gdGhpcy5mb3JtLnZhbHVlLmRhdGVWYWx1ZTtcblxuICAgICAgICAvLyBnZXQgY2FsZW5kYXIgZm9ybWF0XG4gICAgICAgIGNvbnN0IGNhbGVuZGFyRm9ybWF0ID0gZGF0ZU9iai5jYWxlbmRhck5hbWU7XG4gICAgICAgIC8vIGdldCBjYWxlbmRhciBwZXJpb2RcbiAgICAgICAgY29uc3QgY2FsZW5kYXJQZXJpb2QgPSBkYXRlT2JqLnRvQ2FsZW5kYXJQZXJpb2QoKTtcbiAgICAgICAgLy8gZ2V0IHRoZSBkYXRlXG4gICAgICAgIGNvbnN0IGRhdGVTdHJpbmcgPSBgJHtjYWxlbmRhckZvcm1hdC50b1VwcGVyQ2FzZSgpfToke2NhbGVuZGFyUGVyaW9kLnBlcmlvZFN0YXJ0LnllYXJ9LSR7Y2FsZW5kYXJQZXJpb2QucGVyaW9kU3RhcnQubW9udGh9LSR7Y2FsZW5kYXJQZXJpb2QucGVyaW9kU3RhcnQuZGF5fToke2NhbGVuZGFyUGVyaW9kLnBlcmlvZEVuZC55ZWFyfS0ke2NhbGVuZGFyUGVyaW9kLnBlcmlvZEVuZC5tb250aH0tJHtjYWxlbmRhclBlcmlvZC5wZXJpb2RFbmQuZGF5fWA7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBWYWx1ZUxpdGVyYWwoU3RyaW5nKGRhdGVTdHJpbmcpLCBLbm9yYUNvbnN0YW50cy5EYXRlVmFsdWUpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IENvbXBvbmVudCwgSW5qZWN0LCBJbnB1dCwgT25EZXN0cm95LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEZvcm1CdWlsZGVyLCBGb3JtR3JvdXAsIFZhbGlkYXRvcnMgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBLbm9yYUNvbnN0YW50cywgUHJvcGVydHlWYWx1ZSwgVmFsdWUsIFZhbHVlTGl0ZXJhbCB9IGZyb20gJ0Brbm9yYS9jb3JlJztcblxuLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNDU2NjEwMTAvZHluYW1pYy1uZXN0ZWQtcmVhY3RpdmUtZm9ybS1leHByZXNzaW9uY2hhbmdlZGFmdGVyaXRoYXNiZWVuY2hlY2tlZGVycm9yXG5jb25zdCByZXNvbHZlZFByb21pc2UgPSBQcm9taXNlLnJlc29sdmUobnVsbCk7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnZGVjaW1hbC12YWx1ZScsXG4gICAgdGVtcGxhdGU6IGA8bWF0LWZvcm0tZmllbGQ+XG4gICAgPGlucHV0IG1hdElucHV0IFtmb3JtQ29udHJvbF09XCJmb3JtLmNvbnRyb2xzWydkZWNpbWFsVmFsdWUnXVwiIHBsYWNlaG9sZGVyPVwiRGVjaW1hbCB2YWx1ZVwiIHZhbHVlPVwiXCIgdHlwZT1cIm51bWJlclwiPlxuPC9tYXQtZm9ybS1maWVsZD5cbmAsXG4gICAgc3R5bGVzOiBbYGBdXG59KVxuZXhwb3J0IGNsYXNzIERlY2ltYWxWYWx1ZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95LCBQcm9wZXJ0eVZhbHVlIHtcblxuICAgIC8vIHBhcmVudCBGb3JtR3JvdXBcbiAgICBASW5wdXQoKSBmb3JtR3JvdXA6IEZvcm1Hcm91cDtcblxuICAgIHR5cGUgPSBLbm9yYUNvbnN0YW50cy5EZWNpbWFsVmFsdWU7XG5cbiAgICBmb3JtOiBGb3JtR3JvdXA7XG5cbiAgICBjb25zdHJ1Y3RvcihASW5qZWN0KEZvcm1CdWlsZGVyKSBwcml2YXRlIGZiOiBGb3JtQnVpbGRlcikge1xuICAgIH1cblxuICAgIG5nT25Jbml0KCkge1xuXG4gICAgICAgIHRoaXMuZm9ybSA9IHRoaXMuZmIuZ3JvdXAoe1xuICAgICAgICAgICAgZGVjaW1hbFZhbHVlOiBbbnVsbCwgVmFsaWRhdG9ycy5jb21wb3NlKFtWYWxpZGF0b3JzLnJlcXVpcmVkXSldXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJlc29sdmVkUHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIC8vIGFkZCBmb3JtIHRvIHRoZSBwYXJlbnQgZm9ybSBncm91cFxuICAgICAgICAgICAgdGhpcy5mb3JtR3JvdXAuYWRkQ29udHJvbCgncHJvcFZhbHVlJywgdGhpcy5mb3JtKTtcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcblxuICAgICAgICAvLyByZW1vdmUgZm9ybSBmcm9tIHRoZSBwYXJlbnQgZm9ybSBncm91cFxuICAgICAgICByZXNvbHZlZFByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZvcm1Hcm91cC5yZW1vdmVDb250cm9sKCdwcm9wVmFsdWUnKTtcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBnZXRWYWx1ZSgpOiBWYWx1ZSB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBWYWx1ZUxpdGVyYWwoU3RyaW5nKHRoaXMuZm9ybS52YWx1ZS5kZWNpbWFsVmFsdWUpLCBLbm9yYUNvbnN0YW50cy54c2REZWNpbWFsKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIEluamVjdCwgSW5wdXQsIE9uRGVzdHJveSwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBGb3JtQnVpbGRlciwgRm9ybUdyb3VwLCBWYWxpZGF0b3JzIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgS25vcmFDb25zdGFudHMsIFByb3BlcnR5VmFsdWUsIFZhbHVlLCBWYWx1ZUxpdGVyYWwgfSBmcm9tICdAa25vcmEvY29yZSc7XG5cbi8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzQ1NjYxMDEwL2R5bmFtaWMtbmVzdGVkLXJlYWN0aXZlLWZvcm0tZXhwcmVzc2lvbmNoYW5nZWRhZnRlcml0aGFzYmVlbmNoZWNrZWRlcnJvclxuY29uc3QgcmVzb2x2ZWRQcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKG51bGwpO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ2ludGVnZXItdmFsdWUnLFxuICAgIHRlbXBsYXRlOiBgPG1hdC1mb3JtLWZpZWxkPlxuICAgIDxpbnB1dCBtYXRJbnB1dCBbZm9ybUNvbnRyb2xdPVwiZm9ybS5jb250cm9sc1snaW50ZWdlclZhbHVlJ11cIiBwbGFjZWhvbGRlcj1cIkludGVnZXIgdmFsdWVcIiB2YWx1ZT1cIlwiIHR5cGU9XCJudW1iZXJcIj5cbjwvbWF0LWZvcm0tZmllbGQ+XG5gLFxuICAgIHN0eWxlczogW2BgXVxufSlcbmV4cG9ydCBjbGFzcyBJbnRlZ2VyVmFsdWVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgUHJvcGVydHlWYWx1ZSB7XG5cbiAgICAvLyBwYXJlbnQgRm9ybUdyb3VwXG4gICAgQElucHV0KCkgZm9ybUdyb3VwOiBGb3JtR3JvdXA7XG5cbiAgICB0eXBlID0gS25vcmFDb25zdGFudHMuSW50VmFsdWU7XG5cbiAgICBmb3JtOiBGb3JtR3JvdXA7XG5cbiAgICBjb25zdHJ1Y3RvcihASW5qZWN0KEZvcm1CdWlsZGVyKSBwcml2YXRlIGZiOiBGb3JtQnVpbGRlcikge1xuXG4gICAgfVxuXG4gICAgbmdPbkluaXQoKSB7XG5cbiAgICAgICAgdGhpcy5mb3JtID0gdGhpcy5mYi5ncm91cCh7XG4gICAgICAgICAgICBpbnRlZ2VyVmFsdWU6IFtudWxsLCBWYWxpZGF0b3JzLmNvbXBvc2UoW1ZhbGlkYXRvcnMucmVxdWlyZWQsIFZhbGlkYXRvcnMucGF0dGVybigvXi0/XFxkKyQvKV0pXSAvLyBvbmx5IGFsbG93IGZvciBpbnRlZ2VyIHZhbHVlcyAobm8gZnJhY3Rpb25zKVxuICAgICAgICB9KTtcblxuICAgICAgICByZXNvbHZlZFByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAvLyBhZGQgZm9ybSB0byB0aGUgcGFyZW50IGZvcm0gZ3JvdXBcbiAgICAgICAgICAgIHRoaXMuZm9ybUdyb3VwLmFkZENvbnRyb2woJ3Byb3BWYWx1ZScsIHRoaXMuZm9ybSk7XG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG5cbiAgICAgICAgLy8gcmVtb3ZlIGZvcm0gZnJvbSB0aGUgcGFyZW50IGZvcm0gZ3JvdXBcbiAgICAgICAgcmVzb2x2ZWRQcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5mb3JtR3JvdXAucmVtb3ZlQ29udHJvbCgncHJvcFZhbHVlJyk7XG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgZ2V0VmFsdWUoKTogVmFsdWUge1xuXG4gICAgICAgIHJldHVybiBuZXcgVmFsdWVMaXRlcmFsKFN0cmluZyh0aGlzLmZvcm0udmFsdWUuaW50ZWdlclZhbHVlKSwgS25vcmFDb25zdGFudHMueHNkSW50ZWdlcik7XG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIEluamVjdCwgSW5wdXQsIE9uRGVzdHJveSwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBGb3JtQnVpbGRlciwgRm9ybUNvbnRyb2wsIEZvcm1Hcm91cCwgVmFsaWRhdG9ycyB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7XG4gICAgQXBpU2VydmljZVJlc3VsdCxcbiAgICBDb252ZXJ0SlNPTkxELFxuICAgIElSSSxcbiAgICBLbm9yYUNvbnN0YW50cyxcbiAgICBPbnRvbG9neUNhY2hlU2VydmljZSxcbiAgICBQcm9wZXJ0eVZhbHVlLFxuICAgIFJlYWRSZXNvdXJjZSxcbiAgICBSZWFkUmVzb3VyY2VzU2VxdWVuY2UsXG4gICAgU2VhcmNoU2VydmljZSxcbiAgICBWYWx1ZVxufSBmcm9tICdAa25vcmEvY29yZSc7XG5cbmRlY2xhcmUgbGV0IHJlcXVpcmU6IGFueTsgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8zNDczMDAxMC9hbmd1bGFyMi01LW1pbnV0ZS1pbnN0YWxsLWJ1Zy1yZXF1aXJlLWlzLW5vdC1kZWZpbmVkXG5jb25zdCBqc29ubGQgPSByZXF1aXJlKCdqc29ubGQnKTtcblxuLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNDU2NjEwMTAvZHluYW1pYy1uZXN0ZWQtcmVhY3RpdmUtZm9ybS1leHByZXNzaW9uY2hhbmdlZGFmdGVyaXRoYXNiZWVuY2hlY2tlZGVycm9yXG5jb25zdCByZXNvbHZlZFByb21pc2UgPSBQcm9taXNlLnJlc29sdmUobnVsbCk7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnbGluay12YWx1ZScsXG4gICAgdGVtcGxhdGU6IGA8bWF0LWZvcm0tZmllbGQ+XG4gICAgPGlucHV0IG1hdElucHV0IHBsYWNlaG9sZGVyPVwicmVzb3VyY2VcIiBhcmlhLWxhYmVsPVwicmVzb3VyY2VcIiBbbWF0QXV0b2NvbXBsZXRlXT1cImF1dG9cIiBbZm9ybUNvbnRyb2xdPVwiZm9ybS5jb250cm9sc1sncmVzb3VyY2UnXVwiPlxuICAgIDxtYXQtYXV0b2NvbXBsZXRlICNhdXRvPVwibWF0QXV0b2NvbXBsZXRlXCIgW2Rpc3BsYXlXaXRoXT1cImRpc3BsYXlSZXNvdXJjZVwiPlxuICAgICAgICA8bWF0LW9wdGlvbiAqbmdGb3I9XCJsZXQgcmVzIG9mIHJlc291cmNlc1wiIFt2YWx1ZV09XCJyZXNcIj5cbiAgICAgICAgICAgIHt7cmVzPy5sYWJlbH19XG4gICAgICAgIDwvbWF0LW9wdGlvbj5cbiAgICA8L21hdC1hdXRvY29tcGxldGU+XG48L21hdC1mb3JtLWZpZWxkPlxuYCxcbiAgICBzdHlsZXM6IFtgYF1cbn0pXG5leHBvcnQgY2xhc3MgTGlua1ZhbHVlQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3ksIFByb3BlcnR5VmFsdWUge1xuXG4gICAgLy8gcGFyZW50IEZvcm1Hcm91cFxuICAgIEBJbnB1dCgpIGZvcm1Hcm91cDogRm9ybUdyb3VwO1xuXG4gICAgdHlwZSA9IEtub3JhQ29uc3RhbnRzLkxpbmtWYWx1ZTtcblxuICAgIGZvcm06IEZvcm1Hcm91cDtcblxuICAgIHJlc291cmNlczogUmVhZFJlc291cmNlW107XG5cbiAgICBwcml2YXRlIF9yZXN0cmljdFRvUmVzb3VyY2VDbGFzczogc3RyaW5nO1xuXG4gICAgQElucHV0KClcbiAgICBzZXQgcmVzdHJpY3RSZXNvdXJjZUNsYXNzKHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5fcmVzdHJpY3RUb1Jlc291cmNlQ2xhc3MgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBnZXQgcmVzdHJpY3RSZXNvdXJjZUNsYXNzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcmVzdHJpY3RUb1Jlc291cmNlQ2xhc3M7XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IoQEluamVjdChGb3JtQnVpbGRlcikgcHJpdmF0ZSBmYjogRm9ybUJ1aWxkZXIsIHByaXZhdGUgX3NlYXJjaFNlcnZpY2U6IFNlYXJjaFNlcnZpY2UsIHByaXZhdGUgX2NhY2hlU2VydmljZTogT250b2xvZ3lDYWNoZVNlcnZpY2UpIHtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERpc3BsYXlzIGEgc2VsZWN0ZWQgcmVzb3VyY2UgdXNpbmcgaXRzIGxhYmVsLlxuICAgICAqXG4gICAgICogQHBhcmFtIHJlc291cmNlIHRoZSByZXNvdXJjZSB0byBiZSBkaXNwbGF5ZWQgKG9yIG5vIHNlbGVjdGlvbiB5ZXQpLlxuICAgICAqIEByZXR1cm5zXG4gICAgICovXG4gICAgZGlzcGxheVJlc291cmNlKHJlc291cmNlOiBSZWFkUmVzb3VyY2UgfCBudWxsKSB7XG5cbiAgICAgICAgLy8gbnVsbCBpcyB0aGUgaW5pdGlhbCB2YWx1ZSAobm8gc2VsZWN0aW9uIHlldClcbiAgICAgICAgaWYgKHJlc291cmNlICE9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzb3VyY2UubGFiZWw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZWFyY2ggZm9yIHJlc291cmNlcyB3aG9zZSBsYWJlbHMgY29udGFpbiB0aGUgZ2l2ZW4gc2VhcmNoIHRlcm0sIHJlc3RyaWN0aW5nIHRvIHRvIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG9iamVjdCBjb25zdHJhaW50LlxuICAgICAqXG4gICAgICogQHBhcmFtIHNlYXJjaFRlcm1cbiAgICAgKi9cbiAgICBzZWFyY2hCeUxhYmVsKHNlYXJjaFRlcm06IHN0cmluZykge1xuXG4gICAgICAgIC8vIGF0IGxlYXN0IDMgY2hhcmFjdGVycyBhcmUgcmVxdWlyZWRcbiAgICAgICAgaWYgKHNlYXJjaFRlcm0ubGVuZ3RoID49IDMpIHtcblxuICAgICAgICAgICAgdGhpcy5fc2VhcmNoU2VydmljZS5zZWFyY2hCeUxhYmVsKHNlYXJjaFRlcm0sIHRoaXMuX3Jlc3RyaWN0VG9SZXNvdXJjZUNsYXNzKS5zdWJzY3JpYmUoXG4gICAgICAgICAgICAgICAgKHJlc3VsdDogQXBpU2VydmljZVJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwcm9taXNlcyA9IGpzb25sZC5wcm9taXNlcztcbiAgICAgICAgICAgICAgICAgICAgLy8gY29tcGFjdCBKU09OLUxEIHVzaW5nIGFuIGVtcHR5IGNvbnRleHQ6IGV4cGFuZHMgYWxsIElyaXNcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJvbWlzZSA9IHByb21pc2VzLmNvbXBhY3QocmVzdWx0LmJvZHksIHt9KTtcblxuICAgICAgICAgICAgICAgICAgICBwcm9taXNlLnRoZW4oKGNvbXBhY3RlZCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZXNvdXJjZVNlcTogUmVhZFJlc291cmNlc1NlcXVlbmNlID0gQ29udmVydEpTT05MRC5jcmVhdGVSZWFkUmVzb3VyY2VzU2VxdWVuY2VGcm9tSnNvbkxEKGNvbXBhY3RlZCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VzID0gcmVzb3VyY2VTZXEucmVzb3VyY2VzO1xuXG4gICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0pTT05MRCBvZiBmdWxsIHJlc291cmNlIHJlcXVlc3QgY291bGQgbm90IGJlIGV4cGFuZGVkOicgKyBlcnIpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBjbGVhciBzZWxlY3Rpb25cbiAgICAgICAgICAgIHRoaXMucmVzb3VyY2VzID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgdGhhdCB0aGUgc2VsZWN0aW9uIGlzIGEgW1tSZWFkUmVzb3VyY2VdXS5cbiAgICAgKlxuICAgICAqIFN1cnByaXNpbmdseSwgW251bGxdIGhhcyB0byBiZSByZXR1cm5lZCBpZiB0aGUgdmFsdWUgaXMgdmFsaWQ6IGh0dHBzOi8vYW5ndWxhci5pby9ndWlkZS9mb3JtLXZhbGlkYXRpb24jY3VzdG9tLXZhbGlkYXRvcnNcbiAgICAgKlxuICAgICAqIEBwYXJhbSB0aGUgZm9ybSBlbGVtZW50IHdob3NlIHZhbHVlIGhhcyB0byBiZSBjaGVja2VkLlxuICAgICAqIEByZXR1cm5zXG4gICAgICovXG4gICAgdmFsaWRhdGVSZXNvdXJjZShjOiBGb3JtQ29udHJvbCkge1xuXG4gICAgICAgIGNvbnN0IGlzVmFsaWRSZXNvdXJjZSA9IChjLnZhbHVlIGluc3RhbmNlb2YgUmVhZFJlc291cmNlKTtcblxuICAgICAgICBpZiAoaXNWYWxpZFJlc291cmNlKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgbm9SZXNvdXJjZToge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogYy52YWx1ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIG5nT25Jbml0KCkge1xuICAgICAgICB0aGlzLmZvcm0gPSB0aGlzLmZiLmdyb3VwKHtcbiAgICAgICAgICAgIHJlc291cmNlOiBbbnVsbCwgVmFsaWRhdG9ycy5jb21wb3NlKFtcbiAgICAgICAgICAgICAgICBWYWxpZGF0b3JzLnJlcXVpcmVkLFxuICAgICAgICAgICAgICAgIHRoaXMudmFsaWRhdGVSZXNvdXJjZVxuICAgICAgICAgICAgXSldXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuZm9ybS52YWx1ZUNoYW5nZXMuc3Vic2NyaWJlKChkYXRhKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNlYXJjaEJ5TGFiZWwoZGF0YS5yZXNvdXJjZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJlc29sdmVkUHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIC8vIGFkZCBmb3JtIHRvIHRoZSBwYXJlbnQgZm9ybSBncm91cFxuICAgICAgICAgICAgdGhpcy5mb3JtR3JvdXAuYWRkQ29udHJvbCgncHJvcFZhbHVlJywgdGhpcy5mb3JtKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG5cbiAgICAgICAgLy8gcmVtb3ZlIGZvcm0gZnJvbSB0aGUgcGFyZW50IGZvcm0gZ3JvdXBcbiAgICAgICAgcmVzb2x2ZWRQcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5mb3JtR3JvdXAucmVtb3ZlQ29udHJvbCgncHJvcFZhbHVlJyk7XG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgZ2V0VmFsdWUoKTogVmFsdWUge1xuXG4gICAgICAgIHJldHVybiBuZXcgSVJJKHRoaXMuZm9ybS52YWx1ZS5yZXNvdXJjZS5pZCk7XG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIEluamVjdCwgSW5wdXQsIE9uRGVzdHJveSwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IEZvcm1CdWlsZGVyLCBGb3JtR3JvdXAsIFZhbGlkYXRvcnMgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBLbm9yYUNvbnN0YW50cywgUHJvcGVydHlWYWx1ZSwgVmFsdWUsIFZhbHVlTGl0ZXJhbCB9IGZyb20gJ0Brbm9yYS9jb3JlJztcblxuLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNDU2NjEwMTAvZHluYW1pYy1uZXN0ZWQtcmVhY3RpdmUtZm9ybS1leHByZXNzaW9uY2hhbmdlZGFmdGVyaXRoYXNiZWVuY2hlY2tlZGVycm9yXG5jb25zdCByZXNvbHZlZFByb21pc2UgPSBQcm9taXNlLnJlc29sdmUobnVsbCk7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAndGV4dC12YWx1ZScsXG4gICAgdGVtcGxhdGU6IGA8bWF0LWZvcm0tZmllbGQ+XG4gICAgPGlucHV0IG1hdElucHV0IFtmb3JtQ29udHJvbF09XCJmb3JtLmNvbnRyb2xzWyd0ZXh0VmFsdWUnXVwiIHBsYWNlaG9sZGVyPVwidGV4dCB2YWx1ZVwiIHZhbHVlPVwiXCI+XG48L21hdC1mb3JtLWZpZWxkPlxuYCxcbiAgICBzdHlsZXM6IFtgYF1cbn0pXG5leHBvcnQgY2xhc3MgVGV4dFZhbHVlQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3ksIFByb3BlcnR5VmFsdWUge1xuXG4gICAgLy8gcGFyZW50IEZvcm1Hcm91cFxuICAgIEBJbnB1dCgpIGZvcm1Hcm91cDogRm9ybUdyb3VwO1xuXG4gICAgdHlwZSA9IEtub3JhQ29uc3RhbnRzLlRleHRWYWx1ZTtcblxuICAgIGZvcm06IEZvcm1Hcm91cDtcblxuICAgIGNvbnN0cnVjdG9yKEBJbmplY3QoRm9ybUJ1aWxkZXIpIHByaXZhdGUgZmI6IEZvcm1CdWlsZGVyKSB7XG5cbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHtcblxuICAgICAgICB0aGlzLmZvcm0gPSB0aGlzLmZiLmdyb3VwKHtcbiAgICAgICAgICAgIHRleHRWYWx1ZTogW251bGwsIFZhbGlkYXRvcnMucmVxdWlyZWRdXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJlc29sdmVkUHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIC8vIGFkZCBmb3JtIHRvIHRoZSBwYXJlbnQgZm9ybSBncm91cFxuICAgICAgICAgICAgdGhpcy5mb3JtR3JvdXAuYWRkQ29udHJvbCgncHJvcFZhbHVlJywgdGhpcy5mb3JtKTtcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcblxuICAgICAgICAvLyByZW1vdmUgZm9ybSBmcm9tIHRoZSBwYXJlbnQgZm9ybSBncm91cFxuICAgICAgICByZXNvbHZlZFByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZvcm1Hcm91cC5yZW1vdmVDb250cm9sKCdwcm9wVmFsdWUnKTtcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBnZXRWYWx1ZSgpOiBWYWx1ZSB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBWYWx1ZUxpdGVyYWwoU3RyaW5nKHRoaXMuZm9ybS52YWx1ZS50ZXh0VmFsdWUpLCBLbm9yYUNvbnN0YW50cy54c2RTdHJpbmcpO1xuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBJbmplY3QsIElucHV0LCBPbkRlc3Ryb3ksIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBGb3JtQnVpbGRlciwgRm9ybUdyb3VwLCBWYWxpZGF0b3JzIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgS25vcmFDb25zdGFudHMsIFByb3BlcnR5VmFsdWUsIFV0aWxzLCBWYWx1ZSwgVmFsdWVMaXRlcmFsIH0gZnJvbSAnQGtub3JhL2NvcmUnO1xuXG4vLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy80NTY2MTAxMC9keW5hbWljLW5lc3RlZC1yZWFjdGl2ZS1mb3JtLWV4cHJlc3Npb25jaGFuZ2VkYWZ0ZXJpdGhhc2JlZW5jaGVja2VkZXJyb3JcbmNvbnN0IHJlc29sdmVkUHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZShudWxsKTtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICd1cmktdmFsdWUnLFxuICAgIHRlbXBsYXRlOiBgPG1hdC1mb3JtLWZpZWxkPlxuICAgIDxpbnB1dCBtYXRJbnB1dCBbZm9ybUNvbnRyb2xdPVwiZm9ybS5jb250cm9sc1sndXJpVmFsdWUnXVwiIHBsYWNlaG9sZGVyPVwiVVJJXCIgdmFsdWU9XCJcIj5cbjwvbWF0LWZvcm0tZmllbGQ+XG5gLFxuICAgIHN0eWxlczogW2BgXVxufSlcbmV4cG9ydCBjbGFzcyBVcmlWYWx1ZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95LCBQcm9wZXJ0eVZhbHVlIHtcblxuICAgIC8vIHBhcmVudCBGb3JtR3JvdXBcbiAgICBASW5wdXQoKSBmb3JtR3JvdXA6IEZvcm1Hcm91cDtcblxuICAgIHR5cGUgPSBLbm9yYUNvbnN0YW50cy5VcmlWYWx1ZTtcblxuICAgIGZvcm06IEZvcm1Hcm91cDtcblxuICAgIGNvbnN0cnVjdG9yKEBJbmplY3QoRm9ybUJ1aWxkZXIpIHByaXZhdGUgZmI6IEZvcm1CdWlsZGVyKSB7XG5cbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHtcblxuICAgICAgICB0aGlzLmZvcm0gPSB0aGlzLmZiLmdyb3VwKHtcbiAgICAgICAgICAgIHVyaVZhbHVlOiBbbnVsbCwgVmFsaWRhdG9ycy5jb21wb3NlKFtWYWxpZGF0b3JzLnJlcXVpcmVkLCBWYWxpZGF0b3JzLnBhdHRlcm4oVXRpbHMuUmVnZXhVcmwpXSldXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJlc29sdmVkUHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIC8vIGFkZCBmb3JtIHRvIHRoZSBwYXJlbnQgZm9ybSBncm91cFxuICAgICAgICAgICAgdGhpcy5mb3JtR3JvdXAuYWRkQ29udHJvbCgncHJvcFZhbHVlJywgdGhpcy5mb3JtKTtcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcblxuICAgICAgICAvLyByZW1vdmUgZm9ybSBmcm9tIHRoZSBwYXJlbnQgZm9ybSBncm91cFxuICAgICAgICByZXNvbHZlZFByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZvcm1Hcm91cC5yZW1vdmVDb250cm9sKCdwcm9wVmFsdWUnKTtcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBnZXRWYWx1ZSgpOiBWYWx1ZSB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBWYWx1ZUxpdGVyYWwoU3RyaW5nKHRoaXMuZm9ybS52YWx1ZS51cmlWYWx1ZSksIEtub3JhQ29uc3RhbnRzLnhzZFVyaSk7XG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgSW5qZWN0LCBJbnB1dCwgT25DaGFuZ2VzLCBPbkluaXQsIE91dHB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRm9ybUJ1aWxkZXIsIEZvcm1Hcm91cCwgVmFsaWRhdG9ycyB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IFJlc291cmNlQ2xhc3MgfSBmcm9tICdAa25vcmEvY29yZSc7XG5cbi8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzQ1NjYxMDEwL2R5bmFtaWMtbmVzdGVkLXJlYWN0aXZlLWZvcm0tZXhwcmVzc2lvbmNoYW5nZWRhZnRlcml0aGFzYmVlbmNoZWNrZWRlcnJvclxuY29uc3QgcmVzb2x2ZWRQcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKG51bGwpO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ2t1aS1zZWxlY3QtcmVzb3VyY2UtY2xhc3MnLFxuICAgIHRlbXBsYXRlOiBgPG1hdC1mb3JtLWZpZWxkICpuZ0lmPVwicmVzb3VyY2VDbGFzc2VzLmxlbmd0aCA+IDBcIj5cbiAgPG1hdC1zZWxlY3QgcGxhY2Vob2xkZXI9XCJSZXNvdXJjZSBDbGFzc1wiIFtmb3JtQ29udHJvbF09XCJmb3JtLmNvbnRyb2xzWydyZXNvdXJjZUNsYXNzJ11cIj5cbiAgICA8bWF0LW9wdGlvbiBbdmFsdWVdPVwibnVsbFwiPm5vIHNlbGVjdGlvbjwvbWF0LW9wdGlvbj5cbiAgICA8IS0tIHVuZG8gc2VsZWN0aW9uIG9mIGEgcmVzb3VyY2UgY2xhc3MgLS0+XG4gICAgPG1hdC1vcHRpb24gKm5nRm9yPVwibGV0IHJlc291cmNlQ2xhc3Mgb2YgcmVzb3VyY2VDbGFzc2VzXCIgW3ZhbHVlXT1cInJlc291cmNlQ2xhc3MuaWRcIj57eyByZXNvdXJjZUNsYXNzLmxhYmVsIH19PC9tYXQtb3B0aW9uPlxuICA8L21hdC1zZWxlY3Q+XG48L21hdC1mb3JtLWZpZWxkPmAsXG4gICAgc3R5bGVzOiBbYGBdXG59KVxuZXhwb3J0IGNsYXNzIFNlbGVjdFJlc291cmNlQ2xhc3NDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcyB7XG5cbiAgICBASW5wdXQoKSBmb3JtR3JvdXA6IEZvcm1Hcm91cDtcblxuICAgIC8vIHNldHRlciBtZXRob2QgZm9yIHJlc291cmNlIGNsYXNzZXMgd2hlbiBiZWluZyB1cGRhdGVkIGJ5IHBhcmVudCBjb21wb25lbnRcbiAgICBASW5wdXQoKVxuICAgIHNldCByZXNvdXJjZUNsYXNzZXModmFsdWU6IEFycmF5PFJlc291cmNlQ2xhc3M+KSB7XG4gICAgICAgIHRoaXMucmVzb3VyY2VDbGFzc1NlbGVjdGVkID0gdW5kZWZpbmVkOyAvLyByZXNldCBvbiB1cGRhdGVzXG4gICAgICAgIHRoaXMuX3Jlc291cmNlQ2xhc3NlcyA9IHZhbHVlO1xuICAgIH1cblxuICAgIC8vIGdldHRlciBtZXRob2QgZm9yIHJlc291cmNlIGNsYXNzZXMgKHVzZWQgaW4gdGVtcGxhdGUpXG4gICAgZ2V0IHJlc291cmNlQ2xhc3NlcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Jlc291cmNlQ2xhc3NlcztcbiAgICB9XG5cbiAgICAvLyBldmVudCBlbWl0dGVkIHRvIHBhcmVudCBjb21wb25lbnQgb25jZSBhIHJlc291cmNlIGNsYXNzIGlzIHNlbGVjdGVkIGJ5IHRoZSB1c2VyXG4gICAgQE91dHB1dCgpIHJlc291cmNlQ2xhc3NTZWxlY3RlZEV2ZW50ID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmc+KCk7XG5cbiAgICAvLyBhdmFpbGFibGUgcmVzb3VyY2UgY2xhc3NlcyBmb3Igc2VsZWN0aW9uXG4gICAgcHJpdmF0ZSBfcmVzb3VyY2VDbGFzc2VzOiBBcnJheTxSZXNvdXJjZUNsYXNzPjtcblxuICAgIC8vIHN0b3JlcyB0aGUgY3VycmVudGx5IHNlbGVjdGVkIHJlc291cmNlIGNsYXNzXG4gICAgcHJpdmF0ZSByZXNvdXJjZUNsYXNzU2VsZWN0ZWQ6IHN0cmluZztcblxuICAgIGZvcm06IEZvcm1Hcm91cDtcblxuICAgIGNvbnN0cnVjdG9yKEBJbmplY3QoRm9ybUJ1aWxkZXIpIHByaXZhdGUgZmI6IEZvcm1CdWlsZGVyKSB7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgSXJpIG9mIHRoZSBzZWxlY3RlZCByZXNvdXJjZSBjbGFzcy5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHRoZSBJcmkgb2YgdGhlIHNlbGVjdGVkIHJlc291cmNlIGNsYXNzIG9yIGZhbHNlIGluIGNhc2Ugbm8gcmVzb3VyY2UgY2xhc3MgaXMgc2VsZWN0ZWQuXG4gICAgICovXG4gICAgZ2V0UmVzb3VyY2VDbGFzc1NlbGVjdGVkKCk6IGFueSB7XG4gICAgICAgIGlmICh0aGlzLnJlc291cmNlQ2xhc3NTZWxlY3RlZCAhPT0gdW5kZWZpbmVkICYmIHRoaXMucmVzb3VyY2VDbGFzc1NlbGVjdGVkICE9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZUNsYXNzU2VsZWN0ZWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbml0YWxpemVzIHRoZSBGb3JtR3JvdXAgZm9yIHRoZSByZXNvdXJjZSBjbGFzcyBzZWxlY3Rpb24uXG4gICAgICogVGhlIGluaXRpYWwgdmFsdWUgaXMgc2V0IHRvIG51bGwuXG4gICAgICovXG4gICAgcHJpdmF0ZSBpbml0Rm9ybSgpIHtcbiAgICAgICAgLy8gYnVpbGQgYSBmb3JtIGZvciB0aGUgcmVzb3VyY2UgY2xhc3Mgc2VsZWN0aW9uXG4gICAgICAgIHRoaXMuZm9ybSA9IHRoaXMuZmIuZ3JvdXAoe1xuICAgICAgICAgICAgcmVzb3VyY2VDbGFzczogW251bGxdIC8vIHJlc291cmNlIGNsYXNzIHNlbGVjdGlvbiBpcyBvcHRpb25hbFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBzdG9yZSBhbmQgZW1pdCBJcmkgb2YgdGhlIHJlc291cmNlIGNsYXNzIHdoZW4gc2VsZWN0ZWRcbiAgICAgICAgdGhpcy5mb3JtLnZhbHVlQ2hhbmdlcy5zdWJzY3JpYmUoKGRhdGEpID0+IHtcbiAgICAgICAgICAgIHRoaXMucmVzb3VyY2VDbGFzc1NlbGVjdGVkID0gZGF0YS5yZXNvdXJjZUNsYXNzO1xuICAgICAgICAgICAgdGhpcy5yZXNvdXJjZUNsYXNzU2VsZWN0ZWRFdmVudC5lbWl0KHRoaXMucmVzb3VyY2VDbGFzc1NlbGVjdGVkKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKSB7XG5cbiAgICAgICAgdGhpcy5pbml0Rm9ybSgpO1xuXG4gICAgICAgIC8vIGFkZCBmb3JtIHRvIHRoZSBwYXJlbnQgZm9ybSBncm91cFxuICAgICAgICB0aGlzLmZvcm1Hcm91cC5hZGRDb250cm9sKCdyZXNvdXJjZUNsYXNzJywgdGhpcy5mb3JtKTtcblxuICAgIH1cblxuICAgIG5nT25DaGFuZ2VzKCkge1xuXG4gICAgICAgIGlmICh0aGlzLmZvcm0gIT09IHVuZGVmaW5lZCkge1xuXG4gICAgICAgICAgICAvLyByZXNvdXJjZSBjbGFzc2VzIGhhdmUgYmVlbiByZWluaXRpYWxpemVkXG4gICAgICAgICAgICAvLyByZXNldCBmb3JtXG4gICAgICAgICAgICByZXNvbHZlZFByb21pc2UudGhlbigoKSA9PiB7XG5cbiAgICAgICAgICAgICAgICAvLyByZW1vdmUgdGhpcyBmb3JtIGZyb20gdGhlIHBhcmVudCBmb3JtIGdyb3VwXG4gICAgICAgICAgICAgICAgdGhpcy5mb3JtR3JvdXAucmVtb3ZlQ29udHJvbCgncmVzb3VyY2VDbGFzcycpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5pbml0Rm9ybSgpO1xuXG4gICAgICAgICAgICAgICAgLy8gYWRkIGZvcm0gdG8gdGhlIHBhcmVudCBmb3JtIGdyb3VwXG4gICAgICAgICAgICAgICAgdGhpcy5mb3JtR3JvdXAuYWRkQ29udHJvbCgncmVzb3VyY2VDbGFzcycsIHRoaXMuZm9ybSk7XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgQnJvd3NlckFuaW1hdGlvbnNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHtcbiAgICBNYXRBdXRvY29tcGxldGVNb2R1bGUsXG4gICAgTWF0QnV0dG9uTW9kdWxlLFxuICAgIE1hdENoZWNrYm94TW9kdWxlLFxuICAgIE1hdERhdGVwaWNrZXJNb2R1bGUsXG4gICAgTWF0Rm9ybUZpZWxkTW9kdWxlLFxuICAgIE1hdEljb25Nb2R1bGUsIE1hdElucHV0TW9kdWxlLFxuICAgIE1hdExpc3RNb2R1bGUsXG4gICAgTWF0U2VsZWN0TW9kdWxlLFxuICAgIE1hdFRvb2x0aXBNb2R1bGVcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwnO1xuXG5pbXBvcnQgeyBGb3Jtc01vZHVsZSwgUmVhY3RpdmVGb3Jtc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IEt1aUNvcmVNb2R1bGUgfSBmcm9tICdAa25vcmEvY29yZSc7XG5pbXBvcnQgeyBLdWlBY3Rpb25Nb2R1bGUgfSBmcm9tICdAa25vcmEvYWN0aW9uJztcbmltcG9ydCB7IEt1aVZpZXdlck1vZHVsZSB9IGZyb20gJ0Brbm9yYS92aWV3ZXInO1xuXG5pbXBvcnQgeyBNYXRKRE5Db252ZXJ0aWJsZUNhbGVuZGFyRGF0ZUFkYXB0ZXJNb2R1bGUgfSBmcm9tICdqZG5jb252ZXJ0aWJsZWNhbGVuZGFyZGF0ZWFkYXB0ZXInO1xuXG5pbXBvcnQgeyBTZWFyY2hDb21wb25lbnQgfSBmcm9tICcuL3NlYXJjaC5jb21wb25lbnQnO1xuaW1wb3J0IHsgRXh0ZW5kZWRTZWFyY2hDb21wb25lbnQgfSBmcm9tICcuL2V4dGVuZGVkLXNlYXJjaC9leHRlbmRlZC1zZWFyY2guY29tcG9uZW50JztcblxuaW1wb3J0IHsgU2VsZWN0T250b2xvZ3lDb21wb25lbnQgfSBmcm9tICcuL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3Qtb250b2xvZ3kvc2VsZWN0LW9udG9sb2d5LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBTZWxlY3RSZXNvdXJjZUNsYXNzQ29tcG9uZW50IH0gZnJvbSAnLi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXJlc291cmNlLWNsYXNzL3NlbGVjdC1yZXNvdXJjZS1jbGFzcy5jb21wb25lbnQnO1xuaW1wb3J0IHsgU2VsZWN0UHJvcGVydHlDb21wb25lbnQgfSBmcm9tICcuL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3QtcHJvcGVydHkvc2VsZWN0LXByb3BlcnR5LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBTcGVjaWZ5UHJvcGVydHlWYWx1ZUNvbXBvbmVudCB9IGZyb20gJy4vZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1wcm9wZXJ0eS9zcGVjaWZ5LXByb3BlcnR5LXZhbHVlL3NwZWNpZnktcHJvcGVydHktdmFsdWUuY29tcG9uZW50JztcbmltcG9ydCB7IEJvb2xlYW5WYWx1ZUNvbXBvbmVudCB9IGZyb20gJy4vZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1wcm9wZXJ0eS9zcGVjaWZ5LXByb3BlcnR5LXZhbHVlL2Jvb2xlYW4tdmFsdWUvYm9vbGVhbi12YWx1ZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgRGF0ZVZhbHVlQ29tcG9uZW50IH0gZnJvbSAnLi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXByb3BlcnR5L3NwZWNpZnktcHJvcGVydHktdmFsdWUvZGF0ZS12YWx1ZS9kYXRlLXZhbHVlLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBEZWNpbWFsVmFsdWVDb21wb25lbnQgfSBmcm9tICcuL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3QtcHJvcGVydHkvc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZS9kZWNpbWFsLXZhbHVlL2RlY2ltYWwtdmFsdWUuY29tcG9uZW50JztcbmltcG9ydCB7IEludGVnZXJWYWx1ZUNvbXBvbmVudCB9IGZyb20gJy4vZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1wcm9wZXJ0eS9zcGVjaWZ5LXByb3BlcnR5LXZhbHVlL2ludGVnZXItdmFsdWUvaW50ZWdlci12YWx1ZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgTGlua1ZhbHVlQ29tcG9uZW50IH0gZnJvbSAnLi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXByb3BlcnR5L3NwZWNpZnktcHJvcGVydHktdmFsdWUvbGluay12YWx1ZS9saW5rLXZhbHVlLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBUZXh0VmFsdWVDb21wb25lbnQgfSBmcm9tICcuL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3QtcHJvcGVydHkvc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZS90ZXh0LXZhbHVlL3RleHQtdmFsdWUuY29tcG9uZW50JztcbmltcG9ydCB7IFVyaVZhbHVlQ29tcG9uZW50IH0gZnJvbSAnLi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXByb3BlcnR5L3NwZWNpZnktcHJvcGVydHktdmFsdWUvdXJpLXZhbHVlL3VyaS12YWx1ZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgSGVhZGVyQ29tcG9uZW50IH0gZnJvbSAnLi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXByb3BlcnR5L3NwZWNpZnktcHJvcGVydHktdmFsdWUvZGF0ZS12YWx1ZS9oZWFkZXItY2FsZW5kYXIvaGVhZGVyLWNhbGVuZGFyLmNvbXBvbmVudCc7XG5cblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbXG4gICAgICAgIENvbW1vbk1vZHVsZSxcbiAgICAgICAgQnJvd3NlckFuaW1hdGlvbnNNb2R1bGUsXG4gICAgICAgIE1hdEF1dG9jb21wbGV0ZU1vZHVsZSxcbiAgICAgICAgTWF0QnV0dG9uTW9kdWxlLFxuICAgICAgICBNYXRDaGVja2JveE1vZHVsZSxcbiAgICAgICAgTWF0RGF0ZXBpY2tlck1vZHVsZSxcbiAgICAgICAgTWF0Rm9ybUZpZWxkTW9kdWxlLFxuICAgICAgICBNYXRJbnB1dE1vZHVsZSxcbiAgICAgICAgTWF0SWNvbk1vZHVsZSxcbiAgICAgICAgTWF0TGlzdE1vZHVsZSxcbiAgICAgICAgTWF0U2VsZWN0TW9kdWxlLFxuICAgICAgICBNYXRUb29sdGlwTW9kdWxlLFxuICAgICAgICBGb3Jtc01vZHVsZSxcbiAgICAgICAgUmVhY3RpdmVGb3Jtc01vZHVsZSxcbiAgICAgICAgS3VpQ29yZU1vZHVsZSxcbiAgICAgICAgS3VpQWN0aW9uTW9kdWxlLFxuICAgICAgICBLdWlWaWV3ZXJNb2R1bGUsXG4gICAgICAgIE1hdEpETkNvbnZlcnRpYmxlQ2FsZW5kYXJEYXRlQWRhcHRlck1vZHVsZVxuICAgIF0sXG4gICAgZGVjbGFyYXRpb25zOiBbXG4gICAgICAgIFNlYXJjaENvbXBvbmVudCxcbiAgICAgICAgU2VsZWN0T250b2xvZ3lDb21wb25lbnQsXG4gICAgICAgIEV4dGVuZGVkU2VhcmNoQ29tcG9uZW50LFxuICAgICAgICBTZWxlY3RSZXNvdXJjZUNsYXNzQ29tcG9uZW50LFxuICAgICAgICBTZWxlY3RQcm9wZXJ0eUNvbXBvbmVudCxcbiAgICAgICAgU3BlY2lmeVByb3BlcnR5VmFsdWVDb21wb25lbnQsXG4gICAgICAgIEJvb2xlYW5WYWx1ZUNvbXBvbmVudCxcbiAgICAgICAgRGF0ZVZhbHVlQ29tcG9uZW50LFxuICAgICAgICBEZWNpbWFsVmFsdWVDb21wb25lbnQsXG4gICAgICAgIEludGVnZXJWYWx1ZUNvbXBvbmVudCxcbiAgICAgICAgTGlua1ZhbHVlQ29tcG9uZW50LFxuICAgICAgICBUZXh0VmFsdWVDb21wb25lbnQsXG4gICAgICAgIFVyaVZhbHVlQ29tcG9uZW50LFxuICAgICAgICBIZWFkZXJDb21wb25lbnRcbiAgICBdLFxuICAgIGV4cG9ydHM6IFtTZWFyY2hDb21wb25lbnRdLFxuICAgIGVudHJ5Q29tcG9uZW50czogW1xuICAgICAgICBIZWFkZXJDb21wb25lbnRcbiAgICBdXG59KVxuZXhwb3J0IGNsYXNzIEt1aVNlYXJjaE1vZHVsZSB7XG59XG4iLCIvKlxuICogUHVibGljIEFQSSBTdXJmYWNlIG9mIHNlYXJjaFxuICovXG5cbmV4cG9ydCAqIGZyb20gJy4vbGliL3NlYXJjaC5jb21wb25lbnQnO1xuZXhwb3J0ICogZnJvbSAnLi9saWIvZXh0ZW5kZWQtc2VhcmNoL2V4dGVuZGVkLXNlYXJjaC5jb21wb25lbnQnO1xuZXhwb3J0ICogZnJvbSAnLi9saWIvZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1vbnRvbG9neS9zZWxlY3Qtb250b2xvZ3kuY29tcG9uZW50JztcbmV4cG9ydCAqIGZyb20gJy4vbGliL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3QtcHJvcGVydHkvc2VsZWN0LXByb3BlcnR5LmNvbXBvbmVudCc7XG5leHBvcnQgKiBmcm9tICcuL2xpYi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXByb3BlcnR5L3NwZWNpZnktcHJvcGVydHktdmFsdWUvc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZS5jb21wb25lbnQnO1xuZXhwb3J0ICogZnJvbSAnLi9saWIvZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1wcm9wZXJ0eS9zcGVjaWZ5LXByb3BlcnR5LXZhbHVlL2Jvb2xlYW4tdmFsdWUvYm9vbGVhbi12YWx1ZS5jb21wb25lbnQnO1xuZXhwb3J0ICogZnJvbSAnLi9saWIvZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1wcm9wZXJ0eS9zcGVjaWZ5LXByb3BlcnR5LXZhbHVlL2RhdGUtdmFsdWUvZGF0ZS12YWx1ZS5jb21wb25lbnQnO1xuZXhwb3J0ICogZnJvbSAnLi9saWIvZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1wcm9wZXJ0eS9zcGVjaWZ5LXByb3BlcnR5LXZhbHVlL2RhdGUtdmFsdWUvaGVhZGVyLWNhbGVuZGFyL2hlYWRlci1jYWxlbmRhci5jb21wb25lbnQnO1xuZXhwb3J0ICogZnJvbSAnLi9saWIvZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1wcm9wZXJ0eS9zcGVjaWZ5LXByb3BlcnR5LXZhbHVlL2RlY2ltYWwtdmFsdWUvZGVjaW1hbC12YWx1ZS5jb21wb25lbnQnO1xuZXhwb3J0ICogZnJvbSAnLi9saWIvZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1wcm9wZXJ0eS9zcGVjaWZ5LXByb3BlcnR5LXZhbHVlL2ludGVnZXItdmFsdWUvaW50ZWdlci12YWx1ZS5jb21wb25lbnQnO1xuZXhwb3J0ICogZnJvbSAnLi9saWIvZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1wcm9wZXJ0eS9zcGVjaWZ5LXByb3BlcnR5LXZhbHVlL2xpbmstdmFsdWUvbGluay12YWx1ZS5jb21wb25lbnQnO1xuZXhwb3J0ICogZnJvbSAnLi9saWIvZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1wcm9wZXJ0eS9zcGVjaWZ5LXByb3BlcnR5LXZhbHVlL3RleHQtdmFsdWUvdGV4dC12YWx1ZS5jb21wb25lbnQnO1xuZXhwb3J0ICogZnJvbSAnLi9saWIvZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1wcm9wZXJ0eS9zcGVjaWZ5LXByb3BlcnR5LXZhbHVlL3VyaS12YWx1ZS91cmktdmFsdWUuY29tcG9uZW50JztcbmV4cG9ydCAqIGZyb20gJy4vbGliL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3QtcmVzb3VyY2UtY2xhc3Mvc2VsZWN0LXJlc291cmNlLWNsYXNzLmNvbXBvbmVudCc7XG5cbmV4cG9ydCAqIGZyb20gJy4vbGliL3NlYXJjaC5tb2R1bGUnO1xuIiwiLyoqXG4gKiBHZW5lcmF0ZWQgYnVuZGxlIGluZGV4LiBEbyBub3QgZWRpdC5cbiAqL1xuXG5leHBvcnQgKiBmcm9tICcuL3B1YmxpY19hcGknO1xuIl0sIm5hbWVzIjpbInRzbGliXzEuX192YWx1ZXMiLCJDb21wb25lbnQiLCJ0cmlnZ2VyIiwic3RhdGUiLCJzdHlsZSIsInRyYW5zaXRpb24iLCJhbmltYXRlIiwiQWN0aXZhdGVkUm91dGUiLCJSb3V0ZXIiLCJFbGVtZW50UmVmIiwiSW5wdXQiLCJFdmVudEVtaXR0ZXIiLCJSZWFkUmVzb3VyY2VzU2VxdWVuY2UiLCJGb3JtQnVpbGRlciIsIkluamVjdCIsIk9udG9sb2d5Q2FjaGVTZXJ2aWNlIiwiR3JhdnNlYXJjaEdlbmVyYXRpb25TZXJ2aWNlIiwiT3V0cHV0IiwiVmlld0NoaWxkIiwiVmlld0NoaWxkcmVuIiwiVmFsaWRhdG9ycyIsIkNhcmRpbmFsaXR5T2NjdXJyZW5jZSIsIlByb3BlcnR5V2l0aFZhbHVlIiwicmVzb2x2ZWRQcm9taXNlIiwiS25vcmFDb25zdGFudHMiLCJMaWtlIiwiTWF0Y2giLCJFcXVhbHMiLCJOb3RFcXVhbHMiLCJFeGlzdHMiLCJMZXNzVGhhbiIsIkxlc3NUaGFuRXF1YWxzIiwiR3JlYXRlclRoYW4iLCJHcmVhdGVyVGhhbkVxdWFscyIsIkNvbXBhcmlzb25PcGVyYXRvckFuZFZhbHVlIiwiVmFsdWVMaXRlcmFsIiwiSkROQ29udmVydGlibGVDYWxlbmRhciIsIkpETkNvbnZlcnRpYmxlQ2FsZW5kYXJEYXRlQWRhcHRlciIsIk1hdENhbGVuZGFyIiwiSG9zdCIsIkRhdGVBZGFwdGVyIiwiQ29udmVydEpTT05MRCIsIlJlYWRSZXNvdXJjZSIsIklSSSIsIlNlYXJjaFNlcnZpY2UiLCJVdGlscyIsIk5nTW9kdWxlIiwiQ29tbW9uTW9kdWxlIiwiQnJvd3NlckFuaW1hdGlvbnNNb2R1bGUiLCJNYXRBdXRvY29tcGxldGVNb2R1bGUiLCJNYXRCdXR0b25Nb2R1bGUiLCJNYXRDaGVja2JveE1vZHVsZSIsIk1hdERhdGVwaWNrZXJNb2R1bGUiLCJNYXRGb3JtRmllbGRNb2R1bGUiLCJNYXRJbnB1dE1vZHVsZSIsIk1hdEljb25Nb2R1bGUiLCJNYXRMaXN0TW9kdWxlIiwiTWF0U2VsZWN0TW9kdWxlIiwiTWF0VG9vbHRpcE1vZHVsZSIsIkZvcm1zTW9kdWxlIiwiUmVhY3RpdmVGb3Jtc01vZHVsZSIsIkt1aUNvcmVNb2R1bGUiLCJLdWlBY3Rpb25Nb2R1bGUiLCJLdWlWaWV3ZXJNb2R1bGUiLCJNYXRKRE5Db252ZXJ0aWJsZUNhbGVuZGFyRGF0ZUFkYXB0ZXJNb2R1bGUiXSwibWFwcGluZ3MiOiI7Ozs7OztJQUFBOzs7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