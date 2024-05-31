import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { IROBOT, ISHOWQUESTION, ISHOWROBOT, ISHOWTASK } from 'src/app/common/common.interface';
import { GPTService } from 'src/app/service/gpt.service';

@Component({
  selector: 'app-conversation',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent implements OnInit{
  userList: Array<ISHOWROBOT> = []
  conversationList: Array<ISHOWQUESTION> = []
  collapseMenu = false
  answer = ''
  refreshEvent:any = {}
  selectedUser: ISHOWROBOT = {
    id: -1,
    name: '',
    status: '',
    lastMessage: '',
  }
  ngOnInit(): void {
    this.initData(0)
  }
  changeCollapseMenu(){
    this.collapseMenu = !this.collapseMenu
  }
  constructor(private gptService: GPTService, private message: NzMessageService) { }
  initData(selectIndex:number){
    clearInterval(this.refreshEvent)
    this.gptService.getRobotList().then((res)=>{
      this.userList = res.map((robot: IROBOT, index: number) => {
        if(index == selectIndex) {
          this.selectedUser = {
            id: robot.id,
            name: robot.name,
            status: robot.status,
            lastMessage: robot.lastMessage,
            selected: index == selectIndex
          }
        }
        return {
          id: robot.id,
          name: robot.name,
          status: robot.status,
          lastMessage: robot.lastMessage,
          selected: index == selectIndex
        }
      });
      this.gptService.getConversation(this.userList[selectIndex].id).then((res:Array<ISHOWQUESTION>)=>{
        this.formatConversation(res)
        this.conversationList = res
      })
      
      
    })
  }
  formatConversation(conversationListInput:Array<ISHOWQUESTION>){
    for(let i = 0; i < conversationListInput.length; i++){
      let task = conversationListInput[i].task
      if(task && !(task.length == 1 &&(!task[0].children || task[0].children.length == 0) && task[0].name == '' && task[0].output != '')){
        let hasInprogress = false
        for(let j = 0; j < task.length; j++){
          if(task[j].status == 'In Progress'){
            task[j].selected = true;
            hasInprogress = true
            conversationListInput[i].selectedTask = task[j]; 
            conversationListInput[i].selectIndex = j + 1
          } else {
            task[j].selected = false;
          }
        }
        if(!hasInprogress){
          console.log(task)
          if(task.length > 0){
            task[0].selected = true;
            conversationListInput[i].selectedTask = task[0];
            conversationListInput[i].selectIndex = 1; 

          }
          

        }
      }
    }
  }
  selectTask(task: ISHOWTASK,question: ISHOWQUESTION, index: number){
    if(task.selected || task.status == 'Waiting'){
      return
    }
    question.selectedTask = task
    question.selectIndex = index + 1
    question.task?.forEach((taskItem)=>{
      if(task.id == taskItem.id){
        taskItem.selected = true
      } else {
        taskItem.selected = false
      }
    })
  }
  checkConversationOpen(conversation: ISHOWQUESTION){
    return conversation.task? conversation.task.some((task: ISHOWTASK) => task.selected): false
  }
  checkStatus(tasks:Array<ISHOWTASK>){
    tasks.forEach((task)=>{
      task.selected = task.status == 'In Progress'
      if(task.children){
        this.checkStatus(task.children)
      }
    })
  }

  selectUser(user:ISHOWROBOT){
    let selectIndex = this.userList.findIndex(item=>{return item.id == user.id})
    if(selectIndex != -1){
      this.initData(selectIndex)
    } else {
      this.initData(0)
    }
  }
  submit(){
    if(this.answer){
      this.gptService.sendMessage(this.selectedUser.id,this.answer).then(data=>{
        this.message.success('Send Message Successfully!').onClose.subscribe(item=>{
          
        })
      })
    }
    
  }
}
