/*
 * Startify-UI
 * This project is licensed under the MIT License.
 * (c) 2024-present Shinya Ogawa
*/

import { Accordion } from './modules/Accordion';
import { Modal } from './modules/ModalDialog';

// accordion components
new Accordion({
  className: 'su-accordion',
  dataNameAccordion: 'su-accordion',
  dataNameAccordionSummary: 'su-accordion-summary',
  dataNameAccordionDetail: 'su-accordion-detail',
  duration: 400,
  easing: 'ease-in-out'
});

// modal components
new Modal({
  dataNameModal: 'su-modal',
  dataNameModalOpen: 'su-modal-open',
  dataNameModalClose: 'su-modal-close'
});
