import { CurrencyPipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';


function emptyValidator(control: FormControl): any {
    if (!control || !control.value || Number(control.value) === 0) {
        return {required: true};
    }
}

@Component({
    selector: 'app-consumo-detalle',
    templateUrl: './consumo-detalle.component.html',
    styleUrls: ['./consumo-detalle.component.scss']
})
export class ConsumoDetalleComponent implements OnInit, OnDestroy {
    productos: any[] = [];
    formGroup: FormGroup = new FormGroup({});
    cantidadFormControl: FormControl = new FormControl('', emptyValidator);
    totalFormControl: FormControl = new FormControl('', emptyValidator);
    subs: Subscription[] = [];

    constructor(
        private currencyPipe: CurrencyPipe,
    ) { }

    ngOnInit(): void {
        this.cantidadFormControl.setValue(this.currencyPipe.transform(this.formGroup.get('cantidad').value, 'PYG', '', '', 'es-AR'));
        this.totalFormControl.setValue(this.currencyPipe.transform(this.formGroup.get('total').value, 'PYG', '', '', 'es-AR'))
        this.subs.push(this.formGroup.get('cantidad').valueChanges.subscribe({
            next: () => {
                let total = 0
                const producto = this.productos.find(p => p.id === this.formGroup.get('productoId').value);
                if (producto) {
                    total = Number(this.formGroup.get('cantidad').value) * Number(producto.precio);
                }
                this.formGroup.get('total').setValue(total);
                this.totalFormControl.setValue(this.currencyPipe.transform(this.formGroup.get('total').value, 'PYG', '', '', 'es-AR'))
            }
        }));
        this.formGroup.get('productoId').valueChanges.subscribe({
            next: () => {
                let total = 0
                const producto = this.productos.find(p => p.id === this.formGroup.get('productoId').value);
                if (producto) {
                    total = Number(this.formGroup.get('cantidad').value) * Number(producto.precio);
                }
                this.formGroup.get('total').setValue(total);
                this.totalFormControl.setValue(this.currencyPipe.transform(this.formGroup.get('total').value, 'PYG', '', '', 'es-AR'))
            }
        });
    }

    ngOnDestroy(): void {
        this.subs.forEach(sub => {
            sub.unsubscribe();
        })
    }

    changeCantidad(newValue: string): void {
        const value = this.asANumber(newValue);
        this.formGroup.get('cantidad')?.setValue(value);
        if (value === 0) {
            this.formGroup.get('cantidad')?.setErrors({required: true});
        }
    }

    changeTotal(newValue: string): void {
        const value = this.asANumber(newValue);
        this.formGroup.get('total')?.setValue(value);
        if (value === 0) {
            this.formGroup.get('total')?.setErrors({required: true});
        }
    }

    isADigit(event: any): boolean {
        if (event.key === '0') {
            return true;
        } else if (event.key === '1') {
            return true;
        } else if (event.key === '2') {
            return true;
        } else if (event.key === '3') {
            return true;
        } else if (event.key === '4') {
            return true;
        } else if (event.key === '5') {
            return true;
        } else if (event.key === '6') {
            return true;
        } else if (event.key === '7') {
            return true;
        } else if (event.key === '8') {
            return true;
        } else if (event.key === '9') {
            return true;
        }
        if (event.keyCode === 8 || event.keyCode === 9) {
            return true;
        }
        return false;
    }

    asANumber(value: string): number {
        const valueStr = value?.toString();
        if (valueStr) {
            let num = value?.toString().replace('.', '');
            num = num.replace(',', '.');
            return Number(num);
        }
        return 0;
    }
}
