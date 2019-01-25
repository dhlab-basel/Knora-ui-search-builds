import { Component, Inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { KnoraConstants, ValueLiteral } from '@knora/core';
// https://stackoverflow.com/questions/45661010/dynamic-nested-reactive-form-expressionchangedafterithasbeencheckederror
const resolvedPromise = Promise.resolve(null);
export class IntegerValueComponent {
    constructor(fb) {
        this.fb = fb;
        this.type = KnoraConstants.IntValue;
    }
    ngOnInit() {
        this.form = this.fb.group({
            integerValue: [null, Validators.compose([Validators.required, Validators.pattern(/^-?\d+$/)])] // only allow for integer values (no fractions)
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
        return new ValueLiteral(String(this.form.value.integerValue), KnoraConstants.xsdInteger);
    }
}
IntegerValueComponent.decorators = [
    { type: Component, args: [{
                selector: 'integer-value',
                template: `<mat-form-field>
    <input matInput [formControl]="form.controls['integerValue']" placeholder="Integer value" value="" type="number">
</mat-form-field>
`,
                styles: [``]
            },] },
];
IntegerValueComponent.ctorParameters = () => [
    { type: FormBuilder, decorators: [{ type: Inject, args: [FormBuilder,] }] }
];
IntegerValueComponent.propDecorators = {
    formGroup: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWdlci12YWx1ZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Aa25vcmEvc2VhcmNoLyIsInNvdXJjZXMiOlsibGliL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3QtcHJvcGVydHkvc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZS9pbnRlZ2VyLXZhbHVlL2ludGVnZXItdmFsdWUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBcUIsTUFBTSxlQUFlLENBQUM7QUFDNUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDcEUsT0FBTyxFQUFFLGNBQWMsRUFBd0IsWUFBWSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBRWpGLHdIQUF3SDtBQUN4SCxNQUFNLGVBQWUsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBVTlDLE1BQU07SUFTRixZQUF5QyxFQUFlO1FBQWYsT0FBRSxHQUFGLEVBQUUsQ0FBYTtRQUp4RCxTQUFJLEdBQUcsY0FBYyxDQUFDLFFBQVEsQ0FBQztJQU0vQixDQUFDO0lBRUQsUUFBUTtRQUVKLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUM7WUFDdEIsWUFBWSxFQUFFLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsK0NBQStDO1NBQ2pKLENBQUMsQ0FBQztRQUVILGVBQWUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFO1lBQ3RCLG9DQUFvQztZQUNwQyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3RELENBQUMsQ0FBQyxDQUFDO0lBRVAsQ0FBQztJQUVELFdBQVc7UUFFUCx5Q0FBeUM7UUFDekMsZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDdEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDOUMsQ0FBQyxDQUFDLENBQUM7SUFFUCxDQUFDO0lBRUQsUUFBUTtRQUVKLE9BQU8sSUFBSSxZQUFZLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxFQUFFLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUM3RixDQUFDOzs7WUE5Q0osU0FBUyxTQUFDO2dCQUNQLFFBQVEsRUFBRSxlQUFlO2dCQUN6QixRQUFRLEVBQUU7OztDQUdiO2dCQUNHLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQzthQUNmOzs7WUFiUSxXQUFXLHVCQXVCSCxNQUFNLFNBQUMsV0FBVzs7O3dCQU45QixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbmplY3QsIElucHV0LCBPbkRlc3Ryb3ksIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRm9ybUJ1aWxkZXIsIEZvcm1Hcm91cCwgVmFsaWRhdG9ycyB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IEtub3JhQ29uc3RhbnRzLCBQcm9wZXJ0eVZhbHVlLCBWYWx1ZSwgVmFsdWVMaXRlcmFsIH0gZnJvbSAnQGtub3JhL2NvcmUnO1xuXG4vLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy80NTY2MTAxMC9keW5hbWljLW5lc3RlZC1yZWFjdGl2ZS1mb3JtLWV4cHJlc3Npb25jaGFuZ2VkYWZ0ZXJpdGhhc2JlZW5jaGVja2VkZXJyb3JcbmNvbnN0IHJlc29sdmVkUHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZShudWxsKTtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdpbnRlZ2VyLXZhbHVlJyxcbiAgICB0ZW1wbGF0ZTogYDxtYXQtZm9ybS1maWVsZD5cbiAgICA8aW5wdXQgbWF0SW5wdXQgW2Zvcm1Db250cm9sXT1cImZvcm0uY29udHJvbHNbJ2ludGVnZXJWYWx1ZSddXCIgcGxhY2Vob2xkZXI9XCJJbnRlZ2VyIHZhbHVlXCIgdmFsdWU9XCJcIiB0eXBlPVwibnVtYmVyXCI+XG48L21hdC1mb3JtLWZpZWxkPlxuYCxcbiAgICBzdHlsZXM6IFtgYF1cbn0pXG5leHBvcnQgY2xhc3MgSW50ZWdlclZhbHVlQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3ksIFByb3BlcnR5VmFsdWUge1xuXG4gICAgLy8gcGFyZW50IEZvcm1Hcm91cFxuICAgIEBJbnB1dCgpIGZvcm1Hcm91cDogRm9ybUdyb3VwO1xuXG4gICAgdHlwZSA9IEtub3JhQ29uc3RhbnRzLkludFZhbHVlO1xuXG4gICAgZm9ybTogRm9ybUdyb3VwO1xuXG4gICAgY29uc3RydWN0b3IoQEluamVjdChGb3JtQnVpbGRlcikgcHJpdmF0ZSBmYjogRm9ybUJ1aWxkZXIpIHtcblxuICAgIH1cblxuICAgIG5nT25Jbml0KCkge1xuXG4gICAgICAgIHRoaXMuZm9ybSA9IHRoaXMuZmIuZ3JvdXAoe1xuICAgICAgICAgICAgaW50ZWdlclZhbHVlOiBbbnVsbCwgVmFsaWRhdG9ycy5jb21wb3NlKFtWYWxpZGF0b3JzLnJlcXVpcmVkLCBWYWxpZGF0b3JzLnBhdHRlcm4oL14tP1xcZCskLyldKV0gLy8gb25seSBhbGxvdyBmb3IgaW50ZWdlciB2YWx1ZXMgKG5vIGZyYWN0aW9ucylcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmVzb2x2ZWRQcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgLy8gYWRkIGZvcm0gdG8gdGhlIHBhcmVudCBmb3JtIGdyb3VwXG4gICAgICAgICAgICB0aGlzLmZvcm1Hcm91cC5hZGRDb250cm9sKCdwcm9wVmFsdWUnLCB0aGlzLmZvcm0pO1xuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCkge1xuXG4gICAgICAgIC8vIHJlbW92ZSBmb3JtIGZyb20gdGhlIHBhcmVudCBmb3JtIGdyb3VwXG4gICAgICAgIHJlc29sdmVkUHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZm9ybUdyb3VwLnJlbW92ZUNvbnRyb2woJ3Byb3BWYWx1ZScpO1xuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIGdldFZhbHVlKCk6IFZhbHVlIHtcblxuICAgICAgICByZXR1cm4gbmV3IFZhbHVlTGl0ZXJhbChTdHJpbmcodGhpcy5mb3JtLnZhbHVlLmludGVnZXJWYWx1ZSksIEtub3JhQ29uc3RhbnRzLnhzZEludGVnZXIpO1xuICAgIH1cblxufVxuIl19