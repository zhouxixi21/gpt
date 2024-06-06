import { Component, EventEmitter, Input, Output, ViewEncapsulation } from "@angular/core";
import { ISHOWTASK } from "src/app/common/common.interface";

@Component({
  selector: 'app-task',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent{
  children: Array<ISHOWTASK> = []
  @Input('children')
  set setChildren(childrenInput: Array<ISHOWTASK>){
    this.children = childrenInput
    console.log(this.children)
  }
  @Input() parentIndex: string = ''
  @Output() selectChange = new EventEmitter()
  type: string = 'Step'
  constructor(){
    if(this.children && this.children.length > 0 && this.children[0].type == 'Process'){
      this.type = 'Process'
    }
  }
  open(index: string, status: boolean){
    this.selectChange.emit({index: index, status: status})
  }
  openChildren(event: any){
    this.selectChange.emit(event)
  }
}