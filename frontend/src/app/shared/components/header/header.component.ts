import { Component, OnInit } from '@angular/core';
import { NbSidebarService } from '@nebular/theme';
import { LayoutService } from '../../../services/layout.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    constructor(
        private sidebarService: NbSidebarService,
        private layoutService: LayoutService
    ) { }

    ngOnInit(): void {
    }

    toggleSidebar(): boolean {
        this.sidebarService.toggle(true, 'menu-sidebar');
        this.layoutService.changeLayoutSize();
        return false;
    }

}
