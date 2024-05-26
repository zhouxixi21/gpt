export interface IPROCESS{
  id: number;
  duration?: IDURATION;
  startTime: string;
  endTime?: string;
  description: string;
  status: ISTATUS;
}
export interface IROBOT{
  id: number;
  name: string;
  status: string;
  lastMessage: string;
}
export interface ISHOWROBOT extends IROBOT{
  selected?: boolean;
}
export interface IPROCESSITEM extends IPROCESS{
  detail?: IPROCESSDETAIL;
}
export interface IDURATION{
  number: string;
  unit: string;
}
export interface ISTATUS{
  name: string;
  status: string;
  startTime?: string;
  finishTime?: string;
  gptNumber?: string;
}
export interface IPROCESSDETAIL{
  id: number;
  status: Array<ISTATUS>;
}
export interface IQUESTION{
  person: string;
  response: string;
  task?: Array<ISHOWTASK>;
}
export interface ISHOWQUESTION extends IQUESTION{
  selectedTask?: ISHOWTASK
}
export interface ITASK{
  name: string;
  id: string;
  status: string;
  startTime?: string;
  finishTime?: string;
  response?: string;
  children?: Array<ISHOWTASK>;
}
export interface ISHOWTASK extends ITASK{
  selected?: boolean;
}