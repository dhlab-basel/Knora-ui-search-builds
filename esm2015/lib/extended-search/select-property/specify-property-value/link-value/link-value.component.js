import { Component, Inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IRI, KnoraConstants, OntologyCacheService, ReadResource, SearchService } from '@knora/core';
const jsonld = require('jsonld');
// https://stackoverflow.com/questions/45661010/dynamic-nested-reactive-form-expressionchangedafterithasbeencheckederror
const resolvedPromise = Promise.resolve(null);
export class LinkValueComponent {
    constructor(fb, _searchService, _cacheService) {
        this.fb = fb;
        this._searchService = _searchService;
        this._cacheService = _cacheService;
        this.type = KnoraConstants.LinkValue;
    }
    set restrictResourceClass(value) {
        this._restrictToResourceClass = value;
    }
    get restrictResourceClass() {
        return this._restrictToResourceClass;
    }
    /**
     * Displays a selected resource using its label.
     *
     * @param resource the resource to be displayed (or no selection yet).
     * @returns
     */
    displayResource(resource) {
        // null is the initial value (no selection yet)
        if (resource !== null) {
            return resource.label;
        }
    }
    /**
     * Search for resources whose labels contain the given search term, restricting to to the given properties object constraint.
     *
     * @param searchTerm
     */
    searchByLabel(searchTerm) {
        // at least 3 characters are required
        if (searchTerm.length >= 3) {
            this._searchService.searchByLabelReadResourceSequence(searchTerm, this._restrictToResourceClass).subscribe((result) => {
                this.resources = result.resources;
            }, function (err) {
                console.log('JSONLD of full resource request could not be expanded:' + err);
            });
        }
        else {
            // clear selection
            this.resources = undefined;
        }
    }
    /**
     * Checks that the selection is a [[ReadResource]].
     *
     * Surprisingly, [null] has to be returned if the value is valid: https://angular.io/guide/form-validation#custom-validators
     *
     * @param the form element whose value has to be checked.
     * @returns
     */
    validateResource(c) {
        const isValidResource = (c.value instanceof ReadResource);
        if (isValidResource) {
            return null;
        }
        else {
            return {
                noResource: {
                    value: c.value
                }
            };
        }
    }
    ngOnInit() {
        this.form = this.fb.group({
            resource: [null, Validators.compose([
                    Validators.required,
                    this.validateResource
                ])]
        });
        this.form.valueChanges.subscribe((data) => {
            this.searchByLabel(data.resource);
        });
        resolvedPromise.then(() => {
            // add form to the parent form group
            this.formGroup.addControl('propValue', this.form);
        });
    }
    ngOnDestroy() {
        // remove form from the parent form group
        resolvedPromise.then(() => {
            this.formGroup.removeControl('propValue');
        });
    }
    getValue() {
        return new IRI(this.form.value.resource.id);
    }
}
LinkValueComponent.decorators = [
    { type: Component, args: [{
                selector: 'link-value',
                template: `<mat-form-field>
    <input matInput placeholder="resource" aria-label="resource" [matAutocomplete]="auto" [formControl]="form.controls['resource']">
    <mat-autocomplete #auto="matAutocomplete" [displayWith]="displayResource">
        <mat-option *ngFor="let res of resources" [value]="res">
            {{res?.label}}
        </mat-option>
    </mat-autocomplete>
</mat-form-field>
`,
                styles: [``]
            },] },
];
LinkValueComponent.ctorParameters = () => [
    { type: FormBuilder, decorators: [{ type: Inject, args: [FormBuilder,] }] },
    { type: SearchService },
    { type: OntologyCacheService }
];
LinkValueComponent.propDecorators = {
    formGroup: [{ type: Input }],
    restrictResourceClass: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGluay12YWx1ZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Aa25vcmEvc2VhcmNoLyIsInNvdXJjZXMiOlsibGliL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3QtcHJvcGVydHkvc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZS9saW5rLXZhbHVlL2xpbmstdmFsdWUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBcUIsTUFBTSxlQUFlLENBQUM7QUFDNUUsT0FBTyxFQUFFLFdBQVcsRUFBZSxTQUFTLEVBQUUsVUFBVSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDakYsT0FBTyxFQUdILEdBQUcsRUFDSCxjQUFjLEVBQ2Qsb0JBQW9CLEVBRXBCLFlBQVksRUFFWixhQUFhLEVBRWhCLE1BQU0sYUFBYSxDQUFDO0FBR3JCLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUVqQyx3SEFBd0g7QUFDeEgsTUFBTSxlQUFlLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQWU5QyxNQUFNO0lBc0JGLFlBQXlDLEVBQWUsRUFBVSxjQUE2QixFQUFVLGFBQW1DO1FBQW5HLE9BQUUsR0FBRixFQUFFLENBQWE7UUFBVSxtQkFBYyxHQUFkLGNBQWMsQ0FBZTtRQUFVLGtCQUFhLEdBQWIsYUFBYSxDQUFzQjtRQWpCNUksU0FBSSxHQUFHLGNBQWMsQ0FBQyxTQUFTLENBQUM7SUFtQmhDLENBQUM7SUFYRCxJQUNJLHFCQUFxQixDQUFDLEtBQWE7UUFDbkMsSUFBSSxDQUFDLHdCQUF3QixHQUFHLEtBQUssQ0FBQztJQUMxQyxDQUFDO0lBRUQsSUFBSSxxQkFBcUI7UUFDckIsT0FBTyxJQUFJLENBQUMsd0JBQXdCLENBQUM7SUFDekMsQ0FBQztJQU1EOzs7OztPQUtHO0lBQ0gsZUFBZSxDQUFDLFFBQTZCO1FBRXpDLCtDQUErQztRQUMvQyxJQUFJLFFBQVEsS0FBSyxJQUFJLEVBQUU7WUFDbkIsT0FBTyxRQUFRLENBQUMsS0FBSyxDQUFDO1NBQ3pCO0lBQ0wsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxhQUFhLENBQUMsVUFBa0I7UUFFNUIscUNBQXFDO1FBQ3JDLElBQUksVUFBVSxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7WUFFeEIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxpQ0FBaUMsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLHdCQUF3QixDQUFDLENBQUMsU0FBUyxDQUN0RyxDQUFDLE1BQTZCLEVBQUUsRUFBRTtnQkFDOUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDO1lBQ3RDLENBQUMsRUFBRSxVQUFVLEdBQUc7Z0JBQ1osT0FBTyxDQUFDLEdBQUcsQ0FBQyx3REFBd0QsR0FBRyxHQUFHLENBQUMsQ0FBQztZQUNoRixDQUFDLENBQ0osQ0FBQztTQUNMO2FBQU07WUFDSCxrQkFBa0I7WUFDbEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7U0FDOUI7SUFFTCxDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNILGdCQUFnQixDQUFDLENBQWM7UUFFM0IsTUFBTSxlQUFlLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxZQUFZLFlBQVksQ0FBQyxDQUFDO1FBRTFELElBQUksZUFBZSxFQUFFO1lBQ2pCLE9BQU8sSUFBSSxDQUFDO1NBQ2Y7YUFBTTtZQUNILE9BQU87Z0JBQ0gsVUFBVSxFQUFFO29CQUNSLEtBQUssRUFBRSxDQUFDLENBQUMsS0FBSztpQkFDakI7YUFDSixDQUFDO1NBQ0w7SUFFTCxDQUFDO0lBRUQsUUFBUTtRQUNKLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUM7WUFDdEIsUUFBUSxFQUFFLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxPQUFPLENBQUM7b0JBQ2hDLFVBQVUsQ0FBQyxRQUFRO29CQUNuQixJQUFJLENBQUMsZ0JBQWdCO2lCQUN4QixDQUFDLENBQUM7U0FDTixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUN0QyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN0QyxDQUFDLENBQUMsQ0FBQztRQUVILGVBQWUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFO1lBQ3RCLG9DQUFvQztZQUNwQyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3RELENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELFdBQVc7UUFFUCx5Q0FBeUM7UUFDekMsZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDdEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDOUMsQ0FBQyxDQUFDLENBQUM7SUFFUCxDQUFDO0lBRUQsUUFBUTtRQUVKLE9BQU8sSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2hELENBQUM7OztZQW5JSixTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLFlBQVk7Z0JBQ3RCLFFBQVEsRUFBRTs7Ozs7Ozs7Q0FRYjtnQkFDRyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUM7YUFDZjs7O1lBaENRLFdBQVcsdUJBdURILE1BQU0sU0FBQyxXQUFXO1lBN0MvQixhQUFhO1lBSmIsb0JBQW9COzs7d0JBOEJuQixLQUFLO29DQVVMLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEluamVjdCwgSW5wdXQsIE9uRGVzdHJveSwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBGb3JtQnVpbGRlciwgRm9ybUNvbnRyb2wsIEZvcm1Hcm91cCwgVmFsaWRhdG9ycyB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7XG4gICAgQXBpU2VydmljZVJlc3VsdCxcbiAgICBDb252ZXJ0SlNPTkxELFxuICAgIElSSSxcbiAgICBLbm9yYUNvbnN0YW50cyxcbiAgICBPbnRvbG9neUNhY2hlU2VydmljZSxcbiAgICBQcm9wZXJ0eVZhbHVlLFxuICAgIFJlYWRSZXNvdXJjZSxcbiAgICBSZWFkUmVzb3VyY2VzU2VxdWVuY2UsXG4gICAgU2VhcmNoU2VydmljZSxcbiAgICBWYWx1ZVxufSBmcm9tICdAa25vcmEvY29yZSc7XG5cbmRlY2xhcmUgbGV0IHJlcXVpcmU6IGFueTsgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8zNDczMDAxMC9hbmd1bGFyMi01LW1pbnV0ZS1pbnN0YWxsLWJ1Zy1yZXF1aXJlLWlzLW5vdC1kZWZpbmVkXG5jb25zdCBqc29ubGQgPSByZXF1aXJlKCdqc29ubGQnKTtcblxuLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNDU2NjEwMTAvZHluYW1pYy1uZXN0ZWQtcmVhY3RpdmUtZm9ybS1leHByZXNzaW9uY2hhbmdlZGFmdGVyaXRoYXNiZWVuY2hlY2tlZGVycm9yXG5jb25zdCByZXNvbHZlZFByb21pc2UgPSBQcm9taXNlLnJlc29sdmUobnVsbCk7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnbGluay12YWx1ZScsXG4gICAgdGVtcGxhdGU6IGA8bWF0LWZvcm0tZmllbGQ+XG4gICAgPGlucHV0IG1hdElucHV0IHBsYWNlaG9sZGVyPVwicmVzb3VyY2VcIiBhcmlhLWxhYmVsPVwicmVzb3VyY2VcIiBbbWF0QXV0b2NvbXBsZXRlXT1cImF1dG9cIiBbZm9ybUNvbnRyb2xdPVwiZm9ybS5jb250cm9sc1sncmVzb3VyY2UnXVwiPlxuICAgIDxtYXQtYXV0b2NvbXBsZXRlICNhdXRvPVwibWF0QXV0b2NvbXBsZXRlXCIgW2Rpc3BsYXlXaXRoXT1cImRpc3BsYXlSZXNvdXJjZVwiPlxuICAgICAgICA8bWF0LW9wdGlvbiAqbmdGb3I9XCJsZXQgcmVzIG9mIHJlc291cmNlc1wiIFt2YWx1ZV09XCJyZXNcIj5cbiAgICAgICAgICAgIHt7cmVzPy5sYWJlbH19XG4gICAgICAgIDwvbWF0LW9wdGlvbj5cbiAgICA8L21hdC1hdXRvY29tcGxldGU+XG48L21hdC1mb3JtLWZpZWxkPlxuYCxcbiAgICBzdHlsZXM6IFtgYF1cbn0pXG5leHBvcnQgY2xhc3MgTGlua1ZhbHVlQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3ksIFByb3BlcnR5VmFsdWUge1xuXG4gICAgLy8gcGFyZW50IEZvcm1Hcm91cFxuICAgIEBJbnB1dCgpIGZvcm1Hcm91cDogRm9ybUdyb3VwO1xuXG4gICAgdHlwZSA9IEtub3JhQ29uc3RhbnRzLkxpbmtWYWx1ZTtcblxuICAgIGZvcm06IEZvcm1Hcm91cDtcblxuICAgIHJlc291cmNlczogUmVhZFJlc291cmNlW107XG5cbiAgICBwcml2YXRlIF9yZXN0cmljdFRvUmVzb3VyY2VDbGFzczogc3RyaW5nO1xuXG4gICAgQElucHV0KClcbiAgICBzZXQgcmVzdHJpY3RSZXNvdXJjZUNsYXNzKHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5fcmVzdHJpY3RUb1Jlc291cmNlQ2xhc3MgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBnZXQgcmVzdHJpY3RSZXNvdXJjZUNsYXNzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcmVzdHJpY3RUb1Jlc291cmNlQ2xhc3M7XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IoQEluamVjdChGb3JtQnVpbGRlcikgcHJpdmF0ZSBmYjogRm9ybUJ1aWxkZXIsIHByaXZhdGUgX3NlYXJjaFNlcnZpY2U6IFNlYXJjaFNlcnZpY2UsIHByaXZhdGUgX2NhY2hlU2VydmljZTogT250b2xvZ3lDYWNoZVNlcnZpY2UpIHtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERpc3BsYXlzIGEgc2VsZWN0ZWQgcmVzb3VyY2UgdXNpbmcgaXRzIGxhYmVsLlxuICAgICAqXG4gICAgICogQHBhcmFtIHJlc291cmNlIHRoZSByZXNvdXJjZSB0byBiZSBkaXNwbGF5ZWQgKG9yIG5vIHNlbGVjdGlvbiB5ZXQpLlxuICAgICAqIEByZXR1cm5zXG4gICAgICovXG4gICAgZGlzcGxheVJlc291cmNlKHJlc291cmNlOiBSZWFkUmVzb3VyY2UgfCBudWxsKSB7XG5cbiAgICAgICAgLy8gbnVsbCBpcyB0aGUgaW5pdGlhbCB2YWx1ZSAobm8gc2VsZWN0aW9uIHlldClcbiAgICAgICAgaWYgKHJlc291cmNlICE9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzb3VyY2UubGFiZWw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZWFyY2ggZm9yIHJlc291cmNlcyB3aG9zZSBsYWJlbHMgY29udGFpbiB0aGUgZ2l2ZW4gc2VhcmNoIHRlcm0sIHJlc3RyaWN0aW5nIHRvIHRvIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG9iamVjdCBjb25zdHJhaW50LlxuICAgICAqXG4gICAgICogQHBhcmFtIHNlYXJjaFRlcm1cbiAgICAgKi9cbiAgICBzZWFyY2hCeUxhYmVsKHNlYXJjaFRlcm06IHN0cmluZykge1xuXG4gICAgICAgIC8vIGF0IGxlYXN0IDMgY2hhcmFjdGVycyBhcmUgcmVxdWlyZWRcbiAgICAgICAgaWYgKHNlYXJjaFRlcm0ubGVuZ3RoID49IDMpIHtcblxuICAgICAgICAgICAgdGhpcy5fc2VhcmNoU2VydmljZS5zZWFyY2hCeUxhYmVsUmVhZFJlc291cmNlU2VxdWVuY2Uoc2VhcmNoVGVybSwgdGhpcy5fcmVzdHJpY3RUb1Jlc291cmNlQ2xhc3MpLnN1YnNjcmliZShcbiAgICAgICAgICAgICAgICAocmVzdWx0OiBSZWFkUmVzb3VyY2VzU2VxdWVuY2UpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNvdXJjZXMgPSByZXN1bHQucmVzb3VyY2VzO1xuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0pTT05MRCBvZiBmdWxsIHJlc291cmNlIHJlcXVlc3QgY291bGQgbm90IGJlIGV4cGFuZGVkOicgKyBlcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBjbGVhciBzZWxlY3Rpb25cbiAgICAgICAgICAgIHRoaXMucmVzb3VyY2VzID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgdGhhdCB0aGUgc2VsZWN0aW9uIGlzIGEgW1tSZWFkUmVzb3VyY2VdXS5cbiAgICAgKlxuICAgICAqIFN1cnByaXNpbmdseSwgW251bGxdIGhhcyB0byBiZSByZXR1cm5lZCBpZiB0aGUgdmFsdWUgaXMgdmFsaWQ6IGh0dHBzOi8vYW5ndWxhci5pby9ndWlkZS9mb3JtLXZhbGlkYXRpb24jY3VzdG9tLXZhbGlkYXRvcnNcbiAgICAgKlxuICAgICAqIEBwYXJhbSB0aGUgZm9ybSBlbGVtZW50IHdob3NlIHZhbHVlIGhhcyB0byBiZSBjaGVja2VkLlxuICAgICAqIEByZXR1cm5zXG4gICAgICovXG4gICAgdmFsaWRhdGVSZXNvdXJjZShjOiBGb3JtQ29udHJvbCkge1xuXG4gICAgICAgIGNvbnN0IGlzVmFsaWRSZXNvdXJjZSA9IChjLnZhbHVlIGluc3RhbmNlb2YgUmVhZFJlc291cmNlKTtcblxuICAgICAgICBpZiAoaXNWYWxpZFJlc291cmNlKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgbm9SZXNvdXJjZToge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogYy52YWx1ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIG5nT25Jbml0KCkge1xuICAgICAgICB0aGlzLmZvcm0gPSB0aGlzLmZiLmdyb3VwKHtcbiAgICAgICAgICAgIHJlc291cmNlOiBbbnVsbCwgVmFsaWRhdG9ycy5jb21wb3NlKFtcbiAgICAgICAgICAgICAgICBWYWxpZGF0b3JzLnJlcXVpcmVkLFxuICAgICAgICAgICAgICAgIHRoaXMudmFsaWRhdGVSZXNvdXJjZVxuICAgICAgICAgICAgXSldXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuZm9ybS52YWx1ZUNoYW5nZXMuc3Vic2NyaWJlKChkYXRhKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNlYXJjaEJ5TGFiZWwoZGF0YS5yZXNvdXJjZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJlc29sdmVkUHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIC8vIGFkZCBmb3JtIHRvIHRoZSBwYXJlbnQgZm9ybSBncm91cFxuICAgICAgICAgICAgdGhpcy5mb3JtR3JvdXAuYWRkQ29udHJvbCgncHJvcFZhbHVlJywgdGhpcy5mb3JtKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG5cbiAgICAgICAgLy8gcmVtb3ZlIGZvcm0gZnJvbSB0aGUgcGFyZW50IGZvcm0gZ3JvdXBcbiAgICAgICAgcmVzb2x2ZWRQcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5mb3JtR3JvdXAucmVtb3ZlQ29udHJvbCgncHJvcFZhbHVlJyk7XG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgZ2V0VmFsdWUoKTogVmFsdWUge1xuXG4gICAgICAgIHJldHVybiBuZXcgSVJJKHRoaXMuZm9ybS52YWx1ZS5yZXNvdXJjZS5pZCk7XG4gICAgfVxuXG59XG4iXX0=