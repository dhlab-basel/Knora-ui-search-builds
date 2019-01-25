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
    ExtendedSearchComponent.prototype.ngOnInit = function () {
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
     * @returns void
     */
    ExtendedSearchComponent.prototype.addProperty = function () {
        this.activeProperties.push(true);
    };
    /**
     * Remove the last property from the search form.
     * @returns void
     */
    ExtendedSearchComponent.prototype.removeProperty = function () {
        this.activeProperties.splice(-1, 1);
    };
    /**
     * Gets all available ontologies for the search form.
     * @returns void
     */
    ExtendedSearchComponent.prototype.initializeOntologies = function () {
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
     * @returns void
     */
    ExtendedSearchComponent.prototype.getResourceClassesAndPropertiesForOntology = function (ontologyIri) {
        var _this = this;
        // reset active resource class definition
        this.activeResourceClass = undefined;
        // reset specified properties
        this.activeProperties = [];
        this.activeOntology = ontologyIri;
        this._cacheService.getEntityDefinitionsForOntologies([ontologyIri]).subscribe(function (ontoInfo) {
            _this.resourceClasses = ontoInfo.getResourceClassesAsArray(true);
            _this.properties = ontoInfo.getProperties();
        });
    };
    /**
     * Once a resource class has been selected, gets its properties.
     * The properties will be made available to the user for selection.
     *
     * @param resourceClassIri
     * @returns void
     */
    ExtendedSearchComponent.prototype.getPropertiesForResourceClass = function (resourceClassIri) {
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
     */
    ExtendedSearchComponent.prototype.validateForm = function () {
        // check that either a resource class is selected or at least one property is specified
        return this.form.valid &&
            (this.propertyComponents.length > 0 || (this.resourceClassComponent !== undefined && this.resourceClassComponent.getResourceClassSelected() !== false));
    };
    /**
     * Resets the form (selected resource class and specified properties) preserving the active ontology.
     */
    ExtendedSearchComponent.prototype.resetForm = function () {
        if (this.activeOntology !== undefined) {
            this.getResourceClassesAndPropertiesForOntology(this.activeOntology);
        }
    };
    /**
     * Creates a GravSearch query with the given form values and calls the extended search route.
     */
    ExtendedSearchComponent.prototype.submit = function () {
        if (!this.formValid)
            return; // check that from is valid
        var resClassOption = this.resourceClassComponent.getResourceClassSelected();
        var resClass;
        if (resClassOption !== false) {
            resClass = resClassOption;
        }
        var properties = this.propertyComponents.map(function (propComp) {
            return propComp.getPropertySelectedWithValue();
        });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0ZW5kZWQtc2VhcmNoLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Brbm9yYS9zZWFyY2gvIiwic291cmNlcyI6WyJsaWIvZXh0ZW5kZWQtc2VhcmNoL2V4dGVuZGVkLXNlYXJjaC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBVSxNQUFNLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0gsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUN6RCxPQUFPLEVBQUUsV0FBVyxFQUFhLE1BQU0sZ0JBQWdCLENBQUM7QUFDeEQsT0FBTyxFQUNILDJCQUEyQixFQUMzQixvQkFBb0IsRUFLcEIscUJBQXFCLEVBRXhCLE1BQU0sYUFBYSxDQUFDO0FBRXJCLE9BQU8sRUFBRSw0QkFBNEIsRUFBRSxNQUFNLHlEQUF5RCxDQUFDO0FBR3ZHO0lBK0ZJLGlDQUF5QyxFQUFlLEVBQzVDLE1BQXNCLEVBQ3RCLE9BQWUsRUFDZixhQUFtQyxFQUNuQyxrQkFBK0M7UUFKbEIsT0FBRSxHQUFGLEVBQUUsQ0FBYTtRQUM1QyxXQUFNLEdBQU4sTUFBTSxDQUFnQjtRQUN0QixZQUFPLEdBQVAsT0FBTyxDQUFRO1FBQ2Ysa0JBQWEsR0FBYixhQUFhLENBQXNCO1FBQ25DLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBNkI7UUF2QzNELDBDQUEwQztRQUNoQyw2QkFBd0IsR0FBRyxJQUFJLFlBQVksRUFBVyxDQUFDO1FBRWpFLDJCQUEyQjtRQUMzQixlQUFVLEdBQTRCLEVBQUUsQ0FBQztRQUt6QyxtQ0FBbUM7UUFDbkMscUJBQWdCLEdBQWMsRUFBRSxDQUFDO1FBRWpDLDZDQUE2QztRQUM3QyxvQkFBZSxHQUF5QixFQUFFLENBQUM7UUFRM0MsV0FBTSxHQUEwQixJQUFJLHFC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QUNQLFFBQVEsRUFBRSxxQkFBcUI7b0JBQy9CLFFBQVEsRUFBRSxtckVBZ0RiO29CQUNHLE1BQU0sRUFBRSxDQUFDLCtOQUErTixDQUFDO2lCQUM1Tzs7O2dCQW5FUSxXQUFXLHVCQThHSCxNQUFNLFNBQUMsV0FBVztnQkEvRzFCLGNBQWM7Z0JBQUUsTUFBTTtnQkFJM0Isb0JBQW9CO2dCQURwQiwyQkFBMkI7Ozt3QkF1RTFCLEtBQUs7MkNBR0wsTUFBTTt5Q0F1Qk4sU0FBUyxTQUFDLGVBQWU7cUNBR3pCLFlBQVksU0FBQyxVQUFVOztJQXNLNUIsOEJBQUM7Q0FBQSxBQTdQRCxJQTZQQztTQXhNWSx1QkFBdUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgSW5qZWN0LCBJbnB1dCwgT25Jbml0LCBPdXRwdXQsIFF1ZXJ5TGlzdCwgVmlld0NoaWxkLCBWaWV3Q2hpbGRyZW4gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFjdGl2YXRlZFJvdXRlLCBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgRm9ybUJ1aWxkZXIsIEZvcm1Hcm91cCB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7XG4gICAgR3JhdnNlYXJjaEdlbmVyYXRpb25TZXJ2aWNlLFxuICAgIE9udG9sb2d5Q2FjaGVTZXJ2aWNlLFxuICAgIE9udG9sb2d5SW5mb3JtYXRpb24sXG4gICAgT250b2xvZ3lNZXRhZGF0YSxcbiAgICBQcm9wZXJ0aWVzLFxuICAgIFByb3BlcnR5V2l0aFZhbHVlLFxuICAgIFJlYWRSZXNvdXJjZXNTZXF1ZW5jZSxcbiAgICBSZXNvdXJjZUNsYXNzXG59IGZyb20gJ0Brbm9yYS9jb3JlJztcbmltcG9ydCB7IFNlbGVjdFByb3BlcnR5Q29tcG9uZW50IH0gZnJvbSAnLi9zZWxlY3QtcHJvcGVydHkvc2VsZWN0LXByb3BlcnR5LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBTZWxlY3RSZXNvdXJjZUNsYXNzQ29tcG9uZW50IH0gZnJvbSAnLi9zZWxlY3QtcmVzb3VyY2UtY2xhc3Mvc2VsZWN0LXJlc291cmNlLWNsYXNzLmNvbXBvbmVudCc7XG5cblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdrdWktZXh0ZW5kZWQtc2VhcmNoJyxcbiAgICB0ZW1wbGF0ZTogYDxmb3JtIFtmb3JtR3JvdXBdPVwiZm9ybVwiIChuZ1N1Ym1pdCk9XCJzdWJtaXQoKVwiPlxuXG4gIDxkaXY+XG4gICAgPGt1aS1zZWxlY3Qtb250b2xvZ3kgKm5nSWY9XCJvbnRvbG9naWVzLmxlbmd0aCA+IDBcIiBbZm9ybUdyb3VwXT1cImZvcm1cIiBbb250b2xvZ2llc109XCJvbnRvbG9naWVzXCIgKG9udG9sb2d5U2VsZWN0ZWQpPVwiZ2V0UmVzb3VyY2VDbGFzc2VzQW5kUHJvcGVydGllc0Zvck9udG9sb2d5KCRldmVudClcIj48L2t1aS1zZWxlY3Qtb250b2xvZ3k+XG4gIDwvZGl2PlxuXG4gIDxkaXYgY2xhc3M9XCJzZWxlY3QtcmVzb3VyY2UtY2xhc3NcIiAqbmdJZj1cInJlc291cmNlQ2xhc3Nlcz8ubGVuZ3RoID4gMFwiPlxuICAgIDxrdWktc2VsZWN0LXJlc291cmNlLWNsYXNzICNyZXNvdXJjZUNsYXNzIFtmb3JtR3JvdXBdPVwiZm9ybVwiIFtyZXNvdXJjZUNsYXNzZXNdPVwicmVzb3VyY2VDbGFzc2VzXCIgKHJlc291cmNlQ2xhc3NTZWxlY3RlZEV2ZW50KT1cImdldFByb3BlcnRpZXNGb3JSZXNvdXJjZUNsYXNzKCRldmVudClcIj48L2t1aS1zZWxlY3QtcmVzb3VyY2UtY2xhc3M+XG4gIDwvZGl2PlxuXG4gIDxkaXYgY2xhc3M9XCJzZWxlY3QtcHJvcGVydHlcIiAqbmdJZj1cInByb3BlcnRpZXMgIT09IHVuZGVmaW5lZFwiPlxuICAgIDxkaXYgKm5nRm9yPVwibGV0IHByb3Agb2YgYWN0aXZlUHJvcGVydGllczsgbGV0IGkgPSBpbmRleFwiPlxuXG4gICAgICA8a3VpLXNlbGVjdC1wcm9wZXJ0eSAjcHJvcGVydHkgW2FjdGl2ZVJlc291cmNlQ2xhc3NdPVwiYWN0aXZlUmVzb3VyY2VDbGFzc1wiIFtmb3JtR3JvdXBdPVwiZm9ybVwiIFtpbmRleF09XCJpXCIgW3Byb3BlcnRpZXNdPVwicHJvcGVydGllc1wiPjwva3VpLXNlbGVjdC1wcm9wZXJ0eT5cblxuICAgIDwvZGl2PlxuICA8L2Rpdj5cblxuXG4gIDxkaXY+XG4gICAgPGJ1dHRvbiBtYXQtbWluaS1mYWIgY2xhc3M9XCJwcm9wZXJ0eS1idXR0b25zIGFkZC1wcm9wZXJ0eS1idXR0b25cIiBjb2xvcj1cInByaW1hcnlcIiB0eXBlPVwiYnV0dG9uXCIgKGNsaWNrKT1cImFkZFByb3BlcnR5KClcIiBbZGlzYWJsZWRdPVwiYWN0aXZlT250b2xvZ3kgPT09IHVuZGVmaW5lZCB8fCBhY3RpdmVQcm9wZXJ0aWVzLmxlbmd0aCA+PSA0XCI+XG4gICAgICA8bWF0LWljb24gYXJpYS1sYWJlbD1cImFkZCBhIHByb3BlcnR5XCI+YWRkPC9tYXQtaWNvbj5cbiAgICA8L2J1dHRvbj5cblxuICAgIDxidXR0b24gbWF0LW1pbmktZmFiIGNsYXNzPVwicHJvcGVydHktYnV0dG9ucyByZW1vdmUtcHJvcGVydHktYnV0dG9uXCIgY29sb3I9XCJwcmltYXJ5XCIgdHlwZT1cImJ1dHRvblwiIChjbGljayk9XCJyZW1vdmVQcm9wZXJ0eSgpXCIgW2Rpc2FibGVkXT1cImFjdGl2ZVByb3BlcnRpZXMubGVuZ3RoID09IDBcIj5cbiAgICAgIDxtYXQtaWNvbiBhcmlhLWxhYmVsPVwicmVtb3ZlIHByb3BlcnR5XCI+cmVtb3ZlPC9tYXQtaWNvbj5cbiAgICA8L2J1dHRvbj5cbiAgPC9kaXY+XG5cbiAgPCEtLSAgPGRpdj5cbiAgICA8YnV0dG9uIG1hdC1pY29uLWJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgKGNsaWNrKT1cInJlc2V0Rm9ybSgpXCIgW2Rpc2FibGVkXT1cInRoaXMuYWN0aXZlT250b2xvZ3kgPT09IHVuZGVmaW5lZFwiPlxuICAgICAgPG1hdC1pY29uIGFyaWEtbGFiZWw9XCJyZXNldCBxdWVyeSBmb3JtXCI+Y2xlYXI8L21hdC1pY29uPlxuICAgIDwvYnV0dG9uPlxuXG4gICAgPGJ1dHRvbiBtYXQtaWNvbi1idXR0b24gdHlwZT1cInN1Ym1pdFwiIFtkaXNhYmxlZF09XCIhZm9ybVZhbGlkXCI+XG4gICAgICA8bWF0LWljb24gYXJpYS1sYWJlbD1cInN1Ym1pdCBxdWVyeVwiPnNlbmQ8L21hdC1pY29uPlxuICAgIDwvYnV0dG9uPlxuICA8L2Rpdj4gLS0+XG5cbiAgPGJ1dHRvbiBjbGFzcz1cImV4dGVuZGVkLWJ1dHRvbnMgZXh0ZW5kZWQtc2VhcmNoLWJ1dHRvblwiIG1hdC1zdHJva2VkLWJ1dHRvbiBjb2xvcj1cInByaW1hcnlcIiB0eXBlPVwic3VibWl0XCIgW2Rpc2FibGVkXT1cIiFmb3JtVmFsaWRcIj5cbiAgICBTZWFyY2hcbiAgPC9idXR0b24+XG4gIDxidXR0b24gY2xhc3M9XCJleHRlbmRlZC1idXR0b25zIHJlc2V0XCIgbWF0LXN0cm9rZWQtYnV0dG9uIHR5cGU9XCJidXR0b25cIiAoY2xpY2spPVwicmVzZXRGb3JtKClcIiBbZGlzYWJsZWRdPVwidGhpcy5hY3RpdmVPbnRvbG9neSA9PT0gdW5kZWZpbmVkXCI+XG4gICAgUmVzZXRcbiAgPC9idXR0b24+XG5cblxuPC9mb3JtPlxuYCxcbiAgICBzdHlsZXM6IFtgLmFkZC1wcm9wZXJ0eS1idXR0b257bWFyZ2luLXJpZ2h0OjVweH0uZXh0ZW5kZWQtYnV0dG9uc3ttYXJnaW4tdG9wOjI1cHh9LmV4dGVuZGVkLXNlYXJjaC1idXR0b257bWFyZ2luLXJpZ2h0OjVweH0ucHJvcGVydHktYnV0dG9uc3ttYXJnaW4tdG9wOjI1cHh9LnNlbGVjdC1wcm9wZXJ0eXttYXJnaW4tbGVmdDoyMnB4fS5zZWxlY3QtcmVzb3VyY2UtY2xhc3N7bWFyZ2luLWxlZnQ6MTJweH1gXVxufSlcbmV4cG9ydCBjbGFzcyBFeHRlbmRlZFNlYXJjaENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcm91dGUgLSBSb3V0ZSBhZnRlciBzZWFyY2hcbiAgICAgKi9cbiAgICBASW5wdXQoKSByb3V0ZTtcblxuICAgIC8vIHRyaWdnZXIgdG9nZ2xlIGZvciBleHRlbmRlZCBzZWFyY2ggZm9ybVxuICAgIEBPdXRwdXQoKSB0b2dnbGVFeHRlbmRlZFNlYXJjaEZvcm0gPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KCk7XG5cbiAgICAvLyBhbGwgYXZhaWxhYmxlIG9udG9sb2dpZXNcbiAgICBvbnRvbG9naWVzOiBBcnJheTxPbnRvbG9neU1ldGFkYXRhPiA9IFtdO1xuXG4gICAgLy8gb250b2xvZ3kgY2hvc2VuIGJ5IHRoZSB1c2VyXG4gICAgYWN0aXZlT250b2xvZ3k6IHN0cmluZztcblxuICAgIC8vIHByb3BlcnRpZXMgc3BlY2lmaWVkIGJ5IHRoZSB1c2VyXG4gICAgYWN0aXZlUHJvcGVydGllczogYm9vbGVhbltdID0gW107XG5cbiAgICAvLyByZXNvdXJjZSBjbGFzc2VzIGZvciB0aGUgc2VsZWN0ZWQgb250b2xvZ3lcbiAgICByZXNvdXJjZUNsYXNzZXM6IEFycmF5PFJlc291cmNlQ2xhc3M+ID0gW107XG5cbiAgICAvLyBkZWZpbml0aW9uIG9mIHRoZSBzZWxlY3RlZCByZXNvdXJjZSBjbGFzcywgaWYgc2V0LlxuICAgIGFjdGl2ZVJlc291cmNlQ2xhc3M6IFJlc291cmNlQ2xhc3M7XG5cbiAgICAvLyBwcm9wZXJ0aWVzIGZvciB0aGUgc2VsZWN0ZWQgb250b2xvZ3kgb3Igc2VsZWN0ZWQgcmVzb3VyY2UgY2xhc3NcbiAgICBwcm9wZXJ0aWVzOiBQcm9wZXJ0aWVzO1xuXG4gICAgcmVzdWx0OiBSZWFkUmVzb3VyY2VzU2VxdWVuY2UgPSBuZXcgUmVhZFJlc291cmNlc1NlcXVlbmNlKFtdLCAwKTtcblxuICAgIC8vIHJlZmVyZW5jZSB0byB0aGUgY29tcG9uZW50IHRoYXQgY29udHJvbHMgdGhlIHJlc291cmNlIGNsYXNzIHNlbGVjdGlvblxuICAgIEBWaWV3Q2hpbGQoJ3Jlc291cmNlQ2xhc3MnKSByZXNvdXJjZUNsYXNzQ29tcG9uZW50OiBTZWxlY3RSZXNvdXJjZUNsYXNzQ29tcG9uZW50O1xuXG4gICAgLy8gcmVmZXJlbmNlIHRvIHRoZSBjb21wb25lbnQgY29udHJvbGxpbmcgdGhlIHByb3BlcnR5IHNlbGVjdGlvblxuICAgIEBWaWV3Q2hpbGRyZW4oJ3Byb3BlcnR5JykgcHJvcGVydHlDb21wb25lbnRzOiBRdWVyeUxpc3Q8U2VsZWN0UHJvcGVydHlDb21wb25lbnQ+O1xuXG4gICAgLy8gRm9ybUdyb3VwICh1c2VkIGFzIHBhcmVudCBmb3IgY2hpbGQgY29tcG9uZW50cylcbiAgICBmb3JtOiBGb3JtR3JvdXA7XG5cbiAgICAvLyBmb3JtIHZhbGlkYXRpb24gc3RhdHVzXG4gICAgZm9ybVZhbGlkID0gZmFsc2U7XG5cbiAgICBjb25zdHJ1Y3RvcihASW5qZWN0KEZvcm1CdWlsZGVyKSBwcml2YXRlIGZiOiBGb3JtQnVpbGRlcixcbiAgICAgICAgcHJpdmF0ZSBfcm91dGU6IEFjdGl2YXRlZFJvdXRlLFxuICAgICAgICBwcml2YXRlIF9yb3V0ZXI6IFJvdXRlcixcbiAgICAgICAgcHJpdmF0ZSBfY2FjaGVTZXJ2aWNlOiBPbnRvbG9neUNhY2hlU2VydmljZSxcbiAgICAgICAgcHJpdmF0ZSBfZ3JhdlNlYXJjaFNlcnZpY2U6IEdyYXZzZWFyY2hHZW5lcmF0aW9uU2VydmljZSkge1xuICAgIH1cblxuICAgIG5nT25Jbml0KCkge1xuXG4gICAgICAgIC8vIHBhcmVudCBmb3JtIGlzIGVtcHR5LCBpdCBnZXRzIHBhc3NlZCB0byB0aGUgY2hpbGQgY29tcG9uZW50c1xuICAgICAgICB0aGlzLmZvcm0gPSB0aGlzLmZiLmdyb3VwKHt9KTtcblxuICAgICAgICAvLyBpZiBmb3JtIHN0YXR1cyBjaGFuZ2VzLCByZS1ydW4gdmFsaWRhdGlvblxuICAgICAgICB0aGlzLmZvcm0uc3RhdHVzQ2hhbmdlcy5zdWJzY3JpYmUoKGRhdGEpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZm9ybVZhbGlkID0gdGhpcy52YWxpZGF0ZUZvcm0oKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuZm9ybSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGluaXRpYWxpemUgb250b2xvZ2llcyB0byBiZSB1c2VkIGZvciB0aGUgb250b2xvZ2llcyBzZWxlY3Rpb24gaW4gdGhlIHNlYXJjaCBmb3JtXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZU9udG9sb2dpZXMoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBZGQgYSBwcm9wZXJ0eSB0byB0aGUgc2VhcmNoIGZvcm0uXG4gICAgICogQHJldHVybnMgdm9pZFxuICAgICAqL1xuICAgIGFkZFByb3BlcnR5KCk6IHZvaWQge1xuICAgICAgICB0aGlzLmFjdGl2ZVByb3BlcnRpZXMucHVzaCh0cnVlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgdGhlIGxhc3QgcHJvcGVydHkgZnJvbSB0aGUgc2VhcmNoIGZvcm0uXG4gICAgICogQHJldHVybnMgdm9pZFxuICAgICAqL1xuICAgIHJlbW92ZVByb3BlcnR5KCk6IHZvaWQge1xuICAgICAgICB0aGlzLmFjdGl2ZVByb3BlcnRpZXMuc3BsaWNlKC0xLCAxKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIGFsbCBhdmFpbGFibGUgb250b2xvZ2llcyBmb3IgdGhlIHNlYXJjaCBmb3JtLlxuICAgICAqIEByZXR1cm5zIHZvaWRcbiAgICAgKi9cbiAgICBpbml0aWFsaXplT250b2xvZ2llcygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fY2FjaGVTZXJ2aWNlLmdldE9udG9sb2dpZXNNZXRhZGF0YSgpLnN1YnNjcmliZShcbiAgICAgICAgICAgIChvbnRvbG9naWVzOiBBcnJheTxPbnRvbG9neU1ldGFkYXRhPikgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMub250b2xvZ2llcyA9IG9udG9sb2dpZXM7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBPbmNlIGFuIG9udG9sb2d5IGhhcyBiZWVuIHNlbGVjdGVkLCBnZXRzIGl0cyBjbGFzc2VzIGFuZCBwcm9wZXJ0aWVzLlxuICAgICAqIFRoZSBjbGFzc2VzIGFuZCBwcm9wZXJ0aWVzIHdpbGwgYmUgbWFkZSBhdmFpbGFibGUgdG8gdGhlIHVzZXIgZm9yIHNlbGVjdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBvbnRvbG9neUlyaSBJcmkgb2YgdGhlIG9udG9sb2d5IGNob3NlbiBieSB0aGUgdXNlci5cbiAgICAgKiBAcmV0dXJucyB2b2lkXG4gICAgICovXG4gICAgZ2V0UmVzb3VyY2VDbGFzc2VzQW5kUHJvcGVydGllc0Zvck9udG9sb2d5KG9udG9sb2d5SXJpOiBzdHJpbmcpOiB2b2lkIHtcblxuICAgICAgICAvLyByZXNldCBhY3RpdmUgcmVzb3VyY2UgY2xhc3MgZGVmaW5pdGlvblxuICAgICAgICB0aGlzLmFjdGl2ZVJlc291cmNlQ2xhc3MgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgLy8gcmVzZXQgc3BlY2lmaWVkIHByb3BlcnRpZXNcbiAgICAgICAgdGhpcy5hY3RpdmVQcm9wZXJ0aWVzID0gW107XG5cbiAgICAgICAgdGhpcy5hY3RpdmVPbnRvbG9neSA9IG9udG9sb2d5SXJpO1xuXG4gICAgICAgIHRoaXMuX2NhY2hlU2VydmljZS5nZXRFbnRpdHlEZWZpbml0aW9uc0Zvck9udG9sb2dpZXMoW29udG9sb2d5SXJpXSkuc3Vic2NyaWJlKFxuICAgICAgICAgICAgKG9udG9JbmZvOiBPbnRvbG9neUluZm9ybWF0aW9uKSA9PiB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnJlc291cmNlQ2xhc3NlcyA9IG9udG9JbmZvLmdldFJlc291cmNlQ2xhc3Nlc0FzQXJyYXkodHJ1ZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9wZXJ0aWVzID0gb250b0luZm8uZ2V0UHJvcGVydGllcygpO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBPbmNlIGEgcmVzb3VyY2UgY2xhc3MgaGFzIGJlZW4gc2VsZWN0ZWQsIGdldHMgaXRzIHByb3BlcnRpZXMuXG4gICAgICogVGhlIHByb3BlcnRpZXMgd2lsbCBiZSBtYWRlIGF2YWlsYWJsZSB0byB0aGUgdXNlciBmb3Igc2VsZWN0aW9uLlxuICAgICAqXG4gICAgICogQHBhcmFtIHJlc291cmNlQ2xhc3NJcmlcbiAgICAgKiBAcmV0dXJucyB2b2lkXG4gICAgICovXG4gICAgZ2V0UHJvcGVydGllc0ZvclJlc291cmNlQ2xhc3MocmVzb3VyY2VDbGFzc0lyaTogc3RyaW5nKTogdm9pZCB7XG5cbiAgICAgICAgLy8gcmVzZXQgc3BlY2lmaWVkIHByb3BlcnRpZXNcbiAgICAgICAgdGhpcy5hY3RpdmVQcm9wZXJ0aWVzID0gW107XG5cbiAgICAgICAgLy8gaWYgdGhlIGNsaWVudCB1bmRvZXMgdGhlIHNlbGVjdGlvbiBvZiBhIHJlc291cmNlIGNsYXNzLCB1c2UgdGhlIGFjdGl2ZSBvbnRvbG9neSBhcyBhIGZhbGxiYWNrXG4gICAgICAgIGlmIChyZXNvdXJjZUNsYXNzSXJpID09PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmdldFJlc291cmNlQ2xhc3Nlc0FuZFByb3BlcnRpZXNGb3JPbnRvbG9neSh0aGlzLmFjdGl2ZU9udG9sb2d5KTtcbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgdGhpcy5fY2FjaGVTZXJ2aWNlLmdldFJlc291cmNlQ2xhc3NEZWZpbml0aW9ucyhbcmVzb3VyY2VDbGFzc0lyaV0pLnN1YnNjcmliZShcbiAgICAgICAgICAgICAgICAob250b0luZm86IE9udG9sb2d5SW5mb3JtYXRpb24pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9wZXJ0aWVzID0gb250b0luZm8uZ2V0UHJvcGVydGllcygpO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWN0aXZlUmVzb3VyY2VDbGFzcyA9IG9udG9JbmZvLmdldFJlc291cmNlQ2xhc3NlcygpW3Jlc291cmNlQ2xhc3NJcmldO1xuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcblxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBWYWxpZGF0ZXMgZm9ybSBhbmQgcmV0dXJucyBpdHMgc3RhdHVzIChib29sZWFuKS5cbiAgICAgKi9cbiAgICBwcml2YXRlIHZhbGlkYXRlRm9ybSgpIHtcblxuICAgICAgICAvLyBjaGVjayB0aGF0IGVpdGhlciBhIHJlc291cmNlIGNsYXNzIGlzIHNlbGVjdGVkIG9yIGF0IGxlYXN0IG9uZSBwcm9wZXJ0eSBpcyBzcGVjaWZpZWRcbiAgICAgICAgcmV0dXJuIHRoaXMuZm9ybS52YWxpZCAmJlxuICAgICAgICAgICAgKHRoaXMucHJvcGVydHlDb21wb25lbnRzLmxlbmd0aCA+IDAgfHwgKHRoaXMucmVzb3VyY2VDbGFzc0NvbXBvbmVudCAhPT0gdW5kZWZpbmVkICYmIHRoaXMucmVzb3VyY2VDbGFzc0NvbXBvbmVudC5nZXRSZXNvdXJjZUNsYXNzU2VsZWN0ZWQoKSAhPT0gZmFsc2UpKTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlc2V0cyB0aGUgZm9ybSAoc2VsZWN0ZWQgcmVzb3VyY2UgY2xhc3MgYW5kIHNwZWNpZmllZCBwcm9wZXJ0aWVzKSBwcmVzZXJ2aW5nIHRoZSBhY3RpdmUgb250b2xvZ3kuXG4gICAgICovXG4gICAgcmVzZXRGb3JtKCkge1xuICAgICAgICBpZiAodGhpcy5hY3RpdmVPbnRvbG9neSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLmdldFJlc291cmNlQ2xhc3Nlc0FuZFByb3BlcnRpZXNGb3JPbnRvbG9neSh0aGlzLmFjdGl2ZU9udG9sb2d5KTtcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIEdyYXZTZWFyY2ggcXVlcnkgd2l0aCB0aGUgZ2l2ZW4gZm9ybSB2YWx1ZXMgYW5kIGNhbGxzIHRoZSBleHRlbmRlZCBzZWFyY2ggcm91dGUuXG4gICAgICovXG4gICAgc3VibWl0KCkge1xuXG4gICAgICAgIGlmICghdGhpcy5mb3JtVmFsaWQpIHJldHVybjsgLy8gY2hlY2sgdGhhdCBmcm9tIGlzIHZhbGlkXG5cbiAgICAgICAgY29uc3QgcmVzQ2xhc3NPcHRpb24gPSB0aGlzLnJlc291cmNlQ2xhc3NDb21wb25lbnQuZ2V0UmVzb3VyY2VDbGFzc1NlbGVjdGVkKCk7XG5cbiAgICAgICAgbGV0IHJlc0NsYXNzO1xuXG4gICAgICAgIGlmIChyZXNDbGFzc09wdGlvbiAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHJlc0NsYXNzID0gcmVzQ2xhc3NPcHRpb247XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwcm9wZXJ0aWVzOiBQcm9wZXJ0eVdpdGhWYWx1ZVtdID0gdGhpcy5wcm9wZXJ0eUNvbXBvbmVudHMubWFwKFxuICAgICAgICAgICAgKHByb3BDb21wKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb3BDb21wLmdldFByb3BlcnR5U2VsZWN0ZWRXaXRoVmFsdWUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcblxuICAgICAgICBjb25zdCBncmF2c2VhcmNoID0gdGhpcy5fZ3JhdlNlYXJjaFNlcnZpY2UuY3JlYXRlR3JhdnNlYXJjaFF1ZXJ5KHByb3BlcnRpZXMsIHJlc0NsYXNzLCAwKTtcblxuICAgICAgICB0aGlzLl9yb3V0ZXIubmF2aWdhdGUoW3RoaXMucm91dGUgKyAnL2V4dGVuZGVkLycsIGdyYXZzZWFyY2hdLCB7IHJlbGF0aXZlVG86IHRoaXMuX3JvdXRlIH0pO1xuXG4gICAgICAgIC8vIHRvZ2dsZSBleHRlbmRlZCBzZWFyY2ggZm9ybVxuICAgICAgICB0aGlzLnRvZ2dsZUV4dGVuZGVkU2VhcmNoRm9ybS5lbWl0KHRydWUpO1xuXG4gICAgfVxuXG59XG4iXX0=