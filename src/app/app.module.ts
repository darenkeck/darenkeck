import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';

import { AppComponent } from './app.component';
import { JumbleComponent } from './jumble/jumble.component';
import { FooterPlayerComponent } from './footer-player/footer-player.component';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    JumbleComponent,
    FooterPlayerComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MaterialModule.forRoot(),
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
