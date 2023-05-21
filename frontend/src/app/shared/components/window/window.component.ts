import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-window',
    templateUrl: './window.component.html',
    styleUrls: ['./window.component.scss']
})
export class WindowComponent implements OnInit {
    @Input() title = '';
    @Input() nuevo: boolean;

    @Output() save = new EventEmitter();
    @Output() delete = new EventEmitter();
    constructor() { }

    ngOnInit(): void { }

    onSave(): void {
        this.save.emit();
    }

    onDelete(): void {
        this.delete.emit();
    }
}
