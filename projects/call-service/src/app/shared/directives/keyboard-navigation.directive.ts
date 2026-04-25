import { Directive, HostListener, ElementRef } from '@angular/core';

/**
 * Keyboard navigation directive for consistent tab-order behavior.
 * Handles Tab key navigation matching Oracle Forms KEY-DOWN/KEY-UP/KEY-NEXT-ITEM behavior.
 */
@Directive({
  selector: '[appKeyboardNavigation]'
})
export class KeyboardNavigationDirective {

  constructor(private el: ElementRef) {}

  @HostListener('keydown.tab', ['$event'])
  onTab(event: KeyboardEvent): void {
    // Allow default tab behavior for form navigation
    // Add custom logic for cross-tab navigation if needed
  }

  @HostListener('keydown.shift.tab', ['$event'])
  onShiftTab(event: KeyboardEvent): void {
    // Allow default shift-tab behavior for reverse navigation
  }

  @HostListener('keydown.f9', ['$event'])
  onF9(event: KeyboardEvent): void {
    // F9: Open LOV popup on focused dropdown
    event.preventDefault();
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement) {
      // Trigger click on dropdown to open LOV
      const dropdown = activeElement.closest('.p-dropdown');
      if (dropdown) {
        (dropdown as HTMLElement).click();
      }
    }
  }
}
