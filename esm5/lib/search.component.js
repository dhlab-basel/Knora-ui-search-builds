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
        { type: Component, args: [{
                    selector: 'kui-search',
                    template: "<div class=\"search-bar-elements\">\n\n    <!-- the next element - div.extended-search-panel - is a hidden dropdown filter menu -->\n\n    <div class=\"search-panel\" [class.active]=\"searchPanelFocus\">\n        <div>\n            <button class=\"prefix\" (click)=\"doSearch(search)\">\n                <mat-icon>search</mat-icon>\n            </button>\n        </div>\n\n        <div class=\"input-field\">\n            <input #search autocomplete=\"off\" type=\"search\" [placeholder]=\"searchLabel\" [(ngModel)]=\"searchQuery\" name=\"search\" (keyup.esc)=\"resetSearch(search)\" (keyup)=\"onKey(search, $event)\" (click)=\"setFocus()\" (focus)=\"toggleMenu('simpleSearch')\" [disabled]=\"focusOnExtended === 'active'\" />\n        </div>\n\n        <!-- switch button: on some focus we need a close button for the simple or extended panel -->\n        <div>\n            <button class=\"suffix\" *ngIf=\"focusOnSimple === 'active'\" (click)=\"resetSearch(search)\">\n                <mat-icon>close</mat-icon>\n            </button>\n            <button class=\"suffix\" *ngIf=\"focusOnSimple === 'inactive'\">\n            </button>\n        </div>\n\n        <!-- the search panel has two \"dropdown\" menus: one for simple search and another one for the extended search -->\n        <div class=\"kui-menu simple-search\" [@simpleSearchMenu]=\"focusOnSimple\" *ngIf=\"showSimpleSearch\">\n            <mat-list class=\"kui-previous-search-list\">\n                <mat-list-item *ngFor=\"let item of prevSearch | kuiReverse; let i=index\">\n                    <h4 mat-line *ngIf=\"i<10\" (click)=\"doPrevSearch(item)\">{{item}}</h4>\n                    <button mat-icon-button (click)=\"resetPrevSearch(item)\">\n                        <mat-icon aria-label=\"close\">close</mat-icon>\n                    </button>\n                </mat-list-item>\n            </mat-list>\n            <button mat-stroked-button color=\"accent\" class=\"right\" (click)=\"resetPrevSearch()\" *ngIf=\"prevSearch\">Clear</button>\n        </div>\n\n        <div class=\"kui-menu extended-search\" [@extendedSearchMenu]=\"focusOnExtended\">\n            <div class=\"kui-menu-header\">\n                <span class=\"kui-menu-title\">\n                    <h4>Advanced search</h4>\n                </span>\n                <span class=\"kui-menu-action\">\n                    <button mat-icon-button (click)=\"toggleMenu('extendedSearch')\">\n                        <mat-icon>close</mat-icon>\n                    </button>\n                </span>\n            </div>\n            <div class=\"extended-search-box\">\n                <kui-extended-search [route]=\"route\" (toggleExtendedSearchForm)=\"toggleMenu('extendedSearch')\"></kui-extended-search>\n            </div>\n        </div>\n    </div>\n\n    <!-- Extended search button to display the extended search form in the search panel -->\n    <button mat-button type=\"button\" color=\"primary\" class=\"advanced-search-button\" (click)=\"toggleMenu('extendedSearch')\">\n        advanced\n    </button>\n\n</div>",
                    styles: ["input[type=search]::-webkit-search-cancel-button,input[type=search]::-webkit-search-decoration,input[type=search]::-webkit-search-results-button,input[type=search]::-webkit-search-results-decoration{display:none}input[type=search]{-moz-appearance:none;-webkit-appearance:none}.center{display:block;margin-left:auto;margin-right:auto}.close{right:12px}.extended-search-box{margin:12px}.advanced-search-button{margin-left:10px}.full-width{width:100%}.hide{display:none}.inactive,.mute{color:#7a7a7a}.search-panel{background-color:#f9f9f9;border-radius:4px;display:inline-flex;height:40px;position:relative;width:680px;z-index:10}.search-panel:hover{box-shadow:0 1px 3px rgba(0,0,0,.5)}.search-panel div.input-field{flex:1}.search-panel div.input-field input{border-style:none;font-size:14pt;height:38px;position:absolute;width:calc(100% - 80px)}.search-panel div.input-field input:active,.search-panel div.input-field input:focus{outline:0}.search-panel div .prefix,.search-panel div .suffix{background-color:#fff;border-radius:3px;border-style:none;color:rgba(41,41,41,.4);cursor:pointer;height:38px;outline:0;position:relative;width:40px}.search-panel div .prefix:active,.search-panel div .suffix:active{color:#515151}.search-panel.active{box-shadow:0 1px 3px rgba(0,0,0,.5)}.kui-menu{box-shadow:0 3px 5px -1px rgba(11,11,11,.2),0 6px 10px 0 rgba(11,11,11,.14),0 1px 18px 0 rgba(11,11,11,.12);background-color:#f9f9f9;border-radius:4px;position:absolute}.kui-menu .kui-menu-header{background-color:#f9f9f9;border-top-left-radius:4px;border-top-right-radius:4px;display:inline-block;height:48px;width:100%}.kui-menu .kui-menu-header .kui-menu-title{float:left;font-size:14px;font-weight:400;margin-top:4px;padding:12px}.kui-menu .kui-menu-header .kui-menu-action{float:right;margin:4px}.kui-menu.extended-search,.kui-menu.simple-search{min-height:680px;width:680px}.kui-menu.simple-search{padding-top:60px;z-index:-1}.kui-menu.simple-search .kui-previous-search-list .mat-list-item{cursor:pointer}.kui-menu.simple-search .kui-previous-search-list .mat-list-item:hover{background-color:#f9f9f9}.kui-menu.simple-search .kui-previous-search-list .mat-list-item:hover mat-icon{display:block}.kui-menu.simple-search .kui-previous-search-list .mat-list-item mat-icon{display:none}.kui-menu.simple-search .right{margin-top:12px;margin-left:16px}.kui-menu.extended-search{z-index:20}.search-bar-elements{display:flex;position:relative;z-index:100}.show{display:block}@media screen and (max-width:1024px){.search-panel{width:480px}.search-panel div.input-field input{width:calc(480px - 80px)}.kui-menu.extended-search,.kui-menu.simple-search{width:480px}}@media screen and (max-width:768px){.search-panel{width:calc(480px - 160px)}.search-panel div.input-field input{width:calc(480px - 160px - 80px)}.kui-menu.extended-search,.kui-menu.simple-search{width:calc(480px - 80px)}}"],
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VhcmNoLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Brbm9yYS9zZWFyY2gvIiwic291cmNlcyI6WyJsaWIvc2VhcmNoLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFVLE1BQU0sZUFBZSxDQUFDO0FBQ3JFLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDekQsT0FBTyxFQUNILE9BQU8sRUFDUCxLQUFLLEVBQ0wsS0FBSyxFQUNMLFVBQVUsRUFDVixPQUFPLEVBQ1YsTUFBTSxxQkFBcUIsQ0FBQztBQUU3QjtJQXVHSSx5QkFBb0IsTUFBc0IsRUFDOUIsT0FBZSxFQUNmLE9BQW1CO1FBRlgsV0FBTSxHQUFOLE1BQU0sQ0FBZ0I7UUFDOUIsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUNmLFlBQU8sR0FBUCxPQUFPLENBQVk7UUFqQnRCLFVBQUssR0FBVyxTQUFTLENBQUM7UUFJbkMscUJBQWdCLEdBQVksS0FBSyxDQUFDO1FBRWxDLGVBQVUsR0FBYSxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztRQUV0RSxrQkFBYSxHQUFXLFVBQVUsQ0FBQztRQUNuQyxvQkFBZSxHQUFXLFVBQVUsQ0FBQztRQUVyQyxnQkFBVyxHQUFXLFFBQVEsQ0FBQztRQUUvQixxQkFBZ0IsR0FBWSxJQUFJLENBQUM7SUFNakMsQ0FBQztJQUVELGtDQUFRLEdBQVI7SUFDQSxDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0gsK0JBQUssR0FBTCxVQUFNLFVBQXVCLEVBQUUsS0FBSztRQUNoQyxJQUFJLENBQUMsYUFBYSxHQUFHLFFBQVEsQ0FBQztRQUM5QixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1FBQ2pFLElBQUksSUFBSSxDQUFDLFdBQVcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUssT0FBTyxJQUFJLEtBQUssQ0FBQyxPQUFPLEtBQUssRUFBRSxJQUFJLEtBQUssQ0FBQyxLQUFLLEtBQUssRUFBRSxDQUFDLEVBQUU7WUFDM0YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUM3QjtRQUNELElBQUksS0FBSyxDQUFDLEdBQUcsS0FBSyxRQUFRLElBQUksS0FBSyxDQUFDLE9BQU8sS0FBSyxFQUFFLElBQUksS0FBSyxDQUFDLEtBQUssS0FBSyxFQUFFLEVBQUU7WUFDdEUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUNoQztJQUNMLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsa0NBQVEsR0FBUixVQUFTLFVBQXVCOztRQUM1QixJQUFJLElBQUksQ0FBQyxXQUFXLEtBQUssU0FBUyxJQUFJLElBQUksQ0FBQyxXQUFXLEtBQUssSUFBSSxFQUFFO1lBQzdELElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDaEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLFlBQVksR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUV0RSxnR0FBZ0c7WUFFaEcsa0ZBQWtGO1lBQ2xGLDJDQUEyQztZQUMzQyxJQUFJLGtCQUFrQixHQUFhLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1lBQ2xGLElBQUksa0JBQWtCLEtBQUssSUFBSSxFQUFFO2dCQUFFLGtCQUFrQixHQUFHLEVBQUUsQ0FBQzthQUFFO1lBQzdELElBQUksQ0FBQyxHQUFXLENBQUMsQ0FBQzs7Z0JBQ2xCLEtBQW9CLElBQUEsdUJBQUEsaUJBQUEsa0JBQWtCLENBQUEsc0RBQUEsc0ZBQUU7b0JBQW5DLElBQU0sS0FBSywrQkFBQTtvQkFDWixrQ0FBa0M7b0JBQ2xDLElBQUksSUFBSSxDQUFDLFdBQVcsS0FBSyxLQUFLLEVBQUU7d0JBQUUsa0JBQWtCLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztxQkFBRTtvQkFDcEUsQ0FBQyxFQUFFLENBQUM7aUJBQ1A7Ozs7Ozs7OztZQUVELGtCQUFrQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDMUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7WUFDdkUseUVBQXlFO1NBRTVFO2FBQU07WUFDSCxVQUFVLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDbkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztTQUNwRTtJQUNMLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSCxxQ0FBVyxHQUFYLFVBQVksVUFBdUI7UUFDL0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7UUFDeEIsVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ25CLElBQUksQ0FBQyxhQUFhLEdBQUcsVUFBVSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztJQUNuRCxDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0gsc0NBQVksR0FBWixVQUFhLEtBQWE7UUFDdEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7UUFDekIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLFlBQVksR0FBRyxLQUFLLENBQUMsRUFBRSxFQUFFLFVBQVUsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUN4RixJQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSCx5Q0FBZSxHQUFmLFVBQWdCLElBQW1CO1FBQW5CLHFCQUFBLEVBQUEsV0FBbUI7UUFDL0IsSUFBSSxJQUFJLEVBQUU7WUFDTiwwQ0FBMEM7WUFDMUMsSUFBTSxDQUFDLEdBQVcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDaEQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzdCLFlBQVksQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7U0FDdkU7YUFBTTtZQUNILDJDQUEyQztZQUMzQyxZQUFZLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDO1NBQ3pDO1FBQ0QsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztJQUVyRSxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxrQ0FBUSxHQUFSO1FBQ0ksSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztRQUNqRSxJQUFJLENBQUMsYUFBYSxHQUFHLFFBQVEsQ0FBQztRQUM5QixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7SUFDbkQsQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDSCxvQ0FBVSxHQUFWLFVBQVcsSUFBWTtRQUNuQixRQUFRLElBQUksRUFBRTtZQUNWLEtBQUssY0FBYztnQkFDZixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO2dCQUNqRSxJQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsSUFBSSxDQUFDLGFBQWEsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQy9FLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7Z0JBQzdCLE1BQU07WUFDVixLQUFLLGdCQUFnQjtnQkFDakIsSUFBSSxDQUFDLGVBQWUsR0FBRyxDQUFDLElBQUksQ0FBQyxlQUFlLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUNuRixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO2dCQUM5QixNQUFNO1NBQ2I7SUFDTCxDQUFDOztnQkFuUEosU0FBUyxTQUFDO29CQUNQLFFBQVEsRUFBRSxZQUFZO29CQUN0QixRQUFRLEVBQUUsZ2dHQTJEUDtvQkFDSCxNQUFNLEVBQUUsQ0FBQyxvekZBQW96RixDQUFDO29CQUM5ekYsVUFBVSxFQUFFO3dCQUNSLE9BQU8sQ0FBQyxrQkFBa0IsRUFDdEI7NEJBQ0ksS0FBSyxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQzs0QkFDN0MsS0FBSyxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQzs0QkFDNUMsVUFBVSxDQUFDLGtCQUFrQixFQUFFLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQzs0QkFDeEQsVUFBVSxDQUFDLGtCQUFrQixFQUFFLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO3lCQUM1RCxDQUNKO3dCQUNELE9BQU8sQ0FBQyxvQkFBb0IsRUFDeEI7NEJBQ0ksS0FBSyxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQzs0QkFDN0MsS0FBSyxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQzs0QkFDNUMsVUFBVSxDQUFDLGtCQUFrQixFQUFFLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQzs0QkFDeEQsVUFBVSxDQUFDLGtCQUFrQixFQUFFLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO3lCQUM1RCxDQUNKO3FCQUNKO2lCQUNKOzs7Z0JBMUZRLGNBQWM7Z0JBQUUsTUFBTTtnQkFEWCxVQUFVOzs7d0JBa0d6QixLQUFLOztJQTRKVixzQkFBQztDQUFBLEFBcFBELElBb1BDO1NBOUpZLGVBQWUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEVsZW1lbnRSZWYsIElucHV0LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFjdGl2YXRlZFJvdXRlLCBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHtcbiAgICBhbmltYXRlLFxuICAgIHN0YXRlLFxuICAgIHN0eWxlLFxuICAgIHRyYW5zaXRpb24sXG4gICAgdHJpZ2dlclxufSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdrdWktc2VhcmNoJyxcbiAgICB0ZW1wbGF0ZTogYDxkaXYgY2xhc3M9XCJzZWFyY2gtYmFyLWVsZW1lbnRzXCI+XG5cbiAgICA8IS0tIHRoZSBuZXh0IGVsZW1lbnQgLSBkaXYuZXh0ZW5kZWQtc2VhcmNoLXBhbmVsIC0gaXMgYSBoaWRkZW4gZHJvcGRvd24gZmlsdGVyIG1lbnUgLS0+XG5cbiAgICA8ZGl2IGNsYXNzPVwic2VhcmNoLXBhbmVsXCIgW2NsYXNzLmFjdGl2ZV09XCJzZWFyY2hQYW5lbEZvY3VzXCI+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwicHJlZml4XCIgKGNsaWNrKT1cImRvU2VhcmNoKHNlYXJjaClcIj5cbiAgICAgICAgICAgICAgICA8bWF0LWljb24+c2VhcmNoPC9tYXQtaWNvbj5cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8ZGl2IGNsYXNzPVwiaW5wdXQtZmllbGRcIj5cbiAgICAgICAgICAgIDxpbnB1dCAjc2VhcmNoIGF1dG9jb21wbGV0ZT1cIm9mZlwiIHR5cGU9XCJzZWFyY2hcIiBbcGxhY2Vob2xkZXJdPVwic2VhcmNoTGFiZWxcIiBbKG5nTW9kZWwpXT1cInNlYXJjaFF1ZXJ5XCIgbmFtZT1cInNlYXJjaFwiIChrZXl1cC5lc2MpPVwicmVzZXRTZWFyY2goc2VhcmNoKVwiIChrZXl1cCk9XCJvbktleShzZWFyY2gsICRldmVudClcIiAoY2xpY2spPVwic2V0Rm9jdXMoKVwiIChmb2N1cyk9XCJ0b2dnbGVNZW51KCdzaW1wbGVTZWFyY2gnKVwiIFtkaXNhYmxlZF09XCJmb2N1c09uRXh0ZW5kZWQgPT09ICdhY3RpdmUnXCIgLz5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPCEtLSBzd2l0Y2ggYnV0dG9uOiBvbiBzb21lIGZvY3VzIHdlIG5lZWQgYSBjbG9zZSBidXR0b24gZm9yIHRoZSBzaW1wbGUgb3IgZXh0ZW5kZWQgcGFuZWwgLS0+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwic3VmZml4XCIgKm5nSWY9XCJmb2N1c09uU2ltcGxlID09PSAnYWN0aXZlJ1wiIChjbGljayk9XCJyZXNldFNlYXJjaChzZWFyY2gpXCI+XG4gICAgICAgICAgICAgICAgPG1hdC1pY29uPmNsb3NlPC9tYXQtaWNvbj5cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cInN1ZmZpeFwiICpuZ0lmPVwiZm9jdXNPblNpbXBsZSA9PT0gJ2luYWN0aXZlJ1wiPlxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDwhLS0gdGhlIHNlYXJjaCBwYW5lbCBoYXMgdHdvIFwiZHJvcGRvd25cIiBtZW51czogb25lIGZvciBzaW1wbGUgc2VhcmNoIGFuZCBhbm90aGVyIG9uZSBmb3IgdGhlIGV4dGVuZGVkIHNlYXJjaCAtLT5cbiAgICAgICAgPGRpdiBjbGFzcz1cImt1aS1tZW51IHNpbXBsZS1zZWFyY2hcIiBbQHNpbXBsZVNlYXJjaE1lbnVdPVwiZm9jdXNPblNpbXBsZVwiICpuZ0lmPVwic2hvd1NpbXBsZVNlYXJjaFwiPlxuICAgICAgICAgICAgPG1hdC1saXN0IGNsYXNzPVwia3VpLXByZXZpb3VzLXNlYXJjaC1saXN0XCI+XG4gICAgICAgICAgICAgICAgPG1hdC1saXN0LWl0ZW0gKm5nRm9yPVwibGV0IGl0ZW0gb2YgcHJldlNlYXJjaCB8IGt1aVJldmVyc2U7IGxldCBpPWluZGV4XCI+XG4gICAgICAgICAgICAgICAgICAgIDxoNCBtYXQtbGluZSAqbmdJZj1cImk8MTBcIiAoY2xpY2spPVwiZG9QcmV2U2VhcmNoKGl0ZW0pXCI+e3tpdGVtfX08L2g0PlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIG1hdC1pY29uLWJ1dHRvbiAoY2xpY2spPVwicmVzZXRQcmV2U2VhcmNoKGl0ZW0pXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bWF0LWljb24gYXJpYS1sYWJlbD1cImNsb3NlXCI+Y2xvc2U8L21hdC1pY29uPlxuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L21hdC1saXN0LWl0ZW0+XG4gICAgICAgICAgICA8L21hdC1saXN0PlxuICAgICAgICAgICAgPGJ1dHRvbiBtYXQtc3Ryb2tlZC1idXR0b24gY29sb3I9XCJhY2NlbnRcIiBjbGFzcz1cInJpZ2h0XCIgKGNsaWNrKT1cInJlc2V0UHJldlNlYXJjaCgpXCIgKm5nSWY9XCJwcmV2U2VhcmNoXCI+Q2xlYXI8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBjbGFzcz1cImt1aS1tZW51IGV4dGVuZGVkLXNlYXJjaFwiIFtAZXh0ZW5kZWRTZWFyY2hNZW51XT1cImZvY3VzT25FeHRlbmRlZFwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImt1aS1tZW51LWhlYWRlclwiPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwia3VpLW1lbnUtdGl0bGVcIj5cbiAgICAgICAgICAgICAgICAgICAgPGg0PkFkdmFuY2VkIHNlYXJjaDwvaDQ+XG4gICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwia3VpLW1lbnUtYWN0aW9uXCI+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gbWF0LWljb24tYnV0dG9uIChjbGljayk9XCJ0b2dnbGVNZW51KCdleHRlbmRlZFNlYXJjaCcpXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bWF0LWljb24+Y2xvc2U8L21hdC1pY29uPlxuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJleHRlbmRlZC1zZWFyY2gtYm94XCI+XG4gICAgICAgICAgICAgICAgPGt1aS1leHRlbmRlZC1zZWFyY2ggW3JvdXRlXT1cInJvdXRlXCIgKHRvZ2dsZUV4dGVuZGVkU2VhcmNoRm9ybSk9XCJ0b2dnbGVNZW51KCdleHRlbmRlZFNlYXJjaCcpXCI+PC9rdWktZXh0ZW5kZWQtc2VhcmNoPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuXG4gICAgPCEtLSBFeHRlbmRlZCBzZWFyY2ggYnV0dG9uIHRvIGRpc3BsYXkgdGhlIGV4dGVuZGVkIHNlYXJjaCBmb3JtIGluIHRoZSBzZWFyY2ggcGFuZWwgLS0+XG4gICAgPGJ1dHRvbiBtYXQtYnV0dG9uIHR5cGU9XCJidXR0b25cIiBjb2xvcj1cInByaW1hcnlcIiBjbGFzcz1cImFkdmFuY2VkLXNlYXJjaC1idXR0b25cIiAoY2xpY2spPVwidG9nZ2xlTWVudSgnZXh0ZW5kZWRTZWFyY2gnKVwiPlxuICAgICAgICBhZHZhbmNlZFxuICAgIDwvYnV0dG9uPlxuXG48L2Rpdj5gLFxuICAgIHN0eWxlczogW2BpbnB1dFt0eXBlPXNlYXJjaF06Oi13ZWJraXQtc2VhcmNoLWNhbmNlbC1idXR0b24saW5wdXRbdHlwZT1zZWFyY2hdOjotd2Via2l0LXNlYXJjaC1kZWNvcmF0aW9uLGlucHV0W3R5cGU9c2VhcmNoXTo6LXdlYmtpdC1zZWFyY2gtcmVzdWx0cy1idXR0b24saW5wdXRbdHlwZT1zZWFyY2hdOjotd2Via2l0LXNlYXJjaC1yZXN1bHRzLWRlY29yYXRpb257ZGlzcGxheTpub25lfWlucHV0W3R5cGU9c2VhcmNoXXstbW96LWFwcGVhcmFuY2U6bm9uZTstd2Via2l0LWFwcGVhcmFuY2U6bm9uZX0uY2VudGVye2Rpc3BsYXk6YmxvY2s7bWFyZ2luLWxlZnQ6YXV0bzttYXJnaW4tcmlnaHQ6YXV0b30uY2xvc2V7cmlnaHQ6MTJweH0uZXh0ZW5kZWQtc2VhcmNoLWJveHttYXJnaW46MTJweH0uYWR2YW5jZWQtc2VhcmNoLWJ1dHRvbnttYXJnaW4tbGVmdDoxMHB4fS5mdWxsLXdpZHRoe3dpZHRoOjEwMCV9LmhpZGV7ZGlzcGxheTpub25lfS5pbmFjdGl2ZSwubXV0ZXtjb2xvcjojN2E3YTdhfS5zZWFyY2gtcGFuZWx7YmFja2dyb3VuZC1jb2xvcjojZjlmOWY5O2JvcmRlci1yYWRpdXM6NHB4O2Rpc3BsYXk6aW5saW5lLWZsZXg7aGVpZ2h0OjQwcHg7cG9zaXRpb246cmVsYXRpdmU7d2lkdGg6NjgwcHg7ei1pbmRleDoxMH0uc2VhcmNoLXBhbmVsOmhvdmVye2JveC1zaGFkb3c6MCAxcHggM3B4IHJnYmEoMCwwLDAsLjUpfS5zZWFyY2gtcGFuZWwgZGl2LmlucHV0LWZpZWxke2ZsZXg6MX0uc2VhcmNoLXBhbmVsIGRpdi5pbnB1dC1maWVsZCBpbnB1dHtib3JkZXItc3R5bGU6bm9uZTtmb250LXNpemU6MTRwdDtoZWlnaHQ6MzhweDtwb3NpdGlvbjphYnNvbHV0ZTt3aWR0aDpjYWxjKDEwMCUgLSA4MHB4KX0uc2VhcmNoLXBhbmVsIGRpdi5pbnB1dC1maWVsZCBpbnB1dDphY3RpdmUsLnNlYXJjaC1wYW5lbCBkaXYuaW5wdXQtZmllbGQgaW5wdXQ6Zm9jdXN7b3V0bGluZTowfS5zZWFyY2gtcGFuZWwgZGl2IC5wcmVmaXgsLnNlYXJjaC1wYW5lbCBkaXYgLnN1ZmZpeHtiYWNrZ3JvdW5kLWNvbG9yOiNmZmY7Ym9yZGVyLXJhZGl1czozcHg7Ym9yZGVyLXN0eWxlOm5vbmU7Y29sb3I6cmdiYSg0MSw0MSw0MSwuNCk7Y3Vyc29yOnBvaW50ZXI7aGVpZ2h0OjM4cHg7b3V0bGluZTowO3Bvc2l0aW9uOnJlbGF0aXZlO3dpZHRoOjQwcHh9LnNlYXJjaC1wYW5lbCBkaXYgLnByZWZpeDphY3RpdmUsLnNlYXJjaC1wYW5lbCBkaXYgLnN1ZmZpeDphY3RpdmV7Y29sb3I6IzUxNTE1MX0uc2VhcmNoLXBhbmVsLmFjdGl2ZXtib3gtc2hhZG93OjAgMXB4IDNweCByZ2JhKDAsMCwwLC41KX0ua3VpLW1lbnV7Ym94LXNoYWRvdzowIDNweCA1cHggLTFweCByZ2JhKDExLDExLDExLC4yKSwwIDZweCAxMHB4IDAgcmdiYSgxMSwxMSwxMSwuMTQpLDAgMXB4IDE4cHggMCByZ2JhKDExLDExLDExLC4xMik7YmFja2dyb3VuZC1jb2xvcjojZjlmOWY5O2JvcmRlci1yYWRpdXM6NHB4O3Bvc2l0aW9uOmFic29sdXRlfS5rdWktbWVudSAua3VpLW1lbnUtaGVhZGVye2JhY2tncm91bmQtY29sb3I6I2Y5ZjlmOTtib3JkZXItdG9wLWxlZnQtcmFkaXVzOjRweDtib3JkZXItdG9wLXJpZ2h0LXJhZGl1czo0cHg7ZGlzcGxheTppbmxpbmUtYmxvY2s7aGVpZ2h0OjQ4cHg7d2lkdGg6MTAwJX0ua3VpLW1lbnUgLmt1aS1tZW51LWhlYWRlciAua3VpLW1lbnUtdGl0bGV7ZmxvYXQ6bGVmdDtmb250LXNpemU6MTRweDtmb250LXdlaWdodDo0MDA7bWFyZ2luLXRvcDo0cHg7cGFkZGluZzoxMnB4fS5rdWktbWVudSAua3VpLW1lbnUtaGVhZGVyIC5rdWktbWVudS1hY3Rpb257ZmxvYXQ6cmlnaHQ7bWFyZ2luOjRweH0ua3VpLW1lbnUuZXh0ZW5kZWQtc2VhcmNoLC5rdWktbWVudS5zaW1wbGUtc2VhcmNoe21pbi1oZWlnaHQ6NjgwcHg7d2lkdGg6NjgwcHh9Lmt1aS1tZW51LnNpbXBsZS1zZWFyY2h7cGFkZGluZy10b3A6NjBweDt6LWluZGV4Oi0xfS5rdWktbWVudS5zaW1wbGUtc2VhcmNoIC5rdWktcHJldmlvdXMtc2VhcmNoLWxpc3QgLm1hdC1saXN0LWl0ZW17Y3Vyc29yOnBvaW50ZXJ9Lmt1aS1tZW51LnNpbXBsZS1zZWFyY2ggLmt1aS1wcmV2aW91cy1zZWFyY2gtbGlzdCAubWF0LWxpc3QtaXRlbTpob3ZlcntiYWNrZ3JvdW5kLWNvbG9yOiNmOWY5Zjl9Lmt1aS1tZW51LnNpbXBsZS1zZWFyY2ggLmt1aS1wcmV2aW91cy1zZWFyY2gtbGlzdCAubWF0LWxpc3QtaXRlbTpob3ZlciBtYXQtaWNvbntkaXNwbGF5OmJsb2NrfS5rdWktbWVudS5zaW1wbGUtc2VhcmNoIC5rdWktcHJldmlvdXMtc2VhcmNoLWxpc3QgLm1hdC1saXN0LWl0ZW0gbWF0LWljb257ZGlzcGxheTpub25lfS5rdWktbWVudS5zaW1wbGUtc2VhcmNoIC5yaWdodHttYXJnaW4tdG9wOjEycHg7bWFyZ2luLWxlZnQ6MTZweH0ua3VpLW1lbnUuZXh0ZW5kZWQtc2VhcmNoe3otaW5kZXg6MjB9LnNlYXJjaC1iYXItZWxlbWVudHN7ZGlzcGxheTpmbGV4O3Bvc2l0aW9uOnJlbGF0aXZlO3otaW5kZXg6MTAwfS5zaG93e2Rpc3BsYXk6YmxvY2t9QG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDoxMDI0cHgpey5zZWFyY2gtcGFuZWx7d2lkdGg6NDgwcHh9LnNlYXJjaC1wYW5lbCBkaXYuaW5wdXQtZmllbGQgaW5wdXR7d2lkdGg6Y2FsYyg0ODBweCAtIDgwcHgpfS5rdWktbWVudS5leHRlbmRlZC1zZWFyY2gsLmt1aS1tZW51LnNpbXBsZS1zZWFyY2h7d2lkdGg6NDgwcHh9fUBtZWRpYSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6NzY4cHgpey5zZWFyY2gtcGFuZWx7d2lkdGg6Y2FsYyg0ODBweCAtIDE2MHB4KX0uc2VhcmNoLXBhbmVsIGRpdi5pbnB1dC1maWVsZCBpbnB1dHt3aWR0aDpjYWxjKDQ4MHB4IC0gMTYwcHggLSA4MHB4KX0ua3VpLW1lbnUuZXh0ZW5kZWQtc2VhcmNoLC5rdWktbWVudS5zaW1wbGUtc2VhcmNoe3dpZHRoOmNhbGMoNDgwcHggLSA4MHB4KX19YF0sXG4gICAgYW5pbWF0aW9uczogW1xuICAgICAgICB0cmlnZ2VyKCdzaW1wbGVTZWFyY2hNZW51JyxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICBzdGF0ZSgnaW5hY3RpdmUnLCBzdHlsZSh7IGRpc3BsYXk6ICdub25lJyB9KSksXG4gICAgICAgICAgICAgICAgc3RhdGUoJ2FjdGl2ZScsIHN0eWxlKHsgZGlzcGxheTogJ2Jsb2NrJyB9KSksXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbignaW5hY3RpdmUgPT4gdHJ1ZScsIGFuaW1hdGUoJzEwMG1zIGVhc2UtaW4nKSksXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbigndHJ1ZSA9PiBpbmFjdGl2ZScsIGFuaW1hdGUoJzEwMG1zIGVhc2Utb3V0JykpXG4gICAgICAgICAgICBdXG4gICAgICAgICksXG4gICAgICAgIHRyaWdnZXIoJ2V4dGVuZGVkU2VhcmNoTWVudScsXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgc3RhdGUoJ2luYWN0aXZlJywgc3R5bGUoeyBkaXNwbGF5OiAnbm9uZScgfSkpLFxuICAgICAgICAgICAgICAgIHN0YXRlKCdhY3RpdmUnLCBzdHlsZSh7IGRpc3BsYXk6ICdibG9jaycgfSkpLFxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb24oJ2luYWN0aXZlID0+IHRydWUnLCBhbmltYXRlKCcxMDBtcyBlYXNlLWluJykpLFxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb24oJ3RydWUgPT4gaW5hY3RpdmUnLCBhbmltYXRlKCcxMDBtcyBlYXNlLW91dCcpKVxuICAgICAgICAgICAgXVxuICAgICAgICApLFxuICAgIF1cbn0pXG5cbi8qKlxuICogQ29udGFpbnMgbWV0aG9kcyB0byByZWFsaXNlLCByZXNldCBuZXcgb3IgcHJldmlvdXMgc2ltcGxlIHNlYXJjaGVzLlxuICovXG5leHBvcnQgY2xhc3MgU2VhcmNoQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcblxuICAgIEBJbnB1dCgpIHJvdXRlOiBzdHJpbmcgPSAnL3NlYXJjaCc7XG5cbiAgICBzZWFyY2hRdWVyeTogc3RyaW5nO1xuXG4gICAgc2VhcmNoUGFuZWxGb2N1czogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgcHJldlNlYXJjaDogc3RyaW5nW10gPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdwcmV2U2VhcmNoJykpO1xuXG4gICAgZm9jdXNPblNpbXBsZTogc3RyaW5nID0gJ2luYWN0aXZlJztcbiAgICBmb2N1c09uRXh0ZW5kZWQ6IHN0cmluZyA9ICdpbmFjdGl2ZSc7XG5cbiAgICBzZWFyY2hMYWJlbDogc3RyaW5nID0gJ1NlYXJjaCc7XG5cbiAgICBzaG93U2ltcGxlU2VhcmNoOiBib29sZWFuID0gdHJ1ZTtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX3JvdXRlOiBBY3RpdmF0ZWRSb3V0ZSxcbiAgICAgICAgcHJpdmF0ZSBfcm91dGVyOiBSb3V0ZXIsXG4gICAgICAgIHByaXZhdGUgX2VsZVJlZjogRWxlbWVudFJlZikge1xuXG4gICAgfVxuXG4gICAgbmdPbkluaXQoKSB7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGlnbm9yZVxuICAgICAqIERvIHNlYXJjaCBvbiBFbnRlciBjbGljaywgcmVzZXQgc2VhcmNoIG9uIEVzY2FwZVxuICAgICAqIEBwYXJhbSBzZWFyY2hfZWxlXG4gICAgICogQHBhcmFtIGV2ZW50XG4gICAgICogQHJldHVybnMgdm9pZFxuICAgICAqL1xuICAgIG9uS2V5KHNlYXJjaF9lbGU6IEhUTUxFbGVtZW50LCBldmVudCk6IHZvaWQge1xuICAgICAgICB0aGlzLmZvY3VzT25TaW1wbGUgPSAnYWN0aXZlJztcbiAgICAgICAgdGhpcy5wcmV2U2VhcmNoID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncHJldlNlYXJjaCcpKTtcbiAgICAgICAgaWYgKHRoaXMuc2VhcmNoUXVlcnkgJiYgKGV2ZW50LmtleSA9PT0gJ0VudGVyJyB8fCBldmVudC5rZXlDb2RlID09PSAxMyB8fCBldmVudC53aGljaCA9PT0gMTMpKSB7XG4gICAgICAgICAgICB0aGlzLmRvU2VhcmNoKHNlYXJjaF9lbGUpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChldmVudC5rZXkgPT09ICdFc2NhcGUnIHx8IGV2ZW50LmtleUNvZGUgPT09IDI3IHx8IGV2ZW50LndoaWNoID09PSAyNykge1xuICAgICAgICAgICAgdGhpcy5yZXNldFNlYXJjaChzZWFyY2hfZWxlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlYWxpc2UgYSBzaW1wbGUgc2VhcmNoXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gc2VhcmNoX2VsZVxuICAgICAqIEByZXR1cm5zIHZvaWRcbiAgICAgKi9cbiAgICBkb1NlYXJjaChzZWFyY2hfZWxlOiBIVE1MRWxlbWVudCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5zZWFyY2hRdWVyeSAhPT0gdW5kZWZpbmVkICYmIHRoaXMuc2VhcmNoUXVlcnkgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMudG9nZ2xlTWVudSgnc2ltcGxlU2VhcmNoJyk7XG4gICAgICAgICAgICB0aGlzLl9yb3V0ZXIubmF2aWdhdGUoW3RoaXMucm91dGUgKyAnL2Z1bGx0ZXh0LycgKyB0aGlzLnNlYXJjaFF1ZXJ5XSk7XG5cbiAgICAgICAgICAgIC8vIHRoaXMuX3JvdXRlci5uYXZpZ2F0ZShbJy9zZWFyY2gvZnVsbHRleHQvJyArIHRoaXMuc2VhcmNoUXVlcnldLCB7IHJlbGF0aXZlVG86IHRoaXMuX3JvdXRlIH0pO1xuXG4gICAgICAgICAgICAvLyBwdXNoIHRoZSBzZWFyY2ggcXVlcnkgaW50byB0aGUgbG9jYWwgc3RvcmFnZSBwcmV2U2VhcmNoIGFycmF5IChwcmV2aW91cyBzZWFyY2gpXG4gICAgICAgICAgICAvLyB0byBoYXZlIGEgbGlzdCBvZiByZWNlbnQgc2VhcmNoIHJlcXVlc3RzXG4gICAgICAgICAgICBsZXQgZXhpc3RpbmdQcmV2U2VhcmNoOiBzdHJpbmdbXSA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3ByZXZTZWFyY2gnKSk7XG4gICAgICAgICAgICBpZiAoZXhpc3RpbmdQcmV2U2VhcmNoID09PSBudWxsKSB7IGV4aXN0aW5nUHJldlNlYXJjaCA9IFtdOyB9XG4gICAgICAgICAgICBsZXQgaTogbnVtYmVyID0gMDtcbiAgICAgICAgICAgIGZvciAoY29uc3QgZW50cnkgb2YgZXhpc3RpbmdQcmV2U2VhcmNoKSB7XG4gICAgICAgICAgICAgICAgLy8gcmVtb3ZlIGVudHJ5LCBpZiBleGlzdHMgYWxyZWFkeVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNlYXJjaFF1ZXJ5ID09PSBlbnRyeSkgeyBleGlzdGluZ1ByZXZTZWFyY2guc3BsaWNlKGksIDEpOyB9XG4gICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBleGlzdGluZ1ByZXZTZWFyY2gucHVzaCh0aGlzLnNlYXJjaFF1ZXJ5KTtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdwcmV2U2VhcmNoJywgSlNPTi5zdHJpbmdpZnkoZXhpc3RpbmdQcmV2U2VhcmNoKSk7XG4gICAgICAgICAgICAvLyBUT0RPOiBzYXZlIHRoZSBwcmV2aW91cyBzZWFyY2ggcXVlcmllcyBzb21ld2hlcmUgaW4gdGhlIHVzZXIncyBwcm9maWxlXG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNlYXJjaF9lbGUuZm9jdXMoKTtcbiAgICAgICAgICAgIHRoaXMucHJldlNlYXJjaCA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3ByZXZTZWFyY2gnKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaWdub3JlXG4gICAgICpcbiAgICAgKiBSZXNldCB0aGUgc2VhcmNoXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gc2VhcmNoX2VsZVxuICAgICAqIEByZXR1cm5zIHZvaWRcbiAgICAgKi9cbiAgICByZXNldFNlYXJjaChzZWFyY2hfZWxlOiBIVE1MRWxlbWVudCk6IHZvaWQge1xuICAgICAgICB0aGlzLnNlYXJjaFF1ZXJ5ID0gbnVsbDtcbiAgICAgICAgc2VhcmNoX2VsZS5mb2N1cygpO1xuICAgICAgICB0aGlzLmZvY3VzT25TaW1wbGUgPSAnaW5hY3RpdmUnO1xuICAgICAgICB0aGlzLnNlYXJjaFBhbmVsRm9jdXMgPSAhdGhpcy5zZWFyY2hQYW5lbEZvY3VzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBpZ25vcmVcbiAgICAgKlxuICAgICAqIFJlYWxpc2UgYSBwcmV2aW91cyBzZWFyY2hcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcXVlcnlcbiAgICAgKiBAcmV0dXJucyB2b2lkXG4gICAgICovXG4gICAgZG9QcmV2U2VhcmNoKHF1ZXJ5OiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zZWFyY2hRdWVyeSA9IHF1ZXJ5O1xuICAgICAgICB0aGlzLl9yb3V0ZXIubmF2aWdhdGUoW3RoaXMucm91dGUgKyAnL2Z1bGx0ZXh0LycgKyBxdWVyeV0sIHsgcmVsYXRpdmVUbzogdGhpcy5fcm91dGUgfSk7XG4gICAgICAgIHRoaXMudG9nZ2xlTWVudSgnc2ltcGxlU2VhcmNoJyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGlnbm9yZVxuICAgICAqXG4gICAgICogUmVzZXQgcHJldmlvdXMgc2VhcmNoZXMgLSB0aGUgd2hvbGUgcHJldmlvdXMgc2VhcmNoIG9yIHNwZWNpZmljIGl0ZW0gYnkgbmFtZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIHRlcm0gb2YgdGhlIHNlYXJjaFxuICAgICAqIEByZXR1cm5zIHZvaWRcbiAgICAgKi9cbiAgICByZXNldFByZXZTZWFyY2gobmFtZTogc3RyaW5nID0gbnVsbCk6IHZvaWQge1xuICAgICAgICBpZiAobmFtZSkge1xuICAgICAgICAgICAgLy8gZGVsZXRlIG9ubHkgdGhpcyBpdGVtIHdpdGggdGhlIG5hbWUgLi4uXG4gICAgICAgICAgICBjb25zdCBpOiBudW1iZXIgPSB0aGlzLnByZXZTZWFyY2guaW5kZXhPZihuYW1lKTtcbiAgICAgICAgICAgIHRoaXMucHJldlNlYXJjaC5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncHJldlNlYXJjaCcsIEpTT04uc3RyaW5naWZ5KHRoaXMucHJldlNlYXJjaCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gZGVsZXRlIHRoZSB3aG9sZSBcInByZXZpb3VzIHNlYXJjaFwiIGFycmF5XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgncHJldlNlYXJjaCcpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucHJldlNlYXJjaCA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3ByZXZTZWFyY2gnKSk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaWdub3JlXG4gICAgICogU2V0IHNpbXBsZSBmb2N1cyB0byBhY3RpdmVcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHZvaWRcbiAgICAgKi9cbiAgICBzZXRGb2N1cygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5wcmV2U2VhcmNoID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncHJldlNlYXJjaCcpKTtcbiAgICAgICAgdGhpcy5mb2N1c09uU2ltcGxlID0gJ2FjdGl2ZSc7XG4gICAgICAgIHRoaXMuc2VhcmNoUGFuZWxGb2N1cyA9ICF0aGlzLnNlYXJjaFBhbmVsRm9jdXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGlnbm9yZVxuICAgICAqXG4gICAgICogU3dpdGNoIGFjY29yZGluZyB0byB0aGUgZm9jdXMgYmV0d2VlbiBzaW1wbGUgb3IgZXh0ZW5kZWQgc2VhcmNoXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAyIGNhc2VzOiBzaW1wbGVTZWFyY2ggb3IgZXh0ZW5kZWRTZWFyY2hcbiAgICAgKiBAcmV0dXJucyB2b2lkXG4gICAgICovXG4gICAgdG9nZ2xlTWVudShuYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgc3dpdGNoIChuYW1lKSB7XG4gICAgICAgICAgICBjYXNlICdzaW1wbGVTZWFyY2gnOlxuICAgICAgICAgICAgICAgIHRoaXMucHJldlNlYXJjaCA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3ByZXZTZWFyY2gnKSk7XG4gICAgICAgICAgICAgICAgdGhpcy5mb2N1c09uU2ltcGxlID0gKHRoaXMuZm9jdXNPblNpbXBsZSA9PT0gJ2FjdGl2ZScgPyAnaW5hY3RpdmUnIDogJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2hvd1NpbXBsZVNlYXJjaCA9IHRydWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdleHRlbmRlZFNlYXJjaCc6XG4gICAgICAgICAgICAgICAgdGhpcy5mb2N1c09uRXh0ZW5kZWQgPSAodGhpcy5mb2N1c09uRXh0ZW5kZWQgPT09ICdhY3RpdmUnID8gJ2luYWN0aXZlJyA6ICdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dTaW1wbGVTZWFyY2ggPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==