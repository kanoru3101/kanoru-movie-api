/* eslint-disable no-console, @typescript-eslint/ban-ts-comment */
const withTryCatch = <T extends unknown[], R>(
  fn: (...args: T) => Promise<R>,
  defaultValue?: R
): ((...args: T) => Promise<R>) => async (...args: T): Promise<R> => {
  try {
    const result = await fn(...args);
    return result;
  } catch (error) {
    // @ts-ignore
    console.error(`#ERROR IN FUNCTION ${fn.name}`, error?.message || '');
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw error;
  }
};
export default withTryCatch;
