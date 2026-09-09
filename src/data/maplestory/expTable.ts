/**
 * 新楓之谷 v281 / New Age / Milestone 1~300等 完整經驗值表
 * 資料來源：StrategyWiki & 官方經驗值資料
 */

export interface LevelExpData {
  level: number;
  expToNext: number; // 升到下一級所需的經驗值
  totalExp: number;  // 達成該等級時的累計總經驗值
}

export const MAPLE_EXP_TABLE: Record<number, LevelExpData> = {
  1: { level: 1, expToNext: 15, totalExp: 0 },
  2: { level: 2, expToNext: 34, totalExp: 15 },
  3: { level: 3, expToNext: 57, totalExp: 49 },
  4: { level: 4, expToNext: 92, totalExp: 106 },
  5: { level: 5, expToNext: 135, totalExp: 198 },
  6: { level: 6, expToNext: 372, totalExp: 333 },
  7: { level: 7, expToNext: 560, totalExp: 705 },
  8: { level: 8, expToNext: 840, totalExp: 1265 },
  9: { level: 9, expToNext: 1242, totalExp: 2105 },
  10: { level: 10, expToNext: 1242, totalExp: 3347 },
  11: { level: 11, expToNext: 1242, totalExp: 4589 },
  12: { level: 12, expToNext: 1242, totalExp: 5831 },
  13: { level: 13, expToNext: 1242, totalExp: 7073 },
  14: { level: 14, expToNext: 1242, totalExp: 8315 },
  15: { level: 15, expToNext: 1490, totalExp: 9557 },
  16: { level: 16, expToNext: 1788, totalExp: 11047 },
  17: { level: 17, expToNext: 2145, totalExp: 12835 },
  18: { level: 18, expToNext: 2574, totalExp: 14980 },
  19: { level: 19, expToNext: 3088, totalExp: 17554 },
  20: { level: 20, expToNext: 3705, totalExp: 20642 },
  21: { level: 21, expToNext: 4446, totalExp: 24347 },
  22: { level: 22, expToNext: 5335, totalExp: 28793 },
  23: { level: 23, expToNext: 6402, totalExp: 34128 },
  24: { level: 24, expToNext: 7682, totalExp: 40530 },
  25: { level: 25, expToNext: 9218, totalExp: 48212 },
  26: { level: 26, expToNext: 11061, totalExp: 57430 },
  27: { level: 27, expToNext: 13273, totalExp: 68491 },
  28: { level: 28, expToNext: 15927, totalExp: 81764 },
  29: { level: 29, expToNext: 19112, totalExp: 97691 },
  30: { level: 30, expToNext: 19112, totalExp: 116803 },
  31: { level: 31, expToNext: 19112, totalExp: 135915 },
  32: { level: 32, expToNext: 19112, totalExp: 155027 },
  33: { level: 33, expToNext: 19112, totalExp: 174139 },
  34: { level: 34, expToNext: 19112, totalExp: 193251 },
  35: { level: 35, expToNext: 22934, totalExp: 212323 },
  36: { level: 36, expToNext: 27520, totalExp: 235297 },
  37: { level: 37, expToNext: 33024, totalExp: 262817 },
  38: { level: 38, expToNext: 39628, totalExp: 295841 },
  39: { level: 39, expToNext: 47553, totalExp: 335469 },
  40: { level: 40, expToNext: 51357, totalExp: 383022 },
  41: { level: 41, expToNext: 55465, totalExp: 434379 },
  42: { level: 42, expToNext: 59902, totalExp: 489844 },
  43: { level: 43, expToNext: 64694, totalExp: 549746 },
  44: { level: 44, expToNext: 69869, totalExp: 614440 },
  45: { level: 45, expToNext: 75458, totalExp: 684309 },
  46: { level: 46, expToNext: 81494, totalExp: 759767 },
  47: { level: 47, expToNext: 88013, totalExp: 841261 },
  48: { level: 48, expToNext: 95054, totalExp: 929274 },
  49: { level: 49, expToNext: 102658, totalExp: 1024328 },
  50: { level: 50, expToNext: 110870, totalExp: 1126986 },
  51: { level: 51, expToNext: 119739, totalExp: 1237856 },
  52: { level: 52, expToNext: 129318, totalExp: 1357595 },
  53: { level: 53, expToNext: 139663, totalExp: 1486913 },
  54: { level: 54, expToNext: 150836, totalExp: 1626576 },
  55: { level: 55, expToNext: 162902, totalExp: 1777412 },
  56: { level: 56, expToNext: 175934, totalExp: 1940314 },
  57: { level: 57, expToNext: 190008, totalExp: 2116248 },
  58: { level: 58, expToNext: 205208, totalExp: 2306256 },
  59: { level: 59, expToNext: 221624, totalExp: 2511464 },
  60: { level: 60, expToNext: 221624, totalExp: 2733088 },
  61: { level: 61, expToNext: 221624, totalExp: 2954712 },
  62: { level: 62, expToNext: 221624, totalExp: 3176336 },
  63: { level: 63, expToNext: 221624, totalExp: 3397960 },
  64: { level: 64, expToNext: 221624, totalExp: 3619584 },
  65: { level: 65, expToNext: 238245, totalExp: 3841208 },
  66: { level: 66, expToNext: 256113, totalExp: 4079453 },
  67: { level: 67, expToNext: 275321, totalExp: 4335566 },
  68: { level: 68, expToNext: 295970, totalExp: 4610887 },
  69: { level: 69, expToNext: 318167, totalExp: 4906857 },
  70: { level: 70, expToNext: 342029, totalExp: 5225024 },
  71: { level: 71, expToNext: 367681, totalExp: 5567053 },
  72: { level: 72, expToNext: 395257, totalExp: 5934734 },
  73: { level: 73, expToNext: 424901, totalExp: 6329991 },
  74: { level: 74, expToNext: 456768, totalExp: 6754892 },
  75: { level: 75, expToNext: 488741, totalExp: 7211660 },
  76: { level: 76, expToNext: 522952, totalExp: 7700401 },
  77: { level: 77, expToNext: 559558, totalExp: 8223353 },
  78: { level: 78, expToNext: 598727, totalExp: 8782911 },
  79: { level: 79, expToNext: 640637, totalExp: 9381638 },
  80: { level: 80, expToNext: 685481, totalExp: 10022275 },
  81: { level: 81, expToNext: 733464, totalExp: 10707756 },
  82: { level: 82, expToNext: 784806, totalExp: 11441220 },
  83: { level: 83, expToNext: 839742, totalExp: 12226026 },
  84: { level: 84, expToNext: 898523, totalExp: 13065768 },
  85: { level: 85, expToNext: 961419, totalExp: 13964291 },
  86: { level: 86, expToNext: 1028718, totalExp: 14925710 },
  87: { level: 87, expToNext: 1100728, totalExp: 15954428 },
  88: { level: 88, expToNext: 1177778, totalExp: 17055156 },
  89: { level: 89, expToNext: 1260222, totalExp: 18232934 },
  90: { level: 90, expToNext: 1342136, totalExp: 19493156 },
  91: { level: 91, expToNext: 1429374, totalExp: 20835292 },
  92: { level: 92, expToNext: 1522283, totalExp: 22264666 },
  93: { level: 93, expToNext: 1621231, totalExp: 23786949 },
  94: { level: 94, expToNext: 1726611, totalExp: 25408180 },
  95: { level: 95, expToNext: 1838840, totalExp: 27134791 },
  96: { level: 96, expToNext: 1958364, totalExp: 28973631 },
  97: { level: 97, expToNext: 2085657, totalExp: 30931995 },
  98: { level: 98, expToNext: 2221224, totalExp: 33017652 },
  99: { level: 99, expToNext: 2365603, totalExp: 35238876 },
  100: { level: 100, expToNext: 2365603, totalExp: 37604479 },
  101: { level: 101, expToNext: 2365603, totalExp: 39970082 },
  102: { level: 102, expToNext: 2365603, totalExp: 42335685 },
  103: { level: 103, expToNext: 2365603, totalExp: 44701288 },
  104: { level: 104, expToNext: 2365603, totalExp: 47066891 },
  105: { level: 105, expToNext: 2519367, totalExp: 49432494 },
  106: { level: 106, expToNext: 2683125, totalExp: 51951861 },
  107: { level: 107, expToNext: 2857528, totalExp: 54634986 },
  108: { level: 108, expToNext: 3043267, totalExp: 57492514 },
  109: { level: 109, expToNext: 3241079, totalExp: 60535781 },
  110: { level: 110, expToNext: 3451749, totalExp: 63776860 },
  111: { level: 111, expToNext: 3676112, totalExp: 67228609 },
  112: { level: 112, expToNext: 3915059, totalExp: 70904721 },
  113: { level: 113, expToNext: 4169537, totalExp: 74819780 },
  114: { level: 114, expToNext: 4440556, totalExp: 78989317 },
  115: { level: 115, expToNext: 4729192, totalExp: 83429873 },
  116: { level: 116, expToNext: 5036589, totalExp: 88159065 },
  117: { level: 117, expToNext: 5363967, totalExp: 93195654 },
  118: { level: 118, expToNext: 5712624, totalExp: 98559621 },
  119: { level: 119, expToNext: 6083944, totalExp: 104272245 },
  120: { level: 120, expToNext: 6479400, totalExp: 110356189 },
  121: { level: 121, expToNext: 6900561, totalExp: 116835589 },
  122: { level: 122, expToNext: 7349097, totalExp: 123736150 },
  123: { level: 123, expToNext: 7826788, totalExp: 131085247 },
  124: { level: 124, expToNext: 8335529, totalExp: 138912035 },
  125: { level: 125, expToNext: 8877338, totalExp: 147247564 },
  126: { level: 126, expToNext: 9454364, totalExp: 156124902 },
  127: { level: 127, expToNext: 10068897, totalExp: 165579266 },
  128: { level: 128, expToNext: 10723375, totalExp: 175648163 },
  129: { level: 129, expToNext: 11420394, totalExp: 186371538 },
  130: { level: 130, expToNext: 12162719, totalExp: 197791932 },
  131: { level: 131, expToNext: 12953295, totalExp: 209954651 },
  132: { level: 132, expToNext: 13795259, totalExp: 222907946 },
  133: { level: 133, expToNext: 14691950, totalExp: 236703205 },
  134: { level: 134, expToNext: 15646926, totalExp: 251395155 },
  135: { level: 135, expToNext: 16663976, totalExp: 267042081 },
  136: { level: 136, expToNext: 17747134, totalExp: 283706057 },
  137: { level: 137, expToNext: 18900697, totalExp: 301453191 },
  138: { level: 138, expToNext: 20129242, totalExp: 320353888 },
  139: { level: 139, expToNext: 21437642, totalExp: 340483130 },
  140: { level: 140, expToNext: 22777494, totalExp: 361920772 },
  141: { level: 141, expToNext: 24201087, totalExp: 384698266 },
  142: { level: 142, expToNext: 25713654, totalExp: 408899353 },
  143: { level: 143, expToNext: 27320757, totalExp: 434613007 },
  144: { level: 144, expToNext: 29028304, totalExp: 461933764 },
  145: { level: 145, expToNext: 30842573, totalExp: 490962068 },
  146: { level: 146, expToNext: 32770233, totalExp: 521804641 },
  147: { level: 147, expToNext: 34818372, totalExp: 554574874 },
  148: { level: 148, expToNext: 36994520, totalExp: 589393246 },
  149: { level: 149, expToNext: 39306677, totalExp: 626387766 },
  150: { level: 150, expToNext: 41763344, totalExp: 665694443 },
  151: { level: 151, expToNext: 44373553, totalExp: 707457787 },
  152: { level: 152, expToNext: 47146900, totalExp: 751831340 },
  153: { level: 153, expToNext: 50093581, totalExp: 798978240 },
  154: { level: 154, expToNext: 53224429, totalExp: 849071821 },
  155: { level: 155, expToNext: 56550955, totalExp: 902296250 },
  156: { level: 156, expToNext: 60085389, totalExp: 958847205 },
  157: { level: 157, expToNext: 63840725, totalExp: 1018932594 },
  158: { level: 158, expToNext: 67830770, totalExp: 1082773319 },
  159: { level: 159, expToNext: 72070193, totalExp: 1150604089 },
  160: { level: 160, expToNext: 76574580, totalExp: 1222674282 },
  161: { level: 161, expToNext: 81360491, totalExp: 1299248862 },
  162: { level: 162, expToNext: 86445521, totalExp: 1380609353 },
  163: { level: 163, expToNext: 91848366, totalExp: 1467054874 },
  164: { level: 164, expToNext: 97588888, totalExp: 1558903240 },
  165: { level: 165, expToNext: 103688193, totalExp: 1656492128 },
  166: { level: 166, expToNext: 110168705, totalExp: 1760180321 },
  167: { level: 167, expToNext: 117054249, totalExp: 1870349026 },
  168: { level: 168, expToNext: 124370139, totalExp: 1987403275 },
  169: { level: 169, expToNext: 132143272, totalExp: 2111773414 },
  170: { level: 170, expToNext: 138750435, totalExp: 2243916686 },
  171: { level: 171, expToNext: 145687956, totalExp: 2382667121 },
  172: { level: 172, expToNext: 152972353, totalExp: 2528355077 },
  173: { level: 173, expToNext: 160620970, totalExp: 2681327430 },
  174: { level: 174, expToNext: 168652018, totalExp: 2841948400 },
  175: { level: 175, expToNext: 177084618, totalExp: 3010600418 },
  176: { level: 176, expToNext: 185938848, totalExp: 3187685036 },
  177: { level: 177, expToNext: 195235790, totalExp: 3373623884 },
  178: { level: 178, expToNext: 204997579, totalExp: 3568859674 },
  179: { level: 179, expToNext: 215247457, totalExp: 3773857253 },
  180: { level: 180, expToNext: 226009829, totalExp: 3989104710 },
  181: { level: 181, expToNext: 237310320, totalExp: 4215114539 },
  182: { level: 182, expToNext: 249175836, totalExp: 4452424859 },
  183: { level: 183, expToNext: 261634627, totalExp: 4701600695 },
  184: { level: 184, expToNext: 274716358, totalExp: 4963235322 },
  185: { level: 185, expToNext: 288452175, totalExp: 5237951680 },
  186: { level: 186, expToNext: 302874783, totalExp: 5526403855 },
  187: { level: 187, expToNext: 318018522, totalExp: 5829278638 },
  188: { level: 188, expToNext: 333919448, totalExp: 6147297160 },
  189: { level: 189, expToNext: 350615420, totalExp: 6481216608 },
  190: { level: 190, expToNext: 368146191, totalExp: 6831832028 },
  191: { level: 191, expToNext: 386553500, totalExp: 7199978219 },
  192: { level: 192, expToNext: 405881175, totalExp: 7586531719 },
  193: { level: 193, expToNext: 426175233, totalExp: 7992412894 },
  194: { level: 194, expToNext: 447483994, totalExp: 8418588127 },
  195: { level: 195, expToNext: 469858193, totalExp: 8866072121 },
  196: { level: 196, expToNext: 493351102, totalExp: 9335930314 },
  197: { level: 197, expToNext: 518018657, totalExp: 9829281416 },
  198: { level: 198, expToNext: 543919589, totalExp: 10347300073 },
  199: { level: 199, expToNext: 571115568, totalExp: 10891219662 },
  200: { level: 200, expToNext: 2207026470, totalExp: 11462335230 },
  201: { level: 201, expToNext: 2471869646, totalExp: 13669361700 },
  202: { level: 202, expToNext: 2768494003, totalExp: 16141231346 },
  203: { level: 203, expToNext: 3100713283, totalExp: 18909725349 },
  204: { level: 204, expToNext: 3472798876, totalExp: 22010438632 },
  205: { level: 205, expToNext: 3889534741, totalExp: 25483237508 },
  206: { level: 206, expToNext: 4356278909, totalExp: 29372772249 },
  207: { level: 207, expToNext: 4879032378, totalExp: 33729051158 },
  208: { level: 208, expToNext: 5464516263, totalExp: 38608083536 },
  209: { level: 209, expToNext: 6120258214, totalExp: 44072599799 },
  210: { level: 210, expToNext: 7956335678, totalExp: 50192858013 },
  211: { level: 211, expToNext: 8831532602, totalExp: 58149193691 },
  212: { level: 212, expToNext: 9803001188, totalExp: 66980726293 },
  213: { level: 213, expToNext: 10881331318, totalExp: 76783727481 },
  214: { level: 214, expToNext: 12078277762, totalExp: 87665058799 },
  215: { level: 215, expToNext: 15701761090, totalExp: 99743336561 },
  216: { level: 216, expToNext: 17114919588, totalExp: 115445097651 },
  217: { level: 217, expToNext: 18655262350, totalExp: 132560017239 },
  218: { level: 218, expToNext: 20334235961, totalExp: 151215279589 },
  219: { level: 219, expToNext: 22164317197, totalExp: 171549515550 },
  220: { level: 220, expToNext: 28813612356, totalExp: 193713832747 },
  221: { level: 221, expToNext: 30830565220, totalExp: 222527445103 },
  222: { level: 222, expToNext: 32988704785, totalExp: 253358010323 },
  223: { level: 223, expToNext: 35297914119, totalExp: 286346715108 },
  224: { level: 224, expToNext: 37768768107, totalExp: 321644629227 },
  225: { level: 225, expToNext: 49099398539, totalExp: 359413397334 },
  226: { level: 226, expToNext: 52536356436, totalExp: 408512795873 },
  227: { level: 227, expToNext: 56213901386, totalExp: 461049152309 },
  228: { level: 228, expToNext: 60148874483, totalExp: 517263053695 },
  229: { level: 229, expToNext: 64359295696, totalExp: 577411928178 },
  230: { level: 230, expToNext: 83667084404, totalExp: 641771223874 },
  231: { level: 231, expToNext: 86177096936, totalExp: 725438308278 },
  232: { level: 232, expToNext: 88762409844, totalExp: 811615405214 },
  233: { level: 233, expToNext: 91425282139, totalExp: 900377815058 },
  234: { level: 234, expToNext: 94168040603, totalExp: 991803097197 },
  235: { level: 235, expToNext: 122418452783, totalExp: 1085971137800 },
  236: { level: 236, expToNext: 126091006366, totalExp: 1208389590583 },
  237: { level: 237, expToNext: 129873736556, totalExp: 1334480596949 },
  238: { level: 238, expToNext: 133769948652, totalExp: 1464354333505 },
  239: { level: 239, expToNext: 137783047111, totalExp: 1598124282157 },
  240: { level: 240, expToNext: 179117961244, totalExp: 1735907329268 },
  241: { level: 241, expToNext: 184491500081, totalExp: 1915025290512 },
  242: { level: 242, expToNext: 190026245083, totalExp: 2099516790593 },
  243: { level: 243, expToNext: 195727032435, totalExp: 2289543035676 },
  244: { level: 244, expToNext: 201598843408, totalExp: 2485270068111 },
  245: { level: 245, expToNext: 262078496430, totalExp: 2686868911519 },
  246: { level: 246, expToNext: 269940851322, totalExp: 2948947407949 },
  247: { level: 247, expToNext: 278039076861, totalExp: 3218888259271 },
  248: { level: 248, expToNext: 286380249166, totalExp: 3496927336132 },
  249: { level: 249, expToNext: 294971656640, totalExp: 3783307585298 },
  250: { level: 250, expToNext: 442457484960, totalExp: 4078279241938 },
  251: { level: 251, expToNext: 455731209508, totalExp: 4520736726898 },
  252: { level: 252, expToNext: 469403145793, totalExp: 4976467936406 },
  253: { level: 253, expToNext: 483485240166, totalExp: 5445871082199 },
  254: { level: 254, expToNext: 497989797370, totalExp: 5929356322365 },
  255: { level: 255, expToNext: 512929491291, totalExp: 6427346119735 },
  256: { level: 256, expToNext: 528317376029, totalExp: 6940275611026 },
  257: { level: 257, expToNext: 544166897309, totalExp: 7468592987055 },
  258: { level: 258, expToNext: 560491904228, totalExp: 8012759884364 },
  259: { level: 259, expToNext: 577306661354, totalExp: 8573251788592 },
  260: { level: 260, expToNext: 1731919984062, totalExp: 9150558449946 },
  261: { level: 261, expToNext: 1749239183902, totalExp: 10882478434008 },
  262: { level: 262, expToNext: 1766731575741, totalExp: 12631717617910 },
  263: { level: 263, expToNext: 1784398891498, totalExp: 14398449193651 },
  264: { level: 264, expToNext: 1802242880412, totalExp: 16182848085149 },
  265: { level: 265, expToNext: 2342915744535, totalExp: 17985090965561 },
  266: { level: 266, expToNext: 2366344901980, totalExp: 20328006710096 },
  267: { level: 267, expToNext: 2390008350999, totalExp: 22694351612076 },
  268: { level: 268, expToNext: 2413908434508, totalExp: 25084359963075 },
  269: { level: 269, expToNext: 2438047518853, totalExp: 27498268397583 },
  270: { level: 270, expToNext: 5412465491853, totalExp: 29936315916436 },
  271: { level: 271, expToNext: 5466590146771, totalExp: 35348781408289 },
  272: { level: 272, expToNext: 5521256048238, totalExp: 40815371555060 },
  273: { level: 273, expToNext: 5576468608720, totalExp: 46336627603298 },
  274: { level: 274, expToNext: 5632233294807, totalExp: 51913096212018 },
  275: { level: 275, expToNext: 11377111255510, totalExp: 57545329506825 },
  276: { level: 276, expToNext: 12514822381061, totalExp: 68922440762335 },
  277: { level: 277, expToNext: 13766304619167, totalExp: 81437263143396 },
  278: { level: 278, expToNext: 15142935081083, totalExp: 95203567762563 },
  279: { level: 279, expToNext: 16657228589191, totalExp: 110346502843646 },
  280: { level: 280, expToNext: 33647601750165, totalExp: 127003731432837 },
  281: { level: 281, expToNext: 37012361925181, totalExp: 160651333183002 },
  282: { level: 282, expToNext: 40713598117699, totalExp: 197663695108183 },
  283: { level: 283, expToNext: 44784957929468, totalExp: 238377293225882 },
  284: { level: 284, expToNext: 49263453722414, totalExp: 283162251155350 },
  285: { level: 285, expToNext: 99512176519276, totalExp: 332425704877764 },
  286: { level: 286, expToNext: 109463394171203, totalExp: 431937881397040 },
  287: { level: 287, expToNext: 120409733588323, totalExp: 541401275568243 },
  288: { level: 288, expToNext: 132450706947155, totalExp: 661811009156566 },
  289: { level: 289, expToNext: 145695777641870, totalExp: 794261716103721 },
  290: { level: 290, expToNext: 294305470836577, totalExp: 939957493745591 },
  291: { level: 291, expToNext: 323736017920234, totalExp: 1234262964582168 },
  292: { level: 292, expToNext: 356109619712257, totalExp: 1557998982502402 },
  293: { level: 293, expToNext: 391720581683483, totalExp: 1914108602214659 },
  294: { level: 294, expToNext: 430892639851831, totalExp: 2305829183898142 },
  295: { level: 295, expToNext: 870403132500699, totalExp: 2736721823749973 },
  296: { level: 296, expToNext: 957443445750769, totalExp: 3607124956250672 },
  297: { level: 297, expToNext: 1053187790325845, totalExp: 4564568402001441 },
  298: { level: 298, expToNext: 1158506569358425, totalExp: 5617756192327286 },
  299: { level: 299, expToNext: 1737759854037637, totalExp: 6776262761685711 },
  300: { level: 300, expToNext: 0, totalExp: 8514022615723348 },
};

/**
 * 取得指定等級升至下一級所需經驗值
 */
export function getExpToNextLevel(level: number): number {
  if (level < 1) return MAPLE_EXP_TABLE[1].expToNext;
  if (level >= 300) return 0;
  return MAPLE_EXP_TABLE[level]?.expToNext ?? 0;
}

/**
 * 取得達到指定等級所需的累計總經驗值
 */
export function getTotalExpForLevel(level: number): number {
  if (level <= 1) return 0;
  if (level > 300) return MAPLE_EXP_TABLE[300].totalExp;
  return MAPLE_EXP_TABLE[level]?.totalExp ?? 0;
}

/**
 * 根據等級與百分比計算目前累積的總經驗值
 * @param level 目前等級 (1~300)
 * @param percent 目前經驗值百分比 (0~100)
 */
export function calcTotalExp(level: number, percent: number): number {
  const safeLevel = Math.max(1, Math.min(300, level));
  if (safeLevel === 300) return MAPLE_EXP_TABLE[300].totalExp;
  
  const baseTotal = getTotalExpForLevel(safeLevel);
  const expToNext = getExpToNextLevel(safeLevel);
  const currentLevelExp = (expToNext * Math.max(0, Math.min(100, percent))) / 100;
  return baseTotal + currentLevelExp;
}

/**
 * 根據總經驗值反推當前等級與進度百分比 (精確度可達小數點兩位)
 */
export function calcLevelAndPercent(totalExp: number): {
  level: number;
  percent: number;
  expInLevel: number;
  expToNext: number;
} {
  const maxTotalExp = MAPLE_EXP_TABLE[300].totalExp;
  if (totalExp >= maxTotalExp) {
    return {
      level: 300,
      percent: 0,
      expInLevel: 0,
      expToNext: 0,
    };
  }

  let currentLevel = 1;
  for (let lvl = 299; lvl >= 1; lvl--) {
    if (totalExp >= MAPLE_EXP_TABLE[lvl].totalExp) {
      currentLevel = lvl;
      break;
    }
  }

  const baseTotal = MAPLE_EXP_TABLE[currentLevel].totalExp;
  const expToNext = MAPLE_EXP_TABLE[currentLevel].expToNext;
  const expInLevel = totalExp - baseTotal;
  const percent = expToNext > 0 ? (expInLevel / expToNext) * 100 : 0;

  return {
    level: currentLevel,
    percent: Math.min(99.99, Math.max(0, Math.round(percent * 100) / 100)),
    expInLevel,
    expToNext,
  };
}

/**
 * 為角色增加指定經驗值並計算最終等級與百分比
 */
export function addExp(
  currentLevel: number,
  currentPercent: number,
  expGained: number
): {
  startLevel: number;
  startPercent: number;
  finalLevel: number;
  finalPercent: number;
  levelDiff: number;
  expGained: number;
  finalTotalExp: number;
  expInFinalLevel: number;
  expToNextInFinalLevel: number;
} {
  const currentTotalExp = calcTotalExp(currentLevel, currentPercent);
  const finalTotalExp = currentTotalExp + expGained;
  const result = calcLevelAndPercent(finalTotalExp);

  return {
    startLevel: currentLevel,
    startPercent: currentPercent,
    finalLevel: result.level,
    finalPercent: result.percent,
    levelDiff: result.level - currentLevel,
    expGained,
    finalTotalExp,
    expInFinalLevel: result.expInLevel,
    expToNextInFinalLevel: result.expToNext,
  };
}

/**
 * 格式化經驗值數值為好讀的字串 (如 1.7319 兆、4329.80 億、或純數字逗號格式)
 */
export function formatExp(exp: number, showExact = false): string {
  if (exp === 0) return '0';
  if (exp >= 1_000_000_000_000) {
    const trillions = exp / 1_000_000_000_000;
    const formatted = `${trillions.toFixed(4)} 兆`;
    return showExact ? `${formatted} (${Math.round(exp).toLocaleString()})` : formatted;
  }
  if (exp >= 100_000_000) {
    const hundredMillions = exp / 100_000_000;
    const formatted = `${hundredMillions.toFixed(2)} 億`;
    return showExact ? `${formatted} (${Math.round(exp).toLocaleString()})` : formatted;
  }
  if (exp >= 10_000) {
    const tenThousands = exp / 10_000;
    const formatted = `${tenThousands.toFixed(2)} 萬`;
    return showExact ? `${formatted} (${Math.round(exp).toLocaleString()})` : formatted;
  }
  return Math.round(exp).toLocaleString();
}

