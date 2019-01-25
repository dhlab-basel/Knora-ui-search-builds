import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
export class SelectOntologyComponent {
    constructor(fb) {
        this.fb = fb;
        this.ontologySelected = new EventEmitter();
    }
    ngOnInit() {
        // build a form for the named graph selection
        this.form = this.fb.group({
            ontology: [null, Validators.required]
        });
        // emit Iri of the ontology when being selected
        this.form.valueChanges.subscribe((data) => {
            this.ontologySelected.emit(data.ontology);
        });
        // add form to the parent form group
        this.formGroup.addControl('ontology', this.form);
    }
}
SelectOntologyComponent.decorators = [
    { type: Component, args: [{
                selector: 'kui-select-ontology',
                template: `<mat-form-field *ngIf="ontologies.length > 0">
  <mat-select placeholder="Ontology" [formControl]="form.controls['ontology']">
      <mat-option *ngFor="let onto of ontologies" [value]="onto.id">{{ onto.label }}</mat-option>
  </mat-select>
</mat-form-field>
`,
                styles: [``]
            },] },
];
SelectOntologyComponent.ctorParameters = () => [
    { type: FormBuilder, decorators: [{ type: Inject, args: [FormBuilder,] }] }
];
SelectOntologyComponent.propDecorators = {
    formGroup: [{ type: Input }],
    ontologies: [{ type: Input }],
    ontologySelected: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LW9udG9sb2d5LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Brbm9yYS9zZWFyY2gvIiwic291cmNlcyI6WyJsaWIvZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1vbnRvbG9neS9zZWxlY3Qtb250b2xvZ3kuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQVUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRXZGLE9BQU8sRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBWXBFLE1BQU07SUFVSixZQUF5QyxFQUFlO1FBQWYsT0FBRSxHQUFGLEVBQUUsQ0FBYTtRQUo5QyxxQkFBZ0IsR0FBRyxJQUFJLFlBQVksRUFBVSxDQUFDO0lBSUksQ0FBQztJQUU3RCxRQUFRO1FBRU4sNkNBQTZDO1FBQzdDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUM7WUFDeEIsUUFBUSxFQUFFLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxRQUFRLENBQUM7U0FDdEMsQ0FBQyxDQUFDO1FBRUgsK0NBQStDO1FBQy9DLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO1lBQ3hDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzVDLENBQUMsQ0FBQyxDQUFDO1FBRUgsb0NBQW9DO1FBQ3BDLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFbkQsQ0FBQzs7O1lBckNGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUscUJBQXFCO2dCQUMvQixRQUFRLEVBQUU7Ozs7O0NBS1g7Z0JBQ0MsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDO2FBQ2I7OztZQVhRLFdBQVcsdUJBc0JMLE1BQU0sU0FBQyxXQUFXOzs7d0JBUjlCLEtBQUs7eUJBRUwsS0FBSzsrQkFFTCxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIEluamVjdCwgSW5wdXQsIE9uSW5pdCwgT3V0cHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPbnRvbG9neU1ldGFkYXRhIH0gZnJvbSAnQGtub3JhL2NvcmUnO1xuaW1wb3J0IHsgRm9ybUJ1aWxkZXIsIEZvcm1Hcm91cCwgVmFsaWRhdG9ycyB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAna3VpLXNlbGVjdC1vbnRvbG9neScsXG4gIHRlbXBsYXRlOiBgPG1hdC1mb3JtLWZpZWxkICpuZ0lmPVwib250b2xvZ2llcy5sZW5ndGggPiAwXCI+XG4gIDxtYXQtc2VsZWN0IHBsYWNlaG9sZGVyPVwiT250b2xvZ3lcIiBbZm9ybUNvbnRyb2xdPVwiZm9ybS5jb250cm9sc1snb250b2xvZ3knXVwiPlxuICAgICAgPG1hdC1vcHRpb24gKm5nRm9yPVwibGV0IG9udG8gb2Ygb250b2xvZ2llc1wiIFt2YWx1ZV09XCJvbnRvLmlkXCI+e3sgb250by5sYWJlbCB9fTwvbWF0LW9wdGlvbj5cbiAgPC9tYXQtc2VsZWN0PlxuPC9tYXQtZm9ybS1maWVsZD5cbmAsXG4gIHN0eWxlczogW2BgXVxufSlcbmV4cG9ydCBjbGFzcyBTZWxlY3RPbnRvbG9neUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgQElucHV0KCkgZm9ybUdyb3VwOiBGb3JtR3JvdXA7XG5cbiAgQElucHV0KCkgb250b2xvZ2llczogQXJyYXk8T250b2xvZ3lNZXRhZGF0YT47XG5cbiAgQE91dHB1dCgpIG9udG9sb2d5U2VsZWN0ZWQgPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oKTtcblxuICBmb3JtOiBGb3JtR3JvdXA7XG5cbiAgY29uc3RydWN0b3IoQEluamVjdChGb3JtQnVpbGRlcikgcHJpdmF0ZSBmYjogRm9ybUJ1aWxkZXIpIHsgfVxuXG4gIG5nT25Jbml0KCkge1xuXG4gICAgLy8gYnVpbGQgYSBmb3JtIGZvciB0aGUgbmFtZWQgZ3JhcGggc2VsZWN0aW9uXG4gICAgdGhpcy5mb3JtID0gdGhpcy5mYi5ncm91cCh7XG4gICAgICBvbnRvbG9neTogW251bGwsIFZhbGlkYXRvcnMucmVxdWlyZWRdXG4gICAgfSk7XG5cbiAgICAvLyBlbWl0IElyaSBvZiB0aGUgb250b2xvZ3kgd2hlbiBiZWluZyBzZWxlY3RlZFxuICAgIHRoaXMuZm9ybS52YWx1ZUNoYW5nZXMuc3Vic2NyaWJlKChkYXRhKSA9PiB7XG4gICAgICB0aGlzLm9udG9sb2d5U2VsZWN0ZWQuZW1pdChkYXRhLm9udG9sb2d5KTtcbiAgICB9KTtcblxuICAgIC8vIGFkZCBmb3JtIHRvIHRoZSBwYXJlbnQgZm9ybSBncm91cFxuICAgIHRoaXMuZm9ybUdyb3VwLmFkZENvbnRyb2woJ29udG9sb2d5JywgdGhpcy5mb3JtKTtcblxuICB9XG5cbn1cbiJdfQ==