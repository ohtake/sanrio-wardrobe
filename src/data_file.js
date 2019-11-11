export default class DataFile {
  /**
   * @param {string} name File name of data File
   * @param {string} seriesSymbol
   * @param {string} nameJa
   * @param {string} nameEn
   * @param {string} picUrl URL of the image. Use Flickr's Square 150 format.
   */
  constructor(name, seriesSymbol, nameJa, nameEn, picUrl) {
    this.name = name;
    this.seriesSymbol = seriesSymbol;
    this.nameJa = nameJa;
    this.nameEn = nameEn;
    this.picUrl = picUrl;
  }

  /**
   * @returns {string}
   */
  getDisplayName() {
    return `${this.seriesSymbol} ${this.nameJa} (${this.nameEn})`;
  }
}

DataFile.all = [
  DataFile.arRetsuko = new DataFile(
    'ar-retsuko', 'AR', '烈子', 'Aggretsuko',
    // https://www.flickr.com/photos/ohtake_tomohiro/27566187616/
    'https://c2.staticflickr.com/8/7138/27566187616_3d205ce5f6_q.jpg',
  ),
  DataFile.azClara = new DataFile(
    'az-clara', 'AZ', 'クララ', 'Clara',
    // https://www.flickr.com/photos/ohtake_tomohiro/15764814980/
    'https://c2.staticflickr.com/8/7499/15764814980_e84d364549_q.jpg',
  ),
  DataFile.azKyle = new DataFile(
    'az-kyle', 'AZ', 'カイル', 'Kyle',
    // https://www.flickr.com/photos/ohtake_tomohiro/35873908813/
    'https://c1.staticflickr.com/5/4368/35873908813_78317ae374_q.jpg',
  ),
  DataFile.azDokidoki = new DataFile(
    'az-dokidoki', 'AZ', 'ドキドキヤミーチャムズ', 'DokidokiYummychums',
    '',
  ),
  DataFile.azPinky = new DataFile(
    'az-pinky', 'AZ', 'ピンキー・リルローズ', 'Pinky Lilrose',
    // https://www.flickr.com/photos/ohtake_tomohiro/35156445182/
    'https://c1.staticflickr.com/5/4257/35156445182_1a476e0dd9_q.jpg',
  ),
  DataFile.azLio = new DataFile(
    'az-lio', 'AZ', 'リオ・スカイピース', 'Lio Skypeace',
    // https://www.flickr.com/photos/ohtake_tomohiro/35283176916/
    'https://c1.staticflickr.com/5/4246/35283176916_72406f1d31_q.jpg',
  ),
  DataFile.bnButtonNose = new DataFile(
    'bn-button_nose', 'BN', 'トリシュ', 'Button Nose',
    // https://www.flickr.com/photos/ohtake_tomohiro/9471261149/
    'https://c2.staticflickr.com/4/3743/9471261149_df68d034d2_q.jpg',
  ),
  DataFile.boRibbon = new DataFile(
    'bo-ribbon', 'BO', 'りぼん', 'Bonbonribbon',
    // https://www.flickr.com/photos/ohtake_tomohiro/26615555253/
    'https://c2.staticflickr.com/8/7356/26615555253_f77c7410de_q.jpg',
  ),
  DataFile.boMimi = new DataFile(
    'bo-mimi', 'BO', 'ミミ', 'Milkeemimi',
    // https://www.flickr.com/photos/ohtake_tomohiro/35379377232/
    'https://c1.staticflickr.com/5/4242/35379377232_7ec5af77e4_q.jpg',
  ),
  DataFile.boFlora = new DataFile(
    'bo-flora', 'BO', 'フローラ', 'Lalalafrola',
    // https://www.flickr.com/photos/ohtake_tomohiro/16737597941/
    'https://c1.staticflickr.com/9/8594/16737597941_cbdee4a609_q.jpg',
  ),
  DataFile.boLulu = new DataFile(
    'bo-lulu', 'BO', 'ルル', 'Roonroonlulu',
    // https://www.flickr.com/photos/ohtake_tomohiro/28310489531/
    'https://c2.staticflickr.com/8/7755/28310489531_9cbb5a0199_q.jpg',
  ),
  DataFile.caAzuki = new DataFile(
    'ca-azuki', 'CA', 'アズキ', 'Azuki',
    // https://www.flickr.com/photos/ohtake_tomohiro/34737908083/
    'https://c1.staticflickr.com/5/4234/34737908083_a3978cc5d6_q.jpg',
  ),
  DataFile.ckKuririn = new DataFile(
    'ck-kuririn', 'CK', 'クリリン', 'Corocorokuririn',
    // https://www.flickr.com/photos/ohtake_tomohiro/10495547335/
    'https://c2.staticflickr.com/4/3765/10495547335_f87ec7ebbc_q.jpg',
  ),
  DataFile.cnCinnamon = new DataFile(
    'cn-cinnamon', 'CN', 'シナモン', 'Cinnamon',
    // https://www.flickr.com/photos/ohtake_tomohiro/9544085163/
    'https://c1.staticflickr.com/3/2818/9544085163_5092625ee9_q.jpg',
  ),
  DataFile.coChococat = new DataFile(
    'co-chococat', 'CO', 'チョコキャット', 'Chococat',
    '',
  ),
  DataFile.cyCharmmy = new DataFile(
    'cy-charmmy', 'CY', 'チャーミー', 'Charmmy Kitty',
    // https://www.flickr.com/photos/ohtake_tomohiro/10671752346/
    'https://c2.staticflickr.com/8/7451/10671752346_15ebdc7e66_q.jpg',
  ),
  DataFile.cyHoneucute = new DataFile(
    'cy-honeycute', 'CY', 'ハニーキュート', 'Honeycute',
    // https://www.flickr.com/photos/ohtake_tomohiro/9899556945/
    'https://c1.staticflickr.com/3/2867/9899556945_9a52b72a12_q.jpg',
  ),
  DataFile.dgDarkGrapeMan = new DataFile(
    'dg-dark_grape_man', 'DG', 'ダークグレープマン', 'Dark Grape Man',
    // https://www.flickr.com/photos/ohtake_tomohiro/9052039805/
    'https://c2.staticflickr.com/4/3797/9052039805_dc4eeb0c18_q.jpg',
  ),
  DataFile.dnDaniel = new DataFile(
    'dn-daniel', 'DN', 'ダニエル', 'Daniel',
    '',
  ),
  DataFile.gpGochan = new DataFile(
    'gp-gochan', 'GP', 'ゴーちゃん。', 'Go-chan.',
    // https://www.flickr.com/photos/ohtake_tomohiro/8784705396/
    'https://c2.staticflickr.com/8/7401/8784705396_669ef592b3_q.jpg',
  ),
  DataFile.gpGochan = new DataFile(
    'gp-moffun', 'GP', 'モッフン', 'Moffy',
    // https://www.flickr.com/photos/ohtake_tomohiro/33950392394/
    'https://c1.staticflickr.com/5/4276/33950392394_c422e36b05_q.jpg',
  ),
  DataFile.guGudetama = new DataFile(
    'gu-gudetama', 'GU', 'ぐでたま', 'Gudetama',
    // https://www.flickr.com/photos/ohtake_tomohiro/14834955654/
    'https://c2.staticflickr.com/6/5556/14834955654_c2887b9976_q.jpg',
  ),
  DataFile.hgHangyodon = new DataFile(
    'hg-hangyodon', 'HG', 'ハンギョドン', 'Hangyodon',
    // https://www.flickr.com/photos/ohtake_tomohiro/9866207046/
    'https://c2.staticflickr.com/6/5487/9866207046_2f55befe93_q.jpg',
  ),
  DataFile.hmHoneyMomo = new DataFile(
    'hm-honey_momo', 'HM', 'ハニーモモ', 'Honey Momo',
    // https://www.flickr.com/photos/ohtake_tomohiro/9054267360/
    'https://c1.staticflickr.com/3/2815/9054267360_4293f933fa_q.jpg',
  ),
  DataFile.jlRuby = new DataFile(
    'jl-ruby', 'JL', 'ルビー', 'Ruby',
    // https://www.flickr.com/photos/ohtake_tomohiro/30901115623/
    'https://c1.staticflickr.com/1/756/30901115623_e7cf5c0feb_q.jpg',
  ),
  DataFile.jlSapphie = new DataFile(
    'jl-sapphie', 'JL', 'サフィー', 'Sapphie',
    // https://www.flickr.com/photos/ohtake_tomohiro/9949531066/
    'https://c2.staticflickr.com/6/5447/9949531066_f8208d0926_q.jpg',
  ),
  DataFile.jlGarnet = new DataFile(
    'jl-garnet', 'JL', 'ガーネット', 'Garnet',
    // https://www.flickr.com/photos/ohtake_tomohiro/14661129166/
    'https://c2.staticflickr.com/4/3898/14661129166_8fbb0740de_q.jpg',
  ),
  DataFile.jlLabra = new DataFile(
    'jl-labra', 'JL', 'ラブラ', 'Labra',
    // https://www.flickr.com/photos/ohtake_tomohiro/11613918416/
    'https://c1.staticflickr.com/3/2823/11613918416_9f08436c62_q.jpg',
  ),
  DataFile.jlAngela = new DataFile(
    'jl-angela', 'JL', 'エンジェラ', 'Angela',
    // https://www.flickr.com/photos/ohtake_tomohiro/9656279138/
    'https://c1.staticflickr.com/3/2864/9656279138_488a2fc3ea_q.jpg',
  ),
  DataFile.jlJasper = new DataFile(
    'jl-jasper', 'JL', 'ジャスパー', 'Jasper',
    // https://www.flickr.com/photos/ohtake_tomohiro/8783847357/
    'https://c2.staticflickr.com/4/3822/8783847357_3ac439a015_q.jpg',
  ),
  DataFile.jlCharotte = new DataFile(
    'jl-charotte', 'JL', 'チャロット', 'Charotte',
    // https://www.flickr.com/photos/ohtake_tomohiro/13899465871/
    'https://c1.staticflickr.com/3/2927/13899465871_44857c623f_q.jpg',
  ),
  DataFile.jlRosa = new DataFile(
    'jl-rosa', 'JL', 'ローサ', 'Rosa',
    // https://www.flickr.com/photos/ohtake_tomohiro/8784665190/
    'https://c2.staticflickr.com/8/7294/8784665190_9f00aa10ca_q.jpg',
  ),
  DataFile.jlLuea = new DataFile(
    'jl-luea', 'JL', 'ルーア', 'Luea',
    // https://www.flickr.com/photos/ohtake_tomohiro/14834580258/
    'https://c2.staticflickr.com/6/5566/14834580258_1bae608a62_q.jpg',
  ),
  DataFile.jlLuna = new DataFile(
    'jl-luna', 'JL', 'ルナ', 'Luna',
    // https://www.flickr.com/photos/ohtake_tomohiro/21704083916/
    'https://c1.staticflickr.com/1/755/21704083916_c4541ac66a_q.jpg',
  ),
  DataFile.jlLarimar = new DataFile(
    'jl-larimar', 'JL', 'ラリマー', 'Larimar',
    // https://www.flickr.com/photos/ohtake_tomohiro/27947731372/
    'https://c2.staticflickr.com/8/7478/27947731372_c2342408de_q.jpg',
  ),
  DataFile.kiKirimi = new DataFile(
    'ki-kirimi', 'KI', 'きりみちゃん', 'Kirimi-chan',
    // https://www.flickr.com/photos/ohtake_tomohiro/22245218264/
    'https://c2.staticflickr.com/6/5758/22245218264_3b78fd1f86_q.jpg',
  ),
  DataFile.kiSaba = new DataFile(
    'ki-saba', 'KI', 'さばくん', 'Saba-kun',
    // https://www.flickr.com/photos/ohtake_tomohiro/16516747738/
    'https://c1.staticflickr.com/9/8581/16516747738_3b48875288_q.jpg',
  ),
  DataFile.kiSame = new DataFile(
    'ki-same', 'KI', 'サメせんぱい', 'Same-senpai',
    // https://www.flickr.com/photos/ohtake_tomohiro/21062320769/
    'https://c2.staticflickr.com/6/5628/21062320769_9cfaa521bd_q.jpg',
  ),
  DataFile.krKeroppi = new DataFile(
    'kr-keroppi', 'KR', 'けろっぴ', 'Keroppi',
    // https://www.flickr.com/photos/ohtake_tomohiro/9899607996/
    'https://c2.staticflickr.com/4/3665/9899607996_06ac4f8fa0_q.jpg',
  ),
  DataFile.krKeroleen = new DataFile(
    'kr-keroleen', 'KR', 'けろりーぬ', 'Keroleen',
    // https://www.flickr.com/photos/ohtake_tomohiro/12146042775/
    'https://c2.staticflickr.com/4/3833/12146042775_2db875c152_q.jpg',
  ),
  DataFile.ktKitty = new DataFile(
    'kt-kitty', 'KT', 'キティ', 'Kitty',
    // https://www.flickr.com/photos/ohtake_tomohiro/16492066909/
    'https://c1.staticflickr.com/9/8575/16492066909_3fcda0e4e4_q.jpg',
  ),
  DataFile.ktMimmy = new DataFile(
    'kt-mimmy', 'KT', 'ミミィ', 'Mimmy',
    // https://www.flickr.com/photos/ohtake_tomohiro/12611815833/
    'https://c2.staticflickr.com/4/3669/12611815833_3b5df2b753_q.jpg',
  ),
  DataFile.ktGeorge = new DataFile(
    'kt-george', 'KT', 'ジョージ', 'George',
    // https://www.flickr.com/photos/ohtake_tomohiro/11267932706/
    'https://c2.staticflickr.com/8/7412/11267932706_0fa0c3be17_q.jpg',
  ),
  DataFile.ktTinyChum = new DataFile(
    'kt-tiny_chum', 'KT', 'タイニーチャム', 'Tiny Chum',
    // https://www.flickr.com/photos/ohtake_tomohiro/14914616744/
    'https://c2.staticflickr.com/6/5615/14914616744_f9dbf8bb21_q.jpg',
  ),
  DataFile.lfMeroo = new DataFile(
    'lf-meroo', 'LF', 'めろぉ', 'Little Forest Fellow',
    // https://www.flickr.com/photos/ohtake_tomohiro/37013106492/
    'https://c1.staticflickr.com/5/4345/37013106492_29e0189365_q.jpg',
  ),
  DataFile.maMarron = new DataFile(
    'ma-marron', 'MA', 'マロン', 'Marroncream',
    // https://www.flickr.com/photos/ohtake_tomohiro/8920484088/
    'https://c2.staticflickr.com/8/7399/8920484088_2cc2d90ac8_q.jpg',
  ),
  DataFile.mfMoppu = new DataFile(
    'mf-moppu', 'MF', 'モップ', 'Marumofubiyori',
    // https://www.flickr.com/photos/ohtake_tomohiro/34310073122/
    'https://c1.staticflickr.com/5/4168/34310073122_913cbfdd04_q.jpg',
  ),
  DataFile.mmMelody = new DataFile(
    'mm-melody', 'MM', 'メロディ', 'My Melody',
    // https://www.flickr.com/photos/ohtake_tomohiro/36403930305/
    'https://c1.staticflickr.com/5/4403/36403930305_046b88a615_q.jpg',
  ),
  DataFile.mmUsamimiKamen = new DataFile(
    'mm-usamimi_kamen', 'MM', 'ウサミミ仮面', 'Usamimi Kamen',
    // https://www.flickr.com/photos/ohtake_tomohiro/14546836441/
    'https://c2.staticflickr.com/4/3860/14546836441_3867651b8c_q.jpg',
  ),
  DataFile.mpPiano = new DataFile(
    'mp-piano', 'MP', 'ピアノ', 'Piano',
    // https://www.flickr.com/photos/ohtake_tomohiro/14516998051/
    'https://c2.staticflickr.com/4/3858/14516998051_193a041d57_q.jpg',
  ),
  DataFile.mrMrMen = new DataFile(
    'mr-mr_men', 'MR', 'ミスターメン リトルミス', 'Mr. Men Little Miss',
    '',
  ),
  DataFile.mwMewkledreamy = new DataFile(
    'mw-mewkledreamy', 'MW', 'みゅー', 'Mewkledreamy',
    // https://www.flickr.com/photos/ohtake_tomohiro/38933531210/
    'https://c1.staticflickr.com/5/4798/38933531210_0db06e8b02_q.jpg',
  ),
  DataFile.nnNoraneko = new DataFile(
    'nn-noraneko', 'NN', 'クロ・トラ・ミケ', 'Noranekoland',
    // https://www.flickr.com/photos/ohtake_tomohiro/9329259725/
    'https://c1.staticflickr.com/3/2879/9329259725_57c2a9c460_q.jpg',
  ),
  DataFile.omMonkichi = new DataFile(
    'om-monkichi', 'OM', 'もんきち', 'Monkichi',
    // https://www.flickr.com/photos/ohtake_tomohiro/8815679895/
    'https://c2.staticflickr.com/8/7321/8815679895_2d371a9d73_q.jpg',
  ),
  DataFile.pcPochacco = new DataFile(
    'pc-pochacco', 'PC', 'ポチャッコ', 'Pochacco',
    // https://www.flickr.com/photos/ohtake_tomohiro/14753386901/
    'https://c1.staticflickr.com/3/2901/14753386901_f334102638_q.jpg',
  ),
  DataFile.pjPattyJimmy = new DataFile(
    'pj-patty_jimmy', 'PJ', 'パティ・ジミー', 'Patty & Jimmy',
    // https://www.flickr.com/photos/ohtake_tomohiro/15332619513/
    'https://c2.staticflickr.com/8/7472/15332619513_850410db88_q.jpg',
  ),
  DataFile.pkPokopon = new DataFile(
    'pk-pokopon', 'PK', 'ぽこぽん', 'Pokopon',
    // https://www.flickr.com/photos/ohtake_tomohiro/11486587094/
    'https://c2.staticflickr.com/4/3687/11486587094_569f84f7ca_q.jpg',
  ),
  DataFile.pkHana = new DataFile(
    'pk-hana', 'PK', '花', 'Hana',
    // https://www.flickr.com/photos/ohtake_tomohiro/8784935598/
    'https://c1.staticflickr.com/9/8271/8784935598_eccdc89f9b_q.jpg',
  ),
  DataFile.pnPurin = new DataFile(
    'pn-purin', 'PN', 'プリン', 'Pompompurin',
    // https://www.flickr.com/photos/ohtake_tomohiro/14771707617/
    'https://c2.staticflickr.com/4/3861/14771707617_2f9f4d367e_q.jpg',
  ),
  DataFile.rfLip = new DataFile(
    'rf-lip', 'RF', 'りっぷ', 'Lip',
    // https://www.flickr.com/photos/ohtake_tomohiro/28684162480/
    'https://c1.staticflickr.com/9/8053/28684162480_2a328e0696_q.jpg',
  ),
  DataFile.rfHimawari = new DataFile(
    'rf-himawari', 'RF', 'ひまわり', 'Himawari',
    // https://www.flickr.com/photos/ohtake_tomohiro/30741534082/
    'https://c2.staticflickr.com/6/5797/30741534082_5a6d12ccee_q.jpg',
  ),
  DataFile.rfSumire = new DataFile(
    'rf-sumire', 'RF', 'すみれ', 'Sumire',
    // https://www.flickr.com/photos/ohtake_tomohiro/36166420492/
    'https://c1.staticflickr.com/5/4375/36166420492_728617e8a8_q.jpg',
  ),
  DataFile.rfRose = new DataFile(
    'rf-rose', 'RF', 'ローズ', 'Rose',
    // https://www.flickr.com/photos/ohtake_tomohiro/33939672851/
    'https://c2.staticflickr.com/4/3955/33939672851_a0dff27489_q.jpg',
  ),
  DataFile.rfRin = new DataFile(
    'rf-rin', 'RF', 'りん', 'Rin',
    // https://www.flickr.com/photos/ohtake_tomohiro/34443923456/
    'https://c1.staticflickr.com/5/4185/34443923456_5343fb4a94_q.jpg',
  ),
  DataFile.rfSpica = new DataFile(
    'rf-spica', 'RF', 'スピカ', 'Spica',
    '',
  ),
  DataFile.siShirokuro = new DataFile(
    'si-shirokuro', 'SI', 'しろうさ・くろうさ', 'Shirousa & Kurousa',
    // https://www.flickr.com/photos/ohtake_tomohiro/14387901891/
    'https://c2.staticflickr.com/4/3916/14387901891_c3b756812b_q.jpg',
  ),
  DataFile.siMomohana = new DataFile(
    'si-momohana', 'SI', 'ももうさ・はなうさ', 'Momousa & Hanausa',
    // https://www.flickr.com/photos/ohtake_tomohiro/10113617364/
    'https://c2.staticflickr.com/4/3672/10113617364_3746095a60_q.jpg',
  ),
  DataFile.skStrawberryKing = new DataFile(
    'sk-strawberry_king', 'SK', 'いちごの王さま', 'Strawberry King',
    '',
  ),
  DataFile.szMenta = new DataFile(
    'sz-menta', 'SZ', 'メンタ', 'Shinkaizoku',
    // https://www.flickr.com/photos/ohtake_tomohiro/27518650642/
    'https://c2.staticflickr.com/8/7317/27518650642_3d631c2bf9_q.jpg',
  ),
  DataFile.taTabo = new DataFile(
    'ta-tabo', 'TA', 'たあ坊', 'Tabo',
    '',
  ),
  DataFile.tfTurfy = new DataFile(
    'tf-turfy', 'TF', 'ターフィー', 'Turfy',
    // https://www.flickr.com/photos/ohtake_tomohiro/26537496203/
    'https://c2.staticflickr.com/8/7723/26537496203_32e46680ca_q.jpg',
  ),
  DataFile.tpTinyPoem = new DataFile(
    'tp-tiny_poem', 'TP', 'さっちゃん', 'Tiny Poem',
    // https://www.flickr.com/photos/ohtake_tomohiro/10495659564/
    'https://c2.staticflickr.com/8/7390/10495659564_ab4960f63f_q.jpg',
  ),
  DataFile.tsKikiLala = new DataFile(
    'ts-kikilala', 'TS', 'キキ・ララ', 'Kiki & Lala',
    // https://www.flickr.com/photos/ohtake_tomohiro/34278547216/
    'https://c1.staticflickr.com/3/2853/34278547216_91403ea35f_q.jpg',
  ),
  DataFile.txSam = new DataFile(
    'tx-sam', 'TX', 'サム', 'Tuxedo Sam',
    // https://www.flickr.com/photos/ohtake_tomohiro/8794417176/
    'https://c2.staticflickr.com/6/5466/8794417176_313c011089_q.jpg',
  ),
  DataFile.usUsahana = new DataFile(
    'us-usahana', 'US', 'ウサハナ', 'Usahana',
    // https://www.flickr.com/photos/ohtake_tomohiro/35231231671/
    'https://c1.staticflickr.com/5/4245/35231231671_32d4e72ea1_q.jpg',
  ),
  DataFile.usUsahana = new DataFile(
    'va-eddy_emmy', 'VA', 'エディ・エミィ', 'Eddy & Emmy',
    // https://www.flickr.com/photos/ohtake_tomohiro/11267998663/
    'https://c2.staticflickr.com/6/5472/11267998663_4c1c04d0b0_q.jpg',
  ),
  DataFile.wiMell = new DataFile(
    'wi-mell', 'WI', 'メル', 'Mell',
    // https://www.flickr.com/photos/ohtake_tomohiro/15033242479/
    'https://c2.staticflickr.com/4/3883/15033242479_45ded95457_q.jpg',
  ),
  DataFile.xoBadtzmaru = new DataFile(
    'xo-badtzmaru', 'XO', 'ばつ丸', 'Badtz-Maru',
    // https://www.flickr.com/photos/ohtake_tomohiro/11150739286/
    'https://c2.staticflickr.com/6/5477/11150739286_bc5251bf3d_q.jpg',
  ),
  DataFile.xoTsunko = new DataFile(
    'xo-tsunko', 'XO', 'つん子', 'Tsunko',
    // https://www.flickr.com/photos/ohtake_tomohiro/14045681142/
    'https://c2.staticflickr.com/6/5270/14045681142_bb5acc9708_q.jpg',
  ),
  DataFile.xoPandaba = new DataFile(
    'xo-pandaba', 'XO', 'パンダバ', 'Pandaba',
    // https://www.flickr.com/photos/ohtake_tomohiro/11486667956/
    'https://c2.staticflickr.com/4/3686/11486667956_5bddc54c75_q.jpg',
  ),
];

const map = {};
DataFile.all.forEach((df) => {
  map[df.name] = df;
});
/**
 * @param {string} name e.g. kt-kitty
 * @returns {DataFile}
 */
DataFile.findByName = (name) => map[name];
