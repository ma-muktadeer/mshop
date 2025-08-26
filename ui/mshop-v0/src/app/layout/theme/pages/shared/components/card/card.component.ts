// Angular Import
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, signal } from '@angular/core';
import { animate, AUTO_STYLE, state, style, transition, trigger } from '@angular/animations';

// bootstrap import
import { NgbDropdownConfig, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-card',
  imports: [CommonModule, NgbDropdownModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  providers: [NgbDropdownConfig],
  animations: [
    trigger('collapsedCard', [
      state(
        'collapsed, void',
        style({
          overflow: 'hidden',
          height: '0px'
        })
      ),
      state(
        'expanded',
        style({
          overflow: 'hidden',
          height: AUTO_STYLE
        })
      ),
      transition('collapsed <=> expanded', [animate('400ms ease-in-out')])
    ]),
    trigger('cardRemove', [
      state(
        'open',
        style({
          opacity: 1
        })
      ),
      state(
        'closed',
        style({
          opacity: 0,
          display: 'none'
        })
      ),
      transition('open <=> closed', animate('400ms'))
    ])
  ]
})
export class CardComponent implements OnInit {
  // public props
  @Input() cardTitle: string;
  @Input() cardClass!: string;
  @Input() blockClass!: string;
  @Input() headerClass!: string;
  @Input() options: boolean;
  @Input() hidHeader: boolean;
  @Input() customHeader: boolean;
  @Input() customDate: boolean;
  @Input() CardDate!: string;
  @Input() isCardFooter: boolean;
  @Input() footerClass!: string;

  animation = signal<string>('');
  fullIcon = signal<string>('');
  isAnimating = signal<boolean>(null);
  collapsedCard = signal<string>('');
  collapsedIcon = signal<string>('');
  ngCardClass = signal<string>('');
  loadCard: boolean;
  cardRemove = signal<string>('');

  // constructor
  constructor(/*animationService: AnimationService,*/ config: NgbDropdownConfig) {
    config.placement = 'bottom-right';
    this.customHeader = false;
    this.customDate = false;
    this.options = true;
    this.hidHeader = false;
    this.cardTitle = 'Card Title';
    this.fullIcon.set('icon-maximize');
    this.isAnimating.set(false);
    this.isCardFooter = false;

    this.collapsedCard.set('expanded');
    this.collapsedIcon.set('icon-minus');

    this.loadCard = false;

    this.cardRemove.set('open');
  }

  // life cycle event
  ngOnInit() {
    if (!this.options || this.hidHeader || this.customHeader) {
      this.collapsedCard.update(() => 'false');
    }
    if (!this.options || this.hidHeader || this.customDate) {
      this.collapsedCard.update(() => 'false');
    }
    this.ngCardClass.set(this.cardClass);
  }

  // public method
  fullCardToggle(element: HTMLElement, animation: string, status: boolean) {
    debugger
    animation = this.cardClass === 'full-card' ? 'zoomOut' : 'zoomIn';
    this.fullIcon.update(() => this.cardClass === 'full-card' ? 'icon-maximize' : 'icon-minimize');
    this.cardClass = this.cardClass === 'full-card' ? this.cardClass : 'full-card';
    if (status) {
      this.animation.update(() => animation);
    }
    this.isAnimating.update(() => true);

    setTimeout(() => {
      this.cardClass = animation === 'zoomOut' ? '' : this.cardClass;
      if (this.cardClass === 'full-card') {
        (document.querySelector('body') as HTMLBodyElement).style.overflow = 'hidden';
      } else {
        (document.querySelector('body') as HTMLBodyElement).removeAttribute('style');
      }
      this.ngCardClass.update(() => this.cardClass);
    }, 500);
  }

  collapsedCardToggle() {
    this.collapsedCard.update((value) => value === 'collapsed' ? 'expanded' : 'collapsed');
    this.collapsedIcon.update(() => this.collapsedCard() === 'collapsed' ? 'icon-plus' : 'icon-minus');
  }

  cardRefresh() {
    this.loadCard = true;
    this.cardClass = 'card-load';
    setTimeout(() => {
      this.loadCard = false;
      this.cardClass = 'expanded';
      this.ngCardClass.update(() => this.cardClass);
    }, 3000);
    this.ngCardClass.update(() => this.cardClass);
  }

  cardRemoveAction() {
    this.cardRemove.update((value) => value === 'closed' ? 'open' : 'closed');
  }
}
