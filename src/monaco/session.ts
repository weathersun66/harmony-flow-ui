import type { CodeEditorProps } from '../components/CodeEditor';
import type { Runtime } from './loadRuntime';
import { observeTheme } from './theme';

type Editor = import('monaco-editor').editor.IStandaloneCodeEditor;
type Model = import('monaco-editor').editor.ITextModel;
type View = import('monaco-editor').editor.ICodeEditorViewState;
type Options = CodeEditorProps & { path?: string };
let instance = 0;

export function createSession(runtime: Runtime, host: HTMLElement, options: Options, onChange: (value: string) => void,
  onPosition: (line: number, column: number) => void) {
  const { monaco } = runtime;
  const id = ++instance;
  const models = new Map<string, { model: Model; view: View | null }>();
  let path = '';
  let syncing = false;
  const stopTheme = observeTheme(runtime, host);
  const editor: Editor = monaco.editor.create(host, {
    model: null, automaticLayout: true, minimap: { enabled: false }, fontSize: 13, lineHeight: 22,
    fontFamily: 'Consolas, "SFMono-Regular", Menlo, Monaco, "Liberation Mono", monospace',
    fontLigatures: false, padding: { top: 12, bottom: 12 }, scrollBeyondLastLine: false,
    tabSize: 2, insertSpaces: true, detectIndentation: false, renderLineHighlight: 'line',
    overviewRulerBorder: false, hideCursorInOverviewRuler: true, fixedOverflowWidgets: false,
    scrollbar: { verticalScrollbarSize: 10, horizontalScrollbarSize: 10, verticalHasArrows: false, horizontalHasArrows: false, useShadows: false },
    accessibilitySupport: 'auto', stickyScroll: { enabled: false }, tabFocusMode: true,
  });
  const changed = editor.onDidChangeModelContent(() => { if (!syncing) onChange(editor.getValue()); });
  const positioned = editor.onDidChangeCursorPosition(event => onPosition(event.position.lineNumber, event.position.column));

  function update(next: Options) {
    const nextPath = next.path ?? 'untitled';
    const language = ['typescript', 'javascript', 'json'].includes(next.language ?? '') ? next.language! : 'plaintext';
    if (path !== nextPath || !editor.getModel()) {
      const previous = models.get(path);
      if (previous) previous.view = editor.saveViewState();
      let entry = models.get(nextPath);
      if (!entry) {
        const uri = monaco.Uri.parse(`file:///harmony-${id}/${nextPath.split('/').map(encodeURIComponent).join('/')}`);
        entry = { model: monaco.editor.createModel(next.value, language, uri), view: null };
      }
      models.delete(nextPath);
      models.set(nextPath, entry);
      path = nextPath;
      editor.setModel(entry.model);
      if (entry.view) editor.restoreViewState(entry.view);
      if (models.size > 20) {
        const oldest = models.keys().next().value!;
        models.get(oldest)!.model.dispose();
        models.delete(oldest);
      }
    }
    const model = editor.getModel()!;
    model.updateOptions({ tabSize: 2, insertSpaces: true });
    if (model.getLanguageId() !== language) monaco.editor.setModelLanguage(model, language);
    if (model.getValue() !== next.value) {
      syncing = true;
      try { model.setValue(next.value); } finally { syncing = false; }
    }
    editor.updateOptions({ readOnly: !!next.readOnly, ariaLabel: next.label ?? '代码编辑器' });
    return model;
  }
  update(options);
  return {
    editor, update,
    dispose() {
      changed.dispose(); positioned.dispose(); stopTheme(); editor.dispose();
      models.forEach(({ model }) => model.dispose()); models.clear();
    },
  };
}
