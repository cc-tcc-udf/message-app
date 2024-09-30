import { NgClass, NgIf } from "@angular/common";
import { Component, inject, Input, Type } from "@angular/core";
import { Router } from "@angular/router";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";

@Component({
  selector: 'app-new-button',
  standalone: true,
  styleUrl: './shared.scss',
  imports: [NgIf, NgClass],
  providers: [DialogService],
  template: `
    <section class="flex py-2 justify-content-end">
        <button
          aria-label="button-action"
          class="add default"
          (click)="handleClick()"
        >
          <i *ngIf="icon" class="text-xl font-semibold bi pr-1" [ngClass]="icon"></i>
          {{ buttonText }}
        </button>
      </section>
  `
})
export class NewButtonComponent {
  @Input() buttonText: string = 'Novo'; // Texto do botão
  @Input() icon?: string; // Ícone do botão (classe CSS do ícone)
  @Input() navigateTo?: string; // Rota para navegação
  @Input() modalComponent?: Type<unknown>; // Componente do modal a ser aberto
  @Input() modalTitle?: string; // Componente do modal a ser aberto
  @Input() modalData?: unknown; // Dados a serem passados para o modal
  @Input() onModalClose?: (result: unknown) => void; // Função de callback para quando o modal fechar
  private dialog = inject(DialogService);
  private router = inject(Router);

  openModal() {
    if (this.modalComponent) {
      const ref: DynamicDialogRef = this.dialog.open(this.modalComponent, {
        header: this.modalTitle,
        width: '30vw',
        height: 'auto',
        modal: true,
        data: this.modalData,
        draggable: true
      });
      ref.onClose.subscribe(result => {
        if (this.onModalClose) {
          this.onModalClose(result);
        }
      });
    }
  }

  handleClick() {
    if (this.navigateTo) {
      this.navigate();
    } else if (this.modalComponent) {
      this.openModal();
    }
  }

  navigate() {
    this.router.navigate([this.navigateTo]);
  }
}