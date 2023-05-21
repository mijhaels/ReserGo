import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
    selector: 'app-detail-table',
    templateUrl: './detail-table.component.html',
    styleUrls: ['./detail-table.component.scss']
})
export class DetailTableComponent implements OnInit {
    @Input() title = '';
    @Input() source: any[] = [];
    @Input() columns: any[] = [];
    @Input() productos: any[] = [];
    @Output() delete = new EventEmitter();
    @Output() selection = new EventEmitter();

    loading = false;
    selected: any;
    constructor() { }

    ngOnInit(): void {
    }

    getProducto(id: number): number[] {
        return this.productos?.find(p => p.id === id);
    }

    onSelect(control: AbstractControl): void {
        console.log(control);
        this.selection.emit(control);
    }

    onDelete(control: AbstractControl): void {
        this.delete.emit(control);
    }
}
