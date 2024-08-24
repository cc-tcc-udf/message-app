import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  columns = [
    { name: 'Tipo de Formação', property: 'tipoFormacao', visible: true },
    { name: 'Curso', property: 'curso', visible: true },
    { name: 'Instituição', property: 'instituicao', visible: true },
    { name: 'Ano de Conclusão', property: 'anoConclusao', visible: true },
    { name: 'Ações', property: 'actions', visible: true }
  ];
  dataSource: unknown[] = [];
  visibleColumns: string[] = [];

  ngOnInit(): void {
    const data = [
      { tipoFormacao: 'Graduação', curso: 'Direito', instituicao: 'UNB', anoConclusao: '1902' },
      { tipoFormacao: 'Graduação', curso: 'Direito', instituicao: 'UNB', anoConclusao: '1902' },
      { tipoFormacao: 'Graduação', curso: 'Direito', instituicao: 'UNB', anoConclusao: '1902' }
    ];
    this.dataSource = data;
  }
  editar(dado: unknown): void {
    console.log('Editar:', dado);
    // Lógica para editar
  }

  excluir(dado: unknown): void {
    console.log('Excluir:', dado);
    // Lógica para excluir
  }
}
