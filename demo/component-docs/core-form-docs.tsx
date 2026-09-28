import type { ReactNode } from 'react';
import type { ComponentDoc, ComponentPropDoc } from './types';
import {
  CalendarPreview, CheckboxGroupPreview, ChoiceGroupPreview, DatePickerPreview, FormItemPreview,
  FormPreview, MultiSelectPreview, RadioGroupPreview, SegmentedControlPreview, SliderPreview,
  TimePickerPreview, UploadPreview, ValidatedInputPreview,
} from './core-form-previews';
import './core-form-docs.css';

const prop = (name: string, type: string, defaultValue: string, description: string): ComponentPropDoc => ({ name, type, defaultValue, description });
const doc = (name: string, title: string, description: string, preview: ReactNode, exampleCode: string, props: ComponentPropDoc[], keyboard: string, related: string[]): ComponentDoc => ({
  name, title, category: '表单', description, preview, exampleCode,
  importCode: `import { ${name} } from '@hxdhxd/harmony-flow-ui';`, props, keyboard, related,
});

export const coreFormDocs: readonly ComponentDoc[] = [
  doc('Calendar', '日历', '在边界明确的月视图中选择单个日期，并展示今天、选中和禁用状态。', <CalendarPreview />, '<Calendar value={date} min="2026-08-18" onChange={setDate} />', [
    prop('value', 'string', '—', 'ISO 日期值'), prop('onChange', '(value: string) => void', '—', '日期变化'), prop('min / max', 'string', '—', '可选日期边界'),
  ], 'Tab 进入月份导航和日期；Enter 或 Space 选择日期。', ['DatePicker', 'DateRangePicker']),
  doc('CheckboxGroup', '复选组', '从一组可组合选项中选择多个值，并保留选项说明和禁用状态。', <CheckboxGroupPreview />, '<CheckboxGroup options={channels} value={value} onChange={setValue} />', [
    prop('options', 'ChoiceOption[]', '—', '复选项'), prop('value', 'string[]', '—', '受控选中值'), prop('direction', "'row' | 'column'", "'column'", '排列方向'),
  ], 'Tab 在选项间移动；Space 切换当前复选项。', ['ChoiceGroup', 'RadioGroup']),
  doc('ChoiceGroup', '选择组', '使用统一数据结构表达单选或多选问题，适合策略与权限配置。', <ChoiceGroupPreview />, '<ChoiceGroup type="checkbox" options={roles} value={value} onChange={setValue} />', [
    prop('type', "'radio' | 'checkbox'", "'radio'", '选择模式'), prop('options', 'ChoiceOption[]', '—', '选项集合'), prop('disabled', 'boolean', 'false', '禁用整个组'),
  ], '单选项支持方向键切换；复选项使用 Space 切换。', ['CheckboxGroup', 'RadioGroup']),
  doc('DatePicker', '日期选择', '将日期触发器与日历浮层组合，用于表单内的单日选择。', <DatePickerPreview />, '<DatePicker label="日期" value={date} onChange={setDate} />', [
    prop('value', 'string', '—', '当前日期'), prop('onChange', '(value: string) => void', '—', '选择回调'), prop('error', 'ReactNode', '—', '错误提示'),
  ], 'Enter 打开日历；Escape 或点击外部关闭；日期按钮可逐项聚焦。', ['Calendar', 'FormItem']),
  doc('Form', '表单容器', '统一表单布局、提交语义和整组禁用状态。', <FormPreview />, '<Form onSubmit={save}><FormItem label="版本名称">…</FormItem></Form>', [
    prop('layout', "'vertical' | 'horizontal'", "'vertical'", '字段布局'), prop('disabled', 'boolean', 'false', '禁用全部字段'), prop('onSubmit', 'FormEventHandler', '—', '提交处理'),
  ], '遵循表单自然 Tab 顺序；Enter 可提交适用字段。', ['FormItem', 'ValidatedInput']),
  doc('FormItem', '表单项', '组织标签、必填标识、帮助文案和错误信息，形成稳定字段结构。', <FormItemPreview />, '<FormItem label="地址" required error="请输入 HTTPS 地址"><Input /></FormItem>', [
    prop('label', 'ReactNode', '—', '字段标签'), prop('required', 'boolean', 'false', '必填视觉标识'), prop('hint / error', 'ReactNode', '—', '帮助或错误信息'),
  ], '不改变子控件的键盘行为；错误紧随字段呈现。', ['Form', 'Input']),
  doc('MultiSelect', '多选器', '在有限空间内选择多个条目，以标签反馈当前值并支持数量上限。', <MultiSelectPreview />, '<MultiSelect options={teams} value={teams} max={2} onChange={setTeams} />', [
    prop('options', 'SelectOption[]', '—', '候选项'), prop('value', 'readonly string[]', '—', '已选值'), prop('max', 'number', '—', '最大选择数'),
  ], 'Enter 或 Space 展开；Tab 进入选项；标签移除按钮可单独聚焦。', ['Select', 'CheckboxGroup']),
  doc('RadioGroup', '单选组', '从互斥策略中选择一个值，同时展示每项的解释信息。', <RadioGroupPreview />, '<RadioGroup options={strategies} value={value} onChange={setValue} />', [
    prop('options', 'ChoiceOption[]', '—', '互斥选项'), prop('value', 'string', '—', '当前值'), prop('onChange', '(value: string) => void', '—', '选择变化'),
  ], 'Tab 进入选项组；方向键在可用单选项之间切换。', ['ChoiceGroup', 'SegmentedControl']),
  doc('SegmentedControl', '分段选择', '在少量互斥状态间快速切换，当前选项始终可见。', <SegmentedControlPreview />, '<SegmentedControl label="环境" options={options} value={value} onChange={setValue} />', [
    prop('label', 'string', '—', '无障碍分组名称'), prop('options', 'SegmentOption[]', '—', '分段选项'), prop('value', 'string', '—', '当前值'),
  ], '作为单选组支持 Tab 和方向键切换。', ['RadioGroup', 'Tabs']),
  doc('Slider', '滑块', '在连续或分段范围内调整数值，并即时显示结果。', <SliderPreview />, '<Slider label="比例" value={value} min={10} max={100} step={10} onChange={setValue} />', [
    prop('value', 'number', '—', '当前值'), prop('min / max', 'number', '0 / 100', '数值范围'), prop('step', 'number', '1', '调整步长'),
  ], '方向键按 step 调整；Home 和 End 跳到范围边界。', ['NumberInput', 'ProgressBar']),
  doc('TimePicker', '时间选择', '按固定步长列出一天中的时间点，用于计划和排期。', <TimePickerPreview />, '<TimePicker label="时间" value={time} step={30} onChange={setTime} />', [
    prop('value', 'string', '—', 'HH:mm 时间'), prop('step', 'number', '30', '分钟间隔'), prop('onChange', '(value: string) => void', '—', '选择回调'),
  ], 'Enter 打开列表；Tab 遍历选项；Escape 或点击外部关闭。', ['DatePicker', 'TimezoneSelect']),
  doc('Upload', '文件上传', '通过选择或拖放接收文件，并明确反馈类型、大小和数量拒绝原因。', <UploadPreview />, '<Upload accept=".png,.pdf" maxFiles={1} maxSize={1048576} onFiles={setFiles} />', [
    prop('accept', 'string', '—', '允许的 MIME 或扩展名'), prop('maxFiles', 'number', '∞', '最大文件数'), prop('maxSize', 'number', '∞', '单文件字节上限'),
  ], 'Tab 聚焦上传按钮；Enter 或 Space 打开系统文件选择器。', ['FilePreview', 'FormItem']),
  doc('ValidatedInput', '校验输入', '按失焦或输入时机执行规则，并将有效性变化交给业务流程。', <ValidatedInputPreview />, '<ValidatedInput value={path} rules={rules} onChange={setPath} />', [
    prop('rules', 'ValidationRule[]', '—', '顺序校验规则'), prop('validateOn', "'blur' | 'change'", "'blur'", '触发时机'), prop('onValidityChange', '(valid: boolean) => void', '—', '有效性回调'),
  ], '按普通输入框操作；失焦后错误信息通过关联描述呈现。', ['Input', 'FormItem']),
];
