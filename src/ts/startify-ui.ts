/*
 * Startify-UI
 * This project is licensed under the MIT License.
 * (c) 2024-present Shinya Ogawa
*/

import { Accordion } from './modules/Accordion';
import { Modal } from './modules/ModalDialog';
import { RangeInput } from './modules/RangeInput';
import { RangeInputMultiple } from './modules/RangeInputMultiple';
import { FileInput } from './modules/FileInput';

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

// file input components
new FileInput({
  dataNameFileInput: 'su-form-file-input',
  dataNameFileInputList: 'su-form-file-input-list',
  dataNameFileInputFileName: 'su-form-file-input-file-name',
  dataNameFileInputFileRemove: 'su-form-file-input-file-remove',
  dataNameFileInputThumbnailPreview: 'su-form-file-input-thumbnail-preview',
  dataNameFileInputThumbnailRemove: 'su-form-file-input-thumbnail-remove'
});
