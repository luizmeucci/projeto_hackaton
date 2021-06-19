import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AjudaTemplateComponent } from './components/ajuda-template/ajuda-template.component';
import { HomeTemplateComponent } from './components/home-template/home-template.component';
import { MenuTemplateComponent } from './components/menu-template/menu-template.component';
import { SobreTemplateComponent } from './components/sobre-template/sobre-template.component';
import { CadastroTemplateComponent } from './components/cadastro-template/cadastro-template.component';

const routes: Routes = [
  {
    path: '',
    component: MenuTemplateComponent,
    children: [{
      path:'',
      component: HomeTemplateComponent
    },
    {
      path: 'sobre',
      component: SobreTemplateComponent
    },
    {
      path: 'ajuda',
      component: AjudaTemplateComponent
    },

    {
      path: 'cadastro',
      component: CadastroTemplateComponent
    }
  ]

  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
