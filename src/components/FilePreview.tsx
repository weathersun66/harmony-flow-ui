import type { ReactNode } from 'react';
import { TreeFileIcon } from '../data-display/TreeFileIcon';

export function FilePreview({ name, type, children, size, modified, actions, empty = '选择文件后在此预览' }: {
  name?: ReactNode; type?: string; children?: ReactNode; size?: ReactNode;
  modified?: ReactNode; actions?: ReactNode; empty?: ReactNode;
}) {
  return <section className="hf-file-preview">
    {name != null && name !== '' ? <>
      <header className="hf-file-preview__header">
        <span className="hf-file-preview__icon" aria-hidden="true"><TreeFileIcon folder={false} open={false} /></span>
        <div className="hf-file-preview__info">
          <strong>{name}</strong>
          <div className="hf-file-preview__meta">
            {type && <span>{type}</span>}{size != null && <span>{size}</span>}{modified != null && <span>{modified}</span>}
          </div>
        </div>
        {actions && <div className="hf-file-preview__actions">{actions}</div>}
      </header>
      <div className="hf-file-preview__body">{children}</div>
    </> : <div className="hf-file-preview__empty" role="status">
      <TreeFileIcon folder={false} open={false} /><span>{empty}</span>
    </div>}
  </section>;
}
