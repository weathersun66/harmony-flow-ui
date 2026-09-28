import { useState } from "react";
import { PermissionMatrix, VersionHistory, type PermissionLevel } from '../workspace/InspectableLibrary';

function AssetVault({ slug, code, title, status, children }: { slug: string; code: string; title: string; status: string; children: React.ReactNode }) {
  return <section className="asset-vault" data-doc-preview={slug}><header><span>ASSET VAULT / {code}</span><h4>{title}</h4><b>CONTROLLED</b></header><div className="asset-vault__content">{children}</div><output aria-live="polite">{status}</output></section>;
}

export { FileExplorerPreview, FilePreviewPreview } from './FileWorkspacePreviews';

const versions = [{ id: "v12", version: "v12 · current", author: { name: "林默" }, timestamp: "今天 09:42", description: "补齐支付失败后的恢复路径与屏幕阅读器标注", current: true, tags: ["approved", "a11y"] }, { id: "v11", version: "v11", author: { name: "周宁" }, timestamp: "昨天 18:06", description: "合并移动端确认页，统一订单摘要", tags: ["mobile"] }, { id: "v10", version: "v10", author: { name: "陈屿" }, timestamp: "8 月 19 日", description: "首次交付评审版本" }];

export function VersionHistoryPreview() {
  const [selected, setSelected] = useState("v12");
  const [status, setStatus] = useState("当前版本：v12");
  return <AssetVault slug="versionhistory" code="A-104 / HISTORY" title="版本与恢复点" status={status}><VersionHistory versions={versions} selectedId={selected} onSelect={(id) => { setSelected(id); setStatus(`已选择版本：${id}`); }} onRestore={(id) => setStatus(`已请求恢复：${id}`)} /></AssetVault>;
}

const subjects = [{ id: "design", name: "产品设计组", description: "12 位成员", avatar: "D" }, { id: "qa", name: "质量与无障碍评审委员会", description: "4 位成员", avatar: "Q" }];
const resources = [{ id: "source", name: "源文件" }, { id: "spec", name: "验收规范" }, { id: "release", name: "发布包" }];

export function PermissionMatrixPreview() {
  const [value, setValue] = useState<Record<string, Record<string, PermissionLevel>>>({ design: { source: "edit", spec: "comment", release: "view" }, qa: { source: "view", spec: "edit", release: "none" } });
  const [status, setStatus] = useState("权限策略：最小授权");
  const change = (subject: string, resource: string, level: PermissionLevel) => { setValue((current) => ({ ...current, [subject]: { ...current[subject], [resource]: level } })); setStatus(`权限已更新：${subject}/${resource} → ${level}`); };
  return <AssetVault slug="permissionmatrix" code="A-104 / ACCESS" title="角色资源权限" status={status}><div className="asset-vault__scroll"><PermissionMatrix subjects={subjects} resources={resources} value={value} onChange={change} /></div></AssetVault>;
}
