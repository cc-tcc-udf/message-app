import { Component, Input, Optional } from "@angular/core";

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [],
  template: `
  <section class="error_"
    [style.backgroundImage]="'url(assets/img/svg/' + img + '.svg)'"
  >
    <span class="text-5xl font-bold">{{ title }}</span>
    <span class="text-xl">
      Por favor, verifique os seguintes pontos:
    </span>
    <ul class="text-2xl flex flex-column gap-2">
      <li>O endereço digitado pode estar incorreto.</li>
      <li>O recurso solicitado pode ter sido removido.</li>
      <li>Ocorreu um erro temporário no servidor.</li>
    </ul>
    <span [innerHTML]="sub" class="text-xl">
    </span> 
  </section>
  `,
  styles: `
  .error_ {
    height: 80dvh;
    background-repeat: no-repeat;
    background-position: bottom right;
    background-size: 30rem;
    display: flex;
    flex-direction: column;
    text-align: start;
    justify-content: center;
    gap: 1rem;
  }

  ul {
    margin: 0;
    padding: 0 0 0 1.5rem;
    list-style: disc;
  }

  .mt-3 {
    margin-top: 1rem;
  }
  `
})
export class ErrosComponent {
  @Input() img: string = '';
  @Input() title: string = '';
  @Optional() @Input() sub: string = '';
}
