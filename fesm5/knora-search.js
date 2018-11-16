import { __values } from 'tslib';
import { Component, ElementRef, Input, EventEmitter, Inject, Output, ViewChild, ViewChildren, Host, NgModule } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GravsearchGenerationService, OntologyCacheService, ReadResourcesSequence, ComparisonOperatorAndValue, Equals, Exists, GreaterThan, GreaterThanEquals, KnoraConstants, LessThan, LessThanEquals, Like, Match, NotEquals, CardinalityOccurrence, PropertyWithValue, ValueLiteral, ConvertJSONLD, IRI, ReadResource, SearchService, Utils, KuiCoreModule } from '@knora/core';
import { JDNConvertibleCalendar } from 'jdnconvertiblecalendar';
import { DateAdapter, MatCalendar, MatAutocompleteModule, MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule, MatSelectModule, MatTooltipModule } from '@angular/material';
import { JDNConvertibleCalendarDateAdapter, MatJDNConvertibleCalendarDateAdapterModule } from 'jdnconvertiblecalendardateadapter';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { KuiActionModule } from '@knora/action';
import { KuiViewerModule } from '@knora/viewer';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
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
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (existingPrevSearch_1_1 && !existingPrevSearch_1_1.done && (_a = existingPrevSearch_1.return)) _a.call(existingPrevSearch_1);
                }
                finally { if (e_1) throw e_1.error; }
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
        if (name === void 0) { name = null; }
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
        { type: Component, args: [{
                    selector: 'kui-search',
                    template: "<div class=\"search-bar-elements\">\n\n    <!-- the next element - div.extended-search-panel - is a hidden dropdown filter menu -->\n\n    <div class=\"search-panel\" [class.active]=\"searchPanelFocus\">\n        <div>\n            <button class=\"prefix\" (click)=\"doSearch(search)\">\n                <mat-icon>search</mat-icon>\n            </button>\n        </div>\n\n        <div class=\"input-field\">\n            <input #search autocomplete=\"off\" type=\"search\" [placeholder]=\"searchLabel\" [(ngModel)]=\"searchQuery\" name=\"search\" (keyup.esc)=\"resetSearch(search)\"\n                (keyup)=\"onKey(search, $event)\" (click)=\"setFocus()\" (focus)=\"toggleMenu('simpleSearch')\" [disabled]=\"focusOnExtended === 'active'\"\n            />\n        </div>\n\n        <!-- switch button: on some focus we need a close button for the simple or extended panel -->\n        <div>\n            <button class=\"suffix\" *ngIf=\"focusOnSimple === 'active'\" (click)=\"resetSearch(search)\">\n                <mat-icon>close</mat-icon>\n            </button>\n            <button class=\"suffix\" *ngIf=\"focusOnSimple === 'inactive'\">\n            </button>\n        </div>\n\n        <!-- the search panel has two \"dropdown\" menus: one for simple search and another one for the extended search -->\n        <div class=\"salsah-menu simple-search\" [@simpleSearchMenu]=\"focusOnSimple\" *ngIf=\"showSimpleSearch\">\n            <mat-list class=\"salsah-previous-search-list\">\n                <mat-list-item *ngFor=\"let item of prevSearch | reverse; let i=index\">\n                    <h4 mat-line *ngIf=\"i<10\" (click)=\"doPrevSearch(item)\">{{item}}</h4>\n                    <button mat-icon-button (click)=\"resetPrevSearch(item)\">\n                        <mat-icon aria-label=\"close\">clear</mat-icon>\n                    </button>\n                </mat-list-item>\n            </mat-list>\n            <button mat-stroked-button color=\"accent\" class=\"right\" (click)=\"resetPrevSearch()\" *ngIf=\"prevSearch\">Clear</button>\n        </div>\n\n        <div class=\"salsah-menu extended-search\" [@extendedSearchMenu]=\"focusOnExtended\">\n            <div class=\"salsah-menu-header\">\n                <span class=\"salsah-menu-title\">\n                    <h4>Advanced search</h4>\n                </span>\n                <span class=\"salsah-menu-action\">\n                    <button mat-icon-button (click)=\"toggleMenu('extendedSearch')\">\n                        <mat-icon>close</mat-icon>\n                    </button>\n                </span>\n            </div>\n            <div class=\"extended-search-box\">\n                <kui-extended-search [route]=\"route\" (toggleExtendedSearchForm)=\"toggleMenu('extendedSearch')\"></kui-extended-search>\n            </div>\n        </div>\n    </div>\n\n    <!-- Extended search button to display the extended search form in the search panel -->\n    <button mat-button type=\"button\" color=\"primary\" class=\"advanced-search-button\" (click)=\"toggleMenu('extendedSearch')\">\n        advanced\n    </button>\n\n</div>\n",
                    styles: ["input[type=search]::-webkit-search-cancel-button,input[type=search]::-webkit-search-decoration,input[type=search]::-webkit-search-results-button,input[type=search]::-webkit-search-results-decoration{display:none}input[type=search]{-moz-appearance:none;-webkit-appearance:none}.center{display:block;margin-left:auto;margin-right:auto}.close{right:12px}.extended-search-box{margin:12px}.advanced-search-button{margin-left:10px}.full-width{width:100%}.hide{display:none}.inactive,.mute{color:#7a7a7a}.search-panel{background-color:#f9f9f9;border-radius:4px;display:inline-flex;height:40px;position:relative;width:720px;z-index:10}.search-panel:hover{box-shadow:0 1px 3px rgba(0,0,0,.5)}.search-panel div.input-field{flex:1}.search-panel div.input-field input{border-style:none;font-size:14pt;height:38px;position:absolute;width:640px}.search-panel div.input-field input:active,.search-panel div.input-field input:focus{outline:0}.search-panel div .prefix,.search-panel div .suffix{background-color:#fff;border-radius:3px;border-style:none;color:rgba(41,41,41,.4);cursor:pointer;height:38px;outline:0;position:relative;width:40px}.search-panel div .prefix:active,.search-panel div .suffix:active{color:#515151}.search-panel.active{box-shadow:0 1px 3px rgba(0,0,0,.5)}.salsah-menu{box-shadow:0 3px 5px -1px rgba(11,11,11,.2),0 6px 10px 0 rgba(11,11,11,.14),0 1px 18px 0 rgba(11,11,11,.12);background-color:#f9f9f9;border-radius:4px;position:absolute}.salsah-menu .salsah-menu-header{background-color:#f9f9f9;border-top-left-radius:4px;border-top-right-radius:4px;display:inline-block;height:48px;width:100%}.salsah-menu .salsah-menu-header .salsah-menu-title{float:left;font-size:14px;font-weight:400;margin-top:4px;padding:12px}.salsah-menu .salsah-menu-header .salsah-menu-action{float:right;margin:4px}.salsah-menu.extended-search,.salsah-menu.simple-search{min-height:720px;width:720px}.salsah-menu.simple-search{padding-top:60px;z-index:-1}.salsah-menu.simple-search .salsah-previous-search-list .mat-list-item{cursor:pointer}.salsah-menu.simple-search .salsah-previous-search-list .mat-list-item:hover{background-color:#f9f9f9}.salsah-menu.simple-search .salsah-previous-search-list .mat-list-item:hover mat-icon{display:block}.salsah-menu.simple-search .salsah-previous-search-list .mat-list-item mat-icon{display:none}.salsah-menu.simple-search .right{margin-top:12px;margin-left:16px}.salsah-menu.extended-search{z-index:20}.search-bar-elements{display:flex}.show{display:block}"],
                    animations: [
                        trigger('simpleSearchMenu', [
                            state('inactive', style({ display: 'none' })),
                            state('active', style({ display: 'block' })),
                            transition('inactive => true', animate('100ms ease-in')),
                            transition('true => inactive', animate('100ms ease-out'))
                        ]),
                        trigger('extendedSearchMenu', [
                            state('inactive', style({ display: 'none' })),
                            state('active', style({ display: 'block' })),
                            transition('inactive => true', animate('100ms ease-in')),
                            transition('true => inactive', animate('100ms ease-out'))
                        ]),
                    ]
                },] },
    ];
    /** @nocollapse */
    SearchComponent.ctorParameters = function () { return [
        { type: ActivatedRoute },
        { type: Router },
        { type: ElementRef }
    ]; };
    SearchComponent.propDecorators = {
        route: [{ type: Input }]
    };
    return SearchComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
var resolvedPromise = Promise.resolve(null);
var SelectResourceClassComponent = /** @class */ (function () {
    function SelectResourceClassComponent(fb) {
        this.fb = fb;
        // event emitted to parent component once a resource class is selected by the user
        this.resourceClassSelectedEvent = new EventEmitter();
    }
    Object.defineProperty(SelectResourceClassComponent.prototype, "resourceClasses", {
        // getter method for resource classes (used in template)
        get: /**
         * @return {?}
         */
        function () {
            return this._resourceClasses;
        },
        // setter method for resource classes when being updated by parent component
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
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
            resolvedPromise.then(function () {
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
        { type: Component, args: [{
                    selector: 'kui-select-resource-class',
                    template: "<mat-form-field *ngIf=\"resourceClasses.length > 0\">\n  <mat-select placeholder=\"Resource Class\" [formControl]=\"form.controls['resourceClass']\">\n    <mat-option [value]=\"null\">no selection</mat-option>\n    <!-- undo selection of a resource class -->\n    <mat-option *ngFor=\"let resourceClass of resourceClasses\" [value]=\"resourceClass.id\">{{ resourceClass.label }}</mat-option>\n  </mat-select>\n</mat-form-field>",
                    styles: [""]
                },] },
    ];
    /** @nocollapse */
    SelectResourceClassComponent.ctorParameters = function () { return [
        { type: FormBuilder, decorators: [{ type: Inject, args: [FormBuilder,] }] }
    ]; };
    SelectResourceClassComponent.propDecorators = {
        formGroup: [{ type: Input }],
        resourceClasses: [{ type: Input }],
        resourceClassSelectedEvent: [{ type: Output }]
    };
    return SelectResourceClassComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var ExtendedSearchComponent = /** @class */ (function () {
    function ExtendedSearchComponent(fb, _route, _router, _cacheService, _gravSearchService) {
        this.fb = fb;
        this._route = _route;
        this._router = _router;
        this._cacheService = _cacheService;
        this._gravSearchService = _gravSearchService;
        // trigger toggle for extended search form
        this.toggleExtendedSearchForm = new EventEmitter();
        // all available ontologies
        this.ontologies = [];
        // properties specified by the user
        this.activeProperties = [];
        // resource classes for the selected ontology
        this.resourceClasses = [];
        this.result = new ReadResourcesSequence([], 0);
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
        { type: Component, args: [{
                    selector: 'kui-extended-search',
                    template: "<form [formGroup]=\"form\" (ngSubmit)=\"submit()\">\n\n  <div>\n    <kui-select-ontology *ngIf=\"ontologies.length > 0\" [formGroup]=\"form\" [ontologies]=\"ontologies\" (ontologySelected)=\"getResourceClassesAndPropertiesForOntology($event)\"></kui-select-ontology>\n  </div>\n\n  <div class=\"select-resource-class\" *ngIf=\"resourceClasses?.length > 0\">\n    <kui-select-resource-class #resourceClass [formGroup]=\"form\" [resourceClasses]=\"resourceClasses\" (resourceClassSelectedEvent)=\"getPropertiesForResourceClass($event)\"></kui-select-resource-class>\n  </div>\n\n  <div class=\"select-property\" *ngIf=\"properties !== undefined\">\n    <div *ngFor=\"let prop of activeProperties; let i = index\">\n\n      <kui-select-property #property [activeResourceClass]=\"activeResourceClass\" [formGroup]=\"form\" [index]=\"i\" [properties]=\"properties\"></kui-select-property>\n\n    </div>\n  </div>\n\n\n  <div>\n    <button mat-mini-fab class=\"property-buttons add-property-button\" color=\"primary\" type=\"button\" (click)=\"addProperty()\" [disabled]=\"activeOntology === undefined || activeProperties.length >= 4\">\n      <mat-icon aria-label=\"add a property\">add</mat-icon>\n    </button>\n\n    <button mat-mini-fab class=\"property-buttons remove-property-button\" color=\"primary\" type=\"button\" (click)=\"removeProperty()\" [disabled]=\"activeProperties.length == 0\">\n      <mat-icon aria-label=\"remove property\">remove</mat-icon>\n    </button>\n  </div>\n\n  <!--  <div>\n    <button mat-icon-button type=\"button\" (click)=\"resetForm()\" [disabled]=\"this.activeOntology === undefined\">\n      <mat-icon aria-label=\"reset query form\">clear</mat-icon>\n    </button>\n\n    <button mat-icon-button type=\"submit\" [disabled]=\"!formValid\">\n      <mat-icon aria-label=\"submit query\">send</mat-icon>\n    </button>\n  </div> -->\n\n  <button class=\"extended-buttons extended-search-button\" mat-stroked-button color=\"primary\" type=\"submit\" [disabled]=\"!formValid\">\n    Search\n  </button>\n  <button class=\"extended-buttons reset\" mat-stroked-button type=\"button\" (click)=\"resetForm()\" [disabled]=\"this.activeOntology === undefined\">\n    Reset\n  </button>\n\n\n</form>\n",
                    styles: [".add-property-button{margin-right:5px}.extended-buttons{margin-top:25px}.extended-search-button{margin-right:5px}.property-buttons{margin-top:25px}.select-property{margin-left:22px}.select-resource-class{margin-left:12px}"]
                },] },
    ];
    /** @nocollapse */
    ExtendedSearchComponent.ctorParameters = function () { return [
        { type: FormBuilder, decorators: [{ type: Inject, args: [FormBuilder,] }] },
        { type: ActivatedRoute },
        { type: Router },
        { type: OntologyCacheService },
        { type: GravsearchGenerationService }
    ]; };
    ExtendedSearchComponent.propDecorators = {
        route: [{ type: Input }],
        toggleExtendedSearchForm: [{ type: Output }],
        resourceClassComponent: [{ type: ViewChild, args: ['resourceClass',] }],
        propertyComponents: [{ type: ViewChildren, args: ['property',] }]
    };
    return ExtendedSearchComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var SelectOntologyComponent = /** @class */ (function () {
    function SelectOntologyComponent(fb) {
        this.fb = fb;
        this.ontologySelected = new EventEmitter();
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
            ontology: [null, Validators.required]
        });
        // emit Iri of the ontology when being selected
        this.form.valueChanges.subscribe(function (data) {
            _this.ontologySelected.emit(data.ontology);
        });
        // add form to the parent form group
        this.formGroup.addControl('ontology', this.form);
    };
    SelectOntologyComponent.decorators = [
        { type: Component, args: [{
                    selector: 'kui-select-ontology',
                    template: "<mat-form-field *ngIf=\"ontologies.length > 0\">\n  <mat-select placeholder=\"Ontology\" [formControl]=\"form.controls['ontology']\">\n      <mat-option *ngFor=\"let onto of ontologies\" [value]=\"onto.id\">{{ onto.label }}</mat-option>\n  </mat-select>\n</mat-form-field>\n",
                    styles: [""]
                },] },
    ];
    /** @nocollapse */
    SelectOntologyComponent.ctorParameters = function () { return [
        { type: FormBuilder, decorators: [{ type: Inject, args: [FormBuilder,] }] }
    ]; };
    SelectOntologyComponent.propDecorators = {
        formGroup: [{ type: Input }],
        ontologies: [{ type: Input }],
        ontologySelected: [{ type: Output }]
    };
    return SelectOntologyComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
var resolvedPromise$1 = Promise.resolve(null);
var SpecifyPropertyValueComponent = /** @class */ (function () {
    function SpecifyPropertyValueComponent(fb) {
        this.fb = fb;
        this.KnoraConstants = KnoraConstants;
        // available comparison operators for the property
        this.comparisonOperators = [];
    }
    Object.defineProperty(SpecifyPropertyValueComponent.prototype, "property", {
        // getter method for this._property
        get: /**
         * @return {?}
         */
        function () {
            return this._property;
        },
        // setter method for the property chosen by the user
        set: /**
         * @param {?} prop
         * @return {?}
         */
        function (prop) {
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
            this.propertyValueType = KnoraConstants.Resource;
        }
        else {
            this.propertyValueType = this._property.objectType;
        }
        switch (this.propertyValueType) {
            case KnoraConstants.TextValue:
                this.comparisonOperators = [new Like(), new Match(), new Equals(), new NotEquals(), new Exists()];
                break;
            case KnoraConstants.BooleanValue:
            case KnoraConstants.Resource:
            case KnoraConstants.UriValue:
            case KnoraConstants.IntervalValue:
                this.comparisonOperators = [new Equals(), new NotEquals(), new Exists()];
                break;
            case KnoraConstants.IntValue:
            case KnoraConstants.DecimalValue:
            case KnoraConstants.DateValue:
                this.comparisonOperators = [new Equals(), new NotEquals(), new LessThan(), new LessThanEquals(), new GreaterThan(), new GreaterThanEquals(), new Exists()];
                break;
            case KnoraConstants.ListValue:
            case KnoraConstants.GeomValue:
            case KnoraConstants.FileValue:
            case KnoraConstants.AudioFileValue:
            case KnoraConstants.StillImageFileValue:
            case KnoraConstants.DDDFileValue:
            case KnoraConstants.MovingImageFileValue:
            case KnoraConstants.TextFileValue:
            case KnoraConstants.ColorValue:
                this.comparisonOperators = [new Exists()];
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
            comparisonOperator: [null, Validators.required]
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
        return new ComparisonOperatorAndValue(this.comparisonOperatorSelected, value);
    };
    SpecifyPropertyValueComponent.decorators = [
        { type: Component, args: [{
                    selector: 'kui-specify-property-value',
                    template: "<mat-form-field class=\"search-operator-field\" *ngIf=\"comparisonOperators?.length > 0\">\n    <mat-select placeholder=\"Comparison Operator\" [formControl]=\"form.controls['comparisonOperator']\">\n        <mat-option *ngFor=\"let compOp of comparisonOperators\" [value]=\"compOp\">{{ compOp.label }}</mat-option>\n    </mat-select>\n</mat-form-field>\n\n<!-- select apt component for value specification using a switch case statement-->\n<span\n    *ngIf=\"comparisonOperatorSelected !== undefined && comparisonOperatorSelected !== null && comparisonOperatorSelected.getClassName() != 'Exists'\"\n    [ngSwitch]=\"propertyValueType\">\n  <boolean-value #propertyValue [formGroup]=\"form\" *ngSwitchCase=\"KnoraConstants.BooleanValue\"></boolean-value>\n  <date-value #propertyValue [formGroup]=\"form\" *ngSwitchCase=\"KnoraConstants.DateValue\"></date-value>\n  <decimal-value #propertyValue [formGroup]=\"form\" *ngSwitchCase=\"KnoraConstants.DecimalValue\"></decimal-value>\n  <integer-value #propertyValue [formGroup]=\"form\" *ngSwitchCase=\"KnoraConstants.IntValue\"></integer-value>\n  <link-value #propertyValue [formGroup]=\"form\" [restrictResourceClass]=\"property.objectType\"\n              *ngSwitchCase=\"KnoraConstants.Resource\"></link-value>\n  <text-value #propertyValue [formGroup]=\"form\" *ngSwitchCase=\"KnoraConstants.TextValue\"></text-value>\n  <uri-value #propertyValue [formGroup]=\"form\" *ngSwitchCase=\"KnoraConstants.UriValue\"></uri-value>\n\n    <!-- TODO: Resource: handle linking properties with target class restriction: access property member to get objectClass via property() getter method -->\n  <span *ngSwitchDefault=\"\">Not supported {{propertyValueType}}</span>\n</span>\n",
                    styles: [".search-operator-field{margin-right:8px}"]
                },] },
    ];
    /** @nocollapse */
    SpecifyPropertyValueComponent.ctorParameters = function () { return [
        { type: FormBuilder, decorators: [{ type: Inject, args: [FormBuilder,] }] }
    ]; };
    SpecifyPropertyValueComponent.propDecorators = {
        formGroup: [{ type: Input }],
        propertyValueComponent: [{ type: ViewChild, args: ['propertyValue',] }],
        property: [{ type: Input }]
    };
    return SpecifyPropertyValueComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
var resolvedPromise$2 = Promise.resolve(null);
var SelectPropertyComponent = /** @class */ (function () {
    function SelectPropertyComponent(fb) {
        this.fb = fb;
    }
    Object.defineProperty(SelectPropertyComponent.prototype, "properties", {
        get: /**
         * @return {?}
         */
        function () {
            return this._properties;
        },
        // setter method for properties when being updated by parent component
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
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
         */
        function (value) {
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
            property: [null, Validators.required],
            isSortCriterion: [false, Validators.required]
        });
        // update the selected property
        this.form.valueChanges.subscribe(function (data) {
            /** @type {?} */
            var propIri = data.property;
            _this.propertySelected = _this._properties[propIri];
        });
        resolvedPromise$2.then(function () {
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
        resolvedPromise$2.then(function () {
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
                    && (card.occurrence === CardinalityOccurrence.card || card.occurrence === CardinalityOccurrence.maxCard);
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
        return new PropertyWithValue(this.propertySelected, propVal, isSortCriterion);
    };
    SelectPropertyComponent.decorators = [
        { type: Component, args: [{
                    selector: 'kui-select-property',
                    template: "<mat-form-field class=\"search-property-field\" *ngIf=\"propertiesAsArray?.length > 0\">\n  <mat-select placeholder=\"Properties\" [formControl]=\"form.controls['property']\">\n    <mat-option *ngFor=\"let prop of propertiesAsArray\" [value]=\"prop.id\">{{ prop.label }}</mat-option>\n  </mat-select>\n</mat-form-field>\n\n<kui-specify-property-value #specifyPropertyValue [formGroup]=\"form\" *ngIf=\"propertySelected !== undefined\" [property]=\"propertySelected\"></kui-specify-property-value>\n\n<mat-checkbox matTooltip=\"Sort criterion\" *ngIf=\"propertySelected !== undefined && sortCriterion()\" [formControl]=\"form.controls['isSortCriterion']\"></mat-checkbox>",
                    styles: [".search-property-field{margin-right:8px}"]
                },] },
    ];
    /** @nocollapse */
    SelectPropertyComponent.ctorParameters = function () { return [
        { type: FormBuilder, decorators: [{ type: Inject, args: [FormBuilder,] }] }
    ]; };
    SelectPropertyComponent.propDecorators = {
        formGroup: [{ type: Input }],
        index: [{ type: Input }],
        properties: [{ type: Input }],
        activeResourceClass: [{ type: Input }],
        specifyPropertyValue: [{ type: ViewChild, args: ['specifyPropertyValue',] }]
    };
    return SelectPropertyComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
var resolvedPromise$3 = Promise.resolve(null);
var BooleanValueComponent = /** @class */ (function () {
    function BooleanValueComponent(fb) {
        this.fb = fb;
        this.type = KnoraConstants.BooleanValue;
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
            booleanValue: [false, Validators.compose([Validators.required])]
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
    BooleanValueComponent.prototype.ngOnDestroy = /**
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
    BooleanValueComponent.prototype.getValue = /**
     * @return {?}
     */
    function () {
        return new ValueLiteral(String(this.form.value.booleanValue), KnoraConstants.xsdBoolean);
    };
    BooleanValueComponent.decorators = [
        { type: Component, args: [{
                    selector: 'boolean-value',
                    template: "<mat-checkbox [formControl]=\"form.controls['booleanValue']\"></mat-checkbox>\n",
                    styles: [""]
                },] },
    ];
    /** @nocollapse */
    BooleanValueComponent.ctorParameters = function () { return [
        { type: FormBuilder, decorators: [{ type: Inject, args: [FormBuilder,] }] }
    ]; };
    BooleanValueComponent.propDecorators = {
        formGroup: [{ type: Input }]
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
var HeaderComponent = /** @class */ (function () {
    function HeaderComponent(_calendar, _dateAdapter, fb) {
        this._calendar = _calendar;
        this._dateAdapter = _dateAdapter;
        this.fb = fb;
        // a list of supported calendar formats (Gregorian and Julian)
        this.supportedCalendarFormats = JDNConvertibleCalendar.supportedCalendars;
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
        if (this._dateAdapter instanceof JDNConvertibleCalendarDateAdapter) {
            this.activeFormat = this._dateAdapter.activeCalendarFormat;
        }
        else {
            console.log('date adapter is expected to be an instance of JDNConvertibleCalendarDateAdapter');
        }
        // build a form for the calendar format selection
        this.form = this.fb.group({
            calendar: [this.activeFormat, Validators.required]
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
        if (this._dateAdapter instanceof JDNConvertibleCalendarDateAdapter) {
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
        { type: Component, args: [{
                    selector: 'kui-calendar-header',
                    template: "\n      <mat-select placeholder=\"Calendar Format\" [formControl]=\"form.controls['calendar']\">\n        <mat-option *ngFor=\"let cal of supportedCalendarFormats\" [value]=\"cal\">{{cal}}</mat-option>\n      </mat-select>\n      <mat-calendar-header></mat-calendar-header>\n    ",
                    styles: []
                },] },
    ];
    /** @nocollapse */
    HeaderComponent.ctorParameters = function () { return [
        { type: MatCalendar, decorators: [{ type: Host }] },
        { type: DateAdapter },
        { type: FormBuilder, decorators: [{ type: Inject, args: [FormBuilder,] }] }
    ]; };
    return HeaderComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
var resolvedPromise$4 = Promise.resolve(null);
var DateValueComponent = /** @class */ (function () {
    function DateValueComponent(fb) {
        this.fb = fb;
        this.type = KnoraConstants.DateValue;
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
            dateValue: [null, Validators.compose([Validators.required])]
        });
        this.form.valueChanges.subscribe(function (data) {
            // console.log(data.dateValue);
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
    DateValueComponent.prototype.ngOnDestroy = /**
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
        return new ValueLiteral(String(dateString), KnoraConstants.DateValue);
    };
    DateValueComponent.decorators = [
        { type: Component, args: [{
                    selector: 'date-value',
                    template: "<mat-form-field>\n    <jdn-datepicker>\n        <input matInput [matDatepicker]=\"picker\" placeholder=\"Choose a date\" [formControl]=\"form.controls['dateValue']\">\n        <mat-datepicker #picker [calendarHeaderComponent]=\"headerComponent\"></mat-datepicker>\n    </jdn-datepicker>\n    <mat-datepicker-toggle matSuffix [for]=\"picker\"></mat-datepicker-toggle>\n</mat-form-field>",
                    styles: [""]
                },] },
    ];
    /** @nocollapse */
    DateValueComponent.ctorParameters = function () { return [
        { type: FormBuilder, decorators: [{ type: Inject, args: [FormBuilder,] }] }
    ]; };
    DateValueComponent.propDecorators = {
        formGroup: [{ type: Input }]
    };
    return DateValueComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
var resolvedPromise$5 = Promise.resolve(null);
var DecimalValueComponent = /** @class */ (function () {
    function DecimalValueComponent(fb) {
        this.fb = fb;
        this.type = KnoraConstants.DecimalValue;
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
            decimalValue: [null, Validators.compose([Validators.required])]
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
    DecimalValueComponent.prototype.ngOnDestroy = /**
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
    DecimalValueComponent.prototype.getValue = /**
     * @return {?}
     */
    function () {
        return new ValueLiteral(String(this.form.value.decimalValue), KnoraConstants.xsdDecimal);
    };
    DecimalValueComponent.decorators = [
        { type: Component, args: [{
                    selector: 'decimal-value',
                    template: "<mat-form-field>\n    <input matInput [formControl]=\"form.controls['decimalValue']\" placeholder=\"Decimal value\" value=\"\" type=\"number\">\n</mat-form-field>\n",
                    styles: [""]
                },] },
    ];
    /** @nocollapse */
    DecimalValueComponent.ctorParameters = function () { return [
        { type: FormBuilder, decorators: [{ type: Inject, args: [FormBuilder,] }] }
    ]; };
    DecimalValueComponent.propDecorators = {
        formGroup: [{ type: Input }]
    };
    return DecimalValueComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
var resolvedPromise$6 = Promise.resolve(null);
var IntegerValueComponent = /** @class */ (function () {
    function IntegerValueComponent(fb) {
        this.fb = fb;
        this.type = KnoraConstants.IntValue;
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
            integerValue: [null, Validators.compose([Validators.required, Validators.pattern(/^-?\d+$/)])] // only allow for integer values (no fractions)
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
    IntegerValueComponent.prototype.ngOnDestroy = /**
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
    IntegerValueComponent.prototype.getValue = /**
     * @return {?}
     */
    function () {
        return new ValueLiteral(String(this.form.value.integerValue), KnoraConstants.xsdInteger);
    };
    IntegerValueComponent.decorators = [
        { type: Component, args: [{
                    selector: 'integer-value',
                    template: "<mat-form-field>\n    <input matInput [formControl]=\"form.controls['integerValue']\" placeholder=\"Integer value\" value=\"\" type=\"number\">\n</mat-form-field>\n",
                    styles: [""]
                },] },
    ];
    /** @nocollapse */
    IntegerValueComponent.ctorParameters = function () { return [
        { type: FormBuilder, decorators: [{ type: Inject, args: [FormBuilder,] }] }
    ]; };
    IntegerValueComponent.propDecorators = {
        formGroup: [{ type: Input }]
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
var resolvedPromise$7 = Promise.resolve(null);
var LinkValueComponent = /** @class */ (function () {
    function LinkValueComponent(fb, _searchService, _cacheService) {
        this.fb = fb;
        this._searchService = _searchService;
        this._cacheService = _cacheService;
        this.type = KnoraConstants.LinkValue;
    }
    Object.defineProperty(LinkValueComponent.prototype, "restrictResourceClass", {
        get: /**
         * @return {?}
         */
        function () {
            return this._restrictToResourceClass;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
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
                    var resourceSeq = ConvertJSONLD.createReadResourcesSequenceFromJsonLD(compacted);
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
        var isValidResource = (c.value instanceof ReadResource);
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
            resource: [null, Validators.compose([
                    Validators.required,
                    this.validateResource
                ])]
        });
        this.form.valueChanges.subscribe(function (data) {
            _this.searchByLabel(data.resource);
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
    LinkValueComponent.prototype.ngOnDestroy = /**
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
    LinkValueComponent.prototype.getValue = /**
     * @return {?}
     */
    function () {
        return new IRI(this.form.value.resource.id);
    };
    LinkValueComponent.decorators = [
        { type: Component, args: [{
                    selector: 'link-value',
                    template: "<mat-form-field>\n    <input matInput placeholder=\"resource\" aria-label=\"resource\" [matAutocomplete]=\"auto\" [formControl]=\"form.controls['resource']\">\n    <mat-autocomplete #auto=\"matAutocomplete\" [displayWith]=\"displayResource\">\n        <mat-option *ngFor=\"let res of resources\" [value]=\"res\">\n            {{res?.label}}\n        </mat-option>\n    </mat-autocomplete>\n</mat-form-field>\n",
                    styles: [""]
                },] },
    ];
    /** @nocollapse */
    LinkValueComponent.ctorParameters = function () { return [
        { type: FormBuilder, decorators: [{ type: Inject, args: [FormBuilder,] }] },
        { type: SearchService },
        { type: OntologyCacheService }
    ]; };
    LinkValueComponent.propDecorators = {
        formGroup: [{ type: Input }],
        restrictResourceClass: [{ type: Input }]
    };
    return LinkValueComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
var resolvedPromise$8 = Promise.resolve(null);
var TextValueComponent = /** @class */ (function () {
    function TextValueComponent(fb) {
        this.fb = fb;
        this.type = KnoraConstants.TextValue;
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
            textValue: [null, Validators.required]
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
    TextValueComponent.prototype.ngOnDestroy = /**
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
    TextValueComponent.prototype.getValue = /**
     * @return {?}
     */
    function () {
        return new ValueLiteral(String(this.form.value.textValue), KnoraConstants.xsdString);
    };
    TextValueComponent.decorators = [
        { type: Component, args: [{
                    selector: 'text-value',
                    template: "<mat-form-field>\n    <input matInput [formControl]=\"form.controls['textValue']\" placeholder=\"text value\" value=\"\">\n</mat-form-field>\n",
                    styles: [""]
                },] },
    ];
    /** @nocollapse */
    TextValueComponent.ctorParameters = function () { return [
        { type: FormBuilder, decorators: [{ type: Inject, args: [FormBuilder,] }] }
    ]; };
    TextValueComponent.propDecorators = {
        formGroup: [{ type: Input }]
    };
    return TextValueComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
var resolvedPromise$9 = Promise.resolve(null);
var UriValueComponent = /** @class */ (function () {
    function UriValueComponent(fb) {
        this.fb = fb;
        this.type = KnoraConstants.UriValue;
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
            uriValue: [null, Validators.compose([Validators.required, Validators.pattern(Utils.RegexUrl)])]
        });
        resolvedPromise$9.then(function () {
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
        resolvedPromise$9.then(function () {
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
        return new ValueLiteral(String(this.form.value.uriValue), KnoraConstants.xsdUri);
    };
    UriValueComponent.decorators = [
        { type: Component, args: [{
                    selector: 'uri-value',
                    template: "<mat-form-field>\n    <input matInput [formControl]=\"form.controls['uriValue']\" placeholder=\"URI\" value=\"\">\n</mat-form-field>\n",
                    styles: [""]
                },] },
    ];
    /** @nocollapse */
    UriValueComponent.ctorParameters = function () { return [
        { type: FormBuilder, decorators: [{ type: Inject, args: [FormBuilder,] }] }
    ]; };
    UriValueComponent.propDecorators = {
        formGroup: [{ type: Input }]
    };
    return UriValueComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var KuiSearchModule = /** @class */ (function () {
    function KuiSearchModule() {
    }
    KuiSearchModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        CommonModule,
                        BrowserAnimationsModule,
                        MatAutocompleteModule,
                        MatButtonModule,
                        MatCheckboxModule,
                        MatDatepickerModule,
                        MatFormFieldModule,
                        MatInputModule,
                        MatIconModule,
                        MatListModule,
                        MatSelectModule,
                        MatTooltipModule,
                        FormsModule,
                        ReactiveFormsModule,
                        KuiCoreModule,
                        KuiActionModule,
                        KuiViewerModule,
                        MatJDNConvertibleCalendarDateAdapterModule
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

export { SearchComponent, ExtendedSearchComponent, SelectOntologyComponent, SelectPropertyComponent, SpecifyPropertyValueComponent, BooleanValueComponent, DateValueComponent, HeaderComponent, DecimalValueComponent, IntegerValueComponent, LinkValueComponent, TextValueComponent, UriValueComponent, SelectResourceClassComponent, KuiSearchModule };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia25vcmEtc2VhcmNoLmpzLm1hcCIsInNvdXJjZXMiOlsibmc6Ly9Aa25vcmEvc2VhcmNoL2xpYi9zZWFyY2guY29tcG9uZW50LnRzIiwibmc6Ly9Aa25vcmEvc2VhcmNoL2xpYi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXJlc291cmNlLWNsYXNzL3NlbGVjdC1yZXNvdXJjZS1jbGFzcy5jb21wb25lbnQudHMiLCJuZzovL0Brbm9yYS9zZWFyY2gvbGliL2V4dGVuZGVkLXNlYXJjaC9leHRlbmRlZC1zZWFyY2guY29tcG9uZW50LnRzIiwibmc6Ly9Aa25vcmEvc2VhcmNoL2xpYi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LW9udG9sb2d5L3NlbGVjdC1vbnRvbG9neS5jb21wb25lbnQudHMiLCJuZzovL0Brbm9yYS9zZWFyY2gvbGliL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3QtcHJvcGVydHkvc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZS9zcGVjaWZ5LXByb3BlcnR5LXZhbHVlLmNvbXBvbmVudC50cyIsIm5nOi8vQGtub3JhL3NlYXJjaC9saWIvZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1wcm9wZXJ0eS9zZWxlY3QtcHJvcGVydHkuY29tcG9uZW50LnRzIiwibmc6Ly9Aa25vcmEvc2VhcmNoL2xpYi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXByb3BlcnR5L3NwZWNpZnktcHJvcGVydHktdmFsdWUvYm9vbGVhbi12YWx1ZS9ib29sZWFuLXZhbHVlLmNvbXBvbmVudC50cyIsIm5nOi8vQGtub3JhL3NlYXJjaC9saWIvZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1wcm9wZXJ0eS9zcGVjaWZ5LXByb3BlcnR5LXZhbHVlL2RhdGUtdmFsdWUvaGVhZGVyLWNhbGVuZGFyL2hlYWRlci1jYWxlbmRhci5jb21wb25lbnQudHMiLCJuZzovL0Brbm9yYS9zZWFyY2gvbGliL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3QtcHJvcGVydHkvc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZS9kYXRlLXZhbHVlL2RhdGUtdmFsdWUuY29tcG9uZW50LnRzIiwibmc6Ly9Aa25vcmEvc2VhcmNoL2xpYi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXByb3BlcnR5L3NwZWNpZnktcHJvcGVydHktdmFsdWUvZGVjaW1hbC12YWx1ZS9kZWNpbWFsLXZhbHVlLmNvbXBvbmVudC50cyIsIm5nOi8vQGtub3JhL3NlYXJjaC9saWIvZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1wcm9wZXJ0eS9zcGVjaWZ5LXByb3BlcnR5LXZhbHVlL2ludGVnZXItdmFsdWUvaW50ZWdlci12YWx1ZS5jb21wb25lbnQudHMiLCJuZzovL0Brbm9yYS9zZWFyY2gvbGliL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3QtcHJvcGVydHkvc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZS9saW5rLXZhbHVlL2xpbmstdmFsdWUuY29tcG9uZW50LnRzIiwibmc6Ly9Aa25vcmEvc2VhcmNoL2xpYi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXByb3BlcnR5L3NwZWNpZnktcHJvcGVydHktdmFsdWUvdGV4dC12YWx1ZS90ZXh0LXZhbHVlLmNvbXBvbmVudC50cyIsIm5nOi8vQGtub3JhL3NlYXJjaC9saWIvZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1wcm9wZXJ0eS9zcGVjaWZ5LXByb3BlcnR5LXZhbHVlL3VyaS12YWx1ZS91cmktdmFsdWUuY29tcG9uZW50LnRzIiwibmc6Ly9Aa25vcmEvc2VhcmNoL2xpYi9zZWFyY2gubW9kdWxlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIENvcHlyaWdodCDDgsKpIDIwMTYgTHVrYXMgUm9zZW50aGFsZXIsIEFuZHLDg8KpIEtpbGNoZW5tYW5uLCBBbmRyZWFzIEFlc2NobGltYW5uLFxuICogU29maWEgR2Vvcmdha29wb3Vsb3UsIEl2YW4gU3Vib3RpYywgQmVuamFtaW4gR2VlciwgVG9iaWFzIFNjaHdlaXplci5cbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIFNBTFNBSC5cbiAqIFNBTFNBSCBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWRcbiAqIGJ5IHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gKiAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuICogU0FMU0FIIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpY1xuICogTGljZW5zZSBhbG9uZyB3aXRoIFNBTFNBSC4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqICovXG5cbmltcG9ydCB7IENvbXBvbmVudCwgRWxlbWVudFJlZiwgSW5wdXQsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWN0aXZhdGVkUm91dGUsIFJvdXRlciB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQge1xuICAgIGFuaW1hdGUsXG4gICAgc3RhdGUsXG4gICAgc3R5bGUsXG4gICAgdHJhbnNpdGlvbixcbiAgICB0cmlnZ2VyXG59IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ2t1aS1zZWFyY2gnLFxuICAgIHRlbXBsYXRlOiBgPGRpdiBjbGFzcz1cInNlYXJjaC1iYXItZWxlbWVudHNcIj5cblxuICAgIDwhLS0gdGhlIG5leHQgZWxlbWVudCAtIGRpdi5leHRlbmRlZC1zZWFyY2gtcGFuZWwgLSBpcyBhIGhpZGRlbiBkcm9wZG93biBmaWx0ZXIgbWVudSAtLT5cblxuICAgIDxkaXYgY2xhc3M9XCJzZWFyY2gtcGFuZWxcIiBbY2xhc3MuYWN0aXZlXT1cInNlYXJjaFBhbmVsRm9jdXNcIj5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJwcmVmaXhcIiAoY2xpY2spPVwiZG9TZWFyY2goc2VhcmNoKVwiPlxuICAgICAgICAgICAgICAgIDxtYXQtaWNvbj5zZWFyY2g8L21hdC1pY29uPlxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1maWVsZFwiPlxuICAgICAgICAgICAgPGlucHV0ICNzZWFyY2ggYXV0b2NvbXBsZXRlPVwib2ZmXCIgdHlwZT1cInNlYXJjaFwiIFtwbGFjZWhvbGRlcl09XCJzZWFyY2hMYWJlbFwiIFsobmdNb2RlbCldPVwic2VhcmNoUXVlcnlcIiBuYW1lPVwic2VhcmNoXCIgKGtleXVwLmVzYyk9XCJyZXNldFNlYXJjaChzZWFyY2gpXCJcbiAgICAgICAgICAgICAgICAoa2V5dXApPVwib25LZXkoc2VhcmNoLCAkZXZlbnQpXCIgKGNsaWNrKT1cInNldEZvY3VzKClcIiAoZm9jdXMpPVwidG9nZ2xlTWVudSgnc2ltcGxlU2VhcmNoJylcIiBbZGlzYWJsZWRdPVwiZm9jdXNPbkV4dGVuZGVkID09PSAnYWN0aXZlJ1wiXG4gICAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8IS0tIHN3aXRjaCBidXR0b246IG9uIHNvbWUgZm9jdXMgd2UgbmVlZCBhIGNsb3NlIGJ1dHRvbiBmb3IgdGhlIHNpbXBsZSBvciBleHRlbmRlZCBwYW5lbCAtLT5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJzdWZmaXhcIiAqbmdJZj1cImZvY3VzT25TaW1wbGUgPT09ICdhY3RpdmUnXCIgKGNsaWNrKT1cInJlc2V0U2VhcmNoKHNlYXJjaClcIj5cbiAgICAgICAgICAgICAgICA8bWF0LWljb24+Y2xvc2U8L21hdC1pY29uPlxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwic3VmZml4XCIgKm5nSWY9XCJmb2N1c09uU2ltcGxlID09PSAnaW5hY3RpdmUnXCI+XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPCEtLSB0aGUgc2VhcmNoIHBhbmVsIGhhcyB0d28gXCJkcm9wZG93blwiIG1lbnVzOiBvbmUgZm9yIHNpbXBsZSBzZWFyY2ggYW5kIGFub3RoZXIgb25lIGZvciB0aGUgZXh0ZW5kZWQgc2VhcmNoIC0tPlxuICAgICAgICA8ZGl2IGNsYXNzPVwic2Fsc2FoLW1lbnUgc2ltcGxlLXNlYXJjaFwiIFtAc2ltcGxlU2VhcmNoTWVudV09XCJmb2N1c09uU2ltcGxlXCIgKm5nSWY9XCJzaG93U2ltcGxlU2VhcmNoXCI+XG4gICAgICAgICAgICA8bWF0LWxpc3QgY2xhc3M9XCJzYWxzYWgtcHJldmlvdXMtc2VhcmNoLWxpc3RcIj5cbiAgICAgICAgICAgICAgICA8bWF0LWxpc3QtaXRlbSAqbmdGb3I9XCJsZXQgaXRlbSBvZiBwcmV2U2VhcmNoIHwgcmV2ZXJzZTsgbGV0IGk9aW5kZXhcIj5cbiAgICAgICAgICAgICAgICAgICAgPGg0IG1hdC1saW5lICpuZ0lmPVwiaTwxMFwiIChjbGljayk9XCJkb1ByZXZTZWFyY2goaXRlbSlcIj57e2l0ZW19fTwvaDQ+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gbWF0LWljb24tYnV0dG9uIChjbGljayk9XCJyZXNldFByZXZTZWFyY2goaXRlbSlcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxtYXQtaWNvbiBhcmlhLWxhYmVsPVwiY2xvc2VcIj5jbGVhcjwvbWF0LWljb24+XG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvbWF0LWxpc3QtaXRlbT5cbiAgICAgICAgICAgIDwvbWF0LWxpc3Q+XG4gICAgICAgICAgICA8YnV0dG9uIG1hdC1zdHJva2VkLWJ1dHRvbiBjb2xvcj1cImFjY2VudFwiIGNsYXNzPVwicmlnaHRcIiAoY2xpY2spPVwicmVzZXRQcmV2U2VhcmNoKClcIiAqbmdJZj1cInByZXZTZWFyY2hcIj5DbGVhcjwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8ZGl2IGNsYXNzPVwic2Fsc2FoLW1lbnUgZXh0ZW5kZWQtc2VhcmNoXCIgW0BleHRlbmRlZFNlYXJjaE1lbnVdPVwiZm9jdXNPbkV4dGVuZGVkXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2Fsc2FoLW1lbnUtaGVhZGVyXCI+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzYWxzYWgtbWVudS10aXRsZVwiPlxuICAgICAgICAgICAgICAgICAgICA8aDQ+QWR2YW5jZWQgc2VhcmNoPC9oND5cbiAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzYWxzYWgtbWVudS1hY3Rpb25cIj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBtYXQtaWNvbi1idXR0b24gKGNsaWNrKT1cInRvZ2dsZU1lbnUoJ2V4dGVuZGVkU2VhcmNoJylcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxtYXQtaWNvbj5jbG9zZTwvbWF0LWljb24+XG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImV4dGVuZGVkLXNlYXJjaC1ib3hcIj5cbiAgICAgICAgICAgICAgICA8a3VpLWV4dGVuZGVkLXNlYXJjaCBbcm91dGVdPVwicm91dGVcIiAodG9nZ2xlRXh0ZW5kZWRTZWFyY2hGb3JtKT1cInRvZ2dsZU1lbnUoJ2V4dGVuZGVkU2VhcmNoJylcIj48L2t1aS1leHRlbmRlZC1zZWFyY2g+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG5cbiAgICA8IS0tIEV4dGVuZGVkIHNlYXJjaCBidXR0b24gdG8gZGlzcGxheSB0aGUgZXh0ZW5kZWQgc2VhcmNoIGZvcm0gaW4gdGhlIHNlYXJjaCBwYW5lbCAtLT5cbiAgICA8YnV0dG9uIG1hdC1idXR0b24gdHlwZT1cImJ1dHRvblwiIGNvbG9yPVwicHJpbWFyeVwiIGNsYXNzPVwiYWR2YW5jZWQtc2VhcmNoLWJ1dHRvblwiIChjbGljayk9XCJ0b2dnbGVNZW51KCdleHRlbmRlZFNlYXJjaCcpXCI+XG4gICAgICAgIGFkdmFuY2VkXG4gICAgPC9idXR0b24+XG5cbjwvZGl2PlxuYCxcbiAgICBzdHlsZXM6IFtgaW5wdXRbdHlwZT1zZWFyY2hdOjotd2Via2l0LXNlYXJjaC1jYW5jZWwtYnV0dG9uLGlucHV0W3R5cGU9c2VhcmNoXTo6LXdlYmtpdC1zZWFyY2gtZGVjb3JhdGlvbixpbnB1dFt0eXBlPXNlYXJjaF06Oi13ZWJraXQtc2VhcmNoLXJlc3VsdHMtYnV0dG9uLGlucHV0W3R5cGU9c2VhcmNoXTo6LXdlYmtpdC1zZWFyY2gtcmVzdWx0cy1kZWNvcmF0aW9ue2Rpc3BsYXk6bm9uZX1pbnB1dFt0eXBlPXNlYXJjaF17LW1vei1hcHBlYXJhbmNlOm5vbmU7LXdlYmtpdC1hcHBlYXJhbmNlOm5vbmV9LmNlbnRlcntkaXNwbGF5OmJsb2NrO21hcmdpbi1sZWZ0OmF1dG87bWFyZ2luLXJpZ2h0OmF1dG99LmNsb3Nle3JpZ2h0OjEycHh9LmV4dGVuZGVkLXNlYXJjaC1ib3h7bWFyZ2luOjEycHh9LmFkdmFuY2VkLXNlYXJjaC1idXR0b257bWFyZ2luLWxlZnQ6MTBweH0uZnVsbC13aWR0aHt3aWR0aDoxMDAlfS5oaWRle2Rpc3BsYXk6bm9uZX0uaW5hY3RpdmUsLm11dGV7Y29sb3I6IzdhN2E3YX0uc2VhcmNoLXBhbmVse2JhY2tncm91bmQtY29sb3I6I2Y5ZjlmOTtib3JkZXItcmFkaXVzOjRweDtkaXNwbGF5OmlubGluZS1mbGV4O2hlaWdodDo0MHB4O3Bvc2l0aW9uOnJlbGF0aXZlO3dpZHRoOjcyMHB4O3otaW5kZXg6MTB9LnNlYXJjaC1wYW5lbDpob3Zlcntib3gtc2hhZG93OjAgMXB4IDNweCByZ2JhKDAsMCwwLC41KX0uc2VhcmNoLXBhbmVsIGRpdi5pbnB1dC1maWVsZHtmbGV4OjF9LnNlYXJjaC1wYW5lbCBkaXYuaW5wdXQtZmllbGQgaW5wdXR7Ym9yZGVyLXN0eWxlOm5vbmU7Zm9udC1zaXplOjE0cHQ7aGVpZ2h0OjM4cHg7cG9zaXRpb246YWJzb2x1dGU7d2lkdGg6NjQwcHh9LnNlYXJjaC1wYW5lbCBkaXYuaW5wdXQtZmllbGQgaW5wdXQ6YWN0aXZlLC5zZWFyY2gtcGFuZWwgZGl2LmlucHV0LWZpZWxkIGlucHV0OmZvY3Vze291dGxpbmU6MH0uc2VhcmNoLXBhbmVsIGRpdiAucHJlZml4LC5zZWFyY2gtcGFuZWwgZGl2IC5zdWZmaXh7YmFja2dyb3VuZC1jb2xvcjojZmZmO2JvcmRlci1yYWRpdXM6M3B4O2JvcmRlci1zdHlsZTpub25lO2NvbG9yOnJnYmEoNDEsNDEsNDEsLjQpO2N1cnNvcjpwb2ludGVyO2hlaWdodDozOHB4O291dGxpbmU6MDtwb3NpdGlvbjpyZWxhdGl2ZTt3aWR0aDo0MHB4fS5zZWFyY2gtcGFuZWwgZGl2IC5wcmVmaXg6YWN0aXZlLC5zZWFyY2gtcGFuZWwgZGl2IC5zdWZmaXg6YWN0aXZle2NvbG9yOiM1MTUxNTF9LnNlYXJjaC1wYW5lbC5hY3RpdmV7Ym94LXNoYWRvdzowIDFweCAzcHggcmdiYSgwLDAsMCwuNSl9LnNhbHNhaC1tZW51e2JveC1zaGFkb3c6MCAzcHggNXB4IC0xcHggcmdiYSgxMSwxMSwxMSwuMiksMCA2cHggMTBweCAwIHJnYmEoMTEsMTEsMTEsLjE0KSwwIDFweCAxOHB4IDAgcmdiYSgxMSwxMSwxMSwuMTIpO2JhY2tncm91bmQtY29sb3I6I2Y5ZjlmOTtib3JkZXItcmFkaXVzOjRweDtwb3NpdGlvbjphYnNvbHV0ZX0uc2Fsc2FoLW1lbnUgLnNhbHNhaC1tZW51LWhlYWRlcntiYWNrZ3JvdW5kLWNvbG9yOiNmOWY5Zjk7Ym9yZGVyLXRvcC1sZWZ0LXJhZGl1czo0cHg7Ym9yZGVyLXRvcC1yaWdodC1yYWRpdXM6NHB4O2Rpc3BsYXk6aW5saW5lLWJsb2NrO2hlaWdodDo0OHB4O3dpZHRoOjEwMCV9LnNhbHNhaC1tZW51IC5zYWxzYWgtbWVudS1oZWFkZXIgLnNhbHNhaC1tZW51LXRpdGxle2Zsb2F0OmxlZnQ7Zm9udC1zaXplOjE0cHg7Zm9udC13ZWlnaHQ6NDAwO21hcmdpbi10b3A6NHB4O3BhZGRpbmc6MTJweH0uc2Fsc2FoLW1lbnUgLnNhbHNhaC1tZW51LWhlYWRlciAuc2Fsc2FoLW1lbnUtYWN0aW9ue2Zsb2F0OnJpZ2h0O21hcmdpbjo0cHh9LnNhbHNhaC1tZW51LmV4dGVuZGVkLXNlYXJjaCwuc2Fsc2FoLW1lbnUuc2ltcGxlLXNlYXJjaHttaW4taGVpZ2h0OjcyMHB4O3dpZHRoOjcyMHB4fS5zYWxzYWgtbWVudS5zaW1wbGUtc2VhcmNoe3BhZGRpbmctdG9wOjYwcHg7ei1pbmRleDotMX0uc2Fsc2FoLW1lbnUuc2ltcGxlLXNlYXJjaCAuc2Fsc2FoLXByZXZpb3VzLXNlYXJjaC1saXN0IC5tYXQtbGlzdC1pdGVte2N1cnNvcjpwb2ludGVyfS5zYWxzYWgtbWVudS5zaW1wbGUtc2VhcmNoIC5zYWxzYWgtcHJldmlvdXMtc2VhcmNoLWxpc3QgLm1hdC1saXN0LWl0ZW06aG92ZXJ7YmFja2dyb3VuZC1jb2xvcjojZjlmOWY5fS5zYWxzYWgtbWVudS5zaW1wbGUtc2VhcmNoIC5zYWxzYWgtcHJldmlvdXMtc2VhcmNoLWxpc3QgLm1hdC1saXN0LWl0ZW06aG92ZXIgbWF0LWljb257ZGlzcGxheTpibG9ja30uc2Fsc2FoLW1lbnUuc2ltcGxlLXNlYXJjaCAuc2Fsc2FoLXByZXZpb3VzLXNlYXJjaC1saXN0IC5tYXQtbGlzdC1pdGVtIG1hdC1pY29ue2Rpc3BsYXk6bm9uZX0uc2Fsc2FoLW1lbnUuc2ltcGxlLXNlYXJjaCAucmlnaHR7bWFyZ2luLXRvcDoxMnB4O21hcmdpbi1sZWZ0OjE2cHh9LnNhbHNhaC1tZW51LmV4dGVuZGVkLXNlYXJjaHt6LWluZGV4OjIwfS5zZWFyY2gtYmFyLWVsZW1lbnRze2Rpc3BsYXk6ZmxleH0uc2hvd3tkaXNwbGF5OmJsb2NrfWBdLFxuICAgIGFuaW1hdGlvbnM6IFtcbiAgICAgICAgdHJpZ2dlcignc2ltcGxlU2VhcmNoTWVudScsXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgc3RhdGUoJ2luYWN0aXZlJywgc3R5bGUoeyBkaXNwbGF5OiAnbm9uZScgfSkpLFxuICAgICAgICAgICAgICAgIHN0YXRlKCdhY3RpdmUnLCBzdHlsZSh7IGRpc3BsYXk6ICdibG9jaycgfSkpLFxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb24oJ2luYWN0aXZlID0+IHRydWUnLCBhbmltYXRlKCcxMDBtcyBlYXNlLWluJykpLFxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb24oJ3RydWUgPT4gaW5hY3RpdmUnLCBhbmltYXRlKCcxMDBtcyBlYXNlLW91dCcpKVxuICAgICAgICAgICAgXVxuICAgICAgICApLFxuICAgICAgICB0cmlnZ2VyKCdleHRlbmRlZFNlYXJjaE1lbnUnLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgIHN0YXRlKCdpbmFjdGl2ZScsIHN0eWxlKHsgZGlzcGxheTogJ25vbmUnIH0pKSxcbiAgICAgICAgICAgICAgICBzdGF0ZSgnYWN0aXZlJywgc3R5bGUoeyBkaXNwbGF5OiAnYmxvY2snIH0pKSxcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uKCdpbmFjdGl2ZSA9PiB0cnVlJywgYW5pbWF0ZSgnMTAwbXMgZWFzZS1pbicpKSxcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uKCd0cnVlID0+IGluYWN0aXZlJywgYW5pbWF0ZSgnMTAwbXMgZWFzZS1vdXQnKSlcbiAgICAgICAgICAgIF1cbiAgICAgICAgKSxcbiAgICBdXG59KVxuXG5cbmV4cG9ydCBjbGFzcyBTZWFyY2hDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gICAgQElucHV0KCkgcm91dGU6IHN0cmluZyA9ICcvc2VhcmNoJztcblxuICAgIHNlYXJjaFF1ZXJ5OiBzdHJpbmc7XG5cbiAgICBzZWFyY2hQYW5lbEZvY3VzOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBwcmV2U2VhcmNoOiBzdHJpbmdbXSA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3ByZXZTZWFyY2gnKSk7XG5cbiAgICBmb2N1c09uU2ltcGxlOiBzdHJpbmcgPSAnaW5hY3RpdmUnO1xuICAgIGZvY3VzT25FeHRlbmRlZDogc3RyaW5nID0gJ2luYWN0aXZlJztcblxuICAgIHNlYXJjaExhYmVsOiBzdHJpbmcgPSAnU2VhcmNoJztcblxuICAgIHNob3dTaW1wbGVTZWFyY2g6IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBfcm91dGU6IEFjdGl2YXRlZFJvdXRlLFxuICAgICAgICBwcml2YXRlIF9yb3V0ZXI6IFJvdXRlcixcbiAgICAgICAgcHJpdmF0ZSBfZWxlUmVmOiBFbGVtZW50UmVmKSB7XG5cbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBzZWFyY2hfZWxlXG4gICAgICogQHBhcmFtIGV2ZW50XG4gICAgICovXG4gICAgb25LZXkoc2VhcmNoX2VsZTogSFRNTEVsZW1lbnQsIGV2ZW50KTogdm9pZCB7XG4gICAgICAgIHRoaXMuZm9jdXNPblNpbXBsZSA9ICdhY3RpdmUnO1xuICAgICAgICB0aGlzLnByZXZTZWFyY2ggPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdwcmV2U2VhcmNoJykpO1xuICAgICAgICBpZiAodGhpcy5zZWFyY2hRdWVyeSAmJiAoZXZlbnQua2V5ID09PSAnRW50ZXInIHx8IGV2ZW50LmtleUNvZGUgPT09IDEzIHx8IGV2ZW50LndoaWNoID09PSAxMykpIHtcbiAgICAgICAgICAgIHRoaXMuZG9TZWFyY2goc2VhcmNoX2VsZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGV2ZW50LmtleSA9PT0gJ0VzY2FwZScgfHwgZXZlbnQua2V5Q29kZSA9PT0gMjcgfHwgZXZlbnQud2hpY2ggPT09IDI3KSB7XG4gICAgICAgICAgICB0aGlzLnJlc2V0U2VhcmNoKHNlYXJjaF9lbGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVhbGlzZSBhIHNpbXBsZSBzZWFyY2hcbiAgICAgKiBAcGFyYW0gc2VhcmNoX2VsZVxuICAgICAqL1xuICAgIGRvU2VhcmNoKHNlYXJjaF9lbGU6IEhUTUxFbGVtZW50KTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLnNlYXJjaFF1ZXJ5ICE9PSB1bmRlZmluZWQgJiYgdGhpcy5zZWFyY2hRdWVyeSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy50b2dnbGVNZW51KCdzaW1wbGVTZWFyY2gnKTtcbiAgICAgICAgICAgIHRoaXMuX3JvdXRlci5uYXZpZ2F0ZShbdGhpcy5yb3V0ZSArICcvZnVsbHRleHQvJyArIHRoaXMuc2VhcmNoUXVlcnldKTtcblxuICAgICAgICAgICAgLy8gdGhpcy5fcm91dGVyLm5hdmlnYXRlKFsnL3NlYXJjaC9mdWxsdGV4dC8nICsgdGhpcy5zZWFyY2hRdWVyeV0sIHsgcmVsYXRpdmVUbzogdGhpcy5fcm91dGUgfSk7XG5cbiAgICAgICAgICAgIC8vIHB1c2ggdGhlIHNlYXJjaCBxdWVyeSBpbnRvIHRoZSBsb2NhbCBzdG9yYWdlIHByZXZTZWFyY2ggYXJyYXkgKHByZXZpb3VzIHNlYXJjaClcbiAgICAgICAgICAgIC8vIHRvIGhhdmUgYSBsaXN0IG9mIHJlY2VudCBzZWFyY2ggcmVxdWVzdHNcbiAgICAgICAgICAgIGxldCBleGlzdGluZ1ByZXZTZWFyY2g6IHN0cmluZ1tdID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncHJldlNlYXJjaCcpKTtcbiAgICAgICAgICAgIGlmIChleGlzdGluZ1ByZXZTZWFyY2ggPT09IG51bGwpIHsgZXhpc3RpbmdQcmV2U2VhcmNoID0gW107IH1cbiAgICAgICAgICAgIGxldCBpOiBudW1iZXIgPSAwO1xuICAgICAgICAgICAgZm9yIChjb25zdCBlbnRyeSBvZiBleGlzdGluZ1ByZXZTZWFyY2gpIHtcbiAgICAgICAgICAgICAgICAvLyByZW1vdmUgZW50cnksIGlmIGV4aXN0cyBhbHJlYWR5XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc2VhcmNoUXVlcnkgPT09IGVudHJ5KSB7IGV4aXN0aW5nUHJldlNlYXJjaC5zcGxpY2UoaSwgMSk7IH1cbiAgICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGV4aXN0aW5nUHJldlNlYXJjaC5wdXNoKHRoaXMuc2VhcmNoUXVlcnkpO1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3ByZXZTZWFyY2gnLCBKU09OLnN0cmluZ2lmeShleGlzdGluZ1ByZXZTZWFyY2gpKTtcbiAgICAgICAgICAgIC8vIFRPRE86IHNhdmUgdGhlIHByZXZpb3VzIHNlYXJjaCBxdWVyaWVzIHNvbWV3aGVyZSBpbiB0aGUgdXNlcidzIHByb2ZpbGVcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2VhcmNoX2VsZS5mb2N1cygpO1xuICAgICAgICAgICAgdGhpcy5wcmV2U2VhcmNoID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncHJldlNlYXJjaCcpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlc2V0IHRoZSBzZWFyY2hcbiAgICAgKiBAcGFyYW0gc2VhcmNoX2VsZVxuICAgICAqL1xuICAgIHJlc2V0U2VhcmNoKHNlYXJjaF9lbGU6IEhUTUxFbGVtZW50KTogdm9pZCB7XG4gICAgICAgIHRoaXMuc2VhcmNoUXVlcnkgPSBudWxsO1xuICAgICAgICBzZWFyY2hfZWxlLmZvY3VzKCk7XG4gICAgICAgIHRoaXMuZm9jdXNPblNpbXBsZSA9ICdpbmFjdGl2ZSc7XG4gICAgICAgIHRoaXMuc2VhcmNoUGFuZWxGb2N1cyA9ICF0aGlzLnNlYXJjaFBhbmVsRm9jdXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVhbGlzZSBhIHByZXZpb3VzIHNlYXJjaFxuICAgICAqIEBwYXJhbSBxdWVyeVxuICAgICAqL1xuICAgIGRvUHJldlNlYXJjaChxdWVyeTogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc2VhcmNoUXVlcnkgPSBxdWVyeTtcbiAgICAgICAgdGhpcy5fcm91dGVyLm5hdmlnYXRlKFt0aGlzLnJvdXRlICsgJy9mdWxsdGV4dC8nICsgcXVlcnldLCB7IHJlbGF0aXZlVG86IHRoaXMuX3JvdXRlIH0pO1xuICAgICAgICB0aGlzLnRvZ2dsZU1lbnUoJ3NpbXBsZVNlYXJjaCcpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlc2V0IHByZXZpb3VzIHNlYXJjaGVzIC0gdGhlIHdob2xlIHByZXZpb3VzIHNlYXJjaCBvciBzcGVjaWZpYyBpdGVtIGJ5IG5hbWVcbiAgICAgKiBAcGFyYW0gbmFtZVxuICAgICAqL1xuICAgIHJlc2V0UHJldlNlYXJjaChuYW1lOiBzdHJpbmcgPSBudWxsKTogdm9pZCB7XG4gICAgICAgIGlmIChuYW1lKSB7XG4gICAgICAgICAgICAvLyBkZWxldGUgb25seSB0aGlzIGl0ZW0gd2l0aCB0aGUgbmFtZSAuLi5cbiAgICAgICAgICAgIGNvbnN0IGk6IG51bWJlciA9IHRoaXMucHJldlNlYXJjaC5pbmRleE9mKG5hbWUpO1xuICAgICAgICAgICAgdGhpcy5wcmV2U2VhcmNoLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdwcmV2U2VhcmNoJywgSlNPTi5zdHJpbmdpZnkodGhpcy5wcmV2U2VhcmNoKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBkZWxldGUgdGhlIHdob2xlIFwicHJldmlvdXMgc2VhcmNoXCIgYXJyYXlcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCdwcmV2U2VhcmNoJyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wcmV2U2VhcmNoID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncHJldlNlYXJjaCcpKTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldCBzaW1wbGUgZm9jdXMgdG8gYWN0aXZlXG4gICAgICovXG4gICAgc2V0Rm9jdXMoKTogdm9pZCB7XG4gICAgICAgIHRoaXMucHJldlNlYXJjaCA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3ByZXZTZWFyY2gnKSk7XG4gICAgICAgIHRoaXMuZm9jdXNPblNpbXBsZSA9ICdhY3RpdmUnO1xuICAgICAgICB0aGlzLnNlYXJjaFBhbmVsRm9jdXMgPSAhdGhpcy5zZWFyY2hQYW5lbEZvY3VzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFN3aXRjaCBhY2NvcmRpbmcgdG8gdGhlIGZvY3VzIGJldHdlZW4gc2ltcGxlIG9yIGV4dGVuZGVkIHNlYXJjaFxuICAgICAqIEBwYXJhbSBuYW1lXG4gICAgICovXG4gICAgdG9nZ2xlTWVudShuYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgc3dpdGNoIChuYW1lKSB7XG4gICAgICAgICAgICBjYXNlICdzaW1wbGVTZWFyY2gnOlxuICAgICAgICAgICAgICAgIHRoaXMucHJldlNlYXJjaCA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3ByZXZTZWFyY2gnKSk7XG4gICAgICAgICAgICAgICAgdGhpcy5mb2N1c09uU2ltcGxlID0gKHRoaXMuZm9jdXNPblNpbXBsZSA9PT0gJ2FjdGl2ZScgPyAnaW5hY3RpdmUnIDogJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2hvd1NpbXBsZVNlYXJjaCA9IHRydWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdleHRlbmRlZFNlYXJjaCc6XG4gICAgICAgICAgICAgICAgdGhpcy5mb2N1c09uRXh0ZW5kZWQgPSAodGhpcy5mb2N1c09uRXh0ZW5kZWQgPT09ICdhY3RpdmUnID8gJ2luYWN0aXZlJyA6ICdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dTaW1wbGVTZWFyY2ggPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCB7IENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbmplY3QsIElucHV0LCBPbkNoYW5nZXMsIE9uSW5pdCwgT3V0cHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBGb3JtQnVpbGRlciwgRm9ybUdyb3VwLCBWYWxpZGF0b3JzIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgUmVzb3VyY2VDbGFzcyB9IGZyb20gJ0Brbm9yYS9jb3JlJztcblxuLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNDU2NjEwMTAvZHluYW1pYy1uZXN0ZWQtcmVhY3RpdmUtZm9ybS1leHByZXNzaW9uY2hhbmdlZGFmdGVyaXRoYXNiZWVuY2hlY2tlZGVycm9yXG5jb25zdCByZXNvbHZlZFByb21pc2UgPSBQcm9taXNlLnJlc29sdmUobnVsbCk7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAna3VpLXNlbGVjdC1yZXNvdXJjZS1jbGFzcycsXG4gICAgdGVtcGxhdGU6IGA8bWF0LWZvcm0tZmllbGQgKm5nSWY9XCJyZXNvdXJjZUNsYXNzZXMubGVuZ3RoID4gMFwiPlxuICA8bWF0LXNlbGVjdCBwbGFjZWhvbGRlcj1cIlJlc291cmNlIENsYXNzXCIgW2Zvcm1Db250cm9sXT1cImZvcm0uY29udHJvbHNbJ3Jlc291cmNlQ2xhc3MnXVwiPlxuICAgIDxtYXQtb3B0aW9uIFt2YWx1ZV09XCJudWxsXCI+bm8gc2VsZWN0aW9uPC9tYXQtb3B0aW9uPlxuICAgIDwhLS0gdW5kbyBzZWxlY3Rpb24gb2YgYSByZXNvdXJjZSBjbGFzcyAtLT5cbiAgICA8bWF0LW9wdGlvbiAqbmdGb3I9XCJsZXQgcmVzb3VyY2VDbGFzcyBvZiByZXNvdXJjZUNsYXNzZXNcIiBbdmFsdWVdPVwicmVzb3VyY2VDbGFzcy5pZFwiPnt7IHJlc291cmNlQ2xhc3MubGFiZWwgfX08L21hdC1vcHRpb24+XG4gIDwvbWF0LXNlbGVjdD5cbjwvbWF0LWZvcm0tZmllbGQ+YCxcbiAgICBzdHlsZXM6IFtgYF1cbn0pXG5leHBvcnQgY2xhc3MgU2VsZWN0UmVzb3VyY2VDbGFzc0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzIHtcblxuICAgIEBJbnB1dCgpIGZvcm1Hcm91cDogRm9ybUdyb3VwO1xuXG4gICAgLy8gc2V0dGVyIG1ldGhvZCBmb3IgcmVzb3VyY2UgY2xhc3NlcyB3aGVuIGJlaW5nIHVwZGF0ZWQgYnkgcGFyZW50IGNvbXBvbmVudFxuICAgIEBJbnB1dCgpXG4gICAgc2V0IHJlc291cmNlQ2xhc3Nlcyh2YWx1ZTogQXJyYXk8UmVzb3VyY2VDbGFzcz4pIHtcbiAgICAgICAgdGhpcy5yZXNvdXJjZUNsYXNzU2VsZWN0ZWQgPSB1bmRlZmluZWQ7IC8vIHJlc2V0IG9uIHVwZGF0ZXNcbiAgICAgICAgdGhpcy5fcmVzb3VyY2VDbGFzc2VzID0gdmFsdWU7XG4gICAgfVxuXG4gICAgLy8gZ2V0dGVyIG1ldGhvZCBmb3IgcmVzb3VyY2UgY2xhc3NlcyAodXNlZCBpbiB0ZW1wbGF0ZSlcbiAgICBnZXQgcmVzb3VyY2VDbGFzc2VzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcmVzb3VyY2VDbGFzc2VzO1xuICAgIH1cblxuICAgIC8vIGV2ZW50IGVtaXR0ZWQgdG8gcGFyZW50IGNvbXBvbmVudCBvbmNlIGEgcmVzb3VyY2UgY2xhc3MgaXMgc2VsZWN0ZWQgYnkgdGhlIHVzZXJcbiAgICBAT3V0cHV0KCkgcmVzb3VyY2VDbGFzc1NlbGVjdGVkRXZlbnQgPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oKTtcblxuICAgIC8vIGF2YWlsYWJsZSByZXNvdXJjZSBjbGFzc2VzIGZvciBzZWxlY3Rpb25cbiAgICBwcml2YXRlIF9yZXNvdXJjZUNsYXNzZXM6IEFycmF5PFJlc291cmNlQ2xhc3M+O1xuXG4gICAgLy8gc3RvcmVzIHRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgcmVzb3VyY2UgY2xhc3NcbiAgICBwcml2YXRlIHJlc291cmNlQ2xhc3NTZWxlY3RlZDogc3RyaW5nO1xuXG4gICAgZm9ybTogRm9ybUdyb3VwO1xuXG4gICAgY29uc3RydWN0b3IoQEluamVjdChGb3JtQnVpbGRlcikgcHJpdmF0ZSBmYjogRm9ybUJ1aWxkZXIpIHtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBJcmkgb2YgdGhlIHNlbGVjdGVkIHJlc291cmNlIGNsYXNzLlxuICAgICAqXG4gICAgICogQHJldHVybnMgdGhlIElyaSBvZiB0aGUgc2VsZWN0ZWQgcmVzb3VyY2UgY2xhc3Mgb3IgZmFsc2UgaW4gY2FzZSBubyByZXNvdXJjZSBjbGFzcyBpcyBzZWxlY3RlZC5cbiAgICAgKi9cbiAgICBnZXRSZXNvdXJjZUNsYXNzU2VsZWN0ZWQoKTogYW55IHtcbiAgICAgICAgaWYgKHRoaXMucmVzb3VyY2VDbGFzc1NlbGVjdGVkICE9PSB1bmRlZmluZWQgJiYgdGhpcy5yZXNvdXJjZUNsYXNzU2VsZWN0ZWQgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlQ2xhc3NTZWxlY3RlZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEluaXRhbGl6ZXMgdGhlIEZvcm1Hcm91cCBmb3IgdGhlIHJlc291cmNlIGNsYXNzIHNlbGVjdGlvbi5cbiAgICAgKiBUaGUgaW5pdGlhbCB2YWx1ZSBpcyBzZXQgdG8gbnVsbC5cbiAgICAgKi9cbiAgICBwcml2YXRlIGluaXRGb3JtKCkge1xuICAgICAgICAvLyBidWlsZCBhIGZvcm0gZm9yIHRoZSByZXNvdXJjZSBjbGFzcyBzZWxlY3Rpb25cbiAgICAgICAgdGhpcy5mb3JtID0gdGhpcy5mYi5ncm91cCh7XG4gICAgICAgICAgICByZXNvdXJjZUNsYXNzOiBbbnVsbF0gLy8gcmVzb3VyY2UgY2xhc3Mgc2VsZWN0aW9uIGlzIG9wdGlvbmFsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIHN0b3JlIGFuZCBlbWl0IElyaSBvZiB0aGUgcmVzb3VyY2UgY2xhc3Mgd2hlbiBzZWxlY3RlZFxuICAgICAgICB0aGlzLmZvcm0udmFsdWVDaGFuZ2VzLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5yZXNvdXJjZUNsYXNzU2VsZWN0ZWQgPSBkYXRhLnJlc291cmNlQ2xhc3M7XG4gICAgICAgICAgICB0aGlzLnJlc291cmNlQ2xhc3NTZWxlY3RlZEV2ZW50LmVtaXQodGhpcy5yZXNvdXJjZUNsYXNzU2VsZWN0ZWQpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHtcblxuICAgICAgICB0aGlzLmluaXRGb3JtKCk7XG5cbiAgICAgICAgLy8gYWRkIGZvcm0gdG8gdGhlIHBhcmVudCBmb3JtIGdyb3VwXG4gICAgICAgIHRoaXMuZm9ybUdyb3VwLmFkZENvbnRyb2woJ3Jlc291cmNlQ2xhc3MnLCB0aGlzLmZvcm0pO1xuXG4gICAgfVxuXG4gICAgbmdPbkNoYW5nZXMoKSB7XG5cbiAgICAgICAgaWYgKHRoaXMuZm9ybSAhPT0gdW5kZWZpbmVkKSB7XG5cbiAgICAgICAgICAgIC8vIHJlc291cmNlIGNsYXNzZXMgaGF2ZSBiZWVuIHJlaW5pdGlhbGl6ZWRcbiAgICAgICAgICAgIC8vIHJlc2V0IGZvcm1cbiAgICAgICAgICAgIHJlc29sdmVkUHJvbWlzZS50aGVuKCgpID0+IHtcblxuICAgICAgICAgICAgICAgIC8vIHJlbW92ZSB0aGlzIGZvcm0gZnJvbSB0aGUgcGFyZW50IGZvcm0gZ3JvdXBcbiAgICAgICAgICAgICAgICB0aGlzLmZvcm1Hcm91cC5yZW1vdmVDb250cm9sKCdyZXNvdXJjZUNsYXNzJyk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmluaXRGb3JtKCk7XG5cbiAgICAgICAgICAgICAgICAvLyBhZGQgZm9ybSB0byB0aGUgcGFyZW50IGZvcm0gZ3JvdXBcbiAgICAgICAgICAgICAgICB0aGlzLmZvcm1Hcm91cC5hZGRDb250cm9sKCdyZXNvdXJjZUNsYXNzJywgdGhpcy5mb3JtKTtcblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIEluamVjdCwgSW5wdXQsIE9uSW5pdCwgT3V0cHV0LCBRdWVyeUxpc3QsIFZpZXdDaGlsZCwgVmlld0NoaWxkcmVuIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZSwgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IEZvcm1CdWlsZGVyLCBGb3JtR3JvdXAgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge1xuICAgIEdyYXZzZWFyY2hHZW5lcmF0aW9uU2VydmljZSxcbiAgICBPbnRvbG9neUNhY2hlU2VydmljZSxcbiAgICBPbnRvbG9neUluZm9ybWF0aW9uLFxuICAgIE9udG9sb2d5TWV0YWRhdGEsXG4gICAgUHJvcGVydGllcyxcbiAgICBQcm9wZXJ0eVdpdGhWYWx1ZSxcbiAgICBSZWFkUmVzb3VyY2VzU2VxdWVuY2UsXG4gICAgUmVzb3VyY2VDbGFzc1xufSBmcm9tICdAa25vcmEvY29yZSc7XG5pbXBvcnQgeyBTZWxlY3RQcm9wZXJ0eUNvbXBvbmVudCB9IGZyb20gJy4vc2VsZWN0LXByb3BlcnR5L3NlbGVjdC1wcm9wZXJ0eS5jb21wb25lbnQnO1xuaW1wb3J0IHsgU2VsZWN0UmVzb3VyY2VDbGFzc0NvbXBvbmVudCB9IGZyb20gJy4vc2VsZWN0LXJlc291cmNlLWNsYXNzL3NlbGVjdC1yZXNvdXJjZS1jbGFzcy5jb21wb25lbnQnO1xuXG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAna3VpLWV4dGVuZGVkLXNlYXJjaCcsXG4gICAgdGVtcGxhdGU6IGA8Zm9ybSBbZm9ybUdyb3VwXT1cImZvcm1cIiAobmdTdWJtaXQpPVwic3VibWl0KClcIj5cblxuICA8ZGl2PlxuICAgIDxrdWktc2VsZWN0LW9udG9sb2d5ICpuZ0lmPVwib250b2xvZ2llcy5sZW5ndGggPiAwXCIgW2Zvcm1Hcm91cF09XCJmb3JtXCIgW29udG9sb2dpZXNdPVwib250b2xvZ2llc1wiIChvbnRvbG9neVNlbGVjdGVkKT1cImdldFJlc291cmNlQ2xhc3Nlc0FuZFByb3BlcnRpZXNGb3JPbnRvbG9neSgkZXZlbnQpXCI+PC9rdWktc2VsZWN0LW9udG9sb2d5PlxuICA8L2Rpdj5cblxuICA8ZGl2IGNsYXNzPVwic2VsZWN0LXJlc291cmNlLWNsYXNzXCIgKm5nSWY9XCJyZXNvdXJjZUNsYXNzZXM/Lmxlbmd0aCA+IDBcIj5cbiAgICA8a3VpLXNlbGVjdC1yZXNvdXJjZS1jbGFzcyAjcmVzb3VyY2VDbGFzcyBbZm9ybUdyb3VwXT1cImZvcm1cIiBbcmVzb3VyY2VDbGFzc2VzXT1cInJlc291cmNlQ2xhc3Nlc1wiIChyZXNvdXJjZUNsYXNzU2VsZWN0ZWRFdmVudCk9XCJnZXRQcm9wZXJ0aWVzRm9yUmVzb3VyY2VDbGFzcygkZXZlbnQpXCI+PC9rdWktc2VsZWN0LXJlc291cmNlLWNsYXNzPlxuICA8L2Rpdj5cblxuICA8ZGl2IGNsYXNzPVwic2VsZWN0LXByb3BlcnR5XCIgKm5nSWY9XCJwcm9wZXJ0aWVzICE9PSB1bmRlZmluZWRcIj5cbiAgICA8ZGl2ICpuZ0Zvcj1cImxldCBwcm9wIG9mIGFjdGl2ZVByb3BlcnRpZXM7IGxldCBpID0gaW5kZXhcIj5cblxuICAgICAgPGt1aS1zZWxlY3QtcHJvcGVydHkgI3Byb3BlcnR5IFthY3RpdmVSZXNvdXJjZUNsYXNzXT1cImFjdGl2ZVJlc291cmNlQ2xhc3NcIiBbZm9ybUdyb3VwXT1cImZvcm1cIiBbaW5kZXhdPVwiaVwiIFtwcm9wZXJ0aWVzXT1cInByb3BlcnRpZXNcIj48L2t1aS1zZWxlY3QtcHJvcGVydHk+XG5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG5cblxuICA8ZGl2PlxuICAgIDxidXR0b24gbWF0LW1pbmktZmFiIGNsYXNzPVwicHJvcGVydHktYnV0dG9ucyBhZGQtcHJvcGVydHktYnV0dG9uXCIgY29sb3I9XCJwcmltYXJ5XCIgdHlwZT1cImJ1dHRvblwiIChjbGljayk9XCJhZGRQcm9wZXJ0eSgpXCIgW2Rpc2FibGVkXT1cImFjdGl2ZU9udG9sb2d5ID09PSB1bmRlZmluZWQgfHwgYWN0aXZlUHJvcGVydGllcy5sZW5ndGggPj0gNFwiPlxuICAgICAgPG1hdC1pY29uIGFyaWEtbGFiZWw9XCJhZGQgYSBwcm9wZXJ0eVwiPmFkZDwvbWF0LWljb24+XG4gICAgPC9idXR0b24+XG5cbiAgICA8YnV0dG9uIG1hdC1taW5pLWZhYiBjbGFzcz1cInByb3BlcnR5LWJ1dHRvbnMgcmVtb3ZlLXByb3BlcnR5LWJ1dHRvblwiIGNvbG9yPVwicHJpbWFyeVwiIHR5cGU9XCJidXR0b25cIiAoY2xpY2spPVwicmVtb3ZlUHJvcGVydHkoKVwiIFtkaXNhYmxlZF09XCJhY3RpdmVQcm9wZXJ0aWVzLmxlbmd0aCA9PSAwXCI+XG4gICAgICA8bWF0LWljb24gYXJpYS1sYWJlbD1cInJlbW92ZSBwcm9wZXJ0eVwiPnJlbW92ZTwvbWF0LWljb24+XG4gICAgPC9idXR0b24+XG4gIDwvZGl2PlxuXG4gIDwhLS0gIDxkaXY+XG4gICAgPGJ1dHRvbiBtYXQtaWNvbi1idXR0b24gdHlwZT1cImJ1dHRvblwiIChjbGljayk9XCJyZXNldEZvcm0oKVwiIFtkaXNhYmxlZF09XCJ0aGlzLmFjdGl2ZU9udG9sb2d5ID09PSB1bmRlZmluZWRcIj5cbiAgICAgIDxtYXQtaWNvbiBhcmlhLWxhYmVsPVwicmVzZXQgcXVlcnkgZm9ybVwiPmNsZWFyPC9tYXQtaWNvbj5cbiAgICA8L2J1dHRvbj5cblxuICAgIDxidXR0b24gbWF0LWljb24tYnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBbZGlzYWJsZWRdPVwiIWZvcm1WYWxpZFwiPlxuICAgICAgPG1hdC1pY29uIGFyaWEtbGFiZWw9XCJzdWJtaXQgcXVlcnlcIj5zZW5kPC9tYXQtaWNvbj5cbiAgICA8L2J1dHRvbj5cbiAgPC9kaXY+IC0tPlxuXG4gIDxidXR0b24gY2xhc3M9XCJleHRlbmRlZC1idXR0b25zIGV4dGVuZGVkLXNlYXJjaC1idXR0b25cIiBtYXQtc3Ryb2tlZC1idXR0b24gY29sb3I9XCJwcmltYXJ5XCIgdHlwZT1cInN1Ym1pdFwiIFtkaXNhYmxlZF09XCIhZm9ybVZhbGlkXCI+XG4gICAgU2VhcmNoXG4gIDwvYnV0dG9uPlxuICA8YnV0dG9uIGNsYXNzPVwiZXh0ZW5kZWQtYnV0dG9ucyByZXNldFwiIG1hdC1zdHJva2VkLWJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgKGNsaWNrKT1cInJlc2V0Rm9ybSgpXCIgW2Rpc2FibGVkXT1cInRoaXMuYWN0aXZlT250b2xvZ3kgPT09IHVuZGVmaW5lZFwiPlxuICAgIFJlc2V0XG4gIDwvYnV0dG9uPlxuXG5cbjwvZm9ybT5cbmAsXG4gICAgc3R5bGVzOiBbYC5hZGQtcHJvcGVydHktYnV0dG9ue21hcmdpbi1yaWdodDo1cHh9LmV4dGVuZGVkLWJ1dHRvbnN7bWFyZ2luLXRvcDoyNXB4fS5leHRlbmRlZC1zZWFyY2gtYnV0dG9ue21hcmdpbi1yaWdodDo1cHh9LnByb3BlcnR5LWJ1dHRvbnN7bWFyZ2luLXRvcDoyNXB4fS5zZWxlY3QtcHJvcGVydHl7bWFyZ2luLWxlZnQ6MjJweH0uc2VsZWN0LXJlc291cmNlLWNsYXNze21hcmdpbi1sZWZ0OjEycHh9YF1cbn0pXG5leHBvcnQgY2xhc3MgRXh0ZW5kZWRTZWFyY2hDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gICAgQElucHV0KCkgcm91dGU7XG5cbiAgICAvLyB0cmlnZ2VyIHRvZ2dsZSBmb3IgZXh0ZW5kZWQgc2VhcmNoIGZvcm1cbiAgICBAT3V0cHV0KCkgdG9nZ2xlRXh0ZW5kZWRTZWFyY2hGb3JtID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xuXG4gICAgLy8gYWxsIGF2YWlsYWJsZSBvbnRvbG9naWVzXG4gICAgb250b2xvZ2llczogQXJyYXk8T250b2xvZ3lNZXRhZGF0YT4gPSBbXTtcblxuICAgIC8vIG9udG9sb2d5IGNob3NlbiBieSB0aGUgdXNlclxuICAgIGFjdGl2ZU9udG9sb2d5OiBzdHJpbmc7XG5cbiAgICAvLyBwcm9wZXJ0aWVzIHNwZWNpZmllZCBieSB0aGUgdXNlclxuICAgIGFjdGl2ZVByb3BlcnRpZXM6IGJvb2xlYW5bXSA9IFtdO1xuXG4gICAgLy8gcmVzb3VyY2UgY2xhc3NlcyBmb3IgdGhlIHNlbGVjdGVkIG9udG9sb2d5XG4gICAgcmVzb3VyY2VDbGFzc2VzOiBBcnJheTxSZXNvdXJjZUNsYXNzPiA9IFtdO1xuXG4gICAgLy8gZGVmaW5pdGlvbiBvZiB0aGUgc2VsZWN0ZWQgcmVzb3VyY2UgY2xhc3MsIGlmIHNldC5cbiAgICBhY3RpdmVSZXNvdXJjZUNsYXNzOiBSZXNvdXJjZUNsYXNzO1xuXG4gICAgLy8gcHJvcGVydGllcyBmb3IgdGhlIHNlbGVjdGVkIG9udG9sb2d5IG9yIHNlbGVjdGVkIHJlc291cmNlIGNsYXNzXG4gICAgcHJvcGVydGllczogUHJvcGVydGllcztcblxuICAgIHJlc3VsdDogUmVhZFJlc291cmNlc1NlcXVlbmNlID0gbmV3IFJlYWRSZXNvdXJjZXNTZXF1ZW5jZShbXSwgMCk7XG5cbiAgICAvLyByZWZlcmVuY2UgdG8gdGhlIGNvbXBvbmVudCB0aGF0IGNvbnRyb2xzIHRoZSByZXNvdXJjZSBjbGFzcyBzZWxlY3Rpb25cbiAgICBAVmlld0NoaWxkKCdyZXNvdXJjZUNsYXNzJykgcmVzb3VyY2VDbGFzc0NvbXBvbmVudDogU2VsZWN0UmVzb3VyY2VDbGFzc0NvbXBvbmVudDtcblxuICAgIC8vIHJlZmVyZW5jZSB0byB0aGUgY29tcG9uZW50IGNvbnRyb2xsaW5nIHRoZSBwcm9wZXJ0eSBzZWxlY3Rpb25cbiAgICBAVmlld0NoaWxkcmVuKCdwcm9wZXJ0eScpIHByb3BlcnR5Q29tcG9uZW50czogUXVlcnlMaXN0PFNlbGVjdFByb3BlcnR5Q29tcG9uZW50PjtcblxuICAgIC8vIEZvcm1Hcm91cCAodXNlZCBhcyBwYXJlbnQgZm9yIGNoaWxkIGNvbXBvbmVudHMpXG4gICAgZm9ybTogRm9ybUdyb3VwO1xuXG4gICAgLy8gZm9ybSB2YWxpZGF0aW9uIHN0YXR1c1xuICAgIGZvcm1WYWxpZCA9IGZhbHNlO1xuXG4gICAgY29uc3RydWN0b3IoQEluamVjdChGb3JtQnVpbGRlcikgcHJpdmF0ZSBmYjogRm9ybUJ1aWxkZXIsXG4gICAgICAgIHByaXZhdGUgX3JvdXRlOiBBY3RpdmF0ZWRSb3V0ZSxcbiAgICAgICAgcHJpdmF0ZSBfcm91dGVyOiBSb3V0ZXIsXG4gICAgICAgIHByaXZhdGUgX2NhY2hlU2VydmljZTogT250b2xvZ3lDYWNoZVNlcnZpY2UsXG4gICAgICAgIHByaXZhdGUgX2dyYXZTZWFyY2hTZXJ2aWNlOiBHcmF2c2VhcmNoR2VuZXJhdGlvblNlcnZpY2UpIHtcbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHtcblxuICAgICAgICAvLyBwYXJlbnQgZm9ybSBpcyBlbXB0eSwgaXQgZ2V0cyBwYXNzZWQgdG8gdGhlIGNoaWxkIGNvbXBvbmVudHNcbiAgICAgICAgdGhpcy5mb3JtID0gdGhpcy5mYi5ncm91cCh7fSk7XG5cbiAgICAgICAgLy8gaWYgZm9ybSBzdGF0dXMgY2hhbmdlcywgcmUtcnVuIHZhbGlkYXRpb25cbiAgICAgICAgdGhpcy5mb3JtLnN0YXR1c0NoYW5nZXMuc3Vic2NyaWJlKChkYXRhKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZvcm1WYWxpZCA9IHRoaXMudmFsaWRhdGVGb3JtKCk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLmZvcm0pO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBpbml0aWFsaXplIG9udG9sb2dpZXMgdG8gYmUgdXNlZCBmb3IgdGhlIG9udG9sb2dpZXMgc2VsZWN0aW9uIGluIHRoZSBzZWFyY2ggZm9ybVxuICAgICAgICB0aGlzLmluaXRpYWxpemVPbnRvbG9naWVzKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIGEgcHJvcGVydHkgdG8gdGhlIHNlYXJjaCBmb3JtLlxuICAgICAqL1xuICAgIGFkZFByb3BlcnR5KCkge1xuICAgICAgICB0aGlzLmFjdGl2ZVByb3BlcnRpZXMucHVzaCh0cnVlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgdGhlIGxhc3QgcHJvcGVydHkgZnJvbSB0aGUgc2VhcmNoIGZvcm0uXG4gICAgICovXG4gICAgcmVtb3ZlUHJvcGVydHkoKSB7XG4gICAgICAgIHRoaXMuYWN0aXZlUHJvcGVydGllcy5zcGxpY2UoLTEsIDEpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgYWxsIGF2YWlsYWJsZSBvbnRvbG9naWVzIGZvciB0aGUgc2VhcmNoIGZvcm0uXG4gICAgICovXG4gICAgaW5pdGlhbGl6ZU9udG9sb2dpZXMoKSB7XG4gICAgICAgIHRoaXMuX2NhY2hlU2VydmljZS5nZXRPbnRvbG9naWVzTWV0YWRhdGEoKS5zdWJzY3JpYmUoXG4gICAgICAgICAgICAob250b2xvZ2llczogQXJyYXk8T250b2xvZ3lNZXRhZGF0YT4pID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLm9udG9sb2dpZXMgPSBvbnRvbG9naWVzO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogT25jZSBhbiBvbnRvbG9neSBoYXMgYmVlbiBzZWxlY3RlZCwgZ2V0cyBpdHMgY2xhc3NlcyBhbmQgcHJvcGVydGllcy5cbiAgICAgKiBUaGUgY2xhc3NlcyBhbmQgcHJvcGVydGllcyB3aWxsIGJlIG1hZGUgYXZhaWxhYmxlIHRvIHRoZSB1c2VyIGZvciBzZWxlY3Rpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gb250b2xvZ3lJcmkgSXJpIG9mIHRoZSBvbnRvbG9neSBjaG9zZW4gYnkgdGhlIHVzZXIuXG4gICAgICovXG4gICAgZ2V0UmVzb3VyY2VDbGFzc2VzQW5kUHJvcGVydGllc0Zvck9udG9sb2d5KG9udG9sb2d5SXJpOiBzdHJpbmcpOiB2b2lkIHtcblxuICAgICAgICAvLyByZXNldCBhY3RpdmUgcmVzb3VyY2UgY2xhc3MgZGVmaW5pdGlvblxuICAgICAgICB0aGlzLmFjdGl2ZVJlc291cmNlQ2xhc3MgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgLy8gcmVzZXQgc3BlY2lmaWVkIHByb3BlcnRpZXNcbiAgICAgICAgdGhpcy5hY3RpdmVQcm9wZXJ0aWVzID0gW107XG5cbiAgICAgICAgdGhpcy5hY3RpdmVPbnRvbG9neSA9IG9udG9sb2d5SXJpO1xuXG4gICAgICAgIHRoaXMuX2NhY2hlU2VydmljZS5nZXRFbnRpdHlEZWZpbml0aW9uc0Zvck9udG9sb2dpZXMoW29udG9sb2d5SXJpXSkuc3Vic2NyaWJlKFxuICAgICAgICAgICAgKG9udG9JbmZvOiBPbnRvbG9neUluZm9ybWF0aW9uKSA9PiB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnJlc291cmNlQ2xhc3NlcyA9IG9udG9JbmZvLmdldFJlc291cmNlQ2xhc3Nlc0FzQXJyYXkoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BlcnRpZXMgPSBvbnRvSW5mby5nZXRQcm9wZXJ0aWVzKCk7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE9uY2UgYSByZXNvdXJjZSBjbGFzcyBoYXMgYmVlbiBzZWxlY3RlZCwgZ2V0cyBpdHMgcHJvcGVydGllcy5cbiAgICAgKiBUaGUgcHJvcGVydGllcyB3aWxsIGJlIG1hZGUgYXZhaWxhYmxlIHRvIHRoZSB1c2VyIGZvciBzZWxlY3Rpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcmVzb3VyY2VDbGFzc0lyaVxuICAgICAqL1xuICAgIGdldFByb3BlcnRpZXNGb3JSZXNvdXJjZUNsYXNzKHJlc291cmNlQ2xhc3NJcmk6IHN0cmluZykge1xuXG4gICAgICAgIC8vIHJlc2V0IHNwZWNpZmllZCBwcm9wZXJ0aWVzXG4gICAgICAgIHRoaXMuYWN0aXZlUHJvcGVydGllcyA9IFtdO1xuXG4gICAgICAgIC8vIGlmIHRoZSBjbGllbnQgdW5kb2VzIHRoZSBzZWxlY3Rpb24gb2YgYSByZXNvdXJjZSBjbGFzcywgdXNlIHRoZSBhY3RpdmUgb250b2xvZ3kgYXMgYSBmYWxsYmFja1xuICAgICAgICBpZiAocmVzb3VyY2VDbGFzc0lyaSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5nZXRSZXNvdXJjZUNsYXNzZXNBbmRQcm9wZXJ0aWVzRm9yT250b2xvZ3kodGhpcy5hY3RpdmVPbnRvbG9neSk7XG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIHRoaXMuX2NhY2hlU2VydmljZS5nZXRSZXNvdXJjZUNsYXNzRGVmaW5pdGlvbnMoW3Jlc291cmNlQ2xhc3NJcmldKS5zdWJzY3JpYmUoXG4gICAgICAgICAgICAgICAgKG9udG9JbmZvOiBPbnRvbG9neUluZm9ybWF0aW9uKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvcGVydGllcyA9IG9udG9JbmZvLmdldFByb3BlcnRpZXMoKTtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFjdGl2ZVJlc291cmNlQ2xhc3MgPSBvbnRvSW5mby5nZXRSZXNvdXJjZUNsYXNzZXMoKVtyZXNvdXJjZUNsYXNzSXJpXTtcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVmFsaWRhdGVzIGZvcm0gYW5kIHJldHVybnMgaXRzIHN0YXR1cyAoYm9vbGVhbikuXG4gICAgICovXG4gICAgcHJpdmF0ZSB2YWxpZGF0ZUZvcm0oKSB7XG5cbiAgICAgICAgLy8gY2hlY2sgdGhhdCBlaXRoZXIgYSByZXNvdXJjZSBjbGFzcyBpcyBzZWxlY3RlZCBvciBhdCBsZWFzdCBvbmUgcHJvcGVydHkgaXMgc3BlY2lmaWVkXG4gICAgICAgIHJldHVybiB0aGlzLmZvcm0udmFsaWQgJiZcbiAgICAgICAgICAgICh0aGlzLnByb3BlcnR5Q29tcG9uZW50cy5sZW5ndGggPiAwIHx8ICh0aGlzLnJlc291cmNlQ2xhc3NDb21wb25lbnQgIT09IHVuZGVmaW5lZCAmJiB0aGlzLnJlc291cmNlQ2xhc3NDb21wb25lbnQuZ2V0UmVzb3VyY2VDbGFzc1NlbGVjdGVkKCkgIT09IGZhbHNlKSk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXNldHMgdGhlIGZvcm0gKHNlbGVjdGVkIHJlc291cmNlIGNsYXNzIGFuZCBzcGVjaWZpZWQgcHJvcGVydGllcykgcHJlc2VydmluZyB0aGUgYWN0aXZlIG9udG9sb2d5LlxuICAgICAqL1xuICAgIHJlc2V0Rm9ybSgpIHtcbiAgICAgICAgaWYgKHRoaXMuYWN0aXZlT250b2xvZ3kgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5nZXRSZXNvdXJjZUNsYXNzZXNBbmRQcm9wZXJ0aWVzRm9yT250b2xvZ3kodGhpcy5hY3RpdmVPbnRvbG9neSk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBHcmF2U2VhcmNoIHF1ZXJ5IHdpdGggdGhlIGdpdmVuIGZvcm0gdmFsdWVzIGFuZCBjYWxscyB0aGUgZXh0ZW5kZWQgc2VhcmNoIHJvdXRlLlxuICAgICAqL1xuICAgIHN1Ym1pdCgpIHtcblxuICAgICAgICBpZiAoIXRoaXMuZm9ybVZhbGlkKSByZXR1cm47IC8vIGNoZWNrIHRoYXQgZnJvbSBpcyB2YWxpZFxuXG4gICAgICAgIGNvbnN0IHJlc0NsYXNzT3B0aW9uID0gdGhpcy5yZXNvdXJjZUNsYXNzQ29tcG9uZW50LmdldFJlc291cmNlQ2xhc3NTZWxlY3RlZCgpO1xuXG4gICAgICAgIGxldCByZXNDbGFzcztcblxuICAgICAgICBpZiAocmVzQ2xhc3NPcHRpb24gIT09IGZhbHNlKSB7XG4gICAgICAgICAgICByZXNDbGFzcyA9IHJlc0NsYXNzT3B0aW9uO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcHJvcGVydGllczogUHJvcGVydHlXaXRoVmFsdWVbXSA9IHRoaXMucHJvcGVydHlDb21wb25lbnRzLm1hcChcbiAgICAgICAgICAgIChwcm9wQ29tcCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBwcm9wQ29tcC5nZXRQcm9wZXJ0eVNlbGVjdGVkV2l0aFZhbHVlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG5cbiAgICAgICAgY29uc3QgZ3JhdnNlYXJjaCA9IHRoaXMuX2dyYXZTZWFyY2hTZXJ2aWNlLmNyZWF0ZUdyYXZzZWFyY2hRdWVyeShwcm9wZXJ0aWVzLCByZXNDbGFzcywgMCk7XG5cbiAgICAgICAgdGhpcy5fcm91dGVyLm5hdmlnYXRlKFt0aGlzLnJvdXRlICsgJy9leHRlbmRlZC8nLCBncmF2c2VhcmNoXSwgeyByZWxhdGl2ZVRvOiB0aGlzLl9yb3V0ZSB9KTtcblxuICAgICAgICAvLyB0b2dnbGUgZXh0ZW5kZWQgc2VhcmNoIGZvcm1cbiAgICAgICAgdGhpcy50b2dnbGVFeHRlbmRlZFNlYXJjaEZvcm0uZW1pdCh0cnVlKTtcblxuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIEluamVjdCwgSW5wdXQsIE9uSW5pdCwgT3V0cHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPbnRvbG9neU1ldGFkYXRhIH0gZnJvbSAnQGtub3JhL2NvcmUnO1xuaW1wb3J0IHsgRm9ybUJ1aWxkZXIsIEZvcm1Hcm91cCwgVmFsaWRhdG9ycyB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAna3VpLXNlbGVjdC1vbnRvbG9neScsXG4gIHRlbXBsYXRlOiBgPG1hdC1mb3JtLWZpZWxkICpuZ0lmPVwib250b2xvZ2llcy5sZW5ndGggPiAwXCI+XG4gIDxtYXQtc2VsZWN0IHBsYWNlaG9sZGVyPVwiT250b2xvZ3lcIiBbZm9ybUNvbnRyb2xdPVwiZm9ybS5jb250cm9sc1snb250b2xvZ3knXVwiPlxuICAgICAgPG1hdC1vcHRpb24gKm5nRm9yPVwibGV0IG9udG8gb2Ygb250b2xvZ2llc1wiIFt2YWx1ZV09XCJvbnRvLmlkXCI+e3sgb250by5sYWJlbCB9fTwvbWF0LW9wdGlvbj5cbiAgPC9tYXQtc2VsZWN0PlxuPC9tYXQtZm9ybS1maWVsZD5cbmAsXG4gIHN0eWxlczogW2BgXVxufSlcbmV4cG9ydCBjbGFzcyBTZWxlY3RPbnRvbG9neUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgQElucHV0KCkgZm9ybUdyb3VwOiBGb3JtR3JvdXA7XG5cbiAgQElucHV0KCkgb250b2xvZ2llczogQXJyYXk8T250b2xvZ3lNZXRhZGF0YT47XG5cbiAgQE91dHB1dCgpIG9udG9sb2d5U2VsZWN0ZWQgPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oKTtcblxuICBmb3JtOiBGb3JtR3JvdXA7XG5cbiAgY29uc3RydWN0b3IoQEluamVjdChGb3JtQnVpbGRlcikgcHJpdmF0ZSBmYjogRm9ybUJ1aWxkZXIpIHsgfVxuXG4gIG5nT25Jbml0KCkge1xuXG4gICAgLy8gYnVpbGQgYSBmb3JtIGZvciB0aGUgbmFtZWQgZ3JhcGggc2VsZWN0aW9uXG4gICAgdGhpcy5mb3JtID0gdGhpcy5mYi5ncm91cCh7XG4gICAgICBvbnRvbG9neTogW251bGwsIFZhbGlkYXRvcnMucmVxdWlyZWRdXG4gICAgfSk7XG5cbiAgICAvLyBlbWl0IElyaSBvZiB0aGUgb250b2xvZ3kgd2hlbiBiZWluZyBzZWxlY3RlZFxuICAgIHRoaXMuZm9ybS52YWx1ZUNoYW5nZXMuc3Vic2NyaWJlKChkYXRhKSA9PiB7XG4gICAgICB0aGlzLm9udG9sb2d5U2VsZWN0ZWQuZW1pdChkYXRhLm9udG9sb2d5KTtcbiAgICB9KTtcblxuICAgIC8vIGFkZCBmb3JtIHRvIHRoZSBwYXJlbnQgZm9ybSBncm91cFxuICAgIHRoaXMuZm9ybUdyb3VwLmFkZENvbnRyb2woJ29udG9sb2d5JywgdGhpcy5mb3JtKTtcblxuICB9XG5cbn1cbiIsImltcG9ydCB7IENvbXBvbmVudCwgSW5qZWN0LCBJbnB1dCwgT25DaGFuZ2VzLCBPbkluaXQsIFZpZXdDaGlsZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRm9ybUJ1aWxkZXIsIEZvcm1Hcm91cCwgVmFsaWRhdG9ycyB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7XG4gICAgQ29tcGFyaXNvbk9wZXJhdG9yLFxuICAgIENvbXBhcmlzb25PcGVyYXRvckFuZFZhbHVlLFxuICAgIEVxdWFscyxcbiAgICBFeGlzdHMsXG4gICAgR3JlYXRlclRoYW4sXG4gICAgR3JlYXRlclRoYW5FcXVhbHMsXG4gICAgS25vcmFDb25zdGFudHMsXG4gICAgTGVzc1RoYW4sXG4gICAgTGVzc1RoYW5FcXVhbHMsXG4gICAgTGlrZSxcbiAgICBNYXRjaCxcbiAgICBOb3RFcXVhbHMsXG4gICAgUHJvcGVydHksXG4gICAgUHJvcGVydHlWYWx1ZSxcbiAgICBWYWx1ZVxufSBmcm9tICdAa25vcmEvY29yZSc7XG5cblxuLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNDU2NjEwMTAvZHluYW1pYy1uZXN0ZWQtcmVhY3RpdmUtZm9ybS1leHByZXNzaW9uY2hhbmdlZGFmdGVyaXRoYXNiZWVuY2hlY2tlZGVycm9yXG5jb25zdCByZXNvbHZlZFByb21pc2UgPSBQcm9taXNlLnJlc29sdmUobnVsbCk7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAna3VpLXNwZWNpZnktcHJvcGVydHktdmFsdWUnLFxuICAgIHRlbXBsYXRlOiBgPG1hdC1mb3JtLWZpZWxkIGNsYXNzPVwic2VhcmNoLW9wZXJhdG9yLWZpZWxkXCIgKm5nSWY9XCJjb21wYXJpc29uT3BlcmF0b3JzPy5sZW5ndGggPiAwXCI+XG4gICAgPG1hdC1zZWxlY3QgcGxhY2Vob2xkZXI9XCJDb21wYXJpc29uIE9wZXJhdG9yXCIgW2Zvcm1Db250cm9sXT1cImZvcm0uY29udHJvbHNbJ2NvbXBhcmlzb25PcGVyYXRvciddXCI+XG4gICAgICAgIDxtYXQtb3B0aW9uICpuZ0Zvcj1cImxldCBjb21wT3Agb2YgY29tcGFyaXNvbk9wZXJhdG9yc1wiIFt2YWx1ZV09XCJjb21wT3BcIj57eyBjb21wT3AubGFiZWwgfX08L21hdC1vcHRpb24+XG4gICAgPC9tYXQtc2VsZWN0PlxuPC9tYXQtZm9ybS1maWVsZD5cblxuPCEtLSBzZWxlY3QgYXB0IGNvbXBvbmVudCBmb3IgdmFsdWUgc3BlY2lmaWNhdGlvbiB1c2luZyBhIHN3aXRjaCBjYXNlIHN0YXRlbWVudC0tPlxuPHNwYW5cbiAgICAqbmdJZj1cImNvbXBhcmlzb25PcGVyYXRvclNlbGVjdGVkICE9PSB1bmRlZmluZWQgJiYgY29tcGFyaXNvbk9wZXJhdG9yU2VsZWN0ZWQgIT09IG51bGwgJiYgY29tcGFyaXNvbk9wZXJhdG9yU2VsZWN0ZWQuZ2V0Q2xhc3NOYW1lKCkgIT0gJ0V4aXN0cydcIlxuICAgIFtuZ1N3aXRjaF09XCJwcm9wZXJ0eVZhbHVlVHlwZVwiPlxuICA8Ym9vbGVhbi12YWx1ZSAjcHJvcGVydHlWYWx1ZSBbZm9ybUdyb3VwXT1cImZvcm1cIiAqbmdTd2l0Y2hDYXNlPVwiS25vcmFDb25zdGFudHMuQm9vbGVhblZhbHVlXCI+PC9ib29sZWFuLXZhbHVlPlxuICA8ZGF0ZS12YWx1ZSAjcHJvcGVydHlWYWx1ZSBbZm9ybUdyb3VwXT1cImZvcm1cIiAqbmdTd2l0Y2hDYXNlPVwiS25vcmFDb25zdGFudHMuRGF0ZVZhbHVlXCI+PC9kYXRlLXZhbHVlPlxuICA8ZGVjaW1hbC12YWx1ZSAjcHJvcGVydHlWYWx1ZSBbZm9ybUdyb3VwXT1cImZvcm1cIiAqbmdTd2l0Y2hDYXNlPVwiS25vcmFDb25zdGFudHMuRGVjaW1hbFZhbHVlXCI+PC9kZWNpbWFsLXZhbHVlPlxuICA8aW50ZWdlci12YWx1ZSAjcHJvcGVydHlWYWx1ZSBbZm9ybUdyb3VwXT1cImZvcm1cIiAqbmdTd2l0Y2hDYXNlPVwiS25vcmFDb25zdGFudHMuSW50VmFsdWVcIj48L2ludGVnZXItdmFsdWU+XG4gIDxsaW5rLXZhbHVlICNwcm9wZXJ0eVZhbHVlIFtmb3JtR3JvdXBdPVwiZm9ybVwiIFtyZXN0cmljdFJlc291cmNlQ2xhc3NdPVwicHJvcGVydHkub2JqZWN0VHlwZVwiXG4gICAgICAgICAgICAgICpuZ1N3aXRjaENhc2U9XCJLbm9yYUNvbnN0YW50cy5SZXNvdXJjZVwiPjwvbGluay12YWx1ZT5cbiAgPHRleHQtdmFsdWUgI3Byb3BlcnR5VmFsdWUgW2Zvcm1Hcm91cF09XCJmb3JtXCIgKm5nU3dpdGNoQ2FzZT1cIktub3JhQ29uc3RhbnRzLlRleHRWYWx1ZVwiPjwvdGV4dC12YWx1ZT5cbiAgPHVyaS12YWx1ZSAjcHJvcGVydHlWYWx1ZSBbZm9ybUdyb3VwXT1cImZvcm1cIiAqbmdTd2l0Y2hDYXNlPVwiS25vcmFDb25zdGFudHMuVXJpVmFsdWVcIj48L3VyaS12YWx1ZT5cblxuICAgIDwhLS0gVE9ETzogUmVzb3VyY2U6IGhhbmRsZSBsaW5raW5nIHByb3BlcnRpZXMgd2l0aCB0YXJnZXQgY2xhc3MgcmVzdHJpY3Rpb246IGFjY2VzcyBwcm9wZXJ0eSBtZW1iZXIgdG8gZ2V0IG9iamVjdENsYXNzIHZpYSBwcm9wZXJ0eSgpIGdldHRlciBtZXRob2QgLS0+XG4gIDxzcGFuICpuZ1N3aXRjaERlZmF1bHQ9XCJcIj5Ob3Qgc3VwcG9ydGVkIHt7cHJvcGVydHlWYWx1ZVR5cGV9fTwvc3Bhbj5cbjwvc3Bhbj5cbmAsXG4gICAgc3R5bGVzOiBbYC5zZWFyY2gtb3BlcmF0b3ItZmllbGR7bWFyZ2luLXJpZ2h0OjhweH1gXVxufSlcbmV4cG9ydCBjbGFzcyBTcGVjaWZ5UHJvcGVydHlWYWx1ZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzIHtcblxuICAgIEtub3JhQ29uc3RhbnRzID0gS25vcmFDb25zdGFudHM7XG5cbiAgICAvLyBwYXJlbnQgRm9ybUdyb3VwXG4gICAgQElucHV0KCkgZm9ybUdyb3VwOiBGb3JtR3JvdXA7XG5cbiAgICBAVmlld0NoaWxkKCdwcm9wZXJ0eVZhbHVlJykgcHJvcGVydHlWYWx1ZUNvbXBvbmVudDogUHJvcGVydHlWYWx1ZTtcblxuICAgIC8vIHNldHRlciBtZXRob2QgZm9yIHRoZSBwcm9wZXJ0eSBjaG9zZW4gYnkgdGhlIHVzZXJcbiAgICBASW5wdXQoKVxuICAgIHNldCBwcm9wZXJ0eShwcm9wOiBQcm9wZXJ0eSkge1xuICAgICAgICB0aGlzLmNvbXBhcmlzb25PcGVyYXRvclNlbGVjdGVkID0gdW5kZWZpbmVkOyAvLyByZXNldCB0byBpbml0aWFsIHN0YXRlXG4gICAgICAgIHRoaXMuX3Byb3BlcnR5ID0gcHJvcDtcbiAgICAgICAgdGhpcy5yZXNldENvbXBhcmlzb25PcGVyYXRvcnMoKTsgLy8gcmVzZXQgY29tcGFyaXNvbiBvcGVyYXRvcnMgZm9yIGdpdmVuIHByb3BlcnR5IChvdmVyd3JpdGluZyBhbnkgcHJldmlvdXMgc2VsZWN0aW9uKVxuICAgIH1cblxuICAgIC8vIGdldHRlciBtZXRob2QgZm9yIHRoaXMuX3Byb3BlcnR5XG4gICAgZ2V0IHByb3BlcnR5KCk6IFByb3BlcnR5IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Byb3BlcnR5O1xuICAgIH1cblxuICAgIHByaXZhdGUgX3Byb3BlcnR5OiBQcm9wZXJ0eTtcblxuICAgIGZvcm06IEZvcm1Hcm91cDtcblxuICAgIC8vIGF2YWlsYWJsZSBjb21wYXJpc29uIG9wZXJhdG9ycyBmb3IgdGhlIHByb3BlcnR5XG4gICAgY29tcGFyaXNvbk9wZXJhdG9yczogQXJyYXk8Q29tcGFyaXNvbk9wZXJhdG9yPiA9IFtdO1xuXG4gICAgLy8gY29tcGFyaXNvbiBvcGVyYXRvciBzZWxlY3RlZCBieSB0aGUgdXNlclxuICAgIGNvbXBhcmlzb25PcGVyYXRvclNlbGVjdGVkOiBDb21wYXJpc29uT3BlcmF0b3I7XG5cbiAgICAvLyB0aGUgdHlwZSBvZiB0aGUgcHJvcGVydHlcbiAgICBwcm9wZXJ0eVZhbHVlVHlwZTtcblxuICAgIGNvbnN0cnVjdG9yKEBJbmplY3QoRm9ybUJ1aWxkZXIpIHByaXZhdGUgZmI6IEZvcm1CdWlsZGVyKSB7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVzZXRzIHRoZSBjb21wYXJpc29uIG9wZXJhdG9ycyBmb3IgdGhpcy5fcHJvcGVydHkuXG4gICAgICovXG4gICAgcmVzZXRDb21wYXJpc29uT3BlcmF0b3JzKCkge1xuXG4gICAgICAgIC8vIGRlcGVuZGluZyBvbiBvYmplY3QgY2xhc3MsIHNldCBjb21wYXJpc29uIG9wZXJhdG9ycyBhbmQgdmFsdWUgZW50cnkgZmllbGRcbiAgICAgICAgaWYgKHRoaXMuX3Byb3BlcnR5LmlzTGlua1Byb3BlcnR5KSB7XG4gICAgICAgICAgICB0aGlzLnByb3BlcnR5VmFsdWVUeXBlID0gS25vcmFDb25zdGFudHMuUmVzb3VyY2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnByb3BlcnR5VmFsdWVUeXBlID0gdGhpcy5fcHJvcGVydHkub2JqZWN0VHlwZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN3aXRjaCAodGhpcy5wcm9wZXJ0eVZhbHVlVHlwZSkge1xuXG4gICAgICAgICAgICBjYXNlIEtub3JhQ29uc3RhbnRzLlRleHRWYWx1ZTpcbiAgICAgICAgICAgICAgICB0aGlzLmNvbXBhcmlzb25PcGVyYXRvcnMgPSBbbmV3IExpa2UoKSwgbmV3IE1hdGNoKCksIG5ldyBFcXVhbHMoKSwgbmV3IE5vdEVxdWFscygpLCBuZXcgRXhpc3RzKCldO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIEtub3JhQ29uc3RhbnRzLkJvb2xlYW5WYWx1ZTpcbiAgICAgICAgICAgIGNhc2UgS25vcmFDb25zdGFudHMuUmVzb3VyY2U6XG4gICAgICAgICAgICBjYXNlIEtub3JhQ29uc3RhbnRzLlVyaVZhbHVlOlxuICAgICAgICAgICAgY2FzZSBLbm9yYUNvbnN0YW50cy5JbnRlcnZhbFZhbHVlOlxuICAgICAgICAgICAgICAgIHRoaXMuY29tcGFyaXNvbk9wZXJhdG9ycyA9IFtuZXcgRXF1YWxzKCksIG5ldyBOb3RFcXVhbHMoKSwgbmV3IEV4aXN0cygpXTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSBLbm9yYUNvbnN0YW50cy5JbnRWYWx1ZTpcbiAgICAgICAgICAgIGNhc2UgS25vcmFDb25zdGFudHMuRGVjaW1hbFZhbHVlOlxuICAgICAgICAgICAgY2FzZSBLbm9yYUNvbnN0YW50cy5EYXRlVmFsdWU6XG4gICAgICAgICAgICAgICAgdGhpcy5jb21wYXJpc29uT3BlcmF0b3JzID0gW25ldyBFcXVhbHMoKSwgbmV3IE5vdEVxdWFscygpLCBuZXcgTGVzc1RoYW4oKSwgbmV3IExlc3NUaGFuRXF1YWxzKCksIG5ldyBHcmVhdGVyVGhhbigpLCBuZXcgR3JlYXRlclRoYW5FcXVhbHMoKSwgbmV3IEV4aXN0cygpXTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSBLbm9yYUNvbnN0YW50cy5MaXN0VmFsdWU6XG4gICAgICAgICAgICBjYXNlIEtub3JhQ29uc3RhbnRzLkdlb21WYWx1ZTpcbiAgICAgICAgICAgIGNhc2UgS25vcmFDb25zdGFudHMuRmlsZVZhbHVlOlxuICAgICAgICAgICAgY2FzZSBLbm9yYUNvbnN0YW50cy5BdWRpb0ZpbGVWYWx1ZTpcbiAgICAgICAgICAgIGNhc2UgS25vcmFDb25zdGFudHMuU3RpbGxJbWFnZUZpbGVWYWx1ZTpcbiAgICAgICAgICAgIGNhc2UgS25vcmFDb25zdGFudHMuRERERmlsZVZhbHVlOlxuICAgICAgICAgICAgY2FzZSBLbm9yYUNvbnN0YW50cy5Nb3ZpbmdJbWFnZUZpbGVWYWx1ZTpcbiAgICAgICAgICAgIGNhc2UgS25vcmFDb25zdGFudHMuVGV4dEZpbGVWYWx1ZTpcbiAgICAgICAgICAgIGNhc2UgS25vcmFDb25zdGFudHMuQ29sb3JWYWx1ZTpcbiAgICAgICAgICAgICAgICB0aGlzLmNvbXBhcmlzb25PcGVyYXRvcnMgPSBbbmV3IEV4aXN0cygpXTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnRVJST1I6IFVuc3VwcG9ydGVkIHZhbHVlIHR5cGUgJyArIHRoaXMuX3Byb3BlcnR5Lm9iamVjdFR5cGUpO1xuXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIG5nT25Jbml0KCkgeyB9XG5cbiAgICBuZ09uQ2hhbmdlcygpIHtcblxuICAgICAgICAvLyBidWlsZCBhIGZvcm0gZm9yIGNvbXBhcmlzb24gb3BlcmF0b3Igc2VsZWN0aW9uXG4gICAgICAgIHRoaXMuZm9ybSA9IHRoaXMuZmIuZ3JvdXAoe1xuICAgICAgICAgICAgY29tcGFyaXNvbk9wZXJhdG9yOiBbbnVsbCwgVmFsaWRhdG9ycy5yZXF1aXJlZF1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gc3RvcmUgY29tcGFyaXNvbiBvcGVyYXRvciB3aGVuIHNlbGVjdGVkXG4gICAgICAgIHRoaXMuZm9ybS52YWx1ZUNoYW5nZXMuc3Vic2NyaWJlKChkYXRhKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNvbXBhcmlzb25PcGVyYXRvclNlbGVjdGVkID0gZGF0YS5jb21wYXJpc29uT3BlcmF0b3I7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJlc29sdmVkUHJvbWlzZS50aGVuKCgpID0+IHtcblxuICAgICAgICAgICAgLy8gcmVtb3ZlIGZyb20gdGhlIHBhcmVudCBmb3JtIGdyb3VwIChjbGVhbiByZXNldClcbiAgICAgICAgICAgIHRoaXMuZm9ybUdyb3VwLnJlbW92ZUNvbnRyb2woJ2NvbXBhcmlzb25PcGVyYXRvcicpO1xuXG4gICAgICAgICAgICAvLyBhZGQgZm9ybSB0byB0aGUgcGFyZW50IGZvcm0gZ3JvdXBcbiAgICAgICAgICAgIHRoaXMuZm9ybUdyb3VwLmFkZENvbnRyb2woJ2NvbXBhcmlzb25PcGVyYXRvcicsIHRoaXMuZm9ybSk7XG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgc3BlY2lmaWVkIGNvbXBhcmlzb24gb3BlcmF0b3IgYW5kIHZhbHVlIGZvciB0aGUgcHJvcGVydHkuXG4gICAgICpcbiAgICAgKiByZXR1cm5zIHtDb21wYXJpc29uT3BlcmF0b3JBbmRWYWx1ZX0gdGhlIGNvbXBhcmlzb24gb3BlcmF0b3IgYW5kIHRoZSBzcGVjaWZpZWQgdmFsdWVcbiAgICAgKi9cbiAgICBnZXRDb21wYXJpc29uT3BlcmF0b3JBbmRWYWx1ZUxpdGVyYWxGb3JQcm9wZXJ0eSgpOiBDb21wYXJpc29uT3BlcmF0b3JBbmRWYWx1ZSB7XG4gICAgICAgIC8vIHJldHVybiB2YWx1ZSAobGl0ZXJhbCBvciBJUkkpIGZyb20gdGhlIGNoaWxkIGNvbXBvbmVudFxuICAgICAgICBsZXQgdmFsdWU6IFZhbHVlO1xuXG4gICAgICAgIC8vIGNvbXBhcmlzb24gb3BlcmF0b3IgJ0V4aXN0cycgZG9lcyBub3QgcmVxdWlyZSBhIHZhbHVlXG4gICAgICAgIGlmICh0aGlzLmNvbXBhcmlzb25PcGVyYXRvclNlbGVjdGVkLmdldENsYXNzTmFtZSgpICE9PSAnRXhpc3RzJykge1xuICAgICAgICAgICAgdmFsdWUgPSB0aGlzLnByb3BlcnR5VmFsdWVDb21wb25lbnQuZ2V0VmFsdWUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHJldHVybiB0aGUgY29tcGFyaXNvbiBvcGVyYXRvciBhbmQgdGhlIHNwZWNpZmllZCB2YWx1ZVxuICAgICAgICByZXR1cm4gbmV3IENvbXBhcmlzb25PcGVyYXRvckFuZFZhbHVlKHRoaXMuY29tcGFyaXNvbk9wZXJhdG9yU2VsZWN0ZWQsIHZhbHVlKTtcblxuICAgIH1cblxufVxuXG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIEluamVjdCwgSW5wdXQsIE9uRGVzdHJveSwgT25Jbml0LCBWaWV3Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gICAgQ2FyZGluYWxpdHksXG4gICAgQ2FyZGluYWxpdHlPY2N1cnJlbmNlLFxuICAgIENvbXBhcmlzb25PcGVyYXRvckFuZFZhbHVlLFxuICAgIFByb3BlcnRpZXMsXG4gICAgUHJvcGVydHksXG4gICAgUHJvcGVydHlXaXRoVmFsdWUsXG4gICAgUmVzb3VyY2VDbGFzc1xufSBmcm9tICdAa25vcmEvY29yZSc7XG5pbXBvcnQgeyBGb3JtQnVpbGRlciwgRm9ybUdyb3VwLCBWYWxpZGF0b3JzIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgU3BlY2lmeVByb3BlcnR5VmFsdWVDb21wb25lbnQgfSBmcm9tICcuL3NwZWNpZnktcHJvcGVydHktdmFsdWUvc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZS5jb21wb25lbnQnO1xuXG5cbi8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzQ1NjYxMDEwL2R5bmFtaWMtbmVzdGVkLXJlYWN0aXZlLWZvcm0tZXhwcmVzc2lvbmNoYW5nZWRhZnRlcml0aGFzYmVlbmNoZWNrZWRlcnJvclxuY29uc3QgcmVzb2x2ZWRQcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKG51bGwpO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ2t1aS1zZWxlY3QtcHJvcGVydHknLFxuICAgIHRlbXBsYXRlOiBgPG1hdC1mb3JtLWZpZWxkIGNsYXNzPVwic2VhcmNoLXByb3BlcnR5LWZpZWxkXCIgKm5nSWY9XCJwcm9wZXJ0aWVzQXNBcnJheT8ubGVuZ3RoID4gMFwiPlxuICA8bWF0LXNlbGVjdCBwbGFjZWhvbGRlcj1cIlByb3BlcnRpZXNcIiBbZm9ybUNvbnRyb2xdPVwiZm9ybS5jb250cm9sc1sncHJvcGVydHknXVwiPlxuICAgIDxtYXQtb3B0aW9uICpuZ0Zvcj1cImxldCBwcm9wIG9mIHByb3BlcnRpZXNBc0FycmF5XCIgW3ZhbHVlXT1cInByb3AuaWRcIj57eyBwcm9wLmxhYmVsIH19PC9tYXQtb3B0aW9uPlxuICA8L21hdC1zZWxlY3Q+XG48L21hdC1mb3JtLWZpZWxkPlxuXG48a3VpLXNwZWNpZnktcHJvcGVydHktdmFsdWUgI3NwZWNpZnlQcm9wZXJ0eVZhbHVlIFtmb3JtR3JvdXBdPVwiZm9ybVwiICpuZ0lmPVwicHJvcGVydHlTZWxlY3RlZCAhPT0gdW5kZWZpbmVkXCIgW3Byb3BlcnR5XT1cInByb3BlcnR5U2VsZWN0ZWRcIj48L2t1aS1zcGVjaWZ5LXByb3BlcnR5LXZhbHVlPlxuXG48bWF0LWNoZWNrYm94IG1hdFRvb2x0aXA9XCJTb3J0IGNyaXRlcmlvblwiICpuZ0lmPVwicHJvcGVydHlTZWxlY3RlZCAhPT0gdW5kZWZpbmVkICYmIHNvcnRDcml0ZXJpb24oKVwiIFtmb3JtQ29udHJvbF09XCJmb3JtLmNvbnRyb2xzWydpc1NvcnRDcml0ZXJpb24nXVwiPjwvbWF0LWNoZWNrYm94PmAsXG4gICAgc3R5bGVzOiBbYC5zZWFyY2gtcHJvcGVydHktZmllbGR7bWFyZ2luLXJpZ2h0OjhweH1gXVxufSlcbmV4cG9ydCBjbGFzcyBTZWxlY3RQcm9wZXJ0eUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcblxuICAgIC8vIHBhcmVudCBGb3JtR3JvdXBcbiAgICBASW5wdXQoKSBmb3JtR3JvdXA6IEZvcm1Hcm91cDtcblxuICAgIC8vIGluZGV4IG9mIHRoZSBnaXZlbiBwcm9wZXJ0eSAodW5pcXVlKVxuICAgIEBJbnB1dCgpIGluZGV4OiBudW1iZXI7XG5cbiAgICAvLyBzZXR0ZXIgbWV0aG9kIGZvciBwcm9wZXJ0aWVzIHdoZW4gYmVpbmcgdXBkYXRlZCBieSBwYXJlbnQgY29tcG9uZW50XG4gICAgQElucHV0KClcbiAgICBzZXQgcHJvcGVydGllcyh2YWx1ZTogUHJvcGVydGllcykge1xuICAgICAgICB0aGlzLnByb3BlcnR5U2VsZWN0ZWQgPSB1bmRlZmluZWQ7IC8vIHJlc2V0IHNlbGVjdGVkIHByb3BlcnR5IChvdmVyd3JpdGluZyBhbnkgcHJldmlvdXMgc2VsZWN0aW9uKVxuICAgICAgICB0aGlzLl9wcm9wZXJ0aWVzID0gdmFsdWU7XG4gICAgICAgIHRoaXMudXBkYXRlUHJvcGVydGllc0FycmF5KCk7XG4gICAgfVxuXG4gICAgZ2V0IHByb3BlcnRpZXMoKSB7XG4gICAgICAgcmV0dXJuIHRoaXMuX3Byb3BlcnRpZXM7XG4gICAgfVxuXG4gICAgX2FjdGl2ZVJlc291cmNlQ2xhc3M6IFJlc291cmNlQ2xhc3M7XG5cbiAgICAvLyBzZXR0ZXIgbWV0aG9kIGZvciBzZWxlY3RlZCByZXNvdXJjZSBjbGFzc1xuICAgIEBJbnB1dCgpXG4gICAgc2V0IGFjdGl2ZVJlc291cmNlQ2xhc3ModmFsdWU6IFJlc291cmNlQ2xhc3MpIHtcbiAgICAgICAgdGhpcy5fYWN0aXZlUmVzb3VyY2VDbGFzcyA9IHZhbHVlO1xuICAgIH1cblxuICAgIC8vIHJlZmVyZW5jZSB0byBjaGlsZCBjb21wb25lbnQ6IGNvbWJpbmF0aW9uIG9mIGNvbXBhcmlzb24gb3BlcmF0b3IgYW5kIHZhbHVlIGZvciBjaG9zZW4gcHJvcGVydHlcbiAgICBAVmlld0NoaWxkKCdzcGVjaWZ5UHJvcGVydHlWYWx1ZScpIHNwZWNpZnlQcm9wZXJ0eVZhbHVlOiBTcGVjaWZ5UHJvcGVydHlWYWx1ZUNvbXBvbmVudDtcblxuICAgIC8vIHByb3BlcnRpZXMgdGhhdCBjYW4gYmUgc2VsZWN0ZWQgZnJvbVxuICAgIHByaXZhdGUgX3Byb3BlcnRpZXM6IFByb3BlcnRpZXM7XG5cbiAgICAvLyBwcm9wZXJ0aWVzIGFzIGFuIEFycmF5IHN0cnVjdHVyZSAoYmFzZWQgb24gdGhpcy5wcm9wZXJ0aWVzKVxuICAgIHByb3BlcnRpZXNBc0FycmF5OiBBcnJheTxQcm9wZXJ0eT47XG5cbiAgICAvLyByZXByZXNlbnRzIHRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgcHJvcGVydHlcbiAgICBwcm9wZXJ0eVNlbGVjdGVkOiBQcm9wZXJ0eTtcblxuICAgIGZvcm06IEZvcm1Hcm91cDtcblxuICAgIC8vIHVuaXF1ZSBuYW1lIGZvciB0aGlzIHByb3BlcnR5IHRvIGJlIHVzZWQgaW4gdGhlIHBhcmVudCBGb3JtR3JvdXBcbiAgICBwcm9wSW5kZXg6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKEBJbmplY3QoRm9ybUJ1aWxkZXIpIHByaXZhdGUgZmI6IEZvcm1CdWlsZGVyKSB7XG5cbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHtcblxuICAgICAgICAvLyBidWlsZCBhIGZvcm0gZm9yIHRoZSBwcm9wZXJ0eSBzZWxlY3Rpb25cbiAgICAgICAgdGhpcy5mb3JtID0gdGhpcy5mYi5ncm91cCh7XG4gICAgICAgICAgICBwcm9wZXJ0eTogW251bGwsIFZhbGlkYXRvcnMucmVxdWlyZWRdLFxuICAgICAgICAgICAgaXNTb3J0Q3JpdGVyaW9uOiBbZmFsc2UsIFZhbGlkYXRvcnMucmVxdWlyZWRdXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIHVwZGF0ZSB0aGUgc2VsZWN0ZWQgcHJvcGVydHlcbiAgICAgICAgdGhpcy5mb3JtLnZhbHVlQ2hhbmdlcy5zdWJzY3JpYmUoKGRhdGEpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHByb3BJcmkgPSBkYXRhLnByb3BlcnR5O1xuICAgICAgICAgICAgdGhpcy5wcm9wZXJ0eVNlbGVjdGVkID0gdGhpcy5fcHJvcGVydGllc1twcm9wSXJpXTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmVzb2x2ZWRQcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wcm9wSW5kZXggPSAncHJvcGVydHknICsgdGhpcy5pbmRleDtcblxuICAgICAgICAgICAgLy8gYWRkIGZvcm0gdG8gdGhlIHBhcmVudCBmb3JtIGdyb3VwXG4gICAgICAgICAgICB0aGlzLmZvcm1Hcm91cC5hZGRDb250cm9sKHRoaXMucHJvcEluZGV4LCB0aGlzLmZvcm0pO1xuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCkge1xuXG4gICAgICAgIC8vIHJlbW92ZSBmb3JtIGZyb20gdGhlIHBhcmVudCBmb3JtIGdyb3VwXG4gICAgICAgIHJlc29sdmVkUHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZm9ybUdyb3VwLnJlbW92ZUNvbnRyb2wodGhpcy5wcm9wSW5kZXgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbmRpY2F0ZXMgaWYgcHJvcGVydHkgY2FuIGJlIHVzZWQgYXMgYSBzb3J0IGNyaXRlcmlvbi5cbiAgICAgKiBQcm9wZXJ0eSBoYXMgdG8gaGF2ZSBjYXJkaW5hbGl0eSBvciBtYXggY2FyZGluYWxpdHkgMSBmb3IgdGhlIGNob3NlbiByZXNvdXJjZSBjbGFzcy5cbiAgICAgKlxuICAgICAqIFdlIGNhbm5vdCBzb3J0IGJ5IHByb3BlcnRpZXMgd2hvc2UgY2FyZGluYWxpdHkgaXMgZ3JlYXRlciB0aGFuIDEuXG4gICAgICogUmV0dXJuIGJvb2xlYW5cbiAgICAgKi9cbiAgICBzb3J0Q3JpdGVyaW9uKCkge1xuXG4gICAgICAgIC8vIGNoZWNrIGlmIGEgcmVzb3VyY2UgY2xhc3MgaXMgc2VsZWN0ZWQgYW5kIGlmIHRoZSBwcm9wZXJ0eSdzIGNhcmRpbmFsaXR5IGlzIDEgZm9yIHRoZSBzZWxlY3RlZCByZXNvdXJjZSBjbGFzc1xuICAgICAgICBpZiAodGhpcy5fYWN0aXZlUmVzb3VyY2VDbGFzcyAhPT0gdW5kZWZpbmVkICYmIHRoaXMucHJvcGVydHlTZWxlY3RlZCAhPT0gdW5kZWZpbmVkICYmICF0aGlzLnByb3BlcnR5U2VsZWN0ZWQuaXNMaW5rUHJvcGVydHkpIHtcblxuICAgICAgICAgICAgY29uc3QgY2FyZGluYWxpdGllczogQ2FyZGluYWxpdHlbXSA9IHRoaXMuX2FjdGl2ZVJlc291cmNlQ2xhc3MuY2FyZGluYWxpdGllcy5maWx0ZXIoXG4gICAgICAgICAgICAgICAgKGNhcmQ6IENhcmRpbmFsaXR5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNhcmRpbmFsaXR5IDEgb3IgbWF4IG9jY3VycmVuY2UgMVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2FyZC5wcm9wZXJ0eSA9PT0gdGhpcy5wcm9wZXJ0eVNlbGVjdGVkLmlkXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiBjYXJkLnZhbHVlID09PSAxXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiAoY2FyZC5vY2N1cnJlbmNlID09PSBDYXJkaW5hbGl0eU9jY3VycmVuY2UuY2FyZCB8fCBjYXJkLm9jY3VycmVuY2UgPT09IENhcmRpbmFsaXR5T2NjdXJyZW5jZS5tYXhDYXJkKVxuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgcmV0dXJuIGNhcmRpbmFsaXRpZXMubGVuZ3RoID09PSAxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGVzIHRoZSBwcm9wZXJ0aWVzIGFycmF5IHRoYXQgaXMgYWNjZXNzZWQgYnkgdGhlIHRlbXBsYXRlLlxuICAgICAqL1xuICAgIHByaXZhdGUgdXBkYXRlUHJvcGVydGllc0FycmF5KCkge1xuXG4gICAgICAgIC8vIHJlcHJlc2VudCB0aGUgcHJvcGVydGllcyBhcyBhbiBhcnJheSB0byBiZSBhY2Nlc3NlZCBieSB0aGUgdGVtcGxhdGVcbiAgICAgICAgY29uc3QgcHJvcHNBcnJheSA9IFtdO1xuXG4gICAgICAgIGZvciAoY29uc3QgcHJvcElyaSBpbiB0aGlzLl9wcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fcHJvcGVydGllcy5oYXNPd25Qcm9wZXJ0eShwcm9wSXJpKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHByb3AgPSB0aGlzLl9wcm9wZXJ0aWVzW3Byb3BJcmldO1xuXG4gICAgICAgICAgICAgICAgLy8gb25seSBsaXN0IGVkaXRhYmxlIHByb3BzIHRoYXQgYXJlIG5vdCBsaW5rIHZhbHVlIHByb3BzXG4gICAgICAgICAgICAgICAgaWYgKHByb3AuaXNFZGl0YWJsZSAmJiAhcHJvcC5pc0xpbmtWYWx1ZVByb3BlcnR5KSB7XG4gICAgICAgICAgICAgICAgICAgIHByb3BzQXJyYXkucHVzaCh0aGlzLl9wcm9wZXJ0aWVzW3Byb3BJcmldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnByb3BlcnRpZXNBc0FycmF5ID0gcHJvcHNBcnJheTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBzZWxlY3RlZCBwcm9wZXJ0eSB3aXRoIHRoZSBzcGVjaWZpZWQgdmFsdWUuXG4gICAgICovXG4gICAgZ2V0UHJvcGVydHlTZWxlY3RlZFdpdGhWYWx1ZSgpOiBQcm9wZXJ0eVdpdGhWYWx1ZSB7XG5cbiAgICAgICAgY29uc3QgcHJvcFZhbDogQ29tcGFyaXNvbk9wZXJhdG9yQW5kVmFsdWUgPSB0aGlzLnNwZWNpZnlQcm9wZXJ0eVZhbHVlLmdldENvbXBhcmlzb25PcGVyYXRvckFuZFZhbHVlTGl0ZXJhbEZvclByb3BlcnR5KCk7XG5cbiAgICAgICAgbGV0IGlzU29ydENyaXRlcmlvbiA9IGZhbHNlO1xuXG4gICAgICAgIC8vIG9ubHkgbm9uIGxpbmtpbmcgcHJvcGVydGllcyBjYW4gYmUgdXNlZCBmb3Igc29ydGluZ1xuICAgICAgICBpZiAoIXRoaXMucHJvcGVydHlTZWxlY3RlZC5pc0xpbmtQcm9wZXJ0eSkge1xuICAgICAgICAgICAgaXNTb3J0Q3JpdGVyaW9uID0gdGhpcy5mb3JtLnZhbHVlLmlzU29ydENyaXRlcmlvbjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgUHJvcGVydHlXaXRoVmFsdWUodGhpcy5wcm9wZXJ0eVNlbGVjdGVkLCBwcm9wVmFsLCBpc1NvcnRDcml0ZXJpb24pO1xuXG4gICAgfVxuXG5cbn1cbiIsImltcG9ydCB7IENvbXBvbmVudCwgSW5qZWN0LCBJbnB1dCwgT25EZXN0cm95LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEZvcm1CdWlsZGVyLCBGb3JtR3JvdXAsIFZhbGlkYXRvcnMgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBLbm9yYUNvbnN0YW50cywgUHJvcGVydHlWYWx1ZSwgVmFsdWUsIFZhbHVlTGl0ZXJhbCB9IGZyb20gJ0Brbm9yYS9jb3JlJztcblxuLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNDU2NjEwMTAvZHluYW1pYy1uZXN0ZWQtcmVhY3RpdmUtZm9ybS1leHByZXNzaW9uY2hhbmdlZGFmdGVyaXRoYXNiZWVuY2hlY2tlZGVycm9yXG5jb25zdCByZXNvbHZlZFByb21pc2UgPSBQcm9taXNlLnJlc29sdmUobnVsbCk7XG5cblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdib29sZWFuLXZhbHVlJyxcbiAgICB0ZW1wbGF0ZTogYDxtYXQtY2hlY2tib3ggW2Zvcm1Db250cm9sXT1cImZvcm0uY29udHJvbHNbJ2Jvb2xlYW5WYWx1ZSddXCI+PC9tYXQtY2hlY2tib3g+XG5gLFxuICAgIHN0eWxlczogW2BgXVxufSlcbmV4cG9ydCBjbGFzcyBCb29sZWFuVmFsdWVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgUHJvcGVydHlWYWx1ZSB7XG5cbiAgICAvLyBwYXJlbnQgRm9ybUdyb3VwXG4gICAgQElucHV0KCkgZm9ybUdyb3VwOiBGb3JtR3JvdXA7XG5cbiAgICB0eXBlID0gS25vcmFDb25zdGFudHMuQm9vbGVhblZhbHVlO1xuXG4gICAgZm9ybTogRm9ybUdyb3VwO1xuXG4gICAgY29uc3RydWN0b3IoQEluamVjdChGb3JtQnVpbGRlcikgcHJpdmF0ZSBmYjogRm9ybUJ1aWxkZXIpIHtcblxuICAgIH1cblxuICAgIG5nT25Jbml0KCkge1xuXG4gICAgICAgIHRoaXMuZm9ybSA9IHRoaXMuZmIuZ3JvdXAoe1xuICAgICAgICAgICAgYm9vbGVhblZhbHVlOiBbZmFsc2UsIFZhbGlkYXRvcnMuY29tcG9zZShbVmFsaWRhdG9ycy5yZXF1aXJlZF0pXVxuICAgICAgICB9KTtcblxuICAgICAgICByZXNvbHZlZFByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAvLyBhZGQgZm9ybSB0byB0aGUgcGFyZW50IGZvcm0gZ3JvdXBcbiAgICAgICAgICAgIHRoaXMuZm9ybUdyb3VwLmFkZENvbnRyb2woJ3Byb3BWYWx1ZScsIHRoaXMuZm9ybSk7XG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG5cbiAgICAgICAgLy8gcmVtb3ZlIGZvcm0gZnJvbSB0aGUgcGFyZW50IGZvcm0gZ3JvdXBcbiAgICAgICAgcmVzb2x2ZWRQcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5mb3JtR3JvdXAucmVtb3ZlQ29udHJvbCgncHJvcFZhbHVlJyk7XG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgZ2V0VmFsdWUoKTogVmFsdWUge1xuICAgICAgICByZXR1cm4gbmV3IFZhbHVlTGl0ZXJhbChTdHJpbmcodGhpcy5mb3JtLnZhbHVlLmJvb2xlYW5WYWx1ZSksIEtub3JhQ29uc3RhbnRzLnhzZEJvb2xlYW4pO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IENvbXBvbmVudCwgRGlyZWN0aXZlLCBIb3N0LCBJbmplY3QsIElucHV0LCBPbkRlc3Ryb3ksIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRm9ybUJ1aWxkZXIsIEZvcm1Hcm91cCwgVmFsaWRhdG9ycyB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IEtub3JhQ29uc3RhbnRzLCBQcm9wZXJ0eVZhbHVlLCBWYWx1ZSwgVmFsdWVMaXRlcmFsIH0gZnJvbSAnQGtub3JhL2NvcmUnO1xuaW1wb3J0IHsgR3JlZ29yaWFuQ2FsZW5kYXJEYXRlLCBKRE5Db252ZXJ0aWJsZUNhbGVuZGFyLCBKRE5QZXJpb2QgfSBmcm9tICdqZG5jb252ZXJ0aWJsZWNhbGVuZGFyJztcbmltcG9ydCB7IERhdGVBZGFwdGVyLCBNQVRfREFURV9MT0NBTEUsIE1hdENhbGVuZGFyIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwnO1xuaW1wb3J0IHsgSkROQ29udmVydGlibGVDYWxlbmRhckRhdGVBZGFwdGVyIH0gZnJvbSAnamRuY29udmVydGlibGVjYWxlbmRhcmRhdGVhZGFwdGVyJztcblxuLyoqIEN1c3RvbSBoZWFkZXIgY29tcG9uZW50IGNvbnRhaW5pbmcgYSBjYWxlbmRhciBmb3JtYXQgc3dpdGNoZXIgKi9cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAna3VpLWNhbGVuZGFyLWhlYWRlcicsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgIDxtYXQtc2VsZWN0IHBsYWNlaG9sZGVyPVwiQ2FsZW5kYXIgRm9ybWF0XCIgW2Zvcm1Db250cm9sXT1cImZvcm0uY29udHJvbHNbJ2NhbGVuZGFyJ11cIj5cbiAgICAgICAgPG1hdC1vcHRpb24gKm5nRm9yPVwibGV0IGNhbCBvZiBzdXBwb3J0ZWRDYWxlbmRhckZvcm1hdHNcIiBbdmFsdWVdPVwiY2FsXCI+e3tjYWx9fTwvbWF0LW9wdGlvbj5cbiAgICAgIDwvbWF0LXNlbGVjdD5cbiAgICAgIDxtYXQtY2FsZW5kYXItaGVhZGVyPjwvbWF0LWNhbGVuZGFyLWhlYWRlcj5cbiAgICBgLFxuICAgIHN0eWxlczogW11cbn0pXG5leHBvcnQgY2xhc3MgSGVhZGVyQ29tcG9uZW50PEQ+IGltcGxlbWVudHMgT25Jbml0IHtcbiAgICBjb25zdHJ1Y3RvcihASG9zdCgpIHByaXZhdGUgX2NhbGVuZGFyOiBNYXRDYWxlbmRhcjxKRE5Db252ZXJ0aWJsZUNhbGVuZGFyPixcbiAgICAgICAgcHJpdmF0ZSBfZGF0ZUFkYXB0ZXI6IERhdGVBZGFwdGVyPEpETkNvbnZlcnRpYmxlQ2FsZW5kYXI+LFxuICAgICAgICBASW5qZWN0KEZvcm1CdWlsZGVyKSBwcml2YXRlIGZiOiBGb3JtQnVpbGRlcikge1xuICAgIH1cblxuICAgIGZvcm06IEZvcm1Hcm91cDtcblxuICAgIC8vIGEgbGlzdCBvZiBzdXBwb3J0ZWQgY2FsZW5kYXIgZm9ybWF0cyAoR3JlZ29yaWFuIGFuZCBKdWxpYW4pXG4gICAgc3VwcG9ydGVkQ2FsZW5kYXJGb3JtYXRzID0gSkROQ29udmVydGlibGVDYWxlbmRhci5zdXBwb3J0ZWRDYWxlbmRhcnM7XG5cbiAgICAvLyB0aGUgY3VycmVudGx5IGFjdGl2ZSBjYWxlbmRhciBmb3JtYXRcbiAgICBhY3RpdmVGb3JtYXQ7XG5cbiAgICBuZ09uSW5pdCgpIHtcblxuICAgICAgICAvLyBnZXQgdGhlIGN1cnJlbnRseSBhY3RpdmUgY2FsZW5kYXIgZm9ybWF0IGZyb20gdGhlIGRhdGUgYWRhcHRlclxuICAgICAgICBpZiAodGhpcy5fZGF0ZUFkYXB0ZXIgaW5zdGFuY2VvZiBKRE5Db252ZXJ0aWJsZUNhbGVuZGFyRGF0ZUFkYXB0ZXIpIHtcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlRm9ybWF0ID0gdGhpcy5fZGF0ZUFkYXB0ZXIuYWN0aXZlQ2FsZW5kYXJGb3JtYXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZGF0ZSBhZGFwdGVyIGlzIGV4cGVjdGVkIHRvIGJlIGFuIGluc3RhbmNlIG9mIEpETkNvbnZlcnRpYmxlQ2FsZW5kYXJEYXRlQWRhcHRlcicpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gYnVpbGQgYSBmb3JtIGZvciB0aGUgY2FsZW5kYXIgZm9ybWF0IHNlbGVjdGlvblxuICAgICAgICB0aGlzLmZvcm0gPSB0aGlzLmZiLmdyb3VwKHtcbiAgICAgICAgICAgIGNhbGVuZGFyOiBbdGhpcy5hY3RpdmVGb3JtYXQsIFZhbGlkYXRvcnMucmVxdWlyZWRdXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGRvIHRoZSBjb252ZXJzaW9uIHdoZW4gdGhlIHVzZXIgc2VsZWN0cyBhbm90aGVyIGNhbGVuZGFyIGZvcm1hdFxuICAgICAgICB0aGlzLmZvcm0udmFsdWVDaGFuZ2VzLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xuICAgICAgICAgICAgLy8gcGFzcyB0aGUgdGFyZ2V0IGNhbGVuZGFyIGZvcm1hdCB0byB0aGUgY29udmVyc2lvbiBtZXRob2RcbiAgICAgICAgICAgIHRoaXMuY29udmVydERhdGUoZGF0YS5jYWxlbmRhcik7XG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ29udmVydHMgdGhlIGRhdGUgaW50byB0aGUgdGFyZ2V0IGZvcm1hdC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBjYWxlbmRhciB0aGUgdGFyZ2V0IGNhbGVuZGFyIGZvcm1hdC5cbiAgICAgKi9cbiAgICBjb252ZXJ0RGF0ZShjYWxlbmRhcjogJ0dyZWdvcmlhbicgfCAnSnVsaWFuJykge1xuXG4gICAgICAgIGlmICh0aGlzLl9kYXRlQWRhcHRlciBpbnN0YW5jZW9mIEpETkNvbnZlcnRpYmxlQ2FsZW5kYXJEYXRlQWRhcHRlcikge1xuXG4gICAgICAgICAgICAvLyBjb252ZXJ0IHRoZSBkYXRlIGludG8gdGhlIHRhcmdldCBjYWxlbmRhciBmb3JtYXRcbiAgICAgICAgICAgIGNvbnN0IGNvbnZlcnRlZERhdGUgPSB0aGlzLl9kYXRlQWRhcHRlci5jb252ZXJ0Q2FsZW5kYXJGb3JtYXQodGhpcy5fY2FsZW5kYXIuYWN0aXZlRGF0ZSwgY2FsZW5kYXIpO1xuXG4gICAgICAgICAgICAvLyBzZXQgdGhlIG5ldyBkYXRlXG4gICAgICAgICAgICB0aGlzLl9jYWxlbmRhci5hY3RpdmVEYXRlID0gY29udmVydGVkRGF0ZTtcblxuICAgICAgICAgICAgLy8gc2VsZWN0IHRoZSBuZXcgZGF0ZSBpbiB0aGUgZGF0ZXBpY2tlciBVSVxuICAgICAgICAgICAgdGhpcy5fY2FsZW5kYXIuX2RhdGVTZWxlY3RlZChjb252ZXJ0ZWREYXRlKTtcblxuICAgICAgICAgICAgLy8gdXBkYXRlIHZpZXcgYWZ0ZXIgY2FsZW5kYXIgZm9ybWF0IGNvbnZlcnNpb25cbiAgICAgICAgICAgIGNvbnN0IHZpZXcgPSB0aGlzLl9jYWxlbmRhci5jdXJyZW50VmlldyA9PT0gJ21vbnRoJyA/IHRoaXMuX2NhbGVuZGFyLm1vbnRoVmlldyA6XG4gICAgICAgICAgICAgICAgKHRoaXMuX2NhbGVuZGFyLmN1cnJlbnRWaWV3ID09PSAneWVhcicgPyB0aGlzLl9jYWxlbmRhci55ZWFyVmlldyA6IHRoaXMuX2NhbGVuZGFyLm11bHRpWWVhclZpZXcpO1xuXG4gICAgICAgICAgICB2aWV3Lm5nQWZ0ZXJDb250ZW50SW5pdCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2RhdGUgYWRhcHRlciBpcyBleHBlY3RlZCB0byBiZSBhbiBpbnN0YW5jZSBvZiBKRE5Db252ZXJ0aWJsZUNhbGVuZGFyRGF0ZUFkYXB0ZXInKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCB7IENvbXBvbmVudCwgSG9zdCwgSW5qZWN0LCBJbnB1dCwgT25EZXN0cm95LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEZvcm1CdWlsZGVyLCBGb3JtR3JvdXAsIFZhbGlkYXRvcnMgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbmltcG9ydCB7IEtub3JhQ29uc3RhbnRzLCBQcm9wZXJ0eVZhbHVlLCBWYWx1ZSwgVmFsdWVMaXRlcmFsIH0gZnJvbSAnQGtub3JhL2NvcmUnO1xuaW1wb3J0IHsgR3JlZ29yaWFuQ2FsZW5kYXJEYXRlLCBKRE5Db252ZXJ0aWJsZUNhbGVuZGFyLCBKRE5QZXJpb2QgfSBmcm9tICdqZG5jb252ZXJ0aWJsZWNhbGVuZGFyJztcbmltcG9ydCB7IEhlYWRlckNvbXBvbmVudCB9IGZyb20gJy4vaGVhZGVyLWNhbGVuZGFyL2hlYWRlci1jYWxlbmRhci5jb21wb25lbnQnO1xuXG4vLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy80NTY2MTAxMC9keW5hbWljLW5lc3RlZC1yZWFjdGl2ZS1mb3JtLWV4cHJlc3Npb25jaGFuZ2VkYWZ0ZXJpdGhhc2JlZW5jaGVja2VkZXJyb3JcbmNvbnN0IHJlc29sdmVkUHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZShudWxsKTtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdkYXRlLXZhbHVlJyxcbiAgICB0ZW1wbGF0ZTogYDxtYXQtZm9ybS1maWVsZD5cbiAgICA8amRuLWRhdGVwaWNrZXI+XG4gICAgICAgIDxpbnB1dCBtYXRJbnB1dCBbbWF0RGF0ZXBpY2tlcl09XCJwaWNrZXJcIiBwbGFjZWhvbGRlcj1cIkNob29zZSBhIGRhdGVcIiBbZm9ybUNvbnRyb2xdPVwiZm9ybS5jb250cm9sc1snZGF0ZVZhbHVlJ11cIj5cbiAgICAgICAgPG1hdC1kYXRlcGlja2VyICNwaWNrZXIgW2NhbGVuZGFySGVhZGVyQ29tcG9uZW50XT1cImhlYWRlckNvbXBvbmVudFwiPjwvbWF0LWRhdGVwaWNrZXI+XG4gICAgPC9qZG4tZGF0ZXBpY2tlcj5cbiAgICA8bWF0LWRhdGVwaWNrZXItdG9nZ2xlIG1hdFN1ZmZpeCBbZm9yXT1cInBpY2tlclwiPjwvbWF0LWRhdGVwaWNrZXItdG9nZ2xlPlxuPC9tYXQtZm9ybS1maWVsZD5gLFxuICAgIHN0eWxlczogW2BgXVxufSlcbmV4cG9ydCBjbGFzcyBEYXRlVmFsdWVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgUHJvcGVydHlWYWx1ZSB7XG5cbiAgICAvLyBwYXJlbnQgRm9ybUdyb3VwXG4gICAgQElucHV0KCkgZm9ybUdyb3VwOiBGb3JtR3JvdXA7XG5cbiAgICB0eXBlID0gS25vcmFDb25zdGFudHMuRGF0ZVZhbHVlO1xuXG4gICAgZm9ybTogRm9ybUdyb3VwO1xuXG4gICAgLy8gY3VzdG9tIGhlYWRlciBmb3IgdGhlIGRhdGVwaWNrZXJcbiAgICBoZWFkZXJDb21wb25lbnQgPSBIZWFkZXJDb21wb25lbnQ7XG5cbiAgICBjb25zdHJ1Y3RvcihASW5qZWN0KEZvcm1CdWlsZGVyKSBwcml2YXRlIGZiOiBGb3JtQnVpbGRlcikge1xuICAgIH1cblxuICAgIG5nT25Jbml0KCkge1xuXG4gICAgICAgIC8vIGluaXQgZGF0ZXBpY2tlclxuICAgICAgICB0aGlzLmZvcm0gPSB0aGlzLmZiLmdyb3VwKHtcbiAgICAgICAgICAgIGRhdGVWYWx1ZTogW251bGwsIFZhbGlkYXRvcnMuY29tcG9zZShbVmFsaWRhdG9ycy5yZXF1aXJlZF0pXVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmZvcm0udmFsdWVDaGFuZ2VzLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZGF0YS5kYXRlVmFsdWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXNvbHZlZFByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAvLyBhZGQgZm9ybSB0byB0aGUgcGFyZW50IGZvcm0gZ3JvdXBcbiAgICAgICAgICAgIHRoaXMuZm9ybUdyb3VwLmFkZENvbnRyb2woJ3Byb3BWYWx1ZScsIHRoaXMuZm9ybSk7XG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG5cbiAgICAgICAgLy8gcmVtb3ZlIGZvcm0gZnJvbSB0aGUgcGFyZW50IGZvcm0gZ3JvdXBcbiAgICAgICAgcmVzb2x2ZWRQcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5mb3JtR3JvdXAucmVtb3ZlQ29udHJvbCgncHJvcFZhbHVlJyk7XG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgZ2V0VmFsdWUoKTogVmFsdWUge1xuXG4gICAgICAgIGNvbnN0IGRhdGVPYmo6IEpETkNvbnZlcnRpYmxlQ2FsZW5kYXIgPSB0aGlzLmZvcm0udmFsdWUuZGF0ZVZhbHVlO1xuXG4gICAgICAgIC8vIGdldCBjYWxlbmRhciBmb3JtYXRcbiAgICAgICAgY29uc3QgY2FsZW5kYXJGb3JtYXQgPSBkYXRlT2JqLmNhbGVuZGFyTmFtZTtcbiAgICAgICAgLy8gZ2V0IGNhbGVuZGFyIHBlcmlvZFxuICAgICAgICBjb25zdCBjYWxlbmRhclBlcmlvZCA9IGRhdGVPYmoudG9DYWxlbmRhclBlcmlvZCgpO1xuICAgICAgICAvLyBnZXQgdGhlIGRhdGVcbiAgICAgICAgY29uc3QgZGF0ZVN0cmluZyA9IGAke2NhbGVuZGFyRm9ybWF0LnRvVXBwZXJDYXNlKCl9OiR7Y2FsZW5kYXJQZXJpb2QucGVyaW9kU3RhcnQueWVhcn0tJHtjYWxlbmRhclBlcmlvZC5wZXJpb2RTdGFydC5tb250aH0tJHtjYWxlbmRhclBlcmlvZC5wZXJpb2RTdGFydC5kYXl9OiR7Y2FsZW5kYXJQZXJpb2QucGVyaW9kRW5kLnllYXJ9LSR7Y2FsZW5kYXJQZXJpb2QucGVyaW9kRW5kLm1vbnRofS0ke2NhbGVuZGFyUGVyaW9kLnBlcmlvZEVuZC5kYXl9YDtcblxuICAgICAgICByZXR1cm4gbmV3IFZhbHVlTGl0ZXJhbChTdHJpbmcoZGF0ZVN0cmluZyksIEtub3JhQ29uc3RhbnRzLkRhdGVWYWx1ZSk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBJbmplY3QsIElucHV0LCBPbkRlc3Ryb3ksIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRm9ybUJ1aWxkZXIsIEZvcm1Hcm91cCwgVmFsaWRhdG9ycyB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IEtub3JhQ29uc3RhbnRzLCBQcm9wZXJ0eVZhbHVlLCBWYWx1ZSwgVmFsdWVMaXRlcmFsIH0gZnJvbSAnQGtub3JhL2NvcmUnO1xuXG4vLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy80NTY2MTAxMC9keW5hbWljLW5lc3RlZC1yZWFjdGl2ZS1mb3JtLWV4cHJlc3Npb25jaGFuZ2VkYWZ0ZXJpdGhhc2JlZW5jaGVja2VkZXJyb3JcbmNvbnN0IHJlc29sdmVkUHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZShudWxsKTtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdkZWNpbWFsLXZhbHVlJyxcbiAgICB0ZW1wbGF0ZTogYDxtYXQtZm9ybS1maWVsZD5cbiAgICA8aW5wdXQgbWF0SW5wdXQgW2Zvcm1Db250cm9sXT1cImZvcm0uY29udHJvbHNbJ2RlY2ltYWxWYWx1ZSddXCIgcGxhY2Vob2xkZXI9XCJEZWNpbWFsIHZhbHVlXCIgdmFsdWU9XCJcIiB0eXBlPVwibnVtYmVyXCI+XG48L21hdC1mb3JtLWZpZWxkPlxuYCxcbiAgICBzdHlsZXM6IFtgYF1cbn0pXG5leHBvcnQgY2xhc3MgRGVjaW1hbFZhbHVlQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3ksIFByb3BlcnR5VmFsdWUge1xuXG4gICAgLy8gcGFyZW50IEZvcm1Hcm91cFxuICAgIEBJbnB1dCgpIGZvcm1Hcm91cDogRm9ybUdyb3VwO1xuXG4gICAgdHlwZSA9IEtub3JhQ29uc3RhbnRzLkRlY2ltYWxWYWx1ZTtcblxuICAgIGZvcm06IEZvcm1Hcm91cDtcblxuICAgIGNvbnN0cnVjdG9yKEBJbmplY3QoRm9ybUJ1aWxkZXIpIHByaXZhdGUgZmI6IEZvcm1CdWlsZGVyKSB7XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKSB7XG5cbiAgICAgICAgdGhpcy5mb3JtID0gdGhpcy5mYi5ncm91cCh7XG4gICAgICAgICAgICBkZWNpbWFsVmFsdWU6IFtudWxsLCBWYWxpZGF0b3JzLmNvbXBvc2UoW1ZhbGlkYXRvcnMucmVxdWlyZWRdKV1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmVzb2x2ZWRQcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgLy8gYWRkIGZvcm0gdG8gdGhlIHBhcmVudCBmb3JtIGdyb3VwXG4gICAgICAgICAgICB0aGlzLmZvcm1Hcm91cC5hZGRDb250cm9sKCdwcm9wVmFsdWUnLCB0aGlzLmZvcm0pO1xuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCkge1xuXG4gICAgICAgIC8vIHJlbW92ZSBmb3JtIGZyb20gdGhlIHBhcmVudCBmb3JtIGdyb3VwXG4gICAgICAgIHJlc29sdmVkUHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZm9ybUdyb3VwLnJlbW92ZUNvbnRyb2woJ3Byb3BWYWx1ZScpO1xuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIGdldFZhbHVlKCk6IFZhbHVlIHtcblxuICAgICAgICByZXR1cm4gbmV3IFZhbHVlTGl0ZXJhbChTdHJpbmcodGhpcy5mb3JtLnZhbHVlLmRlY2ltYWxWYWx1ZSksIEtub3JhQ29uc3RhbnRzLnhzZERlY2ltYWwpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IENvbXBvbmVudCwgSW5qZWN0LCBJbnB1dCwgT25EZXN0cm95LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEZvcm1CdWlsZGVyLCBGb3JtR3JvdXAsIFZhbGlkYXRvcnMgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBLbm9yYUNvbnN0YW50cywgUHJvcGVydHlWYWx1ZSwgVmFsdWUsIFZhbHVlTGl0ZXJhbCB9IGZyb20gJ0Brbm9yYS9jb3JlJztcblxuLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNDU2NjEwMTAvZHluYW1pYy1uZXN0ZWQtcmVhY3RpdmUtZm9ybS1leHByZXNzaW9uY2hhbmdlZGFmdGVyaXRoYXNiZWVuY2hlY2tlZGVycm9yXG5jb25zdCByZXNvbHZlZFByb21pc2UgPSBQcm9taXNlLnJlc29sdmUobnVsbCk7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnaW50ZWdlci12YWx1ZScsXG4gICAgdGVtcGxhdGU6IGA8bWF0LWZvcm0tZmllbGQ+XG4gICAgPGlucHV0IG1hdElucHV0IFtmb3JtQ29udHJvbF09XCJmb3JtLmNvbnRyb2xzWydpbnRlZ2VyVmFsdWUnXVwiIHBsYWNlaG9sZGVyPVwiSW50ZWdlciB2YWx1ZVwiIHZhbHVlPVwiXCIgdHlwZT1cIm51bWJlclwiPlxuPC9tYXQtZm9ybS1maWVsZD5cbmAsXG4gICAgc3R5bGVzOiBbYGBdXG59KVxuZXhwb3J0IGNsYXNzIEludGVnZXJWYWx1ZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95LCBQcm9wZXJ0eVZhbHVlIHtcblxuICAgIC8vIHBhcmVudCBGb3JtR3JvdXBcbiAgICBASW5wdXQoKSBmb3JtR3JvdXA6IEZvcm1Hcm91cDtcblxuICAgIHR5cGUgPSBLbm9yYUNvbnN0YW50cy5JbnRWYWx1ZTtcblxuICAgIGZvcm06IEZvcm1Hcm91cDtcblxuICAgIGNvbnN0cnVjdG9yKEBJbmplY3QoRm9ybUJ1aWxkZXIpIHByaXZhdGUgZmI6IEZvcm1CdWlsZGVyKSB7XG5cbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHtcblxuICAgICAgICB0aGlzLmZvcm0gPSB0aGlzLmZiLmdyb3VwKHtcbiAgICAgICAgICAgIGludGVnZXJWYWx1ZTogW251bGwsIFZhbGlkYXRvcnMuY29tcG9zZShbVmFsaWRhdG9ycy5yZXF1aXJlZCwgVmFsaWRhdG9ycy5wYXR0ZXJuKC9eLT9cXGQrJC8pXSldIC8vIG9ubHkgYWxsb3cgZm9yIGludGVnZXIgdmFsdWVzIChubyBmcmFjdGlvbnMpXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJlc29sdmVkUHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIC8vIGFkZCBmb3JtIHRvIHRoZSBwYXJlbnQgZm9ybSBncm91cFxuICAgICAgICAgICAgdGhpcy5mb3JtR3JvdXAuYWRkQ29udHJvbCgncHJvcFZhbHVlJywgdGhpcy5mb3JtKTtcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcblxuICAgICAgICAvLyByZW1vdmUgZm9ybSBmcm9tIHRoZSBwYXJlbnQgZm9ybSBncm91cFxuICAgICAgICByZXNvbHZlZFByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZvcm1Hcm91cC5yZW1vdmVDb250cm9sKCdwcm9wVmFsdWUnKTtcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBnZXRWYWx1ZSgpOiBWYWx1ZSB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBWYWx1ZUxpdGVyYWwoU3RyaW5nKHRoaXMuZm9ybS52YWx1ZS5pbnRlZ2VyVmFsdWUpLCBLbm9yYUNvbnN0YW50cy54c2RJbnRlZ2VyKTtcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IENvbXBvbmVudCwgSW5qZWN0LCBJbnB1dCwgT25EZXN0cm95LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEZvcm1CdWlsZGVyLCBGb3JtQ29udHJvbCwgRm9ybUdyb3VwLCBWYWxpZGF0b3JzIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtcbiAgICBBcGlTZXJ2aWNlUmVzdWx0LFxuICAgIENvbnZlcnRKU09OTEQsXG4gICAgSVJJLFxuICAgIEtub3JhQ29uc3RhbnRzLFxuICAgIE9udG9sb2d5Q2FjaGVTZXJ2aWNlLFxuICAgIFByb3BlcnR5VmFsdWUsXG4gICAgUmVhZFJlc291cmNlLFxuICAgIFJlYWRSZXNvdXJjZXNTZXF1ZW5jZSxcbiAgICBTZWFyY2hTZXJ2aWNlLFxuICAgIFZhbHVlXG59IGZyb20gJ0Brbm9yYS9jb3JlJztcblxuZGVjbGFyZSBsZXQgcmVxdWlyZTogYW55OyAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzM0NzMwMDEwL2FuZ3VsYXIyLTUtbWludXRlLWluc3RhbGwtYnVnLXJlcXVpcmUtaXMtbm90LWRlZmluZWRcbmNvbnN0IGpzb25sZCA9IHJlcXVpcmUoJ2pzb25sZCcpO1xuXG4vLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy80NTY2MTAxMC9keW5hbWljLW5lc3RlZC1yZWFjdGl2ZS1mb3JtLWV4cHJlc3Npb25jaGFuZ2VkYWZ0ZXJpdGhhc2JlZW5jaGVja2VkZXJyb3JcbmNvbnN0IHJlc29sdmVkUHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZShudWxsKTtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdsaW5rLXZhbHVlJyxcbiAgICB0ZW1wbGF0ZTogYDxtYXQtZm9ybS1maWVsZD5cbiAgICA8aW5wdXQgbWF0SW5wdXQgcGxhY2Vob2xkZXI9XCJyZXNvdXJjZVwiIGFyaWEtbGFiZWw9XCJyZXNvdXJjZVwiIFttYXRBdXRvY29tcGxldGVdPVwiYXV0b1wiIFtmb3JtQ29udHJvbF09XCJmb3JtLmNvbnRyb2xzWydyZXNvdXJjZSddXCI+XG4gICAgPG1hdC1hdXRvY29tcGxldGUgI2F1dG89XCJtYXRBdXRvY29tcGxldGVcIiBbZGlzcGxheVdpdGhdPVwiZGlzcGxheVJlc291cmNlXCI+XG4gICAgICAgIDxtYXQtb3B0aW9uICpuZ0Zvcj1cImxldCByZXMgb2YgcmVzb3VyY2VzXCIgW3ZhbHVlXT1cInJlc1wiPlxuICAgICAgICAgICAge3tyZXM/LmxhYmVsfX1cbiAgICAgICAgPC9tYXQtb3B0aW9uPlxuICAgIDwvbWF0LWF1dG9jb21wbGV0ZT5cbjwvbWF0LWZvcm0tZmllbGQ+XG5gLFxuICAgIHN0eWxlczogW2BgXVxufSlcbmV4cG9ydCBjbGFzcyBMaW5rVmFsdWVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgUHJvcGVydHlWYWx1ZSB7XG5cbiAgICAvLyBwYXJlbnQgRm9ybUdyb3VwXG4gICAgQElucHV0KCkgZm9ybUdyb3VwOiBGb3JtR3JvdXA7XG5cbiAgICB0eXBlID0gS25vcmFDb25zdGFudHMuTGlua1ZhbHVlO1xuXG4gICAgZm9ybTogRm9ybUdyb3VwO1xuXG4gICAgcmVzb3VyY2VzOiBSZWFkUmVzb3VyY2VbXTtcblxuICAgIHByaXZhdGUgX3Jlc3RyaWN0VG9SZXNvdXJjZUNsYXNzOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKVxuICAgIHNldCByZXN0cmljdFJlc291cmNlQ2xhc3ModmFsdWU6IHN0cmluZykge1xuICAgICAgICB0aGlzLl9yZXN0cmljdFRvUmVzb3VyY2VDbGFzcyA9IHZhbHVlO1xuICAgIH1cblxuICAgIGdldCByZXN0cmljdFJlc291cmNlQ2xhc3MoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9yZXN0cmljdFRvUmVzb3VyY2VDbGFzcztcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihASW5qZWN0KEZvcm1CdWlsZGVyKSBwcml2YXRlIGZiOiBGb3JtQnVpbGRlciwgcHJpdmF0ZSBfc2VhcmNoU2VydmljZTogU2VhcmNoU2VydmljZSwgcHJpdmF0ZSBfY2FjaGVTZXJ2aWNlOiBPbnRvbG9neUNhY2hlU2VydmljZSkge1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRGlzcGxheXMgYSBzZWxlY3RlZCByZXNvdXJjZSB1c2luZyBpdHMgbGFiZWwuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcmVzb3VyY2UgdGhlIHJlc291cmNlIHRvIGJlIGRpc3BsYXllZCAob3Igbm8gc2VsZWN0aW9uIHlldCkuXG4gICAgICogQHJldHVybnNcbiAgICAgKi9cbiAgICBkaXNwbGF5UmVzb3VyY2UocmVzb3VyY2U6IFJlYWRSZXNvdXJjZSB8IG51bGwpIHtcblxuICAgICAgICAvLyBudWxsIGlzIHRoZSBpbml0aWFsIHZhbHVlIChubyBzZWxlY3Rpb24geWV0KVxuICAgICAgICBpZiAocmVzb3VyY2UgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNvdXJjZS5sYWJlbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNlYXJjaCBmb3IgcmVzb3VyY2VzIHdob3NlIGxhYmVscyBjb250YWluIHRoZSBnaXZlbiBzZWFyY2ggdGVybSwgcmVzdHJpY3RpbmcgdG8gdG8gdGhlIGdpdmVuIHByb3BlcnRpZXMgb2JqZWN0IGNvbnN0cmFpbnQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc2VhcmNoVGVybVxuICAgICAqL1xuICAgIHNlYXJjaEJ5TGFiZWwoc2VhcmNoVGVybTogc3RyaW5nKSB7XG5cbiAgICAgICAgLy8gYXQgbGVhc3QgMyBjaGFyYWN0ZXJzIGFyZSByZXF1aXJlZFxuICAgICAgICBpZiAoc2VhcmNoVGVybS5sZW5ndGggPj0gMykge1xuXG4gICAgICAgICAgICB0aGlzLl9zZWFyY2hTZXJ2aWNlLnNlYXJjaEJ5TGFiZWwoc2VhcmNoVGVybSwgdGhpcy5fcmVzdHJpY3RUb1Jlc291cmNlQ2xhc3MpLnN1YnNjcmliZShcbiAgICAgICAgICAgICAgICAocmVzdWx0OiBBcGlTZXJ2aWNlUmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHByb21pc2VzID0ganNvbmxkLnByb21pc2VzO1xuICAgICAgICAgICAgICAgICAgICAvLyBjb21wYWN0IEpTT04tTEQgdXNpbmcgYW4gZW1wdHkgY29udGV4dDogZXhwYW5kcyBhbGwgSXJpc1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwcm9taXNlID0gcHJvbWlzZXMuY29tcGFjdChyZXN1bHQuYm9keSwge30pO1xuXG4gICAgICAgICAgICAgICAgICAgIHByb21pc2UudGhlbigoY29tcGFjdGVkKSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc291cmNlU2VxOiBSZWFkUmVzb3VyY2VzU2VxdWVuY2UgPSBDb252ZXJ0SlNPTkxELmNyZWF0ZVJlYWRSZXNvdXJjZXNTZXF1ZW5jZUZyb21Kc29uTEQoY29tcGFjdGVkKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNvdXJjZXMgPSByZXNvdXJjZVNlcS5yZXNvdXJjZXM7XG5cbiAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnSlNPTkxEIG9mIGZ1bGwgcmVzb3VyY2UgcmVxdWVzdCBjb3VsZCBub3QgYmUgZXhwYW5kZWQ6JyArIGVycik7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGNsZWFyIHNlbGVjdGlvblxuICAgICAgICAgICAgdGhpcy5yZXNvdXJjZXMgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyB0aGF0IHRoZSBzZWxlY3Rpb24gaXMgYSBbW1JlYWRSZXNvdXJjZV1dLlxuICAgICAqXG4gICAgICogU3VycHJpc2luZ2x5LCBbbnVsbF0gaGFzIHRvIGJlIHJldHVybmVkIGlmIHRoZSB2YWx1ZSBpcyB2YWxpZDogaHR0cHM6Ly9hbmd1bGFyLmlvL2d1aWRlL2Zvcm0tdmFsaWRhdGlvbiNjdXN0b20tdmFsaWRhdG9yc1xuICAgICAqXG4gICAgICogQHBhcmFtIHRoZSBmb3JtIGVsZW1lbnQgd2hvc2UgdmFsdWUgaGFzIHRvIGJlIGNoZWNrZWQuXG4gICAgICogQHJldHVybnNcbiAgICAgKi9cbiAgICB2YWxpZGF0ZVJlc291cmNlKGM6IEZvcm1Db250cm9sKSB7XG5cbiAgICAgICAgY29uc3QgaXNWYWxpZFJlc291cmNlID0gKGMudmFsdWUgaW5zdGFuY2VvZiBSZWFkUmVzb3VyY2UpO1xuXG4gICAgICAgIGlmIChpc1ZhbGlkUmVzb3VyY2UpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBub1Jlc291cmNlOiB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBjLnZhbHVlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgbmdPbkluaXQoKSB7XG4gICAgICAgIHRoaXMuZm9ybSA9IHRoaXMuZmIuZ3JvdXAoe1xuICAgICAgICAgICAgcmVzb3VyY2U6IFtudWxsLCBWYWxpZGF0b3JzLmNvbXBvc2UoW1xuICAgICAgICAgICAgICAgIFZhbGlkYXRvcnMucmVxdWlyZWQsXG4gICAgICAgICAgICAgICAgdGhpcy52YWxpZGF0ZVJlc291cmNlXG4gICAgICAgICAgICBdKV1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5mb3JtLnZhbHVlQ2hhbmdlcy5zdWJzY3JpYmUoKGRhdGEpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2VhcmNoQnlMYWJlbChkYXRhLnJlc291cmNlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmVzb2x2ZWRQcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgLy8gYWRkIGZvcm0gdG8gdGhlIHBhcmVudCBmb3JtIGdyb3VwXG4gICAgICAgICAgICB0aGlzLmZvcm1Hcm91cC5hZGRDb250cm9sKCdwcm9wVmFsdWUnLCB0aGlzLmZvcm0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcblxuICAgICAgICAvLyByZW1vdmUgZm9ybSBmcm9tIHRoZSBwYXJlbnQgZm9ybSBncm91cFxuICAgICAgICByZXNvbHZlZFByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZvcm1Hcm91cC5yZW1vdmVDb250cm9sKCdwcm9wVmFsdWUnKTtcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBnZXRWYWx1ZSgpOiBWYWx1ZSB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBJUkkodGhpcy5mb3JtLnZhbHVlLnJlc291cmNlLmlkKTtcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IENvbXBvbmVudCwgSW5qZWN0LCBJbnB1dCwgT25EZXN0cm95LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgRm9ybUJ1aWxkZXIsIEZvcm1Hcm91cCwgVmFsaWRhdG9ycyB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IEtub3JhQ29uc3RhbnRzLCBQcm9wZXJ0eVZhbHVlLCBWYWx1ZSwgVmFsdWVMaXRlcmFsIH0gZnJvbSAnQGtub3JhL2NvcmUnO1xuXG4vLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy80NTY2MTAxMC9keW5hbWljLW5lc3RlZC1yZWFjdGl2ZS1mb3JtLWV4cHJlc3Npb25jaGFuZ2VkYWZ0ZXJpdGhhc2JlZW5jaGVja2VkZXJyb3JcbmNvbnN0IHJlc29sdmVkUHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZShudWxsKTtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICd0ZXh0LXZhbHVlJyxcbiAgICB0ZW1wbGF0ZTogYDxtYXQtZm9ybS1maWVsZD5cbiAgICA8aW5wdXQgbWF0SW5wdXQgW2Zvcm1Db250cm9sXT1cImZvcm0uY29udHJvbHNbJ3RleHRWYWx1ZSddXCIgcGxhY2Vob2xkZXI9XCJ0ZXh0IHZhbHVlXCIgdmFsdWU9XCJcIj5cbjwvbWF0LWZvcm0tZmllbGQ+XG5gLFxuICAgIHN0eWxlczogW2BgXVxufSlcbmV4cG9ydCBjbGFzcyBUZXh0VmFsdWVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgUHJvcGVydHlWYWx1ZSB7XG5cbiAgICAvLyBwYXJlbnQgRm9ybUdyb3VwXG4gICAgQElucHV0KCkgZm9ybUdyb3VwOiBGb3JtR3JvdXA7XG5cbiAgICB0eXBlID0gS25vcmFDb25zdGFudHMuVGV4dFZhbHVlO1xuXG4gICAgZm9ybTogRm9ybUdyb3VwO1xuXG4gICAgY29uc3RydWN0b3IoQEluamVjdChGb3JtQnVpbGRlcikgcHJpdmF0ZSBmYjogRm9ybUJ1aWxkZXIpIHtcblxuICAgIH1cblxuICAgIG5nT25Jbml0KCkge1xuXG4gICAgICAgIHRoaXMuZm9ybSA9IHRoaXMuZmIuZ3JvdXAoe1xuICAgICAgICAgICAgdGV4dFZhbHVlOiBbbnVsbCwgVmFsaWRhdG9ycy5yZXF1aXJlZF1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmVzb2x2ZWRQcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgLy8gYWRkIGZvcm0gdG8gdGhlIHBhcmVudCBmb3JtIGdyb3VwXG4gICAgICAgICAgICB0aGlzLmZvcm1Hcm91cC5hZGRDb250cm9sKCdwcm9wVmFsdWUnLCB0aGlzLmZvcm0pO1xuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCkge1xuXG4gICAgICAgIC8vIHJlbW92ZSBmb3JtIGZyb20gdGhlIHBhcmVudCBmb3JtIGdyb3VwXG4gICAgICAgIHJlc29sdmVkUHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZm9ybUdyb3VwLnJlbW92ZUNvbnRyb2woJ3Byb3BWYWx1ZScpO1xuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIGdldFZhbHVlKCk6IFZhbHVlIHtcblxuICAgICAgICByZXR1cm4gbmV3IFZhbHVlTGl0ZXJhbChTdHJpbmcodGhpcy5mb3JtLnZhbHVlLnRleHRWYWx1ZSksIEtub3JhQ29uc3RhbnRzLnhzZFN0cmluZyk7XG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIEluamVjdCwgSW5wdXQsIE9uRGVzdHJveSwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IEZvcm1CdWlsZGVyLCBGb3JtR3JvdXAsIFZhbGlkYXRvcnMgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBLbm9yYUNvbnN0YW50cywgUHJvcGVydHlWYWx1ZSwgVXRpbHMsIFZhbHVlLCBWYWx1ZUxpdGVyYWwgfSBmcm9tICdAa25vcmEvY29yZSc7XG5cbi8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzQ1NjYxMDEwL2R5bmFtaWMtbmVzdGVkLXJlYWN0aXZlLWZvcm0tZXhwcmVzc2lvbmNoYW5nZWRhZnRlcml0aGFzYmVlbmNoZWNrZWRlcnJvclxuY29uc3QgcmVzb2x2ZWRQcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKG51bGwpO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3VyaS12YWx1ZScsXG4gICAgdGVtcGxhdGU6IGA8bWF0LWZvcm0tZmllbGQ+XG4gICAgPGlucHV0IG1hdElucHV0IFtmb3JtQ29udHJvbF09XCJmb3JtLmNvbnRyb2xzWyd1cmlWYWx1ZSddXCIgcGxhY2Vob2xkZXI9XCJVUklcIiB2YWx1ZT1cIlwiPlxuPC9tYXQtZm9ybS1maWVsZD5cbmAsXG4gICAgc3R5bGVzOiBbYGBdXG59KVxuZXhwb3J0IGNsYXNzIFVyaVZhbHVlQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3ksIFByb3BlcnR5VmFsdWUge1xuXG4gICAgLy8gcGFyZW50IEZvcm1Hcm91cFxuICAgIEBJbnB1dCgpIGZvcm1Hcm91cDogRm9ybUdyb3VwO1xuXG4gICAgdHlwZSA9IEtub3JhQ29uc3RhbnRzLlVyaVZhbHVlO1xuXG4gICAgZm9ybTogRm9ybUdyb3VwO1xuXG4gICAgY29uc3RydWN0b3IoQEluamVjdChGb3JtQnVpbGRlcikgcHJpdmF0ZSBmYjogRm9ybUJ1aWxkZXIpIHtcblxuICAgIH1cblxuICAgIG5nT25Jbml0KCkge1xuXG4gICAgICAgIHRoaXMuZm9ybSA9IHRoaXMuZmIuZ3JvdXAoe1xuICAgICAgICAgICAgdXJpVmFsdWU6IFtudWxsLCBWYWxpZGF0b3JzLmNvbXBvc2UoW1ZhbGlkYXRvcnMucmVxdWlyZWQsIFZhbGlkYXRvcnMucGF0dGVybihVdGlscy5SZWdleFVybCldKV1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmVzb2x2ZWRQcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgLy8gYWRkIGZvcm0gdG8gdGhlIHBhcmVudCBmb3JtIGdyb3VwXG4gICAgICAgICAgICB0aGlzLmZvcm1Hcm91cC5hZGRDb250cm9sKCdwcm9wVmFsdWUnLCB0aGlzLmZvcm0pO1xuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCkge1xuXG4gICAgICAgIC8vIHJlbW92ZSBmb3JtIGZyb20gdGhlIHBhcmVudCBmb3JtIGdyb3VwXG4gICAgICAgIHJlc29sdmVkUHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZm9ybUdyb3VwLnJlbW92ZUNvbnRyb2woJ3Byb3BWYWx1ZScpO1xuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIGdldFZhbHVlKCk6IFZhbHVlIHtcblxuICAgICAgICByZXR1cm4gbmV3IFZhbHVlTGl0ZXJhbChTdHJpbmcodGhpcy5mb3JtLnZhbHVlLnVyaVZhbHVlKSwgS25vcmFDb25zdGFudHMueHNkVXJpKTtcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgQnJvd3NlckFuaW1hdGlvbnNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHtcbiAgICBNYXRBdXRvY29tcGxldGVNb2R1bGUsXG4gICAgTWF0QnV0dG9uTW9kdWxlLFxuICAgIE1hdENoZWNrYm94TW9kdWxlLFxuICAgIE1hdERhdGVwaWNrZXJNb2R1bGUsXG4gICAgTWF0Rm9ybUZpZWxkTW9kdWxlLFxuICAgIE1hdEljb25Nb2R1bGUsIE1hdElucHV0TW9kdWxlLFxuICAgIE1hdExpc3RNb2R1bGUsXG4gICAgTWF0U2VsZWN0TW9kdWxlLFxuICAgIE1hdFRvb2x0aXBNb2R1bGVcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwnO1xuXG5pbXBvcnQgeyBGb3Jtc01vZHVsZSwgUmVhY3RpdmVGb3Jtc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IEt1aUNvcmVNb2R1bGUgfSBmcm9tICdAa25vcmEvY29yZSc7XG5pbXBvcnQgeyBLdWlBY3Rpb25Nb2R1bGUgfSBmcm9tICdAa25vcmEvYWN0aW9uJztcbmltcG9ydCB7IEt1aVZpZXdlck1vZHVsZSB9IGZyb20gJ0Brbm9yYS92aWV3ZXInO1xuXG5pbXBvcnQgeyBNYXRKRE5Db252ZXJ0aWJsZUNhbGVuZGFyRGF0ZUFkYXB0ZXJNb2R1bGUgfSBmcm9tICdqZG5jb252ZXJ0aWJsZWNhbGVuZGFyZGF0ZWFkYXB0ZXInO1xuXG5pbXBvcnQgeyBTZWFyY2hDb21wb25lbnQgfSBmcm9tICcuL3NlYXJjaC5jb21wb25lbnQnO1xuaW1wb3J0IHsgRXh0ZW5kZWRTZWFyY2hDb21wb25lbnQgfSBmcm9tICcuL2V4dGVuZGVkLXNlYXJjaC9leHRlbmRlZC1zZWFyY2guY29tcG9uZW50JztcblxuaW1wb3J0IHsgU2VsZWN0T250b2xvZ3lDb21wb25lbnQgfSBmcm9tICcuL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3Qtb250b2xvZ3kvc2VsZWN0LW9udG9sb2d5LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBTZWxlY3RSZXNvdXJjZUNsYXNzQ29tcG9uZW50IH0gZnJvbSAnLi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXJlc291cmNlLWNsYXNzL3NlbGVjdC1yZXNvdXJjZS1jbGFzcy5jb21wb25lbnQnO1xuaW1wb3J0IHsgU2VsZWN0UHJvcGVydHlDb21wb25lbnQgfSBmcm9tICcuL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3QtcHJvcGVydHkvc2VsZWN0LXByb3BlcnR5LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBTcGVjaWZ5UHJvcGVydHlWYWx1ZUNvbXBvbmVudCB9IGZyb20gJy4vZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1wcm9wZXJ0eS9zcGVjaWZ5LXByb3BlcnR5LXZhbHVlL3NwZWNpZnktcHJvcGVydHktdmFsdWUuY29tcG9uZW50JztcbmltcG9ydCB7IEJvb2xlYW5WYWx1ZUNvbXBvbmVudCB9IGZyb20gJy4vZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1wcm9wZXJ0eS9zcGVjaWZ5LXByb3BlcnR5LXZhbHVlL2Jvb2xlYW4tdmFsdWUvYm9vbGVhbi12YWx1ZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgRGF0ZVZhbHVlQ29tcG9uZW50IH0gZnJvbSAnLi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXByb3BlcnR5L3NwZWNpZnktcHJvcGVydHktdmFsdWUvZGF0ZS12YWx1ZS9kYXRlLXZhbHVlLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBEZWNpbWFsVmFsdWVDb21wb25lbnQgfSBmcm9tICcuL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3QtcHJvcGVydHkvc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZS9kZWNpbWFsLXZhbHVlL2RlY2ltYWwtdmFsdWUuY29tcG9uZW50JztcbmltcG9ydCB7IEludGVnZXJWYWx1ZUNvbXBvbmVudCB9IGZyb20gJy4vZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1wcm9wZXJ0eS9zcGVjaWZ5LXByb3BlcnR5LXZhbHVlL2ludGVnZXItdmFsdWUvaW50ZWdlci12YWx1ZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgTGlua1ZhbHVlQ29tcG9uZW50IH0gZnJvbSAnLi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXByb3BlcnR5L3NwZWNpZnktcHJvcGVydHktdmFsdWUvbGluay12YWx1ZS9saW5rLXZhbHVlLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBUZXh0VmFsdWVDb21wb25lbnQgfSBmcm9tICcuL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3QtcHJvcGVydHkvc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZS90ZXh0LXZhbHVlL3RleHQtdmFsdWUuY29tcG9uZW50JztcbmltcG9ydCB7IFVyaVZhbHVlQ29tcG9uZW50IH0gZnJvbSAnLi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXByb3BlcnR5L3NwZWNpZnktcHJvcGVydHktdmFsdWUvdXJpLXZhbHVlL3VyaS12YWx1ZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgSGVhZGVyQ29tcG9uZW50IH0gZnJvbSAnLi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXByb3BlcnR5L3NwZWNpZnktcHJvcGVydHktdmFsdWUvZGF0ZS12YWx1ZS9oZWFkZXItY2FsZW5kYXIvaGVhZGVyLWNhbGVuZGFyLmNvbXBvbmVudCc7XG5cblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbXG4gICAgICAgIENvbW1vbk1vZHVsZSxcbiAgICAgICAgQnJvd3NlckFuaW1hdGlvbnNNb2R1bGUsXG4gICAgICAgIE1hdEF1dG9jb21wbGV0ZU1vZHVsZSxcbiAgICAgICAgTWF0QnV0dG9uTW9kdWxlLFxuICAgICAgICBNYXRDaGVja2JveE1vZHVsZSxcbiAgICAgICAgTWF0RGF0ZXBpY2tlck1vZHVsZSxcbiAgICAgICAgTWF0Rm9ybUZpZWxkTW9kdWxlLFxuICAgICAgICBNYXRJbnB1dE1vZHVsZSxcbiAgICAgICAgTWF0SWNvbk1vZHVsZSxcbiAgICAgICAgTWF0TGlzdE1vZHVsZSxcbiAgICAgICAgTWF0U2VsZWN0TW9kdWxlLFxuICAgICAgICBNYXRUb29sdGlwTW9kdWxlLFxuICAgICAgICBGb3Jtc01vZHVsZSxcbiAgICAgICAgUmVhY3RpdmVGb3Jtc01vZHVsZSxcbiAgICAgICAgS3VpQ29yZU1vZHVsZSxcbiAgICAgICAgS3VpQWN0aW9uTW9kdWxlLFxuICAgICAgICBLdWlWaWV3ZXJNb2R1bGUsXG4gICAgICAgIE1hdEpETkNvbnZlcnRpYmxlQ2FsZW5kYXJEYXRlQWRhcHRlck1vZHVsZVxuICAgIF0sXG4gICAgZGVjbGFyYXRpb25zOiBbXG4gICAgICAgIFNlYXJjaENvbXBvbmVudCxcbiAgICAgICAgU2VsZWN0T250b2xvZ3lDb21wb25lbnQsXG4gICAgICAgIEV4dGVuZGVkU2VhcmNoQ29tcG9uZW50LFxuICAgICAgICBTZWxlY3RSZXNvdXJjZUNsYXNzQ29tcG9uZW50LFxuICAgICAgICBTZWxlY3RQcm9wZXJ0eUNvbXBvbmVudCxcbiAgICAgICAgU3BlY2lmeVByb3BlcnR5VmFsdWVDb21wb25lbnQsXG4gICAgICAgIEJvb2xlYW5WYWx1ZUNvbXBvbmVudCxcbiAgICAgICAgRGF0ZVZhbHVlQ29tcG9uZW50LFxuICAgICAgICBEZWNpbWFsVmFsdWVDb21wb25lbnQsXG4gICAgICAgIEludGVnZXJWYWx1ZUNvbXBvbmVudCxcbiAgICAgICAgTGlua1ZhbHVlQ29tcG9uZW50LFxuICAgICAgICBUZXh0VmFsdWVDb21wb25lbnQsXG4gICAgICAgIFVyaVZhbHVlQ29tcG9uZW50LFxuICAgICAgICBIZWFkZXJDb21wb25lbnRcbiAgICBdLFxuICAgIGV4cG9ydHM6IFtTZWFyY2hDb21wb25lbnRdLFxuICAgIGVudHJ5Q29tcG9uZW50czogW1xuICAgICAgICBIZWFkZXJDb21wb25lbnRcbiAgICBdXG59KVxuZXhwb3J0IGNsYXNzIEt1aVNlYXJjaE1vZHVsZSB7XG59XG4iXSwibmFtZXMiOlsidHNsaWJfMS5fX3ZhbHVlcyIsInJlc29sdmVkUHJvbWlzZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQWdJSSx5QkFBb0IsTUFBc0IsRUFDOUIsU0FDQTtRQUZRLFdBQU0sR0FBTixNQUFNLENBQWdCO1FBQzlCLFlBQU8sR0FBUCxPQUFPO1FBQ1AsWUFBTyxHQUFQLE9BQU87cUJBakJNLFNBQVM7Z0NBSU4sS0FBSzswQkFFVixJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7NkJBRTdDLFVBQVU7K0JBQ1IsVUFBVTsyQkFFZCxRQUFRO2dDQUVGLElBQUk7S0FNL0I7Ozs7SUFFRCxrQ0FBUTs7O0lBQVI7S0FDQzs7Ozs7Ozs7Ozs7O0lBT0QsK0JBQUs7Ozs7OztJQUFMLFVBQU0sVUFBdUIsRUFBRSxLQUFLO1FBQ2hDLElBQUksQ0FBQyxhQUFhLEdBQUcsUUFBUSxDQUFDO1FBQzlCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7UUFDakUsSUFBSSxJQUFJLENBQUMsV0FBVyxLQUFLLEtBQUssQ0FBQyxHQUFHLEtBQUssT0FBTyxJQUFJLEtBQUssQ0FBQyxPQUFPLEtBQUssRUFBRSxJQUFJLEtBQUssQ0FBQyxLQUFLLEtBQUssRUFBRSxDQUFDLEVBQUU7WUFDM0YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUM3QjtRQUNELElBQUksS0FBSyxDQUFDLEdBQUcsS0FBSyxRQUFRLElBQUksS0FBSyxDQUFDLE9BQU8sS0FBSyxFQUFFLElBQUksS0FBSyxDQUFDLEtBQUssS0FBSyxFQUFFLEVBQUU7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