import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-list-window',
    templateUrl: './list-window.component.html',
    styleUrls: ['./list-window.component.scss']
})
export class ListWindowComponent implements OnInit {
    @Input() title = '';
    @Input() source: any[] = [];
    @Input() columns: any[] = [];

    @Output() create = new EventEmitter();
    @Output() selection = new EventEmitter();

    loading = false;
    selected: any;

    constructor() { }

    ngOnInit(): void {
    }

    onNew(): void {
        this.create.emit();
    }

    onSelect(id: number): void {
        this.selection.emit({id});
    }
}
