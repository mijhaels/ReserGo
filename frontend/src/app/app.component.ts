import { Component } from '@angular/core';
import { NbIconLibraries } from '@nebular/theme';
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent {
    title = 'Reservas';
    constructor(
        private iconLibraries: NbIconLibraries,
    ) {
        this.iconLibraries.registerFontPack('far', { packClass: 'far', iconClassPrefix: 'fa' });
        this.iconLibraries.registerFontPack('fas', { packClass: 'fas', iconClassPrefix: 'fa' });
    }
}
