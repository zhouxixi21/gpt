export interface IPROCESS{
  id: number;
  duration?: IDURATION;
  startTime: string;
  endTime?: string;
  description: string;
  status: ISTATUS;
}
<<<<<<< HEAD
export interface IISSUE{
  id: number;
  number: number;
  title: string;
  body: string;
  repo: string;
}
=======
>>>>>>> 3306681168be7baf3f273766e466e8866741e7ad
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
  selectedTask?: ISHOWTASK,
  selectIndex?: number
}
export interface ITASK{
  name: string;
  id: string;
  status: string;
  startTime?: string;
  finishTime?: string;
  input?: string;
  output?: string;
  summary?: string;
  children?: Array<ISHOWTASK>;
  description: '';
  type: string
}
export interface ISHOWTASK extends ITASK{
  selected?: boolean;
  inputOpen?: boolean;
  outputOpen?: boolean;
}