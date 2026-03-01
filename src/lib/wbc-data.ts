export interface Player {
    id: string;
    name: string;
    number: string;
    position: 'Pitcher' | 'Catcher' | 'Infielder' | 'Outfielder';
    image: string;
}

export interface GameRotation {
    game: string;
    opponent: string;
    opponentFlag: string;
    date: string;
    time: string;
    pitchers: {
        id: string; // Used for back number if number property is not present
        name: string;
        position: string;
        image: string;
    }[];
}

export interface TeamData {
    id: string;
    name: string;
    nameZh: string;
    flag: string;
    flagImage?: string;
    pool: 'A' | 'B' | 'C' | 'D';
    achievementZh?: string;
    achievementEn?: string;
    achievementJa?: string;
    analysisZh?: string;
    analysisEn?: string;
    analysisJa?: string;
    coaches?: { name: string; role: string }[];
    fullRoster?: {
        pitchers: Player[];
        catchers: Player[];
        fielders: Player[];
    };
    rotation: GameRotation[];
}

export const WBC_TEAMS: TeamData[] = [
    {
        id: 'taiwan',
        name: 'Taiwan',
        nameZh: '台灣',
        flag: '🇹🇼',
        pool: 'C',
        coaches: [
            { name: '曾豪駒', role: 'Manager #99' },
            { name: '高志綱', role: 'Bench Coach #34' },
            { name: '王建民', role: 'Pitching Coach #40' },
            { name: '林岳平', role: 'Pitching Coach #70' },
            { name: '彭政閔', role: 'Hitting Coach #23' },
            { name: '高國輝', role: 'Hitting Coach #28' },
            { name: '陳江和', role: 'Coach #12' },
            { name: '張建銘', role: 'Coach #15' },
        ],
        fullRoster: {
            pitchers: [
                { id: '徐若熙', name: '徐若熙', number: '00', position: 'Pitcher', image: '/images/wbc_player/taiwan/tw_00.png' },
                { id: '林凱威', name: '林凱威', number: '0', position: 'Pitcher', image: '' },
                { id: '古林睿煬', name: '古林睿煬', number: '11', position: 'Pitcher', image: '/images/wbc_player/taiwan/tw_11.png' },
                { id: '林詩翔', name: '林詩翔', number: '12', position: 'Pitcher', image: '' },
                { id: '張奕', name: '張奕', number: '19', position: 'Pitcher', image: '' },
                { id: '陳冠宇', name: '陳冠宇', number: '20', position: 'Pitcher', image: '' },
                { id: '張峻瑋', name: '張峻瑋', number: '37', position: 'Pitcher', image: '' },
                { id: '林維恩', name: '林維恩', number: '42', position: 'Pitcher', image: '/images/wbc_player/taiwan/tw_42.png' },
                { id: '陳柏毓', name: '陳柏毓', number: '44', position: 'Pitcher', image: '/images/wbc_player/taiwan/tw_44.png' },
                { id: '林昱珉', name: '林昱珉', number: '45', position: 'Pitcher', image: '/images/wbc_player/taiwan/tw_45.png' },
                { id: '鄭浩均', name: '鄭浩均', number: '47', position: 'Pitcher', image: '' },
                { id: '莊陳仲敖', name: '莊陳仲敖', number: '48', position: 'Pitcher', image: '/images/wbc_player/taiwan/tw_48.png' },
                { id: '胡智爲', name: '胡智爲', number: '58', position: 'Pitcher', image: '' },
                { id: '曾峻岳', name: '曾峻岳', number: '60', position: 'Pitcher', image: '' },
                { id: '沙子宸', name: '沙子宸', number: '92', position: 'Pitcher', image: '/images/wbc_player/taiwan/tw_92.png' },
                { id: '孫易磊', name: '孫易磊', number: '96', position: 'Pitcher', image: '/images/wbc_player/taiwan/tw_96.png' },
            ],
            catchers: [
                { id: '林家正', name: '林家正', number: '27', position: 'Catcher', image: '' },
                { id: '吉力吉撈·鞏冠', name: '吉力吉撈·鞏冠', number: '4', position: 'Catcher', image: '' },
                { id: '蔣少宏', name: '蔣少宏', number: '63', position: 'Catcher', image: '' },
            ],
            fielders: [
                { id: '張育成', name: '張育成', number: '18', position: 'Infielder', image: '' },
                { id: '鄭宗哲', name: '鄭宗哲', number: '1', position: 'Infielder', image: '' },
                { id: '李灝宇', name: '李灝宇', number: '55', position: 'Infielder', image: '' },
                { id: '江坤宇', name: '江坤宇', number: '90', position: 'Infielder', image: '' },
                { id: '林子偉', name: '林子偉', number: '15', position: 'Infielder', image: '' },
                { id: '吳念庭', name: '吳念庭', number: '39', position: 'Infielder', image: '' },
                { id: '陳傑憲', name: '陳傑憲', number: '24', position: 'Outfielder', image: '' },
                { id: 'Stuart Fairchild', name: 'Stuart Fairchild', number: '17', position: 'Outfielder', image: '' },
                { id: '林安可', name: '林安可', number: '77', position: 'Outfielder', image: '' },
                { id: '陳晨威', name: '陳晨威', number: '98', position: 'Outfielder', image: '' },
                { id: '宋晟睿', name: '宋晟睿', number: '88', position: 'Outfielder', image: '' },
            ]
        },
        achievementZh: '2024 P12 冠軍',
        achievementEn: '2024 Premier12 Champion',
        achievementJa: '2024 P12 優勝',
        analysisZh: '根據最新 2024 世界 12 強奪冠核心陣容，台灣隊展現了世界級的韌性與防守。2026 WBC 將迎來張育成、鄭宗哲、李灝宇等海歸即戰力，配合林昱珉、古林睿煬、徐若熙「三大王牌」，目標前進世界 4 強。',
        analysisEn: 'Based on the core winning squad of 2024 Premier12, Team Taiwan shows world-class resilience and defense. With the return of overseas stars Yu Chang, Tsung-Che Cheng, and Hao-Yu Lee, along with "The Big Three" pitchers, the target is the World Top 4.',
        analysisJa: '2024 WBSC プレミア12の優勝メンバーを中心に、台湾代表は世界レベルの粘り強さと守備力を示しています。2026 WBCでは、張育成、鄭宗哲、李灝宇などの海外組に加え、林昱珉、古林睿煬、徐若熙の「三代エース」を擁し、世界ベスト4進出を目指します。',
        rotation: [
            {
                game: 'G1',
                opponent: 'Australia',
                opponentFlag: '🇦🇺',
                date: '2026-03-05',
                time: '12:00',
                pitchers: [
                    { id: '45', name: '林昱珉', position: 'SP', image: '/images/wbc_player/taiwan/tw_45.png' },
                    { id: '44', name: '陳柏毓', position: 'RP', image: '/images/wbc_player/taiwan/tw_44.png' }
                ]
            },
            {
                game: 'G2',
                opponent: 'Japan',
                opponentFlag: '🇯🇵',
                date: '2026-03-06',
                time: '19:00',
                pitchers: [
                    { id: '11', name: '古林睿煬', position: 'SP', image: '/images/wbc_player/taiwan/tw_11.png' },
                    { id: '96', name: '孫易磊', position: 'RP', image: '/images/wbc_player/taiwan/tw_96.png' }
                ]
            },
            {
                game: 'G3',
                opponent: 'Czech Republic',
                opponentFlag: '🇨🇿',
                date: '2026-03-07',
                time: '12:00',
                pitchers: [
                    { id: '00', name: '徐若熙', position: 'SP', image: '/images/wbc_player/taiwan/tw_00.png' },
                    { id: '48', name: '莊陳仲敖', position: 'RP', image: '/images/wbc_player/taiwan/tw_48.png' }
                ]
            },
            {
                game: 'G4',
                opponent: 'South Korea',
                opponentFlag: '🇰🇷',
                date: '2026-03-08',
                time: '12:00',
                pitchers: [
                    { id: '37', name: '張峻瑋', position: 'SP', image: '' },
                    { id: '60', name: '曾峻岳', position: 'RP', image: '' }
                ]
            }
        ]
    },
    {
        id: 'japan',
        name: 'Japan',
        nameZh: '日本',
        flag: '🇯🇵',
        pool: 'C',
        achievementZh: '2023 WBC 冠軍',
        achievementEn: '2023 WBC Champion',
        achievementJa: '2023 WBC 優勝',
        analysisZh: '日本隊作為衛冕軍，2026 將集結史上最強的 MLB 陣容。雖然 2024 12 強屈居亞軍，但這次大谷翔平、山本由伸、鈴木誠也等大聯盟球星全數回歸，搭配已挑戰 MLB 的村上宗隆、岡本和真，目標是毫無懸念的二連霸。',
        analysisEn: 'As defending champions, Japan will assemble their strongest MLB roster in 2026. Despite being runners-up in 2024 P12, the return of superstars like Shohei Ohtani and Yoshinobu Yamamoto, plus new MLB challengers Murakami and Okamoto, makes them the absolute favorites for a back-to-back title.',
        analysisJa: 'ディフェンディングチャンピオンとして、日本代表は2026年に史上最強のMLBメンバーを集結させます。大谷翔平、山本由伸、鈴木誠也らメジャー組に加え、MLB挑戦を表明している村上宗隆、岡本和真らが参戦。2024年プレミア12では準優勝に終わりましたが、今回は盤石の体制で連覇を狙います。',
        coaches: [
            { name: '井端弘和', role: 'Manager #89' },
            { name: '金子誠', role: 'Bench Coach #88' },
            { name: '村田善則', role: 'Battery Coach #74' },
            { name: '能見篤史', role: 'Pitching Coach #84' },
            { name: '吉見一起', role: 'Pitching Coach #81' },
            { name: '梵英心', role: 'Infielder Coach #77' },
            { name: '龜井善行', role: 'Outfielder Coach #79' },
            { name: '松田宣浩', role: 'General Coach #71' },
        ],
        fullRoster: {
            pitchers: [
                { id: 'Ohtani_Shohei', name: '大谷翔平', number: '16', position: 'Pitcher', image: '/images/wbc_player/japan/jp_16.png' },
                { id: 'Kikuchi_Yusei', name: '菊池雄星', number: '17', position: 'Pitcher', image: '' },
                { id: 'Yamamoto_Yoshinobu', name: '山本由伸', number: '18', position: 'Pitcher', image: '/images/wbc_player/japan/jp_18.png' },
                { id: 'Sugano_Tomoyuki', name: '菅野智之', number: '19', position: 'Pitcher', image: '' },
                { id: 'Miyagi_Hiroya', name: '宮城大彌', number: '13', position: 'Pitcher', image: '' },
                { id: 'Takahashi_Hiroto', name: '高橋宏斗', number: '28', position: 'Pitcher', image: '' },
                { id: 'Taisei', name: '大勢', number: '15', position: 'Pitcher', image: '' },
                { id: 'Ito_Hiromi', name: '伊藤大海', number: '14', position: 'Pitcher', image: '' },
                { id: 'Sumida_Chihiro', name: '隅田知一郎', number: '22', position: 'Pitcher', image: '' },
                { id: 'Kanamaru_Yumeto', name: '金丸夢斗', number: '24', position: 'Pitcher', image: '' },
                { id: 'Taneichi_Atsuki', name: '種市篤暉', number: '26', position: 'Pitcher', image: '' },
                { id: 'Fujihira_Shoma', name: '藤平尚真', number: '46', position: 'Pitcher', image: '' },
                { id: 'Soya_Ryuhei', name: '曾谷龍平', number: '47', position: 'Pitcher', image: '' },
                { id: 'Kitayama_Koki', name: '北山亘基', number: '57', position: 'Pitcher', image: '' },
                { id: 'Matsumoto_Yuki', name: '松本裕樹', number: '66', position: 'Pitcher', image: '' },
            ],
            catchers: [
                { id: 'Wakatsuki_Kenya', name: '若月健矢', number: '4', position: 'Catcher', image: '' },
                { id: 'Sakamoto_Seishiro', name: '坂本誠志郎', number: '12', position: 'Catcher', image: '' },
                { id: 'Nakamura_Yuhei', name: '中村悠平', number: '27', position: 'Catcher', image: '' },
            ],
            fielders: [
                { id: 'Maki_Shugo', name: '牧秀悟', number: '2', position: 'Infielder', image: '' },
                { id: 'Kozono_Kaito', name: '小園海斗', number: '3', position: 'Infielder', image: '' },
                { id: 'Makihara_Taisei', name: '牧原大成', number: '5', position: 'Infielder', image: '' },
                { id: 'Genda_Sosuke', name: '源田壯亮', number: '6', position: 'Infielder', image: '' },
                { id: 'Sato_Teruaki', name: '佐藤輝明', number: '7', position: 'Infielder', image: '' },
                { id: 'Okamoto_Kazuma', name: '岡本和真', number: '25', position: 'Infielder', image: '' },
                { id: 'Murakami_Munetaka', name: '村上宗隆', number: '55', position: 'Infielder', image: '/images/wbc_player/japan/jp_55.png' },
                { id: 'Kondo_Kensuke', name: '近藤健介', number: '8', position: 'Outfielder', image: '' },
                { id: 'Shuto_Ukyo', name: '周東佑京', number: '20', position: 'Outfielder', image: '' },
                { id: 'Morishita_Shota', name: '森下翔太', number: '23', position: 'Outfielder', image: '' },
                { id: 'Suzuki_Seiya', name: '鈴木誠也', number: '51', position: 'Outfielder', image: '/images/wbc_player/japan/jp_51.png' },
                { id: 'Yoshida_Masataka', name: '吉田正尚', number: '34', position: 'Outfielder', image: '' },
            ]
        },
        rotation: [
            {
                game: 'G1',
                opponent: 'Chinese Taipei',
                opponentFlag: '🇹🇼',
                date: '2026-03-06',
                time: '19:00',
                pitchers: [
                    { id: '18', name: '山本由伸', position: 'SP', image: '/images/wbc_player/japan/jp_18.png' },
                    { id: '15', name: '大勢', position: 'CL', image: '' }
                ]
            },
            {
                game: 'G2',
                opponent: 'South Korea',
                opponentFlag: '🇰🇷',
                date: '2026-03-07',
                time: '19:00',
                pitchers: [
                    { id: '28', name: '高橋宏斗', position: 'SP', image: '' },
                    { id: '14', name: '伊藤大海', position: 'RP', image: '' }
                ]
            },
            {
                game: 'G3',
                opponent: 'Australia',
                opponentFlag: '🇦🇺',
                date: '2026-03-08',
                time: '19:00',
                pitchers: [
                    { id: '17', name: '菊池雄星', position: 'SP', image: '' },
                    { id: '19', name: '菅野智之', position: 'RP', image: '' }
                ]
            },
            {
                game: 'G4',
                opponent: 'Czech Republic',
                opponentFlag: '🇨🇿',
                date: '2026-03-10',
                time: '19:00',
                pitchers: [
                    { id: '13', name: '宮城大彌', position: 'SP', image: '' },
                    { id: '46', name: '藤平尚真', position: 'RP', image: '' }
                ]
            }
        ]
    },
    {
        id: 'south-korea',
        name: 'South Korea',
        nameZh: '韓國',
        flag: '🇰🇷',
        pool: 'C',
        coaches: [
            { name: '柳仲逸', role: 'Manager' },
            { name: '崔一彥', role: 'Pitching Coach' },
            { name: '柳志炫', role: 'Coach' },
            { name: '金在杰', role: 'Coach' },
            { name: '李晉暎', role: 'Coach' },
        ],
        fullRoster: {
            pitchers: [
                { id: 'Moon_Dong-ju', name: '文棟柱', number: '1', position: 'Pitcher', image: '' },
                { id: 'Gwak_Bin', name: '郭斌', number: '61', position: 'Pitcher', image: '' },
                { id: 'Won_Tae-in', name: '元太仁', number: '46', position: 'Pitcher', image: '' },
                { id: 'Park_Se-woong', name: '朴世雄', number: '21', position: 'Pitcher', image: '' },
                { id: 'Ryu_Hyun-jin', name: '柳賢振', number: '99', position: 'Pitcher', image: '/images/wbc_player/south-korea/kr_99.png' },
                { id: 'Park_Young-hyun', name: '朴英賢', number: '1', position: 'Pitcher', image: '' },
                { id: 'Jo_Byeong-hyun', name: '趙丙炫', number: '19', position: 'Pitcher', image: '' },
                { id: 'Dane_Dunning', name: 'Dane Dunning', number: '33', position: 'Pitcher', image: '' },
                { id: 'Riley_OBrien', name: 'Riley O’Brien', number: '29', position: 'Pitcher', image: '' },
                { id: 'Go_Woo-suk', name: '高佑錫', number: '19', position: 'Pitcher', image: '/images/wbc_player/south-korea/kr_19.png' },
                { id: 'Jeong_Woo-joo', name: '丁宇宙', number: '15', position: 'Pitcher', image: '' },
                { id: 'Kim_Seo-hyeon', name: '金書賢', number: '11', position: 'Pitcher', image: '' },
                { id: 'So_Hyeong-jun', name: '蘇珩準', number: '10', position: 'Pitcher', image: '' },
                { id: 'Pyo_Se-ung', name: '表世雄', number: '18', position: 'Pitcher', image: '' },
            ],
            catchers: [
                { id: 'Kim_Hyung-jun', name: '金亨俊', number: '25', position: 'Catcher', image: '/images/wbc_player/south-korea/kr_25.png' },
                { id: 'Park_Dong-won', name: '朴東原', number: '10', position: 'Catcher', image: '' },
                { id: 'Kang_Min-ho', name: '姜珉鎬', number: '47', position: 'Catcher', image: '' },
            ],
            fielders: [
                { id: 'Lee_Jung-hoo', name: '李政厚', number: '51', position: 'Outfielder', image: '/images/wbc_player/south-korea/kr_51.png' },
                { id: 'Kim_Do-young', name: '金倒永', number: '5', position: 'Infielder', image: '/images/wbc_player/south-korea/kr_5.png' },
                { id: 'Kim_Ha-seong', name: '金河成', number: '7', position: 'Infielder', image: '' },
                { id: 'Ahn_Hyun-min', name: '安賢敏', number: '34', position: 'Outfielder', image: '' },
                { id: 'Kim_Hye-seong', name: '金慧成', number: '1', position: 'Infielder', image: '' },
                { id: 'Moon_Hyun-bin', name: '文賢彬', number: '64', position: 'Infielder', image: '' },
                { id: 'Hong_Chang-ki', name: '洪昌基', number: '1', position: 'Outfielder', image: '' },
                { id: 'Kang_Baek-ho', name: '姜白虎', number: '10', position: 'Infielder', image: '' },
                { id: 'Noh_Si-hwan', name: '盧施煥', number: '8', position: 'Infielder', image: '' },
                { id: 'Yoon_Dong-hee', name: '尹棟熙', number: '91', position: 'Outfielder', image: '' },
                { id: 'Park_Chan-ho', name: '朴燦浩', number: '27', position: 'Infielder', image: '' },
                { id: 'Shay_Whitcomb', name: 'Shay Whitcomb', number: '4', position: 'Infielder', image: '' },
                { id: 'Na_Sung-bum', name: '羅成範', number: '47', position: 'Outfielder', image: '' },
            ]
        },
        achievementZh: '奧運金牌',
        achievementEn: 'Olympic Gold Medalist',
        achievementJa: '五輪金メダリスト',
        analysisZh: '韓國隊正值世代交替，2026 將由 KBO MVP 金倒永領銜，加上李政厚、金河成等 MLB 核心。目標是走出連續三屆 WBC 預賽止步的陰霾，重返亞洲強權地位。',
        analysisEn: 'South Korea is in a generational shift. Led by KBO MVP Kim Do-young and MLB stars Jung-hoo Lee and Ha-seong Kim, the goal for 2026 is to break the curse of three straight first-round exits and reclaim Asian dominance.',
        analysisJa: '韓国代表は世代交代の時期にあります。KBO MVPの金倒永を中心に、李政厚、金河成といったMLBスターを擁します。2026年の目標は、WBCで3大会連続予選敗退という屈辱を晴らし、アジアの強豪としての地位を取り戻すことです。',
        rotation: [
            {
                game: 'G1',
                opponent: 'Czech Republic',
                opponentFlag: '🇨🇿',
                date: '2026-03-05',
                time: '19:00',
                pitchers: [
                    { id: '1', name: '文棟柱', position: 'SP', image: '' },
                    { id: '19', name: '高佑錫', position: 'CL', image: '/images/wbc_player/south-korea/kr_19.png' }
                ]
            },
            {
                game: 'G2',
                opponent: 'Japan',
                opponentFlag: '🇯🇵',
                date: '2026-03-07',
                time: '19:00',
                pitchers: [
                    { id: '33', name: 'Dane Dunning', position: 'SP', image: '' },
                    { id: '99', name: '柳賢振', position: 'RP', image: '/images/wbc_player/south-korea/kr_99.png' }
                ]
            },
            {
                game: 'G3',
                opponent: 'Chinese Taipei',
                opponentFlag: '🇹🇼',
                date: '2026-03-08',
                time: '12:00',
                pitchers: [
                    { id: '46', name: '元太仁', position: 'SP', image: '' },
                    { id: '61', name: '郭斌', position: 'RP', image: '' }
                ]
            },
            {
                game: 'G4',
                opponent: 'Australia',
                opponentFlag: '🇦🇺',
                date: '2026-03-09',
                time: '19:00',
                pitchers: [
                    { id: '21', name: '朴世雄', position: 'SP', image: '' },
                    { id: '29', name: 'Riley O’Brien', position: 'RP', image: '' }
                ]
            }
        ]
    },
    {
        id: 'australia',
        name: 'Australia',
        nameZh: '澳洲',
        flag: '🇦🇺',
        pool: 'C',
        coaches: [
            { name: 'Dave Nilsson', role: 'Manager' },
            { name: 'Graeme Lloyd', role: 'Pitching Coach' },
            { name: 'Shayne Bennett', role: 'Coach' },
        ],
        fullRoster: {
            pitchers: [
                { id: 'Liam_Hendriks', name: 'Liam Hendriks', number: '31', position: 'Pitcher', image: '' },
                { id: 'Warwick_Saupold', name: 'Warwick Saupold', number: '30', position: 'Pitcher', image: '' },
                { id: 'Jack_OLoughlin', name: 'Jack O’Loughlin', number: '37', position: 'Pitcher', image: '' },
                { id: 'Jon_Kennedy', name: 'Jon Kennedy', number: '44', position: 'Pitcher', image: '' },
                { id: 'Mitch_Neunborn', name: 'Mitch Neunborn', number: '20', position: 'Pitcher', image: '' },
                { id: 'Todd_Van_Steensel', name: 'Todd Van Steensel', number: '21', position: 'Pitcher', image: '' },
                { id: 'Steven_Kent', name: 'Steven Kent', number: '25', position: 'Pitcher', image: '' },
                { id: 'Luke_Wilkins', name: 'Luke Wilkins', number: '26', position: 'Pitcher', image: '' },
                { id: 'Josh_Guyer', name: 'Josh Guyer', number: '22', position: 'Pitcher', image: '' },
                { id: 'Blake_Townsend', name: 'Blake Townsend', number: '19', position: 'Pitcher', image: '' },
                { id: 'Coen_Wynne', name: 'Coen Wynne', number: '15', position: 'Pitcher', image: '' },
                { id: 'Will_Sherriff', name: 'Will Sherriff', number: '18', position: 'Pitcher', image: '' },
                { id: 'Daniel_McGrath', name: 'Daniel McGrath', number: '11', position: 'Pitcher', image: '' },
                { id: 'Samuel_Steigert', name: 'Samuel Steigert', number: '14', position: 'Pitcher', image: '' },
            ],
            catchers: [
                { id: 'Alex_Hall', name: 'Alex Hall', number: '4', position: 'Catcher', image: '' },
                { id: 'Robbie_Perkins', name: 'Robbie Perkins', number: '9', position: 'Catcher', image: '' },
                { id: 'Jake_Bowey', name: 'Jake Bowey', number: '10', position: 'Catcher', image: '' },
            ],
            fielders: [
                { id: 'Travis_Bazzana', name: 'Travis Bazzana', number: '1', position: 'Infielder', image: '' },
                { id: 'Curtis_Mead', name: 'Curtis Mead', number: '25', position: 'Infielder', image: '' },
                { id: 'Jarryd_Dale', name: 'Jarryd Dale', number: '11', position: 'Infielder', image: '' },
                { id: 'Robbie_Glendinning', name: 'Robbie Glendinning', number: '6', position: 'Infielder', image: '' },
                { id: 'Darryl_George', name: 'Darryl George', number: '7', position: 'Infielder', image: '' },
                { id: 'Rixon_Wingrove', name: 'Rixon Wingrove', number: '19', position: 'Infielder', image: '' },
                { id: 'Tim_Kennelly', name: 'Tim Kennelly', number: '23', position: 'Outfielder', image: '' },
                { id: 'Aaron_Whitefield', name: 'Aaron Whitefield', number: '43', position: 'Outfielder', image: '' },
                { id: 'Ulrich_Bojarski', name: 'Ulrich Bojarski', number: '24', position: 'Outfielder', image: '' },
                { id: 'Andrew_Campbell', name: 'Andrew Campbell', number: '5', position: 'Outfielder', image: '' },
                { id: 'Jordan_McArdle', name: 'Jordan McArdle', number: '3', position: 'Outfielder', image: '' },
                { id: 'Logan_Wade', name: 'Logan Wade', number: '8', position: 'Infielder', image: '' },
                { id: 'Liam_Spence', name: 'Liam Spence', number: '2', position: 'Infielder', image: '' },
            ]
        },
        achievementZh: 'WBC 隊史 8 強',
        achievementEn: 'WBC Quarterfinalist',
        achievementJa: 'WBC 歴代ベスト8',
        analysisZh: '澳洲隊在 2023 創下隊史最佳成績，2026 將由選秀狀元 Travis Bazzana 領軍。身為 Pool C 的頭號攪局者，他們強力的長打火力對任何投手都是巨大威脅。',
        analysisEn: 'Australia made history in 2023. In 2026, led by #1 overall pick Travis Bazzana, they are the main spoiler of Pool C. Their heavy-hitting lineup poses a significant threat to any pitching staff.',
        analysisJa: '2023年に史上最高の成績を収めたオーストラリア代表は、2026年にドラフト1位のトラビス・バザーナを中心に臨みます。プールCの「ダークホース」として、その強力な打線はあらゆる投手にとって大きな脅威となります。',
        rotation: [
            {
                game: 'G1',
                opponent: 'Chinese Taipei',
                opponentFlag: '🇹🇼',
                date: '2026-03-05',
                time: '12:00',
                pitchers: [
                    { id: 'Jack_OLoughlin', name: 'Jack O’Loughlin', position: 'SP', image: '' },
                    { id: 'Liam_Hendriks', name: 'Liam Hendriks', position: 'RP', image: '' }
                ]
            },
            {
                game: 'G2',
                opponent: 'Czech Republic',
                opponentFlag: '🇨🇿',
                date: '2026-03-06',
                time: '12:00',
                pitchers: [
                    { id: 'Mitch_Neunborn', name: 'Mitch Neunborn', position: 'SP', image: '' },
                    { id: 'Todd_Van_Steensel', name: 'Todd Van Steensel', position: 'RP', image: '' }
                ]
            },
            {
                game: 'G3',
                opponent: 'Japan',
                opponentFlag: '🇯🇵',
                date: '2026-03-08',
                time: '19:00',
                pitchers: [
                    { id: 'Warwick_Saupold', name: 'Warwick Saupold', position: 'SP', image: '' },
                    { id: 'Jon_Kennedy', name: 'Jon Kennedy', position: 'RP', image: '' }
                ]
            },
            {
                game: 'G4',
                opponent: 'South Korea',
                opponentFlag: '🇰🇷',
                date: '2026-03-09',
                time: '19:00',
                pitchers: [
                    { id: 'Daniel_McGrath', name: 'Daniel McGrath', position: 'SP', image: '' },
                    { id: 'Blake_Townsend', name: 'Blake Townsend', position: 'RP', image: '' }
                ]
            }
        ]
    },
    {
        id: 'czech-republic',
        name: 'Czech Republic',
        nameZh: '捷克',
        flag: '🇨🇿',
        pool: 'C',
        coaches: [
            { name: 'Pavel Chadim', role: 'Manager' },
            { name: 'John Hussey', role: 'Pitching Coach' },
            { name: 'Alex Derhak', role: 'Hitting Coach' },
        ],
        fullRoster: {
            pitchers: [
                { id: 'Ondrej_Satoria', name: 'Ondrej Satoria', number: '14', position: 'Pitcher', image: '' },
                { id: 'Martin_Schneider', name: 'Martin Schneider', number: '13', position: 'Pitcher', image: '' },
                { id: 'Marek_Minarik', name: 'Marek Minarik', number: '23', position: 'Pitcher', image: '' },
                { id: 'Daniel_Padysak', name: 'Daniel Padysak', number: '15', position: 'Pitcher', image: '' },
                { id: 'Jeff_Barto', name: 'Jeff Barto', number: '7', position: 'Pitcher', image: '' },
                { id: 'Filip_Capka', name: 'Filip Capka', number: '1', position: 'Pitcher', image: '' },
                { id: 'Tomas_Duffek', name: 'Tomas Duffek', number: '34', position: 'Pitcher', image: '' },
                { id: 'Lukas_Ercoli', name: 'Lukas Ercoli', number: '60', position: 'Pitcher', image: '' },
                { id: 'Lukas_Hlouch', name: 'Lukas Hlouch', number: '42', position: 'Pitcher', image: '' },
                { id: 'Michal_Kovala', name: 'Michal Kovala', number: '97', position: 'Pitcher', image: '' },
                { id: 'Jan_Novak', name: 'Jan Novak', number: '30', position: 'Pitcher', image: '' },
                { id: 'Tomas_Ondra', name: 'Tomas Ondra', number: '18', position: 'Pitcher', image: '' },
                { id: 'Filip_Kollmann', name: 'Filip Kollmann', number: '11', position: 'Pitcher', image: '' },
                { id: 'Ondrej_Vank', name: 'Ondrej Vank', number: '19', position: 'Pitcher', image: '' },
            ],
            catchers: [
                { id: 'Martin_Cervenka', name: 'Martin Cervenka', number: '27', position: 'Catcher', image: '' },
                { id: 'Matous_Bubenik', name: 'Matous Bubenik', number: '10', position: 'Catcher', image: '' },
                { id: 'Daniel_Vavrusa', name: 'Daniel Vavrusa', number: '32', position: 'Catcher', image: '' },
            ],
            fielders: [
                { id: 'Terrin_Vavra', name: 'Terrin Vavra', number: '2', position: 'Infielder', image: '' },
                { id: 'Marek_Chlup', name: 'Marek Chlup', number: '73', position: 'Outfielder', image: '' },
                { id: 'Vojtech_Mensik', name: 'Vojtech Mensik', number: '4', position: 'Infielder', image: '' },
                { id: 'Martin_Muzik', name: 'Martin Muzik', number: '49', position: 'Infielder', image: '' },
                { id: 'Jan_Pospisil', name: 'Jan Pospisil', number: '5', position: 'Infielder', image: '' },
                { id: 'Willie_Escala', name: 'Willie Escala', number: '3', position: 'Infielder', image: '' },
                { id: 'Milan_Prokop', name: 'Milan Prokop', number: '31', position: 'Infielder', image: '' },
                { id: 'Filip_Smola', name: 'Filip Smola', number: '16', position: 'Infielder', image: '' },
                { id: 'Jakub_Kubica', name: 'Jakub Kubica', number: '40', position: 'Infielder', image: '' },
                { id: 'Matej_Mensik', name: 'Matej Mensik', number: '33', position: 'Outfielder', image: '' },
                { id: 'Arnost_Dubovy', name: 'Arnost Dubovy', number: '20', position: 'Outfielder', image: '' },
                { id: 'Petr_Zyma', name: 'Petr Zyma', number: '21', position: 'Infielder', image: '' },
                { id: 'Jakub_Hajtmar', name: 'Jakub Hajtmar', number: '9', position: 'Infielder', image: '' },
            ]
        },
        achievementZh: '經典賽黑馬',
        achievementEn: 'WBC Cinderella Story',
        achievementJa: 'WBCのシンデレラストーリー',
        analysisZh: '捷克隊從 2023 的驚奇晉升為半職業化強隊，2026 擁有 NPB 背景的明星 Marek Chlup 與 MLB 體系的 Terrin Vavra 加盟。他們已證明自己屬於這個最高級別的舞台。',
        analysisEn: 'Czechia evolved from a 2023 surprise to a competitive semi-pro force. With Marek Chlup (NPB) and Terrin Vavra (MLB), they have proven they belong on this world stage.',
        analysisJa: '2023年のサプライズから、チェコは競争力のある半プロフェッショナルなチームへと進化しました。NPBでのプレー経験を持つマレク・フルプや、MLBに籍を置くテリン・バブラの加入により、世界最高峰の舞台で戦える実力を証明しています。',
        rotation: [
            {
                game: 'G1',
                opponent: 'South Korea',
                opponentFlag: '🇰🇷',
                date: '2026-03-05',
                time: '19:00',
                pitchers: [
                    { id: 'Daniel_Padysak', name: 'Daniel Padysak', position: 'SP', image: '' },
                    { id: 'Martin_Schneider', name: 'Martin Schneider', position: 'RP', image: '' }
                ]
            },
            {
                game: 'G2',
                opponent: 'Australia',
                opponentFlag: '🇦🇺',
                date: '2026-03-06',
                time: '12:00',
                pitchers: [
                    { id: 'Jan_Novak', name: 'Jan Novak', position: 'SP', image: '' },
                    { id: 'Tomas_Ondra', name: 'Tomas Ondra', position: 'RP', image: '' }
                ]
            },
            {
                game: 'G3',
                opponent: 'Chinese Taipei',
                opponentFlag: '🇹🇼',
                date: '2026-03-07',
                time: '12:00',
                pitchers: [
                    { id: '14', name: 'Ondrej Satoria', position: 'SP', image: '' },
                    { id: 'Marek_Minarik', name: 'Marek Minarik', position: 'RP', image: '' }
                ]
            },
            {
                game: 'G4',
                opponent: 'Japan',
                opponentFlag: '🇯🇵',
                date: '2026-03-10',
                time: '19:00',
                pitchers: [
                    { id: 'Filip_Capka', name: 'Filip Capka', position: 'SP', image: '' },
                    { id: 'Tomas_Duffek', name: 'Tomas Duffek', position: 'RP', image: '' }
                ]
            }
        ]
    },
    {
        id: 'usa',
        name: 'USA',
        nameZh: '美國',
        flag: '🇺🇸',
        pool: 'B',
        achievementZh: '2017 WBC 冠軍',
        achievementEn: '2017 WBC Champion',
        achievementJa: '2017 WBC 優勝',
        analysisZh: '美國隊身為東道主之一，2026 年重整旗鼓。由 Aaron Judge 領銜的打線堪稱史上最強，搭配年輕王牌 Paul Skenes，目標是在主場休士頓與邁阿密奪回失去的王座。',
        analysisEn: 'As one of the hosts, Team USA is regrouping for 2026. Led by Aaron Judge, the lineup is historically strong. Coupled with young ace Paul Skenes, their goal is to reclaim the throne in Houston and Miami.',
        analysisJa: 'ホスト国の一つとして、アメリカ代表は2026年に向けて再編。アーロン・ジャッジ率いる打線は史上最強レベル。若きエース、ポール・スキーンズを擁し、地元ヒューストンとマイアミで王座奪還を狙います。',
        coaches: [
            { name: 'Mark DeRosa', role: 'Manager' },
            { name: 'Michael Young', role: 'Bench Coach' },
            { name: 'Andy Pettitte', role: 'Pitching Coach' },
            { name: 'Sean Casey', role: 'Hitting Coach' },
            { name: 'Matt Holliday', role: 'Hitting Coach' },
            { name: 'Dino Ebel', role: '3B Coach' },
            { name: 'George Lombard', role: '1B Coach' },
            { name: 'David Ross', role: 'Bullpen Coach' },
        ],
        fullRoster: {
            pitchers: [
                { id: 'Paul_Skenes', name: 'Paul Skenes', number: '30', position: 'Pitcher', image: '/images/wbc_player/usa/us_30.png' },
                { id: 'Tarik_Skubal', name: 'Tarik Skubal', number: '29', position: 'Pitcher', image: '' },
                { id: 'Logan_Webb', name: 'Logan Webb', number: '62', position: 'Pitcher', image: '' },
                { id: 'Clayton_Kershaw', name: 'Clayton Kershaw', number: '22', position: 'Pitcher', image: '' },
                { id: 'Mason_Miller', name: 'Mason Miller', number: '68', position: 'Pitcher', image: '' },
                { id: 'David_Bednar', name: 'David Bednar', number: '51', position: 'Pitcher', image: '' },
                { id: 'Clay_Holmes', name: 'Clay Holmes', number: '35', position: 'Pitcher', image: '' },
                { id: 'Griffin_Jax', name: 'Griffin Jax', number: '39', position: 'Pitcher', image: '' },
                { id: 'Matthew_Boyd', name: 'Matthew Boyd', number: '46', position: 'Pitcher', image: '' },
                { id: 'Garrett_Cleavinger', name: 'Garrett Cleavinger', number: '55', position: 'Pitcher', image: '' },
                { id: 'Brad_Keller', name: 'Brad Keller', number: '56', position: 'Pitcher', image: '' },
                { id: 'Nolan_McLean', name: 'Nolan McLean', number: '17', position: 'Pitcher', image: '' },
                { id: 'Joe_Ryan', name: 'Joe Ryan', number: '41', position: 'Pitcher', image: '' },
                { id: 'Gabe_Speier', name: 'Gabe Speier', number: '55', position: 'Pitcher', image: '' },
                { id: 'Michael_Wacha', name: 'Michael Wacha', number: '45', position: 'Pitcher', image: '' },
                { id: 'Garrett_Whitlock', name: 'Garrett Whitlock', number: '22', position: 'Pitcher', image: '' },
            ],
            catchers: [
                { id: 'Will_Smith', name: 'Will Smith', number: '16', position: 'Catcher', image: '' },
            ],
            fielders: [
                { id: 'Aaron_Judge', name: 'Aaron Judge', number: '99', position: 'Outfielder', image: '/images/wbc_player/usa/us_99.png' },
                { id: 'Bryce_Harper', name: 'Bryce Harper', number: '3', position: 'Outfielder', image: '' },
                { id: 'Bobby_Witt_Jr', name: 'Bobby Witt Jr.', number: '7', position: 'Infielder', image: '' },
                { id: 'Gunnar_Henderson', name: 'Gunnar Henderson', number: '2', position: 'Infielder', image: '' },
                { id: 'Corbin_Carroll', name: 'Corbin Carroll', number: '7', position: 'Outfielder', image: '' },
                { id: 'Paul_Goldschmidt', name: 'Paul Goldschmidt', number: '46', position: 'Infielder', image: '' },
                { id: 'Kyle_Schwarber', name: 'Kyle Schwarber', number: '12', position: 'Outfielder', image: '' },
                { id: 'Alex_Bregman', name: 'Alex Bregman', number: '2', position: 'Infielder', image: '' },
                { id: 'Ernie_Clement', name: 'Ernie Clement', number: '28', position: 'Infielder', image: '' },
                { id: 'Brice_Turang', name: 'Brice Turang', number: '0', position: 'Infielder', image: '' },
                { id: 'Pete_Crow-Armstrong', name: 'Pete Crow-Armstrong', number: '52', position: 'Outfielder', image: '' },
                { id: 'Cal_Raleigh', name: 'Cal Raleigh', number: '29', position: 'Outfielder', image: '/images/wbc_player/usa/us_29.png' },
            ]
        },
        rotation: [
            {
                game: 'G1',
                opponent: 'Brazil',
                opponentFlag: '🇧🇷',
                date: '2026-03-06',
                time: '19:00',
                pitchers: [
                    { id: '30', name: 'Paul Skenes', position: 'SP', image: '/images/wbc_player/usa/us_30.png' }
                ]
            },
            {
                game: 'G2',
                opponent: 'Great Britain',
                opponentFlag: '🇬🇧',
                date: '2026-03-07',
                time: '19:00',
                pitchers: [
                    { id: '62', name: 'Logan Webb', position: 'SP', image: '' }
                ]
            },
            {
                game: 'G3',
                opponent: 'Mexico',
                opponentFlag: '🇲🇽',
                date: '2026-03-09',
                time: '19:00',
                pitchers: [
                    { id: '23', name: 'Zac Gallen', position: 'SP', image: '' }
                ]
            },
            {
                game: 'G4',
                opponent: 'Italy',
                opponentFlag: '🇮🇹',
                date: '2026-03-10',
                time: '20:00',
                pitchers: [
                    { id: '89', name: 'Tanner Houck', position: 'SP', image: '' }
                ]
            }
        ]
    },
    {
        id: 'mexico',
        name: 'Mexico',
        nameZh: '墨西哥',
        flag: '🇲🇽',
        pool: 'B',
        achievementZh: '2023 WBC 4 強',
        achievementEn: '2023 WBC Semifinalist',
        achievementJa: '2023 WBC ベスト4',
        analysisZh: '墨西哥隊在 2023 年創下隊史最佳成績，目前已是世界棒球強權之一。由 Randy Arozarena 領軍，內外野防守穩健，目標是再次闖入邁阿密的決賽圈。',
        analysisEn: 'Coming off their best finish in 2023, Mexico is now a recognized world power. Led by Randy Arozarena, they boast solid defense and aim to return to the final rounds in Miami.',
        analysisJa: '2023年に史上最高の成績を収めたメキシコは、今や世界の強豪国の一つです。ランディ・アロサレーナを中心に攻守のバランスが良く、再びマイアミでの決勝ラウンド進出を狙います。',
        coaches: [
            { name: 'Benjamín Gil', role: 'Manager' },
            { name: 'Vinny Castilla', role: 'Bench Coach' },
            { name: 'Elmer Dessens', role: 'Pitching Coach' },
            { name: 'Jacob Cruz', role: 'Hitting Coach' },
            { name: 'Bobby Magallanes', role: 'Hitting Coach' },
        ],
        fullRoster: {
            pitchers: [
                { id: 'Andres_Munoz', name: 'Andrés Muñoz', number: '75', position: 'Pitcher', image: '' },
                { id: 'Javier_Assad', name: 'Javier Assad', number: '38', position: 'Pitcher', image: '' },
                { id: 'Alexander_Armenta', name: 'Alexander Armenta', number: '0', position: 'Pitcher', image: '' },
                { id: 'Brennan_Bernardino', name: 'Brennan Bernardino', number: '0', position: 'Pitcher', image: '' },
                { id: 'Taj_Bradley', name: 'Taj Bradley', number: '0', position: 'Pitcher', image: '' },
                { id: 'Alex_Carrillo', name: 'Alex Carrillo', number: '0', position: 'Pitcher', image: '' },
                { id: 'Jesus_Cruz', name: 'Jesus Cruz', number: '0', position: 'Pitcher', image: '' },
                { id: 'Daniel_Duarte', name: 'Daniel Duarte', number: '0', position: 'Pitcher', image: '' },
                { id: 'Robert_Garcia', name: 'Robert Garcia', number: '0', position: 'Pitcher', image: '' },
                { id: 'Luis_Gastelum', name: 'Luis Gastelum', number: '0', position: 'Pitcher', image: '' },
                { id: 'Samy_Natera_Jr', name: 'Samy Natera Jr.', number: '0', position: 'Pitcher', image: '' },
                { id: 'Roel_Ramirez', name: 'Roel Ramírez', number: '0', position: 'Pitcher', image: '' },
                { id: 'Gerardo_Reyes', name: 'Gerardo Reyes', number: '0', position: 'Pitcher', image: '' },
            ],
            catchers: [
                { id: 'Alejandro_Kirk', name: 'Alejandro Kirk', number: '30', position: 'Catcher', image: '' },
                { id: 'Alexis_Wilson', name: 'Alexis Wilson', number: '35', position: 'Catcher', image: '' },
            ],
            fielders: [
                { id: 'Randy_Arozarena', name: 'Randy Arozarena', number: '56', position: 'Outfielder', image: '' },
                { id: 'Jarren_Duran', name: 'Jarren Duran', number: '16', position: 'Outfielder', image: '' },
                { id: 'Joey_Meneses', name: 'Joey Meneses', number: '22', position: 'Infielder', image: '' },
                { id: 'Rowdy_Tellez', name: 'Rowdy Tellez', number: '11', position: 'Infielder', image: '' },
                { id: 'Isaac_Paredes', name: 'Isaac Paredes', number: '17', position: 'Infielder', image: '' },
                { id: 'Joey_Ortiz', name: 'Joey Ortiz', number: '9', position: 'Infielder', image: '' },
                { id: 'Alek_Thomas', name: 'Alek Thomas', number: '5', position: 'Outfielder', image: '' },
                { id: 'Jonathan_Aranda', name: 'Jonathan Aranda', number: '0', position: 'Infielder', image: '' },
                { id: 'Ramon_Urias', name: 'Ramón Urías', number: '0', position: 'Infielder', image: '' },
                { id: 'Nick_Gonzales', name: 'Nick Gonzales', number: '0', position: 'Infielder', image: '' },
                { id: 'Alejandro_Osuna', name: 'Alejandro Osuna', number: '0', position: 'Outfielder', image: '' },
            ]
        },
        rotation: [
            {
                game: 'G1',
                opponent: 'Great Britain',
                opponentFlag: '🇬🇧',
                date: '2026-03-06',
                time: '12:00',
                pitchers: [{ id: 'Urquidy', name: 'Jose Urquidy', position: 'SP', image: '' }]
            },
            {
                game: 'G2',
                opponent: 'Brazil',
                opponentFlag: '🇧🇷',
                date: '2026-03-08',
                time: '19:00',
                pitchers: [{ id: 'Sandoval', name: 'Patrick Sandoval', position: 'SP', image: '' }]
            },
            {
                game: 'G3',
                opponent: 'USA',
                opponentFlag: '🇺🇸',
                date: '2026-03-09',
                time: '19:00',
                pitchers: [{ id: 'Walker', name: 'Taijuan Walker', position: 'SP', image: '' }]
            },
            {
                game: 'G4',
                opponent: 'Italy',
                opponentFlag: '🇮🇹',
                date: '2026-03-11',
                time: '18:00',
                pitchers: [{ id: 'Assad', name: 'Javier Assad', position: 'SP', image: '' }]
            }
        ]
    },
    {
        id: 'italy',
        name: 'Italy',
        nameZh: '義大利',
        flag: '🇮🇹',
        pool: 'B',
        achievementZh: 'WBC 隊史 8 強',
        achievementEn: 'WBC Quarterfinalist',
        achievementJa: 'WBC 歴代ベスト8',
        analysisZh: '義大利隊在 Mike Piazza 的帶領下，展現了極強的團隊凝聚力。這支球隊擁有多位 MLB 背景球員，目標是再次扮演黑馬，爭奪 Pool B 的出線資格。',
        analysisEn: 'Under Mike Piazza, Team Italy shows incredible cohesion. With several MLB-affiliated players, they aim to break through Pool B as a dangerous underdog once again.',
        analysisJa: 'マイク・ピアザ監督の下、イタリア代表は強力な結束力を誇ります。MLB經驗者を多数擁し、プールBで再び旋風を巻き起こしてグループ突破を狙います。',
        coaches: [
            { name: 'Francisco Cervelli', role: 'Manager' },
            { name: 'Chris Denorfia', role: 'Coach' },
            { name: 'Blake Lalli', role: 'Coach' },
        ],
        fullRoster: {
            pitchers: [
                { id: 'Aaron_Nola', name: 'Aaron Nola', number: '27', position: 'Pitcher', image: '' },
                { id: 'Michael_Lorenzen', name: 'Michael Lorenzen', number: '21', position: 'Pitcher', image: '' },
                { id: 'Adam_Ottavino', name: 'Adam Ottavino', number: '0', position: 'Pitcher', image: '' },
                { id: 'Sam_Aldegheri', name: 'Sam Aldegheri', number: '0', position: 'Pitcher', image: '' },
                { id: 'Dan_Altavilla', name: 'Dan Altavilla', number: '0', position: 'Pitcher', image: '' },
                { id: 'Dylan_DeLucia', name: 'Dylan DeLucia', number: '0', position: 'Pitcher', image: '' },
                { id: 'Alessandro_Ercolani', name: 'Alessandro Ercolani', number: '0', position: 'Pitcher', image: '' },
                { id: 'Matt_Festa', name: 'Matt Festa', number: '0', position: 'Pitcher', image: '' },
                { id: 'Gordon_Graceffo', name: 'Gordon Graceffo', number: '0', position: 'Pitcher', image: '' },
                { id: 'Alek_Jacob', name: 'Alek Jacob', number: '0', position: 'Pitcher', image: '' },
                { id: 'Joe_La_Sorsa', name: 'Joe La Sorsa', number: '0', position: 'Pitcher', image: '' },
                { id: 'Ron_Marinaccio', name: 'Ron Marinaccio', number: '0', position: 'Pitcher', image: '' },
                { id: 'Kyle_Nicolas', name: 'Kyle Nicolas', number: '0', position: 'Pitcher', image: '' },
                { id: 'Gabriele_Quattrini', name: 'Gabriele Quattrini', number: '0', position: 'Pitcher', image: '' },
                { id: 'Greg_Weissert', name: 'Greg Weissert', number: '0', position: 'Pitcher', image: '' },
            ],
            catchers: [
                { id: 'Alberto_Mineo', name: 'Alberto Mineo', number: '0', position: 'Catcher', image: '' },
                { id: 'Kyle_Teel', name: 'Kyle Teel', number: '0', position: 'Catcher', image: '' },
                { id: 'Giaconino_Lasaracina', name: 'Giaconino Lasaracina', number: '0', position: 'Catcher', image: '' },
            ],
            fielders: [
                { id: 'Vinnie_Pasquantino', name: 'Vinnie Pasquantino', number: '11', position: 'Infielder', image: '' },
                { id: 'Jac_Caglianone', name: 'Jac Caglianone', number: '0', position: 'Outfielder', image: '' },
                { id: 'Ben_DeLuzio', name: 'Ben DeLuzio', number: '21', position: 'Outfielder', image: '' },
                { id: 'Jon_Berti', name: 'Jon Berti', number: '0', position: 'Infielder', image: '' },
                { id: 'Zach_Dezenzo', name: 'Zach Dezenzo', number: '0', position: 'Infielder', image: '' },
                { id: 'Andrew_Fischer', name: 'Andrew Fischer', number: '0', position: 'Infielder', image: '' },
                { id: 'Miles_Mastrobuoni', name: 'Miles Mastrobuoni', number: '0', position: 'Infielder', image: '' },
                { id: 'Thomas_Saggese', name: 'Thomas Saggese', number: '0', position: 'Infielder', image: '' },
                { id: 'Dominic_Canzone', name: 'Dominic Canzone', number: '0', position: 'Outfielder', image: '' },
                { id: 'Jakob_Marsee', name: 'Jakob Marsee', number: '0', position: 'Outfielder', image: '' },
                { id: 'Nick_Morabito', name: 'Nick Morabito', number: '0', position: 'Outfielder', image: '' },
                { id: 'Dante_Nori', name: 'Dante Nori', number: '0', position: 'Outfielder', image: '' },
            ]
        },
        rotation: [
            {
                game: 'G1',
                opponent: 'Brazil',
                opponentFlag: '🇧🇷',
                date: '2026-03-07',
                time: '12:00',
                pitchers: [{ id: 'Harvey', name: 'Matt Harvey', position: 'SP', image: '' }]
            },
            {
                game: 'G2',
                opponent: 'Great Britain',
                opponentFlag: '🇬🇧',
                date: '2026-03-08',
                time: '12:00',
                pitchers: [{ id: 'Woods', name: 'Stephen Woods Jr.', position: 'SP', image: '' }]
            },
            {
                game: 'G3',
                opponent: 'USA',
                opponentFlag: '🇺🇸',
                date: '2026-03-10',
                time: '20:00',
                pitchers: [{ id: 'Pallante', name: 'Andre Pallante', position: 'SP', image: '' }]
            },
            {
                game: 'G4',
                opponent: 'Mexico',
                opponentFlag: '🇲🇽',
                date: '2026-03-11',
                time: '18:00',
                pitchers: [{ id: 'Lugo', name: 'Joey Marciano', position: 'RP', image: '' }]
            }
        ]
    },
    {
        id: 'great-britain',
        name: 'Great Britain',
        nameZh: '英國',
        flag: '🇬🇧',
        pool: 'B',
        achievementZh: '2023 WBC 首次勝場',
        achievementEn: 'First WBC win in 2023',
        achievementJa: '2023 WBC 初勝利',
        analysisZh: '英國隊在 2023 年證明了他們的實力，Harry Ford 的出色表現令人印象深刻。2026 年他們帶著更多信心來到休士頓，目標是拿下更多勝場並衝擊 8 強。',
        analysisEn: 'Great Britain proved they belong in 2023, with Harry Ford shining. In 2026, they come to Houston with more confidence, aiming for more wins and a surprise quarterfinal run.',
        analysisJa: '2023年にWBC初勝利を挙げたイギリスは、ハリー・フォードを中心に着実に力をつけています。2026年は自信を胸に、さらなる勝利と初のベスト8進出を目指します。',
        coaches: [
            { name: 'Bradley Marcelino', role: 'Manager' },
            { name: 'Antoan Richardson', role: 'Bench Coach' },
        ],
        fullRoster: {
            pitchers: [
                { id: 'Jack_Anderson', name: 'Jack Anderson', number: '0', position: 'Pitcher', image: '' },
                { id: 'Brendan_Beck', name: 'Brendan Beck', number: '0', position: 'Pitcher', image: '' },
                { id: 'Tristan_Beck', name: 'Tristan Beck', number: '45', position: 'Pitcher', image: '' },
                { id: 'Donovan_Benoit', name: 'Donovan Benoit', number: '0', position: 'Pitcher', image: '' },
                { id: 'Chavez_Fernander', name: 'Chavez Fernander', number: '0', position: 'Pitcher', image: '' },
                { id: 'Gary_Gill_Hill', name: 'Gary Gill Hill', number: '0', position: 'Pitcher', image: '' },
                { id: 'Antonio_Knowles', name: 'Antonio Knowles', number: '0', position: 'Pitcher', image: '' },
                { id: 'Miles_Langhorne', name: 'Miles Langhorne', number: '0', position: 'Pitcher', image: '' },
                { id: 'Ryan_Long', name: 'Ryan Long', number: '0', position: 'Pitcher', image: '' },
                { id: 'Michael_Petersen', name: 'Michael Petersen', number: '48', position: 'Pitcher', image: '' },
                { id: 'Jack_Seppings', name: 'Jack Seppings', number: '0', position: 'Pitcher', image: '' },
                { id: 'Graham_Spraker', name: 'Graham Spraker', number: '0', position: 'Pitcher', image: '' },
                { id: 'Najer_Victor', name: 'Najer Victor', number: '0', position: 'Pitcher', image: '' },
                { id: 'Tyler_Viza', name: 'Tyler Viza', number: '14', position: 'Pitcher', image: '' },
                { id: 'Nick_Wells', name: 'Nick Wells', number: '0', position: 'Pitcher', image: '' },
                { id: 'Owen_Wild', name: 'Owen Wild', number: '0', position: 'Pitcher', image: '' },
                { id: 'Vance_Worley', name: 'Vance Worley', number: '49', position: 'Pitcher', image: '' },
            ],
            catchers: [
                { id: 'Willis_Cresswell', name: 'Willis Cresswell', number: '0', position: 'Catcher', image: '' },
                { id: 'Harry_Ford', name: 'Harry Ford', number: '8', position: 'Catcher', image: '' },
            ],
            fielders: [
                { id: 'Jazz_Chisholm_Jr', name: 'Jazz Chisholm Jr.', number: '2', position: 'Infielder', image: '' },
                { id: 'Nate_Eaton', name: 'Nate Eaton', number: '18', position: 'Infielder', image: '' },
                { id: 'Lucius_Fox', name: 'Lucius Fox', number: '4', position: 'Infielder', image: '' },
                { id: 'Ivan_Johnson', name: 'Ivan Johnson', number: '0', position: 'Infielder', image: '' },
                { id: 'BJ_Murray', name: 'BJ Murray', number: '0', position: 'Infielder', image: '' },
                { id: 'Nick_Ward', name: 'Nick Ward', number: '0', position: 'Infielder', image: '' },
                { id: 'Ian_Lewis_Jr', name: 'Ian Lewis Jr.', number: '0', position: 'Infielder', image: '' },
                { id: 'Matt_Koperniak', name: 'Matt Koperniak', number: '15', position: 'Outfielder', image: '' },
                { id: 'Trayce_Thompson', name: 'Trayce Thompson', number: '43', position: 'Outfielder', image: '' },
                { id: 'Kristian_Robinson', name: 'Kristian Robinson', number: '0', position: 'Outfielder', image: '' },
                { id: 'Justin_Wylie', name: 'Justin Wylie', number: '0', position: 'Outfielder', image: '' },
            ]
        },
        rotation: [
            {
                game: 'G1',
                opponent: 'Mexico',
                opponentFlag: '🇲🇽',
                date: '2026-03-06',
                time: '12:00',
                pitchers: [{ id: 'Ford', name: 'Vance Worley', position: 'SP', image: '' }]
            },
            {
                game: 'G2',
                opponent: 'USA',
                opponentFlag: '🇺🇸',
                date: '2026-03-07',
                time: '19:00',
                pitchers: [{ id: 'Benoit', name: 'Tyler Viza', position: 'SP', image: '' }]
            },
            {
                game: 'G3',
                opponent: 'Italy',
                opponentFlag: '🇮🇹',
                date: '2026-03-08',
                time: '12:00',
                pitchers: [{ id: 'Morris', name: 'Akeel Morris', position: 'SP', image: '' }]
            },
            {
                game: 'G4',
                opponent: 'Brazil',
                opponentFlag: '🇧🇷',
                date: '2026-03-09',
                time: '12:00',
                pitchers: [{ id: 'Opponent', name: 'TBD', position: 'SP', image: '' }]
            }
        ]
    },
    {
        id: 'brazil',
        name: 'Brazil',
        nameZh: '巴西',
        flag: '🇧🇷',
        pool: 'B',
        achievementZh: '與日本苦戰不敵',
        achievementEn: 'Fought hard against Japan',
        achievementJa: '日本戦での健闘',
        analysisZh: '巴西隊重返 WBC 正賽，這是一支富有韌性的隊伍。他們擁有深厚的日本血統背景，在休士頓 Pool B 雖然被視為弱旅，但極具競爭力，不可輕視。',
        analysisEn: 'Brazil returns to the WBC main stage with high resilience. With a deep heritage of Japanese-influenced baseball, they are competitive underdogs in Pool B not to be overlooked.',
        analysisJa: 'WBC本大会への復帰を果たしたブラジルは、粘り強い戰いぶりが特徴です。日系人のバックボーンを持つ選手も多く、プールBではダークホースとして侮れない存在です。',
        coaches: [
            { name: 'Daniel Matsumoto', role: 'Manager' },
            { name: 'Tiago Magalhães', role: 'Coach' },
        ],
        fullRoster: {
            pitchers: [
                { id: 'Eric_Pardinho', name: 'Eric Pardinho', number: '16', position: 'Pitcher', image: '' },
                { id: 'Bo_Takahashi', name: 'Bo Takahashi', number: '17', position: 'Pitcher', image: '' },
                { id: 'Gabriel_Barbosa', name: 'Gabriel Barbosa', number: '48', position: 'Pitcher', image: '' },
                { id: 'Andre_Rienzo', name: 'Andre Rienzo', number: '30', position: 'Pitcher', image: '' },
                { id: 'Daniel_Missaki', name: 'Daniel Missaki', number: '19', position: 'Pitcher', image: '' },
                { id: 'Tiago_Da_Silva', name: 'Tiago Da Silva', number: '0', position: 'Pitcher', image: '' },
                { id: 'Joseph_Contreras', name: 'Joseph Contreras', number: '0', position: 'Pitcher', image: '' },
            ],
            catchers: [
                { id: 'Gabriel_Gomes', name: 'Gabriel Gomes', number: '12', position: 'Catcher', image: '' },
            ],
            fielders: [
                { id: 'Leonardo_Reginatto', name: 'Leonardo Reginatto', number: '1', position: 'Infielder', image: '' },
                { id: 'Dante_Bichette_Jr', name: 'Dante Bichette Jr.', number: '7', position: 'Infielder', image: '' },
                { id: 'Lucas_Ramirez', name: 'Lucas Ramirez', number: '24', position: 'Outfielder', image: '' },
                { id: 'Gabriel_Maciel', name: 'Gabriel Maciel', number: '10', position: 'Outfielder', image: '' },
                { id: 'Victor_Masai', name: 'Victor Masai', number: '0', position: 'Infielder', image: '' },
            ]
        },
        rotation: [
            {
                game: 'G4',
                opponent: 'Great Britain',
                opponentFlag: '🇬🇧',
                date: '2026-03-09',
                time: '12:00',
                pitchers: [{ id: 'Marques', name: 'Daniel Missaki', position: 'SP', image: '' }]
            }
        ]
    },
    {
        id: 'puerto-rico',
        name: 'Puerto Rico',
        nameZh: '波多黎各',
        flag: '🇵🇷',
        pool: 'A',
        achievementZh: 'WBC 兩屆亞軍',
        achievementEn: 'Two-time WBC Runner-up',
        achievementJa: 'WBC 二大会連続準優勝',
        analysisZh: '波多黎各身為 Pool A 東道主，擁有強大的主場優勢。由明星內野手領軍，加上深厚的投手戰力，目標是在聖胡安主場橫掃晉級。',
        analysisEn: 'As the Pool A host, Puerto Rico enjoys a massive home-field advantage. With star infielders and deep pitching, they aim to sweep through San Juan and return to the finals.',
        analysisJa: 'プールAのホスト國として、プエルトリコは強力なホームの利を持っています。スター內野手陣と厚い投手層を擁し、地元聖胡安での全勝突破を狙います。',
        coaches: [
            { name: 'Yadier Molina', role: 'Manager' },
            { name: 'Alex Cintron', role: 'Bench Coach' },
            { name: 'Ricky Bones', role: 'Pitching Coach' },
            { name: 'Victor Rodríguez', role: 'Hitting Coach' },
            { name: 'Juan Gonzalez', role: 'Asst. Hitting Coach' },
            { name: 'José Molina', role: '1B Coach' },
            { name: 'Luis Rivera', role: '3B Coach' },
            { name: 'José Rosado', role: 'Bullpen Coach' },
        ],
        fullRoster: {
            pitchers: [
                { id: 'Edwin_Diaz', name: 'Edwin Díaz', number: '39', position: 'Pitcher', image: '' },
                { id: 'Jose_Berrios', name: 'José Berríos', number: '17', position: 'Pitcher', image: '' },
                { id: 'Seth_Lugo', name: 'Seth Lugo', number: '27', position: 'Pitcher', image: '' },
                { id: 'Fernando_Cruz', name: 'Fernando Cruz', number: '63', position: 'Pitcher', image: '' },
                { id: 'Raymond_Burgos', name: 'Raymond Burgos', number: '0', position: 'Pitcher', image: '' },
                { id: 'Jose_De_Leon', name: 'José De León', number: '0', position: 'Pitcher', image: '' },
                { id: 'Jose_Espada', name: 'José Espada', number: '0', position: 'Pitcher', image: '' },
                { id: 'Rico_Garcia', name: 'Rico Garcia', number: '0', position: 'Pitcher', image: '' },
                { id: 'Jorge_Lopez', name: 'Jorge López', number: '0', position: 'Pitcher', image: '' },
                { id: 'Jovani_Moran', name: 'Jovani Morán', number: '0', position: 'Pitcher', image: '' },
                { id: 'Luis_Quinones', name: 'Luis Quiñones', number: '0', position: 'Pitcher', image: '' },
                { id: 'Angel_Reyes', name: 'Angel Reyes', number: '0', position: 'Pitcher', image: '' },
                { id: 'Eduardo_Rivera', name: 'Eduardo Rivera', number: '0', position: 'Pitcher', image: '' },
            ],
            catchers: [
                { id: 'Christian_Vazquez', name: 'Christian Vázquez', number: '7', position: 'Catcher', image: '' },
                { id: 'Martin_Maldonado', name: 'Martín Maldonado', number: '0', position: 'Catcher', image: '' },
            ],
            fielders: [
                { id: 'Nolan_Arenado', name: 'Nolan Arenado', number: '28', position: 'Infielder', image: '' },
                { id: 'Edwin_Arroyo', name: 'Edwin Arroyo', number: '0', position: 'Infielder', image: '' },
                { id: 'Darell_Hernaiz', name: 'Darell Hernaiz', number: '0', position: 'Infielder', image: '' },
                { id: 'Emmanuel_Rivera', name: 'Emmanuel Rivera', number: '0', position: 'Infielder', image: '' },
                { id: 'Luis_Vazquez', name: 'Luis Vázquez', number: '0', position: 'Infielder', image: '' },
                { id: 'Willi_Castro', name: 'Willi Castro', number: '0', position: 'Infielder', image: '' },
                { id: 'Heliot_Ramos', name: 'Heliot Ramos', number: '17', position: 'Outfielder', image: '' },
                { id: 'Eddie_Rosario', name: 'Eddie Rosario', number: '20', position: 'Outfielder', image: '' },
                { id: 'MJ_Melendez', name: 'MJ Melendez', number: '1', position: 'Outfielder', image: '' },
                { id: 'Nelson_Velazquez', name: 'Nelson Velázquez', number: '0', position: 'Outfielder', image: '' },
                { id: 'Bryan_Torres', name: 'Bryan Torres', number: '0', position: 'Outfielder', image: '' },
                { id: 'Carlos_Cortes', name: 'Carlos Cortes', number: '0', position: 'Infielder', image: '' },
            ]
        },
        rotation: [
            { game: 'G1', opponent: 'Colombia', opponentFlag: '🇨🇴', date: '2026-03-06', time: '18:00', pitchers: [] },
            { game: 'G2', opponent: 'Panama', opponentFlag: '🇵🇦', date: '2026-03-07', time: '18:00', pitchers: [] },
            { game: 'G3', opponent: 'Cuba', opponentFlag: '🇨🇺', date: '2026-03-09', time: '19:00', pitchers: [] },
            { game: 'G4', opponent: 'Canada', opponentFlag: '🇨🇦', date: '2026-03-11', time: '19:00', pitchers: [] }
        ]
    },
    {
        id: 'cuba',
        name: 'Cuba',
        nameZh: '古巴',
        flag: '🇨🇺',
        pool: 'A',
        achievementZh: 'WBC 亞軍 (2006)',
        achievementEn: 'WBC Runner-up (2006)',
        achievementJa: 'WBC 準優勝 (2006)',
        analysisZh: '古巴隊近年開始徵召大聯盟球員，戰力大幅提升。他們在 2023 年重返 4 強，2026 年將以經驗與天賦的結合，爭奪 Pool A 的出線權。',
        analysisEn: 'With the inclusion of MLB players, Cuba has re-emerged as a powerhouse. After reaching the final four in 2023, they blend veteran experience with elite talent to dominate Pool A.',
        analysisJa: 'NPBやMLB屬選手張招集により、キューバ代表の戰力は大幅に向上しました。2023年のベスト4進出に續き、豊富な經驗與才能を武器にプールA突破を狙います。',
        coaches: [
            { name: 'Armando Johnson', role: 'Manager' },
            { name: 'Germán Mesa', role: 'Bench Coach' },
        ],
        fullRoster: {
            pitchers: [
                { id: 'Raidel_Martinez', name: 'Raidel Martínez', number: '97', position: 'Pitcher', image: '' },
                { id: 'Livan_Moinelo', name: 'Liván Moinelo', number: '43', position: 'Pitcher', image: '' },
                { id: 'Yariel_Rodriguez', name: 'Yariel Rodríguez', number: '29', position: 'Pitcher', image: '' },
                { id: 'Frank_Alvarez', name: 'Frank Alvarez', number: '0', position: 'Pitcher', image: '' },
                { id: 'Emmanuel_Chapman', name: 'Emmanuel Chapman', number: '0', position: 'Pitcher', image: '' },
                { id: 'Josimar_Cousin', name: 'Josimar Cousin', number: '0', position: 'Pitcher', image: '' },
                { id: 'Armando_Duenas', name: 'Armando Dueñas', number: '0', position: 'Pitcher', image: '' },
                { id: 'Denny_Larrondo', name: 'Denny Larrondo', number: '0', position: 'Pitcher', image: '' },
                { id: 'Yoan_Lopez', name: 'Yoan López', number: '0', position: 'Pitcher', image: '' },
                { id: 'Randy_Martinez', name: 'Randy Martinez', number: '0', position: 'Pitcher', image: '' },
                { id: 'Darien_Nunez', name: 'Darien Núñez', number: '0', position: 'Pitcher', image: '' },
                { id: 'Julio_Robaina', name: 'Julio Robaina', number: '0', position: 'Pitcher', image: '' },
                { id: 'Osiel_Rodriguez', name: 'Osiel Rodriguez', number: '0', position: 'Pitcher', image: '' },
                { id: 'Luis_Romero', name: 'Luis Romero', number: '0', position: 'Pitcher', image: '' },
                { id: 'Pedro_Santos', name: 'Pedro Santos', number: '0', position: 'Pitcher', image: '' },
            ],
            catchers: [
                { id: 'Andrys_Perez', name: 'Andrys Pérez', number: '16', position: 'Catcher', image: '' },
                { id: 'Omar_Hernandez', name: 'Omar Hernandez', number: '0', position: 'Catcher', image: '' },
            ],
            fielders: [
                { id: 'Yoan_Moncada', name: 'Yoan Moncada', number: '10', position: 'Infielder', image: '' },
                { id: 'Erisbel_Arruebarrena', name: 'Erisbel Arruebarrena', number: '0', position: 'Infielder', image: '' },
                { id: 'Yiddi_Cappe', name: 'Yiddi Cappe', number: '0', position: 'Infielder', image: '' },
                { id: 'Malcom_Nunez', name: 'Malcom Nuñez', number: '0', position: 'Infielder', image: '' },
                { id: 'Cristian_Rodriguez', name: 'Cristian Rodríguez', number: '0', position: 'Infielder', image: '' },
                { id: 'Alfredo_Despaigne', name: 'Alfredo Despaigne', number: '54', position: 'Outfielder', image: '' },
                { id: 'Yoelkis_Guibert', name: 'Yoelkis Guibert', number: '0', position: 'Outfielder', image: '' },
            ]
        },
        rotation: [
            { game: 'G1', opponent: 'Panama', opponentFlag: '🇵🇦', date: '2026-03-06', time: '11:00', pitchers: [] },
            { game: 'G2', opponent: 'Colombia', opponentFlag: '🇨🇴', date: '2026-03-08', time: '12:00', pitchers: [] },
            { game: 'G3', opponent: 'Puerto Rico', opponentFlag: '🇵🇷', date: '2026-03-09', time: '19:00', pitchers: [] },
            { game: 'G4', opponent: 'Canada', opponentFlag: '🇨🇦', date: '2026-03-11', time: '15:00', pitchers: [] }
        ]
    },
    {
        id: 'canada',
        name: 'Canada',
        nameZh: '加拿大',
        flag: '🇨🇦',
        pool: 'A',
        achievementZh: '奧運銅牌',
        achievementEn: 'Olympic Bronze Medalist',
        achievementJa: '五輪銅メダリスト',
        analysisZh: '加拿大隊擁有一流的打擊火力，多位 MLB 強打者的存在讓他們的進攻極具威脅。投手群的穩定發揮將是他們能否挺進下一輪的關鍵。',
        analysisEn: 'Canada features major-league power in their lineup. While their offense is elite, the consistency of their pitching staff will determine if they can break through to the quarterfinals.',
        analysisJa: 'カナダ代表はMLBクラスの強力な打線を誇ります。攻撃力は世界屆屬ですが、投手陣の安定感が準決賽進出への大きな鍵となります。',
        coaches: [
            { name: 'Ernie Whitt', role: 'Manager' },
            { name: 'Larry Walker', role: 'Coach' },
            { name: 'Greg Hamilton', role: 'Coach' },
            { name: 'Denis Boucher', role: 'Pitching Coach' },
            { name: 'Paul Quantrill', role: 'Coach' },
        ],
        fullRoster: {
            pitchers: [
                { id: 'Michael_Soroka', name: 'Michael Soroka', number: '40', position: 'Pitcher', image: '' },
                { id: 'Jameson_Taillon', name: 'Jameson Taillon', number: '50', position: 'Pitcher', image: '' },
                { id: 'Cal_Quantrill', name: 'Cal Quantrill', number: '47', position: 'Pitcher', image: '' },
                { id: 'James_Paxton', name: 'James Paxton', number: '65', position: 'Pitcher', image: '' },
                { id: 'Logan_Allen', name: 'Logan Allen', number: '0', position: 'Pitcher', image: '' },
                { id: 'Micah_Ashman', name: 'Micah Ashman', number: '0', position: 'Pitcher', image: '' },
                { id: 'Phillippe_Aumont', name: 'Phillippe Aumont', number: '0', position: 'Pitcher', image: '' },
                { id: 'Jordan_Balazovic', name: 'Jordan Balazovic', number: '0', position: 'Pitcher', image: '' },
                { id: 'Eric_Cerantola', name: 'Eric Cerantola', number: '0', position: 'Pitcher', image: '' },
                { id: 'Indigo_Diaz', name: 'Indigo Diaz', number: '0', position: 'Pitcher', image: '' },
                { id: 'Antoine_Jean', name: 'Antoine Jean', number: '0', position: 'Pitcher', image: '' },
                { id: 'Carter_Loewen', name: 'Carter Loewen', number: '0', position: 'Pitcher', image: '' },
                { id: 'Adam_Macko', name: 'Adam Macko', number: '0', position: 'Pitcher', image: '' },
                { id: 'Noah_Skirrow', name: 'Noah Skirrow', number: '0', position: 'Pitcher', image: '' },
                { id: 'Matt_Wilkinson', name: 'Matt Wilkinson', number: '0', position: 'Pitcher', image: '' },
                { id: 'Rob_Zastryzny', name: 'Rob Zastryzny', number: '0', position: 'Pitcher', image: '' },
            ],
            catchers: [
                { id: 'Bo_Naylor', name: 'Bo Naylor', number: '23', position: 'Catcher', image: '' },
                { id: 'Liam_Hicks', name: 'Liam Hicks', number: '0', position: 'Catcher', image: '' },
            ],
            fielders: [
                { id: 'Josh_Naylor', name: 'Josh Naylor', number: '22', position: 'Infielder', image: '' },
                { id: 'Tyler_ONeill', name: 'Tyler O\'Neill', number: '29', position: 'Outfielder', image: '' },
                { id: 'Edouard_Julien', name: 'Edouard Julien', number: '47', position: 'Infielder', image: '' },
                { id: 'Owen_Caissie', name: 'Owen Caissie', number: '8', position: 'Outfielder', image: '' },
                { id: 'Tyler_Black', name: 'Tyler Black', number: '0', position: 'Infielder', image: '' },
                { id: 'Matt_Davidson', name: 'Matt Davidson', number: '0', position: 'Infielder', image: '' },
                { id: 'Adam_Hall', name: 'Adam Hall', number: '0', position: 'Infielder', image: '' },
                { id: 'Otto_Lopez', name: 'Otto Lopez', number: '0', position: 'Infielder', image: '' },
                { id: 'Abraham_Toro', name: 'Abraham Toro', number: '0', position: 'Infielder', image: '' },
                { id: 'Denzel_Clarke', name: 'Denzel Clarke', number: '0', position: 'Outfielder', image: '' },
                { id: 'Jacob_Robson', name: 'Jacob Robson', number: '0', position: 'Outfielder', image: '' },
                { id: 'Jared_Young', name: 'Jared Young', number: '0', position: 'Outfielder', image: '' },
            ]
        },
        rotation: [
            { game: 'G1', opponent: 'Colombia', opponentFlag: '🇨🇴', date: '2026-03-07', time: '11:00', pitchers: [] },
            { game: 'G2', opponent: 'Panama', opponentFlag: '🇵🇦', date: '2026-03-08', time: '19:00', pitchers: [] },
            { game: 'G3', opponent: 'Cuba', opponentFlag: '🇨🇺', date: '2026-03-11', time: '15:00', pitchers: [] },
            { game: 'G4', opponent: 'Puerto Rico', opponentFlag: '🇵🇷', date: '2026-03-11', time: '19:00', pitchers: [] }
        ]
    },
    {
        id: 'panama',
        name: 'Panama',
        nameZh: '巴拿馬',
        flag: '🇵🇦',
        pool: 'A',
        achievementZh: '經典賽勝利',
        achievementEn: 'WBC Game Winner',
        achievementJa: 'WBC 勝利達成',
        analysisZh: '巴拿馬棒球正處於上升期，在 2023 年拿下隊史首勝後信心大增。他們擅長小球戰術與快速推進，是 Pool A 不容忽視的競爭者。',
        analysisEn: 'Panamanian baseball is on the rise. After securing their first WBC win in 2023, they bring a high-energy style of play that makes them a dangerous spoiler in Pool A.',
        analysisJa: 'パナマ野球是上昇氣流に乗っています。2023年にWBC初勝利を挙げたことで自信を深めており、スピードを生かした戰術でプールAの台風の目を目指します。',
        coaches: [
            { name: 'Jose Mayorga', role: 'Manager' },
            { name: 'Julio Mosquera', role: 'Bench Coach' },
            { name: 'Einar Díaz', role: 'Hitting Coach' },
            { name: 'Carlos Lee', role: 'Hitting Coach' },
            { name: 'Julio Rangel', role: 'Pitching Coach' },
            { name: 'Raul Dominguez', role: '1B Coach' },
            { name: 'Lino Diaz', role: '3B Coach' },
            { name: 'Gilberto Mendez', role: 'Bullpen Coach' },
        ],
        fullRoster: {
            pitchers: [
                { id: 'Jaime_Barria', name: 'Jaime Barría', number: '50', position: 'Pitcher', image: '' },
                { id: 'Javy_Guerra', name: 'Javy Guerra', number: '8', position: 'Pitcher', image: '' },
                { id: 'Ariel_Jurado', name: 'Ariel Jurado', number: '57', position: 'Pitcher', image: '' },
                { id: 'Dario_Agrazal', name: 'Dario Agrazal', number: '82', position: 'Pitcher', image: '' },
                { id: 'Logan_Allen', name: 'Logan Allen', number: '26', position: 'Pitcher', image: '' },
                { id: 'Alberto_Baldonado', name: 'Alberto Baldonado', number: '25', position: 'Pitcher', image: '' },
                { id: 'Miguel_Cienfuegos', name: 'Miguel Cienfuegos', number: '0', position: 'Pitcher', image: '' },
                { id: 'Paolo_Espino', name: 'Paolo Espino', number: '21', position: 'Pitcher', image: '' },
                { id: 'Jorge_Garcia', name: 'Jorge Garcia', number: '3', position: 'Pitcher', image: '' },
                { id: 'Miguel_Gomez', name: 'Miguel Gomez', number: '15', position: 'Pitcher', image: '' },
                { id: 'James_Gonzalez', name: 'James Gonzalez', number: '4', position: 'Pitcher', image: '' },
                { id: 'Kenny_Hernandez', name: 'Kenny Hernandez', number: '24', position: 'Pitcher', image: '' },
                { id: 'Humberto_Mejia', name: 'Humberto Mejía', number: '91', position: 'Pitcher', image: '' },
                { id: 'Abdiel_Mendoza', name: 'Abdiel Mendoza', number: '0', position: 'Pitcher', image: '' },
                { id: 'Andy_Otero', name: 'Andy Otero', number: '0', position: 'Pitcher', image: '' },
                { id: 'Erian_Rodriguez', name: 'Erian Rodriguez', number: '0', position: 'Pitcher', image: '' },
            ],
            catchers: [
                { id: 'Ivan_Herrera', name: 'Iván Herrera', number: '4', position: 'Catcher', image: '' },
                { id: 'Miguel_Amaya', name: 'Miguel Amaya', number: '7', position: 'Catcher', image: '' },
                { id: 'Christian_Bethancourt', name: 'Christian Bethancourt', number: '0', position: 'Catcher', image: '' },
                { id: 'Adrian_Sugastey', name: 'Adrian Sugastey', number: '0', position: 'Catcher', image: '' },
                { id: 'Leonardo_Bernal', name: 'Leonardo Bernal', number: '0', position: 'Catcher', image: '' },
            ],
            fielders: [
                { id: 'Jose_Caballero', name: 'José Caballero', number: '6', position: 'Infielder', image: '' },
                { id: 'Edmundo_Sosa', name: 'Edmundo Sosa', number: '33', position: 'Infielder', image: '' },
                { id: 'Jonathan_Arauz', name: 'Jonathan Araúz', number: '3', position: 'Infielder', image: '' },
                { id: 'Johan_Camargo', name: 'Johan Camargo', number: '0', position: 'Infielder', image: '' },
                { id: 'Leo_Jimenez', name: 'Leo Jiménez', number: '0', position: 'Infielder', image: '' },
                { id: 'Ruben_Tejada', name: 'Rubén Tejada', number: '0', position: 'Infielder', image: '' },
                { id: 'Enrique_Bradfield_Jr', name: 'Enrique Bradfield Jr.', number: '0', position: 'Outfielder', image: '' },
                { id: 'Allen_Cordoba', name: 'Allen Córdoba', number: '0', position: 'Outfielder', image: '' },
                { id: 'Jose_Ramos', name: 'Jose Ramos', number: '0', position: 'Outfielder', image: '' },
                { id: 'Jhonny_Santos', name: 'Jhonny Santos', number: '0', position: 'Outfielder', image: '' },
            ]
        },
        rotation: [
            { game: 'G1', opponent: 'Cuba', opponentFlag: '🇨🇺', date: '2026-03-06', time: '11:00', pitchers: [] },
            { game: 'G2', opponent: 'Puerto Rico', opponentFlag: '🇵🇷', date: '2026-03-07', time: '18:00', pitchers: [] },
            { game: 'G3', opponent: 'Canada', opponentFlag: '🇨🇦', date: '2026-03-08', time: '19:00', pitchers: [] },
            { game: 'G4', opponent: 'Colombia', opponentFlag: '🇨🇴', date: '2026-03-09', time: '12:00', pitchers: [] }
        ]
    },
    {
        id: 'colombia',
        name: 'Colombia',
        nameZh: '哥倫比亞',
        flag: '🇨🇴',
        pool: 'A',
        achievementZh: '資格賽出線',
        achievementEn: 'WBC Qualifier Winner',
        achievementJa: 'WBC 予選突破',
        analysisZh: '哥倫比亞隊以其強韌的鬥志聞名，這支來自南美的勁旅在面對強隊時常有驚人表現。他們目標是發揮投打均衡的特點，爭取隊史首次晉級 8 強。',
        analysisEn: 'Colombia is known for its gritty competitive spirit. This South American team has a history of upsetting giants and seeks its first quarterfinal appearance with a balanced roster.',
        analysisJa: 'コロンビア代表はその不屈の闘志で知られています。南美の強豪として、格上の相手を苦しめる實力を持っており、投打のバランスを武器に初のベスト8を目指します。',
        coaches: [
            { name: 'Jolbert Cabrera', role: 'Manager' },
            { name: 'José Mosquera', role: 'Bench Coach' },
            { name: 'Walter Miranda', role: 'Pitching Coach' },
            { name: 'Jorge Cortés', role: 'Hitting Coach' },
        ],
        fullRoster: {
            pitchers: [
                { id: 'Jose_Quintana', name: 'Jose Quintana', number: '62', position: 'Pitcher', image: '' },
                { id: 'Julio_Teheran', name: 'Julio Teheran', number: '43', position: 'Pitcher', image: '' },
                { id: 'Nabil_Crismatt', name: 'Nabil Crismatt', number: '74', position: 'Pitcher', image: '' },
                { id: 'Adrian_Almeida', name: 'Adrian Almeida', number: '0', position: 'Pitcher', image: '' },
                { id: 'Austin_Bergner', name: 'Austin Bergner', number: '0', position: 'Pitcher', image: '' },
                { id: 'Danis_Correa', name: 'Danis Correa', number: '0', position: 'Pitcher', image: '' },
                { id: 'Pedro_Garcia', name: 'Pedro García', number: '0', position: 'Pitcher', image: '' },
                { id: 'Rio_Gomez', name: 'Rio Gomez', number: '0', position: 'Pitcher', image: '' },
                { id: 'Yapson_Gomez', name: 'Yapson Gómez', number: '0', position: 'Pitcher', image: '' },
                { id: 'David_Lorduy', name: 'David Lorduy', number: '0', position: 'Pitcher', image: '' },
                { id: 'Emerson_Martinez', name: 'Emerson Martinez', number: '0', position: 'Pitcher', image: '' },
                { id: 'Luis_Patino', name: 'Luis Patiño', number: '0', position: 'Pitcher', image: '' },
                { id: 'Jhon_Romero', name: 'Jhon Romero', number: '0', position: 'Pitcher', image: '' },
                { id: 'Reiver_Sanmartin', name: 'Reiver Sanmartín', number: '0', position: 'Pitcher', image: '' },
                { id: 'Tayron_Guerrero', name: 'Tayron Guerrero', number: '0', position: 'Pitcher', image: '' },
                { id: 'Elkin_Alcala', name: 'Elkin Alcala', number: '0', position: 'Pitcher', image: '' },
                { id: 'Guillo_Zuniga', name: 'Guillo Zuñiga', number: '0', position: 'Pitcher', image: '' },
            ],
            catchers: [
                { id: 'Elias_Diaz', name: 'Elias Díaz', number: '35', position: 'Catcher', image: '' },
                { id: 'Jorge_Alfaro', name: 'Jorge Alfaro', number: '38', position: 'Catcher', image: '' },
                { id: 'Carlos_Martinez', name: 'Carlos Martinez', number: '0', position: 'Catcher', image: '' },
            ],
            fielders: [
                { id: 'Gio_Urshela', name: 'Gio Urshela', number: '39', position: 'Infielder', image: '' },
                { id: 'Donovan_Solano', name: 'Donovan Solano', number: '7', position: 'Infielder', image: '' },
                { id: 'Harold_Ramirez', name: 'Harold Ramírez', number: '2', position: 'Outfielder', image: '' },
                { id: 'Michael_Arroyo', name: 'Michael Arroyo', number: '0', position: 'Infielder', image: '' },
                { id: 'Jordan_Diaz', name: 'Jordan Diaz', number: '0', position: 'Infielder', image: '' },
                { id: 'Dayan_Frias', name: 'Dayan Frias', number: '0', position: 'Infielder', image: '' },
                { id: 'Reynaldo_Rodriguez', name: 'Reynaldo Rodriguez', number: '0', position: 'Infielder', image: '' },
                { id: 'Brayan_Buelvas', name: 'Brayan Buelvas', number: '0', position: 'Outfielder', image: '' },
                { id: 'Gustavo_Campero', name: 'Gustavo Campero', number: '0', position: 'Outfielder', image: '' },
                { id: 'Jesus_Marriaga', name: 'Jesus Marriaga', number: '0', position: 'Outfielder', image: '' },
            ]
        },
        rotation: [
            { game: 'G1', opponent: 'Puerto Rico', opponentFlag: '🇵🇷', date: '2026-03-06', time: '18:00', pitchers: [] },
            { game: 'G2', opponent: 'Canada', opponentFlag: '🇨🇦', date: '2026-03-07', time: '11:00', pitchers: [] },
            { game: 'G3', opponent: 'Cuba', opponentFlag: '🇨🇺', date: '2026-03-08', time: '12:00', pitchers: [] },
            { game: 'G4', opponent: 'Panama', opponentFlag: '🇵🇦', date: '2026-03-09', time: '12:00', pitchers: [] }
        ]
    },
    {
        id: 'venezuela',
        name: 'Venezuela',
        nameZh: '委內瑞拉',
        flag: '🇻🇪',
        pool: 'D',
        achievementZh: 'WBC 3 強 (2009)',
        achievementEn: 'WBC 3rd Place (2009)',
        achievementJa: 'WBC 3位 (2009)',
        analysisZh: '委內瑞拉擁有一支全 MLB 級別的華麗打線。在 2023 年以分組全勝姿態出線後，他們在 2026 年的目標只有一個：問鼎世界冠軍。',
        analysisEn: 'Venezuela boasts a dynamic lineup filled with MLB superstars. After a perfect pool stage in 2023, they enter 2026 as legitimate contenders for the championship.',
        analysisJa: 'ベネズエラ代表は、MLBスターが名を連ねる豪華な打線を誇ります。2023年大會での予選全勝突破の勢いをそのままに、2026年は悲願の世界一を狙います。',
        coaches: [
            { name: 'Omar López', role: 'Manager' },
            { name: 'Robinson Chirinos', role: 'Bench Coach' },
            { name: 'Ivan Arteaga', role: 'Pitching Coach' },
            { name: 'Luis Oliveros', role: 'Bullpen Coach' },
            { name: 'Miguel Cabrera', role: 'Hitting Coach' },
            { name: 'Ramón Borrego', role: '3B Coach' },
            { name: 'Rouglas Odor', role: '1B Coach' },
        ],
        fullRoster: {
            pitchers: [
                { id: 'Ranger_Suarez', name: 'Ranger Suarez', number: '55', position: 'Pitcher', image: '' },
                { id: 'Anthony_Molina', name: 'Anthony Molina', number: '64', position: 'Pitcher', image: '' },
                { id: 'Jesus_Luzardo', name: 'Jesús Luzardo', number: '44', position: 'Pitcher', image: '' },
                { id: 'Pablo_Lopez', name: 'Pablo López', number: '49', position: 'Pitcher', image: '' },
                { id: 'Jose_Alvarado', name: 'José Alvarado', number: '46', position: 'Pitcher', image: '' },
                { id: 'Robert_Suarez', name: 'Robert Suarez', number: '75', position: 'Pitcher', image: '' },
                { id: 'Brusdar_Graterol', name: 'Brusdar Graterol', number: '48', position: 'Pitcher', image: '' },
                { id: 'Eduardo_Rodriguez', name: 'Eduardo Rodriguez', number: '57', position: 'Pitcher', image: '' },
                { id: 'Martin_Perez', name: 'Martín Pérez', number: '54', position: 'Pitcher', image: '' },
                { id: 'Adbert_Alzolay', name: 'Adbert Alzolay', number: '0', position: 'Pitcher', image: '' },
                { id: 'Carlos_Hernandez', name: 'Carlos Hernández', number: '0', position: 'Pitcher', image: '' },
                { id: 'Darwinzon_Hernandez', name: 'Darwinzon Hernández', number: '0', position: 'Pitcher', image: '' },
                { id: 'Yohander_Mendez', name: 'Yohander Méndez', number: '0', position: 'Pitcher', image: '' },
                { id: 'Nivaldo_Rodriguez', name: 'Nivaldo Rodriguez', number: '0', position: 'Pitcher', image: '' },
            ],
            catchers: [
                { id: 'Salvador_Perez', name: 'Salvador Perez', number: '13', position: 'Catcher', image: '' },
                { id: 'William_Contreras', name: 'William Contreras', number: '24', position: 'Catcher', image: '' },
            ],
            fielders: [
                { id: 'Ronald_Acuna_Jr', name: 'Ronald Acuña Jr.', number: '13', position: 'Outfielder', image: '' },
                { id: 'Luis_Arraez', name: 'Luis Arraez', number: '2', position: 'Infielder', image: '' },
                { id: 'Jackson_Chourio', name: 'Jackson Chourio', number: '11', position: 'Outfielder', image: '' },
                { id: 'Jose_Altuve', name: 'Jose Altuve', number: '27', position: 'Infielder', image: '' },
                { id: 'Andres_Gimenez', name: 'Andrés Giménez', number: '0', position: 'Infielder', image: '' },
                { id: 'Anthony_Santander', name: 'Anthony Santander', number: '25', position: 'Outfielder', image: '' },
                { id: 'Gleyber_Torres', name: 'Gleyber Torres', number: '4', position: 'Infielder', image: '' },
                { id: 'Eugenio_Suarez', name: 'Eugenio Suárez', number: '7', position: 'Infielder', image: '' },
                { id: 'Orlando_Arcia', name: 'Orlando Arcia', number: '11', position: 'Infielder', image: '' },
                { id: 'Wilyer_Abreu', name: 'Wilyer Abreu', number: '0', position: 'Outfielder', image: '' },
                { id: 'Ezequiel_Tovar', name: 'Ezequiel Tovar', number: '0', position: 'Infielder', image: '' },
            ]
        },
        rotation: [
            { game: 'G1', opponent: 'Netherlands', opponentFlag: '🇳🇱', date: '2026-03-06', time: '12:00', pitchers: [] },
            { game: 'G2', opponent: 'Israel', opponentFlag: '🇮🇱', date: '2026-03-07', time: '19:00', pitchers: [] },
            { game: 'G3', opponent: 'Nicaragua', opponentFlag: '🇳🇮', date: '2026-03-09', time: '19:00', pitchers: [] },
            { game: 'G4', opponent: 'Dominican Republic', opponentFlag: '🇩🇴', date: '2026-03-11', time: '20:00', pitchers: [] }
        ]
    },
    {
        id: 'dominican-republic',
        name: 'Dominican Republic',
        nameZh: '多明尼加',
        flag: '🇩🇴',
        pool: 'D',
        achievementZh: '2013 WBC 冠軍',
        achievementEn: '2013 WBC Champion',
        achievementJa: '2013 WBC 優勝',
        analysisZh: '多明尼加隊是棒球界的夢幻球隊，陣中大聯盟全明星球員雲集。在 2023 年遺憾止步預賽後，他們誓言要在 2026 年重新證明「棒球之國」的絕對實力。',
        analysisEn: 'The Dominican Republic is a true "Dream Team" of baseball talent. After a disappointing early exit in 2023, they are determined to reclaim their status as the world\'s best in 2026.',
        analysisJa: 'ドミニカ共和國は、MLBのオールスター選手が揃う「ドリームチーム」です。2023年の雪辱を果たすべく、2026年は「野球の國」としての誇りを懸けて世界一奪還に挑みます。',
        coaches: [
            { name: 'Rodney Linares', role: 'Manager' },
            { name: 'Tony Peña', role: 'Bench Coach' },
            { name: 'César Martin', role: 'Bullpen Coach' },
            { name: 'Julio Borbón', role: '1B Coach' },
            { name: 'Ramón Santiago', role: '3B Coach' },
        ],
        fullRoster: {
            pitchers: [
                { id: 'Sandy_Alcantara', name: 'Sandy Alcántara', number: '22', position: 'Pitcher', image: '' },
                { id: 'Camilo_Doval', name: 'Camilo Doval', number: '75', position: 'Pitcher', image: '' },
                { id: 'Luis_Severino', name: 'Luis Severino', number: '40', position: 'Pitcher', image: '' },
                { id: 'Brayan_Bello', name: 'Brayan Bello', number: '64', position: 'Pitcher', image: '' },
                { id: 'Freddy_Peralta', name: 'Freddy Peralta', number: '51', position: 'Pitcher', image: '' },
                { id: 'Bryan_Abreu', name: 'Bryan Abreu', number: '66', position: 'Pitcher', image: '' },
                { id: 'Rafael_Montero', name: 'Rafael Montero', number: '47', position: 'Pitcher', image: '' },
                { id: 'Gregory_Soto', name: 'Gregory Soto', number: '65', position: 'Pitcher', image: '' },
                { id: 'Hector_Neris', name: 'Héctor Neris', number: '50', position: 'Pitcher', image: '' },
                { id: 'Ronel_Blanco', name: 'Ronel Blanco', number: '0', position: 'Pitcher', image: '' },
                { id: 'Cristopher_Sanchez', name: 'Cristopher Sánchez', number: '0', position: 'Pitcher', image: '' },
                { id: 'Enyel_De_Los_Santos', name: 'Enyel De Los Santos', number: '0', position: 'Pitcher', image: '' },
                { id: 'Joely_Rodriguez', name: 'Joely Rodríguez', number: '0', position: 'Pitcher', image: '' },
            ],
            catchers: [
                { id: 'Austin_Wells', name: 'Austin Wells', number: '24', position: 'Catcher', image: '' },
                { id: 'Yainer_Diaz', name: 'Yainer Díaz', number: '23', position: 'Catcher', image: '' },
            ],
            fielders: [
                { id: 'Juan_Soto', name: 'Juan Soto', number: '22', position: 'Outfielder', image: '' },
                { id: 'Julio_Rodriguez', name: 'Julio Rodríguez', number: '44', position: 'Outfielder', image: '' },
                { id: 'Vladimir_Guerrero_Jr', name: 'Vladimir Guerrero Jr.', number: '27', position: 'Infielder', image: '' },
                { id: 'Manny_Machado', name: 'Manny Machado', number: '13', position: 'Infielder', image: '' },
                { id: 'Fernando_Tatis_Jr', name: 'Fernando Tatis Jr.', number: '23', position: 'Outfielder', image: '' },
                { id: 'Ketel_Marte', name: 'Ketel Marte', number: '4', position: 'Infielder', image: '' },
                { id: 'Jose_Ramirez', name: 'José Ramírez', number: '11', position: 'Infielder', image: '' },
                { id: 'Willy_Adames', name: 'Willy Adames', number: '27', position: 'Infielder', image: '' },
                { id: 'Jeremy_Pena', name: 'Jeremy Peña', number: '3', position: 'Infielder', image: '' },
                { id: 'Marcell_Ozuna', name: 'Marcell Ozuna', number: '20', position: 'Outfielder', image: '' },
                { id: 'Teoscar_Hernandez', name: 'Teoscar Hernández', number: '37', position: 'Outfielder', image: '' },
            ]
        },
        rotation: [
            { game: 'G1', opponent: 'Nicaragua', opponentFlag: '🇳🇮', date: '2026-03-06', time: '19:00', pitchers: [] },
            { game: 'G2', opponent: 'Netherlands', opponentFlag: '🇳🇱', date: '2026-03-08', time: '12:00', pitchers: [] },
            { game: 'G3', opponent: 'Israel', opponentFlag: '🇮🇱', date: '2026-03-09', time: '12:00', pitchers: [] },
            { game: 'G4', opponent: 'Venezuela', opponentFlag: '🇻🇪', date: '2026-03-11', time: '20:00', pitchers: [] }
        ]
    },
    {
        id: 'netherlands',
        name: 'Netherlands',
        nameZh: '荷蘭',
        flag: '🇳🇱',
        pool: 'D',
        achievementZh: 'WBC 兩屆 4 強',
        achievementEn: 'Two-time WBC Semifinalist',
        achievementJa: 'WBC 二大会連続ベスト4',
        analysisZh: '荷蘭隊擁有歐洲最強的棒球傳統，陣中由多位具備大聯盟經驗的庫拉索球星組成。他們以紀律嚴明與守備與見長，目標是重返世界 4 強。',
        analysisEn: 'The Netherlands represents the fusion of European discipline and Caribbean talent. As perennial contenders, their goal is to navigate a tough Pool D and return to the global semifinals.',
        analysisJa: 'オランダ代表は歐州野球の傳統與カリブ海の才能を融合させたチームです。高い守備力與戰術を武器に、強豪揃いのプールDを突破し、再び世界ベスト4進出を目指します。',
        coaches: [
            { name: 'Andruw Jones', role: 'Manager' },
            { name: 'Eugene Kingsale', role: 'Bench Coach' },
            { name: 'Bert Blyleven', role: 'Pitching Coach' },
            { name: 'Tjerk Smeets', role: 'Bullpen Coach' },
        ],
        fullRoster: {
            pitchers: [
                { id: 'Kenley_Jansen', name: 'Kenley Jansen', number: '74', position: 'Pitcher', image: '' },
                { id: 'Antwone_Kelly', name: 'Antwone Kelly', number: '45', position: 'Pitcher', image: '' },
                { id: 'Shairon_Martis', name: 'Shairon Martis', number: '39', position: 'Pitcher', image: '' },
                { id: 'Wendell_Floranus', name: 'Wendell Floranus', number: '0', position: 'Pitcher', image: '' },
                { id: 'Jamdrick_Cornelia', name: 'Jamdrick Cornelia', number: '0', position: 'Pitcher', image: '' },
                { id: 'Jaydenn_Estanista', name: 'Jaydenn Estanista', number: '0', position: 'Pitcher', image: '' },
                { id: 'Arij_Fransen', name: 'Arij Fransen', number: '0', position: 'Pitcher', image: '' },
                { id: 'Lars_Huijer', name: 'Lars Huijer', number: '0', position: 'Pitcher', image: '' },
                { id: 'Jaitoine_Kelly', name: 'Jaitoine Kelly', number: '0', position: 'Pitcher', image: '' },
                { id: 'Kevin_Kelly', name: 'Kevin Kelly', number: '0', position: 'Pitcher', image: '' },
                { id: 'Eric_Mendez', name: 'Eric Mendez', number: '0', position: 'Pitcher', image: '' },
                { id: 'Ryjeteri_Merite', name: 'Ryjeteri Merite', number: '0', position: 'Pitcher', image: '' },
            ],
            catchers: [
                { id: 'Chadwick_Tromp', name: 'Chadwick Tromp', number: '14', position: 'Catcher', image: '' },
                { id: 'Hendrik_Clementina', name: 'Hendrik Clementina', number: '0', position: 'Catcher', image: '' },
            ],
            fielders: [
                { id: 'Xander_Bogaerts', name: 'Xander Bogaerts', number: '2', position: 'Infielder', image: '' },
                { id: 'Ozzie_Albies', name: 'Ozzie Albies', number: '1', position: 'Infielder', image: '' },
                { id: 'Jurickson_Profar', name: 'Jurickson Profar', number: '10', position: 'Outfielder', image: '' },
                { id: 'Ceddanne_Rafaela', name: 'Ceddanne Rafaela', number: '15', position: 'Outfielder', image: '' },
                { id: 'Druw_Jones', name: 'Druw Jones', number: '25', position: 'Outfielder', image: '' },
                { id: 'Didi_Gregorius', name: 'Didi Gregorius', number: '0', position: 'Infielder', image: '' },
                { id: 'Juremi_Profar', name: 'Juremi Profar', number: '0', position: 'Infielder', image: '' },
                { id: 'Sharlon_Schoop', name: 'Sharlon Schoop', number: '0', position: 'Infielder', image: '' },
                { id: 'Delano_Selassa', name: 'Delano Selassa', number: '0', position: 'Infielder', image: '' },
                { id: 'Ray_Patrick_Didder', name: 'Ray Patrick Didder', number: '0', position: 'Outfielder', image: '' },
            ]
        },
        rotation: [
            { game: 'G1', opponent: 'Venezuela', opponentFlag: '🇻🇪', date: '2026-03-06', time: '12:00', pitchers: [] },
            { game: 'G2', opponent: 'Nicaragua', opponentFlag: '🇳🇮', date: '2026-03-07', time: '12:00', pitchers: [] },
            { game: 'G3', opponent: 'Dominican Republic', opponentFlag: '🇩🇴', date: '2026-03-08', time: '12:00', pitchers: [] },
            { game: 'G4', opponent: 'Israel', opponentFlag: '🇮🇱', date: '2026-03-10', time: '19:00', pitchers: [] }
        ]
    },
    {
        id: 'israel',
        name: 'Israel',
        nameZh: '以色列',
        flag: '🇮🇱',
        pool: 'D',
        achievementZh: 'WBC 8 強 (2017)',
        achievementEn: 'WBC Quarterfinalist (2017)',
        achievementJa: 'WBC ベスト8 (2017)',
        analysisZh: '以色列隊向來是經典賽的驚奇製造者。憑藉著眾多效力於美職體系的球員，這支球隊展現了極高的競爭精神，有望在此次 Pool D 再次扮演攔路虎。',
        analysisEn: 'Israel is the perennial underdog that loves to pull off upsets. Powered by players across the US professional system, they bring a high-IQ approach to a very competitive Pool D.',
        analysisJa: 'イスラエル代表は、WBCで度々波亂を起こしてきた「ジャイアントキリング」の雄です。米プロ野球に籍を置く選手が多く、知略に長けた野球で再びグループ突破を狙います。',
        coaches: [
            { name: 'Brad Ausmus', role: 'Manager' },
            { name: 'Kevin Youkilis', role: 'Bench Coach' },
            { name: 'Mark Loretta', role: '3B Coach' },
            { name: 'Jason Marquis', role: 'Bullpen Coach' },
        ],
        fullRoster: {
            pitchers: [
                { id: 'Dean_Kremer', name: 'Dean Kremer', number: '64', position: 'Pitcher', image: '' },
                { id: 'Tommy_Kahnle', name: 'Tommy Kahnle', number: '41', position: 'Pitcher', image: '' },
                { id: 'Matt_Bowman', name: 'Matt Bowman', number: '46', position: 'Pitcher', image: '' },
                { id: 'Charlie_Beilenson', name: 'Charlie Beilenson', number: '0', position: 'Pitcher', image: '' },
                { id: 'Josh_Blum', name: 'Josh Blum', number: '0', position: 'Pitcher', image: '' },
                { id: 'Harrison_Cohen', name: 'Harrison Cohen', number: '0', position: 'Pitcher', image: '' },
                { id: 'Daniel_Federman', name: 'Daniel Federman', number: '0', position: 'Pitcher', image: '' },
                { id: 'Jordan_Geber', name: 'Jordan Geber', number: '0', position: 'Pitcher', image: '' },
                { id: 'Rob_Kaminsky', name: 'Rob Kaminsky', number: '0', position: 'Pitcher', image: '' },
                { id: 'Max_Lazar', name: 'Max Lazar', number: '0', position: 'Pitcher', image: '' },
                { id: 'Carlos_Lequerica', name: 'Carlos Lequerica', number: '0', position: 'Pitcher', image: '' },
                { id: 'Eli_Morgan', name: 'Eli Morgan', number: '0', position: 'Pitcher', image: '' },
                { id: 'Ryan_Prager', name: 'Ryan Prager', number: '0', position: 'Pitcher', image: '' },
                { id: 'Ben_Simon', name: 'Ben Simon', number: '0', position: 'Pitcher', image: '' },
                { id: 'Robert_Stock', name: 'Robert Stock', number: '0', position: 'Pitcher', image: '' },
                { id: 'Zack_Weiss', name: 'Zack Weiss', number: '0', position: 'Pitcher', image: '' },
            ],
            catchers: [
                { id: 'Garrett_Stubbs', name: 'Garrett Stubbs', number: '21', position: 'Catcher', image: '' },
                { id: 'CJ_Stubbs', name: 'CJ Stubbs', number: '0', position: 'Catcher', image: '' },
            ],
            fielders: [
                { id: 'Harrison_Bader', name: 'Harrison Bader', number: '44', position: 'Outfielder', image: '' },
                { id: 'Spencer_Horwitz', name: 'Spencer Horwitz', number: '48', position: 'Infielder', image: '' },
                { id: 'Matt_Mervis', name: 'Matt Mervis', number: '22', position: 'Infielder', image: '' },
                { id: 'Troy_Johnston', name: 'Troy Johnston', number: '11', position: 'Outfielder', image: '' },
                { id: 'Cole_Carrigg', name: 'Cole Carrigg', number: '0', position: 'Infielder', image: '' },
                { id: 'Jake_Gelof', name: 'Jake Gelof', number: '0', position: 'Infielder', image: '' },
                { id: 'Noah_Mendlinger', name: 'Noah Mendlinger', number: '0', position: 'Infielder', image: '' },
                { id: 'Zach_Levenson', name: 'Zach Levenson', number: '0', position: 'Outfielder', image: '' },
                { id: 'RJ_Schreck', name: 'RJ Schreck', number: '0', position: 'Outfielder', image: '' },
            ]
        },
        rotation: [
            { game: 'G1', opponent: 'Venezuela', opponentFlag: '🇻🇪', date: '2026-03-07', time: '19:00', pitchers: [] },
            { game: 'G2', opponent: 'Nicaragua', opponentFlag: '🇳🇮', date: '2026-03-08', time: '19:00', pitchers: [] },
            { game: 'G3', opponent: 'Dominican Republic', opponentFlag: '🇩🇴', date: '2026-03-09', time: '12:00', pitchers: [] },
            { game: 'G4', opponent: 'Netherlands', opponentFlag: '🇳🇱', date: '2026-03-10', time: '19:00', pitchers: [] }
        ]
    },
    {
        id: 'nicaragua',
        name: 'Nicaragua',
        nameZh: '尼加拉瓜',
        flag: '🇳🇮',
        pool: 'D',
        achievementZh: '首次參賽 (2023)',
        achievementEn: 'First appearance in 2023',
        achievementJa: '2023 WBC 初出場',
        analysisZh: '尼加拉瓜在 2023 年首度亮相後的進步顯著。作為一個充滿棒球狂熱的國家，他們期待在 2026 年拿下隊史首場 WBC 勝場，並向世界展示尼國棒球的韌性。',
        analysisEn: 'After their 2023 debut, Nicaragua has made significant strides. This baseball-mad nation enters 2026 looking for its first official WBC win and hoping to upset the pool favorites.',
        analysisJa: '2023年のWBC初出場以來、ニカラグアは著実に力をつけています。野球熱の高い國としての誇りを持ち、2026年はWBC初勝利與強豪擊破を目指し、プールDに旋風を巻き起こします。',
        coaches: [
            { name: 'Dusty Baker', role: 'Manager' },
            { name: 'Sandor Guido', role: 'Bench Coach' },
        ],
        fullRoster: {
            pitchers: [
                { id: 'Carlos_Rodriguez', name: 'Carlos Rodriguez', number: '45', position: 'Pitcher', image: '' },
                { id: 'Erasmo_Ramirez', name: 'Erasmo Ramírez', number: '31', position: 'Pitcher', image: '' },
                { id: 'Danilo_Bermudez', name: 'Danilo Bermúdez', number: '0', position: 'Pitcher', image: '' },
                { id: 'Kenword_Burton', name: 'Kenword Burton', number: '0', position: 'Pitcher', image: '' },
                { id: 'Stiven_Cruz', name: 'Stiven Cruz', number: '0', position: 'Pitcher', image: '' },
                { id: 'Osman_Gutierrez', name: 'Osman Gutierrez', number: '0', position: 'Pitcher', image: '' },
                { id: 'Leo_Crawford', name: 'Leo Crawford', number: '0', position: 'Pitcher', image: '' },
                { id: 'Fidencio_Flores', name: 'Fidencio Flores', number: '0', position: 'Pitcher', image: '' },
                { id: 'Jesus_Garrido', name: 'Jesús Garrido', number: '0', position: 'Pitcher', image: '' },
                { id: 'Ernesto_Glasgon', name: 'Ernesto Glasgon', number: '0', position: 'Pitcher', image: '' },
                { id: 'Yeris_Gonzalez', name: 'Yeris Gonzalez', number: '0', position: 'Pitcher', image: '' },
                { id: 'Ronald_Medrano', name: 'Ronald Medrano', number: '0', position: 'Pitcher', image: '' },
                { id: 'Dilmer_Mejia', name: 'Dilmer Mejia', number: '0', position: 'Pitcher', image: '' },
                { id: 'Angel_Obando', name: 'Ángel Obando', number: '0', position: 'Pitcher', image: '' },
                { id: 'JC_Ramirez', name: 'J. C. Ramírez', number: '0', position: 'Pitcher', image: '' },
                { id: 'Carlos_Teller', name: 'Carlos Teller', number: '0', position: 'Pitcher', image: '' },
                { id: 'Bryan_Torres', name: 'Bryan Torres', number: '0', position: 'Pitcher', image: '' },
                { id: 'Axel_Zapata', name: 'Axel Zapata', number: '0', position: 'Pitcher', image: '' },
            ],
            catchers: [
                { id: 'Melvin_Novoa', name: 'Melvin Novoa', number: '0', position: 'Catcher', image: '' },
                { id: 'Ronald_Rivera', name: 'Ronald Rivera', number: '0', position: 'Catcher', image: '' },
            ],
            fielders: [
                { id: 'Mark_Vientos', name: 'Mark Vientos', number: '27', position: 'Infielder', image: '' },
                { id: 'Jeter_Downs', name: 'Jeter Downs', number: '4', position: 'Infielder', image: '' },
                { id: 'Benjamin_Alegria', name: 'Benjamín Alegría', number: '0', position: 'Infielder', image: '' },
                { id: 'Cheslor_Cuthbert', name: 'Cheslor Cuthbert', number: '0', position: 'Infielder', image: '' },
                { id: 'Freddy_Zamora', name: 'Freddy Zamora', number: '0', position: 'Infielder', image: '' },
                { id: 'Chase_Dawson', name: 'Chase Dawson', number: '0', position: 'Outfielder', image: '' },
                { id: 'Omar_Mendoza', name: 'Omar Mendoza', number: '0', position: 'Outfielder', image: '' },
                { id: 'Juan_Montes', name: 'Juan Montes', number: '0', position: 'Outfielder', image: '' },
                { id: 'Jose_Orozco', name: 'José Orozco', number: '0', position: 'Outfielder', image: '' },
                { id: 'Cristhian_Sandoval', name: 'Cristhian Sandoval', number: '0', position: 'Outfielder', image: '' },
            ]
        },
        rotation: [
            { game: 'G1', opponent: 'Dominican Republic', opponentFlag: '🇩🇴', date: '2026-03-06', time: '19:00', pitchers: [] },
            { game: 'G2', opponent: 'Netherlands', opponentFlag: '🇳🇱', date: '2026-03-07', time: '12:00', pitchers: [] },
            { game: 'G3', opponent: 'Israel', opponentFlag: '🇮🇱', date: '2026-03-08', time: '19:00', pitchers: [] },
            { game: 'G4', opponent: 'Venezuela', opponentFlag: '🇻🇪', date: '2026-03-09', time: '19:00', pitchers: [] }
        ]
    }
];
