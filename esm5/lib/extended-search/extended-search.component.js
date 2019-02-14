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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0ZW5kZWQtc2VhcmNoLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Brbm9yYS9zZWFyY2gvIiwic291cmNlcyI6WyJsaWIvZXh0ZW5kZWQtc2VhcmNoL2V4dGVuZGVkLXNlYXJjaC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBVSxNQUFNLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0gsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUN6RCxPQUFPLEVBQUUsV0FBVyxFQUFhLE1BQU0sZ0JBQWdCLENBQUM7QUFDeEQsT0FBTyxFQUNILDJCQUEyQixFQUMzQixvQkFBb0IsRUFLcEIscUJBQXFCLEVBRXhCLE1BQU0sYUFBYSxDQUFDO0FBRXJCLE9BQU8sRUFBRSw0QkFBNEIsRUFBRSxNQUFNLHlEQUF5RCxDQUFDO0FBR3ZHO0lBK0ZJLGlDQUF5QyxFQUFlLEVBQzVDLE1BQXNCLEVBQ3RCLE9BQWUsRUFDZixhQUFtQyxFQUNuQyxrQkFBK0M7UUFKbEIsT0FBRSxHQUFGLEVBQUUsQ0FBYTtRQUM1QyxXQUFNLEdBQU4sTUFBTSxDQUFnQjtRQUN0QixZQUFPLEdBQVAsT0FBTyxDQUFRO1FBQ2Ysa0JBQWEsR0FBYixhQUFhLENBQXNCO1FBQ25DLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBNkI7UUF2QzNELDBDQUEwQztRQUNoQyw2QkFBd0IsR0FBRyxJQUFJLFlBQVksRUFBVyxDQUFDO1FBRWpFLDJCQUEyQjtRQUMzQixlQUFVLEdBQTRCLEVBQUUsQ0FBQztRQUt6QyxtQ0FBbUM7UUFDbkMscUJBQWdCLEdBQWMsRUFBRSxDQUFDO1FBRWpDLDZDQUE2QztRQUM3QyxvQkFBZSxHQUF5QixFQUFFLENBQUM7UUFRM0MsV0FBTSxHQUEwQixJQUFJLHFC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QUNQLFFBQVEsRUFBRSxxQkFBcUI7b0JBQy9CLFFBQVEsRUFBRSxtckVBZ0RiO29CQUNHLE1BQU0sRUFBRSxDQUFDLCtOQUErTixDQUFDO2lCQUM1Tzs7OztnQkFuRVEsV0FBVyx1QkE4R0gsTUFBTSxTQUFDLFdBQVc7Z0JBL0cxQixjQUFjO2dCQUFFLE1BQU07Z0JBSTNCLG9CQUFvQjtnQkFEcEIsMkJBQTJCOzs7d0JBdUUxQixLQUFLOzJDQUdMLE1BQU07eUNBdUJOLFNBQVMsU0FBQyxlQUFlO3FDQUd6QixZQUFZLFNBQUMsVUFBVTs7SUFzSzVCLDhCQUFDO0NBQUEsQUE3UEQsSUE2UEM7U0F4TVksdUJBQXVCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIEluamVjdCwgSW5wdXQsIE9uSW5pdCwgT3V0cHV0LCBRdWVyeUxpc3QsIFZpZXdDaGlsZCwgVmlld0NoaWxkcmVuIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZSwgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IEZvcm1CdWlsZGVyLCBGb3JtR3JvdXAgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge1xuICAgIEdyYXZzZWFyY2hHZW5lcmF0aW9uU2VydmljZSxcbiAgICBPbnRvbG9neUNhY2hlU2VydmljZSxcbiAgICBPbnRvbG9neUluZm9ybWF0aW9uLFxuICAgIE9udG9sb2d5TWV0YWRhdGEsXG4gICAgUHJvcGVydGllcyxcbiAgICBQcm9wZXJ0eVdpdGhWYWx1ZSxcbiAgICBSZWFkUmVzb3VyY2VzU2VxdWVuY2UsXG4gICAgUmVzb3VyY2VDbGFzc1xufSBmcm9tICdAa25vcmEvY29yZSc7XG5pbXBvcnQgeyBTZWxlY3RQcm9wZXJ0eUNvbXBvbmVudCB9IGZyb20gJy4vc2VsZWN0LXByb3BlcnR5L3NlbGVjdC1wcm9wZXJ0eS5jb21wb25lbnQnO1xuaW1wb3J0IHsgU2VsZWN0UmVzb3VyY2VDbGFzc0NvbXBvbmVudCB9IGZyb20gJy4vc2VsZWN0LXJlc291cmNlLWNsYXNzL3NlbGVjdC1yZXNvdXJjZS1jbGFzcy5jb21wb25lbnQnO1xuXG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAna3VpLWV4dGVuZGVkLXNlYXJjaCcsXG4gICAgdGVtcGxhdGU6IGA8Zm9ybSBbZm9ybUdyb3VwXT1cImZvcm1cIiAobmdTdWJtaXQpPVwic3VibWl0KClcIj5cblxuICA8ZGl2PlxuICAgIDxrdWktc2VsZWN0LW9udG9sb2d5ICpuZ0lmPVwib250b2xvZ2llcy5sZW5ndGggPiAwXCIgW2Zvcm1Hcm91cF09XCJmb3JtXCIgW29udG9sb2dpZXNdPVwib250b2xvZ2llc1wiIChvbnRvbG9neVNlbGVjdGVkKT1cImdldFJlc291cmNlQ2xhc3Nlc0FuZFByb3BlcnRpZXNGb3JPbnRvbG9neSgkZXZlbnQpXCI+PC9rdWktc2VsZWN0LW9udG9sb2d5PlxuICA8L2Rpdj5cblxuICA8ZGl2IGNsYXNzPVwic2VsZWN0LXJlc291cmNlLWNsYXNzXCIgKm5nSWY9XCJyZXNvdXJjZUNsYXNzZXM/Lmxlbmd0aCA+IDBcIj5cbiAgICA8a3VpLXNlbGVjdC1yZXNvdXJjZS1jbGFzcyAjcmVzb3VyY2VDbGFzcyBbZm9ybUdyb3VwXT1cImZvcm1cIiBbcmVzb3VyY2VDbGFzc2VzXT1cInJlc291cmNlQ2xhc3Nlc1wiIChyZXNvdXJjZUNsYXNzU2VsZWN0ZWRFdmVudCk9XCJnZXRQcm9wZXJ0aWVzRm9yUmVzb3VyY2VDbGFzcygkZXZlbnQpXCI+PC9rdWktc2VsZWN0LXJlc291cmNlLWNsYXNzPlxuICA8L2Rpdj5cblxuICA8ZGl2IGNsYXNzPVwic2VsZWN0LXByb3BlcnR5XCIgKm5nSWY9XCJwcm9wZXJ0aWVzICE9PSB1bmRlZmluZWRcIj5cbiAgICA8ZGl2ICpuZ0Zvcj1cImxldCBwcm9wIG9mIGFjdGl2ZVByb3BlcnRpZXM7IGxldCBpID0gaW5kZXhcIj5cblxuICAgICAgPGt1aS1zZWxlY3QtcHJvcGVydHkgI3Byb3BlcnR5IFthY3RpdmVSZXNvdXJjZUNsYXNzXT1cImFjdGl2ZVJlc291cmNlQ2xhc3NcIiBbZm9ybUdyb3VwXT1cImZvcm1cIiBbaW5kZXhdPVwiaVwiIFtwcm9wZXJ0aWVzXT1cInByb3BlcnRpZXNcIj48L2t1aS1zZWxlY3QtcHJvcGVydHk+XG5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG5cblxuICA8ZGl2PlxuICAgIDxidXR0b24gbWF0LW1pbmktZmFiIGNsYXNzPVwicHJvcGVydHktYnV0dG9ucyBhZGQtcHJvcGVydHktYnV0dG9uXCIgY29sb3I9XCJwcmltYXJ5XCIgdHlwZT1cImJ1dHRvblwiIChjbGljayk9XCJhZGRQcm9wZXJ0eSgpXCIgW2Rpc2FibGVkXT1cImFjdGl2ZU9udG9sb2d5ID09PSB1bmRlZmluZWQgfHwgYWN0aXZlUHJvcGVydGllcy5sZW5ndGggPj0gNFwiPlxuICAgICAgPG1hdC1pY29uIGFyaWEtbGFiZWw9XCJhZGQgYSBwcm9wZXJ0eVwiPmFkZDwvbWF0LWljb24+XG4gICAgPC9idXR0b24+XG5cbiAgICA8YnV0dG9uIG1hdC1taW5pLWZhYiBjbGFzcz1cInByb3BlcnR5LWJ1dHRvbnMgcmVtb3ZlLXByb3BlcnR5LWJ1dHRvblwiIGNvbG9yPVwicHJpbWFyeVwiIHR5cGU9XCJidXR0b25cIiAoY2xpY2spPVwicmVtb3ZlUHJvcGVydHkoKVwiIFtkaXNhYmxlZF09XCJhY3RpdmVQcm9wZXJ0aWVzLmxlbmd0aCA9PSAwXCI+XG4gICAgICA8bWF0LWljb24gYXJpYS1sYWJlbD1cInJlbW92ZSBwcm9wZXJ0eVwiPnJlbW92ZTwvbWF0LWljb24+XG4gICAgPC9idXR0b24+XG4gIDwvZGl2PlxuXG4gIDwhLS0gIDxkaXY+XG4gICAgPGJ1dHRvbiBtYXQtaWNvbi1idXR0b24gdHlwZT1cImJ1dHRvblwiIChjbGljayk9XCJyZXNldEZvcm0oKVwiIFtkaXNhYmxlZF09XCJ0aGlzLmFjdGl2ZU9udG9sb2d5ID09PSB1bmRlZmluZWRcIj5cbiAgICAgIDxtYXQtaWNvbiBhcmlhLWxhYmVsPVwicmVzZXQgcXVlcnkgZm9ybVwiPmNsZWFyPC9tYXQtaWNvbj5cbiAgICA8L2J1dHRvbj5cblxuICAgIDxidXR0b24gbWF0LWljb24tYnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBbZGlzYWJsZWRdPVwiIWZvcm1WYWxpZFwiPlxuICAgICAgPG1hdC1pY29uIGFyaWEtbGFiZWw9XCJzdWJtaXQgcXVlcnlcIj5zZW5kPC9tYXQtaWNvbj5cbiAgICA8L2J1dHRvbj5cbiAgPC9kaXY+IC0tPlxuXG4gIDxidXR0b24gY2xhc3M9XCJleHRlbmRlZC1idXR0b25zIGV4dGVuZGVkLXNlYXJjaC1idXR0b25cIiBtYXQtc3Ryb2tlZC1idXR0b24gY29sb3I9XCJwcmltYXJ5XCIgdHlwZT1cInN1Ym1pdFwiIFtkaXNhYmxlZF09XCIhZm9ybVZhbGlkXCI+XG4gICAgU2VhcmNoXG4gIDwvYnV0dG9uPlxuICA8YnV0dG9uIGNsYXNzPVwiZXh0ZW5kZWQtYnV0dG9ucyByZXNldFwiIG1hdC1zdHJva2VkLWJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgKGNsaWNrKT1cInJlc2V0Rm9ybSgpXCIgW2Rpc2FibGVkXT1cInRoaXMuYWN0aXZlT250b2xvZ3kgPT09IHVuZGVmaW5lZFwiPlxuICAgIFJlc2V0XG4gIDwvYnV0dG9uPlxuXG5cbjwvZm9ybT5cbmAsXG4gICAgc3R5bGVzOiBbYC5hZGQtcHJvcGVydHktYnV0dG9ue21hcmdpbi1yaWdodDo1cHh9LmV4dGVuZGVkLWJ1dHRvbnN7bWFyZ2luLXRvcDoyNXB4fS5leHRlbmRlZC1zZWFyY2gtYnV0dG9ue21hcmdpbi1yaWdodDo1cHh9LnByb3BlcnR5LWJ1dHRvbnN7bWFyZ2luLXRvcDoyNXB4fS5zZWxlY3QtcHJvcGVydHl7bWFyZ2luLWxlZnQ6MjJweH0uc2VsZWN0LXJlc291cmNlLWNsYXNze21hcmdpbi1sZWZ0OjEycHh9YF1cbn0pXG5leHBvcnQgY2xhc3MgRXh0ZW5kZWRTZWFyY2hDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHJvdXRlIC0gUm91dGUgYWZ0ZXIgc2VhcmNoXG4gICAgICovXG4gICAgQElucHV0KCkgcm91dGU7XG5cbiAgICAvLyB0cmlnZ2VyIHRvZ2dsZSBmb3IgZXh0ZW5kZWQgc2VhcmNoIGZvcm1cbiAgICBAT3V0cHV0KCkgdG9nZ2xlRXh0ZW5kZWRTZWFyY2hGb3JtID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xuXG4gICAgLy8gYWxsIGF2YWlsYWJsZSBvbnRvbG9naWVzXG4gICAgb250b2xvZ2llczogQXJyYXk8T250b2xvZ3lNZXRhZGF0YT4gPSBbXTtcblxuICAgIC8vIG9udG9sb2d5IGNob3NlbiBieSB0aGUgdXNlclxuICAgIGFjdGl2ZU9udG9sb2d5OiBzdHJpbmc7XG5cbiAgICAvLyBwcm9wZXJ0aWVzIHNwZWNpZmllZCBieSB0aGUgdXNlclxuICAgIGFjdGl2ZVByb3BlcnRpZXM6IGJvb2xlYW5bXSA9IFtdO1xuXG4gICAgLy8gcmVzb3VyY2UgY2xhc3NlcyBmb3IgdGhlIHNlbGVjdGVkIG9udG9sb2d5XG4gICAgcmVzb3VyY2VDbGFzc2VzOiBBcnJheTxSZXNvdXJjZUNsYXNzPiA9IFtdO1xuXG4gICAgLy8gZGVmaW5pdGlvbiBvZiB0aGUgc2VsZWN0ZWQgcmVzb3VyY2UgY2xhc3MsIGlmIHNldC5cbiAgICBhY3RpdmVSZXNvdXJjZUNsYXNzOiBSZXNvdXJjZUNsYXNzO1xuXG4gICAgLy8gcHJvcGVydGllcyBmb3IgdGhlIHNlbGVjdGVkIG9udG9sb2d5IG9yIHNlbGVjdGVkIHJlc291cmNlIGNsYXNzXG4gICAgcHJvcGVydGllczogUHJvcGVydGllcztcblxuICAgIHJlc3VsdDogUmVhZFJlc291cmNlc1NlcXVlbmNlID0gbmV3IFJlYWRSZXNvdXJjZXNTZXF1ZW5jZShbXSwgMCk7XG5cbiAgICAvLyByZWZlcmVuY2UgdG8gdGhlIGNvbXBvbmVudCB0aGF0IGNvbnRyb2xzIHRoZSByZXNvdXJjZSBjbGFzcyBzZWxlY3Rpb25cbiAgICBAVmlld0NoaWxkKCdyZXNvdXJjZUNsYXNzJykgcmVzb3VyY2VDbGFzc0NvbXBvbmVudDogU2VsZWN0UmVzb3VyY2VDbGFzc0NvbXBvbmVudDtcblxuICAgIC8vIHJlZmVyZW5jZSB0byB0aGUgY29tcG9uZW50IGNvbnRyb2xsaW5nIHRoZSBwcm9wZXJ0eSBzZWxlY3Rpb25cbiAgICBAVmlld0NoaWxkcmVuKCdwcm9wZXJ0eScpIHByb3BlcnR5Q29tcG9uZW50czogUXVlcnlMaXN0PFNlbGVjdFByb3BlcnR5Q29tcG9uZW50PjtcblxuICAgIC8vIEZvcm1Hcm91cCAodXNlZCBhcyBwYXJlbnQgZm9yIGNoaWxkIGNvbXBvbmVudHMpXG4gICAgZm9ybTogRm9ybUdyb3VwO1xuXG4gICAgLy8gZm9ybSB2YWxpZGF0aW9uIHN0YXR1c1xuICAgIGZvcm1WYWxpZCA9IGZhbHNlO1xuXG4gICAgY29uc3RydWN0b3IoQEluamVjdChGb3JtQnVpbGRlcikgcHJpdmF0ZSBmYjogRm9ybUJ1aWxkZXIsXG4gICAgICAgIHByaXZhdGUgX3JvdXRlOiBBY3RpdmF0ZWRSb3V0ZSxcbiAgICAgICAgcHJpdmF0ZSBfcm91dGVyOiBSb3V0ZXIsXG4gICAgICAgIHByaXZhdGUgX2NhY2hlU2VydmljZTogT250b2xvZ3lDYWNoZVNlcnZpY2UsXG4gICAgICAgIHByaXZhdGUgX2dyYXZTZWFyY2hTZXJ2aWNlOiBHcmF2c2VhcmNoR2VuZXJhdGlvblNlcnZpY2UpIHtcbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHtcblxuICAgICAgICAvLyBwYXJlbnQgZm9ybSBpcyBlbXB0eSwgaXQgZ2V0cyBwYXNzZWQgdG8gdGhlIGNoaWxkIGNvbXBvbmVudHNcbiAgICAgICAgdGhpcy5mb3JtID0gdGhpcy5mYi5ncm91cCh7fSk7XG5cbiAgICAgICAgLy8gaWYgZm9ybSBzdGF0dXMgY2hhbmdlcywgcmUtcnVuIHZhbGlkYXRpb25cbiAgICAgICAgdGhpcy5mb3JtLnN0YXR1c0NoYW5nZXMuc3Vic2NyaWJlKChkYXRhKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZvcm1WYWxpZCA9IHRoaXMudmFsaWRhdGVGb3JtKCk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLmZvcm0pO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBpbml0aWFsaXplIG9udG9sb2dpZXMgdG8gYmUgdXNlZCBmb3IgdGhlIG9udG9sb2dpZXMgc2VsZWN0aW9uIGluIHRoZSBzZWFyY2ggZm9ybVxuICAgICAgICB0aGlzLmluaXRpYWxpemVPbnRvbG9naWVzKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIGEgcHJvcGVydHkgdG8gdGhlIHNlYXJjaCBmb3JtLlxuICAgICAqIEByZXR1cm5zIHZvaWRcbiAgICAgKi9cbiAgICBhZGRQcm9wZXJ0eSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5hY3RpdmVQcm9wZXJ0aWVzLnB1c2godHJ1ZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlIHRoZSBsYXN0IHByb3BlcnR5IGZyb20gdGhlIHNlYXJjaCBmb3JtLlxuICAgICAqIEByZXR1cm5zIHZvaWRcbiAgICAgKi9cbiAgICByZW1vdmVQcm9wZXJ0eSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5hY3RpdmVQcm9wZXJ0aWVzLnNwbGljZSgtMSwgMSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyBhbGwgYXZhaWxhYmxlIG9udG9sb2dpZXMgZm9yIHRoZSBzZWFyY2ggZm9ybS5cbiAgICAgKiBAcmV0dXJucyB2b2lkXG4gICAgICovXG4gICAgaW5pdGlhbGl6ZU9udG9sb2dpZXMoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX2NhY2hlU2VydmljZS5nZXRPbnRvbG9naWVzTWV0YWRhdGEoKS5zdWJzY3JpYmUoXG4gICAgICAgICAgICAob250b2xvZ2llczogQXJyYXk8T250b2xvZ3lNZXRhZGF0YT4pID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLm9udG9sb2dpZXMgPSBvbnRvbG9naWVzO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogT25jZSBhbiBvbnRvbG9neSBoYXMgYmVlbiBzZWxlY3RlZCwgZ2V0cyBpdHMgY2xhc3NlcyBhbmQgcHJvcGVydGllcy5cbiAgICAgKiBUaGUgY2xhc3NlcyBhbmQgcHJvcGVydGllcyB3aWxsIGJlIG1hZGUgYXZhaWxhYmxlIHRvIHRoZSB1c2VyIGZvciBzZWxlY3Rpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gb250b2xvZ3lJcmkgSXJpIG9mIHRoZSBvbnRvbG9neSBjaG9zZW4gYnkgdGhlIHVzZXIuXG4gICAgICogQHJldHVybnMgdm9pZFxuICAgICAqL1xuICAgIGdldFJlc291cmNlQ2xhc3Nlc0FuZFByb3BlcnRpZXNGb3JPbnRvbG9neShvbnRvbG9neUlyaTogc3RyaW5nKTogdm9pZCB7XG5cbiAgICAgICAgLy8gcmVzZXQgYWN0aXZlIHJlc291cmNlIGNsYXNzIGRlZmluaXRpb25cbiAgICAgICAgdGhpcy5hY3RpdmVSZXNvdXJjZUNsYXNzID0gdW5kZWZpbmVkO1xuXG4gICAgICAgIC8vIHJlc2V0IHNwZWNpZmllZCBwcm9wZXJ0aWVzXG4gICAgICAgIHRoaXMuYWN0aXZlUHJvcGVydGllcyA9IFtdO1xuXG4gICAgICAgIHRoaXMuYWN0aXZlT250b2xvZ3kgPSBvbnRvbG9neUlyaTtcblxuICAgICAgICB0aGlzLl9jYWNoZVNlcnZpY2UuZ2V0RW50aXR5RGVmaW5pdGlvbnNGb3JPbnRvbG9naWVzKFtvbnRvbG9neUlyaV0pLnN1YnNjcmliZShcbiAgICAgICAgICAgIChvbnRvSW5mbzogT250b2xvZ3lJbmZvcm1hdGlvbikgPT4ge1xuXG4gICAgICAgICAgICAgICAgdGhpcy5yZXNvdXJjZUNsYXNzZXMgPSBvbnRvSW5mby5nZXRSZXNvdXJjZUNsYXNzZXNBc0FycmF5KHRydWUpO1xuICAgICAgICAgICAgICAgIHRoaXMucHJvcGVydGllcyA9IG9udG9JbmZvLmdldFByb3BlcnRpZXMoKTtcblxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogT25jZSBhIHJlc291cmNlIGNsYXNzIGhhcyBiZWVuIHNlbGVjdGVkLCBnZXRzIGl0cyBwcm9wZXJ0aWVzLlxuICAgICAqIFRoZSBwcm9wZXJ0aWVzIHdpbGwgYmUgbWFkZSBhdmFpbGFibGUgdG8gdGhlIHVzZXIgZm9yIHNlbGVjdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSByZXNvdXJjZUNsYXNzSXJpXG4gICAgICogQHJldHVybnMgdm9pZFxuICAgICAqL1xuICAgIGdldFByb3BlcnRpZXNGb3JSZXNvdXJjZUNsYXNzKHJlc291cmNlQ2xhc3NJcmk6IHN0cmluZyk6IHZvaWQge1xuXG4gICAgICAgIC8vIHJlc2V0IHNwZWNpZmllZCBwcm9wZXJ0aWVzXG4gICAgICAgIHRoaXMuYWN0aXZlUHJvcGVydGllcyA9IFtdO1xuXG4gICAgICAgIC8vIGlmIHRoZSBjbGllbnQgdW5kb2VzIHRoZSBzZWxlY3Rpb24gb2YgYSByZXNvdXJjZSBjbGFzcywgdXNlIHRoZSBhY3RpdmUgb250b2xvZ3kgYXMgYSBmYWxsYmFja1xuICAgICAgICBpZiAocmVzb3VyY2VDbGFzc0lyaSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5nZXRSZXNvdXJjZUNsYXNzZXNBbmRQcm9wZXJ0aWVzRm9yT250b2xvZ3kodGhpcy5hY3RpdmVPbnRvbG9neSk7XG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIHRoaXMuX2NhY2hlU2VydmljZS5nZXRSZXNvdXJjZUNsYXNzRGVmaW5pdGlvbnMoW3Jlc291cmNlQ2xhc3NJcmldKS5zdWJzY3JpYmUoXG4gICAgICAgICAgICAgICAgKG9udG9JbmZvOiBPbnRvbG9neUluZm9ybWF0aW9uKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvcGVydGllcyA9IG9udG9JbmZvLmdldFByb3BlcnRpZXMoKTtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFjdGl2ZVJlc291cmNlQ2xhc3MgPSBvbnRvSW5mby5nZXRSZXNvdXJjZUNsYXNzZXMoKVtyZXNvdXJjZUNsYXNzSXJpXTtcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVmFsaWRhdGVzIGZvcm0gYW5kIHJldHVybnMgaXRzIHN0YXR1cyAoYm9vbGVhbikuXG4gICAgICovXG4gICAgcHJpdmF0ZSB2YWxpZGF0ZUZvcm0oKSB7XG5cbiAgICAgICAgLy8gY2hlY2sgdGhhdCBlaXRoZXIgYSByZXNvdXJjZSBjbGFzcyBpcyBzZWxlY3RlZCBvciBhdCBsZWFzdCBvbmUgcHJvcGVydHkgaXMgc3BlY2lmaWVkXG4gICAgICAgIHJldHVybiB0aGlzLmZvcm0udmFsaWQgJiZcbiAgICAgICAgICAgICh0aGlzLnByb3BlcnR5Q29tcG9uZW50cy5sZW5ndGggPiAwIHx8ICh0aGlzLnJlc291cmNlQ2xhc3NDb21wb25lbnQgIT09IHVuZGVmaW5lZCAmJiB0aGlzLnJlc291cmNlQ2xhc3NDb21wb25lbnQuZ2V0UmVzb3VyY2VDbGFzc1NlbGVjdGVkKCkgIT09IGZhbHNlKSk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXNldHMgdGhlIGZvcm0gKHNlbGVjdGVkIHJlc291cmNlIGNsYXNzIGFuZCBzcGVjaWZpZWQgcHJvcGVydGllcykgcHJlc2VydmluZyB0aGUgYWN0aXZlIG9udG9sb2d5LlxuICAgICAqL1xuICAgIHJlc2V0Rm9ybSgpIHtcbiAgICAgICAgaWYgKHRoaXMuYWN0aXZlT250b2xvZ3kgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5nZXRSZXNvdXJjZUNsYXNzZXNBbmRQcm9wZXJ0aWVzRm9yT250b2xvZ3kodGhpcy5hY3RpdmVPbnRvbG9neSk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBHcmF2U2VhcmNoIHF1ZXJ5IHdpdGggdGhlIGdpdmVuIGZvcm0gdmFsdWVzIGFuZCBjYWxscyB0aGUgZXh0ZW5kZWQgc2VhcmNoIHJvdXRlLlxuICAgICAqL1xuICAgIHN1Ym1pdCgpIHtcblxuICAgICAgICBpZiAoIXRoaXMuZm9ybVZhbGlkKSByZXR1cm47IC8vIGNoZWNrIHRoYXQgZnJvbSBpcyB2YWxpZFxuXG4gICAgICAgIGNvbnN0IHJlc0NsYXNzT3B0aW9uID0gdGhpcy5yZXNvdXJjZUNsYXNzQ29tcG9uZW50LmdldFJlc291cmNlQ2xhc3NTZWxlY3RlZCgpO1xuXG4gICAgICAgIGxldCByZXNDbGFzcztcblxuICAgICAgICBpZiAocmVzQ2xhc3NPcHRpb24gIT09IGZhbHNlKSB7XG4gICAgICAgICAgICByZXNDbGFzcyA9IHJlc0NsYXNzT3B0aW9uO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcHJvcGVydGllczogUHJvcGVydHlXaXRoVmFsdWVbXSA9IHRoaXMucHJvcGVydHlDb21wb25lbnRzLm1hcChcbiAgICAgICAgICAgIChwcm9wQ29tcCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBwcm9wQ29tcC5nZXRQcm9wZXJ0eVNlbGVjdGVkV2l0aFZhbHVlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG5cbiAgICAgICAgY29uc3QgZ3JhdnNlYXJjaCA9IHRoaXMuX2dyYXZTZWFyY2hTZXJ2aWNlLmNyZWF0ZUdyYXZzZWFyY2hRdWVyeShwcm9wZXJ0aWVzLCByZXNDbGFzcywgMCk7XG5cbiAgICAgICAgdGhpcy5fcm91dGVyLm5hdmlnYXRlKFt0aGlzLnJvdXRlICsgJy9leHRlbmRlZC8nLCBncmF2c2VhcmNoXSwgeyByZWxhdGl2ZVRvOiB0aGlzLl9yb3V0ZSB9KTtcblxuICAgICAgICAvLyB0b2dnbGUgZXh0ZW5kZWQgc2VhcmNoIGZvcm1cbiAgICAgICAgdGhpcy50b2dnbGVFeHRlbmRlZFNlYXJjaEZvcm0uZW1pdCh0cnVlKTtcblxuICAgIH1cblxufVxuIl19