'use strict';

export class RangeInputMultiple {
  dataNameRangeInputMultiple: string;
  dataNameRangeInputMultipleMin: string;
  dataNameRangeInputMultipleMax: string;
  dataNameRangeOutputMultipleMin: string;
  dataNameRangeOutputMultipleMax: string;
  rangeInputMultipleElements: NodeList;

  constructor(parameter: { 
    dataNameRangeInputMultiple: string;
    dataNameRangeInputMultipleMin: string;
    dataNameRangeInputMultipleMax: string;
    dataNameRangeOutputMultipleMin: string;
    dataNameRangeOutputMultipleMax: string;
  }) {
    this.dataNameRangeInputMultiple = parameter.dataNameRangeInputMultiple;
    this.dataNameRangeInputMultipleMin = parameter.dataNameRangeInputMultipleMin;
    this.dataNameRangeInputMultipleMax = parameter.dataNameRangeInputMultipleMax;
    this.dataNameRangeOutputMultipleMin = parameter.dataNameRangeOutputMultipleMin;
    this.dataNameRangeOutputMultipleMax = parameter.dataNameRangeOutputMultipleMax;
    this.rangeInputMultipleElements = document.querySelectorAll(`[data-su-js="${this.dataNameRangeInputMultiple}"]`);
    this.init();
  }
  
  init() {
    Array.from(this.rangeInputMultipleElements).forEach((rangeInputMultipleElement) => {
      const rangeInputMultiple = rangeInputMultipleElement as HTMLElement;
      const rangeInputMin = rangeInputMultiple.querySelector(`[data-su-js="${this.dataNameRangeInputMultipleMin}"]`) as HTMLInputElement;
      const rangeInputMax = rangeInputMultiple.querySelector(`[data-su-js="${this.dataNameRangeInputMultipleMax}"]`) as HTMLInputElement;
      const rangeOutputMin = document.querySelector(`[data-su-js="${this.dataNameRangeOutputMultipleMin}"]`) as HTMLElement | null;
      const rangeOutputMax = document.querySelector(`[data-su-js="${this.dataNameRangeOutputMultipleMax}"]`) as HTMLElement | null; 
      this.constrainRangeValues(rangeInputMin, rangeInputMax);
      this.updateRangeBackgrounds(rangeInputMin, rangeInputMax);
      this.updateOutputValues(rangeInputMin, rangeInputMax, rangeOutputMin, rangeOutputMax);
      // min range input
      rangeInputMin.addEventListener('input', () => {
        this.constrainRangeValues(rangeInputMin, rangeInputMax);
        this.updateRangeBackgrounds(rangeInputMin, rangeInputMax);
        this.updateOutputValues(rangeInputMin, rangeInputMax, rangeOutputMin, rangeOutputMax);
      });
      // max range input
      rangeInputMax.addEventListener('input', () => {
        this.constrainRangeValues(rangeInputMin, rangeInputMax);
        this.updateRangeBackgrounds(rangeInputMin, rangeInputMax);
        this.updateOutputValues(rangeInputMin, rangeInputMax, rangeOutputMin, rangeOutputMax);
      });
      window.addEventListener('resize', () => {
        this.updateRangeBackgrounds(rangeInputMin, rangeInputMax);
      });
    });
  }
  
  // constrain range values
  constrainRangeValues(minInput: HTMLInputElement, maxInput: HTMLInputElement): void {
    const minValue = Number(minInput.value);
    const maxValue = Number(maxInput.value);
    const rangeMin = Number(minInput.min) || 0;
    const rangeMax = Number(minInput.max) || 100;
    const step = Number(minInput.step) || 1;
    // min gap (1% of range or step, whichever is larger)
    const minGap = Math.max(step, (rangeMax - rangeMin) * 0.01);
    // if min value is greater than max value - min gap, adjust min value
    if (minValue > maxValue - minGap) {
      // set min value to max value - min gap
      const newMinValue = Math.max(rangeMin, maxValue - minGap);
      minInput.value = newMinValue.toString();
    }
    // if max value is less than min value + min gap, adjust max value  
    if (maxValue < minValue + minGap) {
      // set max value to min value + min gap
      const newMaxValue = Math.min(rangeMax, minValue + minGap);
      maxInput.value = newMaxValue.toString();
    }
  }

  updateOutputValues(
    minInput: HTMLInputElement, 
    maxInput: HTMLInputElement, 
    minOutput: HTMLElement | null, 
    maxOutput: HTMLElement | null
  ): void {
    if (minOutput) {
      minOutput.textContent = minInput.value;
    }
    
    if (maxOutput) {
      maxOutput.textContent = maxInput.value;
    }
  }

  remToPx(rem: number): number {
    const rootFontSize = parseFloat(
      window.getComputedStyle(document.documentElement).fontSize
    );
    return rem * rootFontSize;
  }
  
  updateRangeBackgrounds(minInput: HTMLInputElement, maxInput: HTMLInputElement): void {
    const minValue = Number(minInput.value);
    const maxValue = Number(maxInput.value);
    const rangeMin = Number(minInput.min) || 0;
    const rangeMax = Number(minInput.max) || 100;
    const thumbSizePx = this.getThumbSizePx(minInput);
    const rangeWidth = minInput.getBoundingClientRect().width;
    const thumbWidthRatio = (thumbSizePx / rangeWidth) * 100;
    const range = rangeMax - rangeMin;
    const minPercent = thumbWidthRatio === 0 
      ? ((minValue - rangeMin) / range) * 100 
      : ((minValue - rangeMin) / range) * (100 - thumbWidthRatio) + (thumbWidthRatio / 2);
    
    const maxPercent = thumbWidthRatio === 0 
      ? ((maxValue - rangeMin) / range) * 100 
      : ((maxValue - rangeMin) / range) * (100 - thumbWidthRatio) + (thumbWidthRatio / 2);  
    // max range input background
    maxInput.style.background = `linear-gradient(to right, 
      var(--su-color-bg-bar-range-input) 0%, 
      var(--su-color-bg-bar-range-input) ${minPercent}%, 
      var(--su-color-fill-bar-range-input) ${minPercent}%, 
      var(--su-color-fill-bar-range-input) ${maxPercent}%, 
      var(--su-color-bg-bar-range-input) ${maxPercent}%, 
      var(--su-color-bg-bar-range-input) 100%)
    `;
  }
  
  getThumbSizePx(rangeInput: HTMLInputElement): number {
    const computedStyle = window.getComputedStyle(rangeInput);
    const thumbSizeRaw = computedStyle.getPropertyValue('--su-size-button-range-input').trim();  
    if (thumbSizeRaw) {
      // size is rem
      if (thumbSizeRaw.endsWith('rem')) {
        const remValue = parseFloat(thumbSizeRaw.replace('rem', ''));
        return this.remToPx(remValue);
      } 
      // size is px
      else if (thumbSizeRaw.endsWith('px')) {
        return parseFloat(thumbSizeRaw.replace('px', ''));
      }
    }
    // fallback to 0
    return 0;
  }
}
