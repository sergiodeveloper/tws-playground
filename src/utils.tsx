import { marked } from "marked";

export function getArrayFromRecord(records: Record<string, unknown>, field: string): unknown[] {
  const record = records[field];
  return Array.isArray(record) ? record : [];
}

export function unknownIsObject(record: unknown): record is Record<string, unknown> {
  return !!record && typeof record === 'object';
}

export function getObjectFromRecord(
  records: Record<string, unknown>,
  field: string,
): Record<string, unknown> {
  const record = records[field];
  return unknownIsObject(record) ? record : {};
}

export function getArrayFromList(records: unknown[], index: number) {
  const record = records[index];
  return Array.isArray(record) ? record : [];
}

export function getObjectFromList(records: unknown[], index: number): Record<string, unknown> {
  const record = records[index];
  return unknownIsObject(record) ? record : {};
}

export async function makeHttpRequest(options: {
  url: string;
  method: 'POST' | 'GET';
  body: string | undefined;
  headers: { [key: string]: string };
}): Promise<{
  status: number;
  body: string;
}> {
  const { url, method, body, headers } = options;

  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);

    Object.keys(headers).forEach((key) => {
      xhr.setRequestHeader(key, headers[key]);
    });

    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        resolve({
          status: xhr.status,
          body: xhr.responseText || '{ "error": "Request failed" }',
        });
      }
    };

    xhr.onerror = function () {
      if (xhr.status === 0) {
        resolve({
          status: 500,
          body: 'Network error',
        });
      }
    };

    xhr.ontimeout = function () {
      resolve({
        status: 408,
        body: 'Request timed out',
      });
    };

    try {
      xhr.send(body);
    } catch (error) {
      resolve({
        status: 500,
        body: 'Synchronous request error: ' + error,
      });
    }
  });
}

export async function renderMarkdown(markdown: string) {
  const renderer = new marked.Renderer();
  const linkRenderer = renderer.link;

  renderer.link = (...options: Parameters<typeof linkRenderer>) => {
    const html = linkRenderer.call(renderer, ...options);
    return html.replace(/^<a /, '<a target="_blank" rel="nofollow" ');
  };

  return await marked.parse(markdown, { renderer });
}

export abstract class Value {
  // @ts-expect-error helper attribute to force class usage
  private _class = 1;

  public value: unknown | null = null;

  public isNull(): boolean {
    return this.value === null;
  }

  public abstract getNativeValue(): unknown;
}

export class BooleanValue extends Value {
  constructor(public value: boolean | null) { super(); }

  static from(value: unknown): BooleanValue {
    if (value instanceof BooleanValue) {
      return value;
    }
    if (typeof value === 'boolean') {
      return new BooleanValue(value);
    }
    return new BooleanValue(null);
  }

  getNativeValue() {
    return this.value ?? undefined;
  }
}

export class StringValue extends Value {
  constructor(public value: string | null) { super(); }

  static from(value: unknown): StringValue {
    if (value instanceof StringValue) {
      return value;
    }
    if (typeof value === 'string') {
      return new StringValue(value);
    }
    return new StringValue(null);
  }

  getNativeValue() {
    return this.value ?? undefined;
  }
}

export class NumberValue extends Value {
  constructor(public value: number | null) { super(); }

  static from(value: unknown): NumberValue {
    if (value instanceof NumberValue) {
      return value;
    }
    if (typeof value === 'number') {
      return new NumberValue(value);
    }
    return new NumberValue(null);
  }

  getNativeValue() {
    return this.value ?? undefined;
  }
}

export class ObjectValue extends Value {
  constructor(public value: Record<string, Value | undefined> | null) { super(); }

  static from(value: unknown): ObjectValue {
    if (value instanceof ObjectValue) {
      return value;
    }
    return new ObjectValue(null);
  }

  getNativeValue() {
    if (this.value === null) {
      return undefined;
    }

    return Object.fromEntries(
      Object.entries(this.value).map(([key, value]) => [key, value?.getNativeValue()]),
    );
  }
}

export class ArrayValue extends Value {
  constructor(public value: Value[]) { super(); }

  static from(value: unknown): ArrayValue {
    if (value instanceof ArrayValue) {
      return value;
    }
    return new ArrayValue([]);
  }

  getNativeValue() {
    return this.value.map((value) => value.getNativeValue());
  }
}

export function newValueFromType(
  type: 'string' | 'int' | 'float' | 'boolean' | 'object' | 'enum' | 'array',
  value: unknown,
): Value {
  switch (type) {
    case 'string':
      return StringValue.from(value);
    case 'int':
    case 'float':
      return NumberValue.from(value);
    case 'boolean':
      return BooleanValue.from(value);
    case 'object':
      return ObjectValue.from(value);
    case 'enum':
      return StringValue.from(value);
    case 'array':
      return ArrayValue.from(value);
    default:
      return new StringValue(null);
  }
}

export function clearAllSelections() {
  if (window.getSelection) {
    if (window.getSelection()?.empty) {
      window.getSelection()?.empty();
    } else if (window.getSelection()?.removeAllRanges) {
      window.getSelection()?.removeAllRanges();
    }
  }
}

export function escapeHtml(str: string) {
  return str.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function replaceUnacceptedHtmlTags(input: string) {
  // List of allowed HTML tags in Markdown
  const allowedTags = [
    'b', 'strong', 'i', 'em', 'u', 's', 'a', 'img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'br', 'p', 'blockquote', 'pre', 'code', 'table', 'thead', 'tbody',
    'tr', 'th', 'td', 'div', 'span'
  ];

  return input.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, (match, tag) => {
    return allowedTags.includes(tag.toLowerCase()) ? match : escapeHtml(match);
  });
}
