import { NgClass } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { FileApp } from "@models/File";
import { DynamicDialogConfig } from "primeng/dynamicdialog";

@Component({
  selector: 'app-modal-view',
  imports: [NgClass],
  standalone: true,
  template: `
  @if(safeUrl){
      <iframe [src]="safeUrl" width="100%" height="100%" frameborder="0"></iframe>
  }@else {    
    <section class="flex flex-column gap-1 align-items-center">
      <i style="font-size: 4rem;" class="icon_ bi" [ngClass]="getClass()"></i>
      <p class="m-0">Será necessário fazer download do arquivo para visualização em aplicações externas.</p>
      <button class="success theme" (click)="download()">Baixar arquivo</button>
    </section>
  }
  `,
})
export class ModalViewComponent implements OnInit {
  safeUrl: SafeResourceUrl | null = null;
  anexo!: File | FileApp | null;

  constructor(
    private sanitizer: DomSanitizer,
    private config: DynamicDialogConfig
  ) { }

  ngOnInit(): void {
    const data = this.config.data;
    this.anexo = data;
    if (data) {
      const extension = data.name.split('.').pop()?.toLowerCase();
      if (extension === 'pdf') {
        const url = this.getUrl(data);
        this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      }
    }
  }

  getUrl(anexo: File | FileApp | null): string {
    if (anexo instanceof File) {
      return URL.createObjectURL(anexo); // Para arquivos locais
    } else {
      return (anexo as FileApp).url; // Para arquivos já disponíveis por URL
    }
  }

  getClass(): string {
    const extension = this.getExtension();
    switch (extension) {
      case 'pdf':
        return 'bi-file-earmark-pdf-fill ' + extension;
      case 'doc':
      case 'docx':
        return 'bi-file-earmark-word-fill ' + extension;
      case 'xls':
      case 'xlsx':
        return 'bi-file-earmark-excel-fill ' + extension;
      case 'csv':
        return 'bi-filetype-csv ' + extension;
      default:
        return 'bi-file-earmark-fill ' + 'file_';
    }
  }
  getExtension() {
    const name = this.anexo?.name;
    return name?.split('.').pop()?.toLowerCase();
  }

  download() {
    const data = this.config.data;
    if (data) {
      const url = this.getUrl(data);
      if (typeof url === 'string') {
        const a = document.createElement('a');
        a.href = url;
        a.download = data.name; // Define o nome do arquivo
        a.click();
      }
    }
  }
}
