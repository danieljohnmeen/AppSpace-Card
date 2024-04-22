import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BaseViewComponent } from './components/base-view/base-view.component';
import { EditingViewComponent } from './components/editing-view/editing-view.component';
import { ScreenshotViewComponent } from './components/screenshot-view/screenshot-view.component';
import { PlaybackViewComponent } from './components/playback-view/playback-view.component';
import { CardApiService } from './services/card-api-service/card-api.service';

@NgModule({
   declarations: [
      AppComponent,
      BaseViewComponent,
      EditingViewComponent,
      ScreenshotViewComponent,
      PlaybackViewComponent
   ],
   imports: [BrowserModule],
   providers: [CardApiService],
   bootstrap: [AppComponent]
})
export class AppModule {}
