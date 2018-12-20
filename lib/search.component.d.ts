import { ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
export declare class SearchComponent implements OnInit {
    private _route;
    private _router;
    private _eleRef;
    route: string;
    searchQuery: string;
    searchPanelFocus: boolean;
    prevSearch: string[];
    focusOnSimple: string;
    focusOnExtended: string;
    searchLabel: string;
    showSimpleSearch: boolean;
    constructor(_route: ActivatedRoute, _router: Router, _eleRef: ElementRef);
    ngOnInit(): void;
    /**
     * @ignore
     * Do search on Enter click, reset search on Escape
     * @param search_ele
     * @param event
     * @returns void
     */
    onKey(search_ele: HTMLElement, event: any): void;
    /**
     * Realise a simple search
     * @param {HTMLElement} search_ele
     * @returns void
     */
    doSearch(search_ele: HTMLElement): void;
    /**
     * Reset the search
     * @param {HTMLElement} search_ele
     * @returns void
     */
    resetSearch(search_ele: HTMLElement): void;
    /**
     * Realise a previous search
     * @param {string} query
     * @returns void
     */
    doPrevSearch(query: string): void;
    /**
     * Reset previous searches - the whole previous search or specific item by name
     * @param {string} name term of the search
     * @returns void
     */
    resetPrevSearch(name?: string): void;
    /**
     * Set simple focus to active
     *
     * @returns void
     */
    setFocus(): void;
    /**
     * Switch according to the focus between simple or extended search
     *
     * @param {string} name 2 cases: simpleSearch or extendedSearch
     * @returns void
     */
    toggleMenu(name: string): void;
}
