import { Component, ElementRef, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
/**
 * Contains methods to realise, reset new or previous simple searches.
 */
export class SearchComponent {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VhcmNoLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Brbm9yYS9zZWFyY2gvIiwic291cmNlcyI6WyJsaWIvc2VhcmNoLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQVUsTUFBTSxlQUFlLENBQUM7QUFDckUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUN6RCxPQUFPLEVBQ0gsT0FBTyxFQUNQLEtBQUssRUFDTCxLQUFLLEVBQ0wsVUFBVSxFQUNWLE9BQU8sRUFDVixNQUFNLHFCQUFxQixDQUFDO0FBcUY3Qjs7R0FFRztBQUNILE1BQU07SUFpQkYsWUFBb0IsTUFBc0IsRUFDOUIsT0FBZSxFQUNmLE9BQW1CO1FBRlgsV0FBTSxHQUFOLE1BQU0sQ0FBZ0I7UUFDOUIsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUNmLFlBQU8sR0FBUCxPQUFPLENBQVk7UUFqQnRCLFVBQUssR0FBVyxTQUFTLENBQUM7UUFJbkMscUJBQWdCLEdBQVksS0FBSyxDQUFDO1FBRWxDLGVBQVUsR0FBYSxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztRQUV0RSxrQkFBYSxHQUFXLFVBQVUsQ0FBQztRQUNuQyxvQkFBZSxHQUFXLFVBQVUsQ0FBQztRQUVyQyxnQkFBVyxHQUFXLFFBQVEsQ0FBQztRQUUvQixxQkFBZ0IsR0FBWSxJQUFJLENBQUM7SUFNakMsQ0FBQztJQUVELFFBQVE7SUFDUixDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0gsS0FBSyxDQUFDLFVBQXVCLEVBQUUsS0FBSztRQUNoQyxJQUFJLENBQUMsYUFBYSxHQUFHLFFBQVEsQ0FBQztRQUM5QixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENB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O3dCQUN4RCxVQUFVLENBQUMsa0JBQWtCLEVBQUUsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7cUJBQzVELENBQ0o7aUJBQ0o7YUFDSjs7O1lBMUZRLGNBQWM7WUFBRSxNQUFNO1lBRFgsVUFBVTs7O29CQWtHekIsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRWxlbWVudFJlZiwgSW5wdXQsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWN0aXZhdGVkUm91dGUsIFJvdXRlciB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQge1xuICAgIGFuaW1hdGUsXG4gICAgc3RhdGUsXG4gICAgc3R5bGUsXG4gICAgdHJhbnNpdGlvbixcbiAgICB0cmlnZ2VyXG59IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ2t1aS1zZWFyY2gnLFxuICAgIHRlbXBsYXRlOiBgPGRpdiBjbGFzcz1cInNlYXJjaC1iYXItZWxlbWVudHNcIj5cblxuICAgIDwhLS0gdGhlIG5leHQgZWxlbWVudCAtIGRpdi5leHRlbmRlZC1zZWFyY2gtcGFuZWwgLSBpcyBhIGhpZGRlbiBkcm9wZG93biBmaWx0ZXIgbWVudSAtLT5cblxuICAgIDxkaXYgY2xhc3M9XCJzZWFyY2gtcGFuZWxcIiBbY2xhc3MuYWN0aXZlXT1cInNlYXJjaFBhbmVsRm9jdXNcIj5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJwcmVmaXhcIiAoY2xpY2spPVwiZG9TZWFyY2goc2VhcmNoKVwiPlxuICAgICAgICAgICAgICAgIDxtYXQtaWNvbj5zZWFyY2g8L21hdC1pY29uPlxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1maWVsZFwiPlxuICAgICAgICAgICAgPGlucHV0ICNzZWFyY2ggYXV0b2NvbXBsZXRlPVwib2ZmXCIgdHlwZT1cInNlYXJjaFwiIFtwbGFjZWhvbGRlcl09XCJzZWFyY2hMYWJlbFwiIFsobmdNb2RlbCldPVwic2VhcmNoUXVlcnlcIiBuYW1lPVwic2VhcmNoXCIgKGtleXVwLmVzYyk9XCJyZXNldFNlYXJjaChzZWFyY2gpXCIgKGtleXVwKT1cIm9uS2V5KHNlYXJjaCwgJGV2ZW50KVwiIChjbGljayk9XCJzZXRGb2N1cygpXCIgKGZvY3VzKT1cInRvZ2dsZU1lbnUoJ3NpbXBsZVNlYXJjaCcpXCIgW2Rpc2FibGVkXT1cImZvY3VzT25FeHRlbmRlZCA9PT0gJ2FjdGl2ZSdcIiAvPlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8IS0tIHN3aXRjaCBidXR0b246IG9uIHNvbWUgZm9jdXMgd2UgbmVlZCBhIGNsb3NlIGJ1dHRvbiBmb3IgdGhlIHNpbXBsZSBvciBleHRlbmRlZCBwYW5lbCAtLT5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJzdWZmaXhcIiAqbmdJZj1cImZvY3VzT25TaW1wbGUgPT09ICdhY3RpdmUnXCIgKGNsaWNrKT1cInJlc2V0U2VhcmNoKHNlYXJjaClcIj5cbiAgICAgICAgICAgICAgICA8bWF0LWljb24+Y2xvc2U8L21hdC1pY29uPlxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwic3VmZml4XCIgKm5nSWY9XCJmb2N1c09uU2ltcGxlID09PSAnaW5hY3RpdmUnXCI+XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPCEtLSB0aGUgc2VhcmNoIHBhbmVsIGhhcyB0d28gXCJkcm9wZG93blwiIG1lbnVzOiBvbmUgZm9yIHNpbXBsZSBzZWFyY2ggYW5kIGFub3RoZXIgb25lIGZvciB0aGUgZXh0ZW5kZWQgc2VhcmNoIC0tPlxuICAgICAgICA8ZGl2IGNsYXNzPVwia3VpLW1lbnUgc2ltcGxlLXNlYXJjaFwiIFtAc2ltcGxlU2VhcmNoTWVudV09XCJmb2N1c09uU2ltcGxlXCIgKm5nSWY9XCJzaG93U2ltcGxlU2VhcmNoXCI+XG4gICAgICAgICAgICA8bWF0LWxpc3QgY2xhc3M9XCJrdWktcHJldmlvdXMtc2VhcmNoLWxpc3RcIj5cbiAgICAgICAgICAgICAgICA8bWF0LWxpc3QtaXRlbSAqbmdGb3I9XCJsZXQgaXRlbSBvZiBwcmV2U2VhcmNoIHwga3VpUmV2ZXJzZTsgbGV0IGk9aW5kZXhcIj5cbiAgICAgICAgICAgICAgICAgICAgPGg0IG1hdC1saW5lICpuZ0lmPVwiaTwxMFwiIChjbGljayk9XCJkb1ByZXZTZWFyY2goaXRlbSlcIj57e2l0ZW19fTwvaDQ+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gbWF0LWljb24tYnV0dG9uIChjbGljayk9XCJyZXNldFByZXZTZWFyY2goaXRlbSlcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxtYXQtaWNvbiBhcmlhLWxhYmVsPVwiY2xvc2VcIj5jbG9zZTwvbWF0LWljb24+XG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvbWF0LWxpc3QtaXRlbT5cbiAgICAgICAgICAgIDwvbWF0LWxpc3Q+XG4gICAgICAgICAgICA8YnV0dG9uIG1hdC1zdHJva2VkLWJ1dHRvbiBjb2xvcj1cImFjY2VudFwiIGNsYXNzPVwicmlnaHRcIiAoY2xpY2spPVwicmVzZXRQcmV2U2VhcmNoKClcIiAqbmdJZj1cInByZXZTZWFyY2hcIj5DbGVhcjwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8ZGl2IGNsYXNzPVwia3VpLW1lbnUgZXh0ZW5kZWQtc2VhcmNoXCIgW0BleHRlbmRlZFNlYXJjaE1lbnVdPVwiZm9jdXNPbkV4dGVuZGVkXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwia3VpLW1lbnUtaGVhZGVyXCI+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJrdWktbWVudS10aXRsZVwiPlxuICAgICAgICAgICAgICAgICAgICA8aDQ+QWR2YW5jZWQgc2VhcmNoPC9oND5cbiAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJrdWktbWVudS1hY3Rpb25cIj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBtYXQtaWNvbi1idXR0b24gKGNsaWNrKT1cInRvZ2dsZU1lbnUoJ2V4dGVuZGVkU2VhcmNoJylcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxtYXQtaWNvbj5jbG9zZTwvbWF0LWljb24+XG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImV4dGVuZGVkLXNlYXJjaC1ib3hcIj5cbiAgICAgICAgICAgICAgICA8a3VpLWV4dGVuZGVkLXNlYXJjaCBbcm91dGVdPVwicm91dGVcIiAodG9nZ2xlRXh0ZW5kZWRTZWFyY2hGb3JtKT1cInRvZ2dsZU1lbnUoJ2V4dGVuZGVkU2VhcmNoJylcIj48L2t1aS1leHRlbmRlZC1zZWFyY2g+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG5cbiAgICA8IS0tIEV4dGVuZGVkIHNlYXJjaCBidXR0b24gdG8gZGlzcGxheSB0aGUgZXh0ZW5kZWQgc2VhcmNoIGZvcm0gaW4gdGhlIHNlYXJjaCBwYW5lbCAtLT5cbiAgICA8YnV0dG9uIG1hdC1idXR0b24gdHlwZT1cImJ1dHRvblwiIGNvbG9yPVwicHJpbWFyeVwiIGNsYXNzPVwiYWR2YW5jZWQtc2VhcmNoLWJ1dHRvblwiIChjbGljayk9XCJ0b2dnbGVNZW51KCdleHRlbmRlZFNlYXJjaCcpXCI+XG4gICAgICAgIGFkdmFuY2VkXG4gICAgPC9idXR0b24+XG5cbjwvZGl2PmAsXG4gICAgc3R5bGVzOiBbYGlucHV0W3R5cGU9c2VhcmNoXTo6LXdlYmtpdC1zZWFyY2gtY2FuY2VsLWJ1dHRvbixpbnB1dFt0eXBlPXNlYXJjaF06Oi13ZWJraXQtc2VhcmNoLWRlY29yYXRpb24saW5wdXRbdHlwZT1zZWFyY2hdOjotd2Via2l0LXNlYXJjaC1yZXN1bHRzLWJ1dHRvbixpbnB1dFt0eXBlPXNlYXJjaF06Oi13ZWJraXQtc2VhcmNoLXJlc3VsdHMtZGVjb3JhdGlvbntkaXNwbGF5Om5vbmV9aW5wdXRbdHlwZT1zZWFyY2hdey1tb3otYXBwZWFyYW5jZTpub25lOy13ZWJraXQtYXBwZWFyYW5jZTpub25lfS5jZW50ZXJ7ZGlzcGxheTpibG9jazttYXJnaW4tbGVmdDphdXRvO21hcmdpbi1yaWdodDphdXRvfS5jbG9zZXtyaWdodDoxMnB4fS5leHRlbmRlZC1zZWFyY2gtYm94e21hcmdpbjoxMnB4fS5hZHZhbmNlZC1zZWFyY2gtYnV0dG9ue21hcmdpbi1sZWZ0OjEwcHh9LmZ1bGwtd2lkdGh7d2lkdGg6MTAwJX0uaGlkZXtkaXNwbGF5Om5vbmV9LmluYWN0aXZlLC5tdXRle2NvbG9yOiM3YTdhN2F9LnNlYXJjaC1wYW5lbHtiYWNrZ3JvdW5kLWNvbG9yOiNmOWY5Zjk7Ym9yZGVyLXJhZGl1czo0cHg7ZGlzcGxheTppbmxpbmUtZmxleDtoZWlnaHQ6NDBweDtwb3NpdGlvbjpyZWxhdGl2ZTt3aWR0aDo2ODBweDt6LWluZGV4OjEwfS5zZWFyY2gtcGFuZWw6aG92ZXJ7Ym94LXNoYWRvdzowIDFweCAzcHggcmdiYSgwLDAsMCwuNSl9LnNlYXJjaC1wYW5lbCBkaXYuaW5wdXQtZmllbGR7ZmxleDoxfS5zZWFyY2gtcGFuZWwgZGl2LmlucHV0LWZpZWxkIGlucHV0e2JvcmRlci1zdHlsZTpub25lO2ZvbnQtc2l6ZToxNHB0O2hlaWdodDozOHB4O3Bvc2l0aW9uOmFic29sdXRlO3dpZHRoOmNhbGMoMTAwJSAtIDgwcHgpfS5zZWFyY2gtcGFuZWwgZGl2LmlucHV0LWZpZWxkIGlucHV0OmFjdGl2ZSwuc2VhcmNoLXBhbmVsIGRpdi5pbnB1dC1maWVsZCBpbnB1dDpmb2N1c3tvdXRsaW5lOjB9LnNlYXJjaC1wYW5lbCBkaXYgLnByZWZpeCwuc2VhcmNoLXBhbmVsIGRpdiAuc3VmZml4e2JhY2tncm91bmQtY29sb3I6I2ZmZjtib3JkZXItcmFkaXVzOjNweDtib3JkZXItc3R5bGU6bm9uZTtjb2xvcjpyZ2JhKDQxLDQxLDQxLC40KTtjdXJzb3I6cG9pbnRlcjtoZWlnaHQ6MzhweDtvdXRsaW5lOjA7cG9zaXRpb246cmVsYXRpdmU7d2lkdGg6NDBweH0uc2VhcmNoLXBhbmVsIGRpdiAucHJlZml4OmFjdGl2ZSwuc2VhcmNoLXBhbmVsIGRpdiAuc3VmZml4OmFjdGl2ZXtjb2xvcjojNTE1MTUxfS5zZWFyY2gtcGFuZWwuYWN0aXZle2JveC1zaGFkb3c6MCAxcHggM3B4IHJnYmEoMCwwLDAsLjUpfS5rdWktbWVudXtib3gtc2hhZG93OjAgM3B4IDVweCAtMXB4IHJnYmEoMTEsMTEsMTEsLjIpLDAgNnB4IDEwcHggMCByZ2JhKDExLDExLDExLC4xNCksMCAxcHggMThweCAwIHJnYmEoMTEsMTEsMTEsLjEyKTtiYWNrZ3JvdW5kLWNvbG9yOiNmOWY5Zjk7Ym9yZGVyLXJhZGl1czo0cHg7cG9zaXRpb246YWJzb2x1dGV9Lmt1aS1tZW51IC5rdWktbWVudS1oZWFkZXJ7YmFja2dyb3VuZC1jb2xvcjojZjlmOWY5O2JvcmRlci10b3AtbGVmdC1yYWRpdXM6NHB4O2JvcmRlci10b3AtcmlnaHQtcmFkaXVzOjRweDtkaXNwbGF5OmlubGluZS1ibG9jaztoZWlnaHQ6NDhweDt3aWR0aDoxMDAlfS5rdWktbWVudSAua3VpLW1lbnUtaGVhZGVyIC5rdWktbWVudS10aXRsZXtmbG9hdDpsZWZ0O2ZvbnQtc2l6ZToxNHB4O2ZvbnQtd2VpZ2h0OjQwMDttYXJnaW4tdG9wOjRweDtwYWRkaW5nOjEycHh9Lmt1aS1tZW51IC5rdWktbWVudS1oZWFkZXIgLmt1aS1tZW51LWFjdGlvbntmbG9hdDpyaWdodDttYXJnaW46NHB4fS5rdWktbWVudS5leHRlbmRlZC1zZWFyY2gsLmt1aS1tZW51LnNpbXBsZS1zZWFyY2h7bWluLWhlaWdodDo2ODBweDt3aWR0aDo2ODBweH0ua3VpLW1lbnUuc2ltcGxlLXNlYXJjaHtwYWRkaW5nLXRvcDo2MHB4O3otaW5kZXg6LTF9Lmt1aS1tZW51LnNpbXBsZS1zZWFyY2ggLmt1aS1wcmV2aW91cy1zZWFyY2gtbGlzdCAubWF0LWxpc3QtaXRlbXtjdXJzb3I6cG9pbnRlcn0ua3VpLW1lbnUuc2ltcGxlLXNlYXJjaCAua3VpLXByZXZpb3VzLXNlYXJjaC1saXN0IC5tYXQtbGlzdC1pdGVtOmhvdmVye2JhY2tncm91bmQtY29sb3I6I2Y5ZjlmOX0ua3VpLW1lbnUuc2ltcGxlLXNlYXJjaCAua3VpLXByZXZpb3VzLXNlYXJjaC1saXN0IC5tYXQtbGlzdC1pdGVtOmhvdmVyIG1hdC1pY29ue2Rpc3BsYXk6YmxvY2t9Lmt1aS1tZW51LnNpbXBsZS1zZWFyY2ggLmt1aS1wcmV2aW91cy1zZWFyY2gtbGlzdCAubWF0LWxpc3QtaXRlbSBtYXQtaWNvbntkaXNwbGF5Om5vbmV9Lmt1aS1tZW51LnNpbXBsZS1zZWFyY2ggLnJpZ2h0e21hcmdpbi10b3A6MTJweDttYXJnaW4tbGVmdDoxNnB4fS5rdWktbWVudS5leHRlbmRlZC1zZWFyY2h7ei1pbmRleDoyMH0uc2VhcmNoLWJhci1lbGVtZW50c3tkaXNwbGF5OmZsZXg7cG9zaXRpb246cmVsYXRpdmU7ei1pbmRleDoxMDB9LnNob3d7ZGlzcGxheTpibG9ja31AbWVkaWEgc2NyZWVuIGFuZCAobWF4LXdpZHRoOjEwMjRweCl7LnNlYXJjaC1wYW5lbHt3aWR0aDo0ODBweH0uc2VhcmNoLXBhbmVsIGRpdi5pbnB1dC1maWVsZCBpbnB1dHt3aWR0aDpjYWxjKDQ4MHB4IC0gODBweCl9Lmt1aS1tZW51LmV4dGVuZGVkLXNlYXJjaCwua3VpLW1lbnUuc2ltcGxlLXNlYXJjaHt3aWR0aDo0ODBweH19QG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDo3NjhweCl7LnNlYXJjaC1wYW5lbHt3aWR0aDpjYWxjKDQ4MHB4IC0gMTYwcHgpfS5zZWFyY2gtcGFuZWwgZGl2LmlucHV0LWZpZWxkIGlucHV0e3dpZHRoOmNhbGMoNDgwcHggLSAxNjBweCAtIDgwcHgpfS5rdWktbWVudS5leHRlbmRlZC1zZWFyY2gsLmt1aS1tZW51LnNpbXBsZS1zZWFyY2h7d2lkdGg6Y2FsYyg0ODBweCAtIDgwcHgpfX1gXSxcbiAgICBhbmltYXRpb25zOiBbXG4gICAgICAgIHRyaWdnZXIoJ3NpbXBsZVNlYXJjaE1lbnUnLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgIHN0YXRlKCdpbmFjdGl2ZScsIHN0eWxlKHsgZGlzcGxheTogJ25vbmUnIH0pKSxcbiAgICAgICAgICAgICAgICBzdGF0ZSgnYWN0aXZlJywgc3R5bGUoeyBkaXNwbGF5OiAnYmxvY2snIH0pKSxcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uKCdpbmFjdGl2ZSA9PiB0cnVlJywgYW5pbWF0ZSgnMTAwbXMgZWFzZS1pbicpKSxcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uKCd0cnVlID0+IGluYWN0aXZlJywgYW5pbWF0ZSgnMTAwbXMgZWFzZS1vdXQnKSlcbiAgICAgICAgICAgIF1cbiAgICAgICAgKSxcbiAgICAgICAgdHJpZ2dlcignZXh0ZW5kZWRTZWFyY2hNZW51JyxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICBzdGF0ZSgnaW5hY3RpdmUnLCBzdHlsZSh7IGRpc3BsYXk6ICdub25lJyB9KSksXG4gICAgICAgICAgICAgICAgc3RhdGUoJ2FjdGl2ZScsIHN0eWxlKHsgZGlzcGxheTogJ2Jsb2NrJyB9KSksXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbignaW5hY3RpdmUgPT4gdHJ1ZScsIGFuaW1hdGUoJzEwMG1zIGVhc2UtaW4nKSksXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbigndHJ1ZSA9PiBpbmFjdGl2ZScsIGFuaW1hdGUoJzEwMG1zIGVhc2Utb3V0JykpXG4gICAgICAgICAgICBdXG4gICAgICAgICksXG4gICAgXVxufSlcblxuLyoqXG4gKiBDb250YWlucyBtZXRob2RzIHRvIHJlYWxpc2UsIHJlc2V0IG5ldyBvciBwcmV2aW91cyBzaW1wbGUgc2VhcmNoZXMuXG4gKi9cbmV4cG9ydCBjbGFzcyBTZWFyY2hDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gICAgQElucHV0KCkgcm91dGU6IHN0cmluZyA9ICcvc2VhcmNoJztcblxuICAgIHNlYXJjaFF1ZXJ5OiBzdHJpbmc7XG5cbiAgICBzZWFyY2hQYW5lbEZvY3VzOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBwcmV2U2VhcmNoOiBzdHJpbmdbXSA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3ByZXZTZWFyY2gnKSk7XG5cbiAgICBmb2N1c09uU2ltcGxlOiBzdHJpbmcgPSAnaW5hY3RpdmUnO1xuICAgIGZvY3VzT25FeHRlbmRlZDogc3RyaW5nID0gJ2luYWN0aXZlJztcblxuICAgIHNlYXJjaExhYmVsOiBzdHJpbmcgPSAnU2VhcmNoJztcblxuICAgIHNob3dTaW1wbGVTZWFyY2g6IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBfcm91dGU6IEFjdGl2YXRlZFJvdXRlLFxuICAgICAgICBwcml2YXRlIF9yb3V0ZXI6IFJvdXRlcixcbiAgICAgICAgcHJpdmF0ZSBfZWxlUmVmOiBFbGVtZW50UmVmKSB7XG5cbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaWdub3JlXG4gICAgICogRG8gc2VhcmNoIG9uIEVudGVyIGNsaWNrLCByZXNldCBzZWFyY2ggb24gRXNjYXBlXG4gICAgICogQHBhcmFtIHNlYXJjaF9lbGVcbiAgICAgKiBAcGFyYW0gZXZlbnRcbiAgICAgKiBAcmV0dXJucyB2b2lkXG4gICAgICovXG4gICAgb25LZXkoc2VhcmNoX2VsZTogSFRNTEVsZW1lbnQsIGV2ZW50KTogdm9pZCB7XG4gICAgICAgIHRoaXMuZm9jdXNPblNpbXBsZSA9ICdhY3RpdmUnO1xuICAgICAgICB0aGlzLnByZXZTZWFyY2ggPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdwcmV2U2VhcmNoJykpO1xuICAgICAgICBpZiAodGhpcy5zZWFyY2hRdWVyeSAmJiAoZXZlbnQua2V5ID09PSAnRW50ZXInIHx8IGV2ZW50LmtleUNvZGUgPT09IDEzIHx8IGV2ZW50LndoaWNoID09PSAxMykpIHtcbiAgICAgICAgICAgIHRoaXMuZG9TZWFyY2goc2VhcmNoX2VsZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGV2ZW50LmtleSA9PT0gJ0VzY2FwZScgfHwgZXZlbnQua2V5Q29kZSA9PT0gMjcgfHwgZXZlbnQud2hpY2ggPT09IDI3KSB7XG4gICAgICAgICAgICB0aGlzLnJlc2V0U2VhcmNoKHNlYXJjaF9lbGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVhbGlzZSBhIHNpbXBsZSBzZWFyY2hcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBzZWFyY2hfZWxlXG4gICAgICogQHJldHVybnMgdm9pZFxuICAgICAqL1xuICAgIGRvU2VhcmNoKHNlYXJjaF9lbGU6IEhUTUxFbGVtZW50KTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLnNlYXJjaFF1ZXJ5ICE9PSB1bmRlZmluZWQgJiYgdGhpcy5zZWFyY2hRdWVyeSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy50b2dnbGVNZW51KCdzaW1wbGVTZWFyY2gnKTtcbiAgICAgICAgICAgIHRoaXMuX3JvdXRlci5uYXZpZ2F0ZShbdGhpcy5yb3V0ZSArICcvZnVsbHRleHQvJyArIHRoaXMuc2VhcmNoUXVlcnldKTtcblxuICAgICAgICAgICAgLy8gdGhpcy5fcm91dGVyLm5hdmlnYXRlKFsnL3NlYXJjaC9mdWxsdGV4dC8nICsgdGhpcy5zZWFyY2hRdWVyeV0sIHsgcmVsYXRpdmVUbzogdGhpcy5fcm91dGUgfSk7XG5cbiAgICAgICAgICAgIC8vIHB1c2ggdGhlIHNlYXJjaCBxdWVyeSBpbnRvIHRoZSBsb2NhbCBzdG9yYWdlIHByZXZTZWFyY2ggYXJyYXkgKHByZXZpb3VzIHNlYXJjaClcbiAgICAgICAgICAgIC8vIHRvIGhhdmUgYSBsaXN0IG9mIHJlY2VudCBzZWFyY2ggcmVxdWVzdHNcbiAgICAgICAgICAgIGxldCBleGlzdGluZ1ByZXZTZWFyY2g6IHN0cmluZ1tdID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncHJldlNlYXJjaCcpKTtcbiAgICAgICAgICAgIGlmIChleGlzdGluZ1ByZXZTZWFyY2ggPT09IG51bGwpIHsgZXhpc3RpbmdQcmV2U2VhcmNoID0gW107IH1cbiAgICAgICAgICAgIGxldCBpOiBudW1iZXIgPSAwO1xuICAgICAgICAgICAgZm9yIChjb25zdCBlbnRyeSBvZiBleGlzdGluZ1ByZXZTZWFyY2gpIHtcbiAgICAgICAgICAgICAgICAvLyByZW1vdmUgZW50cnksIGlmIGV4aXN0cyBhbHJlYWR5XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc2VhcmNoUXVlcnkgPT09IGVudHJ5KSB7IGV4aXN0aW5nUHJldlNlYXJjaC5zcGxpY2UoaSwgMSk7IH1cbiAgICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGV4aXN0aW5nUHJldlNlYXJjaC5wdXNoKHRoaXMuc2VhcmNoUXVlcnkpO1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3ByZXZTZWFyY2gnLCBKU09OLnN0cmluZ2lmeShleGlzdGluZ1ByZXZTZWFyY2gpKTtcbiAgICAgICAgICAgIC8vIFRPRE86IHNhdmUgdGhlIHByZXZpb3VzIHNlYXJjaCBxdWVyaWVzIHNvbWV3aGVyZSBpbiB0aGUgdXNlcidzIHByb2ZpbGVcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2VhcmNoX2VsZS5mb2N1cygpO1xuICAgICAgICAgICAgdGhpcy5wcmV2U2VhcmNoID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncHJldlNlYXJjaCcpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBpZ25vcmVcbiAgICAgKlxuICAgICAqIFJlc2V0IHRoZSBzZWFyY2hcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBzZWFyY2hfZWxlXG4gICAgICogQHJldHVybnMgdm9pZFxuICAgICAqL1xuICAgIHJlc2V0U2VhcmNoKHNlYXJjaF9lbGU6IEhUTUxFbGVtZW50KTogdm9pZCB7XG4gICAgICAgIHRoaXMuc2VhcmNoUXVlcnkgPSBudWxsO1xuICAgICAgICBzZWFyY2hfZWxlLmZvY3VzKCk7XG4gICAgICAgIHRoaXMuZm9jdXNPblNpbXBsZSA9ICdpbmFjdGl2ZSc7XG4gICAgICAgIHRoaXMuc2VhcmNoUGFuZWxGb2N1cyA9ICF0aGlzLnNlYXJjaFBhbmVsRm9jdXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGlnbm9yZVxuICAgICAqXG4gICAgICogUmVhbGlzZSBhIHByZXZpb3VzIHNlYXJjaFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBxdWVyeVxuICAgICAqIEByZXR1cm5zIHZvaWRcbiAgICAgKi9cbiAgICBkb1ByZXZTZWFyY2gocXVlcnk6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICB0aGlzLnNlYXJjaFF1ZXJ5ID0gcXVlcnk7XG4gICAgICAgIHRoaXMuX3JvdXRlci5uYXZpZ2F0ZShbdGhpcy5yb3V0ZSArICcvZnVsbHRleHQvJyArIHF1ZXJ5XSwgeyByZWxhdGl2ZVRvOiB0aGlzLl9yb3V0ZSB9KTtcbiAgICAgICAgdGhpcy50b2dnbGVNZW51KCdzaW1wbGVTZWFyY2gnKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaWdub3JlXG4gICAgICpcbiAgICAgKiBSZXNldCBwcmV2aW91cyBzZWFyY2hlcyAtIHRoZSB3aG9sZSBwcmV2aW91cyBzZWFyY2ggb3Igc3BlY2lmaWMgaXRlbSBieSBuYW1lXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgdGVybSBvZiB0aGUgc2VhcmNoXG4gICAgICogQHJldHVybnMgdm9pZFxuICAgICAqL1xuICAgIHJlc2V0UHJldlNlYXJjaChuYW1lOiBzdHJpbmcgPSBudWxsKTogdm9pZCB7XG4gICAgICAgIGlmIChuYW1lKSB7XG4gICAgICAgICAgICAvLyBkZWxldGUgb25seSB0aGlzIGl0ZW0gd2l0aCB0aGUgbmFtZSAuLi5cbiAgICAgICAgICAgIGNvbnN0IGk6IG51bWJlciA9IHRoaXMucHJldlNlYXJjaC5pbmRleE9mKG5hbWUpO1xuICAgICAgICAgICAgdGhpcy5wcmV2U2VhcmNoLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdwcmV2U2VhcmNoJywgSlNPTi5zdHJpbmdpZnkodGhpcy5wcmV2U2VhcmNoKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBkZWxldGUgdGhlIHdob2xlIFwicHJldmlvdXMgc2VhcmNoXCIgYXJyYXlcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCdwcmV2U2VhcmNoJyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wcmV2U2VhcmNoID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncHJldlNlYXJjaCcpKTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBpZ25vcmVcbiAgICAgKiBTZXQgc2ltcGxlIGZvY3VzIHRvIGFjdGl2ZVxuICAgICAqXG4gICAgICogQHJldHVybnMgdm9pZFxuICAgICAqL1xuICAgIHNldEZvY3VzKCk6IHZvaWQge1xuICAgICAgICB0aGlzLnByZXZTZWFyY2ggPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdwcmV2U2VhcmNoJykpO1xuICAgICAgICB0aGlzLmZvY3VzT25TaW1wbGUgPSAnYWN0aXZlJztcbiAgICAgICAgdGhpcy5zZWFyY2hQYW5lbEZvY3VzID0gIXRoaXMuc2VhcmNoUGFuZWxGb2N1cztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaWdub3JlXG4gICAgICpcbiAgICAgKiBTd2l0Y2ggYWNjb3JkaW5nIHRvIHRoZSBmb2N1cyBiZXR3ZWVuIHNpbXBsZSBvciBleHRlbmRlZCBzZWFyY2hcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIDIgY2FzZXM6IHNpbXBsZVNlYXJjaCBvciBleHRlbmRlZFNlYXJjaFxuICAgICAqIEByZXR1cm5zIHZvaWRcbiAgICAgKi9cbiAgICB0b2dnbGVNZW51KG5hbWU6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICBzd2l0Y2ggKG5hbWUpIHtcbiAgICAgICAgICAgIGNhc2UgJ3NpbXBsZVNlYXJjaCc6XG4gICAgICAgICAgICAgICAgdGhpcy5wcmV2U2VhcmNoID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncHJldlNlYXJjaCcpKTtcbiAgICAgICAgICAgICAgICB0aGlzLmZvY3VzT25TaW1wbGUgPSAodGhpcy5mb2N1c09uU2ltcGxlID09PSAnYWN0aXZlJyA/ICdpbmFjdGl2ZScgOiAnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5zaG93U2ltcGxlU2VhcmNoID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2V4dGVuZGVkU2VhcmNoJzpcbiAgICAgICAgICAgICAgICB0aGlzLmZvY3VzT25FeHRlbmRlZCA9ICh0aGlzLmZvY3VzT25FeHRlbmRlZCA9PT0gJ2FjdGl2ZScgPyAnaW5hY3RpdmUnIDogJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2hvd1NpbXBsZVNlYXJjaCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxufVxuIl19