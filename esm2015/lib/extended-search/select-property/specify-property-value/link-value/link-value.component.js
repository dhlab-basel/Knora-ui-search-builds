import { Component, Inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConvertJSONLD, IRI, KnoraConstants, OntologyCacheService, ReadResource, SearchService } from '@knora/core';
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
            this._searchService.searchByLabel(searchTerm, this._restrictToResourceClass).subscribe((result) => {
                const promises = jsonld.promises;
                // compact JSON-LD using an empty context: expands all Iris
                const promise = promises.compact(result.body, {});
                promise.then((compacted) => {
                    const resourceSeq = ConvertJSONLD.createReadResourcesSequenceFromJsonLD(compacted);
                    this.resources = resourceSeq.resources;
                }, function (err) {
                    console.log('JSONLD of full resource request could not be expanded:' + err);
                });
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
/** @nocollapse */
LinkValueComponent.ctorParameters = () => [
    { type: FormBuilder, decorators: [{ type: Inject, args: [FormBuilder,] }] },
    { type: SearchService },
    { type: OntologyCacheService }
];
LinkValueComponent.propDecorators = {
    formGroup: [{ type: Input }],
    restrictResourceClass: [{ type: Input }]
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGluay12YWx1ZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Aa25vcmEvc2VhcmNoLyIsInNvdXJjZXMiOlsibGliL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3QtcHJvcGVydHkvc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZS9saW5rLXZhbHVlL2xpbmstdmFsdWUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBcUIsTUFBTSxlQUFlLENBQUM7QUFDNUUsT0FBTyxFQUFFLFdBQVcsRUFBZSxTQUFTLEVBQUUsVUFBVSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDakYsT0FBTyxFQUVILGFBQWEsRUFDYixHQUFHLEVBQ0gsY0FBYyxFQUNkLG9CQUFvQixFQUVwQixZQUFZLEVBRVosYUFBYSxFQUVoQixNQUFNLGFBQWEsQ0FBQztBQUdyQixNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFFakMsd0hBQXdIO0FBQ3hILE1BQU0sZUFBZSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFlOUMsTUFBTTtJQXNCRixZQUF5QyxFQUFlLEVBQVUsY0FBNkIsRUFBVSxhQUFtQztRQUFuRyxPQUFFLEdBQUYsRUFBRSxDQUFhO1FBQVUsbUJBQWMsR0FBZCxjQUFjLENBQWU7UUFBVSxrQkFBYSxHQUFiLGFBQWEsQ0FBc0I7UUFqQjVJLFNBQUksR0FBRyxjQUFjLENBQUMsU0FBUyxDQUFDO0lBbUJoQyxDQUFDO0lBWEQsSUFDSSxxQkFBcUIsQ0FBQyxLQUFhO1FBQ25DLElBQUksQ0FBQyx3QkFBd0IsR0FBRyxLQUFLLENBQUM7SUFDMUMsQ0FBQztJQUVELElBQUkscUJBQXFCO1FBQ3JCLE9BQU8sSUFBSSxDQUFDLHdCQUF3QixDQUFDO0lBQ3pDLENBQUM7SUFNRDs7Ozs7T0FLRztJQUNILGVBQWUsQ0FBQyxRQUE2QjtRQUV6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QUFNLEVBQUUsQ0FBQyxFQUFFLENBQUM7YUFDZjs7OztZQWhDUSxXQUFXLHVCQXVESCxNQUFNLFNBQUMsV0FBVztZQTdDL0IsYUFBYTtZQUpiLG9CQUFvQjs7O3dCQThCbkIsS0FBSztvQ0FVTCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbmplY3QsIElucHV0LCBPbkRlc3Ryb3ksIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRm9ybUJ1aWxkZXIsIEZvcm1Db250cm9sLCBGb3JtR3JvdXAsIFZhbGlkYXRvcnMgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge1xuICAgIEFwaVNlcnZpY2VSZXN1bHQsXG4gICAgQ29udmVydEpTT05MRCxcbiAgICBJUkksXG4gICAgS25vcmFDb25zdGFudHMsXG4gICAgT250b2xvZ3lDYWNoZVNlcnZpY2UsXG4gICAgUHJvcGVydHlWYWx1ZSxcbiAgICBSZWFkUmVzb3VyY2UsXG4gICAgUmVhZFJlc291cmNlc1NlcXVlbmNlLFxuICAgIFNlYXJjaFNlcnZpY2UsXG4gICAgVmFsdWVcbn0gZnJvbSAnQGtub3JhL2NvcmUnO1xuXG5kZWNsYXJlIGxldCByZXF1aXJlOiBhbnk7IC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMzQ3MzAwMTAvYW5ndWxhcjItNS1taW51dGUtaW5zdGFsbC1idWctcmVxdWlyZS1pcy1ub3QtZGVmaW5lZFxuY29uc3QganNvbmxkID0gcmVxdWlyZSgnanNvbmxkJyk7XG5cbi8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzQ1NjYxMDEwL2R5bmFtaWMtbmVzdGVkLXJlYWN0aXZlLWZvcm0tZXhwcmVzc2lvbmNoYW5nZWRhZnRlcml0aGFzYmVlbmNoZWNrZWRlcnJvclxuY29uc3QgcmVzb2x2ZWRQcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKG51bGwpO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ2xpbmstdmFsdWUnLFxuICAgIHRlbXBsYXRlOiBgPG1hdC1mb3JtLWZpZWxkPlxuICAgIDxpbnB1dCBtYXRJbnB1dCBwbGFjZWhvbGRlcj1cInJlc291cmNlXCIgYXJpYS1sYWJlbD1cInJlc291cmNlXCIgW21hdEF1dG9jb21wbGV0ZV09XCJhdXRvXCIgW2Zvcm1Db250cm9sXT1cImZvcm0uY29udHJvbHNbJ3Jlc291cmNlJ11cIj5cbiAgICA8bWF0LWF1dG9jb21wbGV0ZSAjYXV0bz1cIm1hdEF1dG9jb21wbGV0ZVwiIFtkaXNwbGF5V2l0aF09XCJkaXNwbGF5UmVzb3VyY2VcIj5cbiAgICAgICAgPG1hdC1vcHRpb24gKm5nRm9yPVwibGV0IHJlcyBvZiByZXNvdXJjZXNcIiBbdmFsdWVdPVwicmVzXCI+XG4gICAgICAgICAgICB7e3Jlcz8ubGFiZWx9fVxuICAgICAgICA8L21hdC1vcHRpb24+XG4gICAgPC9tYXQtYXV0b2NvbXBsZXRlPlxuPC9tYXQtZm9ybS1maWVsZD5cbmAsXG4gICAgc3R5bGVzOiBbYGBdXG59KVxuZXhwb3J0IGNsYXNzIExpbmtWYWx1ZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95LCBQcm9wZXJ0eVZhbHVlIHtcblxuICAgIC8vIHBhcmVudCBGb3JtR3JvdXBcbiAgICBASW5wdXQoKSBmb3JtR3JvdXA6IEZvcm1Hcm91cDtcblxuICAgIHR5cGUgPSBLbm9yYUNvbnN0YW50cy5MaW5rVmFsdWU7XG5cbiAgICBmb3JtOiBGb3JtR3JvdXA7XG5cbiAgICByZXNvdXJjZXM6IFJlYWRSZXNvdXJjZVtdO1xuXG4gICAgcHJpdmF0ZSBfcmVzdHJpY3RUb1Jlc291cmNlQ2xhc3M6IHN0cmluZztcblxuICAgIEBJbnB1dCgpXG4gICAgc2V0IHJlc3RyaWN0UmVzb3VyY2VDbGFzcyh2YWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuX3Jlc3RyaWN0VG9SZXNvdXJjZUNsYXNzID0gdmFsdWU7XG4gICAgfVxuXG4gICAgZ2V0IHJlc3RyaWN0UmVzb3VyY2VDbGFzcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Jlc3RyaWN0VG9SZXNvdXJjZUNsYXNzO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKEBJbmplY3QoRm9ybUJ1aWxkZXIpIHByaXZhdGUgZmI6IEZvcm1CdWlsZGVyLCBwcml2YXRlIF9zZWFyY2hTZXJ2aWNlOiBTZWFyY2hTZXJ2aWNlLCBwcml2YXRlIF9jYWNoZVNlcnZpY2U6IE9udG9sb2d5Q2FjaGVTZXJ2aWNlKSB7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEaXNwbGF5cyBhIHNlbGVjdGVkIHJlc291cmNlIHVzaW5nIGl0cyBsYWJlbC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSByZXNvdXJjZSB0aGUgcmVzb3VyY2UgdG8gYmUgZGlzcGxheWVkIChvciBubyBzZWxlY3Rpb24geWV0KS5cbiAgICAgKiBAcmV0dXJuc1xuICAgICAqL1xuICAgIGRpc3BsYXlSZXNvdXJjZShyZXNvdXJjZTogUmVhZFJlc291cmNlIHwgbnVsbCkge1xuXG4gICAgICAgIC8vIG51bGwgaXMgdGhlIGluaXRpYWwgdmFsdWUgKG5vIHNlbGVjdGlvbiB5ZXQpXG4gICAgICAgIGlmIChyZXNvdXJjZSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc291cmNlLmxhYmVsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2VhcmNoIGZvciByZXNvdXJjZXMgd2hvc2UgbGFiZWxzIGNvbnRhaW4gdGhlIGdpdmVuIHNlYXJjaCB0ZXJtLCByZXN0cmljdGluZyB0byB0byB0aGUgZ2l2ZW4gcHJvcGVydGllcyBvYmplY3QgY29uc3RyYWludC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBzZWFyY2hUZXJtXG4gICAgICovXG4gICAgc2VhcmNoQnlMYWJlbChzZWFyY2hUZXJtOiBzdHJpbmcpIHtcblxuICAgICAgICAvLyBhdCBsZWFzdCAzIGNoYXJhY3RlcnMgYXJlIHJlcXVpcmVkXG4gICAgICAgIGlmIChzZWFyY2hUZXJtLmxlbmd0aCA+PSAzKSB7XG5cbiAgICAgICAgICAgIHRoaXMuX3NlYXJjaFNlcnZpY2Uuc2VhcmNoQnlMYWJlbChzZWFyY2hUZXJtLCB0aGlzLl9yZXN0cmljdFRvUmVzb3VyY2VDbGFzcykuc3Vic2NyaWJlKFxuICAgICAgICAgICAgICAgIChyZXN1bHQ6IEFwaVNlcnZpY2VSZXN1bHQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJvbWlzZXMgPSBqc29ubGQucHJvbWlzZXM7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbXBhY3QgSlNPTi1MRCB1c2luZyBhbiBlbXB0eSBjb250ZXh0OiBleHBhbmRzIGFsbCBJcmlzXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHByb21pc2UgPSBwcm9taXNlcy5jb21wYWN0KHJlc3VsdC5ib2R5LCB7fSk7XG5cbiAgICAgICAgICAgICAgICAgICAgcHJvbWlzZS50aGVuKChjb21wYWN0ZWQpID0+IHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzb3VyY2VTZXE6IFJlYWRSZXNvdXJjZXNTZXF1ZW5jZSA9IENvbnZlcnRKU09OTEQuY3JlYXRlUmVhZFJlc291cmNlc1NlcXVlbmNlRnJvbUpzb25MRChjb21wYWN0ZWQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc291cmNlcyA9IHJlc291cmNlU2VxLnJlc291cmNlcztcblxuICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdKU09OTEQgb2YgZnVsbCByZXNvdXJjZSByZXF1ZXN0IGNvdWxkIG5vdCBiZSBleHBhbmRlZDonICsgZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gY2xlYXIgc2VsZWN0aW9uXG4gICAgICAgICAgICB0aGlzLnJlc291cmNlcyA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIHRoYXQgdGhlIHNlbGVjdGlvbiBpcyBhIFtbUmVhZFJlc291cmNlXV0uXG4gICAgICpcbiAgICAgKiBTdXJwcmlzaW5nbHksIFtudWxsXSBoYXMgdG8gYmUgcmV0dXJuZWQgaWYgdGhlIHZhbHVlIGlzIHZhbGlkOiBodHRwczovL2FuZ3VsYXIuaW8vZ3VpZGUvZm9ybS12YWxpZGF0aW9uI2N1c3RvbS12YWxpZGF0b3JzXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdGhlIGZvcm0gZWxlbWVudCB3aG9zZSB2YWx1ZSBoYXMgdG8gYmUgY2hlY2tlZC5cbiAgICAgKiBAcmV0dXJuc1xuICAgICAqL1xuICAgIHZhbGlkYXRlUmVzb3VyY2UoYzogRm9ybUNvbnRyb2wpIHtcblxuICAgICAgICBjb25zdCBpc1ZhbGlkUmVzb3VyY2UgPSAoYy52YWx1ZSBpbnN0YW5jZW9mIFJlYWRSZXNvdXJjZSk7XG5cbiAgICAgICAgaWYgKGlzVmFsaWRSZXNvdXJjZSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIG5vUmVzb3VyY2U6IHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGMudmFsdWVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgdGhpcy5mb3JtID0gdGhpcy5mYi5ncm91cCh7XG4gICAgICAgICAgICByZXNvdXJjZTogW251bGwsIFZhbGlkYXRvcnMuY29tcG9zZShbXG4gICAgICAgICAgICAgICAgVmFsaWRhdG9ycy5yZXF1aXJlZCxcbiAgICAgICAgICAgICAgICB0aGlzLnZhbGlkYXRlUmVzb3VyY2VcbiAgICAgICAgICAgIF0pXVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmZvcm0udmFsdWVDaGFuZ2VzLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZWFyY2hCeUxhYmVsKGRhdGEucmVzb3VyY2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXNvbHZlZFByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAvLyBhZGQgZm9ybSB0byB0aGUgcGFyZW50IGZvcm0gZ3JvdXBcbiAgICAgICAgICAgIHRoaXMuZm9ybUdyb3VwLmFkZENvbnRyb2woJ3Byb3BWYWx1ZScsIHRoaXMuZm9ybSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCkge1xuXG4gICAgICAgIC8vIHJlbW92ZSBmb3JtIGZyb20gdGhlIHBhcmVudCBmb3JtIGdyb3VwXG4gICAgICAgIHJlc29sdmVkUHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZm9ybUdyb3VwLnJlbW92ZUNvbnRyb2woJ3Byb3BWYWx1ZScpO1xuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIGdldFZhbHVlKCk6IFZhbHVlIHtcblxuICAgICAgICByZXR1cm4gbmV3IElSSSh0aGlzLmZvcm0udmFsdWUucmVzb3VyY2UuaWQpO1xuICAgIH1cblxufVxuIl19