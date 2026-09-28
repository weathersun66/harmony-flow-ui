import { lstat, mkdir, rename, stat } from 'node:fs/promises';
import { resolve, relative, isAbsolute } from 'node:path';

export async function archiveCompatibilityOutput(name) {
  if (!['demo-dist', 'preview-deploy', 'dist'].includes(name)) throw new Error('未授权的兼容产物路径');
  const root = resolve('.');
  const source = resolve(root, name);
  const target = resolve(root, 'laji', `workspace-output-${Date.now()}`, name);
  for (const path of [source, target]) {
    const local = relative(root, path);
    if (!local || local.startsWith('..') || isAbsolute(local)) throw new Error('归档路径越出项目');
  }
  try {
    const info = await lstat(source);
    if (!info.isDirectory() || info.isSymbolicLink()) throw new Error('兼容输出不是普通目录');
  } catch (error) { if (error.code === 'ENOENT') return; throw error; }
  console.log(JSON.stringify({ step: 'archive-precheck', source, target }));
  await mkdir(resolve(target, '..'), { recursive: true });
  await rename(source, target);
  if (!(await stat(target)).isDirectory()) throw new Error('归档验证失败');
  console.log(JSON.stringify({ step: 'archived', source, target }));
}
