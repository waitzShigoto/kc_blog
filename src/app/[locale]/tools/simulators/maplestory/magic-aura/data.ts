
export type AuraStage = 1 | 2 | 3 | 4;

export interface AuraLine {
    stat: string;
    value: string;
    statKey: string;
}

export interface StatRate {
    stat: string;
    value: string;
    statKey: string;
    weights: number[]; // Index 0: Row 1, Index 1: Row 2, Index 2: Row 3
}

export const STAGE_UP_RATES: Record<AuraStage, { stay: number; up: number; next: AuraStage | null }> = {
    1: { stay: 95.00, up: 5.00, next: 2 },
    2: { stay: 99.00, up: 1.00, next: 3 },
    3: { stay: 99.60, up: 0.40, next: 4 },
    4: { stay: 100.00, up: 0.00, next: null },
};

// Data parsed from provided tables
export const AURA_STATS: Record<AuraStage, StatRate[]> = {
    1: [
        { stat: 'STR', value: '+3', statKey: 'STR', weights: [5.26, 3.45, 2.68] },
        { stat: 'DEX', value: '+3', statKey: 'DEX', weights: [5.26, 3.45, 2.68] },
        { stat: 'INT', value: '+3', statKey: 'INT', weights: [5.26, 3.45, 2.68] },
        { stat: 'LUK', value: '+3', statKey: 'LUK', weights: [5.26, 3.45, 2.68] },
        { stat: 'MaxHP', value: '+50', statKey: 'MaxHP', weights: [5.26, 3.45, 2.68] },
        { stat: 'AllStat', value: '+3', statKey: 'AllStat', weights: [3.51, 1.72, 1.34] },
        { stat: 'ATT', value: '+3', statKey: 'ATT', weights: [1.75, 0.86, 0.80] },
        { stat: 'MATT', value: '+3', statKey: 'MATT', weights: [1.75, 0.86, 0.80] },
        { stat: 'STR', value: '+2', statKey: 'STR', weights: [10.53, 5.17, 5.36] },
        { stat: 'DEX', value: '+2', statKey: 'DEX', weights: [10.53, 5.17, 5.36] },
        { stat: 'INT', value: '+2', statKey: 'INT', weights: [10.53, 5.17, 5.36] },
        { stat: 'LUK', value: '+2', statKey: 'LUK', weights: [10.53, 5.17, 5.36] },
        { stat: 'MaxHP', value: '+30', statKey: 'MaxHP', weights: [10.53, 5.17, 5.36] },
        { stat: 'AllStat', value: '+2', statKey: 'AllStat', weights: [7.02, 3.45, 2.68] },
        { stat: 'ATT', value: '+2', statKey: 'ATT', weights: [3.51, 1.72, 1.61] },
        { stat: 'MATT', value: '+2', statKey: 'MATT', weights: [3.51, 1.72, 1.61] },
        { stat: 'STR', value: '+1', statKey: 'STR', weights: [0, 6.90, 8.04] },
        { stat: 'DEX', value: '+1', statKey: 'DEX', weights: [0, 6.90, 8.04] },
        { stat: 'INT', value: '+1', statKey: 'INT', weights: [0, 6.90, 8.04] },
        { stat: 'LUK', value: '+1', statKey: 'LUK', weights: [0, 6.90, 8.04] },
        { stat: 'MaxHP', value: '+15', statKey: 'MaxHP', weights: [0, 6.90, 8.04] },
        { stat: 'AllStat', value: '+1', statKey: 'AllStat', weights: [0, 5.17, 5.36] },
        { stat: 'ATT', value: '+1', statKey: 'ATT', weights: [0, 3.45, 2.68] },
        { stat: 'MATT', value: '+1', statKey: 'MATT', weights: [0, 3.45, 2.68] },
    ],
    2: [
        { stat: 'STR', value: '+5', statKey: 'STR', weights: [5.34, 3.46, 2.70] },
        { stat: 'DEX', value: '+5', statKey: 'DEX', weights: [5.34, 3.46, 2.70] },
        { stat: 'INT', value: '+5', statKey: 'INT', weights: [5.34, 3.46, 2.70] },
        { stat: 'LUK', value: '+5', statKey: 'LUK', weights: [5.34, 3.46, 2.70] },
        { stat: 'MaxHP', value: '+100', statKey: 'MaxHP', weights: [5.34, 3.46, 2.70] },
        { stat: 'AllStat', value: '+5', statKey: 'AllStat', weights: [3.56, 1.73, 1.35] },
        { stat: 'ATT', value: '+5', statKey: 'ATT', weights: [1.42, 0.69, 0.54] },
        { stat: 'MATT', value: '+5', statKey: 'MATT', weights: [1.42, 0.69, 0.54] },
        { stat: 'STR', value: '+3', statKey: 'STR', weights: [10.68, 5.19, 5.39] },
        { stat: 'DEX', value: '+3', statKey: 'DEX', weights: [10.68, 5.19, 5.39] },
        { stat: 'INT', value: '+3', statKey: 'INT', weights: [10.68, 5.19, 5.39] },
        { stat: 'LUK', value: '+3', statKey: 'LUK', weights: [10.68, 5.19, 5.39] },
        { stat: 'MaxHP', value: '+50', statKey: 'MaxHP', weights: [10.68, 5.19, 5.39] },
        { stat: 'AllStat', value: '+3', statKey: 'AllStat', weights: [7.12, 3.46, 2.70] },
        { stat: 'ATT', value: '+3', statKey: 'ATT', weights: [3.20, 1.73, 1.62] },
        { stat: 'MATT', value: '+3', statKey: 'MATT', weights: [3.20, 1.73, 1.62] },
        { stat: 'STR', value: '+2', statKey: 'STR', weights: [0, 6.92, 8.09] },
        { stat: 'DEX', value: '+2', statKey: 'DEX', weights: [0, 6.92, 8.09] },
        { stat: 'INT', value: '+2', statKey: 'INT', weights: [0, 6.92, 8.09] },
        { stat: 'LUK', value: '+2', statKey: 'LUK', weights: [0, 6.92, 8.09] },
        { stat: 'MaxHP', value: '+30', statKey: 'MaxHP', weights: [0, 6.92, 8.09] },
        { stat: 'AllStat', value: '+2', statKey: 'AllStat', weights: [0, 5.19, 5.39] },
        { stat: 'ATT', value: '+2', statKey: 'ATT', weights: [0, 3.46, 2.70] },
        { stat: 'MATT', value: '+2', statKey: 'MATT', weights: [0, 3.46, 2.70] },
    ],
    3: [
        { stat: 'STR', value: '+10', statKey: 'STR', weights: [5.34, 1.54, 1.24] },
        { stat: 'DEX', value: '+10', statKey: 'DEX', weights: [5.34, 1.54, 1.24] },
        { stat: 'INT', value: '+10', statKey: 'INT', weights: [5.34, 1.54, 1.24] },
        { stat: 'LUK', value: '+10', statKey: 'LUK', weights: [5.34, 1.54, 1.24] },
        { stat: 'MaxHP', value: '+200', statKey: 'MaxHP', weights: [5.34, 1.54, 1.24] },
        { stat: 'AllStat', value: '+10', statKey: 'AllStat', weights: [3.56, 1.08, 0.74] },
        { stat: 'ATT', value: '+10', statKey: 'ATT', weights: [1.42, 0.46, 0.25] },
        { stat: 'MATT', value: '+10', statKey: 'MATT', weights: [1.42, 0.46, 0.25] },
        { stat: 'STR', value: '+8', statKey: 'STR', weights: [10.68, 3.09, 2.48] },
        { stat: 'DEX', value: '+8', statKey: 'DEX', weights: [10.68, 3.09, 2.48] },
        { stat: 'INT', value: '+8', statKey: 'INT', weights: [10.68, 3.09, 2.48] },
        { stat: 'LUK', value: '+8', statKey: 'LUK', weights: [10.68, 3.09, 2.48] },
        { stat: 'MaxHP', value: '+160', statKey: 'MaxHP', weights: [10.68, 3.09, 2.48] },
        { stat: 'AllStat', value: '+8', statKey: 'AllStat', weights: [7.12, 2.01, 1.24] },
        { stat: 'ATT', value: '+8', statKey: 'ATT', weights: [3.20, 0.93, 0.74] },
        { stat: 'MATT', value: '+8', statKey: 'MATT', weights: [3.20, 0.93, 0.74] },
        { stat: 'STR', value: '+6', statKey: 'STR', weights: [0, 4.63, 4.96] },
        { stat: 'DEX', value: '+6', statKey: 'DEX', weights: [0, 4.63, 4.96] },
        { stat: 'INT', value: '+6', statKey: 'INT', weights: [0, 4.63, 4.96] },
        { stat: 'LUK', value: '+6', statKey: 'LUK', weights: [0, 4.63, 4.96] },
        { stat: 'MaxHP', value: '+120', statKey: 'MaxHP', weights: [0, 4.63, 4.96] },
        { stat: 'AllStat', value: '+6', statKey: 'AllStat', weights: [0, 3.09, 2.48] },
        { stat: 'ATT', value: '+6', statKey: 'ATT', weights: [0, 1.54, 1.49] },
        { stat: 'MATT', value: '+6', statKey: 'MATT', weights: [0, 1.54, 1.49] },
        { stat: 'STR', value: '+5', statKey: 'STR', weights: [0, 6.17, 7.44] },
        { stat: 'DEX', value: '+5', statKey: 'DEX', weights: [0, 6.17, 7.44] },
        { stat: 'INT', value: '+5', statKey: 'INT', weights: [0, 6.17, 7.44] },
        { stat: 'LUK', value: '+5', statKey: 'LUK', weights: [0, 6.17, 7.44] },
        { stat: 'MaxHP', value: '+100', statKey: 'MaxHP', weights: [0, 6.17, 7.44] },
        { stat: 'AllStat', value: '+5', statKey: 'AllStat', weights: [0, 4.63, 4.96] },
        { stat: 'ATT', value: '+5', statKey: 'ATT', weights: [0, 3.09, 2.48] },
        { stat: 'MATT', value: '+5', statKey: 'MATT', weights: [0, 3.09, 2.48] },
    ],
    4: [
        { stat: 'STR', value: '+20', statKey: 'STR', weights: [5.63, 1.24, 1.31] },
        { stat: 'DEX', value: '+20', statKey: 'DEX', weights: [5.63, 1.24, 1.31] },
        { stat: 'INT', value: '+20', statKey: 'INT', weights: [5.63, 1.24, 1.31] },
        { stat: 'LUK', value: '+20', statKey: 'LUK', weights: [5.63, 1.24, 1.31] },
        { stat: 'MaxHP', value: '+300', statKey: 'MaxHP', weights: [5.63, 1.24, 1.31] },
        { stat: 'AllStat', value: '+20', statKey: 'AllStat', weights: [3.52, 0.87, 0.98] },
        { stat: 'ATT', value: '+20', statKey: 'ATT', weights: [1.13, 0.37, 0.33] },
        { stat: 'MATT', value: '+20', statKey: 'MATT', weights: [1.13, 0.37, 0.33] },
        { stat: 'STR', value: '+15', statKey: 'STR', weights: [11.25, 3.72, 3.27] },
        { stat: 'DEX', value: '+15', statKey: 'DEX', weights: [11.25, 3.72, 3.27] },
        { stat: 'INT', value: '+15', statKey: 'INT', weights: [11.25, 3.72, 3.27] },
        { stat: 'LUK', value: '+15', statKey: 'LUK', weights: [11.25, 3.72, 3.27] },
        { stat: 'MaxHP', value: '+250', statKey: 'MaxHP', weights: [11.25, 3.72, 3.27] },
        { stat: 'AllStat', value: '+15', statKey: 'AllStat', weights: [7.03, 2.23, 1.63] },
        { stat: 'ATT', value: '+15', statKey: 'ATT', weights: [1.41, 0.99, 0.98] },
        { stat: 'MATT', value: '+15', statKey: 'MATT', weights: [1.41, 0.99, 0.98] },
        { stat: 'STR', value: '+13', statKey: 'STR', weights: [0, 4.96, 5.56] },
        { stat: 'DEX', value: '+13', statKey: 'DEX', weights: [0, 4.96, 5.56] },
        { stat: 'INT', value: '+13', statKey: 'INT', weights: [0, 4.96, 5.56] },
        { stat: 'LUK', value: '+13', statKey: 'LUK', weights: [0, 4.96, 5.56] },
        { stat: 'MaxHP', value: '+230', statKey: 'MaxHP', weights: [0, 4.96, 5.56] },
        { stat: 'AllStat', value: '+13', statKey: 'AllStat', weights: [0, 3.10, 2.61] },
        { stat: 'ATT', value: '+13', statKey: 'ATT', weights: [0, 1.49, 1.31] },
        { stat: 'MATT', value: '+13', statKey: 'MATT', weights: [0, 1.49, 1.31] },
        { stat: 'STR', value: '+10', statKey: 'STR', weights: [0, 6.20, 6.54] },
        { stat: 'DEX', value: '+10', statKey: 'DEX', weights: [0, 6.20, 6.54] },
        { stat: 'INT', value: '+10', statKey: 'INT', weights: [0, 6.20, 6.54] },
        { stat: 'LUK', value: '+10', statKey: 'LUK', weights: [0, 6.20, 6.54] },
        { stat: 'MaxHP', value: '+200', statKey: 'MaxHP', weights: [0, 6.20, 6.54] },
        { stat: 'AllStat', value: '+10', statKey: 'AllStat', weights: [0, 4.96, 4.25] },
        { stat: 'ATT', value: '+10', statKey: 'ATT', weights: [0, 1.24, 0.98] },
        { stat: 'MATT', value: '+10', statKey: 'MATT', weights: [0, 1.24, 0.98] },
    ],
};

export function getPool(stage: AuraStage, rowIdx: number): { item: AuraLine; weight: number }[] {
    const stats = AURA_STATS[stage];
    return stats
        .filter(s => s.weights[rowIdx] > 0)
        .map(s => ({
            item: { stat: s.stat, value: s.value, statKey: s.statKey },
            weight: s.weights[rowIdx],
        }));
}
