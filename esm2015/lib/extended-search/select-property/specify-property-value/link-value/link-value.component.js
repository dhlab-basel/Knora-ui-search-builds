/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, Inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConvertJSONLD, IRI, KnoraConstants, OntologyCacheService, ReadResource, SearchService } from '@knora/core';
/** @type {?} */
const jsonld = require('jsonld');
/** @type {?} */
const resolvedPromise = Promise.resolve(null);
export class LinkValueComponent {
    /**
     * @param {?} fb
     * @param {?} _searchService
     * @param {?} _cacheService
     */
    constructor(fb, _searchService, _cacheService) {
        this.fb = fb;
        this._searchService = _searchService;
        this._cacheService = _cacheService;
        this.type = KnoraConstants.LinkValue;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set restrictResourceClass(value) {
        this._restrictToResourceClass = value;
    }
    /**
     * @return {?}
     */
    get restrictResourceClass() {
        return this._restrictToResourceClass;
    }
    /**
     * Displays a selected resource using its label.
     *
     * @param {?} resource the resource to be displayed (or no selection yet).
     * @return {?}
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
     * @param {?} searchTerm
     * @return {?}
     */
    searchByLabel(searchTerm) {
        // at least 3 characters are required
        if (searchTerm.length >= 3) {
            this._searchService.searchByLabel(searchTerm, this._restrictToResourceClass).subscribe((result) => {
                /** @type {?} */
                const promises = jsonld.promises;
                /** @type {?} */
                const promise = promises.compact(result.body, {});
                promise.then((compacted) => {
                    /** @type {?} */
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
     * @param {?} c
     * @return {?}
     */
    validateResource(c) {
        /** @type {?} */
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
    /**
     * @return {?}
     */
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
    /**
     * @return {?}
     */
    ngOnDestroy() {
        // remove form from the parent form group
        resolvedPromise.then(() => {
            this.formGroup.removeControl('propValue');
        });
    }
    /**
     * @return {?}
     */
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
if (false) {
    /** @type {?} */
    LinkValueComponent.prototype.formGroup;
    /** @type {?} */
    LinkValueComponent.prototype.type;
    /** @type {?} */
    LinkValueComponent.prototype.form;
    /** @type {?} */
    LinkValueComponent.prototype.resources;
    /** @type {?} */
    LinkValueComponent.prototype._restrictToResourceClass;
    /** @type {?} */
    LinkValueComponent.prototype.fb;
    /** @type {?} */
    LinkValueComponent.prototype._searchService;
    /** @type {?} */
    LinkValueComponent.prototype._cacheService;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGluay12YWx1ZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Aa25vcmEvc2VhcmNoLyIsInNvdXJjZXMiOlsibGliL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3QtcHJvcGVydHkvc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZS9saW5rLXZhbHVlL2xpbmstdmFsdWUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQXFCLE1BQU0sZUFBZSxDQUFDO0FBQzVFLE9BQU8sRUFBRSxXQUFXLEVBQWUsU0FBUyxFQUFFLFVBQVUsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ2pGLE9BQU8sRUFFSCxhQUFhLEVBQ2IsR0FBRyxFQUNILGNBQWMsRUFDZCxvQkFBb0IsRUFFcEIsWUFBWSxFQUVaLGFBQWEsRUFFaEIsTUFBTSxhQUFhLENBQUM7O0FBR3JCLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQzs7QUFHakMsTUFBTSxlQUFlLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQWU5QyxNQUFNOzs7Ozs7SUFzQkYsWUFBeUMsRUFBZSxFQUFVLGNBQTZCLEVBQVUsYUFBbUM7UUFBbkcsT0FBRSxHQUFGLEVBQUUsQ0FBYTtRQUFVLG1CQUFjLEdBQWQsY0FBYyxDQUFlO1FBQVUsa0JBQWEsR0FBYixhQUFhLENBQXNCO29CQWpCckksY0FBYyxDQUFDLFNBQVM7S0FtQjlCOzs7OztJQVhELElBQ0kscUJBQXFCLENBQUMsS0FBYTtRQUNuQyxJQUFJLENBQUMsd0JBQXdCLEdBQUcsS0FBSyxDQUFDO0tBQ3pDOzs7O0lBRUQsSUFBSSxxQkFBcUI7UUFDckIsTUFBTSxDQUFDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQztLQUN4Qzs7Ozs7OztJQVlELGVBQWUsQ0FBQyxRQUE2Qjs7UUFHekMsRUFBRSxDQUFDLENBQUMsUUFBUSxLQUFL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TSxTQUFDLFdBQVc7WUE3Qy9CLGFBQWE7WUFKYixvQkFBb0I7Ozt3QkE4Qm5CLEtBQUs7b0NBVUwsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5qZWN0LCBJbnB1dCwgT25EZXN0cm95LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEZvcm1CdWlsZGVyLCBGb3JtQ29udHJvbCwgRm9ybUdyb3VwLCBWYWxpZGF0b3JzIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtcbiAgICBBcGlTZXJ2aWNlUmVzdWx0LFxuICAgIENvbnZlcnRKU09OTEQsXG4gICAgSVJJLFxuICAgIEtub3JhQ29uc3RhbnRzLFxuICAgIE9udG9sb2d5Q2FjaGVTZXJ2aWNlLFxuICAgIFByb3BlcnR5VmFsdWUsXG4gICAgUmVhZFJlc291cmNlLFxuICAgIFJlYWRSZXNvdXJjZXNTZXF1ZW5jZSxcbiAgICBTZWFyY2hTZXJ2aWNlLFxuICAgIFZhbHVlXG59IGZyb20gJ0Brbm9yYS9jb3JlJztcblxuZGVjbGFyZSBsZXQgcmVxdWlyZTogYW55OyAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzM0NzMwMDEwL2FuZ3VsYXIyLTUtbWludXRlLWluc3RhbGwtYnVnLXJlcXVpcmUtaXMtbm90LWRlZmluZWRcbmNvbnN0IGpzb25sZCA9IHJlcXVpcmUoJ2pzb25sZCcpO1xuXG4vLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy80NTY2MTAxMC9keW5hbWljLW5lc3RlZC1yZWFjdGl2ZS1mb3JtLWV4cHJlc3Npb25jaGFuZ2VkYWZ0ZXJpdGhhc2JlZW5jaGVja2VkZXJyb3JcbmNvbnN0IHJlc29sdmVkUHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZShudWxsKTtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdsaW5rLXZhbHVlJyxcbiAgICB0ZW1wbGF0ZTogYDxtYXQtZm9ybS1maWVsZD5cbiAgICA8aW5wdXQgbWF0SW5wdXQgcGxhY2Vob2xkZXI9XCJyZXNvdXJjZVwiIGFyaWEtbGFiZWw9XCJyZXNvdXJjZVwiIFttYXRBdXRvY29tcGxldGVdPVwiYXV0b1wiIFtmb3JtQ29udHJvbF09XCJmb3JtLmNvbnRyb2xzWydyZXNvdXJjZSddXCI+XG4gICAgPG1hdC1hdXRvY29tcGxldGUgI2F1dG89XCJtYXRBdXRvY29tcGxldGVcIiBbZGlzcGxheVdpdGhdPVwiZGlzcGxheVJlc291cmNlXCI+XG4gICAgICAgIDxtYXQtb3B0aW9uICpuZ0Zvcj1cImxldCByZXMgb2YgcmVzb3VyY2VzXCIgW3ZhbHVlXT1cInJlc1wiPlxuICAgICAgICAgICAge3tyZXM/LmxhYmVsfX1cbiAgICAgICAgPC9tYXQtb3B0aW9uPlxuICAgIDwvbWF0LWF1dG9jb21wbGV0ZT5cbjwvbWF0LWZvcm0tZmllbGQ+XG5gLFxuICAgIHN0eWxlczogW2BgXVxufSlcbmV4cG9ydCBjbGFzcyBMaW5rVmFsdWVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgUHJvcGVydHlWYWx1ZSB7XG5cbiAgICAvLyBwYXJlbnQgRm9ybUdyb3VwXG4gICAgQElucHV0KCkgZm9ybUdyb3VwOiBGb3JtR3JvdXA7XG5cbiAgICB0eXBlID0gS25vcmFDb25zdGFudHMuTGlua1ZhbHVlO1xuXG4gICAgZm9ybTogRm9ybUdyb3VwO1xuXG4gICAgcmVzb3VyY2VzOiBSZWFkUmVzb3VyY2VbXTtcblxuICAgIHByaXZhdGUgX3Jlc3RyaWN0VG9SZXNvdXJjZUNsYXNzOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKVxuICAgIHNldCByZXN0cmljdFJlc291cmNlQ2xhc3ModmFsdWU6IHN0cmluZykge1xuICAgICAgICB0aGlzLl9yZXN0cmljdFRvUmVzb3VyY2VDbGFzcyA9IHZhbHVlO1xuICAgIH1cblxuICAgIGdldCByZXN0cmljdFJlc291cmNlQ2xhc3MoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9yZXN0cmljdFRvUmVzb3VyY2VDbGFzcztcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihASW5qZWN0KEZvcm1CdWlsZGVyKSBwcml2YXRlIGZiOiBGb3JtQnVpbGRlciwgcHJpdmF0ZSBfc2VhcmNoU2VydmljZTogU2VhcmNoU2VydmljZSwgcHJpdmF0ZSBfY2FjaGVTZXJ2aWNlOiBPbnRvbG9neUNhY2hlU2VydmljZSkge1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRGlzcGxheXMgYSBzZWxlY3RlZCByZXNvdXJjZSB1c2luZyBpdHMgbGFiZWwuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcmVzb3VyY2UgdGhlIHJlc291cmNlIHRvIGJlIGRpc3BsYXllZCAob3Igbm8gc2VsZWN0aW9uIHlldCkuXG4gICAgICogQHJldHVybnNcbiAgICAgKi9cbiAgICBkaXNwbGF5UmVzb3VyY2UocmVzb3VyY2U6IFJlYWRSZXNvdXJjZSB8IG51bGwpIHtcblxuICAgICAgICAvLyBudWxsIGlzIHRoZSBpbml0aWFsIHZhbHVlIChubyBzZWxlY3Rpb24geWV0KVxuICAgICAgICBpZiAocmVzb3VyY2UgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNvdXJjZS5sYWJlbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNlYXJjaCBmb3IgcmVzb3VyY2VzIHdob3NlIGxhYmVscyBjb250YWluIHRoZSBnaXZlbiBzZWFyY2ggdGVybSwgcmVzdHJpY3RpbmcgdG8gdG8gdGhlIGdpdmVuIHByb3BlcnRpZXMgb2JqZWN0IGNvbnN0cmFpbnQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc2VhcmNoVGVybVxuICAgICAqL1xuICAgIHNlYXJjaEJ5TGFiZWwoc2VhcmNoVGVybTogc3RyaW5nKSB7XG5cbiAgICAgICAgLy8gYXQgbGVhc3QgMyBjaGFyYWN0ZXJzIGFyZSByZXF1aXJlZFxuICAgICAgICBpZiAoc2VhcmNoVGVybS5sZW5ndGggPj0gMykge1xuXG4gICAgICAgICAgICB0aGlzLl9zZWFyY2hTZXJ2aWNlLnNlYXJjaEJ5TGFiZWwoc2VhcmNoVGVybSwgdGhpcy5fcmVzdHJpY3RUb1Jlc291cmNlQ2xhc3MpLnN1YnNjcmliZShcbiAgICAgICAgICAgICAgICAocmVzdWx0OiBBcGlTZXJ2aWNlUmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHByb21pc2VzID0ganNvbmxkLnByb21pc2VzO1xuICAgICAgICAgICAgICAgICAgICAvLyBjb21wYWN0IEpTT04tTEQgdXNpbmcgYW4gZW1wdHkgY29udGV4dDogZXhwYW5kcyBhbGwgSXJpc1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwcm9taXNlID0gcHJvbWlzZXMuY29tcGFjdChyZXN1bHQuYm9keSwge30pO1xuXG4gICAgICAgICAgICAgICAgICAgIHByb21pc2UudGhlbigoY29tcGFjdGVkKSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc291cmNlU2VxOiBSZWFkUmVzb3VyY2VzU2VxdWVuY2UgPSBDb252ZXJ0SlNPTkxELmNyZWF0ZVJlYWRSZXNvdXJjZXNTZXF1ZW5jZUZyb21Kc29uTEQoY29tcGFjdGVkKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNvdXJjZXMgPSByZXNvdXJjZVNlcS5yZXNvdXJjZXM7XG5cbiAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnSlNPTkxEIG9mIGZ1bGwgcmVzb3VyY2UgcmVxdWVzdCBjb3VsZCBub3QgYmUgZXhwYW5kZWQ6JyArIGVycik7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGNsZWFyIHNlbGVjdGlvblxuICAgICAgICAgICAgdGhpcy5yZXNvdXJjZXMgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyB0aGF0IHRoZSBzZWxlY3Rpb24gaXMgYSBbW1JlYWRSZXNvdXJjZV1dLlxuICAgICAqXG4gICAgICogU3VycHJpc2luZ2x5LCBbbnVsbF0gaGFzIHRvIGJlIHJldHVybmVkIGlmIHRoZSB2YWx1ZSBpcyB2YWxpZDogaHR0cHM6Ly9hbmd1bGFyLmlvL2d1aWRlL2Zvcm0tdmFsaWRhdGlvbiNjdXN0b20tdmFsaWRhdG9yc1xuICAgICAqXG4gICAgICogQHBhcmFtIHRoZSBmb3JtIGVsZW1lbnQgd2hvc2UgdmFsdWUgaGFzIHRvIGJlIGNoZWNrZWQuXG4gICAgICogQHJldHVybnNcbiAgICAgKi9cbiAgICB2YWxpZGF0ZVJlc291cmNlKGM6IEZvcm1Db250cm9sKSB7XG5cbiAgICAgICAgY29uc3QgaXNWYWxpZFJlc291cmNlID0gKGMudmFsdWUgaW5zdGFuY2VvZiBSZWFkUmVzb3VyY2UpO1xuXG4gICAgICAgIGlmIChpc1ZhbGlkUmVzb3VyY2UpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBub1Jlc291cmNlOiB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBjLnZhbHVlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgbmdPbkluaXQoKSB7XG4gICAgICAgIHRoaXMuZm9ybSA9IHRoaXMuZmIuZ3JvdXAoe1xuICAgICAgICAgICAgcmVzb3VyY2U6IFtudWxsLCBWYWxpZGF0b3JzLmNvbXBvc2UoW1xuICAgICAgICAgICAgICAgIFZhbGlkYXRvcnMucmVxdWlyZWQsXG4gICAgICAgICAgICAgICAgdGhpcy52YWxpZGF0ZVJlc291cmNlXG4gICAgICAgICAgICBdKV1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5mb3JtLnZhbHVlQ2hhbmdlcy5zdWJzY3JpYmUoKGRhdGEpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2VhcmNoQnlMYWJlbChkYXRhLnJlc291cmNlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmVzb2x2ZWRQcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgLy8gYWRkIGZvcm0gdG8gdGhlIHBhcmVudCBmb3JtIGdyb3VwXG4gICAgICAgICAgICB0aGlzLmZvcm1Hcm91cC5hZGRDb250cm9sKCdwcm9wVmFsdWUnLCB0aGlzLmZvcm0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcblxuICAgICAgICAvLyByZW1vdmUgZm9ybSBmcm9tIHRoZSBwYXJlbnQgZm9ybSBncm91cFxuICAgICAgICByZXNvbHZlZFByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZvcm1Hcm91cC5yZW1vdmVDb250cm9sKCdwcm9wVmFsdWUnKTtcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBnZXRWYWx1ZSgpOiBWYWx1ZSB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBJUkkodGhpcy5mb3JtLnZhbHVlLnJlc291cmNlLmlkKTtcbiAgICB9XG5cbn1cbiJdfQ==