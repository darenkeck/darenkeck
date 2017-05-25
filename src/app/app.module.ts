import { BrowserModule }      from '@angular/platform-browser';
import { NgModule }           from '@angular/core';
import { FormsModule }        from '@angular/forms';
import { HttpModule }         from '@angular/http';
import { MaterialModule }     from '@angular/material';
import { AngularFireModule }  from 'angularfire2';

import { AudioService }       from 'app/services/audio.service';
import { FbaseService }       from 'app/services/fbase.service';

import { AppComponent }           from './app.component';
import { JumbleComponent }        from './jumble/jumble.component';
import { FooterPlayerComponent }  from './footer-player/footer-player.component';
import { HeaderComponent }        from './header/header.component';
import { BlogEntryListComponent } from './blog-entry-list/blog-entry-list.component';
import { BlogEntryComponent } from './blog-entry/blog-entry.component';
import { HomeComponent }      from './home/home.component';
import { BioComponent }       from './bio/bio.component';
import { FooterComponent }    from './footer/footer.component';

// Initialize Firebase
export const firebaseConfig = {
  apiKey: "AIzaSyAbDAyNC9CnwHpKDJDoixWywn1RR37Ib8c",
  authDomain: "darenkeck-adb27.firebaseapp.com",
  databaseURL: "https://darenkeck-adb27.firebaseio.com",
  storageBucket: "darenkeck-adb27.appspot.com",
  messagingSenderId: "326721354959"
};

@NgModule({
  declarations: [
    AppComponent,
    JumbleComponent,
    FooterPlayerComponent,
    HeaderComponent,
    BlogEntryListComponent,
    BlogEntryComponent,
    HomeComponent,
    BioComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    MaterialModule.forRoot(),
    HttpModule
  ],
  providers: [
    AudioService,
    FbaseService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
