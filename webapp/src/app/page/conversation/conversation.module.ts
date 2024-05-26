import { NgModule } from '@angular/core';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { ConversationRoutingModule } from './conversation-routing.module';
import { ConversationComponent } from './conversation.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { TaskComponent } from 'src/app/component/task/task.component';

@NgModule({
  declarations: [
    ConversationComponent,
    TaskComponent
  ],
  imports: [
    NzBreadCrumbModule,
    ConversationRoutingModule,
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
  bootstrap: [ConversationComponent,TaskComponent]
})
export class ConversationModule { }
