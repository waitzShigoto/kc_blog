
export interface SoulOrbPotential {
    name: string;
    probability: number;
    values: {
        [key: string]: string; // "161-170": "7", etc.
    };
}

export interface SoulOrb {
    name: string;
    potentials: SoulOrbPotential[];
}

export const LEVEL_RANGES = [
    { value: '161-170', label: '161~170' },
    { value: '171-180', label: '171~180' },
    { value: '181-190', label: '181~190' },
    { value: '191-200', label: '191~200' },
];

const GROUP_A_POTENTIALS: SoulOrbPotential[] = [
    { name: '全屬性%', probability: 3.57, values: { '161-170': '7', '171-180': '7', '181-190': '7', '191-200': '7' } },
    { name: '無視怪物防禦力%', probability: 3.57, values: { '161-170': '30', '171-180': '30', '181-190': '30', '191-200': '30' } },
    { name: '攻擊BOSS怪物攻擊時傷害增加%', probability: 3.57, values: { '161-170': '20', '171-180': '20', '181-190': '20', '191-200': '20' } },
    { name: '總傷害%', probability: 3.57, values: { '161-170': '10', '171-180': '10', '181-190': '10', '191-200': '10' } },
    { name: '物理攻擊力%', probability: 3.57, values: { '161-170': '10', '171-180': '10', '181-190': '10', '191-200': '10' } },
    { name: '魔法攻擊力%', probability: 3.57, values: { '161-170': '10', '171-180': '10', '181-190': '10', '191-200': '10' } },
    { name: '爆擊機率%', probability: 3.57, values: { '161-170': '10', '171-180': '10', '181-190': '10', '191-200': '10' } },
    { name: '所有技能等級+1(5轉及部分技能除外，只增加到技能的最高等級)', probability: 3.57, values: { '161-170': '1', '171-180': '1', '181-190': '1', '191-200': '1' } },
    { name: '被擊中時有一定的機率無視傷害', probability: 3.57, values: { '161-170': '20', '171-180': '20', '181-190': '20', '191-200': '20' } },
    { name: '被攻擊時有一定機率在時間內無敵', probability: 3.57, values: { '161-170': '7', '171-180': '7', '181-190': '7', '191-200': '7' } },
    { name: '全屬性%', probability: 3.57, values: { '161-170': '4', '171-180': '4', '181-190': '4', '191-200': '4' } },
    { name: '無視怪物防禦力%', probability: 3.57, values: { '161-170': '15', '171-180': '15', '181-190': '15', '191-200': '15' } },
    { name: '總傷害%', probability: 3.57, values: { '161-170': '7', '171-180': '7', '181-190': '7', '191-200': '7' } },
    { name: '物理攻擊力%', probability: 3.57, values: { '161-170': '7', '171-180': '7', '181-190': '7', '191-200': '7' } },
    { name: '魔法攻擊力%', probability: 3.57, values: { '161-170': '7', '171-180': '7', '181-190': '7', '191-200': '7' } },
    { name: '爆擊機率%', probability: 3.57, values: { '161-170': '8', '171-180': '8', '181-190': '8', '191-200': '8' } },
    { name: 'STR%', probability: 3.57, values: { '161-170': '9', '171-180': '9', '181-190': '9', '191-200': '9' } },
    { name: '最大HP%', probability: 3.57, values: { '161-170': '6', '171-180': '6', '181-190': '6', '191-200': '6' } },
    { name: 'INT%', probability: 3.57, values: { '161-170': '9', '171-180': '9', '181-190': '9', '191-200': '9' } },
    { name: '最大MP%', probability: 3.57, values: { '161-170': '6', '171-180': '6', '181-190': '6', '191-200': '6' } },
    { name: 'STR%', probability: 3.57, values: { '161-170': '10', '171-180': '10', '181-190': '10', '191-200': '10' } },
    { name: 'DEX%', probability: 3.57, values: { '161-170': '10', '171-180': '10', '181-190': '10', '191-200': '10' } },
    { name: 'INT%', probability: 3.57, values: { '161-170': '10', '171-180': '10', '181-190': '10', '191-200': '10' } },
    { name: 'LUK%', probability: 3.57, values: { '161-170': '10', '171-180': '10', '181-190': '10', '191-200': '10' } },
    { name: 'STR%', probability: 3.57, values: { '161-170': '7', '171-180': '7', '181-190': '7', '191-200': '7' } },
    { name: 'DEX%', probability: 3.57, values: { '161-170': '7', '171-180': '7', '181-190': '7', '191-200': '7' } },
    { name: 'INT%', probability: 3.57, values: { '161-170': '7', '171-180': '7', '181-190': '7', '191-200': '7' } },
    { name: 'LUK%', probability: 3.57, values: { '161-170': '7', '171-180': '7', '181-190': '7', '191-200': '7' } },
];

const GROUP_B_POTENTIALS: SoulOrbPotential[] = [
    { name: 'STR%', probability: 5.88, values: { '161-170': '4', '171-180': '4', '181-190': '4', '191-200': '4' } },
    { name: 'DEX%', probability: 5.88, values: { '161-170': '4', '171-180': '4', '181-190': '4', '191-200': '4' } },
    { name: 'INT%', probability: 5.88, values: { '161-170': '4', '171-180': '4', '181-190': '4', '191-200': '4' } },
    { name: 'LUK%', probability: 5.88, values: { '161-170': '4', '171-180': '4', '181-190': '4', '191-200': '4' } },
    { name: '最大HP%', probability: 5.88, values: { '161-170': '7', '171-180': '7', '181-190': '7', '191-200': '7' } },
    { name: '最大MP%', probability: 5.88, values: { '161-170': '7', '171-180': '7', '181-190': '7', '191-200': '7' } },
    { name: '防禦力%', probability: 5.88, values: { '161-170': '6', '171-180': '6', '181-190': '6', '191-200': '6' } },
    { name: '防禦力%', probability: 5.88, values: { '161-170': '6', '171-180': '6', '181-190': '6', '191-200': '6' } },
    { name: '攻擊時有一定機率恢復HP', probability: 5.88, values: { '161-170': '54', '171-180': '54', '181-190': '54', '191-200': '54' } },
    { name: '攻擊時有一定機率恢復MP', probability: 5.88, values: { '161-170': '54', '171-180': '54', '181-190': '54', '191-200': '54' } },
    { name: '被擊中時有一定機率無視傷害', probability: 5.88, values: { '161-170': '53', '171-180': '53', '181-190': '53', '191-200': '53' } },
    { name: '被擊中後無敵時間增加', probability: 5.88, values: { '161-170': '1', '171-180': '1', '181-190': '1', '191-200': '1' } },
    { name: '被擊中後無敵時間增加', probability: 5.88, values: { '161-170': '1', '171-180': '1', '181-190': '1', '191-200': '1' } },
    { name: 'STR', probability: 5.88, values: { '161-170': '13', '171-180': '13', '181-190': '13', '191-200': '13' } },
    { name: 'DEX', probability: 5.88, values: { '161-170': '13', '171-180': '13', '181-190': '13', '191-200': '13' } },
    { name: 'INT', probability: 5.88, values: { '161-170': '13', '171-180': '13', '181-190': '13', '191-200': '13' } },
    { name: 'LUK', probability: 5.88, values: { '161-170': '13', '171-180': '13', '181-190': '13', '191-200': '13' } },
];

export const SOUL_ORBS: SoulOrb[] = [
    { name: '武公的靈魂寶珠', potentials: GROUP_A_POTENTIALS },
    { name: '粉豆的靈魂寶珠', potentials: GROUP_A_POTENTIALS },
    { name: '凡雷恩的靈魂寶珠', potentials: GROUP_A_POTENTIALS },
    { name: '搖滾精神的靈魂寶珠', potentials: GROUP_A_POTENTIALS },
    { name: '巴洛古的靈魂寶珠', potentials: GROUP_A_POTENTIALS },
    { name: '西格諾斯的靈魂寶珠', potentials: GROUP_A_POTENTIALS },
    { name: '艾畢奈亞的靈魂寶珠', potentials: GROUP_A_POTENTIALS },
    { name: '阿卡伊農的靈魂寶珠', potentials: GROUP_A_POTENTIALS },
    { name: '梅格耐斯的靈魂寶珠', potentials: GROUP_A_POTENTIALS },
    { name: '嘟嘟的靈魂寶珠', potentials: GROUP_A_POTENTIALS },
    { name: '涅涅的靈魂寶珠', potentials: GROUP_A_POTENTIALS },

    { name: '闇黑龍王的靈魂寶珠', potentials: GROUP_B_POTENTIALS },
    { name: '雷克斯的靈魂寶珠', potentials: GROUP_B_POTENTIALS },
    { name: '龍騎士的靈魂寶珠', potentials: GROUP_B_POTENTIALS },
    { name: '殘暴炎魔的靈魂寶珠', potentials: GROUP_B_POTENTIALS },
    { name: '亞尼的靈魂寶珠', potentials: GROUP_B_POTENTIALS },
    { name: '薛西斯的靈魂寶珠', potentials: GROUP_B_POTENTIALS },

    {
        name: '烏勒斯的靈魂寶珠', potentials: [
            { name: '攻擊BOSS怪物攻擊時傷害增加%', probability: 100, values: { '161-170': '30', '171-180': '30', '181-190': '30', '191-200': '30' } }
        ]
    },
    {
        name: '露希妲靈魂寶珠', potentials: [
            { name: '無視怪物防禦力%', probability: 100, values: { '161-170': '30', '171-180': '30', '181-190': '30', '191-200': '30' } }
        ]
    },
];
