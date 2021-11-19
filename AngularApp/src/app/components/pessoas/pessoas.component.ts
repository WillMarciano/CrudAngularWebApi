import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
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
  pessoas: Pessoa[];
  nomePessoa: string;
  pessoaId: number;

  visibilidadeTabela: boolean = true;
  visibilidadeFormulario: boolean = false;

  modalRef: BsModalRef;

  constructor(private pessoasService: PessoasService,
    private modalService: BsModalService) { }

  ngOnInit(): void {

    this.pessoasService.GetAll().subscribe(resultado => {
      this.pessoas = resultado
    });
  }

  InterruptorTabelas(): void {
    if (this.visibilidadeTabela == true) {
      this.visibilidadeTabela = false;
      this.visibilidadeFormulario = true;
    }
    else {
      this.visibilidadeTabela = true;
      this.visibilidadeFormulario = false;
    }
  }

  Formulario(newPessoaId = 0, newNome?, newSobrenme?, newIdade?, newProfissao?): void {
    this.formulario = new FormGroup({
      pessoaId: new FormControl(newPessoaId),
      nome: new FormControl(newNome),
      sobrenome: new FormControl(newSobrenme),
      idade: new FormControl(newIdade),
      profissao: new FormControl(newProfissao),
    });
  }

  ExibirFormularioCadastro(): void {
    this.InterruptorTabelas();
    this.tituloFormulario = 'Nova Pessoa';
    this.Formulario();
  }

  ExibirFormularioAtualizacao(pessoaId): void {
    this.InterruptorTabelas();

    this.pessoasService.GetById(pessoaId).subscribe((resultado) => {
      this.tituloFormulario = `Atualizar ${resultado.nome} ${resultado.sobrenome}`;
      this.Formulario(resultado.pessoaId, resultado.nome, resultado.sobrenome, resultado.idade, resultado.profissao);
    });
  }

  EnviarFormulario(): void {
    const pessoa: Pessoa = this.formulario.value;

    if (pessoa.pessoaId > 0) {
      this.pessoasService.Put(pessoa).subscribe((resultado) => {
        this.visibilidadeFormulario = false;
        this.visibilidadeTabela = true;
        alert('Pessoa atualizada com sucesso');
        this.pessoasService.GetAll().subscribe((registros) => {
          this.pessoas = registros;
        });
      });
    } else {
      this.pessoasService.Post(pessoa).subscribe((resultado) => {
        this.visibilidadeFormulario = false;
        this.visibilidadeTabela = true;
        alert('Pessoa inserida com sucesso');
        this.pessoasService.GetAll().subscribe((registros) => {
          this.pessoas = registros;
        });
      });
    }
  }

  Voltar(): void {
    this.InterruptorTabelas();
  }

  ExibirConfirmacaoExclusao(pessoaId, nomePessoa, conteudoModal: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(conteudoModal);
    this.pessoaId = pessoaId;
    this.nomePessoa = nomePessoa;
  }

  ExcluirPessoa(pessoaId) {
    this.pessoasService.Delete(pessoaId).subscribe(resultado => {
      this.modalRef.hide();
      alert('Pessoa excluída com sucesso');
      this.pessoasService.GetAll().subscribe(registros => {
        this.pessoas = registros;
      });
    });
  }
}
