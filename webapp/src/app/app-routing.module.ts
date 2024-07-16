import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/conversation',
    pathMatch: 'full'
  },
  {
    path: 'conversation',
    loadChildren: () => import('./page/conversation/conversation.module').then(m => m.ConversationModule)
  },
  {
    path: 'properties',
    loadChildren: () => import('./page/properties/properties.module').then(m => m.PropertiesModule)
  },
  {
    path: 'github',
    loadChildren: () => import('./page/github/github.module').then(m => m.GithubModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
