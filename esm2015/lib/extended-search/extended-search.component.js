import { Component, EventEmitter, Inject, Input, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { GravsearchGenerationService, OntologyCacheService, ReadResourcesSequence } from '@knora/core';
import { SelectResourceClassComponent } from './select-resource-class/select-resource-class.component';
export class ExtendedSearchComponent {
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
            this.resourceClasses = ontoInfo.getResourceClassesAsArray();
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
/** @nocollapse */
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0ZW5kZWQtc2VhcmNoLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Brbm9yYS9zZWFyY2gvIiwic291cmNlcyI6WyJsaWIvZXh0ZW5kZWQtc2VhcmNoL2V4dGVuZGVkLXNlYXJjaC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBVSxNQUFNLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0gsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUN6RCxPQUFPLEVBQUUsV0FBVyxFQUFhLE1BQU0sZ0JBQWdCLENBQUM7QUFDeEQsT0FBTyxFQUNILDJCQUEyQixFQUMzQixvQkFBb0IsRUFLcEIscUJBQXFCLEVBRXhCLE1BQU0sYUFBYSxDQUFDO0FBRXJCLE9BQU8sRUFBRSw0QkFBNEIsRUFBRSxNQUFNLHlEQUF5RCxDQUFDO0FBd0R2RyxNQUFNO0lBMENGLFlBQXlDLEVBQWUsRUFDNUMsTUFBc0IsRUFDdEIsT0FBZSxFQUNmLGFBQW1DLEVBQ25DLGtCQUErQztRQUpsQixPQUFFLEdBQUYsRUFBRSxDQUFhO1FBQzVDLFdBQU0sR0FBTixNQUFNLENBQWdCO1FBQ3RCLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFDZixrQkFBYSxHQUFiLGFBQWEsQ0FBc0I7UUFDbkMsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUE2QjtRQXZDM0QsMENBQTBDO1FBQ2hDLDZCQUF3QixHQUFHLElBQUksWUFBWSxFQUFXLENBQUM7UUFFakUsMkJBQTJCO1FBQzNCLGVBQVUsR0FBNEIsRUFBRSxDQUFDO1FBS3pDLG1DQUFtQztRQUNuQyxxQkFBZ0IsR0FBYyxFQUFFLENBQUM7UUFFakMsNkNBQTZDO1FBQzdDLG9CQUFlLEdBQXlCLEVBQUUsQ0FBQztRQVEzQyxXQUFNLEdBQTBCLElB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Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0FnRGI7Z0JBQ0csTUFBTSxFQUFFLENBQUMsK05BQStOLENBQUM7YUFDNU87Ozs7WUFuRVEsV0FBVyx1QkE4R0gsTUFBTSxTQUFDLFdBQVc7WUEvRzFCLGNBQWM7WUFBRSxNQUFNO1lBSTNCLG9CQUFvQjtZQURwQiwyQkFBMkI7OztvQkF1RTFCLEtBQUs7dUNBR0wsTUFBTTtxQ0F1Qk4sU0FBUyxTQUFDLGVBQWU7aUNBR3pCLFlBQVksU0FBQyxVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIEluamVjdCwgSW5wdXQsIE9uSW5pdCwgT3V0cHV0LCBRdWVyeUxpc3QsIFZpZXdDaGlsZCwgVmlld0NoaWxkcmVuIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZSwgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IEZvcm1CdWlsZGVyLCBGb3JtR3JvdXAgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge1xuICAgIEdyYXZzZWFyY2hHZW5lcmF0aW9uU2VydmljZSxcbiAgICBPbnRvbG9neUNhY2hlU2VydmljZSxcbiAgICBPbnRvbG9neUluZm9ybWF0aW9uLFxuICAgIE9udG9sb2d5TWV0YWRhdGEsXG4gICAgUHJvcGVydGllcyxcbiAgICBQcm9wZXJ0eVdpdGhWYWx1ZSxcbiAgICBSZWFkUmVzb3VyY2VzU2VxdWVuY2UsXG4gICAgUmVzb3VyY2VDbGFzc1xufSBmcm9tICdAa25vcmEvY29yZSc7XG5pbXBvcnQgeyBTZWxlY3RQcm9wZXJ0eUNvbXBvbmVudCB9IGZyb20gJy4vc2VsZWN0LXByb3BlcnR5L3NlbGVjdC1wcm9wZXJ0eS5jb21wb25lbnQnO1xuaW1wb3J0IHsgU2VsZWN0UmVzb3VyY2VDbGFzc0NvbXBvbmVudCB9IGZyb20gJy4vc2VsZWN0LXJlc291cmNlLWNsYXNzL3NlbGVjdC1yZXNvdXJjZS1jbGFzcy5jb21wb25lbnQnO1xuXG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAna3VpLWV4dGVuZGVkLXNlYXJjaCcsXG4gICAgdGVtcGxhdGU6IGA8Zm9ybSBbZm9ybUdyb3VwXT1cImZvcm1cIiAobmdTdWJtaXQpPVwic3VibWl0KClcIj5cblxuICA8ZGl2PlxuICAgIDxrdWktc2VsZWN0LW9udG9sb2d5ICpuZ0lmPVwib250b2xvZ2llcy5sZW5ndGggPiAwXCIgW2Zvcm1Hcm91cF09XCJmb3JtXCIgW29udG9sb2dpZXNdPVwib250b2xvZ2llc1wiIChvbnRvbG9neVNlbGVjdGVkKT1cImdldFJlc291cmNlQ2xhc3Nlc0FuZFByb3BlcnRpZXNGb3JPbnRvbG9neSgkZXZlbnQpXCI+PC9rdWktc2VsZWN0LW9udG9sb2d5PlxuICA8L2Rpdj5cblxuICA8ZGl2IGNsYXNzPVwic2VsZWN0LXJlc291cmNlLWNsYXNzXCIgKm5nSWY9XCJyZXNvdXJjZUNsYXNzZXM/Lmxlbmd0aCA+IDBcIj5cbiAgICA8a3VpLXNlbGVjdC1yZXNvdXJjZS1jbGFzcyAjcmVzb3VyY2VDbGFzcyBbZm9ybUdyb3VwXT1cImZvcm1cIiBbcmVzb3VyY2VDbGFzc2VzXT1cInJlc291cmNlQ2xhc3Nlc1wiIChyZXNvdXJjZUNsYXNzU2VsZWN0ZWRFdmVudCk9XCJnZXRQcm9wZXJ0aWVzRm9yUmVzb3VyY2VDbGFzcygkZXZlbnQpXCI+PC9rdWktc2VsZWN0LXJlc291cmNlLWNsYXNzPlxuICA8L2Rpdj5cblxuICA8ZGl2IGNsYXNzPVwic2VsZWN0LXByb3BlcnR5XCIgKm5nSWY9XCJwcm9wZXJ0aWVzICE9PSB1bmRlZmluZWRcIj5cbiAgICA8ZGl2ICpuZ0Zvcj1cImxldCBwcm9wIG9mIGFjdGl2ZVByb3BlcnRpZXM7IGxldCBpID0gaW5kZXhcIj5cblxuICAgICAgPGt1aS1zZWxlY3QtcHJvcGVydHkgI3Byb3BlcnR5IFthY3RpdmVSZXNvdXJjZUNsYXNzXT1cImFjdGl2ZVJlc291cmNlQ2xhc3NcIiBbZm9ybUdyb3VwXT1cImZvcm1cIiBbaW5kZXhdPVwiaVwiIFtwcm9wZXJ0aWVzXT1cInByb3BlcnRpZXNcIj48L2t1aS1zZWxlY3QtcHJvcGVydHk+XG5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG5cblxuICA8ZGl2PlxuICAgIDxidXR0b24gbWF0LW1pbmktZmFiIGNsYXNzPVwicHJvcGVydHktYnV0dG9ucyBhZGQtcHJvcGVydHktYnV0dG9uXCIgY29sb3I9XCJwcmltYXJ5XCIgdHlwZT1cImJ1dHRvblwiIChjbGljayk9XCJhZGRQcm9wZXJ0eSgpXCIgW2Rpc2FibGVkXT1cImFjdGl2ZU9udG9sb2d5ID09PSB1bmRlZmluZWQgfHwgYWN0aXZlUHJvcGVydGllcy5sZW5ndGggPj0gNFwiPlxuICAgICAgPG1hdC1pY29uIGFyaWEtbGFiZWw9XCJhZGQgYSBwcm9wZXJ0eVwiPmFkZDwvbWF0LWljb24+XG4gICAgPC9idXR0b24+XG5cbiAgICA8YnV0dG9uIG1hdC1taW5pLWZhYiBjbGFzcz1cInByb3BlcnR5LWJ1dHRvbnMgcmVtb3ZlLXByb3BlcnR5LWJ1dHRvblwiIGNvbG9yPVwicHJpbWFyeVwiIHR5cGU9XCJidXR0b25cIiAoY2xpY2spPVwicmVtb3ZlUHJvcGVydHkoKVwiIFtkaXNhYmxlZF09XCJhY3RpdmVQcm9wZXJ0aWVzLmxlbmd0aCA9PSAwXCI+XG4gICAgICA8bWF0LWljb24gYXJpYS1sYWJlbD1cInJlbW92ZSBwcm9wZXJ0eVwiPnJlbW92ZTwvbWF0LWljb24+XG4gICAgPC9idXR0b24+XG4gIDwvZGl2PlxuXG4gIDwhLS0gIDxkaXY+XG4gICAgPGJ1dHRvbiBtYXQtaWNvbi1idXR0b24gdHlwZT1cImJ1dHRvblwiIChjbGljayk9XCJyZXNldEZvcm0oKVwiIFtkaXNhYmxlZF09XCJ0aGlzLmFjdGl2ZU9udG9sb2d5ID09PSB1bmRlZmluZWRcIj5cbiAgICAgIDxtYXQtaWNvbiBhcmlhLWxhYmVsPVwicmVzZXQgcXVlcnkgZm9ybVwiPmNsZWFyPC9tYXQtaWNvbj5cbiAgICA8L2J1dHRvbj5cblxuICAgIDxidXR0b24gbWF0LWljb24tYnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBbZGlzYWJsZWRdPVwiIWZvcm1WYWxpZFwiPlxuICAgICAgPG1hdC1pY29uIGFyaWEtbGFiZWw9XCJzdWJtaXQgcXVlcnlcIj5zZW5kPC9tYXQtaWNvbj5cbiAgICA8L2J1dHRvbj5cbiAgPC9kaXY+IC0tPlxuXG4gIDxidXR0b24gY2xhc3M9XCJleHRlbmRlZC1idXR0b25zIGV4dGVuZGVkLXNlYXJjaC1idXR0b25cIiBtYXQtc3Ryb2tlZC1idXR0b24gY29sb3I9XCJwcmltYXJ5XCIgdHlwZT1cInN1Ym1pdFwiIFtkaXNhYmxlZF09XCIhZm9ybVZhbGlkXCI+XG4gICAgU2VhcmNoXG4gIDwvYnV0dG9uPlxuICA8YnV0dG9uIGNsYXNzPVwiZXh0ZW5kZWQtYnV0dG9ucyByZXNldFwiIG1hdC1zdHJva2VkLWJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgKGNsaWNrKT1cInJlc2V0Rm9ybSgpXCIgW2Rpc2FibGVkXT1cInRoaXMuYWN0aXZlT250b2xvZ3kgPT09IHVuZGVmaW5lZFwiPlxuICAgIFJlc2V0XG4gIDwvYnV0dG9uPlxuXG5cbjwvZm9ybT5cbmAsXG4gICAgc3R5bGVzOiBbYC5hZGQtcHJvcGVydHktYnV0dG9ue21hcmdpbi1yaWdodDo1cHh9LmV4dGVuZGVkLWJ1dHRvbnN7bWFyZ2luLXRvcDoyNXB4fS5leHRlbmRlZC1zZWFyY2gtYnV0dG9ue21hcmdpbi1yaWdodDo1cHh9LnByb3BlcnR5LWJ1dHRvbnN7bWFyZ2luLXRvcDoyNXB4fS5zZWxlY3QtcHJvcGVydHl7bWFyZ2luLWxlZnQ6MjJweH0uc2VsZWN0LXJlc291cmNlLWNsYXNze21hcmdpbi1sZWZ0OjEycHh9YF1cbn0pXG5leHBvcnQgY2xhc3MgRXh0ZW5kZWRTZWFyY2hDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHJvdXRlIC0gUm91dGUgYWZ0ZXIgc2VhcmNoXG4gICAgICovXG4gICAgQElucHV0KCkgcm91dGU7XG5cbiAgICAvLyB0cmlnZ2VyIHRvZ2dsZSBmb3IgZXh0ZW5kZWQgc2VhcmNoIGZvcm1cbiAgICBAT3V0cHV0KCkgdG9nZ2xlRXh0ZW5kZWRTZWFyY2hGb3JtID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xuXG4gICAgLy8gYWxsIGF2YWlsYWJsZSBvbnRvbG9naWVzXG4gICAgb250b2xvZ2llczogQXJyYXk8T250b2xvZ3lNZXRhZGF0YT4gPSBbXTtcblxuICAgIC8vIG9udG9sb2d5IGNob3NlbiBieSB0aGUgdXNlclxuICAgIGFjdGl2ZU9udG9sb2d5OiBzdHJpbmc7XG5cbiAgICAvLyBwcm9wZXJ0aWVzIHNwZWNpZmllZCBieSB0aGUgdXNlclxuICAgIGFjdGl2ZVByb3BlcnRpZXM6IGJvb2xlYW5bXSA9IFtdO1xuXG4gICAgLy8gcmVzb3VyY2UgY2xhc3NlcyBmb3IgdGhlIHNlbGVjdGVkIG9udG9sb2d5XG4gICAgcmVzb3VyY2VDbGFzc2VzOiBBcnJheTxSZXNvdXJjZUNsYXNzPiA9IFtdO1xuXG4gICAgLy8gZGVmaW5pdGlvbiBvZiB0aGUgc2VsZWN0ZWQgcmVzb3VyY2UgY2xhc3MsIGlmIHNldC5cbiAgICBhY3RpdmVSZXNvdXJjZUNsYXNzOiBSZXNvdXJjZUNsYXNzO1xuXG4gICAgLy8gcHJvcGVydGllcyBmb3IgdGhlIHNlbGVjdGVkIG9udG9sb2d5IG9yIHNlbGVjdGVkIHJlc291cmNlIGNsYXNzXG4gICAgcHJvcGVydGllczogUHJvcGVydGllcztcblxuICAgIHJlc3VsdDogUmVhZFJlc291cmNlc1NlcXVlbmNlID0gbmV3IFJlYWRSZXNvdXJjZXNTZXF1ZW5jZShbXSwgMCk7XG5cbiAgICAvLyByZWZlcmVuY2UgdG8gdGhlIGNvbXBvbmVudCB0aGF0IGNvbnRyb2xzIHRoZSByZXNvdXJjZSBjbGFzcyBzZWxlY3Rpb25cbiAgICBAVmlld0NoaWxkKCdyZXNvdXJjZUNsYXNzJykgcmVzb3VyY2VDbGFzc0NvbXBvbmVudDogU2VsZWN0UmVzb3VyY2VDbGFzc0NvbXBvbmVudDtcblxuICAgIC8vIHJlZmVyZW5jZSB0byB0aGUgY29tcG9uZW50IGNvbnRyb2xsaW5nIHRoZSBwcm9wZXJ0eSBzZWxlY3Rpb25cbiAgICBAVmlld0NoaWxkcmVuKCdwcm9wZXJ0eScpIHByb3BlcnR5Q29tcG9uZW50czogUXVlcnlMaXN0PFNlbGVjdFByb3BlcnR5Q29tcG9uZW50PjtcblxuICAgIC8vIEZvcm1Hcm91cCAodXNlZCBhcyBwYXJlbnQgZm9yIGNoaWxkIGNvbXBvbmVudHMpXG4gICAgZm9ybTogRm9ybUdyb3VwO1xuXG4gICAgLy8gZm9ybSB2YWxpZGF0aW9uIHN0YXR1c1xuICAgIGZvcm1WYWxpZCA9IGZhbHNlO1xuXG4gICAgY29uc3RydWN0b3IoQEluamVjdChGb3JtQnVpbGRlcikgcHJpdmF0ZSBmYjogRm9ybUJ1aWxkZXIsXG4gICAgICAgIHByaXZhdGUgX3JvdXRlOiBBY3RpdmF0ZWRSb3V0ZSxcbiAgICAgICAgcHJpdmF0ZSBfcm91dGVyOiBSb3V0ZXIsXG4gICAgICAgIHByaXZhdGUgX2NhY2hlU2VydmljZTogT250b2xvZ3lDYWNoZVNlcnZpY2UsXG4gICAgICAgIHByaXZhdGUgX2dyYXZTZWFyY2hTZXJ2aWNlOiBHcmF2c2VhcmNoR2VuZXJhdGlvblNlcnZpY2UpIHtcbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHtcblxuICAgICAgICAvLyBwYXJlbnQgZm9ybSBpcyBlbXB0eSwgaXQgZ2V0cyBwYXNzZWQgdG8gdGhlIGNoaWxkIGNvbXBvbmVudHNcbiAgICAgICAgdGhpcy5mb3JtID0gdGhpcy5mYi5ncm91cCh7fSk7XG5cbiAgICAgICAgLy8gaWYgZm9ybSBzdGF0dXMgY2hhbmdlcywgcmUtcnVuIHZhbGlkYXRpb25cbiAgICAgICAgdGhpcy5mb3JtLnN0YXR1c0NoYW5nZXMuc3Vic2NyaWJlKChkYXRhKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZvcm1WYWxpZCA9IHRoaXMudmFsaWRhdGVGb3JtKCk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLmZvcm0pO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBpbml0aWFsaXplIG9udG9sb2dpZXMgdG8gYmUgdXNlZCBmb3IgdGhlIG9udG9sb2dpZXMgc2VsZWN0aW9uIGluIHRoZSBzZWFyY2ggZm9ybVxuICAgICAgICB0aGlzLmluaXRpYWxpemVPbnRvbG9naWVzKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIGEgcHJvcGVydHkgdG8gdGhlIHNlYXJjaCBmb3JtLlxuICAgICAqIEByZXR1cm5zIHZvaWRcbiAgICAgKi9cbiAgICBhZGRQcm9wZXJ0eSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5hY3RpdmVQcm9wZXJ0aWVzLnB1c2godHJ1ZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlIHRoZSBsYXN0IHByb3BlcnR5IGZyb20gdGhlIHNlYXJjaCBmb3JtLlxuICAgICAqIEByZXR1cm5zIHZvaWRcbiAgICAgKi9cbiAgICByZW1vdmVQcm9wZXJ0eSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5hY3RpdmVQcm9wZXJ0aWVzLnNwbGljZSgtMSwgMSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyBhbGwgYXZhaWxhYmxlIG9udG9sb2dpZXMgZm9yIHRoZSBzZWFyY2ggZm9ybS5cbiAgICAgKiBAcmV0dXJucyB2b2lkXG4gICAgICovXG4gICAgaW5pdGlhbGl6ZU9udG9sb2dpZXMoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX2NhY2hlU2VydmljZS5nZXRPbnRvbG9naWVzTWV0YWRhdGEoKS5zdWJzY3JpYmUoXG4gICAgICAgICAgICAob250b2xvZ2llczogQXJyYXk8T250b2xvZ3lNZXRhZGF0YT4pID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLm9udG9sb2dpZXMgPSBvbnRvbG9naWVzO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogT25jZSBhbiBvbnRvbG9neSBoYXMgYmVlbiBzZWxlY3RlZCwgZ2V0cyBpdHMgY2xhc3NlcyBhbmQgcHJvcGVydGllcy5cbiAgICAgKiBUaGUgY2xhc3NlcyBhbmQgcHJvcGVydGllcyB3aWxsIGJlIG1hZGUgYXZhaWxhYmxlIHRvIHRoZSB1c2VyIGZvciBzZWxlY3Rpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gb250b2xvZ3lJcmkgSXJpIG9mIHRoZSBvbnRvbG9neSBjaG9zZW4gYnkgdGhlIHVzZXIuXG4gICAgICogQHJldHVybnMgdm9pZFxuICAgICAqL1xuICAgIGdldFJlc291cmNlQ2xhc3Nlc0FuZFByb3BlcnRpZXNGb3JPbnRvbG9neShvbnRvbG9neUlyaTogc3RyaW5nKTogdm9pZCB7XG5cbiAgICAgICAgLy8gcmVzZXQgYWN0aXZlIHJlc291cmNlIGNsYXNzIGRlZmluaXRpb25cbiAgICAgICAgdGhpcy5hY3RpdmVSZXNvdXJjZUNsYXNzID0gdW5kZWZpbmVkO1xuXG4gICAgICAgIC8vIHJlc2V0IHNwZWNpZmllZCBwcm9wZXJ0aWVzXG4gICAgICAgIHRoaXMuYWN0aXZlUHJvcGVydGllcyA9IFtdO1xuXG4gICAgICAgIHRoaXMuYWN0aXZlT250b2xvZ3kgPSBvbnRvbG9neUlyaTtcblxuICAgICAgICB0aGlzLl9jYWNoZVNlcnZpY2UuZ2V0RW50aXR5RGVmaW5pdGlvbnNGb3JPbnRvbG9naWVzKFtvbnRvbG9neUlyaV0pLnN1YnNjcmliZShcbiAgICAgICAgICAgIChvbnRvSW5mbzogT250b2xvZ3lJbmZvcm1hdGlvbikgPT4ge1xuXG4gICAgICAgICAgICAgICAgdGhpcy5yZXNvdXJjZUNsYXNzZXMgPSBvbnRvSW5mby5nZXRSZXNvdXJjZUNsYXNzZXNBc0FycmF5KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9wZXJ0aWVzID0gb250b0luZm8uZ2V0UHJvcGVydGllcygpO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBPbmNlIGEgcmVzb3VyY2UgY2xhc3MgaGFzIGJlZW4gc2VsZWN0ZWQsIGdldHMgaXRzIHByb3BlcnRpZXMuXG4gICAgICogVGhlIHByb3BlcnRpZXMgd2lsbCBiZSBtYWRlIGF2YWlsYWJsZSB0byB0aGUgdXNlciBmb3Igc2VsZWN0aW9uLlxuICAgICAqXG4gICAgICogQHBhcmFtIHJlc291cmNlQ2xhc3NJcmlcbiAgICAgKiBAcmV0dXJucyB2b2lkXG4gICAgICovXG4gICAgZ2V0UHJvcGVydGllc0ZvclJlc291cmNlQ2xhc3MocmVzb3VyY2VDbGFzc0lyaTogc3RyaW5nKTogdm9pZCB7XG5cbiAgICAgICAgLy8gcmVzZXQgc3BlY2lmaWVkIHByb3BlcnRpZXNcbiAgICAgICAgdGhpcy5hY3RpdmVQcm9wZXJ0aWVzID0gW107XG5cbiAgICAgICAgLy8gaWYgdGhlIGNsaWVudCB1bmRvZXMgdGhlIHNlbGVjdGlvbiBvZiBhIHJlc291cmNlIGNsYXNzLCB1c2UgdGhlIGFjdGl2ZSBvbnRvbG9neSBhcyBhIGZhbGxiYWNrXG4gICAgICAgIGlmIChyZXNvdXJjZUNsYXNzSXJpID09PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmdldFJlc291cmNlQ2xhc3Nlc0FuZFByb3BlcnRpZXNGb3JPbnRvbG9neSh0aGlzLmFjdGl2ZU9udG9sb2d5KTtcbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgdGhpcy5fY2FjaGVTZXJ2aWNlLmdldFJlc291cmNlQ2xhc3NEZWZpbml0aW9ucyhbcmVzb3VyY2VDbGFzc0lyaV0pLnN1YnNjcmliZShcbiAgICAgICAgICAgICAgICAob250b0luZm86IE9udG9sb2d5SW5mb3JtYXRpb24pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9wZXJ0aWVzID0gb250b0luZm8uZ2V0UHJvcGVydGllcygpO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWN0aXZlUmVzb3VyY2VDbGFzcyA9IG9udG9JbmZvLmdldFJlc291cmNlQ2xhc3NlcygpW3Jlc291cmNlQ2xhc3NJcmldO1xuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcblxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBWYWxpZGF0ZXMgZm9ybSBhbmQgcmV0dXJucyBpdHMgc3RhdHVzIChib29sZWFuKS5cbiAgICAgKi9cbiAgICBwcml2YXRlIHZhbGlkYXRlRm9ybSgpIHtcblxuICAgICAgICAvLyBjaGVjayB0aGF0IGVpdGhlciBhIHJlc291cmNlIGNsYXNzIGlzIHNlbGVjdGVkIG9yIGF0IGxlYXN0IG9uZSBwcm9wZXJ0eSBpcyBzcGVjaWZpZWRcbiAgICAgICAgcmV0dXJuIHRoaXMuZm9ybS52YWxpZCAmJlxuICAgICAgICAgICAgKHRoaXMucHJvcGVydHlDb21wb25lbnRzLmxlbmd0aCA+IDAgfHwgKHRoaXMucmVzb3VyY2VDbGFzc0NvbXBvbmVudCAhPT0gdW5kZWZpbmVkICYmIHRoaXMucmVzb3VyY2VDbGFzc0NvbXBvbmVudC5nZXRSZXNvdXJjZUNsYXNzU2VsZWN0ZWQoKSAhPT0gZmFsc2UpKTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlc2V0cyB0aGUgZm9ybSAoc2VsZWN0ZWQgcmVzb3VyY2UgY2xhc3MgYW5kIHNwZWNpZmllZCBwcm9wZXJ0aWVzKSBwcmVzZXJ2aW5nIHRoZSBhY3RpdmUgb250b2xvZ3kuXG4gICAgICovXG4gICAgcmVzZXRGb3JtKCkge1xuICAgICAgICBpZiAodGhpcy5hY3RpdmVPbnRvbG9neSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLmdldFJlc291cmNlQ2xhc3Nlc0FuZFByb3BlcnRpZXNGb3JPbnRvbG9neSh0aGlzLmFjdGl2ZU9udG9sb2d5KTtcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIEdyYXZTZWFyY2ggcXVlcnkgd2l0aCB0aGUgZ2l2ZW4gZm9ybSB2YWx1ZXMgYW5kIGNhbGxzIHRoZSBleHRlbmRlZCBzZWFyY2ggcm91dGUuXG4gICAgICovXG4gICAgc3VibWl0KCkge1xuXG4gICAgICAgIGlmICghdGhpcy5mb3JtVmFsaWQpIHJldHVybjsgLy8gY2hlY2sgdGhhdCBmcm9tIGlzIHZhbGlkXG5cbiAgICAgICAgY29uc3QgcmVzQ2xhc3NPcHRpb24gPSB0aGlzLnJlc291cmNlQ2xhc3NDb21wb25lbnQuZ2V0UmVzb3VyY2VDbGFzc1NlbGVjdGVkKCk7XG5cbiAgICAgICAgbGV0IHJlc0NsYXNzO1xuXG4gICAgICAgIGlmIChyZXNDbGFzc09wdGlvbiAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHJlc0NsYXNzID0gcmVzQ2xhc3NPcHRpb247XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwcm9wZXJ0aWVzOiBQcm9wZXJ0eVdpdGhWYWx1ZVtdID0gdGhpcy5wcm9wZXJ0eUNvbXBvbmVudHMubWFwKFxuICAgICAgICAgICAgKHByb3BDb21wKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb3BDb21wLmdldFByb3BlcnR5U2VsZWN0ZWRXaXRoVmFsdWUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcblxuICAgICAgICBjb25zdCBncmF2c2VhcmNoID0gdGhpcy5fZ3JhdlNlYXJjaFNlcnZpY2UuY3JlYXRlR3JhdnNlYXJjaFF1ZXJ5KHByb3BlcnRpZXMsIHJlc0NsYXNzLCAwKTtcblxuICAgICAgICB0aGlzLl9yb3V0ZXIubmF2aWdhdGUoW3RoaXMucm91dGUgKyAnL2V4dGVuZGVkLycsIGdyYXZzZWFyY2hdLCB7IHJlbGF0aXZlVG86IHRoaXMuX3JvdXRlIH0pO1xuXG4gICAgICAgIC8vIHRvZ2dsZSBleHRlbmRlZCBzZWFyY2ggZm9ybVxuICAgICAgICB0aGlzLnRvZ2dsZUV4dGVuZGVkU2VhcmNoRm9ybS5lbWl0KHRydWUpO1xuXG4gICAgfVxuXG59XG4iXX0=