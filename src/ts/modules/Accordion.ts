'use strict';

export class Accordion {
  className: string;
  dataNameAccordion: string;
  dataNameAccordionSummary: string;
  dataNameAccordionDetail: string;
  duration: number;
  easing: string;
  accordionElements: NodeList;

  constructor(parameter: {
    className: string;
    dataNameAccordion: string;
    dataNameAccordionSummary: string;
    dataNameAccordionDetail: string;
    duration: number;
    easing: string;
  }) {
    this.className = parameter.className;
    this.dataNameAccordion = parameter.dataNameAccordion;
    this.dataNameAccordionSummary = parameter.dataNameAccordionSummary;
    this.dataNameAccordionDetail = parameter.dataNameAccordionDetail;
    this.duration = parameter.duration;
    this.easing = parameter.easing;
    this.accordionElements = document.querySelectorAll(`.${this.className}`);
    this.init();
  }

  init() {
    Array.from(this.accordionElements).forEach((accordionElement) => {
      const accordion = accordionElement as HTMLDetailsElement;
      accordion.querySelector('summary')?.addEventListener('click', (event) => {
        const summary = event.currentTarget as HTMLElement;
        const detail = accordion.querySelector(`.${this.dataNameAccordionDetail}`);
        const isExpanded = summary.getAttribute('aria-expanded') === 'true';
        const isHidden = detail!.getAttribute('aria-hidden') === 'true';
        summary.setAttribute('aria-expanded', String(!isExpanded));
        detail!.setAttribute('aria-hidden', String(!isHidden));
      });
      if (accordion.matches(`[data-su-js="${this.dataNameAccordion}"]`)) {
        const summary = accordion.querySelector(`[data-su-js="${this.dataNameAccordionSummary}"]`);
        const detail = accordion.querySelector(`[data-su-js="${this.dataNameAccordionDetail}"]`) as HTMLElement;
        summary?.addEventListener('click', (event) => {
          event.preventDefault();
          if (accordion.getAttribute('open') !== null) {
            const closing = detail?.animate(this.closingAnimation(detail), {
              duration: this.duration,
              easing: this.easing
            });
            closing!.onfinish = () => {
              accordion.open = false;
            };
          } else {
            accordion.open = true;
            detail?.animate(this.openingAnimation(detail), {
              duration: this.duration,
              easing: this.easing
            });
          }
        });
      }
    });
  }

  closingAnimation(detailElement: HTMLElement) {
    return [
      {
        height: `${detailElement.offsetHeight}px`,
        opacity: 1
      },
      {
        height: 0,
        opacity: 0
      }
    ];
  }

  openingAnimation(detailElement: HTMLElement) {
    return [
      {
        height: 0,
        opacity: 0
      },
      {
        height: `${detailElement.offsetHeight}px`,
        opacity: 1
      }
    ];
  }
}
