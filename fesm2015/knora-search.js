import { Component, ElementRef, Input, EventEmitter, Inject, Output, ViewChild, ViewChildren, Host, NgModule } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GravsearchGenerationService, OntologyCacheService, ReadResourcesSequence, ComparisonOperatorAndValue, Equals, Exists, GreaterThan, GreaterThanEquals, KnoraConstants, LessThan, LessThanEquals, Like, Match, NotEquals, CardinalityOccurrence, PropertyWithValue, OntologyInformation, ValueLiteral, IRI, ReadResource, SearchService, Utils, KuiCoreModule } from '@knora/core';
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
     * @ignore
     *
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
     * @ignore
     *
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
     * @ignore
     *
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
     * @ignore
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
     * @ignore
     *
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
                styles: [`input[type=search]::-webkit-search-cancel-button,input[type=search]::-webkit-search-decoration,input[type=search]::-webkit-search-results-button,input[type=search]::-webkit-search-results-decoration{display:none}input[type=search]{-moz-appearance:none;-webkit-appearance:none}.center{display:block;margin-left:auto;margin-right:auto}.close{right:12px}.extended-search-box{margin:12px}.advanced-search-button{margin-left:10px}.full-width{width:100%}.hide{display:none}.inactive,.mute{color:#7a7a7a}.search-panel{background-color:#f9f9f9;border-radius:4px;display:inline-flex;height:40px;position:relative;width:680px;z-index:10}.search-panel:hover{box-shadow:0 1px 3px rgba(0,0,0,.5)}.search-panel div.input-field{flex:1}.search-panel div.input-field input{border-style:none;font-size:14pt;height:38px;position:absolute;width:calc(100% - 80px)}.search-panel div.input-field input:active,.search-panel div.input-field input:focus{outline:0}.search-panel div .prefix,.search-panel div .suffix{background-color:#fff;border-radius:3px;border-style:none;color:rgba(41,41,41,.4);cursor:pointer;height:38px;outline:0;position:relative;width:40px}.search-panel div .prefix:active,.search-panel div .suffix:active{color:#515151}.search-panel.active{box-shadow:0 1px 3px rgba(0,0,0,.5)}.kui-menu{box-shadow:0 3px 5px -1px rgba(11,11,11,.2),0 6px 10px 0 rgba(11,11,11,.14),0 1px 18px 0 rgba(11,11,11,.12);background-color:#f9f9f9;border-radius:4px;position:absolute}.kui-menu .kui-menu-header{background-color:#f9f9f9;border-top-left-radius:4px;border-top-right-radius:4px;display:inline-block;height:48px;width:100%}.kui-menu .kui-menu-header .kui-menu-title{float:left;font-size:14px;font-weight:400;margin-top:4px;padding:12px}.kui-menu .kui-menu-header .kui-menu-action{float:right;margin:4px}.kui-menu.extended-search,.kui-menu.simple-search{min-height:680px;width:680px}.kui-menu.simple-search{padding-top:60px;z-index:-1}.kui-menu.simple-search .kui-previous-search-list .mat-list-item{cursor:pointer}.kui-menu.simple-search .kui-previous-search-list .mat-list-item:hover{background-color:#f9f9f9}.kui-menu.simple-search .kui-previous-search-list .mat-list-item:hover mat-icon{display:block}.kui-menu.simple-search .kui-previous-search-list .mat-list-item mat-icon{display:none}.kui-menu.simple-search .right{margin-top:12px;margin-left:16px}.kui-menu.extended-search{z-index:20}.search-bar-elements{display:flex;position:relative;z-index:100}.show{display:block}@media screen and (max-width:1024px){.search-panel{width:480px}.search-panel div.input-field input{width:calc(480px - 80px)}.kui-menu.extended-search,.kui-menu.simple-search{width:480px}}@media screen and (max-width:768px){.search-panel{width:calc(480px - 160px)}.search-panel div.input-field input{width:calc(480px - 160px - 80px)}.kui-menu.extended-search,.kui-menu.simple-search{width:calc(480px - 80px)}}`],
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
                styles: [`.advanced-btn{margin-left:10px}.kui-search-panel{display:flex;position:relative;z-index:100}.kui-search-bar{background-color:#f9f9f9;border-radius:4px;display:inline-flex;height:40px;position:relative;z-index:10}.kui-search-bar:hover{box-shadow:0 1px 3px rgba(0,0,0,.5)}.kui-menu{box-shadow:0 3px 5px -1px rgba(11,11,11,.2),0 6px 10px 0 rgba(11,11,11,.14),0 1px 18px 0 rgba(11,11,11,.12);background-color:#f9f9f9;border-radius:4px;position:absolute}.kui-menu .kui-menu-header{background-color:#f9f9f9;border-top-left-radius:4px;border-top-right-radius:4px;display:inline-block;height:48px;width:100%}.kui-menu .kui-menu-header .kui-menu-title{float:left;font-size:14px;font-weight:400;margin-top:4px;padding:12px}.kui-menu .kui-menu-header .kui-menu-action{float:right;margin:4px}.kui-menu.extended-search{min-height:680px;width:680px;z-index:20}.extended-search-box{margin:12px}@media screen and (max-width:1024px){.kui-search-bar{width:480px}.kui-search-bar div.input-field input{width:calc(480px - 80px)}.fulltext-search,.kui-menu.extended-search{width:480px}}@media screen and (max-width:768px){.kui-search-bar{width:calc(480px - 160px)}.kui-search-bar div.input-field input{width:calc(480px - 160px - 80px)}.fulltext-search,.kui-menu.extended-search{width:calc(480px - 80px)}}`],
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
                styles: [`input[type=search]::-webkit-search-cancel-button,input[type=search]::-webkit-search-decoration,input[type=search]::-webkit-search-results-button,input[type=search]::-webkit-search-results-decoration{display:none}input[type=search]{-moz-appearance:none;-webkit-appearance:none}.full-width{width:100%}.close{right:12px}.hide{display:none}.show{display:block}.search-bar-elements{display:flex;position:relative;z-index:100}.inactive{color:#7a7a7a}.fulltext-search-bar{background-color:#f9f9f9;border-radius:4px;display:inline-flex;height:40px;position:relative;width:680px;z-index:10}.fulltext-search-bar:hover{box-shadow:0 1px 3px rgba(0,0,0,.5)}.fulltext-search-bar div.input-field{flex:1}.fulltext-search-bar div.input-field input{border-style:none;font-size:14pt;height:38px;position:absolute;width:calc(100% - 80px)}.fulltext-search-bar div.input-field input:active,.fulltext-search-bar div.input-field input:focus{outline:0}.fulltext-search-bar div .prefix,.fulltext-search-bar div .suffix{background-color:#fff;border-radius:3px;border-style:none;color:rgba(41,41,41,.4);cursor:pointer;height:38px;outline:0;position:relative;width:40px}.fulltext-search-bar div .prefix:active,.fulltext-search-bar div .suffix:active{color:#515151}.fulltext-search-bar div.active{box-shadow:0 1px 3px rgba(0,0,0,.5)}.kui-menu{box-shadow:0 3px 5px -1px rgba(11,11,11,.2),0 6px 10px 0 rgba(11,11,11,.14),0 1px 18px 0 rgba(11,11,11,.12);background-color:#f9f9f9;border-radius:4px;position:absolute}.kui-menu.simple-search{min-height:680px;width:680px;padding-top:60px;z-index:-1}.kui-menu.simple-search .kui-previous-search-list .mat-list-item{cursor:pointer}.kui-menu.simple-search .kui-previous-search-list .mat-list-item:hover{background-color:#f9f9f9}.kui-menu.simple-search .kui-previous-search-list .mat-list-item:hover mat-icon{display:block}.kui-menu.simple-search .kui-previous-search-list .mat-list-item mat-icon{display:none}.kui-menu.simple-search .right{margin-top:12px;margin-left:16px}@media screen and (max-width:1024px){.fulltext-search-bar{width:480px}.fulltext-search-bar div.input-field input{width:calc(480px - 80px)}.kui-menu.simple-search{width:480px}}@media screen and (max-width:768px){.fulltext-search-bar{width:calc(480px - 160px)}.fulltext-search-bar div.input-field input{width:calc(480px - 160px - 80px)}.kui-menu.simple-search{width:calc(480px - 80px)}}`],
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
            this.resourceClasses = ontoInfo.getResourceClassesAsArray(true);
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
        // sort properties by label (ascending)
        propsArray.sort(OntologyInformation.sortFunc);
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
            this._searchService.searchByLabelReadResourceSequence(searchTerm, this._restrictToResourceClass).subscribe((result) => {
                this.resources = result.resources;
            }, function (err) {
                console.log('JSONLD of full resource request could not be expanded:' + err);
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia25vcmEtc2VhcmNoLmpzLm1hcCIsInNvdXJjZXMiOlsibmc6Ly9Aa25vcmEvc2VhcmNoL2xpYi9zZWFyY2guY29tcG9uZW50LnRzIiwibmc6Ly9Aa25vcmEvc2VhcmNoL2xpYi9zZWFyY2gtcGFuZWwvc2VhcmNoLXBhbmVsLmNvbXBvbmVudC50cyIsIm5nOi8vQGtub3JhL3NlYXJjaC9saWIvZnVsbHRleHQtc2VhcmNoL2Z1bGx0ZXh0LXNlYXJjaC5jb21wb25lbnQudHMiLCJuZzovL0Brbm9yYS9zZWFyY2gvbGliL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3QtcmVzb3VyY2UtY2xhc3Mvc2VsZWN0LXJlc291cmNlLWNsYXNzLmNvbXBvbmVudC50cyIsIm5nOi8vQGtub3JhL3NlYXJjaC9saWIvZXh0ZW5kZWQtc2VhcmNoL2V4dGVuZGVkLXNlYXJjaC5jb21wb25lbnQudHMiLCJuZzovL0Brbm9yYS9zZWFyY2gvbGliL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3Qtb250b2xvZ3kvc2VsZWN0LW9udG9sb2d5LmNvbXBvbmVudC50cyIsIm5nOi8vQGtub3JhL3NlYXJjaC9saWIvZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1wcm9wZXJ0eS9zcGVjaWZ5LXByb3BlcnR5LXZhbHVlL3NwZWNpZnktcHJvcGVydHktdmFsdWUuY29tcG9uZW50LnRzIiwibmc6Ly9Aa25vcmEvc2VhcmNoL2xpYi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXByb3BlcnR5L3NlbGVjdC1wcm9wZXJ0eS5jb21wb25lbnQudHMiLCJuZzovL0Brbm9yYS9zZWFyY2gvbGliL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3QtcHJvcGVydHkvc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZS9ib29sZWFuLXZhbHVlL2Jvb2xlYW4tdmFsdWUuY29tcG9uZW50LnRzIiwibmc6Ly9Aa25vcmEvc2VhcmNoL2xpYi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXByb3BlcnR5L3NwZWNpZnktcHJvcGVydHktdmFsdWUvZGF0ZS12YWx1ZS9oZWFkZXItY2FsZW5kYXIvaGVhZGVyLWNhbGVuZGFyLmNvbXBvbmVudC50cyIsIm5nOi8vQGtub3JhL3NlYXJjaC9saWIvZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1wcm9wZXJ0eS9zcGVjaWZ5LXByb3BlcnR5LXZhbHVlL2RhdGUtdmFsdWUvZGF0ZS12YWx1ZS5jb21wb25lbnQudHMiLCJuZzovL0Brbm9yYS9zZWFyY2gvbGliL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3QtcHJvcGVydHkvc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZS9kZWNpbWFsLXZhbHVlL2RlY2ltYWwtdmFsdWUuY29tcG9uZW50LnRzIiwibmc6Ly9Aa25vcmEvc2VhcmNoL2xpYi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXByb3BlcnR5L3NwZWNpZnktcHJvcGVydHktdmFsdWUvaW50ZWdlci12YWx1ZS9pbnRlZ2VyLXZhbHVlLmNvbXBvbmVudC50cyIsIm5nOi8vQGtub3JhL3NlYXJjaC9saWIvZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1wcm9wZXJ0eS9zcGVjaWZ5LXByb3BlcnR5LXZhbHVlL2xpbmstdmFsdWUvbGluay12YWx1ZS5jb21wb25lbnQudHMiLCJuZzovL0Brbm9yYS9zZWFyY2gvbGliL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3QtcHJvcGVydHkvc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZS90ZXh0LXZhbHVlL3RleHQtdmFsdWUuY29tcG9uZW50LnRzIiwibmc6Ly9Aa25vcmEvc2VhcmNoL2xpYi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXByb3BlcnR5L3NwZWNpZnktcHJvcGVydHktdmFsdWUvdXJpLXZhbHVlL3VyaS12YWx1ZS5jb21wb25lbnQudHMiLCJuZzovL0Brbm9yYS9zZWFyY2gvbGliL3NlYXJjaC5tb2R1bGUudHMiLCJuZzovL0Brbm9yYS9zZWFyY2gvcHVibGljX2FwaS50cyIsIm5nOi8vQGtub3JhL3NlYXJjaC9rbm9yYS1zZWFyY2gudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBJbnB1dCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZSwgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7XG4gICAgYW5pbWF0ZSxcbiAgICBzdGF0ZSxcbiAgICBzdHlsZSxcbiAgICB0cmFuc2l0aW9uLFxuICAgIHRyaWdnZXJcbn0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAna3VpLXNlYXJjaCcsXG4gICAgdGVtcGxhdGU6IGA8ZGl2IGNsYXNzPVwic2VhcmNoLWJhci1lbGVtZW50c1wiPlxuXG4gICAgPCEtLSB0aGUgbmV4dCBlbGVtZW50IC0gZGl2LmV4dGVuZGVkLXNlYXJjaC1wYW5lbCAtIGlzIGEgaGlkZGVuIGRyb3Bkb3duIGZpbHRlciBtZW51IC0tPlxuXG4gICAgPGRpdiBjbGFzcz1cInNlYXJjaC1wYW5lbFwiIFtjbGFzcy5hY3RpdmVdPVwic2VhcmNoUGFuZWxGb2N1c1wiPlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cInByZWZpeFwiIChjbGljayk9XCJkb1NlYXJjaChzZWFyY2gpXCI+XG4gICAgICAgICAgICAgICAgPG1hdC1pY29uPnNlYXJjaDwvbWF0LWljb24+XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBjbGFzcz1cImlucHV0LWZpZWxkXCI+XG4gICAgICAgICAgICA8aW5wdXQgI3NlYXJjaCBhdXRvY29tcGxldGU9XCJvZmZcIiB0eXBlPVwic2VhcmNoXCIgW3BsYWNlaG9sZGVyXT1cInNlYXJjaExhYmVsXCIgWyhuZ01vZGVsKV09XCJzZWFyY2hRdWVyeVwiIG5hbWU9XCJzZWFyY2hcIiAoa2V5dXAuZXNjKT1cInJlc2V0U2VhcmNoKHNlYXJjaClcIiAoa2V5dXApPVwib25LZXkoc2VhcmNoLCAkZXZlbnQpXCIgKGNsaWNrKT1cInNldEZvY3VzKClcIiAoZm9jdXMpPVwidG9nZ2xlTWVudSgnc2ltcGxlU2VhcmNoJylcIiBbZGlzYWJsZWRdPVwiZm9jdXNPbkV4dGVuZGVkID09PSAnYWN0aXZlJ1wiIC8+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDwhLS0gc3dpdGNoIGJ1dHRvbjogb24gc29tZSBmb2N1cyB3ZSBuZWVkIGEgY2xvc2UgYnV0dG9uIGZvciB0aGUgc2ltcGxlIG9yIGV4dGVuZGVkIHBhbmVsIC0tPlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cInN1ZmZpeFwiICpuZ0lmPVwiZm9jdXNPblNpbXBsZSA9PT0gJ2FjdGl2ZSdcIiAoY2xpY2spPVwicmVzZXRTZWFyY2goc2VhcmNoKVwiPlxuICAgICAgICAgICAgICAgIDxtYXQtaWNvbj5jbG9zZTwvbWF0LWljb24+XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJzdWZmaXhcIiAqbmdJZj1cImZvY3VzT25TaW1wbGUgPT09ICdpbmFjdGl2ZSdcIj5cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8IS0tIHRoZSBzZWFyY2ggcGFuZWwgaGFzIHR3byBcImRyb3Bkb3duXCIgbWVudXM6IG9uZSBmb3Igc2ltcGxlIHNlYXJjaCBhbmQgYW5vdGhlciBvbmUgZm9yIHRoZSBleHRlbmRlZCBzZWFyY2ggLS0+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJrdWktbWVudSBzaW1wbGUtc2VhcmNoXCIgW0BzaW1wbGVTZWFyY2hNZW51XT1cImZvY3VzT25TaW1wbGVcIiAqbmdJZj1cInNob3dTaW1wbGVTZWFyY2hcIj5cbiAgICAgICAgICAgIDxtYXQtbGlzdCBjbGFzcz1cImt1aS1wcmV2aW91cy1zZWFyY2gtbGlzdFwiPlxuICAgICAgICAgICAgICAgIDxtYXQtbGlzdC1pdGVtICpuZ0Zvcj1cImxldCBpdGVtIG9mIHByZXZTZWFyY2ggfCBrdWlSZXZlcnNlOyBsZXQgaT1pbmRleFwiPlxuICAgICAgICAgICAgICAgICAgICA8aDQgbWF0LWxpbmUgKm5nSWY9XCJpPDEwXCIgKGNsaWNrKT1cImRvUHJldlNlYXJjaChpdGVtKVwiPnt7aXRlbX19PC9oND5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBtYXQtaWNvbi1idXR0b24gKGNsaWNrKT1cInJlc2V0UHJldlNlYXJjaChpdGVtKVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPG1hdC1pY29uIGFyaWEtbGFiZWw9XCJjbG9zZVwiPmNsb3NlPC9tYXQtaWNvbj5cbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9tYXQtbGlzdC1pdGVtPlxuICAgICAgICAgICAgPC9tYXQtbGlzdD5cbiAgICAgICAgICAgIDxidXR0b24gbWF0LXN0cm9rZWQtYnV0dG9uIGNvbG9yPVwiYWNjZW50XCIgY2xhc3M9XCJyaWdodFwiIChjbGljayk9XCJyZXNldFByZXZTZWFyY2goKVwiICpuZ0lmPVwicHJldlNlYXJjaFwiPkNsZWFyPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgY2xhc3M9XCJrdWktbWVudSBleHRlbmRlZC1zZWFyY2hcIiBbQGV4dGVuZGVkU2VhcmNoTWVudV09XCJmb2N1c09uRXh0ZW5kZWRcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJrdWktbWVudS1oZWFkZXJcIj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImt1aS1tZW51LXRpdGxlXCI+XG4gICAgICAgICAgICAgICAgICAgIDxoND5BZHZhbmNlZCBzZWFyY2g8L2g0PlxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImt1aS1tZW51LWFjdGlvblwiPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIG1hdC1pY29uLWJ1dHRvbiAoY2xpY2spPVwidG9nZ2xlTWVudSgnZXh0ZW5kZWRTZWFyY2gnKVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPG1hdC1pY29uPmNsb3NlPC9tYXQtaWNvbj5cbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZXh0ZW5kZWQtc2VhcmNoLWJveFwiPlxuICAgICAgICAgICAgICAgIDxrdWktZXh0ZW5kZWQtc2VhcmNoIFtyb3V0ZV09XCJyb3V0ZVwiICh0b2dnbGVFeHRlbmRlZFNlYXJjaEZvcm0pPVwidG9nZ2xlTWVudSgnZXh0ZW5kZWRTZWFyY2gnKVwiPjwva3VpLWV4dGVuZGVkLXNlYXJjaD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cblxuICAgIDwhLS0gRXh0ZW5kZWQgc2VhcmNoIGJ1dHRvbiB0byBkaXNwbGF5IHRoZSBleHRlbmRlZCBzZWFyY2ggZm9ybSBpbiB0aGUgc2VhcmNoIHBhbmVsIC0tPlxuICAgIDxidXR0b24gbWF0LWJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY29sb3I9XCJwcmltYXJ5XCIgY2xhc3M9XCJhZHZhbmNlZC1zZWFyY2gtYnV0dG9uXCIgKGNsaWNrKT1cInRvZ2dsZU1lbnUoJ2V4dGVuZGVkU2VhcmNoJylcIj5cbiAgICAgICAgYWR2YW5jZWRcbiAgICA8L2J1dHRvbj5cblxuPC9kaXY+YCxcbiAgICBzdHlsZXM6IFtgaW5wdXRbdHlwZT1zZWFyY2hdOjotd2Via2l0LXNlYXJjaC1jYW5jZWwtYnV0dG9uLGlucHV0W3R5cGU9c2VhcmNoXTo6LXdlYmtpdC1zZWFyY2gtZGVjb3JhdGlvbixpbnB1dFt0eXBlPXNlYXJjaF06Oi13ZWJraXQtc2VhcmNoLXJlc3VsdHMtYnV0dG9uLGlucHV0W3R5cGU9c2VhcmNoXTo6LXdlYmtpdC1zZWFyY2gtcmVzdWx0cy1kZWNvcmF0aW9ue2Rpc3BsYXk6bm9uZX1pbnB1dFt0eXBlPXNlYXJjaF17LW1vei1hcHBlYXJhbmNlOm5vbmU7LXdlYmtpdC1hcHBlYXJhbmNlOm5vbmV9LmNlbnRlcntkaXNwbGF5OmJsb2NrO21hcmdpbi1sZWZ0OmF1dG87bWFyZ2luLXJpZ2h0OmF1dG99LmNsb3Nle3JpZ2h0OjEycHh9LmV4dGVuZGVkLXNlYXJjaC1ib3h7bWFyZ2luOjEycHh9LmFkdmFuY2VkLXNlYXJjaC1idXR0b257bWFyZ2luLWxlZnQ6MTBweH0uZnVsbC13aWR0aHt3aWR0aDoxMDAlfS5oaWRle2Rpc3BsYXk6bm9uZX0uaW5hY3RpdmUsLm11dGV7Y29sb3I6IzdhN2E3YX0uc2VhcmNoLXBhbmVse2JhY2tncm91bmQtY29sb3I6I2Y5ZjlmOTtib3JkZXItcmFkaXVzOjRweDtkaXNwbGF5OmlubGluZS1mbGV4O2hlaWdodDo0MHB4O3Bvc2l0aW9uOnJlbGF0aXZlO3dpZHRoOjY4MHB4O3otaW5kZXg6MTB9LnNlYXJjaC1wYW5lbDpob3Zlcntib3gtc2hhZG93OjAgMXB4IDNweCByZ2JhKDAsMCwwLC41KX0uc2VhcmNoLXBhbmVsIGRpdi5pbnB1dC1maWVsZHtmbGV4OjF9LnNlYXJjaC1wYW5lbCBkaXYuaW5wdXQtZmllbGQgaW5wdXR7Ym9yZGVyLXN0eWxlOm5vbmU7Zm9udC1zaXplOjE0cHQ7aGVpZ2h0OjM4cHg7cG9zaXRpb246YWJzb2x1dGU7d2lkdGg6Y2FsYygxMDAlIC0gODBweCl9LnNlYXJjaC1wYW5lbCBkaXYuaW5wdXQtZmllbGQgaW5wdXQ6YWN0aXZlLC5zZWFyY2gtcGFuZWwgZGl2LmlucHV0LWZpZWxkIGlucHV0OmZvY3Vze291dGxpbmU6MH0uc2VhcmNoLXBhbmVsIGRpdiAucHJlZml4LC5zZWFyY2gtcGFuZWwgZGl2IC5zdWZmaXh7YmFja2dyb3VuZC1jb2xvcjojZmZmO2JvcmRlci1yYWRpdXM6M3B4O2JvcmRlci1zdHlsZTpub25lO2NvbG9yOnJnYmEoNDEsNDEsNDEsLjQpO2N1cnNvcjpwb2ludGVyO2hlaWdodDozOHB4O291dGxpbmU6MDtwb3NpdGlvbjpyZWxhdGl2ZTt3aWR0aDo0MHB4fS5zZWFyY2gtcGFuZWwgZGl2IC5wcmVmaXg6YWN0aXZlLC5zZWFyY2gtcGFuZWwgZGl2IC5zdWZmaXg6YWN0aXZle2NvbG9yOiM1MTUxNTF9LnNlYXJjaC1wYW5lbC5hY3RpdmV7Ym94LXNoYWRvdzowIDFweCAzcHggcmdiYSgwLDAsMCwuNSl9Lmt1aS1tZW51e2JveC1zaGFkb3c6MCAzcHggNXB4IC0xcHggcmdiYSgxMSwxMSwxMSwuMiksMCA2cHggMTBweCAwIHJnYmEoMTEsMTEsMTEsLjE0KSwwIDFweCAxOHB4IDAgcmdiYSgxMSwxMSwxMSwuMTIpO2JhY2tncm91bmQtY29sb3I6I2Y5ZjlmOTtib3JkZXItcmFkaXVzOjRweDtwb3NpdGlvbjphYnNvbHV0ZX0ua3VpLW1lbnUgLmt1aS1tZW51LWhlYWRlcntiYWNrZ3JvdW5kLWNvbG9yOiNmOWY5Zjk7Ym9yZGVyLXRvcC1sZWZ0LXJhZGl1czo0cHg7Ym9yZGVyLXRvcC1yaWdodC1yYWRpdXM6NHB4O2Rpc3BsYXk6aW5saW5lLWJsb2NrO2hlaWdodDo0OHB4O3dpZHRoOjEwMCV9Lmt1aS1tZW51IC5rdWktbWVudS1oZWFkZXIgLmt1aS1tZW51LXRpdGxle2Zsb2F0OmxlZnQ7Zm9udC1zaXplOjE0cHg7Zm9udC13ZWlnaHQ6NDAwO21hcmdpbi10b3A6NHB4O3BhZGRpbmc6MTJweH0ua3VpLW1lbnUgLmt1aS1tZW51LWhlYWRlciAua3VpLW1lbnUtYWN0aW9ue2Zsb2F0OnJpZ2h0O21hcmdpbjo0cHh9Lmt1aS1tZW51LmV4dGVuZGVkLXNlYXJjaCwua3VpLW1lbnUuc2ltcGxlLXNlYXJjaHttaW4taGVpZ2h0OjY4MHB4O3dpZHRoOjY4MHB4fS5rdWktbWVudS5zaW1wbGUtc2VhcmNoe3BhZGRpbmctdG9wOjYwcHg7ei1pbmRleDotMX0ua3VpLW1lbnUuc2ltcGxlLXNlYXJjaCAua3VpLXByZXZpb3VzLXNlYXJjaC1saXN0IC5tYXQtbGlzdC1pdGVte2N1cnNvcjpwb2ludGVyfS5rdWktbWVudS5zaW1wbGUtc2VhcmNoIC5rdWktcHJldmlvdXMtc2VhcmNoLWxpc3QgLm1hdC1saXN0LWl0ZW06aG92ZXJ7YmFja2dyb3VuZC1jb2xvcjojZjlmOWY5fS5rdWktbWVudS5zaW1wbGUtc2VhcmNoIC5rdWktcHJldmlvdXMtc2VhcmNoLWxpc3QgLm1hdC1saXN0LWl0ZW06aG92ZXIgbWF0LWljb257ZGlzcGxheTpibG9ja30ua3VpLW1lbnUuc2ltcGxlLXNlYXJjaCAua3VpLXByZXZpb3VzLXNlYXJjaC1saXN0IC5tYXQtbGlzdC1pdGVtIG1hdC1pY29ue2Rpc3BsYXk6bm9uZX0ua3VpLW1lbnUuc2ltcGxlLXNlYXJjaCAucmlnaHR7bWFyZ2luLXRvcDoxMnB4O21hcmdpbi1sZWZ0OjE2cHh9Lmt1aS1tZW51LmV4dGVuZGVkLXNlYXJjaHt6LWluZGV4OjIwfS5zZWFyY2gtYmFyLWVsZW1lbnRze2Rpc3BsYXk6ZmxleDtwb3NpdGlvbjpyZWxhdGl2ZTt6LWluZGV4OjEwMH0uc2hvd3tkaXNwbGF5OmJsb2NrfUBtZWRpYSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6MTAyNHB4KXsuc2VhcmNoLXBhbmVse3dpZHRoOjQ4MHB4fS5zZWFyY2gtcGFuZWwgZGl2LmlucHV0LWZpZWxkIGlucHV0e3dpZHRoOmNhbGMoNDgwcHggLSA4MHB4KX0ua3VpLW1lbnUuZXh0ZW5kZWQtc2VhcmNoLC5rdWktbWVudS5zaW1wbGUtc2VhcmNoe3dpZHRoOjQ4MHB4fX1AbWVkaWEgc2NyZWVuIGFuZCAobWF4LXdpZHRoOjc2OHB4KXsuc2VhcmNoLXBhbmVse3dpZHRoOmNhbGMoNDgwcHggLSAxNjBweCl9LnNlYXJjaC1wYW5lbCBkaXYuaW5wdXQtZmllbGQgaW5wdXR7d2lkdGg6Y2FsYyg0ODBweCAtIDE2MHB4IC0gODBweCl9Lmt1aS1tZW51LmV4dGVuZGVkLXNlYXJjaCwua3VpLW1lbnUuc2ltcGxlLXNlYXJjaHt3aWR0aDpjYWxjKDQ4MHB4IC0gODBweCl9fWBdLFxuICAgIGFuaW1hdGlvbnM6IFtcbiAgICAgICAgdHJpZ2dlcignc2ltcGxlU2VhcmNoTWVudScsXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgc3RhdGUoJ2luYWN0aXZlJywgc3R5bGUoeyBkaXNwbGF5OiAnbm9uZScgfSkpLFxuICAgICAgICAgICAgICAgIHN0YXRlKCdhY3RpdmUnLCBzdHlsZSh7IGRpc3BsYXk6ICdibG9jaycgfSkpLFxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb24oJ2luYWN0aXZlID0+IHRydWUnLCBhbmltYXRlKCcxMDBtcyBlYXNlLWluJykpLFxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb24oJ3RydWUgPT4gaW5hY3RpdmUnLCBhbmltYXRlKCcxMDBtcyBlYXNlLW91dCcpKVxuICAgICAgICAgICAgXVxuICAgICAgICApLFxuICAgICAgICB0cmlnZ2VyKCdleHRlbmRlZFNlYXJjaE1lbnUnLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgIHN0YXRlKCdpbmFjdGl2ZScsIHN0eWxlKHsgZGlzcGxheTogJ25vbmUnIH0pKSxcbiAgICAgICAgICAgICAgICBzdGF0ZSgnYWN0aXZlJywgc3R5bGUoeyBkaXNwbGF5OiAnYmxvY2snIH0pKSxcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uKCdpbmFjdGl2ZSA9PiB0cnVlJywgYW5pbWF0ZSgnMTAwbXMgZWFzZS1pbicpKSxcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uKCd0cnVlID0+IGluYWN0aXZlJywgYW5pbWF0ZSgnMTAwbXMgZWFzZS1vdXQnKSlcbiAgICAgICAgICAgIF1cbiAgICAgICAgKSxcbiAgICBdXG59KVxuXG4vKipcbiAqIENvbnRhaW5zIG1ldGhvZHMgdG8gcmVhbGlzZSwgcmVzZXQgbmV3IG9yIHByZXZpb3VzIHNpbXBsZSBzZWFyY2hlcy5cbiAqL1xuZXhwb3J0IGNsYXNzIFNlYXJjaENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgICBASW5wdXQoKSByb3V0ZTogc3RyaW5nID0gJy9zZWFyY2gnO1xuXG4gICAgc2VhcmNoUXVlcnk6IHN0cmluZztcblxuICAgIHNlYXJjaFBhbmVsRm9jdXM6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIHByZXZTZWFyY2g6IHN0cmluZ1tdID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncHJldlNlYXJjaCcpKTtcblxuICAgIGZvY3VzT25TaW1wbGU6IHN0cmluZyA9ICdpbmFjdGl2ZSc7XG4gICAgZm9jdXNPbkV4dGVuZGVkOiBzdHJpbmcgPSAnaW5hY3RpdmUnO1xuXG4gICAgc2VhcmNoTGFiZWw6IHN0cmluZyA9ICdTZWFyY2gnO1xuXG4gICAgc2hvd1NpbXBsZVNlYXJjaDogYm9vbGVhbiA9IHRydWU7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9yb3V0ZTogQWN0aXZhdGVkUm91dGUsXG4gICAgICAgIHByaXZhdGUgX3JvdXRlcjogUm91dGVyLFxuICAgICAgICBwcml2YXRlIF9lbGVSZWY6IEVsZW1lbnRSZWYpIHtcblxuICAgIH1cblxuICAgIG5nT25Jbml0KCkge1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBpZ25vcmVcbiAgICAgKiBEbyBzZWFyY2ggb24gRW50ZXIgY2xpY2ssIHJlc2V0IHNlYXJjaCBvbiBFc2NhcGVcbiAgICAgKiBAcGFyYW0gc2VhcmNoX2VsZVxuICAgICAqIEBwYXJhbSBldmVudFxuICAgICAqIEByZXR1cm5zIHZvaWRcbiAgICAgKi9cbiAgICBvbktleShzZWFyY2hfZWxlOiBIVE1MRWxlbWVudCwgZXZlbnQpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5mb2N1c09uU2ltcGxlID0gJ2FjdGl2ZSc7XG4gICAgICAgIHRoaXMucHJldlNlYXJjaCA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3ByZXZTZWFyY2gnKSk7XG4gICAgICAgIGlmICh0aGlzLnNlYXJjaFF1ZXJ5ICYmIChldmVudC5rZXkgPT09ICdFbnRlcicgfHwgZXZlbnQua2V5Q29kZSA9PT0gMTMgfHwgZXZlbnQud2hpY2ggPT09IDEzKSkge1xuICAgICAgICAgICAgdGhpcy5kb1NlYXJjaChzZWFyY2hfZWxlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXZlbnQua2V5ID09PSAnRXNjYXBlJyB8fCBldmVudC5rZXlDb2RlID09PSAyNyB8fCBldmVudC53aGljaCA9PT0gMjcpIHtcbiAgICAgICAgICAgIHRoaXMucmVzZXRTZWFyY2goc2VhcmNoX2VsZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZWFsaXNlIGEgc2ltcGxlIHNlYXJjaFxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHNlYXJjaF9lbGVcbiAgICAgKiBAcmV0dXJucyB2b2lkXG4gICAgICovXG4gICAgZG9TZWFyY2goc2VhcmNoX2VsZTogSFRNTEVsZW1lbnQpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuc2VhcmNoUXVlcnkgIT09IHVuZGVmaW5lZCAmJiB0aGlzLnNlYXJjaFF1ZXJ5ICE9PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLnRvZ2dsZU1lbnUoJ3NpbXBsZVNlYXJjaCcpO1xuICAgICAgICAgICAgdGhpcy5fcm91dGVyLm5hdmlnYXRlKFt0aGlzLnJvdXRlICsgJy9mdWxsdGV4dC8nICsgdGhpcy5zZWFyY2hRdWVyeV0pO1xuXG4gICAgICAgICAgICAvLyB0aGlzLl9yb3V0ZXIubmF2aWdhdGUoWycvc2VhcmNoL2Z1bGx0ZXh0LycgKyB0aGlzLnNlYXJjaFF1ZXJ5XSwgeyByZWxhdGl2ZVRvOiB0aGlzLl9yb3V0ZSB9KTtcblxuICAgICAgICAgICAgLy8gcHVzaCB0aGUgc2VhcmNoIHF1ZXJ5IGludG8gdGhlIGxvY2FsIHN0b3JhZ2UgcHJldlNlYXJjaCBhcnJheSAocHJldmlvdXMgc2VhcmNoKVxuICAgICAgICAgICAgLy8gdG8gaGF2ZSBhIGxpc3Qgb2YgcmVjZW50IHNlYXJjaCByZXF1ZXN0c1xuICAgICAgICAgICAgbGV0IGV4aXN0aW5nUHJldlNlYXJjaDogc3RyaW5nW10gPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdwcmV2U2VhcmNoJykpO1xuICAgICAgICAgICAgaWYgKGV4aXN0aW5nUHJldlNlYXJjaCA9PT0gbnVsbCkgeyBleGlzdGluZ1ByZXZTZWFyY2ggPSBbXTsgfVxuICAgICAgICAgICAgbGV0IGk6IG51bWJlciA9IDA7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIGV4aXN0aW5nUHJldlNlYXJjaCkge1xuICAgICAgICAgICAgICAgIC8vIHJlbW92ZSBlbnRyeSwgaWYgZXhpc3RzIGFscmVhZHlcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zZWFyY2hRdWVyeSA9PT0gZW50cnkpIHsgZXhpc3RpbmdQcmV2U2VhcmNoLnNwbGljZShpLCAxKTsgfVxuICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZXhpc3RpbmdQcmV2U2VhcmNoLnB1c2godGhpcy5zZWFyY2hRdWVyeSk7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncHJldlNlYXJjaCcsIEpTT04uc3RyaW5naWZ5KGV4aXN0aW5nUHJldlNlYXJjaCkpO1xuICAgICAgICAgICAgLy8gVE9ETzogc2F2ZSB0aGUgcHJldmlvdXMgc2VhcmNoIHF1ZXJpZXMgc29tZXdoZXJlIGluIHRoZSB1c2VyJ3MgcHJvZmlsZVxuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZWFyY2hfZWxlLmZvY3VzKCk7XG4gICAgICAgICAgICB0aGlzLnByZXZTZWFyY2ggPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdwcmV2U2VhcmNoJykpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGlnbm9yZVxuICAgICAqXG4gICAgICogUmVzZXQgdGhlIHNlYXJjaFxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHNlYXJjaF9lbGVcbiAgICAgKiBAcmV0dXJucyB2b2lkXG4gICAgICovXG4gICAgcmVzZXRTZWFyY2goc2VhcmNoX2VsZTogSFRNTEVsZW1lbnQpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zZWFyY2hRdWVyeSA9IG51bGw7XG4gICAgICAgIHNlYXJjaF9lbGUuZm9jdXMoKTtcbiAgICAgICAgdGhpcy5mb2N1c09uU2ltcGxlID0gJ2luYWN0aXZlJztcbiAgICAgICAgdGhpcy5zZWFyY2hQYW5lbEZvY3VzID0gIXRoaXMuc2VhcmNoUGFuZWxGb2N1cztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaWdub3JlXG4gICAgICpcbiAgICAgKiBSZWFsaXNlIGEgcHJldmlvdXMgc2VhcmNoXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHF1ZXJ5XG4gICAgICogQHJldHVybnMgdm9pZFxuICAgICAqL1xuICAgIGRvUHJldlNlYXJjaChxdWVyeTogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc2VhcmNoUXVlcnkgPSBxdWVyeTtcbiAgICAgICAgdGhpcy5fcm91dGVyLm5hdmlnYXRlKFt0aGlzLnJvdXRlICsgJy9mdWxsdGV4dC8nICsgcXVlcnldLCB7IHJlbGF0aXZlVG86IHRoaXMuX3JvdXRlIH0pO1xuICAgICAgICB0aGlzLnRvZ2dsZU1lbnUoJ3NpbXBsZVNlYXJjaCcpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBpZ25vcmVcbiAgICAgKlxuICAgICAqIFJlc2V0IHByZXZpb3VzIHNlYXJjaGVzIC0gdGhlIHdob2xlIHByZXZpb3VzIHNlYXJjaCBvciBzcGVjaWZpYyBpdGVtIGJ5IG5hbWVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSB0ZXJtIG9mIHRoZSBzZWFyY2hcbiAgICAgKiBAcmV0dXJucyB2b2lkXG4gICAgICovXG4gICAgcmVzZXRQcmV2U2VhcmNoKG5hbWU6IHN0cmluZyA9IG51bGwpOiB2b2lkIHtcbiAgICAgICAgaWYgKG5hbWUpIHtcbiAgICAgICAgICAgIC8vIGRlbGV0ZSBvbmx5IHRoaXMgaXRlbSB3aXRoIHRoZSBuYW1lIC4uLlxuICAgICAgICAgICAgY29uc3QgaTogbnVtYmVyID0gdGhpcy5wcmV2U2VhcmNoLmluZGV4T2YobmFtZSk7XG4gICAgICAgICAgICB0aGlzLnByZXZTZWFyY2guc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3ByZXZTZWFyY2gnLCBKU09OLnN0cmluZ2lmeSh0aGlzLnByZXZTZWFyY2gpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGRlbGV0ZSB0aGUgd2hvbGUgXCJwcmV2aW91cyBzZWFyY2hcIiBhcnJheVxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ3ByZXZTZWFyY2gnKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnByZXZTZWFyY2ggPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdwcmV2U2VhcmNoJykpO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGlnbm9yZVxuICAgICAqIFNldCBzaW1wbGUgZm9jdXMgdG8gYWN0aXZlXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB2b2lkXG4gICAgICovXG4gICAgc2V0Rm9jdXMoKTogdm9pZCB7XG4gICAgICAgIHRoaXMucHJldlNlYXJjaCA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3ByZXZTZWFyY2gnKSk7XG4gICAgICAgIHRoaXMuZm9jdXNPblNpbXBsZSA9ICdhY3RpdmUnO1xuICAgICAgICB0aGlzLnNlYXJjaFBhbmVsRm9jdXMgPSAhdGhpcy5zZWFyY2hQYW5lbEZvY3VzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBpZ25vcmVcbiAgICAgKlxuICAgICAqIFN3aXRjaCBhY2NvcmRpbmcgdG8gdGhlIGZvY3VzIGJldHdlZW4gc2ltcGxlIG9yIGV4dGVuZGVkIHNlYXJjaFxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgMiBjYXNlczogc2ltcGxlU2VhcmNoIG9yIGV4dGVuZGVkU2VhcmNoXG4gICAgICogQHJldHVybnMgdm9pZFxuICAgICAqL1xuICAgIHRvZ2dsZU1lbnUobmFtZTogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIHN3aXRjaCAobmFtZSkge1xuICAgICAgICAgICAgY2FzZSAnc2ltcGxlU2VhcmNoJzpcbiAgICAgICAgICAgICAgICB0aGlzLnByZXZTZWFyY2ggPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdwcmV2U2VhcmNoJykpO1xuICAgICAgICAgICAgICAgIHRoaXMuZm9jdXNPblNpbXBsZSA9ICh0aGlzLmZvY3VzT25TaW1wbGUgPT09ICdhY3RpdmUnID8gJ2luYWN0aXZlJyA6ICdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dTaW1wbGVTZWFyY2ggPSB0cnVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnZXh0ZW5kZWRTZWFyY2gnOlxuICAgICAgICAgICAgICAgIHRoaXMuZm9jdXNPbkV4dGVuZGVkID0gKHRoaXMuZm9jdXNPbkV4dGVuZGVkID09PSAnYWN0aXZlJyA/ICdpbmFjdGl2ZScgOiAnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5zaG93U2ltcGxlU2VhcmNoID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBhbmltYXRlLCBzdGF0ZSwgc3R5bGUsIHRyYW5zaXRpb24sIHRyaWdnZXIgfSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAna3VpLXNlYXJjaC1wYW5lbCcsXG4gIHRlbXBsYXRlOiBgPGRpdiBjbGFzcz1cImt1aS1zZWFyY2gtcGFuZWxcIj5cblxuICAgIDxkaXYgY2xhc3M9XCJrdWktc2VhcmNoLWJhclwiPlxuXG4gICAgICAgIDxkaXYgY2xhc3M9XCJmdWxsdGV4dC1zZWFyY2hcIj5cbiAgICAgICAgICAgIDxrdWktZnVsbHRleHQtc2VhcmNoIFtyb3V0ZV09XCJyb3V0ZVwiPjwva3VpLWZ1bGx0ZXh0LXNlYXJjaD5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiAqbmdJZj1cInNob3dNZW51XCIgW0BleHRlbmRlZFNlYXJjaE1lbnVdPVwiZm9jdXNPbkV4dGVuZGVkXCIgY2xhc3M9XCJrdWktbWVudSBleHRlbmRlZC1zZWFyY2hcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJrdWktbWVudS1oZWFkZXJcIj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImt1aS1tZW51LXRpdGxlXCI+XG4gICAgICAgICAgICAgICAgICAgIDxoND5BZHZhbmNlZCBzZWFyY2g8L2g0PlxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImt1aS1tZW51LWFjdGlvblwiPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIG1hdC1pY29uLWJ1dHRvbiAoY2xpY2spPVwidG9nZ2xlTWVudSgpXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bWF0LWljb24+Y2xvc2U8L21hdC1pY29uPlxuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJleHRlbmRlZC1zZWFyY2gtYm94XCI+XG4gICAgICAgICAgICAgICAgPGt1aS1leHRlbmRlZC1zZWFyY2ggW3JvdXRlXT1cInJvdXRlXCIgKHRvZ2dsZUV4dGVuZGVkU2VhcmNoRm9ybSk9XCJ0b2dnbGVNZW51KClcIj48L2t1aS1leHRlbmRlZC1zZWFyY2g+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICA8L2Rpdj5cblxuICAgIDxkaXYgY2xhc3M9XCJhZHZhbmNlZC1idG5cIj5cbiAgICAgICAgPGJ1dHRvbiBtYXQtYnV0dG9uIGNvbG9yPVwicHJpbWFyeVwiIChjbGljayk9XCJ0b2dnbGVNZW51KClcIj5hZHZhbmNlZDwvYnV0dG9uPlxuICAgIDwvZGl2PlxuXG48L2Rpdj5gLFxuICBzdHlsZXM6IFtgLmFkdmFuY2VkLWJ0bnttYXJnaW4tbGVmdDoxMHB4fS5rdWktc2VhcmNoLXBhbmVse2Rpc3BsYXk6ZmxleDtwb3NpdGlvbjpyZWxhdGl2ZTt6LWluZGV4OjEwMH0ua3VpLXNlYXJjaC1iYXJ7YmFja2dyb3VuZC1jb2xvcjojZjlmOWY5O2JvcmRlci1yYWRpdXM6NHB4O2Rpc3BsYXk6aW5saW5lLWZsZXg7aGVpZ2h0OjQwcHg7cG9zaXRpb246cmVsYXRpdmU7ei1pbmRleDoxMH0ua3VpLXNlYXJjaC1iYXI6aG92ZXJ7Ym94LXNoYWRvdzowIDFweCAzcHggcmdiYSgwLDAsMCwuNSl9Lmt1aS1tZW51e2JveC1zaGFkb3c6MCAzcHggNXB4IC0xcHggcmdiYSgxMSwxMSwxMSwuMiksMCA2cHggMTBweCAwIHJnYmEoMTEsMTEsMTEsLjE0KSwwIDFweCAxOHB4IDAgcmdiYSgxMSwxMSwxMSwuMTIpO2JhY2tncm91bmQtY29sb3I6I2Y5ZjlmOTtib3JkZXItcmFkaXVzOjRweDtwb3NpdGlvbjphYnNvbHV0ZX0ua3VpLW1lbnUgLmt1aS1tZW51LWhlYWRlcntiYWNrZ3JvdW5kLWNvbG9yOiNmOWY5Zjk7Ym9yZGVyLXRvcC1sZWZ0LXJhZGl1czo0cHg7Ym9yZGVyLXRvcC1yaWdodC1yYWRpdXM6NHB4O2Rpc3BsYXk6aW5saW5lLWJsb2NrO2hlaWdodDo0OHB4O3dpZHRoOjEwMCV9Lmt1aS1tZW51IC5rdWktbWVudS1oZWFkZXIgLmt1aS1tZW51LXRpdGxle2Zsb2F0OmxlZnQ7Zm9udC1zaXplOjE0cHg7Zm9udC13ZWlnaHQ6NDAwO21hcmdpbi10b3A6NHB4O3BhZGRpbmc6MTJweH0ua3VpLW1lbnUgLmt1aS1tZW51LWhlYWRlciAua3VpLW1lbnUtYWN0aW9ue2Zsb2F0OnJpZ2h0O21hcmdpbjo0cHh9Lmt1aS1tZW51LmV4dGVuZGVkLXNlYXJjaHttaW4taGVpZ2h0OjY4MHB4O3dpZHRoOjY4MHB4O3otaW5kZXg6MjB9LmV4dGVuZGVkLXNlYXJjaC1ib3h7bWFyZ2luOjEycHh9QG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDoxMDI0cHgpey5rdWktc2VhcmNoLWJhcnt3aWR0aDo0ODBweH0ua3VpLXNlYXJjaC1iYXIgZGl2LmlucHV0LWZpZWxkIGlucHV0e3dpZHRoOmNhbGMoNDgwcHggLSA4MHB4KX0uZnVsbHRleHQtc2VhcmNoLC5rdWktbWVudS5leHRlbmRlZC1zZWFyY2h7d2lkdGg6NDgwcHh9fUBtZWRpYSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6NzY4cHgpey5rdWktc2VhcmNoLWJhcnt3aWR0aDpjYWxjKDQ4MHB4IC0gMTYwcHgpfS5rdWktc2VhcmNoLWJhciBkaXYuaW5wdXQtZmllbGQgaW5wdXR7d2lkdGg6Y2FsYyg0ODBweCAtIDE2MHB4IC0gODBweCl9LmZ1bGx0ZXh0LXNlYXJjaCwua3VpLW1lbnUuZXh0ZW5kZWQtc2VhcmNoe3dpZHRoOmNhbGMoNDgwcHggLSA4MHB4KX19YF0sXG4gIGFuaW1hdGlvbnM6IFtcbiAgICB0cmlnZ2VyKCdleHRlbmRlZFNlYXJjaE1lbnUnLFxuICAgICAgW1xuICAgICAgICBzdGF0ZSgnaW5hY3RpdmUnLCBzdHlsZSh7IGRpc3BsYXk6ICdub25lJyB9KSksXG4gICAgICAgIHN0YXRlKCdhY3RpdmUnLCBzdHlsZSh7IGRpc3BsYXk6ICdibG9jaycgfSkpLFxuICAgICAgICB0cmFuc2l0aW9uKCdpbmFjdGl2ZSA9PiBhY3RpdmUnLCBhbmltYXRlKCcxMDBtcyBlYXNlLWluJykpLFxuICAgICAgICB0cmFuc2l0aW9uKCdhY3RpdmUgPT4gaW5hY3RpdmUnLCBhbmltYXRlKCcxMDBtcyBlYXNlLW91dCcpKVxuICAgICAgXVxuICAgIClcbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBTZWFyY2hQYW5lbENvbXBvbmVudCB7XG5cbiAgQElucHV0KCkgcm91dGU6IHN0cmluZyA9ICcvc2VhcmNoJztcbiAgc2hvd01lbnU6IGJvb2xlYW4gPSBmYWxzZTtcbiAgZm9jdXNPbkV4dGVuZGVkOiBzdHJpbmcgPSAnaW5hY3RpdmUnO1xuXG4gIGNvbnN0cnVjdG9yKCkgeyB9XG5cbiAgLyoqXG4gICAqIFNob3cgb3IgaGlkZSB0aGUgZXh0ZW5kZWQgc2VhcmNoIG1lbnVcbiAgICpcbiAgICogQHJldHVybnMgdm9pZFxuICAgKi9cbiAgdG9nZ2xlTWVudSgpOiB2b2lkIHtcbiAgICB0aGlzLnNob3dNZW51ID0gIXRoaXMuc2hvd01lbnU7XG4gICAgdGhpcy5mb2N1c09uRXh0ZW5kZWQgPSAodGhpcy5mb2N1c09uRXh0ZW5kZWQgPT09ICdhY3RpdmUnID8gJ2luYWN0aXZlJyA6ICdhY3RpdmUnKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgYW5pbWF0ZSwgc3RhdGUsIHN0eWxlLCB0cmFuc2l0aW9uLCB0cmlnZ2VyIH0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5pbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFjdGl2YXRlZFJvdXRlLCBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ2t1aS1mdWxsdGV4dC1zZWFyY2gnLFxuICAgIHRlbXBsYXRlOiBgPGRpdiBjbGFzcz1cInNlYXJjaC1iYXItZWxlbWVudHNcIj5cblxuICAgIDxkaXYgY2xhc3M9XCJmdWxsdGV4dC1zZWFyY2gtYmFyXCIgW2NsYXNzLmFjdGl2ZV09XCJzZWFyY2hQYW5lbEZvY3VzXCI+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwicHJlZml4XCIgKGNsaWNrKT1cImRvU2VhcmNoKHNlYXJjaClcIj5cbiAgICAgICAgICAgICAgICA8bWF0LWljb24+c2VhcmNoPC9tYXQtaWNvbj5cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8ZGl2IGNsYXNzPVwiaW5wdXQtZmllbGRcIj5cbiAgICAgICAgICAgIDxpbnB1dCAjc2VhcmNoIGF1dG9jb21wbGV0ZT1cIm9mZlwiIHR5cGU9XCJzZWFyY2hcIiBbcGxhY2Vob2xkZXJdPVwic2VhcmNoTGFiZWxcIiBbKG5nTW9kZWwpXT1cInNlYXJjaFF1ZXJ5XCIgbmFtZT1cInNlYXJjaFwiIChrZXl1cC5lc2MpPVwicmVzZXRTZWFyY2goc2VhcmNoKVwiIChrZXl1cCk9XCJvbktleShzZWFyY2gsICRldmVudClcIiAoY2xpY2spPVwic2V0Rm9jdXMoKVwiIChmb2N1cyk9XCJ0b2dnbGVNZW51KClcIiAvPlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8IS0tIHN3aXRjaCBidXR0b246IG9uIHNvbWUgZm9jdXMgd2UgbmVlZCBhIGNsb3NlIGJ1dHRvbiBmb3IgdGhlIHNpbXBsZSAtLT5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJzdWZmaXhcIiAqbmdJZj1cImZvY3VzT25TaW1wbGUgPT09ICdhY3RpdmUnXCIgKGNsaWNrKT1cInJlc2V0U2VhcmNoKHNlYXJjaClcIj5cbiAgICAgICAgICAgICAgICA8bWF0LWljb24+Y2xvc2U8L21hdC1pY29uPlxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwic3VmZml4XCIgKm5nSWY9XCJmb2N1c09uU2ltcGxlID09PSAnaW5hY3RpdmUnXCI+PC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDwhLS0gXCJkcm9wZG93blwiIG1lbnUgZm9yIHNpbXBsZSBzZWFyY2ggLS0+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJrdWktbWVudSBzaW1wbGUtc2VhcmNoXCIgW0BmdWxsdGV4dFNlYXJjaE1lbnVdPVwiZm9jdXNPblNpbXBsZVwiICpuZ0lmPVwic2hvd1NpbXBsZVNlYXJjaFwiPlxuICAgICAgICAgICAgPG1hdC1saXN0IGNsYXNzPVwia3VpLXByZXZpb3VzLXNlYXJjaC1saXN0XCI+XG4gICAgICAgICAgICAgICAgPG1hdC1saXN0LWl0ZW0gKm5nRm9yPVwibGV0IGl0ZW0gb2YgcHJldlNlYXJjaCB8IGt1aVJldmVyc2U7IGxldCBpPWluZGV4XCI+XG4gICAgICAgICAgICAgICAgICAgIDxoNCBtYXQtbGluZSAqbmdJZj1cImk8MTBcIiAoY2xpY2spPVwiZG9QcmV2U2VhcmNoKGl0ZW0pXCI+e3tpdGVtfX08L2g0PlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIG1hdC1pY29uLWJ1dHRvbiAoY2xpY2spPVwicmVzZXRQcmV2U2VhcmNoKGl0ZW0pXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bWF0LWljb24gYXJpYS1sYWJlbD1cImNsb3NlXCI+Y2xvc2U8L21hdC1pY29uPlxuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L21hdC1saXN0LWl0ZW0+XG4gICAgICAgICAgICA8L21hdC1saXN0PlxuICAgICAgICAgICAgPGJ1dHRvbiBtYXQtc3Ryb2tlZC1idXR0b24gY29sb3I9XCJhY2NlbnRcIiBjbGFzcz1cInJpZ2h0XCIgKGNsaWNrKT1cInJlc2V0UHJldlNlYXJjaCgpXCIgKm5nSWY9XCJwcmV2U2VhcmNoXCI+Q2xlYXI8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICA8L2Rpdj5cbjwvZGl2PmAsXG4gICAgc3R5bGVzOiBbYGlucHV0W3R5cGU9c2VhcmNoXTo6LXdlYmtpdC1zZWFyY2gtY2FuY2VsLWJ1dHRvbixpbnB1dFt0eXBlPXNlYXJjaF06Oi13ZWJraXQtc2VhcmNoLWRlY29yYXRpb24saW5wdXRbdHlwZT1zZWFyY2hdOjotd2Via2l0LXNlYXJjaC1yZXN1bHRzLWJ1dHRvbixpbnB1dFt0eXBlPXNlYXJjaF06Oi13ZWJraXQtc2VhcmNoLXJlc3VsdHMtZGVjb3JhdGlvbntkaXNwbGF5Om5vbmV9aW5wdXRbdHlwZT1zZWFyY2hdey1tb3otYXBwZWFyYW5jZTpub25lOy13ZWJraXQtYXBwZWFyYW5jZTpub25lfS5mdWxsLXdpZHRoe3dpZHRoOjEwMCV9LmNsb3Nle3JpZ2h0OjEycHh9LmhpZGV7ZGlzcGxheTpub25lfS5zaG93e2Rpc3BsYXk6YmxvY2t9LnNlYXJjaC1iYXItZWxlbWVudHN7ZGlzcGxheTpmbGV4O3Bvc2l0aW9uOnJlbGF0aXZlO3otaW5kZXg6MTAwfS5pbmFjdGl2ZXtjb2xvcjojN2E3YTdhfS5mdWxsdGV4dC1zZWFyY2gtYmFye2JhY2tncm91bmQtY29sb3I6I2Y5ZjlmOTtib3JkZXItcmFkaXVzOjRweDtkaXNwbGF5OmlubGluZS1mbGV4O2hlaWdodDo0MHB4O3Bvc2l0aW9uOnJlbGF0aXZlO3dpZHRoOjY4MHB4O3otaW5kZXg6MTB9LmZ1bGx0ZXh0LXNlYXJjaC1iYXI6aG92ZXJ7Ym94LXNoYWRvdzowIDFweCAzcHggcmdiYSgwLDAsMCwuNSl9LmZ1bGx0ZXh0LXNlYXJjaC1iYXIgZGl2LmlucHV0LWZpZWxke2ZsZXg6MX0uZnVsbHRleHQtc2VhcmNoLWJhciBkaXYuaW5wdXQtZmllbGQgaW5wdXR7Ym9yZGVyLXN0eWxlOm5vbmU7Zm9udC1zaXplOjE0cHQ7aGVpZ2h0OjM4cHg7cG9zaXRpb246YWJzb2x1dGU7d2lkdGg6Y2FsYygxMDAlIC0gODBweCl9LmZ1bGx0ZXh0LXNlYXJjaC1iYXIgZGl2LmlucHV0LWZpZWxkIGlucHV0OmFjdGl2ZSwuZnVsbHRleHQtc2VhcmNoLWJhciBkaXYuaW5wdXQtZmllbGQgaW5wdXQ6Zm9jdXN7b3V0bGluZTowfS5mdWxsdGV4dC1zZWFyY2gtYmFyIGRpdiAucHJlZml4LC5mdWxsdGV4dC1zZWFyY2gtYmFyIGRpdiAuc3VmZml4e2JhY2tncm91bmQtY29sb3I6I2ZmZjtib3JkZXItcmFkaXVzOjNweDtib3JkZXItc3R5bGU6bm9uZTtjb2xvcjpyZ2JhKDQxLDQxLDQxLC40KTtjdXJzb3I6cG9pbnRlcjtoZWlnaHQ6MzhweDtvdXRsaW5lOjA7cG9zaXRpb246cmVsYXRpdmU7d2lkdGg6NDBweH0uZnVsbHRleHQtc2VhcmNoLWJhciBkaXYgLnByZWZpeDphY3RpdmUsLmZ1bGx0ZXh0LXNlYXJjaC1iYXIgZGl2IC5zdWZmaXg6YWN0aXZle2NvbG9yOiM1MTUxNTF9LmZ1bGx0ZXh0LXNlYXJjaC1iYXIgZGl2LmFjdGl2ZXtib3gtc2hhZG93OjAgMXB4IDNweCByZ2JhKDAsMCwwLC41KX0ua3VpLW1lbnV7Ym94LXNoYWRvdzowIDNweCA1cHggLTFweCByZ2JhKDExLDExLDExLC4yKSwwIDZweCAxMHB4IDAgcmdiYSgxMSwxMSwxMSwuMTQpLDAgMXB4IDE4cHggMCByZ2JhKDExLDExLDExLC4xMik7YmFja2dyb3VuZC1jb2xvcjojZjlmOWY5O2JvcmRlci1yYWRpdXM6NHB4O3Bvc2l0aW9uOmFic29sdXRlfS5rdWktbWVudS5zaW1wbGUtc2VhcmNoe21pbi1oZWlnaHQ6NjgwcHg7d2lkdGg6NjgwcHg7cGFkZGluZy10b3A6NjBweDt6LWluZGV4Oi0xfS5rdWktbWVudS5zaW1wbGUtc2VhcmNoIC5rdWktcHJldmlvdXMtc2VhcmNoLWxpc3QgLm1hdC1saXN0LWl0ZW17Y3Vyc29yOnBvaW50ZXJ9Lmt1aS1tZW51LnNpbXBsZS1zZWFyY2ggLmt1aS1wcmV2aW91cy1zZWFyY2gtbGlzdCAubWF0LWxpc3QtaXRlbTpob3ZlcntiYWNrZ3JvdW5kLWNvbG9yOiNmOWY5Zjl9Lmt1aS1tZW51LnNpbXBsZS1zZWFyY2ggLmt1aS1wcmV2aW91cy1zZWFyY2gtbGlzdCAubWF0LWxpc3QtaXRlbTpob3ZlciBtYXQtaWNvbntkaXNwbGF5OmJsb2NrfS5rdWktbWVudS5zaW1wbGUtc2VhcmNoIC5rdWktcHJldmlvdXMtc2VhcmNoLWxpc3QgLm1hdC1saXN0LWl0ZW0gbWF0LWljb257ZGlzcGxheTpub25lfS5rdWktbWVudS5zaW1wbGUtc2VhcmNoIC5yaWdodHttYXJnaW4tdG9wOjEycHg7bWFyZ2luLWxlZnQ6MTZweH1AbWVkaWEgc2NyZWVuIGFuZCAobWF4LXdpZHRoOjEwMjRweCl7LmZ1bGx0ZXh0LXNlYXJjaC1iYXJ7d2lkdGg6NDgwcHh9LmZ1bGx0ZXh0LXNlYXJjaC1iYXIgZGl2LmlucHV0LWZpZWxkIGlucHV0e3dpZHRoOmNhbGMoNDgwcHggLSA4MHB4KX0ua3VpLW1lbnUuc2ltcGxlLXNlYXJjaHt3aWR0aDo0ODBweH19QG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDo3NjhweCl7LmZ1bGx0ZXh0LXNlYXJjaC1iYXJ7d2lkdGg6Y2FsYyg0ODBweCAtIDE2MHB4KX0uZnVsbHRleHQtc2VhcmNoLWJhciBkaXYuaW5wdXQtZmllbGQgaW5wdXR7d2lkdGg6Y2FsYyg0ODBweCAtIDE2MHB4IC0gODBweCl9Lmt1aS1tZW51LnNpbXBsZS1zZWFyY2h7d2lkdGg6Y2FsYyg0ODBweCAtIDgwcHgpfX1gXSxcbiAgICBhbmltYXRpb25zOiBbXG4gICAgICAgIHRyaWdnZXIoJ2Z1bGx0ZXh0U2VhcmNoTWVudScsXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgc3RhdGUoJ2luYWN0aXZlJywgc3R5bGUoeyBkaXNwbGF5OiAnbm9uZScgfSkpLFxuICAgICAgICAgICAgICAgIHN0YXRlKCdhY3RpdmUnLCBzdHlsZSh7IGRpc3BsYXk6ICdibG9jaycgfSkpLFxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb24oJ2luYWN0aXZlID0+IGFjdGl2ZScsIGFuaW1hdGUoJzEwMG1zIGVhc2UtaW4nKSksXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbignYWN0aXZlID0+IGluYWN0aXZlJywgYW5pbWF0ZSgnMTAwbXMgZWFzZS1vdXQnKSlcbiAgICAgICAgICAgIF1cbiAgICAgICAgKVxuICAgIF1cbn0pXG5leHBvcnQgY2xhc3MgRnVsbHRleHRTZWFyY2hDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gICAgQElucHV0KCkgcm91dGU6IHN0cmluZyA9ICcvc2VhcmNoJztcblxuICAgIHNlYXJjaFF1ZXJ5OiBzdHJpbmc7XG5cbiAgICBzaG93U2ltcGxlU2VhcmNoOiBib29sZWFuID0gdHJ1ZTtcblxuICAgIHNlYXJjaFBhbmVsRm9jdXM6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIHByZXZTZWFyY2g6IHN0cmluZ1tdID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncHJldlNlYXJjaCcpKTtcblxuICAgIGZvY3VzT25TaW1wbGU6IHN0cmluZyA9ICdpbmFjdGl2ZSc7XG5cbiAgICBzZWFyY2hMYWJlbDogc3RyaW5nID0gJ1NlYXJjaCc7XG5cblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX3JvdXRlOiBBY3RpdmF0ZWRSb3V0ZSxcbiAgICAgICAgcHJpdmF0ZSBfcm91dGVyOiBSb3V0ZXIpIHtcbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEBpZ25vcmVcbiAgICAgKiBEbyBzZWFyY2ggb24gRW50ZXIgY2xpY2ssIHJlc2V0IHNlYXJjaCBvbiBFc2NhcGVcbiAgICAgKiBAcGFyYW0gc2VhcmNoX2VsZVxuICAgICAqIEBwYXJhbSBldmVudFxuICAgICAqIEByZXR1cm5zIHZvaWRcbiAgICAgKi9cbiAgICBvbktleShzZWFyY2hfZWxlOiBIVE1MRWxlbWVudCwgZXZlbnQpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5mb2N1c09uU2ltcGxlID0gJ2FjdGl2ZSc7XG4gICAgICAgIHRoaXMucHJldlNlYXJjaCA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3ByZXZTZWFyY2gnKSk7XG4gICAgICAgIGlmICh0aGlzLnNlYXJjaFF1ZXJ5ICYmIChldmVudC5rZXkgPT09ICdFbnRlcicgfHwgZXZlbnQua2V5Q29kZSA9PT0gMTMgfHwgZXZlbnQud2hpY2ggPT09IDEzKSkge1xuICAgICAgICAgICAgdGhpcy5kb1NlYXJjaChzZWFyY2hfZWxlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXZlbnQua2V5ID09PSAnRXNjYXBlJyB8fCBldmVudC5rZXlDb2RlID09PSAyNyB8fCBldmVudC53aGljaCA9PT0gMjcpIHtcbiAgICAgICAgICAgIHRoaXMucmVzZXRTZWFyY2goc2VhcmNoX2VsZSk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIFJlYWxpc2UgYSBzaW1wbGUgc2VhcmNoXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gc2VhcmNoX2VsZVxuICAgICAqIEByZXR1cm5zIHZvaWRcbiAgICAgKi9cbiAgICBkb1NlYXJjaChzZWFyY2hfZWxlOiBIVE1MRWxlbWVudCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5zZWFyY2hRdWVyeSAhPT0gdW5kZWZpbmVkICYmIHRoaXMuc2VhcmNoUXVlcnkgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMudG9nZ2xlTWVudSgpO1xuICAgICAgICAgICAgdGhpcy5fcm91dGVyLm5hdmlnYXRlKFt0aGlzLnJvdXRlICsgJy9mdWxsdGV4dC8nICsgdGhpcy5zZWFyY2hRdWVyeV0pO1xuXG4gICAgICAgICAgICAvLyB0aGlzLl9yb3V0ZXIubmF2aWdhdGUoWycvc2VhcmNoL2Z1bGx0ZXh0LycgKyB0aGlzLnNlYXJjaFF1ZXJ5XSwgeyByZWxhdGl2ZVRvOiB0aGlzLl9yb3V0ZSB9KTtcblxuICAgICAgICAgICAgLy8gcHVzaCB0aGUgc2VhcmNoIHF1ZXJ5IGludG8gdGhlIGxvY2FsIHN0b3JhZ2UgcHJldlNlYXJjaCBhcnJheSAocHJldmlvdXMgc2VhcmNoKVxuICAgICAgICAgICAgLy8gdG8gaGF2ZSBhIGxpc3Qgb2YgcmVjZW50IHNlYXJjaCByZXF1ZXN0c1xuICAgICAgICAgICAgbGV0IGV4aXN0aW5nUHJldlNlYXJjaDogc3RyaW5nW10gPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdwcmV2U2VhcmNoJykpO1xuICAgICAgICAgICAgaWYgKGV4aXN0aW5nUHJldlNlYXJjaCA9PT0gbnVsbCkgeyBleGlzdGluZ1ByZXZTZWFyY2ggPSBbXTsgfVxuICAgICAgICAgICAgbGV0IGk6IG51bWJlciA9IDA7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIGV4aXN0aW5nUHJldlNlYXJjaCkge1xuICAgICAgICAgICAgICAgIC8vIHJlbW92ZSBlbnRyeSwgaWYgZXhpc3RzIGFscmVhZHlcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zZWFyY2hRdWVyeSA9PT0gZW50cnkpIHsgZXhpc3RpbmdQcmV2U2VhcmNoLnNwbGljZShpLCAxKTsgfVxuICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGV4aXN0aW5nUHJldlNlYXJjaC5wdXNoKHRoaXMuc2VhcmNoUXVlcnkpO1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3ByZXZTZWFyY2gnLCBKU09OLnN0cmluZ2lmeShleGlzdGluZ1ByZXZTZWFyY2gpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNlYXJjaF9lbGUuZm9jdXMoKTtcbiAgICAgICAgICAgIHRoaXMucHJldlNlYXJjaCA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3ByZXZTZWFyY2gnKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXNldCB0aGUgc2VhcmNoXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gc2VhcmNoX2VsZVxuICAgICAqIEByZXR1cm5zIHZvaWRcbiAgICAgKi9cbiAgICByZXNldFNlYXJjaChzZWFyY2hfZWxlOiBIVE1MRWxlbWVudCk6IHZvaWQge1xuICAgICAgICB0aGlzLnNlYXJjaFF1ZXJ5ID0gbnVsbDtcbiAgICAgICAgc2VhcmNoX2VsZS5mb2N1cygpO1xuICAgICAgICB0aGlzLmZvY3VzT25TaW1wbGUgPSAnaW5hY3RpdmUnO1xuICAgICAgICB0aGlzLnNlYXJjaFBhbmVsRm9jdXMgPSAhdGhpcy5zZWFyY2hQYW5lbEZvY3VzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFN3aXRjaCBhY2NvcmRpbmcgdG8gdGhlIGZvY3VzIGJldHdlZW4gc2ltcGxlIG9yIGV4dGVuZGVkIHNlYXJjaFxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgMiBjYXNlczogc2ltcGxlU2VhcmNoIG9yIGV4dGVuZGVkU2VhcmNoXG4gICAgICogQHJldHVybnMgdm9pZFxuICAgICAqL1xuICAgIHRvZ2dsZU1lbnUoKTogdm9pZCB7XG4gICAgICAgIHRoaXMucHJldlNlYXJjaCA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3ByZXZTZWFyY2gnKSk7XG4gICAgICAgIHRoaXMuZm9jdXNPblNpbXBsZSA9ICh0aGlzLmZvY3VzT25TaW1wbGUgPT09ICdhY3RpdmUnID8gJ2luYWN0aXZlJyA6ICdhY3RpdmUnKTtcbiAgICAgICAgdGhpcy5zaG93U2ltcGxlU2VhcmNoID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXQgc2ltcGxlIGZvY3VzIHRvIGFjdGl2ZVxuICAgICAqXG4gICAgICogQHJldHVybnMgdm9pZFxuICAgICAqL1xuICAgIHNldEZvY3VzKCk6IHZvaWQge1xuICAgICAgICB0aGlzLnByZXZTZWFyY2ggPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdwcmV2U2VhcmNoJykpO1xuICAgICAgICB0aGlzLmZvY3VzT25TaW1wbGUgPSAnYWN0aXZlJztcbiAgICAgICAgdGhpcy5zZWFyY2hQYW5lbEZvY3VzID0gIXRoaXMuc2VhcmNoUGFuZWxGb2N1cztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZWFsaXNlIGEgcHJldmlvdXMgc2VhcmNoXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHF1ZXJ5XG4gICAgICogQHJldHVybnMgdm9pZFxuICAgICAqL1xuICAgIGRvUHJldlNlYXJjaChxdWVyeTogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc2VhcmNoUXVlcnkgPSBxdWVyeTtcbiAgICAgICAgdGhpcy5fcm91dGVyLm5hdmlnYXRlKFt0aGlzLnJvdXRlICsgJy9mdWxsdGV4dC8nICsgcXVlcnldLCB7IHJlbGF0aXZlVG86IHRoaXMuX3JvdXRlIH0pO1xuICAgICAgICB0aGlzLnRvZ2dsZU1lbnUoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXNldCBwcmV2aW91cyBzZWFyY2hlcyAtIHRoZSB3aG9sZSBwcmV2aW91cyBzZWFyY2ggb3Igc3BlY2lmaWMgaXRlbSBieSBuYW1lXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgdGVybSBvZiB0aGUgc2VhcmNoXG4gICAgICogQHJldHVybnMgdm9pZFxuICAgICAqL1xuICAgIHJlc2V0UHJldlNlYXJjaChuYW1lOiBzdHJpbmcgPSBudWxsKTogdm9pZCB7XG4gICAgICAgIGlmIChuYW1lKSB7XG4gICAgICAgICAgICAvLyBkZWxldGUgb25seSB0aGlzIGl0ZW0gd2l0aCB0aGUgbmFtZSAuLi5cbiAgICAgICAgICAgIGNvbnN0IGk6IG51bWJlciA9IHRoaXMucHJldlNlYXJjaC5pbmRleE9mKG5hbWUpO1xuICAgICAgICAgICAgdGhpcy5wcmV2U2VhcmNoLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdwcmV2U2VhcmNoJywgSlNPTi5zdHJpbmdpZnkodGhpcy5wcmV2U2VhcmNoKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBkZWxldGUgdGhlIHdob2xlIFwicHJldmlvdXMgc2VhcmNoXCIgYXJyYXlcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCdwcmV2U2VhcmNoJyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wcmV2U2VhcmNoID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncHJldlNlYXJjaCcpKTtcblxuICAgIH1cbn1cbiIsImltcG9ydCB7IENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbmplY3QsIElucHV0LCBPbkNoYW5nZXMsIE9uSW5pdCwgT3V0cHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBGb3JtQnVpbGRlciwgRm9ybUdyb3VwLCBWYWxpZGF0b3JzIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgUmVzb3VyY2VDbGFzcyB9IGZyb20gJ0Brbm9yYS9jb3JlJztcblxuLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNDU2NjEwMTAvZHluYW1pYy1uZXN0ZWQtcmVhY3RpdmUtZm9ybS1leHByZXNzaW9uY2hhbmdlZGFmdGVyaXRoYXNiZWVuY2hlY2tlZGVycm9yXG5jb25zdCByZXNvbHZlZFByb21pc2UgPSBQcm9taXNlLnJlc29sdmUobnVsbCk7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAna3VpLXNlbGVjdC1yZXNvdXJjZS1jbGFzcycsXG4gICAgdGVtcGxhdGU6IGA8bWF0LWZvcm0tZmllbGQgKm5nSWY9XCJyZXNvdXJjZUNsYXNzZXMubGVuZ3RoID4gMFwiPlxuICA8bWF0LXNlbGVjdCBwbGFjZWhvbGRlcj1cIlJlc291cmNlIENsYXNzXCIgW2Zvcm1Db250cm9sXT1cImZvcm0uY29udHJvbHNbJ3Jlc291cmNlQ2xhc3MnXVwiPlxuICAgIDxtYXQtb3B0aW9uIFt2YWx1ZV09XCJudWxsXCI+bm8gc2VsZWN0aW9uPC9tYXQtb3B0aW9uPlxuICAgIDwhLS0gdW5kbyBzZWxlY3Rpb24gb2YgYSByZXNvdXJjZSBjbGFzcyAtLT5cbiAgICA8bWF0LW9wdGlvbiAqbmdGb3I9XCJsZXQgcmVzb3VyY2VDbGFzcyBvZiByZXNvdXJjZUNsYXNzZXNcIiBbdmFsdWVdPVwicmVzb3VyY2VDbGFzcy5pZFwiPnt7IHJlc291cmNlQ2xhc3MubGFiZWwgfX08L21hdC1vcHRpb24+XG4gIDwvbWF0LXNlbGVjdD5cbjwvbWF0LWZvcm0tZmllbGQ+YCxcbiAgICBzdHlsZXM6IFtgYF1cbn0pXG5leHBvcnQgY2xhc3MgU2VsZWN0UmVzb3VyY2VDbGFzc0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzIHtcblxuICAgIEBJbnB1dCgpIGZvcm1Hcm91cDogRm9ybUdyb3VwO1xuXG4gICAgLy8gc2V0dGVyIG1ldGhvZCBmb3IgcmVzb3VyY2UgY2xhc3NlcyB3aGVuIGJlaW5nIHVwZGF0ZWQgYnkgcGFyZW50IGNvbXBvbmVudFxuICAgIEBJbnB1dCgpXG4gICAgc2V0IHJlc291cmNlQ2xhc3Nlcyh2YWx1ZTogQXJyYXk8UmVzb3VyY2VDbGFzcz4pIHtcbiAgICAgICAgdGhpcy5yZXNvdXJjZUNsYXNzU2VsZWN0ZWQgPSB1bmRlZmluZWQ7IC8vIHJlc2V0IG9uIHVwZGF0ZXNcbiAgICAgICAgdGhpcy5fcmVzb3VyY2VDbGFzc2VzID0gdmFsdWU7XG4gICAgfVxuXG4gICAgLy8gZ2V0dGVyIG1ldGhvZCBmb3IgcmVzb3VyY2UgY2xhc3NlcyAodXNlZCBpbiB0ZW1wbGF0ZSlcbiAgICBnZXQgcmVzb3VyY2VDbGFzc2VzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcmVzb3VyY2VDbGFzc2VzO1xuICAgIH1cblxuICAgIC8vIGV2ZW50IGVtaXR0ZWQgdG8gcGFyZW50IGNvbXBvbmVudCBvbmNlIGEgcmVzb3VyY2UgY2xhc3MgaXMgc2VsZWN0ZWQgYnkgdGhlIHVzZXJcbiAgICBAT3V0cHV0KCkgcmVzb3VyY2VDbGFzc1NlbGVjdGVkRXZlbnQgPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oKTtcblxuICAgIC8vIGF2YWlsYWJsZSByZXNvdXJjZSBjbGFzc2VzIGZvciBzZWxlY3Rpb25cbiAgICBwcml2YXRlIF9yZXNvdXJjZUNsYXNzZXM6IEFycmF5PFJlc291cmNlQ2xhc3M+O1xuXG4gICAgLy8gc3RvcmVzIHRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgcmVzb3VyY2UgY2xhc3NcbiAgICBwcml2YXRlIHJlc291cmNlQ2xhc3NTZWxlY3RlZDogc3RyaW5nO1xuXG4gICAgZm9ybTogRm9ybUdyb3VwO1xuXG4gICAgY29uc3RydWN0b3IoQEluamVjdChGb3JtQnVpbGRlcikgcHJpdmF0ZSBmYjogRm9ybUJ1aWxkZXIpIHtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBJcmkgb2YgdGhlIHNlbGVjdGVkIHJlc291cmNlIGNsYXNzLlxuICAgICAqXG4gICAgICogQHJldHVybnMgdGhlIElyaSBvZiB0aGUgc2VsZWN0ZWQgcmVzb3VyY2UgY2xhc3Mgb3IgZmFsc2UgaW4gY2FzZSBubyByZXNvdXJjZSBjbGFzcyBpcyBzZWxlY3RlZC5cbiAgICAgKi9cbiAgICBnZXRSZXNvdXJjZUNsYXNzU2VsZWN0ZWQoKTogYW55IHtcbiAgICAgICAgaWYgKHRoaXMucmVzb3VyY2VDbGFzc1NlbGVjdGVkICE9PSB1bmRlZmluZWQgJiYgdGhpcy5yZXNvdXJjZUNsYXNzU2VsZWN0ZWQgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlQ2xhc3NTZWxlY3RlZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEluaXRhbGl6ZXMgdGhlIEZvcm1Hcm91cCBmb3IgdGhlIHJlc291cmNlIGNsYXNzIHNlbGVjdGlvbi5cbiAgICAgKiBUaGUgaW5pdGlhbCB2YWx1ZSBpcyBzZXQgdG8gbnVsbC5cbiAgICAgKi9cbiAgICBwcml2YXRlIGluaXRGb3JtKCkge1xuICAgICAgICAvLyBidWlsZCBhIGZvcm0gZm9yIHRoZSByZXNvdXJjZSBjbGFzcyBzZWxlY3Rpb25cbiAgICAgICAgdGhpcy5mb3JtID0gdGhpcy5mYi5ncm91cCh7XG4gICAgICAgICAgICByZXNvdXJjZUNsYXNzOiBbbnVsbF0gLy8gcmVzb3VyY2UgY2xhc3Mgc2VsZWN0aW9uIGlzIG9wdGlvbmFsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIHN0b3JlIGFuZCBlbWl0IElyaSBvZiB0aGUgcmVzb3VyY2UgY2xhc3Mgd2hlbiBzZWxlY3RlZFxuICAgICAgICB0aGlzLmZvcm0udmFsdWVDaGFuZ2VzLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5yZXNvdXJjZUNsYXNzU2VsZWN0ZWQgPSBkYXRhLnJlc291cmNlQ2xhc3M7XG4gICAgICAgICAgICB0aGlzLnJlc291cmNlQ2xhc3NTZWxlY3RlZEV2ZW50LmVtaXQodGhpcy5yZXNvdXJjZUNsYXNzU2VsZWN0ZWQpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHtcblxuICAgICAgICB0aGlzLmluaXRGb3JtKCk7XG5cbiAgICAgICAgLy8gYWRkIGZvcm0gdG8gdGhlIHBhcmVudCBmb3JtIGdyb3VwXG4gICAgICAgIHRoaXMuZm9ybUdyb3VwLmFkZENvbnRyb2woJ3Jlc291cmNlQ2xhc3MnLCB0aGlzLmZvcm0pO1xuXG4gICAgfVxuXG4gICAgbmdPbkNoYW5nZXMoKSB7XG5cbiAgICAgICAgaWYgKHRoaXMuZm9ybSAhPT0gdW5kZWZpbmVkKSB7XG5cbiAgICAgICAgICAgIC8vIHJlc291cmNlIGNsYXNzZXMgaGF2ZSBiZWVuIHJlaW5pdGlhbGl6ZWRcbiAgICAgICAgICAgIC8vIHJlc2V0IGZvcm1cbiAgICAgICAgICAgIHJlc29sdmVkUHJvbWlzZS50aGVuKCgpID0+IHtcblxuICAgICAgICAgICAgICAgIC8vIHJlbW92ZSB0aGlzIGZvcm0gZnJvbSB0aGUgcGFyZW50IGZvcm0gZ3JvdXBcbiAgICAgICAgICAgICAgICB0aGlzLmZvcm1Hcm91cC5yZW1vdmVDb250cm9sKCdyZXNvdXJjZUNsYXNzJyk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmluaXRGb3JtKCk7XG5cbiAgICAgICAgICAgICAgICAvLyBhZGQgZm9ybSB0byB0aGUgcGFyZW50IGZvcm0gZ3JvdXBcbiAgICAgICAgICAgICAgICB0aGlzLmZvcm1Hcm91cC5hZGRDb250cm9sKCdyZXNvdXJjZUNsYXNzJywgdGhpcy5mb3JtKTtcblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIEluamVjdCwgSW5wdXQsIE9uSW5pdCwgT3V0cHV0LCBRdWVyeUxpc3QsIFZpZXdDaGlsZCwgVmlld0NoaWxkcmVuIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZSwgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IEZvcm1CdWlsZGVyLCBGb3JtR3JvdXAgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge1xuICAgIEdyYXZzZWFyY2hHZW5lcmF0aW9uU2VydmljZSxcbiAgICBPbnRvbG9neUNhY2hlU2VydmljZSxcbiAgICBPbnRvbG9neUluZm9ybWF0aW9uLFxuICAgIE9udG9sb2d5TWV0YWRhdGEsXG4gICAgUHJvcGVydGllcyxcbiAgICBQcm9wZXJ0eVdpdGhWYWx1ZSxcbiAgICBSZWFkUmVzb3VyY2VzU2VxdWVuY2UsXG4gICAgUmVzb3VyY2VDbGFzc1xufSBmcm9tICdAa25vcmEvY29yZSc7XG5pbXBvcnQgeyBTZWxlY3RQcm9wZXJ0eUNvbXBvbmVudCB9IGZyb20gJy4vc2VsZWN0LXByb3BlcnR5L3NlbGVjdC1wcm9wZXJ0eS5jb21wb25lbnQnO1xuaW1wb3J0IHsgU2VsZWN0UmVzb3VyY2VDbGFzc0NvbXBvbmVudCB9IGZyb20gJy4vc2VsZWN0LXJlc291cmNlLWNsYXNzL3NlbGVjdC1yZXNvdXJjZS1jbGFzcy5jb21wb25lbnQnO1xuXG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAna3VpLWV4dGVuZGVkLXNlYXJjaCcsXG4gICAgdGVtcGxhdGU6IGA8Zm9ybSBbZm9ybUdyb3VwXT1cImZvcm1cIiAobmdTdWJtaXQpPVwic3VibWl0KClcIj5cblxuICA8ZGl2PlxuICAgIDxrdWktc2VsZWN0LW9udG9sb2d5ICpuZ0lmPVwib250b2xvZ2llcy5sZW5ndGggPiAwXCIgW2Zvcm1Hcm91cF09XCJmb3JtXCIgW29udG9sb2dpZXNdPVwib250b2xvZ2llc1wiIChvbnRvbG9neVNlbGVjdGVkKT1cImdldFJlc291cmNlQ2xhc3Nlc0FuZFByb3BlcnRpZXNGb3JPbnRvbG9neSgkZXZlbnQpXCI+PC9rdWktc2VsZWN0LW9udG9sb2d5PlxuICA8L2Rpdj5cblxuICA8ZGl2IGNsYXNzPVwic2VsZWN0LXJlc291cmNlLWNsYXNzXCIgKm5nSWY9XCJyZXNvdXJjZUNsYXNzZXM/Lmxlbmd0aCA+IDBcIj5cbiAgICA8a3VpLXNlbGVjdC1yZXNvdXJjZS1jbGFzcyAjcmVzb3VyY2VDbGFzcyBbZm9ybUdyb3VwXT1cImZvcm1cIiBbcmVzb3VyY2VDbGFzc2VzXT1cInJlc291cmNlQ2xhc3Nlc1wiIChyZXNvdXJjZUNsYXNzU2VsZWN0ZWRFdmVudCk9XCJnZXRQcm9wZXJ0aWVzRm9yUmVzb3VyY2VDbGFzcygkZXZlbnQpXCI+PC9rdWktc2VsZWN0LXJlc291cmNlLWNsYXNzPlxuICA8L2Rpdj5cblxuICA8ZGl2IGNsYXNzPVwic2VsZWN0LXByb3BlcnR5XCIgKm5nSWY9XCJwcm9wZXJ0aWVzICE9PSB1bmRlZmluZWRcIj5cbiAgICA8ZGl2ICpuZ0Zvcj1cImxldCBwcm9wIG9mIGFjdGl2ZVByb3BlcnRpZXM7IGxldCBpID0gaW5kZXhcIj5cblxuICAgICAgPGt1aS1zZWxlY3QtcHJvcGVydHkgI3Byb3BlcnR5IFthY3RpdmVSZXNvdXJjZUNsYXNzXT1cImFjdGl2ZVJlc291cmNlQ2xhc3NcIiBbZm9ybUdyb3VwXT1cImZvcm1cIiBbaW5kZXhdPVwiaVwiIFtwcm9wZXJ0aWVzXT1cInByb3BlcnRpZXNcIj48L2t1aS1zZWxlY3QtcHJvcGVydHk+XG5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG5cblxuICA8ZGl2PlxuICAgIDxidXR0b24gbWF0LW1pbmktZmFiIGNsYXNzPVwicHJvcGVydHktYnV0dG9ucyBhZGQtcHJvcGVydHktYnV0dG9uXCIgY29sb3I9XCJwcmltYXJ5XCIgdHlwZT1cImJ1dHRvblwiIChjbGljayk9XCJhZGRQcm9wZXJ0eSgpXCIgW2Rpc2FibGVkXT1cImFjdGl2ZU9udG9sb2d5ID09PSB1bmRlZmluZWQgfHwgYWN0aXZlUHJvcGVydGllcy5sZW5ndGggPj0gNFwiPlxuICAgICAgPG1hdC1pY29uIGFyaWEtbGFiZWw9XCJhZGQgYSBwcm9wZXJ0eVwiPmFkZDwvbWF0LWljb24+XG4gICAgPC9idXR0b24+XG5cbiAgICA8YnV0dG9uIG1hdC1taW5pLWZhYiBjbGFzcz1cInByb3BlcnR5LWJ1dHRvbnMgcmVtb3ZlLXByb3BlcnR5LWJ1dHRvblwiIGNvbG9yPVwicHJpbWFyeVwiIHR5cGU9XCJidXR0b25cIiAoY2xpY2spPVwicmVtb3ZlUHJvcGVydHkoKVwiIFtkaXNhYmxlZF09XCJhY3RpdmVQcm9wZXJ0aWVzLmxlbmd0aCA9PSAwXCI+XG4gICAgICA8bWF0LWljb24gYXJpYS1sYWJlbD1cInJlbW92ZSBwcm9wZXJ0eVwiPnJlbW92ZTwvbWF0LWljb24+XG4gICAgPC9idXR0b24+XG4gIDwvZGl2PlxuXG4gIDwhLS0gIDxkaXY+XG4gICAgPGJ1dHRvbiBtYXQtaWNvbi1idXR0b24gdHlwZT1cImJ1dHRvblwiIChjbGljayk9XCJyZXNldEZvcm0oKVwiIFtkaXNhYmxlZF09XCJ0aGlzLmFjdGl2ZU9udG9sb2d5ID09PSB1bmRlZmluZWRcIj5cbiAgICAgIDxtYXQtaWNvbiBhcmlhLWxhYmVsPVwicmVzZXQgcXVlcnkgZm9ybVwiPmNsZWFyPC9tYXQtaWNvbj5cbiAgICA8L2J1dHRvbj5cblxuICAgIDxidXR0b24gbWF0LWljb24tYnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBbZGlzYWJsZWRdPVwiIWZvcm1WYWxpZFwiPlxuICAgICAgPG1hdC1pY29uIGFyaWEtbGFiZWw9XCJzdWJtaXQgcXVlcnlcIj5zZW5kPC9tYXQtaWNvbj5cbiAgICA8L2J1dHRvbj5cbiAgPC9kaXY+IC0tPlxuXG4gIDxidXR0b24gY2xhc3M9XCJleHRlbmRlZC1idXR0b25zIGV4dGVuZGVkLXNlYXJjaC1idXR0b25cIiBtYXQtc3Ryb2tlZC1idXR0b24gY29sb3I9XCJwcmltYXJ5XCIgdHlwZT1cInN1Ym1pdFwiIFtkaXNhYmxlZF09XCIhZm9ybVZhbGlkXCI+XG4gICAgU2VhcmNoXG4gIDwvYnV0dG9uPlxuICA8YnV0dG9uIGNsYXNzPVwiZXh0ZW5kZWQtYnV0dG9ucyByZXNldFwiIG1hdC1zdHJva2VkLWJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgKGNsaWNrKT1cInJlc2V0Rm9ybSgpXCIgW2Rpc2FibGVkXT1cInRoaXMuYWN0aXZlT250b2xvZ3kgPT09IHVuZGVmaW5lZFwiPlxuICAgIFJlc2V0XG4gIDwvYnV0dG9uPlxuXG5cbjwvZm9ybT5cbmAsXG4gICAgc3R5bGVzOiBbYC5hZGQtcHJvcGVydHktYnV0dG9ue21hcmdpbi1yaWdodDo1cHh9LmV4dGVuZGVkLWJ1dHRvbnN7bWFyZ2luLXRvcDoyNXB4fS5leHRlbmRlZC1zZWFyY2gtYnV0dG9ue21hcmdpbi1yaWdodDo1cHh9LnByb3BlcnR5LWJ1dHRvbnN7bWFyZ2luLXRvcDoyNXB4fS5zZWxlY3QtcHJvcGVydHl7bWFyZ2luLWxlZnQ6MjJweH0uc2VsZWN0LXJlc291cmNlLWNsYXNze21hcmdpbi1sZWZ0OjEycHh9YF1cbn0pXG5leHBvcnQgY2xhc3MgRXh0ZW5kZWRTZWFyY2hDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHJvdXRlIC0gUm91dGUgYWZ0ZXIgc2VhcmNoXG4gICAgICovXG4gICAgQElucHV0KCkgcm91dGU7XG5cbiAgICAvLyB0cmlnZ2VyIHRvZ2dsZSBmb3IgZXh0ZW5kZWQgc2VhcmNoIGZvcm1cbiAgICBAT3V0cHV0KCkgdG9nZ2xlRXh0ZW5kZWRTZWFyY2hGb3JtID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xuXG4gICAgLy8gYWxsIGF2YWlsYWJsZSBvbnRvbG9naWVzXG4gICAgb250b2xvZ2llczogQXJyYXk8T250b2xvZ3lNZXRhZGF0YT4gPSBbXTtcblxuICAgIC8vIG9udG9sb2d5IGNob3NlbiBieSB0aGUgdXNlclxuICAgIGFjdGl2ZU9udG9sb2d5OiBzdHJpbmc7XG5cbiAgICAvLyBwcm9wZXJ0aWVzIHNwZWNpZmllZCBieSB0aGUgdXNlclxuICAgIGFjdGl2ZVByb3BlcnRpZXM6IGJvb2xlYW5bXSA9IFtdO1xuXG4gICAgLy8gcmVzb3VyY2UgY2xhc3NlcyBmb3IgdGhlIHNlbGVjdGVkIG9udG9sb2d5XG4gICAgcmVzb3VyY2VDbGFzc2VzOiBBcnJheTxSZXNvdXJjZUNsYXNzPiA9IFtdO1xuXG4gICAgLy8gZGVmaW5pdGlvbiBvZiB0aGUgc2VsZWN0ZWQgcmVzb3VyY2UgY2xhc3MsIGlmIHNldC5cbiAgICBhY3RpdmVSZXNvdXJjZUNsYXNzOiBSZXNvdXJjZUNsYXNzO1xuXG4gICAgLy8gcHJvcGVydGllcyBmb3IgdGhlIHNlbGVjdGVkIG9udG9sb2d5IG9yIHNlbGVjdGVkIHJlc291cmNlIGNsYXNzXG4gICAgcHJvcGVydGllczogUHJvcGVydGllcztcblxuICAgIHJlc3VsdDogUmVhZFJlc291cmNlc1NlcXVlbmNlID0gbmV3IFJlYWRSZXNvdXJjZXNTZXF1ZW5jZShbXSwgMCk7XG5cbiAgICAvLyByZWZlcmVuY2UgdG8gdGhlIGNvbXBvbmVudCB0aGF0IGNvbnRyb2xzIHRoZSByZXNvdXJjZSBjbGFzcyBzZWxlY3Rpb25cbiAgICBAVmlld0NoaWxkKCdyZXNvdXJjZUNsYXNzJykgcmVzb3VyY2VDbGFzc0NvbXBvbmVudDogU2VsZWN0UmVzb3VyY2VDbGFzc0NvbXBvbmVudDtcblxuICAgIC8vIHJlZmVyZW5jZSB0byB0aGUgY29tcG9uZW50IGNvbnRyb2xsaW5nIHRoZSBwcm9wZXJ0eSBzZWxlY3Rpb25cbiAgICBAVmlld0NoaWxkcmVuKCdwcm9wZXJ0eScpIHByb3BlcnR5Q29tcG9uZW50czogUXVlcnlMaXN0PFNlbGVjdFByb3BlcnR5Q29tcG9uZW50PjtcblxuICAgIC8vIEZvcm1Hcm91cCAodXNlZCBhcyBwYXJlbnQgZm9yIGNoaWxkIGNvbXBvbmVudHMpXG4gICAgZm9ybTogRm9ybUdyb3VwO1xuXG4gICAgLy8gZm9ybSB2YWxpZGF0aW9uIHN0YXR1c1xuICAgIGZvcm1WYWxpZCA9IGZhbHNlO1xuXG4gICAgY29uc3RydWN0b3IoQEluamVjdChGb3JtQnVpbGRlcikgcHJpdmF0ZSBmYjogRm9ybUJ1aWxkZXIsXG4gICAgICAgIHByaXZhdGUgX3JvdXRlOiBBY3RpdmF0ZWRSb3V0ZSxcbiAgICAgICAgcHJpdmF0ZSBfcm91dGVyOiBSb3V0ZXIsXG4gICAgICAgIHByaXZhdGUgX2NhY2hlU2VydmljZTogT250b2xvZ3lDYWNoZVNlcnZpY2UsXG4gICAgICAgIHByaXZhdGUgX2dyYXZTZWFyY2hTZXJ2aWNlOiBHcmF2c2VhcmNoR2VuZXJhdGlvblNlcnZpY2UpIHtcbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHtcblxuICAgICAgICAvLyBwYXJlbnQgZm9ybSBpcyBlbXB0eSwgaXQgZ2V0cyBwYXNzZWQgdG8gdGhlIGNoaWxkIGNvbXBvbmVudHNcbiAgICAgICAgdGhpcy5mb3JtID0gdGhpcy5mYi5ncm91cCh7fSk7XG5cbiAgICAgICAgLy8gaWYgZm9ybSBzdGF0dXMgY2hhbmdlcywgcmUtcnVuIHZhbGlkYXRpb25cbiAgICAgICAgdGhpcy5mb3JtLnN0YXR1c0NoYW5nZXMuc3Vic2NyaWJlKChkYXRhKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZvcm1WYWxpZCA9IHRoaXMudmFsaWRhdGVGb3JtKCk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLmZvcm0pO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBpbml0aWFsaXplIG9udG9sb2dpZXMgdG8gYmUgdXNlZCBmb3IgdGhlIG9udG9sb2dpZXMgc2VsZWN0aW9uIGluIHRoZSBzZWFyY2ggZm9ybVxuICAgICAgICB0aGlzLmluaXRpYWxpemVPbnRvbG9naWVzKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIGEgcHJvcGVydHkgdG8gdGhlIHNlYXJjaCBmb3JtLlxuICAgICAqIEByZXR1cm5zIHZvaWRcbiAgICAgKi9cbiAgICBhZGRQcm9wZXJ0eSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5hY3RpdmVQcm9wZXJ0aWVzLnB1c2godHJ1ZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlIHRoZSBsYXN0IHByb3BlcnR5IGZyb20gdGhlIHNlYXJjaCBmb3JtLlxuICAgICAqIEByZXR1cm5zIHZvaWRcbiAgICAgKi9cbiAgICByZW1vdmVQcm9wZXJ0eSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5hY3RpdmVQcm9wZXJ0aWVzLnNwbGljZSgtMSwgMSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyBhbGwgYXZhaWxhYmxlIG9udG9sb2dpZXMgZm9yIHRoZSBzZWFyY2ggZm9ybS5cbiAgICAgKiBAcmV0dXJucyB2b2lkXG4gICAgICovXG4gICAgaW5pdGlhbGl6ZU9udG9sb2dpZXMoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX2NhY2hlU2VydmljZS5nZXRPbnRvbG9naWVzTWV0YWRhdGEoKS5zdWJzY3JpYmUoXG4gICAgICAgICAgICAob250b2xvZ2llczogQXJyYXk8T250b2xvZ3lNZXRhZGF0YT4pID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLm9udG9sb2dpZXMgPSBvbnRvbG9naWVzO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogT25jZSBhbiBvbnRvbG9neSBoYXMgYmVlbiBzZWxlY3RlZCwgZ2V0cyBpdHMgY2xhc3NlcyBhbmQgcHJvcGVydGllcy5cbiAgICAgKiBUaGUgY2xhc3NlcyBhbmQgcHJvcGVydGllcyB3aWxsIGJlIG1hZGUgYXZhaWxhYmxlIHRvIHRoZSB1c2VyIGZvciBzZWxlY3Rpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gb250b2xvZ3lJcmkgSXJpIG9mIHRoZSBvbnRvbG9neSBjaG9zZW4gYnkgdGhlIHVzZXIuXG4gICAgICogQHJldHVybnMgdm9pZFxuICAgICAqL1xuICAgIGdldFJlc291cmNlQ2xhc3Nlc0FuZFByb3BlcnRpZXNGb3JPbnRvbG9neShvbnRvbG9neUlyaTogc3RyaW5nKTogdm9pZCB7XG5cbiAgICAgICAgLy8gcmVzZXQgYWN0aXZlIHJlc291cmNlIGNsYXNzIGRlZmluaXRpb25cbiAgICAgICAgdGhpcy5hY3RpdmVSZXNvdXJjZUNsYXNzID0gdW5kZWZpbmVkO1xuXG4gICAgICAgIC8vIHJlc2V0IHNwZWNpZmllZCBwcm9wZXJ0aWVzXG4gICAgICAgIHRoaXMuYWN0aXZlUHJvcGVydGllcyA9IFtdO1xuXG4gICAgICAgIHRoaXMuYWN0aXZlT250b2xvZ3kgPSBvbnRvbG9neUlyaTtcblxuICAgICAgICB0aGlzLl9jYWNoZVNlcnZpY2UuZ2V0RW50aXR5RGVmaW5pdGlvbnNGb3JPbnRvbG9naWVzKFtvbnRvbG9neUlyaV0pLnN1YnNjcmliZShcbiAgICAgICAgICAgIChvbnRvSW5mbzogT250b2xvZ3lJbmZvcm1hdGlvbikgPT4ge1xuXG4gICAgICAgICAgICAgICAgdGhpcy5yZXNvdXJjZUNsYXNzZXMgPSBvbnRvSW5mby5nZXRSZXNvdXJjZUNsYXNzZXNBc0FycmF5KHRydWUpO1xuICAgICAgICAgICAgICAgIHRoaXMucHJvcGVydGllcyA9IG9udG9JbmZvLmdldFByb3BlcnRpZXMoKTtcblxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogT25jZSBhIHJlc291cmNlIGNsYXNzIGhhcyBiZWVuIHNlbGVjdGVkLCBnZXRzIGl0cyBwcm9wZXJ0aWVzLlxuICAgICAqIFRoZSBwcm9wZXJ0aWVzIHdpbGwgYmUgbWFkZSBhdmFpbGFibGUgdG8gdGhlIHVzZXIgZm9yIHNlbGVjdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSByZXNvdXJjZUNsYXNzSXJpXG4gICAgICogQHJldHVybnMgdm9pZFxuICAgICAqL1xuICAgIGdldFByb3BlcnRpZXNGb3JSZXNvdXJjZUNsYXNzKHJlc291cmNlQ2xhc3NJcmk6IHN0cmluZyk6IHZvaWQge1xuXG4gICAgICAgIC8vIHJlc2V0IHNwZWNpZmllZCBwcm9wZXJ0aWVzXG4gICAgICAgIHRoaXMuYWN0aXZlUHJvcGVydGllcyA9IFtdO1xuXG4gICAgICAgIC8vIGlmIHRoZSBjbGllbnQgdW5kb2VzIHRoZSBzZWxlY3Rpb24gb2YgYSByZXNvdXJjZSBjbGFzcywgdXNlIHRoZSBhY3RpdmUgb250b2xvZ3kgYXMgYSBmYWxsYmFja1xuICAgICAgICBpZiAocmVzb3VyY2VDbGFzc0lyaSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5nZXRSZXNvdXJjZUNsYXNzZXNBbmRQcm9wZXJ0aWVzRm9yT250b2xvZ3kodGhpcy5hY3RpdmVPbnRvbG9neSk7XG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIHRoaXMuX2NhY2hlU2VydmljZS5nZXRSZXNvdXJjZUNsYXNzRGVmaW5pdGlvbnMoW3Jlc291cmNlQ2xhc3NJcmldKS5zdWJzY3JpYmUoXG4gICAgICAgICAgICAgICAgKG9udG9JbmZvOiBPbnRvbG9neUluZm9ybWF0aW9uKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvcGVydGllcyA9IG9udG9JbmZvLmdldFByb3BlcnRpZXMoKTtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFjdGl2ZVJlc291cmNlQ2xhc3MgPSBvbnRvSW5mby5nZXRSZXNvdXJjZUNsYXNzZXMoKVtyZXNvdXJjZUNsYXNzSXJpXTtcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVmFsaWRhdGVzIGZvcm0gYW5kIHJldHVybnMgaXRzIHN0YXR1cyAoYm9vbGVhbikuXG4gICAgICovXG4gICAgcHJpdmF0ZSB2YWxpZGF0ZUZvcm0oKSB7XG5cbiAgICAgICAgLy8gY2hlY2sgdGhhdCBlaXRoZXIgYSByZXNvdXJjZSBjbGFzcyBpcyBzZWxlY3RlZCBvciBhdCBsZWFzdCBvbmUgcHJvcGVydHkgaXMgc3BlY2lmaWVkXG4gICAgICAgIHJldHVybiB0aGlzLmZvcm0udmFsaWQgJiZcbiAgICAgICAgICAgICh0aGlzLnByb3BlcnR5Q29tcG9uZW50cy5sZW5ndGggPiAwIHx8ICh0aGlzLnJlc291cmNlQ2xhc3NDb21wb25lbnQgIT09IHVuZGVmaW5lZCAmJiB0aGlzLnJlc291cmNlQ2xhc3NDb21wb25lbnQuZ2V0UmVzb3VyY2VDbGFzc1NlbGVjdGVkKCkgIT09IGZhbHNlKSk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXNldHMgdGhlIGZvcm0gKHNlbGVjdGVkIHJlc291cmNlIGNsYXNzIGFuZCBzcGVjaWZpZWQgcHJvcGVydGllcykgcHJlc2VydmluZyB0aGUgYWN0aXZlIG9udG9sb2d5LlxuICAgICAqL1xuICAgIHJlc2V0Rm9ybSgpIHtcbiAgICAgICAgaWYgKHRoaXMuYWN0aXZlT250b2xvZ3kgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5nZXRSZXNvdXJjZUNsYXNzZXNBbmRQcm9wZXJ0aWVzRm9yT250b2xvZ3kodGhpcy5hY3RpdmVPbnRvbG9neSk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBHcmF2U2VhcmNoIHF1ZXJ5IHdpdGggdGhlIGdpdmVuIGZvcm0gdmFsdWVzIGFuZCBjYWxscyB0aGUgZXh0ZW5kZWQgc2VhcmNoIHJvdXRlLlxuICAgICAqL1xuICAgIHN1Ym1pdCgpIHtcblxuICAgICAgICBpZiAoIXRoaXMuZm9ybVZhbGlkKSByZXR1cm47IC8vIGNoZWNrIHRoYXQgZnJvbSBpcyB2YWxpZFxuXG4gICAgICAgIGNvbnN0IHJlc0NsYXNzT3B0aW9uID0gdGhpcy5yZXNvdXJjZUNsYXNzQ29tcG9uZW50LmdldFJlc291cmNlQ2xhc3NTZWxlY3RlZCgpO1xuXG4gICAgICAgIGxldCByZXNDbGFzcztcblxuICAgICAgICBpZiAocmVzQ2xhc3NPcHRpb24gIT09IGZhbHNlKSB7XG4gICAgICAgICAgICByZXNDbGFzcyA9IHJlc0NsYXNzT3B0aW9uO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcHJvcGVydGllczogUHJvcGVydHlXaXRoVmFsdWVbXSA9IHRoaXMucHJvcGVydHlDb21wb25lbnRzLm1hcChcbiAgICAgICAgICAgIChwcm9wQ29tcCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBwcm9wQ29tcC5nZXRQcm9wZXJ0eVNlbGVjdGVkV2l0aFZhbHVlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG5cbiAgICAgICAgY29uc3QgZ3JhdnNlYXJjaCA9IHRoaXMuX2dyYXZTZWFyY2hTZXJ2aWNlLmNyZWF0ZUdyYXZzZWFyY2hRdWVyeShwcm9wZXJ0aWVzLCByZXNDbGFzcywgMCk7XG5cbiAgICAgICAgdGhpcy5fcm91dGVyLm5hdmlnYXRlKFt0aGlzLnJvdXRlICsgJy9leHRlbmRlZC8nLCBncmF2c2VhcmNoXSwgeyByZWxhdGl2ZVRvOiB0aGlzLl9yb3V0ZSB9KTtcblxuICAgICAgICAvLyB0b2dnbGUgZXh0ZW5kZWQgc2VhcmNoIGZvcm1cbiAgICAgICAgdGhpcy50b2dnbGVFeHRlbmRlZFNlYXJjaEZvcm0uZW1pdCh0cnVlKTtcblxuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIEluamVjdCwgSW5wdXQsIE9uSW5pdCwgT3V0cHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPbnRvbG9neU1ldGFkYXRhIH0gZnJvbSAnQGtub3JhL2NvcmUnO1xuaW1wb3J0IHsgRm9ybUJ1aWxkZXIsIEZvcm1Hcm91cCwgVmFsaWRhdG9ycyB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAna3VpLXNlbGVjdC1vbnRvbG9neScsXG4gIHRlbXBsYXRlOiBgPG1hdC1mb3JtLWZpZWxkICpuZ0lmPVwib250b2xvZ2llcy5sZW5ndGggPiAwXCI+XG4gIDxtYXQtc2VsZWN0IHBsYWNlaG9sZGVyPVwiT250b2xvZ3lcIiBbZm9ybUNvbnRyb2xdPVwiZm9ybS5jb250cm9sc1snb250b2xvZ3knXVwiPlxuICAgICAgPG1hdC1vcHRpb24gKm5nRm9yPVwibGV0IG9udG8gb2Ygb250b2xvZ2llc1wiIFt2YWx1ZV09XCJvbnRvLmlkXCI+e3sgb250by5sYWJlbCB9fTwvbWF0LW9wdGlvbj5cbiAgPC9tYXQtc2VsZWN0PlxuPC9tYXQtZm9ybS1maWVsZD5cbmAsXG4gIHN0eWxlczogW2BgXVxufSlcbmV4cG9ydCBjbGFzcyBTZWxlY3RPbnRvbG9neUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgQElucHV0KCkgZm9ybUdyb3VwOiBGb3JtR3JvdXA7XG5cbiAgQElucHV0KCkgb250b2xvZ2llczogQXJyYXk8T250b2xvZ3lNZXRhZGF0YT47XG5cbiAgQE91dHB1dCgpIG9udG9sb2d5U2VsZWN0ZWQgPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oKTtcblxuICBmb3JtOiBGb3JtR3JvdXA7XG5cbiAgY29uc3RydWN0b3IoQEluamVjdChGb3JtQnVpbGRlcikgcHJpdmF0ZSBmYjogRm9ybUJ1aWxkZXIpIHsgfVxuXG4gIG5nT25Jbml0KCkge1xuXG4gICAgLy8gYnVpbGQgYSBmb3JtIGZvciB0aGUgbmFtZWQgZ3JhcGggc2VsZWN0aW9uXG4gICAgdGhpcy5mb3JtID0gdGhpcy5mYi5ncm91cCh7XG4gICAgICBvbnRvbG9neTogW251bGwsIFZhbGlkYXRvcnMucmVxdWlyZWRdXG4gICAgfSk7XG5cbiAgICAvLyBlbWl0IElyaSBvZiB0aGUgb250b2xvZ3kgd2hlbiBiZWluZyBzZWxlY3RlZFxuICAgIHRoaXMuZm9ybS52YWx1ZUNoYW5nZXMuc3Vic2NyaWJlKChkYXRhKSA9PiB7XG4gICAgICB0aGlzLm9udG9sb2d5U2VsZWN0ZWQuZW1pdChkYXRhLm9udG9sb2d5KTtcbiAgICB9KTtcblxuICAgIC8vIGFkZCBmb3JtIHRvIHRoZSBwYXJlbnQgZm9ybSBncm91cFxuICAgIHRoaXMuZm9ybUdyb3VwLmFkZENvbnRyb2woJ29udG9sb2d5JywgdGhpcy5mb3JtKTtcblxuICB9XG5cbn1cbiIsImltcG9ydCB7IENvbXBvbmVudCwgSW5qZWN0LCBJbnB1dCwgT25DaGFuZ2VzLCBPbkluaXQsIFZpZXdDaGlsZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRm9ybUJ1aWxkZXIsIEZvcm1Hcm91cCwgVmFsaWRhdG9ycyB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7XG4gICAgQ29tcGFyaXNvbk9wZXJhdG9yLFxuICAgIENvbXBhcmlzb25PcGVyYXRvckFuZFZhbHVlLFxuICAgIEVxdWFscyxcbiAgICBFeGlzdHMsXG4gICAgR3JlYXRlclRoYW4sXG4gICAgR3JlYXRlclRoYW5FcXVhbHMsXG4gICAgS25vcmFDb25zdGFudHMsXG4gICAgTGVzc1RoYW4sXG4gICAgTGVzc1RoYW5FcXVhbHMsXG4gICAgTGlrZSxcbiAgICBNYXRjaCxcbiAgICBOb3RFcXVhbHMsXG4gICAgUHJvcGVydHksXG4gICAgUHJvcGVydHlWYWx1ZSxcbiAgICBWYWx1ZVxufSBmcm9tICdAa25vcmEvY29yZSc7XG5cblxuLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNDU2NjEwMTAvZHluYW1pYy1uZXN0ZWQtcmVhY3RpdmUtZm9ybS1leHByZXNzaW9uY2hhbmdlZGFmdGVyaXRoYXNiZWVuY2hlY2tlZGVycm9yXG5jb25zdCByZXNvbHZlZFByb21pc2UgPSBQcm9taXNlLnJlc29sdmUobnVsbCk7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAna3VpLXNwZWNpZnktcHJvcGVydHktdmFsdWUnLFxuICAgIHRlbXBsYXRlOiBgPG1hdC1mb3JtLWZpZWxkIGNsYXNzPVwic2VhcmNoLW9wZXJhdG9yLWZpZWxkXCIgKm5nSWY9XCJjb21wYXJpc29uT3BlcmF0b3JzPy5sZW5ndGggPiAwXCI+XG4gICAgPG1hdC1zZWxlY3QgcGxhY2Vob2xkZXI9XCJDb21wYXJpc29uIE9wZXJhdG9yXCIgW2Zvcm1Db250cm9sXT1cImZvcm0uY29udHJvbHNbJ2NvbXBhcmlzb25PcGVyYXRvciddXCI+XG4gICAgICAgIDxtYXQtb3B0aW9uICpuZ0Zvcj1cImxldCBjb21wT3Agb2YgY29tcGFyaXNvbk9wZXJhdG9yc1wiIFt2YWx1ZV09XCJjb21wT3BcIj57eyBjb21wT3AubGFiZWwgfX08L21hdC1vcHRpb24+XG4gICAgPC9tYXQtc2VsZWN0PlxuPC9tYXQtZm9ybS1maWVsZD5cblxuPCEtLSBzZWxlY3QgYXB0IGNvbXBvbmVudCBmb3IgdmFsdWUgc3BlY2lmaWNhdGlvbiB1c2luZyBhIHN3aXRjaCBjYXNlIHN0YXRlbWVudC0tPlxuPHNwYW5cbiAgICAqbmdJZj1cImNvbXBhcmlzb25PcGVyYXRvclNlbGVjdGVkICE9PSB1bmRlZmluZWQgJiYgY29tcGFyaXNvbk9wZXJhdG9yU2VsZWN0ZWQgIT09IG51bGwgJiYgY29tcGFyaXNvbk9wZXJhdG9yU2VsZWN0ZWQuZ2V0Q2xhc3NOYW1lKCkgIT0gJ0V4aXN0cydcIlxuICAgIFtuZ1N3aXRjaF09XCJwcm9wZXJ0eVZhbHVlVHlwZVwiPlxuICA8Ym9vbGVhbi12YWx1ZSAjcHJvcGVydHlWYWx1ZSBbZm9ybUdyb3VwXT1cImZvcm1cIiAqbmdTd2l0Y2hDYXNlPVwiS25vcmFDb25zdGFudHMuQm9vbGVhblZhbHVlXCI+PC9ib29sZWFuLXZhbHVlPlxuICA8ZGF0ZS12YWx1ZSAjcHJvcGVydHlWYWx1ZSBbZm9ybUdyb3VwXT1cImZvcm1cIiAqbmdTd2l0Y2hDYXNlPVwiS25vcmFDb25zdGFudHMuRGF0ZVZhbHVlXCI+PC9kYXRlLXZhbHVlPlxuICA8ZGVjaW1hbC12YWx1ZSAjcHJvcGVydHlWYWx1ZSBbZm9ybUdyb3VwXT1cImZvcm1cIiAqbmdTd2l0Y2hDYXNlPVwiS25vcmFDb25zdGFudHMuRGVjaW1hbFZhbHVlXCI+PC9kZWNpbWFsLXZhbHVlPlxuICA8aW50ZWdlci12YWx1ZSAjcHJvcGVydHlWYWx1ZSBbZm9ybUdyb3VwXT1cImZvcm1cIiAqbmdTd2l0Y2hDYXNlPVwiS25vcmFDb25zdGFudHMuSW50VmFsdWVcIj48L2ludGVnZXItdmFsdWU+XG4gIDxsaW5rLXZhbHVlICNwcm9wZXJ0eVZhbHVlIFtmb3JtR3JvdXBdPVwiZm9ybVwiIFtyZXN0cmljdFJlc291cmNlQ2xhc3NdPVwicHJvcGVydHkub2JqZWN0VHlwZVwiXG4gICAgICAgICAgICAgICpuZ1N3aXRjaENhc2U9XCJLbm9yYUNvbnN0YW50cy5SZXNvdXJjZVwiPjwvbGluay12YWx1ZT5cbiAgPHRleHQtdmFsdWUgI3Byb3BlcnR5VmFsdWUgW2Zvcm1Hcm91cF09XCJmb3JtXCIgKm5nU3dpdGNoQ2FzZT1cIktub3JhQ29uc3RhbnRzLlRleHRWYWx1ZVwiPjwvdGV4dC12YWx1ZT5cbiAgPHVyaS12YWx1ZSAjcHJvcGVydHlWYWx1ZSBbZm9ybUdyb3VwXT1cImZvcm1cIiAqbmdTd2l0Y2hDYXNlPVwiS25vcmFDb25zdGFudHMuVXJpVmFsdWVcIj48L3VyaS12YWx1ZT5cblxuICAgIDwhLS0gVE9ETzogUmVzb3VyY2U6IGhhbmRsZSBsaW5raW5nIHByb3BlcnRpZXMgd2l0aCB0YXJnZXQgY2xhc3MgcmVzdHJpY3Rpb246IGFjY2VzcyBwcm9wZXJ0eSBtZW1iZXIgdG8gZ2V0IG9iamVjdENsYXNzIHZpYSBwcm9wZXJ0eSgpIGdldHRlciBtZXRob2QgLS0+XG4gIDxzcGFuICpuZ1N3aXRjaERlZmF1bHQ9XCJcIj5Ob3Qgc3VwcG9ydGVkIHt7cHJvcGVydHlWYWx1ZVR5cGV9fTwvc3Bhbj5cbjwvc3Bhbj5cbmAsXG4gICAgc3R5bGVzOiBbYC5zZWFyY2gtb3BlcmF0b3ItZmllbGR7bWFyZ2luLXJpZ2h0OjhweH1gXVxufSlcbmV4cG9ydCBjbGFzcyBTcGVjaWZ5UHJvcGVydHlWYWx1ZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzIHtcblxuICAgIEtub3JhQ29uc3RhbnRzID0gS25vcmFDb25zdGFudHM7XG5cbiAgICAvLyBwYXJlbnQgRm9ybUdyb3VwXG4gICAgQElucHV0KCkgZm9ybUdyb3VwOiBGb3JtR3JvdXA7XG5cbiAgICBAVmlld0NoaWxkKCdwcm9wZXJ0eVZhbHVlJykgcHJvcGVydHlWYWx1ZUNvbXBvbmVudDogUHJvcGVydHlWYWx1ZTtcblxuICAgIC8vIHNldHRlciBtZXRob2QgZm9yIHRoZSBwcm9wZXJ0eSBjaG9zZW4gYnkgdGhlIHVzZXJcbiAgICBASW5wdXQoKVxuICAgIHNldCBwcm9wZXJ0eShwcm9wOiBQcm9wZXJ0eSkge1xuICAgICAgICB0aGlzLmNvbXBhcmlzb25PcGVyYXRvclNlbGVjdGVkID0gdW5kZWZpbmVkOyAvLyByZXNldCB0byBpbml0aWFsIHN0YXRlXG4gICAgICAgIHRoaXMuX3Byb3BlcnR5ID0gcHJvcDtcbiAgICAgICAgdGhpcy5yZXNldENvbXBhcmlzb25PcGVyYXRvcnMoKTsgLy8gcmVzZXQgY29tcGFyaXNvbiBvcGVyYXRvcnMgZm9yIGdpdmVuIHByb3BlcnR5IChvdmVyd3JpdGluZyBhbnkgcHJldmlvdXMgc2VsZWN0aW9uKVxuICAgIH1cblxuICAgIC8vIGdldHRlciBtZXRob2QgZm9yIHRoaXMuX3Byb3BlcnR5XG4gICAgZ2V0IHByb3BlcnR5KCk6IFByb3BlcnR5IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Byb3BlcnR5O1xuICAgIH1cblxuICAgIHByaXZhdGUgX3Byb3BlcnR5OiBQcm9wZXJ0eTtcblxuICAgIGZvcm06IEZvcm1Hcm91cDtcblxuICAgIC8vIGF2YWlsYWJsZSBjb21wYXJpc29uIG9wZXJhdG9ycyBmb3IgdGhlIHByb3BlcnR5XG4gICAgY29tcGFyaXNvbk9wZXJhdG9yczogQXJyYXk8Q29tcGFyaXNvbk9wZXJhdG9yPiA9IFtdO1xuXG4gICAgLy8gY29tcGFyaXNvbiBvcGVyYXRvciBzZWxlY3RlZCBieSB0aGUgdXNlclxuICAgIGNvbXBhcmlzb25PcGVyYXRvclNlbGVjdGVkOiBDb21wYXJpc29uT3BlcmF0b3I7XG5cbiAgICAvLyB0aGUgdHlwZSBvZiB0aGUgcHJvcGVydHlcbiAgICBwcm9wZXJ0eVZhbHVlVHlwZTtcblxuICAgIGNvbnN0cnVjdG9yKEBJbmplY3QoRm9ybUJ1aWxkZXIpIHByaXZhdGUgZmI6IEZvcm1CdWlsZGVyKSB7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVzZXRzIHRoZSBjb21wYXJpc29uIG9wZXJhdG9ycyBmb3IgdGhpcy5fcHJvcGVydHkuXG4gICAgICovXG4gICAgcmVzZXRDb21wYXJpc29uT3BlcmF0b3JzKCkge1xuXG4gICAgICAgIC8vIGRlcGVuZGluZyBvbiBvYmplY3QgY2xhc3MsIHNldCBjb21wYXJpc29uIG9wZXJhdG9ycyBhbmQgdmFsdWUgZW50cnkgZmllbGRcbiAgICAgICAgaWYgKHRoaXMuX3Byb3BlcnR5LmlzTGlua1Byb3BlcnR5KSB7XG4gICAgICAgICAgICB0aGlzLnByb3BlcnR5VmFsdWVUeXBlID0gS25vcmFDb25zdGFudHMuUmVzb3VyY2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnByb3BlcnR5VmFsdWVUeXBlID0gdGhpcy5fcHJvcGVydHkub2JqZWN0VHlwZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN3aXRjaCAodGhpcy5wcm9wZXJ0eVZhbHVlVHlwZSkge1xuXG4gICAgICAgICAgICBjYXNlIEtub3JhQ29uc3RhbnRzLlRleHRWYWx1ZTpcbiAgICAgICAgICAgICAgICB0aGlzLmNvbXBhcmlzb25PcGVyYXRvcnMgPSBbbmV3IExpa2UoKSwgbmV3IE1hdGNoKCksIG5ldyBFcXVhbHMoKSwgbmV3IE5vdEVxdWFscygpLCBuZXcgRXhpc3RzKCldO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIEtub3JhQ29uc3RhbnRzLkJvb2xlYW5WYWx1ZTpcbiAgICAgICAgICAgIGNhc2UgS25vcmFDb25zdGFudHMuUmVzb3VyY2U6XG4gICAgICAgICAgICBjYXNlIEtub3JhQ29uc3RhbnRzLlVyaVZhbHVlOlxuICAgICAgICAgICAgY2FzZSBLbm9yYUNvbnN0YW50cy5JbnRlcnZhbFZhbHVlOlxuICAgICAgICAgICAgICAgIHRoaXMuY29tcGFyaXNvbk9wZXJhdG9ycyA9IFtuZXcgRXF1YWxzKCksIG5ldyBOb3RFcXVhbHMoKSwgbmV3IEV4aXN0cygpXTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSBLbm9yYUNvbnN0YW50cy5JbnRWYWx1ZTpcbiAgICAgICAgICAgIGNhc2UgS25vcmFDb25zdGFudHMuRGVjaW1hbFZhbHVlOlxuICAgICAgICAgICAgY2FzZSBLbm9yYUNvbnN0YW50cy5EYXRlVmFsdWU6XG4gICAgICAgICAgICAgICAgdGhpcy5jb21wYXJpc29uT3BlcmF0b3JzID0gW25ldyBFcXVhbHMoKSwgbmV3IE5vdEVxdWFscygpLCBuZXcgTGVzc1RoYW4oKSwgbmV3IExlc3NUaGFuRXF1YWxzKCksIG5ldyBHcmVhdGVyVGhhbigpLCBuZXcgR3JlYXRlclRoYW5FcXVhbHMoKSwgbmV3IEV4aXN0cygpXTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSBLbm9yYUNvbnN0YW50cy5MaXN0VmFsdWU6XG4gICAgICAgICAgICBjYXNlIEtub3JhQ29uc3RhbnRzLkdlb21WYWx1ZTpcbiAgICAgICAgICAgIGNhc2UgS25vcmFDb25zdGFudHMuRmlsZVZhbHVlOlxuICAgICAgICAgICAgY2FzZSBLbm9yYUNvbnN0YW50cy5BdWRpb0ZpbGVWYWx1ZTpcbiAgICAgICAgICAgIGNhc2UgS25vcmFDb25zdGFudHMuU3RpbGxJbWFnZUZpbGVWYWx1ZTpcbiAgICAgICAgICAgIGNhc2UgS25vcmFDb25zdGFudHMuRERERmlsZVZhbHVlOlxuICAgICAgICAgICAgY2FzZSBLbm9yYUNvbnN0YW50cy5Nb3ZpbmdJbWFnZUZpbGVWYWx1ZTpcbiAgICAgICAgICAgIGNhc2UgS25vcmFDb25zdGFudHMuVGV4dEZpbGVWYWx1ZTpcbiAgICAgICAgICAgIGNhc2UgS25vcmFDb25zdGFudHMuQ29sb3JWYWx1ZTpcbiAgICAgICAgICAgICAgICB0aGlzLmNvbXBhcmlzb25PcGVyYXRvcnMgPSBbbmV3IEV4aXN0cygpXTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnRVJST1I6IFVuc3VwcG9ydGVkIHZhbHVlIHR5cGUgJyArIHRoaXMuX3Byb3BlcnR5Lm9iamVjdFR5cGUpO1xuXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIG5nT25Jbml0KCkgeyB9XG5cbiAgICBuZ09uQ2hhbmdlcygpIHtcblxuICAgICAgICAvLyBidWlsZCBhIGZvcm0gZm9yIGNvbXBhcmlzb24gb3BlcmF0b3Igc2VsZWN0aW9uXG4gICAgICAgIHRoaXMuZm9ybSA9IHRoaXMuZmIuZ3JvdXAoe1xuICAgICAgICAgICAgY29tcGFyaXNvbk9wZXJhdG9yOiBbbnVsbCwgVmFsaWRhdG9ycy5yZXF1aXJlZF1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gc3RvcmUgY29tcGFyaXNvbiBvcGVyYXRvciB3aGVuIHNlbGVjdGVkXG4gICAgICAgIHRoaXMuZm9ybS52YWx1ZUNoYW5nZXMuc3Vic2NyaWJlKChkYXRhKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNvbXBhcmlzb25PcGVyYXRvclNlbGVjdGVkID0gZGF0YS5jb21wYXJpc29uT3BlcmF0b3I7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJlc29sdmVkUHJvbWlzZS50aGVuKCgpID0+IHtcblxuICAgICAgICAgICAgLy8gcmVtb3ZlIGZyb20gdGhlIHBhcmVudCBmb3JtIGdyb3VwIChjbGVhbiByZXNldClcbiAgICAgICAgICAgIHRoaXMuZm9ybUdyb3VwLnJlbW92ZUNvbnRyb2woJ2NvbXBhcmlzb25PcGVyYXRvcicpO1xuXG4gICAgICAgICAgICAvLyBhZGQgZm9ybSB0byB0aGUgcGFyZW50IGZvcm0gZ3JvdXBcbiAgICAgICAgICAgIHRoaXMuZm9ybUdyb3VwLmFkZENvbnRyb2woJ2NvbXBhcmlzb25PcGVyYXRvcicsIHRoaXMuZm9ybSk7XG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgc3BlY2lmaWVkIGNvbXBhcmlzb24gb3BlcmF0b3IgYW5kIHZhbHVlIGZvciB0aGUgcHJvcGVydHkuXG4gICAgICpcbiAgICAgKiByZXR1cm5zIHtDb21wYXJpc29uT3BlcmF0b3JBbmRWYWx1ZX0gdGhlIGNvbXBhcmlzb24gb3BlcmF0b3IgYW5kIHRoZSBzcGVjaWZpZWQgdmFsdWVcbiAgICAgKi9cbiAgICBnZXRDb21wYXJpc29uT3BlcmF0b3JBbmRWYWx1ZUxpdGVyYWxGb3JQcm9wZXJ0eSgpOiBDb21wYXJpc29uT3BlcmF0b3JBbmRWYWx1ZSB7XG4gICAgICAgIC8vIHJldHVybiB2YWx1ZSAobGl0ZXJhbCBvciBJUkkpIGZyb20gdGhlIGNoaWxkIGNvbXBvbmVudFxuICAgICAgICBsZXQgdmFsdWU6IFZhbHVlO1xuXG4gICAgICAgIC8vIGNvbXBhcmlzb24gb3BlcmF0b3IgJ0V4aXN0cycgZG9lcyBub3QgcmVxdWlyZSBhIHZhbHVlXG4gICAgICAgIGlmICh0aGlzLmNvbXBhcmlzb25PcGVyYXRvclNlbGVjdGVkLmdldENsYXNzTmFtZSgpICE9PSAnRXhpc3RzJykge1xuICAgICAgICAgICAgdmFsdWUgPSB0aGlzLnByb3BlcnR5VmFsdWVDb21wb25lbnQuZ2V0VmFsdWUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHJldHVybiB0aGUgY29tcGFyaXNvbiBvcGVyYXRvciBhbmQgdGhlIHNwZWNpZmllZCB2YWx1ZVxuICAgICAgICByZXR1cm4gbmV3IENvbXBhcmlzb25PcGVyYXRvckFuZFZhbHVlKHRoaXMuY29tcGFyaXNvbk9wZXJhdG9yU2VsZWN0ZWQsIHZhbHVlKTtcblxuICAgIH1cblxufVxuXG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIEluamVjdCwgSW5wdXQsIE9uRGVzdHJveSwgT25Jbml0LCBWaWV3Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gICAgQ2FyZGluYWxpdHksXG4gICAgQ2FyZGluYWxpdHlPY2N1cnJlbmNlLFxuICAgIENvbXBhcmlzb25PcGVyYXRvckFuZFZhbHVlLFxuICAgIFByb3BlcnRpZXMsXG4gICAgUHJvcGVydHksXG4gICAgUHJvcGVydHlXaXRoVmFsdWUsXG4gICAgUmVzb3VyY2VDbGFzc1xufSBmcm9tICdAa25vcmEvY29yZSc7XG5pbXBvcnQgeyBGb3JtQnVpbGRlciwgRm9ybUdyb3VwLCBWYWxpZGF0b3JzIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgU3BlY2lmeVByb3BlcnR5VmFsdWVDb21wb25lbnQgfSBmcm9tICcuL3NwZWNpZnktcHJvcGVydHktdmFsdWUvc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgT250b2xvZ3lJbmZvcm1hdGlvbiB9IGZyb20gJ0Brbm9yYS9jb3JlJztcblxuXG4vLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy80NTY2MTAxMC9keW5hbWljLW5lc3RlZC1yZWFjdGl2ZS1mb3JtLWV4cHJlc3Npb25jaGFuZ2VkYWZ0ZXJpdGhhc2JlZW5jaGVja2VkZXJyb3JcbmNvbnN0IHJlc29sdmVkUHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZShudWxsKTtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdrdWktc2VsZWN0LXByb3BlcnR5JyxcbiAgICB0ZW1wbGF0ZTogYDxtYXQtZm9ybS1maWVsZCBjbGFzcz1cInNlYXJjaC1wcm9wZXJ0eS1maWVsZFwiICpuZ0lmPVwicHJvcGVydGllc0FzQXJyYXk/Lmxlbmd0aCA+IDBcIj5cbiAgPG1hdC1zZWxlY3QgcGxhY2Vob2xkZXI9XCJQcm9wZXJ0aWVzXCIgW2Zvcm1Db250cm9sXT1cImZvcm0uY29udHJvbHNbJ3Byb3BlcnR5J11cIj5cbiAgICA8bWF0LW9wdGlvbiAqbmdGb3I9XCJsZXQgcHJvcCBvZiBwcm9wZXJ0aWVzQXNBcnJheVwiIFt2YWx1ZV09XCJwcm9wLmlkXCI+e3sgcHJvcC5sYWJlbCB9fTwvbWF0LW9wdGlvbj5cbiAgPC9tYXQtc2VsZWN0PlxuPC9tYXQtZm9ybS1maWVsZD5cblxuPGt1aS1zcGVjaWZ5LXByb3BlcnR5LXZhbHVlICNzcGVjaWZ5UHJvcGVydHlWYWx1ZSBbZm9ybUdyb3VwXT1cImZvcm1cIiAqbmdJZj1cInByb3BlcnR5U2VsZWN0ZWQgIT09IHVuZGVmaW5lZFwiIFtwcm9wZXJ0eV09XCJwcm9wZXJ0eVNlbGVjdGVkXCI+PC9rdWktc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZT5cblxuPG1hdC1jaGVja2JveCBtYXRUb29sdGlwPVwiU29ydCBjcml0ZXJpb25cIiAqbmdJZj1cInByb3BlcnR5U2VsZWN0ZWQgIT09IHVuZGVmaW5lZCAmJiBzb3J0Q3JpdGVyaW9uKClcIiBbZm9ybUNvbnRyb2xdPVwiZm9ybS5jb250cm9sc1snaXNTb3J0Q3JpdGVyaW9uJ11cIj48L21hdC1jaGVja2JveD5gLFxuICAgIHN0eWxlczogW2Auc2VhcmNoLXByb3BlcnR5LWZpZWxke21hcmdpbi1yaWdodDo4cHh9YF1cbn0pXG5leHBvcnQgY2xhc3MgU2VsZWN0UHJvcGVydHlDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG5cbiAgICAvLyBwYXJlbnQgRm9ybUdyb3VwXG4gICAgQElucHV0KCkgZm9ybUdyb3VwOiBGb3JtR3JvdXA7XG5cbiAgICAvLyBpbmRleCBvZiB0aGUgZ2l2ZW4gcHJvcGVydHkgKHVuaXF1ZSlcbiAgICBASW5wdXQoKSBpbmRleDogbnVtYmVyO1xuXG4gICAgLy8gc2V0dGVyIG1ldGhvZCBmb3IgcHJvcGVydGllcyB3aGVuIGJlaW5nIHVwZGF0ZWQgYnkgcGFyZW50IGNvbXBvbmVudFxuICAgIEBJbnB1dCgpXG4gICAgc2V0IHByb3BlcnRpZXModmFsdWU6IFByb3BlcnRpZXMpIHtcbiAgICAgICAgdGhpcy5wcm9wZXJ0eVNlbGVjdGVkID0gdW5kZWZpbmVkOyAvLyByZXNldCBzZWxlY3RlZCBwcm9wZXJ0eSAob3ZlcndyaXRpbmcgYW55IHByZXZpb3VzIHNlbGVjdGlvbilcbiAgICAgICAgdGhpcy5fcHJvcGVydGllcyA9IHZhbHVlO1xuICAgICAgICB0aGlzLnVwZGF0ZVByb3BlcnRpZXNBcnJheSgpO1xuICAgIH1cblxuICAgIGdldCBwcm9wZXJ0aWVzKCkge1xuICAgICAgIHJldHVybiB0aGlzLl9wcm9wZXJ0aWVzO1xuICAgIH1cblxuICAgIF9hY3RpdmVSZXNvdXJjZUNsYXNzOiBSZXNvdXJjZUNsYXNzO1xuXG4gICAgLy8gc2V0dGVyIG1ldGhvZCBmb3Igc2VsZWN0ZWQgcmVzb3VyY2UgY2xhc3NcbiAgICBASW5wdXQoKVxuICAgIHNldCBhY3RpdmVSZXNvdXJjZUNsYXNzKHZhbHVlOiBSZXNvdXJjZUNsYXNzKSB7XG4gICAgICAgIHRoaXMuX2FjdGl2ZVJlc291cmNlQ2xhc3MgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICAvLyByZWZlcmVuY2UgdG8gY2hpbGQgY29tcG9uZW50OiBjb21iaW5hdGlvbiBvZiBjb21wYXJpc29uIG9wZXJhdG9yIGFuZCB2YWx1ZSBmb3IgY2hvc2VuIHByb3BlcnR5XG4gICAgQFZpZXdDaGlsZCgnc3BlY2lmeVByb3BlcnR5VmFsdWUnKSBzcGVjaWZ5UHJvcGVydHlWYWx1ZTogU3BlY2lmeVByb3BlcnR5VmFsdWVDb21wb25lbnQ7XG5cbiAgICAvLyBwcm9wZXJ0aWVzIHRoYXQgY2FuIGJlIHNlbGVjdGVkIGZyb21cbiAgICBwcml2YXRlIF9wcm9wZXJ0aWVzOiBQcm9wZXJ0aWVzO1xuXG4gICAgLy8gcHJvcGVydGllcyBhcyBhbiBBcnJheSBzdHJ1Y3R1cmUgKGJhc2VkIG9uIHRoaXMucHJvcGVydGllcylcbiAgICBwcm9wZXJ0aWVzQXNBcnJheTogQXJyYXk8UHJvcGVydHk+O1xuXG4gICAgLy8gcmVwcmVzZW50cyB0aGUgY3VycmVudGx5IHNlbGVjdGVkIHByb3BlcnR5XG4gICAgcHJvcGVydHlTZWxlY3RlZDogUHJvcGVydHk7XG5cbiAgICBmb3JtOiBGb3JtR3JvdXA7XG5cbiAgICAvLyB1bmlxdWUgbmFtZSBmb3IgdGhpcyBwcm9wZXJ0eSB0byBiZSB1c2VkIGluIHRoZSBwYXJlbnQgRm9ybUdyb3VwXG4gICAgcHJvcEluZGV4OiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvcihASW5qZWN0KEZvcm1CdWlsZGVyKSBwcml2YXRlIGZiOiBGb3JtQnVpbGRlcikge1xuXG4gICAgfVxuXG4gICAgbmdPbkluaXQoKSB7XG5cbiAgICAgICAgLy8gYnVpbGQgYSBmb3JtIGZvciB0aGUgcHJvcGVydHkgc2VsZWN0aW9uXG4gICAgICAgIHRoaXMuZm9ybSA9IHRoaXMuZmIuZ3JvdXAoe1xuICAgICAgICAgICAgcHJvcGVydHk6IFtudWxsLCBWYWxpZGF0b3JzLnJlcXVpcmVkXSxcbiAgICAgICAgICAgIGlzU29ydENyaXRlcmlvbjogW2ZhbHNlLCBWYWxpZGF0b3JzLnJlcXVpcmVkXVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyB1cGRhdGUgdGhlIHNlbGVjdGVkIHByb3BlcnR5XG4gICAgICAgIHRoaXMuZm9ybS52YWx1ZUNoYW5nZXMuc3Vic2NyaWJlKChkYXRhKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwcm9wSXJpID0gZGF0YS5wcm9wZXJ0eTtcbiAgICAgICAgICAgIHRoaXMucHJvcGVydHlTZWxlY3RlZCA9IHRoaXMuX3Byb3BlcnRpZXNbcHJvcElyaV07XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJlc29sdmVkUHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMucHJvcEluZGV4ID0gJ3Byb3BlcnR5JyArIHRoaXMuaW5kZXg7XG5cbiAgICAgICAgICAgIC8vIGFkZCBmb3JtIHRvIHRoZSBwYXJlbnQgZm9ybSBncm91cFxuICAgICAgICAgICAgdGhpcy5mb3JtR3JvdXAuYWRkQ29udHJvbCh0aGlzLnByb3BJbmRleCwgdGhpcy5mb3JtKTtcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcblxuICAgICAgICAvLyByZW1vdmUgZm9ybSBmcm9tIHRoZSBwYXJlbnQgZm9ybSBncm91cFxuICAgICAgICByZXNvbHZlZFByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZvcm1Hcm91cC5yZW1vdmVDb250cm9sKHRoaXMucHJvcEluZGV4KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW5kaWNhdGVzIGlmIHByb3BlcnR5IGNhbiBiZSB1c2VkIGFzIGEgc29ydCBjcml0ZXJpb24uXG4gICAgICogUHJvcGVydHkgaGFzIHRvIGhhdmUgY2FyZGluYWxpdHkgb3IgbWF4IGNhcmRpbmFsaXR5IDEgZm9yIHRoZSBjaG9zZW4gcmVzb3VyY2UgY2xhc3MuXG4gICAgICpcbiAgICAgKiBXZSBjYW5ub3Qgc29ydCBieSBwcm9wZXJ0aWVzIHdob3NlIGNhcmRpbmFsaXR5IGlzIGdyZWF0ZXIgdGhhbiAxLlxuICAgICAqIFJldHVybiBib29sZWFuXG4gICAgICovXG4gICAgc29ydENyaXRlcmlvbigpIHtcblxuICAgICAgICAvLyBjaGVjayBpZiBhIHJlc291cmNlIGNsYXNzIGlzIHNlbGVjdGVkIGFuZCBpZiB0aGUgcHJvcGVydHkncyBjYXJkaW5hbGl0eSBpcyAxIGZvciB0aGUgc2VsZWN0ZWQgcmVzb3VyY2UgY2xhc3NcbiAgICAgICAgaWYgKHRoaXMuX2FjdGl2ZVJlc291cmNlQ2xhc3MgIT09IHVuZGVmaW5lZCAmJiB0aGlzLnByb3BlcnR5U2VsZWN0ZWQgIT09IHVuZGVmaW5lZCAmJiAhdGhpcy5wcm9wZXJ0eVNlbGVjdGVkLmlzTGlua1Byb3BlcnR5KSB7XG5cbiAgICAgICAgICAgIGNvbnN0IGNhcmRpbmFsaXRpZXM6IENhcmRpbmFsaXR5W10gPSB0aGlzLl9hY3RpdmVSZXNvdXJjZUNsYXNzLmNhcmRpbmFsaXRpZXMuZmlsdGVyKFxuICAgICAgICAgICAgICAgIChjYXJkOiBDYXJkaW5hbGl0eSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyBjYXJkaW5hbGl0eSAxIG9yIG1heCBvY2N1cnJlbmNlIDFcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhcmQucHJvcGVydHkgPT09IHRoaXMucHJvcGVydHlTZWxlY3RlZC5pZFxuICAgICAgICAgICAgICAgICAgICAgICAgJiYgY2FyZC52YWx1ZSA9PT0gMVxuICAgICAgICAgICAgICAgICAgICAgICAgJiYgKGNhcmQub2NjdXJyZW5jZSA9PT0gQ2FyZGluYWxpdHlPY2N1cnJlbmNlLmNhcmQgfHwgY2FyZC5vY2N1cnJlbmNlID09PSBDYXJkaW5hbGl0eU9jY3VycmVuY2UubWF4Q2FyZClcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIHJldHVybiBjYXJkaW5hbGl0aWVzLmxlbmd0aCA9PT0gMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVXBkYXRlcyB0aGUgcHJvcGVydGllcyBhcnJheSB0aGF0IGlzIGFjY2Vzc2VkIGJ5IHRoZSB0ZW1wbGF0ZS5cbiAgICAgKi9cbiAgICBwcml2YXRlIHVwZGF0ZVByb3BlcnRpZXNBcnJheSgpIHtcblxuICAgICAgICAvLyByZXByZXNlbnQgdGhlIHByb3BlcnRpZXMgYXMgYW4gYXJyYXkgdG8gYmUgYWNjZXNzZWQgYnkgdGhlIHRlbXBsYXRlXG4gICAgICAgIGNvbnN0IHByb3BzQXJyYXkgPSBbXTtcblxuICAgICAgICBmb3IgKGNvbnN0IHByb3BJcmkgaW4gdGhpcy5fcHJvcGVydGllcykge1xuICAgICAgICAgICAgaWYgKHRoaXMuX3Byb3BlcnRpZXMuaGFzT3duUHJvcGVydHkocHJvcElyaSkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwcm9wID0gdGhpcy5fcHJvcGVydGllc1twcm9wSXJpXTtcblxuICAgICAgICAgICAgICAgIC8vIG9ubHkgbGlzdCBlZGl0YWJsZSBwcm9wcyB0aGF0IGFyZSBub3QgbGluayB2YWx1ZSBwcm9wc1xuICAgICAgICAgICAgICAgIGlmIChwcm9wLmlzRWRpdGFibGUgJiYgIXByb3AuaXNMaW5rVmFsdWVQcm9wZXJ0eSkge1xuICAgICAgICAgICAgICAgICAgICBwcm9wc0FycmF5LnB1c2godGhpcy5fcHJvcGVydGllc1twcm9wSXJpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gc29ydCBwcm9wZXJ0aWVzIGJ5IGxhYmVsIChhc2NlbmRpbmcpXG4gICAgICAgIHByb3BzQXJyYXkuc29ydChPbnRvbG9neUluZm9ybWF0aW9uLnNvcnRGdW5jKTtcblxuICAgICAgICB0aGlzLnByb3BlcnRpZXNBc0FycmF5ID0gcHJvcHNBcnJheTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBzZWxlY3RlZCBwcm9wZXJ0eSB3aXRoIHRoZSBzcGVjaWZpZWQgdmFsdWUuXG4gICAgICovXG4gICAgZ2V0UHJvcGVydHlTZWxlY3RlZFdpdGhWYWx1ZSgpOiBQcm9wZXJ0eVdpdGhWYWx1ZSB7XG5cbiAgICAgICAgY29uc3QgcHJvcFZhbDogQ29tcGFyaXNvbk9wZXJhdG9yQW5kVmFsdWUgPSB0aGlzLnNwZWNpZnlQcm9wZXJ0eVZhbHVlLmdldENvbXBhcmlzb25PcGVyYXRvckFuZFZhbHVlTGl0ZXJhbEZvclByb3BlcnR5KCk7XG5cbiAgICAgICAgbGV0IGlzU29ydENyaXRlcmlvbiA9IGZhbHNlO1xuXG4gICAgICAgIC8vIG9ubHkgbm9uIGxpbmtpbmcgcHJvcGVydGllcyBjYW4gYmUgdXNlZCBmb3Igc29ydGluZ1xuICAgICAgICBpZiAoIXRoaXMucHJvcGVydHlTZWxlY3RlZC5pc0xpbmtQcm9wZXJ0eSkge1xuICAgICAgICAgICAgaXNTb3J0Q3JpdGVyaW9uID0gdGhpcy5mb3JtLnZhbHVlLmlzU29ydENyaXRlcmlvbjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgUHJvcGVydHlXaXRoVmFsdWUodGhpcy5wcm9wZXJ0eVNlbGVjdGVkLCBwcm9wVmFsLCBpc1NvcnRDcml0ZXJpb24pO1xuXG4gICAgfVxuXG5cbn1cbiIsImltcG9ydCB7IENvbXBvbmVudCwgSW5qZWN0LCBJbnB1dCwgT25EZXN0cm95LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEZvcm1CdWlsZGVyLCBGb3JtR3JvdXAsIFZhbGlkYXRvcnMgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBLbm9yYUNvbnN0YW50cywgUHJvcGVydHlWYWx1ZSwgVmFsdWUsIFZhbHVlTGl0ZXJhbCB9IGZyb20gJ0Brbm9yYS9jb3JlJztcblxuLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNDU2NjEwMTAvZHluYW1pYy1uZXN0ZWQtcmVhY3RpdmUtZm9ybS1leHByZXNzaW9uY2hhbmdlZGFmdGVyaXRoYXNiZWVuY2hlY2tlZGVycm9yXG5jb25zdCByZXNvbHZlZFByb21pc2UgPSBQcm9taXNlLnJlc29sdmUobnVsbCk7XG5cblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdib29sZWFuLXZhbHVlJyxcbiAgICB0ZW1wbGF0ZTogYDxtYXQtY2hlY2tib3ggW2Zvcm1Db250cm9sXT1cImZvcm0uY29udHJvbHNbJ2Jvb2xlYW5WYWx1ZSddXCI+PC9tYXQtY2hlY2tib3g+XG5gLFxuICAgIHN0eWxlczogW2BgXVxufSlcbmV4cG9ydCBjbGFzcyBCb29sZWFuVmFsdWVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgUHJvcGVydHlWYWx1ZSB7XG5cbiAgICAvLyBwYXJlbnQgRm9ybUdyb3VwXG4gICAgQElucHV0KCkgZm9ybUdyb3VwOiBGb3JtR3JvdXA7XG5cbiAgICB0eXBlID0gS25vcmFDb25zdGFudHMuQm9vbGVhblZhbHVlO1xuXG4gICAgZm9ybTogRm9ybUdyb3VwO1xuXG4gICAgY29uc3RydWN0b3IoQEluamVjdChGb3JtQnVpbGRlcikgcHJpdmF0ZSBmYjogRm9ybUJ1aWxkZXIpIHtcblxuICAgIH1cblxuICAgIG5nT25Jbml0KCkge1xuXG4gICAgICAgIHRoaXMuZm9ybSA9IHRoaXMuZmIuZ3JvdXAoe1xuICAgICAgICAgICAgYm9vbGVhblZhbHVlOiBbZmFsc2UsIFZhbGlkYXRvcnMuY29tcG9zZShbVmFsaWRhdG9ycy5yZXF1aXJlZF0pXVxuICAgICAgICB9KTtcblxuICAgICAgICByZXNvbHZlZFByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAvLyBhZGQgZm9ybSB0byB0aGUgcGFyZW50IGZvcm0gZ3JvdXBcbiAgICAgICAgICAgIHRoaXMuZm9ybUdyb3VwLmFkZENvbnRyb2woJ3Byb3BWYWx1ZScsIHRoaXMuZm9ybSk7XG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG5cbiAgICAgICAgLy8gcmVtb3ZlIGZvcm0gZnJvbSB0aGUgcGFyZW50IGZvcm0gZ3JvdXBcbiAgICAgICAgcmVzb2x2ZWRQcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5mb3JtR3JvdXAucmVtb3ZlQ29udHJvbCgncHJvcFZhbHVlJyk7XG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgZ2V0VmFsdWUoKTogVmFsdWUge1xuICAgICAgICByZXR1cm4gbmV3IFZhbHVlTGl0ZXJhbChTdHJpbmcodGhpcy5mb3JtLnZhbHVlLmJvb2xlYW5WYWx1ZSksIEtub3JhQ29uc3RhbnRzLnhzZEJvb2xlYW4pO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IENvbXBvbmVudCwgRGlyZWN0aXZlLCBIb3N0LCBJbmplY3QsIElucHV0LCBPbkRlc3Ryb3ksIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRm9ybUJ1aWxkZXIsIEZvcm1Hcm91cCwgVmFsaWRhdG9ycyB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IEtub3JhQ29uc3RhbnRzLCBQcm9wZXJ0eVZhbHVlLCBWYWx1ZSwgVmFsdWVMaXRlcmFsIH0gZnJvbSAnQGtub3JhL2NvcmUnO1xuaW1wb3J0IHsgR3JlZ29yaWFuQ2FsZW5kYXJEYXRlLCBKRE5Db252ZXJ0aWJsZUNhbGVuZGFyLCBKRE5QZXJpb2QgfSBmcm9tICdqZG5jb252ZXJ0aWJsZWNhbGVuZGFyJztcbmltcG9ydCB7IERhdGVBZGFwdGVyLCBNQVRfREFURV9MT0NBTEUsIE1hdENhbGVuZGFyIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwnO1xuaW1wb3J0IHsgSkROQ29udmVydGlibGVDYWxlbmRhckRhdGVBZGFwdGVyIH0gZnJvbSAnamRuY29udmVydGlibGVjYWxlbmRhcmRhdGVhZGFwdGVyJztcblxuLyoqIEN1c3RvbSBoZWFkZXIgY29tcG9uZW50IGNvbnRhaW5pbmcgYSBjYWxlbmRhciBmb3JtYXQgc3dpdGNoZXIgKi9cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAna3VpLWNhbGVuZGFyLWhlYWRlcicsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgIDxtYXQtc2VsZWN0IHBsYWNlaG9sZGVyPVwiQ2FsZW5kYXIgRm9ybWF0XCIgW2Zvcm1Db250cm9sXT1cImZvcm0uY29udHJvbHNbJ2NhbGVuZGFyJ11cIj5cbiAgICAgICAgPG1hdC1vcHRpb24gKm5nRm9yPVwibGV0IGNhbCBvZiBzdXBwb3J0ZWRDYWxlbmRhckZvcm1hdHNcIiBbdmFsdWVdPVwiY2FsXCI+e3tjYWx9fTwvbWF0LW9wdGlvbj5cbiAgICAgIDwvbWF0LXNlbGVjdD5cbiAgICAgIDxtYXQtY2FsZW5kYXItaGVhZGVyPjwvbWF0LWNhbGVuZGFyLWhlYWRlcj5cbiAgICBgLFxuICAgIHN0eWxlczogW11cbn0pXG5leHBvcnQgY2xhc3MgSGVhZGVyQ29tcG9uZW50PEQ+IGltcGxlbWVudHMgT25Jbml0IHtcbiAgICBjb25zdHJ1Y3RvcihASG9zdCgpIHByaXZhdGUgX2NhbGVuZGFyOiBNYXRDYWxlbmRhcjxKRE5Db252ZXJ0aWJsZUNhbGVuZGFyPixcbiAgICAgICAgcHJpdmF0ZSBfZGF0ZUFkYXB0ZXI6IERhdGVBZGFwdGVyPEpETkNvbnZlcnRpYmxlQ2FsZW5kYXI+LFxuICAgICAgICBASW5qZWN0KEZvcm1CdWlsZGVyKSBwcml2YXRlIGZiOiBGb3JtQnVpbGRlcikge1xuICAgIH1cblxuICAgIGZvcm06IEZvcm1Hcm91cDtcblxuICAgIC8vIGEgbGlzdCBvZiBzdXBwb3J0ZWQgY2FsZW5kYXIgZm9ybWF0cyAoR3JlZ29yaWFuIGFuZCBKdWxpYW4pXG4gICAgc3VwcG9ydGVkQ2FsZW5kYXJGb3JtYXRzID0gSkROQ29udmVydGlibGVDYWxlbmRhci5zdXBwb3J0ZWRDYWxlbmRhcnM7XG5cbiAgICAvLyB0aGUgY3VycmVudGx5IGFjdGl2ZSBjYWxlbmRhciBmb3JtYXRcbiAgICBhY3RpdmVGb3JtYXQ7XG5cbiAgICBuZ09uSW5pdCgpIHtcblxuICAgICAgICAvLyBnZXQgdGhlIGN1cnJlbnRseSBhY3RpdmUgY2FsZW5kYXIgZm9ybWF0IGZyb20gdGhlIGRhdGUgYWRhcHRlclxuICAgICAgICBpZiAodGhpcy5fZGF0ZUFkYXB0ZXIgaW5zdGFuY2VvZiBKRE5Db252ZXJ0aWJsZUNhbGVuZGFyRGF0ZUFkYXB0ZXIpIHtcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlRm9ybWF0ID0gdGhpcy5fZGF0ZUFkYXB0ZXIuYWN0aXZlQ2FsZW5kYXJGb3JtYXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZGF0ZSBhZGFwdGVyIGlzIGV4cGVjdGVkIHRvIGJlIGFuIGluc3RhbmNlIG9mIEpETkNvbnZlcnRpYmxlQ2FsZW5kYXJEYXRlQWRhcHRlcicpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gYnVpbGQgYSBmb3JtIGZvciB0aGUgY2FsZW5kYXIgZm9ybWF0IHNlbGVjdGlvblxuICAgICAgICB0aGlzLmZvcm0gPSB0aGlzLmZiLmdyb3VwKHtcbiAgICAgICAgICAgIGNhbGVuZGFyOiBbdGhpcy5hY3RpdmVGb3JtYXQsIFZhbGlkYXRvcnMucmVxdWlyZWRdXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGRvIHRoZSBjb252ZXJzaW9uIHdoZW4gdGhlIHVzZXIgc2VsZWN0cyBhbm90aGVyIGNhbGVuZGFyIGZvcm1hdFxuICAgICAgICB0aGlzLmZvcm0udmFsdWVDaGFuZ2VzLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xuICAgICAgICAgICAgLy8gcGFzcyB0aGUgdGFyZ2V0IGNhbGVuZGFyIGZvcm1hdCB0byB0aGUgY29udmVyc2lvbiBtZXRob2RcbiAgICAgICAgICAgIHRoaXMuY29udmVydERhdGUoZGF0YS5jYWxlbmRhcik7XG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ29udmVydHMgdGhlIGRhdGUgaW50byB0aGUgdGFyZ2V0IGZvcm1hdC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBjYWxlbmRhciB0aGUgdGFyZ2V0IGNhbGVuZGFyIGZvcm1hdC5cbiAgICAgKi9cbiAgICBjb252ZXJ0RGF0ZShjYWxlbmRhcjogJ0dyZWdvcmlhbicgfCAnSnVsaWFuJykge1xuXG4gICAgICAgIGlmICh0aGlzLl9kYXRlQWRhcHRlciBpbnN0YW5jZW9mIEpETkNvbnZlcnRpYmxlQ2FsZW5kYXJEYXRlQWRhcHRlcikge1xuXG4gICAgICAgICAgICAvLyBjb252ZXJ0IHRoZSBkYXRlIGludG8gdGhlIHRhcmdldCBjYWxlbmRhciBmb3JtYXRcbiAgICAgICAgICAgIGNvbnN0IGNvbnZlcnRlZERhdGUgPSB0aGlzLl9kYXRlQWRhcHRlci5jb252ZXJ0Q2FsZW5kYXJGb3JtYXQodGhpcy5fY2FsZW5kYXIuYWN0aXZlRGF0ZSwgY2FsZW5kYXIpO1xuXG4gICAgICAgICAgICAvLyBzZXQgdGhlIG5ldyBkYXRlXG4gICAgICAgICAgICB0aGlzLl9jYWxlbmRhci5hY3RpdmVEYXRlID0gY29udmVydGVkRGF0ZTtcblxuICAgICAgICAgICAgLy8gc2VsZWN0IHRoZSBuZXcgZGF0ZSBpbiB0aGUgZGF0ZXBpY2tlciBVSVxuICAgICAgICAgICAgdGhpcy5fY2FsZW5kYXIuX2RhdGVTZWxlY3RlZChjb252ZXJ0ZWREYXRlKTtcblxuICAgICAgICAgICAgLy8gdXBkYXRlIHZpZXcgYWZ0ZXIgY2FsZW5kYXIgZm9ybWF0IGNvbnZlcnNpb25cbiAgICAgICAgICAgIGNvbnN0IHZpZXcgPSB0aGlzLl9jYWxlbmRhci5jdXJyZW50VmlldyA9PT0gJ21vbnRoJyA/IHRoaXMuX2NhbGVuZGFyLm1vbnRoVmlldyA6XG4gICAgICAgICAgICAgICAgKHRoaXMuX2NhbGVuZGFyLmN1cnJlbnRWaWV3ID09PSAneWVhcicgPyB0aGlzLl9jYWxlbmRhci55ZWFyVmlldyA6IHRoaXMuX2NhbGVuZGFyLm11bHRpWWVhclZpZXcpO1xuXG4gICAgICAgICAgICB2aWV3Lm5nQWZ0ZXJDb250ZW50SW5pdCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2RhdGUgYWRhcHRlciBpcyBleHBlY3RlZCB0byBiZSBhbiBpbnN0YW5jZSBvZiBKRE5Db252ZXJ0aWJsZUNhbGVuZGFyRGF0ZUFkYXB0ZXInKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCB7IENvbXBvbmVudCwgSG9zdCwgSW5qZWN0LCBJbnB1dCwgT25EZXN0cm95LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEZvcm1CdWlsZGVyLCBGb3JtR3JvdXAsIFZhbGlkYXRvcnMgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbmltcG9ydCB7IEtub3JhQ29uc3RhbnRzLCBQcm9wZXJ0eVZhbHVlLCBWYWx1ZSwgVmFsdWVMaXRlcmFsIH0gZnJvbSAnQGtub3JhL2NvcmUnO1xuaW1wb3J0IHsgR3JlZ29yaWFuQ2FsZW5kYXJEYXRlLCBKRE5Db252ZXJ0aWJsZUNhbGVuZGFyLCBKRE5QZXJpb2QgfSBmcm9tICdqZG5jb252ZXJ0aWJsZWNhbGVuZGFyJztcbmltcG9ydCB7IEhlYWRlckNvbXBvbmVudCB9IGZyb20gJy4vaGVhZGVyLWNhbGVuZGFyL2hlYWRlci1jYWxlbmRhci5jb21wb25lbnQnO1xuXG4vLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy80NTY2MTAxMC9keW5hbWljLW5lc3RlZC1yZWFjdGl2ZS1mb3JtLWV4cHJlc3Npb25jaGFuZ2VkYWZ0ZXJpdGhhc2JlZW5jaGVja2VkZXJyb3JcbmNvbnN0IHJlc29sdmVkUHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZShudWxsKTtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdkYXRlLXZhbHVlJyxcbiAgICB0ZW1wbGF0ZTogYDxtYXQtZm9ybS1maWVsZD5cbiAgICA8a3VpSmRuRGF0ZXBpY2tlcj5cbiAgICAgICAgPGlucHV0IG1hdElucHV0IFttYXREYXRlcGlja2VyXT1cInBpY2tlclwiIHBsYWNlaG9sZGVyPVwiQ2hvb3NlIGEgZGF0ZVwiIFtmb3JtQ29udHJvbF09XCJmb3JtLmNvbnRyb2xzWydkYXRlVmFsdWUnXVwiPlxuICAgICAgICA8bWF0LWRhdGVwaWNrZXIgI3BpY2tlciBbY2FsZW5kYXJIZWFkZXJDb21wb25lbnRdPVwiaGVhZGVyQ29tcG9uZW50XCI+PC9tYXQtZGF0ZXBpY2tlcj5cbiAgICA8L2t1aUpkbkRhdGVwaWNrZXI+XG4gICAgPG1hdC1kYXRlcGlja2VyLXRvZ2dsZSBtYXRTdWZmaXggW2Zvcl09XCJwaWNrZXJcIj48L21hdC1kYXRlcGlja2VyLXRvZ2dsZT5cbjwvbWF0LWZvcm0tZmllbGQ+YCxcbiAgICBzdHlsZXM6IFtgYF1cbn0pXG5leHBvcnQgY2xhc3MgRGF0ZVZhbHVlQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3ksIFByb3BlcnR5VmFsdWUge1xuXG4gICAgLy8gcGFyZW50IEZvcm1Hcm91cFxuICAgIEBJbnB1dCgpIGZvcm1Hcm91cDogRm9ybUdyb3VwO1xuXG4gICAgdHlwZSA9IEtub3JhQ29uc3RhbnRzLkRhdGVWYWx1ZTtcblxuICAgIGZvcm06IEZvcm1Hcm91cDtcblxuICAgIC8vIGN1c3RvbSBoZWFkZXIgZm9yIHRoZSBkYXRlcGlja2VyXG4gICAgaGVhZGVyQ29tcG9uZW50ID0gSGVhZGVyQ29tcG9uZW50O1xuXG4gICAgY29uc3RydWN0b3IoQEluamVjdChGb3JtQnVpbGRlcikgcHJpdmF0ZSBmYjogRm9ybUJ1aWxkZXIpIHtcbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHtcblxuICAgICAgICAvLyBpbml0IGRhdGVwaWNrZXJcbiAgICAgICAgdGhpcy5mb3JtID0gdGhpcy5mYi5ncm91cCh7XG4gICAgICAgICAgICBkYXRlVmFsdWU6IFtudWxsLCBWYWxpZGF0b3JzLmNvbXBvc2UoW1ZhbGlkYXRvcnMucmVxdWlyZWRdKV1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5mb3JtLnZhbHVlQ2hhbmdlcy5zdWJzY3JpYmUoKGRhdGEpID0+IHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGRhdGEuZGF0ZVZhbHVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmVzb2x2ZWRQcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgLy8gYWRkIGZvcm0gdG8gdGhlIHBhcmVudCBmb3JtIGdyb3VwXG4gICAgICAgICAgICB0aGlzLmZvcm1Hcm91cC5hZGRDb250cm9sKCdwcm9wVmFsdWUnLCB0aGlzLmZvcm0pO1xuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCkge1xuXG4gICAgICAgIC8vIHJlbW92ZSBmb3JtIGZyb20gdGhlIHBhcmVudCBmb3JtIGdyb3VwXG4gICAgICAgIHJlc29sdmVkUHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZm9ybUdyb3VwLnJlbW92ZUNvbnRyb2woJ3Byb3BWYWx1ZScpO1xuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIGdldFZhbHVlKCk6IFZhbHVlIHtcblxuICAgICAgICBjb25zdCBkYXRlT2JqOiBKRE5Db252ZXJ0aWJsZUNhbGVuZGFyID0gdGhpcy5mb3JtLnZhbHVlLmRhdGVWYWx1ZTtcblxuICAgICAgICAvLyBnZXQgY2FsZW5kYXIgZm9ybWF0XG4gICAgICAgIGNvbnN0IGNhbGVuZGFyRm9ybWF0ID0gZGF0ZU9iai5jYWxlbmRhck5hbWU7XG4gICAgICAgIC8vIGdldCBjYWxlbmRhciBwZXJpb2RcbiAgICAgICAgY29uc3QgY2FsZW5kYXJQZXJpb2QgPSBkYXRlT2JqLnRvQ2FsZW5kYXJQZXJpb2QoKTtcbiAgICAgICAgLy8gZ2V0IHRoZSBkYXRlXG4gICAgICAgIGNvbnN0IGRhdGVTdHJpbmcgPSBgJHtjYWxlbmRhckZvcm1hdC50b1VwcGVyQ2FzZSgpfToke2NhbGVuZGFyUGVyaW9kLnBlcmlvZFN0YXJ0LnllYXJ9LSR7Y2FsZW5kYXJQZXJpb2QucGVyaW9kU3RhcnQubW9udGh9LSR7Y2FsZW5kYXJQZXJpb2QucGVyaW9kU3RhcnQuZGF5fToke2NhbGVuZGFyUGVyaW9kLnBlcmlvZEVuZC55ZWFyfS0ke2NhbGVuZGFyUGVyaW9kLnBlcmlvZEVuZC5tb250aH0tJHtjYWxlbmRhclBlcmlvZC5wZXJpb2RFbmQuZGF5fWA7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBWYWx1ZUxpdGVyYWwoU3RyaW5nKGRhdGVTdHJpbmcpLCBLbm9yYUNvbnN0YW50cy5EYXRlVmFsdWUpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IENvbXBvbmVudCwgSW5qZWN0LCBJbnB1dCwgT25EZXN0cm95LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEZvcm1CdWlsZGVyLCBGb3JtR3JvdXAsIFZhbGlkYXRvcnMgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBLbm9yYUNvbnN0YW50cywgUHJvcGVydHlWYWx1ZSwgVmFsdWUsIFZhbHVlTGl0ZXJhbCB9IGZyb20gJ0Brbm9yYS9jb3JlJztcblxuLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNDU2NjEwMTAvZHluYW1pYy1uZXN0ZWQtcmVhY3RpdmUtZm9ybS1leHByZXNzaW9uY2hhbmdlZGFmdGVyaXRoYXNiZWVuY2hlY2tlZGVycm9yXG5jb25zdCByZXNvbHZlZFByb21pc2UgPSBQcm9taXNlLnJlc29sdmUobnVsbCk7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnZGVjaW1hbC12YWx1ZScsXG4gICAgdGVtcGxhdGU6IGA8bWF0LWZvcm0tZmllbGQ+XG4gICAgPGlucHV0IG1hdElucHV0IFtmb3JtQ29udHJvbF09XCJmb3JtLmNvbnRyb2xzWydkZWNpbWFsVmFsdWUnXVwiIHBsYWNlaG9sZGVyPVwiRGVjaW1hbCB2YWx1ZVwiIHZhbHVlPVwiXCIgdHlwZT1cIm51bWJlclwiPlxuPC9tYXQtZm9ybS1maWVsZD5cbmAsXG4gICAgc3R5bGVzOiBbYGBdXG59KVxuZXhwb3J0IGNsYXNzIERlY2ltYWxWYWx1ZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95LCBQcm9wZXJ0eVZhbHVlIHtcblxuICAgIC8vIHBhcmVudCBGb3JtR3JvdXBcbiAgICBASW5wdXQoKSBmb3JtR3JvdXA6IEZvcm1Hcm91cDtcblxuICAgIHR5cGUgPSBLbm9yYUNvbnN0YW50cy5EZWNpbWFsVmFsdWU7XG5cbiAgICBmb3JtOiBGb3JtR3JvdXA7XG5cbiAgICBjb25zdHJ1Y3RvcihASW5qZWN0KEZvcm1CdWlsZGVyKSBwcml2YXRlIGZiOiBGb3JtQnVpbGRlcikge1xuICAgIH1cblxuICAgIG5nT25Jbml0KCkge1xuXG4gICAgICAgIHRoaXMuZm9ybSA9IHRoaXMuZmIuZ3JvdXAoe1xuICAgICAgICAgICAgZGVjaW1hbFZhbHVlOiBbbnVsbCwgVmFsaWRhdG9ycy5jb21wb3NlKFtWYWxpZGF0b3JzLnJlcXVpcmVkXSldXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJlc29sdmVkUHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIC8vIGFkZCBmb3JtIHRvIHRoZSBwYXJlbnQgZm9ybSBncm91cFxuICAgICAgICAgICAgdGhpcy5mb3JtR3JvdXAuYWRkQ29udHJvbCgncHJvcFZhbHVlJywgdGhpcy5mb3JtKTtcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcblxuICAgICAgICAvLyByZW1vdmUgZm9ybSBmcm9tIHRoZSBwYXJlbnQgZm9ybSBncm91cFxuICAgICAgICByZXNvbHZlZFByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZvcm1Hcm91cC5yZW1vdmVDb250cm9sKCdwcm9wVmFsdWUnKTtcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBnZXRWYWx1ZSgpOiBWYWx1ZSB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBWYWx1ZUxpdGVyYWwoU3RyaW5nKHRoaXMuZm9ybS52YWx1ZS5kZWNpbWFsVmFsdWUpLCBLbm9yYUNvbnN0YW50cy54c2REZWNpbWFsKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIEluamVjdCwgSW5wdXQsIE9uRGVzdHJveSwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBGb3JtQnVpbGRlciwgRm9ybUdyb3VwLCBWYWxpZGF0b3JzIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgS25vcmFDb25zdGFudHMsIFByb3BlcnR5VmFsdWUsIFZhbHVlLCBWYWx1ZUxpdGVyYWwgfSBmcm9tICdAa25vcmEvY29yZSc7XG5cbi8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzQ1NjYxMDEwL2R5bmFtaWMtbmVzdGVkLXJlYWN0aXZlLWZvcm0tZXhwcmVzc2lvbmNoYW5nZWRhZnRlcml0aGFzYmVlbmNoZWNrZWRlcnJvclxuY29uc3QgcmVzb2x2ZWRQcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKG51bGwpO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ2ludGVnZXItdmFsdWUnLFxuICAgIHRlbXBsYXRlOiBgPG1hdC1mb3JtLWZpZWxkPlxuICAgIDxpbnB1dCBtYXRJbnB1dCBbZm9ybUNvbnRyb2xdPVwiZm9ybS5jb250cm9sc1snaW50ZWdlclZhbHVlJ11cIiBwbGFjZWhvbGRlcj1cIkludGVnZXIgdmFsdWVcIiB2YWx1ZT1cIlwiIHR5cGU9XCJudW1iZXJcIj5cbjwvbWF0LWZvcm0tZmllbGQ+XG5gLFxuICAgIHN0eWxlczogW2BgXVxufSlcbmV4cG9ydCBjbGFzcyBJbnRlZ2VyVmFsdWVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgUHJvcGVydHlWYWx1ZSB7XG5cbiAgICAvLyBwYXJlbnQgRm9ybUdyb3VwXG4gICAgQElucHV0KCkgZm9ybUdyb3VwOiBGb3JtR3JvdXA7XG5cbiAgICB0eXBlID0gS25vcmFDb25zdGFudHMuSW50VmFsdWU7XG5cbiAgICBmb3JtOiBGb3JtR3JvdXA7XG5cbiAgICBjb25zdHJ1Y3RvcihASW5qZWN0KEZvcm1CdWlsZGVyKSBwcml2YXRlIGZiOiBGb3JtQnVpbGRlcikge1xuXG4gICAgfVxuXG4gICAgbmdPbkluaXQoKSB7XG5cbiAgICAgICAgdGhpcy5mb3JtID0gdGhpcy5mYi5ncm91cCh7XG4gICAgICAgICAgICBpbnRlZ2VyVmFsdWU6IFtudWxsLCBWYWxpZGF0b3JzLmNvbXBvc2UoW1ZhbGlkYXRvcnMucmVxdWlyZWQsIFZhbGlkYXRvcnMucGF0dGVybigvXi0/XFxkKyQvKV0pXSAvLyBvbmx5IGFsbG93IGZvciBpbnRlZ2VyIHZhbHVlcyAobm8gZnJhY3Rpb25zKVxuICAgICAgICB9KTtcblxuICAgICAgICByZXNvbHZlZFByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAvLyBhZGQgZm9ybSB0byB0aGUgcGFyZW50IGZvcm0gZ3JvdXBcbiAgICAgICAgICAgIHRoaXMuZm9ybUdyb3VwLmFkZENvbnRyb2woJ3Byb3BWYWx1ZScsIHRoaXMuZm9ybSk7XG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG5cbiAgICAgICAgLy8gcmVtb3ZlIGZvcm0gZnJvbSB0aGUgcGFyZW50IGZvcm0gZ3JvdXBcbiAgICAgICAgcmVzb2x2ZWRQcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5mb3JtR3JvdXAucmVtb3ZlQ29udHJvbCgncHJvcFZhbHVlJyk7XG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgZ2V0VmFsdWUoKTogVmFsdWUge1xuXG4gICAgICAgIHJldHVybiBuZXcgVmFsdWVMaXRlcmFsKFN0cmluZyh0aGlzLmZvcm0udmFsdWUuaW50ZWdlclZhbHVlKSwgS25vcmFDb25zdGFudHMueHNkSW50ZWdlcik7XG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIEluamVjdCwgSW5wdXQsIE9uRGVzdHJveSwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBGb3JtQnVpbGRlciwgRm9ybUNvbnRyb2wsIEZvcm1Hcm91cCwgVmFsaWRhdG9ycyB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7XG4gICAgQXBpU2VydmljZVJlc3VsdCxcbiAgICBDb252ZXJ0SlNPTkxELFxuICAgIElSSSxcbiAgICBLbm9yYUNvbnN0YW50cyxcbiAgICBPbnRvbG9neUNhY2hlU2VydmljZSxcbiAgICBQcm9wZXJ0eVZhbHVlLFxuICAgIFJlYWRSZXNvdXJjZSxcbiAgICBSZWFkUmVzb3VyY2VzU2VxdWVuY2UsXG4gICAgU2VhcmNoU2VydmljZSxcbiAgICBWYWx1ZVxufSBmcm9tICdAa25vcmEvY29yZSc7XG5cbmRlY2xhcmUgbGV0IHJlcXVpcmU6IGFueTsgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8zNDczMDAxMC9hbmd1bGFyMi01LW1pbnV0ZS1pbnN0YWxsLWJ1Zy1yZXF1aXJlLWlzLW5vdC1kZWZpbmVkXG5jb25zdCBqc29ubGQgPSByZXF1aXJlKCdqc29ubGQnKTtcblxuLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNDU2NjEwMTAvZHluYW1pYy1uZXN0ZWQtcmVhY3RpdmUtZm9ybS1leHByZXNzaW9uY2hhbmdlZGFmdGVyaXRoYXNiZWVuY2hlY2tlZGVycm9yXG5jb25zdCByZXNvbHZlZFByb21pc2UgPSBQcm9taXNlLnJlc29sdmUobnVsbCk7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnbGluay12YWx1ZScsXG4gICAgdGVtcGxhdGU6IGA8bWF0LWZvcm0tZmllbGQ+XG4gICAgPGlucHV0IG1hdElucHV0IHBsYWNlaG9sZGVyPVwicmVzb3VyY2VcIiBhcmlhLWxhYmVsPVwicmVzb3VyY2VcIiBbbWF0QXV0b2NvbXBsZXRlXT1cImF1dG9cIiBbZm9ybUNvbnRyb2xdPVwiZm9ybS5jb250cm9sc1sncmVzb3VyY2UnXVwiPlxuICAgIDxtYXQtYXV0b2NvbXBsZXRlICNhdXRvPVwibWF0QXV0b2NvbXBsZXRlXCIgW2Rpc3BsYXlXaXRoXT1cImRpc3BsYXlSZXNvdXJjZVwiPlxuICAgICAgICA8bWF0LW9wdGlvbiAqbmdGb3I9XCJsZXQgcmVzIG9mIHJlc291cmNlc1wiIFt2YWx1ZV09XCJyZXNcIj5cbiAgICAgICAgICAgIHt7cmVzPy5sYWJlbH19XG4gICAgICAgIDwvbWF0LW9wdGlvbj5cbiAgICA8L21hdC1hdXRvY29tcGxldGU+XG48L21hdC1mb3JtLWZpZWxkPlxuYCxcbiAgICBzdHlsZXM6IFtgYF1cbn0pXG5leHBvcnQgY2xhc3MgTGlua1ZhbHVlQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3ksIFByb3BlcnR5VmFsdWUge1xuXG4gICAgLy8gcGFyZW50IEZvcm1Hcm91cFxuICAgIEBJbnB1dCgpIGZvcm1Hcm91cDogRm9ybUdyb3VwO1xuXG4gICAgdHlwZSA9IEtub3JhQ29uc3RhbnRzLkxpbmtWYWx1ZTtcblxuICAgIGZvcm06IEZvcm1Hcm91cDtcblxuICAgIHJlc291cmNlczogUmVhZFJlc291cmNlW107XG5cbiAgICBwcml2YXRlIF9yZXN0cmljdFRvUmVzb3VyY2VDbGFzczogc3RyaW5nO1xuXG4gICAgQElucHV0KClcbiAgICBzZXQgcmVzdHJpY3RSZXNvdXJjZUNsYXNzKHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5fcmVzdHJpY3RUb1Jlc291cmNlQ2xhc3MgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBnZXQgcmVzdHJpY3RSZXNvdXJjZUNsYXNzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcmVzdHJpY3RUb1Jlc291cmNlQ2xhc3M7XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IoQEluamVjdChGb3JtQnVpbGRlcikgcHJpdmF0ZSBmYjogRm9ybUJ1aWxkZXIsIHByaXZhdGUgX3NlYXJjaFNlcnZpY2U6IFNlYXJjaFNlcnZpY2UsIHByaXZhdGUgX2NhY2hlU2VydmljZTogT250b2xvZ3lDYWNoZVNlcnZpY2UpIHtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERpc3BsYXlzIGEgc2VsZWN0ZWQgcmVzb3VyY2UgdXNpbmcgaXRzIGxhYmVsLlxuICAgICAqXG4gICAgICogQHBhcmFtIHJlc291cmNlIHRoZSByZXNvdXJjZSB0byBiZSBkaXNwbGF5ZWQgKG9yIG5vIHNlbGVjdGlvbiB5ZXQpLlxuICAgICAqIEByZXR1cm5zXG4gICAgICovXG4gICAgZGlzcGxheVJlc291cmNlKHJlc291cmNlOiBSZWFkUmVzb3VyY2UgfCBudWxsKSB7XG5cbiAgICAgICAgLy8gbnVsbCBpcyB0aGUgaW5pdGlhbCB2YWx1ZSAobm8gc2VsZWN0aW9uIHlldClcbiAgICAgICAgaWYgKHJlc291cmNlICE9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzb3VyY2UubGFiZWw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZWFyY2ggZm9yIHJlc291cmNlcyB3aG9zZSBsYWJlbHMgY29udGFpbiB0aGUgZ2l2ZW4gc2VhcmNoIHRlcm0sIHJlc3RyaWN0aW5nIHRvIHRvIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG9iamVjdCBjb25zdHJhaW50LlxuICAgICAqXG4gICAgICogQHBhcmFtIHNlYXJjaFRlcm1cbiAgICAgKi9cbiAgICBzZWFyY2hCeUxhYmVsKHNlYXJjaFRlcm06IHN0cmluZykge1xuXG4gICAgICAgIC8vIGF0IGxlYXN0IDMgY2hhcmFjdGVycyBhcmUgcmVxdWlyZWRcbiAgICAgICAgaWYgKHNlYXJjaFRlcm0ubGVuZ3RoID49IDMpIHtcblxuICAgICAgICAgICAgdGhpcy5fc2VhcmNoU2VydmljZS5zZWFyY2hCeUxhYmVsUmVhZFJlc291cmNlU2VxdWVuY2Uoc2VhcmNoVGVybSwgdGhpcy5fcmVzdHJpY3RUb1Jlc291cmNlQ2xhc3MpLnN1YnNjcmliZShcbiAgICAgICAgICAgICAgICAocmVzdWx0OiBSZWFkUmVzb3VyY2VzU2VxdWVuY2UpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNvdXJjZXMgPSByZXN1bHQucmVzb3VyY2VzO1xuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0pTT05MRCBvZiBmdWxsIHJlc291cmNlIHJlcXVlc3QgY291bGQgbm90IGJlIGV4cGFuZGVkOicgKyBlcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBjbGVhciBzZWxlY3Rpb25cbiAgICAgICAgICAgIHRoaXMucmVzb3VyY2VzID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgdGhhdCB0aGUgc2VsZWN0aW9uIGlzIGEgW1tSZWFkUmVzb3VyY2VdXS5cbiAgICAgKlxuICAgICAqIFN1cnByaXNpbmdseSwgW251bGxdIGhhcyB0byBiZSByZXR1cm5lZCBpZiB0aGUgdmFsdWUgaXMgdmFsaWQ6IGh0dHBzOi8vYW5ndWxhci5pby9ndWlkZS9mb3JtLXZhbGlkYXRpb24jY3VzdG9tLXZhbGlkYXRvcnNcbiAgICAgKlxuICAgICAqIEBwYXJhbSB0aGUgZm9ybSBlbGVtZW50IHdob3NlIHZhbHVlIGhhcyB0byBiZSBjaGVja2VkLlxuICAgICAqIEByZXR1cm5zXG4gICAgICovXG4gICAgdmFsaWRhdGVSZXNvdXJjZShjOiBGb3JtQ29udHJvbCkge1xuXG4gICAgICAgIGNvbnN0IGlzVmFsaWRSZXNvdXJjZSA9IChjLnZhbHVlIGluc3RhbmNlb2YgUmVhZFJlc291cmNlKTtcblxuICAgICAgICBpZiAoaXNWYWxpZFJlc291cmNlKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgbm9SZXNvdXJjZToge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogYy52YWx1ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIG5nT25Jbml0KCkge1xuICAgICAgICB0aGlzLmZvcm0gPSB0aGlzLmZiLmdyb3VwKHtcbiAgICAgICAgICAgIHJlc291cmNlOiBbbnVsbCwgVmFsaWRhdG9ycy5jb21wb3NlKFtcbiAgICAgICAgICAgICAgICBWYWxpZGF0b3JzLnJlcXVpcmVkLFxuICAgICAgICAgICAgICAgIHRoaXMudmFsaWRhdGVSZXNvdXJjZVxuICAgICAgICAgICAgXSldXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuZm9ybS52YWx1ZUNoYW5nZXMuc3Vic2NyaWJlKChkYXRhKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNlYXJjaEJ5TGFiZWwoZGF0YS5yZXNvdXJjZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJlc29sdmVkUHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIC8vIGFkZCBmb3JtIHRvIHRoZSBwYXJlbnQgZm9ybSBncm91cFxuICAgICAgICAgICAgdGhpcy5mb3JtR3JvdXAuYWRkQ29udHJvbCgncHJvcFZhbHVlJywgdGhpcy5mb3JtKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG5cbiAgICAgICAgLy8gcmVtb3ZlIGZvcm0gZnJvbSB0aGUgcGFyZW50IGZvcm0gZ3JvdXBcbiAgICAgICAgcmVzb2x2ZWRQcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5mb3JtR3JvdXAucmVtb3ZlQ29udHJvbCgncHJvcFZhbHVlJyk7XG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgZ2V0VmFsdWUoKTogVmFsdWUge1xuXG4gICAgICAgIHJldHVybiBuZXcgSVJJKHRoaXMuZm9ybS52YWx1ZS5yZXNvdXJjZS5pZCk7XG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIEluamVjdCwgSW5wdXQsIE9uRGVzdHJveSwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IEZvcm1CdWlsZGVyLCBGb3JtR3JvdXAsIFZhbGlkYXRvcnMgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBLbm9yYUNvbnN0YW50cywgUHJvcGVydHlWYWx1ZSwgVmFsdWUsIFZhbHVlTGl0ZXJhbCB9IGZyb20gJ0Brbm9yYS9jb3JlJztcblxuLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNDU2NjEwMTAvZHluYW1pYy1uZXN0ZWQtcmVhY3RpdmUtZm9ybS1leHByZXNzaW9uY2hhbmdlZGFmdGVyaXRoYXNiZWVuY2hlY2tlZGVycm9yXG5jb25zdCByZXNvbHZlZFByb21pc2UgPSBQcm9taXNlLnJlc29sdmUobnVsbCk7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAndGV4dC12YWx1ZScsXG4gICAgdGVtcGxhdGU6IGA8bWF0LWZvcm0tZmllbGQ+XG4gICAgPGlucHV0IG1hdElucHV0IFtmb3JtQ29udHJvbF09XCJmb3JtLmNvbnRyb2xzWyd0ZXh0VmFsdWUnXVwiIHBsYWNlaG9sZGVyPVwidGV4dCB2YWx1ZVwiIHZhbHVlPVwiXCI+XG48L21hdC1mb3JtLWZpZWxkPlxuYCxcbiAgICBzdHlsZXM6IFtgYF1cbn0pXG5leHBvcnQgY2xhc3MgVGV4dFZhbHVlQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3ksIFByb3BlcnR5VmFsdWUge1xuXG4gICAgLy8gcGFyZW50IEZvcm1Hcm91cFxuICAgIEBJbnB1dCgpIGZvcm1Hcm91cDogRm9ybUdyb3VwO1xuXG4gICAgdHlwZSA9IEtub3JhQ29uc3RhbnRzLlRleHRWYWx1ZTtcblxuICAgIGZvcm06IEZvcm1Hcm91cDtcblxuICAgIGNvbnN0cnVjdG9yKEBJbmplY3QoRm9ybUJ1aWxkZXIpIHByaXZhdGUgZmI6IEZvcm1CdWlsZGVyKSB7XG5cbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHtcblxuICAgICAgICB0aGlzLmZvcm0gPSB0aGlzLmZiLmdyb3VwKHtcbiAgICAgICAgICAgIHRleHRWYWx1ZTogW251bGwsIFZhbGlkYXRvcnMucmVxdWlyZWRdXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJlc29sdmVkUHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIC8vIGFkZCBmb3JtIHRvIHRoZSBwYXJlbnQgZm9ybSBncm91cFxuICAgICAgICAgICAgdGhpcy5mb3JtR3JvdXAuYWRkQ29udHJvbCgncHJvcFZhbHVlJywgdGhpcy5mb3JtKTtcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcblxuICAgICAgICAvLyByZW1vdmUgZm9ybSBmcm9tIHRoZSBwYXJlbnQgZm9ybSBncm91cFxuICAgICAgICByZXNvbHZlZFByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZvcm1Hcm91cC5yZW1vdmVDb250cm9sKCdwcm9wVmFsdWUnKTtcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBnZXRWYWx1ZSgpOiBWYWx1ZSB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBWYWx1ZUxpdGVyYWwoU3RyaW5nKHRoaXMuZm9ybS52YWx1ZS50ZXh0VmFsdWUpLCBLbm9yYUNvbnN0YW50cy54c2RTdHJpbmcpO1xuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBJbmplY3QsIElucHV0LCBPbkRlc3Ryb3ksIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBGb3JtQnVpbGRlciwgRm9ybUdyb3VwLCBWYWxpZGF0b3JzIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgS25vcmFDb25zdGFudHMsIFByb3BlcnR5VmFsdWUsIFV0aWxzLCBWYWx1ZSwgVmFsdWVMaXRlcmFsIH0gZnJvbSAnQGtub3JhL2NvcmUnO1xuXG4vLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy80NTY2MTAxMC9keW5hbWljLW5lc3RlZC1yZWFjdGl2ZS1mb3JtLWV4cHJlc3Npb25jaGFuZ2VkYWZ0ZXJpdGhhc2JlZW5jaGVja2VkZXJyb3JcbmNvbnN0IHJlc29sdmVkUHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZShudWxsKTtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICd1cmktdmFsdWUnLFxuICAgIHRlbXBsYXRlOiBgPG1hdC1mb3JtLWZpZWxkPlxuICAgIDxpbnB1dCBtYXRJbnB1dCBbZm9ybUNvbnRyb2xdPVwiZm9ybS5jb250cm9sc1sndXJpVmFsdWUnXVwiIHBsYWNlaG9sZGVyPVwiVVJJXCIgdmFsdWU9XCJcIj5cbjwvbWF0LWZvcm0tZmllbGQ+XG5gLFxuICAgIHN0eWxlczogW2BgXVxufSlcbmV4cG9ydCBjbGFzcyBVcmlWYWx1ZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95LCBQcm9wZXJ0eVZhbHVlIHtcblxuICAgIC8vIHBhcmVudCBGb3JtR3JvdXBcbiAgICBASW5wdXQoKSBmb3JtR3JvdXA6IEZvcm1Hcm91cDtcblxuICAgIHR5cGUgPSBLbm9yYUNvbnN0YW50cy5VcmlWYWx1ZTtcblxuICAgIGZvcm06IEZvcm1Hcm91cDtcblxuICAgIGNvbnN0cnVjdG9yKEBJbmplY3QoRm9ybUJ1aWxkZXIpIHByaXZhdGUgZmI6IEZvcm1CdWlsZGVyKSB7XG5cbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHtcblxuICAgICAgICB0aGlzLmZvcm0gPSB0aGlzLmZiLmdyb3VwKHtcbiAgICAgICAgICAgIHVyaVZhbHVlOiBbbnVsbCwgVmFsaWRhdG9ycy5jb21wb3NlKFtWYWxpZGF0b3JzLnJlcXVpcmVkLCBWYWxpZGF0b3JzLnBhdHRlcm4oVXRpbHMuUmVnZXhVcmwpXSldXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJlc29sdmVkUHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIC8vIGFkZCBmb3JtIHRvIHRoZSBwYXJlbnQgZm9ybSBncm91cFxuICAgICAgICAgICAgdGhpcy5mb3JtR3JvdXAuYWRkQ29udHJvbCgncHJvcFZhbHVlJywgdGhpcy5mb3JtKTtcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcblxuICAgICAgICAvLyByZW1vdmUgZm9ybSBmcm9tIHRoZSBwYXJlbnQgZm9ybSBncm91cFxuICAgICAgICByZXNvbHZlZFByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZvcm1Hcm91cC5yZW1vdmVDb250cm9sKCdwcm9wVmFsdWUnKTtcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBnZXRWYWx1ZSgpOiBWYWx1ZSB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBWYWx1ZUxpdGVyYWwoU3RyaW5nKHRoaXMuZm9ybS52YWx1ZS51cmlWYWx1ZSksIEtub3JhQ29uc3RhbnRzLnhzZFVyaSk7XG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IEJyb3dzZXJBbmltYXRpb25zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcbmltcG9ydCB7XG4gICAgTWF0QXV0b2NvbXBsZXRlTW9kdWxlLFxuICAgIE1hdEJ1dHRvbk1vZHVsZSxcbiAgICBNYXRDaGVja2JveE1vZHVsZSxcbiAgICBNYXREYXRlcGlja2VyTW9kdWxlLFxuICAgIE1hdEZvcm1GaWVsZE1vZHVsZSxcbiAgICBNYXRJY29uTW9kdWxlLCBNYXRJbnB1dE1vZHVsZSxcbiAgICBNYXRMaXN0TW9kdWxlLFxuICAgIE1hdFNlbGVjdE1vZHVsZSxcbiAgICBNYXRUb29sdGlwTW9kdWxlXG59IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsJztcblxuaW1wb3J0IHsgRm9ybXNNb2R1bGUsIFJlYWN0aXZlRm9ybXNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBLdWlDb3JlTW9kdWxlIH0gZnJvbSAnQGtub3JhL2NvcmUnO1xuaW1wb3J0IHsgS3VpQWN0aW9uTW9kdWxlIH0gZnJvbSAnQGtub3JhL2FjdGlvbic7XG5pbXBvcnQgeyBLdWlWaWV3ZXJNb2R1bGUgfSBmcm9tICdAa25vcmEvdmlld2VyJztcblxuaW1wb3J0IHsgTWF0SkROQ29udmVydGlibGVDYWxlbmRhckRhdGVBZGFwdGVyTW9kdWxlIH0gZnJvbSAnamRuY29udmVydGlibGVjYWxlbmRhcmRhdGVhZGFwdGVyJztcblxuaW1wb3J0IHsgU2VhcmNoQ29tcG9uZW50IH0gZnJvbSAnLi9zZWFyY2guY29tcG9uZW50JztcbmltcG9ydCB7IEZ1bGx0ZXh0U2VhcmNoQ29tcG9uZW50IH0gZnJvbSAnLi9mdWxsdGV4dC1zZWFyY2gvZnVsbHRleHQtc2VhcmNoLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBTZWFyY2hQYW5lbENvbXBvbmVudCB9IGZyb20gJy4vc2VhcmNoLXBhbmVsL3NlYXJjaC1wYW5lbC5jb21wb25lbnQnO1xuaW1wb3J0IHsgRXh0ZW5kZWRTZWFyY2hDb21wb25lbnQgfSBmcm9tICcuL2V4dGVuZGVkLXNlYXJjaC9leHRlbmRlZC1zZWFyY2guY29tcG9uZW50JztcblxuaW1wb3J0IHsgU2VsZWN0T250b2xvZ3lDb21wb25lbnQgfSBmcm9tICcuL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3Qtb250b2xvZ3kvc2VsZWN0LW9udG9sb2d5LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBTZWxlY3RSZXNvdXJjZUNsYXNzQ29tcG9uZW50IH0gZnJvbSAnLi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXJlc291cmNlLWNsYXNzL3NlbGVjdC1yZXNvdXJjZS1jbGFzcy5jb21wb25lbnQnO1xuaW1wb3J0IHsgU2VsZWN0UHJvcGVydHlDb21wb25lbnQgfSBmcm9tICcuL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3QtcHJvcGVydHkvc2VsZWN0LXByb3BlcnR5LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBTcGVjaWZ5UHJvcGVydHlWYWx1ZUNvbXBvbmVudCB9IGZyb20gJy4vZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1wcm9wZXJ0eS9zcGVjaWZ5LXByb3BlcnR5LXZhbHVlL3NwZWNpZnktcHJvcGVydHktdmFsdWUuY29tcG9uZW50JztcbmltcG9ydCB7IEJvb2xlYW5WYWx1ZUNvbXBvbmVudCB9IGZyb20gJy4vZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1wcm9wZXJ0eS9zcGVjaWZ5LXByb3BlcnR5LXZhbHVlL2Jvb2xlYW4tdmFsdWUvYm9vbGVhbi12YWx1ZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgRGF0ZVZhbHVlQ29tcG9uZW50IH0gZnJvbSAnLi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXByb3BlcnR5L3NwZWNpZnktcHJvcGVydHktdmFsdWUvZGF0ZS12YWx1ZS9kYXRlLXZhbHVlLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBEZWNpbWFsVmFsdWVDb21wb25lbnQgfSBmcm9tICcuL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3QtcHJvcGVydHkvc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZS9kZWNpbWFsLXZhbHVlL2RlY2ltYWwtdmFsdWUuY29tcG9uZW50JztcbmltcG9ydCB7IEludGVnZXJWYWx1ZUNvbXBvbmVudCB9IGZyb20gJy4vZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1wcm9wZXJ0eS9zcGVjaWZ5LXByb3BlcnR5LXZhbHVlL2ludGVnZXItdmFsdWUvaW50ZWdlci12YWx1ZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgTGlua1ZhbHVlQ29tcG9uZW50IH0gZnJvbSAnLi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXByb3BlcnR5L3NwZWNpZnktcHJvcGVydHktdmFsdWUvbGluay12YWx1ZS9saW5rLXZhbHVlLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBUZXh0VmFsdWVDb21wb25lbnQgfSBmcm9tICcuL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3QtcHJvcGVydHkvc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZS90ZXh0LXZhbHVlL3RleHQtdmFsdWUuY29tcG9uZW50JztcbmltcG9ydCB7IFVyaVZhbHVlQ29tcG9uZW50IH0gZnJvbSAnLi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXByb3BlcnR5L3NwZWNpZnktcHJvcGVydHktdmFsdWUvdXJpLXZhbHVlL3VyaS12YWx1ZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgSGVhZGVyQ29tcG9uZW50IH0gZnJvbSAnLi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXByb3BlcnR5L3NwZWNpZnktcHJvcGVydHktdmFsdWUvZGF0ZS12YWx1ZS9oZWFkZXItY2FsZW5kYXIvaGVhZGVyLWNhbGVuZGFyLmNvbXBvbmVudCc7XG5cblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbXG4gICAgICAgIENvbW1vbk1vZHVsZSxcbiAgICAgICAgQnJvd3NlckFuaW1hdGlvbnNNb2R1bGUsXG4gICAgICAgIE1hdEF1dG9jb21wbGV0ZU1vZHVsZSxcbiAgICAgICAgTWF0QnV0dG9uTW9kdWxlLFxuICAgICAgICBNYXRDaGVja2JveE1vZHVsZSxcbiAgICAgICAgTWF0RGF0ZXBpY2tlck1vZHVsZSxcbiAgICAgICAgTWF0Rm9ybUZpZWxkTW9kdWxlLFxuICAgICAgICBNYXRJbnB1dE1vZHVsZSxcbiAgICAgICAgTWF0SWNvbk1vZHVsZSxcbiAgICAgICAgTWF0TGlzdE1vZHVsZSxcbiAgICAgICAgTWF0U2VsZWN0TW9kdWxlLFxuICAgICAgICBNYXRUb29sdGlwTW9kdWxlLFxuICAgICAgICBGb3Jtc01vZHVsZSxcbiAgICAgICAgUmVhY3RpdmVGb3Jtc01vZHVsZSxcbiAgICAgICAgS3VpQ29yZU1vZHVsZSxcbiAgICAgICAgS3VpQWN0aW9uTW9kdWxlLFxuICAgICAgICBLdWlWaWV3ZXJNb2R1bGUsXG4gICAgICAgIE1hdEpETkNvbnZlcnRpYmxlQ2FsZW5kYXJEYXRlQWRhcHRlck1vZHVsZVxuICAgIF0sXG4gICAgZGVjbGFyYXRpb25zOiBbXG4gICAgICAgIFNlYXJjaENvbXBvbmVudCxcbiAgICAgICAgU2VsZWN0T250b2xvZ3lDb21wb25lbnQsXG4gICAgICAgIEV4dGVuZGVkU2VhcmNoQ29tcG9uZW50LFxuICAgICAgICBTZWxlY3RSZXNvdXJjZUNsYXNzQ29tcG9uZW50LFxuICAgICAgICBTZWxlY3RQcm9wZXJ0eUNvbXBvbmVudCxcbiAgICAgICAgU3BlY2lmeVByb3BlcnR5VmFsdWVDb21wb25lbnQsXG4gICAgICAgIEJvb2xlYW5WYWx1ZUNvbXBvbmVudCxcbiAgICAgICAgRGF0ZVZhbHVlQ29tcG9uZW50LFxuICAgICAgICBEZWNpbWFsVmFsdWVDb21wb25lbnQsXG4gICAgICAgIEludGVnZXJWYWx1ZUNvbXBvbmVudCxcbiAgICAgICAgTGlua1ZhbHVlQ29tcG9uZW50LFxuICAgICAgICBUZXh0VmFsdWVDb21wb25lbnQsXG4gICAgICAgIFVyaVZhbHVlQ29tcG9uZW50LFxuICAgICAgICBIZWFkZXJDb21wb25lbnQsXG4gICAgICAgIEZ1bGx0ZXh0U2VhcmNoQ29tcG9uZW50LFxuICAgICAgICBTZWFyY2hQYW5lbENvbXBvbmVudFxuICAgIF0sXG4gICAgZXhwb3J0czogW1xuICAgICAgICBTZWFyY2hDb21wb25lbnQsXG4gICAgICAgIFNlYXJjaFBhbmVsQ29tcG9uZW50LFxuICAgICAgICBGdWxsdGV4dFNlYXJjaENvbXBvbmVudCxcbiAgICAgICAgRXh0ZW5kZWRTZWFyY2hDb21wb25lbnQsXG4gICAgICAgIERhdGVWYWx1ZUNvbXBvbmVudFxuICAgIF0sXG4gICAgZW50cnlDb21wb25lbnRzOiBbXG4gICAgICAgIEhlYWRlckNvbXBvbmVudFxuICAgIF1cbn0pXG5leHBvcnQgY2xhc3MgS3VpU2VhcmNoTW9kdWxlIHtcbn1cbiIsIi8qXG4gKiBQdWJsaWMgQVBJIFN1cmZhY2Ugb2Ygc2VhcmNoXG4gKi9cblxuZXhwb3J0ICogZnJvbSAnLi9saWIvc2VhcmNoLmNvbXBvbmVudCc7XG5leHBvcnQgKiBmcm9tICcuL2xpYi9zZWFyY2gtcGFuZWwvc2VhcmNoLXBhbmVsLmNvbXBvbmVudCc7XG5leHBvcnQgKiBmcm9tICcuL2xpYi9mdWxsdGV4dC1zZWFyY2gvZnVsbHRleHQtc2VhcmNoLmNvbXBvbmVudCc7XG5cbmV4cG9ydCAqIGZyb20gJy4vbGliL2V4dGVuZGVkLXNlYXJjaC9leHRlbmRlZC1zZWFyY2guY29tcG9uZW50JztcbmV4cG9ydCAqIGZyb20gJy4vbGliL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3Qtb250b2xvZ3kvc2VsZWN0LW9udG9sb2d5LmNvbXBvbmVudCc7XG5leHBvcnQgKiBmcm9tICcuL2xpYi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXByb3BlcnR5L3NlbGVjdC1wcm9wZXJ0eS5jb21wb25lbnQnO1xuZXhwb3J0ICogZnJvbSAnLi9saWIvZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1wcm9wZXJ0eS9zcGVjaWZ5LXByb3BlcnR5LXZhbHVlL3NwZWNpZnktcHJvcGVydHktdmFsdWUuY29tcG9uZW50JztcbmV4cG9ydCAqIGZyb20gJy4vbGliL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3QtcHJvcGVydHkvc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZS9ib29sZWFuLXZhbHVlL2Jvb2xlYW4tdmFsdWUuY29tcG9uZW50JztcbmV4cG9ydCAqIGZyb20gJy4vbGliL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3QtcHJvcGVydHkvc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZS9kYXRlLXZhbHVlL2RhdGUtdmFsdWUuY29tcG9uZW50JztcbmV4cG9ydCAqIGZyb20gJy4vbGliL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3QtcHJvcGVydHkvc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZS9kYXRlLXZhbHVlL2hlYWRlci1jYWxlbmRhci9oZWFkZXItY2FsZW5kYXIuY29tcG9uZW50JztcbmV4cG9ydCAqIGZyb20gJy4vbGliL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3QtcHJvcGVydHkvc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZS9kZWNpbWFsLXZhbHVlL2RlY2ltYWwtdmFsdWUuY29tcG9uZW50JztcbmV4cG9ydCAqIGZyb20gJy4vbGliL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3QtcHJvcGVydHkvc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZS9pbnRlZ2VyLXZhbHVlL2ludGVnZXItdmFsdWUuY29tcG9uZW50JztcbmV4cG9ydCAqIGZyb20gJy4vbGliL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3QtcHJvcGVydHkvc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZS9saW5rLXZhbHVlL2xpbmstdmFsdWUuY29tcG9uZW50JztcbmV4cG9ydCAqIGZyb20gJy4vbGliL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3QtcHJvcGVydHkvc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZS90ZXh0LXZhbHVlL3RleHQtdmFsdWUuY29tcG9uZW50JztcbmV4cG9ydCAqIGZyb20gJy4vbGliL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3QtcHJvcGVydHkvc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZS91cmktdmFsdWUvdXJpLXZhbHVlLmNvbXBvbmVudCc7XG5leHBvcnQgKiBmcm9tICcuL2xpYi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXJlc291cmNlLWNsYXNzL3NlbGVjdC1yZXNvdXJjZS1jbGFzcy5jb21wb25lbnQnO1xuXG5leHBvcnQgKiBmcm9tICcuL2xpYi9zZWFyY2gubW9kdWxlJztcbiIsIi8qKlxuICogR2VuZXJhdGVkIGJ1bmRsZSBpbmRleC4gRG8gbm90IGVkaXQuXG4gKi9cblxuZXhwb3J0ICogZnJvbSAnLi9wdWJsaWNfYXBpJztcbiJdLCJuYW1lcyI6WyJyZXNvbHZlZFByb21pc2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUE2RkE7OztBQUdBO0lBaUJJLFlBQW9CLE1BQXNCLEVBQzlCLE9BQWUs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