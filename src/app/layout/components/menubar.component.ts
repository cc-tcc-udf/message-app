import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
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
  encapsulation: ViewEncapsulation.None
})
export class MenuBarComponent implements OnInit {
  private router = inject(Router);
  items: MenuItem[] | undefined;

  ngOnInit(): void {
    this.items = [
      { label: 'Home', icon: 'bi bi-house' },
      {
        label: 'Mensagem', icon: 'bi bi-chat-square-text-fill',
        items: [
          { label: 'Mensagens', icon: 'bi bi-card-list', command: () => { this.navigate('msg') } },
        ]
      },
      { label: 'Configurações', icon: 'bi bi-sliders', command: () => { this.navigate('configs') } },
      { label: 'Perfil', icon: 'bi bi-person-circle' },

      // {
      //   label: 'Features',
      //   icon: 'pi pi-star'
      // },
      // {
      //   label: 'Projects',
      //   icon: 'pi pi-search',
      //   items: [
      //     {
      //       label: 'Components',
      //       icon: 'pi pi-bolt'
      //     },
      //     {
      //       label: 'Blocks',
      //       icon: 'pi pi-server'
      //     },
      //     {
      //       label: 'UI Kit',
      //       icon: 'pi pi-pencil'
      //     },
      //     {
      //       label: 'Templates',
      //       icon: 'pi pi-palette',
      //       items: [
      //         {
      //           label: 'Apollo',
      //           icon: 'pi pi-palette'
      //         },
      //         {
      //           label: 'Ultima',
      //           icon: 'pi pi-palette'
      //         }
      //       ]
      //     }
      //   ]
      // },
      // {
      //   label: 'Contact',
      //   icon: 'bi bi-envelope'
      // }
    ]
  }

  private navigate(rota: string) {
    this.router.navigate([rota]);
  }

}
