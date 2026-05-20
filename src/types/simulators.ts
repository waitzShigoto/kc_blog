export type PotentialTier = 'special' | 'rare' | 'epic' | 'legendary';

export interface PotentialLine {
    tier: PotentialTier;
    statKey: string;
    stat: string;
    value: string;
}

export interface DrawHistoryEntry {
    id: number;
    drawNumber: number;
    [key: string]: string | number | boolean | PotentialLine[] | undefined;
}

export interface SimulatorTranslation {
    [key: string]: string | number | boolean | Record<string, string> | unknown;
}
