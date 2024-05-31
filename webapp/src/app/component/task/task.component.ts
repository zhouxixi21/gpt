import { Component, Input, ViewEncapsulation } from "@angular/core";
import { ISHOWTASK } from "src/app/common/common.interface";

@Component({
  selector: 'app-task',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent{
  @Input() children: Array<ISHOWTASK> = []
  @Input() parentIndex: string = ''
  type: string = 'Step'
  constructor(){
    if(this.children && this.children.length > 0 && this.children[0].type == 'Process'){
      this.type = 'Process'
    }
  }
}