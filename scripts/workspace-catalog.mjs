import ts from 'typescript';
import { readFile, readdir, writeFile } from 'node:fs/promises';

// 文档注册是名称、描述的真源；分类映射只负责信息架构。
export async function generateCatalog() {
  const entry = await readFile('src/index.ts', 'utf8');
  const styles = [...entry.matchAll(/import '([^']+\.css)'/g)].map(match => `@import '../../src/${match[1].slice(2)}';`);
  await writeFile('demo/workspace/library-styles.css', `/* 保持公开入口样式顺序，避免分包改变成品页面层叠关系。 */\n${styles.join('\n')}\n`, 'utf8');
  const groups = JSON.parse(await readFile('demo/workspace/catalog/groups.json', 'utf8'));
  const records = [];
  const loaders = [];
  for (const file of (await readdir('demo/component-docs')).filter((name) => name.endsWith('-docs.tsx'))) {
    const source = ts.createSourceFile(file, await readFile(`demo/component-docs/${file}`, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const literal = (node) => node && (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) ? node.text : '';
    for (const statement of source.statements) {
      if (!ts.isVariableStatement(statement) || !statement.modifiers?.some((item) => item.kind === ts.SyntaxKind.ExportKeyword)) continue;
      for (const declaration of statement.declarationList.declarations) {
        if (!declaration.initializer || !ts.isArrayLiteralExpression(declaration.initializer)) continue;
        const exportName = declaration.name.getText(source);
        const key = file.replace('.tsx', '');
        loaders.push(`  '${key}': () => import('../../component-docs/${key}').then(m => m.${exportName}),`);
        for (const entry of declaration.initializer.elements) {
          let name, title, description;
          if (ts.isObjectLiteralExpression(entry)) {
            const fields = Object.fromEntries(entry.properties.filter(ts.isPropertyAssignment).map(p => [p.name.getText(source), literal(p.initializer)]));
            ({ name, title, description } = fields);
          } else if (ts.isCallExpression(entry)) {
            [name, title] = entry.arguments.map(literal);
            const category = literal(entry.arguments[2]);
            description = literal(entry.arguments[['通用', '表单', '反馈', '导航', '数据展示'].includes(category) ? 3 : 2]);
          }
          if (!name || !title) throw new Error(`无法解析文档：${file}`);
          const group = groups.find(g => g.names.includes(name));
          if (!group) throw new Error(`组件未分类：${name}`);
          records.push({ id: name.toLowerCase(), name, title, description, category: group.category, subgroup: group.title, docKey: key, source: `demo/component-docs/${file}` });
        }
      }
    }
  }
  if (new Set(records.map(r => r.id)).size !== records.length) throw new Error('组件 ID 重复');
  const classified = groups.flatMap(g => g.names);
  if (classified.length !== records.length || new Set(classified).size !== records.length) throw new Error('分类映射不完整');
  records.sort((a, b) => a.name.localeCompare(b.name, 'en'));
  await writeFile('demo/workspace/InspectableLibrary.tsx', `// 自动生成的展示站代理；公开API仍由src维护。\nimport * as Original from '../../src';\nimport { inspected } from './PreviewConfiguration';\nexport * from '../../src';\n${records.map(record => `export const ${record.name} = inspected(Original.${record.name}, '${record.name}');`).join('\n')}\n`, 'utf8');
  const patternSource = (await readFile('demo/workspace/WorkflowPatterns.tsx', 'utf8')).replace(/from '\.\.\/\.\.\/src\/[^']+'/g, "from '@hxdhxd/harmony-flow-ui'");
  await writeFile('demo/workspace/catalog/patternCode.ts', `// 来自实际可运行的WorkflowPatterns，不维护平行样例。\nexport const workflowPatternCode = ${JSON.stringify(patternSource)};\n`, 'utf8');
  await writeFile('demo/workspace/catalog/records.ts', `// 由 scripts/workspace-catalog.mjs 从真实文档生成，不手工维护。\nexport const records = [\n${records.map(r => `  ${JSON.stringify(r)},`).join('\n')}\n] as const;\n`, 'utf8');
  await writeFile('demo/workspace/catalog/loaders.ts', `// 显式注册，禁止根据用户输入构造 import。\nimport type { ComponentDoc } from '../../component-docs/types';\nexport const loaders: Record<string, () => Promise<readonly ComponentDoc[]>> = {\n${loaders.join('\n')}\n};\n`, 'utf8');
  return records;
}
