import { Injectable } from "@angular/core";
import { IISSUE, IPROCESS, IPROCESSDETAIL, IROBOT, ISHOWQUESTION } from "../common/common.interface";
import { HttpClient } from "@angular/common/http";
import { GET_ISSUE_URL, GET_NODE_URL, NODE_DETAIL_URL, NODE_LIST_URL, SEND_MESSAGE_URL } from "./apis.constant";

@Injectable({
  providedIn: 'root'
})
export class GPTService {
  constructor(private httpClient: HttpClient){}
  getProcessList():Promise<Array<IPROCESS>> {
    return new Promise((resolve, reject) => {
      resolve([
        {
          id: 1,
          startTime: '2024/04/03 15:00:00',
          description: 'This is conversation 1',
          status: {
            name: 'DEV GPT Analysis Question',
            status: 'Need to check'
          }
        },
        {
          id: 2,
          startTime: '2024/04/04 15:00:00',
          description: 'This is conversation 2',
          status: {
            name: 'DEV GPT Analysis Question',
            status: 'In Progress'
          }
        },
        {
          id: 3,
          startTime: '2024/04/05 15:00:00',
          description: 'This is conversation 3',
          status: {
            name: 'Code GPT Agent change code',
            status: 'In Progress'
          }
        },
      ]);
    });

  }
  async getIssueList():Promise<Array<IISSUE>>{
    let res:any = await this.httpClient.get(GET_ISSUE_URL).toPromise()
    return new Promise((resolve, reject) => {
      resolve(res.data)
    })
  }
  getProcess(id: number):Promise<IPROCESSDETAIL> {
    return new Promise((resolve, reject) => {
      if(id == 1){
        resolve({
          id: id,
          status: [{
            name: 'DEV GPT Analysis Question',
            status: 'Need to check',
            startTime: '2024/04/03 15:00:00',
            gptNumber: '1-1'
          },{
            name: 'Create branch',
            status: 'Waiting',
          },{
            name: 'Code GPT Agent change code',
            status: 'Waiting',
          },{
            name: 'Deploy to DEV Environment',
            status: 'Waiting',
          },{
            name: 'Merge code',
            status: 'Waiting',
          },{
            name: 'Deploy to SIT Environment',
            status: 'Waiting',
          },{
            name: 'Testing',
            status: 'Waiting',
          },{
            name: 'Deploy to UAT Environment',
            status: 'Waiting',
          }],
        });
      } else if(id == 2){
        resolve({
          id: id,
          status: [{
            name: 'DEV GPT Analysis Question',
            status: 'In Progress',
            startTime: '2024/04/03 15:00:00',
            gptNumber: '2-1'
          },{
            name: 'Create branch',
            status: 'Waiting',
          },{
            name: 'Code GPT Agent change code',
            status: 'Waiting',
          },{
            name: 'Deploy to DEV Environment',
            status: 'Waiting',
          },{
            name: 'Merge code',
            status: 'Waiting',
          },{
            name: 'Deploy to SIT Environment',
            status: 'Waiting',
          },{
            name: 'Testing',
            status: 'Waiting',
          },{
            name: 'Deploy to UAT Environment',
            status: 'Waiting',
          }],
        });
      } else if(id == 3){
        resolve({
          id: id,
          status: [{
            name: 'DEV GPT Analysis Question',
            status: 'Finished',
            startTime: '2024/04/03 15:00:00',
            finishTime: '2024/04/03 16:00:00',
            gptNumber: '3-1'
          },{
            name: 'Create branch',
            status: 'Finished',
            startTime: '2024/04/03 16:00:00',
            finishTime: '2024/04/03 16:05:00',
          },{
            name: 'Code GPT Agent change code',
            status: 'In Progress',
            startTime: '2024/04/03 16:05:00',
            gptNumber: '3-3'
          },{
            name: 'Deploy to DEV Environment',
            status: 'Waiting',
          },{
            name: 'Merge code',
            status: 'Waiting',
          },{
            name: 'Deploy to SIT Environment',
            status: 'Waiting',
          },{
            name: 'Testing',
            status: 'Waiting',
          },{
            name: 'Deploy to UAT Environment',
            status: 'Waiting',
          }],
        });
      }
    });
  }
  getProcessAnalysisQuestion(gptNumber: string):Promise<Array<ISHOWQUESTION>> {
    if(gptNumber == '1-1'){
      return new Promise((resolve, reject) => {
        resolve([
          {
            person: 'user',
            response: 'Change the color of the button'
          },
          {
            person: 'GPT',
            response: 'I need more Information.'
          }
        ]);
      })
    } else if(gptNumber == '2-1'){
      return new Promise((resolve, reject) => {
        resolve([
          {
            person: 'user',
            response: 'Fix the bluckduck issue of XXX'
          },
          {
            person: 'GPT',
            response: '',
            task: [{
              id: '2-1-1',
              name: 'Check the code',
              status: 'In Progress',
              startTime: '2024/04/04 15:00:00',
              description: '',
              type: 'step'
            },{
              id: '2-1-2',
              name: 'Change the code',
              status: 'Waiting',
              description: '',
              type: 'step'
            }]
          }
        ]);
      })
    } else if(gptNumber == '3-1'){
      return new Promise((resolve, reject) => {
        resolve([
          {
            person: 'user',
            response: 'Fix the bluckduck issue of XXX'
          },
          {
            person: 'DEV GPT Agent',
            response: '',
            task: [{
              id: '3-1-1',
              name: 'Check the code',
              status: 'Finished',
              startTime: '2024/04/04 15:00:00',
              finishTime: '2024/04/04 15:30:00',
              output: 'Need to change version of spring framework to 5.3.28.',
              description: '',
              type: 'step',
              children: [{
                id: '3-1-1-1',
                name: 'Get Report from Blackduck website',
                status: 'Finished',
                startTime: '2024/04/04 15:30:00',
                finishTime: '2024/04/04 15:35:00',
                output: 'XXX has issue Spring framework version is 5.3.20.',
                description: '',
                type: 'step'
              },{
                id: '3-1-1-2',
                name: 'Analyze the correct version of Spring framework',
                status: 'Finished',
                startTime: '2024/04/04 15:35:00',
                finishTime: '2024/04/04 15:50:00',
                output: 'Spring framework correct version is 5.3.28.',
                description: '',
                type: 'step'
              }]
            }]
          }
        ]);
      })
    } else if(gptNumber == '3-3'){
      return new Promise((resolve, reject) => {
        resolve([
          {
            person: 'DEV GPT Agent',
            response: 'Change the color of the button'
          },
          {
            person: 'Code GPT Agent',
            response: '',
            task: [{
              id: '3-3-1',
              name: 'Change the code',
              status: 'Finished',
              startTime: '2024/04/04 15:30:00',
              output: '',
              description: '',
              type: 'step',
              children: [{
                id: '3-3-1-1',
                name: 'Download the code',
                status: 'Finished',
                startTime: '2024/04/04 15:30:00',
                finishTime: '2024/04/04 15:35:00',
                output: 'Has downloaded the code.',
                description: '',
                type: 'step'
              },{
                id: '3-3-1-2',
                name: 'Change the code',
                status: 'In Progress',
                startTime: '2024/04/04 15:35:00',
                output: '',
                description: '',
                type: 'step'
              }]
            }]
          }
        ]);
      })
    } else {
      return new Promise((resolve, reject) => {
        resolve([]);
      })
    } 
  }
  async getRobotList(): Promise<Array<IROBOT>>{
    let res:any = await this.httpClient.get(NODE_LIST_URL).toPromise()
    return new Promise((resolve, reject) => {
      resolve(res.data)
    })
    
  }
  async getNode(node_id: string): Promise<IROBOT>{
    let res:any = await this.httpClient.get(GET_NODE_URL + '?message_id=' + node_id).toPromise()
    return new Promise((resolve, reject) => {
      console.log(res)
      resolve(res.data)
    })
    
  }
  async getConversation(id: string): Promise<Array<ISHOWQUESTION>>{
    let res:any = await this.httpClient.get(NODE_DETAIL_URL + '?message_id=' + id).toPromise()
    return new Promise((resolve, reject) => {
      resolve(res.data)
    })
  }
  async sendMessage(message: string, issue: string, repo: string){
    let res:any = await this.httpClient.post(SEND_MESSAGE_URL,{message: message, issue: issue, repo: repo}).toPromise()
    return new Promise((resolve, reject) => {
      resolve(res.data)
    })
  }
}