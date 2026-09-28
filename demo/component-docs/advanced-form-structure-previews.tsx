import { useState } from "react";
import {
  Cascader,
  ColorPicker,
  DateRangePicker,
  FilterBuilder,
  MemberPicker,
  QueryBuilder,
  SearchInput,
  Transfer,
  TreeSelect,
  type FilterValue,
  type QueryRule,
} from '../workspace/InspectableLibrary';
import { RuleScene } from "./advanced-form-preview-shell";
const regions = [
  {
    value: "cn",
    label: "中国",
    children: [
      {
        value: "east",
        label: "华东",
        children: [
          { value: "sh", label: "上海" },
          { value: "hz", label: "杭州" },
        ],
      },
      {
        value: "south",
        label: "华南",
        children: [{ value: "sz", label: "深圳" }],
      },
    ],
  },
];
export function CascaderPreview() {
  const [value, setValue] = useState<string[]>(["cn", "east", "sh"]);
  return (
    <RuleScene
      slug="cascader"
      title="发布区域"
      note="逐级收窄范围"
      result={`路径：${value.join(" / ")}`}
    >
      <Cascader
        label="目标区域"
        options={regions}
        value={value}
        onChange={setValue}
      />
    </RuleScene>
  );
}
const tree = [
  {
    key: "workspace",
    label: "产品工作区",
    children: [
      { key: "design", label: "设计系统" },
      { key: "growth", label: "增长实验" },
    ],
  },
  { key: "archive", label: "历史归档", disabled: true },
];
export function TreeSelectPreview() {
  const [value, setValue] = useState("design");
  return (
    <RuleScene
      slug="treeselect"
      title="内容归档位置"
      note="保留层级上下文"
      result={`节点：${value}`}
    >
      <TreeSelect
        label="目标节点"
        options={tree}
        value={value}
        onChange={setValue}
      />
    </RuleScene>
  );
}
const audiences = [
  { key: "beta", label: "Beta 用户" },
  { key: "staff", label: "内部成员" },
  { key: "guest", label: "访客", disabled: true },
];
export function TransferPreview() {
  const [value, setValue] = useState<string[]>(["staff"]);
  return (
    <RuleScene
      slug="transfer"
      title="受众分配"
      note="在两个集合间移动"
      result={`已选择 ${value.length} 组`}
    >
      <Transfer
        items={audiences}
        value={value}
        onChange={setValue}
        titles={["可用受众", "发布受众"]}
      />
    </RuleScene>
  );
}
export function DateRangePickerPreview() {
  const [value, setValue] = useState<[string, string]>([
    "2026-08-24",
    "2026-08-31",
  ]);
  return (
    <RuleScene
      slug="daterangepicker"
      title="灰度窗口"
      note="结束日期不早于开始日期"
      result={`${value[0]} → ${value[1]}`}
    >
      <DateRangePicker
        label="开放时间"
        value={value}
        min="2026-08-21"
        onChange={setValue}
      />
    </RuleScene>
  );
}
export function SearchInputPreview() {
  const [result, setResult] = useState("等待搜索");
  return (
    <RuleScene
      slug="searchinput"
      title="查找发布记录"
      note="提交或清空关键词"
      result={result}
    >
      <SearchInput
        aria-label="搜索发布记录"
        defaultValue="移动端"
        onSearch={(value) => setResult(`正在查找：${value}`)}
      />
    </RuleScene>
  );
}
export function ColorPickerPreview() {
  const [value, setValue] = useState("#0a7cff");
  return (
    <RuleScene
      slug="colorpicker"
      title="发布标识色"
      note="预设与自定义颜色"
      result={`颜色：${value.toUpperCase()}`}
    >
      <ColorPicker label="标识色" value={value} onChange={setValue} />
    </RuleScene>
  );
}
const queryFields = [
  { key: "status", label: "状态" },
  { key: "score", label: "完成度", type: "number" as const },
];
export function QueryBuilderPreview() {
  const [rules, setRules] = useState<QueryRule[]>([
    { id: "r1", field: "status", operator: "equals", value: "ready" },
  ]);
  const [join, setJoin] = useState<"and" | "or">("and");
  return (
    <RuleScene
      slug="querybuilder"
      title="准入条件"
      note="组合字段、运算符和值"
      result={`${join === "and" ? "全部" : "任一"} · ${rules.length} 条规则`}
    >
      <QueryBuilder
        fields={queryFields}
        rules={rules}
        onChange={setRules}
        conjunction={join}
        onConjunctionChange={setJoin}
      />
    </RuleScene>
  );
}
const filterFields = [
  {
    key: "team",
    label: "团队",
    options: [
      { value: "design", label: "设计系统组" },
      { value: "platform", label: "平台工程组" },
    ],
  },
  { key: "owner", label: "负责人" },
];
export function FilterBuilderPreview() {
  const [value, setValue] = useState<FilterValue[]>([
    { id: "f1", field: "team", value: "design" },
  ]);
  return (
    <RuleScene
      slug="filterbuilder"
      title="可见范围筛选"
      note="快速添加或清空条件"
      result={`${value.length} 个筛选条件`}
    >
      <FilterBuilder fields={filterFields} value={value} onChange={setValue} />
    </RuleScene>
  );
}
const members = [
  { id: "lin", name: "林晓", description: "设计系统" },
  { id: "chen", name: "陈屿", description: "平台工程" },
  { id: "zhou", name: "周宁", description: "产品体验" },
];
export function MemberPickerPreview() {
  const [value, setValue] = useState<string[]>(["lin"]);
  return (
    <RuleScene
      slug="memberpicker"
      title="发布负责人"
      note="搜索、添加与移除成员"
      result={`已添加 ${value.length} 位成员`}
    >
      <MemberPicker members={members} value={value} onChange={setValue} />
    </RuleScene>
  );
}
