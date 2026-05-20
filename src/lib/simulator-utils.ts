/**
 * Performs a weighted random selection from an array of items.
 * Each item must have a property that represents its weight (probability).
 * 
 * @param items Array of items to select from
 * @param weightKey The key in the item object that contains the weight
 * @returns The selected item
 */
export function weightedRandom<T>(items: T[], weightKey: keyof T): T {
    const totalWeight = items.reduce((sum, item) => sum + (item[weightKey] as unknown as number), 0);
    let random = Math.random() * totalWeight;

    for (const item of items) {
        random -= (item[weightKey] as unknown as number);
        if (random <= 0) {
            return item;
        }
    }

    return items[items.length - 1];
}

/**
 * Common formatting for simulator values.
 */
export function formatValue(value: number | string): string {
    if (typeof value === 'number') {
        return value.toLocaleString();
    }
    return value;
}
