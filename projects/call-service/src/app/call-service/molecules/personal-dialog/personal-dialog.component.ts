import { Component, EventEmitter, Input, Output } from '@angular/core';
@Component({ selector: 'app-personal-dialog', template: `<p-dialog header="Búsqueda de Personal" [(visible)]="visible" [modal]="true" [style]="{width:'60vw'}" (onHide)="close()" role="dialog" aria-label="Búsqueda de personal"><div class="p-4"><div class="p-inputgroup mb-3"><input pInputText [(ngModel)]="searchValue" placeholder="Buscar personal"><button pButton icon="pi pi-search" (click)="onSearch()"></button></div></div><ng-template pTemplate="footer"><button pButton label="Cerrar" (click)="close()"></button></ng-template></p-dialog>` })
export class PersonalDialogComponent {
  @Input() visible = false; @Output() visibleChange = new EventEmitter<boolean>();
  @Output() personSelected = new EventEmitter<any>();
  searchValue = '';
  onSearch(): void {}
  close(): void { this.visible = false; this.visibleChange.emit(false); }
}
