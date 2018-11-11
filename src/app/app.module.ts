import { BrowserModule }      from '@angular/platform-browser';
import { NgModule }           from '@angular/core';
import { FormsModule }        from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule }  from '@angular/fire';
import { ReCaptchaModule }    from 'angular2-recaptcha';

import { AudioService }       from 'app/services/audio.service';
import { AudioStoreService }  from 'app/services/audio-store.service';
import { FbaseService }       from 'app/services/fbase.service';
import { JumbleService }      from 'app/services/jumble.service';
import { JumbleStoreService } from 'app/services/jumble-store.service';
import { TabStateService }    from 'app/services/tab-state.service';
import { VideoService }       from 'app/services/video.service';

import { AppComponent }           from './app.component';
import { PlayerComponent }        from './player/player.component';
import { FooterPlayerComponent }  from './footer-player/footer-player.component';
import { HeaderComponent }        from './header/header.component';
import { BlogEntryListComponent } from './blog-entry-list/blog-entry-list.component';
import { BlogEntryComponent } from './blog-entry/blog-entry.component';
import { HomeComponent }      from './home/home.component';
import { BioComponent }       from './bio/bio.component';
import { FooterComponent }    from './footer/footer.component';
import { VideoPlayerComponent } from './video-player/video-player.component';
import { TabContainerComponent } from './tab-container/tab-container.component';
import { MusicComponent } from './music/music.component';
import { TrackGroupComponent } from './track-group/track-group.component';
import { TopJumblesComponent } from './top-jumbles/top-jumbles.component';

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
    FooterPlayerComponent,
    HeaderComponent,
    BlogEntryListComponent,
    BlogEntryComponent,
    HomeComponent,
    BioComponent,
    FooterComponent,
    PlayerComponent,
    VideoPlayerComponent,
    TabContainerComponent,
    MusicComponent,
    TrackGroupComponent,
    TopJumblesComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    ReCaptchaModule
  ],
  providers: [
    FbaseService,
    AudioService,
    VideoService,
    JumbleStoreService,
    JumbleService,
    AudioStoreService,
    TabStateService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
