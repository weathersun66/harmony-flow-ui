/** 默认目录与文档图标，节点 icon 可覆盖默认图标。 */
export function TreeFileIcon({ folder, open }: { folder: boolean; open: boolean }) {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {folder ? <>
      <path d="M3 18V6a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v2" />
      <path d={open ? 'M3 18 6 11h16l-3 9H5a2 2 0 0 1-2-2Z' : 'M3 10h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z'} />
    </> : <><path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8Z M14 3v5h5" /><path d="M9 12h6M9 16h4" /></>}
  </svg>;
}
