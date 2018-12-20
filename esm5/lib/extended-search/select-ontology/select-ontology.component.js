import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
var SelectOntologyComponent = /** @class */ (function () {
    function SelectOntologyComponent(fb) {
        this.fb = fb;
        this.ontologySelected = new EventEmitter();
    }
    SelectOntologyComponent.prototype.ngOnInit = function () {
        var _this = this;
        // build a form for the named graph selection
        this.form = this.fb.group({
            ontology: [null, Validators.required]
        });
        // emit Iri of the ontology when being selected
        this.form.valueChanges.subscribe(function (data) {
            _this.ontologySelected.emit(data.ontology);
        });
        // add form to the parent form group
        this.formGroup.addControl('ontology', this.form);
    };
    SelectOntologyComponent.decorators = [
        { type: Component, args: [{
                    selector: 'kui-select-ontology',
                    template: "<mat-form-field *ngIf=\"ontologies.length > 0\">\n  <mat-select placeholder=\"Ontology\" [formControl]=\"form.controls['ontology']\">\n      <mat-option *ngFor=\"let onto of ontologies\" [value]=\"onto.id\">{{ onto.label }}</mat-option>\n  </mat-select>\n</mat-form-field>\n",
                    styles: [""]
                },] },
    ];
    /** @nocollapse */
    SelectOntologyComponent.ctorParameters = function () { return [
        { type: FormBuilder, decorators: [{ type: Inject, args: [FormBuilder,] }] }
    ]; };
    SelectOntologyComponent.propDecorators = {
        formGroup: [{ type: Input }],
        ontologies: [{ type: Input }],
        ontologySelected: [{ type: Output }]
    };
    return SelectOntologyComponent;
}());
export { SelectOntologyComponent };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LW9udG9sb2d5LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Brbm9yYS9zZWFyY2gvIiwic291cmNlcyI6WyJsaWIvZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1vbnRvbG9neS9zZWxlY3Qtb250b2xvZ3kuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQVUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRXZGLE9BQU8sRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRXBFO0lBb0JFLGlDQUF5QyxFQUFlO1FBQWYsT0FBRSxHQUFGLEVBQUUsQ0FBYTtRQUo5QyxxQkFBZ0IsR0FBRyxJQUFJLFlBQVksRUFBVSxDQUFDO0lBSUksQ0FBQztJQUU3RCwwQ0FBUSxHQUFSO1FBQUEsaUJBZUM7UUFiQyw2Q0FBNkM7UUFDN0MsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQztZQUN4QixRQUFRLEVBQUUsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLFFBQVEsQ0FBQztTQUN0QyxDQUFDLENBQUM7UUFFSCwrQ0FBK0M7UUFDL0MsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLFVBQUMsSUFBSTtZQUNwQyxLQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM1QyxDQUFDLENBQUMsQ0FBQztRQUVILG9DQUFvQztRQUNwQyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRW5ELENBQUM7O2dCQXJDRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLHFCQUFxQjtvQkFDL0IsUUFBUSxFQUFFLG9SQUtYO29CQUNDLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQztpQkFDYjs7OztnQkFYUSxXQUFXLHVCQXNCTCxNQUFNLFNBQUMsV0FBVzs7OzRCQVI5QixLQUFLOzZCQUVMLEtBQUs7bUNBRUwsTUFBTTs7SUF1QlQsOEJBQUM7Q0FBQSxBQXZDRCxJQXVDQztTQTdCWSx1QkFBdUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgSW5qZWN0LCBJbnB1dCwgT25Jbml0LCBPdXRwdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE9udG9sb2d5TWV0YWRhdGEgfSBmcm9tICdAa25vcmEvY29yZSc7XG5pbXBvcnQgeyBGb3JtQnVpbGRlciwgRm9ybUdyb3VwLCBWYWxpZGF0b3JzIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdrdWktc2VsZWN0LW9udG9sb2d5JyxcbiAgdGVtcGxhdGU6IGA8bWF0LWZvcm0tZmllbGQgKm5nSWY9XCJvbnRvbG9naWVzLmxlbmd0aCA+IDBcIj5cbiAgPG1hdC1zZWxlY3QgcGxhY2Vob2xkZXI9XCJPbnRvbG9neVwiIFtmb3JtQ29udHJvbF09XCJmb3JtLmNvbnRyb2xzWydvbnRvbG9neSddXCI+XG4gICAgICA8bWF0LW9wdGlvbiAqbmdGb3I9XCJsZXQgb250byBvZiBvbnRvbG9naWVzXCIgW3ZhbHVlXT1cIm9udG8uaWRcIj57eyBvbnRvLmxhYmVsIH19PC9tYXQtb3B0aW9uPlxuICA8L21hdC1zZWxlY3Q+XG48L21hdC1mb3JtLWZpZWxkPlxuYCxcbiAgc3R5bGVzOiBbYGBdXG59KVxuZXhwb3J0IGNsYXNzIFNlbGVjdE9udG9sb2d5Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcblxuICBASW5wdXQoKSBmb3JtR3JvdXA6IEZvcm1Hcm91cDtcblxuICBASW5wdXQoKSBvbnRvbG9naWVzOiBBcnJheTxPbnRvbG9neU1ldGFkYXRhPjtcblxuICBAT3V0cHV0KCkgb250b2xvZ3lTZWxlY3RlZCA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nPigpO1xuXG4gIGZvcm06IEZvcm1Hcm91cDtcblxuICBjb25zdHJ1Y3RvcihASW5qZWN0KEZvcm1CdWlsZGVyKSBwcml2YXRlIGZiOiBGb3JtQnVpbGRlcikgeyB9XG5cbiAgbmdPbkluaXQoKSB7XG5cbiAgICAvLyBidWlsZCBhIGZvcm0gZm9yIHRoZSBuYW1lZCBncmFwaCBzZWxlY3Rpb25cbiAgICB0aGlzLmZvcm0gPSB0aGlzLmZiLmdyb3VwKHtcbiAgICAgIG9udG9sb2d5OiBbbnVsbCwgVmFsaWRhdG9ycy5yZXF1aXJlZF1cbiAgICB9KTtcblxuICAgIC8vIGVtaXQgSXJpIG9mIHRoZSBvbnRvbG9neSB3aGVuIGJlaW5nIHNlbGVjdGVkXG4gICAgdGhpcy5mb3JtLnZhbHVlQ2hhbmdlcy5zdWJzY3JpYmUoKGRhdGEpID0+IHtcbiAgICAgIHRoaXMub250b2xvZ3lTZWxlY3RlZC5lbWl0KGRhdGEub250b2xvZ3kpO1xuICAgIH0pO1xuXG4gICAgLy8gYWRkIGZvcm0gdG8gdGhlIHBhcmVudCBmb3JtIGdyb3VwXG4gICAgdGhpcy5mb3JtR3JvdXAuYWRkQ29udHJvbCgnb250b2xvZ3knLCB0aGlzLmZvcm0pO1xuXG4gIH1cblxufVxuIl19