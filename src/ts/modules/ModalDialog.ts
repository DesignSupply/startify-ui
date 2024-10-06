'use strict';

export class Modal {
  dataNameModal: string;
  dataNameModalOpen: string;
  dataNameModalClose: string;
  modalElement: HTMLDialogElement | null;
  modalOpenElement: HTMLElement | null;
  modalCloseElement: HTMLElement | null;

  constructor(parameter: { dataNameModal: string; dataNameModalOpen: string; dataNameModalClose: string }) {
    this.dataNameModal = parameter.dataNameModal;
    this.dataNameModalOpen = parameter.dataNameModalOpen;
    this.dataNameModalClose = parameter.dataNameModalClose;
    this.modalElement = document.querySelector(`[data-su-js="${this.dataNameModal}"]`) as HTMLDialogElement;
    this.modalOpenElement = document.querySelector(`[data-su-js="${this.dataNameModalOpen}"]`) as HTMLElement;
    this.modalCloseElement = document.querySelector(`[data-su-js="${this.dataNameModalClose}"]`) as HTMLElement;
    this.init();
  }

  init() {
    const hasModal = this.modalElement !== null && this.modalOpenElement !== null && this.modalCloseElement !== null;
    if (hasModal) {
      this.modalOpenElement!.addEventListener('click', (event: Event) => {
        this.open(event);
        this.toggleState(event.target as HTMLElement);
      });
      this.modalCloseElement!.addEventListener('click', (event: Event) => {
        this.close(event);
        this.toggleState(this.modalOpenElement!);
      });
      this.modalElement!.addEventListener('click', (event: Event) => {
        if (event.target === this.modalElement) {
          this.close(event);
          this.toggleState(this.modalOpenElement!);
        }
      });
    }
  }

  open(event: Event) {
    event.preventDefault();
    this.modalElement!.showModal();
    document.addEventListener('keydown', this.handleEscapeKey);
  }

  close(event: Event) {
    event.preventDefault();
    this.modalElement!.close();
    document.removeEventListener('keydown', this.handleEscapeKey);
  }

  toggleState(triggerElement: HTMLElement) {
    const isExpanded = triggerElement.getAttribute('aria-expanded') === 'true';
    triggerElement.setAttribute('aria-expanded', String(!isExpanded));
  }

  handleEscapeKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.modalElement!.close();
    }
  };
}
