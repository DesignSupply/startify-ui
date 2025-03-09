/*
 * Startify-UI
 * This project is licensed under the MIT License.
 * (c) 2024-present Shinya Ogawa
*/

import { Accordion } from './modules/Accordion';
import { Modal } from './modules/ModalDialog';
import { RangeInput } from './modules/RangeInput';
import { RangeInputMultiple } from './modules/RangeInputMultiple';

// accordion components
new Accordion({
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

// range input components
new RangeInput({
  dataNameRangeInput: 'su-form-range-input',
  dataNameRangeOutput: 'su-form-range-output'
});

// range input multiple components
new RangeInputMultiple({
  dataNameRangeInputMultiple: 'su-form-range-input-multiple',
  dataNameRangeInputMultipleMin: 'su-form-range-input-multiple-min',
  dataNameRangeInputMultipleMax: 'su-form-range-input-multiple-max',
  dataNameRangeOutputMultipleMin: 'su-form-range-output-multiple-min',
  dataNameRangeOutputMultipleMax: 'su-form-range-output-multiple-max'
});
