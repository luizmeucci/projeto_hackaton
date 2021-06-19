import { Component, Input, OnInit } from '@angular/core';
import { SobreModel } from 'src/app/services/sobre-model';

@Component({
  selector: 'app-sobre-card',
  templateUrl: './sobre-card.component.html',
  styleUrls: ['./sobre-card.component.css']
})
export class SobreCardComponent implements OnInit {

  @Input() sobre: SobreModel | undefined

  constructor() { }

  ngOnInit(): void {
  }

}
