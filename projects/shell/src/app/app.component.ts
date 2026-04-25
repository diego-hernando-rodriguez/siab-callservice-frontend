import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <header class="app-header">
        <h1>SIAB - Sistema de Información Asistencia Bolívar</h1>
      </header>
      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container { min-height: 100vh; display: flex; flex-direction: column; }
    .app-header { background: #1565C0; color: white; padding: 0.5rem 1rem; }
    .app-header h1 { margin: 0; font-size: 1.2rem; }
    main { flex: 1; padding: 1rem; }
  `]
})
export class AppComponent {
  title = 'SIAB Call Service';
}
