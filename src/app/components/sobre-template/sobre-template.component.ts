import { Component, OnInit } from '@angular/core';
import { SobreApiService } from 'src/app/services/sobre-api.service';
import { SobreModel } from 'src/app/services/sobre-model';

@Component({
  selector: 'app-sobre-template',
  templateUrl: './sobre-template.component.html',
  styleUrls: ['./sobre-template.component.css']
})
export class SobreTemplateComponent implements OnInit {

  listaDeInfo: SobreModel[] = []

  constructor(public sobreApi: SobreApiService) { }

  ngOnInit(): void {
    this.sobreApi.get().subscribe({
      next: (retornoDaApi) => {
        this.listaDeInfo = retornoDaApi;
      }
    });
  }

}
