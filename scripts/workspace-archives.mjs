import { readFile, readdir, writeFile, mkdir } from 'node:fs/promises';

function checksum(data) {
  let crc = -1;
  for (const byte of data) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return (crc ^ -1) >>> 0;
}
function zip(entries) {
  const blocks = [], directory = [];
  let offset = 0;
  for (const [name, value] of entries) {
    const data = Buffer.isBuffer(value) ? value : Buffer.from(value);
    const filename = Buffer.from(name);
    const crc = checksum(data);
    const header = Buffer.alloc(30);
    header.writeUInt32LE(0x04034b50); header.writeUInt16LE(20, 4);
    header.writeUInt16LE(0x800, 6); header.writeUInt32LE(crc, 14);
    header.writeUInt32LE(data.length, 18); header.writeUInt32LE(data.length, 22); header.writeUInt16LE(filename.length, 26);
    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50); central.writeUInt16LE(20, 4); central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0x800, 8); central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(data.length, 20); central.writeUInt32LE(data.length, 24);
    central.writeUInt16LE(filename.length, 28); central.writeUInt32LE(offset, 42);
    blocks.push(header, filename, data); directory.push(central, filename);
    offset += header.length + filename.length + data.length;
  }
  const central = Buffer.concat(directory), end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50); end.writeUInt16LE(entries.length, 8); end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(central.length, 12); end.writeUInt32LE(offset, 16);
  return Buffer.concat([...blocks, central, end]);
}
async function collect(root) {
  const files = [];
  for (const entry of await readdir(root, { withFileTypes: true })) {
    const file = `${root}/${entry.name}`;
    if (entry.isDirectory() && entry.name !== 'previews') files.push(...await collect(file));
    else if (entry.isFile()) files.push([file, await readFile(file)]);
  }
  return files;
}
export async function packageTemplates(output) {
  const versions = Object.fromEntries(await Promise.all(['react', 'react-dom', 'esbuild'].map(async name => [name, JSON.parse(await readFile(`node_modules/${name}/package.json`, 'utf8')).version])));
  const shared = [...await collect('src'), ...await collect('demo'), ['LICENSE', await readFile('LICENSE')], ['scripts/server.mjs', await readFile('scripts/server.mjs')]];
  await mkdir(`${output}/downloads`, { recursive: true });
  const templates = { dashboard: 'WorkspaceShowcase', onboarding: 'ExperienceShowcase', insights: 'DiscoveryShowcase' };
  for (const [slug, component] of Object.entries(templates)) {
    const entry = `import {createRoot} from 'react-dom/client';\nimport './demo/workspace/library-styles.css';\nimport './demo/demo.css';\nimport {${component}} from './demo/${component}';\ncreateRoot(document.getElementById('root')!).render(<${component} />);\n`;
    const pkg = { name: `harmony-${slug}`, private: true, type: 'module', scripts: { build: 'node build.mjs', start: 'node server.mjs' }, dependencies: versions };
    const build = `import {build} from 'esbuild';\nimport {mkdir,writeFile,cp} from 'node:fs/promises';\nawait mkdir('build',{recursive:true});\nawait cp('demo/assets','build',{recursive:true});\nawait build({entryPoints:['entry.tsx'],bundle:true,jsx:'automatic',format:'esm',outfile:'build/app.js'});\nawait writeFile('build/index.html','<!doctype html><html lang=zh-CN><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><link rel=icon type="image/png" href="/brand/favicon-32-20260925.png"><link rel=apple-touch-icon href="/brand/apple-touch-icon-20260925.png"><link rel=stylesheet href=app.css><div id=root></div><script type=module src=app.js></script></html>');\n`;
    const files = [...shared, ['entry.tsx', entry], ['package.json', JSON.stringify(pkg, null, 2)], ['build.mjs', build], ['server.mjs', "process.env.HF_DEMO_ROOT='build'; await import('./scripts/server.mjs');"], ['README.md', '# Harmony Flow 模板源码\n\nnpm install → npm run build → npm start。默认端口6633。\n\n包含当前组件工作区源码与演示数据。真实身份、权限、网络和持久化需按业务接入。\n']];
    await writeFile(`${output}/downloads/${slug}.zip`, zip(files));
  }
}
