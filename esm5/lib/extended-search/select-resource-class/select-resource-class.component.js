import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
// https://stackoverflow.com/questions/45661010/dynamic-nested-reactive-form-expressionchangedafterithasbeencheckederror
var resolvedPromise = Promise.resolve(null);
var SelectResourceClassComponent = /** @class */ (function () {
    function SelectResourceClassComponent(fb) {
        this.fb = fb;
        // event emitted to parent component once a resource class is selected by the user
        this.resourceClassSelectedEvent = new EventEmitter();
    }
    Object.defineProperty(SelectResourceClassComponent.prototype, "resourceClasses", {
        // getter method for resource classes (used in template)
        get: function () {
            return this._resourceClasses;
        },
        // setter method for resource classes when being updated by parent component
        set: function (value) {
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
    SelectResourceClassComponent.prototype.getResourceClassSelected = function () {
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
     */
    SelectResourceClassComponent.prototype.initForm = function () {
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
    SelectResourceClassComponent.prototype.ngOnInit = function () {
        this.initForm();
        // add form to the parent form group
        this.formGroup.addControl('resourceClass', this.form);
    };
    SelectResourceClassComponent.prototype.ngOnChanges = function () {
        var _this = this;
        if (this.form !== undefined) {
            // resource classes have been reinitialized
            // reset form
            resolvedPromise.then(function () {
                // remove this form from the parent form group
                _this.formGroup.removeControl('resourceClass');
                _this.initForm();
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LXJlc291cmNlLWNsYXNzLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Brbm9yYS9zZWFyY2gvIiwic291cmNlcyI6WyJsaWIvZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1yZXNvdXJjZS1jbGFzcy9zZWxlY3QtcmVzb3VyY2UtY2xhc3MuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQXFCLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNsRyxPQUFPLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBYyxNQUFNLGdCQUFnQixDQUFDO0FBR3BFLHdIQUF3SDtBQUN4SCxJQUFNLGVBQWUsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBRTlDO0lBc0NJLHNDQUF5QyxFQUFlO1FBQWYsT0FBRSxHQUFGLEVBQUUsQ0FBYTtRQVh4RCxrRkFBa0Y7UUFDeEUsK0JBQTBCLEdBQUcsSUFBSSxZQUFZLEVBQVUsQ0FBQztJQVdsRSxDQUFDO0lBdkJELHNCQUNJLHlEQUFlO1FBS25CLHdEQUF3RDthQUN4RDtZQUNJLE9BQU8sSUFBSSxDQUFDLGdCQUFnQixDQUFDO1FBQ2pDLENBQUM7UUFWRCw0RUFBNEU7YUFDNUUsVUFDb0IsS0FBMkI7WUFDM0MsSUFBSSxDQUFDLHFCQUFxQixHQUFHLFNBQVMsQ0FBQyxDQUFDLG1CQUFtQjtZQUMzRCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO1FBQ2xDLENBQUM7OztPQUFBO0lBcUJEOzs7O09BSUc7SUFDSCwrREFBd0IsR0FBeEI7UUFDSSxJQUFJLElBQUksQ0FBQyxxQkFBcUIsS0FBSyxTQUFTLElBQUksSUFBSSxDQUFDLHFCQUFxQixLQUFLLElBQUksRUFBRTtZQUNqRixPQUFPLElBQUksQ0FBQyxxQkFBcUIsQ0FBQztTQUNyQzthQUFNO1lBQ0gsT0FBTyxLQUFLLENBQUM7U0FDaEI7SUFDTCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0ssK0NBQVEsR0FBaEI7UUFBQSxpQkFXQztRQVZHLGdEQUFnRDtRQUNoRCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDO1lBQ3RCLGFBQWEsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLHVDQUF1QztTQUNoRSxDQUFDLENBQUM7UUFFSCx5REFBeUQ7UUFDekQsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLFVBQUMsSUFBSTtZQUNsQyxLQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQztZQUNoRCxLQUFJLENBQUMsMEJBQTBCLENBQUMsSUFBSSxDQUFDLEtBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1FBQ3JFLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELCtDQUFRLEdBQVI7UUFFSSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFFaEIsb0NBQW9DO1FBQ3BDLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFMUQsQ0FBQztJQUVELGtEQUFXLEdBQVg7UUFBQSxpQkFtQkM7UUFqQkcsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLFNBQVMsRUFBRTtZQUV6QiwyQ0FBMkM7WUFDM0MsYUFBYTtZQUNiLGVBQWUsQ0FBQyxJQUFJLENBQUM7Z0JBRWpCLDhDQUE4QztnQkFDOUMsS0FBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLENBQUM7Z0JBRTlDLEtBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFFaEIsb0NBQW9DO2dCQUNwQyxLQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxlQUFlLEVBQUUsS0FBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRTFELENBQUMsQ0FBQyxDQUFDO1NBRU47SUFDTCxDQUFDOztnQkFuR0osU0FBUyxTQUFDO29CQUNQLFFBQVEsRUFBRSwyQkFBMkI7b0JBQ3JDLFFBQVEsRUFBRSw2YUFNSTtvQkFDZCxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUM7aUJBQ2Y7Ozs7Z0JBaEJRLFdBQVcsdUJBNENILE1BQU0sU0FBQyxXQUFXOzs7NEJBekI5QixLQUFLO2tDQUdMLEtBQUs7NkNBWUwsTUFBTTs7SUF5RVgsbUNBQUM7Q0FBQSxBQXJHRCxJQXFHQztTQTFGWSw0QkFBNEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgSW5qZWN0LCBJbnB1dCwgT25DaGFuZ2VzLCBPbkluaXQsIE91dHB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRm9ybUJ1aWxkZXIsIEZvcm1Hcm91cCwgVmFsaWRhdG9ycyB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IFJlc291cmNlQ2xhc3MgfSBmcm9tICdAa25vcmEvY29yZSc7XG5cbi8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzQ1NjYxMDEwL2R5bmFtaWMtbmVzdGVkLXJlYWN0aXZlLWZvcm0tZXhwcmVzc2lvbmNoYW5nZWRhZnRlcml0aGFzYmVlbmNoZWNrZWRlcnJvclxuY29uc3QgcmVzb2x2ZWRQcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKG51bGwpO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ2t1aS1zZWxlY3QtcmVzb3VyY2UtY2xhc3MnLFxuICAgIHRlbXBsYXRlOiBgPG1hdC1mb3JtLWZpZWxkICpuZ0lmPVwicmVzb3VyY2VDbGFzc2VzLmxlbmd0aCA+IDBcIj5cbiAgPG1hdC1zZWxlY3QgcGxhY2Vob2xkZXI9XCJSZXNvdXJjZSBDbGFzc1wiIFtmb3JtQ29udHJvbF09XCJmb3JtLmNvbnRyb2xzWydyZXNvdXJjZUNsYXNzJ11cIj5cbiAgICA8bWF0LW9wdGlvbiBbdmFsdWVdPVwibnVsbFwiPm5vIHNlbGVjdGlvbjwvbWF0LW9wdGlvbj5cbiAgICA8IS0tIHVuZG8gc2VsZWN0aW9uIG9mIGEgcmVzb3VyY2UgY2xhc3MgLS0+XG4gICAgPG1hdC1vcHRpb24gKm5nRm9yPVwibGV0IHJlc291cmNlQ2xhc3Mgb2YgcmVzb3VyY2VDbGFzc2VzXCIgW3ZhbHVlXT1cInJlc291cmNlQ2xhc3MuaWRcIj57eyByZXNvdXJjZUNsYXNzLmxhYmVsIH19PC9tYXQtb3B0aW9uPlxuICA8L21hdC1zZWxlY3Q+XG48L21hdC1mb3JtLWZpZWxkPmAsXG4gICAgc3R5bGVzOiBbYGBdXG59KVxuZXhwb3J0IGNsYXNzIFNlbGVjdFJlc291cmNlQ2xhc3NDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcyB7XG5cbiAgICBASW5wdXQoKSBmb3JtR3JvdXA6IEZvcm1Hcm91cDtcblxuICAgIC8vIHNldHRlciBtZXRob2QgZm9yIHJlc291cmNlIGNsYXNzZXMgd2hlbiBiZWluZyB1cGRhdGVkIGJ5IHBhcmVudCBjb21wb25lbnRcbiAgICBASW5wdXQoKVxuICAgIHNldCByZXNvdXJjZUNsYXNzZXModmFsdWU6IEFycmF5PFJlc291cmNlQ2xhc3M+KSB7XG4gICAgICAgIHRoaXMucmVzb3VyY2VDbGFzc1NlbGVjdGVkID0gdW5kZWZpbmVkOyAvLyByZXNldCBvbiB1cGRhdGVzXG4gICAgICAgIHRoaXMuX3Jlc291cmNlQ2xhc3NlcyA9IHZhbHVlO1xuICAgIH1cblxuICAgIC8vIGdldHRlciBtZXRob2QgZm9yIHJlc291cmNlIGNsYXNzZXMgKHVzZWQgaW4gdGVtcGxhdGUpXG4gICAgZ2V0IHJlc291cmNlQ2xhc3NlcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Jlc291cmNlQ2xhc3NlcztcbiAgICB9XG5cbiAgICAvLyBldmVudCBlbWl0dGVkIHRvIHBhcmVudCBjb21wb25lbnQgb25jZSBhIHJlc291cmNlIGNsYXNzIGlzIHNlbGVjdGVkIGJ5IHRoZSB1c2VyXG4gICAgQE91dHB1dCgpIHJlc291cmNlQ2xhc3NTZWxlY3RlZEV2ZW50ID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmc+KCk7XG5cbiAgICAvLyBhdmFpbGFibGUgcmVzb3VyY2UgY2xhc3NlcyBmb3Igc2VsZWN0aW9uXG4gICAgcHJpdmF0ZSBfcmVzb3VyY2VDbGFzc2VzOiBBcnJheTxSZXNvdXJjZUNsYXNzPjtcblxuICAgIC8vIHN0b3JlcyB0aGUgY3VycmVudGx5IHNlbGVjdGVkIHJlc291cmNlIGNsYXNzXG4gICAgcHJpdmF0ZSByZXNvdXJjZUNsYXNzU2VsZWN0ZWQ6IHN0cmluZztcblxuICAgIGZvcm06IEZvcm1Hcm91cDtcblxuICAgIGNvbnN0cnVjdG9yKEBJbmplY3QoRm9ybUJ1aWxkZXIpIHByaXZhdGUgZmI6IEZvcm1CdWlsZGVyKSB7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgSXJpIG9mIHRoZSBzZWxlY3RlZCByZXNvdXJjZSBjbGFzcy5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHRoZSBJcmkgb2YgdGhlIHNlbGVjdGVkIHJlc291cmNlIGNsYXNzIG9yIGZhbHNlIGluIGNhc2Ugbm8gcmVzb3VyY2UgY2xhc3MgaXMgc2VsZWN0ZWQuXG4gICAgICovXG4gICAgZ2V0UmVzb3VyY2VDbGFzc1NlbGVjdGVkKCk6IGFueSB7XG4gICAgICAgIGlmICh0aGlzLnJlc291cmNlQ2xhc3NTZWxlY3RlZCAhPT0gdW5kZWZpbmVkICYmIHRoaXMucmVzb3VyY2VDbGFzc1NlbGVjdGVkICE9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZUNsYXNzU2VsZWN0ZWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbml0YWxpemVzIHRoZSBGb3JtR3JvdXAgZm9yIHRoZSByZXNvdXJjZSBjbGFzcyBzZWxlY3Rpb24uXG4gICAgICogVGhlIGluaXRpYWwgdmFsdWUgaXMgc2V0IHRvIG51bGwuXG4gICAgICovXG4gICAgcHJpdmF0ZSBpbml0Rm9ybSgpIHtcbiAgICAgICAgLy8gYnVpbGQgYSBmb3JtIGZvciB0aGUgcmVzb3VyY2UgY2xhc3Mgc2VsZWN0aW9uXG4gICAgICAgIHRoaXMuZm9ybSA9IHRoaXMuZmIuZ3JvdXAoe1xuICAgICAgICAgICAgcmVzb3VyY2VDbGFzczogW251bGxdIC8vIHJlc291cmNlIGNsYXNzIHNlbGVjdGlvbiBpcyBvcHRpb25hbFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBzdG9yZSBhbmQgZW1pdCBJcmkgb2YgdGhlIHJlc291cmNlIGNsYXNzIHdoZW4gc2VsZWN0ZWRcbiAgICAgICAgdGhpcy5mb3JtLnZhbHVlQ2hhbmdlcy5zdWJzY3JpYmUoKGRhdGEpID0+IHtcbiAgICAgICAgICAgIHRoaXMucmVzb3VyY2VDbGFzc1NlbGVjdGVkID0gZGF0YS5yZXNvdXJjZUNsYXNzO1xuICAgICAgICAgICAgdGhpcy5yZXNvdXJjZUNsYXNzU2VsZWN0ZWRFdmVudC5lbWl0KHRoaXMucmVzb3VyY2VDbGFzc1NlbGVjdGVkKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKSB7XG5cbiAgICAgICAgdGhpcy5pbml0Rm9ybSgpO1xuXG4gICAgICAgIC8vIGFkZCBmb3JtIHRvIHRoZSBwYXJlbnQgZm9ybSBncm91cFxuICAgICAgICB0aGlzLmZvcm1Hcm91cC5hZGRDb250cm9sKCdyZXNvdXJjZUNsYXNzJywgdGhpcy5mb3JtKTtcblxuICAgIH1cblxuICAgIG5nT25DaGFuZ2VzKCkge1xuXG4gICAgICAgIGlmICh0aGlzLmZvcm0gIT09IHVuZGVmaW5lZCkge1xuXG4gICAgICAgICAgICAvLyByZXNvdXJjZSBjbGFzc2VzIGhhdmUgYmVlbiByZWluaXRpYWxpemVkXG4gICAgICAgICAgICAvLyByZXNldCBmb3JtXG4gICAgICAgICAgICByZXNvbHZlZFByb21pc2UudGhlbigoKSA9PiB7XG5cbiAgICAgICAgICAgICAgICAvLyByZW1vdmUgdGhpcyBmb3JtIGZyb20gdGhlIHBhcmVudCBmb3JtIGdyb3VwXG4gICAgICAgICAgICAgICAgdGhpcy5mb3JtR3JvdXAucmVtb3ZlQ29udHJvbCgncmVzb3VyY2VDbGFzcycpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5pbml0Rm9ybSgpO1xuXG4gICAgICAgICAgICAgICAgLy8gYWRkIGZvcm0gdG8gdGhlIHBhcmVudCBmb3JtIGdyb3VwXG4gICAgICAgICAgICAgICAgdGhpcy5mb3JtR3JvdXAuYWRkQ29udHJvbCgncmVzb3VyY2VDbGFzcycsIHRoaXMuZm9ybSk7XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cbiAgICB9XG5cbn1cbiJdfQ==