import * as tslib_1 from "tslib";
import { Component, ElementRef, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
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
                for (var existingPrevSearch_1 = tslib_1.__values(existingPrevSearch), existingPrevSearch_1_1 = existingPrevSearch_1.next(); !existingPrevSearch_1_1.done; existingPrevSearch_1_1 = existingPrevSearch_1.next()) {
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
        if (name === void 0) { name = null; }
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
        { type: Component, args: [{
                    selector: 'kui-search',
                    template: "<div class=\"search-bar-elements\">\n\n    <!-- the next element - div.extended-search-panel - is a hidden dropdown filter menu -->\n\n    <div class=\"search-panel\" [class.active]=\"searchPanelFocus\">\n        <div>\n            <button class=\"prefix\" (click)=\"doSearch(search)\">\n                <mat-icon>search</mat-icon>\n            </button>\n        </div>\n\n        <div class=\"input-field\">\n            <input #search autocomplete=\"off\" type=\"search\" [placeholder]=\"searchLabel\" [(ngModel)]=\"searchQuery\" name=\"search\" (keyup.esc)=\"resetSearch(search)\" (keyup)=\"onKey(search, $event)\" (click)=\"setFocus()\" (focus)=\"toggleMenu('simpleSearch')\" [disabled]=\"focusOnExtended === 'active'\" />\n        </div>\n\n        <!-- switch button: on some focus we need a close button for the simple or extended panel -->\n        <div>\n            <button class=\"suffix\" *ngIf=\"focusOnSimple === 'active'\" (click)=\"resetSearch(search)\">\n                <mat-icon>close</mat-icon>\n            </button>\n            <button class=\"suffix\" *ngIf=\"focusOnSimple === 'inactive'\">\n            </button>\n        </div>\n\n        <!-- the search panel has two \"dropdown\" menus: one for simple search and another one for the extended search -->\n        <div class=\"salsah-menu simple-search\" [@simpleSearchMenu]=\"focusOnSimple\" *ngIf=\"showSimpleSearch\">\n            <mat-list class=\"salsah-previous-search-list\">\n                <mat-list-item *ngFor=\"let item of prevSearch | kuiReverse; let i=index\">\n                    <h4 mat-line *ngIf=\"i<10\" (click)=\"doPrevSearch(item)\">{{item}}</h4>\n                    <button mat-icon-button (click)=\"resetPrevSearch(item)\">\n                        <mat-icon aria-label=\"close\">close</mat-icon>\n                    </button>\n                </mat-list-item>\n            </mat-list>\n            <button mat-stroked-button color=\"accent\" class=\"right\" (click)=\"resetPrevSearch()\" *ngIf=\"prevSearch\">Clear</button>\n        </div>\n\n        <div class=\"salsah-menu extended-search\" [@extendedSearchMenu]=\"focusOnExtended\">\n            <div class=\"salsah-menu-header\">\n                <span class=\"salsah-menu-title\">\n                    <h4>Advanced search</h4>\n                </span>\n                <span class=\"salsah-menu-action\">\n                    <button mat-icon-button (click)=\"toggleMenu('extendedSearch')\">\n                        <mat-icon>close</mat-icon>\n                    </button>\n                </span>\n            </div>\n            <div class=\"extended-search-box\">\n                <kui-extended-search [route]=\"route\" (toggleExtendedSearchForm)=\"toggleMenu('extendedSearch')\"></kui-extended-search>\n            </div>\n        </div>\n    </div>\n\n    <!-- Extended search button to display the extended search form in the search panel -->\n    <button mat-button type=\"button\" color=\"primary\" class=\"advanced-search-button\" (click)=\"toggleMenu('extendedSearch')\">\n        advanced\n    </button>\n\n</div>",
                    styles: ["input[type=search]::-webkit-search-cancel-button,input[type=search]::-webkit-search-decoration,input[type=search]::-webkit-search-results-button,input[type=search]::-webkit-search-results-decoration{display:none}input[type=search]{-moz-appearance:none;-webkit-appearance:none}.center{display:block;margin-left:auto;margin-right:auto}.close{right:12px}.extended-search-box{margin:12px}.advanced-search-button{margin-left:10px}.full-width{width:100%}.hide{display:none}.inactive,.mute{color:#7a7a7a}.search-panel{background-color:#f9f9f9;border-radius:4px;display:inline-flex;height:40px;position:relative;width:680px;z-index:10}.search-panel:hover{box-shadow:0 1px 3px rgba(0,0,0,.5)}.search-panel div.input-field{flex:1}.search-panel div.input-field input{border-style:none;font-size:14pt;height:38px;position:absolute;width:calc(100% - 80px)}.search-panel div.input-field input:active,.search-panel div.input-field input:focus{outline:0}.search-panel div .prefix,.search-panel div .suffix{background-color:#fff;border-radius:3px;border-style:none;color:rgba(41,41,41,.4);cursor:pointer;height:38px;outline:0;position:relative;width:40px}.search-panel div .prefix:active,.search-panel div .suffix:active{color:#515151}.search-panel.active{box-shadow:0 1px 3px rgba(0,0,0,.5)}.salsah-menu{box-shadow:0 3px 5px -1px rgba(11,11,11,.2),0 6px 10px 0 rgba(11,11,11,.14),0 1px 18px 0 rgba(11,11,11,.12);background-color:#f9f9f9;border-radius:4px;position:absolute}.salsah-menu .salsah-menu-header{background-color:#f9f9f9;border-top-left-radius:4px;border-top-right-radius:4px;display:inline-block;height:48px;width:100%}.salsah-menu .salsah-menu-header .salsah-menu-title{float:left;font-size:14px;font-weight:400;margin-top:4px;padding:12px}.salsah-menu .salsah-menu-header .salsah-menu-action{float:right;margin:4px}.salsah-menu.extended-search,.salsah-menu.simple-search{min-height:680px;width:680px}.salsah-menu.simple-search{padding-top:60px;z-index:-1}.salsah-menu.simple-search .salsah-previous-search-list .mat-list-item{cursor:pointer}.salsah-menu.simple-search .salsah-previous-search-list .mat-list-item:hover{background-color:#f9f9f9}.salsah-menu.simple-search .salsah-previous-search-list .mat-list-item:hover mat-icon{display:block}.salsah-menu.simple-search .salsah-previous-search-list .mat-list-item mat-icon{display:none}.salsah-menu.simple-search .right{margin-top:12px;margin-left:16px}.salsah-menu.extended-search{z-index:20}.search-bar-elements{display:flex}.show{display:block}@media screen and (max-width:1024px){.search-panel{width:480px}.search-panel div.input-field input{width:calc(480px - 80px)}.salsah-menu.extended-search,.salsah-menu.simple-search{width:480px}}@media screen and (max-width:768px){.search-panel{width:calc(480px - 160px)}.search-panel div.input-field input{width:calc(480px - 160px - 80px)}.salsah-menu.extended-search,.salsah-menu.simple-search{width:calc(480px - 80px)}}"],
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
export { SearchComponent };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VhcmNoLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Brbm9yYS9zZWFyY2gvIiwic291cmNlcyI6WyJsaWIvc2VhcmNoLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFVLE1BQU0sZUFBZSxDQUFDO0FBQ3JFLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDekQsT0FBTyxFQUNILE9BQU8sRUFDUCxLQUFLLEVBQ0wsS0FBSyxFQUNMLFVBQVUsRUFDVixPQUFPLEVBQ1YsTUFBTSxxQkFBcUIsQ0FBQztBQUU3QjtJQXVHSSx5QkFBb0IsTUFBc0IsRUFDOUIsT0FBZSxFQUNmLE9BQW1CO1FBRlgsV0FBTSxHQUFOLE1BQU0sQ0FBZ0I7UUFDOUIsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUNmLFlBQU8sR0FBUCxPQUFPLENBQVk7UUFqQnRCLFVBQUssR0FBVyxTQUFTLENBQUM7UUFJbkMscUJBQWdCLEdBQVksS0FBSyxDQUFDO1FBRWxDLGVBQVUsR0FBYSxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztRQUV0RSxrQkFBYSxHQUFXLFVBQVUsQ0FBQztRQUNuQyxvQkFBZSxHQUFXLFVBQVUsQ0FBQztRQUVyQyxnQkFBVyxHQUFXLFFBQVEsQ0FBQztRQUUvQixxQkFBZ0IsR0FBWSxJQUFJLENBQUM7SUFNakMsQ0FBQztJQUVELGtDQUFRLEdBQVI7SUFDQSxDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0gsK0JBQUssR0FBTCxVQUFNLFVBQXVCLEVBQUUsS0FBSztRQUNoQyxJQUFJLENBQUMsYUFBYSxHQUFHLFFBQVEsQ0FBQztRQUM5QixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMs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LGtCQUFrQixFQUFFLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQzs0QkFDeEQsVUFBVSxDQUFDLGtCQUFrQixFQUFFLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO3lCQUM1RCxDQUNKO3FCQUNKO2lCQUNKOzs7O2dCQTFGUSxjQUFjO2dCQUFFLE1BQU07Z0JBRFgsVUFBVTs7O3dCQWtHekIsS0FBSzs7SUFtSlYsc0JBQUM7Q0FBQSxBQTNPRCxJQTJPQztTQXJKWSxlQUFlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBJbnB1dCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZSwgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7XG4gICAgYW5pbWF0ZSxcbiAgICBzdGF0ZSxcbiAgICBzdHlsZSxcbiAgICB0cmFuc2l0aW9uLFxuICAgIHRyaWdnZXJcbn0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAna3VpLXNlYXJjaCcsXG4gICAgdGVtcGxhdGU6IGA8ZGl2IGNsYXNzPVwic2VhcmNoLWJhci1lbGVtZW50c1wiPlxuXG4gICAgPCEtLSB0aGUgbmV4dCBlbGVtZW50IC0gZGl2LmV4dGVuZGVkLXNlYXJjaC1wYW5lbCAtIGlzIGEgaGlkZGVuIGRyb3Bkb3duIGZpbHRlciBtZW51IC0tPlxuXG4gICAgPGRpdiBjbGFzcz1cInNlYXJjaC1wYW5lbFwiIFtjbGFzcy5hY3RpdmVdPVwic2VhcmNoUGFuZWxGb2N1c1wiPlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cInByZWZpeFwiIChjbGljayk9XCJkb1NlYXJjaChzZWFyY2gpXCI+XG4gICAgICAgICAgICAgICAgPG1hdC1pY29uPnNlYXJjaDwvbWF0LWljb24+XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBjbGFzcz1cImlucHV0LWZpZWxkXCI+XG4gICAgICAgICAgICA8aW5wdXQgI3NlYXJjaCBhdXRvY29tcGxldGU9XCJvZmZcIiB0eXBlPVwic2VhcmNoXCIgW3BsYWNlaG9sZGVyXT1cInNlYXJjaExhYmVsXCIgWyhuZ01vZGVsKV09XCJzZWFyY2hRdWVyeVwiIG5hbWU9XCJzZWFyY2hcIiAoa2V5dXAuZXNjKT1cInJlc2V0U2VhcmNoKHNlYXJjaClcIiAoa2V5dXApPVwib25LZXkoc2VhcmNoLCAkZXZlbnQpXCIgKGNsaWNrKT1cInNldEZvY3VzKClcIiAoZm9jdXMpPVwidG9nZ2xlTWVudSgnc2ltcGxlU2VhcmNoJylcIiBbZGlzYWJsZWRdPVwiZm9jdXNPbkV4dGVuZGVkID09PSAnYWN0aXZlJ1wiIC8+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDwhLS0gc3dpdGNoIGJ1dHRvbjogb24gc29tZSBmb2N1cyB3ZSBuZWVkIGEgY2xvc2UgYnV0dG9uIGZvciB0aGUgc2ltcGxlIG9yIGV4dGVuZGVkIHBhbmVsIC0tPlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cInN1ZmZpeFwiICpuZ0lmPVwiZm9jdXNPblNpbXBsZSA9PT0gJ2FjdGl2ZSdcIiAoY2xpY2spPVwicmVzZXRTZWFyY2goc2VhcmNoKVwiPlxuICAgICAgICAgICAgICAgIDxtYXQtaWNvbj5jbG9zZTwvbWF0LWljb24+XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJzdWZmaXhcIiAqbmdJZj1cImZvY3VzT25TaW1wbGUgPT09ICdpbmFjdGl2ZSdcIj5cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8IS0tIHRoZSBzZWFyY2ggcGFuZWwgaGFzIHR3byBcImRyb3Bkb3duXCIgbWVudXM6IG9uZSBmb3Igc2ltcGxlIHNlYXJjaCBhbmQgYW5vdGhlciBvbmUgZm9yIHRoZSBleHRlbmRlZCBzZWFyY2ggLS0+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJzYWxzYWgtbWVudSBzaW1wbGUtc2VhcmNoXCIgW0BzaW1wbGVTZWFyY2hNZW51XT1cImZvY3VzT25TaW1wbGVcIiAqbmdJZj1cInNob3dTaW1wbGVTZWFyY2hcIj5cbiAgICAgICAgICAgIDxtYXQtbGlzdCBjbGFzcz1cInNhbHNhaC1wcmV2aW91cy1zZWFyY2gtbGlzdFwiPlxuICAgICAgICAgICAgICAgIDxtYXQtbGlzdC1pdGVtICpuZ0Zvcj1cImxldCBpdGVtIG9mIHByZXZTZWFyY2ggfCBrdWlSZXZlcnNlOyBsZXQgaT1pbmRleFwiPlxuICAgICAgICAgICAgICAgICAgICA8aDQgbWF0LWxpbmUgKm5nSWY9XCJpPDEwXCIgKGNsaWNrKT1cImRvUHJldlNlYXJjaChpdGVtKVwiPnt7aXRlbX19PC9oND5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBtYXQtaWNvbi1idXR0b24gKGNsaWNrKT1cInJlc2V0UHJldlNlYXJjaChpdGVtKVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPG1hdC1pY29uIGFyaWEtbGFiZWw9XCJjbG9zZVwiPmNsb3NlPC9tYXQtaWNvbj5cbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9tYXQtbGlzdC1pdGVtPlxuICAgICAgICAgICAgPC9tYXQtbGlzdD5cbiAgICAgICAgICAgIDxidXR0b24gbWF0LXN0cm9rZWQtYnV0dG9uIGNvbG9yPVwiYWNjZW50XCIgY2xhc3M9XCJyaWdodFwiIChjbGljayk9XCJyZXNldFByZXZTZWFyY2goKVwiICpuZ0lmPVwicHJldlNlYXJjaFwiPkNsZWFyPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgY2xhc3M9XCJzYWxzYWgtbWVudSBleHRlbmRlZC1zZWFyY2hcIiBbQGV4dGVuZGVkU2VhcmNoTWVudV09XCJmb2N1c09uRXh0ZW5kZWRcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzYWxzYWgtbWVudS1oZWFkZXJcIj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNhbHNhaC1tZW51LXRpdGxlXCI+XG4gICAgICAgICAgICAgICAgICAgIDxoND5BZHZhbmNlZCBzZWFyY2g8L2g0PlxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNhbHNhaC1tZW51LWFjdGlvblwiPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIG1hdC1pY29uLWJ1dHRvbiAoY2xpY2spPVwidG9nZ2xlTWVudSgnZXh0ZW5kZWRTZWFyY2gnKVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPG1hdC1pY29uPmNsb3NlPC9tYXQtaWNvbj5cbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZXh0ZW5kZWQtc2VhcmNoLWJveFwiPlxuICAgICAgICAgICAgICAgIDxrdWktZXh0ZW5kZWQtc2VhcmNoIFtyb3V0ZV09XCJyb3V0ZVwiICh0b2dnbGVFeHRlbmRlZFNlYXJjaEZvcm0pPVwidG9nZ2xlTWVudSgnZXh0ZW5kZWRTZWFyY2gnKVwiPjwva3VpLWV4dGVuZGVkLXNlYXJjaD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cblxuICAgIDwhLS0gRXh0ZW5kZWQgc2VhcmNoIGJ1dHRvbiB0byBkaXNwbGF5IHRoZSBleHRlbmRlZCBzZWFyY2ggZm9ybSBpbiB0aGUgc2VhcmNoIHBhbmVsIC0tPlxuICAgIDxidXR0b24gbWF0LWJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY29sb3I9XCJwcmltYXJ5XCIgY2xhc3M9XCJhZHZhbmNlZC1zZWFyY2gtYnV0dG9uXCIgKGNsaWNrKT1cInRvZ2dsZU1lbnUoJ2V4dGVuZGVkU2VhcmNoJylcIj5cbiAgICAgICAgYWR2YW5jZWRcbiAgICA8L2J1dHRvbj5cblxuPC9kaXY+YCxcbiAgICBzdHlsZXM6IFtgaW5wdXRbdHlwZT1zZWFyY2hdOjotd2Via2l0LXNlYXJjaC1jYW5jZWwtYnV0dG9uLGlucHV0W3R5cGU9c2VhcmNoXTo6LXdlYmtpdC1zZWFyY2gtZGVjb3JhdGlvbixpbnB1dFt0eXBlPXNlYXJjaF06Oi13ZWJraXQtc2VhcmNoLXJlc3VsdHMtYnV0dG9uLGlucHV0W3R5cGU9c2VhcmNoXTo6LXdlYmtpdC1zZWFyY2gtcmVzdWx0cy1kZWNvcmF0aW9ue2Rpc3BsYXk6bm9uZX1pbnB1dFt0eXBlPXNlYXJjaF17LW1vei1hcHBlYXJhbmNlOm5vbmU7LXdlYmtpdC1hcHBlYXJhbmNlOm5vbmV9LmNlbnRlcntkaXNwbGF5OmJsb2NrO21hcmdpbi1sZWZ0OmF1dG87bWFyZ2luLXJpZ2h0OmF1dG99LmNsb3Nle3JpZ2h0OjEycHh9LmV4dGVuZGVkLXNlYXJjaC1ib3h7bWFyZ2luOjEycHh9LmFkdmFuY2VkLXNlYXJjaC1idXR0b257bWFyZ2luLWxlZnQ6MTBweH0uZnVsbC13aWR0aHt3aWR0aDoxMDAlfS5oaWRle2Rpc3BsYXk6bm9uZX0uaW5hY3RpdmUsLm11dGV7Y29sb3I6IzdhN2E3YX0uc2VhcmNoLXBhbmVse2JhY2tncm91bmQtY29sb3I6I2Y5ZjlmOTtib3JkZXItcmFkaXVzOjRweDtkaXNwbGF5OmlubGluZS1mbGV4O2hlaWdodDo0MHB4O3Bvc2l0aW9uOnJlbGF0aXZlO3dpZHRoOjY4MHB4O3otaW5kZXg6MTB9LnNlYXJjaC1wYW5lbDpob3Zlcntib3gtc2hhZG93OjAgMXB4IDNweCByZ2JhKDAsMCwwLC41KX0uc2VhcmNoLXBhbmVsIGRpdi5pbnB1dC1maWVsZHtmbGV4OjF9LnNlYXJjaC1wYW5lbCBkaXYuaW5wdXQtZmllbGQgaW5wdXR7Ym9yZGVyLXN0eWxlOm5vbmU7Zm9udC1zaXplOjE0cHQ7aGVpZ2h0OjM4cHg7cG9zaXRpb246YWJzb2x1dGU7d2lkdGg6Y2FsYygxMDAlIC0gODBweCl9LnNlYXJjaC1wYW5lbCBkaXYuaW5wdXQtZmllbGQgaW5wdXQ6YWN0aXZlLC5zZWFyY2gtcGFuZWwgZGl2LmlucHV0LWZpZWxkIGlucHV0OmZvY3Vze291dGxpbmU6MH0uc2VhcmNoLXBhbmVsIGRpdiAucHJlZml4LC5zZWFyY2gtcGFuZWwgZGl2IC5zdWZmaXh7YmFja2dyb3VuZC1jb2xvcjojZmZmO2JvcmRlci1yYWRpdXM6M3B4O2JvcmRlci1zdHlsZTpub25lO2NvbG9yOnJnYmEoNDEsNDEsNDEsLjQpO2N1cnNvcjpwb2ludGVyO2hlaWdodDozOHB4O291dGxpbmU6MDtwb3NpdGlvbjpyZWxhdGl2ZTt3aWR0aDo0MHB4fS5zZWFyY2gtcGFuZWwgZGl2IC5wcmVmaXg6YWN0aXZlLC5zZWFyY2gtcGFuZWwgZGl2IC5zdWZmaXg6YWN0aXZle2NvbG9yOiM1MTUxNTF9LnNlYXJjaC1wYW5lbC5hY3RpdmV7Ym94LXNoYWRvdzowIDFweCAzcHggcmdiYSgwLDAsMCwuNSl9LnNhbHNhaC1tZW51e2JveC1zaGFkb3c6MCAzcHggNXB4IC0xcHggcmdiYSgxMSwxMSwxMSwuMiksMCA2cHggMTBweCAwIHJnYmEoMTEsMTEsMTEsLjE0KSwwIDFweCAxOHB4IDAgcmdiYSgxMSwxMSwxMSwuMTIpO2JhY2tncm91bmQtY29sb3I6I2Y5ZjlmOTtib3JkZXItcmFkaXVzOjRweDtwb3NpdGlvbjphYnNvbHV0ZX0uc2Fsc2FoLW1lbnUgLnNhbHNhaC1tZW51LWhlYWRlcntiYWNrZ3JvdW5kLWNvbG9yOiNmOWY5Zjk7Ym9yZGVyLXRvcC1sZWZ0LXJhZGl1czo0cHg7Ym9yZGVyLXRvcC1yaWdodC1yYWRpdXM6NHB4O2Rpc3BsYXk6aW5saW5lLWJsb2NrO2hlaWdodDo0OHB4O3dpZHRoOjEwMCV9LnNhbHNhaC1tZW51IC5zYWxzYWgtbWVudS1oZWFkZXIgLnNhbHNhaC1tZW51LXRpdGxle2Zsb2F0OmxlZnQ7Zm9udC1zaXplOjE0cHg7Zm9udC13ZWlnaHQ6NDAwO21hcmdpbi10b3A6NHB4O3BhZGRpbmc6MTJweH0uc2Fsc2FoLW1lbnUgLnNhbHNhaC1tZW51LWhlYWRlciAuc2Fsc2FoLW1lbnUtYWN0aW9ue2Zsb2F0OnJpZ2h0O21hcmdpbjo0cHh9LnNhbHNhaC1tZW51LmV4dGVuZGVkLXNlYXJjaCwuc2Fsc2FoLW1lbnUuc2ltcGxlLXNlYXJjaHttaW4taGVpZ2h0OjY4MHB4O3dpZHRoOjY4MHB4fS5zYWxzYWgtbWVudS5zaW1wbGUtc2VhcmNoe3BhZGRpbmctdG9wOjYwcHg7ei1pbmRleDotMX0uc2Fsc2FoLW1lbnUuc2ltcGxlLXNlYXJjaCAuc2Fsc2FoLXByZXZpb3VzLXNlYXJjaC1saXN0IC5tYXQtbGlzdC1pdGVte2N1cnNvcjpwb2ludGVyfS5zYWxzYWgtbWVudS5zaW1wbGUtc2VhcmNoIC5zYWxzYWgtcHJldmlvdXMtc2VhcmNoLWxpc3QgLm1hdC1saXN0LWl0ZW06aG92ZXJ7YmFja2dyb3VuZC1jb2xvcjojZjlmOWY5fS5zYWxzYWgtbWVudS5zaW1wbGUtc2VhcmNoIC5zYWxzYWgtcHJldmlvdXMtc2VhcmNoLWxpc3QgLm1hdC1saXN0LWl0ZW06aG92ZXIgbWF0LWljb257ZGlzcGxheTpibG9ja30uc2Fsc2FoLW1lbnUuc2ltcGxlLXNlYXJjaCAuc2Fsc2FoLXByZXZpb3VzLXNlYXJjaC1saXN0IC5tYXQtbGlzdC1pdGVtIG1hdC1pY29ue2Rpc3BsYXk6bm9uZX0uc2Fsc2FoLW1lbnUuc2ltcGxlLXNlYXJjaCAucmlnaHR7bWFyZ2luLXRvcDoxMnB4O21hcmdpbi1sZWZ0OjE2cHh9LnNhbHNhaC1tZW51LmV4dGVuZGVkLXNlYXJjaHt6LWluZGV4OjIwfS5zZWFyY2gtYmFyLWVsZW1lbnRze2Rpc3BsYXk6ZmxleH0uc2hvd3tkaXNwbGF5OmJsb2NrfUBtZWRpYSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6MTAyNHB4KXsuc2VhcmNoLXBhbmVse3dpZHRoOjQ4MHB4fS5zZWFyY2gtcGFuZWwgZGl2LmlucHV0LWZpZWxkIGlucHV0e3dpZHRoOmNhbGMoNDgwcHggLSA4MHB4KX0uc2Fsc2FoLW1lbnUuZXh0ZW5kZWQtc2VhcmNoLC5zYWxzYWgtbWVudS5zaW1wbGUtc2VhcmNoe3dpZHRoOjQ4MHB4fX1AbWVkaWEgc2NyZWVuIGFuZCAobWF4LXdpZHRoOjc2OHB4KXsuc2VhcmNoLXBhbmVse3dpZHRoOmNhbGMoNDgwcHggLSAxNjBweCl9LnNlYXJjaC1wYW5lbCBkaXYuaW5wdXQtZmllbGQgaW5wdXR7d2lkdGg6Y2FsYyg0ODBweCAtIDE2MHB4IC0gODBweCl9LnNhbHNhaC1tZW51LmV4dGVuZGVkLXNlYXJjaCwuc2Fsc2FoLW1lbnUuc2ltcGxlLXNlYXJjaHt3aWR0aDpjYWxjKDQ4MHB4IC0gODBweCl9fWBdLFxuICAgIGFuaW1hdGlvbnM6IFtcbiAgICAgICAgdHJpZ2dlcignc2ltcGxlU2VhcmNoTWVudScsXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgc3RhdGUoJ2luYWN0aXZlJywgc3R5bGUoeyBkaXNwbGF5OiAnbm9uZScgfSkpLFxuICAgICAgICAgICAgICAgIHN0YXRlKCdhY3RpdmUnLCBzdHlsZSh7IGRpc3BsYXk6ICdibG9jaycgfSkpLFxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb24oJ2luYWN0aXZlID0+IHRydWUnLCBhbmltYXRlKCcxMDBtcyBlYXNlLWluJykpLFxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb24oJ3RydWUgPT4gaW5hY3RpdmUnLCBhbmltYXRlKCcxMDBtcyBlYXNlLW91dCcpKVxuICAgICAgICAgICAgXVxuICAgICAgICApLFxuICAgICAgICB0cmlnZ2VyKCdleHRlbmRlZFNlYXJjaE1lbnUnLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgIHN0YXRlKCdpbmFjdGl2ZScsIHN0eWxlKHsgZGlzcGxheTogJ25vbmUnIH0pKSxcbiAgICAgICAgICAgICAgICBzdGF0ZSgnYWN0aXZlJywgc3R5bGUoeyBkaXNwbGF5OiAnYmxvY2snIH0pKSxcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uKCdpbmFjdGl2ZSA9PiB0cnVlJywgYW5pbWF0ZSgnMTAwbXMgZWFzZS1pbicpKSxcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uKCd0cnVlID0+IGluYWN0aXZlJywgYW5pbWF0ZSgnMTAwbXMgZWFzZS1vdXQnKSlcbiAgICAgICAgICAgIF1cbiAgICAgICAgKSxcbiAgICBdXG59KVxuXG4vKipcbiAqIENvbnRhaW5zIG1ldGhvZHMgdG8gcmVhbGlzZSwgcmVzZXQgbmV3IG9yIHByZXZpb3VzIHNpbXBsZSBzZWFyY2hlcy5cbiAqL1xuZXhwb3J0IGNsYXNzIFNlYXJjaENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgICBASW5wdXQoKSByb3V0ZTogc3RyaW5nID0gJy9zZWFyY2gnO1xuXG4gICAgc2VhcmNoUXVlcnk6IHN0cmluZztcblxuICAgIHNlYXJjaFBhbmVsRm9jdXM6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIHByZXZTZWFyY2g6IHN0cmluZ1tdID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncHJldlNlYXJjaCcpKTtcblxuICAgIGZvY3VzT25TaW1wbGU6IHN0cmluZyA9ICdpbmFjdGl2ZSc7XG4gICAgZm9jdXNPbkV4dGVuZGVkOiBzdHJpbmcgPSAnaW5hY3RpdmUnO1xuXG4gICAgc2VhcmNoTGFiZWw6IHN0cmluZyA9ICdTZWFyY2gnO1xuXG4gICAgc2hvd1NpbXBsZVNlYXJjaDogYm9vbGVhbiA9IHRydWU7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9yb3V0ZTogQWN0aXZhdGVkUm91dGUsXG4gICAgICAgIHByaXZhdGUgX3JvdXRlcjogUm91dGVyLFxuICAgICAgICBwcml2YXRlIF9lbGVSZWY6IEVsZW1lbnRSZWYpIHtcblxuICAgIH1cblxuICAgIG5nT25Jbml0KCkge1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBpZ25vcmVcbiAgICAgKiBEbyBzZWFyY2ggb24gRW50ZXIgY2xpY2ssIHJlc2V0IHNlYXJjaCBvbiBFc2NhcGVcbiAgICAgKiBAcGFyYW0gc2VhcmNoX2VsZVxuICAgICAqIEBwYXJhbSBldmVudFxuICAgICAqIEByZXR1cm5zIHZvaWRcbiAgICAgKi9cbiAgICBvbktleShzZWFyY2hfZWxlOiBIVE1MRWxlbWVudCwgZXZlbnQpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5mb2N1c09uU2ltcGxlID0gJ2FjdGl2ZSc7XG4gICAgICAgIHRoaXMucHJldlNlYXJjaCA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3ByZXZTZWFyY2gnKSk7XG4gICAgICAgIGlmICh0aGlzLnNlYXJjaFF1ZXJ5ICYmIChldmVudC5rZXkgPT09ICdFbnRlcicgfHwgZXZlbnQua2V5Q29kZSA9PT0gMTMgfHwgZXZlbnQud2hpY2ggPT09IDEzKSkge1xuICAgICAgICAgICAgdGhpcy5kb1NlYXJjaChzZWFyY2hfZWxlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXZlbnQua2V5ID09PSAnRXNjYXBlJyB8fCBldmVudC5rZXlDb2RlID09PSAyNyB8fCBldmVudC53aGljaCA9PT0gMjcpIHtcbiAgICAgICAgICAgIHRoaXMucmVzZXRTZWFyY2goc2VhcmNoX2VsZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZWFsaXNlIGEgc2ltcGxlIHNlYXJjaFxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHNlYXJjaF9lbGVcbiAgICAgKiBAcmV0dXJucyB2b2lkXG4gICAgICovXG4gICAgZG9TZWFyY2goc2VhcmNoX2VsZTogSFRNTEVsZW1lbnQpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuc2VhcmNoUXVlcnkgIT09IHVuZGVmaW5lZCAmJiB0aGlzLnNlYXJjaFF1ZXJ5ICE9PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLnRvZ2dsZU1lbnUoJ3NpbXBsZVNlYXJjaCcpO1xuICAgICAgICAgICAgdGhpcy5fcm91dGVyLm5hdmlnYXRlKFt0aGlzLnJvdXRlICsgJy9mdWxsdGV4dC8nICsgdGhpcy5zZWFyY2hRdWVyeV0pO1xuXG4gICAgICAgICAgICAvLyB0aGlzLl9yb3V0ZXIubmF2aWdhdGUoWycvc2VhcmNoL2Z1bGx0ZXh0LycgKyB0aGlzLnNlYXJjaFF1ZXJ5XSwgeyByZWxhdGl2ZVRvOiB0aGlzLl9yb3V0ZSB9KTtcblxuICAgICAgICAgICAgLy8gcHVzaCB0aGUgc2VhcmNoIHF1ZXJ5IGludG8gdGhlIGxvY2FsIHN0b3JhZ2UgcHJldlNlYXJjaCBhcnJheSAocHJldmlvdXMgc2VhcmNoKVxuICAgICAgICAgICAgLy8gdG8gaGF2ZSBhIGxpc3Qgb2YgcmVjZW50IHNlYXJjaCByZXF1ZXN0c1xuICAgICAgICAgICAgbGV0IGV4aXN0aW5nUHJldlNlYXJjaDogc3RyaW5nW10gPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdwcmV2U2VhcmNoJykpO1xuICAgICAgICAgICAgaWYgKGV4aXN0aW5nUHJldlNlYXJjaCA9PT0gbnVsbCkgeyBleGlzdGluZ1ByZXZTZWFyY2ggPSBbXTsgfVxuICAgICAgICAgICAgbGV0IGk6IG51bWJlciA9IDA7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIGV4aXN0aW5nUHJldlNlYXJjaCkge1xuICAgICAgICAgICAgICAgIC8vIHJlbW92ZSBlbnRyeSwgaWYgZXhpc3RzIGFscmVhZHlcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zZWFyY2hRdWVyeSA9PT0gZW50cnkpIHsgZXhpc3RpbmdQcmV2U2VhcmNoLnNwbGljZShpLCAxKTsgfVxuICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZXhpc3RpbmdQcmV2U2VhcmNoLnB1c2godGhpcy5zZWFyY2hRdWVyeSk7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncHJldlNlYXJjaCcsIEpTT04uc3RyaW5naWZ5KGV4aXN0aW5nUHJldlNlYXJjaCkpO1xuICAgICAgICAgICAgLy8gVE9ETzogc2F2ZSB0aGUgcHJldmlvdXMgc2VhcmNoIHF1ZXJpZXMgc29tZXdoZXJlIGluIHRoZSB1c2VyJ3MgcHJvZmlsZVxuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZWFyY2hfZWxlLmZvY3VzKCk7XG4gICAgICAgICAgICB0aGlzLnByZXZTZWFyY2ggPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdwcmV2U2VhcmNoJykpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVzZXQgdGhlIHNlYXJjaFxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHNlYXJjaF9lbGVcbiAgICAgKiBAcmV0dXJucyB2b2lkXG4gICAgICovXG4gICAgcmVzZXRTZWFyY2goc2VhcmNoX2VsZTogSFRNTEVsZW1lbnQpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zZWFyY2hRdWVyeSA9IG51bGw7XG4gICAgICAgIHNlYXJjaF9lbGUuZm9jdXMoKTtcbiAgICAgICAgdGhpcy5mb2N1c09uU2ltcGxlID0gJ2luYWN0aXZlJztcbiAgICAgICAgdGhpcy5zZWFyY2hQYW5lbEZvY3VzID0gIXRoaXMuc2VhcmNoUGFuZWxGb2N1cztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZWFsaXNlIGEgcHJldmlvdXMgc2VhcmNoXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHF1ZXJ5XG4gICAgICogQHJldHVybnMgdm9pZFxuICAgICAqL1xuICAgIGRvUHJldlNlYXJjaChxdWVyeTogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc2VhcmNoUXVlcnkgPSBxdWVyeTtcbiAgICAgICAgdGhpcy5fcm91dGVyLm5hdmlnYXRlKFt0aGlzLnJvdXRlICsgJy9mdWxsdGV4dC8nICsgcXVlcnldLCB7IHJlbGF0aXZlVG86IHRoaXMuX3JvdXRlIH0pO1xuICAgICAgICB0aGlzLnRvZ2dsZU1lbnUoJ3NpbXBsZVNlYXJjaCcpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlc2V0IHByZXZpb3VzIHNlYXJjaGVzIC0gdGhlIHdob2xlIHByZXZpb3VzIHNlYXJjaCBvciBzcGVjaWZpYyBpdGVtIGJ5IG5hbWVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSB0ZXJtIG9mIHRoZSBzZWFyY2hcbiAgICAgKiBAcmV0dXJucyB2b2lkXG4gICAgICovXG4gICAgcmVzZXRQcmV2U2VhcmNoKG5hbWU6IHN0cmluZyA9IG51bGwpOiB2b2lkIHtcbiAgICAgICAgaWYgKG5hbWUpIHtcbiAgICAgICAgICAgIC8vIGRlbGV0ZSBvbmx5IHRoaXMgaXRlbSB3aXRoIHRoZSBuYW1lIC4uLlxuICAgICAgICAgICAgY29uc3QgaTogbnVtYmVyID0gdGhpcy5wcmV2U2VhcmNoLmluZGV4T2YobmFtZSk7XG4gICAgICAgICAgICB0aGlzLnByZXZTZWFyY2guc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3ByZXZTZWFyY2gnLCBKU09OLnN0cmluZ2lmeSh0aGlzLnByZXZTZWFyY2gpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGRlbGV0ZSB0aGUgd2hvbGUgXCJwcmV2aW91cyBzZWFyY2hcIiBhcnJheVxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ3ByZXZTZWFyY2gnKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnByZXZTZWFyY2ggPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdwcmV2U2VhcmNoJykpO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0IHNpbXBsZSBmb2N1cyB0byBhY3RpdmVcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHZvaWRcbiAgICAgKi9cbiAgICBzZXRGb2N1cygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5wcmV2U2VhcmNoID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncHJldlNlYXJjaCcpKTtcbiAgICAgICAgdGhpcy5mb2N1c09uU2ltcGxlID0gJ2FjdGl2ZSc7XG4gICAgICAgIHRoaXMuc2VhcmNoUGFuZWxGb2N1cyA9ICF0aGlzLnNlYXJjaFBhbmVsRm9jdXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3dpdGNoIGFjY29yZGluZyB0byB0aGUgZm9jdXMgYmV0d2VlbiBzaW1wbGUgb3IgZXh0ZW5kZWQgc2VhcmNoXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAyIGNhc2VzOiBzaW1wbGVTZWFyY2ggb3IgZXh0ZW5kZWRTZWFyY2hcbiAgICAgKiBAcmV0dXJucyB2b2lkXG4gICAgICovXG4gICAgdG9nZ2xlTWVudShuYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgc3dpdGNoIChuYW1lKSB7XG4gICAgICAgICAgICBjYXNlICdzaW1wbGVTZWFyY2gnOlxuICAgICAgICAgICAgICAgIHRoaXMucHJldlNlYXJjaCA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3ByZXZTZWFyY2gnKSk7XG4gICAgICAgICAgICAgICAgdGhpcy5mb2N1c09uU2ltcGxlID0gKHRoaXMuZm9jdXNPblNpbXBsZSA9PT0gJ2FjdGl2ZScgPyAnaW5hY3RpdmUnIDogJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2hvd1NpbXBsZVNlYXJjaCA9IHRydWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdleHRlbmRlZFNlYXJjaCc6XG4gICAgICAgICAgICAgICAgdGhpcy5mb2N1c09uRXh0ZW5kZWQgPSAodGhpcy5mb2N1c09uRXh0ZW5kZWQgPT09ICdhY3RpdmUnID8gJ2luYWN0aXZlJyA6ICdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dTaW1wbGVTZWFyY2ggPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==