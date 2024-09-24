import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable()
export class StorageService{
  private storageUserList = new Subject();
  watchStorageUserList():Observable<any>{
    return this.storageUserList.asObservable();
  }
  updateUserList(userList: any[]){
    this.storageUserList.next(userList)
  }
}