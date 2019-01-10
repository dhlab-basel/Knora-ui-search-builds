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
 * Contains methods to realise, reset new or previous simple searches.
 */
class SearchComponent {
    constructor(_route, _router, _eleRef) {
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
    ngOnInit() {
    }
    /**
     * @ignore
     * Do search on Enter click, reset search on Escape
     * @param search_ele
     * @param event
     * @returns void
     */
    onKey(search_ele, event) {
        this.focusOnSimple = 'active';
        this.prevSearch = JSON.parse(localStorage.getItem('prevSearch'));
        if (this.searchQuery && (event.key === 'Enter' || event.keyCode === 13 || event.which === 13)) {
            this.doSearch(search_ele);
        }
        if (event.key === 'Escape' || event.keyCode === 27 || event.which === 27) {
            this.resetSearch(search_ele);
        }
    }
    /**
     * Realise a simple search
     * @param {HTMLElement} search_ele
     * @returns void
     */
    doSearch(search_ele) {
        if (this.searchQuery !== undefined && this.searchQuery !== null) {
            this.toggleMenu('simpleSearch');
            this._router.navigate([this.route + '/fulltext/' + this.searchQuery]);
            // this._router.navigate(['/search/fulltext/' + this.searchQuery], { relativeTo: this._route });
            // push the search query into the local storage prevSearch array (previous search)
            // to have a list of recent search requests
            let existingPrevSearch = JSON.parse(localStorage.getItem('prevSearch'));
            if (existingPrevSearch === null) {
                existingPrevSearch = [];
            }
            let i = 0;
            for (const entry of existingPrevSearch) {
                // remove entry, if exists already
                if (this.searchQuery === entry) {
                    existingPrevSearch.splice(i, 1);
                }
                i++;
            }
            existingPrevSearch.push(this.searchQuery);
            localStorage.setItem('prevSearch', JSON.stringify(existingPrevSearch));
            // TODO: save the previous search queries somewhere in the user's profile
        }
        else {
            search_ele.focus();
            this.prevSearch = JSON.parse(localStorage.getItem('prevSearch'));
        }
    }
    /**
     * Reset the search
     * @param {HTMLElement} search_ele
     * @returns void
     */
    resetSearch(search_ele) {
        this.searchQuery = null;
        search_ele.focus();
        this.focusOnSimple = 'inactive';
        this.searchPanelFocus = !this.searchPanelFocus;
    }
    /**
     * Realise a previous search
     * @param {string} query
     * @returns void
     */
    doPrevSearch(query) {
        this.searchQuery = query;
        this._router.navigate([this.route + '/fulltext/' + query], { relativeTo: this._route });
        this.toggleMenu('simpleSearch');
    }
    /**
     * Reset previous searches - the whole previous search or specific item by name
     * @param {string} name term of the search
     * @returns void
     */
    resetPrevSearch(name = null) {
        if (name) {
            // delete only this item with the name ...
            const i = this.prevSearch.indexOf(name);
            this.prevSearch.splice(i, 1);
            localStorage.setItem('prevSearch', JSON.stringify(this.prevSearch));
        }
        else {
            // delete the whole "previous search" array
            localStorage.removeItem('prevSearch');
        }
        this.prevSearch = JSON.parse(localStorage.getItem('prevSearch'));
    }
    /**
     * Set simple focus to active
     *
     * @returns void
     */
    setFocus() {
        this.prevSearch = JSON.parse(localStorage.getItem('prevSearch'));
        this.focusOnSimple = 'active';
        this.searchPanelFocus = !this.searchPanelFocus;
    }
    /**
     * Switch according to the focus between simple or extended search
     *
     * @param {string} name 2 cases: simpleSearch or extendedSearch
     * @returns void
     */
    toggleMenu(name) {
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
    }
}
SearchComponent.decorators = [
    { type: Component, args: [{
                selector: 'kui-search',
                template: `<div class="search-bar-elements">

    <!-- the next element - div.extended-search-panel - is a hidden dropdown filter menu -->

    <div class="search-panel" [class.active]="searchPanelFocus">
        <div>
            <button class="prefix" (click)="doSearch(search)">
                <mat-icon>search</mat-icon>
            </button>
        </div>

        <div class="input-field">
            <input #search autocomplete="off" type="search" [placeholder]="searchLabel" [(ngModel)]="searchQuery" name="search" (keyup.esc)="resetSearch(search)" (keyup)="onKey(search, $event)" (click)="setFocus()" (focus)="toggleMenu('simpleSearch')" [disabled]="focusOnExtended === 'active'" />
        </div>

        <!-- switch button: on some focus we need a close button for the simple or extended panel -->
        <div>
            <button class="suffix" *ngIf="focusOnSimple === 'active'" (click)="resetSearch(search)">
                <mat-icon>close</mat-icon>
            </button>
            <button class="suffix" *ngIf="focusOnSimple === 'inactive'">
            </button>
        </div>

        <!-- the search panel has two "dropdown" menus: one for simple search and another one for the extended search -->
        <div class="kui-menu simple-search" [@simpleSearchMenu]="focusOnSimple" *ngIf="showSimpleSearch">
            <mat-list class="kui-previous-search-list">
                <mat-list-item *ngFor="let item of prevSearch | kuiReverse; let i=index">
                    <h4 mat-line *ngIf="i<10" (click)="doPrevSearch(item)">{{item}}</h4>
                    <button mat-icon-button (click)="resetPrevSearch(item)">
                        <mat-icon aria-label="close">close</mat-icon>
                    </button>
                </mat-list-item>
            </mat-list>
            <button mat-stroked-button color="accent" class="right" (click)="resetPrevSearch()" *ngIf="prevSearch">Clear</button>
        </div>

        <div class="kui-menu extended-search" [@extendedSearchMenu]="focusOnExtended">
            <div class="kui-menu-header">
                <span class="kui-menu-title">
                    <h4>Advanced search</h4>
                </span>
                <span class="kui-menu-action">
                    <button mat-icon-button (click)="toggleMenu('extendedSearch')">
                        <mat-icon>close</mat-icon>
                    </button>
                </span>
            </div>
            <div class="extended-search-box">
                <kui-extended-search [route]="route" (toggleExtendedSearchForm)="toggleMenu('extendedSearch')"></kui-extended-search>
            </div>
        </div>
    </div>

    <!-- Extended search button to display the extended search form in the search panel -->
    <button mat-button type="button" color="primary" class="advanced-search-button" (click)="toggleMenu('extendedSearch')">
        advanced
    </button>

</div>`,
                styles: [`input[type=search]::-webkit-search-cancel-button,input[type=search]::-webkit-search-decoration,input[type=search]::-webkit-search-results-button,input[type=search]::-webkit-search-results-decoration{display:none}input[type=search]{-moz-appearance:none;-webkit-appearance:none}.center{display:block;margin-left:auto;margin-right:auto}.close{right:12px}.extended-search-box{margin:12px}.advanced-search-button{margin-left:10px}.full-width{width:100%}.hide{display:none}.inactive,.mute{color:#7a7a7a}.search-panel{background-color:#f9f9f9;border-radius:4px;display:inline-flex;height:40px;position:relative;width:680px;z-index:10}.search-panel:hover{box-shadow:0 1px 3px rgba(0,0,0,.5)}.search-panel div.input-field{flex:1}.search-panel div.input-field input{border-style:none;font-size:14pt;height:38px;position:absolute;width:calc(100% - 80px)}.search-panel div.input-field input:active,.search-panel div.input-field input:focus{outline:0}.search-panel div .prefix,.search-panel div .suffix{background-color:#fff;border-radius:3px;border-style:none;color:rgba(41,41,41,.4);cursor:pointer;height:38px;outline:0;position:relative;width:40px}.search-panel div .prefix:active,.search-panel div .suffix:active{color:#515151}.search-panel.active{box-shadow:0 1px 3px rgba(0,0,0,.5)}.kui-menu{box-shadow:0 3px 5px -1px rgba(11,11,11,.2),0 6px 10px 0 rgba(11,11,11,.14),0 1px 18px 0 rgba(11,11,11,.12);background-color:#f9f9f9;border-radius:4px;position:absolute}.kui-menu .kui-menu-header{background-color:#f9f9f9;border-top-left-radius:4px;border-top-right-radius:4px;display:inline-block;height:48px;width:100%}.kui-menu .kui-menu-header .kui-menu-title{float:left;font-size:14px;font-weight:400;margin-top:4px;padding:12px}.kui-menu .kui-menu-header .kui-menu-action{float:right;margin:4px}.kui-menu.extended-search,.kui-menu.simple-search{min-height:680px;width:680px}.kui-menu.simple-search{padding-top:60px;z-index:-1}.kui-menu.simple-search .kui-previous-search-list .mat-list-item{cursor:pointer}.kui-menu.simple-search .kui-previous-search-list .mat-list-item:hover{background-color:#f9f9f9}.kui-menu.simple-search .kui-previous-search-list .mat-list-item:hover mat-icon{display:block}.kui-menu.simple-search .kui-previous-search-list .mat-list-item mat-icon{display:none}.kui-menu.simple-search .right{margin-top:12px;margin-left:16px}.kui-menu.extended-search{z-index:20}.search-bar-elements{display:flex}.show{display:block}@media screen and (max-width:1024px){.search-panel{width:480px}.search-panel div.input-field input{width:calc(480px - 80px)}.kui-menu.extended-search,.kui-menu.simple-search{width:480px}}@media screen and (max-width:768px){.search-panel{width:calc(480px - 160px)}.search-panel div.input-field input{width:calc(480px - 160px - 80px)}.kui-menu.extended-search,.kui-menu.simple-search{width:calc(480px - 80px)}}`],
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
SearchComponent.ctorParameters = () => [
    { type: ActivatedRoute },
    { type: Router },
    { type: ElementRef }
];
SearchComponent.propDecorators = {
    route: [{ type: Input }]
};

class SearchPanelComponent {
    constructor() {
        this.route = '/search';
        this.showMenu = false;
        this.focusOnExtended = 'inactive';
    }
    /**
     * Show or hide the extended search menu
     *
     * @returns void
     */
    toggleMenu() {
        this.showMenu = !this.showMenu;
        this.focusOnExtended = (this.focusOnExtended === 'active' ? 'inactive' : 'active');
    }
}
SearchPanelComponent.decorators = [
    { type: Component, args: [{
                selector: 'kui-search-panel',
                template: `<div class="kui-search-panel">

    <div class="kui-search-bar">

        <div class="fulltext-search">
            <kui-fulltext-search [route]="route"></kui-fulltext-search>
        </div>

        <div *ngIf="showMenu" [@extendedSearchMenu]="focusOnExtended" class="kui-menu extended-search">
            <div class="kui-menu-header">
                <span class="kui-menu-title">
                    <h4>Advanced search</h4>
                </span>
                <span class="kui-menu-action">
                    <button mat-icon-button (click)="toggleMenu()">
                        <mat-icon>close</mat-icon>
                    </button>
                </span>
            </div>
            <div class="extended-search-box">
                <kui-extended-search [route]="route" (toggleExtendedSearchForm)="toggleMenu()"></kui-extended-search>
            </div>
        </div>

    </div>

    <div class="advanced-btn">
        <button mat-button color="primary" (click)="toggleMenu()">advanced</button>
    </div>

</div>`,
                styles: [`.advanced-btn{margin-left:10px}.kui-search-panel{display:flex}.kui-search-bar{background-color:#f9f9f9;border-radius:4px;display:inline-flex;height:40px;position:relative;z-index:10}.kui-search-bar:hover{box-shadow:0 1px 3px rgba(0,0,0,.5)}.kui-menu{box-shadow:0 3px 5px -1px rgba(11,11,11,.2),0 6px 10px 0 rgba(11,11,11,.14),0 1px 18px 0 rgba(11,11,11,.12);background-color:#f9f9f9;border-radius:4px;position:absolute}.kui-menu .kui-menu-header{background-color:#f9f9f9;border-top-left-radius:4px;border-top-right-radius:4px;display:inline-block;height:48px;width:100%}.kui-menu .kui-menu-header .kui-menu-title{float:left;font-size:14px;font-weight:400;margin-top:4px;padding:12px}.kui-menu .kui-menu-header .kui-menu-action{float:right;margin:4px}.kui-menu.extended-search{min-height:680px;width:680px;z-index:20}.extended-search-box{margin:12px}@media screen and (max-width:1024px){.kui-search-bar{width:480px}.kui-search-bar div.input-field input{width:calc(480px - 80px)}.fulltext-search,.kui-menu.extended-search{width:480px}}@media screen and (max-width:768px){.kui-search-bar{width:calc(480px - 160px)}.kui-search-bar div.input-field input{width:calc(480px - 160px - 80px)}.fulltext-search,.kui-menu.extended-search{width:calc(480px - 80px)}}`],
                animations: [
                    trigger('extendedSearchMenu', [
                        state('inactive', style({ display: 'none' })),
                        state('active', style({ display: 'block' })),
                        transition('inactive => active', animate('100ms ease-in')),
                        transition('active => inactive', animate('100ms ease-out'))
                    ])
                ]
            },] },
];
/** @nocollapse */
SearchPanelComponent.ctorParameters = () => [];
SearchPanelComponent.propDecorators = {
    route: [{ type: Input }]
};

class FulltextSearchComponent {
    constructor(_route, _router) {
        this._route = _route;
        this._router = _router;
        this.route = '/search';
        this.showSimpleSearch = true;
        this.searchPanelFocus = false;
        this.prevSearch = JSON.parse(localStorage.getItem('prevSearch'));
        this.focusOnSimple = 'inactive';
        this.searchLabel = 'Search';
    }
    ngOnInit() {
    }
    /**
     * @ignore
     * Do search on Enter click, reset search on Escape
     * @param search_ele
     * @param event
     * @returns void
     */
    onKey(search_ele, event) {
        this.focusOnSimple = 'active';
        this.prevSearch = JSON.parse(localStorage.getItem('prevSearch'));
        if (this.searchQuery && (event.key === 'Enter' || event.keyCode === 13 || event.which === 13)) {
            this.doSearch(search_ele);
        }
        if (event.key === 'Escape' || event.keyCode === 27 || event.which === 27) {
            this.resetSearch(search_ele);
        }
    }
    /**
     * Realise a simple search
     * @param {HTMLElement} search_ele
     * @returns void
     */
    doSearch(search_ele) {
        if (this.searchQuery !== undefined && this.searchQuery !== null) {
            this.toggleMenu();
            this._router.navigate([this.route + '/fulltext/' + this.searchQuery]);
            // this._router.navigate(['/search/fulltext/' + this.searchQuery], { relativeTo: this._route });
            // push the search query into the local storage prevSearch array (previous search)
            // to have a list of recent search requests
            let existingPrevSearch = JSON.parse(localStorage.getItem('prevSearch'));
            if (existingPrevSearch === null) {
                existingPrevSearch = [];
            }
            let i = 0;
            for (const entry of existingPrevSearch) {
                // remove entry, if exists already
                if (this.searchQuery === entry) {
                    existingPrevSearch.splice(i, 1);
                }
                i++;
            }
            existingPrevSearch.push(this.searchQuery);
            localStorage.setItem('prevSearch', JSON.stringify(existingPrevSearch));
        }
        else {
            search_ele.focus();
            this.prevSearch = JSON.parse(localStorage.getItem('prevSearch'));
        }
    }
    /**
     * Reset the search
     * @param {HTMLElement} search_ele
     * @returns void
     */
    resetSearch(search_ele) {
        this.searchQuery = null;
        search_ele.focus();
        this.focusOnSimple = 'inactive';
        this.searchPanelFocus = !this.searchPanelFocus;
    }
    /**
     * Switch according to the focus between simple or extended search
     *
     * @param {string} name 2 cases: simpleSearch or extendedSearch
     * @returns void
     */
    toggleMenu() {
        this.prevSearch = JSON.parse(localStorage.getItem('prevSearch'));
        this.focusOnSimple = (this.focusOnSimple === 'active' ? 'inactive' : 'active');
        this.showSimpleSearch = true;
    }
    /**
     * Set simple focus to active
     *
     * @returns void
     */
    setFocus() {
        this.prevSearch = JSON.parse(localStorage.getItem('prevSearch'));
        this.focusOnSimple = 'active';
        this.searchPanelFocus = !this.searchPanelFocus;
    }
    /**
     * Realise a previous search
     * @param {string} query
     * @returns void
     */
    doPrevSearch(query) {
        this.searchQuery = query;
        this._router.navigate([this.route + '/fulltext/' + query], { relativeTo: this._route });
        this.toggleMenu();
    }
    /**
     * Reset previous searches - the whole previous search or specific item by name
     * @param {string} name term of the search
     * @returns void
     */
    resetPrevSearch(name = null) {
        if (name) {
            // delete only this item with the name ...
            const i = this.prevSearch.indexOf(name);
            this.prevSearch.splice(i, 1);
            localStorage.setItem('prevSearch', JSON.stringify(this.prevSearch));
        }
        else {
            // delete the whole "previous search" array
            localStorage.removeItem('prevSearch');
        }
        this.prevSearch = JSON.parse(localStorage.getItem('prevSearch'));
    }
}
FulltextSearchComponent.decorators = [
    { type: Component, args: [{
                selector: 'kui-fulltext-search',
                template: `<div class="search-bar-elements">

    <div class="fulltext-search-bar" [class.active]="searchPanelFocus">
        <div>
            <button class="prefix" (click)="doSearch(search)">
                <mat-icon>search</mat-icon>
            </button>
        </div>

        <div class="input-field">
            <input #search autocomplete="off" type="search" [placeholder]="searchLabel" [(ngModel)]="searchQuery" name="search" (keyup.esc)="resetSearch(search)" (keyup)="onKey(search, $event)" (click)="setFocus()" (focus)="toggleMenu()" />
        </div>

        <!-- switch button: on some focus we need a close button for the simple -->
        <div>
            <button class="suffix" *ngIf="focusOnSimple === 'active'" (click)="resetSearch(search)">
                <mat-icon>close</mat-icon>
            </button>
            <button class="suffix" *ngIf="focusOnSimple === 'inactive'"></button>
        </div>

        <!-- "dropdown" menu for simple search -->
        <div class="kui-menu simple-search" [@fulltextSearchMenu]="focusOnSimple" *ngIf="showSimpleSearch">
            <mat-list class="kui-previous-search-list">
                <mat-list-item *ngFor="let item of prevSearch | kuiReverse; let i=index">
                    <h4 mat-line *ngIf="i<10" (click)="doPrevSearch(item)">{{item}}</h4>
                    <button mat-icon-button (click)="resetPrevSearch(item)">
                        <mat-icon aria-label="close">close</mat-icon>
                    </button>
                </mat-list-item>
            </mat-list>
            <button mat-stroked-button color="accent" class="right" (click)="resetPrevSearch()" *ngIf="prevSearch">Clear</button>
        </div>

    </div>
</div>`,
                styles: [`input[type=search]::-webkit-search-cancel-button,input[type=search]::-webkit-search-decoration,input[type=search]::-webkit-search-results-button,input[type=search]::-webkit-search-results-decoration{display:none}input[type=search]{-moz-appearance:none;-webkit-appearance:none}.full-width{width:100%}.close{right:12px}.hide{display:none}.show{display:block}.search-bar-elements{display:flex}.inactive{color:#7a7a7a}.fulltext-search-bar{background-color:#f9f9f9;border-radius:4px;display:inline-flex;height:40px;position:relative;width:680px;z-index:10}.fulltext-search-bar:hover{box-shadow:0 1px 3px rgba(0,0,0,.5)}.fulltext-search-bar div.input-field{flex:1}.fulltext-search-bar div.input-field input{border-style:none;font-size:14pt;height:38px;position:absolute;width:calc(100% - 80px)}.fulltext-search-bar div.input-field input:active,.fulltext-search-bar div.input-field input:focus{outline:0}.fulltext-search-bar div .prefix,.fulltext-search-bar div .suffix{background-color:#fff;border-radius:3px;border-style:none;color:rgba(41,41,41,.4);cursor:pointer;height:38px;outline:0;position:relative;width:40px}.fulltext-search-bar div .prefix:active,.fulltext-search-bar div .suffix:active{color:#515151}.fulltext-search-bar div.active{box-shadow:0 1px 3px rgba(0,0,0,.5)}.kui-menu{box-shadow:0 3px 5px -1px rgba(11,11,11,.2),0 6px 10px 0 rgba(11,11,11,.14),0 1px 18px 0 rgba(11,11,11,.12);background-color:#f9f9f9;border-radius:4px;position:absolute}.kui-menu.simple-search{min-height:680px;width:680px;padding-top:60px;z-index:-1}.kui-menu.simple-search .kui-previous-search-list .mat-list-item{cursor:pointer}.kui-menu.simple-search .kui-previous-search-list .mat-list-item:hover{background-color:#f9f9f9}.kui-menu.simple-search .kui-previous-search-list .mat-list-item:hover mat-icon{display:block}.kui-menu.simple-search .kui-previous-search-list .mat-list-item mat-icon{display:none}.kui-menu.simple-search .right{margin-top:12px;margin-left:16px}@media screen and (max-width:1024px){.fulltext-search-bar{width:480px}.fulltext-search-bar div.input-field input{width:calc(480px - 80px)}.kui-menu.simple-search{width:480px}}@media screen and (max-width:768px){.fulltext-search-bar{width:calc(480px - 160px)}.fulltext-search-bar div.input-field input{width:calc(480px - 160px - 80px)}.kui-menu.simple-search{width:calc(480px - 80px)}}`],
                animations: [
                    trigger('fulltextSearchMenu', [
                        state('inactive', style({ display: 'none' })),
                        state('active', style({ display: 'block' })),
                        transition('inactive => active', animate('100ms ease-in')),
                        transition('active => inactive', animate('100ms ease-out'))
                    ])
                ]
            },] },
];
/** @nocollapse */
FulltextSearchComponent.ctorParameters = () => [
    { type: ActivatedRoute },
    { type: Router }
];
FulltextSearchComponent.propDecorators = {
    route: [{ type: Input }]
};

// https://stackoverflow.com/questions/45661010/dynamic-nested-reactive-form-expressionchangedafterithasbeencheckederror
const resolvedPromise = Promise.resolve(null);
class SelectResourceClassComponent {
    constructor(fb) {
        this.fb = fb;
        // event emitted to parent component once a resource class is selected by the user
        this.resourceClassSelectedEvent = new EventEmitter();
    }
    // setter method for resource classes when being updated by parent component
    set resourceClasses(value) {
        this.resourceClassSelected = undefined; // reset on updates
        this._resourceClasses = value;
    }
    // getter method for resource classes (used in template)
    get resourceClasses() {
        return this._resourceClasses;
    }
    /**
     * Returns the Iri of the selected resource class.
     *
     * @returns the Iri of the selected resource class or false in case no resource class is selected.
     */
    getResourceClassSelected() {
        if (this.resourceClassSelected !== undefined && this.resourceClassSelected !== null) {
            return this.resourceClassSelected;
        }
        else {
            return false;
        }
    }
    /**
     * Initalizes the FormGroup for the resource class selection.
     * The initial value is set to null.
     */
    initForm() {
        // build a form for the resource class selection
        this.form = this.fb.group({
            resourceClass: [null] // resource class selection is optional
        });
        // store and emit Iri of the resource class when selected
        this.form.valueChanges.subscribe((data) => {
            this.resourceClassSelected = data.resourceClass;
            this.resourceClassSelectedEvent.emit(this.resourceClassSelected);
        });
    }
    ngOnInit() {
        this.initForm();
        // add form to the parent form group
        this.formGroup.addControl('resourceClass', this.form);
    }
    ngOnChanges() {
        if (this.form !== undefined) {
            // resource classes have been reinitialized
            // reset form
            resolvedPromise.then(() => {
                // remove this form from the parent form group
                this.formGroup.removeControl('resourceClass');
                this.initForm();
                // add form to the parent form group
                this.formGroup.addControl('resourceClass', this.form);
            });
        }
    }
}
SelectResourceClassComponent.decorators = [
    { type: Component, args: [{
                selector: 'kui-select-resource-class',
                template: `<mat-form-field *ngIf="resourceClasses.length > 0">
  <mat-select placeholder="Resource Class" [formControl]="form.controls['resourceClass']">
    <mat-option [value]="null">no selection</mat-option>
    <!-- undo selection of a resource class -->
    <mat-option *ngFor="let resourceClass of resourceClasses" [value]="resourceClass.id">{{ resourceClass.label }}</mat-option>
  </mat-select>
</mat-form-field>`,
                styles: [``]
            },] },
];
/** @nocollapse */
SelectResourceClassComponent.ctorParameters = () => [
    { type: FormBuilder, decorators: [{ type: Inject, args: [FormBuilder,] }] }
];
SelectResourceClassComponent.propDecorators = {
    formGroup: [{ type: Input }],
    resourceClasses: [{ type: Input }],
    resourceClassSelectedEvent: [{ type: Output }]
};

class ExtendedSearchComponent {
    constructor(fb, _route, _router, _cacheService, _gravSearchService) {
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
    ngOnInit() {
        // parent form is empty, it gets passed to the child components
        this.form = this.fb.group({});
        // if form status changes, re-run validation
        this.form.statusChanges.subscribe((data) => {
            this.formValid = this.validateForm();
            // console.log(this.form);
        });
        // initialize ontologies to be used for the ontologies selection in the search form
        this.initializeOntologies();
    }
    /**
     * Add a property to the search form.
     * @returns void
     */
    addProperty() {
        this.activeProperties.push(true);
    }
    /**
     * Remove the last property from the search form.
     * @returns void
     */
    removeProperty() {
        this.activeProperties.splice(-1, 1);
    }
    /**
     * Gets all available ontologies for the search form.
     * @returns void
     */
    initializeOntologies() {
        this._cacheService.getOntologiesMetadata().subscribe((ontologies) => {
            this.ontologies = ontologies;
        });
    }
    /**
     * Once an ontology has been selected, gets its classes and properties.
     * The classes and properties will be made available to the user for selection.
     *
     * @param ontologyIri Iri of the ontology chosen by the user.
     * @returns void
     */
    getResourceClassesAndPropertiesForOntology(ontologyIri) {
        // reset active resource class definition
        this.activeResourceClass = undefined;
        // reset specified properties
        this.activeProperties = [];
        this.activeOntology = ontologyIri;
        this._cacheService.getEntityDefinitionsForOntologies([ontologyIri]).subscribe((ontoInfo) => {
            this.resourceClasses = ontoInfo.getResourceClassesAsArray();
            this.properties = ontoInfo.getProperties();
        });
    }
    /**
     * Once a resource class has been selected, gets its properties.
     * The properties will be made available to the user for selection.
     *
     * @param resourceClassIri
     * @returns void
     */
    getPropertiesForResourceClass(resourceClassIri) {
        // reset specified properties
        this.activeProperties = [];
        // if the client undoes the selection of a resource class, use the active ontology as a fallback
        if (resourceClassIri === null) {
            this.getResourceClassesAndPropertiesForOntology(this.activeOntology);
        }
        else {
            this._cacheService.getResourceClassDefinitions([resourceClassIri]).subscribe((ontoInfo) => {
                this.properties = ontoInfo.getProperties();
                this.activeResourceClass = ontoInfo.getResourceClasses()[resourceClassIri];
            });
        }
    }
    /**
     * Validates form and returns its status (boolean).
     */
    validateForm() {
        // check that either a resource class is selected or at least one property is specified
        return this.form.valid &&
            (this.propertyComponents.length > 0 || (this.resourceClassComponent !== undefined && this.resourceClassComponent.getResourceClassSelected() !== false));
    }
    /**
     * Resets the form (selected resource class and specified properties) preserving the active ontology.
     */
    resetForm() {
        if (this.activeOntology !== undefined) {
            this.getResourceClassesAndPropertiesForOntology(this.activeOntology);
        }
    }
    /**
     * Creates a GravSearch query with the given form values and calls the extended search route.
     */
    submit() {
        if (!this.formValid)
            return; // check that from is valid
        const resClassOption = this.resourceClassComponent.getResourceClassSelected();
        let resClass;
        if (resClassOption !== false) {
            resClass = resClassOption;
        }
        const properties = this.propertyComponents.map((propComp) => {
            return propComp.getPropertySelectedWithValue();
        });
        const gravsearch = this._gravSearchService.createGravsearchQuery(properties, resClass, 0);
        this._router.navigate([this.route + '/extended/', gravsearch], { relativeTo: this._route });
        // toggle extended search form
        this.toggleExtendedSearchForm.emit(true);
    }
}
ExtendedSearchComponent.decorators = [
    { type: Component, args: [{
                selector: 'kui-extended-search',
                template: `<form [formGroup]="form" (ngSubmit)="submit()">

  <div>
    <kui-select-ontology *ngIf="ontologies.length > 0" [formGroup]="form" [ontologies]="ontologies" (ontologySelected)="getResourceClassesAndPropertiesForOntology($event)"></kui-select-ontology>
  </div>

  <div class="select-resource-class" *ngIf="resourceClasses?.length > 0">
    <kui-select-resource-class #resourceClass [formGroup]="form" [resourceClasses]="resourceClasses" (resourceClassSelectedEvent)="getPropertiesForResourceClass($event)"></kui-select-resource-class>
  </div>

  <div class="select-property" *ngIf="properties !== undefined">
    <div *ngFor="let prop of activeProperties; let i = index">

      <kui-select-property #property [activeResourceClass]="activeResourceClass" [formGroup]="form" [index]="i" [properties]="properties"></kui-select-property>

    </div>
  </div>


  <div>
    <button mat-mini-fab class="property-buttons add-property-button" color="primary" type="button" (click)="addProperty()" [disabled]="activeOntology === undefined || activeProperties.length >= 4">
      <mat-icon aria-label="add a property">add</mat-icon>
    </button>

    <button mat-mini-fab class="property-buttons remove-property-button" color="primary" type="button" (click)="removeProperty()" [disabled]="activeProperties.length == 0">
      <mat-icon aria-label="remove property">remove</mat-icon>
    </button>
  </div>

  <!--  <div>
    <button mat-icon-button type="button" (click)="resetForm()" [disabled]="this.activeOntology === undefined">
      <mat-icon aria-label="reset query form">clear</mat-icon>
    </button>

    <button mat-icon-button type="submit" [disabled]="!formValid">
      <mat-icon aria-label="submit query">send</mat-icon>
    </button>
  </div> -->

  <button class="extended-buttons extended-search-button" mat-stroked-button color="primary" type="submit" [disabled]="!formValid">
    Search
  </button>
  <button class="extended-buttons reset" mat-stroked-button type="button" (click)="resetForm()" [disabled]="this.activeOntology === undefined">
    Reset
  </button>


</form>
`,
                styles: [`.add-property-button{margin-right:5px}.extended-buttons{margin-top:25px}.extended-search-button{margin-right:5px}.property-buttons{margin-top:25px}.select-property{margin-left:22px}.select-resource-class{margin-left:12px}`]
            },] },
];
/** @nocollapse */
ExtendedSearchComponent.ctorParameters = () => [
    { type: FormBuilder, decorators: [{ type: Inject, args: [FormBuilder,] }] },
    { type: ActivatedRoute },
    { type: Router },
    { type: OntologyCacheService },
    { type: GravsearchGenerationService }
];
ExtendedSearchComponent.propDecorators = {
    route: [{ type: Input }],
    toggleExtendedSearchForm: [{ type: Output }],
    resourceClassComponent: [{ type: ViewChild, args: ['resourceClass',] }],
    propertyComponents: [{ type: ViewChildren, args: ['property',] }]
};

class SelectOntologyComponent {
    constructor(fb) {
        this.fb = fb;
        this.ontologySelected = new EventEmitter();
    }
    ngOnInit() {
        // build a form for the named graph selection
        this.form = this.fb.group({
            ontology: [null, Validators.required]
        });
        // emit Iri of the ontology when being selected
        this.form.valueChanges.subscribe((data) => {
            this.ontologySelected.emit(data.ontology);
        });
        // add form to the parent form group
        this.formGroup.addControl('ontology', this.form);
    }
}
SelectOntologyComponent.decorators = [
    { type: Component, args: [{
                selector: 'kui-select-ontology',
                template: `<mat-form-field *ngIf="ontologies.length > 0">
  <mat-select placeholder="Ontology" [formControl]="form.controls['ontology']">
      <mat-option *ngFor="let onto of ontologies" [value]="onto.id">{{ onto.label }}</mat-option>
  </mat-select>
</mat-form-field>
`,
                styles: [``]
            },] },
];
/** @nocollapse */
SelectOntologyComponent.ctorParameters = () => [
    { type: FormBuilder, decorators: [{ type: Inject, args: [FormBuilder,] }] }
];
SelectOntologyComponent.propDecorators = {
    formGroup: [{ type: Input }],
    ontologies: [{ type: Input }],
    ontologySelected: [{ type: Output }]
};

// https://stackoverflow.com/questions/45661010/dynamic-nested-reactive-form-expressionchangedafterithasbeencheckederror
const resolvedPromise$1 = Promise.resolve(null);
class SpecifyPropertyValueComponent {
    constructor(fb) {
        this.fb = fb;
        this.KnoraConstants = KnoraConstants;
        // available comparison operators for the property
        this.comparisonOperators = [];
    }
    // setter method for the property chosen by the user
    set property(prop) {
        this.comparisonOperatorSelected = undefined; // reset to initial state
        this._property = prop;
        this.resetComparisonOperators(); // reset comparison operators for given property (overwriting any previous selection)
    }
    // getter method for this._property
    get property() {
        return this._property;
    }
    /**
     * Resets the comparison operators for this._property.
     */
    resetComparisonOperators() {
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
    }
    ngOnInit() { }
    ngOnChanges() {
        // build a form for comparison operator selection
        this.form = this.fb.group({
            comparisonOperator: [null, Validators.required]
        });
        // store comparison operator when selected
        this.form.valueChanges.subscribe((data) => {
            this.comparisonOperatorSelected = data.comparisonOperator;
        });
        resolvedPromise$1.then(() => {
            // remove from the parent form group (clean reset)
            this.formGroup.removeControl('comparisonOperator');
            // add form to the parent form group
            this.formGroup.addControl('comparisonOperator', this.form);
        });
    }
    /**
     * Gets the specified comparison operator and value for the property.
     *
     * returns {ComparisonOperatorAndValue} the comparison operator and the specified value
     */
    getComparisonOperatorAndValueLiteralForProperty() {
        // return value (literal or IRI) from the child component
        let value;
        // comparison operator 'Exists' does not require a value
        if (this.comparisonOperatorSelected.getClassName() !== 'Exists') {
            value = this.propertyValueComponent.getValue();
        }
        // return the comparison operator and the specified value
        return new ComparisonOperatorAndValue(this.comparisonOperatorSelected, value);
    }
}
SpecifyPropertyValueComponent.decorators = [
    { type: Component, args: [{
                selector: 'kui-specify-property-value',
                template: `<mat-form-field class="search-operator-field" *ngIf="comparisonOperators?.length > 0">
    <mat-select placeholder="Comparison Operator" [formControl]="form.controls['comparisonOperator']">
        <mat-option *ngFor="let compOp of comparisonOperators" [value]="compOp">{{ compOp.label }}</mat-option>
    </mat-select>
</mat-form-field>

<!-- select apt component for value specification using a switch case statement-->
<span
    *ngIf="comparisonOperatorSelected !== undefined && comparisonOperatorSelected !== null && comparisonOperatorSelected.getClassName() != 'Exists'"
    [ngSwitch]="propertyValueType">
  <boolean-value #propertyValue [formGroup]="form" *ngSwitchCase="KnoraConstants.BooleanValue"></boolean-value>
  <date-value #propertyValue [formGroup]="form" *ngSwitchCase="KnoraConstants.DateValue"></date-value>
  <decimal-value #propertyValue [formGroup]="form" *ngSwitchCase="KnoraConstants.DecimalValue"></decimal-value>
  <integer-value #propertyValue [formGroup]="form" *ngSwitchCase="KnoraConstants.IntValue"></integer-value>
  <link-value #propertyValue [formGroup]="form" [restrictResourceClass]="property.objectType"
              *ngSwitchCase="KnoraConstants.Resource"></link-value>
  <text-value #propertyValue [formGroup]="form" *ngSwitchCase="KnoraConstants.TextValue"></text-value>
  <uri-value #propertyValue [formGroup]="form" *ngSwitchCase="KnoraConstants.UriValue"></uri-value>

    <!-- TODO: Resource: handle linking properties with target class restriction: access property member to get objectClass via property() getter method -->
  <span *ngSwitchDefault="">Not supported {{propertyValueType}}</span>
</span>
`,
                styles: [`.search-operator-field{margin-right:8px}`]
            },] },
];
/** @nocollapse */
SpecifyPropertyValueComponent.ctorParameters = () => [
    { type: FormBuilder, decorators: [{ type: Inject, args: [FormBuilder,] }] }
];
SpecifyPropertyValueComponent.propDecorators = {
    formGroup: [{ type: Input }],
    propertyValueComponent: [{ type: ViewChild, args: ['propertyValue',] }],
    property: [{ type: Input }]
};

// https://stackoverflow.com/questions/45661010/dynamic-nested-reactive-form-expressionchangedafterithasbeencheckederror
const resolvedPromise$2 = Promise.resolve(null);
class SelectPropertyComponent {
    constructor(fb) {
        this.fb = fb;
    }
    // setter method for properties when being updated by parent component
    set properties(value) {
        this.propertySelected = undefined; // reset selected property (overwriting any previous selection)
        this._properties = value;
        this.updatePropertiesArray();
    }
    get properties() {
        return this._properties;
    }
    // setter method for selected resource class
    set activeResourceClass(value) {
        this._activeResourceClass = value;
    }
    ngOnInit() {
        // build a form for the property selection
        this.form = this.fb.group({
            property: [null, Validators.required],
            isSortCriterion: [false, Validators.required]
        });
        // update the selected property
        this.form.valueChanges.subscribe((data) => {
            const propIri = data.property;
            this.propertySelected = this._properties[propIri];
        });
        resolvedPromise$2.then(() => {
            this.propIndex = 'property' + this.index;
            // add form to the parent form group
            this.formGroup.addControl(this.propIndex, this.form);
        });
    }
    ngOnDestroy() {
        // remove form from the parent form group
        resolvedPromise$2.then(() => {
            this.formGroup.removeControl(this.propIndex);
        });
    }
    /**
     * Indicates if property can be used as a sort criterion.
     * Property has to have cardinality or max cardinality 1 for the chosen resource class.
     *
     * We cannot sort by properties whose cardinality is greater than 1.
     * Return boolean
     */
    sortCriterion() {
        // check if a resource class is selected and if the property's cardinality is 1 for the selected resource class
        if (this._activeResourceClass !== undefined && this.propertySelected !== undefined && !this.propertySelected.isLinkProperty) {
            const cardinalities = this._activeResourceClass.cardinalities.filter((card) => {
                // cardinality 1 or max occurrence 1
                return card.property === this.propertySelected.id
                    && card.value === 1
                    && (card.occurrence === CardinalityOccurrence.card || card.occurrence === CardinalityOccurrence.maxCard);
            });
            return cardinalities.length === 1;
        }
        else {
            return false;
        }
    }
    /**
     * Updates the properties array that is accessed by the template.
     */
    updatePropertiesArray() {
        // represent the properties as an array to be accessed by the template
        const propsArray = [];
        for (const propIri in this._properties) {
            if (this._properties.hasOwnProperty(propIri)) {
                const prop = this._properties[propIri];
                // only list editable props that are not link value props
                if (prop.isEditable && !prop.isLinkValueProperty) {
                    propsArray.push(this._properties[propIri]);
                }
            }
        }
        this.propertiesAsArray = propsArray;
    }
    /**
     * Returns the selected property with the specified value.
     */
    getPropertySelectedWithValue() {
        const propVal = this.specifyPropertyValue.getComparisonOperatorAndValueLiteralForProperty();
        let isSortCriterion = false;
        // only non linking properties can be used for sorting
        if (!this.propertySelected.isLinkProperty) {
            isSortCriterion = this.form.value.isSortCriterion;
        }
        return new PropertyWithValue(this.propertySelected, propVal, isSortCriterion);
    }
}
SelectPropertyComponent.decorators = [
    { type: Component, args: [{
                selector: 'kui-select-property',
                template: `<mat-form-field class="search-property-field" *ngIf="propertiesAsArray?.length > 0">
  <mat-select placeholder="Properties" [formControl]="form.controls['property']">
    <mat-option *ngFor="let prop of propertiesAsArray" [value]="prop.id">{{ prop.label }}</mat-option>
  </mat-select>
</mat-form-field>

<kui-specify-property-value #specifyPropertyValue [formGroup]="form" *ngIf="propertySelected !== undefined" [property]="propertySelected"></kui-specify-property-value>

<mat-checkbox matTooltip="Sort criterion" *ngIf="propertySelected !== undefined && sortCriterion()" [formControl]="form.controls['isSortCriterion']"></mat-checkbox>`,
                styles: [`.search-property-field{margin-right:8px}`]
            },] },
];
/** @nocollapse */
SelectPropertyComponent.ctorParameters = () => [
    { type: FormBuilder, decorators: [{ type: Inject, args: [FormBuilder,] }] }
];
SelectPropertyComponent.propDecorators = {
    formGroup: [{ type: Input }],
    index: [{ type: Input }],
    properties: [{ type: Input }],
    activeResourceClass: [{ type: Input }],
    specifyPropertyValue: [{ type: ViewChild, args: ['specifyPropertyValue',] }]
};

// https://stackoverflow.com/questions/45661010/dynamic-nested-reactive-form-expressionchangedafterithasbeencheckederror
const resolvedPromise$3 = Promise.resolve(null);
class BooleanValueComponent {
    constructor(fb) {
        this.fb = fb;
        this.type = KnoraConstants.BooleanValue;
    }
    ngOnInit() {
        this.form = this.fb.group({
            booleanValue: [false, Validators.compose([Validators.required])]
        });
        resolvedPromise$3.then(() => {
            // add form to the parent form group
            this.formGroup.addControl('propValue', this.form);
        });
    }
    ngOnDestroy() {
        // remove form from the parent form group
        resolvedPromise$3.then(() => {
            this.formGroup.removeControl('propValue');
        });
    }
    getValue() {
        return new ValueLiteral(String(this.form.value.booleanValue), KnoraConstants.xsdBoolean);
    }
}
BooleanValueComponent.decorators = [
    { type: Component, args: [{
                selector: 'boolean-value',
                template: `<mat-checkbox [formControl]="form.controls['booleanValue']"></mat-checkbox>
`,
                styles: [``]
            },] },
];
/** @nocollapse */
BooleanValueComponent.ctorParameters = () => [
    { type: FormBuilder, decorators: [{ type: Inject, args: [FormBuilder,] }] }
];
BooleanValueComponent.propDecorators = {
    formGroup: [{ type: Input }]
};

/** Custom header component containing a calendar format switcher */
class HeaderComponent {
    constructor(_calendar, _dateAdapter, fb) {
        this._calendar = _calendar;
        this._dateAdapter = _dateAdapter;
        this.fb = fb;
        // a list of supported calendar formats (Gregorian and Julian)
        this.supportedCalendarFormats = JDNConvertibleCalendar.supportedCalendars;
    }
    ngOnInit() {
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
        this.form.valueChanges.subscribe((data) => {
            // pass the target calendar format to the conversion method
            this.convertDate(data.calendar);
        });
    }
    /**
     * Converts the date into the target format.
     *
     * @param calendar the target calendar format.
     */
    convertDate(calendar) {
        if (this._dateAdapter instanceof JDNConvertibleCalendarDateAdapter) {
            // convert the date into the target calendar format
            const convertedDate = this._dateAdapter.convertCalendarFormat(this._calendar.activeDate, calendar);
            // set the new date
            this._calendar.activeDate = convertedDate;
            // select the new date in the datepicker UI
            this._calendar._dateSelected(convertedDate);
            // update view after calendar format conversion
            const view = this._calendar.currentView === 'month' ? this._calendar.monthView :
                (this._calendar.currentView === 'year' ? this._calendar.yearView : this._calendar.multiYearView);
            view.ngAfterContentInit();
        }
        else {
            console.log('date adapter is expected to be an instance of JDNConvertibleCalendarDateAdapter');
        }
    }
}
HeaderComponent.decorators = [
    { type: Component, args: [{
                selector: 'kui-calendar-header',
                template: `
      <mat-select placeholder="Calendar Format" [formControl]="form.controls['calendar']">
        <mat-option *ngFor="let cal of supportedCalendarFormats" [value]="cal">{{cal}}</mat-option>
      </mat-select>
      <mat-calendar-header></mat-calendar-header>
    `,
                styles: []
            },] },
];
/** @nocollapse */
HeaderComponent.ctorParameters = () => [
    { type: MatCalendar, decorators: [{ type: Host }] },
    { type: DateAdapter },
    { type: FormBuilder, decorators: [{ type: Inject, args: [FormBuilder,] }] }
];

// https://stackoverflow.com/questions/45661010/dynamic-nested-reactive-form-expressionchangedafterithasbeencheckederror
const resolvedPromise$4 = Promise.resolve(null);
class DateValueComponent {
    constructor(fb) {
        this.fb = fb;
        this.type = KnoraConstants.DateValue;
        // custom header for the datepicker
        this.headerComponent = HeaderComponent;
    }
    ngOnInit() {
        // init datepicker
        this.form = this.fb.group({
            dateValue: [null, Validators.compose([Validators.required])]
        });
        this.form.valueChanges.subscribe((data) => {
            // console.log(data.dateValue);
        });
        resolvedPromise$4.then(() => {
            // add form to the parent form group
            this.formGroup.addControl('propValue', this.form);
        });
    }
    ngOnDestroy() {
        // remove form from the parent form group
        resolvedPromise$4.then(() => {
            this.formGroup.removeControl('propValue');
        });
    }
    getValue() {
        const dateObj = this.form.value.dateValue;
        // get calendar format
        const calendarFormat = dateObj.calendarName;
        // get calendar period
        const calendarPeriod = dateObj.toCalendarPeriod();
        // get the date
        const dateString = `${calendarFormat.toUpperCase()}:${calendarPeriod.periodStart.year}-${calendarPeriod.periodStart.month}-${calendarPeriod.periodStart.day}:${calendarPeriod.periodEnd.year}-${calendarPeriod.periodEnd.month}-${calendarPeriod.periodEnd.day}`;
        return new ValueLiteral(String(dateString), KnoraConstants.DateValue);
    }
}
DateValueComponent.decorators = [
    { type: Component, args: [{
                selector: 'date-value',
                template: `<mat-form-field>
    <kuiJdnDatepicker>
        <input matInput [matDatepicker]="picker" placeholder="Choose a date" [formControl]="form.controls['dateValue']">
        <mat-datepicker #picker [calendarHeaderComponent]="headerComponent"></mat-datepicker>
    </kuiJdnDatepicker>
    <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
</mat-form-field>`,
                styles: [``]
            },] },
];
/** @nocollapse */
DateValueComponent.ctorParameters = () => [
    { type: FormBuilder, decorators: [{ type: Inject, args: [FormBuilder,] }] }
];
DateValueComponent.propDecorators = {
    formGroup: [{ type: Input }]
};

// https://stackoverflow.com/questions/45661010/dynamic-nested-reactive-form-expressionchangedafterithasbeencheckederror
const resolvedPromise$5 = Promise.resolve(null);
class DecimalValueComponent {
    constructor(fb) {
        this.fb = fb;
        this.type = KnoraConstants.DecimalValue;
    }
    ngOnInit() {
        this.form = this.fb.group({
            decimalValue: [null, Validators.compose([Validators.required])]
        });
        resolvedPromise$5.then(() => {
            // add form to the parent form group
            this.formGroup.addControl('propValue', this.form);
        });
    }
    ngOnDestroy() {
        // remove form from the parent form group
        resolvedPromise$5.then(() => {
            this.formGroup.removeControl('propValue');
        });
    }
    getValue() {
        return new ValueLiteral(String(this.form.value.decimalValue), KnoraConstants.xsdDecimal);
    }
}
DecimalValueComponent.decorators = [
    { type: Component, args: [{
                selector: 'decimal-value',
                template: `<mat-form-field>
    <input matInput [formControl]="form.controls['decimalValue']" placeholder="Decimal value" value="" type="number">
</mat-form-field>
`,
                styles: [``]
            },] },
];
/** @nocollapse */
DecimalValueComponent.ctorParameters = () => [
    { type: FormBuilder, decorators: [{ type: Inject, args: [FormBuilder,] }] }
];
DecimalValueComponent.propDecorators = {
    formGroup: [{ type: Input }]
};

// https://stackoverflow.com/questions/45661010/dynamic-nested-reactive-form-expressionchangedafterithasbeencheckederror
const resolvedPromise$6 = Promise.resolve(null);
class IntegerValueComponent {
    constructor(fb) {
        this.fb = fb;
        this.type = KnoraConstants.IntValue;
    }
    ngOnInit() {
        this.form = this.fb.group({
            integerValue: [null, Validators.compose([Validators.required, Validators.pattern(/^-?\d+$/)])] // only allow for integer values (no fractions)
        });
        resolvedPromise$6.then(() => {
            // add form to the parent form group
            this.formGroup.addControl('propValue', this.form);
        });
    }
    ngOnDestroy() {
        // remove form from the parent form group
        resolvedPromise$6.then(() => {
            this.formGroup.removeControl('propValue');
        });
    }
    getValue() {
        return new ValueLiteral(String(this.form.value.integerValue), KnoraConstants.xsdInteger);
    }
}
IntegerValueComponent.decorators = [
    { type: Component, args: [{
                selector: 'integer-value',
                template: `<mat-form-field>
    <input matInput [formControl]="form.controls['integerValue']" placeholder="Integer value" value="" type="number">
</mat-form-field>
`,
                styles: [``]
            },] },
];
/** @nocollapse */
IntegerValueComponent.ctorParameters = () => [
    { type: FormBuilder, decorators: [{ type: Inject, args: [FormBuilder,] }] }
];
IntegerValueComponent.propDecorators = {
    formGroup: [{ type: Input }]
};

const jsonld = require('jsonld');
// https://stackoverflow.com/questions/45661010/dynamic-nested-reactive-form-expressionchangedafterithasbeencheckederror
const resolvedPromise$7 = Promise.resolve(null);
class LinkValueComponent {
    constructor(fb, _searchService, _cacheService) {
        this.fb = fb;
        this._searchService = _searchService;
        this._cacheService = _cacheService;
        this.type = KnoraConstants.LinkValue;
    }
    set restrictResourceClass(value) {
        this._restrictToResourceClass = value;
    }
    get restrictResourceClass() {
        return this._restrictToResourceClass;
    }
    /**
     * Displays a selected resource using its label.
     *
     * @param resource the resource to be displayed (or no selection yet).
     * @returns
     */
    displayResource(resource) {
        // null is the initial value (no selection yet)
        if (resource !== null) {
            return resource.label;
        }
    }
    /**
     * Search for resources whose labels contain the given search term, restricting to to the given properties object constraint.
     *
     * @param searchTerm
     */
    searchByLabel(searchTerm) {
        // at least 3 characters are required
        if (searchTerm.length >= 3) {
            this._searchService.searchByLabel(searchTerm, this._restrictToResourceClass).subscribe((result) => {
                const promises = jsonld.promises;
                // compact JSON-LD using an empty context: expands all Iris
                const promise = promises.compact(result.body, {});
                promise.then((compacted) => {
                    const resourceSeq = ConvertJSONLD.createReadResourcesSequenceFromJsonLD(compacted);
                    this.resources = resourceSeq.resources;
                }, function (err) {
                    console.log('JSONLD of full resource request could not be expanded:' + err);
                });
            });
        }
        else {
            // clear selection
            this.resources = undefined;
        }
    }
    /**
     * Checks that the selection is a [[ReadResource]].
     *
     * Surprisingly, [null] has to be returned if the value is valid: https://angular.io/guide/form-validation#custom-validators
     *
     * @param the form element whose value has to be checked.
     * @returns
     */
    validateResource(c) {
        const isValidResource = (c.value instanceof ReadResource);
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
    }
    ngOnInit() {
        this.form = this.fb.group({
            resource: [null, Validators.compose([
                    Validators.required,
                    this.validateResource
                ])]
        });
        this.form.valueChanges.subscribe((data) => {
            this.searchByLabel(data.resource);
        });
        resolvedPromise$7.then(() => {
            // add form to the parent form group
            this.formGroup.addControl('propValue', this.form);
        });
    }
    ngOnDestroy() {
        // remove form from the parent form group
        resolvedPromise$7.then(() => {
            this.formGroup.removeControl('propValue');
        });
    }
    getValue() {
        return new IRI(this.form.value.resource.id);
    }
}
LinkValueComponent.decorators = [
    { type: Component, args: [{
                selector: 'link-value',
                template: `<mat-form-field>
    <input matInput placeholder="resource" aria-label="resource" [matAutocomplete]="auto" [formControl]="form.controls['resource']">
    <mat-autocomplete #auto="matAutocomplete" [displayWith]="displayResource">
        <mat-option *ngFor="let res of resources" [value]="res">
            {{res?.label}}
        </mat-option>
    </mat-autocomplete>
</mat-form-field>
`,
                styles: [``]
            },] },
];
/** @nocollapse */
LinkValueComponent.ctorParameters = () => [
    { type: FormBuilder, decorators: [{ type: Inject, args: [FormBuilder,] }] },
    { type: SearchService },
    { type: OntologyCacheService }
];
LinkValueComponent.propDecorators = {
    formGroup: [{ type: Input }],
    restrictResourceClass: [{ type: Input }]
};

// https://stackoverflow.com/questions/45661010/dynamic-nested-reactive-form-expressionchangedafterithasbeencheckederror
const resolvedPromise$8 = Promise.resolve(null);
class TextValueComponent {
    constructor(fb) {
        this.fb = fb;
        this.type = KnoraConstants.TextValue;
    }
    ngOnInit() {
        this.form = this.fb.group({
            textValue: [null, Validators.required]
        });
        resolvedPromise$8.then(() => {
            // add form to the parent form group
            this.formGroup.addControl('propValue', this.form);
        });
    }
    ngOnDestroy() {
        // remove form from the parent form group
        resolvedPromise$8.then(() => {
            this.formGroup.removeControl('propValue');
        });
    }
    getValue() {
        return new ValueLiteral(String(this.form.value.textValue), KnoraConstants.xsdString);
    }
}
TextValueComponent.decorators = [
    { type: Component, args: [{
                selector: 'text-value',
                template: `<mat-form-field>
    <input matInput [formControl]="form.controls['textValue']" placeholder="text value" value="">
</mat-form-field>
`,
                styles: [``]
            },] },
];
/** @nocollapse */
TextValueComponent.ctorParameters = () => [
    { type: FormBuilder, decorators: [{ type: Inject, args: [FormBuilder,] }] }
];
TextValueComponent.propDecorators = {
    formGroup: [{ type: Input }]
};

// https://stackoverflow.com/questions/45661010/dynamic-nested-reactive-form-expressionchangedafterithasbeencheckederror
const resolvedPromise$9 = Promise.resolve(null);
class UriValueComponent {
    constructor(fb) {
        this.fb = fb;
        this.type = KnoraConstants.UriValue;
    }
    ngOnInit() {
        this.form = this.fb.group({
            uriValue: [null, Validators.compose([Validators.required, Validators.pattern(Utils.RegexUrl)])]
        });
        resolvedPromise$9.then(() => {
            // add form to the parent form group
            this.formGroup.addControl('propValue', this.form);
        });
    }
    ngOnDestroy() {
        // remove form from the parent form group
        resolvedPromise$9.then(() => {
            this.formGroup.removeControl('propValue');
        });
    }
    getValue() {
        return new ValueLiteral(String(this.form.value.uriValue), KnoraConstants.xsdUri);
    }
}
UriValueComponent.decorators = [
    { type: Component, args: [{
                selector: 'uri-value',
                template: `<mat-form-field>
    <input matInput [formControl]="form.controls['uriValue']" placeholder="URI" value="">
</mat-form-field>
`,
                styles: [``]
            },] },
];
/** @nocollapse */
UriValueComponent.ctorParameters = () => [
    { type: FormBuilder, decorators: [{ type: Inject, args: [FormBuilder,] }] }
];
UriValueComponent.propDecorators = {
    formGroup: [{ type: Input }]
};

class KuiSearchModule {
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

/*
 * Public API Surface of search
 */

/**
 * Generated bundle index. Do not edit.
 */

export { SearchComponent, SearchPanelComponent, FulltextSearchComponent, ExtendedSearchComponent, SelectOntologyComponent, SelectPropertyComponent, SpecifyPropertyValueComponent, BooleanValueComponent, DateValueComponent, HeaderComponent, DecimalValueComponent, IntegerValueComponent, LinkValueComponent, TextValueComponent, UriValueComponent, SelectResourceClassComponent, KuiSearchModule };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia25vcmEtc2VhcmNoLmpzLm1hcCIsInNvdXJjZXMiOlsibmc6Ly9Aa25vcmEvc2VhcmNoL2xpYi9zZWFyY2guY29tcG9uZW50LnRzIiwibmc6Ly9Aa25vcmEvc2VhcmNoL2xpYi9zZWFyY2gtcGFuZWwvc2VhcmNoLXBhbmVsLmNvbXBvbmVudC50cyIsIm5nOi8vQGtub3JhL3NlYXJjaC9saWIvZnVsbHRleHQtc2VhcmNoL2Z1bGx0ZXh0LXNlYXJjaC5jb21wb25lbnQudHMiLCJuZzovL0Brbm9yYS9zZWFyY2gvbGliL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3QtcmVzb3VyY2UtY2xhc3Mvc2VsZWN0LXJlc291cmNlLWNsYXNzLmNvbXBvbmVudC50cyIsIm5nOi8vQGtub3JhL3NlYXJjaC9saWIvZXh0ZW5kZWQtc2VhcmNoL2V4dGVuZGVkLXNlYXJjaC5jb21wb25lbnQudHMiLCJuZzovL0Brbm9yYS9zZWFyY2gvbGliL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3Qtb250b2xvZ3kvc2VsZWN0LW9udG9sb2d5LmNvbXBvbmVudC50cyIsIm5nOi8vQGtub3JhL3NlYXJjaC9saWIvZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1wcm9wZXJ0eS9zcGVjaWZ5LXByb3BlcnR5LXZhbHVlL3NwZWNpZnktcHJvcGVydHktdmFsdWUuY29tcG9uZW50LnRzIiwibmc6Ly9Aa25vcmEvc2VhcmNoL2xpYi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXByb3BlcnR5L3NlbGVjdC1wcm9wZXJ0eS5jb21wb25lbnQudHMiLCJuZzovL0Brbm9yYS9zZWFyY2gvbGliL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3QtcHJvcGVydHkvc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZS9ib29sZWFuLXZhbHVlL2Jvb2xlYW4tdmFsdWUuY29tcG9uZW50LnRzIiwibmc6Ly9Aa25vcmEvc2VhcmNoL2xpYi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXByb3BlcnR5L3NwZWNpZnktcHJvcGVydHktdmFsdWUvZGF0ZS12YWx1ZS9oZWFkZXItY2FsZW5kYXIvaGVhZGVyLWNhbGVuZGFyLmNvbXBvbmVudC50cyIsIm5nOi8vQGtub3JhL3NlYXJjaC9saWIvZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1wcm9wZXJ0eS9zcGVjaWZ5LXByb3BlcnR5LXZhbHVlL2RhdGUtdmFsdWUvZGF0ZS12YWx1ZS5jb21wb25lbnQudHMiLCJuZzovL0Brbm9yYS9zZWFyY2gvbGliL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3QtcHJvcGVydHkvc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZS9kZWNpbWFsLXZhbHVlL2RlY2ltYWwtdmFsdWUuY29tcG9uZW50LnRzIiwibmc6Ly9Aa25vcmEvc2VhcmNoL2xpYi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXByb3BlcnR5L3NwZWNpZnktcHJvcGVydHktdmFsdWUvaW50ZWdlci12YWx1ZS9pbnRlZ2VyLXZhbHVlLmNvbXBvbmVudC50cyIsIm5nOi8vQGtub3JhL3NlYXJjaC9saWIvZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1wcm9wZXJ0eS9zcGVjaWZ5LXByb3BlcnR5LXZhbHVlL2xpbmstdmFsdWUvbGluay12YWx1ZS5jb21wb25lbnQudHMiLCJuZzovL0Brbm9yYS9zZWFyY2gvbGliL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3QtcHJvcGVydHkvc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZS90ZXh0LXZhbHVlL3RleHQtdmFsdWUuY29tcG9uZW50LnRzIiwibmc6Ly9Aa25vcmEvc2VhcmNoL2xpYi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXByb3BlcnR5L3NwZWNpZnktcHJvcGVydHktdmFsdWUvdXJpLXZhbHVlL3VyaS12YWx1ZS5jb21wb25lbnQudHMiLCJuZzovL0Brbm9yYS9zZWFyY2gvbGliL3NlYXJjaC5tb2R1bGUudHMiLCJuZzovL0Brbm9yYS9zZWFyY2gvcHVibGljX2FwaS50cyIsIm5nOi8vQGtub3JhL3NlYXJjaC9rbm9yYS1zZWFyY2gudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBJbnB1dCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZSwgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7XG4gICAgYW5pbWF0ZSxcbiAgICBzdGF0ZSxcbiAgICBzdHlsZSxcbiAgICB0cmFuc2l0aW9uLFxuICAgIHRyaWdnZXJcbn0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAna3VpLXNlYXJjaCcsXG4gICAgdGVtcGxhdGU6IGA8ZGl2IGNsYXNzPVwic2VhcmNoLWJhci1lbGVtZW50c1wiPlxuXG4gICAgPCEtLSB0aGUgbmV4dCBlbGVtZW50IC0gZGl2LmV4dGVuZGVkLXNlYXJjaC1wYW5lbCAtIGlzIGEgaGlkZGVuIGRyb3Bkb3duIGZpbHRlciBtZW51IC0tPlxuXG4gICAgPGRpdiBjbGFzcz1cInNlYXJjaC1wYW5lbFwiIFtjbGFzcy5hY3RpdmVdPVwic2VhcmNoUGFuZWxGb2N1c1wiPlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cInByZWZpeFwiIChjbGljayk9XCJkb1NlYXJjaChzZWFyY2gpXCI+XG4gICAgICAgICAgICAgICAgPG1hdC1pY29uPnNlYXJjaDwvbWF0LWljb24+XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBjbGFzcz1cImlucHV0LWZpZWxkXCI+XG4gICAgICAgICAgICA8aW5wdXQgI3NlYXJjaCBhdXRvY29tcGxldGU9XCJvZmZcIiB0eXBlPVwic2VhcmNoXCIgW3BsYWNlaG9sZGVyXT1cInNlYXJjaExhYmVsXCIgWyhuZ01vZGVsKV09XCJzZWFyY2hRdWVyeVwiIG5hbWU9XCJzZWFyY2hcIiAoa2V5dXAuZXNjKT1cInJlc2V0U2VhcmNoKHNlYXJjaClcIiAoa2V5dXApPVwib25LZXkoc2VhcmNoLCAkZXZlbnQpXCIgKGNsaWNrKT1cInNldEZvY3VzKClcIiAoZm9jdXMpPVwidG9nZ2xlTWVudSgnc2ltcGxlU2VhcmNoJylcIiBbZGlzYWJsZWRdPVwiZm9jdXNPbkV4dGVuZGVkID09PSAnYWN0aXZlJ1wiIC8+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDwhLS0gc3dpdGNoIGJ1dHRvbjogb24gc29tZSBmb2N1cyB3ZSBuZWVkIGEgY2xvc2UgYnV0dG9uIGZvciB0aGUgc2ltcGxlIG9yIGV4dGVuZGVkIHBhbmVsIC0tPlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cInN1ZmZpeFwiICpuZ0lmPVwiZm9jdXNPblNpbXBsZSA9PT0gJ2FjdGl2ZSdcIiAoY2xpY2spPVwicmVzZXRTZWFyY2goc2VhcmNoKVwiPlxuICAgICAgICAgICAgICAgIDxtYXQtaWNvbj5jbG9zZTwvbWF0LWljb24+XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJzdWZmaXhcIiAqbmdJZj1cImZvY3VzT25TaW1wbGUgPT09ICdpbmFjdGl2ZSdcIj5cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8IS0tIHRoZSBzZWFyY2ggcGFuZWwgaGFzIHR3byBcImRyb3Bkb3duXCIgbWVudXM6IG9uZSBmb3Igc2ltcGxlIHNlYXJjaCBhbmQgYW5vdGhlciBvbmUgZm9yIHRoZSBleHRlbmRlZCBzZWFyY2ggLS0+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJrdWktbWVudSBzaW1wbGUtc2VhcmNoXCIgW0BzaW1wbGVTZWFyY2hNZW51XT1cImZvY3VzT25TaW1wbGVcIiAqbmdJZj1cInNob3dTaW1wbGVTZWFyY2hcIj5cbiAgICAgICAgICAgIDxtYXQtbGlzdCBjbGFzcz1cImt1aS1wcmV2aW91cy1zZWFyY2gtbGlzdFwiPlxuICAgICAgICAgICAgICAgIDxtYXQtbGlzdC1pdGVtICpuZ0Zvcj1cImxldCBpdGVtIG9mIHByZXZTZWFyY2ggfCBrdWlSZXZlcnNlOyBsZXQgaT1pbmRleFwiPlxuICAgICAgICAgICAgICAgICAgICA8aDQgbWF0LWxpbmUgKm5nSWY9XCJpPDEwXCIgKGNsaWNrKT1cImRvUHJldlNlYXJjaChpdGVtKVwiPnt7aXRlbX19PC9oND5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBtYXQtaWNvbi1idXR0b24gKGNsaWNrKT1cInJlc2V0UHJldlNlYXJjaChpdGVtKVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPG1hdC1pY29uIGFyaWEtbGFiZWw9XCJjbG9zZVwiPmNsb3NlPC9tYXQtaWNvbj5cbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9tYXQtbGlzdC1pdGVtPlxuICAgICAgICAgICAgPC9tYXQtbGlzdD5cbiAgICAgICAgICAgIDxidXR0b24gbWF0LXN0cm9rZWQtYnV0dG9uIGNvbG9yPVwiYWNjZW50XCIgY2xhc3M9XCJyaWdodFwiIChjbGljayk9XCJyZXNldFByZXZTZWFyY2goKVwiICpuZ0lmPVwicHJldlNlYXJjaFwiPkNsZWFyPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgY2xhc3M9XCJrdWktbWVudSBleHRlbmRlZC1zZWFyY2hcIiBbQGV4dGVuZGVkU2VhcmNoTWVudV09XCJmb2N1c09uRXh0ZW5kZWRcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJrdWktbWVudS1oZWFkZXJcIj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImt1aS1tZW51LXRpdGxlXCI+XG4gICAgICAgICAgICAgICAgICAgIDxoND5BZHZhbmNlZCBzZWFyY2g8L2g0PlxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImt1aS1tZW51LWFjdGlvblwiPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIG1hdC1pY29uLWJ1dHRvbiAoY2xpY2spPVwidG9nZ2xlTWVudSgnZXh0ZW5kZWRTZWFyY2gnKVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPG1hdC1pY29uPmNsb3NlPC9tYXQtaWNvbj5cbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZXh0ZW5kZWQtc2VhcmNoLWJveFwiPlxuICAgICAgICAgICAgICAgIDxrdWktZXh0ZW5kZWQtc2VhcmNoIFtyb3V0ZV09XCJyb3V0ZVwiICh0b2dnbGVFeHRlbmRlZFNlYXJjaEZvcm0pPVwidG9nZ2xlTWVudSgnZXh0ZW5kZWRTZWFyY2gnKVwiPjwva3VpLWV4dGVuZGVkLXNlYXJjaD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cblxuICAgIDwhLS0gRXh0ZW5kZWQgc2VhcmNoIGJ1dHRvbiB0byBkaXNwbGF5IHRoZSBleHRlbmRlZCBzZWFyY2ggZm9ybSBpbiB0aGUgc2VhcmNoIHBhbmVsIC0tPlxuICAgIDxidXR0b24gbWF0LWJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY29sb3I9XCJwcmltYXJ5XCIgY2xhc3M9XCJhZHZhbmNlZC1zZWFyY2gtYnV0dG9uXCIgKGNsaWNrKT1cInRvZ2dsZU1lbnUoJ2V4dGVuZGVkU2VhcmNoJylcIj5cbiAgICAgICAgYWR2YW5jZWRcbiAgICA8L2J1dHRvbj5cblxuPC9kaXY+YCxcbiAgICBzdHlsZXM6IFtgaW5wdXRbdHlwZT1zZWFyY2hdOjotd2Via2l0LXNlYXJjaC1jYW5jZWwtYnV0dG9uLGlucHV0W3R5cGU9c2VhcmNoXTo6LXdlYmtpdC1zZWFyY2gtZGVjb3JhdGlvbixpbnB1dFt0eXBlPXNlYXJjaF06Oi13ZWJraXQtc2VhcmNoLXJlc3VsdHMtYnV0dG9uLGlucHV0W3R5cGU9c2VhcmNoXTo6LXdlYmtpdC1zZWFyY2gtcmVzdWx0cy1kZWNvcmF0aW9ue2Rpc3BsYXk6bm9uZX1pbnB1dFt0eXBlPXNlYXJjaF17LW1vei1hcHBlYXJhbmNlOm5vbmU7LXdlYmtpdC1hcHBlYXJhbmNlOm5vbmV9LmNlbnRlcntkaXNwbGF5OmJsb2NrO21hcmdpbi1sZWZ0OmF1dG87bWFyZ2luLXJpZ2h0OmF1dG99LmNsb3Nle3JpZ2h0OjEycHh9LmV4dGVuZGVkLXNlYXJjaC1ib3h7bWFyZ2luOjEycHh9LmFkdmFuY2VkLXNlYXJjaC1idXR0b257bWFyZ2luLWxlZnQ6MTBweH0uZnVsbC13aWR0aHt3aWR0aDoxMDAlfS5oaWRle2Rpc3BsYXk6bm9uZX0uaW5hY3RpdmUsLm11dGV7Y29sb3I6IzdhN2E3YX0uc2VhcmNoLXBhbmVse2JhY2tncm91bmQtY29sb3I6I2Y5ZjlmOTtib3JkZXItcmFkaXVzOjRweDtkaXNwbGF5OmlubGluZS1mbGV4O2hlaWdodDo0MHB4O3Bvc2l0aW9uOnJlbGF0aXZlO3dpZHRoOjY4MHB4O3otaW5kZXg6MTB9LnNlYXJjaC1wYW5lbDpob3Zlcntib3gtc2hhZG93OjAgMXB4IDNweCByZ2JhKDAsMCwwLC41KX0uc2VhcmNoLXBhbmVsIGRpdi5pbnB1dC1maWVsZHtmbGV4OjF9LnNlYXJjaC1wYW5lbCBkaXYuaW5wdXQtZmllbGQgaW5wdXR7Ym9yZGVyLXN0eWxlOm5vbmU7Zm9udC1zaXplOjE0cHQ7aGVpZ2h0OjM4cHg7cG9zaXRpb246YWJzb2x1dGU7d2lkdGg6Y2FsYygxMDAlIC0gODBweCl9LnNlYXJjaC1wYW5lbCBkaXYuaW5wdXQtZmllbGQgaW5wdXQ6YWN0aXZlLC5zZWFyY2gtcGFuZWwgZGl2LmlucHV0LWZpZWxkIGlucHV0OmZvY3Vze291dGxpbmU6MH0uc2VhcmNoLXBhbmVsIGRpdiAucHJlZml4LC5zZWFyY2gtcGFuZWwgZGl2IC5zdWZmaXh7YmFja2dyb3VuZC1jb2xvcjojZmZmO2JvcmRlci1yYWRpdXM6M3B4O2JvcmRlci1zdHlsZTpub25lO2NvbG9yOnJnYmEoNDEsNDEsNDEsLjQpO2N1cnNvcjpwb2ludGVyO2hlaWdodDozOHB4O291dGxpbmU6MDtwb3NpdGlvbjpyZWxhdGl2ZTt3aWR0aDo0MHB4fS5zZWFyY2gtcGFuZWwgZGl2IC5wcmVmaXg6YWN0aXZlLC5zZWFyY2gtcGFuZWwgZGl2IC5zdWZmaXg6YWN0aXZle2NvbG9yOiM1MTUxNTF9LnNlYXJjaC1wYW5lbC5hY3RpdmV7Ym94LXNoYWRvdzowIDFweCAzcHggcmdiYSgwLDAsMCwuNSl9Lmt1aS1tZW51e2JveC1zaGFkb3c6MCAzcHggNXB4IC0xcHggcmdiYSgxMSwxMSwxMSwuMiksMCA2cHggMTBweCAwIHJnYmEoMTEsMTEsMTEsLjE0KSwwIDFweCAxOHB4IDAgcmdiYSgxMSwxMSwxMSwuMTIpO2JhY2tncm91bmQtY29sb3I6I2Y5ZjlmOTtib3JkZXItcmFkaXVzOjRweDtwb3NpdGlvbjphYnNvbHV0ZX0ua3VpLW1lbnUgLmt1aS1tZW51LWhlYWRlcntiYWNrZ3JvdW5kLWNvbG9yOiNmOWY5Zjk7Ym9yZGVyLXRvcC1sZWZ0LXJhZGl1czo0cHg7Ym9yZGVyLXRvcC1yaWdodC1yYWRpdXM6NHB4O2Rpc3BsYXk6aW5saW5lLWJsb2NrO2hlaWdodDo0OHB4O3dpZHRoOjEwMCV9Lmt1aS1tZW51IC5rdWktbWVudS1oZWFkZXIgLmt1aS1tZW51LXRpdGxle2Zsb2F0OmxlZnQ7Zm9udC1zaXplOjE0cHg7Zm9udC13ZWlnaHQ6NDAwO21hcmdpbi10b3A6NHB4O3BhZGRpbmc6MTJweH0ua3VpLW1lbnUgLmt1aS1tZW51LWhlYWRlciAua3VpLW1lbnUtYWN0aW9ue2Zsb2F0OnJpZ2h0O21hcmdpbjo0cHh9Lmt1aS1tZW51LmV4dGVuZGVkLXNlYXJjaCwua3VpLW1lbnUuc2ltcGxlLXNlYXJjaHttaW4taGVpZ2h0OjY4MHB4O3dpZHRoOjY4MHB4fS5rdWktbWVudS5zaW1wbGUtc2VhcmNoe3BhZGRpbmctdG9wOjYwcHg7ei1pbmRleDotMX0ua3VpLW1lbnUuc2ltcGxlLXNlYXJjaCAua3VpLXByZXZpb3VzLXNlYXJjaC1saXN0IC5tYXQtbGlzdC1pdGVte2N1cnNvcjpwb2ludGVyfS5rdWktbWVudS5zaW1wbGUtc2VhcmNoIC5rdWktcHJldmlvdXMtc2VhcmNoLWxpc3QgLm1hdC1saXN0LWl0ZW06aG92ZXJ7YmFja2dyb3VuZC1jb2xvcjojZjlmOWY5fS5rdWktbWVudS5zaW1wbGUtc2VhcmNoIC5rdWktcHJldmlvdXMtc2VhcmNoLWxpc3QgLm1hdC1saXN0LWl0ZW06aG92ZXIgbWF0LWljb257ZGlzcGxheTpibG9ja30ua3VpLW1lbnUuc2ltcGxlLXNlYXJjaCAua3VpLXByZXZpb3VzLXNlYXJjaC1saXN0IC5tYXQtbGlzdC1pdGVtIG1hdC1pY29ue2Rpc3BsYXk6bm9uZX0ua3VpLW1lbnUuc2ltcGxlLXNlYXJjaCAucmlnaHR7bWFyZ2luLXRvcDoxMnB4O21hcmdpbi1sZWZ0OjE2cHh9Lmt1aS1tZW51LmV4dGVuZGVkLXNlYXJjaHt6LWluZGV4OjIwfS5zZWFyY2gtYmFyLWVsZW1lbnRze2Rpc3BsYXk6ZmxleH0uc2hvd3tkaXNwbGF5OmJsb2NrfUBtZWRpYSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6MTAyNHB4KXsuc2VhcmNoLXBhbmVse3dpZHRoOjQ4MHB4fS5zZWFyY2gtcGFuZWwgZGl2LmlucHV0LWZpZWxkIGlucHV0e3dpZHRoOmNhbGMoNDgwcHggLSA4MHB4KX0ua3VpLW1lbnUuZXh0ZW5kZWQtc2VhcmNoLC5rdWktbWVudS5zaW1wbGUtc2VhcmNoe3dpZHRoOjQ4MHB4fX1AbWVkaWEgc2NyZWVuIGFuZCAobWF4LXdpZHRoOjc2OHB4KXsuc2VhcmNoLXBhbmVse3dpZHRoOmNhbGMoNDgwcHggLSAxNjBweCl9LnNlYXJjaC1wYW5lbCBkaXYuaW5wdXQtZmllbGQgaW5wdXR7d2lkdGg6Y2FsYyg0ODBweCAtIDE2MHB4IC0gODBweCl9Lmt1aS1tZW51LmV4dGVuZGVkLXNlYXJjaCwua3VpLW1lbnUuc2ltcGxlLXNlYXJjaHt3aWR0aDpjYWxjKDQ4MHB4IC0gODBweCl9fWBdLFxuICAgIGFuaW1hdGlvbnM6IFtcbiAgICAgICAgdHJpZ2dlcignc2ltcGxlU2VhcmNoTWVudScsXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgc3RhdGUoJ2luYWN0aXZlJywgc3R5bGUoeyBkaXNwbGF5OiAnbm9uZScgfSkpLFxuICAgICAgICAgICAgICAgIHN0YXRlKCdhY3RpdmUnLCBzdHlsZSh7IGRpc3BsYXk6ICdibG9jaycgfSkpLFxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb24oJ2luYWN0aXZlID0+IHRydWUnLCBhbmltYXRlKCcxMDBtcyBlYXNlLWluJykpLFxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb24oJ3RydWUgPT4gaW5hY3RpdmUnLCBhbmltYXRlKCcxMDBtcyBlYXNlLW91dCcpKVxuICAgICAgICAgICAgXVxuICAgICAgICApLFxuICAgICAgICB0cmlnZ2VyKCdleHRlbmRlZFNlYXJjaE1lbnUnLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgIHN0YXRlKCdpbmFjdGl2ZScsIHN0eWxlKHsgZGlzcGxheTogJ25vbmUnIH0pKSxcbiAgICAgICAgICAgICAgICBzdGF0ZSgnYWN0aXZlJywgc3R5bGUoeyBkaXNwbGF5OiAnYmxvY2snIH0pKSxcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uKCdpbmFjdGl2ZSA9PiB0cnVlJywgYW5pbWF0ZSgnMTAwbXMgZWFzZS1pbicpKSxcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uKCd0cnVlID0+IGluYWN0aXZlJywgYW5pbWF0ZSgnMTAwbXMgZWFzZS1vdXQnKSlcbiAgICAgICAgICAgIF1cbiAgICAgICAgKSxcbiAgICBdXG59KVxuXG4vKipcbiAqIENvbnRhaW5zIG1ldGhvZHMgdG8gcmVhbGlzZSwgcmVzZXQgbmV3IG9yIHByZXZpb3VzIHNpbXBsZSBzZWFyY2hlcy5cbiAqL1xuZXhwb3J0IGNsYXNzIFNlYXJjaENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgICBASW5wdXQoKSByb3V0ZTogc3RyaW5nID0gJy9zZWFyY2gnO1xuXG4gICAgc2VhcmNoUXVlcnk6IHN0cmluZztcblxuICAgIHNlYXJjaFBhbmVsRm9jdXM6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIHByZXZTZWFyY2g6IHN0cmluZ1tdID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncHJldlNlYXJjaCcpKTtcblxuICAgIGZvY3VzT25TaW1wbGU6IHN0cmluZyA9ICdpbmFjdGl2ZSc7XG4gICAgZm9jdXNPbkV4dGVuZGVkOiBzdHJpbmcgPSAnaW5hY3RpdmUnO1xuXG4gICAgc2VhcmNoTGFiZWw6IHN0cmluZyA9ICdTZWFyY2gnO1xuXG4gICAgc2hvd1NpbXBsZVNlYXJjaDogYm9vbGVhbiA9IHRydWU7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9yb3V0ZTogQWN0aXZhdGVkUm91dGUsXG4gICAgICAgIHByaXZhdGUgX3JvdXRlcjogUm91dGVyLFxuICAgICAgICBwcml2YXRlIF9lbGVSZWY6IEVsZW1lbnRSZWYpIHtcblxuICAgIH1cblxuICAgIG5nT25Jbml0KCkge1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBpZ25vcmVcbiAgICAgKiBEbyBzZWFyY2ggb24gRW50ZXIgY2xpY2ssIHJlc2V0IHNlYXJjaCBvbiBFc2NhcGVcbiAgICAgKiBAcGFyYW0gc2VhcmNoX2VsZVxuICAgICAqIEBwYXJhbSBldmVudFxuICAgICAqIEByZXR1cm5zIHZvaWRcbiAgICAgKi9cbiAgICBvbktleShzZWFyY2hfZWxlOiBIVE1MRWxlbWVudCwgZXZlbnQpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5mb2N1c09uU2ltcGxlID0gJ2FjdGl2ZSc7XG4gICAgICAgIHRoaXMucHJldlNlYXJjaCA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3ByZXZTZWFyY2gnKSk7XG4gICAgICAgIGlmICh0aGlzLnNlYXJjaFF1ZXJ5ICYmIChldmVudC5rZXkgPT09ICdFbnRlcicgfHwgZXZlbnQua2V5Q29kZSA9PT0gMTMgfHwgZXZlbnQud2hpY2ggPT09IDEzKSkge1xuICAgICAgICAgICAgdGhpcy5kb1NlYXJjaChzZWFyY2hfZWxlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXZlbnQua2V5ID09PSAnRXNjYXBlJyB8fCBldmVudC5rZXlDb2RlID09PSAyNyB8fCBldmVudC53aGljaCA9PT0gMjcpIHtcbiAgICAgICAgICAgIHRoaXMucmVzZXRTZWFyY2goc2VhcmNoX2VsZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZWFsaXNlIGEgc2ltcGxlIHNlYXJjaFxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHNlYXJjaF9lbGVcbiAgICAgKiBAcmV0dXJucyB2b2lkXG4gICAgICovXG4gICAgZG9TZWFyY2goc2VhcmNoX2VsZTogSFRNTEVsZW1lbnQpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuc2VhcmNoUXVlcnkgIT09IHVuZGVmaW5lZCAmJiB0aGlzLnNlYXJjaFF1ZXJ5ICE9PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLnRvZ2dsZU1lbnUoJ3NpbXBsZVNlYXJjaCcpO1xuICAgICAgICAgICAgdGhpcy5fcm91dGVyLm5hdmlnYXRlKFt0aGlzLnJvdXRlICsgJy9mdWxsdGV4dC8nICsgdGhpcy5zZWFyY2hRdWVyeV0pO1xuXG4gICAgICAgICAgICAvLyB0aGlzLl9yb3V0ZXIubmF2aWdhdGUoWycvc2VhcmNoL2Z1bGx0ZXh0LycgKyB0aGlzLnNlYXJjaFF1ZXJ5XSwgeyByZWxhdGl2ZVRvOiB0aGlzLl9yb3V0ZSB9KTtcblxuICAgICAgICAgICAgLy8gcHVzaCB0aGUgc2VhcmNoIHF1ZXJ5IGludG8gdGhlIGxvY2FsIHN0b3JhZ2UgcHJldlNlYXJjaCBhcnJheSAocHJldmlvdXMgc2VhcmNoKVxuICAgICAgICAgICAgLy8gdG8gaGF2ZSBhIGxpc3Qgb2YgcmVjZW50IHNlYXJjaCByZXF1ZXN0c1xuICAgICAgICAgICAgbGV0IGV4aXN0aW5nUHJldlNlYXJjaDogc3RyaW5nW10gPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdwcmV2U2VhcmNoJykpO1xuICAgICAgICAgICAgaWYgKGV4aXN0aW5nUHJldlNlYXJjaCA9PT0gbnVsbCkgeyBleGlzdGluZ1ByZXZTZWFyY2ggPSBbXTsgfVxuICAgICAgICAgICAgbGV0IGk6IG51bWJlciA9IDA7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIGV4aXN0aW5nUHJldlNlYXJjaCkge1xuICAgICAgICAgICAgICAgIC8vIHJlbW92ZSBlbnRyeSwgaWYgZXhpc3RzIGFscmVhZHlcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zZWFyY2hRdWVyeSA9PT0gZW50cnkpIHsgZXhpc3RpbmdQcmV2U2VhcmNoLnNwbGljZShpLCAxKTsgfVxuICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZXhpc3RpbmdQcmV2U2VhcmNoLnB1c2godGhpcy5zZWFyY2hRdWVyeSk7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncHJldlNlYXJjaCcsIEpTT04uc3RyaW5naWZ5KGV4aXN0aW5nUHJldlNlYXJjaCkpO1xuICAgICAgICAgICAgLy8gVE9ETzogc2F2ZSB0aGUgcHJldmlvdXMgc2VhcmNoIHF1ZXJpZXMgc29tZXdoZXJlIGluIHRoZSB1c2VyJ3MgcHJvZmlsZVxuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZWFyY2hfZWxlLmZvY3VzKCk7XG4gICAgICAgICAgICB0aGlzLnByZXZTZWFyY2ggPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdwcmV2U2VhcmNoJykpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVzZXQgdGhlIHNlYXJjaFxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHNlYXJjaF9lbGVcbiAgICAgKiBAcmV0dXJucyB2b2lkXG4gICAgICovXG4gICAgcmVzZXRTZWFyY2goc2VhcmNoX2VsZTogSFRNTEVsZW1lbnQpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zZWFyY2hRdWVyeSA9IG51bGw7XG4gICAgICAgIHNlYXJjaF9lbGUuZm9jdXMoKTtcbiAgICAgICAgdGhpcy5mb2N1c09uU2ltcGxlID0gJ2luYWN0aXZlJztcbiAgICAgICAgdGhpcy5zZWFyY2hQYW5lbEZvY3VzID0gIXRoaXMuc2VhcmNoUGFuZWxGb2N1cztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZWFsaXNlIGEgcHJldmlvdXMgc2VhcmNoXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHF1ZXJ5XG4gICAgICogQHJldHVybnMgdm9pZFxuICAgICAqL1xuICAgIGRvUHJldlNlYXJjaChxdWVyeTogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc2VhcmNoUXVlcnkgPSBxdWVyeTtcbiAgICAgICAgdGhpcy5fcm91dGVyLm5hdmlnYXRlKFt0aGlzLnJvdXRlICsgJy9mdWxsdGV4dC8nICsgcXVlcnldLCB7IHJlbGF0aXZlVG86IHRoaXMuX3JvdXRlIH0pO1xuICAgICAgICB0aGlzLnRvZ2dsZU1lbnUoJ3NpbXBsZVNlYXJjaCcpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlc2V0IHByZXZpb3VzIHNlYXJjaGVzIC0gdGhlIHdob2xlIHByZXZpb3VzIHNlYXJjaCBvciBzcGVjaWZpYyBpdGVtIGJ5IG5hbWVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSB0ZXJtIG9mIHRoZSBzZWFyY2hcbiAgICAgKiBAcmV0dXJucyB2b2lkXG4gICAgICovXG4gICAgcmVzZXRQcmV2U2VhcmNoKG5hbWU6IHN0cmluZyA9IG51bGwpOiB2b2lkIHtcbiAgICAgICAgaWYgKG5hbWUpIHtcbiAgICAgICAgICAgIC8vIGRlbGV0ZSBvbmx5IHRoaXMgaXRlbSB3aXRoIHRoZSBuYW1lIC4uLlxuICAgICAgICAgICAgY29uc3QgaTogbnVtYmVyID0gdGhpcy5wcmV2U2VhcmNoLmluZGV4T2YobmFtZSk7XG4gICAgICAgICAgICB0aGlzLnByZXZTZWFyY2guc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3ByZXZTZWFyY2gnLCBKU09OLnN0cmluZ2lmeSh0aGlzLnByZXZTZWFyY2gpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGRlbGV0ZSB0aGUgd2hvbGUgXCJwcmV2aW91cyBzZWFyY2hcIiBhcnJheVxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ3ByZXZTZWFyY2gnKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnByZXZTZWFyY2ggPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdwcmV2U2VhcmNoJykpO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0IHNpbXBsZSBmb2N1cyB0byBhY3RpdmVcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHZvaWRcbiAgICAgKi9cbiAgICBzZXRGb2N1cygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5wcmV2U2VhcmNoID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncHJldlNlYXJjaCcpKTtcbiAgICAgICAgdGhpcy5mb2N1c09uU2ltcGxlID0gJ2FjdGl2ZSc7XG4gICAgICAgIHRoaXMuc2VhcmNoUGFuZWxGb2N1cyA9ICF0aGlzLnNlYXJjaFBhbmVsRm9jdXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3dpdGNoIGFjY29yZGluZyB0byB0aGUgZm9jdXMgYmV0d2VlbiBzaW1wbGUgb3IgZXh0ZW5kZWQgc2VhcmNoXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAyIGNhc2VzOiBzaW1wbGVTZWFyY2ggb3IgZXh0ZW5kZWRTZWFyY2hcbiAgICAgKiBAcmV0dXJucyB2b2lkXG4gICAgICovXG4gICAgdG9nZ2xlTWVudShuYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgc3dpdGNoIChuYW1lKSB7XG4gICAgICAgICAgICBjYXNlICdzaW1wbGVTZWFyY2gnOlxuICAgICAgICAgICAgICAgIHRoaXMucHJldlNlYXJjaCA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3ByZXZTZWFyY2gnKSk7XG4gICAgICAgICAgICAgICAgdGhpcy5mb2N1c09uU2ltcGxlID0gKHRoaXMuZm9jdXNPblNpbXBsZSA9PT0gJ2FjdGl2ZScgPyAnaW5hY3RpdmUnIDogJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2hvd1NpbXBsZVNlYXJjaCA9IHRydWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdleHRlbmRlZFNlYXJjaCc6XG4gICAgICAgICAgICAgICAgdGhpcy5mb2N1c09uRXh0ZW5kZWQgPSAodGhpcy5mb2N1c09uRXh0ZW5kZWQgPT09ICdhY3RpdmUnID8gJ2luYWN0aXZlJyA6ICdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dTaW1wbGVTZWFyY2ggPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IGFuaW1hdGUsIHN0YXRlLCBzdHlsZSwgdHJhbnNpdGlvbiwgdHJpZ2dlciB9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdrdWktc2VhcmNoLXBhbmVsJyxcbiAgdGVtcGxhdGU6IGA8ZGl2IGNsYXNzPVwia3VpLXNlYXJjaC1wYW5lbFwiPlxuXG4gICAgPGRpdiBjbGFzcz1cImt1aS1zZWFyY2gtYmFyXCI+XG5cbiAgICAgICAgPGRpdiBjbGFzcz1cImZ1bGx0ZXh0LXNlYXJjaFwiPlxuICAgICAgICAgICAgPGt1aS1mdWxsdGV4dC1zZWFyY2ggW3JvdXRlXT1cInJvdXRlXCI+PC9rdWktZnVsbHRleHQtc2VhcmNoPlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8ZGl2ICpuZ0lmPVwic2hvd01lbnVcIiBbQGV4dGVuZGVkU2VhcmNoTWVudV09XCJmb2N1c09uRXh0ZW5kZWRcIiBjbGFzcz1cImt1aS1tZW51IGV4dGVuZGVkLXNlYXJjaFwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImt1aS1tZW51LWhlYWRlclwiPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwia3VpLW1lbnUtdGl0bGVcIj5cbiAgICAgICAgICAgICAgICAgICAgPGg0PkFkdmFuY2VkIHNlYXJjaDwvaDQ+XG4gICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwia3VpLW1lbnUtYWN0aW9uXCI+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gbWF0LWljb24tYnV0dG9uIChjbGljayk9XCJ0b2dnbGVNZW51KClcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxtYXQtaWNvbj5jbG9zZTwvbWF0LWljb24+XG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImV4dGVuZGVkLXNlYXJjaC1ib3hcIj5cbiAgICAgICAgICAgICAgICA8a3VpLWV4dGVuZGVkLXNlYXJjaCBbcm91dGVdPVwicm91dGVcIiAodG9nZ2xlRXh0ZW5kZWRTZWFyY2hGb3JtKT1cInRvZ2dsZU1lbnUoKVwiPjwva3VpLWV4dGVuZGVkLXNlYXJjaD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cblxuICAgIDwvZGl2PlxuXG4gICAgPGRpdiBjbGFzcz1cImFkdmFuY2VkLWJ0blwiPlxuICAgICAgICA8YnV0dG9uIG1hdC1idXR0b24gY29sb3I9XCJwcmltYXJ5XCIgKGNsaWNrKT1cInRvZ2dsZU1lbnUoKVwiPmFkdmFuY2VkPC9idXR0b24+XG4gICAgPC9kaXY+XG5cbjwvZGl2PmAsXG4gIHN0eWxlczogW2AuYWR2YW5jZWQtYnRue21hcmdpbi1sZWZ0OjEwcHh9Lmt1aS1zZWFyY2gtcGFuZWx7ZGlzcGxheTpmbGV4fS5rdWktc2VhcmNoLWJhcntiYWNrZ3JvdW5kLWNvbG9yOiNmOWY5Zjk7Ym9yZGVyLXJhZGl1czo0cHg7ZGlzcGxheTppbmxpbmUtZmxleDtoZWlnaHQ6NDBweDtwb3NpdGlvbjpyZWxhdGl2ZTt6LWluZGV4OjEwfS5rdWktc2VhcmNoLWJhcjpob3Zlcntib3gtc2hhZG93OjAgMXB4IDNweCByZ2JhKDAsMCwwLC41KX0ua3VpLW1lbnV7Ym94LXNoYWRvdzowIDNweCA1cHggLTFweCByZ2JhKDExLDExLDExLC4yKSwwIDZweCAxMHB4IDAgcmdiYSgxMSwxMSwxMSwuMTQpLDAgMXB4IDE4cHggMCByZ2JhKDExLDExLDExLC4xMik7YmFja2dyb3VuZC1jb2xvcjojZjlmOWY5O2JvcmRlci1yYWRpdXM6NHB4O3Bvc2l0aW9uOmFic29sdXRlfS5rdWktbWVudSAua3VpLW1lbnUtaGVhZGVye2JhY2tncm91bmQtY29sb3I6I2Y5ZjlmOTtib3JkZXItdG9wLWxlZnQtcmFkaXVzOjRweDtib3JkZXItdG9wLXJpZ2h0LXJhZGl1czo0cHg7ZGlzcGxheTppbmxpbmUtYmxvY2s7aGVpZ2h0OjQ4cHg7d2lkdGg6MTAwJX0ua3VpLW1lbnUgLmt1aS1tZW51LWhlYWRlciAua3VpLW1lbnUtdGl0bGV7ZmxvYXQ6bGVmdDtmb250LXNpemU6MTRweDtmb250LXdlaWdodDo0MDA7bWFyZ2luLXRvcDo0cHg7cGFkZGluZzoxMnB4fS5rdWktbWVudSAua3VpLW1lbnUtaGVhZGVyIC5rdWktbWVudS1hY3Rpb257ZmxvYXQ6cmlnaHQ7bWFyZ2luOjRweH0ua3VpLW1lbnUuZXh0ZW5kZWQtc2VhcmNoe21pbi1oZWlnaHQ6NjgwcHg7d2lkdGg6NjgwcHg7ei1pbmRleDoyMH0uZXh0ZW5kZWQtc2VhcmNoLWJveHttYXJnaW46MTJweH1AbWVkaWEgc2NyZWVuIGFuZCAobWF4LXdpZHRoOjEwMjRweCl7Lmt1aS1zZWFyY2gtYmFye3dpZHRoOjQ4MHB4fS5rdWktc2VhcmNoLWJhciBkaXYuaW5wdXQtZmllbGQgaW5wdXR7d2lkdGg6Y2FsYyg0ODBweCAtIDgwcHgpfS5mdWxsdGV4dC1zZWFyY2gsLmt1aS1tZW51LmV4dGVuZGVkLXNlYXJjaHt3aWR0aDo0ODBweH19QG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDo3NjhweCl7Lmt1aS1zZWFyY2gtYmFye3dpZHRoOmNhbGMoNDgwcHggLSAxNjBweCl9Lmt1aS1zZWFyY2gtYmFyIGRpdi5pbnB1dC1maWVsZCBpbnB1dHt3aWR0aDpjYWxjKDQ4MHB4IC0gMTYwcHggLSA4MHB4KX0uZnVsbHRleHQtc2VhcmNoLC5rdWktbWVudS5leHRlbmRlZC1zZWFyY2h7d2lkdGg6Y2FsYyg0ODBweCAtIDgwcHgpfX1gXSxcbiAgYW5pbWF0aW9uczogW1xuICAgIHRyaWdnZXIoJ2V4dGVuZGVkU2VhcmNoTWVudScsXG4gICAgICBbXG4gICAgICAgIHN0YXRlKCdpbmFjdGl2ZScsIHN0eWxlKHsgZGlzcGxheTogJ25vbmUnIH0pKSxcbiAgICAgICAgc3RhdGUoJ2FjdGl2ZScsIHN0eWxlKHsgZGlzcGxheTogJ2Jsb2NrJyB9KSksXG4gICAgICAgIHRyYW5zaXRpb24oJ2luYWN0aXZlID0+IGFjdGl2ZScsIGFuaW1hdGUoJzEwMG1zIGVhc2UtaW4nKSksXG4gICAgICAgIHRyYW5zaXRpb24oJ2FjdGl2ZSA9PiBpbmFjdGl2ZScsIGFuaW1hdGUoJzEwMG1zIGVhc2Utb3V0JykpXG4gICAgICBdXG4gICAgKVxuICBdXG59KVxuZXhwb3J0IGNsYXNzIFNlYXJjaFBhbmVsQ29tcG9uZW50IHtcblxuICBASW5wdXQoKSByb3V0ZTogc3RyaW5nID0gJy9zZWFyY2gnO1xuICBzaG93TWVudTogYm9vbGVhbiA9IGZhbHNlO1xuICBmb2N1c09uRXh0ZW5kZWQ6IHN0cmluZyA9ICdpbmFjdGl2ZSc7XG5cbiAgY29uc3RydWN0b3IoKSB7IH1cblxuICAvKipcbiAgICogU2hvdyBvciBoaWRlIHRoZSBleHRlbmRlZCBzZWFyY2ggbWVudVxuICAgKlxuICAgKiBAcmV0dXJucyB2b2lkXG4gICAqL1xuICB0b2dnbGVNZW51KCk6IHZvaWQge1xuICAgIHRoaXMuc2hvd01lbnUgPSAhdGhpcy5zaG93TWVudTtcbiAgICB0aGlzLmZvY3VzT25FeHRlbmRlZCA9ICh0aGlzLmZvY3VzT25FeHRlbmRlZCA9PT0gJ2FjdGl2ZScgPyAnaW5hY3RpdmUnIDogJ2FjdGl2ZScpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBhbmltYXRlLCBzdGF0ZSwgc3R5bGUsIHRyYW5zaXRpb24sIHRyaWdnZXIgfSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbmltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWN0aXZhdGVkUm91dGUsIFJvdXRlciB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAna3VpLWZ1bGx0ZXh0LXNlYXJjaCcsXG4gICAgdGVtcGxhdGU6IGA8ZGl2IGNsYXNzPVwic2VhcmNoLWJhci1lbGVtZW50c1wiPlxuXG4gICAgPGRpdiBjbGFzcz1cImZ1bGx0ZXh0LXNlYXJjaC1iYXJcIiBbY2xhc3MuYWN0aXZlXT1cInNlYXJjaFBhbmVsRm9jdXNcIj5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJwcmVmaXhcIiAoY2xpY2spPVwiZG9TZWFyY2goc2VhcmNoKVwiPlxuICAgICAgICAgICAgICAgIDxtYXQtaWNvbj5zZWFyY2g8L21hdC1pY29uPlxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1maWVsZFwiPlxuICAgICAgICAgICAgPGlucHV0ICNzZWFyY2ggYXV0b2NvbXBsZXRlPVwib2ZmXCIgdHlwZT1cInNlYXJjaFwiIFtwbGFjZWhvbGRlcl09XCJzZWFyY2hMYWJlbFwiIFsobmdNb2RlbCldPVwic2VhcmNoUXVlcnlcIiBuYW1lPVwic2VhcmNoXCIgKGtleXVwLmVzYyk9XCJyZXNldFNlYXJjaChzZWFyY2gpXCIgKGtleXVwKT1cIm9uS2V5KHNlYXJjaCwgJGV2ZW50KVwiIChjbGljayk9XCJzZXRGb2N1cygpXCIgKGZvY3VzKT1cInRvZ2dsZU1lbnUoKVwiIC8+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDwhLS0gc3dpdGNoIGJ1dHRvbjogb24gc29tZSBmb2N1cyB3ZSBuZWVkIGEgY2xvc2UgYnV0dG9uIGZvciB0aGUgc2ltcGxlIC0tPlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cInN1ZmZpeFwiICpuZ0lmPVwiZm9jdXNPblNpbXBsZSA9PT0gJ2FjdGl2ZSdcIiAoY2xpY2spPVwicmVzZXRTZWFyY2goc2VhcmNoKVwiPlxuICAgICAgICAgICAgICAgIDxtYXQtaWNvbj5jbG9zZTwvbWF0LWljb24+XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJzdWZmaXhcIiAqbmdJZj1cImZvY3VzT25TaW1wbGUgPT09ICdpbmFjdGl2ZSdcIj48L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPCEtLSBcImRyb3Bkb3duXCIgbWVudSBmb3Igc2ltcGxlIHNlYXJjaCAtLT5cbiAgICAgICAgPGRpdiBjbGFzcz1cImt1aS1tZW51IHNpbXBsZS1zZWFyY2hcIiBbQGZ1bGx0ZXh0U2VhcmNoTWVudV09XCJmb2N1c09uU2ltcGxlXCIgKm5nSWY9XCJzaG93U2ltcGxlU2VhcmNoXCI+XG4gICAgICAgICAgICA8bWF0LWxpc3QgY2xhc3M9XCJrdWktcHJldmlvdXMtc2VhcmNoLWxpc3RcIj5cbiAgICAgICAgICAgICAgICA8bWF0LWxpc3QtaXRlbSAqbmdGb3I9XCJsZXQgaXRlbSBvZiBwcmV2U2VhcmNoIHwga3VpUmV2ZXJzZTsgbGV0IGk9aW5kZXhcIj5cbiAgICAgICAgICAgICAgICAgICAgPGg0IG1hdC1saW5lICpuZ0lmPVwiaTwxMFwiIChjbGljayk9XCJkb1ByZXZTZWFyY2goaXRlbSlcIj57e2l0ZW19fTwvaDQ+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gbWF0LWljb24tYnV0dG9uIChjbGljayk9XCJyZXNldFByZXZTZWFyY2goaXRlbSlcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxtYXQtaWNvbiBhcmlhLWxhYmVsPVwiY2xvc2VcIj5jbG9zZTwvbWF0LWljb24+XG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvbWF0LWxpc3QtaXRlbT5cbiAgICAgICAgICAgIDwvbWF0LWxpc3Q+XG4gICAgICAgICAgICA8YnV0dG9uIG1hdC1zdHJva2VkLWJ1dHRvbiBjb2xvcj1cImFjY2VudFwiIGNsYXNzPVwicmlnaHRcIiAoY2xpY2spPVwicmVzZXRQcmV2U2VhcmNoKClcIiAqbmdJZj1cInByZXZTZWFyY2hcIj5DbGVhcjwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cblxuICAgIDwvZGl2PlxuPC9kaXY+YCxcbiAgICBzdHlsZXM6IFtgaW5wdXRbdHlwZT1zZWFyY2hdOjotd2Via2l0LXNlYXJjaC1jYW5jZWwtYnV0dG9uLGlucHV0W3R5cGU9c2VhcmNoXTo6LXdlYmtpdC1zZWFyY2gtZGVjb3JhdGlvbixpbnB1dFt0eXBlPXNlYXJjaF06Oi13ZWJraXQtc2VhcmNoLXJlc3VsdHMtYnV0dG9uLGlucHV0W3R5cGU9c2VhcmNoXTo6LXdlYmtpdC1zZWFyY2gtcmVzdWx0cy1kZWNvcmF0aW9ue2Rpc3BsYXk6bm9uZX1pbnB1dFt0eXBlPXNlYXJjaF17LW1vei1hcHBlYXJhbmNlOm5vbmU7LXdlYmtpdC1hcHBlYXJhbmNlOm5vbmV9LmZ1bGwtd2lkdGh7d2lkdGg6MTAwJX0uY2xvc2V7cmlnaHQ6MTJweH0uaGlkZXtkaXNwbGF5Om5vbmV9LnNob3d7ZGlzcGxheTpibG9ja30uc2VhcmNoLWJhci1lbGVtZW50c3tkaXNwbGF5OmZsZXh9LmluYWN0aXZle2NvbG9yOiM3YTdhN2F9LmZ1bGx0ZXh0LXNlYXJjaC1iYXJ7YmFja2dyb3VuZC1jb2xvcjojZjlmOWY5O2JvcmRlci1yYWRpdXM6NHB4O2Rpc3BsYXk6aW5saW5lLWZsZXg7aGVpZ2h0OjQwcHg7cG9zaXRpb246cmVsYXRpdmU7d2lkdGg6NjgwcHg7ei1pbmRleDoxMH0uZnVsbHRleHQtc2VhcmNoLWJhcjpob3Zlcntib3gtc2hhZG93OjAgMXB4IDNweCByZ2JhKDAsMCwwLC41KX0uZnVsbHRleHQtc2VhcmNoLWJhciBkaXYuaW5wdXQtZmllbGR7ZmxleDoxfS5mdWxsdGV4dC1zZWFyY2gtYmFyIGRpdi5pbnB1dC1maWVsZCBpbnB1dHtib3JkZXItc3R5bGU6bm9uZTtmb250LXNpemU6MTRwdDtoZWlnaHQ6MzhweDtwb3NpdGlvbjphYnNvbHV0ZTt3aWR0aDpjYWxjKDEwMCUgLSA4MHB4KX0uZnVsbHRleHQtc2VhcmNoLWJhciBkaXYuaW5wdXQtZmllbGQgaW5wdXQ6YWN0aXZlLC5mdWxsdGV4dC1zZWFyY2gtYmFyIGRpdi5pbnB1dC1maWVsZCBpbnB1dDpmb2N1c3tvdXRsaW5lOjB9LmZ1bGx0ZXh0LXNlYXJjaC1iYXIgZGl2IC5wcmVmaXgsLmZ1bGx0ZXh0LXNlYXJjaC1iYXIgZGl2IC5zdWZmaXh7YmFja2dyb3VuZC1jb2xvcjojZmZmO2JvcmRlci1yYWRpdXM6M3B4O2JvcmRlci1zdHlsZTpub25lO2NvbG9yOnJnYmEoNDEsNDEsNDEsLjQpO2N1cnNvcjpwb2ludGVyO2hlaWdodDozOHB4O291dGxpbmU6MDtwb3NpdGlvbjpyZWxhdGl2ZTt3aWR0aDo0MHB4fS5mdWxsdGV4dC1zZWFyY2gtYmFyIGRpdiAucHJlZml4OmFjdGl2ZSwuZnVsbHRleHQtc2VhcmNoLWJhciBkaXYgLnN1ZmZpeDphY3RpdmV7Y29sb3I6IzUxNTE1MX0uZnVsbHRleHQtc2VhcmNoLWJhciBkaXYuYWN0aXZle2JveC1zaGFkb3c6MCAxcHggM3B4IHJnYmEoMCwwLDAsLjUpfS5rdWktbWVudXtib3gtc2hhZG93OjAgM3B4IDVweCAtMXB4IHJnYmEoMTEsMTEsMTEsLjIpLDAgNnB4IDEwcHggMCByZ2JhKDExLDExLDExLC4xNCksMCAxcHggMThweCAwIHJnYmEoMTEsMTEsMTEsLjEyKTtiYWNrZ3JvdW5kLWNvbG9yOiNmOWY5Zjk7Ym9yZGVyLXJhZGl1czo0cHg7cG9zaXRpb246YWJzb2x1dGV9Lmt1aS1tZW51LnNpbXBsZS1zZWFyY2h7bWluLWhlaWdodDo2ODBweDt3aWR0aDo2ODBweDtwYWRkaW5nLXRvcDo2MHB4O3otaW5kZXg6LTF9Lmt1aS1tZW51LnNpbXBsZS1zZWFyY2ggLmt1aS1wcmV2aW91cy1zZWFyY2gtbGlzdCAubWF0LWxpc3QtaXRlbXtjdXJzb3I6cG9pbnRlcn0ua3VpLW1lbnUuc2ltcGxlLXNlYXJjaCAua3VpLXByZXZpb3VzLXNlYXJjaC1saXN0IC5tYXQtbGlzdC1pdGVtOmhvdmVye2JhY2tncm91bmQtY29sb3I6I2Y5ZjlmOX0ua3VpLW1lbnUuc2ltcGxlLXNlYXJjaCAua3VpLXByZXZpb3VzLXNlYXJjaC1saXN0IC5tYXQtbGlzdC1pdGVtOmhvdmVyIG1hdC1pY29ue2Rpc3BsYXk6YmxvY2t9Lmt1aS1tZW51LnNpbXBsZS1zZWFyY2ggLmt1aS1wcmV2aW91cy1zZWFyY2gtbGlzdCAubWF0LWxpc3QtaXRlbSBtYXQtaWNvbntkaXNwbGF5Om5vbmV9Lmt1aS1tZW51LnNpbXBsZS1zZWFyY2ggLnJpZ2h0e21hcmdpbi10b3A6MTJweDttYXJnaW4tbGVmdDoxNnB4fUBtZWRpYSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6MTAyNHB4KXsuZnVsbHRleHQtc2VhcmNoLWJhcnt3aWR0aDo0ODBweH0uZnVsbHRleHQtc2VhcmNoLWJhciBkaXYuaW5wdXQtZmllbGQgaW5wdXR7d2lkdGg6Y2FsYyg0ODBweCAtIDgwcHgpfS5rdWktbWVudS5zaW1wbGUtc2VhcmNoe3dpZHRoOjQ4MHB4fX1AbWVkaWEgc2NyZWVuIGFuZCAobWF4LXdpZHRoOjc2OHB4KXsuZnVsbHRleHQtc2VhcmNoLWJhcnt3aWR0aDpjYWxjKDQ4MHB4IC0gMTYwcHgpfS5mdWxsdGV4dC1zZWFyY2gtYmFyIGRpdi5pbnB1dC1maWVsZCBpbnB1dHt3aWR0aDpjYWxjKDQ4MHB4IC0gMTYwcHggLSA4MHB4KX0ua3VpLW1lbnUuc2ltcGxlLXNlYXJjaHt3aWR0aDpjYWxjKDQ4MHB4IC0gODBweCl9fWBdLFxuICAgIGFuaW1hdGlvbnM6IFtcbiAgICAgICAgdHJpZ2dlcignZnVsbHRleHRTZWFyY2hNZW51JyxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICBzdGF0ZSgnaW5hY3RpdmUnLCBzdHlsZSh7IGRpc3BsYXk6ICdub25lJyB9KSksXG4gICAgICAgICAgICAgICAgc3RhdGUoJ2FjdGl2ZScsIHN0eWxlKHsgZGlzcGxheTogJ2Jsb2NrJyB9KSksXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbignaW5hY3RpdmUgPT4gYWN0aXZlJywgYW5pbWF0ZSgnMTAwbXMgZWFzZS1pbicpKSxcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uKCdhY3RpdmUgPT4gaW5hY3RpdmUnLCBhbmltYXRlKCcxMDBtcyBlYXNlLW91dCcpKVxuICAgICAgICAgICAgXVxuICAgICAgICApXG4gICAgXVxufSlcbmV4cG9ydCBjbGFzcyBGdWxsdGV4dFNlYXJjaENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgICBASW5wdXQoKSByb3V0ZTogc3RyaW5nID0gJy9zZWFyY2gnO1xuXG4gICAgc2VhcmNoUXVlcnk6IHN0cmluZztcblxuICAgIHNob3dTaW1wbGVTZWFyY2g6IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgc2VhcmNoUGFuZWxGb2N1czogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgcHJldlNlYXJjaDogc3RyaW5nW10gPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdwcmV2U2VhcmNoJykpO1xuXG4gICAgZm9jdXNPblNpbXBsZTogc3RyaW5nID0gJ2luYWN0aXZlJztcblxuICAgIHNlYXJjaExhYmVsOiBzdHJpbmcgPSAnU2VhcmNoJztcblxuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBfcm91dGU6IEFjdGl2YXRlZFJvdXRlLFxuICAgICAgICBwcml2YXRlIF9yb3V0ZXI6IFJvdXRlcikge1xuICAgIH1cblxuICAgIG5nT25Jbml0KCkge1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogQGlnbm9yZVxuICAgICAqIERvIHNlYXJjaCBvbiBFbnRlciBjbGljaywgcmVzZXQgc2VhcmNoIG9uIEVzY2FwZVxuICAgICAqIEBwYXJhbSBzZWFyY2hfZWxlXG4gICAgICogQHBhcmFtIGV2ZW50XG4gICAgICogQHJldHVybnMgdm9pZFxuICAgICAqL1xuICAgIG9uS2V5KHNlYXJjaF9lbGU6IEhUTUxFbGVtZW50LCBldmVudCk6IHZvaWQge1xuICAgICAgICB0aGlzLmZvY3VzT25TaW1wbGUgPSAnYWN0aXZlJztcbiAgICAgICAgdGhpcy5wcmV2U2VhcmNoID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncHJldlNlYXJjaCcpKTtcbiAgICAgICAgaWYgKHRoaXMuc2VhcmNoUXVlcnkgJiYgKGV2ZW50LmtleSA9PT0gJ0VudGVyJyB8fCBldmVudC5rZXlDb2RlID09PSAxMyB8fCBldmVudC53aGljaCA9PT0gMTMpKSB7XG4gICAgICAgICAgICB0aGlzLmRvU2VhcmNoKHNlYXJjaF9lbGUpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChldmVudC5rZXkgPT09ICdFc2NhcGUnIHx8IGV2ZW50LmtleUNvZGUgPT09IDI3IHx8IGV2ZW50LndoaWNoID09PSAyNykge1xuICAgICAgICAgICAgdGhpcy5yZXNldFNlYXJjaChzZWFyY2hfZWxlKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogUmVhbGlzZSBhIHNpbXBsZSBzZWFyY2hcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBzZWFyY2hfZWxlXG4gICAgICogQHJldHVybnMgdm9pZFxuICAgICAqL1xuICAgIGRvU2VhcmNoKHNlYXJjaF9lbGU6IEhUTUxFbGVtZW50KTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLnNlYXJjaFF1ZXJ5ICE9PSB1bmRlZmluZWQgJiYgdGhpcy5zZWFyY2hRdWVyeSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy50b2dnbGVNZW51KCk7XG4gICAgICAgICAgICB0aGlzLl9yb3V0ZXIubmF2aWdhdGUoW3RoaXMucm91dGUgKyAnL2Z1bGx0ZXh0LycgKyB0aGlzLnNlYXJjaFF1ZXJ5XSk7XG5cbiAgICAgICAgICAgIC8vIHRoaXMuX3JvdXRlci5uYXZpZ2F0ZShbJy9zZWFyY2gvZnVsbHRleHQvJyArIHRoaXMuc2VhcmNoUXVlcnldLCB7IHJlbGF0aXZlVG86IHRoaXMuX3JvdXRlIH0pO1xuXG4gICAgICAgICAgICAvLyBwdXNoIHRoZSBzZWFyY2ggcXVlcnkgaW50byB0aGUgbG9jYWwgc3RvcmFnZSBwcmV2U2VhcmNoIGFycmF5IChwcmV2aW91cyBzZWFyY2gpXG4gICAgICAgICAgICAvLyB0byBoYXZlIGEgbGlzdCBvZiByZWNlbnQgc2VhcmNoIHJlcXVlc3RzXG4gICAgICAgICAgICBsZXQgZXhpc3RpbmdQcmV2U2VhcmNoOiBzdHJpbmdbXSA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3ByZXZTZWFyY2gnKSk7XG4gICAgICAgICAgICBpZiAoZXhpc3RpbmdQcmV2U2VhcmNoID09PSBudWxsKSB7IGV4aXN0aW5nUHJldlNlYXJjaCA9IFtdOyB9XG4gICAgICAgICAgICBsZXQgaTogbnVtYmVyID0gMDtcbiAgICAgICAgICAgIGZvciAoY29uc3QgZW50cnkgb2YgZXhpc3RpbmdQcmV2U2VhcmNoKSB7XG4gICAgICAgICAgICAgICAgLy8gcmVtb3ZlIGVudHJ5LCBpZiBleGlzdHMgYWxyZWFkeVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNlYXJjaFF1ZXJ5ID09PSBlbnRyeSkgeyBleGlzdGluZ1ByZXZTZWFyY2guc3BsaWNlKGksIDEpOyB9XG4gICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZXhpc3RpbmdQcmV2U2VhcmNoLnB1c2godGhpcy5zZWFyY2hRdWVyeSk7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncHJldlNlYXJjaCcsIEpTT04uc3RyaW5naWZ5KGV4aXN0aW5nUHJldlNlYXJjaCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2VhcmNoX2VsZS5mb2N1cygpO1xuICAgICAgICAgICAgdGhpcy5wcmV2U2VhcmNoID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncHJldlNlYXJjaCcpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlc2V0IHRoZSBzZWFyY2hcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBzZWFyY2hfZWxlXG4gICAgICogQHJldHVybnMgdm9pZFxuICAgICAqL1xuICAgIHJlc2V0U2VhcmNoKHNlYXJjaF9lbGU6IEhUTUxFbGVtZW50KTogdm9pZCB7XG4gICAgICAgIHRoaXMuc2VhcmNoUXVlcnkgPSBudWxsO1xuICAgICAgICBzZWFyY2hfZWxlLmZvY3VzKCk7XG4gICAgICAgIHRoaXMuZm9jdXNPblNpbXBsZSA9ICdpbmFjdGl2ZSc7XG4gICAgICAgIHRoaXMuc2VhcmNoUGFuZWxGb2N1cyA9ICF0aGlzLnNlYXJjaFBhbmVsRm9jdXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3dpdGNoIGFjY29yZGluZyB0byB0aGUgZm9jdXMgYmV0d2VlbiBzaW1wbGUgb3IgZXh0ZW5kZWQgc2VhcmNoXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAyIGNhc2VzOiBzaW1wbGVTZWFyY2ggb3IgZXh0ZW5kZWRTZWFyY2hcbiAgICAgKiBAcmV0dXJucyB2b2lkXG4gICAgICovXG4gICAgdG9nZ2xlTWVudSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5wcmV2U2VhcmNoID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncHJldlNlYXJjaCcpKTtcbiAgICAgICAgdGhpcy5mb2N1c09uU2ltcGxlID0gKHRoaXMuZm9jdXNPblNpbXBsZSA9PT0gJ2FjdGl2ZScgPyAnaW5hY3RpdmUnIDogJ2FjdGl2ZScpO1xuICAgICAgICB0aGlzLnNob3dTaW1wbGVTZWFyY2ggPSB0cnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldCBzaW1wbGUgZm9jdXMgdG8gYWN0aXZlXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB2b2lkXG4gICAgICovXG4gICAgc2V0Rm9jdXMoKTogdm9pZCB7XG4gICAgICAgIHRoaXMucHJldlNlYXJjaCA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3ByZXZTZWFyY2gnKSk7XG4gICAgICAgIHRoaXMuZm9jdXNPblNpbXBsZSA9ICdhY3RpdmUnO1xuICAgICAgICB0aGlzLnNlYXJjaFBhbmVsRm9jdXMgPSAhdGhpcy5zZWFyY2hQYW5lbEZvY3VzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlYWxpc2UgYSBwcmV2aW91cyBzZWFyY2hcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcXVlcnlcbiAgICAgKiBAcmV0dXJucyB2b2lkXG4gICAgICovXG4gICAgZG9QcmV2U2VhcmNoKHF1ZXJ5OiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zZWFyY2hRdWVyeSA9IHF1ZXJ5O1xuICAgICAgICB0aGlzLl9yb3V0ZXIubmF2aWdhdGUoW3RoaXMucm91dGUgKyAnL2Z1bGx0ZXh0LycgKyBxdWVyeV0sIHsgcmVsYXRpdmVUbzogdGhpcy5fcm91dGUgfSk7XG4gICAgICAgIHRoaXMudG9nZ2xlTWVudSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlc2V0IHByZXZpb3VzIHNlYXJjaGVzIC0gdGhlIHdob2xlIHByZXZpb3VzIHNlYXJjaCBvciBzcGVjaWZpYyBpdGVtIGJ5IG5hbWVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSB0ZXJtIG9mIHRoZSBzZWFyY2hcbiAgICAgKiBAcmV0dXJucyB2b2lkXG4gICAgICovXG4gICAgcmVzZXRQcmV2U2VhcmNoKG5hbWU6IHN0cmluZyA9IG51bGwpOiB2b2lkIHtcbiAgICAgICAgaWYgKG5hbWUpIHtcbiAgICAgICAgICAgIC8vIGRlbGV0ZSBvbmx5IHRoaXMgaXRlbSB3aXRoIHRoZSBuYW1lIC4uLlxuICAgICAgICAgICAgY29uc3QgaTogbnVtYmVyID0gdGhpcy5wcmV2U2VhcmNoLmluZGV4T2YobmFtZSk7XG4gICAgICAgICAgICB0aGlzLnByZXZTZWFyY2guc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3ByZXZTZWFyY2gnLCBKU09OLnN0cmluZ2lmeSh0aGlzLnByZXZTZWFyY2gpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGRlbGV0ZSB0aGUgd2hvbGUgXCJwcmV2aW91cyBzZWFyY2hcIiBhcnJheVxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ3ByZXZTZWFyY2gnKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnByZXZTZWFyY2ggPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdwcmV2U2VhcmNoJykpO1xuXG4gICAgfVxufVxuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIEluamVjdCwgSW5wdXQsIE9uQ2hhbmdlcywgT25Jbml0LCBPdXRwdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEZvcm1CdWlsZGVyLCBGb3JtR3JvdXAsIFZhbGlkYXRvcnMgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBSZXNvdXJjZUNsYXNzIH0gZnJvbSAnQGtub3JhL2NvcmUnO1xuXG4vLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy80NTY2MTAxMC9keW5hbWljLW5lc3RlZC1yZWFjdGl2ZS1mb3JtLWV4cHJlc3Npb25jaGFuZ2VkYWZ0ZXJpdGhhc2JlZW5jaGVja2VkZXJyb3JcbmNvbnN0IHJlc29sdmVkUHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZShudWxsKTtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdrdWktc2VsZWN0LXJlc291cmNlLWNsYXNzJyxcbiAgICB0ZW1wbGF0ZTogYDxtYXQtZm9ybS1maWVsZCAqbmdJZj1cInJlc291cmNlQ2xhc3Nlcy5sZW5ndGggPiAwXCI+XG4gIDxtYXQtc2VsZWN0IHBsYWNlaG9sZGVyPVwiUmVzb3VyY2UgQ2xhc3NcIiBbZm9ybUNvbnRyb2xdPVwiZm9ybS5jb250cm9sc1sncmVzb3VyY2VDbGFzcyddXCI+XG4gICAgPG1hdC1vcHRpb24gW3ZhbHVlXT1cIm51bGxcIj5ubyBzZWxlY3Rpb248L21hdC1vcHRpb24+XG4gICAgPCEtLSB1bmRvIHNlbGVjdGlvbiBvZiBhIHJlc291cmNlIGNsYXNzIC0tPlxuICAgIDxtYXQtb3B0aW9uICpuZ0Zvcj1cImxldCByZXNvdXJjZUNsYXNzIG9mIHJlc291cmNlQ2xhc3Nlc1wiIFt2YWx1ZV09XCJyZXNvdXJjZUNsYXNzLmlkXCI+e3sgcmVzb3VyY2VDbGFzcy5sYWJlbCB9fTwvbWF0LW9wdGlvbj5cbiAgPC9tYXQtc2VsZWN0PlxuPC9tYXQtZm9ybS1maWVsZD5gLFxuICAgIHN0eWxlczogW2BgXVxufSlcbmV4cG9ydCBjbGFzcyBTZWxlY3RSZXNvdXJjZUNsYXNzQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMge1xuXG4gICAgQElucHV0KCkgZm9ybUdyb3VwOiBGb3JtR3JvdXA7XG5cbiAgICAvLyBzZXR0ZXIgbWV0aG9kIGZvciByZXNvdXJjZSBjbGFzc2VzIHdoZW4gYmVpbmcgdXBkYXRlZCBieSBwYXJlbnQgY29tcG9uZW50XG4gICAgQElucHV0KClcbiAgICBzZXQgcmVzb3VyY2VDbGFzc2VzKHZhbHVlOiBBcnJheTxSZXNvdXJjZUNsYXNzPikge1xuICAgICAgICB0aGlzLnJlc291cmNlQ2xhc3NTZWxlY3RlZCA9IHVuZGVmaW5lZDsgLy8gcmVzZXQgb24gdXBkYXRlc1xuICAgICAgICB0aGlzLl9yZXNvdXJjZUNsYXNzZXMgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICAvLyBnZXR0ZXIgbWV0aG9kIGZvciByZXNvdXJjZSBjbGFzc2VzICh1c2VkIGluIHRlbXBsYXRlKVxuICAgIGdldCByZXNvdXJjZUNsYXNzZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9yZXNvdXJjZUNsYXNzZXM7XG4gICAgfVxuXG4gICAgLy8gZXZlbnQgZW1pdHRlZCB0byBwYXJlbnQgY29tcG9uZW50IG9uY2UgYSByZXNvdXJjZSBjbGFzcyBpcyBzZWxlY3RlZCBieSB0aGUgdXNlclxuICAgIEBPdXRwdXQoKSByZXNvdXJjZUNsYXNzU2VsZWN0ZWRFdmVudCA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nPigpO1xuXG4gICAgLy8gYXZhaWxhYmxlIHJlc291cmNlIGNsYXNzZXMgZm9yIHNlbGVjdGlvblxuICAgIHByaXZhdGUgX3Jlc291cmNlQ2xhc3NlczogQXJyYXk8UmVzb3VyY2VDbGFzcz47XG5cbiAgICAvLyBzdG9yZXMgdGhlIGN1cnJlbnRseSBzZWxlY3RlZCByZXNvdXJjZSBjbGFzc1xuICAgIHByaXZhdGUgcmVzb3VyY2VDbGFzc1NlbGVjdGVkOiBzdHJpbmc7XG5cbiAgICBmb3JtOiBGb3JtR3JvdXA7XG5cbiAgICBjb25zdHJ1Y3RvcihASW5qZWN0KEZvcm1CdWlsZGVyKSBwcml2YXRlIGZiOiBGb3JtQnVpbGRlcikge1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIElyaSBvZiB0aGUgc2VsZWN0ZWQgcmVzb3VyY2UgY2xhc3MuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB0aGUgSXJpIG9mIHRoZSBzZWxlY3RlZCByZXNvdXJjZSBjbGFzcyBvciBmYWxzZSBpbiBjYXNlIG5vIHJlc291cmNlIGNsYXNzIGlzIHNlbGVjdGVkLlxuICAgICAqL1xuICAgIGdldFJlc291cmNlQ2xhc3NTZWxlY3RlZCgpOiBhbnkge1xuICAgICAgICBpZiAodGhpcy5yZXNvdXJjZUNsYXNzU2VsZWN0ZWQgIT09IHVuZGVmaW5lZCAmJiB0aGlzLnJlc291cmNlQ2xhc3NTZWxlY3RlZCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VDbGFzc1NlbGVjdGVkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW5pdGFsaXplcyB0aGUgRm9ybUdyb3VwIGZvciB0aGUgcmVzb3VyY2UgY2xhc3Mgc2VsZWN0aW9uLlxuICAgICAqIFRoZSBpbml0aWFsIHZhbHVlIGlzIHNldCB0byBudWxsLlxuICAgICAqL1xuICAgIHByaXZhdGUgaW5pdEZvcm0oKSB7XG4gICAgICAgIC8vIGJ1aWxkIGEgZm9ybSBmb3IgdGhlIHJlc291cmNlIGNsYXNzIHNlbGVjdGlvblxuICAgICAgICB0aGlzLmZvcm0gPSB0aGlzLmZiLmdyb3VwKHtcbiAgICAgICAgICAgIHJlc291cmNlQ2xhc3M6IFtudWxsXSAvLyByZXNvdXJjZSBjbGFzcyBzZWxlY3Rpb24gaXMgb3B0aW9uYWxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gc3RvcmUgYW5kIGVtaXQgSXJpIG9mIHRoZSByZXNvdXJjZSBjbGFzcyB3aGVuIHNlbGVjdGVkXG4gICAgICAgIHRoaXMuZm9ybS52YWx1ZUNoYW5nZXMuc3Vic2NyaWJlKChkYXRhKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnJlc291cmNlQ2xhc3NTZWxlY3RlZCA9IGRhdGEucmVzb3VyY2VDbGFzcztcbiAgICAgICAgICAgIHRoaXMucmVzb3VyY2VDbGFzc1NlbGVjdGVkRXZlbnQuZW1pdCh0aGlzLnJlc291cmNlQ2xhc3NTZWxlY3RlZCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG5nT25Jbml0KCkge1xuXG4gICAgICAgIHRoaXMuaW5pdEZvcm0oKTtcblxuICAgICAgICAvLyBhZGQgZm9ybSB0byB0aGUgcGFyZW50IGZvcm0gZ3JvdXBcbiAgICAgICAgdGhpcy5mb3JtR3JvdXAuYWRkQ29udHJvbCgncmVzb3VyY2VDbGFzcycsIHRoaXMuZm9ybSk7XG5cbiAgICB9XG5cbiAgICBuZ09uQ2hhbmdlcygpIHtcblxuICAgICAgICBpZiAodGhpcy5mb3JtICE9PSB1bmRlZmluZWQpIHtcblxuICAgICAgICAgICAgLy8gcmVzb3VyY2UgY2xhc3NlcyBoYXZlIGJlZW4gcmVpbml0aWFsaXplZFxuICAgICAgICAgICAgLy8gcmVzZXQgZm9ybVxuICAgICAgICAgICAgcmVzb2x2ZWRQcm9taXNlLnRoZW4oKCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgLy8gcmVtb3ZlIHRoaXMgZm9ybSBmcm9tIHRoZSBwYXJlbnQgZm9ybSBncm91cFxuICAgICAgICAgICAgICAgIHRoaXMuZm9ybUdyb3VwLnJlbW92ZUNvbnRyb2woJ3Jlc291cmNlQ2xhc3MnKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuaW5pdEZvcm0oKTtcblxuICAgICAgICAgICAgICAgIC8vIGFkZCBmb3JtIHRvIHRoZSBwYXJlbnQgZm9ybSBncm91cFxuICAgICAgICAgICAgICAgIHRoaXMuZm9ybUdyb3VwLmFkZENvbnRyb2woJ3Jlc291cmNlQ2xhc3MnLCB0aGlzLmZvcm0pO1xuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgSW5qZWN0LCBJbnB1dCwgT25Jbml0LCBPdXRwdXQsIFF1ZXJ5TGlzdCwgVmlld0NoaWxkLCBWaWV3Q2hpbGRyZW4gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFjdGl2YXRlZFJvdXRlLCBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgRm9ybUJ1aWxkZXIsIEZvcm1Hcm91cCB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7XG4gICAgR3JhdnNlYXJjaEdlbmVyYXRpb25TZXJ2aWNlLFxuICAgIE9udG9sb2d5Q2FjaGVTZXJ2aWNlLFxuICAgIE9udG9sb2d5SW5mb3JtYXRpb24sXG4gICAgT250b2xvZ3lNZXRhZGF0YSxcbiAgICBQcm9wZXJ0aWVzLFxuICAgIFByb3BlcnR5V2l0aFZhbHVlLFxuICAgIFJlYWRSZXNvdXJjZXNTZXF1ZW5jZSxcbiAgICBSZXNvdXJjZUNsYXNzXG59IGZyb20gJ0Brbm9yYS9jb3JlJztcbmltcG9ydCB7IFNlbGVjdFByb3BlcnR5Q29tcG9uZW50IH0gZnJvbSAnLi9zZWxlY3QtcHJvcGVydHkvc2VsZWN0LXByb3BlcnR5LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBTZWxlY3RSZXNvdXJjZUNsYXNzQ29tcG9uZW50IH0gZnJvbSAnLi9zZWxlY3QtcmVzb3VyY2UtY2xhc3Mvc2VsZWN0LXJlc291cmNlLWNsYXNzLmNvbXBvbmVudCc7XG5cblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdrdWktZXh0ZW5kZWQtc2VhcmNoJyxcbiAgICB0ZW1wbGF0ZTogYDxmb3JtIFtmb3JtR3JvdXBdPVwiZm9ybVwiIChuZ1N1Ym1pdCk9XCJzdWJtaXQoKVwiPlxuXG4gIDxkaXY+XG4gICAgPGt1aS1zZWxlY3Qtb250b2xvZ3kgKm5nSWY9XCJvbnRvbG9naWVzLmxlbmd0aCA+IDBcIiBbZm9ybUdyb3VwXT1cImZvcm1cIiBbb250b2xvZ2llc109XCJvbnRvbG9naWVzXCIgKG9udG9sb2d5U2VsZWN0ZWQpPVwiZ2V0UmVzb3VyY2VDbGFzc2VzQW5kUHJvcGVydGllc0Zvck9udG9sb2d5KCRldmVudClcIj48L2t1aS1zZWxlY3Qtb250b2xvZ3k+XG4gIDwvZGl2PlxuXG4gIDxkaXYgY2xhc3M9XCJzZWxlY3QtcmVzb3VyY2UtY2xhc3NcIiAqbmdJZj1cInJlc291cmNlQ2xhc3Nlcz8ubGVuZ3RoID4gMFwiPlxuICAgIDxrdWktc2VsZWN0LXJlc291cmNlLWNsYXNzICNyZXNvdXJjZUNsYXNzIFtmb3JtR3JvdXBdPVwiZm9ybVwiIFtyZXNvdXJjZUNsYXNzZXNdPVwicmVzb3VyY2VDbGFzc2VzXCIgKHJlc291cmNlQ2xhc3NTZWxlY3RlZEV2ZW50KT1cImdldFByb3BlcnRpZXNGb3JSZXNvdXJjZUNsYXNzKCRldmVudClcIj48L2t1aS1zZWxlY3QtcmVzb3VyY2UtY2xhc3M+XG4gIDwvZGl2PlxuXG4gIDxkaXYgY2xhc3M9XCJzZWxlY3QtcHJvcGVydHlcIiAqbmdJZj1cInByb3BlcnRpZXMgIT09IHVuZGVmaW5lZFwiPlxuICAgIDxkaXYgKm5nRm9yPVwibGV0IHByb3Agb2YgYWN0aXZlUHJvcGVydGllczsgbGV0IGkgPSBpbmRleFwiPlxuXG4gICAgICA8a3VpLXNlbGVjdC1wcm9wZXJ0eSAjcHJvcGVydHkgW2FjdGl2ZVJlc291cmNlQ2xhc3NdPVwiYWN0aXZlUmVzb3VyY2VDbGFzc1wiIFtmb3JtR3JvdXBdPVwiZm9ybVwiIFtpbmRleF09XCJpXCIgW3Byb3BlcnRpZXNdPVwicHJvcGVydGllc1wiPjwva3VpLXNlbGVjdC1wcm9wZXJ0eT5cblxuICAgIDwvZGl2PlxuICA8L2Rpdj5cblxuXG4gIDxkaXY+XG4gICAgPGJ1dHRvbiBtYXQtbWluaS1mYWIgY2xhc3M9XCJwcm9wZXJ0eS1idXR0b25zIGFkZC1wcm9wZXJ0eS1idXR0b25cIiBjb2xvcj1cInByaW1hcnlcIiB0eXBlPVwiYnV0dG9uXCIgKGNsaWNrKT1cImFkZFByb3BlcnR5KClcIiBbZGlzYWJsZWRdPVwiYWN0aXZlT250b2xvZ3kgPT09IHVuZGVmaW5lZCB8fCBhY3RpdmVQcm9wZXJ0aWVzLmxlbmd0aCA+PSA0XCI+XG4gICAgICA8bWF0LWljb24gYXJpYS1sYWJlbD1cImFkZCBhIHByb3BlcnR5XCI+YWRkPC9tYXQtaWNvbj5cbiAgICA8L2J1dHRvbj5cblxuICAgIDxidXR0b24gbWF0LW1pbmktZmFiIGNsYXNzPVwicHJvcGVydHktYnV0dG9ucyByZW1vdmUtcHJvcGVydHktYnV0dG9uXCIgY29sb3I9XCJwcmltYXJ5XCIgdHlwZT1cImJ1dHRvblwiIChjbGljayk9XCJyZW1vdmVQcm9wZXJ0eSgpXCIgW2Rpc2FibGVkXT1cImFjdGl2ZVByb3BlcnRpZXMubGVuZ3RoID09IDBcIj5cbiAgICAgIDxtYXQtaWNvbiBhcmlhLWxhYmVsPVwicmVtb3ZlIHByb3BlcnR5XCI+cmVtb3ZlPC9tYXQtaWNvbj5cbiAgICA8L2J1dHRvbj5cbiAgPC9kaXY+XG5cbiAgPCEtLSAgPGRpdj5cbiAgICA8YnV0dG9uIG1hdC1pY29uLWJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgKGNsaWNrKT1cInJlc2V0Rm9ybSgpXCIgW2Rpc2FibGVkXT1cInRoaXMuYWN0aXZlT250b2xvZ3kgPT09IHVuZGVmaW5lZFwiPlxuICAgICAgPG1hdC1pY29uIGFyaWEtbGFiZWw9XCJyZXNldCBxdWVyeSBmb3JtXCI+Y2xlYXI8L21hdC1pY29uPlxuICAgIDwvYnV0dG9uPlxuXG4gICAgPGJ1dHRvbiBtYXQtaWNvbi1idXR0b24gdHlwZT1cInN1Ym1pdFwiIFtkaXNhYmxlZF09XCIhZm9ybVZhbGlkXCI+XG4gICAgICA8bWF0LWljb24gYXJpYS1sYWJlbD1cInN1Ym1pdCBxdWVyeVwiPnNlbmQ8L21hdC1pY29uPlxuICAgIDwvYnV0dG9uPlxuICA8L2Rpdj4gLS0+XG5cbiAgPGJ1dHRvbiBjbGFzcz1cImV4dGVuZGVkLWJ1dHRvbnMgZXh0ZW5kZWQtc2VhcmNoLWJ1dHRvblwiIG1hdC1zdHJva2VkLWJ1dHRvbiBjb2xvcj1cInByaW1hcnlcIiB0eXBlPVwic3VibWl0XCIgW2Rpc2FibGVkXT1cIiFmb3JtVmFsaWRcIj5cbiAgICBTZWFyY2hcbiAgPC9idXR0b24+XG4gIDxidXR0b24gY2xhc3M9XCJleHRlbmRlZC1idXR0b25zIHJlc2V0XCIgbWF0LXN0cm9rZWQtYnV0dG9uIHR5cGU9XCJidXR0b25cIiAoY2xpY2spPVwicmVzZXRGb3JtKClcIiBbZGlzYWJsZWRdPVwidGhpcy5hY3RpdmVPbnRvbG9neSA9PT0gdW5kZWZpbmVkXCI+XG4gICAgUmVzZXRcbiAgPC9idXR0b24+XG5cblxuPC9mb3JtPlxuYCxcbiAgICBzdHlsZXM6IFtgLmFkZC1wcm9wZXJ0eS1idXR0b257bWFyZ2luLXJpZ2h0OjVweH0uZXh0ZW5kZWQtYnV0dG9uc3ttYXJnaW4tdG9wOjI1cHh9LmV4dGVuZGVkLXNlYXJjaC1idXR0b257bWFyZ2luLXJpZ2h0OjVweH0ucHJvcGVydHktYnV0dG9uc3ttYXJnaW4tdG9wOjI1cHh9LnNlbGVjdC1wcm9wZXJ0eXttYXJnaW4tbGVmdDoyMnB4fS5zZWxlY3QtcmVzb3VyY2UtY2xhc3N7bWFyZ2luLWxlZnQ6MTJweH1gXVxufSlcbmV4cG9ydCBjbGFzcyBFeHRlbmRlZFNlYXJjaENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcm91dGUgLSBSb3V0ZSBhZnRlciBzZWFyY2hcbiAgICAgKi9cbiAgICBASW5wdXQoKSByb3V0ZTtcblxuICAgIC8vIHRyaWdnZXIgdG9nZ2xlIGZvciBleHRlbmRlZCBzZWFyY2ggZm9ybVxuICAgIEBPdXRwdXQoKSB0b2dnbGVFeHRlbmRlZFNlYXJjaEZvcm0gPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KCk7XG5cbiAgICAvLyBhbGwgYXZhaWxhYmxlIG9udG9sb2dpZXNcbiAgICBvbnRvbG9naWVzOiBBcnJheTxPbnRvbG9neU1ldGFkYXRhPiA9IFtdO1xuXG4gICAgLy8gb250b2xvZ3kgY2hvc2VuIGJ5IHRoZSB1c2VyXG4gICAgYWN0aXZlT250b2xvZ3k6IHN0cmluZztcblxuICAgIC8vIHByb3BlcnRpZXMgc3BlY2lmaWVkIGJ5IHRoZSB1c2VyXG4gICAgYWN0aXZlUHJvcGVydGllczogYm9vbGVhbltdID0gW107XG5cbiAgICAvLyByZXNvdXJjZSBjbGFzc2VzIGZvciB0aGUgc2VsZWN0ZWQgb250b2xvZ3lcbiAgICByZXNvdXJjZUNsYXNzZXM6IEFycmF5PFJlc291cmNlQ2xhc3M+ID0gW107XG5cbiAgICAvLyBkZWZpbml0aW9uIG9mIHRoZSBzZWxlY3RlZCByZXNvdXJjZSBjbGFzcywgaWYgc2V0LlxuICAgIGFjdGl2ZVJlc291cmNlQ2xhc3M6IFJlc291cmNlQ2xhc3M7XG5cbiAgICAvLyBwcm9wZXJ0aWVzIGZvciB0aGUgc2VsZWN0ZWQgb250b2xvZ3kgb3Igc2VsZWN0ZWQgcmVzb3VyY2UgY2xhc3NcbiAgICBwcm9wZXJ0aWVzOiBQcm9wZXJ0aWVzO1xuXG4gICAgcmVzdWx0OiBSZWFkUmVzb3VyY2VzU2VxdWVuY2UgPSBuZXcgUmVhZFJlc291cmNlc1NlcXVlbmNlKFtdLCAwKTtcblxuICAgIC8vIHJlZmVyZW5jZSB0byB0aGUgY29tcG9uZW50IHRoYXQgY29udHJvbHMgdGhlIHJlc291cmNlIGNsYXNzIHNlbGVjdGlvblxuICAgIEBWaWV3Q2hpbGQoJ3Jlc291cmNlQ2xhc3MnKSByZXNvdXJjZUNsYXNzQ29tcG9uZW50OiBTZWxlY3RSZXNvdXJjZUNsYXNzQ29tcG9uZW50O1xuXG4gICAgLy8gcmVmZXJlbmNlIHRvIHRoZSBjb21wb25lbnQgY29udHJvbGxpbmcgdGhlIHByb3BlcnR5IHNlbGVjdGlvblxuICAgIEBWaWV3Q2hpbGRyZW4oJ3Byb3BlcnR5JykgcHJvcGVydHlDb21wb25lbnRzOiBRdWVyeUxpc3Q8U2VsZWN0UHJvcGVydHlDb21wb25lbnQ+O1xuXG4gICAgLy8gRm9ybUdyb3VwICh1c2VkIGFzIHBhcmVudCBmb3IgY2hpbGQgY29tcG9uZW50cylcbiAgICBmb3JtOiBGb3JtR3JvdXA7XG5cbiAgICAvLyBmb3JtIHZhbGlkYXRpb24gc3RhdHVzXG4gICAgZm9ybVZhbGlkID0gZmFsc2U7XG5cbiAgICBjb25zdHJ1Y3RvcihASW5qZWN0KEZvcm1CdWlsZGVyKSBwcml2YXRlIGZiOiBGb3JtQnVpbGRlcixcbiAgICAgICAgcHJpdmF0ZSBfcm91dGU6IEFjdGl2YXRlZFJvdXRlLFxuICAgICAgICBwcml2YXRlIF9yb3V0ZXI6IFJvdXRlcixcbiAgICAgICAgcHJpdmF0ZSBfY2FjaGVTZXJ2aWNlOiBPbnRvbG9neUNhY2hlU2VydmljZSxcbiAgICAgICAgcHJpdmF0ZSBfZ3JhdlNlYXJjaFNlcnZpY2U6IEdyYXZzZWFyY2hHZW5lcmF0aW9uU2VydmljZSkge1xuICAgIH1cblxuICAgIG5nT25Jbml0KCkge1xuXG4gICAgICAgIC8vIHBhcmVudCBmb3JtIGlzIGVtcHR5LCBpdCBnZXRzIHBhc3NlZCB0byB0aGUgY2hpbGQgY29tcG9uZW50c1xuICAgICAgICB0aGlzLmZvcm0gPSB0aGlzLmZiLmdyb3VwKHt9KTtcblxuICAgICAgICAvLyBpZiBmb3JtIHN0YXR1cyBjaGFuZ2VzLCByZS1ydW4gdmFsaWRhdGlvblxuICAgICAgICB0aGlzLmZvcm0uc3RhdHVzQ2hhbmdlcy5zdWJzY3JpYmUoKGRhdGEpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZm9ybVZhbGlkID0gdGhpcy52YWxpZGF0ZUZvcm0oKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuZm9ybSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGluaXRpYWxpemUgb250b2xvZ2llcyB0byBiZSB1c2VkIGZvciB0aGUgb250b2xvZ2llcyBzZWxlY3Rpb24gaW4gdGhlIHNlYXJjaCBmb3JtXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZU9udG9sb2dpZXMoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBZGQgYSBwcm9wZXJ0eSB0byB0aGUgc2VhcmNoIGZvcm0uXG4gICAgICogQHJldHVybnMgdm9pZFxuICAgICAqL1xuICAgIGFkZFByb3BlcnR5KCk6IHZvaWQge1xuICAgICAgICB0aGlzLmFjdGl2ZVByb3BlcnRpZXMucHVzaCh0cnVlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgdGhlIGxhc3QgcHJvcGVydHkgZnJvbSB0aGUgc2VhcmNoIGZvcm0uXG4gICAgICogQHJldHVybnMgdm9pZFxuICAgICAqL1xuICAgIHJlbW92ZVByb3BlcnR5KCk6IHZvaWQge1xuICAgICAgICB0aGlzLmFjdGl2ZVByb3BlcnRpZXMuc3BsaWNlKC0xLCAxKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIGFsbCBhdmFpbGFibGUgb250b2xvZ2llcyBmb3IgdGhlIHNlYXJjaCBmb3JtLlxuICAgICAqIEByZXR1cm5zIHZvaWRcbiAgICAgKi9cbiAgICBpbml0aWFsaXplT250b2xvZ2llcygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fY2FjaGVTZXJ2aWNlLmdldE9udG9sb2dpZXNNZXRhZGF0YSgpLnN1YnNjcmliZShcbiAgICAgICAgICAgIChvbnRvbG9naWVzOiBBcnJheTxPbnRvbG9neU1ldGFkYXRhPikgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMub250b2xvZ2llcyA9IG9udG9sb2dpZXM7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBPbmNlIGFuIG9udG9sb2d5IGhhcyBiZWVuIHNlbGVjdGVkLCBnZXRzIGl0cyBjbGFzc2VzIGFuZCBwcm9wZXJ0aWVzLlxuICAgICAqIFRoZSBjbGFzc2VzIGFuZCBwcm9wZXJ0aWVzIHdpbGwgYmUgbWFkZSBhdmFpbGFibGUgdG8gdGhlIHVzZXIgZm9yIHNlbGVjdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBvbnRvbG9neUlyaSBJcmkgb2YgdGhlIG9udG9sb2d5IGNob3NlbiBieSB0aGUgdXNlci5cbiAgICAgKiBAcmV0dXJucyB2b2lkXG4gICAgICovXG4gICAgZ2V0UmVzb3VyY2VDbGFzc2VzQW5kUHJvcGVydGllc0Zvck9udG9sb2d5KG9udG9sb2d5SXJpOiBzdHJpbmcpOiB2b2lkIHtcblxuICAgICAgICAvLyByZXNldCBhY3RpdmUgcmVzb3VyY2UgY2xhc3MgZGVmaW5pdGlvblxuICAgICAgICB0aGlzLmFjdGl2ZVJlc291cmNlQ2xhc3MgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgLy8gcmVzZXQgc3BlY2lmaWVkIHByb3BlcnRpZXNcbiAgICAgICAgdGhpcy5hY3RpdmVQcm9wZXJ0aWVzID0gW107XG5cbiAgICAgICAgdGhpcy5hY3RpdmVPbnRvbG9neSA9IG9udG9sb2d5SXJpO1xuXG4gICAgICAgIHRoaXMuX2NhY2hlU2VydmljZS5nZXRFbnRpdHlEZWZpbml0aW9uc0Zvck9udG9sb2dpZXMoW29udG9sb2d5SXJpXSkuc3Vic2NyaWJlKFxuICAgICAgICAgICAgKG9udG9JbmZvOiBPbnRvbG9neUluZm9ybWF0aW9uKSA9PiB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnJlc291cmNlQ2xhc3NlcyA9IG9udG9JbmZvLmdldFJlc291cmNlQ2xhc3Nlc0FzQXJyYXkoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BlcnRpZXMgPSBvbnRvSW5mby5nZXRQcm9wZXJ0aWVzKCk7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE9uY2UgYSByZXNvdXJjZSBjbGFzcyBoYXMgYmVlbiBzZWxlY3RlZCwgZ2V0cyBpdHMgcHJvcGVydGllcy5cbiAgICAgKiBUaGUgcHJvcGVydGllcyB3aWxsIGJlIG1hZGUgYXZhaWxhYmxlIHRvIHRoZSB1c2VyIGZvciBzZWxlY3Rpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcmVzb3VyY2VDbGFzc0lyaVxuICAgICAqIEByZXR1cm5zIHZvaWRcbiAgICAgKi9cbiAgICBnZXRQcm9wZXJ0aWVzRm9yUmVzb3VyY2VDbGFzcyhyZXNvdXJjZUNsYXNzSXJpOiBzdHJpbmcpOiB2b2lkIHtcblxuICAgICAgICAvLyByZXNldCBzcGVjaWZpZWQgcHJvcGVydGllc1xuICAgICAgICB0aGlzLmFjdGl2ZVByb3BlcnRpZXMgPSBbXTtcblxuICAgICAgICAvLyBpZiB0aGUgY2xpZW50IHVuZG9lcyB0aGUgc2VsZWN0aW9uIG9mIGEgcmVzb3VyY2UgY2xhc3MsIHVzZSB0aGUgYWN0aXZlIG9udG9sb2d5IGFzIGEgZmFsbGJhY2tcbiAgICAgICAgaWYgKHJlc291cmNlQ2xhc3NJcmkgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuZ2V0UmVzb3VyY2VDbGFzc2VzQW5kUHJvcGVydGllc0Zvck9udG9sb2d5KHRoaXMuYWN0aXZlT250b2xvZ3kpO1xuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICB0aGlzLl9jYWNoZVNlcnZpY2UuZ2V0UmVzb3VyY2VDbGFzc0RlZmluaXRpb25zKFtyZXNvdXJjZUNsYXNzSXJpXSkuc3Vic2NyaWJlKFxuICAgICAgICAgICAgICAgIChvbnRvSW5mbzogT250b2xvZ3lJbmZvcm1hdGlvbikgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BlcnRpZXMgPSBvbnRvSW5mby5nZXRQcm9wZXJ0aWVzKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hY3RpdmVSZXNvdXJjZUNsYXNzID0gb250b0luZm8uZ2V0UmVzb3VyY2VDbGFzc2VzKClbcmVzb3VyY2VDbGFzc0lyaV07XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFZhbGlkYXRlcyBmb3JtIGFuZCByZXR1cm5zIGl0cyBzdGF0dXMgKGJvb2xlYW4pLlxuICAgICAqL1xuICAgIHByaXZhdGUgdmFsaWRhdGVGb3JtKCkge1xuXG4gICAgICAgIC8vIGNoZWNrIHRoYXQgZWl0aGVyIGEgcmVzb3VyY2UgY2xhc3MgaXMgc2VsZWN0ZWQgb3IgYXQgbGVhc3Qgb25lIHByb3BlcnR5IGlzIHNwZWNpZmllZFxuICAgICAgICByZXR1cm4gdGhpcy5mb3JtLnZhbGlkICYmXG4gICAgICAgICAgICAodGhpcy5wcm9wZXJ0eUNvbXBvbmVudHMubGVuZ3RoID4gMCB8fCAodGhpcy5yZXNvdXJjZUNsYXNzQ29tcG9uZW50ICE9PSB1bmRlZmluZWQgJiYgdGhpcy5yZXNvdXJjZUNsYXNzQ29tcG9uZW50LmdldFJlc291cmNlQ2xhc3NTZWxlY3RlZCgpICE9PSBmYWxzZSkpO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVzZXRzIHRoZSBmb3JtIChzZWxlY3RlZCByZXNvdXJjZSBjbGFzcyBhbmQgc3BlY2lmaWVkIHByb3BlcnRpZXMpIHByZXNlcnZpbmcgdGhlIGFjdGl2ZSBvbnRvbG9neS5cbiAgICAgKi9cbiAgICByZXNldEZvcm0oKSB7XG4gICAgICAgIGlmICh0aGlzLmFjdGl2ZU9udG9sb2d5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuZ2V0UmVzb3VyY2VDbGFzc2VzQW5kUHJvcGVydGllc0Zvck9udG9sb2d5KHRoaXMuYWN0aXZlT250b2xvZ3kpO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgR3JhdlNlYXJjaCBxdWVyeSB3aXRoIHRoZSBnaXZlbiBmb3JtIHZhbHVlcyBhbmQgY2FsbHMgdGhlIGV4dGVuZGVkIHNlYXJjaCByb3V0ZS5cbiAgICAgKi9cbiAgICBzdWJtaXQoKSB7XG5cbiAgICAgICAgaWYgKCF0aGlzLmZvcm1WYWxpZCkgcmV0dXJuOyAvLyBjaGVjayB0aGF0IGZyb20gaXMgdmFsaWRcblxuICAgICAgICBjb25zdCByZXNDbGFzc09wdGlvbiA9IHRoaXMucmVzb3VyY2VDbGFzc0NvbXBvbmVudC5nZXRSZXNvdXJjZUNsYXNzU2VsZWN0ZWQoKTtcblxuICAgICAgICBsZXQgcmVzQ2xhc3M7XG5cbiAgICAgICAgaWYgKHJlc0NsYXNzT3B0aW9uICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgcmVzQ2xhc3MgPSByZXNDbGFzc09wdGlvbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHByb3BlcnRpZXM6IFByb3BlcnR5V2l0aFZhbHVlW10gPSB0aGlzLnByb3BlcnR5Q29tcG9uZW50cy5tYXAoXG4gICAgICAgICAgICAocHJvcENvbXApID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvcENvbXAuZ2V0UHJvcGVydHlTZWxlY3RlZFdpdGhWYWx1ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuXG4gICAgICAgIGNvbnN0IGdyYXZzZWFyY2ggPSB0aGlzLl9ncmF2U2VhcmNoU2VydmljZS5jcmVhdGVHcmF2c2VhcmNoUXVlcnkocHJvcGVydGllcywgcmVzQ2xhc3MsIDApO1xuXG4gICAgICAgIHRoaXMuX3JvdXRlci5uYXZpZ2F0ZShbdGhpcy5yb3V0ZSArICcvZXh0ZW5kZWQvJywgZ3JhdnNlYXJjaF0sIHsgcmVsYXRpdmVUbzogdGhpcy5fcm91dGUgfSk7XG5cbiAgICAgICAgLy8gdG9nZ2xlIGV4dGVuZGVkIHNlYXJjaCBmb3JtXG4gICAgICAgIHRoaXMudG9nZ2xlRXh0ZW5kZWRTZWFyY2hGb3JtLmVtaXQodHJ1ZSk7XG5cbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbmplY3QsIElucHV0LCBPbkluaXQsIE91dHB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgT250b2xvZ3lNZXRhZGF0YSB9IGZyb20gJ0Brbm9yYS9jb3JlJztcbmltcG9ydCB7IEZvcm1CdWlsZGVyLCBGb3JtR3JvdXAsIFZhbGlkYXRvcnMgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2t1aS1zZWxlY3Qtb250b2xvZ3knLFxuICB0ZW1wbGF0ZTogYDxtYXQtZm9ybS1maWVsZCAqbmdJZj1cIm9udG9sb2dpZXMubGVuZ3RoID4gMFwiPlxuICA8bWF0LXNlbGVjdCBwbGFjZWhvbGRlcj1cIk9udG9sb2d5XCIgW2Zvcm1Db250cm9sXT1cImZvcm0uY29udHJvbHNbJ29udG9sb2d5J11cIj5cbiAgICAgIDxtYXQtb3B0aW9uICpuZ0Zvcj1cImxldCBvbnRvIG9mIG9udG9sb2dpZXNcIiBbdmFsdWVdPVwib250by5pZFwiPnt7IG9udG8ubGFiZWwgfX08L21hdC1vcHRpb24+XG4gIDwvbWF0LXNlbGVjdD5cbjwvbWF0LWZvcm0tZmllbGQ+XG5gLFxuICBzdHlsZXM6IFtgYF1cbn0pXG5leHBvcnQgY2xhc3MgU2VsZWN0T250b2xvZ3lDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gIEBJbnB1dCgpIGZvcm1Hcm91cDogRm9ybUdyb3VwO1xuXG4gIEBJbnB1dCgpIG9udG9sb2dpZXM6IEFycmF5PE9udG9sb2d5TWV0YWRhdGE+O1xuXG4gIEBPdXRwdXQoKSBvbnRvbG9neVNlbGVjdGVkID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmc+KCk7XG5cbiAgZm9ybTogRm9ybUdyb3VwO1xuXG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoRm9ybUJ1aWxkZXIpIHByaXZhdGUgZmI6IEZvcm1CdWlsZGVyKSB7IH1cblxuICBuZ09uSW5pdCgpIHtcblxuICAgIC8vIGJ1aWxkIGEgZm9ybSBmb3IgdGhlIG5hbWVkIGdyYXBoIHNlbGVjdGlvblxuICAgIHRoaXMuZm9ybSA9IHRoaXMuZmIuZ3JvdXAoe1xuICAgICAgb250b2xvZ3k6IFtudWxsLCBWYWxpZGF0b3JzLnJlcXVpcmVkXVxuICAgIH0pO1xuXG4gICAgLy8gZW1pdCBJcmkgb2YgdGhlIG9udG9sb2d5IHdoZW4gYmVpbmcgc2VsZWN0ZWRcbiAgICB0aGlzLmZvcm0udmFsdWVDaGFuZ2VzLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xuICAgICAgdGhpcy5vbnRvbG9neVNlbGVjdGVkLmVtaXQoZGF0YS5vbnRvbG9neSk7XG4gICAgfSk7XG5cbiAgICAvLyBhZGQgZm9ybSB0byB0aGUgcGFyZW50IGZvcm0gZ3JvdXBcbiAgICB0aGlzLmZvcm1Hcm91cC5hZGRDb250cm9sKCdvbnRvbG9neScsIHRoaXMuZm9ybSk7XG5cbiAgfVxuXG59XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIEluamVjdCwgSW5wdXQsIE9uQ2hhbmdlcywgT25Jbml0LCBWaWV3Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEZvcm1CdWlsZGVyLCBGb3JtR3JvdXAsIFZhbGlkYXRvcnMgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge1xuICAgIENvbXBhcmlzb25PcGVyYXRvcixcbiAgICBDb21wYXJpc29uT3BlcmF0b3JBbmRWYWx1ZSxcbiAgICBFcXVhbHMsXG4gICAgRXhpc3RzLFxuICAgIEdyZWF0ZXJUaGFuLFxuICAgIEdyZWF0ZXJUaGFuRXF1YWxzLFxuICAgIEtub3JhQ29uc3RhbnRzLFxuICAgIExlc3NUaGFuLFxuICAgIExlc3NUaGFuRXF1YWxzLFxuICAgIExpa2UsXG4gICAgTWF0Y2gsXG4gICAgTm90RXF1YWxzLFxuICAgIFByb3BlcnR5LFxuICAgIFByb3BlcnR5VmFsdWUsXG4gICAgVmFsdWVcbn0gZnJvbSAnQGtub3JhL2NvcmUnO1xuXG5cbi8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzQ1NjYxMDEwL2R5bmFtaWMtbmVzdGVkLXJlYWN0aXZlLWZvcm0tZXhwcmVzc2lvbmNoYW5nZWRhZnRlcml0aGFzYmVlbmNoZWNrZWRlcnJvclxuY29uc3QgcmVzb2x2ZWRQcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKG51bGwpO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ2t1aS1zcGVjaWZ5LXByb3BlcnR5LXZhbHVlJyxcbiAgICB0ZW1wbGF0ZTogYDxtYXQtZm9ybS1maWVsZCBjbGFzcz1cInNlYXJjaC1vcGVyYXRvci1maWVsZFwiICpuZ0lmPVwiY29tcGFyaXNvbk9wZXJhdG9ycz8ubGVuZ3RoID4gMFwiPlxuICAgIDxtYXQtc2VsZWN0IHBsYWNlaG9sZGVyPVwiQ29tcGFyaXNvbiBPcGVyYXRvclwiIFtmb3JtQ29udHJvbF09XCJmb3JtLmNvbnRyb2xzWydjb21wYXJpc29uT3BlcmF0b3InXVwiPlxuICAgICAgICA8bWF0LW9wdGlvbiAqbmdGb3I9XCJsZXQgY29tcE9wIG9mIGNvbXBhcmlzb25PcGVyYXRvcnNcIiBbdmFsdWVdPVwiY29tcE9wXCI+e3sgY29tcE9wLmxhYmVsIH19PC9tYXQtb3B0aW9uPlxuICAgIDwvbWF0LXNlbGVjdD5cbjwvbWF0LWZvcm0tZmllbGQ+XG5cbjwhLS0gc2VsZWN0IGFwdCBjb21wb25lbnQgZm9yIHZhbHVlIHNwZWNpZmljYXRpb24gdXNpbmcgYSBzd2l0Y2ggY2FzZSBzdGF0ZW1lbnQtLT5cbjxzcGFuXG4gICAgKm5nSWY9XCJjb21wYXJpc29uT3BlcmF0b3JTZWxlY3RlZCAhPT0gdW5kZWZpbmVkICYmIGNvbXBhcmlzb25PcGVyYXRvclNlbGVjdGVkICE9PSBudWxsICYmIGNvbXBhcmlzb25PcGVyYXRvclNlbGVjdGVkLmdldENsYXNzTmFtZSgpICE9ICdFeGlzdHMnXCJcbiAgICBbbmdTd2l0Y2hdPVwicHJvcGVydHlWYWx1ZVR5cGVcIj5cbiAgPGJvb2xlYW4tdmFsdWUgI3Byb3BlcnR5VmFsdWUgW2Zvcm1Hcm91cF09XCJmb3JtXCIgKm5nU3dpdGNoQ2FzZT1cIktub3JhQ29uc3RhbnRzLkJvb2xlYW5WYWx1ZVwiPjwvYm9vbGVhbi12YWx1ZT5cbiAgPGRhdGUtdmFsdWUgI3Byb3BlcnR5VmFsdWUgW2Zvcm1Hcm91cF09XCJmb3JtXCIgKm5nU3dpdGNoQ2FzZT1cIktub3JhQ29uc3RhbnRzLkRhdGVWYWx1ZVwiPjwvZGF0ZS12YWx1ZT5cbiAgPGRlY2ltYWwtdmFsdWUgI3Byb3BlcnR5VmFsdWUgW2Zvcm1Hcm91cF09XCJmb3JtXCIgKm5nU3dpdGNoQ2FzZT1cIktub3JhQ29uc3RhbnRzLkRlY2ltYWxWYWx1ZVwiPjwvZGVjaW1hbC12YWx1ZT5cbiAgPGludGVnZXItdmFsdWUgI3Byb3BlcnR5VmFsdWUgW2Zvcm1Hcm91cF09XCJmb3JtXCIgKm5nU3dpdGNoQ2FzZT1cIktub3JhQ29uc3RhbnRzLkludFZhbHVlXCI+PC9pbnRlZ2VyLXZhbHVlPlxuICA8bGluay12YWx1ZSAjcHJvcGVydHlWYWx1ZSBbZm9ybUdyb3VwXT1cImZvcm1cIiBbcmVzdHJpY3RSZXNvdXJjZUNsYXNzXT1cInByb3BlcnR5Lm9iamVjdFR5cGVcIlxuICAgICAgICAgICAgICAqbmdTd2l0Y2hDYXNlPVwiS25vcmFDb25zdGFudHMuUmVzb3VyY2VcIj48L2xpbmstdmFsdWU+XG4gIDx0ZXh0LXZhbHVlICNwcm9wZXJ0eVZhbHVlIFtmb3JtR3JvdXBdPVwiZm9ybVwiICpuZ1N3aXRjaENhc2U9XCJLbm9yYUNvbnN0YW50cy5UZXh0VmFsdWVcIj48L3RleHQtdmFsdWU+XG4gIDx1cmktdmFsdWUgI3Byb3BlcnR5VmFsdWUgW2Zvcm1Hcm91cF09XCJmb3JtXCIgKm5nU3dpdGNoQ2FzZT1cIktub3JhQ29uc3RhbnRzLlVyaVZhbHVlXCI+PC91cmktdmFsdWU+XG5cbiAgICA8IS0tIFRPRE86IFJlc291cmNlOiBoYW5kbGUgbGlua2luZyBwcm9wZXJ0aWVzIHdpdGggdGFyZ2V0IGNsYXNzIHJlc3RyaWN0aW9uOiBhY2Nlc3MgcHJvcGVydHkgbWVtYmVyIHRvIGdldCBvYmplY3RDbGFzcyB2aWEgcHJvcGVydHkoKSBnZXR0ZXIgbWV0aG9kIC0tPlxuICA8c3BhbiAqbmdTd2l0Y2hEZWZhdWx0PVwiXCI+Tm90IHN1cHBvcnRlZCB7e3Byb3BlcnR5VmFsdWVUeXBlfX08L3NwYW4+XG48L3NwYW4+XG5gLFxuICAgIHN0eWxlczogW2Auc2VhcmNoLW9wZXJhdG9yLWZpZWxke21hcmdpbi1yaWdodDo4cHh9YF1cbn0pXG5leHBvcnQgY2xhc3MgU3BlY2lmeVByb3BlcnR5VmFsdWVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcyB7XG5cbiAgICBLbm9yYUNvbnN0YW50cyA9IEtub3JhQ29uc3RhbnRzO1xuXG4gICAgLy8gcGFyZW50IEZvcm1Hcm91cFxuICAgIEBJbnB1dCgpIGZvcm1Hcm91cDogRm9ybUdyb3VwO1xuXG4gICAgQFZpZXdDaGlsZCgncHJvcGVydHlWYWx1ZScpIHByb3BlcnR5VmFsdWVDb21wb25lbnQ6IFByb3BlcnR5VmFsdWU7XG5cbiAgICAvLyBzZXR0ZXIgbWV0aG9kIGZvciB0aGUgcHJvcGVydHkgY2hvc2VuIGJ5IHRoZSB1c2VyXG4gICAgQElucHV0KClcbiAgICBzZXQgcHJvcGVydHkocHJvcDogUHJvcGVydHkpIHtcbiAgICAgICAgdGhpcy5jb21wYXJpc29uT3BlcmF0b3JTZWxlY3RlZCA9IHVuZGVmaW5lZDsgLy8gcmVzZXQgdG8gaW5pdGlhbCBzdGF0ZVxuICAgICAgICB0aGlzLl9wcm9wZXJ0eSA9IHByb3A7XG4gICAgICAgIHRoaXMucmVzZXRDb21wYXJpc29uT3BlcmF0b3JzKCk7IC8vIHJlc2V0IGNvbXBhcmlzb24gb3BlcmF0b3JzIGZvciBnaXZlbiBwcm9wZXJ0eSAob3ZlcndyaXRpbmcgYW55IHByZXZpb3VzIHNlbGVjdGlvbilcbiAgICB9XG5cbiAgICAvLyBnZXR0ZXIgbWV0aG9kIGZvciB0aGlzLl9wcm9wZXJ0eVxuICAgIGdldCBwcm9wZXJ0eSgpOiBQcm9wZXJ0eSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wcm9wZXJ0eTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9wcm9wZXJ0eTogUHJvcGVydHk7XG5cbiAgICBmb3JtOiBGb3JtR3JvdXA7XG5cbiAgICAvLyBhdmFpbGFibGUgY29tcGFyaXNvbiBvcGVyYXRvcnMgZm9yIHRoZSBwcm9wZXJ0eVxuICAgIGNvbXBhcmlzb25PcGVyYXRvcnM6IEFycmF5PENvbXBhcmlzb25PcGVyYXRvcj4gPSBbXTtcblxuICAgIC8vIGNvbXBhcmlzb24gb3BlcmF0b3Igc2VsZWN0ZWQgYnkgdGhlIHVzZXJcbiAgICBjb21wYXJpc29uT3BlcmF0b3JTZWxlY3RlZDogQ29tcGFyaXNvbk9wZXJhdG9yO1xuXG4gICAgLy8gdGhlIHR5cGUgb2YgdGhlIHByb3BlcnR5XG4gICAgcHJvcGVydHlWYWx1ZVR5cGU7XG5cbiAgICBjb25zdHJ1Y3RvcihASW5qZWN0KEZvcm1CdWlsZGVyKSBwcml2YXRlIGZiOiBGb3JtQnVpbGRlcikge1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlc2V0cyB0aGUgY29tcGFyaXNvbiBvcGVyYXRvcnMgZm9yIHRoaXMuX3Byb3BlcnR5LlxuICAgICAqL1xuICAgIHJlc2V0Q29tcGFyaXNvbk9wZXJhdG9ycygpIHtcblxuICAgICAgICAvLyBkZXBlbmRpbmcgb24gb2JqZWN0IGNsYXNzLCBzZXQgY29tcGFyaXNvbiBvcGVyYXRvcnMgYW5kIHZhbHVlIGVudHJ5IGZpZWxkXG4gICAgICAgIGlmICh0aGlzLl9wcm9wZXJ0eS5pc0xpbmtQcm9wZXJ0eSkge1xuICAgICAgICAgICAgdGhpcy5wcm9wZXJ0eVZhbHVlVHlwZSA9IEtub3JhQ29uc3RhbnRzLlJlc291cmNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wcm9wZXJ0eVZhbHVlVHlwZSA9IHRoaXMuX3Byb3BlcnR5Lm9iamVjdFR5cGU7XG4gICAgICAgIH1cblxuICAgICAgICBzd2l0Y2ggKHRoaXMucHJvcGVydHlWYWx1ZVR5cGUpIHtcblxuICAgICAgICAgICAgY2FzZSBLbm9yYUNvbnN0YW50cy5UZXh0VmFsdWU6XG4gICAgICAgICAgICAgICAgdGhpcy5jb21wYXJpc29uT3BlcmF0b3JzID0gW25ldyBMaWtlKCksIG5ldyBNYXRjaCgpLCBuZXcgRXF1YWxzKCksIG5ldyBOb3RFcXVhbHMoKSwgbmV3IEV4aXN0cygpXTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSBLbm9yYUNvbnN0YW50cy5Cb29sZWFuVmFsdWU6XG4gICAgICAgICAgICBjYXNlIEtub3JhQ29uc3RhbnRzLlJlc291cmNlOlxuICAgICAgICAgICAgY2FzZSBLbm9yYUNvbnN0YW50cy5VcmlWYWx1ZTpcbiAgICAgICAgICAgIGNhc2UgS25vcmFDb25zdGFudHMuSW50ZXJ2YWxWYWx1ZTpcbiAgICAgICAgICAgICAgICB0aGlzLmNvbXBhcmlzb25PcGVyYXRvcnMgPSBbbmV3IEVxdWFscygpLCBuZXcgTm90RXF1YWxzKCksIG5ldyBFeGlzdHMoKV07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgS25vcmFDb25zdGFudHMuSW50VmFsdWU6XG4gICAgICAgICAgICBjYXNlIEtub3JhQ29uc3RhbnRzLkRlY2ltYWxWYWx1ZTpcbiAgICAgICAgICAgIGNhc2UgS25vcmFDb25zdGFudHMuRGF0ZVZhbHVlOlxuICAgICAgICAgICAgICAgIHRoaXMuY29tcGFyaXNvbk9wZXJhdG9ycyA9IFtuZXcgRXF1YWxzKCksIG5ldyBOb3RFcXVhbHMoKSwgbmV3IExlc3NUaGFuKCksIG5ldyBMZXNzVGhhbkVxdWFscygpLCBuZXcgR3JlYXRlclRoYW4oKSwgbmV3IEdyZWF0ZXJUaGFuRXF1YWxzKCksIG5ldyBFeGlzdHMoKV07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgS25vcmFDb25zdGFudHMuTGlzdFZhbHVlOlxuICAgICAgICAgICAgY2FzZSBLbm9yYUNvbnN0YW50cy5HZW9tVmFsdWU6XG4gICAgICAgICAgICBjYXNlIEtub3JhQ29uc3RhbnRzLkZpbGVWYWx1ZTpcbiAgICAgICAgICAgIGNhc2UgS25vcmFDb25zdGFudHMuQXVkaW9GaWxlVmFsdWU6XG4gICAgICAgICAgICBjYXNlIEtub3JhQ29uc3RhbnRzLlN0aWxsSW1hZ2VGaWxlVmFsdWU6XG4gICAgICAgICAgICBjYXNlIEtub3JhQ29uc3RhbnRzLkREREZpbGVWYWx1ZTpcbiAgICAgICAgICAgIGNhc2UgS25vcmFDb25zdGFudHMuTW92aW5nSW1hZ2VGaWxlVmFsdWU6XG4gICAgICAgICAgICBjYXNlIEtub3JhQ29uc3RhbnRzLlRleHRGaWxlVmFsdWU6XG4gICAgICAgICAgICBjYXNlIEtub3JhQ29uc3RhbnRzLkNvbG9yVmFsdWU6XG4gICAgICAgICAgICAgICAgdGhpcy5jb21wYXJpc29uT3BlcmF0b3JzID0gW25ldyBFeGlzdHMoKV07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0VSUk9SOiBVbnN1cHBvcnRlZCB2YWx1ZSB0eXBlICcgKyB0aGlzLl9wcm9wZXJ0eS5vYmplY3RUeXBlKTtcblxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHsgfVxuXG4gICAgbmdPbkNoYW5nZXMoKSB7XG5cbiAgICAgICAgLy8gYnVpbGQgYSBmb3JtIGZvciBjb21wYXJpc29uIG9wZXJhdG9yIHNlbGVjdGlvblxuICAgICAgICB0aGlzLmZvcm0gPSB0aGlzLmZiLmdyb3VwKHtcbiAgICAgICAgICAgIGNvbXBhcmlzb25PcGVyYXRvcjogW251bGwsIFZhbGlkYXRvcnMucmVxdWlyZWRdXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIHN0b3JlIGNvbXBhcmlzb24gb3BlcmF0b3Igd2hlbiBzZWxlY3RlZFxuICAgICAgICB0aGlzLmZvcm0udmFsdWVDaGFuZ2VzLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jb21wYXJpc29uT3BlcmF0b3JTZWxlY3RlZCA9IGRhdGEuY29tcGFyaXNvbk9wZXJhdG9yO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXNvbHZlZFByb21pc2UudGhlbigoKSA9PiB7XG5cbiAgICAgICAgICAgIC8vIHJlbW92ZSBmcm9tIHRoZSBwYXJlbnQgZm9ybSBncm91cCAoY2xlYW4gcmVzZXQpXG4gICAgICAgICAgICB0aGlzLmZvcm1Hcm91cC5yZW1vdmVDb250cm9sKCdjb21wYXJpc29uT3BlcmF0b3InKTtcblxuICAgICAgICAgICAgLy8gYWRkIGZvcm0gdG8gdGhlIHBhcmVudCBmb3JtIGdyb3VwXG4gICAgICAgICAgICB0aGlzLmZvcm1Hcm91cC5hZGRDb250cm9sKCdjb21wYXJpc29uT3BlcmF0b3InLCB0aGlzLmZvcm0pO1xuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIHNwZWNpZmllZCBjb21wYXJpc29uIG9wZXJhdG9yIGFuZCB2YWx1ZSBmb3IgdGhlIHByb3BlcnR5LlxuICAgICAqXG4gICAgICogcmV0dXJucyB7Q29tcGFyaXNvbk9wZXJhdG9yQW5kVmFsdWV9IHRoZSBjb21wYXJpc29uIG9wZXJhdG9yIGFuZCB0aGUgc3BlY2lmaWVkIHZhbHVlXG4gICAgICovXG4gICAgZ2V0Q29tcGFyaXNvbk9wZXJhdG9yQW5kVmFsdWVMaXRlcmFsRm9yUHJvcGVydHkoKTogQ29tcGFyaXNvbk9wZXJhdG9yQW5kVmFsdWUge1xuICAgICAgICAvLyByZXR1cm4gdmFsdWUgKGxpdGVyYWwgb3IgSVJJKSBmcm9tIHRoZSBjaGlsZCBjb21wb25lbnRcbiAgICAgICAgbGV0IHZhbHVlOiBWYWx1ZTtcblxuICAgICAgICAvLyBjb21wYXJpc29uIG9wZXJhdG9yICdFeGlzdHMnIGRvZXMgbm90IHJlcXVpcmUgYSB2YWx1ZVxuICAgICAgICBpZiAodGhpcy5jb21wYXJpc29uT3BlcmF0b3JTZWxlY3RlZC5nZXRDbGFzc05hbWUoKSAhPT0gJ0V4aXN0cycpIHtcbiAgICAgICAgICAgIHZhbHVlID0gdGhpcy5wcm9wZXJ0eVZhbHVlQ29tcG9uZW50LmdldFZhbHVlKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyByZXR1cm4gdGhlIGNvbXBhcmlzb24gb3BlcmF0b3IgYW5kIHRoZSBzcGVjaWZpZWQgdmFsdWVcbiAgICAgICAgcmV0dXJuIG5ldyBDb21wYXJpc29uT3BlcmF0b3JBbmRWYWx1ZSh0aGlzLmNvbXBhcmlzb25PcGVyYXRvclNlbGVjdGVkLCB2YWx1ZSk7XG5cbiAgICB9XG5cbn1cblxuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBJbmplY3QsIElucHV0LCBPbkRlc3Ryb3ksIE9uSW5pdCwgVmlld0NoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICAgIENhcmRpbmFsaXR5LFxuICAgIENhcmRpbmFsaXR5T2NjdXJyZW5jZSxcbiAgICBDb21wYXJpc29uT3BlcmF0b3JBbmRWYWx1ZSxcbiAgICBQcm9wZXJ0aWVzLFxuICAgIFByb3BlcnR5LFxuICAgIFByb3BlcnR5V2l0aFZhbHVlLFxuICAgIFJlc291cmNlQ2xhc3Ncbn0gZnJvbSAnQGtub3JhL2NvcmUnO1xuaW1wb3J0IHsgRm9ybUJ1aWxkZXIsIEZvcm1Hcm91cCwgVmFsaWRhdG9ycyB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IFNwZWNpZnlQcm9wZXJ0eVZhbHVlQ29tcG9uZW50IH0gZnJvbSAnLi9zcGVjaWZ5LXByb3BlcnR5LXZhbHVlL3NwZWNpZnktcHJvcGVydHktdmFsdWUuY29tcG9uZW50JztcblxuXG4vLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy80NTY2MTAxMC9keW5hbWljLW5lc3RlZC1yZWFjdGl2ZS1mb3JtLWV4cHJlc3Npb25jaGFuZ2VkYWZ0ZXJpdGhhc2JlZW5jaGVja2VkZXJyb3JcbmNvbnN0IHJlc29sdmVkUHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZShudWxsKTtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdrdWktc2VsZWN0LXByb3BlcnR5JyxcbiAgICB0ZW1wbGF0ZTogYDxtYXQtZm9ybS1maWVsZCBjbGFzcz1cInNlYXJjaC1wcm9wZXJ0eS1maWVsZFwiICpuZ0lmPVwicHJvcGVydGllc0FzQXJyYXk/Lmxlbmd0aCA+IDBcIj5cbiAgPG1hdC1zZWxlY3QgcGxhY2Vob2xkZXI9XCJQcm9wZXJ0aWVzXCIgW2Zvcm1Db250cm9sXT1cImZvcm0uY29udHJvbHNbJ3Byb3BlcnR5J11cIj5cbiAgICA8bWF0LW9wdGlvbiAqbmdGb3I9XCJsZXQgcHJvcCBvZiBwcm9wZXJ0aWVzQXNBcnJheVwiIFt2YWx1ZV09XCJwcm9wLmlkXCI+e3sgcHJvcC5sYWJlbCB9fTwvbWF0LW9wdGlvbj5cbiAgPC9tYXQtc2VsZWN0PlxuPC9tYXQtZm9ybS1maWVsZD5cblxuPGt1aS1zcGVjaWZ5LXByb3BlcnR5LXZhbHVlICNzcGVjaWZ5UHJvcGVydHlWYWx1ZSBbZm9ybUdyb3VwXT1cImZvcm1cIiAqbmdJZj1cInByb3BlcnR5U2VsZWN0ZWQgIT09IHVuZGVmaW5lZFwiIFtwcm9wZXJ0eV09XCJwcm9wZXJ0eVNlbGVjdGVkXCI+PC9rdWktc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZT5cblxuPG1hdC1jaGVja2JveCBtYXRUb29sdGlwPVwiU29ydCBjcml0ZXJpb25cIiAqbmdJZj1cInByb3BlcnR5U2VsZWN0ZWQgIT09IHVuZGVmaW5lZCAmJiBzb3J0Q3JpdGVyaW9uKClcIiBbZm9ybUNvbnRyb2xdPVwiZm9ybS5jb250cm9sc1snaXNTb3J0Q3JpdGVyaW9uJ11cIj48L21hdC1jaGVja2JveD5gLFxuICAgIHN0eWxlczogW2Auc2VhcmNoLXByb3BlcnR5LWZpZWxke21hcmdpbi1yaWdodDo4cHh9YF1cbn0pXG5leHBvcnQgY2xhc3MgU2VsZWN0UHJvcGVydHlDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG5cbiAgICAvLyBwYXJlbnQgRm9ybUdyb3VwXG4gICAgQElucHV0KCkgZm9ybUdyb3VwOiBGb3JtR3JvdXA7XG5cbiAgICAvLyBpbmRleCBvZiB0aGUgZ2l2ZW4gcHJvcGVydHkgKHVuaXF1ZSlcbiAgICBASW5wdXQoKSBpbmRleDogbnVtYmVyO1xuXG4gICAgLy8gc2V0dGVyIG1ldGhvZCBmb3IgcHJvcGVydGllcyB3aGVuIGJlaW5nIHVwZGF0ZWQgYnkgcGFyZW50IGNvbXBvbmVudFxuICAgIEBJbnB1dCgpXG4gICAgc2V0IHByb3BlcnRpZXModmFsdWU6IFByb3BlcnRpZXMpIHtcbiAgICAgICAgdGhpcy5wcm9wZXJ0eVNlbGVjdGVkID0gdW5kZWZpbmVkOyAvLyByZXNldCBzZWxlY3RlZCBwcm9wZXJ0eSAob3ZlcndyaXRpbmcgYW55IHByZXZpb3VzIHNlbGVjdGlvbilcbiAgICAgICAgdGhpcy5fcHJvcGVydGllcyA9IHZhbHVlO1xuICAgICAgICB0aGlzLnVwZGF0ZVByb3BlcnRpZXNBcnJheSgpO1xuICAgIH1cblxuICAgIGdldCBwcm9wZXJ0aWVzKCkge1xuICAgICAgIHJldHVybiB0aGlzLl9wcm9wZXJ0aWVzO1xuICAgIH1cblxuICAgIF9hY3RpdmVSZXNvdXJjZUNsYXNzOiBSZXNvdXJjZUNsYXNzO1xuXG4gICAgLy8gc2V0dGVyIG1ldGhvZCBmb3Igc2VsZWN0ZWQgcmVzb3VyY2UgY2xhc3NcbiAgICBASW5wdXQoKVxuICAgIHNldCBhY3RpdmVSZXNvdXJjZUNsYXNzKHZhbHVlOiBSZXNvdXJjZUNsYXNzKSB7XG4gICAgICAgIHRoaXMuX2FjdGl2ZVJlc291cmNlQ2xhc3MgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICAvLyByZWZlcmVuY2UgdG8gY2hpbGQgY29tcG9uZW50OiBjb21iaW5hdGlvbiBvZiBjb21wYXJpc29uIG9wZXJhdG9yIGFuZCB2YWx1ZSBmb3IgY2hvc2VuIHByb3BlcnR5XG4gICAgQFZpZXdDaGlsZCgnc3BlY2lmeVByb3BlcnR5VmFsdWUnKSBzcGVjaWZ5UHJvcGVydHlWYWx1ZTogU3BlY2lmeVByb3BlcnR5VmFsdWVDb21wb25lbnQ7XG5cbiAgICAvLyBwcm9wZXJ0aWVzIHRoYXQgY2FuIGJlIHNlbGVjdGVkIGZyb21cbiAgICBwcml2YXRlIF9wcm9wZXJ0aWVzOiBQcm9wZXJ0aWVzO1xuXG4gICAgLy8gcHJvcGVydGllcyBhcyBhbiBBcnJheSBzdHJ1Y3R1cmUgKGJhc2VkIG9uIHRoaXMucHJvcGVydGllcylcbiAgICBwcm9wZXJ0aWVzQXNBcnJheTogQXJyYXk8UHJvcGVydHk+O1xuXG4gICAgLy8gcmVwcmVzZW50cyB0aGUgY3VycmVudGx5IHNlbGVjdGVkIHByb3BlcnR5XG4gICAgcHJvcGVydHlTZWxlY3RlZDogUHJvcGVydHk7XG5cbiAgICBmb3JtOiBGb3JtR3JvdXA7XG5cbiAgICAvLyB1bmlxdWUgbmFtZSBmb3IgdGhpcyBwcm9wZXJ0eSB0byBiZSB1c2VkIGluIHRoZSBwYXJlbnQgRm9ybUdyb3VwXG4gICAgcHJvcEluZGV4OiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvcihASW5qZWN0KEZvcm1CdWlsZGVyKSBwcml2YXRlIGZiOiBGb3JtQnVpbGRlcikge1xuXG4gICAgfVxuXG4gICAgbmdPbkluaXQoKSB7XG5cbiAgICAgICAgLy8gYnVpbGQgYSBmb3JtIGZvciB0aGUgcHJvcGVydHkgc2VsZWN0aW9uXG4gICAgICAgIHRoaXMuZm9ybSA9IHRoaXMuZmIuZ3JvdXAoe1xuICAgICAgICAgICAgcHJvcGVydHk6IFtudWxsLCBWYWxpZGF0b3JzLnJlcXVpcmVkXSxcbiAgICAgICAgICAgIGlzU29ydENyaXRlcmlvbjogW2ZhbHNlLCBWYWxpZGF0b3JzLnJlcXVpcmVkXVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyB1cGRhdGUgdGhlIHNlbGVjdGVkIHByb3BlcnR5XG4gICAgICAgIHRoaXMuZm9ybS52YWx1ZUNoYW5nZXMuc3Vic2NyaWJlKChkYXRhKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwcm9wSXJpID0gZGF0YS5wcm9wZXJ0eTtcbiAgICAgICAgICAgIHRoaXMucHJvcGVydHlTZWxlY3RlZCA9IHRoaXMuX3Byb3BlcnRpZXNbcHJvcElyaV07XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJlc29sdmVkUHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMucHJvcEluZGV4ID0gJ3Byb3BlcnR5JyArIHRoaXMuaW5kZXg7XG5cbiAgICAgICAgICAgIC8vIGFkZCBmb3JtIHRvIHRoZSBwYXJlbnQgZm9ybSBncm91cFxuICAgICAgICAgICAgdGhpcy5mb3JtR3JvdXAuYWRkQ29udHJvbCh0aGlzLnByb3BJbmRleCwgdGhpcy5mb3JtKTtcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcblxuICAgICAgICAvLyByZW1vdmUgZm9ybSBmcm9tIHRoZSBwYXJlbnQgZm9ybSBncm91cFxuICAgICAgICByZXNvbHZlZFByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZvcm1Hcm91cC5yZW1vdmVDb250cm9sKHRoaXMucHJvcEluZGV4KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW5kaWNhdGVzIGlmIHByb3BlcnR5IGNhbiBiZSB1c2VkIGFzIGEgc29ydCBjcml0ZXJpb24uXG4gICAgICogUHJvcGVydHkgaGFzIHRvIGhhdmUgY2FyZGluYWxpdHkgb3IgbWF4IGNhcmRpbmFsaXR5IDEgZm9yIHRoZSBjaG9zZW4gcmVzb3VyY2UgY2xhc3MuXG4gICAgICpcbiAgICAgKiBXZSBjYW5ub3Qgc29ydCBieSBwcm9wZXJ0aWVzIHdob3NlIGNhcmRpbmFsaXR5IGlzIGdyZWF0ZXIgdGhhbiAxLlxuICAgICAqIFJldHVybiBib29sZWFuXG4gICAgICovXG4gICAgc29ydENyaXRlcmlvbigpIHtcblxuICAgICAgICAvLyBjaGVjayBpZiBhIHJlc291cmNlIGNsYXNzIGlzIHNlbGVjdGVkIGFuZCBpZiB0aGUgcHJvcGVydHkncyBjYXJkaW5hbGl0eSBpcyAxIGZvciB0aGUgc2VsZWN0ZWQgcmVzb3VyY2UgY2xhc3NcbiAgICAgICAgaWYgKHRoaXMuX2FjdGl2ZVJlc291cmNlQ2xhc3MgIT09IHVuZGVmaW5lZCAmJiB0aGlzLnByb3BlcnR5U2VsZWN0ZWQgIT09IHVuZGVmaW5lZCAmJiAhdGhpcy5wcm9wZXJ0eVNlbGVjdGVkLmlzTGlua1Byb3BlcnR5KSB7XG5cbiAgICAgICAgICAgIGNvbnN0IGNhcmRpbmFsaXRpZXM6IENhcmRpbmFsaXR5W10gPSB0aGlzLl9hY3RpdmVSZXNvdXJjZUNsYXNzLmNhcmRpbmFsaXRpZXMuZmlsdGVyKFxuICAgICAgICAgICAgICAgIChjYXJkOiBDYXJkaW5hbGl0eSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyBjYXJkaW5hbGl0eSAxIG9yIG1heCBvY2N1cnJlbmNlIDFcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhcmQucHJvcGVydHkgPT09IHRoaXMucHJvcGVydHlTZWxlY3RlZC5pZFxuICAgICAgICAgICAgICAgICAgICAgICAgJiYgY2FyZC52YWx1ZSA9PT0gMVxuICAgICAgICAgICAgICAgICAgICAgICAgJiYgKGNhcmQub2NjdXJyZW5jZSA9PT0gQ2FyZGluYWxpdHlPY2N1cnJlbmNlLmNhcmQgfHwgY2FyZC5vY2N1cnJlbmNlID09PSBDYXJkaW5hbGl0eU9jY3VycmVuY2UubWF4Q2FyZClcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIHJldHVybiBjYXJkaW5hbGl0aWVzLmxlbmd0aCA9PT0gMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVXBkYXRlcyB0aGUgcHJvcGVydGllcyBhcnJheSB0aGF0IGlzIGFjY2Vzc2VkIGJ5IHRoZSB0ZW1wbGF0ZS5cbiAgICAgKi9cbiAgICBwcml2YXRlIHVwZGF0ZVByb3BlcnRpZXNBcnJheSgpIHtcblxuICAgICAgICAvLyByZXByZXNlbnQgdGhlIHByb3BlcnRpZXMgYXMgYW4gYXJyYXkgdG8gYmUgYWNjZXNzZWQgYnkgdGhlIHRlbXBsYXRlXG4gICAgICAgIGNvbnN0IHByb3BzQXJyYXkgPSBbXTtcblxuICAgICAgICBmb3IgKGNvbnN0IHByb3BJcmkgaW4gdGhpcy5fcHJvcGVydGllcykge1xuICAgICAgICAgICAgaWYgKHRoaXMuX3Byb3BlcnRpZXMuaGFzT3duUHJvcGVydHkocHJvcElyaSkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwcm9wID0gdGhpcy5fcHJvcGVydGllc1twcm9wSXJpXTtcblxuICAgICAgICAgICAgICAgIC8vIG9ubHkgbGlzdCBlZGl0YWJsZSBwcm9wcyB0aGF0IGFyZSBub3QgbGluayB2YWx1ZSBwcm9wc1xuICAgICAgICAgICAgICAgIGlmIChwcm9wLmlzRWRpdGFibGUgJiYgIXByb3AuaXNMaW5rVmFsdWVQcm9wZXJ0eSkge1xuICAgICAgICAgICAgICAgICAgICBwcm9wc0FycmF5LnB1c2godGhpcy5fcHJvcGVydGllc1twcm9wSXJpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5wcm9wZXJ0aWVzQXNBcnJheSA9IHByb3BzQXJyYXk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgc2VsZWN0ZWQgcHJvcGVydHkgd2l0aCB0aGUgc3BlY2lmaWVkIHZhbHVlLlxuICAgICAqL1xuICAgIGdldFByb3BlcnR5U2VsZWN0ZWRXaXRoVmFsdWUoKTogUHJvcGVydHlXaXRoVmFsdWUge1xuXG4gICAgICAgIGNvbnN0IHByb3BWYWw6IENvbXBhcmlzb25PcGVyYXRvckFuZFZhbHVlID0gdGhpcy5zcGVjaWZ5UHJvcGVydHlWYWx1ZS5nZXRDb21wYXJpc29uT3BlcmF0b3JBbmRWYWx1ZUxpdGVyYWxGb3JQcm9wZXJ0eSgpO1xuXG4gICAgICAgIGxldCBpc1NvcnRDcml0ZXJpb24gPSBmYWxzZTtcblxuICAgICAgICAvLyBvbmx5IG5vbiBsaW5raW5nIHByb3BlcnRpZXMgY2FuIGJlIHVzZWQgZm9yIHNvcnRpbmdcbiAgICAgICAgaWYgKCF0aGlzLnByb3BlcnR5U2VsZWN0ZWQuaXNMaW5rUHJvcGVydHkpIHtcbiAgICAgICAgICAgIGlzU29ydENyaXRlcmlvbiA9IHRoaXMuZm9ybS52YWx1ZS5pc1NvcnRDcml0ZXJpb247XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IFByb3BlcnR5V2l0aFZhbHVlKHRoaXMucHJvcGVydHlTZWxlY3RlZCwgcHJvcFZhbCwgaXNTb3J0Q3JpdGVyaW9uKTtcblxuICAgIH1cblxuXG59XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIEluamVjdCwgSW5wdXQsIE9uRGVzdHJveSwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBGb3JtQnVpbGRlciwgRm9ybUdyb3VwLCBWYWxpZGF0b3JzIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgS25vcmFDb25zdGFudHMsIFByb3BlcnR5VmFsdWUsIFZhbHVlLCBWYWx1ZUxpdGVyYWwgfSBmcm9tICdAa25vcmEvY29yZSc7XG5cbi8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzQ1NjYxMDEwL2R5bmFtaWMtbmVzdGVkLXJlYWN0aXZlLWZvcm0tZXhwcmVzc2lvbmNoYW5nZWRhZnRlcml0aGFzYmVlbmNoZWNrZWRlcnJvclxuY29uc3QgcmVzb2x2ZWRQcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKG51bGwpO1xuXG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnYm9vbGVhbi12YWx1ZScsXG4gICAgdGVtcGxhdGU6IGA8bWF0LWNoZWNrYm94IFtmb3JtQ29udHJvbF09XCJmb3JtLmNvbnRyb2xzWydib29sZWFuVmFsdWUnXVwiPjwvbWF0LWNoZWNrYm94PlxuYCxcbiAgICBzdHlsZXM6IFtgYF1cbn0pXG5leHBvcnQgY2xhc3MgQm9vbGVhblZhbHVlQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3ksIFByb3BlcnR5VmFsdWUge1xuXG4gICAgLy8gcGFyZW50IEZvcm1Hcm91cFxuICAgIEBJbnB1dCgpIGZvcm1Hcm91cDogRm9ybUdyb3VwO1xuXG4gICAgdHlwZSA9IEtub3JhQ29uc3RhbnRzLkJvb2xlYW5WYWx1ZTtcblxuICAgIGZvcm06IEZvcm1Hcm91cDtcblxuICAgIGNvbnN0cnVjdG9yKEBJbmplY3QoRm9ybUJ1aWxkZXIpIHByaXZhdGUgZmI6IEZvcm1CdWlsZGVyKSB7XG5cbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHtcblxuICAgICAgICB0aGlzLmZvcm0gPSB0aGlzLmZiLmdyb3VwKHtcbiAgICAgICAgICAgIGJvb2xlYW5WYWx1ZTogW2ZhbHNlLCBWYWxpZGF0b3JzLmNvbXBvc2UoW1ZhbGlkYXRvcnMucmVxdWlyZWRdKV1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmVzb2x2ZWRQcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgLy8gYWRkIGZvcm0gdG8gdGhlIHBhcmVudCBmb3JtIGdyb3VwXG4gICAgICAgICAgICB0aGlzLmZvcm1Hcm91cC5hZGRDb250cm9sKCdwcm9wVmFsdWUnLCB0aGlzLmZvcm0pO1xuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCkge1xuXG4gICAgICAgIC8vIHJlbW92ZSBmb3JtIGZyb20gdGhlIHBhcmVudCBmb3JtIGdyb3VwXG4gICAgICAgIHJlc29sdmVkUHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZm9ybUdyb3VwLnJlbW92ZUNvbnRyb2woJ3Byb3BWYWx1ZScpO1xuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIGdldFZhbHVlKCk6IFZhbHVlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWYWx1ZUxpdGVyYWwoU3RyaW5nKHRoaXMuZm9ybS52YWx1ZS5ib29sZWFuVmFsdWUpLCBLbm9yYUNvbnN0YW50cy54c2RCb29sZWFuKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIERpcmVjdGl2ZSwgSG9zdCwgSW5qZWN0LCBJbnB1dCwgT25EZXN0cm95LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEZvcm1CdWlsZGVyLCBGb3JtR3JvdXAsIFZhbGlkYXRvcnMgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBLbm9yYUNvbnN0YW50cywgUHJvcGVydHlWYWx1ZSwgVmFsdWUsIFZhbHVlTGl0ZXJhbCB9IGZyb20gJ0Brbm9yYS9jb3JlJztcbmltcG9ydCB7IEdyZWdvcmlhbkNhbGVuZGFyRGF0ZSwgSkROQ29udmVydGlibGVDYWxlbmRhciwgSkROUGVyaW9kIH0gZnJvbSAnamRuY29udmVydGlibGVjYWxlbmRhcic7XG5pbXBvcnQgeyBEYXRlQWRhcHRlciwgTUFUX0RBVEVfTE9DQUxFLCBNYXRDYWxlbmRhciB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsJztcbmltcG9ydCB7IEpETkNvbnZlcnRpYmxlQ2FsZW5kYXJEYXRlQWRhcHRlciB9IGZyb20gJ2pkbmNvbnZlcnRpYmxlY2FsZW5kYXJkYXRlYWRhcHRlcic7XG5cbi8qKiBDdXN0b20gaGVhZGVyIGNvbXBvbmVudCBjb250YWluaW5nIGEgY2FsZW5kYXIgZm9ybWF0IHN3aXRjaGVyICovXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ2t1aS1jYWxlbmRhci1oZWFkZXInLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICA8bWF0LXNlbGVjdCBwbGFjZWhvbGRlcj1cIkNhbGVuZGFyIEZvcm1hdFwiIFtmb3JtQ29udHJvbF09XCJmb3JtLmNvbnRyb2xzWydjYWxlbmRhciddXCI+XG4gICAgICAgIDxtYXQtb3B0aW9uICpuZ0Zvcj1cImxldCBjYWwgb2Ygc3VwcG9ydGVkQ2FsZW5kYXJGb3JtYXRzXCIgW3ZhbHVlXT1cImNhbFwiPnt7Y2FsfX08L21hdC1vcHRpb24+XG4gICAgICA8L21hdC1zZWxlY3Q+XG4gICAgICA8bWF0LWNhbGVuZGFyLWhlYWRlcj48L21hdC1jYWxlbmRhci1oZWFkZXI+XG4gICAgYCxcbiAgICBzdHlsZXM6IFtdXG59KVxuZXhwb3J0IGNsYXNzIEhlYWRlckNvbXBvbmVudDxEPiBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gICAgY29uc3RydWN0b3IoQEhvc3QoKSBwcml2YXRlIF9jYWxlbmRhcjogTWF0Q2FsZW5kYXI8SkROQ29udmVydGlibGVDYWxlbmRhcj4sXG4gICAgICAgIHByaXZhdGUgX2RhdGVBZGFwdGVyOiBEYXRlQWRhcHRlcjxKRE5Db252ZXJ0aWJsZUNhbGVuZGFyPixcbiAgICAgICAgQEluamVjdChGb3JtQnVpbGRlcikgcHJpdmF0ZSBmYjogRm9ybUJ1aWxkZXIpIHtcbiAgICB9XG5cbiAgICBmb3JtOiBGb3JtR3JvdXA7XG5cbiAgICAvLyBhIGxpc3Qgb2Ygc3VwcG9ydGVkIGNhbGVuZGFyIGZvcm1hdHMgKEdyZWdvcmlhbiBhbmQgSnVsaWFuKVxuICAgIHN1cHBvcnRlZENhbGVuZGFyRm9ybWF0cyA9IEpETkNvbnZlcnRpYmxlQ2FsZW5kYXIuc3VwcG9ydGVkQ2FsZW5kYXJzO1xuXG4gICAgLy8gdGhlIGN1cnJlbnRseSBhY3RpdmUgY2FsZW5kYXIgZm9ybWF0XG4gICAgYWN0aXZlRm9ybWF0O1xuXG4gICAgbmdPbkluaXQoKSB7XG5cbiAgICAgICAgLy8gZ2V0IHRoZSBjdXJyZW50bHkgYWN0aXZlIGNhbGVuZGFyIGZvcm1hdCBmcm9tIHRoZSBkYXRlIGFkYXB0ZXJcbiAgICAgICAgaWYgKHRoaXMuX2RhdGVBZGFwdGVyIGluc3RhbmNlb2YgSkROQ29udmVydGlibGVDYWxlbmRhckRhdGVBZGFwdGVyKSB7XG4gICAgICAgICAgICB0aGlzLmFjdGl2ZUZvcm1hdCA9IHRoaXMuX2RhdGVBZGFwdGVyLmFjdGl2ZUNhbGVuZGFyRm9ybWF0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2RhdGUgYWRhcHRlciBpcyBleHBlY3RlZCB0byBiZSBhbiBpbnN0YW5jZSBvZiBKRE5Db252ZXJ0aWJsZUNhbGVuZGFyRGF0ZUFkYXB0ZXInKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGJ1aWxkIGEgZm9ybSBmb3IgdGhlIGNhbGVuZGFyIGZvcm1hdCBzZWxlY3Rpb25cbiAgICAgICAgdGhpcy5mb3JtID0gdGhpcy5mYi5ncm91cCh7XG4gICAgICAgICAgICBjYWxlbmRhcjogW3RoaXMuYWN0aXZlRm9ybWF0LCBWYWxpZGF0b3JzLnJlcXVpcmVkXVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBkbyB0aGUgY29udmVyc2lvbiB3aGVuIHRoZSB1c2VyIHNlbGVjdHMgYW5vdGhlciBjYWxlbmRhciBmb3JtYXRcbiAgICAgICAgdGhpcy5mb3JtLnZhbHVlQ2hhbmdlcy5zdWJzY3JpYmUoKGRhdGEpID0+IHtcbiAgICAgICAgICAgIC8vIHBhc3MgdGhlIHRhcmdldCBjYWxlbmRhciBmb3JtYXQgdG8gdGhlIGNvbnZlcnNpb24gbWV0aG9kXG4gICAgICAgICAgICB0aGlzLmNvbnZlcnREYXRlKGRhdGEuY2FsZW5kYXIpO1xuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENvbnZlcnRzIHRoZSBkYXRlIGludG8gdGhlIHRhcmdldCBmb3JtYXQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gY2FsZW5kYXIgdGhlIHRhcmdldCBjYWxlbmRhciBmb3JtYXQuXG4gICAgICovXG4gICAgY29udmVydERhdGUoY2FsZW5kYXI6ICdHcmVnb3JpYW4nIHwgJ0p1bGlhbicpIHtcblxuICAgICAgICBpZiAodGhpcy5fZGF0ZUFkYXB0ZXIgaW5zdGFuY2VvZiBKRE5Db252ZXJ0aWJsZUNhbGVuZGFyRGF0ZUFkYXB0ZXIpIHtcblxuICAgICAgICAgICAgLy8gY29udmVydCB0aGUgZGF0ZSBpbnRvIHRoZSB0YXJnZXQgY2FsZW5kYXIgZm9ybWF0XG4gICAgICAgICAgICBjb25zdCBjb252ZXJ0ZWREYXRlID0gdGhpcy5fZGF0ZUFkYXB0ZXIuY29udmVydENhbGVuZGFyRm9ybWF0KHRoaXMuX2NhbGVuZGFyLmFjdGl2ZURhdGUsIGNhbGVuZGFyKTtcblxuICAgICAgICAgICAgLy8gc2V0IHRoZSBuZXcgZGF0ZVxuICAgICAgICAgICAgdGhpcy5fY2FsZW5kYXIuYWN0aXZlRGF0ZSA9IGNvbnZlcnRlZERhdGU7XG5cbiAgICAgICAgICAgIC8vIHNlbGVjdCB0aGUgbmV3IGRhdGUgaW4gdGhlIGRhdGVwaWNrZXIgVUlcbiAgICAgICAgICAgIHRoaXMuX2NhbGVuZGFyLl9kYXRlU2VsZWN0ZWQoY29udmVydGVkRGF0ZSk7XG5cbiAgICAgICAgICAgIC8vIHVwZGF0ZSB2aWV3IGFmdGVyIGNhbGVuZGFyIGZvcm1hdCBjb252ZXJzaW9uXG4gICAgICAgICAgICBjb25zdCB2aWV3ID0gdGhpcy5fY2FsZW5kYXIuY3VycmVudFZpZXcgPT09ICdtb250aCcgPyB0aGlzLl9jYWxlbmRhci5tb250aFZpZXcgOlxuICAgICAgICAgICAgICAgICh0aGlzLl9jYWxlbmRhci5jdXJyZW50VmlldyA9PT0gJ3llYXInID8gdGhpcy5fY2FsZW5kYXIueWVhclZpZXcgOiB0aGlzLl9jYWxlbmRhci5tdWx0aVllYXJWaWV3KTtcblxuICAgICAgICAgICAgdmlldy5uZ0FmdGVyQ29udGVudEluaXQoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdkYXRlIGFkYXB0ZXIgaXMgZXhwZWN0ZWQgdG8gYmUgYW4gaW5zdGFuY2Ugb2YgSkROQ29udmVydGlibGVDYWxlbmRhckRhdGVBZGFwdGVyJyk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIEhvc3QsIEluamVjdCwgSW5wdXQsIE9uRGVzdHJveSwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBGb3JtQnVpbGRlciwgRm9ybUdyb3VwLCBWYWxpZGF0b3JzIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5pbXBvcnQgeyBLbm9yYUNvbnN0YW50cywgUHJvcGVydHlWYWx1ZSwgVmFsdWUsIFZhbHVlTGl0ZXJhbCB9IGZyb20gJ0Brbm9yYS9jb3JlJztcbmltcG9ydCB7IEdyZWdvcmlhbkNhbGVuZGFyRGF0ZSwgSkROQ29udmVydGlibGVDYWxlbmRhciwgSkROUGVyaW9kIH0gZnJvbSAnamRuY29udmVydGlibGVjYWxlbmRhcic7XG5pbXBvcnQgeyBIZWFkZXJDb21wb25lbnQgfSBmcm9tICcuL2hlYWRlci1jYWxlbmRhci9oZWFkZXItY2FsZW5kYXIuY29tcG9uZW50JztcblxuLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNDU2NjEwMTAvZHluYW1pYy1uZXN0ZWQtcmVhY3RpdmUtZm9ybS1leHByZXNzaW9uY2hhbmdlZGFmdGVyaXRoYXNiZWVuY2hlY2tlZGVycm9yXG5jb25zdCByZXNvbHZlZFByb21pc2UgPSBQcm9taXNlLnJlc29sdmUobnVsbCk7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnZGF0ZS12YWx1ZScsXG4gICAgdGVtcGxhdGU6IGA8bWF0LWZvcm0tZmllbGQ+XG4gICAgPGt1aUpkbkRhdGVwaWNrZXI+XG4gICAgICAgIDxpbnB1dCBtYXRJbnB1dCBbbWF0RGF0ZXBpY2tlcl09XCJwaWNrZXJcIiBwbGFjZWhvbGRlcj1cIkNob29zZSBhIGRhdGVcIiBbZm9ybUNvbnRyb2xdPVwiZm9ybS5jb250cm9sc1snZGF0ZVZhbHVlJ11cIj5cbiAgICAgICAgPG1hdC1kYXRlcGlja2VyICNwaWNrZXIgW2NhbGVuZGFySGVhZGVyQ29tcG9uZW50XT1cImhlYWRlckNvbXBvbmVudFwiPjwvbWF0LWRhdGVwaWNrZXI+XG4gICAgPC9rdWlKZG5EYXRlcGlja2VyPlxuICAgIDxtYXQtZGF0ZXBpY2tlci10b2dnbGUgbWF0U3VmZml4IFtmb3JdPVwicGlja2VyXCI+PC9tYXQtZGF0ZXBpY2tlci10b2dnbGU+XG48L21hdC1mb3JtLWZpZWxkPmAsXG4gICAgc3R5bGVzOiBbYGBdXG59KVxuZXhwb3J0IGNsYXNzIERhdGVWYWx1ZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95LCBQcm9wZXJ0eVZhbHVlIHtcblxuICAgIC8vIHBhcmVudCBGb3JtR3JvdXBcbiAgICBASW5wdXQoKSBmb3JtR3JvdXA6IEZvcm1Hcm91cDtcblxuICAgIHR5cGUgPSBLbm9yYUNvbnN0YW50cy5EYXRlVmFsdWU7XG5cbiAgICBmb3JtOiBGb3JtR3JvdXA7XG5cbiAgICAvLyBjdXN0b20gaGVhZGVyIGZvciB0aGUgZGF0ZXBpY2tlclxuICAgIGhlYWRlckNvbXBvbmVudCA9IEhlYWRlckNvbXBvbmVudDtcblxuICAgIGNvbnN0cnVjdG9yKEBJbmplY3QoRm9ybUJ1aWxkZXIpIHByaXZhdGUgZmI6IEZvcm1CdWlsZGVyKSB7XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKSB7XG5cbiAgICAgICAgLy8gaW5pdCBkYXRlcGlja2VyXG4gICAgICAgIHRoaXMuZm9ybSA9IHRoaXMuZmIuZ3JvdXAoe1xuICAgICAgICAgICAgZGF0ZVZhbHVlOiBbbnVsbCwgVmFsaWRhdG9ycy5jb21wb3NlKFtWYWxpZGF0b3JzLnJlcXVpcmVkXSldXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuZm9ybS52YWx1ZUNoYW5nZXMuc3Vic2NyaWJlKChkYXRhKSA9PiB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhkYXRhLmRhdGVWYWx1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJlc29sdmVkUHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIC8vIGFkZCBmb3JtIHRvIHRoZSBwYXJlbnQgZm9ybSBncm91cFxuICAgICAgICAgICAgdGhpcy5mb3JtR3JvdXAuYWRkQ29udHJvbCgncHJvcFZhbHVlJywgdGhpcy5mb3JtKTtcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcblxuICAgICAgICAvLyByZW1vdmUgZm9ybSBmcm9tIHRoZSBwYXJlbnQgZm9ybSBncm91cFxuICAgICAgICByZXNvbHZlZFByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZvcm1Hcm91cC5yZW1vdmVDb250cm9sKCdwcm9wVmFsdWUnKTtcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBnZXRWYWx1ZSgpOiBWYWx1ZSB7XG5cbiAgICAgICAgY29uc3QgZGF0ZU9iajogSkROQ29udmVydGlibGVDYWxlbmRhciA9IHRoaXMuZm9ybS52YWx1ZS5kYXRlVmFsdWU7XG5cbiAgICAgICAgLy8gZ2V0IGNhbGVuZGFyIGZvcm1hdFxuICAgICAgICBjb25zdCBjYWxlbmRhckZvcm1hdCA9IGRhdGVPYmouY2FsZW5kYXJOYW1lO1xuICAgICAgICAvLyBnZXQgY2FsZW5kYXIgcGVyaW9kXG4gICAgICAgIGNvbnN0IGNhbGVuZGFyUGVyaW9kID0gZGF0ZU9iai50b0NhbGVuZGFyUGVyaW9kKCk7XG4gICAgICAgIC8vIGdldCB0aGUgZGF0ZVxuICAgICAgICBjb25zdCBkYXRlU3RyaW5nID0gYCR7Y2FsZW5kYXJGb3JtYXQudG9VcHBlckNhc2UoKX06JHtjYWxlbmRhclBlcmlvZC5wZXJpb2RTdGFydC55ZWFyfS0ke2NhbGVuZGFyUGVyaW9kLnBlcmlvZFN0YXJ0Lm1vbnRofS0ke2NhbGVuZGFyUGVyaW9kLnBlcmlvZFN0YXJ0LmRheX06JHtjYWxlbmRhclBlcmlvZC5wZXJpb2RFbmQueWVhcn0tJHtjYWxlbmRhclBlcmlvZC5wZXJpb2RFbmQubW9udGh9LSR7Y2FsZW5kYXJQZXJpb2QucGVyaW9kRW5kLmRheX1gO1xuXG4gICAgICAgIHJldHVybiBuZXcgVmFsdWVMaXRlcmFsKFN0cmluZyhkYXRlU3RyaW5nKSwgS25vcmFDb25zdGFudHMuRGF0ZVZhbHVlKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIEluamVjdCwgSW5wdXQsIE9uRGVzdHJveSwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBGb3JtQnVpbGRlciwgRm9ybUdyb3VwLCBWYWxpZGF0b3JzIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgS25vcmFDb25zdGFudHMsIFByb3BlcnR5VmFsdWUsIFZhbHVlLCBWYWx1ZUxpdGVyYWwgfSBmcm9tICdAa25vcmEvY29yZSc7XG5cbi8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzQ1NjYxMDEwL2R5bmFtaWMtbmVzdGVkLXJlYWN0aXZlLWZvcm0tZXhwcmVzc2lvbmNoYW5nZWRhZnRlcml0aGFzYmVlbmNoZWNrZWRlcnJvclxuY29uc3QgcmVzb2x2ZWRQcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKG51bGwpO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ2RlY2ltYWwtdmFsdWUnLFxuICAgIHRlbXBsYXRlOiBgPG1hdC1mb3JtLWZpZWxkPlxuICAgIDxpbnB1dCBtYXRJbnB1dCBbZm9ybUNvbnRyb2xdPVwiZm9ybS5jb250cm9sc1snZGVjaW1hbFZhbHVlJ11cIiBwbGFjZWhvbGRlcj1cIkRlY2ltYWwgdmFsdWVcIiB2YWx1ZT1cIlwiIHR5cGU9XCJudW1iZXJcIj5cbjwvbWF0LWZvcm0tZmllbGQ+XG5gLFxuICAgIHN0eWxlczogW2BgXVxufSlcbmV4cG9ydCBjbGFzcyBEZWNpbWFsVmFsdWVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgUHJvcGVydHlWYWx1ZSB7XG5cbiAgICAvLyBwYXJlbnQgRm9ybUdyb3VwXG4gICAgQElucHV0KCkgZm9ybUdyb3VwOiBGb3JtR3JvdXA7XG5cbiAgICB0eXBlID0gS25vcmFDb25zdGFudHMuRGVjaW1hbFZhbHVlO1xuXG4gICAgZm9ybTogRm9ybUdyb3VwO1xuXG4gICAgY29uc3RydWN0b3IoQEluamVjdChGb3JtQnVpbGRlcikgcHJpdmF0ZSBmYjogRm9ybUJ1aWxkZXIpIHtcbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHtcblxuICAgICAgICB0aGlzLmZvcm0gPSB0aGlzLmZiLmdyb3VwKHtcbiAgICAgICAgICAgIGRlY2ltYWxWYWx1ZTogW251bGwsIFZhbGlkYXRvcnMuY29tcG9zZShbVmFsaWRhdG9ycy5yZXF1aXJlZF0pXVxuICAgICAgICB9KTtcblxuICAgICAgICByZXNvbHZlZFByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAvLyBhZGQgZm9ybSB0byB0aGUgcGFyZW50IGZvcm0gZ3JvdXBcbiAgICAgICAgICAgIHRoaXMuZm9ybUdyb3VwLmFkZENvbnRyb2woJ3Byb3BWYWx1ZScsIHRoaXMuZm9ybSk7XG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG5cbiAgICAgICAgLy8gcmVtb3ZlIGZvcm0gZnJvbSB0aGUgcGFyZW50IGZvcm0gZ3JvdXBcbiAgICAgICAgcmVzb2x2ZWRQcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5mb3JtR3JvdXAucmVtb3ZlQ29udHJvbCgncHJvcFZhbHVlJyk7XG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgZ2V0VmFsdWUoKTogVmFsdWUge1xuXG4gICAgICAgIHJldHVybiBuZXcgVmFsdWVMaXRlcmFsKFN0cmluZyh0aGlzLmZvcm0udmFsdWUuZGVjaW1hbFZhbHVlKSwgS25vcmFDb25zdGFudHMueHNkRGVjaW1hbCk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBJbmplY3QsIElucHV0LCBPbkRlc3Ryb3ksIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRm9ybUJ1aWxkZXIsIEZvcm1Hcm91cCwgVmFsaWRhdG9ycyB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IEtub3JhQ29uc3RhbnRzLCBQcm9wZXJ0eVZhbHVlLCBWYWx1ZSwgVmFsdWVMaXRlcmFsIH0gZnJvbSAnQGtub3JhL2NvcmUnO1xuXG4vLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy80NTY2MTAxMC9keW5hbWljLW5lc3RlZC1yZWFjdGl2ZS1mb3JtLWV4cHJlc3Npb25jaGFuZ2VkYWZ0ZXJpdGhhc2JlZW5jaGVja2VkZXJyb3JcbmNvbnN0IHJlc29sdmVkUHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZShudWxsKTtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdpbnRlZ2VyLXZhbHVlJyxcbiAgICB0ZW1wbGF0ZTogYDxtYXQtZm9ybS1maWVsZD5cbiAgICA8aW5wdXQgbWF0SW5wdXQgW2Zvcm1Db250cm9sXT1cImZvcm0uY29udHJvbHNbJ2ludGVnZXJWYWx1ZSddXCIgcGxhY2Vob2xkZXI9XCJJbnRlZ2VyIHZhbHVlXCIgdmFsdWU9XCJcIiB0eXBlPVwibnVtYmVyXCI+XG48L21hdC1mb3JtLWZpZWxkPlxuYCxcbiAgICBzdHlsZXM6IFtgYF1cbn0pXG5leHBvcnQgY2xhc3MgSW50ZWdlclZhbHVlQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3ksIFByb3BlcnR5VmFsdWUge1xuXG4gICAgLy8gcGFyZW50IEZvcm1Hcm91cFxuICAgIEBJbnB1dCgpIGZvcm1Hcm91cDogRm9ybUdyb3VwO1xuXG4gICAgdHlwZSA9IEtub3JhQ29uc3RhbnRzLkludFZhbHVlO1xuXG4gICAgZm9ybTogRm9ybUdyb3VwO1xuXG4gICAgY29uc3RydWN0b3IoQEluamVjdChGb3JtQnVpbGRlcikgcHJpdmF0ZSBmYjogRm9ybUJ1aWxkZXIpIHtcblxuICAgIH1cblxuICAgIG5nT25Jbml0KCkge1xuXG4gICAgICAgIHRoaXMuZm9ybSA9IHRoaXMuZmIuZ3JvdXAoe1xuICAgICAgICAgICAgaW50ZWdlclZhbHVlOiBbbnVsbCwgVmFsaWRhdG9ycy5jb21wb3NlKFtWYWxpZGF0b3JzLnJlcXVpcmVkLCBWYWxpZGF0b3JzLnBhdHRlcm4oL14tP1xcZCskLyldKV0gLy8gb25seSBhbGxvdyBmb3IgaW50ZWdlciB2YWx1ZXMgKG5vIGZyYWN0aW9ucylcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmVzb2x2ZWRQcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgLy8gYWRkIGZvcm0gdG8gdGhlIHBhcmVudCBmb3JtIGdyb3VwXG4gICAgICAgICAgICB0aGlzLmZvcm1Hcm91cC5hZGRDb250cm9sKCdwcm9wVmFsdWUnLCB0aGlzLmZvcm0pO1xuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCkge1xuXG4gICAgICAgIC8vIHJlbW92ZSBmb3JtIGZyb20gdGhlIHBhcmVudCBmb3JtIGdyb3VwXG4gICAgICAgIHJlc29sdmVkUHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZm9ybUdyb3VwLnJlbW92ZUNvbnRyb2woJ3Byb3BWYWx1ZScpO1xuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIGdldFZhbHVlKCk6IFZhbHVlIHtcblxuICAgICAgICByZXR1cm4gbmV3IFZhbHVlTGl0ZXJhbChTdHJpbmcodGhpcy5mb3JtLnZhbHVlLmludGVnZXJWYWx1ZSksIEtub3JhQ29uc3RhbnRzLnhzZEludGVnZXIpO1xuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBJbmplY3QsIElucHV0LCBPbkRlc3Ryb3ksIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRm9ybUJ1aWxkZXIsIEZvcm1Db250cm9sLCBGb3JtR3JvdXAsIFZhbGlkYXRvcnMgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge1xuICAgIEFwaVNlcnZpY2VSZXN1bHQsXG4gICAgQ29udmVydEpTT05MRCxcbiAgICBJUkksXG4gICAgS25vcmFDb25zdGFudHMsXG4gICAgT250b2xvZ3lDYWNoZVNlcnZpY2UsXG4gICAgUHJvcGVydHlWYWx1ZSxcbiAgICBSZWFkUmVzb3VyY2UsXG4gICAgUmVhZFJlc291cmNlc1NlcXVlbmNlLFxuICAgIFNlYXJjaFNlcnZpY2UsXG4gICAgVmFsdWVcbn0gZnJvbSAnQGtub3JhL2NvcmUnO1xuXG5kZWNsYXJlIGxldCByZXF1aXJlOiBhbnk7IC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMzQ3MzAwMTAvYW5ndWxhcjItNS1taW51dGUtaW5zdGFsbC1idWctcmVxdWlyZS1pcy1ub3QtZGVmaW5lZFxuY29uc3QganNvbmxkID0gcmVxdWlyZSgnanNvbmxkJyk7XG5cbi8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzQ1NjYxMDEwL2R5bmFtaWMtbmVzdGVkLXJlYWN0aXZlLWZvcm0tZXhwcmVzc2lvbmNoYW5nZWRhZnRlcml0aGFzYmVlbmNoZWNrZWRlcnJvclxuY29uc3QgcmVzb2x2ZWRQcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKG51bGwpO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ2xpbmstdmFsdWUnLFxuICAgIHRlbXBsYXRlOiBgPG1hdC1mb3JtLWZpZWxkPlxuICAgIDxpbnB1dCBtYXRJbnB1dCBwbGFjZWhvbGRlcj1cInJlc291cmNlXCIgYXJpYS1sYWJlbD1cInJlc291cmNlXCIgW21hdEF1dG9jb21wbGV0ZV09XCJhdXRvXCIgW2Zvcm1Db250cm9sXT1cImZvcm0uY29udHJvbHNbJ3Jlc291cmNlJ11cIj5cbiAgICA8bWF0LWF1dG9jb21wbGV0ZSAjYXV0bz1cIm1hdEF1dG9jb21wbGV0ZVwiIFtkaXNwbGF5V2l0aF09XCJkaXNwbGF5UmVzb3VyY2VcIj5cbiAgICAgICAgPG1hdC1vcHRpb24gKm5nRm9yPVwibGV0IHJlcyBvZiByZXNvdXJjZXNcIiBbdmFsdWVdPVwicmVzXCI+XG4gICAgICAgICAgICB7e3Jlcz8ubGFiZWx9fVxuICAgICAgICA8L21hdC1vcHRpb24+XG4gICAgPC9tYXQtYXV0b2NvbXBsZXRlPlxuPC9tYXQtZm9ybS1maWVsZD5cbmAsXG4gICAgc3R5bGVzOiBbYGBdXG59KVxuZXhwb3J0IGNsYXNzIExpbmtWYWx1ZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95LCBQcm9wZXJ0eVZhbHVlIHtcblxuICAgIC8vIHBhcmVudCBGb3JtR3JvdXBcbiAgICBASW5wdXQoKSBmb3JtR3JvdXA6IEZvcm1Hcm91cDtcblxuICAgIHR5cGUgPSBLbm9yYUNvbnN0YW50cy5MaW5rVmFsdWU7XG5cbiAgICBmb3JtOiBGb3JtR3JvdXA7XG5cbiAgICByZXNvdXJjZXM6IFJlYWRSZXNvdXJjZVtdO1xuXG4gICAgcHJpdmF0ZSBfcmVzdHJpY3RUb1Jlc291cmNlQ2xhc3M6IHN0cmluZztcblxuICAgIEBJbnB1dCgpXG4gICAgc2V0IHJlc3RyaWN0UmVzb3VyY2VDbGFzcyh2YWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuX3Jlc3RyaWN0VG9SZXNvdXJjZUNsYXNzID0gdmFsdWU7XG4gICAgfVxuXG4gICAgZ2V0IHJlc3RyaWN0UmVzb3VyY2VDbGFzcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Jlc3RyaWN0VG9SZXNvdXJjZUNsYXNzO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKEBJbmplY3QoRm9ybUJ1aWxkZXIpIHByaXZhdGUgZmI6IEZvcm1CdWlsZGVyLCBwcml2YXRlIF9zZWFyY2hTZXJ2aWNlOiBTZWFyY2hTZXJ2aWNlLCBwcml2YXRlIF9jYWNoZVNlcnZpY2U6IE9udG9sb2d5Q2FjaGVTZXJ2aWNlKSB7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEaXNwbGF5cyBhIHNlbGVjdGVkIHJlc291cmNlIHVzaW5nIGl0cyBsYWJlbC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSByZXNvdXJjZSB0aGUgcmVzb3VyY2UgdG8gYmUgZGlzcGxheWVkIChvciBubyBzZWxlY3Rpb24geWV0KS5cbiAgICAgKiBAcmV0dXJuc1xuICAgICAqL1xuICAgIGRpc3BsYXlSZXNvdXJjZShyZXNvdXJjZTogUmVhZFJlc291cmNlIHwgbnVsbCkge1xuXG4gICAgICAgIC8vIG51bGwgaXMgdGhlIGluaXRpYWwgdmFsdWUgKG5vIHNlbGVjdGlvbiB5ZXQpXG4gICAgICAgIGlmIChyZXNvdXJjZSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc291cmNlLmxhYmVsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2VhcmNoIGZvciByZXNvdXJjZXMgd2hvc2UgbGFiZWxzIGNvbnRhaW4gdGhlIGdpdmVuIHNlYXJjaCB0ZXJtLCByZXN0cmljdGluZyB0byB0byB0aGUgZ2l2ZW4gcHJvcGVydGllcyBvYmplY3QgY29uc3RyYWludC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBzZWFyY2hUZXJtXG4gICAgICovXG4gICAgc2VhcmNoQnlMYWJlbChzZWFyY2hUZXJtOiBzdHJpbmcpIHtcblxuICAgICAgICAvLyBhdCBsZWFzdCAzIGNoYXJhY3RlcnMgYXJlIHJlcXVpcmVkXG4gICAgICAgIGlmIChzZWFyY2hUZXJtLmxlbmd0aCA+PSAzKSB7XG5cbiAgICAgICAgICAgIHRoaXMuX3NlYXJjaFNlcnZpY2Uuc2VhcmNoQnlMYWJlbChzZWFyY2hUZXJtLCB0aGlzLl9yZXN0cmljdFRvUmVzb3VyY2VDbGFzcykuc3Vic2NyaWJlKFxuICAgICAgICAgICAgICAgIChyZXN1bHQ6IEFwaVNlcnZpY2VSZXN1bHQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJvbWlzZXMgPSBqc29ubGQucHJvbWlzZXM7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbXBhY3QgSlNPTi1MRCB1c2luZyBhbiBlbXB0eSBjb250ZXh0OiBleHBhbmRzIGFsbCBJcmlzXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHByb21pc2UgPSBwcm9taXNlcy5jb21wYWN0KHJlc3VsdC5ib2R5LCB7fSk7XG5cbiAgICAgICAgICAgICAgICAgICAgcHJvbWlzZS50aGVuKChjb21wYWN0ZWQpID0+IHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzb3VyY2VTZXE6IFJlYWRSZXNvdXJjZXNTZXF1ZW5jZSA9IENvbnZlcnRKU09OTEQuY3JlYXRlUmVhZFJlc291cmNlc1NlcXVlbmNlRnJvbUpzb25MRChjb21wYWN0ZWQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc291cmNlcyA9IHJlc291cmNlU2VxLnJlc291cmNlcztcblxuICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdKU09OTEQgb2YgZnVsbCByZXNvdXJjZSByZXF1ZXN0IGNvdWxkIG5vdCBiZSBleHBhbmRlZDonICsgZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gY2xlYXIgc2VsZWN0aW9uXG4gICAgICAgICAgICB0aGlzLnJlc291cmNlcyA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIHRoYXQgdGhlIHNlbGVjdGlvbiBpcyBhIFtbUmVhZFJlc291cmNlXV0uXG4gICAgICpcbiAgICAgKiBTdXJwcmlzaW5nbHksIFtudWxsXSBoYXMgdG8gYmUgcmV0dXJuZWQgaWYgdGhlIHZhbHVlIGlzIHZhbGlkOiBodHRwczovL2FuZ3VsYXIuaW8vZ3VpZGUvZm9ybS12YWxpZGF0aW9uI2N1c3RvbS12YWxpZGF0b3JzXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdGhlIGZvcm0gZWxlbWVudCB3aG9zZSB2YWx1ZSBoYXMgdG8gYmUgY2hlY2tlZC5cbiAgICAgKiBAcmV0dXJuc1xuICAgICAqL1xuICAgIHZhbGlkYXRlUmVzb3VyY2UoYzogRm9ybUNvbnRyb2wpIHtcblxuICAgICAgICBjb25zdCBpc1ZhbGlkUmVzb3VyY2UgPSAoYy52YWx1ZSBpbnN0YW5jZW9mIFJlYWRSZXNvdXJjZSk7XG5cbiAgICAgICAgaWYgKGlzVmFsaWRSZXNvdXJjZSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIG5vUmVzb3VyY2U6IHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGMudmFsdWVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgdGhpcy5mb3JtID0gdGhpcy5mYi5ncm91cCh7XG4gICAgICAgICAgICByZXNvdXJjZTogW251bGwsIFZhbGlkYXRvcnMuY29tcG9zZShbXG4gICAgICAgICAgICAgICAgVmFsaWRhdG9ycy5yZXF1aXJlZCxcbiAgICAgICAgICAgICAgICB0aGlzLnZhbGlkYXRlUmVzb3VyY2VcbiAgICAgICAgICAgIF0pXVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmZvcm0udmFsdWVDaGFuZ2VzLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZWFyY2hCeUxhYmVsKGRhdGEucmVzb3VyY2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXNvbHZlZFByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAvLyBhZGQgZm9ybSB0byB0aGUgcGFyZW50IGZvcm0gZ3JvdXBcbiAgICAgICAgICAgIHRoaXMuZm9ybUdyb3VwLmFkZENvbnRyb2woJ3Byb3BWYWx1ZScsIHRoaXMuZm9ybSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCkge1xuXG4gICAgICAgIC8vIHJlbW92ZSBmb3JtIGZyb20gdGhlIHBhcmVudCBmb3JtIGdyb3VwXG4gICAgICAgIHJlc29sdmVkUHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZm9ybUdyb3VwLnJlbW92ZUNvbnRyb2woJ3Byb3BWYWx1ZScpO1xuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIGdldFZhbHVlKCk6IFZhbHVlIHtcblxuICAgICAgICByZXR1cm4gbmV3IElSSSh0aGlzLmZvcm0udmFsdWUucmVzb3VyY2UuaWQpO1xuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBJbmplY3QsIElucHV0LCBPbkRlc3Ryb3ksIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBGb3JtQnVpbGRlciwgRm9ybUdyb3VwLCBWYWxpZGF0b3JzIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgS25vcmFDb25zdGFudHMsIFByb3BlcnR5VmFsdWUsIFZhbHVlLCBWYWx1ZUxpdGVyYWwgfSBmcm9tICdAa25vcmEvY29yZSc7XG5cbi8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzQ1NjYxMDEwL2R5bmFtaWMtbmVzdGVkLXJlYWN0aXZlLWZvcm0tZXhwcmVzc2lvbmNoYW5nZWRhZnRlcml0aGFzYmVlbmNoZWNrZWRlcnJvclxuY29uc3QgcmVzb2x2ZWRQcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKG51bGwpO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3RleHQtdmFsdWUnLFxuICAgIHRlbXBsYXRlOiBgPG1hdC1mb3JtLWZpZWxkPlxuICAgIDxpbnB1dCBtYXRJbnB1dCBbZm9ybUNvbnRyb2xdPVwiZm9ybS5jb250cm9sc1sndGV4dFZhbHVlJ11cIiBwbGFjZWhvbGRlcj1cInRleHQgdmFsdWVcIiB2YWx1ZT1cIlwiPlxuPC9tYXQtZm9ybS1maWVsZD5cbmAsXG4gICAgc3R5bGVzOiBbYGBdXG59KVxuZXhwb3J0IGNsYXNzIFRleHRWYWx1ZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95LCBQcm9wZXJ0eVZhbHVlIHtcblxuICAgIC8vIHBhcmVudCBGb3JtR3JvdXBcbiAgICBASW5wdXQoKSBmb3JtR3JvdXA6IEZvcm1Hcm91cDtcblxuICAgIHR5cGUgPSBLbm9yYUNvbnN0YW50cy5UZXh0VmFsdWU7XG5cbiAgICBmb3JtOiBGb3JtR3JvdXA7XG5cbiAgICBjb25zdHJ1Y3RvcihASW5qZWN0KEZvcm1CdWlsZGVyKSBwcml2YXRlIGZiOiBGb3JtQnVpbGRlcikge1xuXG4gICAgfVxuXG4gICAgbmdPbkluaXQoKSB7XG5cbiAgICAgICAgdGhpcy5mb3JtID0gdGhpcy5mYi5ncm91cCh7XG4gICAgICAgICAgICB0ZXh0VmFsdWU6IFtudWxsLCBWYWxpZGF0b3JzLnJlcXVpcmVkXVxuICAgICAgICB9KTtcblxuICAgICAgICByZXNvbHZlZFByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAvLyBhZGQgZm9ybSB0byB0aGUgcGFyZW50IGZvcm0gZ3JvdXBcbiAgICAgICAgICAgIHRoaXMuZm9ybUdyb3VwLmFkZENvbnRyb2woJ3Byb3BWYWx1ZScsIHRoaXMuZm9ybSk7XG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG5cbiAgICAgICAgLy8gcmVtb3ZlIGZvcm0gZnJvbSB0aGUgcGFyZW50IGZvcm0gZ3JvdXBcbiAgICAgICAgcmVzb2x2ZWRQcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5mb3JtR3JvdXAucmVtb3ZlQ29udHJvbCgncHJvcFZhbHVlJyk7XG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgZ2V0VmFsdWUoKTogVmFsdWUge1xuXG4gICAgICAgIHJldHVybiBuZXcgVmFsdWVMaXRlcmFsKFN0cmluZyh0aGlzLmZvcm0udmFsdWUudGV4dFZhbHVlKSwgS25vcmFDb25zdGFudHMueHNkU3RyaW5nKTtcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IENvbXBvbmVudCwgSW5qZWN0LCBJbnB1dCwgT25EZXN0cm95LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgRm9ybUJ1aWxkZXIsIEZvcm1Hcm91cCwgVmFsaWRhdG9ycyB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IEtub3JhQ29uc3RhbnRzLCBQcm9wZXJ0eVZhbHVlLCBVdGlscywgVmFsdWUsIFZhbHVlTGl0ZXJhbCB9IGZyb20gJ0Brbm9yYS9jb3JlJztcblxuLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNDU2NjEwMTAvZHluYW1pYy1uZXN0ZWQtcmVhY3RpdmUtZm9ybS1leHByZXNzaW9uY2hhbmdlZGFmdGVyaXRoYXNiZWVuY2hlY2tlZGVycm9yXG5jb25zdCByZXNvbHZlZFByb21pc2UgPSBQcm9taXNlLnJlc29sdmUobnVsbCk7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAndXJpLXZhbHVlJyxcbiAgICB0ZW1wbGF0ZTogYDxtYXQtZm9ybS1maWVsZD5cbiAgICA8aW5wdXQgbWF0SW5wdXQgW2Zvcm1Db250cm9sXT1cImZvcm0uY29udHJvbHNbJ3VyaVZhbHVlJ11cIiBwbGFjZWhvbGRlcj1cIlVSSVwiIHZhbHVlPVwiXCI+XG48L21hdC1mb3JtLWZpZWxkPlxuYCxcbiAgICBzdHlsZXM6IFtgYF1cbn0pXG5leHBvcnQgY2xhc3MgVXJpVmFsdWVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgUHJvcGVydHlWYWx1ZSB7XG5cbiAgICAvLyBwYXJlbnQgRm9ybUdyb3VwXG4gICAgQElucHV0KCkgZm9ybUdyb3VwOiBGb3JtR3JvdXA7XG5cbiAgICB0eXBlID0gS25vcmFDb25zdGFudHMuVXJpVmFsdWU7XG5cbiAgICBmb3JtOiBGb3JtR3JvdXA7XG5cbiAgICBjb25zdHJ1Y3RvcihASW5qZWN0KEZvcm1CdWlsZGVyKSBwcml2YXRlIGZiOiBGb3JtQnVpbGRlcikge1xuXG4gICAgfVxuXG4gICAgbmdPbkluaXQoKSB7XG5cbiAgICAgICAgdGhpcy5mb3JtID0gdGhpcy5mYi5ncm91cCh7XG4gICAgICAgICAgICB1cmlWYWx1ZTogW251bGwsIFZhbGlkYXRvcnMuY29tcG9zZShbVmFsaWRhdG9ycy5yZXF1aXJlZCwgVmFsaWRhdG9ycy5wYXR0ZXJuKFV0aWxzLlJlZ2V4VXJsKV0pXVxuICAgICAgICB9KTtcblxuICAgICAgICByZXNvbHZlZFByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAvLyBhZGQgZm9ybSB0byB0aGUgcGFyZW50IGZvcm0gZ3JvdXBcbiAgICAgICAgICAgIHRoaXMuZm9ybUdyb3VwLmFkZENvbnRyb2woJ3Byb3BWYWx1ZScsIHRoaXMuZm9ybSk7XG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG5cbiAgICAgICAgLy8gcmVtb3ZlIGZvcm0gZnJvbSB0aGUgcGFyZW50IGZvcm0gZ3JvdXBcbiAgICAgICAgcmVzb2x2ZWRQcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5mb3JtR3JvdXAucmVtb3ZlQ29udHJvbCgncHJvcFZhbHVlJyk7XG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgZ2V0VmFsdWUoKTogVmFsdWUge1xuXG4gICAgICAgIHJldHVybiBuZXcgVmFsdWVMaXRlcmFsKFN0cmluZyh0aGlzLmZvcm0udmFsdWUudXJpVmFsdWUpLCBLbm9yYUNvbnN0YW50cy54c2RVcmkpO1xuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBCcm93c2VyQW5pbWF0aW9uc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXIvYW5pbWF0aW9ucyc7XG5pbXBvcnQge1xuICAgIE1hdEF1dG9jb21wbGV0ZU1vZHVsZSxcbiAgICBNYXRCdXR0b25Nb2R1bGUsXG4gICAgTWF0Q2hlY2tib3hNb2R1bGUsXG4gICAgTWF0RGF0ZXBpY2tlck1vZHVsZSxcbiAgICBNYXRGb3JtRmllbGRNb2R1bGUsXG4gICAgTWF0SWNvbk1vZHVsZSwgTWF0SW5wdXRNb2R1bGUsXG4gICAgTWF0TGlzdE1vZHVsZSxcbiAgICBNYXRTZWxlY3RNb2R1bGUsXG4gICAgTWF0VG9vbHRpcE1vZHVsZVxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbCc7XG5cbmltcG9ydCB7IEZvcm1zTW9kdWxlLCBSZWFjdGl2ZUZvcm1zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgS3VpQ29yZU1vZHVsZSB9IGZyb20gJ0Brbm9yYS9jb3JlJztcbmltcG9ydCB7IEt1aUFjdGlvbk1vZHVsZSB9IGZyb20gJ0Brbm9yYS9hY3Rpb24nO1xuaW1wb3J0IHsgS3VpVmlld2VyTW9kdWxlIH0gZnJvbSAnQGtub3JhL3ZpZXdlcic7XG5cbmltcG9ydCB7IE1hdEpETkNvbnZlcnRpYmxlQ2FsZW5kYXJEYXRlQWRhcHRlck1vZHVsZSB9IGZyb20gJ2pkbmNvbnZlcnRpYmxlY2FsZW5kYXJkYXRlYWRhcHRlcic7XG5cbmltcG9ydCB7IFNlYXJjaENvbXBvbmVudCB9IGZyb20gJy4vc2VhcmNoLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBGdWxsdGV4dFNlYXJjaENvbXBvbmVudCB9IGZyb20gJy4vZnVsbHRleHQtc2VhcmNoL2Z1bGx0ZXh0LXNlYXJjaC5jb21wb25lbnQnO1xuaW1wb3J0IHsgU2VhcmNoUGFuZWxDb21wb25lbnQgfSBmcm9tICcuL3NlYXJjaC1wYW5lbC9zZWFyY2gtcGFuZWwuY29tcG9uZW50JztcbmltcG9ydCB7IEV4dGVuZGVkU2VhcmNoQ29tcG9uZW50IH0gZnJvbSAnLi9leHRlbmRlZC1zZWFyY2gvZXh0ZW5kZWQtc2VhcmNoLmNvbXBvbmVudCc7XG5cbmltcG9ydCB7IFNlbGVjdE9udG9sb2d5Q29tcG9uZW50IH0gZnJvbSAnLi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LW9udG9sb2d5L3NlbGVjdC1vbnRvbG9neS5jb21wb25lbnQnO1xuaW1wb3J0IHsgU2VsZWN0UmVzb3VyY2VDbGFzc0NvbXBvbmVudCB9IGZyb20gJy4vZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1yZXNvdXJjZS1jbGFzcy9zZWxlY3QtcmVzb3VyY2UtY2xhc3MuY29tcG9uZW50JztcbmltcG9ydCB7IFNlbGVjdFByb3BlcnR5Q29tcG9uZW50IH0gZnJvbSAnLi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXByb3BlcnR5L3NlbGVjdC1wcm9wZXJ0eS5jb21wb25lbnQnO1xuaW1wb3J0IHsgU3BlY2lmeVByb3BlcnR5VmFsdWVDb21wb25lbnQgfSBmcm9tICcuL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3QtcHJvcGVydHkvc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZS9zcGVjaWZ5LXByb3BlcnR5LXZhbHVlLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBCb29sZWFuVmFsdWVDb21wb25lbnQgfSBmcm9tICcuL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3QtcHJvcGVydHkvc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZS9ib29sZWFuLXZhbHVlL2Jvb2xlYW4tdmFsdWUuY29tcG9uZW50JztcbmltcG9ydCB7IERhdGVWYWx1ZUNvbXBvbmVudCB9IGZyb20gJy4vZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1wcm9wZXJ0eS9zcGVjaWZ5LXByb3BlcnR5LXZhbHVlL2RhdGUtdmFsdWUvZGF0ZS12YWx1ZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgRGVjaW1hbFZhbHVlQ29tcG9uZW50IH0gZnJvbSAnLi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXByb3BlcnR5L3NwZWNpZnktcHJvcGVydHktdmFsdWUvZGVjaW1hbC12YWx1ZS9kZWNpbWFsLXZhbHVlLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBJbnRlZ2VyVmFsdWVDb21wb25lbnQgfSBmcm9tICcuL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3QtcHJvcGVydHkvc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZS9pbnRlZ2VyLXZhbHVlL2ludGVnZXItdmFsdWUuY29tcG9uZW50JztcbmltcG9ydCB7IExpbmtWYWx1ZUNvbXBvbmVudCB9IGZyb20gJy4vZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1wcm9wZXJ0eS9zcGVjaWZ5LXByb3BlcnR5LXZhbHVlL2xpbmstdmFsdWUvbGluay12YWx1ZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgVGV4dFZhbHVlQ29tcG9uZW50IH0gZnJvbSAnLi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXByb3BlcnR5L3NwZWNpZnktcHJvcGVydHktdmFsdWUvdGV4dC12YWx1ZS90ZXh0LXZhbHVlLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBVcmlWYWx1ZUNvbXBvbmVudCB9IGZyb20gJy4vZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1wcm9wZXJ0eS9zcGVjaWZ5LXByb3BlcnR5LXZhbHVlL3VyaS12YWx1ZS91cmktdmFsdWUuY29tcG9uZW50JztcbmltcG9ydCB7IEhlYWRlckNvbXBvbmVudCB9IGZyb20gJy4vZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1wcm9wZXJ0eS9zcGVjaWZ5LXByb3BlcnR5LXZhbHVlL2RhdGUtdmFsdWUvaGVhZGVyLWNhbGVuZGFyL2hlYWRlci1jYWxlbmRhci5jb21wb25lbnQnO1xuXG5cbkBOZ01vZHVsZSh7XG4gICAgaW1wb3J0czogW1xuICAgICAgICBDb21tb25Nb2R1bGUsXG4gICAgICAgIEJyb3dzZXJBbmltYXRpb25zTW9kdWxlLFxuICAgICAgICBNYXRBdXRvY29tcGxldGVNb2R1bGUsXG4gICAgICAgIE1hdEJ1dHRvbk1vZHVsZSxcbiAgICAgICAgTWF0Q2hlY2tib3hNb2R1bGUsXG4gICAgICAgIE1hdERhdGVwaWNrZXJNb2R1bGUsXG4gICAgICAgIE1hdEZvcm1GaWVsZE1vZHVsZSxcbiAgICAgICAgTWF0SW5wdXRNb2R1bGUsXG4gICAgICAgIE1hdEljb25Nb2R1bGUsXG4gICAgICAgIE1hdExpc3RNb2R1bGUsXG4gICAgICAgIE1hdFNlbGVjdE1vZHVsZSxcbiAgICAgICAgTWF0VG9vbHRpcE1vZHVsZSxcbiAgICAgICAgRm9ybXNNb2R1bGUsXG4gICAgICAgIFJlYWN0aXZlRm9ybXNNb2R1bGUsXG4gICAgICAgIEt1aUNvcmVNb2R1bGUsXG4gICAgICAgIEt1aUFjdGlvbk1vZHVsZSxcbiAgICAgICAgS3VpVmlld2VyTW9kdWxlLFxuICAgICAgICBNYXRKRE5Db252ZXJ0aWJsZUNhbGVuZGFyRGF0ZUFkYXB0ZXJNb2R1bGVcbiAgICBdLFxuICAgIGRlY2xhcmF0aW9uczogW1xuICAgICAgICBTZWFyY2hDb21wb25lbnQsXG4gICAgICAgIFNlbGVjdE9udG9sb2d5Q29tcG9uZW50LFxuICAgICAgICBFeHRlbmRlZFNlYXJjaENvbXBvbmVudCxcbiAgICAgICAgU2VsZWN0UmVzb3VyY2VDbGFzc0NvbXBvbmVudCxcbiAgICAgICAgU2VsZWN0UHJvcGVydHlDb21wb25lbnQsXG4gICAgICAgIFNwZWNpZnlQcm9wZXJ0eVZhbHVlQ29tcG9uZW50LFxuICAgICAgICBCb29sZWFuVmFsdWVDb21wb25lbnQsXG4gICAgICAgIERhdGVWYWx1ZUNvbXBvbmVudCxcbiAgICAgICAgRGVjaW1hbFZhbHVlQ29tcG9uZW50LFxuICAgICAgICBJbnRlZ2VyVmFsdWVDb21wb25lbnQsXG4gICAgICAgIExpbmtWYWx1ZUNvbXBvbmVudCxcbiAgICAgICAgVGV4dFZhbHVlQ29tcG9uZW50LFxuICAgICAgICBVcmlWYWx1ZUNvbXBvbmVudCxcbiAgICAgICAgSGVhZGVyQ29tcG9uZW50LFxuICAgICAgICBGdWxsdGV4dFNlYXJjaENvbXBvbmVudCxcbiAgICAgICAgU2VhcmNoUGFuZWxDb21wb25lbnRcbiAgICBdLFxuICAgIGV4cG9ydHM6IFtcbiAgICAgICAgU2VhcmNoQ29tcG9uZW50LFxuICAgICAgICBTZWFyY2hQYW5lbENvbXBvbmVudCxcbiAgICAgICAgRnVsbHRleHRTZWFyY2hDb21wb25lbnQsXG4gICAgICAgIEV4dGVuZGVkU2VhcmNoQ29tcG9uZW50LFxuICAgICAgICBEYXRlVmFsdWVDb21wb25lbnRcbiAgICBdLFxuICAgIGVudHJ5Q29tcG9uZW50czogW1xuICAgICAgICBIZWFkZXJDb21wb25lbnRcbiAgICBdXG59KVxuZXhwb3J0IGNsYXNzIEt1aVNlYXJjaE1vZHVsZSB7XG59XG4iLCIvKlxuICogUHVibGljIEFQSSBTdXJmYWNlIG9mIHNlYXJjaFxuICovXG5cbmV4cG9ydCAqIGZyb20gJy4vbGliL3NlYXJjaC5jb21wb25lbnQnO1xuZXhwb3J0ICogZnJvbSAnLi9saWIvc2VhcmNoLXBhbmVsL3NlYXJjaC1wYW5lbC5jb21wb25lbnQnO1xuZXhwb3J0ICogZnJvbSAnLi9saWIvZnVsbHRleHQtc2VhcmNoL2Z1bGx0ZXh0LXNlYXJjaC5jb21wb25lbnQnO1xuXG5leHBvcnQgKiBmcm9tICcuL2xpYi9leHRlbmRlZC1zZWFyY2gvZXh0ZW5kZWQtc2VhcmNoLmNvbXBvbmVudCc7XG5leHBvcnQgKiBmcm9tICcuL2xpYi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LW9udG9sb2d5L3NlbGVjdC1vbnRvbG9neS5jb21wb25lbnQnO1xuZXhwb3J0ICogZnJvbSAnLi9saWIvZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1wcm9wZXJ0eS9zZWxlY3QtcHJvcGVydHkuY29tcG9uZW50JztcbmV4cG9ydCAqIGZyb20gJy4vbGliL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3QtcHJvcGVydHkvc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZS9zcGVjaWZ5LXByb3BlcnR5LXZhbHVlLmNvbXBvbmVudCc7XG5leHBvcnQgKiBmcm9tICcuL2xpYi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXByb3BlcnR5L3NwZWNpZnktcHJvcGVydHktdmFsdWUvYm9vbGVhbi12YWx1ZS9ib29sZWFuLXZhbHVlLmNvbXBvbmVudCc7XG5leHBvcnQgKiBmcm9tICcuL2xpYi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXByb3BlcnR5L3NwZWNpZnktcHJvcGVydHktdmFsdWUvZGF0ZS12YWx1ZS9kYXRlLXZhbHVlLmNvbXBvbmVudCc7XG5leHBvcnQgKiBmcm9tICcuL2xpYi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXByb3BlcnR5L3NwZWNpZnktcHJvcGVydHktdmFsdWUvZGF0ZS12YWx1ZS9oZWFkZXItY2FsZW5kYXIvaGVhZGVyLWNhbGVuZGFyLmNvbXBvbmVudCc7XG5leHBvcnQgKiBmcm9tICcuL2xpYi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXByb3BlcnR5L3NwZWNpZnktcHJvcGVydHktdmFsdWUvZGVjaW1hbC12YWx1ZS9kZWNpbWFsLXZhbHVlLmNvbXBvbmVudCc7XG5leHBvcnQgKiBmcm9tICcuL2xpYi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXByb3BlcnR5L3NwZWNpZnktcHJvcGVydHktdmFsdWUvaW50ZWdlci12YWx1ZS9pbnRlZ2VyLXZhbHVlLmNvbXBvbmVudCc7XG5leHBvcnQgKiBmcm9tICcuL2xpYi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXByb3BlcnR5L3NwZWNpZnktcHJvcGVydHktdmFsdWUvbGluay12YWx1ZS9saW5rLXZhbHVlLmNvbXBvbmVudCc7XG5leHBvcnQgKiBmcm9tICcuL2xpYi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXByb3BlcnR5L3NwZWNpZnktcHJvcGVydHktdmFsdWUvdGV4dC12YWx1ZS90ZXh0LXZhbHVlLmNvbXBvbmVudCc7XG5leHBvcnQgKiBmcm9tICcuL2xpYi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXByb3BlcnR5L3NwZWNpZnktcHJvcGVydHktdmFsdWUvdXJpLXZhbHVlL3VyaS12YWx1ZS5jb21wb25lbnQnO1xuZXhwb3J0ICogZnJvbSAnLi9saWIvZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1yZXNvdXJjZS1jbGFzcy9zZWxlY3QtcmVzb3VyY2UtY2xhc3MuY29tcG9uZW50JztcblxuZXhwb3J0ICogZnJvbSAnLi9saWIvc2VhcmNoLm1vZHVsZSc7XG4iLCIvKipcbiAqIEdlbmVyYXRlZCBidW5kbGUgaW5kZXguIERvIG5vdCBlZGl0LlxuICovXG5cbmV4cG9ydCAqIGZyb20gJy4vcHVibGljX2FwaSc7XG4iXSwibmFtZXMiOlsicmVzb2x2ZWRQcm9taXNlIl0sIm1hcHBpbmdzIjoi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