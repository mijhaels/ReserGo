import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { ListWindowComponent } from './components/list-window/list-window.component';
import { WindowComponent } from './components/window/window.component';
import {
    NbButtonModule,
    NbCardModule,
    NbIconModule,
    NbLayoutModule,
    NbMenuModule,
    NbSidebarModule,
    NbSpinnerModule,
    NbToastrModule,
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { MatRippleModule } from '@angular/material/core';
import { TableModule } from 'primeng/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DetailTableComponent } from './components/detail-table/detail-table.component';
import { ConsumoDetalleComponent } from './components/consumo-detalle/consumo-detalle.component';

const NEBULAR_MODULES = [
    NbLayoutModule,
    NbEvaIconsModule,
    NbSidebarModule,
    NbMenuModule,
    NbCardModule,
    NbIconModule,
    NbSpinnerModule,
    NbButtonModule,
    NbToastrModule,
];

const MATERIAL_MODULES = [
    MatRippleModule,
    MatAutocompleteModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule
];

const PRIME_MODULES = [
    TableModule,
];

@NgModule({
        declarations: [
        HeaderComponent,
        ListWindowComponent,
        WindowComponent,
        DetailTableComponent,
        ConsumoDetalleComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ...NEBULAR_MODULES,
        ...MATERIAL_MODULES,
        ...PRIME_MODULES
    ],
    exports: [
        HeaderComponent,
        ListWindowComponent,
        WindowComponent,
        FormsModule,
        ReactiveFormsModule,
        DetailTableComponent,
        ...NEBULAR_MODULES,
        ...MATERIAL_MODULES,
        ...PRIME_MODULES
    ],
    providers: [
        CurrencyPipe,
    ]
})
export class SharedModule { }
