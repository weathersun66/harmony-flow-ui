// 为目标 JSX 起始标签追加覆盖属性；跳过字符串及表达式内的 >。
// 不解析/执行用户代码，仅处理仓库审核过的示例字符串。
export function withPreviewProps(source: string, name: string) {
  const pattern = new RegExp('<' + name + '(?=[\\s/>])', 'g');
  const insertions: number[] = [];
  for (const match of source.matchAll(pattern)) {
    let quote = '', braces = 0;
    for (let index = match.index! + match[0].length; index < source.length; index++) {
      const char = source[index]!;
      if (quote) {
        if (char === '\\') index++;
        else if (char === quote) quote = '';
      } else if (['"', "'", '`'].includes(char)) quote = char;
      else if (char === '{') braces++;
      else if (char === '}') braces--;
      else if (char === '>' && braces === 0) {
        insertions.push(source[index - 1] === '/' ? index - 1 : index);
        break;
      }
    }
  }
  let result = source;
  for (const index of insertions.reverse()) result = result.slice(0, index) + ' {...previewProps}' + result.slice(index);
  return result;
}
