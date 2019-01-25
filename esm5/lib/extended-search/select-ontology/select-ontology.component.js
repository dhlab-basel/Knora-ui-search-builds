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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LW9udG9sb2d5LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Brbm9yYS9zZWFyY2gvIiwic291cmNlcyI6WyJsaWIvZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1vbnRvbG9neS9zZWxlY3Qtb250b2xvZ3kuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQVUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRXZGLE9BQU8sRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRXBFO0lBb0JFLGlDQUF5QyxFQUFlO1FBQWYsT0FBRSxHQUFGLEVBQUUsQ0FBYTtRQUo5QyxxQkFBZ0IsR0FBRyxJQUFJLFlBQVksRUFBVSxDQUFDO0lBSUksQ0FBQztJQUU3RCwwQ0FBUSxHQUFSO1FBQUEsaUJBZUM7UUFiQyw2Q0FBNkM7UUFDN0MsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQztZQUN4QixRQUFRLEVBQUUsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLFFBQVEsQ0FBQztTQUN0QyxDQUFDLENBQUM7UUFFSCwrQ0FBK0M7UUFDL0MsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLFVBQUMsSUFBSTtZQUNwQyxLQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM1QyxDQUFDLENBQUMsQ0FBQztRQUVILG9DQUFvQztRQUNwQyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRW5ELENBQUM7O2dCQXJDRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLHFCQUFxQjtvQkFDL0IsUUFBUSxFQUFFLG9SQUtYO29CQUNDLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQztpQkFDYjs7O2dCQVhRLFdBQVcsdUJBc0JMLE1BQU0sU0FBQyxXQUFXOzs7NEJBUjlCLEtBQUs7NkJBRUwsS0FBSzttQ0FFTCxNQUFNOztJQXVCVCw4QkFBQztDQUFBLEFBdkNELElBdUNDO1NBN0JZLHVCQUF1QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbmplY3QsIElucHV0LCBPbkluaXQsIE91dHB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgT250b2xvZ3lNZXRhZGF0YSB9IGZyb20gJ0Brbm9yYS9jb3JlJztcbmltcG9ydCB7IEZvcm1CdWlsZGVyLCBGb3JtR3JvdXAsIFZhbGlkYXRvcnMgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2t1aS1zZWxlY3Qtb250b2xvZ3knLFxuICB0ZW1wbGF0ZTogYDxtYXQtZm9ybS1maWVsZCAqbmdJZj1cIm9udG9sb2dpZXMubGVuZ3RoID4gMFwiPlxuICA8bWF0LXNlbGVjdCBwbGFjZWhvbGRlcj1cIk9udG9sb2d5XCIgW2Zvcm1Db250cm9sXT1cImZvcm0uY29udHJvbHNbJ29udG9sb2d5J11cIj5cbiAgICAgIDxtYXQtb3B0aW9uICpuZ0Zvcj1cImxldCBvbnRvIG9mIG9udG9sb2dpZXNcIiBbdmFsdWVdPVwib250by5pZFwiPnt7IG9udG8ubGFiZWwgfX08L21hdC1vcHRpb24+XG4gIDwvbWF0LXNlbGVjdD5cbjwvbWF0LWZvcm0tZmllbGQ+XG5gLFxuICBzdHlsZXM6IFtgYF1cbn0pXG5leHBvcnQgY2xhc3MgU2VsZWN0T250b2xvZ3lDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gIEBJbnB1dCgpIGZvcm1Hcm91cDogRm9ybUdyb3VwO1xuXG4gIEBJbnB1dCgpIG9udG9sb2dpZXM6IEFycmF5PE9udG9sb2d5TWV0YWRhdGE+O1xuXG4gIEBPdXRwdXQoKSBvbnRvbG9neVNlbGVjdGVkID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmc+KCk7XG5cbiAgZm9ybTogRm9ybUdyb3VwO1xuXG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoRm9ybUJ1aWxkZXIpIHByaXZhdGUgZmI6IEZvcm1CdWlsZGVyKSB7IH1cblxuICBuZ09uSW5pdCgpIHtcblxuICAgIC8vIGJ1aWxkIGEgZm9ybSBmb3IgdGhlIG5hbWVkIGdyYXBoIHNlbGVjdGlvblxuICAgIHRoaXMuZm9ybSA9IHRoaXMuZmIuZ3JvdXAoe1xuICAgICAgb250b2xvZ3k6IFtudWxsLCBWYWxpZGF0b3JzLnJlcXVpcmVkXVxuICAgIH0pO1xuXG4gICAgLy8gZW1pdCBJcmkgb2YgdGhlIG9udG9sb2d5IHdoZW4gYmVpbmcgc2VsZWN0ZWRcbiAgICB0aGlzLmZvcm0udmFsdWVDaGFuZ2VzLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xuICAgICAgdGhpcy5vbnRvbG9neVNlbGVjdGVkLmVtaXQoZGF0YS5vbnRvbG9neSk7XG4gICAgfSk7XG5cbiAgICAvLyBhZGQgZm9ybSB0byB0aGUgcGFyZW50IGZvcm0gZ3JvdXBcbiAgICB0aGlzLmZvcm1Hcm91cC5hZGRDb250cm9sKCdvbnRvbG9neScsIHRoaXMuZm9ybSk7XG5cbiAgfVxuXG59XG4iXX0=