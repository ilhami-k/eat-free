
export function serializeForIPC(obj: unknown): unknown {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (obj instanceof Date) {
    return obj.toISOString();
  }

  if (typeof obj === 'bigint') {
    return obj.toString();
  }

  if (typeof obj === 'object') {
    if (Array.isArray(obj)) {
      return obj.map(item => serializeForIPC(item));
    }

    if ((obj as any).constructor && ((obj as any).constructor.name === 'Decimal' || (obj as any).d !== undefined)) {
      return parseFloat((obj as any).toString());
    }

    const serialized: Record<string, unknown> = {};
    for (const key of Object.keys(obj)) {
      serialized[key] = serializeForIPC((obj as any)[key]);
    }
    return serialized;
  }

  return obj;
}

export function deserializeFromIPC(obj: unknown, schema?: Record<string, string>): unknown {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'string' && schema) {
    return obj;
  }

  if (typeof obj === 'object') {
    if (Array.isArray(obj)) {
      return obj.map(item => deserializeFromIPC(item, schema));
    }

    const deserialized: Record<string, unknown> = {};
    for (const key of Object.keys(obj)) {
      const value = (obj as any)[key];
      if (schema && schema[key] === 'bigint' && typeof value === 'string') {
        deserialized[key] = BigInt(value);
      } else if (key === 'id' && typeof value === 'string' && !isNaN(Number(value))) {
        deserialized[key] = BigInt(value);
      } else {
        deserialized[key] = deserializeFromIPC(value, schema);
      }
    }
    return deserialized;
  }

  return obj;
}
