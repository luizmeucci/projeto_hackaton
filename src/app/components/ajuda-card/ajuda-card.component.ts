import { Component, Input, OnInit } from '@angular/core';
import { AjudaModel } from 'src/app/services/ajuda-model';

@Component({
  selector: 'app-ajuda-card',
  templateUrl: './ajuda-card.component.html',
  styleUrls: ['./ajuda-card.component.css']
})
export class AjudaCardComponent implements OnInit {

  @Input() ajuda: AjudaModel | undefined

  constructor() { }

  ngOnInit(): void {
  }

}
