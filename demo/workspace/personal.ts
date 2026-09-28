import { useSyncExternalStore } from 'react';
import { catalog } from './catalog/catalog';

interface PersonalState { favorites: string[]; recents: { id: string; at: number }[]; warning: string }
const key = 'hf.workspace.personal.v1';
const known = new Set(catalog.map(item => item.id));
function read(): PersonalState {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(key);
    if (raw && raw.length > 256000) throw new Error('个人记录超过允许大小');
    const data = raw ? JSON.parse(raw) : {};
    if (data.schemaVersion !== undefined && data.schemaVersion !== 1) throw new Error('不支持的存储版本');
    const seen = new Set<string>();
    return {
      favorites: Array.isArray(data.favorites) ? [...new Set<string>(data.favorites.filter((id: unknown) => typeof id === 'string' && known.has(id)))] : [],
      recents: Array.isArray(data.recents) ? data.recents.filter((r: {id?: string; at?: number}) => {
        if (!r || !r.id || !known.has(r.id) || seen.has(r.id) || typeof r.at !== 'number' || !Number.isFinite(r.at) || r.at <= Date.now() - 90 * 86400000 || r.at > Date.now() + 86400000) return false;
        seen.add(r.id); return true;
      }).slice(0, 50) : [],
      warning: '',
    };
  } catch {
    if (raw) {
      try { if (!localStorage.getItem(`${key}.recovery`)) localStorage.setItem(`${key}.recovery`, raw); }
      catch { return { favorites: [], recents: [], warning: '无法读取或备份浏览器记录，本次操作仅保存在内存中。' }; }
    }
    return { favorites: [], recents: [], warning: '本地记录暂不可用，本次操作将保存在内存中。' };
  }
}
let state = read();
const listeners = new Set<() => void>();
const notify = () => listeners.forEach(listener => listener());
window.addEventListener('storage', event => { if (event.key === key || event.key === null) { state = read(); notify(); } });
function save(next: PersonalState) {
  state = next;
  try { localStorage.setItem(key, JSON.stringify({ schemaVersion: 1, ...next, warning: undefined })); }
  catch { state = { ...next, warning: '无法保存到浏览器，刷新后本次记录可能丢失。' }; }
  notify();
}
export const personal = {
  toggle(id: string) { if (known.has(id)) save({ ...state, favorites: state.favorites.includes(id) ? state.favorites.filter(value => value !== id) : [id, ...state.favorites] }); },
  visit(id: string) { if (known.has(id)) save({ ...state, recents: [{ id, at: Date.now() }, ...state.recents.filter(value => value.id !== id)].slice(0, 50) }); },
  removeRecent(id: string) { save({ ...state, recents: state.recents.filter(value => value.id !== id) }); },
  clear() { save({ ...state, recents: [] }); },
};
export function usePersonal() {
  return useSyncExternalStore(listener => { listeners.add(listener); return () => { listeners.delete(listener); }; }, () => state);
}
