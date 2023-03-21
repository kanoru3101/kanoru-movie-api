const allSettled = async <T>(promises: T[]): Promise<Array<Awaited<T>>> => {
    const values = [] as Array<Awaited<T>>;
    const errors = [] as string[];
    const workedPromises = await Promise.allSettled(promises)

    workedPromises.map((settle) => {
        if (settle.status === 'fulfilled') {
            values.push(settle.value)
        } else {
            errors.push(settle.reason)
        }
    })
    // TODO: Add saving error on some handler
    // eslint-disable-next-line no-console
    console.error("###ERROR", errors)
    return values;
}

export default allSettled;
