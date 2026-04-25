import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GeographicService } from '../../../shared/services/geographic.service';

@Component({
  selector: 'app-google-direction-dialog',
  templateUrl: './google-direction-dialog.component.html'
})
export class GoogleDirectionDialogComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() addressSelected = new EventEmitter<any>();

  searchAddress = '';
  results: any[] = [];

  constructor(private geographicService: GeographicService) {}

  onSearch(): void {
    // Search Google Maps addresses via backend
  }

  onSelect(address: any): void {
    this.addressSelected.emit(address);
    this.close();
  }

  close(): void { this.visible = false; this.visibleChange.emit(false); }
}
