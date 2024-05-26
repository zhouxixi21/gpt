import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'gpt';
  path = '/conversation'
  constructor(private router: Router) { }
  navigator: Array<any> = [
    {
      label: 'Conversation',
      path: '/conversation',
      selected: false
    },
    {
      label: 'Github',
      path: '/github',
      selected: false
    },
    {
      label: 'Properties',
      path: '/properties',
      selected: false
    }
  ]
  navigateTo(path: string){
    this.router.navigateByUrl(path)
  
  }
  ngOnInit(): void {
    
    this.router.events.subscribe((event) => {
      if(event instanceof NavigationEnd){
        this.checkUrlSelectedNavigator()
      }
    })
  }
  checkUrlSelectedNavigator(){
    this.path = this.router.url
    this.navigator.forEach((nav) => {
      if(nav.path === this.router.url){
        nav.selected = true
      } else {
        nav.selected = false
      }
    })
  }
}
