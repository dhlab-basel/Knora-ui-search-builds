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
/** @nocollapse */
SearchPanelComponent.ctorParameters = () => [];
SearchPanelComponent.propDecorators = {
    route: [{ type: Input }]
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VhcmNoLXBhbmVsLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Brbm9yYS9zZWFyY2gvIiwic291cmNlcyI6WyJsaWIvc2VhcmNoLXBhbmVsL3NlYXJjaC1wYW5lbC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDakQsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQStDakYsTUFBTTtJQU1KO1FBSlMsVUFBSyxHQUFXLFNBQVMsQ0FBQztRQUNuQyxhQUFRLEdBQVksS0FBSyxDQUFDO1FBQzFCLG9CQUFlLEdBQVcsVUFBVSxDQUFDO0lBRXJCLENBQUM7SUFFakI7Ozs7T0FJRztJQUNILFVBQVU7UUFDUixJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUMvQixJQUFJLENBQUMsZUFBZSxHQUFHLENBQUMsSUFBSSxDQUFDLGVBQWUsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDckYsQ0FBQzs7O1lBN0RGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsa0JBQWtCO2dCQUM1QixRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQThCTDtnQkFDTCxNQUFNLEVBQUUsQ0FBQyxtd0NBQW13QyxDQUFDO2dCQUM3d0MsVUFBVSxFQUFFO29CQUNWLE9BQU8sQ0FBQyxvQkFBb0IsRUFDMUI7d0JBQ0UsS0FBSyxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQzt3QkFDN0MsS0FBSyxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQzt3QkFDNUMsVUFBVSxDQUFDLG9CQUFvQixFQUFFLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQzt3QkFDMUQsVUFBVSxDQUFDLG9CQUFvQixFQUFFLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO3FCQUM1RCxDQUNGO2lCQUNGO2FBQ0Y7Ozs7O29CQUdFLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBhbmltYXRlLCBzdGF0ZSwgc3R5bGUsIHRyYW5zaXRpb24sIHRyaWdnZXIgfSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAna3VpLXNlYXJjaC1wYW5lbCcsXG4gIHRlbXBsYXRlOiBgPGRpdiBjbGFzcz1cImt1aS1zZWFyY2gtcGFuZWxcIj5cblxuICAgIDxkaXYgY2xhc3M9XCJrdWktc2VhcmNoLWJhclwiPlxuXG4gICAgICAgIDxkaXYgY2xhc3M9XCJmdWxsdGV4dC1zZWFyY2hcIj5cbiAgICAgICAgICAgIDxrdWktZnVsbHRleHQtc2VhcmNoIFtyb3V0ZV09XCJyb3V0ZVwiPjwva3VpLWZ1bGx0ZXh0LXNlYXJjaD5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiAqbmdJZj1cInNob3dNZW51XCIgW0BleHRlbmRlZFNlYXJjaE1lbnVdPVwiZm9jdXNPbkV4dGVuZGVkXCIgY2xhc3M9XCJrdWktbWVudSBleHRlbmRlZC1zZWFyY2hcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJrdWktbWVudS1oZWFkZXJcIj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImt1aS1tZW51LXRpdGxlXCI+XG4gICAgICAgICAgICAgICAgICAgIDxoND5BZHZhbmNlZCBzZWFyY2g8L2g0PlxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImt1aS1tZW51LWFjdGlvblwiPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIG1hdC1pY29uLWJ1dHRvbiAoY2xpY2spPVwidG9nZ2xlTWVudSgpXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bWF0LWljb24+Y2xvc2U8L21hdC1pY29uPlxuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJleHRlbmRlZC1zZWFyY2gtYm94XCI+XG4gICAgICAgICAgICAgICAgPGt1aS1leHRlbmRlZC1zZWFyY2ggW3JvdXRlXT1cInJvdXRlXCIgKHRvZ2dsZUV4dGVuZGVkU2VhcmNoRm9ybSk9XCJ0b2dnbGVNZW51KClcIj48L2t1aS1leHRlbmRlZC1zZWFyY2g+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICA8L2Rpdj5cblxuICAgIDxkaXYgY2xhc3M9XCJhZHZhbmNlZC1idG5cIj5cbiAgICAgICAgPGJ1dHRvbiBtYXQtYnV0dG9uIGNvbG9yPVwicHJpbWFyeVwiIChjbGljayk9XCJ0b2dnbGVNZW51KClcIj5hZHZhbmNlZDwvYnV0dG9uPlxuICAgIDwvZGl2PlxuXG48L2Rpdj5gLFxuICBzdHlsZXM6IFtgLmFkdmFuY2VkLWJ0bnttYXJnaW4tbGVmdDoxMHB4fS5rdWktc2VhcmNoLXBhbmVse2Rpc3BsYXk6ZmxleDtwb3NpdGlvbjpyZWxhdGl2ZTt6LWluZGV4OjEwMH0ua3VpLXNlYXJjaC1iYXJ7YmFja2dyb3VuZC1jb2xvcjojZjlmOWY5O2JvcmRlci1yYWRpdXM6NHB4O2Rpc3BsYXk6aW5saW5lLWZsZXg7aGVpZ2h0OjQwcHg7cG9zaXRpb246cmVsYXRpdmU7ei1pbmRleDoxMH0ua3VpLXNlYXJjaC1iYXI6aG92ZXJ7Ym94LXNoYWRvdzowIDFweCAzcHggcmdiYSgwLDAsMCwuNSl9Lmt1aS1tZW51e2JveC1zaGFkb3c6MCAzcHggNXB4IC0xcHggcmdiYSgxMSwxMSwxMSwuMiksMCA2cHggMTBweCAwIHJnYmEoMTEsMTEsMTEsLjE0KSwwIDFweCAxOHB4IDAgcmdiYSgxMSwxMSwxMSwuMTIpO2JhY2tncm91bmQtY29sb3I6I2Y5ZjlmOTtib3JkZXItcmFkaXVzOjRweDtwb3NpdGlvbjphYnNvbHV0ZX0ua3VpLW1lbnUgLmt1aS1tZW51LWhlYWRlcntiYWNrZ3JvdW5kLWNvbG9yOiNmOWY5Zjk7Ym9yZGVyLXRvcC1sZWZ0LXJhZGl1czo0cHg7Ym9yZGVyLXRvcC1yaWdodC1yYWRpdXM6NHB4O2Rpc3BsYXk6aW5saW5lLWJsb2NrO2hlaWdodDo0OHB4O3dpZHRoOjEwMCV9Lmt1aS1tZW51IC5rdWktbWVudS1oZWFkZXIgLmt1aS1tZW51LXRpdGxle2Zsb2F0OmxlZnQ7Zm9udC1zaXplOjE0cHg7Zm9udC13ZWlnaHQ6NDAwO21hcmdpbi10b3A6NHB4O3BhZGRpbmc6MTJweH0ua3VpLW1lbnUgLmt1aS1tZW51LWhlYWRlciAua3VpLW1lbnUtYWN0aW9ue2Zsb2F0OnJpZ2h0O21hcmdpbjo0cHh9Lmt1aS1tZW51LmV4dGVuZGVkLXNlYXJjaHttaW4taGVpZ2h0OjY4MHB4O3dpZHRoOjY4MHB4O3otaW5kZXg6MjB9LmV4dGVuZGVkLXNlYXJjaC1ib3h7bWFyZ2luOjEycHh9QG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDoxMDI0cHgpey5rdWktc2VhcmNoLWJhcnt3aWR0aDo0ODBweH0ua3VpLXNlYXJjaC1iYXIgZGl2LmlucHV0LWZpZWxkIGlucHV0e3dpZHRoOmNhbGMoNDgwcHggLSA4MHB4KX0uZnVsbHRleHQtc2VhcmNoLC5rdWktbWVudS5leHRlbmRlZC1zZWFyY2h7d2lkdGg6NDgwcHh9fUBtZWRpYSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6NzY4cHgpey5rdWktc2VhcmNoLWJhcnt3aWR0aDpjYWxjKDQ4MHB4IC0gMTYwcHgpfS5rdWktc2VhcmNoLWJhciBkaXYuaW5wdXQtZmllbGQgaW5wdXR7d2lkdGg6Y2FsYyg0ODBweCAtIDE2MHB4IC0gODBweCl9LmZ1bGx0ZXh0LXNlYXJjaCwua3VpLW1lbnUuZXh0ZW5kZWQtc2VhcmNoe3dpZHRoOmNhbGMoNDgwcHggLSA4MHB4KX19YF0sXG4gIGFuaW1hdGlvbnM6IFtcbiAgICB0cmlnZ2VyKCdleHRlbmRlZFNlYXJjaE1lbnUnLFxuICAgICAgW1xuICAgICAgICBzdGF0ZSgnaW5hY3RpdmUnLCBzdHlsZSh7IGRpc3BsYXk6ICdub25lJyB9KSksXG4gICAgICAgIHN0YXRlKCdhY3RpdmUnLCBzdHlsZSh7IGRpc3BsYXk6ICdibG9jaycgfSkpLFxuICAgICAgICB0cmFuc2l0aW9uKCdpbmFjdGl2ZSA9PiBhY3RpdmUnLCBhbmltYXRlKCcxMDBtcyBlYXNlLWluJykpLFxuICAgICAgICB0cmFuc2l0aW9uKCdhY3RpdmUgPT4gaW5hY3RpdmUnLCBhbmltYXRlKCcxMDBtcyBlYXNlLW91dCcpKVxuICAgICAgXVxuICAgIClcbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBTZWFyY2hQYW5lbENvbXBvbmVudCB7XG5cbiAgQElucHV0KCkgcm91dGU6IHN0cmluZyA9ICcvc2VhcmNoJztcbiAgc2hvd01lbnU6IGJvb2xlYW4gPSBmYWxzZTtcbiAgZm9jdXNPbkV4dGVuZGVkOiBzdHJpbmcgPSAnaW5hY3RpdmUnO1xuXG4gIGNvbnN0cnVjdG9yKCkgeyB9XG5cbiAgLyoqXG4gICAqIFNob3cgb3IgaGlkZSB0aGUgZXh0ZW5kZWQgc2VhcmNoIG1lbnVcbiAgICpcbiAgICogQHJldHVybnMgdm9pZFxuICAgKi9cbiAgdG9nZ2xlTWVudSgpOiB2b2lkIHtcbiAgICB0aGlzLnNob3dNZW51ID0gIXRoaXMuc2hvd01lbnU7XG4gICAgdGhpcy5mb2N1c09uRXh0ZW5kZWQgPSAodGhpcy5mb2N1c09uRXh0ZW5kZWQgPT09ICdhY3RpdmUnID8gJ2luYWN0aXZlJyA6ICdhY3RpdmUnKTtcbiAgfVxufVxuIl19