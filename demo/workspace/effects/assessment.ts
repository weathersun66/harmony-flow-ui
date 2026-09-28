import { catalog } from '../catalog/catalog';

export type MaterialMode = 'original' | 'liquid' | 'particle';
export interface MaterialAssessment {
  selector: string;
  liquid: boolean;
  particle: boolean;
  reason: string;
}

// 按真实表面注册，不按分类给所有后代套样式。未登记组件保持原态。
const surfaces: Record<string, string> = {
  Button: '.hf-button', ButtonGroup: '.hf-button', IconButton: '.hf-button',
  SplitButton: '.hf-button, .hf-split-button__menu', Card: '.hf-card', Badge: '.hf-badge', Tag: '.hf-tag',
  Input: '.hf-input-shell', SearchInput: '.hf-search-input', ValidatedInput: '.hf-input-shell',
  Textarea: '.hf-textarea', NumberInput: '.hf-number-input__control', Select: '.hf-select, .hf-select-menu',
  Combobox: '.hf-combobox__control, .hf-combobox__menu', MultiSelect: '.hf-multiselect__trigger, .hf-multiselect__menu',
  Cascader: '.hf-cascader .hf-select, .hf-cascader .hf-select-menu', TreeSelect: '.hf-tree-select > .hf-picker-trigger, .hf-tree-select > [role="listbox"]',
  DatePicker: '.hf-picker-trigger, .hf-date-picker__panel', DateRangePicker: '.hf-date-range input',
  TimePicker: '.hf-time-picker > .hf-picker-trigger, .hf-time-picker__panel', TimezoneSelect: '.hf-select, .hf-select-menu', Calendar: '.hf-calendar',
  SegmentedControl: '.hf-segmented', ChoiceGroup: '.hf-choice',
  Switch: '.hf-switch__thumb', Slider: '.hf-slider', Upload: '.hf-upload > button',
  MentionInput: '.hf-mention-input > textarea, .hf-mention-input__menu', ChatComposer: '.hf-chat-composer',
  FloatingNav: '.hf-floating-nav', BottomNavigation: '.hf-bottom-navigation',
  MobileNavigation: '.hf-mobile-nav', MobileContentNavigation: '.hf-mobile-content-navigation',
  ShrinkNav: '.hf-shrink-nav', Sidebar: '.hf-sidebar',
  HierarchicalSidebar: '.hf-hierarchical-sidebar', LongPageNavigation: '.hf-long-page-navigation',
  Tabs: '.hf-tabs', Pagination: '.hf-pagination button',
  Dropdown: '.hf-dropdown > .hf-button, .hf-dropdown__menu', DropdownMenu: '.hf-menu > button, .hf-menu__panel',
  MegaMenu: '.hf-mega-menu > button, .hf-mega-menu__panel', CommandPalette: '.hf-command',
  ContextMenu: '.hf-context-menu', Modal: '.hf-modal', Drawer: '.hf-drawer',
  Popover: '.hf-popover > .hf-button, .hf-popover__content', Popconfirm: '.hf-popconfirm > .hf-button, .hf-popconfirm__panel', Tooltip: '.hf-tooltip__bubble',
  Alert: '.hf-alert', Notification: '.hf-notification',
  NotificationCenter: '.hf-notification-center', Toast: '.hf-toast',
  AnnouncementBar: '.hf-announcement', UndoNotice: '.hf-undo-notice',
  EmptyState: '.hf-empty', Result: '.hf-result',
  Accordion: '.hf-accordion h3 > button, .hf-accordion__panel', ExpandablePanel: '.hf-expandable-panel',
  StatisticCard: '.hf-stat', EventCard: '.hf-event-card',
  ChatMessage: '.hf-chat-message', ToolCallCard: '.hf-tool-call',
  PromptSuggestions: '.hf-prompt-suggestions button', SharePanel: '.hf-share-panel',
  ModelSelector: '.hf-model-selector__trigger, .hf-model-selector__menu', MemberPicker: '.hf-member-picker > input, .hf-member-picker__menu',
  VoiceInput: '.hf-voice-input', KanbanBoard: '.hf-kanban-card',
  List: '.hf-list > li', SortableList: '.hf-sortable__list > li',
  SwipeActions: '.hf-swipe-actions', OnboardingChecklist: '.hf-onboarding',
};
const dissolvable = new Set([
  'Card', 'Badge', 'Tag', 'Alert', 'Notification', 'NotificationCenter', 'Toast',
  'AnnouncementBar', 'EmptyState', 'Result', 'EventCard', 'ChatMessage', 'ToolCallCard',
  'PromptSuggestions', 'KanbanBoard', 'List', 'SortableList', 'SwipeActions',
]);
// 液态只处理实际可见表面；粒子消散继续以完整内容项为单位。
const liquidSurfaces: Record<string, string> = {
  MobileNavigation: '.hf-mobile-nav__bar, .hf-mobile-nav__panel',
  ChatMessage: '.hf-chat-message__content',
  SwipeActions: '.hf-swipe-actions__content',
  Tabs: '.hf-tabs > [role="tablist"]',
};
const structural = new Set(['ThemeProvider', 'Container', 'Grid', 'Stack', 'Divider', 'Masonry',
  'PageLayout', 'ResizablePanel', 'Form', 'FormItem', 'LazyLoad', 'InfiniteScroll']);
const critical = new Set(['HoldToConfirm', 'TypedConfirm', 'ChecklistConfirm', 'ApprovalFlow',
  'PermissionMatrix', 'TaskProgress', 'OptimisticUpdate', 'ProductTour', 'HotspotGuide']);

export function assessMaterial(name: string, mode: MaterialMode = 'original'): MaterialAssessment {
  const selector = (mode === 'liquid' ? liquidSurfaces[name] : undefined) ?? surfaces[name];
  if (selector) return {
    selector, liquid: true, particle: dissolvable.has(name),
    reason: dissolvable.has(name)
      ? '独立内容表面可呈现透光材质；粒子态演示内容表面的消散与恢复，不执行业务删除。'
      : '可将独立控件或浮层表面转换为透光材质；保留输入、导航与确认语义，不消散操作控件。',
  };
  const item = catalog.find(item => item.name === name);
  const reason = structural.has(name) ? '布局、上下文或加载机制没有独立材质表面，效果应由其承载的内容组件提供。'
    : critical.has(name) ? '确认、权限、任务和恢复信息需要持续可见，保留原有状态与反馈。'
    : item?.category === 'developer' ? '代码、编辑器与开发数据以精确阅读和稳定操作为主，保留实色表面。'
    : /Chart|Grid|Table|Calendar|Scheduler|Timeline|Progress|Sparkline|RangeBrush|LegendFilter/.test(name)
      ? '精确数据、时间轴或进度编码需要稳定对比度，保留现有图形与状态。'
      : '当前实现以文字、图标、集合关系或持续状态为主，不增加可能干扰识别的材质与消散。';
  return { selector: '', liquid: false, particle: false, reason };
}

export const materialAssessments = catalog.map(item => ({ ...item, ...assessMaterial(item.name) }));
