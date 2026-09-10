import * as Hangul from "hangul-js";

import { assemble } from "es-hangul";

const char2code = (char: string) => char.charCodeAt(0);

const cho = [
  "ㄱ",
  "ㄲ",
  "ㄴ",
  "ㄷ",
  "ㄸ",
  "ㄹ",
  "ㅁ",
  "ㅂ",
  "ㅃ",
  "ㅅ",
  "ㅆ",
  "ㅇ",
  "ㅈ",
  "ㅉ",
  "ㅊ",
  "ㅋ",
  "ㅌ",
  "ㅍ",
  "ㅎ",
];
const jung = [
  "ㅏ",
  "ㅐ",
  "ㅑ",
  "ㅒ",
  "ㅓ",
  "ㅔ",
  "ㅕ",
  "ㅖ",
  "ㅗ",
  "ㅘ",
  "ㅙ",
  "ㅚ",
  "ㅛ",
  "ㅜ",
  "ㅝ",
  "ㅞ",
  "ㅟ",
  "ㅠ",
  "ㅡ",
  "ㅢ",
  "ㅣ",
];
const jong = [
  "",
  "ㄱ",
  "ㄲ",
  "ㄳ",
  "ㄴ",
  "ㄵ",
  "ㄶ",
  "ㄷ",
  "ㄹ",
  "ㄺ",
  "ㄻ",
  "ㄼ",
  "ㄽ",
  "ㄾ",
  "ㄿ",
  "ㅀ",
  "ㅁ",
  "ㅂ",
  "ㅄ",
  "ㅅ",
  "ㅆ",
  "ㅇ",
  "ㅈ",
  "ㅊ",
  "ㅋ",
  "ㅌ",
  "ㅍ",
  "ㅎ",
];
const ga = 44032;

export function disassemble(char: string): (string | undefined)[] {
  let uni = char2code(char);
  if (uni >= char2code("ㄱ") && uni <= char2code("ㅎ")) {
    return [char, undefined, undefined];
  } else if (uni >= char2code("ㅏ") && uni <= char2code("ㅣ")) {
    return [undefined, char, undefined];
  }
  uni = uni - ga;
  const fn = Math.floor(uni / 588);
  const sn = Math.floor((uni - fn * 588) / 28);
  const tn = uni % 28;
  return [cho[fn], jung[sn], jong[tn]];
}

const banjeonMap: { [key: string]: string } = {
  ㅏ: "ㅓ",
  ㅑ: "ㅕ",
  ㅓ: "ㅏ",
  ㅕ: "ㅑ",
  ㅗ: "ㅜ",
  ㅛ: "ㅠ",
  ㅜ: "ㅗ",
  ㅠ: "ㅛ",
};

function noDu(char: string) {
  return [char];
}
const noDu_rev = noDu;

function std(char: string) {
  const [cho, jung, jong] = disassemble(char);
  if (cho === "ㄹ" && ["ㅕ", "ㅛ", "ㅠ", "ㅣ","ㅖ","ㅒ","ㅑ"].includes(jung!))
    return [char, assemble(["ㅇ", jung!, jong!])];
  else if (cho === "ㄹ")
    return [char, assemble(["ㄴ", jung!, jong!])];
  else if (cho === "ㄴ" && ["ㅕ", "ㅛ", "ㅠ", "ㅣ","ㅖ","ㅒ","ㅑ"].includes(jung!))
    return [char, assemble(["ㅇ", jung!, jong!])];
  else return [char];
}// 원형(두음) -> 표준형 매핑
const stdRevMap: { [key: string]: string } = {
  라: "나",
  락: "낙",
  란: "난",
  랄: "날",
  람: "남",
  랍: "납",
  랑: "낭",
  래: "내",
  랭: "냉",
  냑: "약",
  략: "약",
  냥: "양",
  량: "양",
  녀: "여",
  려: "여",
  녁: "역",
  력: "역",
  년: "연",
  련: "연",
  녈: "열",
  렬: "열",
  념: "염",
  렴: "염",
  렵: "엽",
  녕: "영",
  령: "영",
  녜: "예",
  례: "예",
  로: "노",
  록: "녹",
  론: "논",
  롱: "농",
  뢰: "뇌",
  뇨: "요",
  료: "요",
  룡: "용",
  루: "누",
  뉴: "유",
  류: "유",
  뉵: "육",
  륙: "육",
  륜: "윤",
  률: "율",
  륭: "융",
  륵: "늑",
  름: "늠",
  릉: "능",
  니: "이",
  리: "이",
  린: "인",
  림: "임",
};

function std_rev(char: string) {
  const converted = stdRevMap[char];
  if (converted) return [char, converted];
  return [char];
}

function oneWay(char: string) {
  const [cho, jung, jong] = disassemble(char);
  if (cho === "ㄹ")
    return [
      char,
      assemble(["ㄴ", jung!, jong!]),
      assemble(["ㅇ", jung!, jong!]),
    ];
  else if (cho === "ㄴ") return [char, assemble(["ㅇ", jung!, jong!])];
  else return [char];
}
function oneWay_rev(char: string) {
  const [cho, jung, jong] = disassemble(char);

  if (cho === "ㅇ")
    return [
      char,
      assemble(["ㄴ", jung!, jong!]),
      assemble(["ㄹ", jung!, jong!]),
    ];
  else if (cho === "ㄴ") return [char, assemble(["ㄹ", jung!, jong!])];
  else return [char];
}

function twoWay(char: string) {
  const [cho, jung, jong] = disassemble(char);
  if (cho === "ㄹ" || cho === "ㄴ" || cho === "ㅇ")
    return [
      assemble(["ㄹ", jung!, jong!]),
      assemble(["ㄴ", jung!, jong!]),
      assemble(["ㅇ", jung!, jong!]),
    ];
  else return [char];
}
const twoWay_rev = twoWay;

function banjeon(char: string) {
  const [cho, jung, jong] = disassemble(char);
  const result = std(char);

  if (jung && jung in banjeonMap)
    result.push(assemble([cho!, banjeonMap[jung], jong!]));

  return result;
}
const banjeon_rev = banjeon;

function chanRule(char: string) {
  const [cho, jung, jong] = disassemble(char);

  if (cho && jong && Hangul.isJong(cho) && Hangul.isCho(jong) && cho !== jong)
    return [char, assemble([jong, jung!, cho])];
  else return [char];
}
const chanRule_rev = chanRule;

function dpRule(char: string) {
  const [cho, jung, jong] = disassemble(char);
  let choChan: (string | undefined)[];

  if (cho === "ㄹ" || cho === "ㄴ" || cho === "ㅇ") {
    choChan = ["ㄹ", "ㄴ", "ㅇ"];
  } else {
    choChan = [cho];
  }
  let jongChan: (string | undefined)[];
  if (jong === "ㄹ" || jong === "ㄴ" || jong === "ㅇ") {
    jongChan = ["ㄹ", "ㄴ", "ㅇ"];
  } else {
    jongChan = [jong];
  }

  const result: string[] = [];
  for (const chan1 of choChan) {
    for (const chan2 of jongChan) {
      result.push(assemble([chan1!, jung!, chan2!]));
    }
  }
  return result;
}
const dpRule_rev = dpRule;

function forceStd(char: string) {
  const stdChan = std(char);
  if (stdChan.length >= 2) return stdChan.slice(1);
  else return stdChan;
}
function forceStd_rev(char: string) {
  const [cho, jung] = disassemble(char);
  const stdRevChan = std_rev(char);
  if (stdRevChan.length >= 2) return stdRevChan;
  else if (cho === "ㄹ" && ["ㅑ", "ㅕ", "ㅛ", "ㅠ", "ㅣ", "ㅖ"].includes(jung!))
    return [];
  else if (cho === "ㄹ" && ["ㅏ", "ㅐ", "ㅗ", "ㅜ", "ㅡ", "ㅚ"].includes(jung!))
    return [];
  else if (cho === "ㄴ" && ["ㅕ", "ㅛ", "ㅠ", "ㅣ"].includes(jung!)) return [];
  else return stdRevChan;
}

const revStd = std_rev;
const revStd_rev = std;

function forceRevStd(char: string) {
  const revStdChan = revStd(char);
  if (revStdChan.length >= 2) return revStdChan.slice(1);
  else return revStdChan;
}
function forceRevStd_rev(char: string) {
  const [cho, jung] = disassemble(char);
  const revStdRevChan = revStd_rev(char);
  if (revStdRevChan.length >= 2) return revStdRevChan;
  else if (cho === "ㅇ" && ["ㅑ", "ㅕ", "ㅛ", "ㅠ", "ㅣ", "ㅖ"].includes(jung!))
    return [];
  else if (cho === "ㄴ" && ["ㅏ", "ㅐ", "ㅗ", "ㅜ", "ㅡ", "ㅚ"].includes(jung!))
    return [];
  else if (cho === "ㅇ" && ["ㅕ", "ㅛ", "ㅠ", "ㅣ"].includes(jung!)) return [];
  else return revStdRevChan;
}

function roblox(char: string) {
  if (char === "름") return [char, "늠", "음"];
  const [cho, jung, jong] = disassemble(char);
  if (cho === "ㄹ" && ["ㅑ", "ㅕ", "ㅛ", "ㅠ", "ㅣ", "ㅖ"].includes(jung!))
    return [char, assemble(["ㅇ", jung!, jong!])];
  else if (cho === "ㄹ" && ["ㅏ", "ㅐ", "ㅗ", "ㅜ", "ㅡ", "ㅚ"].includes(jung!))
    return [char, assemble(["ㄴ", jung!, jong!])];
  else if (cho === "ㄴ" && ["ㅕ", "ㅛ", "ㅠ", "ㅣ"].includes(jung!))
    return [char, assemble(["ㅇ", jung!, jong!])];
  else if (cho === "ㄹ") return [char, assemble(["ㅇ", jung!, jong!])];
  else return [char];
}

function roblox_rev(char: string) {
  if (char === "음") return [char, "름"];
  const [cho, jung, jong] = disassemble(char);

  if (cho === "ㅇ" && ["ㅑ", "ㅖ"].includes(jung!))
    return [char, assemble(["ㄹ", jung!, jong!])];
  else if (cho === "ㄴ" && ["ㅏ", "ㅐ", "ㅗ", "ㅜ", "ㅡ", "ㅚ"].includes(jung!))
    return [char, assemble(["ㄹ", jung!, jong!])];
  else if (cho === "ㅇ" && ["ㅕ", "ㅛ", "ㅠ", "ㅣ"].includes(jung!))
    return [
      char,
      assemble(["ㄴ", jung!, jong!]),
      assemble(["ㄹ", jung!, jong!]),
    ];
  else if (
    cho === "ㅇ" &&
    !["ㅏ", "ㅐ", "ㅗ", "ㅜ", "ㅡ", "ㅚ"].includes(jung!)
  )
    return [char, assemble(["ㄹ", jung!, jong!])];
  else return [char];
}

export const sampleChangeFuncs = [
  // 0 : 없음
  {
    forward: noDu,
    backward: noDu_rev,
  },
  // 1 : 표준
  {
    forward: std,
    backward: std_rev,
  },

  // 2 : 강제표준두음
  {
    forward: forceStd,
    backward: forceStd_rev,
  },

  // 3 : 역표준두음
  {
    forward: revStd,
    backward: revStd_rev,
  },
  // 4 : 강제역표준두음
  {
    forward: forceRevStd,
    backward: forceRevStd_rev,
  },
  // 5 : ㄹ->ㄴ->ㅇ
  { forward: oneWay, backward: oneWay_rev },
  // 6 : ㄹ<->ㄴ<->ㅇ
  {
    forward: twoWay,
    backward: twoWay_rev,
  },
  // 7 : 반전룰
  {
    forward: banjeon,
    backward: banjeon_rev,
  },

  // 8 : 챈룰
  {
    forward: chanRule,
    backward: chanRule_rev,
  },
  // 9 : 듭2룰
  {
    forward: dpRule,
    backward: dpRule_rev,
  },
  // 10 : 로블록스룰
  {
    forward: roblox,
    backward: roblox_rev,
  },
];

export const sampleChangeFuncInfo = [
  { title: "없음" },
  { title: "표준두음법칙" },
  {
    title: "강제표준두음법칙",
  },
  {
    title: "역표준두음법칙",
  },
  {
    title: "강제역표준두음",
  },
  {
    title: "자유두음법칙",
  },
  {
    title: "양방향자유두음법칙",
  },
  {
    title: "모음반전",
  },
  {
    title: "자음반전",
  },
  {
    title: "초성종성자유두음법칙",
  },
  {
    title: "로블록스 한국 끝말잇기 두음법칙",
  },
];
