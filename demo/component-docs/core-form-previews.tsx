import { useState, type ReactNode } from 'react';
import {
  Button, Calendar, CheckboxGroup, ChoiceGroup, DatePicker, Form, FormItem, Input,
  MultiSelect, RadioGroup, SegmentedControl, Slider, TimePicker, Upload, ValidatedInput,
} from '../workspace/InspectableLibrary';

function FormScene({ slug, title, children, result }: { slug: string; title: string; children: ReactNode; result?: ReactNode }) {
  return <div className="form-doc-scene" data-doc-preview={slug}><header><span>发布设置</span><strong>{title}</strong></header><div className="form-doc-scene__body">{children}</div>{result && <div className="form-doc-scene__result" role="status">{result}</div>}</div>;
}

export function CalendarPreview() {
  const [value, setValue] = useState('2026-08-21');
  return <FormScene slug="calendar" title="选择上线日期" result={`已选择 ${value}`}><Calendar value={value} min="2026-08-18" max="2026-09-12" onChange={setValue} /></FormScene>;
}

const channels = [
  { label: '站内通知', value: 'inbox', description: '在工作台通知成员' },
  { label: '邮件摘要', value: 'email', description: '发送发布结果摘要' },
  { label: '短信提醒', value: 'sms', description: '仅用于高优先级事件', disabled: true },
] as const;

export function CheckboxGroupPreview() {
  const [value, setValue] = useState<string[]>(['inbox']);
  return <FormScene slug="checkboxgroup" title="通知渠道" result={`已选择 ${value.length} 个渠道`}><CheckboxGroup label="发布后通知" options={channels} value={value} onChange={setValue} /></FormScene>;
}

export function ChoiceGroupPreview() {
  const [value, setValue] = useState<string[]>(['owner', 'reviewer']);
  const options = [{ label: '负责人', value: 'owner' }, { label: '评审人', value: 'reviewer' }, { label: '观察者', value: 'viewer' }];
  return <FormScene slug="choicegroup" title="可见角色" result={value.join(' · ')}><ChoiceGroup type="checkbox" direction="row" label="允许查看" options={options} value={value} onChange={(next) => setValue(next as string[])} /></FormScene>;
}

export function DatePickerPreview() {
  const [value, setValue] = useState('2026-08-28');
  return <FormScene slug="datepicker" title="计划发布日期" result={`发布日期 ${value}`}><DatePicker label="日期" value={value} min="2026-08-21" onChange={setValue} /></FormScene>;
}

export function FormPreview() {
  const [saved, setSaved] = useState('尚未保存');
  return <FormScene slug="form" title="发布信息" result={saved}><Form onSubmit={(event) => { event.preventDefault(); setSaved('发布信息已保存'); }}><FormItem label="版本名称" required><Input aria-label="版本名称" defaultValue="秋季体验更新" /></FormItem><Button type="submit">保存发布信息</Button></Form></FormScene>;
}

export function FormItemPreview() {
  return <FormScene slug="formitem" title="字段状态"><Form><FormItem label="发布说明" required hint="团队成员将在更新页看到这段内容"><Input aria-label="发布说明" defaultValue="改进组件预览体验" /></FormItem><FormItem label="回滚地址" error="请输入 HTTPS 地址"><Input aria-label="回滚地址" defaultValue="staging.local" /></FormItem></Form></FormScene>;
}

const teams = [{ label: '设计系统组', value: 'design' }, { label: '增长产品组', value: 'growth' }, { label: '平台工程组', value: 'platform' }];
export function MultiSelectPreview() {
  const [value, setValue] = useState<string[]>(['design']);
  return <FormScene slug="multiselect" title="发布范围" result={`覆盖 ${value.length} 个团队`}><MultiSelect label="可见团队" options={teams} value={value} max={2} hint="最多选择两个团队" onChange={setValue} /></FormScene>;
}

export function RadioGroupPreview() {
  const [value, setValue] = useState('staged');
  const options = [{ label: '分批发布', value: 'staged', description: '先向 10% 用户开放' }, { label: '全部发布', value: 'all', description: '立即向所有用户开放' }];
  return <FormScene slug="radiogroup" title="发布策略" result={`当前策略：${value}`}><RadioGroup label="选择策略" options={options} value={value} onChange={setValue} /></FormScene>;
}

export function SegmentedControlPreview() {
  const [value, setValue] = useState('preview');
  const options = [{ label: '草稿', value: 'draft' }, { label: '预览', value: 'preview' }, { label: '正式', value: 'live' }];
  return <FormScene slug="segmentedcontrol" title="目标环境" result={`环境：${value}`}><SegmentedControl label="目标环境" options={options} value={value} onChange={setValue} /></FormScene>;
}

export function SliderPreview() {
  const [value, setValue] = useState(30);
  return <FormScene slug="slider" title="灰度比例" result={`${value}% 用户将收到更新`}><Slider label="发布比例" value={value} min={10} max={100} step={10} onChange={setValue} /></FormScene>;
}

export function TimePickerPreview() {
  const [value, setValue] = useState('15:30');
  return <FormScene slug="timepicker" title="发布时间" result={`计划在 ${value} 执行`}><TimePicker label="时间" value={value} step={30} onChange={setValue} /></FormScene>;
}

export function UploadPreview() {
  const [message, setMessage] = useState('仅接受 PNG 或 PDF，最大 1 MB');
  return <FormScene slug="upload" title="发布附件" result={message}><Upload label="上传变更说明" accept=".png,.pdf" maxFiles={1} maxSize={1024 * 1024} hint="拖放文件也可以" onFiles={(files) => files[0] && setMessage(`已接收 ${files[0].name}`)} onReject={(items) => setMessage(items[0]?.message ?? '文件未接收')} /></FormScene>;
}

export function ValidatedInputPreview() {
  const [value, setValue] = useState('release/');
  const [valid, setValid] = useState(false);
  const rules = [{ validate: (next: string) => next.length >= 10, message: '地址至少需要 10 个字符' }, { validate: (next: string) => next.startsWith('release/'), message: '地址必须以 release/ 开头' }];
  return <FormScene slug="validatedinput" title="发布地址" result={valid ? '地址有效，可以继续' : '等待有效地址'}><ValidatedInput label="发布路径" value={value} rules={rules} onChange={setValue} onValidityChange={setValid} /></FormScene>;
}
