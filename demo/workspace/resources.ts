import { defaultTheme } from '../../src/theme/tokens';
export const resources = [
  { id: 'login', title: '登录表单', description: '身份入口与字段校验', type: '组合模式', url: '/patterns/login', keywords: 'login input 登录 表单' },
  { id: 'search', title: '搜索筛选', description: '输入与分类条件组合', type: '组合模式', url: '/patterns/search', keywords: 'search inp 搜索 筛选' },
  { id: 'settings', title: '设置面板', description: '开关与受控设置', type: '组合模式', url: '/patterns/settings', keywords: '设置 switch' },
  { id: 'table-actions', title: '表格批量选择', description: '表格、行选择与批量操作入口', type: '组合模式', url: '/patterns/table-actions', keywords: 'table 批量 表格' },
  { id: 'upload-flow', title: '文件选择与反馈', description: '文件校验、错误与列表反馈', type: '组合模式', url: '/patterns/upload-flow', keywords: '上传 upload 文件' },
  { id: 'undo-flow', title: '操作后撤销', description: '归档操作与可恢复反馈', type: '组合模式', url: '/patterns/undo-flow', keywords: 'undo 撤销 恢复 归档' },
  { id: 'dashboard', title: '数据与任务工作台', description: '任务、看板与数据概览', type: '页面模板', url: '/templates/dashboard/details', keywords: 'dashboard admin 工作台' },
  { id: 'onboarding', title: '入口与身份验证', description: '登录与引导流程', type: '页面模板', url: '/templates/onboarding/details', keywords: 'login 注册 登录' },
  { id: 'insights', title: '运营洞察中心', description: '分析与协作视图', type: '页面模板', url: '/templates/insights/details', keywords: 'analytics 分析' },
  { id: 'install', title: '安装与接入', description: 'React、样式与 ThemeProvider', type: '文档', url: '/resources', keywords: 'install npm docs 文档 安装' },
  { id: 'tokens', title: '设计 Tokens', description: '主题、颜色、圆角与动效', type: '设计', url: '/design', keywords: 'tokens color 颜色 字体 主题' },
  { id: 'icons', title: '图标', description: 'Icon 组件与可访问名称', type: '图标', url: '/components/icon', keywords: 'icons 图标 符号' },
  ...Object.entries(defaultTheme).map(([name, value]) => ({ id: name, title: name, description: value, type: 'Token', url: `/design#${name}`, keywords: 'token 颜色 圆角 主题' })),
];
