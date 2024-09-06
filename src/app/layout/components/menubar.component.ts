import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth/auth.service';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-menu-bar',
  standalone: true,
  imports: [MenubarModule],
  template: `
    <section class="w-full h-full flex-column justify-content-center align-items-center flex">
      <p-menubar [model]="items" />
    </section>
  `,
  styles: [`
    .p-menubar {
      padding: 0.5rem;
      background: none;
      color: #4b5563;
      border: none;
      border-radius: 6px;
    }
  `],
  providers: [AuthService],
  encapsulation: ViewEncapsulation.None
})
export class MenuBarComponent implements OnInit {
  private router = inject(Router);
  private auth = inject(AuthService);
  items: MenuItem[] | undefined;

  ngOnInit(): void {
    this.items = [
      { label: 'Home', icon: 'bi bi-house', command: () => { this.navigate('home') } },
      {
        label: 'Mensagem', icon: 'bi bi-chat-square-text-fill',
        items: [
          { label: 'Mensagens', icon: 'bi bi-card-list', command: () => { this.navigate('msg') } },
        ]
      },
      { label: 'Configurações', icon: 'bi bi-sliders', command: () => { this.navigate('configs') } },
      { label: 'Perfil', icon: 'bi bi-person-circle', command: () => { this.navigate('users') } },
      { label: 'Sair', icon: 'bi bi-box-arrow-left', command: () => { this.auth.logout() } }
    ]
  }

  private navigate(rota: string) {
    this.router.navigate([rota]);
  }

}
