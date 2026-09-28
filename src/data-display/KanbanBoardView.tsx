import type { CSSProperties } from 'react';
import type { KanbanBoardProps } from './WorkflowViews';
import { useKanbanMove } from './useKanbanMove';

/** 私有视图：公开类型和入口仍保留在WorkflowViews，避免破坏原有导入路径。 */
export function KanbanBoardView({ columns, onMove, onCardClick, empty }: KanbanBoardProps) {
  const drag = useKanbanMove({ columns, onMove });
  if (!columns.length) return <div className="hf-kanban-board__empty">{empty}</div>;
  return <div className="hf-kanban-enhanced">
    {onMove && <p className="hf-kanban-enhanced__hint">拖动手柄跨列移动，也可选择目标列。Escape 取消拖动。</p>}
    <div ref={drag.root} className="hf-kanban-board" role="group" aria-label="看板" tabIndex={-1}
      data-hf-kanban-root onKeyDown={(event) => { if (event.key === 'Escape') drag.cancel(); }}>
      {columns.map((column) => <section key={column.id} data-hf-kanban-column={column.id}
        data-drop-target={drag.target === column.id} style={{ '--hf-kanban-accent': column.accent } as CSSProperties}
        onDragOver={(event) => { event.preventDefault(); drag.previewNative(column.id); }}
        onDrop={(event) => { event.preventDefault(); drag.drop(column.id); }}>
        <header><strong>{column.title}</strong><span>{column.cards.length}{column.limit ? ` / ${column.limit}` : ''}</span></header>
        <div>{column.cards.map((card, index) => {
          const label = typeof card.title === 'string' ? card.title : `卡片${index + 1}`;
          return <div className="hf-kanban-enhanced__item" key={card.id} data-card-id={card.id}>
            <button type="button" draggable={Boolean(onMove)} className="hf-kanban-card"
              onDragStart={(event) => {
                if (!onMove) { event.preventDefault(); return; }
                drag.begin(card.id, column.id);
                event.dataTransfer.setData('application/x-hf-card', card.id);
                event.dataTransfer.setData('application/x-hf-column', column.id);
              }} onDragEnd={drag.cancel} onClick={() => onCardClick?.(card.id, column.id)}>
              <strong>{card.title}</strong>{card.description && <p>{card.description}</p>}
              {card.tags?.length ? <span>{card.tags.map((tag) => <i key={tag}>{tag}</i>)}</span> : null}
              {card.meta && <small>{card.meta}</small>}
            </button>
            {onMove && <div className="hf-kanban-enhanced__controls">
              <button type="button" className="hf-kanban-enhanced__handle" aria-label={`拖动${label}`}
                onPointerDown={(event) => drag.start(event, card.id, column.id)} onPointerMove={drag.move}
                onPointerUp={drag.finish} onPointerCancel={drag.cancel} onLostPointerCapture={drag.cancel}>↔</button>
              <select aria-label={`移动${label}到`} value="" onChange={(event) => {
                drag.cancel();
                drag.request(card.id, column.id, event.target.value);
              }}>
                <option value="" disabled>移动到…</option>
                {columns.filter((candidate) => candidate.id !== column.id).map((candidate, destinationIndex) =>
                  <option key={candidate.id} value={candidate.id}>{typeof candidate.title === 'string' ? candidate.title : `目标列${destinationIndex + 1}`}</option>)}
              </select>
            </div>}
          </div>;
        })}{!column.cards.length && <p className="hf-kanban-enhanced__empty">暂无卡片{onMove ? '，可拖入此列' : ''}</p>}</div>
      </section>)}
    </div>
    <span className="hf-sr-only" role="status">{drag.announcement}</span>
  </div>;
}
