import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MenuTemplateComponent } from './components/menu-template/menu-template.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { SobreTemplateComponent } from './components/sobre-template/sobre-template.component';
import { HomeTemplateComponent } from './components/home-template/home-template.component';
import { AjudaTemplateComponent } from './components/ajuda-template/ajuda-template.component';
import { MatCardModule } from '@angular/material/card';
import { AjudaCardComponent } from './components/ajuda-card/ajuda-card.component';
import { HttpClientModule } from '@angular/common/http';
import {MatFormFieldModule} from '@angular/material/form-field';
import { CadastroTemplateComponent } from './components/cadastro-template/cadastro-template.component';
import {MatInputModule} from '@angular/material/input';

@NgModule({
  declarations: [
    AppComponent,
    MenuTemplateComponent,
    SobreTemplateComponent,
    HomeTemplateComponent,
    AjudaTemplateComponent,
    AjudaCardComponent,
    CadastroTemplateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    HttpClientModule,
    MatInputModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
