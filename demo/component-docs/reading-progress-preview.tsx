import { useState } from 'react';
import { ReadingProgress } from '../workspace/InspectableLibrary';
import './reading-progress-docs.css';

const sections = [
  ['先看研究结论', '本周访谈围绕资料检索展开。用户希望在长报告里看清当前位置，并随时回到需要的章节。进度条帮助判断剩余滚动距离，章节目录帮助定位具体主题。', '团队将结论放在开头，访谈细节和参考资料放在后面，让不同阅读目的的人都能找到入口。'],
  ['保留稳定的位置参照', '阅读时保持内容的自然顺序，用清晰的小标题划分观点。底部的进度随滚动位置更新，停留时不自动前进，也不推断读者是否理解了内容。', '位置反馈始终放在报告下方，不覆盖正文，也不要求读者额外点击确认。'],
  ['把交互留在上下文里', '资料补充后，报告变长，进度会重新计算。桌面可使用滚轮，键盘可聚焦阅读区域后按方向键或 PageDown，手机可以直接在内容区域滑动。', '新增内容可能让当前百分比下降，这是总长度变化的结果。需要固定阅读记录时，应另外保存章节或书签。'],
  ['下一步研究', '下一轮将验证目录定位与报告阅读的配合。报告中的任务完成度应由业务数据维护，阅读进度只表达当前可滚动内容的位置。', '后续会观察读者是否能更快返回关键结论，并据此调整章节标题和参考资料的组织方式。'],
];

export function ReadingProgressPreview() {
  const [target, setTarget] = useState<HTMLDivElement | null>(null);
  return <div className="hf-reading-demo">
    <div ref={setTarget} className="hf-reading-demo__viewport" tabIndex={0} role="region" aria-label="研究报告阅读区">
      <article>
        <p className="hf-reading-demo__meta">用户研究 · 阅读示例</p>
        <h3>让长报告更容易阅读</h3>
        <p>在下方报告内滚动，查看底部位置变化。</p>
        {sections.map(([title, body, detail]) => <section key={title}><h4>{title}</h4><p>{body}</p><p>{detail}</p></section>)}
      </article>
    </div>
    <div className="hf-reading-demo__footer"><ReadingProgress target={target} /></div>
  </div>;
}
