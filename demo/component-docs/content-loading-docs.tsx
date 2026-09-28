import type { ComponentDoc } from './types';
import { ContentLoadingPreview, LazyLoadPreview } from './content-loading-preview';

const requestProps = [
  { name: 'onLoad', type: '(signal: AbortSignal) => Promise<void>', defaultValue: '必填', description: '业务追加数据后resolve；失败reject。业务必须检查signal，避免取消后写入旧查询数据' },
  { name: 'hasMore', type: 'boolean', defaultValue: '必填', description: '业务控制是否还有下一页；false停止触发并显示结束状态' },
  { name: 'resetKey', type: 'string | number', defaultValue: '—', description: '更换查询时更新，重置反馈并中止旧请求信号' },
  { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '禁止发起新请求，不中止在途请求' },
  { name: 'label', type: 'string', defaultValue: '加载更多', description: '手动入口文案' },
  { name: 'errorMessage', type: 'string', defaultValue: '加载失败，请重试。', description: '请求失败提示；失败后手动重试' },
  { name: 'className', type: 'string', defaultValue: '—', description: '加载控制区样式类' },
];
const observerProps = [
  { name: 'root', type: 'HTMLElement | null', defaultValue: '视口', description: '回调ref配合state传滚动容器；null等待容器挂载' },
  { name: 'rootMargin', type: 'string', defaultValue: '0px', description: 'IntersectionObserver边距，例如100px提前触发；使用px或%' },
];
export const contentLoadingDocs: readonly ComponentDoc[] = [
  { name: 'LoadMore', title: '加载更多', category: '数据展示', description: '原地追加内容，提供请求中、失败重试与没有更多反馈。',
    importCode: "import { LoadMore } from '@hxdhxd/harmony-flow-ui';",
    exampleCode: '<LoadMore hasMore={hasMore} resetKey={query} onLoad={async signal => { const page = await fetchNext({ signal }); if (!signal.aborted) { setItems(items => [...items, ...page.items]); setHasMore(page.hasMore); } }} />',
    preview: <ContentLoadingPreview />, props: requestProps,
    keyboard: 'Tab聚焦，Enter/Space加载。请求同步加锁，失败仅手动重试；原按钮保留焦点。追加数据不重置滚动位置。卸载或resetKey变化中止信号；业务负责signal检查、游标和数据去重。', related: ['InfiniteScroll', 'LazyLoad', 'Pagination'] },
  { name: 'InfiniteScroll', title: '触底加载', category: '数据展示', description: '底部进入滚动视口时请求更多内容，并保留手动加载入口。',
    importCode: "import { InfiniteScroll } from '@hxdhxd/harmony-flow-ui';",
    exampleCode: '<InfiniteScroll root={scrollElement} hasMore={hasMore} onLoad={loadNext} resetKey={query}><List>{items}</List></InfiniteScroll>',
    preview: <ContentLoadingPreview infinite />, props: [...requestProps, ...observerProps, { name: 'children', type: 'ReactNode', defaultValue: '必填', description: '调用方维护的稳定列表子树' }],
    keyboard: '滚动区支持键盘和触摸，手动入口支持Enter/Space。每次进入哨兵触发一次；持续可见不循环填满视口，失败后必须手动重试。无观察器或margin无效降级手动加载。root变化清理旧观察器，业务切换查询更新resetKey。', related: ['LoadMore', 'LazyLoad', 'VirtualList'] },
  { name: 'LazyLoad', title: '视口懒加载', category: '数据展示', description: '内容首次进入视口时挂载，离开后保留内部状态。',
    importCode: "import { LazyLoad } from '@hxdhxd/harmony-flow-ui';",
    exampleCode: '<LazyLoad minHeight={240} placeholder={<p>等待显示</p>}><Report /></LazyLoad>',
    preview: <LazyLoadPreview />, props: [...observerProps,
      { name: 'children', type: 'ReactNode', defaultValue: '必填', description: '延迟挂载的子树；不负责动态import或请求重试' },
      { name: 'placeholder', type: 'ReactNode', defaultValue: '—', description: '未显示时的占位内容，另有手动显示入口' },
      { name: 'minHeight', type: 'number', defaultValue: '160', description: '保留最小高度px；负值归零，非有限值回退160' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '禁用懒加载，直接显示子树' },
      { name: 'label', type: 'string', defaultValue: '显示内容', description: '手动显示按钮名称' },
      { name: 'className', type: 'string', defaultValue: '—', description: '根容器样式类' }],
    keyboard: '支持Tab/Enter/Space手动挂载。SSR显示占位，挂载后检测；无观察器或margin无效直接显示。首次显示后不因离开视口卸载；需要重置时由React key控制。', related: ['Skeleton', 'LoadMore', 'InfiniteScroll'] },
];
