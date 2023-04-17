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

export async function makeHttpRequest(
  url: string,
  method: 'POST' | 'GET' = 'GET',
  body: string | undefined = undefined,
  headers: { [key: string]: string } = {},
): Promise<{
  status: number;
  body: string;
}> {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    Object.keys(headers).forEach((key) => {
      xhr.setRequestHeader(key, headers[key]);
    });
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        resolve({
          status: xhr.status,
          body: xhr.responseText,
        });
      }
    };
    xhr.send(body);
  });
}
