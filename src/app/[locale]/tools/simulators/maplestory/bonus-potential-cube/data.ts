export type CubeType = 'premiumBonus' | 'memorialBonus' | 'absoluteBonus';

// 新增 ValueRange 定義
type ValueRange = {
    min: number;
    max: number;
    value: string;
};

// 擴展 STAT_VALUES 定義
export const STAT_VALUES_BY_LEVEL: Record<string, Record<PotentialTier, ValueRange[]>> = {
    STR: {
        special: [{ min: 0, max: 250, value: '+3' }], // 為了統一格式
        rare: [{ min: 0, max: 250, value: '+6' }],
        epic: [
            { min: 91, max: 150, value: '+18' },
            { min: 151, max: 200, value: '+18' },
            { min: 201, max: 250, value: '+19' },
        ],
        legendary: [
            { min: 91, max: 150, value: '+20' },
            { min: 151, max: 200, value: '+20' },
            { min: 201, max: 250, value: '+21' },
        ]
    },
    DEX: {
        special: [{ min: 0, max: 250, value: '+3' }],
        rare: [{ min: 0, max: 250, value: '+6' }],
        epic: [
            { min: 91, max: 150, value: '+18' },
            { min: 151, max: 200, value: '+18' },
            { min: 201, max: 250, value: '+19' },
        ],
        legendary: [
            { min: 91, max: 150, value: '+20' },
            { min: 151, max: 200, value: '+20' },
            { min: 201, max: 250, value: '+21' },
        ]
    },
    INT: {
        special: [{ min: 0, max: 250, value: '+3' }],
        rare: [{ min: 0, max: 250, value: '+6' }],
        epic: [
            { min: 91, max: 150, value: '+18' },
            { min: 151, max: 200, value: '+18' },
            { min: 201, max: 250, value: '+19' },
        ],
        legendary: [
            { min: 91, max: 150, value: '+20' },
            { min: 151, max: 200, value: '+20' },
            { min: 201, max: 250, value: '+21' },
        ]
    },
    LUK: {
        special: [{ min: 0, max: 250, value: '+3' }],
        rare: [{ min: 0, max: 250, value: '+6' }],
        epic: [
            { min: 91, max: 150, value: '+18' },
            { min: 151, max: 200, value: '+18' },
            { min: 201, max: 250, value: '+19' },
        ],
        legendary: [
            { min: 91, max: 150, value: '+20' },
            { min: 151, max: 200, value: '+20' },
            { min: 201, max: 250, value: '+21' },
        ]
    },
    // ATT/MATT handled by specific logic or unified if needed, but CSV had specific ranges too
    ATT: {
        special: [{ min: 0, max: 250, value: '+3' }],
        rare: [{ min: 0, max: 250, value: '+10' }], // Placeholder
        epic: [
            { min: 91, max: 150, value: '+14' },
            { min: 151, max: 200, value: '+14' },
            { min: 201, max: 250, value: '+15' },
        ],
        legendary: [
            { min: 91, max: 150, value: '+16' },
            { min: 151, max: 200, value: '+16' },
            { min: 201, max: 250, value: '+17' },
        ]
    },
    MATT: {
        special: [{ min: 0, max: 250, value: '+3' }],
        rare: [{ min: 0, max: 250, value: '+10' }],
        epic: [
            { min: 91, max: 150, value: '+14' },
            { min: 151, max: 200, value: '+14' },
            { min: 201, max: 250, value: '+15' },
        ],
        legendary: [
            { min: 91, max: 150, value: '+16' },
            { min: 151, max: 200, value: '+16' },
            { min: 201, max: 250, value: '+17' },
        ]
    },
    'STR%': {
        special: [],
        rare: [],
        epic: [
            { min: 91, max: 150, value: '+6%' },
            { min: 151, max: 200, value: '+6%' },
            { min: 201, max: 250, value: '+7%' },
        ],
        legendary: [
            { min: 91, max: 150, value: '+8%' },
            { min: 151, max: 200, value: '+8%' },
            { min: 201, max: 250, value: '+9%' },
        ]
    },
    'DEX%': {
        special: [],
        rare: [],
        epic: [
            { min: 91, max: 150, value: '+6%' },
            { min: 151, max: 200, value: '+6%' },
            { min: 201, max: 250, value: '+7%' },
        ],
        legendary: [
            { min: 91, max: 150, value: '+8%' },
            { min: 151, max: 200, value: '+8%' },
            { min: 201, max: 250, value: '+9%' },
        ]
    },
    'INT%': {
        special: [],
        rare: [],
        epic: [
            { min: 91, max: 150, value: '+6%' },
            { min: 151, max: 200, value: '+6%' },
            { min: 201, max: 250, value: '+7%' },
        ],
        legendary: [
            { min: 91, max: 150, value: '+8%' },
            { min: 151, max: 200, value: '+8%' },
            { min: 201, max: 250, value: '+9%' },
        ]
    },
    'LUK%': {
        special: [],
        rare: [],
        epic: [
            { min: 91, max: 150, value: '+6%' },
            { min: 151, max: 200, value: '+6%' },
            { min: 201, max: 250, value: '+7%' },
        ],
        legendary: [
            { min: 91, max: 150, value: '+8%' },
            { min: 151, max: 200, value: '+8%' },
            { min: 201, max: 250, value: '+9%' },
        ]
    },
    'AllStat%': {
        special: [],
        rare: [],
        epic: [
            { min: 91, max: 150, value: '5%' },
            { min: 151, max: 200, value: '5%' },
            { min: 201, max: 250, value: '6%' },
        ],
        legendary: [
            { min: 91, max: 150, value: '6%' },
            { min: 151, max: 200, value: '6%' },
            { min: 201, max: 250, value: '7%' },
        ]
    },
    'ATT%': {
        special: [],
        rare: [],
        epic: [
            { min: 91, max: 150, value: '9%' },
            { min: 151, max: 200, value: '10%' },
            { min: 201, max: 250, value: '10%' },
        ],
        legendary: [
            { min: 91, max: 150, value: '12%' },
            { min: 151, max: 200, value: '13%' },
            { min: 201, max: 250, value: '13%' },
        ]
    },
    'MATT%': {
        special: [],
        rare: [],
        epic: [
            { min: 91, max: 150, value: '9%' },
            { min: 151, max: 200, value: '10%' },
            { min: 201, max: 250, value: '10%' },
        ],
        legendary: [
            { min: 91, max: 150, value: '12%' },
            { min: 151, max: 200, value: '13%' },
            { min: 201, max: 250, value: '13%' },
        ]
    },
    'MaxHP': {
        special: [],
        rare: [],
        epic: [
            { min: 91, max: 100, value: '+300' },
            { min: 101, max: 110, value: '+300' },
            { min: 111, max: 200, value: '+300' },
            { min: 201, max: 250, value: '+315' },
        ],
        legendary: [
            { min: 91, max: 100, value: '+360' },
            { min: 101, max: 110, value: '+360' },
            { min: 111, max: 200, value: '+360' },
            { min: 201, max: 250, value: '+375' },
        ]
    },
    'MaxMP': {
        special: [],
        rare: [],
        epic: [
            { min: 91, max: 100, value: '+300' },
            { min: 101, max: 110, value: '+300' },
            { min: 111, max: 200, value: '+300' },
            { min: 201, max: 250, value: '+315' },
        ],
        legendary: [
            { min: 91, max: 100, value: '+360' },
            { min: 101, max: 110, value: '+360' },
            { min: 111, max: 200, value: '+360' },
            { min: 201, max: 250, value: '+375' },
        ]
    },
    'MaxHP%': {
        special: [],
        rare: [],
        epic: [
            { min: 91, max: 150, value: '+8%' },
            { min: 151, max: 200, value: '+8%' },
            { min: 201, max: 250, value: '+9%' },
        ],
        legendary: [
            { min: 91, max: 150, value: '+11%' },
            { min: 151, max: 200, value: '+11%' },
            { min: 201, max: 250, value: '+12%' },
        ]
    },
    'MaxMP%': {
        special: [],
        rare: [],
        epic: [
            { min: 91, max: 150, value: '8%' },
            { min: 151, max: 200, value: '8%' },
            { min: 201, max: 250, value: '9%' },
        ],
        legendary: [
            { min: 91, max: 150, value: '11%' },
            { min: 151, max: 200, value: '11%' },
            { min: 201, max: 250, value: '12%' },
        ]
    },
    'CritDmg': {
        special: [], rare: [], epic: [],
        legendary: [{ min: 0, max: 250, value: '1%' }]
    },
    'CritDmg_Glove': {
        special: [], rare: [], epic: [],
        legendary: [{ min: 0, max: 250, value: '3%' }]
    },
    'BossDmg': {
        special: [], rare: [],
        epic: [{ min: 0, max: 250, value: '12%' }],
        legendary: [{ min: 0, max: 250, value: '18%' }]
    },
    'STRPer10Lv': {
        special: [], rare: [],
        epic: [{ min: 91, max: 250, value: '+1' }],
        legendary: [{ min: 91, max: 250, value: '+2' }]
    },
    'DEXPer10Lv': {
        special: [], rare: [],
        epic: [{ min: 91, max: 250, value: '+1' }],
        legendary: [{ min: 91, max: 250, value: '+2' }]
    },
    'INTPer10Lv': {
        special: [], rare: [],
        epic: [{ min: 91, max: 250, value: '+1' }],
        legendary: [{ min: 91, max: 250, value: '+2' }]
    },
    'LUKPer10Lv': {
        special: [], rare: [],
        epic: [{ min: 91, max: 250, value: '+1' }],
        legendary: [{ min: 91, max: 250, value: '+2' }]
    },
    'ATTPer10Lv': {
        special: [], rare: [], epic: [],
        legendary: [{ min: 91, max: 250, value: '+1' }]
    },
    'MATTPer10Lv': {
        special: [], rare: [], epic: [],
        legendary: [{ min: 91, max: 250, value: '+1' }]
    },
};

export type PotentialTier = 'special' | 'rare' | 'epic' | 'legendary';

export const EQUIPMENT_TYPES = [
    'Hat', 'Top', 'Bottom', 'Overall', 'Gloves', 'Shoes', 'Cape', 'Belt', 'Shoulder',
    'Heart', 'Badge',
    'Earring', 'Pendant', 'Ring', 'Face', 'Eye',
    'Weapon', 'Secondary', 'Emblem'
] as const;

export type EquipmentType = typeof EQUIPMENT_TYPES[number];

export const EQUIPMENT_LEVELS = [140, 200, 250] as const;
export type EquipmentLevel = typeof EQUIPMENT_LEVELS[number];

type StatRate = {
    stat: string;
    weight: number;
};

// Data parsed from the user's CSV
const DATA_SOURCE: Record<string, Record<string, StatRate[]>> = {
    special: {
        // "Armor, Other": Hat, Top, Bottom, Overall, Glove, Shoe, Cape, Belt, Shoulder, Heart, Badge
        Armor: [
            { stat: 'STR', weight: 6.38 },
            { stat: 'DEX', weight: 6.38 },
            { stat: 'INT', weight: 6.38 },
            { stat: 'LUK', weight: 6.38 },
            { stat: 'MaxHP', weight: 6.38 },
            { stat: 'MaxMP', weight: 6.38 },
            { stat: 'Jump', weight: 6.38 }, // 跳躍力
            { stat: 'Speed', weight: 6.38 }, // 移動速度
            { stat: 'DEF', weight: 6.38 },   // 防禦力
            { stat: 'ATT', weight: 4.26 },
            { stat: 'MATT', weight: 4.26 },
            { stat: 'STR%', weight: 4.26 },
            { stat: 'DEX%', weight: 4.26 },
            { stat: 'INT%', weight: 4.26 },
            { stat: 'LUK%', weight: 4.26 },
            { stat: 'MaxHP%', weight: 4.26 },
            { stat: 'MaxMP%', weight: 4.26 },
            { stat: 'DEF%', weight: 4.26 },
            { stat: 'AllStat', weight: 4.26 }, // 全屬性 (flat or %? CSV says "全屬性" in Special grade stats alongside %) -> Usually flat in lower, but row says "全屬性". Current code logic used %. CSV Special grade has STR% separate. Wait, "全屬性" usually implies All Stat +X or %. In Bonus, usually +. 
            // CSV Context: Special Grade. "全屬性" 4.26%.
            // In the original file: AllStat% was only in Epic+. 
            // I will name it 'AllStat' and handle value generation later.
        ],
        Accessory: [
            // Same as Armor for Special grade based on CSV
            { stat: 'STR', weight: 6.38 },
            { stat: 'DEX', weight: 6.38 },
            { stat: 'INT', weight: 6.38 },
            { stat: 'LUK', weight: 6.38 },
            { stat: 'MaxHP', weight: 6.38 },
            { stat: 'MaxMP', weight: 6.38 },
            { stat: 'Jump', weight: 6.38 },
            { stat: 'Speed', weight: 6.38 },
            { stat: 'DEF', weight: 6.38 },
            { stat: 'ATT', weight: 4.26 },
            { stat: 'MATT', weight: 4.26 },
            { stat: 'STR%', weight: 4.26 },
            { stat: 'DEX%', weight: 4.26 },
            { stat: 'INT%', weight: 4.26 },
            { stat: 'LUK%', weight: 4.26 },
            { stat: 'MaxHP%', weight: 4.26 },
            { stat: 'MaxMP%', weight: 4.26 },
            { stat: 'DEF%', weight: 4.26 },
            { stat: 'AllStat', weight: 4.26 },
        ],
        WeaponGroup: [
            // Weapon, Secondary, Emblem
            { stat: 'MaxHP', weight: 5.88 },
            { stat: 'MaxMP', weight: 5.88 },
            { stat: 'Speed', weight: 5.88 },
            { stat: 'Jump', weight: 5.88 },
            { stat: 'DEF', weight: 5.88 },
            { stat: 'STR', weight: 5.88 },
            { stat: 'DEX', weight: 5.88 },
            { stat: 'INT', weight: 5.88 },
            { stat: 'LUK', weight: 5.88 },
            { stat: 'ATT', weight: 3.92 },
            { stat: 'MATT', weight: 3.92 },
            { stat: 'MaxHP%', weight: 3.92 },
            { stat: 'MaxMP%', weight: 3.92 },
            { stat: 'STR%', weight: 3.92 },
            { stat: 'DEX%', weight: 3.92 },
            { stat: 'INT%', weight: 3.92 },
            { stat: 'LUK%', weight: 3.92 },
            { stat: 'ATT%', weight: 1.96 },
            { stat: 'MATT%', weight: 1.96 },
            { stat: 'CritRate', weight: 3.92 },
            { stat: 'Damage', weight: 1.96 },
            { stat: 'AllStat', weight: 5.88 }, // Check weight, CSV says 5.88 for AllStat in Weapon Special
        ]
    },
    rare: {
        Armor: [
            { stat: 'STR', weight: 6.00 },
            { stat: 'DEX', weight: 6.00 },
            { stat: 'INT', weight: 6.00 },
            { stat: 'LUK', weight: 6.00 },
            { stat: 'MaxHP', weight: 6.00 },
            { stat: 'MaxMP', weight: 6.00 },
            { stat: 'Speed', weight: 6.00 },
            { stat: 'Jump', weight: 6.00 },
            { stat: 'DEF', weight: 6.00 },
            { stat: 'ATT', weight: 4.00 },
            { stat: 'MATT', weight: 4.00 },
            { stat: 'STR%', weight: 4.00 },
            { stat: 'DEX%', weight: 4.00 },
            { stat: 'INT%', weight: 4.00 },
            { stat: 'LUK%', weight: 4.00 },
            { stat: 'MaxHP%', weight: 6.00 },
            { stat: 'MaxMP%', weight: 6.00 },
            { stat: 'DEF%', weight: 6.00 },
            { stat: 'AllStat%', weight: 4.00 }, // CSV: 全屬性%
        ],
        Accessory: [
            { stat: 'STR', weight: 6.00 },
            { stat: 'DEX', weight: 6.00 },
            { stat: 'INT', weight: 6.00 },
            { stat: 'LUK', weight: 6.00 },
            { stat: 'MaxHP', weight: 6.00 },
            { stat: 'MaxMP', weight: 6.00 },
            { stat: 'Speed', weight: 6.00 },
            { stat: 'Jump', weight: 6.00 },
            { stat: 'DEF', weight: 6.00 },
            { stat: 'ATT', weight: 4.00 },
            { stat: 'MATT', weight: 4.00 },
            { stat: 'STR%', weight: 4.00 },
            { stat: 'DEX%', weight: 4.00 },
            { stat: 'INT%', weight: 4.00 },
            { stat: 'LUK%', weight: 4.00 },
            { stat: 'MaxHP%', weight: 6.00 },
            { stat: 'MaxMP%', weight: 6.00 },
            { stat: 'DEF%', weight: 6.00 },
            { stat: 'AllStat%', weight: 4.00 },
        ],
        WeaponGroup: [
            { stat: 'MaxHP%', weight: 8.82 },
            { stat: 'MaxMP%', weight: 8.82 },
            { stat: 'ATT%', weight: 5.88 }, // 物理攻擊力%
            { stat: 'MATT%', weight: 5.88 },
            { stat: 'CritRate', weight: 2.94 }, // 爆擊機率%
            { stat: 'STR%', weight: 8.82 },
            { stat: 'DEX%', weight: 8.82 },
            { stat: 'INT%', weight: 8.82 },
            { stat: 'LUK%', weight: 8.82 },
            { stat: 'Damage', weight: 2.94 }, // 總傷害
            { stat: 'AllStat%', weight: 5.88 },
            { stat: 'ProbHealHP', weight: 8.82 }, // 攻擊時HP恢復
            { stat: 'ProbHealMP', weight: 8.82 },
            { stat: 'IED', weight: 5.88 }, // 無視
        ]
    },
    epic: {
        Armor: [
            { stat: 'STR', weight: 6.12 },
            { stat: 'DEX', weight: 6.12 },
            { stat: 'INT', weight: 6.12 },
            { stat: 'LUK', weight: 6.12 },
            { stat: 'MaxHP', weight: 6.12 },
            { stat: 'MaxMP', weight: 6.12 },
            { stat: 'ATT', weight: 4.08 },
            { stat: 'MATT', weight: 4.08 },
            { stat: 'STR%', weight: 4.08 },
            { stat: 'DEX%', weight: 4.08 },
            { stat: 'INT%', weight: 4.08 },
            { stat: 'LUK%', weight: 4.08 },
            { stat: 'MaxHP%', weight: 6.12 },
            { stat: 'MaxMP%', weight: 6.12 },
            { stat: 'AllStat%', weight: 4.08 },
            { stat: 'RecoveryUp', weight: 6.12 }, // HP恢復道具...
            { stat: 'STRPer9Lv', weight: 4.08 },
            { stat: 'DEXPer9Lv', weight: 4.08 },
            { stat: 'INTPer9Lv', weight: 4.08 },
            { stat: 'LUKPer9Lv', weight: 4.08 },
        ],
        Accessory: [
            // Same as Armor for Epic
            { stat: 'STR', weight: 6.12 },
            { stat: 'DEX', weight: 6.12 },
            { stat: 'INT', weight: 6.12 },
            { stat: 'LUK', weight: 6.12 },
            { stat: 'MaxHP', weight: 6.12 },
            { stat: 'MaxMP', weight: 6.12 },
            { stat: 'ATT', weight: 4.08 },
            { stat: 'MATT', weight: 4.08 },
            { stat: 'STR%', weight: 4.08 },
            { stat: 'DEX%', weight: 4.08 },
            { stat: 'INT%', weight: 4.08 },
            { stat: 'LUK%', weight: 4.08 },
            { stat: 'MaxHP%', weight: 6.12 },
            { stat: 'MaxMP%', weight: 6.12 },
            { stat: 'AllStat%', weight: 4.08 },
            { stat: 'RecoveryUp', weight: 6.12 },
            { stat: 'STRPer9Lv', weight: 4.08 },
            { stat: 'DEXPer9Lv', weight: 4.08 },
            { stat: 'INTPer9Lv', weight: 4.08 },
            { stat: 'LUKPer9Lv', weight: 4.08 },
        ],
        WeaponGroup: [
            // Weapon+Secondary. (Emblem uses separate in CSV: 武器,徽章. Weapon,Secondary is 武器,輔助武器 )
            // But looking at numbers in CSV: Weapon&Secondary vs Weapon&Emblem are very close, but slightly diff.
            // E.g. Epic Weapon/Secondary MaxHP% 6.98%. Weapon/Emblem 7.14%.
            // I will separate them.
        ]
    },
    legendary: {
        // This needs specific handling
    },
    absolute: {
        // Absolute weights defined below
    }
};

// --- Absolute Cube Specialized Weights ---

const ABSOLUTE_EPIC_ARMOR = [
    { stat: 'STR', weight: 3.15 }, { stat: 'DEX', weight: 3.15 }, { stat: 'INT', weight: 3.15 }, { stat: 'LUK', weight: 3.15 },
    { stat: 'MaxHP', weight: 4.72 }, { stat: 'MaxMP', weight: 25.18 },
    { stat: 'ATT', weight: 0.06 }, { stat: 'MATT', weight: 0.06 },
    { stat: 'STR%', weight: 0.03 }, { stat: 'DEX%', weight: 0.03 }, { stat: 'INT%', weight: 0.03 }, { stat: 'LUK%', weight: 0.03 },
    { stat: 'MaxHP%', weight: 0.31 }, { stat: 'MaxMP%', weight: 28.33 },
    { stat: 'AllStat%', weight: 0.03 }, { stat: 'RecoveryUp', weight: 28.33 },
    { stat: 'STRPer9Lv', weight: 0.06 }, { stat: 'DEXPer9Lv', weight: 0.06 }, { stat: 'INTPer9Lv', weight: 0.06 }, { stat: 'LUKPer9Lv', weight: 0.06 },
];

const ABSOLUTE_EPIC_WEAPON = [
    { stat: 'MaxHP%', weight: 0.33 }, { stat: 'MaxMP%', weight: 29.70 },
    { stat: 'ATT%', weight: 0.03 }, { stat: 'MATT%', weight: 0.03 }, { stat: 'CritRate', weight: 3.30 },
    { stat: 'STR%', weight: 1.65 }, { stat: 'DEX%', weight: 1.65 }, { stat: 'INT%', weight: 1.65 }, { stat: 'LUK%', weight: 1.65 },
    { stat: 'Damage', weight: 0.17 }, { stat: 'AllStat%', weight: 1.65 },
    { stat: 'IED', weight: 4.95 }, { stat: 'BossDmg', weight: 0.17 },
    { stat: 'ProbHealHP', weight: 26.40 }, { stat: 'ProbHealMP', weight: 26.40 },
    { stat: 'STRPer9Lv', weight: 0.07 }, { stat: 'DEXPer9Lv', weight: 0.07 }, { stat: 'INTPer9Lv', weight: 0.07 }, { stat: 'LUKPer9Lv', weight: 0.07 },
];

const ABSOLUTE_LEGENDARY_HAT = [
    { stat: 'STR', weight: 4.34 }, { stat: 'DEX', weight: 4.34 }, { stat: 'INT', weight: 4.34 }, { stat: 'LUK', weight: 4.34 },
    { stat: 'MaxHP', weight: 4.34 }, { stat: 'MaxMP', weight: 6.51 },
    { stat: 'ATT', weight: 3.47 }, { stat: 'MATT', weight: 3.47 },
    { stat: 'STR%', weight: 3.37 }, { stat: 'DEX%', weight: 3.37 }, { stat: 'INT%', weight: 3.37 }, { stat: 'LUK%', weight: 3.37 },
    { stat: 'MaxHP%', weight: 3.69 }, { stat: 'MaxMP%', weight: 6.51 },
    { stat: 'CritDmg', weight: 2.17 }, { stat: 'AllStat%', weight: 3.37 },
    { stat: 'STRPer9Lv', weight: 3.47 }, { stat: 'DEXPer9Lv', weight: 3.47 }, { stat: 'INTPer9Lv', weight: 3.47 }, { stat: 'LUKPer9Lv', weight: 3.47 },
    { stat: 'RecoveryUp', weight: 6.95 }, { stat: 'CDR', weight: 1.74 }, { stat: 'MesoDrop', weight: 6.51 }, { stat: 'ItemDrop', weight: 6.51 },
];

const ABSOLUTE_LEGENDARY_GLOVE = [
    { stat: 'STR', weight: 4.32 }, { stat: 'DEX', weight: 4.32 }, { stat: 'INT', weight: 4.32 }, { stat: 'LUK', weight: 4.32 },
    { stat: 'MaxHP', weight: 4.32 }, { stat: 'MaxMP', weight: 6.49 },
    { stat: 'ATT', weight: 3.46 }, { stat: 'MATT', weight: 3.46 },
    { stat: 'STR%', weight: 3.35 }, { stat: 'DEX%', weight: 3.35 }, { stat: 'INT%', weight: 3.35 }, { stat: 'LUK%', weight: 3.35 },
    { stat: 'MaxHP%', weight: 3.68 }, { stat: 'MaxMP%', weight: 6.49 },
    { stat: 'CritDmg_Glove', weight: 2.16 }, { stat: 'CritDmg', weight: 2.16 }, { stat: 'AllStat%', weight: 3.35 },
    { stat: 'STRPer9Lv', weight: 3.46 }, { stat: 'DEXPer9Lv', weight: 3.46 }, { stat: 'INTPer9Lv', weight: 3.46 }, { stat: 'LUKPer9Lv', weight: 3.46 },
    { stat: 'RecoveryUp', weight: 6.92 }, { stat: 'MesoDrop', weight: 6.49 }, { stat: 'ItemDrop', weight: 6.49 },
];

const ABSOLUTE_LEGENDARY_ARMOR = [
    { stat: 'STR', weight: 4.42 }, { stat: 'DEX', weight: 4.42 }, { stat: 'INT', weight: 4.42 }, { stat: 'LUK', weight: 4.42 },
    { stat: 'MaxHP', weight: 4.42 }, { stat: 'MaxMP', weight: 6.63 },
    { stat: 'ATT', weight: 3.54 }, { stat: 'MATT', weight: 3.54 },
    { stat: 'STR%', weight: 3.43 }, { stat: 'DEX%', weight: 3.43 }, { stat: 'INT%', weight: 3.43 }, { stat: 'LUK%', weight: 3.43 },
    { stat: 'MaxHP%', weight: 3.76 }, { stat: 'MaxMP%', weight: 6.63 },
    { stat: 'CritDmg', weight: 2.21 }, { stat: 'AllStat%', weight: 3.43 },
    { stat: 'STRPer9Lv', weight: 3.54 }, { stat: 'DEXPer9Lv', weight: 3.54 }, { stat: 'INTPer9Lv', weight: 3.54 }, { stat: 'LUKPer9Lv', weight: 3.54 },
    { stat: 'RecoveryUp', weight: 7.07 }, { stat: 'MesoDrop', weight: 6.63 }, { stat: 'ItemDrop', weight: 6.63 },
];

const ABSOLUTE_LEGENDARY_ACCESSORY = [
    { stat: 'STR', weight: 4.21 }, { stat: 'DEX', weight: 4.21 }, { stat: 'INT', weight: 4.21 }, { stat: 'LUK', weight: 4.21 },
    { stat: 'MaxHP', weight: 4.21 }, { stat: 'MaxMP', weight: 6.32 },
    { stat: 'ATT', weight: 3.37 }, { stat: 'MATT', weight: 3.37 },
    { stat: 'STR%', weight: 3.27 }, { stat: 'DEX%', weight: 3.27 }, { stat: 'INT%', weight: 3.27 }, { stat: 'LUK%', weight: 3.27 },
    { stat: 'MaxHP%', weight: 3.58 }, { stat: 'MaxMP%', weight: 6.32 },
    { stat: 'AllStat%', weight: 3.27 },
    { stat: 'STRPer9Lv', weight: 3.37 }, { stat: 'DEXPer9Lv', weight: 3.37 }, { stat: 'INTPer9Lv', weight: 3.37 }, { stat: 'LUKPer9Lv', weight: 3.37 },
    { stat: 'MPCost', weight: 6.74 }, { stat: 'RecoveryUp', weight: 6.74 }, { stat: 'MesoDrop', weight: 6.32 }, { stat: 'ItemDrop', weight: 6.32 },
];

const ABSOLUTE_LEGENDARY_WEAPON = [
    { stat: 'MaxHP%', weight: 7.15 }, { stat: 'MaxMP%', weight: 12.63 },
    { stat: 'ATT%', weight: 2.61 }, { stat: 'MATT%', weight: 2.61 }, { stat: 'CritRate', weight: 4.71 },
    { stat: 'STR%', weight: 4.71 }, { stat: 'DEX%', weight: 4.71 }, { stat: 'INT%', weight: 4.71 }, { stat: 'LUK%', weight: 4.71 },
    { stat: 'Damage', weight: 4.63 }, { stat: 'AllStat%', weight: 4.71 }, { stat: 'IED', weight: 5.47 }, { stat: 'BossDmg', weight: 2.95 },
    { stat: 'STRPer9Lv', weight: 6.73 }, { stat: 'DEXPer9Lv', weight: 6.73 }, { stat: 'INTPer9Lv', weight: 6.73 }, { stat: 'LUKPer9Lv', weight: 6.73 },
    { stat: 'ATT', weight: 3.37 }, { stat: 'MATT', weight: 3.37 },
];

const ABSOLUTE_LEGENDARY_SECONDARY = [
    { stat: 'MaxHP%', weight: 6.87 }, { stat: 'MaxMP%', weight: 12.12 },
    { stat: 'ATT%', weight: 2.50 }, { stat: 'MATT%', weight: 2.50 }, { stat: 'CritRate', weight: 4.52 },
    { stat: 'CritDmg', weight: 4.04 },
    { stat: 'STR%', weight: 4.52 }, { stat: 'DEX%', weight: 4.52 }, { stat: 'INT%', weight: 4.52 }, { stat: 'LUK%', weight: 4.52 },
    { stat: 'Damage', weight: 4.44 }, { stat: 'AllStat%', weight: 4.52 }, { stat: 'IED', weight: 5.25 }, { stat: 'BossDmg', weight: 2.83 },
    { stat: 'STRPer9Lv', weight: 6.46 }, { stat: 'DEXPer9Lv', weight: 6.46 }, { stat: 'INTPer9Lv', weight: 6.46 }, { stat: 'LUKPer9Lv', weight: 6.46 },
    { stat: 'ATT', weight: 3.23 }, { stat: 'MATT', weight: 3.23 },
];

const ABSOLUTE_LEGENDARY_EMBLEM = [
    { stat: 'MaxHP%', weight: 7.37 }, { stat: 'MaxMP%', weight: 13.01 },
    { stat: 'ATT%', weight: 2.69 }, { stat: 'MATT%', weight: 2.69 }, { stat: 'CritRate', weight: 4.86 },
    { stat: 'STR%', weight: 4.86 }, { stat: 'DEX%', weight: 4.86 }, { stat: 'INT%', weight: 4.86 }, { stat: 'LUK%', weight: 4.86 },
    { stat: 'Damage', weight: 4.77 }, { stat: 'AllStat%', weight: 4.86 }, { stat: 'IED', weight: 5.64 },
    { stat: 'STRPer9Lv', weight: 6.94 }, { stat: 'DEXPer9Lv', weight: 6.94 }, { stat: 'INTPer9Lv', weight: 6.94 }, { stat: 'LUKPer9Lv', weight: 6.94 },
    { stat: 'ATT', weight: 3.47 }, { stat: 'MATT', weight: 3.47 },
];

const ABSOLUTE_LEGENDARY_GENERAL_OTHER = [
    { stat: 'STR', weight: 4.52 }, { stat: 'DEX', weight: 4.52 }, { stat: 'INT', weight: 4.52 }, { stat: 'LUK', weight: 4.52 },
    { stat: 'MaxHP', weight: 4.52 }, { stat: 'MaxMP', weight: 6.78 },
    { stat: 'ATT', weight: 3.62 }, { stat: 'MATT', weight: 3.62 },
    { stat: 'STR%', weight: 3.50 }, { stat: 'DEX%', weight: 3.50 }, { stat: 'INT%', weight: 3.50 }, { stat: 'LUK%', weight: 3.50 },
    { stat: 'MaxHP%', weight: 3.84 }, { stat: 'MaxMP%', weight: 6.78 },
    { stat: 'AllStat%', weight: 3.50 },
    { stat: 'STRPer9Lv', weight: 3.62 }, { stat: 'DEXPer9Lv', weight: 3.62 }, { stat: 'INTPer9Lv', weight: 3.62 }, { stat: 'LUKPer9Lv', weight: 3.62 },
    { stat: 'RecoveryUp', weight: 7.23 }, { stat: 'MesoDrop', weight: 6.78 }, { stat: 'ItemDrop', weight: 6.78 },
];

// Specialized Helpers for Epic/Legendary Splits

const EPIC_WEAPON_SECONDARY = [
    { stat: 'MaxHP%', weight: 6.98 },
    { stat: 'MaxMP%', weight: 6.98 },
    { stat: 'ATT%', weight: 4.65 },
    { stat: 'MATT%', weight: 4.65 },
    { stat: 'CritRate', weight: 4.65 },
    { stat: 'STR%', weight: 6.98 },
    { stat: 'DEX%', weight: 6.98 },
    { stat: 'INT%', weight: 6.98 },
    { stat: 'LUK%', weight: 6.98 },
    { stat: 'Damage', weight: 2.33 },
    { stat: 'AllStat%', weight: 4.65 },
    { stat: 'IED', weight: 2.33 },
    { stat: 'BossDmg', weight: 2.33 },
    { stat: 'ProbHealHP', weight: 6.98 },
    { stat: 'ProbHealMP', weight: 6.98 },
    { stat: 'STRPer9Lv', weight: 4.65 },
    { stat: 'DEXPer9Lv', weight: 4.65 },
    { stat: 'INTPer9Lv', weight: 4.65 },
    { stat: 'LUKPer9Lv', weight: 4.65 },
];

const EPIC_EMBLEM = [
    { stat: 'MaxHP%', weight: 7.14 },
    { stat: 'MaxMP%', weight: 7.14 },
    { stat: 'ATT%', weight: 4.76 },
    { stat: 'MATT%', weight: 4.76 },
    { stat: 'CritRate', weight: 4.76 },
    { stat: 'STR%', weight: 7.14 },
    { stat: 'DEX%', weight: 7.14 },
    { stat: 'INT%', weight: 7.14 },
    { stat: 'LUK%', weight: 7.14 },
    { stat: 'Damage', weight: 2.38 },
    { stat: 'AllStat%', weight: 4.76 },
    { stat: 'IED', weight: 2.38 },
    { stat: 'ProbHealHP', weight: 7.14 },
    { stat: 'ProbHealMP', weight: 7.14 },
    { stat: 'STRPer9Lv', weight: 4.76 },
    { stat: 'DEXPer9Lv', weight: 4.76 },
    { stat: 'INTPer9Lv', weight: 4.76 },
    { stat: 'LUKPer9Lv', weight: 4.76 },
];

const LEGENDARY_HAT = [
    { stat: 'STR', weight: 5.00 },
    { stat: 'DEX', weight: 5.00 },
    { stat: 'INT', weight: 5.00 },
    { stat: 'LUK', weight: 5.00 },
    { stat: 'MaxHP', weight: 5.00 },
    { stat: 'MaxMP', weight: 5.00 },
    { stat: 'ATT', weight: 3.33 },
    { stat: 'MATT', weight: 3.33 },
    { stat: 'STR%', weight: 3.33 },
    { stat: 'DEX%', weight: 3.33 },
    { stat: 'INT%', weight: 3.33 },
    { stat: 'LUK%', weight: 3.33 },
    { stat: 'MaxHP%', weight: 5.00 },
    { stat: 'MaxMP%', weight: 5.00 },
    { stat: 'CritDmg', weight: 3.33 },
    { stat: 'AllStat%', weight: 3.33 },
    { stat: 'STRPer9Lv', weight: 3.33 },
    { stat: 'DEXPer9Lv', weight: 3.33 },
    { stat: 'INTPer9Lv', weight: 3.33 },
    { stat: 'LUKPer9Lv', weight: 3.33 },
    { stat: 'RecoveryUp', weight: 5.00 },
    { stat: 'CDR', weight: 5.00 }, // CD -X
    { stat: 'MesoDrop', weight: 5.00 },
    { stat: 'ItemDrop', weight: 5.00 },
];

const LEGENDARY_GLOVE = [
    // ... Derived from CSV
    { stat: 'STR', weight: 5.08 },
    { stat: 'DEX', weight: 5.08 },
    { stat: 'INT', weight: 5.08 },
    { stat: 'LUK', weight: 5.08 },
    { stat: 'MaxHP', weight: 5.08 },
    { stat: 'MaxMP', weight: 5.08 },
    { stat: 'ATT', weight: 3.39 },
    { stat: 'MATT', weight: 3.39 },
    { stat: 'STR%', weight: 3.39 },
    { stat: 'DEX%', weight: 3.39 },
    { stat: 'INT%', weight: 3.39 },
    { stat: 'LUK%', weight: 3.39 },
    { stat: 'MaxHP%', weight: 5.08 },
    { stat: 'MaxMP%', weight: 5.08 },
    { stat: 'CritDmg_Glove', weight: 3.39 }, // Hand specific 3.39% weight
    { stat: 'CritDmg', weight: 3.39 },        // Armor general 3.39% weight
    { stat: 'AllStat%', weight: 3.39 },
    { stat: 'STRPer9Lv', weight: 3.39 },
    { stat: 'DEXPer9Lv', weight: 3.39 },
    { stat: 'INTPer9Lv', weight: 3.39 },
    { stat: 'LUKPer9Lv', weight: 3.39 },
    { stat: 'RecoveryUp', weight: 5.08 },
    { stat: 'MesoDrop', weight: 5.08 },
    { stat: 'ItemDrop', weight: 5.08 },
];

const LEGENDARY_ARMOR_GENERAL = [
    // Top, Bottom, ...
    { stat: 'STR', weight: 5.26 },
    { stat: 'DEX', weight: 5.26 },
    { stat: 'INT', weight: 5.26 },
    { stat: 'LUK', weight: 5.26 },
    { stat: 'MaxHP', weight: 5.26 },
    { stat: 'MaxMP', weight: 5.26 },
    { stat: 'ATT', weight: 3.51 },
    { stat: 'MATT', weight: 3.51 },
    { stat: 'STR%', weight: 3.51 },
    { stat: 'DEX%', weight: 3.51 },
    { stat: 'INT%', weight: 3.51 },
    { stat: 'LUK%', weight: 3.51 },
    { stat: 'MaxHP%', weight: 5.26 },
    { stat: 'MaxMP%', weight: 5.26 },
    { stat: 'CritDmg', weight: 3.51 }, // CSV says "Armor specific" for CritDmg
    { stat: 'AllStat%', weight: 3.51 },
    { stat: 'STRPer9Lv', weight: 3.51 },
    { stat: 'DEXPer9Lv', weight: 3.51 },
    { stat: 'INTPer9Lv', weight: 3.51 },
    { stat: 'LUKPer9Lv', weight: 3.51 },
    { stat: 'RecoveryUp', weight: 5.26 },
    { stat: 'MesoDrop', weight: 5.26 },
    { stat: 'ItemDrop', weight: 5.26 },
];

const LEGENDARY_ACCESSORY = [
    { stat: 'STR', weight: 5.17 },
    { stat: 'DEX', weight: 5.17 },
    { stat: 'INT', weight: 5.17 },
    { stat: 'LUK', weight: 5.17 },
    { stat: 'MaxHP', weight: 5.17 },
    { stat: 'MaxMP', weight: 5.17 },
    { stat: 'ATT', weight: 3.45 },
    { stat: 'MATT', weight: 3.45 },
    { stat: 'STR%', weight: 3.45 },
    { stat: 'DEX%', weight: 3.45 },
    { stat: 'INT%', weight: 3.45 },
    { stat: 'LUK%', weight: 3.45 },
    { stat: 'MaxHP%', weight: 5.17 },
    { stat: 'MaxMP%', weight: 5.17 },
    { stat: 'AllStat%', weight: 3.45 },
    { stat: 'STRPer9Lv', weight: 3.45 },
    { stat: 'DEXPer9Lv', weight: 3.45 },
    { stat: 'INTPer9Lv', weight: 3.45 },
    { stat: 'LUKPer9Lv', weight: 3.45 },
    { stat: 'MPCost', weight: 5.17 },
    { stat: 'RecoveryUp', weight: 5.17 },
    { stat: 'MesoDrop', weight: 5.17 },
    { stat: 'ItemDrop', weight: 5.17 },
]

const LEGENDARY_WEAPON = [
    // Weapon Only
    { stat: 'MaxHP%', weight: 7.69 },
    { stat: 'MaxMP%', weight: 7.69 },
    { stat: 'ATT%', weight: 5.13 },
    { stat: 'MATT%', weight: 5.13 },
    { stat: 'CritRate', weight: 5.13 },
    { stat: 'STR%', weight: 7.69 },
    { stat: 'DEX%', weight: 7.69 },
    { stat: 'INT%', weight: 7.69 },
    { stat: 'LUK%', weight: 7.69 },
    { stat: 'Damage', weight: 2.56 },
    { stat: 'AllStat%', weight: 5.13 },
    { stat: 'IED', weight: 2.56 },
    { stat: 'BossDmg', weight: 2.56 },
    { stat: 'STRPer9Lv', weight: 5.13 },
    { stat: 'DEXPer9Lv', weight: 5.13 },
    { stat: 'INTPer9Lv', weight: 5.13 },
    { stat: 'LUKPer9Lv', weight: 5.13 },
    { stat: 'ATT', weight: 2.56 }, // Attack (Flat)
    { stat: 'MATT', weight: 2.56 },
];

const LEGENDARY_SECONDARY = [
    { stat: 'MaxHP%', weight: 7.32 },
    { stat: 'MaxMP%', weight: 7.32 },
    { stat: 'ATT%', weight: 4.88 },
    { stat: 'MATT%', weight: 4.88 },
    { stat: 'CritRate', weight: 4.88 },
    { stat: 'CritDmg', weight: 4.88 }, // Secondary in Legendary has Crit Dmg? CSV says: "Crit Dmg, Armor Specific" (Wait, row is in Weapon, Secondary? line 301 in CSV desc -> "爆擊傷害%, 防具專用" appearing in Weapon, Secondary section. This is odd. Maybe typo in CSV or game data. But I will trust CSV line: "爆擊傷害%,防具專用, 4.88%" inside "Weapon, Secondary" block. Wait "防具專用" means "Armor Only". Why is it in Secondary? Maybe it implies you CANNOT get it, or it is a copy paste error in CSV headers? actually row says "Crit Dmg%, Armor Only 4.88%". I will include it if it's there.)
    // Actually, usually Secondary can get similar lines to Weapon. 
    // Line 301: "爆擊傷害%, 防具專用, 4.88%, ..." -> The text "防具專用" suggests it might NOT belong here or serves as a label. But 4.88% is allocated. I'll include it.
    { stat: 'STR%', weight: 7.32 },
    { stat: 'DEX%', weight: 7.32 },
    { stat: 'INT%', weight: 7.32 },
    { stat: 'LUK%', weight: 7.32 },
    { stat: 'Damage', weight: 2.44 },
    { stat: 'AllStat%', weight: 4.88 },
    { stat: 'IED', weight: 2.44 },
    { stat: 'BossDmg', weight: 2.44 },
    { stat: 'STRPer9Lv', weight: 4.88 },
    { stat: 'DEXPer9Lv', weight: 4.88 },
    { stat: 'INTPer9Lv', weight: 4.88 },
    { stat: 'LUKPer9Lv', weight: 4.88 },
    { stat: 'ATT', weight: 2.44 },
    { stat: 'MATT', weight: 2.44 },
];

const LEGENDARY_EMBLEM = [
    { stat: 'MaxHP%', weight: 7.89 },
    { stat: 'MaxMP%', weight: 7.89 },
    { stat: 'ATT%', weight: 5.26 },
    { stat: 'MATT%', weight: 5.26 },
    { stat: 'CritRate', weight: 5.26 },
    { stat: 'STR%', weight: 7.89 },
    { stat: 'DEX%', weight: 7.89 },
    { stat: 'INT%', weight: 7.89 },
    { stat: 'LUK%', weight: 7.89 },
    { stat: 'Damage', weight: 2.63 },
    { stat: 'AllStat%', weight: 5.26 },
    { stat: 'IED', weight: 2.63 },
    { stat: 'STRPer9Lv', weight: 5.26 },
    { stat: 'DEXPer9Lv', weight: 5.26 },
    { stat: 'INTPer9Lv', weight: 5.26 },
    { stat: 'LUKPer9Lv', weight: 5.26 },
    { stat: 'ATT', weight: 2.63 },
    { stat: 'MATT', weight: 2.63 },
];

const LEGENDARY_HEART = [
    { stat: 'STR', weight: 5.45 },
    { stat: 'DEX', weight: 5.45 },
    { stat: 'INT', weight: 5.45 },
    { stat: 'LUK', weight: 5.45 },
    { stat: 'MaxHP', weight: 5.45 },
    { stat: 'MaxMP', weight: 5.45 },
    { stat: 'ATT', weight: 3.64 },
    { stat: 'MATT', weight: 3.64 },
    { stat: 'STR%', weight: 3.64 },
    { stat: 'DEX%', weight: 3.64 },
    { stat: 'INT%', weight: 3.64 },
    { stat: 'LUK%', weight: 3.64 },
    { stat: 'MaxHP%', weight: 5.45 },
    { stat: 'MaxMP%', weight: 5.45 },
    { stat: 'AllStat%', weight: 3.64 },
    { stat: 'STRPer9Lv', weight: 3.64 },
    { stat: 'DEXPer9Lv', weight: 3.64 },
    { stat: 'INTPer9Lv', weight: 3.64 },
    { stat: 'LUKPer9Lv', weight: 3.64 },
    { stat: 'RecoveryUp', weight: 5.45 },
    { stat: 'MesoDrop', weight: 5.45 },
    { stat: 'ItemDrop', weight: 5.45 },
];

const LEGENDARY_BADGE = [
    // Same as Heart but slightly diff or same? CSV says Badge separate block at end.
    // Badge: STR 5.45, ... same as Heart?
    // Last block in CSV: "其他, 胸章"
    { stat: 'STR', weight: 5.45 },
    { stat: 'DEX', weight: 5.45 },
    { stat: 'INT', weight: 5.45 },
    { stat: 'LUK', weight: 5.45 },
    { stat: 'MaxHP', weight: 5.45 },
    { stat: 'MaxMP', weight: 5.45 },
    { stat: 'ATT', weight: 3.64 },
    { stat: 'MATT', weight: 3.64 },
    { stat: 'STR%', weight: 3.64 },
    { stat: 'DEX%', weight: 3.64 },
    { stat: 'INT%', weight: 3.64 },
    { stat: 'LUK%', weight: 3.64 },
    { stat: 'MaxHP%', weight: 5.45 },
    { stat: 'MaxMP%', weight: 5.45 },
    { stat: 'AllStat%', weight: 3.64 },
    { stat: 'STRPer9Lv', weight: 3.64 },
    { stat: 'DEXPer9Lv', weight: 3.64 },
    { stat: 'INTPer9Lv', weight: 3.64 },
    { stat: 'LUKPer9Lv', weight: 3.64 },
    { stat: 'RecoveryUp', weight: 5.45 },
    { stat: 'MesoDrop', weight: 5.45 },
    { stat: 'ItemDrop', weight: 5.45 },
];


const MEMORIAL_EPIC_ARMOR = [
    { stat: 'STR', weight: 7.91 }, { stat: 'DEX', weight: 7.91 }, { stat: 'INT', weight: 7.91 }, { stat: 'LUK', weight: 7.91 },
    { stat: 'MaxHP', weight: 7.91 }, { stat: 'MaxMP', weight: 7.91 },
    { stat: 'ATT', weight: 3.16 }, { stat: 'MATT', weight: 3.16 },
    { stat: 'STR%', weight: 1.90 }, { stat: 'DEX%', weight: 1.90 }, { stat: 'INT%', weight: 1.90 }, { stat: 'LUK%', weight: 1.90 },
    { stat: 'MaxHP%', weight: 1.90 }, { stat: 'MaxMP%', weight: 3.16 },
    { stat: 'AllStat%', weight: 1.90 }, { stat: 'RecoveryUp', weight: 6.33 },
    { stat: 'STRPer9Lv', weight: 6.33 }, { stat: 'DEXPer9Lv', weight: 6.33 }, { stat: 'INTPer9Lv', weight: 6.33 }, { stat: 'LUKPer9Lv', weight: 6.33 },
];

const MEMORIAL_EPIC_WEAPON = [
    { stat: 'MaxHP%', weight: 2.46 }, { stat: 'MaxMP%', weight: 4.93 },
    { stat: 'ATT%', weight: 1.23 }, { stat: 'MATT%', weight: 1.23 }, { stat: 'CritRate', weight: 4.93 },
    { stat: 'STR%', weight: 2.46 }, { stat: 'DEX%', weight: 2.46 }, { stat: 'INT%', weight: 2.46 }, { stat: 'LUK%', weight: 2.46 },
    { stat: 'Damage', weight: 1.97 }, { stat: 'AllStat%', weight: 2.46 }, { stat: 'IED', weight: 9.85 },
    { stat: 'BossDmg', weight: 1.97 }, { stat: 'ProbHealHP', weight: 9.85 }, { stat: 'ProbHealMP', weight: 9.85 },
    { stat: 'STRPer9Lv', weight: 9.85 }, { stat: 'DEXPer9Lv', weight: 9.85 }, { stat: 'INTPer9Lv', weight: 9.85 }, { stat: 'LUKPer9Lv', weight: 9.85 },
];

const MEMORIAL_LEGENDARY_HAT = [
    { stat: 'STR', weight: 6.49 }, { stat: 'DEX', weight: 6.49 }, { stat: 'INT', weight: 6.49 }, { stat: 'LUK', weight: 6.49 },
    { stat: 'MaxHP', weight: 6.49 }, { stat: 'MaxMP', weight: 6.49 },
    { stat: 'ATT', weight: 2.60 }, { stat: 'MATT', weight: 2.60 },
    { stat: 'STR%', weight: 1.56 }, { stat: 'DEX%', weight: 1.56 }, { stat: 'INT%', weight: 1.56 }, { stat: 'LUK%', weight: 1.56 },
    { stat: 'MaxHP%', weight: 1.56 }, { stat: 'MaxMP%', weight: 2.60 },
    { stat: 'CritDmg_Glove', weight: 2.60 },
    { stat: 'CritDmg', weight: 2.60 },
    { stat: 'AllStat%', weight: 1.56 },
    { stat: 'STRPer9Lv', weight: 5.19 }, { stat: 'DEXPer9Lv', weight: 5.19 }, { stat: 'INTPer9Lv', weight: 5.19 }, { stat: 'LUKPer9Lv', weight: 5.19 },
    { stat: 'RecoveryUp', weight: 6.49 }, { stat: 'CDR', weight: 1.04 }, { stat: 'MesoDrop', weight: 6.49 }, { stat: 'ItemDrop', weight: 6.49 },
];

const MEMORIAL_LEGENDARY_ARMOR = [
    { stat: 'STR', weight: 6.56 }, { stat: 'DEX', weight: 6.56 }, { stat: 'INT', weight: 6.56 }, { stat: 'LUK', weight: 6.56 },
    { stat: 'MaxHP', weight: 6.56 }, { stat: 'MaxMP', weight: 6.56 },
    { stat: 'ATT', weight: 2.62 }, { stat: 'MATT', weight: 2.62 },
    { stat: 'STR%', weight: 1.57 }, { stat: 'DEX%', weight: 1.57 }, { stat: 'INT%', weight: 1.57 }, { stat: 'LUK%', weight: 1.57 },
    { stat: 'MaxHP%', weight: 1.57 }, { stat: 'MaxMP%', weight: 2.62 },
    { stat: 'CritDmg', weight: 2.62 }, { stat: 'AllStat%', weight: 1.57 },
    { stat: 'STRPer9Lv', weight: 5.25 }, { stat: 'DEXPer9Lv', weight: 5.25 }, { stat: 'INTPer9Lv', weight: 5.25 }, { stat: 'LUKPer9Lv', weight: 5.25 },
    { stat: 'RecoveryUp', weight: 6.56 }, { stat: 'MesoDrop', weight: 6.56 }, { stat: 'ItemDrop', weight: 6.56 },
];

const MEMORIAL_LEGENDARY_ACCESSORY = [
    { stat: 'STR', weight: 6.31 }, { stat: 'DEX', weight: 6.31 }, { stat: 'INT', weight: 6.31 }, { stat: 'LUK', weight: 6.31 },
    { stat: 'MaxHP', weight: 6.31 }, { stat: 'MaxMP', weight: 6.31 },
    { stat: 'ATT', weight: 2.53 }, { stat: 'MATT', weight: 2.53 },
    { stat: 'STR%', weight: 1.52 }, { stat: 'DEX%', weight: 1.52 }, { stat: 'INT%', weight: 1.52 }, { stat: 'LUK%', weight: 1.52 },
    { stat: 'MaxHP%', weight: 1.25 }, { stat: 'MaxMP%', weight: 2.53 },
    { stat: 'AllStat%', weight: 1.52 },
    { stat: 'STRPer9Lv', weight: 5.05 }, { stat: 'DEXPer9Lv', weight: 5.05 }, { stat: 'INTPer9Lv', weight: 5.05 }, { stat: 'LUKPer9Lv', weight: 5.05 },
    { stat: 'MPCost', weight: 5.05 }, { stat: 'RecoveryUp', weight: 6.31 }, { stat: 'MesoDrop', weight: 6.31 }, { stat: 'ItemDrop', weight: 6.31 },
];

const MEMORIAL_LEGENDARY_WEAPON = [
    { stat: 'MaxHP%', weight: 2.53 }, { stat: 'MaxMP%', weight: 5.05 },
    { stat: 'ATT%', weight: 1.26 }, { stat: 'MATT%', weight: 1.26 }, { stat: 'CritRate', weight: 5.05 },
    { stat: 'STR%', weight: 2.53 }, { stat: 'DEX%', weight: 2.53 }, { stat: 'INT%', weight: 2.53 }, { stat: 'LUK%', weight: 2.53 },
    { stat: 'Damage', weight: 2.02 }, { stat: 'AllStat%', weight: 2.53 }, { stat: 'IED', weight: 12.63 },
    { stat: 'BossDmg', weight: 2.02 },
    { stat: 'STRPer9Lv', weight: 10.10 }, { stat: 'DEXPer9Lv', weight: 10.10 }, { stat: 'INTPer9Lv', weight: 10.10 }, { stat: 'LUKPer9Lv', weight: 10.10 },
    { stat: 'ATT', weight: 7.58 }, { stat: 'MATT', weight: 7.58 },
];

export const getPool = (tier: PotentialTier, part: EquipmentType, cube: CubeType = 'premiumBonus'): StatRate[] => {
    if (cube === 'memorialBonus') {
        if (tier === 'epic') {
            if (['Weapon', 'Secondary', 'Emblem'].includes(part)) return MEMORIAL_EPIC_WEAPON;
            return MEMORIAL_EPIC_ARMOR;
        }
        if (tier === 'legendary') {
            if (part === 'Hat') return MEMORIAL_LEGENDARY_HAT;
            if (['Weapon', 'Secondary', 'Emblem'].includes(part)) return MEMORIAL_LEGENDARY_WEAPON;
            if (['Earring', 'Eye', 'Face', 'Ring', 'Pendant'].includes(part)) return MEMORIAL_LEGENDARY_ACCESSORY;
            return MEMORIAL_LEGENDARY_ARMOR;
        }
    }

    if (cube === 'absoluteBonus') {
        if (tier === 'epic') {
            if (['Weapon', 'Secondary', 'Emblem'].includes(part)) return ABSOLUTE_EPIC_WEAPON;
            return ABSOLUTE_EPIC_ARMOR;
        }
        if (tier === 'legendary') {
            if (part === 'Hat') return ABSOLUTE_LEGENDARY_HAT;
            if (part === 'Gloves') return ABSOLUTE_LEGENDARY_GLOVE;
            if (part === 'Weapon') return ABSOLUTE_LEGENDARY_WEAPON;
            if (part === 'Secondary') return ABSOLUTE_LEGENDARY_SECONDARY;
            if (part === 'Emblem') return ABSOLUTE_LEGENDARY_EMBLEM;
            if (['Hat', 'Top', 'Bottom', 'Overall', 'Gloves', 'Shoes', 'Cape', 'Belt', 'Shoulder'].includes(part)) return ABSOLUTE_LEGENDARY_ARMOR;
            if (['Earring', 'Pendant', 'Ring', 'Face', 'Eye'].includes(part)) return ABSOLUTE_LEGENDARY_ACCESSORY;
            return ABSOLUTE_LEGENDARY_GENERAL_OTHER;
        }
    }

    // Default to existing logic for other cubes or tiers
    if (tier === 'special') {
        if (['Weapon', 'Secondary', 'Emblem'].includes(part)) return DATA_SOURCE.special.WeaponGroup;
        if (['Earring', 'Eye', 'Face', 'Ring', 'Pendant'].includes(part)) return DATA_SOURCE.special.Accessory;
        return DATA_SOURCE.special.Armor;
    }

    if (tier === 'rare') {
        if (['Weapon', 'Secondary', 'Emblem'].includes(part)) return DATA_SOURCE.rare.WeaponGroup;
        if (['Earring', 'Eye', 'Face', 'Ring', 'Pendant'].includes(part)) return DATA_SOURCE.rare.Accessory;
        return DATA_SOURCE.rare.Armor;
    }

    if (tier === 'epic') {
        if (part === 'Emblem') return EPIC_EMBLEM;
        if (['Weapon', 'Secondary'].includes(part)) return EPIC_WEAPON_SECONDARY;
        if (['Earring', 'Eye', 'Face', 'Ring', 'Pendant'].includes(part)) return DATA_SOURCE.epic.Accessory;
        return DATA_SOURCE.epic.Armor;
    }

    if (tier === 'legendary') {
        if (part === 'Hat') return LEGENDARY_HAT;
        if (part === 'Gloves') return LEGENDARY_GLOVE;
        if (part === 'Weapon') return LEGENDARY_WEAPON;
        if (part === 'Secondary') return LEGENDARY_SECONDARY;
        if (part === 'Emblem') return LEGENDARY_EMBLEM;
        if (part === 'Heart') return LEGENDARY_HEART;
        if (part === 'Badge') return LEGENDARY_BADGE;

        // Remaining Accessories
        if (['Earring', 'Eye', 'Face', 'Ring', 'Pendant'].includes(part)) return LEGENDARY_ACCESSORY;

        return LEGENDARY_ARMOR_GENERAL;
    }

    return [];
};
