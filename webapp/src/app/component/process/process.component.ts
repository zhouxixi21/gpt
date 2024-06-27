import { Component, EventEmitter, Input, Output, ViewEncapsulation } from "@angular/core";
import { ISHOWTASK } from "src/app/common/common.interface";

@Component({
  selector: 'app-process',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.scss']
})
export class ProcessComponent{
  children: Array<ISHOWTASK> = []
  @Input('children')
  set setChildren(children:any){
    this.children = children

  }
  @Output() selectChange = new EventEmitter();
  @Input() parentIndex: string = ''
  openChildrenItem(index: number, status:boolean){
    this.children[index].selected = status
    this.open(this.parentIndex + (index + 1), !status)
  }
  open(index: string, status: boolean){
    this.selectChange.emit({index: index, status: status})
  }
}