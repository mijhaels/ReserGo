import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.routes';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import localeEsAr from '@angular/common/locales/es-AR';
import localeEsPY from '@angular/common/locales/es-PY';
import { NbThemeModule } from '@nebular/theme';

registerLocaleData(localeEsAr);
registerLocaleData(localeEsPY);

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        NbThemeModule.forRoot({ name: 'default' }),
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
