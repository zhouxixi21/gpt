import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { IISSUE, IROBOT, ISHOWQUESTION, ISHOWROBOT, ISHOWTASK } from 'src/app/common/common.interface';
import { GPTService } from 'src/app/service/gpt.service';
import { StorageService } from 'src/app/service/storage.service';

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
  selectId: string | undefined = undefined
  completeList:any[] = []
  inProgressList:any[] = []
  answer = ''
  startIssueRefresh:boolean = false
  getIssueStatus: boolean = false
  issueList: Array<IISSUE> = []
  refreshEvent:any = {}
  refreshIssueEvent: any = {}
  selectedUser: ISHOWROBOT = {
    id: '',
    name: '',
    status: '',
    lastMessage: '',
  }
  ngOnInit(): void {
    this.startLoadIssue()
    
    this.loadData(this.selectId)
    this.refreshEvent = setInterval(()=>{
      this.loadData(this.selectId)
    }, 5000)  
  }
  async loadIssue(){
    let res = await this.gptService.getIssueList()
    if(res.length == 0){
      this.getIssueStatus = false
    } else {
      this.getIssueStatus = true
      this.issueList = res
      for (let index = 0; index < res.length; index++) {
        let id = ''
        let name = ''
        let answer = res[index].body
        let issue  = res[index].title
        let repo = res[index].repo
        if(this.selectedUser.status == 'Online'){
          id = this.selectedUser.id
          name = this.selectedUser.name
          this.gptService.sendMessage(answer,issue,repo).then(data=>{
            this.message.success('Github issue has assign to ' + name + '!').onClose.subscribe(item=>{
              this.loadData(this.selectId)
            })
          })
        }
        
      }
      
    }
    
  }
  endLoadIssue(){
    this.startIssueRefresh = false
    this.getIssueStatus = false
    this.issueList = []
  }
  startLoadIssue(){
    this.startIssueRefresh = true
    this.getIssueStatus = false
    this.issueList = []
    this.refreshIssueEvent = setInterval(()=>{
      this.loadIssue()
    }, 5000)
  }
  changeCollapseMenu(){
    this.collapseMenu = !this.collapseMenu
  }
  currentIndex = 1
  constructor(private gptService: GPTService, private message: NzMessageService) { }
  
  loadData(selectId: string | undefined){
    this.gptService.getRobotList().then((res)=>{
      if(selectId == undefined){
        selectId = res[res.length - 1].id
      }
      this.completeList = []
      this.inProgressList = []
      let selectIndex = 0
      this.userList = res.map((robot: IROBOT, index: number) => {
        if(robot.status == 'Online'){
          this.completeList.push(robot)
        } else {
          this.inProgressList.push(robot)
        }
        if(robot.id == selectId) {
          selectIndex = index
          this.selectedUser = {
            id: robot.id,
            name: robot.name,
            status: robot.status,
            lastMessage: robot.lastMessage,
            selected: robot.id == selectId
          }
        }
        return {
          id: robot.id,
          name: robot.name,
          status: robot.status,
          lastMessage: robot.lastMessage,
          selected: robot.id == selectId
        }
      }); 
      this.gptService.getConversation(this.userList[selectIndex].id).then((res:Array<ISHOWQUESTION>)=>{
        this.formatConversation(res)
        this.conversationList = res
        
      })

    })
  }
  changeSelectedIndex(event: any,conversationIndex: any){
    if(event.status == true){
      this.selectedIndex = this.selectedIndex.filter(item=>{return item != conversationIndex + '-' + event.index})

    } else {
      this.selectedIndex = this.selectedIndex.filter(item=>{return !item.startsWith(conversationIndex + '-')})
      this.selectedIndex.push(conversationIndex + '-' + event.index)
    }
  }
  formatConversation(conversationListInput:Array<ISHOWQUESTION>){
    let selectConversationIndex:number[] = []
    if(this.selectedIndex.length > 0){
      selectConversationIndex = this.selectedIndex.map(indexItem=>{return parseInt(indexItem.split('-')[0])})
    }
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
        if(selectConversationIndex.indexOf(i) != -1){
          let selectTaskIndex = parseInt(this.selectedIndex.filter(indexItem=>{return indexItem.startsWith(i + '-')})[0].split('-')[1]) - 1
          conversationListInput[i].selectIndex = selectTaskIndex + 1
          conversationListInput[i].selectedTask = task[selectTaskIndex]
          for(let j = 0; j < task.length; j++){
            let selectedTask = selectConversationIndex.indexOf(i) != -1 && selectTaskIndex == j
            task[j].selected = selectedTask
            if(selectedTask){
              let parentIndex = i + '-' + (selectTaskIndex + 1)
              this.formatChildrenOpen(task[j].children, parentIndex)
            }
          }
        } else {
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
        if(this.selectedIndex.indexOf(showIndex) != -1 || this.selectedIndex.findIndex(item=>{return item.startsWith(showIndex)}) != -1){
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
  selectTask(task: ISHOWTASK,question: ISHOWQUESTION,conversationIndex: number, index: number){
    this.selectedIndex = this.selectedIndex.filter(indexItem=>{return !indexItem.startsWith(conversationIndex + '-')})
    if(task.selected || task.status == 'Waiting'){
      return
    }
    question.selectedTask = task
    question.selectIndex = index + 1
    if(task.status != 'In Progress'){
      this.selectedIndex.push(conversationIndex + '-' + (index + 1))
    }
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
    this.selectId = user.id
    this.loadData(this.selectId)
  }
  submit(){
    if(this.answer && this.selectedUser.status != 'In Progress'){
      this.gptService.sendMessage(this.answer,this.answer, '').then(data=>{
        this.message.success('Send Message Successfully!').onClose.subscribe(item=>{
          this.answer = ''
          this.loadData(this.selectId)
        })
      })
    }
    
  }
}
