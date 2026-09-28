import { useState } from "react";
import {
  ChatComposer,
  MentionInput,
  ModelSelector,
  RecurrenceEditor,
  RichTextEditor,
  TimezoneSelect,
  VoiceInput,
  type RecurrenceValue,
} from '../workspace/InspectableLibrary';
import { RuleScene } from "./advanced-form-preview-shell";
export function RichTextEditorPreview() {
  const [value, setValue] = useState(
    "<p><strong>本次更新</strong>完善了组件文档。</p>",
  );
  return (
    <RuleScene
      slug="richtexteditor"
      title="更新说明"
      note="结构化编辑发布内容"
      result={`内容长度 ${value.length}`}
    >
      <RichTextEditor label="发布说明" value={value} onChange={setValue} />
    </RuleScene>
  );
}
const people = [
  { value: "lin", label: "林晓", description: "设计系统" },
  { value: "chen", label: "陈屿", description: "平台工程" },
];
export function MentionInputPreview() {
  const [value, setValue] = useState("请 @");
  return (
    <RuleScene
      slug="mentioninput"
      title="通知协作者"
      note="输入 @ 筛选成员"
      result={value}
    >
      <MentionInput
        label="发布留言"
        value={value}
        options={people}
        onChange={setValue}
      />
    </RuleScene>
  );
}
export { CodeEditorPreview } from './CodeWorkspacePreview';
export function ChatComposerPreview() {
  const [value, setValue] = useState("请检查本次发布风险");
  const [sent, setSent] = useState("尚未发送");
  return (
    <RuleScene
      slug="chatcomposer"
      title="请求 AI 复核"
      note="Enter 发送，Shift + Enter 换行"
      result={sent}
    >
      <ChatComposer
        value={value}
        onChange={setValue}
        onSend={(message) => {
          setSent(`已发送：${message}`);
          setValue("");
        }}
        maxLength={80}
      />
    </RuleScene>
  );
}
export function VoiceInputPreview() {
  const [state, setState] = useState<"idle" | "listening" | "processing">(
    "idle",
  );
  return (
    <RuleScene
      slug="voiceinput"
      title="语音补充说明"
      note="录音状态即时反馈"
      result={`状态：${state}`}
    >
      <VoiceInput
        state={state}
        duration="00:08"
        level={0.7}
        onStart={() => setState("listening")}
        onStop={() => setState("processing")}
        onCancel={() => setState("idle")}
      />
    </RuleScene>
  );
}
const models = [
  {
    id: "fast",
    name: "Harmony Fast",
    description: "快速检查",
    tags: ["低延迟"],
  },
  {
    id: "deep",
    name: "Harmony Deep",
    description: "完整风险分析",
    tags: ["高准确"],
  },
];
export function ModelSelectorPreview() {
  const [value, setValue] = useState("fast");
  return (
    <RuleScene
      slug="modelselector"
      title="复核模型"
      note="比较能力与用途"
      result={`模型：${value}`}
    >
      <ModelSelector models={models} value={value} onChange={setValue} />
    </RuleScene>
  );
}
export function RecurrenceEditorPreview() {
  const [value, setValue] = useState<RecurrenceValue>({
    frequency: "weekly",
    interval: 1,
  });
  return (
    <RuleScene
      slug="recurrenceeditor"
      title="重复发布检查"
      note="设置频率与间隔"
      result={`${value.frequency} · 每 ${value.interval} 个周期`}
    >
      <RecurrenceEditor value={value} onChange={setValue} />
    </RuleScene>
  );
}
const zones = [
  { value: "Asia/Shanghai", label: "上海", offset: "UTC+8" },
  { value: "Europe/London", label: "伦敦", offset: "UTC+1" },
  { value: "America/Los_Angeles", label: "洛杉矶", offset: "UTC-7" },
];
export function TimezoneSelectPreview() {
  const [value, setValue] = useState("Asia/Shanghai");
  return (
    <RuleScene
      slug="timezoneselect"
      title="执行时区"
      note="所有计划按选定时区显示"
      result={`时区：${value}`}
    >
      <TimezoneSelect options={zones} value={value} onChange={setValue} />
    </RuleScene>
  );
}
