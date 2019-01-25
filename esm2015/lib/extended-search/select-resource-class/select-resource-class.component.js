import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
// https://stackoverflow.com/questions/45661010/dynamic-nested-reactive-form-expressionchangedafterithasbeencheckederror
const resolvedPromise = Promise.resolve(null);
export class SelectResourceClassComponent {
    constructor(fb) {
        this.fb = fb;
        // event emitted to parent component once a resource class is selected by the user
        this.resourceClassSelectedEvent = new EventEmitter();
    }
    // setter method for resource classes when being updated by parent component
    set resourceClasses(value) {
        this.resourceClassSelected = undefined; // reset on updates
        this._resourceClasses = value;
    }
    // getter method for resource classes (used in template)
    get resourceClasses() {
        return this._resourceClasses;
    }
    /**
     * Returns the Iri of the selected resource class.
     *
     * @returns the Iri of the selected resource class or false in case no resource class is selected.
     */
    getResourceClassSelected() {
        if (this.resourceClassSelected !== undefined && this.resourceClassSelected !== null) {
            return this.resourceClassSelected;
        }
        else {
            return false;
        }
    }
    /**
     * Initalizes the FormGroup for the resource class selection.
     * The initial value is set to null.
     */
    initForm() {
        // build a form for the resource class selection
        this.form = this.fb.group({
            resourceClass: [null] // resource class selection is optional
        });
        // store and emit Iri of the resource class when selected
        this.form.valueChanges.subscribe((data) => {
            this.resourceClassSelected = data.resourceClass;
            this.resourceClassSelectedEvent.emit(this.resourceClassSelected);
        });
    }
    ngOnInit() {
        this.initForm();
        // add form to the parent form group
        this.formGroup.addControl('resourceClass', this.form);
    }
    ngOnChanges() {
        if (this.form !== undefined) {
            // resource classes have been reinitialized
            // reset form
            resolvedPromise.then(() => {
                // remove this form from the parent form group
                this.formGroup.removeControl('resourceClass');
                this.initForm();
                // add form to the parent form group
                this.formGroup.addControl('resourceClass', this.form);
            });
        }
    }
}
SelectResourceClassComponent.decorators = [
    { type: Component, args: [{
                selector: 'kui-select-resource-class',
                template: `<mat-form-field *ngIf="resourceClasses.length > 0">
  <mat-select placeholder="Resource Class" [formControl]="form.controls['resourceClass']">
    <mat-option [value]="null">no selection</mat-option>
    <!-- undo selection of a resource class -->
    <mat-option *ngFor="let resourceClass of resourceClasses" [value]="resourceClass.id">{{ resourceClass.label }}</mat-option>
  </mat-select>
</mat-form-field>`,
                styles: [``]
            },] },
];
SelectResourceClassComponent.ctorParameters = () => [
    { type: FormBuilder, decorators: [{ type: Inject, args: [FormBuilder,] }] }
];
SelectResourceClassComponent.propDecorators = {
    formGroup: [{ type: Input }],
    resourceClasses: [{ type: Input }],
    resourceClassSelectedEvent: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LXJlc291cmNlLWNsYXNzLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Brbm9yYS9zZWFyY2gvIiwic291cmNlcyI6WyJsaWIvZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1yZXNvdXJjZS1jbGFzcy9zZWxlY3QtcmVzb3VyY2UtY2xhc3MuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQXFCLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNsRyxPQUFPLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBYyxNQUFNLGdCQUFnQixDQUFDO0FBR3BFLHdIQUF3SDtBQUN4SCxNQUFNLGVBQWUsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBYTlDLE1BQU07SUEyQkYsWUFBeUMsRUFBZTtRQUFmLE9BQUUsR0FBRixFQUFFLENBQWE7UUFYeEQsa0ZBQWtGO1FBQ3hFLCtCQUEwQixHQUFHLElBQUksWUFBWSxFQUFVLENBQUM7SUFXbEUsQ0FBQztJQXhCRCw0RUFBNEU7SUFDNUUsSUFDSSxlQUFlLENBQUMsS0FBMkI7UUFDM0MsSUFBSSxDQUFDLHFCQUFxQixHQUFHLFNBQVMsQ0FBQyxDQUFDLG1CQUFtQjtRQUMzRCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO0lBQ2xDLENBQUM7SUFFRCx3REFBd0Q7SUFDeEQsSUFBSSxlQUFlO1FBQ2YsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7SUFDakMsQ0FBQztJQWdCRDs7OztPQUlHO0lBQ0gsd0JBQXdCO1FBQ3BCLElBQUksSUFBSSxDQUFDLHFCQUFxQixLQUFLLFNBQVMsSUFBSSxJQUFJLENBQUMscUJBQXFCLEtBQUssSUFBSSxFQUFFO1lBQ2pGLE9BQU8sSUFBSSxDQUFDLHFCQUFxQixDQUFDO1NBQ3JDO2FBQU07WUFDSCxPQUFPLEtBQUssQ0FBQztTQUNoQjtJQUNMLENBQUM7SUFFRDs7O09BR0c7SUFDSyxRQUFRO1FBQ1osZ0RBQWdEO1FBQ2hELElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUM7WUFDdEIsYUFBYSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsdUNBQXVDO1NBQ2hFLENBQUMsQ0FBQztRQUVILHlEQUF5RDtRQUN6RCxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUN0QyxJQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQztZQUNoRCxJQUFJLENBQUMsMEJBQTBCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1FBQ3JFLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELFFBQVE7UUFFSixJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFFaEIsb0NBQW9DO1FBQ3BDLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFMUQsQ0FBQztJQUVELFdBQVc7UUFFUCxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssU0FBUyxFQUFFO1lBRXpCLDJDQUEyQztZQUMzQyxhQUFhO1lBQ2IsZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUU7Z0JBRXRCLDhDQUE4QztnQkFDOUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLENBQUM7Z0JBRTlDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFFaEIsb0NBQW9DO2dCQUNwQyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRTFELENBQUMsQ0FBQyxDQUFDO1NBRU47SUFDTCxDQUFDOzs7WUFuR0osU0FBUyxTQUFDO2dCQUNQLFFBQVEsRUFBRSwyQkFBMkI7Z0JBQ3JDLFFBQVEsRUFBRTs7Ozs7O2tCQU1JO2dCQUNkLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQzthQUNmOzs7WUFoQlEsV0FBVyx1QkE0Q0gsTUFBTSxTQUFDLFdBQVc7Ozt3QkF6QjlCLEtBQUs7OEJBR0wsS0FBSzt5Q0FZTCxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIEluamVjdCwgSW5wdXQsIE9uQ2hhbmdlcywgT25Jbml0LCBPdXRwdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEZvcm1CdWlsZGVyLCBGb3JtR3JvdXAsIFZhbGlkYXRvcnMgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBSZXNvdXJjZUNsYXNzIH0gZnJvbSAnQGtub3JhL2NvcmUnO1xuXG4vLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy80NTY2MTAxMC9keW5hbWljLW5lc3RlZC1yZWFjdGl2ZS1mb3JtLWV4cHJlc3Npb25jaGFuZ2VkYWZ0ZXJpdGhhc2JlZW5jaGVja2VkZXJyb3JcbmNvbnN0IHJlc29sdmVkUHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZShudWxsKTtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdrdWktc2VsZWN0LXJlc291cmNlLWNsYXNzJyxcbiAgICB0ZW1wbGF0ZTogYDxtYXQtZm9ybS1maWVsZCAqbmdJZj1cInJlc291cmNlQ2xhc3Nlcy5sZW5ndGggPiAwXCI+XG4gIDxtYXQtc2VsZWN0IHBsYWNlaG9sZGVyPVwiUmVzb3VyY2UgQ2xhc3NcIiBbZm9ybUNvbnRyb2xdPVwiZm9ybS5jb250cm9sc1sncmVzb3VyY2VDbGFzcyddXCI+XG4gICAgPG1hdC1vcHRpb24gW3ZhbHVlXT1cIm51bGxcIj5ubyBzZWxlY3Rpb248L21hdC1vcHRpb24+XG4gICAgPCEtLSB1bmRvIHNlbGVjdGlvbiBvZiBhIHJlc291cmNlIGNsYXNzIC0tPlxuICAgIDxtYXQtb3B0aW9uICpuZ0Zvcj1cImxldCByZXNvdXJjZUNsYXNzIG9mIHJlc291cmNlQ2xhc3Nlc1wiIFt2YWx1ZV09XCJyZXNvdXJjZUNsYXNzLmlkXCI+e3sgcmVzb3VyY2VDbGFzcy5sYWJlbCB9fTwvbWF0LW9wdGlvbj5cbiAgPC9tYXQtc2VsZWN0PlxuPC9tYXQtZm9ybS1maWVsZD5gLFxuICAgIHN0eWxlczogW2BgXVxufSlcbmV4cG9ydCBjbGFzcyBTZWxlY3RSZXNvdXJjZUNsYXNzQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMge1xuXG4gICAgQElucHV0KCkgZm9ybUdyb3VwOiBGb3JtR3JvdXA7XG5cbiAgICAvLyBzZXR0ZXIgbWV0aG9kIGZvciByZXNvdXJjZSBjbGFzc2VzIHdoZW4gYmVpbmcgdXBkYXRlZCBieSBwYXJlbnQgY29tcG9uZW50XG4gICAgQElucHV0KClcbiAgICBzZXQgcmVzb3VyY2VDbGFzc2VzKHZhbHVlOiBBcnJheTxSZXNvdXJjZUNsYXNzPikge1xuICAgICAgICB0aGlzLnJlc291cmNlQ2xhc3NTZWxlY3RlZCA9IHVuZGVmaW5lZDsgLy8gcmVzZXQgb24gdXBkYXRlc1xuICAgICAgICB0aGlzLl9yZXNvdXJjZUNsYXNzZXMgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICAvLyBnZXR0ZXIgbWV0aG9kIGZvciByZXNvdXJjZSBjbGFzc2VzICh1c2VkIGluIHRlbXBsYXRlKVxuICAgIGdldCByZXNvdXJjZUNsYXNzZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9yZXNvdXJjZUNsYXNzZXM7XG4gICAgfVxuXG4gICAgLy8gZXZlbnQgZW1pdHRlZCB0byBwYXJlbnQgY29tcG9uZW50IG9uY2UgYSByZXNvdXJjZSBjbGFzcyBpcyBzZWxlY3RlZCBieSB0aGUgdXNlclxuICAgIEBPdXRwdXQoKSByZXNvdXJjZUNsYXNzU2VsZWN0ZWRFdmVudCA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nPigpO1xuXG4gICAgLy8gYXZhaWxhYmxlIHJlc291cmNlIGNsYXNzZXMgZm9yIHNlbGVjdGlvblxuICAgIHByaXZhdGUgX3Jlc291cmNlQ2xhc3NlczogQXJyYXk8UmVzb3VyY2VDbGFzcz47XG5cbiAgICAvLyBzdG9yZXMgdGhlIGN1cnJlbnRseSBzZWxlY3RlZCByZXNvdXJjZSBjbGFzc1xuICAgIHByaXZhdGUgcmVzb3VyY2VDbGFzc1NlbGVjdGVkOiBzdHJpbmc7XG5cbiAgICBmb3JtOiBGb3JtR3JvdXA7XG5cbiAgICBjb25zdHJ1Y3RvcihASW5qZWN0KEZvcm1CdWlsZGVyKSBwcml2YXRlIGZiOiBGb3JtQnVpbGRlcikge1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIElyaSBvZiB0aGUgc2VsZWN0ZWQgcmVzb3VyY2UgY2xhc3MuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB0aGUgSXJpIG9mIHRoZSBzZWxlY3RlZCByZXNvdXJjZSBjbGFzcyBvciBmYWxzZSBpbiBjYXNlIG5vIHJlc291cmNlIGNsYXNzIGlzIHNlbGVjdGVkLlxuICAgICAqL1xuICAgIGdldFJlc291cmNlQ2xhc3NTZWxlY3RlZCgpOiBhbnkge1xuICAgICAgICBpZiAodGhpcy5yZXNvdXJjZUNsYXNzU2VsZWN0ZWQgIT09IHVuZGVmaW5lZCAmJiB0aGlzLnJlc291cmNlQ2xhc3NTZWxlY3RlZCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VDbGFzc1NlbGVjdGVkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW5pdGFsaXplcyB0aGUgRm9ybUdyb3VwIGZvciB0aGUgcmVzb3VyY2UgY2xhc3Mgc2VsZWN0aW9uLlxuICAgICAqIFRoZSBpbml0aWFsIHZhbHVlIGlzIHNldCB0byBudWxsLlxuICAgICAqL1xuICAgIHByaXZhdGUgaW5pdEZvcm0oKSB7XG4gICAgICAgIC8vIGJ1aWxkIGEgZm9ybSBmb3IgdGhlIHJlc291cmNlIGNsYXNzIHNlbGVjdGlvblxuICAgICAgICB0aGlzLmZvcm0gPSB0aGlzLmZiLmdyb3VwKHtcbiAgICAgICAgICAgIHJlc291cmNlQ2xhc3M6IFtudWxsXSAvLyByZXNvdXJjZSBjbGFzcyBzZWxlY3Rpb24gaXMgb3B0aW9uYWxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gc3RvcmUgYW5kIGVtaXQgSXJpIG9mIHRoZSByZXNvdXJjZSBjbGFzcyB3aGVuIHNlbGVjdGVkXG4gICAgICAgIHRoaXMuZm9ybS52YWx1ZUNoYW5nZXMuc3Vic2NyaWJlKChkYXRhKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnJlc291cmNlQ2xhc3NTZWxlY3RlZCA9IGRhdGEucmVzb3VyY2VDbGFzcztcbiAgICAgICAgICAgIHRoaXMucmVzb3VyY2VDbGFzc1NlbGVjdGVkRXZlbnQuZW1pdCh0aGlzLnJlc291cmNlQ2xhc3NTZWxlY3RlZCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG5nT25Jbml0KCkge1xuXG4gICAgICAgIHRoaXMuaW5pdEZvcm0oKTtcblxuICAgICAgICAvLyBhZGQgZm9ybSB0byB0aGUgcGFyZW50IGZvcm0gZ3JvdXBcbiAgICAgICAgdGhpcy5mb3JtR3JvdXAuYWRkQ29udHJvbCgncmVzb3VyY2VDbGFzcycsIHRoaXMuZm9ybSk7XG5cbiAgICB9XG5cbiAgICBuZ09uQ2hhbmdlcygpIHtcblxuICAgICAgICBpZiAodGhpcy5mb3JtICE9PSB1bmRlZmluZWQpIHtcblxuICAgICAgICAgICAgLy8gcmVzb3VyY2UgY2xhc3NlcyBoYXZlIGJlZW4gcmVpbml0aWFsaXplZFxuICAgICAgICAgICAgLy8gcmVzZXQgZm9ybVxuICAgICAgICAgICAgcmVzb2x2ZWRQcm9taXNlLnRoZW4oKCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgLy8gcmVtb3ZlIHRoaXMgZm9ybSBmcm9tIHRoZSBwYXJlbnQgZm9ybSBncm91cFxuICAgICAgICAgICAgICAgIHRoaXMuZm9ybUdyb3VwLnJlbW92ZUNvbnRyb2woJ3Jlc291cmNlQ2xhc3MnKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuaW5pdEZvcm0oKTtcblxuICAgICAgICAgICAgICAgIC8vIGFkZCBmb3JtIHRvIHRoZSBwYXJlbnQgZm9ybSBncm91cFxuICAgICAgICAgICAgICAgIHRoaXMuZm9ybUdyb3VwLmFkZENvbnRyb2woJ3Jlc291cmNlQ2xhc3MnLCB0aGlzLmZvcm0pO1xuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG4gICAgfVxuXG59XG4iXX0=