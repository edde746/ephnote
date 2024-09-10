const envOrDefault = <T>(key: string, defaultValue: T): T => {
  if (key in process.env)
    return ((typeof defaultValue === 'number') ? parseInt(process.env[key]!) : process.env[key]) as T;
  return defaultValue;
}

export const maxDays = envOrDefault('MAX_DAYS', 30);
export const maxContentLength = Math.ceil(envOrDefault('MAX_CONTENT_LENGTH', 16 * 1024) / 16) * 16;
