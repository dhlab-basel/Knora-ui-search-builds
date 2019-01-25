import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatAutocompleteModule, MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule, MatSelectModule, MatTooltipModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { KuiCoreModule } from '@knora/core';
import { KuiActionModule } from '@knora/action';
import { KuiViewerModule } from '@knora/viewer';
import { MatJDNConvertibleCalendarDateAdapterModule } from 'jdnconvertiblecalendardateadapter';
import { SearchComponent } from './search.component';
import { FulltextSearchComponent } from './fulltext-search/fulltext-search.component';
import { SearchPanelComponent } from './search-panel/search-panel.component';
import { ExtendedSearchComponent } from './extended-search/extended-search.component';
import { SelectOntologyComponent } from './extended-search/select-ontology/select-ontology.component';
import { SelectResourceClassComponent } from './extended-search/select-resource-class/select-resource-class.component';
import { SelectPropertyComponent } from './extended-search/select-property/select-property.component';
import { SpecifyPropertyValueComponent } from './extended-search/select-property/specify-property-value/specify-property-value.component';
import { BooleanValueComponent } from './extended-search/select-property/specify-property-value/boolean-value/boolean-value.component';
import { DateValueComponent } from './extended-search/select-property/specify-property-value/date-value/date-value.component';
import { DecimalValueComponent } from './extended-search/select-property/specify-property-value/decimal-value/decimal-value.component';
import { IntegerValueComponent } from './extended-search/select-property/specify-property-value/integer-value/integer-value.component';
import { LinkValueComponent } from './extended-search/select-property/specify-property-value/link-value/link-value.component';
import { TextValueComponent } from './extended-search/select-property/specify-property-value/text-value/text-value.component';
import { UriValueComponent } from './extended-search/select-property/specify-property-value/uri-value/uri-value.component';
import { HeaderComponent } from './extended-search/select-property/specify-property-value/date-value/header-calendar/header-calendar.component';
var KuiSearchModule = /** @class */ (function () {
    function KuiSearchModule() {
    }
    KuiSearchModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        CommonModule,
                        BrowserAnimationsModule,
                        MatAutocompleteModule,
                        MatButtonModule,
                        MatCheckboxModule,
                        MatDatepickerModule,
                        MatFormFieldModule,
                        MatInputModule,
                        MatIconModule,
                        MatListModule,
                        MatSelectModule,
                        MatTooltipModule,
                        FormsModule,
                        ReactiveFormsModule,
                        KuiCoreModule,
                        KuiActionModule,
                        KuiViewerModule,
                        MatJDNConvertibleCalendarDateAdapterModule
                    ],
                    declarations: [
                        SearchComponent,
                        SelectOntologyComponent,
                        ExtendedSearchComponent,
                        SelectResourceClassComponent,
                        SelectPropertyComponent,
                        SpecifyPropertyValueComponent,
                        BooleanValueComponent,
                        DateValueComponent,
                        DecimalValueComponent,
                        IntegerValueComponent,
                        LinkValueComponent,
                        TextValueComponent,
                        UriValueComponent,
                        HeaderComponent,
                        FulltextSearchComponent,
                        SearchPanelComponent
                    ],
                    exports: [
                        SearchComponent,
                        SearchPanelComponent,
                        FulltextSearchComponent,
                        ExtendedSearchComponent,
                        DateValueComponent
                    ],
                    entryComponents: [
                        HeaderComponent
                    ]
                },] },
    ];
    return KuiSearchModule;
}());
export { KuiSearchModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VhcmNoLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Brbm9yYS9zZWFyY2gvIiwic291cmNlcyI6WyJsaWIvc2VhcmNoLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQUMvRSxPQUFPLEVBQ0gscUJBQXFCLEVBQ3JCLGVBQWUsRUFDZixpQkFBaUIsRUFDakIsbUJBQW1CLEVBQ25CLGtCQUFrQixFQUNsQixhQUFhLEVBQUUsY0FBYyxFQUM3QixhQUFhLEVBQ2IsZUFBZSxFQUNmLGdCQUFnQixFQUNuQixNQUFNLG1CQUFtQixDQUFDO0FBRTNCLE9BQU8sRUFBRSxXQUFXLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNsRSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQzVDLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDaEQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUVoRCxPQUFPLEVBQUUsMENBQTBDLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUUvRixPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDckQsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sNkNBQTZDLENBQUM7QUFDdEYsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFDN0UsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sNkNBQTZDLENBQUM7QUFFdEYsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sNkRBQTZELENBQUM7QUFDdEcsT0FBTyxFQUFFLDRCQUE0QixFQUFFLE1BQU0seUVBQXlFLENBQUM7QUFDdkgsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sNkRBQTZELENBQUM7QUFDdEcsT0FBTyxFQUFFLDZCQUE2QixFQUFFLE1BQU0sMkZBQTJGLENBQUM7QUFDMUksT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sZ0dBQWdHLENBQUM7QUFDdkksT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sMEZBQTBGLENBQUM7QUFDOUgsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sZ0dBQWdHLENBQUM7QUFDdkksT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sZ0dBQWdHLENBQUM7QUFDdkksT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sMEZBQTBGLENBQUM7QUFDOUgsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sMEZBQTBGLENBQUM7QUFDOUgsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sd0ZBQXdGLENBQUM7QUFDM0gsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLCtHQUErRyxDQUFDO0FBR2hKO0lBQUE7SUFtREEsQ0FBQzs7Z0JBbkRBLFFBQVEsU0FBQztvQkFDTixPQUFPLEVBQUU7d0JBQ0wsWUFBWTt3QkFDWix1QkFBdUI7d0JBQ3ZCLHFCQUFxQjt3QkFDckIsZUFBZTt3QkFDZixpQkFBaUI7d0JBQ2pCLG1CQUFtQjt3QkFDbkIsa0JBQWtCO3dCQUNsQixjQUFjO3dCQUNkLGFBQWE7d0JBQ2IsYUFBYTt3QkFDYixlQUFlO3dCQUNmLGdCQUFnQjt3QkFDaEIsV0FBVzt3QkFDWCxtQkFBbUI7d0JBQ25CLGFBQWE7d0JBQ2IsZUFBZTt3QkFDZixlQUFlO3dCQUNmLDBDQUEwQztxQkFDN0M7b0JBQ0QsWUFBWSxFQUFFO3dCQUNWLGVBQWU7d0JBQ2YsdUJBQXVCO3dCQUN2Qix1QkFBdUI7d0JBQ3ZCLDRCQUE0Qjt3QkFDNUIsdUJBQXVCO3dCQUN2Qiw2QkFBNkI7d0JBQzdCLHFCQUFxQjt3QkFDckIsa0JBQWtCO3dCQUNsQixxQkFBcUI7d0JBQ3JCLHFCQUFxQjt3QkFDckIsa0JBQWtCO3dCQUNsQixrQkFBa0I7d0JBQ2xCLGlCQUFpQjt3QkFDakIsZUFBZTt3QkFDZix1QkFBdUI7d0JBQ3ZCLG9CQUFvQjtxQkFDdkI7b0JBQ0QsT0FBTyxFQUFFO3dCQUNMLGVBQWU7d0JBQ2Ysb0JBQW9CO3dCQUNwQix1QkFBdUI7d0JBQ3ZCLHVCQUF1Qjt3QkFDdkIsa0JBQWtCO3FCQUNyQjtvQkFDRCxlQUFlLEVBQUU7d0JBQ2IsZUFBZTtxQkFDbEI7aUJBQ0o7O0lBRUQsc0JBQUM7Q0FBQSxBQW5ERCxJQW1EQztTQURZLGVBQWUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IEJyb3dzZXJBbmltYXRpb25zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcbmltcG9ydCB7XG4gICAgTWF0QXV0b2NvbXBsZXRlTW9kdWxlLFxuICAgIE1hdEJ1dHRvbk1vZHVsZSxcbiAgICBNYXRDaGVja2JveE1vZHVsZSxcbiAgICBNYXREYXRlcGlja2VyTW9kdWxlLFxuICAgIE1hdEZvcm1GaWVsZE1vZHVsZSxcbiAgICBNYXRJY29uTW9kdWxlLCBNYXRJbnB1dE1vZHVsZSxcbiAgICBNYXRMaXN0TW9kdWxlLFxuICAgIE1hdFNlbGVjdE1vZHVsZSxcbiAgICBNYXRUb29sdGlwTW9kdWxlXG59IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsJztcblxuaW1wb3J0IHsgRm9ybXNNb2R1bGUsIFJlYWN0aXZlRm9ybXNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBLdWlDb3JlTW9kdWxlIH0gZnJvbSAnQGtub3JhL2NvcmUnO1xuaW1wb3J0IHsgS3VpQWN0aW9uTW9kdWxlIH0gZnJvbSAnQGtub3JhL2FjdGlvbic7XG5pbXBvcnQgeyBLdWlWaWV3ZXJNb2R1bGUgfSBmcm9tICdAa25vcmEvdmlld2VyJztcblxuaW1wb3J0IHsgTWF0SkROQ29udmVydGlibGVDYWxlbmRhckRhdGVBZGFwdGVyTW9kdWxlIH0gZnJvbSAnamRuY29udmVydGlibGVjYWxlbmRhcmRhdGVhZGFwdGVyJztcblxuaW1wb3J0IHsgU2VhcmNoQ29tcG9uZW50IH0gZnJvbSAnLi9zZWFyY2guY29tcG9uZW50JztcbmltcG9ydCB7IEZ1bGx0ZXh0U2VhcmNoQ29tcG9uZW50IH0gZnJvbSAnLi9mdWxsdGV4dC1zZWFyY2gvZnVsbHRleHQtc2VhcmNoLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBTZWFyY2hQYW5lbENvbXBvbmVudCB9IGZyb20gJy4vc2VhcmNoLXBhbmVsL3NlYXJjaC1wYW5lbC5jb21wb25lbnQnO1xuaW1wb3J0IHsgRXh0ZW5kZWRTZWFyY2hDb21wb25lbnQgfSBmcm9tICcuL2V4dGVuZGVkLXNlYXJjaC9leHRlbmRlZC1zZWFyY2guY29tcG9uZW50JztcblxuaW1wb3J0IHsgU2VsZWN0T250b2xvZ3lDb21wb25lbnQgfSBmcm9tICcuL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3Qtb250b2xvZ3kvc2VsZWN0LW9udG9sb2d5LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBTZWxlY3RSZXNvdXJjZUNsYXNzQ29tcG9uZW50IH0gZnJvbSAnLi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXJlc291cmNlLWNsYXNzL3NlbGVjdC1yZXNvdXJjZS1jbGFzcy5jb21wb25lbnQnO1xuaW1wb3J0IHsgU2VsZWN0UHJvcGVydHlDb21wb25lbnQgfSBmcm9tICcuL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3QtcHJvcGVydHkvc2VsZWN0LXByb3BlcnR5LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBTcGVjaWZ5UHJvcGVydHlWYWx1ZUNvbXBvbmVudCB9IGZyb20gJy4vZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1wcm9wZXJ0eS9zcGVjaWZ5LXByb3BlcnR5LXZhbHVlL3NwZWNpZnktcHJvcGVydHktdmFsdWUuY29tcG9uZW50JztcbmltcG9ydCB7IEJvb2xlYW5WYWx1ZUNvbXBvbmVudCB9IGZyb20gJy4vZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1wcm9wZXJ0eS9zcGVjaWZ5LXByb3BlcnR5LXZhbHVlL2Jvb2xlYW4tdmFsdWUvYm9vbGVhbi12YWx1ZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgRGF0ZVZhbHVlQ29tcG9uZW50IH0gZnJvbSAnLi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXByb3BlcnR5L3NwZWNpZnktcHJvcGVydHktdmFsdWUvZGF0ZS12YWx1ZS9kYXRlLXZhbHVlLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBEZWNpbWFsVmFsdWVDb21wb25lbnQgfSBmcm9tICcuL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3QtcHJvcGVydHkvc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZS9kZWNpbWFsLXZhbHVlL2RlY2ltYWwtdmFsdWUuY29tcG9uZW50JztcbmltcG9ydCB7IEludGVnZXJWYWx1ZUNvbXBvbmVudCB9IGZyb20gJy4vZXh0ZW5kZWQtc2VhcmNoL3NlbGVjdC1wcm9wZXJ0eS9zcGVjaWZ5LXByb3BlcnR5LXZhbHVlL2ludGVnZXItdmFsdWUvaW50ZWdlci12YWx1ZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgTGlua1ZhbHVlQ29tcG9uZW50IH0gZnJvbSAnLi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXByb3BlcnR5L3NwZWNpZnktcHJvcGVydHktdmFsdWUvbGluay12YWx1ZS9saW5rLXZhbHVlLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBUZXh0VmFsdWVDb21wb25lbnQgfSBmcm9tICcuL2V4dGVuZGVkLXNlYXJjaC9zZWxlY3QtcHJvcGVydHkvc3BlY2lmeS1wcm9wZXJ0eS12YWx1ZS90ZXh0LXZhbHVlL3RleHQtdmFsdWUuY29tcG9uZW50JztcbmltcG9ydCB7IFVyaVZhbHVlQ29tcG9uZW50IH0gZnJvbSAnLi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXByb3BlcnR5L3NwZWNpZnktcHJvcGVydHktdmFsdWUvdXJpLXZhbHVlL3VyaS12YWx1ZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgSGVhZGVyQ29tcG9uZW50IH0gZnJvbSAnLi9leHRlbmRlZC1zZWFyY2gvc2VsZWN0LXByb3BlcnR5L3NwZWNpZnktcHJvcGVydHktdmFsdWUvZGF0ZS12YWx1ZS9oZWFkZXItY2FsZW5kYXIvaGVhZGVyLWNhbGVuZGFyLmNvbXBvbmVudCc7XG5cblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbXG4gICAgICAgIENvbW1vbk1vZHVsZSxcbiAgICAgICAgQnJvd3NlckFuaW1hdGlvbnNNb2R1bGUsXG4gICAgICAgIE1hdEF1dG9jb21wbGV0ZU1vZHVsZSxcbiAgICAgICAgTWF0QnV0dG9uTW9kdWxlLFxuICAgICAgICBNYXRDaGVja2JveE1vZHVsZSxcbiAgICAgICAgTWF0RGF0ZXBpY2tlck1vZHVsZSxcbiAgICAgICAgTWF0Rm9ybUZpZWxkTW9kdWxlLFxuICAgICAgICBNYXRJbnB1dE1vZHVsZSxcbiAgICAgICAgTWF0SWNvbk1vZHVsZSxcbiAgICAgICAgTWF0TGlzdE1vZHVsZSxcbiAgICAgICAgTWF0U2VsZWN0TW9kdWxlLFxuICAgICAgICBNYXRUb29sdGlwTW9kdWxlLFxuICAgICAgICBGb3Jtc01vZHVsZSxcbiAgICAgICAgUmVhY3RpdmVGb3Jtc01vZHVsZSxcbiAgICAgICAgS3VpQ29yZU1vZHVsZSxcbiAgICAgICAgS3VpQWN0aW9uTW9kdWxlLFxuICAgICAgICBLdWlWaWV3ZXJNb2R1bGUsXG4gICAgICAgIE1hdEpETkNvbnZlcnRpYmxlQ2FsZW5kYXJEYXRlQWRhcHRlck1vZHVsZVxuICAgIF0sXG4gICAgZGVjbGFyYXRpb25zOiBbXG4gICAgICAgIFNlYXJjaENvbXBvbmVudCxcbiAgICAgICAgU2VsZWN0T250b2xvZ3lDb21wb25lbnQsXG4gICAgICAgIEV4dGVuZGVkU2VhcmNoQ29tcG9uZW50LFxuICAgICAgICBTZWxlY3RSZXNvdXJjZUNsYXNzQ29tcG9uZW50LFxuICAgICAgICBTZWxlY3RQcm9wZXJ0eUNvbXBvbmVudCxcbiAgICAgICAgU3BlY2lmeVByb3BlcnR5VmFsdWVDb21wb25lbnQsXG4gICAgICAgIEJvb2xlYW5WYWx1ZUNvbXBvbmVudCxcbiAgICAgICAgRGF0ZVZhbHVlQ29tcG9uZW50LFxuICAgICAgICBEZWNpbWFsVmFsdWVDb21wb25lbnQsXG4gICAgICAgIEludGVnZXJWYWx1ZUNvbXBvbmVudCxcbiAgICAgICAgTGlua1ZhbHVlQ29tcG9uZW50LFxuICAgICAgICBUZXh0VmFsdWVDb21wb25lbnQsXG4gICAgICAgIFVyaVZhbHVlQ29tcG9uZW50LFxuICAgICAgICBIZWFkZXJDb21wb25lbnQsXG4gICAgICAgIEZ1bGx0ZXh0U2VhcmNoQ29tcG9uZW50LFxuICAgICAgICBTZWFyY2hQYW5lbENvbXBvbmVudFxuICAgIF0sXG4gICAgZXhwb3J0czogW1xuICAgICAgICBTZWFyY2hDb21wb25lbnQsXG4gICAgICAgIFNlYXJjaFBhbmVsQ29tcG9uZW50LFxuICAgICAgICBGdWxsdGV4dFNlYXJjaENvbXBvbmVudCxcbiAgICAgICAgRXh0ZW5kZWRTZWFyY2hDb21wb25lbnQsXG4gICAgICAgIERhdGVWYWx1ZUNvbXBvbmVudFxuICAgIF0sXG4gICAgZW50cnlDb21wb25lbnRzOiBbXG4gICAgICAgIEhlYWRlckNvbXBvbmVudFxuICAgIF1cbn0pXG5leHBvcnQgY2xhc3MgS3VpU2VhcmNoTW9kdWxlIHtcbn1cbiJdfQ==