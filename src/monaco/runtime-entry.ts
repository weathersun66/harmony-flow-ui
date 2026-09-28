import * as monaco from 'monaco-editor/editor/editor.api.js';
import * as typescript from 'monaco-editor/languages/features/typescript/register.js';
import * as json from 'monaco-editor/languages/features/json/register.js';
import 'monaco-editor/languages/definitions/typescript/register.js';
import 'monaco-editor/languages/definitions/javascript/register.js';
// 0.56 的语言 Worker 依赖编辑器服务注册；必须在首次 create 前完成，避免延迟注册遗漏服务。
import 'monaco-editor/internal/common/workers.js';

const failures = new Set<() => void>();
const scope = globalThis as typeof globalThis & { MonacoEnvironment?: monaco.Environment };
scope.MonacoEnvironment = {
  getWorker(_moduleId, label) {
    const name = label === 'typescript' || label === 'javascript' ? 'typescript' : label === 'json' ? 'json' : 'editor';
    const worker = new Worker(new URL(`./${name}.worker.js`, import.meta.url), { type: 'module', name: `hf-${name}` });
    worker.addEventListener('error', () => failures.forEach(callback => callback()));
    return worker;
  },
};
json.jsonDefaults.setDiagnosticsOptions({ validate: true, allowComments: false, enableSchemaRequest: false });

export function onWorkerError(callback: () => void) {
  failures.add(callback);
  return () => { failures.delete(callback); };
}

export function restartWorkers() {
  typescript.typescriptDefaults.setCompilerOptions(typescript.typescriptDefaults.getCompilerOptions());
  typescript.javascriptDefaults.setCompilerOptions(typescript.javascriptDefaults.getCompilerOptions());
  json.jsonDefaults.setDiagnosticsOptions(json.jsonDefaults.diagnosticsOptions);
}

// 首次设定模型时，Monaco 的语言激活和 getWorker 可能处于同一异步周期。
// 只等待尚未注册这一明确状态；网络、Worker 和其他错误直接向调用方传播。
async function whenRegistered<T>(factory: () => Promise<T>): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try { return await factory(); }
    catch (error) {
      if (attempt >= 100 || !/^(TypeScript|JavaScript|JSON) not registered!$/.test(String(error))) throw error;
      await new Promise(resolve => setTimeout(resolve, 20));
    }
  }
}

/** Require a real worker roundtrip before declaring the enhanced editor ready. */
export async function verifyWorker(model: monaco.editor.ITextModel) {
  const language = model.getLanguageId();
  if (language === 'typescript' || language === 'javascript') {
    const factory = await whenRegistered(language === 'typescript' ? typescript.getTypeScriptWorker : typescript.getJavaScriptWorker);
    const worker = await factory(model.uri);
    await worker.getSyntacticDiagnostics(model.uri.toString());
  } else if (language === 'json') {
    const factory = await whenRegistered(json.getWorker);
    const worker = await factory(model.uri);
    await worker.parseJSONDocument(model.uri.toString());
  }
}

export { monaco };
