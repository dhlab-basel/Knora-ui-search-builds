import { Component, Input } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
export class SearchPanelComponent {
    constructor() {
        this.route = '/search';
        this.showMenu = false;
        this.focusOnExtended = 'inactive';
    }
    /**
     * Show or hide the extended search menu
     *
     * @returns void
     */
    toggleMenu() {
        this.showMenu = !this.showMenu;
        this.focusOnExtended = (this.focusOnExtended === 'active' ? 'inactive' : 'active');
    }
}
SearchPanelComponent.decorators = [
    { type: Component, args: [{
                selector: 'kui-search-panel',
                template: `<div class="kui-search-panel">

    <div class="kui-search-bar">

        <div class="fulltext-search">
            <kui-fulltext-search [route]="route"></kui-fulltext-search>
        </div>

        <div *ngIf="showMenu" [@extendedSearchMenu]="focusOnExtended" class="kui-menu extended-search">
            <div class="kui-menu-header">
                <span class="kui-menu-title">
                    <h4>Advanced search</h4>
                </span>
                <span class="kui-menu-action">
                    <button mat-icon-button (click)="toggleMenu()">
                        <mat-icon>close</mat-icon>
                    </button>
                </span>
            </div>
            <div class="extended-search-box">
                <kui-extended-search [route]="route" (toggleExtendedSearchForm)="toggleMenu()"></kui-extended-search>
            </div>
        </div>

    </div>

    <div class="advanced-btn">
        <button mat-button color="primary" (click)="toggleMenu()">advanced</button>
    </div>

</div>`,
                styles: [`.advanced-btn{margin-left:10px}.kui-search-panel{display:flex;position:relative;z-index:100}.kui-search-bar{background-color:#f9f9f9;border-radius:4px;display:inline-flex;height:40px;position:relative;z-index:10}.kui-search-bar:hover{box-shadow:0 1px 3px rgba(0,0,0,.5)}.kui-menu{box-shadow:0 3px 5px -1px rgba(11,11,11,.2),0 6px 10px 0 rgba(11,11,11,.14),0 1px 18px 0 rgba(11,11,11,.12);background-color:#f9f9f9;border-radius:4px;position:absolute}.kui-menu .kui-menu-header{background-color:#f9f9f9;border-top-left-radius:4px;border-top-right-radius:4px;display:inline-block;height:48px;width:100%}.kui-menu .kui-menu-header .kui-menu-title{float:left;font-size:14px;font-weight:400;margin-top:4px;padding:12px}.kui-menu .kui-menu-header .kui-menu-action{float:right;margin:4px}.kui-menu.extended-search{min-height:680px;width:680px;z-index:20}.extended-search-box{margin:12px}@media screen and (max-width:1024px){.kui-search-bar{width:480px}.kui-search-bar div.input-field input{width:calc(480px - 80px)}.fulltext-search,.kui-menu.extended-search{width:480px}}@media screen and (max-width:768px){.kui-search-bar{width:calc(480px - 160px)}.kui-search-bar div.input-field input{width:calc(480px - 160px - 80px)}.fulltext-search,.kui-menu.extended-search{width:calc(480px - 80px)}}`],
                animations: [
                    trigger('extendedSearchMenu', [
                        state('inactive', style({ display: 'none' })),
                        state('active', style({ display: 'block' })),
                        transition('inactive => active', animate('100ms ease-in')),
                        transition('active => inactive', animate('100ms ease-out'))
                    ])
                ]
            },] },
];
SearchPanelComponent.ctorParameters = () => [];
SearchPanelComponent.propDecorators = {
    route: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VhcmNoLXBhbmVsLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Brbm9yYS9zZWFyY2gvIiwic291cmNlcyI6WyJsaWIvc2VhcmNoLXBhbmVsL3NlYXJjaC1wYW5lbC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDakQsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQStDakYsTUFBTTtJQU1KO1FBSlMsVUFBSyxHQUFXLFNBQVMsQ0FBQztRQUNuQyxhQUFRLEdBQVksS0FBSyxDQUFDO1FBQzFCLG9CQUFlLEdBQVcsVUFBVSxDQUFDO0lBRXJCLENBQUM7SUFFakI7Ozs7T0FJRztJQUNILFVBQVU7UUFDUixJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUMvQixJQUFJLENBQUMsZUFBZSxHQUFHLENBQUMsSUFBSSxDQUFDLGVBQWUsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDckYsQ0FBQzs7O1lBN0RGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsa0JBQWtCO2dCQUM1QixRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQThCTDtnQkFDTCxNQUFNLEVBQUUsQ0FBQyxtd0NBQW13QyxDQUFDO2dCQUM3d0MsVUFBVSxFQUFFO29CQUNWLE9BQU8sQ0FBQyxvQkFBb0IsRUFDMUI7d0JBQ0UsS0FBSyxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQzt3QkFDN0MsS0FBSyxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQzt3QkFDNUMsVUFBVSxDQUFDLG9CQUFvQixFQUFFLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQzt3QkFDMUQsVUFBVSxDQUFDLG9CQUFvQixFQUFFLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO3FCQUM1RCxDQUNGO2lCQUNGO2FBQ0Y7Ozs7b0JBR0UsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IGFuaW1hdGUsIHN0YXRlLCBzdHlsZSwgdHJhbnNpdGlvbiwgdHJpZ2dlciB9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdrdWktc2VhcmNoLXBhbmVsJyxcbiAgdGVtcGxhdGU6IGA8ZGl2IGNsYXNzPVwia3VpLXNlYXJjaC1wYW5lbFwiPlxuXG4gICAgPGRpdiBjbGFzcz1cImt1aS1zZWFyY2gtYmFyXCI+XG5cbiAgICAgICAgPGRpdiBjbGFzcz1cImZ1bGx0ZXh0LXNlYXJjaFwiPlxuICAgICAgICAgICAgPGt1aS1mdWxsdGV4dC1zZWFyY2ggW3JvdXRlXT1cInJvdXRlXCI+PC9rdWktZnVsbHRleHQtc2VhcmNoPlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8ZGl2ICpuZ0lmPVwic2hvd01lbnVcIiBbQGV4dGVuZGVkU2VhcmNoTWVudV09XCJmb2N1c09uRXh0ZW5kZWRcIiBjbGFzcz1cImt1aS1tZW51IGV4dGVuZGVkLXNlYXJjaFwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImt1aS1tZW51LWhlYWRlclwiPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwia3VpLW1lbnUtdGl0bGVcIj5cbiAgICAgICAgICAgICAgICAgICAgPGg0PkFkdmFuY2VkIHNlYXJjaDwvaDQ+XG4gICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwia3VpLW1lbnUtYWN0aW9uXCI+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gbWF0LWljb24tYnV0dG9uIChjbGljayk9XCJ0b2dnbGVNZW51KClcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxtYXQtaWNvbj5jbG9zZTwvbWF0LWljb24+XG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImV4dGVuZGVkLXNlYXJjaC1ib3hcIj5cbiAgICAgICAgICAgICAgICA8a3VpLWV4dGVuZGVkLXNlYXJjaCBbcm91dGVdPVwicm91dGVcIiAodG9nZ2xlRXh0ZW5kZWRTZWFyY2hGb3JtKT1cInRvZ2dsZU1lbnUoKVwiPjwva3VpLWV4dGVuZGVkLXNlYXJjaD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cblxuICAgIDwvZGl2PlxuXG4gICAgPGRpdiBjbGFzcz1cImFkdmFuY2VkLWJ0blwiPlxuICAgICAgICA8YnV0dG9uIG1hdC1idXR0b24gY29sb3I9XCJwcmltYXJ5XCIgKGNsaWNrKT1cInRvZ2dsZU1lbnUoKVwiPmFkdmFuY2VkPC9idXR0b24+XG4gICAgPC9kaXY+XG5cbjwvZGl2PmAsXG4gIHN0eWxlczogW2AuYWR2YW5jZWQtYnRue21hcmdpbi1sZWZ0OjEwcHh9Lmt1aS1zZWFyY2gtcGFuZWx7ZGlzcGxheTpmbGV4O3Bvc2l0aW9uOnJlbGF0aXZlO3otaW5kZXg6MTAwfS5rdWktc2VhcmNoLWJhcntiYWNrZ3JvdW5kLWNvbG9yOiNmOWY5Zjk7Ym9yZGVyLXJhZGl1czo0cHg7ZGlzcGxheTppbmxpbmUtZmxleDtoZWlnaHQ6NDBweDtwb3NpdGlvbjpyZWxhdGl2ZTt6LWluZGV4OjEwfS5rdWktc2VhcmNoLWJhcjpob3Zlcntib3gtc2hhZG93OjAgMXB4IDNweCByZ2JhKDAsMCwwLC41KX0ua3VpLW1lbnV7Ym94LXNoYWRvdzowIDNweCA1cHggLTFweCByZ2JhKDExLDExLDExLC4yKSwwIDZweCAxMHB4IDAgcmdiYSgxMSwxMSwxMSwuMTQpLDAgMXB4IDE4cHggMCByZ2JhKDExLDExLDExLC4xMik7YmFja2dyb3VuZC1jb2xvcjojZjlmOWY5O2JvcmRlci1yYWRpdXM6NHB4O3Bvc2l0aW9uOmFic29sdXRlfS5rdWktbWVudSAua3VpLW1lbnUtaGVhZGVye2JhY2tncm91bmQtY29sb3I6I2Y5ZjlmOTtib3JkZXItdG9wLWxlZnQtcmFkaXVzOjRweDtib3JkZXItdG9wLXJpZ2h0LXJhZGl1czo0cHg7ZGlzcGxheTppbmxpbmUtYmxvY2s7aGVpZ2h0OjQ4cHg7d2lkdGg6MTAwJX0ua3VpLW1lbnUgLmt1aS1tZW51LWhlYWRlciAua3VpLW1lbnUtdGl0bGV7ZmxvYXQ6bGVmdDtmb250LXNpemU6MTRweDtmb250LXdlaWdodDo0MDA7bWFyZ2luLXRvcDo0cHg7cGFkZGluZzoxMnB4fS5rdWktbWVudSAua3VpLW1lbnUtaGVhZGVyIC5rdWktbWVudS1hY3Rpb257ZmxvYXQ6cmlnaHQ7bWFyZ2luOjRweH0ua3VpLW1lbnUuZXh0ZW5kZWQtc2VhcmNoe21pbi1oZWlnaHQ6NjgwcHg7d2lkdGg6NjgwcHg7ei1pbmRleDoyMH0uZXh0ZW5kZWQtc2VhcmNoLWJveHttYXJnaW46MTJweH1AbWVkaWEgc2NyZWVuIGFuZCAobWF4LXdpZHRoOjEwMjRweCl7Lmt1aS1zZWFyY2gtYmFye3dpZHRoOjQ4MHB4fS5rdWktc2VhcmNoLWJhciBkaXYuaW5wdXQtZmllbGQgaW5wdXR7d2lkdGg6Y2FsYyg0ODBweCAtIDgwcHgpfS5mdWxsdGV4dC1zZWFyY2gsLmt1aS1tZW51LmV4dGVuZGVkLXNlYXJjaHt3aWR0aDo0ODBweH19QG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDo3NjhweCl7Lmt1aS1zZWFyY2gtYmFye3dpZHRoOmNhbGMoNDgwcHggLSAxNjBweCl9Lmt1aS1zZWFyY2gtYmFyIGRpdi5pbnB1dC1maWVsZCBpbnB1dHt3aWR0aDpjYWxjKDQ4MHB4IC0gMTYwcHggLSA4MHB4KX0uZnVsbHRleHQtc2VhcmNoLC5rdWktbWVudS5leHRlbmRlZC1zZWFyY2h7d2lkdGg6Y2FsYyg0ODBweCAtIDgwcHgpfX1gXSxcbiAgYW5pbWF0aW9uczogW1xuICAgIHRyaWdnZXIoJ2V4dGVuZGVkU2VhcmNoTWVudScsXG4gICAgICBbXG4gICAgICAgIHN0YXRlKCdpbmFjdGl2ZScsIHN0eWxlKHsgZGlzcGxheTogJ25vbmUnIH0pKSxcbiAgICAgICAgc3RhdGUoJ2FjdGl2ZScsIHN0eWxlKHsgZGlzcGxheTogJ2Jsb2NrJyB9KSksXG4gICAgICAgIHRyYW5zaXRpb24oJ2luYWN0aXZlID0+IGFjdGl2ZScsIGFuaW1hdGUoJzEwMG1zIGVhc2UtaW4nKSksXG4gICAgICAgIHRyYW5zaXRpb24oJ2FjdGl2ZSA9PiBpbmFjdGl2ZScsIGFuaW1hdGUoJzEwMG1zIGVhc2Utb3V0JykpXG4gICAgICBdXG4gICAgKVxuICBdXG59KVxuZXhwb3J0IGNsYXNzIFNlYXJjaFBhbmVsQ29tcG9uZW50IHtcblxuICBASW5wdXQoKSByb3V0ZTogc3RyaW5nID0gJy9zZWFyY2gnO1xuICBzaG93TWVudTogYm9vbGVhbiA9IGZhbHNlO1xuICBmb2N1c09uRXh0ZW5kZWQ6IHN0cmluZyA9ICdpbmFjdGl2ZSc7XG5cbiAgY29uc3RydWN0b3IoKSB7IH1cblxuICAvKipcbiAgICogU2hvdyBvciBoaWRlIHRoZSBleHRlbmRlZCBzZWFyY2ggbWVudVxuICAgKlxuICAgKiBAcmV0dXJucyB2b2lkXG4gICAqL1xuICB0b2dnbGVNZW51KCk6IHZvaWQge1xuICAgIHRoaXMuc2hvd01lbnUgPSAhdGhpcy5zaG93TWVudTtcbiAgICB0aGlzLmZvY3VzT25FeHRlbmRlZCA9ICh0aGlzLmZvY3VzT25FeHRlbmRlZCA9PT0gJ2FjdGl2ZScgPyAnaW5hY3RpdmUnIDogJ2FjdGl2ZScpO1xuICB9XG59XG4iXX0=