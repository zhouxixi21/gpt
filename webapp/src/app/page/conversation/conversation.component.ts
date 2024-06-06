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
  selectedIndex: Array<string> = []
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
  currentIndex = 1
  constructor(private gptService: GPTService, private message: NzMessageService) { }
  initData(selectIndex:number){
    this.loadData(selectIndex)
    this.refreshEvent = setInterval(()=>{
      
      this.loadData(selectIndex)
    }, 10000)
    
  }
  loadData(selectIndex: number){
    this.gptService.getRobotList().then((res)=>{
      let currentStatus = 'In Progress'
      this.userList = res.map((robot: IROBOT, index: number) => {
        if(index == selectIndex) {
          this.selectedUser = {
            id: robot.id,
            name: robot.name,
            status: robot.status,
            lastMessage: robot.lastMessage,
            selected: index == selectIndex
          }
          currentStatus = robot.status
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
        if(currentStatus == 'Online'){
          clearInterval(this.refreshEvent)
        }
      })

    })
  }
  changeSelectedIndex(event: any,conversationIndex: any){
    console.log(event)
    if(event.status == true){
      this.selectedIndex = this.selectedIndex.filter(item=>{return item != conversationIndex + '-' + event.index})

    } else {
      this.selectedIndex.push(conversationIndex + '-' + event.index)
    }
  }
  formatConversation(conversationListInput:Array<ISHOWQUESTION>){
    if(this.selectedIndex.length > 0){
      let selectConversationIndex = parseInt(this.selectedIndex[0].split('-')[0])
      let selectTaskIndex = parseInt(this.selectedIndex[0].split('-')[1]) - 1
      for(let i = 0; i < conversationListInput.length; i++){
        let task = conversationListInput[i].task
        if(selectConversationIndex == i){
          conversationListInput[i].selectIndex = selectTaskIndex + 1
        }

        if(task && !(task.length == 1 &&(!task[0].children || task[0].children.length == 0) && task[0].name == '' && task[0].output != '')){
          if(selectConversationIndex == i){
            conversationListInput[i].selectedTask = task[selectTaskIndex]
          }
          for(let j = 0; j < task.length; j++){
            let selectedTask = selectConversationIndex == i && selectTaskIndex == j
            task[j].selected = selectedTask
            if(selectedTask){
              let parentIndex = selectConversationIndex + '-' + (selectTaskIndex + 1)
              this.formatChildrenOpen(task[j].children, parentIndex)
            }
          }
        }
      }
      
    } else {
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
            if(task.length > 0){
              task[0].selected = true;
              conversationListInput[i].selectedTask = task[0];
              conversationListInput[i].selectIndex = 1; 
  
            }
            
  
          }
        }
      }
    }
    
    
  }
  formatChildrenOpen(children: Array<ISHOWTASK> | undefined, parentIndex: string){
    if(children){
      for (let index = 0; index < children.length; index++) {
        let showIndex = parentIndex + '-' + (index + 1)
        if(this.selectedIndex.indexOf(showIndex) != -1){
          children[index].selected = true
        } else {
          children[index].selected = false
        }
        if(this.selectedIndex.indexOf(showIndex + '-input') != -1){
          children[index].inputOpen = true
        } else {
          children[index].inputOpen = false
        }
        if(this.selectedIndex.indexOf(showIndex + '-output') != -1){
          children[index].outputOpen = true
        } else {
          children[index].outputOpen = false
        }
        if(children[index].children){
          this.formatChildrenOpen(children[index].children,showIndex)
        }
      }
    }
  }
  selectTask(task: ISHOWTASK,question: ISHOWQUESTION, index: number){
    this.selectedIndex = []
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
    if(this.answer && this.selectedUser.status != 'In Progress'){
      this.gptService.sendMessage(this.selectedUser.id,this.answer).then(data=>{
        this.message.success('Send Message Successfully!').onClose.subscribe(item=>{
          this.initData(0)
        })
      })
    }
    
  }
}
