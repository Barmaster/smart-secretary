import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { MaterialDesignModule } from './material-design.module';
import { MainPageComponent } from './components/main-page/main-page.component';
import { AudioVisualizerComponent } from './components/audio-visualizer/audio-visualizer.component';
import { MeetingsPageComponent } from './components/meetings-page/meetings-page.component';
import { TranscriptModalComponent } from './components/meetings-page/transcript-modal.component';


@NgModule({
    declarations: [
        AppComponent,
        MainPageComponent,
        AudioVisualizerComponent,
        MeetingsPageComponent,
        TranscriptModalComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MaterialDesignModule,
        FormsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
