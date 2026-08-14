const DIRECTIVE_LIST = [
  { label: 'assign', insertText: 'assign ${1:name} = ${2:value} />', detail: '<#assign name = value />' },
  { label: 'list', insertText: 'list ${1:list} as ${2:item}>\n\t$0\n</#list>', detail: '<#list list as item>...</#list>' },
  { label: 'if', insertText: 'if ${1:condition}>\n\t$0\n</#if>', detail: '<#if condition>...</#if>' },
  { label: 'elseif', insertText: 'elseif ${1:condition}>', detail: '<#elseif condition>' },
  { label: 'else', insertText: 'else>', detail: '<#else>' },
  { label: 'switch', insertText: 'switch ${1:value}>\n\t$0\n</#switch>', detail: '<#switch value>...</#switch>' },
  { label: 'case', insertText: 'case ${1:value}>', detail: '<#case value>' },
  { label: 'break', insertText: 'break>', detail: '<#break>' },
  { label: 'default', insertText: 'default>', detail: '<#default>' }
];

const CLOSING_DIRECTIVE_LIST = ['if', 'list', 'switch'];

const BUILTIN_LIST = [
  { label: 'string', detail: '?string("yes", "no")' },
  { label: 'keys', detail: '?keys' },
  { label: 'size', detail: '?size' },
  { label: 'has_content', detail: '?has_content' },
  { label: 'exists', detail: '?exists' },
  { label: 'default', detail: '?default(value)' },
  { label: 'join', detail: '?join(",")' },
  { label: 'upper_case', detail: '?upper_case' },
  { label: 'lower_case', detail: '?lower_case' },
  { label: 'trim', detail: '?trim' },
  { label: 'html', detail: '?html' },
  { label: 'url', detail: '?url' }
];

function normalizeAttrList(attrList) {
  return (attrList || []).map(attr => ({
    name: attr.name,
    label: attr.label || attr.name,
    type: attr.type || 'object',
    snippet: attr.freemarkerSnippet || (attr.name ? '${DATA.' + attr.name + '}' : '')
  })).filter(attr => attr.name);
}

function createReplaceRange(monaco, position, prefix) {
  return new monaco.Range(
    position.lineNumber,
    Math.max(1, position.column - prefix.length),
    position.lineNumber,
    position.column
  );
}

function createDirectiveSuggestions(monaco, position, prefix) {
  const range = createReplaceRange(monaco, position, prefix);
  return DIRECTIVE_LIST.map(item => ({
    label: item.label,
    kind: monaco.languages.CompletionItemKind.Keyword,
    insertText: item.insertText,
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    range,
    sortText: `0_${item.label}`,
    detail: item.detail,
    documentation: { value: `\`${item.detail}\`` }
  }));
}

function createClosingDirectiveSuggestions(monaco, position, prefix) {
  const range = createReplaceRange(monaco, position, prefix);
  return CLOSING_DIRECTIVE_LIST.map(name => ({
    label: name,
    kind: monaco.languages.CompletionItemKind.Keyword,
    insertText: `${name}>`,
    range,
    sortText: `0_${name}`,
    detail: `</#${name}>`
  }));
}

function createBuiltinSuggestions(monaco, position, prefix) {
  const range = createReplaceRange(monaco, position, prefix);
  return BUILTIN_LIST.map(item => ({
    label: item.label,
    kind: monaco.languages.CompletionItemKind.Function,
    insertText: item.label,
    range,
    sortText: `0_${item.label}`,
    detail: item.detail
  }));
}

function createAttrSuggestions(monaco, attrList, position, prefix) {
  const range = createReplaceRange(monaco, position, prefix);
  return attrList.map(attr => ({
    label: attr.name,
    kind: monaco.languages.CompletionItemKind.Property,
    insertText: attr.name,
    range,
    sortText: `0_${attr.name}`,
    detail: `${attr.label} · ${attr.type} · DATA.${attr.name}`,
    documentation: { value: `\`${attr.snippet}\`` }
  }));
}

function createDataSuggestion(monaco, position, prefix) {
  return {
    label: 'DATA',
    kind: monaco.languages.CompletionItemKind.Variable,
    insertText: 'DATA',
    range: createReplaceRange(monaco, position, prefix),
    sortText: '0_DATA',
    detail: '${DATA.xxx}'
  };
}

/**
 * 创建通知模板的FreeMarker语言扩展，提示内容严格对应页面帮助和告警属性列表。
 */
export function createNotifyTemplateFreemarkerExtension(attrList) {
  const normalizedAttrList = normalizeAttrList(attrList);
  return {
    triggerCharacters: ['.', '?', '<', '#', '{', '/'],
    provideCompletionItems({ monaco, model, position }) {
      const linePrefix = model.getLineContent(position.lineNumber).slice(0, position.column - 1);
      let match = linePrefix.match(/\$\{DATA\.([a-zA-Z0-9_]*)$/);
      if (match) {
        return { suggestions: createAttrSuggestions(monaco, normalizedAttrList, position, match[1]) };
      }
      match = linePrefix.match(/<\/#([a-zA-Z_]*)$/);
      if (match) {
        return { suggestions: createClosingDirectiveSuggestions(monaco, position, match[1]) };
      }
      match = linePrefix.match(/<#([a-zA-Z_]*)$/);
      if (match) {
        return { suggestions: createDirectiveSuggestions(monaco, position, match[1]) };
      }
      match = linePrefix.match(/\?([a-zA-Z_]*)$/);
      if (match) {
        return { suggestions: createBuiltinSuggestions(monaco, position, match[1]) };
      }
      match = linePrefix.match(/\$\{([a-zA-Z_]*)$/);
      if (match) {
        return { suggestions: [createDataSuggestion(monaco, position, match[1])] };
      }
      const word = model.getWordUntilPosition(position);
      if ('DATA'.startsWith(word.word || '')) {
        return { suggestions: [createDataSuggestion(monaco, position, word.word || '')] };
      }
      return { suggestions: [] };
    },
    provideHover({ monaco, model, position }) {
      const word = model.getWordAtPosition(position);
      if (!word) {
        return null;
      }
      const linePrefix = model.getLineContent(position.lineNumber).slice(0, word.endColumn - 1);
      if (!new RegExp(`\\$\\{DATA\\.${word.word}$`).test(linePrefix)) {
        return null;
      }
      const attr = normalizedAttrList.find(item => item.name === word.word);
      if (!attr) {
        return null;
      }
      return {
        range: new monaco.Range(position.lineNumber, word.startColumn, position.lineNumber, word.endColumn),
        contents: [
          { value: `**${attr.label}**` },
          { value: `\`${attr.snippet}\` · \`${attr.type}\`` }
        ]
      };
    },
    provideFoldingRanges({ model }) {
      const stack = [];
      const rangeList = [];
      for (let lineNumber = 1; lineNumber <= model.getLineCount(); lineNumber += 1) {
        const line = model.getLineContent(lineNumber);
        const tokenPattern = /<(\/?)#(if|list|switch)\b/g;
        let token = tokenPattern.exec(line);
        while (token) {
          if (!token[1]) {
            stack.push({ name: token[2], lineNumber });
          } else {
            const startIndex = stack.map(item => item.name).lastIndexOf(token[2]);
            if (startIndex >= 0) {
              const start = stack[startIndex];
              stack.splice(startIndex, 1);
              if (lineNumber > start.lineNumber) {
                rangeList.push({ start: start.lineNumber, end: lineNumber - 1 });
              }
            }
          }
          token = tokenPattern.exec(line);
        }
      }
      return rangeList;
    }
  };
}
