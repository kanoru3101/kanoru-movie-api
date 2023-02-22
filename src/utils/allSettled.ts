const allSettled = async <T>(promises: T[]): Promise<T[]> => {
    const values = [] as T[];
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

    return values;
}

export default allSettled;
