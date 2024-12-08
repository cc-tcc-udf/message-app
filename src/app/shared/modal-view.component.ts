import { NgClass, NgIf } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { FileApp } from "@models/File";
import { DynamicDialogConfig } from "primeng/dynamicdialog";

@Component({
  selector: 'app-modal-view',
  imports: [NgClass, NgIf],
  standalone: true,
  template: `
  @if(safeUrl){
      <iframe [src]="safeUrl" width="100%" height="100%" frameborder="0"></iframe>
  }
  @if(fileExterno) {    
    <section class="flex text-center h-full flex-column justify-content-between gap-1 align-items-center">
      <i style="font-size: 4rem;" class="icon_ bi" [ngClass]="getClass()"></i>
      <span *ngIf="anexo?.name">{{anexo?.name}}</span>
      <p class="m-0 font-semibold">Será necessário fazer <strong>download</strong> do arquivo para visualização em aplicações externas.</p>
      <button [ngClass]="getExtension()+'_'" class="success theme" (click)="download()">Baixar arquivo<i class="bi text-xl bi-file-earmark-arrow-down-fill"></i></button>
    </section>
  }
  @if(link){
    <section class="flex h-full flex-column justify-content-between align-items-center">
      <i style="font-size: 4rem;" class="icon_ text-blue-500 bi bi-link-45deg"></i>
      <p class="m-0">Você sera direcionado para uma guia externa!</p>
      <button class="success doc_ theme" (click)="open()">Abrir <i class="bi bi-box-arrow-up-right"></i></button>
    </section>
  }
  `
})
export class ModalViewComponent implements OnInit {
  safeUrl: SafeResourceUrl | null = null;
  fileExterno: boolean = false;
  link: string | null = null;
  anexo!: File | FileApp | null;

  constructor(
    private sanitizer: DomSanitizer,
    private config: DynamicDialogConfig
  ) { }

  ngOnInit(): void {
    const data = this.config.data;
    if (typeof data === 'string') {
      this.link = data;
    } else {
      this.anexo = data;
      const extension = data.name.split('.').pop()?.toLowerCase();
      if (extension === 'pdf') {
        const url = this.getUrl(data);
        this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      } else {
        this.fileExterno = true;
      }
    }
  }


  getUrl(anexo: File | FileApp | null): string {
    if (anexo instanceof File) {
      return URL.createObjectURL(anexo);
    } else {
      return (anexo as FileApp).url;
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
  open() {
    if (this.link) {
      window.open(this.link, '_blank');
    }
  }
}
