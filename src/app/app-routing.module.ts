import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainPageComponent } from './components/main-page/main-page.component';
import { MeetingsPageComponent } from './components/meetings-page/meetings-page.component';


const routes: Routes = [
    {
        path: '',
        component: MainPageComponent
    },
    {
        path: 'meetings',
        component: MeetingsPageComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
