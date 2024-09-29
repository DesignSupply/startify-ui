/*
 * Startify-UI
 * This project is licensed under the MIT License.
 * (c) 2024-present Shinya Ogawa
*/

// accordion components
const accordionComponents = document.querySelectorAll('.su-accordion');
const closingAccordion = (detailElement: HTMLElement) => {
  return [
    {
      height: `${detailElement.offsetHeight}px`,
      opacity: 1
    },
    {
      height: 0,
      opacity: 0,
    },
  ]
};
const openingAccordion = (detailElement: HTMLElement) => {
  return [
    {
      height: 0,
      opacity: 0,
    },
    {
      height: `${detailElement.offsetHeight}px`,
      opacity: 1
    },
  ]
};
Array.from(accordionComponents).forEach((accordion) => {
  accordion.querySelector('summary')?.addEventListener('click', (event) => {
    const isExpanded = (event.currentTarget as HTMLElement).getAttribute('aria-expanded') === 'true';
    (event.currentTarget as HTMLElement).setAttribute('aria-expanded', String(!isExpanded));
    const detail = accordion.querySelector('.su-accordion-detail');
    const isHidden = detail!.getAttribute('aria-hidden') === 'true';
    detail!.setAttribute('aria-hidden', String(!isHidden));
  });
  if (accordion.matches('[data-su-js="su-accordion"]')) {
    const summary = accordion.querySelector('[data-su-js="su-accordion-summary"]');
    const detail = accordion.querySelector('[data-su-js="su-accordion-detail"]') as HTMLElement;
    summary?.addEventListener('click', (event) => {
      event.preventDefault();
      if(accordion.getAttribute('open') !== null) {
        const closing = detail?.animate(closingAccordion(detail),
          {
            duration: 400,
            easing: "ease-in-out",
          });
        closing!.onfinish = () => {
          (accordion as HTMLDetailsElement).open = false
        }
      } else {
        (accordion as HTMLDetailsElement).open = true
        detail?.animate(openingAccordion(detail),
        {
          duration: 400,
          easing: "ease-in-out",
        });
      }
    });
  }
});
