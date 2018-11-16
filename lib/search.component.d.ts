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
     *
     * @param search_ele
     * @param event
     */
    onKey(search_ele: HTMLElement, event: any): void;
    /**
     * Realise a simple search
     * @param search_ele
     */
    doSearch(search_ele: HTMLElement): void;
    /**
     * Reset the search
     * @param search_ele
     */
    resetSearch(search_ele: HTMLElement): void;
    /**
     * Realise a previous search
     * @param query
     */
    doPrevSearch(query: string): void;
    /**
     * Reset previous searches - the whole previous search or specific item by name
     * @param name
     */
    resetPrevSearch(name?: string): void;
    /**
     * Set simple focus to active
     */
    setFocus(): void;
    /**
     * Switch according to the focus between simple or extended search
     * @param name
     */
    toggleMenu(name: string): void;
}
