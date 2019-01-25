import * as tslib_1 from "tslib";
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
    FulltextSearchComponent.decorators = [
        { type: Component, args: [{
                    selector: 'kui-fulltext-search',
                    template: "<div class=\"search-bar-elements\">\n\n    <div class=\"fulltext-search-bar\" [class.active]=\"searchPanelFocus\">\n        <div>\n            <button class=\"prefix\" (click)=\"doSearch(search)\">\n                <mat-icon>search</mat-icon>\n            </button>\n        </div>\n\n        <div class=\"input-field\">\n            <input #search autocomplete=\"off\" type=\"search\" [placeholder]=\"searchLabel\" [(ngModel)]=\"searchQuery\" name=\"search\" (keyup.esc)=\"resetSearch(search)\" (keyup)=\"onKey(search, $event)\" (click)=\"setFocus()\" (focus)=\"toggleMenu()\" />\n        </div>\n\n        <!-- switch button: on some focus we need a close button for the simple -->\n        <div>\n            <button class=\"suffix\" *ngIf=\"focusOnSimple === 'active'\" (click)=\"resetSearch(search)\">\n                <mat-icon>close</mat-icon>\n            </button>\n            <button class=\"suffix\" *ngIf=\"focusOnSimple === 'inactive'\"></button>\n        </div>\n\n        <!-- \"dropdown\" menu for simple search -->\n        <div class=\"kui-menu simple-search\" [@fulltextSearchMenu]=\"focusOnSimple\" *ngIf=\"showSimpleSearch\">\n            <mat-list class=\"kui-previous-search-list\">\n                <mat-list-item *ngFor=\"let item of prevSearch | kuiReverse; let i=index\">\n                    <h4 mat-line *ngIf=\"i<10\" (click)=\"doPrevSearch(item)\">{{item}}</h4>\n                    <button mat-icon-button (click)=\"resetPrevSearch(item)\">\n                        <mat-icon aria-label=\"close\">close</mat-icon>\n                    </button>\n                </mat-list-item>\n            </mat-list>\n            <button mat-stroked-button color=\"accent\" class=\"right\" (click)=\"resetPrevSearch()\" *ngIf=\"prevSearch\">Clear</button>\n        </div>\n\n    </div>\n</div>",
                    styles: ["input[type=search]::-webkit-search-cancel-button,input[type=search]::-webkit-search-decoration,input[type=search]::-webkit-search-results-button,input[type=search]::-webkit-search-results-decoration{display:none}input[type=search]{-moz-appearance:none;-webkit-appearance:none}.full-width{width:100%}.close{right:12px}.hide{display:none}.show{display:block}.search-bar-elements{display:flex;position:relative;z-index:100}.inactive{color:#7a7a7a}.fulltext-search-bar{background-color:#f9f9f9;border-radius:4px;display:inline-flex;height:40px;position:relative;width:680px;z-index:10}.fulltext-search-bar:hover{box-shadow:0 1px 3px rgba(0,0,0,.5)}.fulltext-search-bar div.input-field{flex:1}.fulltext-search-bar div.input-field input{border-style:none;font-size:14pt;height:38px;position:absolute;width:calc(100% - 80px)}.fulltext-search-bar div.input-field input:active,.fulltext-search-bar div.input-field input:focus{outline:0}.fulltext-search-bar div .prefix,.fulltext-search-bar div .suffix{background-color:#fff;border-radius:3px;border-style:none;color:rgba(41,41,41,.4);cursor:pointer;height:38px;outline:0;position:relative;width:40px}.fulltext-search-bar div .prefix:active,.fulltext-search-bar div .suffix:active{color:#515151}.fulltext-search-bar div.active{box-shadow:0 1px 3px rgba(0,0,0,.5)}.kui-menu{box-shadow:0 3px 5px -1px rgba(11,11,11,.2),0 6px 10px 0 rgba(11,11,11,.14),0 1px 18px 0 rgba(11,11,11,.12);background-color:#f9f9f9;border-radius:4px;position:absolute}.kui-menu.simple-search{min-height:680px;width:680px;padding-top:60px;z-index:-1}.kui-menu.simple-search .kui-previous-search-list .mat-list-item{cursor:pointer}.kui-menu.simple-search .kui-previous-search-list .mat-list-item:hover{background-color:#f9f9f9}.kui-menu.simple-search .kui-previous-search-list .mat-list-item:hover mat-icon{display:block}.kui-menu.simple-search .kui-previous-search-list .mat-list-item mat-icon{display:none}.kui-menu.simple-search .right{margin-top:12px;margin-left:16px}@media screen and (max-width:1024px){.fulltext-search-bar{width:480px}.fulltext-search-bar div.input-field input{width:calc(480px - 80px)}.kui-menu.simple-search{width:480px}}@media screen and (max-width:768px){.fulltext-search-bar{width:calc(480px - 160px)}.fulltext-search-bar div.input-field input{width:calc(480px - 160px - 80px)}.kui-menu.simple-search{width:calc(480px - 80px)}}"],
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
    FulltextSearchComponent.ctorParameters = function () { return [
        { type: ActivatedRoute },
        { type: Router }
    ]; };
    FulltextSearchComponent.propDecorators = {
        route: [{ type: Input }]
    };
    return FulltextSearchComponent;
}());
export { FulltextSearchComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVsbHRleHQtc2VhcmNoLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Brbm9yYS9zZWFyY2gvIiwic291cmNlcyI6WyJsaWIvZnVsbHRleHQtc2VhcmNoL2Z1bGx0ZXh0LXNlYXJjaC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDakYsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQVUsTUFBTSxlQUFlLENBQUM7QUFDekQsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUV6RDtJQW1FSSxpQ0FBb0IsTUFBc0IsRUFDOUIsT0FBZTtRQURQLFdBQU0sR0FBTixNQUFNLENBQWdCO1FBQzlCLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFoQmxCLFVBQUssR0FBVyxTQUFTLENBQUM7UUFJbkMscUJBQWdCLEdBQVksSUFBSSxDQUFDO1FBRWpDLHFCQUFnQixHQUFZLEtBQUssQ0FBQztRQUVsQyxlQUFVLEdBQWEsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7UUFFdEUsa0JBQWEsR0FBVyxVQUFVLENBQUM7UUFFbkMsZ0JBQVcsR0FBVyxRQUFRLENBQUM7SUFLL0IsQ0FBQztJQUVELDBDQUFRLEdBQVI7SUFDQSxDQUFDO0lBR0Q7Ozs7OztPQU1HO0lBQ0gsdUNBQUssR0FBTCxVQUFNLFVBQXVCLEVBQUUsS0FBSztRQUNoQyxJQUFJLENBQUMsYUFBYSxHQUFHLFFBQVEsQ0FBQztRQUM5QixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1FBQ2pFLElBQUksSUFBSSxDQUFDLFdBQVcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUssT0FBTyxJQUFJLEtBQUssQ0FBQyxPQUFPLEtBQUssRUFBRSxJQUFJLEtBQUssQ0FBQyxLQUFLLEtBQUssRUFBRSxDQUFDLEVBQUU7WUFDM0YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUM3QjtRQUNELElBQUksS0FBSyxDQUFDLEdBQUcsS0FBSyxRQUFRLElBQUksS0FBSyxDQUFDLE9BQU8sS0FBSyxFQUFFLElBQUksS0FBSyxDQUFDLEtBQUssS0FBSyxFQUFFLEVBQUU7WUFDdEUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUNoQztJQUNMLENBQUM7SUFHRDs7OztPQUlHO0lBQ0gsMENBQVEsR0FBUixVQUFTLFVBQXVCOztRQUM1QixJQUFJLElBQUksQ0FBQyxXQUFXLEtBQUssU0FBUyxJQUFJLElBQUksQ0FBQyxXQUFXLEtBQUssSUFBSSxFQUFFO1lBQzdELElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUNsQixJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsWUFBWSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBRXRFLGdHQUFnRztZQUVoRyxrRkFBa0Y7WUFDbEYsMkNBQTJDO1lBQzNDLElBQUksa0JBQWtCLEdBQWEsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7WUFDbEYsSUFBSSxrQkFBa0IsS0FBSyxJQUFJLEVBQUU7Z0JBQUUsa0JBQWtCLEdBQUcsRUFBRSxDQUFDO2FBQUU7WUFDN0QsSUFBSSxDQUFDLEdBQVcsQ0FBQyxDQUFDOztnQkFDbEIsS0FBb0IsSUFBQSx1QkFBQSxpQkFBQSxrQkFBa0IsQ0FBQSxzREFBQSxzRkFBRTtvQkFBbkMsSUFBTSxLQUFLLCtCQUFBO29CQUNaLGtDQUFrQztvQkFDbEMsSUFBSSxJQUFJLENBQUMsV0FBVyxLQUFLLEtBQUssRUFBRTt3QkFBRSxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO3FCQUFFO29CQUNwRSxDQUFDLEVBQUUsQ0FBQztpQkFDUDs7Ozs7Ozs7O1lBQ0Qsa0JBQWtCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUMxQyxZQUFZLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQztTQUMxRTthQUFNO1lBQ0gsVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ25CLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7U0FDcEU7SUFDTCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILDZDQUFXLEdBQVgsVUFBWSxVQUF1QjtRQUMvQixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztRQUN4QixVQUFVLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDbkIsSUFBSSxDQUFDLGFBQWEsR0FBRyxVQUFVLENBQUM7UUFDaEMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDO0lBQ25ELENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILDRDQUFVLEdBQVY7UUFDSSxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1FBQ2pFLElBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBYSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMvRSxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO0lBQ2pDLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsMENBQVEsR0FBUjtRQUNJLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7UUFDakUsSUFBSSxDQUFDLGFBQWEsR0FBRyxRQUFRLENBQUM7UUFDOUIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDO0lBQ25ELENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsOENBQVksR0FBWixVQUFhLEtBQWE7UUFDdEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7UUFDekIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLFlBQVksR0FBRyxLQUFLLENBQUMsRUFBRSxFQUFFLFVBQVUsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUN4RixJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDdEIsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxpREFBZSxHQUFmLFVBQWdCLElBQW1CO1FBQW5CLHFCQUFBLEVBQUEsV0FBbUI7UUFDL0IsSUFBSSxJQUFJLEVBQUU7WUFDTiwwQ0FBMEM7WUFDMUMsSUFBTSxDQUFDLEdBQVcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDaEQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzdCLFlBQVksQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7U0FDdkU7YUFBTTtZQUNILDJDQUEyQztZQUMzQyxZQUFZLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDO1NBQ3pDO1FBQ0QsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztJQUVyRSxDQUFDOztnQkEzTEosU0FBUyxTQUFDO29CQUNQLFFBQVEsRUFBRSxxQkFBcUI7b0JBQy9CLFFBQVEsRUFBRSx1eERBbUNQO29CQUNILE1BQU0sRUFBRSxDQUFDLGswRUFBazBFLENBQUM7b0JBQzUwRSxVQUFVLEVBQUU7d0JBQ1IsT0FBTyxDQUFDLG9CQUFvQixFQUN4Qjs0QkFDSSxLQUFLLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDOzRCQUM3QyxLQUFLLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDOzRCQUM1QyxVQUFVLENBQUMsb0JBQW9CLEVBQUUsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDOzRCQUMxRCxVQUFVLENBQUMsb0JBQW9CLEVBQUUsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7eUJBQzlELENBQ0o7cUJBQ0o7aUJBQ0o7OztnQkFuRFEsY0FBYztnQkFBRSxNQUFNOzs7d0JBc0QxQixLQUFLOztJQXdJViw4QkFBQztDQUFBLEFBNUxELElBNExDO1NBMUlZLHVCQUF1QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGFuaW1hdGUsIHN0YXRlLCBzdHlsZSwgdHJhbnNpdGlvbiwgdHJpZ2dlciB9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZSwgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdrdWktZnVsbHRleHQtc2VhcmNoJyxcbiAgICB0ZW1wbGF0ZTogYDxkaXYgY2xhc3M9XCJzZWFyY2gtYmFyLWVsZW1lbnRzXCI+XG5cbiAgICA8ZGl2IGNsYXNzPVwiZnVsbHRleHQtc2VhcmNoLWJhclwiIFtjbGFzcy5hY3RpdmVdPVwic2VhcmNoUGFuZWxGb2N1c1wiPlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cInByZWZpeFwiIChjbGljayk9XCJkb1NlYXJjaChzZWFyY2gpXCI+XG4gICAgICAgICAgICAgICAgPG1hdC1pY29uPnNlYXJjaDwvbWF0LWljb24+XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBjbGFzcz1cImlucHV0LWZpZWxkXCI+XG4gICAgICAgICAgICA8aW5wdXQgI3NlYXJjaCBhdXRvY29tcGxldGU9XCJvZmZcIiB0eXBlPVwic2VhcmNoXCIgW3BsYWNlaG9sZGVyXT1cInNlYXJjaExhYmVsXCIgWyhuZ01vZGVsKV09XCJzZWFyY2hRdWVyeVwiIG5hbWU9XCJzZWFyY2hcIiAoa2V5dXAuZXNjKT1cInJlc2V0U2VhcmNoKHNlYXJjaClcIiAoa2V5dXApPVwib25LZXkoc2VhcmNoLCAkZXZlbnQpXCIgKGNsaWNrKT1cInNldEZvY3VzKClcIiAoZm9jdXMpPVwidG9nZ2xlTWVudSgpXCIgLz5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPCEtLSBzd2l0Y2ggYnV0dG9uOiBvbiBzb21lIGZvY3VzIHdlIG5lZWQgYSBjbG9zZSBidXR0b24gZm9yIHRoZSBzaW1wbGUgLS0+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwic3VmZml4XCIgKm5nSWY9XCJmb2N1c09uU2ltcGxlID09PSAnYWN0aXZlJ1wiIChjbGljayk9XCJyZXNldFNlYXJjaChzZWFyY2gpXCI+XG4gICAgICAgICAgICAgICAgPG1hdC1pY29uPmNsb3NlPC9tYXQtaWNvbj5cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cInN1ZmZpeFwiICpuZ0lmPVwiZm9jdXNPblNpbXBsZSA9PT0gJ2luYWN0aXZlJ1wiPjwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8IS0tIFwiZHJvcGRvd25cIiBtZW51IGZvciBzaW1wbGUgc2VhcmNoIC0tPlxuICAgICAgICA8ZGl2IGNsYXNzPVwia3VpLW1lbnUgc2ltcGxlLXNlYXJjaFwiIFtAZnVsbHRleHRTZWFyY2hNZW51XT1cImZvY3VzT25TaW1wbGVcIiAqbmdJZj1cInNob3dTaW1wbGVTZWFyY2hcIj5cbiAgICAgICAgICAgIDxtYXQtbGlzdCBjbGFzcz1cImt1aS1wcmV2aW91cy1zZWFyY2gtbGlzdFwiPlxuICAgICAgICAgICAgICAgIDxtYXQtbGlzdC1pdGVtICpuZ0Zvcj1cImxldCBpdGVtIG9mIHByZXZTZWFyY2ggfCBrdWlSZXZlcnNlOyBsZXQgaT1pbmRleFwiPlxuICAgICAgICAgICAgICAgICAgICA8aDQgbWF0LWxpbmUgKm5nSWY9XCJpPDEwXCIgKGNsaWNrKT1cImRvUHJldlNlYXJjaChpdGVtKVwiPnt7aXRlbX19PC9oND5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBtYXQtaWNvbi1idXR0b24gKGNsaWNrKT1cInJlc2V0UHJldlNlYXJjaChpdGVtKVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPG1hdC1pY29uIGFyaWEtbGFiZWw9XCJjbG9zZVwiPmNsb3NlPC9tYXQtaWNvbj5cbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9tYXQtbGlzdC1pdGVtPlxuICAgICAgICAgICAgPC9tYXQtbGlzdD5cbiAgICAgICAgICAgIDxidXR0b24gbWF0LXN0cm9rZWQtYnV0dG9uIGNvbG9yPVwiYWNjZW50XCIgY2xhc3M9XCJyaWdodFwiIChjbGljayk9XCJyZXNldFByZXZTZWFyY2goKVwiICpuZ0lmPVwicHJldlNlYXJjaFwiPkNsZWFyPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgPC9kaXY+XG48L2Rpdj5gLFxuICAgIHN0eWxlczogW2BpbnB1dFt0eXBlPXNlYXJjaF06Oi13ZWJraXQtc2VhcmNoLWNhbmNlbC1idXR0b24saW5wdXRbdHlwZT1zZWFyY2hdOjotd2Via2l0LXNlYXJjaC1kZWNvcmF0aW9uLGlucHV0W3R5cGU9c2VhcmNoXTo6LXdlYmtpdC1zZWFyY2gtcmVzdWx0cy1idXR0b24saW5wdXRbdHlwZT1zZWFyY2hdOjotd2Via2l0LXNlYXJjaC1yZXN1bHRzLWRlY29yYXRpb257ZGlzcGxheTpub25lfWlucHV0W3R5cGU9c2VhcmNoXXstbW96LWFwcGVhcmFuY2U6bm9uZTstd2Via2l0LWFwcGVhcmFuY2U6bm9uZX0uZnVsbC13aWR0aHt3aWR0aDoxMDAlfS5jbG9zZXtyaWdodDoxMnB4fS5oaWRle2Rpc3BsYXk6bm9uZX0uc2hvd3tkaXNwbGF5OmJsb2NrfS5zZWFyY2gtYmFyLWVsZW1lbnRze2Rpc3BsYXk6ZmxleDtwb3NpdGlvbjpyZWxhdGl2ZTt6LWluZGV4OjEwMH0uaW5hY3RpdmV7Y29sb3I6IzdhN2E3YX0uZnVsbHRleHQtc2VhcmNoLWJhcntiYWNrZ3JvdW5kLWNvbG9yOiNmOWY5Zjk7Ym9yZGVyLXJhZGl1czo0cHg7ZGlzcGxheTppbmxpbmUtZmxleDtoZWlnaHQ6NDBweDtwb3NpdGlvbjpyZWxhdGl2ZTt3aWR0aDo2ODBweDt6LWluZGV4OjEwfS5mdWxsdGV4dC1zZWFyY2gtYmFyOmhvdmVye2JveC1zaGFkb3c6MCAxcHggM3B4IHJnYmEoMCwwLDAsLjUpfS5mdWxsdGV4dC1zZWFyY2gtYmFyIGRpdi5pbnB1dC1maWVsZHtmbGV4OjF9LmZ1bGx0ZXh0LXNlYXJjaC1iYXIgZGl2LmlucHV0LWZpZWxkIGlucHV0e2JvcmRlci1zdHlsZTpub25lO2ZvbnQtc2l6ZToxNHB0O2hlaWdodDozOHB4O3Bvc2l0aW9uOmFic29sdXRlO3dpZHRoOmNhbGMoMTAwJSAtIDgwcHgpfS5mdWxsdGV4dC1zZWFyY2gtYmFyIGRpdi5pbnB1dC1maWVsZCBpbnB1dDphY3RpdmUsLmZ1bGx0ZXh0LXNlYXJjaC1iYXIgZGl2LmlucHV0LWZpZWxkIGlucHV0OmZvY3Vze291dGxpbmU6MH0uZnVsbHRleHQtc2VhcmNoLWJhciBkaXYgLnByZWZpeCwuZnVsbHRleHQtc2VhcmNoLWJhciBkaXYgLnN1ZmZpeHtiYWNrZ3JvdW5kLWNvbG9yOiNmZmY7Ym9yZGVyLXJhZGl1czozcHg7Ym9yZGVyLXN0eWxlOm5vbmU7Y29sb3I6cmdiYSg0MSw0MSw0MSwuNCk7Y3Vyc29yOnBvaW50ZXI7aGVpZ2h0OjM4cHg7b3V0bGluZTowO3Bvc2l0aW9uOnJlbGF0aXZlO3dpZHRoOjQwcHh9LmZ1bGx0ZXh0LXNlYXJjaC1iYXIgZGl2IC5wcmVmaXg6YWN0aXZlLC5mdWxsdGV4dC1zZWFyY2gtYmFyIGRpdiAuc3VmZml4OmFjdGl2ZXtjb2xvcjojNTE1MTUxfS5mdWxsdGV4dC1zZWFyY2gtYmFyIGRpdi5hY3RpdmV7Ym94LXNoYWRvdzowIDFweCAzcHggcmdiYSgwLDAsMCwuNSl9Lmt1aS1tZW51e2JveC1zaGFkb3c6MCAzcHggNXB4IC0xcHggcmdiYSgxMSwxMSwxMSwuMiksMCA2cHggMTBweCAwIHJnYmEoMTEsMTEsMTEsLjE0KSwwIDFweCAxOHB4IDAgcmdiYSgxMSwxMSwxMSwuMTIpO2JhY2tncm91bmQtY29sb3I6I2Y5ZjlmOTtib3JkZXItcmFkaXVzOjRweDtwb3NpdGlvbjphYnNvbHV0ZX0ua3VpLW1lbnUuc2ltcGxlLXNlYXJjaHttaW4taGVpZ2h0OjY4MHB4O3dpZHRoOjY4MHB4O3BhZGRpbmctdG9wOjYwcHg7ei1pbmRleDotMX0ua3VpLW1lbnUuc2ltcGxlLXNlYXJjaCAua3VpLXByZXZpb3VzLXNlYXJjaC1saXN0IC5tYXQtbGlzdC1pdGVte2N1cnNvcjpwb2ludGVyfS5rdWktbWVudS5zaW1wbGUtc2VhcmNoIC5rdWktcHJldmlvdXMtc2VhcmNoLWxpc3QgLm1hdC1saXN0LWl0ZW06aG92ZXJ7YmFja2dyb3VuZC1jb2xvcjojZjlmOWY5fS5rdWktbWVudS5zaW1wbGUtc2VhcmNoIC5rdWktcHJldmlvdXMtc2VhcmNoLWxpc3QgLm1hdC1saXN0LWl0ZW06aG92ZXIgbWF0LWljb257ZGlzcGxheTpibG9ja30ua3VpLW1lbnUuc2ltcGxlLXNlYXJjaCAua3VpLXByZXZpb3VzLXNlYXJjaC1saXN0IC5tYXQtbGlzdC1pdGVtIG1hdC1pY29ue2Rpc3BsYXk6bm9uZX0ua3VpLW1lbnUuc2ltcGxlLXNlYXJjaCAucmlnaHR7bWFyZ2luLXRvcDoxMnB4O21hcmdpbi1sZWZ0OjE2cHh9QG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDoxMDI0cHgpey5mdWxsdGV4dC1zZWFyY2gtYmFye3dpZHRoOjQ4MHB4fS5mdWxsdGV4dC1zZWFyY2gtYmFyIGRpdi5pbnB1dC1maWVsZCBpbnB1dHt3aWR0aDpjYWxjKDQ4MHB4IC0gODBweCl9Lmt1aS1tZW51LnNpbXBsZS1zZWFyY2h7d2lkdGg6NDgwcHh9fUBtZWRpYSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6NzY4cHgpey5mdWxsdGV4dC1zZWFyY2gtYmFye3dpZHRoOmNhbGMoNDgwcHggLSAxNjBweCl9LmZ1bGx0ZXh0LXNlYXJjaC1iYXIgZGl2LmlucHV0LWZpZWxkIGlucHV0e3dpZHRoOmNhbGMoNDgwcHggLSAxNjBweCAtIDgwcHgpfS5rdWktbWVudS5zaW1wbGUtc2VhcmNoe3dpZHRoOmNhbGMoNDgwcHggLSA4MHB4KX19YF0sXG4gICAgYW5pbWF0aW9uczogW1xuICAgICAgICB0cmlnZ2VyKCdmdWxsdGV4dFNlYXJjaE1lbnUnLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgIHN0YXRlKCdpbmFjdGl2ZScsIHN0eWxlKHsgZGlzcGxheTogJ25vbmUnIH0pKSxcbiAgICAgICAgICAgICAgICBzdGF0ZSgnYWN0aXZlJywgc3R5bGUoeyBkaXNwbGF5OiAnYmxvY2snIH0pKSxcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uKCdpbmFjdGl2ZSA9PiBhY3RpdmUnLCBhbmltYXRlKCcxMDBtcyBlYXNlLWluJykpLFxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb24oJ2FjdGl2ZSA9PiBpbmFjdGl2ZScsIGFuaW1hdGUoJzEwMG1zIGVhc2Utb3V0JykpXG4gICAgICAgICAgICBdXG4gICAgICAgIClcbiAgICBdXG59KVxuZXhwb3J0IGNsYXNzIEZ1bGx0ZXh0U2VhcmNoQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcblxuICAgIEBJbnB1dCgpIHJvdXRlOiBzdHJpbmcgPSAnL3NlYXJjaCc7XG5cbiAgICBzZWFyY2hRdWVyeTogc3RyaW5nO1xuXG4gICAgc2hvd1NpbXBsZVNlYXJjaDogYm9vbGVhbiA9IHRydWU7XG5cbiAgICBzZWFyY2hQYW5lbEZvY3VzOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBwcmV2U2VhcmNoOiBzdHJpbmdbXSA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3ByZXZTZWFyY2gnKSk7XG5cbiAgICBmb2N1c09uU2ltcGxlOiBzdHJpbmcgPSAnaW5hY3RpdmUnO1xuXG4gICAgc2VhcmNoTGFiZWw6IHN0cmluZyA9ICdTZWFyY2gnO1xuXG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9yb3V0ZTogQWN0aXZhdGVkUm91dGUsXG4gICAgICAgIHByaXZhdGUgX3JvdXRlcjogUm91dGVyKSB7XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKSB7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBAaWdub3JlXG4gICAgICogRG8gc2VhcmNoIG9uIEVudGVyIGNsaWNrLCByZXNldCBzZWFyY2ggb24gRXNjYXBlXG4gICAgICogQHBhcmFtIHNlYXJjaF9lbGVcbiAgICAgKiBAcGFyYW0gZXZlbnRcbiAgICAgKiBAcmV0dXJucyB2b2lkXG4gICAgICovXG4gICAgb25LZXkoc2VhcmNoX2VsZTogSFRNTEVsZW1lbnQsIGV2ZW50KTogdm9pZCB7XG4gICAgICAgIHRoaXMuZm9jdXNPblNpbXBsZSA9ICdhY3RpdmUnO1xuICAgICAgICB0aGlzLnByZXZTZWFyY2ggPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdwcmV2U2VhcmNoJykpO1xuICAgICAgICBpZiAodGhpcy5zZWFyY2hRdWVyeSAmJiAoZXZlbnQua2V5ID09PSAnRW50ZXInIHx8IGV2ZW50LmtleUNvZGUgPT09IDEzIHx8IGV2ZW50LndoaWNoID09PSAxMykpIHtcbiAgICAgICAgICAgIHRoaXMuZG9TZWFyY2goc2VhcmNoX2VsZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGV2ZW50LmtleSA9PT0gJ0VzY2FwZScgfHwgZXZlbnQua2V5Q29kZSA9PT0gMjcgfHwgZXZlbnQud2hpY2ggPT09IDI3KSB7XG4gICAgICAgICAgICB0aGlzLnJlc2V0U2VhcmNoKHNlYXJjaF9lbGUpO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBSZWFsaXNlIGEgc2ltcGxlIHNlYXJjaFxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHNlYXJjaF9lbGVcbiAgICAgKiBAcmV0dXJucyB2b2lkXG4gICAgICovXG4gICAgZG9TZWFyY2goc2VhcmNoX2VsZTogSFRNTEVsZW1lbnQpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuc2VhcmNoUXVlcnkgIT09IHVuZGVmaW5lZCAmJiB0aGlzLnNlYXJjaFF1ZXJ5ICE9PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLnRvZ2dsZU1lbnUoKTtcbiAgICAgICAgICAgIHRoaXMuX3JvdXRlci5uYXZpZ2F0ZShbdGhpcy5yb3V0ZSArICcvZnVsbHRleHQvJyArIHRoaXMuc2VhcmNoUXVlcnldKTtcblxuICAgICAgICAgICAgLy8gdGhpcy5fcm91dGVyLm5hdmlnYXRlKFsnL3NlYXJjaC9mdWxsdGV4dC8nICsgdGhpcy5zZWFyY2hRdWVyeV0sIHsgcmVsYXRpdmVUbzogdGhpcy5fcm91dGUgfSk7XG5cbiAgICAgICAgICAgIC8vIHB1c2ggdGhlIHNlYXJjaCBxdWVyeSBpbnRvIHRoZSBsb2NhbCBzdG9yYWdlIHByZXZTZWFyY2ggYXJyYXkgKHByZXZpb3VzIHNlYXJjaClcbiAgICAgICAgICAgIC8vIHRvIGhhdmUgYSBsaXN0IG9mIHJlY2VudCBzZWFyY2ggcmVxdWVzdHNcbiAgICAgICAgICAgIGxldCBleGlzdGluZ1ByZXZTZWFyY2g6IHN0cmluZ1tdID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncHJldlNlYXJjaCcpKTtcbiAgICAgICAgICAgIGlmIChleGlzdGluZ1ByZXZTZWFyY2ggPT09IG51bGwpIHsgZXhpc3RpbmdQcmV2U2VhcmNoID0gW107IH1cbiAgICAgICAgICAgIGxldCBpOiBudW1iZXIgPSAwO1xuICAgICAgICAgICAgZm9yIChjb25zdCBlbnRyeSBvZiBleGlzdGluZ1ByZXZTZWFyY2gpIHtcbiAgICAgICAgICAgICAgICAvLyByZW1vdmUgZW50cnksIGlmIGV4aXN0cyBhbHJlYWR5XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc2VhcmNoUXVlcnkgPT09IGVudHJ5KSB7IGV4aXN0aW5nUHJldlNlYXJjaC5zcGxpY2UoaSwgMSk7IH1cbiAgICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBleGlzdGluZ1ByZXZTZWFyY2gucHVzaCh0aGlzLnNlYXJjaFF1ZXJ5KTtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdwcmV2U2VhcmNoJywgSlNPTi5zdHJpbmdpZnkoZXhpc3RpbmdQcmV2U2VhcmNoKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZWFyY2hfZWxlLmZvY3VzKCk7XG4gICAgICAgICAgICB0aGlzLnByZXZTZWFyY2ggPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdwcmV2U2VhcmNoJykpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVzZXQgdGhlIHNlYXJjaFxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHNlYXJjaF9lbGVcbiAgICAgKiBAcmV0dXJucyB2b2lkXG4gICAgICovXG4gICAgcmVzZXRTZWFyY2goc2VhcmNoX2VsZTogSFRNTEVsZW1lbnQpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zZWFyY2hRdWVyeSA9IG51bGw7XG4gICAgICAgIHNlYXJjaF9lbGUuZm9jdXMoKTtcbiAgICAgICAgdGhpcy5mb2N1c09uU2ltcGxlID0gJ2luYWN0aXZlJztcbiAgICAgICAgdGhpcy5zZWFyY2hQYW5lbEZvY3VzID0gIXRoaXMuc2VhcmNoUGFuZWxGb2N1cztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTd2l0Y2ggYWNjb3JkaW5nIHRvIHRoZSBmb2N1cyBiZXR3ZWVuIHNpbXBsZSBvciBleHRlbmRlZCBzZWFyY2hcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIDIgY2FzZXM6IHNpbXBsZVNlYXJjaCBvciBleHRlbmRlZFNlYXJjaFxuICAgICAqIEByZXR1cm5zIHZvaWRcbiAgICAgKi9cbiAgICB0b2dnbGVNZW51KCk6IHZvaWQge1xuICAgICAgICB0aGlzLnByZXZTZWFyY2ggPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdwcmV2U2VhcmNoJykpO1xuICAgICAgICB0aGlzLmZvY3VzT25TaW1wbGUgPSAodGhpcy5mb2N1c09uU2ltcGxlID09PSAnYWN0aXZlJyA/ICdpbmFjdGl2ZScgOiAnYWN0aXZlJyk7XG4gICAgICAgIHRoaXMuc2hvd1NpbXBsZVNlYXJjaCA9IHRydWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0IHNpbXBsZSBmb2N1cyB0byBhY3RpdmVcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHZvaWRcbiAgICAgKi9cbiAgICBzZXRGb2N1cygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5wcmV2U2VhcmNoID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncHJldlNlYXJjaCcpKTtcbiAgICAgICAgdGhpcy5mb2N1c09uU2ltcGxlID0gJ2FjdGl2ZSc7XG4gICAgICAgIHRoaXMuc2VhcmNoUGFuZWxGb2N1cyA9ICF0aGlzLnNlYXJjaFBhbmVsRm9jdXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVhbGlzZSBhIHByZXZpb3VzIHNlYXJjaFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBxdWVyeVxuICAgICAqIEByZXR1cm5zIHZvaWRcbiAgICAgKi9cbiAgICBkb1ByZXZTZWFyY2gocXVlcnk6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICB0aGlzLnNlYXJjaFF1ZXJ5ID0gcXVlcnk7XG4gICAgICAgIHRoaXMuX3JvdXRlci5uYXZpZ2F0ZShbdGhpcy5yb3V0ZSArICcvZnVsbHRleHQvJyArIHF1ZXJ5XSwgeyByZWxhdGl2ZVRvOiB0aGlzLl9yb3V0ZSB9KTtcbiAgICAgICAgdGhpcy50b2dnbGVNZW51KCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVzZXQgcHJldmlvdXMgc2VhcmNoZXMgLSB0aGUgd2hvbGUgcHJldmlvdXMgc2VhcmNoIG9yIHNwZWNpZmljIGl0ZW0gYnkgbmFtZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIHRlcm0gb2YgdGhlIHNlYXJjaFxuICAgICAqIEByZXR1cm5zIHZvaWRcbiAgICAgKi9cbiAgICByZXNldFByZXZTZWFyY2gobmFtZTogc3RyaW5nID0gbnVsbCk6IHZvaWQge1xuICAgICAgICBpZiAobmFtZSkge1xuICAgICAgICAgICAgLy8gZGVsZXRlIG9ubHkgdGhpcyBpdGVtIHdpdGggdGhlIG5hbWUgLi4uXG4gICAgICAgICAgICBjb25zdCBpOiBudW1iZXIgPSB0aGlzLnByZXZTZWFyY2guaW5kZXhPZihuYW1lKTtcbiAgICAgICAgICAgIHRoaXMucHJldlNlYXJjaC5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncHJldlNlYXJjaCcsIEpTT04uc3RyaW5naWZ5KHRoaXMucHJldlNlYXJjaCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gZGVsZXRlIHRoZSB3aG9sZSBcInByZXZpb3VzIHNlYXJjaFwiIGFycmF5XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgncHJldlNlYXJjaCcpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucHJldlNlYXJjaCA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3ByZXZTZWFyY2gnKSk7XG5cbiAgICB9XG59XG4iXX0=