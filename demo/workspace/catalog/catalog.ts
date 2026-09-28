import { records } from './records';

export interface CatalogItem {
  id: string;
  name: string;
  title: string;
  description: string;
  category: string;
  subgroup: string;
  docKey: string;
  source: string;
}
export const catalog: readonly CatalogItem[] = records;
export const categories = [
  { id: 'basic', title: '基础', english: 'Basic', icon: '◇' },
  { id: 'layout', title: '布局', english: 'Layout', icon: '▦' },
  { id: 'navigation', title: '导航', english: 'Navigation', icon: '↗' },
  { id: 'data-entry', title: '数据录入', english: 'Data Entry', icon: '⌨' },
  { id: 'data-display', title: '数据展示', english: 'Data Display', icon: '▤' },
  { id: 'feedback', title: '反馈', english: 'Feedback', icon: '◉' },
  { id: 'media', title: '媒体', english: 'Media', icon: '▧' },
  { id: 'developer', title: '开发工具', english: 'Developer Tools', icon: '⌘' },
  { id: 'business', title: '业务', english: 'Business', icon: '▣' },
] as const;
export const categoryTitle = (id: string) => categories.find(c => c.id === id)?.title ?? '全部组件';
export const componentUrl = (item: CatalogItem) => `/components/${item.id}`;
export const importCode = (item: CatalogItem) => `import { ${item.name} } from '@hxdhxd/harmony-flow-ui';`;

const aliases: Record<string, string> = {
  modal: '弹窗 对话框 dialog popup overlay', drawer: '弹窗 侧边抽屉 overlay',
  popover: '弹窗 气泡 popup', popconfirm: '弹窗 确认 dialog',
  upload: '上传 文件 图片 拖拽 fileuploader imageupload dragupload',
  numberinput: 'inputnumber 数字 输入', input: 'inp 文本 邮箱 登录 login',
  searchinput: '搜索 search inp', textarea: '输入 多行 文本',
  authlayout: '登录 注册 login signup', table: '表格 列表 数据 清单',
  datagrid: '表格 数据 筛选 排序 批量', select: '下拉 选择 筛选',
  undonotice: '撤销 恢复 误删 undo', button: '按钮 提交 保存 操作',
};
export function normalize(value: string) {
  return value.normalize('NFKC').trim().toLowerCase();
}
function distance(a: string, b: string) {
  let row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const next = [i];
    for (let j = 1; j <= b.length; j++) next[j] = Math.min(next[j - 1]! + 1, row[j]! + 1, row[j - 1]! + Number(a[i - 1] !== b[j - 1]));
    row = next;
  }
  return row[b.length]!;
}
export function scoreItem(item: CatalogItem, query: string) {
  const q = normalize(query);
  if (!q) return 1;
  const name = normalize(item.name);
  if (name === q) return 100;
  if (name.startsWith(q)) return 90;
  if (normalize(item.title) === q) return 85;
  if ((aliases[item.id] ?? '').split(' ').includes(q)) return 80;
  const haystack = normalize(`${item.name} ${item.title} ${item.description} ${item.subgroup} ${categoryTitle(item.category)} ${aliases[item.id] ?? ''}`);
  if (q.split(/\s+/).every(word => haystack.includes(word))) return 60;
  if (/^[a-z]{3,}$/.test(q) && distance(name, q) <= (q.length >= 6 ? 2 : 1)) return 30;
  return 0;
}
export function searchCatalog(query: string, items = catalog) {
  return items.map(item => ({ item, score: scoreItem(item, query) }))
    .filter(result => result.score > 0)
    .sort((a, b) => b.score - a.score || a.item.name.localeCompare(b.item.name, 'en'))
    .map(result => result.item);
}
