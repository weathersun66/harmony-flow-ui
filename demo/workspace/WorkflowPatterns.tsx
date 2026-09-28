import { useState } from 'react';
import { Button } from '../../src/components/Button';
import { DataGrid } from '../../src/data-display/DataGrid';
import { Upload } from '../../src/forms/Upload';
import { UndoNotice } from '../../src/feedback/UndoNotice';

export function TableActions() {
  const [selected, setSelected] = useState<string[]>([]);
  const rows = [{ id: '01', name: '界面规范', status: '待评审' }, { id: '02', name: '组件清单', status: '已完成' }];
  return <section><DataGrid data={rows} rowKey="id" selectedKeys={selected} onSelectionChange={setSelected} columns={[{ key: 'name', header: '任务', sortable: true }, { key: 'status', header: '状态' }]} /><p role="status">已选择 {selected.length} 项</p><Button variant="secondary" disabled={!selected.length} onClick={() => setSelected([])}>清除选择</Button></section>;
}
export function UploadFlow() {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState('');
  return <section><Upload label="选择文件" multiple maxFiles={3} maxSize={5 * 1024 * 1024} hint="最多3个文件，单个不超过5MB；仅本地选择，不发送到服务器。" onFiles={value => { setFiles(value); setError(''); }} onReject={items => setError(items.map(item => item.message).join('；'))} />{error && <p role="alert">{error}</p>}<ul>{files.map((file, index) => <li key={`${file.name}-${index}`}>{file.name} · {file.size} 字节</li>)}</ul>{files.length > 0 && <Button variant="secondary" onClick={() => setFiles([])}>清空文件列表</Button>}</section>;
}
export function UndoFlow() {
  const [archived, setArchived] = useState(false);
  const [operation, setOperation] = useState(0);
  return <section><p role="status">本地示例任务：{archived ? '已归档' : '处理中'}</p><Button disabled={archived} onClick={() => { setArchived(true); setOperation(value => value + 1); }}>归档示例任务</Button>{archived && <UndoNotice operationKey={`demo-${operation}`} message="本地示例任务已归档" onUndo={async signal => { if (signal.aborted) throw new Error('操作已取消'); setArchived(false); }} />}</section>;
}
