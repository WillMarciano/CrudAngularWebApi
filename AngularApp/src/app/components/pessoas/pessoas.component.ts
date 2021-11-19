import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Pessoa } from 'src/app/Pessoa';
import { PessoasService } from 'src/app/pessoas.service';

@Component({
  selector: 'app-pessoas',
  templateUrl: './pessoas.component.html',
  styleUrls: ['./pessoas.component.css']
})
export class PessoasComponent implements OnInit {

  formulario: any;
  tituloFormulario: string;

  constructor(private pessoasService: PessoasService) { }

  ngOnInit(): void {

    this.tituloFormulario = 'Nova Pessoa';
    this.formulario = new FormGroup({
      nome: new FormControl(null),
      sobrenome: new FormControl(null),
      idade: new FormControl(null),
      profissao: new FormControl(null)
    });
  }
  EnviarFormulario(): void {
    const pessoa: Pessoa = this.formulario.value;
    this.pessoasService.Post(pessoa).subscribe(resultado => {
      alert('Registro Inserido com sucesso');
    });
  }
}
