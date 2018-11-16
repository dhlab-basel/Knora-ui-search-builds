/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
/** @type {?} */
var resolvedPromise = Promise.resolve(null);
var SelectResourceClassComponent = /** @class */ (function () {
    function SelectResourceClassComponent(fb) {
        this.fb = fb;
        // event emitted to parent component once a resource class is selected by the user
        this.resourceClassSelectedEvent = new EventEmitter();
    }
    Object.defineProperty(SelectResourceClassComponent.prototype, "resourceClasses", {
        // getter method for resource classes (used in template)
        get: /**
         * @return {?}
         */
        function () {
            return this._resourceClasses;
        },
        // setter method for resource classes when being updated by parent component
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this.resourceClassSelected = undefined; // reset on updates
            this._resourceClasses = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns the Iri of the selected resource class.
     *
     * @returns the Iri of the selected resource class or false in case no resource class is selected.
     */
    /**
     * Returns the Iri of the selected resource class.
     *
     * @return {?} the Iri of the selected resource class or false in case no resource class is selected.
     */
    SelectResourceClassComponent.prototype.getResourceClassSelected = /**
     * Returns the Iri of the selected resource class.
     *
     * @return {?} the Iri of the selected resource class or false in case no resource class is selected.
     */
    function () {
        if (this.resourceClassSelected !== undefined && this.resourceClassSelected !== null) {
            return this.resourceClassSelected;
        }
        else {
            return false;
        }
    };
    /**
     * Initalizes the FormGroup for the resource class selection.
     * The initial value is set to null.
     * @return {?}
     */
    SelectResourceClassComponent.prototype.initForm = /**
     * Initalizes the FormGroup for the resource class selection.
     * The initial value is set to null.
     * @return {?}
     */
    function () {
        var _this = this;
        // build a form for the resource class selection
        this.form = this.fb.group({
            resourceClass: [null] // resource class selection is optional
        });
        // store and emit Iri of the resource class when selected
        this.form.valueChanges.subscribe(function (data) {
            _this.resourceClassSelected = data.resourceClass;
            _this.resourceClassSelectedEvent.emit(_this.resourceClassSelected);
        });
    };
    /**
     * @return {?}
     */
    SelectResourceClassComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.initForm();
        // add form to the parent form group
        this.formGroup.addControl('resourceClass', this.form);
    };
    /**
     * @return {?}
     */
    SelectResourceClassComponent.prototype.ngOnChanges = /**
     * @return {?}
     */
    function () {
        var _this = this;
        if (this.form !== undefined) {
            // resource classes have been reinitialized
            // reset form
            resolvedPromise.then(function () {
                // remove this form from the parent form group
                // remove this form from the parent form group
                _this.formGroup.removeControl('resourceClass');
                _this.initForm();
                // add form to the parent form group
                // add form to the parent form group
                _this.formGroup.addControl('resourceClass', _this.form);
            });
        }
    };
    SelectResourceClassComponent.decorators = [
        { type: Component, args: [{
                    selector: 'kui-select-resource-class',
                    template: "<mat-form-field *ngIf=\"resourceClasses.length > 0\">\n  <mat-select placeholder=\"Resource Class\" [formControl]=\"form.controls['resourceClass']\">\n    <mat-option [value]=\"null\">no selection</mat-option>\n    <!-- undo selection of a resource class -->\n    <mat-option *ngFor=\"let resourceClass of resourceClasses\" [value]=\"resourceClass.id\">{{ resourceClass.label }}</mat-option>\n  </mat-select>\n</mat-form-field>",
                    styles: [""]
                },] },
    ];
    /** @nocollapse */
    SelectResourceClassComponent.ctorParameters = function () { return [
        { type: FormBuilder, decorators: [{ type: Inject, args: [FormBuilder,] }] }
    ]; };
    SelectResourceClassComponent.propDecorators = {
        formGroup: [{ type: Input }],
        resourceClasses: [{ type: Input }],
        resourceClassSelectedEvent: [{ type: Output }]
    };
    return SelectResourceClassComponent;
}());
export { SelectResourceClassComponent };
if (false) {
    /** @type {?} */
    SelectResourceClassComponent.prototype.formGroup;
    /** @type {?} */
    SelectResourceClassComponent.prototype.resourceClassSelectedEvent;
    /** @type {?} */
    SelectResourceClassComponent.prototype._resourceClasses;
    /** @type {?} */
    SelectResourceClassComponent.prototype.resourceClassSelected;
    /** @type {?} */
    SelectResourceClassComponent.prototype.form;
    /** @type {?} */
    SelectResourceClassComponent.prototype.fb;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LXJlc291cmNlLWNsYXNzLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Brbm9yYS9zZWFyY2gvIiwic291cmNlcyI6WyJsaWIvZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1yZXNvdXJjZS1jbGFzcy9zZWxlY3QtcmVzb3VyY2UtY2xhc3MuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFxQixNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDbEcsT0FBTyxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQWMsTUFBTSxnQkFBZ0IsQ0FBQzs7QUFJcEUsSUFBTSxlQUFlLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQzs7SUF3QzFDLHNDQUF5QyxFQUFlO1FBQWYsT0FBRSxHQUFGLEVBQUUsQ0FBYTs7MENBVmpCLElBQUksWUFBWSxFQUFVO0tBV2hFO0lBdkJELHNCQUNJLHlEQUFlO1FBS25CLHdEQUF3RDs7OztRQUN4RDtZQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7U0FDaEM7UUFWRCw0RUFBNEU7Ozs7O1FBQzVFLFVBQ29CLEtBQTJCO1lBQzNDLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxTQUFTLENBQUM7WUFDdkMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEtBQUssQ0FBQztTQUNqQzs7O09BQUE7SUFxQkQ7Ozs7T0FJRzs7Ozs7O0lBQ0gsK0RBQXdCOzs7OztJQUF4QjtRQUNJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxxQkFBcUIsS0FBSyxTQUFTLElBQUksSUFBSSxDQUFDLHFCQUFxQixLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDbEYsTUFBTSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQztTQUNyQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osTUFBTSxDQUFDLEtBQUssQ0FBQztTQUNoQjtLQUNKOzs7Ozs7SUFNTywrQ0FBUTs7Ozs7Ozs7UUFFWixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDO1lBQ3RCLGFBQWEsRUFBRSxDQUFDLElBQUksQ0FBQztTQUN4QixDQUFDLENBQUM7O1FBR0gsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLFVBQUMsSUFBSTtZQUNsQyxLQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQztZQUNoRCxLQUFJLENBQUMsMEJBQTBCLENBQUMsSUFBSSxDQUFDLEtBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1NBQ3BFLENBQUMsQ0FBQzs7Ozs7SUFHUCwrQ0FBUTs7O0lBQVI7UUFFSSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7O1FBR2hCLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7S0FFekQ7Ozs7SUFFRCxrREFBVzs7O0lBQVg7UUFBQSxpQkFtQkM7UUFqQkcsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDOzs7WUFJMUIsZUFBZSxDQUFDLElBQUksQ0FBQzs7Z0JBR2pCLEFBREEsOENBQThDO2dCQUM5QyxLQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUMsQ0FBQztnQkFFOUMsS0FBSSxDQUFDLFFBQVEsRUFBRSxDQUFDOztnQkFHaEIsQUFEQSxvQ0FBb0M7Z0JBQ3BDLEtBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLGVBQWUsRUFBRSxLQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7YUFFekQsQ0FBQyxDQUFDO1NBRU47S0FDSjs7Z0JBbkdKLFNBQVMsU0FBQztvQkFDUCxRQUFRLEVBQUUsMkJBQTJCO29CQUNyQyxRQUFRLEVBQUUsNmFBTUk7b0JBQ2QsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDO2lCQUNmOzs7O2dCQWhCUSxXQUFXLHVCQTRDSCxNQUFNLFNBQUMsV0FBVzs7OzRCQXpCOUIsS0FBSztrQ0FHTCxLQUFLOzZDQVlMLE1BQU07O3VDQW5DWDs7U0FrQmEsNEJBQTRCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIEluamVjdCwgSW5wdXQsIE9uQ2hhbmdlcywgT25Jbml0LCBPdXRwdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEZvcm1CdWlsZGVyLCBGb3JtR3JvdXAsIFZhbGlkYXRvcnMgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBSZXNvdXJjZUNsYXNzIH0gZnJvbSAnQGtub3JhL2NvcmUnO1xuXG4vLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy80NTY2MTAxMC9keW5hbWljLW5lc3RlZC1yZWFjdGl2ZS1mb3JtLWV4cHJlc3Npb25jaGFuZ2VkYWZ0ZXJpdGhhc2JlZW5jaGVja2VkZXJyb3JcbmNvbnN0IHJlc29sdmVkUHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZShudWxsKTtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdrdWktc2VsZWN0LXJlc291cmNlLWNsYXNzJyxcbiAgICB0ZW1wbGF0ZTogYDxtYXQtZm9ybS1maWVsZCAqbmdJZj1cInJlc291cmNlQ2xhc3Nlcy5sZW5ndGggPiAwXCI+XG4gIDxtYXQtc2VsZWN0IHBsYWNlaG9sZGVyPVwiUmVzb3VyY2UgQ2xhc3NcIiBbZm9ybUNvbnRyb2xdPVwiZm9ybS5jb250cm9sc1sncmVzb3VyY2VDbGFzcyddXCI+XG4gICAgPG1hdC1vcHRpb24gW3ZhbHVlXT1cIm51bGxcIj5ubyBzZWxlY3Rpb248L21hdC1vcHRpb24+XG4gICAgPCEtLSB1bmRvIHNlbGVjdGlvbiBvZiBhIHJlc291cmNlIGNsYXNzIC0tPlxuICAgIDxtYXQtb3B0aW9uICpuZ0Zvcj1cImxldCByZXNvdXJjZUNsYXNzIG9mIHJlc291cmNlQ2xhc3Nlc1wiIFt2YWx1ZV09XCJyZXNvdXJjZUNsYXNzLmlkXCI+e3sgcmVzb3VyY2VDbGFzcy5sYWJlbCB9fTwvbWF0LW9wdGlvbj5cbiAgPC9tYXQtc2VsZWN0PlxuPC9tYXQtZm9ybS1maWVsZD5gLFxuICAgIHN0eWxlczogW2BgXVxufSlcbmV4cG9ydCBjbGFzcyBTZWxlY3RSZXNvdXJjZUNsYXNzQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMge1xuXG4gICAgQElucHV0KCkgZm9ybUdyb3VwOiBGb3JtR3JvdXA7XG5cbiAgICAvLyBzZXR0ZXIgbWV0aG9kIGZvciByZXNvdXJjZSBjbGFzc2VzIHdoZW4gYmVpbmcgdXBkYXRlZCBieSBwYXJlbnQgY29tcG9uZW50XG4gICAgQElucHV0KClcbiAgICBzZXQgcmVzb3VyY2VDbGFzc2VzKHZhbHVlOiBBcnJheTxSZXNvdXJjZUNsYXNzPikge1xuICAgICAgICB0aGlzLnJlc291cmNlQ2xhc3NTZWxlY3RlZCA9IHVuZGVmaW5lZDsgLy8gcmVzZXQgb24gdXBkYXRlc1xuICAgICAgICB0aGlzLl9yZXNvdXJjZUNsYXNzZXMgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICAvLyBnZXR0ZXIgbWV0aG9kIGZvciByZXNvdXJjZSBjbGFzc2VzICh1c2VkIGluIHRlbXBsYXRlKVxuICAgIGdldCByZXNvdXJjZUNsYXNzZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9yZXNvdXJjZUNsYXNzZXM7XG4gICAgfVxuXG4gICAgLy8gZXZlbnQgZW1pdHRlZCB0byBwYXJlbnQgY29tcG9uZW50IG9uY2UgYSByZXNvdXJjZSBjbGFzcyBpcyBzZWxlY3RlZCBieSB0aGUgdXNlclxuICAgIEBPdXRwdXQoKSByZXNvdXJjZUNsYXNzU2VsZWN0ZWRFdmVudCA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nPigpO1xuXG4gICAgLy8gYXZhaWxhYmxlIHJlc291cmNlIGNsYXNzZXMgZm9yIHNlbGVjdGlvblxuICAgIHByaXZhdGUgX3Jlc291cmNlQ2xhc3NlczogQXJyYXk8UmVzb3VyY2VDbGFzcz47XG5cbiAgICAvLyBzdG9yZXMgdGhlIGN1cnJlbnRseSBzZWxlY3RlZCByZXNvdXJjZSBjbGFzc1xuICAgIHByaXZhdGUgcmVzb3VyY2VDbGFzc1NlbGVjdGVkOiBzdHJpbmc7XG5cbiAgICBmb3JtOiBGb3JtR3JvdXA7XG5cbiAgICBjb25zdHJ1Y3RvcihASW5qZWN0KEZvcm1CdWlsZGVyKSBwcml2YXRlIGZiOiBGb3JtQnVpbGRlcikge1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIElyaSBvZiB0aGUgc2VsZWN0ZWQgcmVzb3VyY2UgY2xhc3MuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB0aGUgSXJpIG9mIHRoZSBzZWxlY3RlZCByZXNvdXJjZSBjbGFzcyBvciBmYWxzZSBpbiBjYXNlIG5vIHJlc291cmNlIGNsYXNzIGlzIHNlbGVjdGVkLlxuICAgICAqL1xuICAgIGdldFJlc291cmNlQ2xhc3NTZWxlY3RlZCgpOiBhbnkge1xuICAgICAgICBpZiAodGhpcy5yZXNvdXJjZUNsYXNzU2VsZWN0ZWQgIT09IHVuZGVmaW5lZCAmJiB0aGlzLnJlc291cmNlQ2xhc3NTZWxlY3RlZCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VDbGFzc1NlbGVjdGVkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW5pdGFsaXplcyB0aGUgRm9ybUdyb3VwIGZvciB0aGUgcmVzb3VyY2UgY2xhc3Mgc2VsZWN0aW9uLlxuICAgICAqIFRoZSBpbml0aWFsIHZhbHVlIGlzIHNldCB0byBudWxsLlxuICAgICAqL1xuICAgIHByaXZhdGUgaW5pdEZvcm0oKSB7XG4gICAgICAgIC8vIGJ1aWxkIGEgZm9ybSBmb3IgdGhlIHJlc291cmNlIGNsYXNzIHNlbGVjdGlvblxuICAgICAgICB0aGlzLmZvcm0gPSB0aGlzLmZiLmdyb3VwKHtcbiAgICAgICAgICAgIHJlc291cmNlQ2xhc3M6IFtudWxsXSAvLyByZXNvdXJjZSBjbGFzcyBzZWxlY3Rpb24gaXMgb3B0aW9uYWxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gc3RvcmUgYW5kIGVtaXQgSXJpIG9mIHRoZSByZXNvdXJjZSBjbGFzcyB3aGVuIHNlbGVjdGVkXG4gICAgICAgIHRoaXMuZm9ybS52YWx1ZUNoYW5nZXMuc3Vic2NyaWJlKChkYXRhKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnJlc291cmNlQ2xhc3NTZWxlY3RlZCA9IGRhdGEucmVzb3VyY2VDbGFzcztcbiAgICAgICAgICAgIHRoaXMucmVzb3VyY2VDbGFzc1NlbGVjdGVkRXZlbnQuZW1pdCh0aGlzLnJlc291cmNlQ2xhc3NTZWxlY3RlZCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG5nT25Jbml0KCkge1xuXG4gICAgICAgIHRoaXMuaW5pdEZvcm0oKTtcblxuICAgICAgICAvLyBhZGQgZm9ybSB0byB0aGUgcGFyZW50IGZvcm0gZ3JvdXBcbiAgICAgICAgdGhpcy5mb3JtR3JvdXAuYWRkQ29udHJvbCgncmVzb3VyY2VDbGFzcycsIHRoaXMuZm9ybSk7XG5cbiAgICB9XG5cbiAgICBuZ09uQ2hhbmdlcygpIHtcblxuICAgICAgICBpZiAodGhpcy5mb3JtICE9PSB1bmRlZmluZWQpIHtcblxuICAgICAgICAgICAgLy8gcmVzb3VyY2UgY2xhc3NlcyBoYXZlIGJlZW4gcmVpbml0aWFsaXplZFxuICAgICAgICAgICAgLy8gcmVzZXQgZm9ybVxuICAgICAgICAgICAgcmVzb2x2ZWRQcm9taXNlLnRoZW4oKCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgLy8gcmVtb3ZlIHRoaXMgZm9ybSBmcm9tIHRoZSBwYXJlbnQgZm9ybSBncm91cFxuICAgICAgICAgICAgICAgIHRoaXMuZm9ybUdyb3VwLnJlbW92ZUNvbnRyb2woJ3Jlc291cmNlQ2xhc3MnKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuaW5pdEZvcm0oKTtcblxuICAgICAgICAgICAgICAgIC8vIGFkZCBmb3JtIHRvIHRoZSBwYXJlbnQgZm9ybSBncm91cFxuICAgICAgICAgICAgICAgIHRoaXMuZm9ybUdyb3VwLmFkZENvbnRyb2woJ3Jlc291cmNlQ2xhc3MnLCB0aGlzLmZvcm0pO1xuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG4gICAgfVxuXG59XG4iXX0=