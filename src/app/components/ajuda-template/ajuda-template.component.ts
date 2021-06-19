import { Component, OnInit } from '@angular/core';
import { AjudaModel } from 'src/app/services/ajuda-model';
import { AjudaApiService} from 'src/app/services/ajuda-api.service';

@Component({
  selector: 'app-ajuda-template',
  templateUrl: './ajuda-template.component.html',
  styleUrls: ['./ajuda-template.component.css']
})
export class AjudaTemplateComponent implements OnInit {


  listaDeAjuda: AjudaModel[] = [];
  validacao: boolean = false;

  constructor(public ajudaApi: AjudaApiService) { }

  ngOnInit(): void {

    this.ajudaApi.get().subscribe({
      next: (retornoDaApi) => {
        this.listaDeAjuda = retornoDaApi;
      }
    });
}

mostrarComponentes(){
  this.validacao = !this.validacao;
}
}
