'use strict';

export class RangeInput {  
  dataNameRangeInput: string;
  dataNameRangeOutput: string;
  rangeInputElements: NodeList;
  
  constructor(parameter: { 
    dataNameRangeInput: string;
    dataNameRangeOutput: string;
  }) {
    this.dataNameRangeInput = parameter.dataNameRangeInput;
    this.dataNameRangeOutput = parameter.dataNameRangeOutput;
    this.rangeInputElements = document.querySelectorAll(`[data-su-js="${this.dataNameRangeInput}"]`);
    this.init();
  }

  init() {
    Array.from(this.rangeInputElements).forEach((rangeInputElement) => {
      const rangeInput = rangeInputElement as HTMLInputElement;
      const rangeOutput = rangeInput.parentElement?.querySelector(`[data-su-js="${this.dataNameRangeOutput}"]`) as HTMLElement | null;
      this.updateRangeBackground(rangeInput);
      if (rangeOutput) {
        rangeOutput.textContent = this.updateRangeOutput(rangeInput).toString();
      }
      rangeInput.addEventListener('input', (event) => {
        this.updateRangeBackground(event.target as HTMLInputElement);
        if (rangeOutput) {
          rangeOutput.textContent = this.updateRangeOutput(event.target as HTMLInputElement).toString();
        }
      });
      window.addEventListener('resize', () => {
        this.updateRangeBackground(rangeInput);
      });
    });
  }
  
  remToPx(rem: number): number {
    const rootFontSize = parseFloat(
      window.getComputedStyle(document.documentElement).fontSize
    );
    return rem * rootFontSize;
  }
  
  updateRangeBackground(rangeInput: HTMLInputElement) {
    const value = Number(rangeInput.value);
    const max = Number(rangeInput.max);
    const min = Number(rangeInput.min) || 0;
    const computedStyle = window.getComputedStyle(rangeInput);
    const thumbSizeRaw = computedStyle.getPropertyValue('--su-size-button-range-input').trim();
    let thumbSizePx: number;
    if (thumbSizeRaw) {
      // size is rem
      if (thumbSizeRaw.endsWith('rem')) {
        const remValue = parseFloat(thumbSizeRaw.replace('rem', ''));
        thumbSizePx = this.remToPx(remValue);
        // console.log(`Converting ${remValue}rem to ${thumbSizePx}px`);
      } 
      // size is px
      else if (thumbSizeRaw.endsWith('px')) {
        thumbSizePx = parseFloat(thumbSizeRaw.replace('px', ''));
        // console.log(`Using pixel value directly: ${thumbSizePx}px`);
      }
      // fallback
      else if (!isNaN(parseFloat(thumbSizeRaw))) {
        thumbSizePx = 0;
      }
      // fallback
      else {
        thumbSizePx = 0;
      }
    } else {
      // fallback
      thumbSizePx = 0;
    }
    const rangeWidth = rangeInput.getBoundingClientRect().width;
    const thumbWidthRatio = (thumbSizePx / rangeWidth) * 100;
    const range = max - min;
    const adjustedPercent = thumbWidthRatio === 0 
      ? ((value - min) / range) * 100 
      : ((value - min) / range) * (100 - thumbWidthRatio) + (thumbWidthRatio / 2);
    // console.log(`Value: ${value}, ThumbSize: ${thumbSizePx}px, RangeWidth: ${rangeWidth}px, ThumbWidthRatio: ${thumbWidthRatio}%, AdjustedPercent: ${adjustedPercent}%`);
    rangeInput.style.background = `linear-gradient(to right, 
      var(--su-color-fill-bar-range-input) 0%, 
      var(--su-color-fill-bar-range-input) ${adjustedPercent}%, 
      var(--su-color-bg-bar-range-input) ${adjustedPercent}%, 
      var(--su-color-bg-bar-range-input) 100%)
    `;
  }

  updateRangeOutput(rangeInput: HTMLInputElement) {
    const value = Number(rangeInput.value);
    return value;
  }
}
