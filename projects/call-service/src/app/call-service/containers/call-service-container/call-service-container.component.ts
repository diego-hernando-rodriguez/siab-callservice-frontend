import { Component, HostListener, ViewChild, AfterViewInit } from '@angular/core';
import { TabView } from 'primeng/tabview';

/**
 * Main Call Service container implementing PrimeNG TabView with 5 tabs
 * matching Oracle Forms TEMPLATE canvas layout.
 * Includes full keyboard accessibility: Tab navigation, Ctrl+L, Ctrl+S, F9 shortcuts.
 */
@Component({
  selector: 'app-call-service-container',
  templateUrl: './call-service-container.component.html',
  styleUrls: ['./call-service-container.component.scss']
})
export class CallServiceContainerComponent implements AfterViewInit {
  activeTabIndex = 0;
  showCharacteristicsDialog = false;
  hasUnsavedChanges = false;

  @ViewChild('tabView') tabView!: TabView;

  ngAfterViewInit(): void {
    setTimeout(() => this.focusFirstFieldInTab(0), 200);
  }

  onTabChange(event: any): void {
    this.activeTabIndex = event.index;
    setTimeout(() => this.focusFirstFieldInTab(event.index), 100);
  }

  /**
   * Global keyboard shortcuts matching Oracle Forms behavior:
   * - Ctrl+L: Open cause characteristics (PB_CALLA equivalent)
   * - Ctrl+S: Save case
   * - F9: Open LOV popup on focused dropdown
   */
  @HostListener('document:keydown', ['$event'])
  handleKeyboardShortcuts(event: KeyboardEvent): void {
    // Ctrl+L: Cause characteristics
    if (event.ctrlKey && event.key === 'l') {
      event.preventDefault();
      this.showCharacteristicsDialog = true;
    }
    // Ctrl+S: Save
    if (event.ctrlKey && event.key === 's') {
      event.preventDefault();
      this.onSave();
    }
    // F9: LOV popup
    if (event.key === 'F9') {
      event.preventDefault();
      this.openLovOnFocusedField();
    }
  }

  onSave(): void {
    this.hasUnsavedChanges = false;
    // Trigger save action on the active tab's form
  }

  onExecuteQuery(): void { }

  onExit(): void {
    if (this.hasUnsavedChanges) {
      // Show confirmation dialog before exit
    }
  }

  onNavigateFirst(): void { }
  onNavigatePrevious(): void { }
  onNavigateNext(): void { }
  onNavigateLast(): void { }
  onPrint(): void { }
  onHelp(): void { }
  onCreateInexistentUser(): void { }
  onEvaluations(): void { }

  onCauseCharacteristics(): void {
    this.showCharacteristicsDialog = true;
  }

  /**
   * Focus management: moves focus to the first focusable field
   * of the newly active tab panel.
   */
  private focusFirstFieldInTab(tabIndex: number): void {
    const tabPanels = document.querySelectorAll('.p-tabview-panel');
    if (tabPanels && tabPanels[tabIndex]) {
      const focusableElements = tabPanels[tabIndex].querySelectorAll(
        'input:not([disabled]):not([readonly]), select:not([disabled]), textarea:not([disabled]), ' +
        'button:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
      );
      if (focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }
    }
  }

  /**
   * F9: Open LOV popup on the currently focused dropdown field.
   */
  private openLovOnFocusedField(): void {
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement) {
      const dropdown = activeElement.closest('.p-dropdown');
      if (dropdown) {
        (dropdown.querySelector('.p-dropdown-trigger') as HTMLElement)?.click();
      }
    }
  }
}
