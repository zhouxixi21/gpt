import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { IPROCESSITEM, ISHOWQUESTION, ISHOWTASK, ISTATUS } from 'src/app/common/common.interface';
import { GPTService } from 'src/app/service/gpt.service';

@Component({
  selector: 'app-github',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './github.component.html',
  styleUrls: ['./github.component.scss']
})
export class GithubComponent implements OnInit{
  processList:Array<IPROCESSITEM> = [];
  questionModalVisible = false;
  createQuestion = ''
  createModalVisible = false;
  questionModalData:Array<ISHOWQUESTION> = []
  questionModalTitle = 'Answer Question';
  questionModalAnswer = '';
  constructor(private gptService: GPTService, private message: NzMessageService) { }
  ngOnInit(): void {
    this.initData()
  }
  initData(){
    this.gptService.getProcessList().then((res)=>{
      this.processList = res;
    })
  }
  getProcessDetail(processItem: IPROCESSITEM,event:any){
    
    if(!processItem.detail && event){
      this.gptService.getProcess(processItem.id).then((res)=>{
        processItem.detail = res;
      })
    } 
    console.log(this.processList);
  }
 
  refresh(processItem: IPROCESSITEM){
    this.gptService.getProcess(processItem.id).then((res)=>{
      processItem.detail = res;
    })
  }
  answerQuestion(){

  }
  getStatus(status: ISTATUS){
    if(status.status == 'In Progress'){
      return 'process'
    } else if(status.status == 'Need to check'){
      return 'process'
    } else if(status.status == 'Waiting'){
      return 'wait'
    } else if(status.status == 'Finished'){
      return 'finish'
    } else if(status.status == 'Failed'){
      return 'error'
    } else {
      return 'process'
    }
  }
  clickAnswerQuestion(status: ISTATUS){
    if(status.gptNumber){
      this.gptService.getProcessAnalysisQuestion(status.gptNumber).then((res)=>{
        this.questionModalData = res;
        for(let i = 0; i < this.questionModalData.length; i++){
          let task = this.questionModalData[i].task
          if(task){
            let hasInprogress = false
            for(let j = 0; j < task.length; j++){
              console.log(task[j])
              if(task[j].status == 'In Progress'){
                task[j].selected = true;
                hasInprogress = true
                this.questionModalData[i].selectedTask = task[j]; 
              } else {
                task[j].selected = false;
              }
            }
            if(!hasInprogress){
              task[0].selected = true;
              this.questionModalData[i].selectedTask = task[0]; 

            }
          }
        }
        this.questionModalTitle = 'Answer Question';
        this.questionModalVisible = true;
        console.log(this.questionModalData)
      })
    }
  }
  selectTask(task: ISHOWTASK,question: ISHOWQUESTION){
    if(task.selected || task.status == 'Waiting'){
      return
    }
    question.selectedTask = task
    question.task?.forEach(taskItem=>{
      if(task.id == taskItem.id){
        task.selected = true
      } else {
        task.selected = false
      }
    })
  }
  createQuestionClick(){
    this.message.success('Create Process Success!').onClose.subscribe(()=>{
      this.createModalVisible = false
      this.createQuestion = ''
      this.initData()
    })
  }
  handleCreateModalCancel(){
    this.createModalVisible = false
    this.createQuestion = ''
  }
  openCreateProcessModal(){
    this.createQuestion = ''
    this.createModalVisible = true
  }
  clickAnalysisProcess(status: ISTATUS){
    if(status.gptNumber){
      this.gptService.getProcessAnalysisQuestion(status.gptNumber).then((res)=>{
        this.questionModalData = res;
        this.questionModalTitle = 'View Analysis Process';
        for(let i = 0; i < this.questionModalData.length; i++){
          let task = this.questionModalData[i].task
          if(task){
            let hasInprogress = false
            for(let j = 0; j < task.length; j++){
              console.log(task[j])
              if(task[j].status == 'In Progress'){
                task[j].selected = true;
                hasInprogress = true
                this.questionModalData[i].selectedTask = task[j]; 

              } else {
                task[j].selected = false;
              }
            }
            if(!hasInprogress){
              task[0].selected = true;
              this.questionModalData[i].selectedTask = task[0]; 

            }
          }
        }
        this.questionModalVisible = true;
        console.log(this.questionModalData);
      })
    }
  }
  handleQuestionModalCancel(){
    this.questionModalVisible = false;
    this.questionModalData = [];
    this.questionModalTitle = 'Answer Question';
  }
  showAnswerQuestion(status: ISTATUS){
    if(status.name.includes('GPT') && status.status == 'Need to check'){
      return true
    } else {
      return false
    }
  }
  showAnalysisProcess(status: ISTATUS){
    if(status.name.includes('GPT') && status.status != 'Need to check'){
      return true
    } else {
      return false
    }
  }
}
