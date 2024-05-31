import { Component, Input, ViewEncapsulation } from "@angular/core";
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
    this.children.forEach(childrenItem=>{
      childrenItem.selected = false
    })
  }
  @Input() parentIndex: string = ''
  openChildrenItem(index: number, status:boolean){
    this.children[index].selected = status
  }
}