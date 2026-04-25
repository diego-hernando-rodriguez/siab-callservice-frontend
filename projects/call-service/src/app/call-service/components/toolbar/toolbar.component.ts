import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
  @Output() executeQuery = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();
  @Output() exit = new EventEmitter<void>();
  @Output() navigateFirst = new EventEmitter<void>();
  @Output() navigatePrevious = new EventEmitter<void>();
  @Output() navigateNext = new EventEmitter<void>();
  @Output() navigateLast = new EventEmitter<void>();
  @Output() print = new EventEmitter<void>();
  @Output() help = new EventEmitter<void>();
  @Output() createInexistentUser = new EventEmitter<void>();
  @Output() evaluations = new EventEmitter<void>();
  @Output() causeCharacteristics = new EventEmitter<void>();
}
