/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, EventEmitter, Inject, Input, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { GravsearchGenerationService, OntologyCacheService, ReadResourcesSequence } from '@knora/core';
import { SelectResourceClassComponent } from './select-resource-class/select-resource-class.component';
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
export { ExtendedSearchComponent };
if (false) {
    /** @type {?} */
    ExtendedSearchComponent.prototype.route;
    /** @type {?} */
    ExtendedSearchComponent.prototype.toggleExtendedSearchForm;
    /** @type {?} */
    ExtendedSearchComponent.prototype.ontologies;
    /** @type {?} */
    ExtendedSearchComponent.prototype.activeOntology;
    /** @type {?} */
    ExtendedSearchComponent.prototype.activeProperties;
    /** @type {?} */
    ExtendedSearchComponent.prototype.resourceClasses;
    /** @type {?} */
    ExtendedSearchComponent.prototype.activeResourceClass;
    /** @type {?} */
    ExtendedSearchComponent.prototype.properties;
    /** @type {?} */
    ExtendedSearchComponent.prototype.result;
    /** @type {?} */
    ExtendedSearchComponent.prototype.resourceClassComponent;
    /** @type {?} */
    ExtendedSearchComponent.prototype.propertyComponents;
    /** @type {?} */
    ExtendedSearchComponent.prototype.form;
    /** @type {?} */
    ExtendedSearchComponent.prototype.formValid;
    /** @type {?} */
    ExtendedSearchComponent.prototype.fb;
    /** @type {?} */
    ExtendedSearchComponent.prototype._route;
    /** @type {?} */
    ExtendedSearchComponent.prototype._router;
    /** @type {?} */
    ExtendedSearchComponent.prototype._cacheService;
    /** @type {?} */
    ExtendedSearchComponent.prototype._gravSearchService;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0ZW5kZWQtc2VhcmNoLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Brbm9yYS9zZWFyY2gvIiwic291cmNlcyI6WyJsaWIvZXh0ZW5kZWQtc2VhcmNoL2V4dGVuZGVkLXNlYXJjaC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQVUsTUFBTSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNILE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDekQsT0FBTyxFQUFFLFdBQVcsRUFBYSxNQUFNLGdCQUFnQixDQUFDO0FBQ3hELE9BQU8sRUFDSCwyQkFBMkIsRUFDM0Isb0JBQW9CLEVBS3BCLHFCQUFxQixFQUV4QixNQUFNLGFBQWEsQ0FBQztBQUVyQixPQUFPLEVBQUUsNEJBQTRCLEVBQUUsTUFBTSx5REFBeUQsQ0FBQzs7SUErRm5HLGlDQUF5QyxFQUFlLEVBQzVDLFFBQ0EsU0FDQSxlQUNBO1FBSjZCLE9BQUUsR0FBRixFQUFFLENBQWE7UUFDNUMsV0FBTSxHQUFOLE1BQU07UUFDTixZQUFPLEdBQVAsT0FBTztRQUNQLGtCQUFhLEdBQWIsYUFBYTtRQUNiLHVCQUFrQixHQUFsQixrQkFBa0I7O3dDQXRDTyxJQUFJLFlBQVksRUFBVzs7MEJBRzFCLEVBQUU7O2dDQU1WLEVBQUU7OytCQUdRLEVBQUU7c0JBUVYsSUFBSSxxQkFBcUIsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDOzt5QkFZcEQsS0FBSztLQU9oQjs7OztJQUVELDBDQUFROzs7SUFBUjtRQUFBLGlCQWFDOztRQVZHLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7O1FBRzlCLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxVQUFDLElBQUk7WUFDbkMsS0FBSSxDQUFDLFNBQVMsR0FBRyxLQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7O1NBRXhDLENBQUMsQ0FBQzs7UUFHSCxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztLQUMvQjtJQUVEOztPQUVHOzs7OztJQUNILDZDQUFXOzs7O0lBQVg7UUFDSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3BDO0lBRUQ7O09BRUc7Ozs7O0lBQ0gsZ0RBQWM7Ozs7SUFBZDtRQUNJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDdkM7SUFFRDs7T0FFRzs7Ozs7SUFDSCxzREFBb0I7Ozs7SUFBcEI7UUFBQSxpQkFLQztRQUpHLElBQUksQ0FBQyxhQUFhLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxTQUFTLENBQ2hELFVBQUMsVUFBbUM7WUFDaEMsS0FBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7U0FDaEMsQ0FBQyxDQUFDO0tBQ1Y7SUFFRDs7Ozs7T0FLRzs7Ozs7Ozs7SUFDSCw0RUFBMEM7Ozs7Ozs7SUFBMUMsVUFBMkMsV0FBbUI7UUFBOUQsaUJBbUJDOztRQWhCRyxJQUFJLENBQUMsbUJBQW1CLEdBQUcsU0FBUyxDQUFDOztRQUdyQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsRUFBRSxDQUFDO1FBRTNCLElBQUksQ0FBQyxjQUFjLEdBQUcsV0FBVyxDQUFDO1FBRWxDLElBQUksQ0FBQyxhQUFhLENBQUMsaUNBQWlDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FDekUsVUFBQyxRQUE2QjtZQUUxQixLQUFJLENBQUMsZUFBZSxHQUFHLFFBQVEsQ0FBQyx5QkFBeUIsRUFBRSxDQUFDO1lBQzVELEtBQUksQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDLGFBQWEsRUFBRSxDQUFDO1NBRTlDLENBQ0osQ0FBQztLQUVMO0lBRUQ7Ozs7O09BS0c7Ozs7Ozs7O0lBQ0gsK0RBQTZCOzs7Ozs7O0lBQTdCLFVBQThCLGdCQUF3QjtRQUF0RCxpQkFxQkM7O1FBbEJHLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxFQUFFLENBQUM7O1FBRzNCLEVBQUUsQ0FBQyxDQUFDLGdCQUFnQixLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDNUIsSUFBSSxDQUFDLDBDQUEwQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztTQUN4RTtRQUFDLElBQUksQ0FBQyxDQUFDO1lBRUosSUFBSSxDQUFDLGFBQWEsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxTQUFTLENBQ3hFLFVBQUMsUUFBNkI7Z0JBQzFCLEtBQUksQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUUzQyxLQUFJLENBQUMsbUJBQW1CLEdBQUcsUUFBUSxDQUFDLGtCQUFrQixFQUFFLENBQUMsZ0JBQWdCLENBQUMsQ0FBQzthQUU5RSxDQUNKLENBQUM7U0FFTDtLQUVKOzs7OztJQUtPLDhDQUFZOzs7Ozs7UUFHaEIsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSztZQUNsQixDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLHNCQUFzQixLQUFLLFNBQVMsSUFBSSxJQUFJLENBQUMsc0JBQXNCLENBQUMsd0JBQXdCLEVBQUUsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDOztJQUloSzs7T0FFRzs7Ozs7SUFDSCwyQ0FBUzs7OztJQUFUO1FBQ0ksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLElBQUksQ0FBQywwQ0FBMEMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7U0FDeEU7S0FDSjtJQUdEOztPQUVHOzs7OztJQUNILHdDQUFNOzs7O0lBQU47UUFFSSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7WUFBQyxNQUFNLENBQUM7O1FBRTVCLElBQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyx3QkFBd0IsRUFBRSxDQUFDOztRQUU5RSxJQUFJLFFBQVEsQ0FBQztRQUViLEVBQUUsQ0FBQyxDQUFDLGNBQWMsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQzNCLFFBQVEsR0FBRyxjQUFjLENBQUM7U0FDN0I7O1FBRUQsSUFBTSxVQUFVLEdBQXdCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQy9ELFVBQUMsUUFBUTtZQUNMLE1BQU0sQ0FBQyxRQUFRLENBQUMsNEJBQTRCLEVBQUUsQ0FBQztTQUNsRCxDQUNKLENBQUM7O1FBRUYsSUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLHFCQUFxQixDQUFDLFVBQVUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFMUYsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLFlBQVksRUFBRSxVQUFVLENBQUMsRUFBRSxFQUFFLFVBQVUsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQzs7UUFHNUYsSUFBSSxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUU1Qzs7Z0JBblBKLFNBQVMsU0FBQztvQkFDUCxRQUFRLEVBQUUscUJBQXFCO29CQUMvQixRQUFRLEVBQUUsbXJFQWdEYjtvQkFDRyxNQUFNLEVBQUUsQ0FBQywrTkFBK04sQ0FBQztpQkFDNU87Ozs7Z0JBbkVRLFdBQVcsdUJBMkdILE1BQU0sU0FBQyxXQUFXO2dCQTVHMUIsY0FBYztnQkFBRSxNQUFNO2dCQUkzQixvQkFBb0I7Z0JBRHBCLDJCQUEyQjs7O3dCQW9FMUIsS0FBSzsyQ0FHTCxNQUFNO3lDQXVCTixTQUFTLFNBQUMsZUFBZTtxQ0FHekIsWUFBWSxTQUFDLFVBQVU7O2tDQXJHNUI7O1NBc0VhLHVCQUF1QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbmplY3QsIElucHV0LCBPbkluaXQsIE91dHB1dCwgUXVlcnlMaXN0LCBWaWV3Q2hpbGQsIFZpZXdDaGlsZHJlbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWN0aXZhdGVkUm91dGUsIFJvdXRlciB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBGb3JtQnVpbGRlciwgRm9ybUdyb3VwIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtcbiAgICBHcmF2c2VhcmNoR2VuZXJhdGlvblNlcnZpY2UsXG4gICAgT250b2xvZ3lDYWNoZVNlcnZpY2UsXG4gICAgT250b2xvZ3lJbmZvcm1hdGlvbixcbiAgICBPbnRvbG9neU1ldGFkYXRhLFxuICAgIFByb3BlcnRpZXMsXG4gICAgUHJvcGVydHlXaXRoVmFsdWUsXG4gICAgUmVhZFJlc291cmNlc1NlcXVlbmNlLFxuICAgIFJlc291cmNlQ2xhc3Ncbn0gZnJvbSAnQGtub3JhL2NvcmUnO1xuaW1wb3J0IHsgU2VsZWN0UHJvcGVydHlDb21wb25lbnQgfSBmcm9tICcuL3NlbGVjdC1wcm9wZXJ0eS9zZWxlY3QtcHJvcGVydHkuY29tcG9uZW50JztcbmltcG9ydCB7IFNlbGVjdFJlc291cmNlQ2xhc3NDb21wb25lbnQgfSBmcm9tICcuL3NlbGVjdC1yZXNvdXJjZS1jbGFzcy9zZWxlY3QtcmVzb3VyY2UtY2xhc3MuY29tcG9uZW50JztcblxuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ2t1aS1leHRlbmRlZC1zZWFyY2gnLFxuICAgIHRlbXBsYXRlOiBgPGZvcm0gW2Zvcm1Hcm91cF09XCJmb3JtXCIgKG5nU3VibWl0KT1cInN1Ym1pdCgpXCI+XG5cbiAgPGRpdj5cbiAgICA8a3VpLXNlbGVjdC1vbnRvbG9neSAqbmdJZj1cIm9udG9sb2dpZXMubGVuZ3RoID4gMFwiIFtmb3JtR3JvdXBdPVwiZm9ybVwiIFtvbnRvbG9naWVzXT1cIm9udG9sb2dpZXNcIiAob250b2xvZ3lTZWxlY3RlZCk9XCJnZXRSZXNvdXJjZUNsYXNzZXNBbmRQcm9wZXJ0aWVzRm9yT250b2xvZ3koJGV2ZW50KVwiPjwva3VpLXNlbGVjdC1vbnRvbG9neT5cbiAgPC9kaXY+XG5cbiAgPGRpdiBjbGFzcz1cInNlbGVjdC1yZXNvdXJjZS1jbGFzc1wiICpuZ0lmPVwicmVzb3VyY2VDbGFzc2VzPy5sZW5ndGggPiAwXCI+XG4gICAgPGt1aS1zZWxlY3QtcmVzb3VyY2UtY2xhc3MgI3Jlc291cmNlQ2xhc3MgW2Zvcm1Hcm91cF09XCJmb3JtXCIgW3Jlc291cmNlQ2xhc3Nlc109XCJyZXNvdXJjZUNsYXNzZXNcIiAocmVzb3VyY2VDbGFzc1NlbGVjdGVkRXZlbnQpPVwiZ2V0UHJvcGVydGllc0ZvclJlc291cmNlQ2xhc3MoJGV2ZW50KVwiPjwva3VpLXNlbGVjdC1yZXNvdXJjZS1jbGFzcz5cbiAgPC9kaXY+XG5cbiAgPGRpdiBjbGFzcz1cInNlbGVjdC1wcm9wZXJ0eVwiICpuZ0lmPVwicHJvcGVydGllcyAhPT0gdW5kZWZpbmVkXCI+XG4gICAgPGRpdiAqbmdGb3I9XCJsZXQgcHJvcCBvZiBhY3RpdmVQcm9wZXJ0aWVzOyBsZXQgaSA9IGluZGV4XCI+XG5cbiAgICAgIDxrdWktc2VsZWN0LXByb3BlcnR5ICNwcm9wZXJ0eSBbYWN0aXZlUmVzb3VyY2VDbGFzc109XCJhY3RpdmVSZXNvdXJjZUNsYXNzXCIgW2Zvcm1Hcm91cF09XCJmb3JtXCIgW2luZGV4XT1cImlcIiBbcHJvcGVydGllc109XCJwcm9wZXJ0aWVzXCI+PC9rdWktc2VsZWN0LXByb3BlcnR5PlxuXG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuXG5cbiAgPGRpdj5cbiAgICA8YnV0dG9uIG1hdC1taW5pLWZhYiBjbGFzcz1cInByb3BlcnR5LWJ1dHRvbnMgYWRkLXByb3BlcnR5LWJ1dHRvblwiIGNvbG9yPVwicHJpbWFyeVwiIHR5cGU9XCJidXR0b25cIiAoY2xpY2spPVwiYWRkUHJvcGVydHkoKVwiIFtkaXNhYmxlZF09XCJhY3RpdmVPbnRvbG9neSA9PT0gdW5kZWZpbmVkIHx8IGFjdGl2ZVByb3BlcnRpZXMubGVuZ3RoID49IDRcIj5cbiAgICAgIDxtYXQtaWNvbiBhcmlhLWxhYmVsPVwiYWRkIGEgcHJvcGVydHlcIj5hZGQ8L21hdC1pY29uPlxuICAgIDwvYnV0dG9uPlxuXG4gICAgPGJ1dHRvbiBtYXQtbWluaS1mYWIgY2xhc3M9XCJwcm9wZXJ0eS1idXR0b25zIHJlbW92ZS1wcm9wZXJ0eS1idXR0b25cIiBjb2xvcj1cInByaW1hcnlcIiB0eXBlPVwiYnV0dG9uXCIgKGNsaWNrKT1cInJlbW92ZVByb3BlcnR5KClcIiBbZGlzYWJsZWRdPVwiYWN0aXZlUHJvcGVydGllcy5sZW5ndGggPT0gMFwiPlxuICAgICAgPG1hdC1pY29uIGFyaWEtbGFiZWw9XCJyZW1vdmUgcHJvcGVydHlcIj5yZW1vdmU8L21hdC1pY29uPlxuICAgIDwvYnV0dG9uPlxuICA8L2Rpdj5cblxuICA8IS0tICA8ZGl2PlxuICAgIDxidXR0b24gbWF0LWljb24tYnV0dG9uIHR5cGU9XCJidXR0b25cIiAoY2xpY2spPVwicmVzZXRGb3JtKClcIiBbZGlzYWJsZWRdPVwidGhpcy5hY3RpdmVPbnRvbG9neSA9PT0gdW5kZWZpbmVkXCI+XG4gICAgICA8bWF0LWljb24gYXJpYS1sYWJlbD1cInJlc2V0IHF1ZXJ5IGZvcm1cIj5jbGVhcjwvbWF0LWljb24+XG4gICAgPC9idXR0b24+XG5cbiAgICA8YnV0dG9uIG1hdC1pY29uLWJ1dHRvbiB0eXBlPVwic3VibWl0XCIgW2Rpc2FibGVkXT1cIiFmb3JtVmFsaWRcIj5cbiAgICAgIDxtYXQtaWNvbiBhcmlhLWxhYmVsPVwic3VibWl0IHF1ZXJ5XCI+c2VuZDwvbWF0LWljb24+XG4gICAgPC9idXR0b24+XG4gIDwvZGl2PiAtLT5cblxuICA8YnV0dG9uIGNsYXNzPVwiZXh0ZW5kZWQtYnV0dG9ucyBleHRlbmRlZC1zZWFyY2gtYnV0dG9uXCIgbWF0LXN0cm9rZWQtYnV0dG9uIGNvbG9yPVwicHJpbWFyeVwiIHR5cGU9XCJzdWJtaXRcIiBbZGlzYWJsZWRdPVwiIWZvcm1WYWxpZFwiPlxuICAgIFNlYXJjaFxuICA8L2J1dHRvbj5cbiAgPGJ1dHRvbiBjbGFzcz1cImV4dGVuZGVkLWJ1dHRvbnMgcmVzZXRcIiBtYXQtc3Ryb2tlZC1idXR0b24gdHlwZT1cImJ1dHRvblwiIChjbGljayk9XCJyZXNldEZvcm0oKVwiIFtkaXNhYmxlZF09XCJ0aGlzLmFjdGl2ZU9udG9sb2d5ID09PSB1bmRlZmluZWRcIj5cbiAgICBSZXNldFxuICA8L2J1dHRvbj5cblxuXG48L2Zvcm0+XG5gLFxuICAgIHN0eWxlczogW2AuYWRkLXByb3BlcnR5LWJ1dHRvbnttYXJnaW4tcmlnaHQ6NXB4fS5leHRlbmRlZC1idXR0b25ze21hcmdpbi10b3A6MjVweH0uZXh0ZW5kZWQtc2VhcmNoLWJ1dHRvbnttYXJnaW4tcmlnaHQ6NXB4fS5wcm9wZXJ0eS1idXR0b25ze21hcmdpbi10b3A6MjVweH0uc2VsZWN0LXByb3BlcnR5e21hcmdpbi1sZWZ0OjIycHh9LnNlbGVjdC1yZXNvdXJjZS1jbGFzc3ttYXJnaW4tbGVmdDoxMnB4fWBdXG59KVxuZXhwb3J0IGNsYXNzIEV4dGVuZGVkU2VhcmNoQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcblxuICAgIEBJbnB1dCgpIHJvdXRlO1xuXG4gICAgLy8gdHJpZ2dlciB0b2dnbGUgZm9yIGV4dGVuZGVkIHNlYXJjaCBmb3JtXG4gICAgQE91dHB1dCgpIHRvZ2dsZUV4dGVuZGVkU2VhcmNoRm9ybSA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oKTtcblxuICAgIC8vIGFsbCBhdmFpbGFibGUgb250b2xvZ2llc1xuICAgIG9udG9sb2dpZXM6IEFycmF5PE9udG9sb2d5TWV0YWRhdGE+ID0gW107XG5cbiAgICAvLyBvbnRvbG9neSBjaG9zZW4gYnkgdGhlIHVzZXJcbiAgICBhY3RpdmVPbnRvbG9neTogc3RyaW5nO1xuXG4gICAgLy8gcHJvcGVydGllcyBzcGVjaWZpZWQgYnkgdGhlIHVzZXJcbiAgICBhY3RpdmVQcm9wZXJ0aWVzOiBib29sZWFuW10gPSBbXTtcblxuICAgIC8vIHJlc291cmNlIGNsYXNzZXMgZm9yIHRoZSBzZWxlY3RlZCBvbnRvbG9neVxuICAgIHJlc291cmNlQ2xhc3NlczogQXJyYXk8UmVzb3VyY2VDbGFzcz4gPSBbXTtcblxuICAgIC8vIGRlZmluaXRpb24gb2YgdGhlIHNlbGVjdGVkIHJlc291cmNlIGNsYXNzLCBpZiBzZXQuXG4gICAgYWN0aXZlUmVzb3VyY2VDbGFzczogUmVzb3VyY2VDbGFzcztcblxuICAgIC8vIHByb3BlcnRpZXMgZm9yIHRoZSBzZWxlY3RlZCBvbnRvbG9neSBvciBzZWxlY3RlZCByZXNvdXJjZSBjbGFzc1xuICAgIHByb3BlcnRpZXM6IFByb3BlcnRpZXM7XG5cbiAgICByZXN1bHQ6IFJlYWRSZXNvdXJjZXNTZXF1ZW5jZSA9IG5ldyBSZWFkUmVzb3VyY2VzU2VxdWVuY2UoW10sIDApO1xuXG4gICAgLy8gcmVmZXJlbmNlIHRvIHRoZSBjb21wb25lbnQgdGhhdCBjb250cm9scyB0aGUgcmVzb3VyY2UgY2xhc3Mgc2VsZWN0aW9uXG4gICAgQFZpZXdDaGlsZCgncmVzb3VyY2VDbGFzcycpIHJlc291cmNlQ2xhc3NDb21wb25lbnQ6IFNlbGVjdFJlc291cmNlQ2xhc3NDb21wb25lbnQ7XG5cbiAgICAvLyByZWZlcmVuY2UgdG8gdGhlIGNvbXBvbmVudCBjb250cm9sbGluZyB0aGUgcHJvcGVydHkgc2VsZWN0aW9uXG4gICAgQFZpZXdDaGlsZHJlbigncHJvcGVydHknKSBwcm9wZXJ0eUNvbXBvbmVudHM6IFF1ZXJ5TGlzdDxTZWxlY3RQcm9wZXJ0eUNvbXBvbmVudD47XG5cbiAgICAvLyBGb3JtR3JvdXAgKHVzZWQgYXMgcGFyZW50IGZvciBjaGlsZCBjb21wb25lbnRzKVxuICAgIGZvcm06IEZvcm1Hcm91cDtcblxuICAgIC8vIGZvcm0gdmFsaWRhdGlvbiBzdGF0dXNcbiAgICBmb3JtVmFsaWQgPSBmYWxzZTtcblxuICAgIGNvbnN0cnVjdG9yKEBJbmplY3QoRm9ybUJ1aWxkZXIpIHByaXZhdGUgZmI6IEZvcm1CdWlsZGVyLFxuICAgICAgICBwcml2YXRlIF9yb3V0ZTogQWN0aXZhdGVkUm91dGUsXG4gICAgICAgIHByaXZhdGUgX3JvdXRlcjogUm91dGVyLFxuICAgICAgICBwcml2YXRlIF9jYWNoZVNlcnZpY2U6IE9udG9sb2d5Q2FjaGVTZXJ2aWNlLFxuICAgICAgICBwcml2YXRlIF9ncmF2U2VhcmNoU2VydmljZTogR3JhdnNlYXJjaEdlbmVyYXRpb25TZXJ2aWNlKSB7XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKSB7XG5cbiAgICAgICAgLy8gcGFyZW50IGZvcm0gaXMgZW1wdHksIGl0IGdldHMgcGFzc2VkIHRvIHRoZSBjaGlsZCBjb21wb25lbnRzXG4gICAgICAgIHRoaXMuZm9ybSA9IHRoaXMuZmIuZ3JvdXAoe30pO1xuXG4gICAgICAgIC8vIGlmIGZvcm0gc3RhdHVzIGNoYW5nZXMsIHJlLXJ1biB2YWxpZGF0aW9uXG4gICAgICAgIHRoaXMuZm9ybS5zdGF0dXNDaGFuZ2VzLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5mb3JtVmFsaWQgPSB0aGlzLnZhbGlkYXRlRm9ybSgpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2codGhpcy5mb3JtKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gaW5pdGlhbGl6ZSBvbnRvbG9naWVzIHRvIGJlIHVzZWQgZm9yIHRoZSBvbnRvbG9naWVzIHNlbGVjdGlvbiBpbiB0aGUgc2VhcmNoIGZvcm1cbiAgICAgICAgdGhpcy5pbml0aWFsaXplT250b2xvZ2llcygpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZCBhIHByb3BlcnR5IHRvIHRoZSBzZWFyY2ggZm9ybS5cbiAgICAgKi9cbiAgICBhZGRQcm9wZXJ0eSgpIHtcbiAgICAgICAgdGhpcy5hY3RpdmVQcm9wZXJ0aWVzLnB1c2godHJ1ZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlIHRoZSBsYXN0IHByb3BlcnR5IGZyb20gdGhlIHNlYXJjaCBmb3JtLlxuICAgICAqL1xuICAgIHJlbW92ZVByb3BlcnR5KCkge1xuICAgICAgICB0aGlzLmFjdGl2ZVByb3BlcnRpZXMuc3BsaWNlKC0xLCAxKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIGFsbCBhdmFpbGFibGUgb250b2xvZ2llcyBmb3IgdGhlIHNlYXJjaCBmb3JtLlxuICAgICAqL1xuICAgIGluaXRpYWxpemVPbnRvbG9naWVzKCkge1xuICAgICAgICB0aGlzLl9jYWNoZVNlcnZpY2UuZ2V0T250b2xvZ2llc01ldGFkYXRhKCkuc3Vic2NyaWJlKFxuICAgICAgICAgICAgKG9udG9sb2dpZXM6IEFycmF5PE9udG9sb2d5TWV0YWRhdGE+KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5vbnRvbG9naWVzID0gb250b2xvZ2llcztcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE9uY2UgYW4gb250b2xvZ3kgaGFzIGJlZW4gc2VsZWN0ZWQsIGdldHMgaXRzIGNsYXNzZXMgYW5kIHByb3BlcnRpZXMuXG4gICAgICogVGhlIGNsYXNzZXMgYW5kIHByb3BlcnRpZXMgd2lsbCBiZSBtYWRlIGF2YWlsYWJsZSB0byB0aGUgdXNlciBmb3Igc2VsZWN0aW9uLlxuICAgICAqXG4gICAgICogQHBhcmFtIG9udG9sb2d5SXJpIElyaSBvZiB0aGUgb250b2xvZ3kgY2hvc2VuIGJ5IHRoZSB1c2VyLlxuICAgICAqL1xuICAgIGdldFJlc291cmNlQ2xhc3Nlc0FuZFByb3BlcnRpZXNGb3JPbnRvbG9neShvbnRvbG9neUlyaTogc3RyaW5nKTogdm9pZCB7XG5cbiAgICAgICAgLy8gcmVzZXQgYWN0aXZlIHJlc291cmNlIGNsYXNzIGRlZmluaXRpb25cbiAgICAgICAgdGhpcy5hY3RpdmVSZXNvdXJjZUNsYXNzID0gdW5kZWZpbmVkO1xuXG4gICAgICAgIC8vIHJlc2V0IHNwZWNpZmllZCBwcm9wZXJ0aWVzXG4gICAgICAgIHRoaXMuYWN0aXZlUHJvcGVydGllcyA9IFtdO1xuXG4gICAgICAgIHRoaXMuYWN0aXZlT250b2xvZ3kgPSBvbnRvbG9neUlyaTtcblxuICAgICAgICB0aGlzLl9jYWNoZVNlcnZpY2UuZ2V0RW50aXR5RGVmaW5pdGlvbnNGb3JPbnRvbG9naWVzKFtvbnRvbG9neUlyaV0pLnN1YnNjcmliZShcbiAgICAgICAgICAgIChvbnRvSW5mbzogT250b2xvZ3lJbmZvcm1hdGlvbikgPT4ge1xuXG4gICAgICAgICAgICAgICAgdGhpcy5yZXNvdXJjZUNsYXNzZXMgPSBvbnRvSW5mby5nZXRSZXNvdXJjZUNsYXNzZXNBc0FycmF5KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9wZXJ0aWVzID0gb250b0luZm8uZ2V0UHJvcGVydGllcygpO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBPbmNlIGEgcmVzb3VyY2UgY2xhc3MgaGFzIGJlZW4gc2VsZWN0ZWQsIGdldHMgaXRzIHByb3BlcnRpZXMuXG4gICAgICogVGhlIHByb3BlcnRpZXMgd2lsbCBiZSBtYWRlIGF2YWlsYWJsZSB0byB0aGUgdXNlciBmb3Igc2VsZWN0aW9uLlxuICAgICAqXG4gICAgICogQHBhcmFtIHJlc291cmNlQ2xhc3NJcmlcbiAgICAgKi9cbiAgICBnZXRQcm9wZXJ0aWVzRm9yUmVzb3VyY2VDbGFzcyhyZXNvdXJjZUNsYXNzSXJpOiBzdHJpbmcpIHtcblxuICAgICAgICAvLyByZXNldCBzcGVjaWZpZWQgcHJvcGVydGllc1xuICAgICAgICB0aGlzLmFjdGl2ZVByb3BlcnRpZXMgPSBbXTtcblxuICAgICAgICAvLyBpZiB0aGUgY2xpZW50IHVuZG9lcyB0aGUgc2VsZWN0aW9uIG9mIGEgcmVzb3VyY2UgY2xhc3MsIHVzZSB0aGUgYWN0aXZlIG9udG9sb2d5IGFzIGEgZmFsbGJhY2tcbiAgICAgICAgaWYgKHJlc291cmNlQ2xhc3NJcmkgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuZ2V0UmVzb3VyY2VDbGFzc2VzQW5kUHJvcGVydGllc0Zvck9udG9sb2d5KHRoaXMuYWN0aXZlT250b2xvZ3kpO1xuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICB0aGlzLl9jYWNoZVNlcnZpY2UuZ2V0UmVzb3VyY2VDbGFzc0RlZmluaXRpb25zKFtyZXNvdXJjZUNsYXNzSXJpXSkuc3Vic2NyaWJlKFxuICAgICAgICAgICAgICAgIChvbnRvSW5mbzogT250b2xvZ3lJbmZvcm1hdGlvbikgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BlcnRpZXMgPSBvbnRvSW5mby5nZXRQcm9wZXJ0aWVzKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hY3RpdmVSZXNvdXJjZUNsYXNzID0gb250b0luZm8uZ2V0UmVzb3VyY2VDbGFzc2VzKClbcmVzb3VyY2VDbGFzc0lyaV07XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFZhbGlkYXRlcyBmb3JtIGFuZCByZXR1cm5zIGl0cyBzdGF0dXMgKGJvb2xlYW4pLlxuICAgICAqL1xuICAgIHByaXZhdGUgdmFsaWRhdGVGb3JtKCkge1xuXG4gICAgICAgIC8vIGNoZWNrIHRoYXQgZWl0aGVyIGEgcmVzb3VyY2UgY2xhc3MgaXMgc2VsZWN0ZWQgb3IgYXQgbGVhc3Qgb25lIHByb3BlcnR5IGlzIHNwZWNpZmllZFxuICAgICAgICByZXR1cm4gdGhpcy5mb3JtLnZhbGlkICYmXG4gICAgICAgICAgICAodGhpcy5wcm9wZXJ0eUNvbXBvbmVudHMubGVuZ3RoID4gMCB8fCAodGhpcy5yZXNvdXJjZUNsYXNzQ29tcG9uZW50ICE9PSB1bmRlZmluZWQgJiYgdGhpcy5yZXNvdXJjZUNsYXNzQ29tcG9uZW50LmdldFJlc291cmNlQ2xhc3NTZWxlY3RlZCgpICE9PSBmYWxzZSkpO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVzZXRzIHRoZSBmb3JtIChzZWxlY3RlZCByZXNvdXJjZSBjbGFzcyBhbmQgc3BlY2lmaWVkIHByb3BlcnRpZXMpIHByZXNlcnZpbmcgdGhlIGFjdGl2ZSBvbnRvbG9neS5cbiAgICAgKi9cbiAgICByZXNldEZvcm0oKSB7XG4gICAgICAgIGlmICh0aGlzLmFjdGl2ZU9udG9sb2d5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuZ2V0UmVzb3VyY2VDbGFzc2VzQW5kUHJvcGVydGllc0Zvck9udG9sb2d5KHRoaXMuYWN0aXZlT250b2xvZ3kpO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgR3JhdlNlYXJjaCBxdWVyeSB3aXRoIHRoZSBnaXZlbiBmb3JtIHZhbHVlcyBhbmQgY2FsbHMgdGhlIGV4dGVuZGVkIHNlYXJjaCByb3V0ZS5cbiAgICAgKi9cbiAgICBzdWJtaXQoKSB7XG5cbiAgICAgICAgaWYgKCF0aGlzLmZvcm1WYWxpZCkgcmV0dXJuOyAvLyBjaGVjayB0aGF0IGZyb20gaXMgdmFsaWRcblxuICAgICAgICBjb25zdCByZXNDbGFzc09wdGlvbiA9IHRoaXMucmVzb3VyY2VDbGFzc0NvbXBvbmVudC5nZXRSZXNvdXJjZUNsYXNzU2VsZWN0ZWQoKTtcblxuICAgICAgICBsZXQgcmVzQ2xhc3M7XG5cbiAgICAgICAgaWYgKHJlc0NsYXNzT3B0aW9uICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgcmVzQ2xhc3MgPSByZXNDbGFzc09wdGlvbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHByb3BlcnRpZXM6IFByb3BlcnR5V2l0aFZhbHVlW10gPSB0aGlzLnByb3BlcnR5Q29tcG9uZW50cy5tYXAoXG4gICAgICAgICAgICAocHJvcENvbXApID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvcENvbXAuZ2V0UHJvcGVydHlTZWxlY3RlZFdpdGhWYWx1ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuXG4gICAgICAgIGNvbnN0IGdyYXZzZWFyY2ggPSB0aGlzLl9ncmF2U2VhcmNoU2VydmljZS5jcmVhdGVHcmF2c2VhcmNoUXVlcnkocHJvcGVydGllcywgcmVzQ2xhc3MsIDApO1xuXG4gICAgICAgIHRoaXMuX3JvdXRlci5uYXZpZ2F0ZShbdGhpcy5yb3V0ZSArICcvZXh0ZW5kZWQvJywgZ3JhdnNlYXJjaF0sIHsgcmVsYXRpdmVUbzogdGhpcy5fcm91dGUgfSk7XG5cbiAgICAgICAgLy8gdG9nZ2xlIGV4dGVuZGVkIHNlYXJjaCBmb3JtXG4gICAgICAgIHRoaXMudG9nZ2xlRXh0ZW5kZWRTZWFyY2hGb3JtLmVtaXQodHJ1ZSk7XG5cbiAgICB9XG5cbn1cbiJdfQ==