import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';
import { trigger, keyframes, animate, transition } from "@angular/animations";
import {swiperight, swipeleft, swipeup, swipedown, pass, previous} from './keyframes';
import {User} from './user';
import data  from './users.json';
import { Subject } from 'rxjs';
import * as Hammer from 'hammerjs';


@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
  animations: [
    trigger('cardAnimator', [
      transition('* => swiperight', animate(500, keyframes(swiperight))),
      transition('* => swipeleft', animate(500, keyframes(swipeleft))),
      transition('* => swipeup', animate(500, keyframes(swipeup))),
      transition('* => swipedown', animate(500, keyframes(swipedown))),
      transition('* => pass', animate(400, keyframes(pass))),
      transition('* => previous', animate(400, keyframes(previous)))
    ])
  ]

})
export class CardComponent implements OnInit, AfterViewInit{

  public users: User[] = data;
  public index = 0;
  public flag = 0;

  @Input()
  parentSubject!: Subject<any>;
  eventText = '';
  @ViewChild('card') card!: ElementRef;
  private hammerManager!: HammerManager;
  private globalListenFunc!: Function;

  animationState!: string;
  constructor(private renderer: Renderer2) { }

  ngOnInit() {
    
  }

  ngAfterViewInit(){
    this.hammerManager = new Hammer.Manager(this.card.nativeElement);
    this.hammerManager.add(new Hammer.Swipe({direction: Hammer.DIRECTION_ALL}));
    this.hammerManager.on('swipeup swipedown swipeleft swiperight', (event) => {
      if (event.type == 'swipeup'){
          console.log('swipeup');
      }
      if (event.type == 'swipedown'){
          console.log('swipedown');
      }
      if (event.type == 'swipeleft'){
          console.log('swipeleft');
      }
      if (event.type == 'swiperight'){
          console.log('swiperight');
      }
    });
    console.log(this.index);

    this.globalListenFunc = this.renderer.listen('document', 'keydown', (event) => {
      if (event.key === 'j' || event.key === 'J'){
        this.startAnimation('swipeleft');
      }
      if (event.key === 'k' || event.key === 'K'){
        this.startAnimation('swipedown');
      }
      if (event.key === 'l' || event.key === 'L'){
        this.startAnimation('swiperight');
      }
      if (event.key === 'i' || event.key === 'I'){
        this.startAnimation('swipeup');
      }
      if (event.key === ' '){
        this.startAnimation('pass');
      }
      if (event.keyCode === 8){
        this.previousAnimation('previous');
      }

    });
    console.log(this.index);


    this.parentSubject.subscribe(event => {
      console.log("Animation Event");
      console.log(event);
      this.startAnimation(event);
    });
    console.log(this.index);
  }

  startAnimation(state: any) {
    console.log("start animation");
    console.log(state);
    
    if (!this.animationState) {
      this.animationState = state;
    }
    this.flag = 1;
    console.log(this.index);
  }

  previousAnimation(state: any) {
    console.log("start animation");
    console.log(state);
    
    if (this.index > 0){
      this.index--;
      if (!this.animationState) {
        this.animationState = state;
      }
    }
    console.log(this.index);
  }

  resetAnimationState(state: any) {
    console.log("reset");
    console.log(this.index);
    console.log(this.animationState);
    this.animationState = '';
    if (this.flag === 1){
      this.index++;
      this.flag = 0;
    }
  }

  previousAnimationState(state: any) {
    this.animationState = '';
    console.log("previous");
    console.log(this.index);
    if (this.index > 0){
      this.index--;
    }
    console.log(this.index);
    
  }


  ngOnDestroy() {
    this.parentSubject.unsubscribe();
  }

}