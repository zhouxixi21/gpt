import { NgModule } from '@angular/core';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { GithubComponent } from './github.component';
import { GithubRoutingModule } from './github-routing.module';

@NgModule({
  declarations: [
    GithubComponent
  ],
  imports: [
    NzBreadCrumbModule,
    GithubRoutingModule,
    NzButtonModule,
    CommonModule,
    FormsModule,
    NzIconModule,
    NzCollapseModule,
    NzStepsModule,
    NzModalModule,
    NzInputModule,
    NzSpinModule,
    NzMessageModule,
    NzCardModule
  ],
  providers: [],
  bootstrap: [GithubComponent]
})
export class GithubModule { }
