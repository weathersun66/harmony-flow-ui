export function liquidPreset(surface: HTMLElement) {
  if (surface.matches('[role="listbox"],.hf-date-picker__panel,.hf-member-picker__menu')) return 'overlay';
  if (surface.matches('input,textarea,[role="textbox"],.hf-input-shell,.hf-search-input,.hf-number-input__control,.hf-select,.hf-combobox__control,.hf-multiselect__trigger,.hf-picker-trigger,.hf-time-picker,.hf-mention-input,.hf-chat-composer')) return 'readable';
  if (surface.matches('[role="dialog"],[role="menu"],.hf-toast,.hf-menu__panel,.hf-mega-menu__panel,.hf-popover__content,.hf-mobile-nav__panel,.hf-dropdown__menu,.hf-split-button__menu,.hf-tooltip__bubble,.hf-popconfirm__panel')) return 'overlay';
  if (surface.matches('.hf-card,.hf-stat,.hf-event-card,.hf-chat-message,.hf-chat-message__content,.hf-swipe-actions__content,.hf-notification-center,.hf-tool-call,.hf-kanban-card,.hf-list > li,.hf-sortable__list > li')) return 'content';
  return 'control';
}
