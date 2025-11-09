/**
 * Serializes objects containing Decimal and BigInt for IPC transfer
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    // Check if it's a Decimal-like object
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((obj as any).constructor && ((obj as any).constructor.name === 'Decimal' || (obj as any).d !== undefined)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return parseFloat((obj as any).toString());
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const serialized: Record<string, unknown> = {};
    for (const key of Object.keys(obj)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      serialized[key] = serializeForIPC((obj as any)[key]);
    }
    return serialized;
  }

  return obj;
}

/**
 * Deserializes objects from IPC, converting strings back to BigInt where needed
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const deserialized: Record<string, unknown> = {};
    for (const key of Object.keys(obj)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const value = (obj as any)[key];
      // Convert string IDs back to BigInt if they look like BigInt values
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
