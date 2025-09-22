import type {
  AvatarFullConfig,
  EarSizeType,
  EyeBrowStyleType,
  EyeStyleType,
  GenConfigFunc,
  GlassesStyleType,
  HairStyleManType,
  HairStyleWomanType,
  HatStyleType,
  MouthStyleType,
  NoseStyleType,
  SexType,
  ShirtStyleType,
} from './types';
import {
  EarSize,
  EyeBrowStyle,
  EyeStyle,
  GlassesStyle,
  HairStyleMan,
  HairStyleWoman,
  HatStyle,
  MouthStyle,
  NoseStyle,
  Sex,
  ShirtStyle,
} from './types';

/**
 * Pick random one from the list
 */
interface PickRandomOpt<T> {
  avoidList?: T[];
  usually?: T[];
}
type PickRandomFromList = <T>(
  data: T[],
  opt?: PickRandomOpt<T | undefined>
) => T;
export const pickRandomFromList: PickRandomFromList = (
  data,
  { avoidList = [], usually = [] } = {}
) => {
  // Filter out avoid options
  const avoidSet = new Set(avoidList.filter((item) => Boolean(item)));
  let myData = data.filter((item) => !avoidSet.has(item));

  // Increase selecting possibility of usually options
  const usuallyData = usually
    .filter(Boolean)
    .reduce((acc, cur) => acc.concat(new Array(15).fill(cur)), [] as any[]);
  myData = myData.concat(usuallyData);

  // Pick randon one from the list
  const amount = myData.length;
  const randomIdx = Math.floor(Math.random() * amount);
  return myData[randomIdx];
};

/**
 * Gennerate avatar configurations
 */
interface DefaultOptions {
  sex: SexType[];
  faceColor: string[];
  earSize: EarSizeType[];
  hairColor: string[];
  hairStyleMan: HairStyleManType[];
  hairStyleWoman: HairStyleWomanType[];
  hatColor: string[];
  hatStyle: HatStyleType[];
  eyeBrowWoman: EyeBrowStyleType[];
  eyeStyle: EyeStyleType[];
  glassesStyle: GlassesStyleType[];
  noseStyle: NoseStyleType[];
  mouthStyle: MouthStyleType[];
  shirtStyle: ShirtStyleType[];
  shirtColor: string[];
  bgColor: string[];
  gradientBgColor: string[];
}
export const defaultOptions: DefaultOptions = {
  sex: Object.values(Sex),
  faceColor: ['#F9C9B6', '#AC6651'],
  earSize: Object.values(EarSize),
  hairColor: [
    '#000',
    '#fff',
    '#77311D',
    '#FC909F',
    '#D2EFF3',
    '#506AF4',
    '#F48150',
  ],
  hairStyleMan: Object.values(HairStyleMan),
  hairStyleWoman: Object.values(HairStyleWoman),
  hatColor: [
    '#000',
    '#fff',
    '#77311D',
    '#FC909F',
    '#D2EFF3',
    '#506AF4',
    '#F48150',
  ],
  hatStyle: Object.values(HatStyle),
  eyeBrowWoman: Object.values(EyeBrowStyle),
  eyeStyle: Object.values(EyeStyle),
  glassesStyle: Object.values(GlassesStyle),
  noseStyle: Object.values(NoseStyle),
  mouthStyle: Object.values(MouthStyle),
  shirtStyle: Object.values(ShirtStyle),
  shirtColor: ['#9287FF', '#6BD9E9', '#FC909F', '#F4D150', '#77311D'],
  bgColor: [
    '#9287FF',
    '#6BD9E9',
    '#FC909F',
    '#F4D150',
    '#E0DDFF',
    '#D2EFF3',
    '#FFEDEF',
    '#FFEBA4',
    '#506AF4',
    '#F48150',
    '#74D153',
  ],
  gradientBgColor: [
    'linear-gradient(45deg, #178bff 0%, #ff6868 100%)',
    'linear-gradient(45deg, #176fff 0%, #68ffef 100%)',
    'linear-gradient(45deg, #ff1717 0%, #ffd368 100%)',
    'linear-gradient(90deg, #36cd1c 0%, #68deff 100%)',
    'linear-gradient(45deg, #3e1ccd 0%, #ff6871 100%)',
    'linear-gradient(45deg, #1729ff 0%, #ff56f7 100%)',
    'linear-gradient(45deg, #56b5f0 0%, #45ccb5 100%)',
  ],
};
// =========================== start
const stringToHashCode = (str: string): number => {
  if (str.length === 0) return 0
  let hash = 0
  let char
  for (let i = 0; i < str.length; i++) {
    char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

type PickByHashCodeOpts = {
  avoidList?: string[],
  usually?: string[]
}
const pickByHashCode = (code: number, type: keyof DefaultOptions, opts?: PickByHashCodeOpts): string => {
  const avoidList = opts && opts.avoidList || []
  const usually = opts && opts.usually || []

  // Filter out avoid options
  const avoidSet = new Set<string>(avoidList)
  let myDefaultOptions = defaultOptions[type].filter(item => !avoidSet.has(item))

  // Increase selecting possibility of usually options
  myDefaultOptions = usually
    .filter(Boolean)
    .reduce(
      (acc, cur) => acc.concat(new Array(15).fill(cur)),
      [] as string[]
    )
    .concat(myDefaultOptions)

  const index = code % myDefaultOptions.length
  return myDefaultOptions[index]
}
// =========================== end
export const genConfig: GenConfigFunc = (userConfig = {}) => {
  const isSeedConfig = typeof userConfig === 'string'
  const hashCode = isSeedConfig && stringToHashCode(userConfig) || 0
  const response = {} as Required<AvatarFullConfig>;
  response.sex = isSeedConfig ? pickByHashCode(hashCode, 'sex') as SexType : (userConfig.sex || pickRandomFromList(defaultOptions.sex));
  response.faceColor = isSeedConfig ? pickByHashCode(hashCode, 'faceColor') : (userConfig.faceColor || pickRandomFromList(defaultOptions.faceColor));
  response.earSize =
    isSeedConfig
      ? pickByHashCode(hashCode, 'earSize') as EarSizeType
      : (userConfig.earSize || pickRandomFromList(defaultOptions.earSize));
  response.eyeStyle =
    isSeedConfig
      ? pickByHashCode(hashCode, 'eyeStyle') as EyeStyleType
      : (userConfig.eyeStyle || pickRandomFromList(defaultOptions.eyeStyle));
  response.noseStyle =
    isSeedConfig
      ? pickByHashCode(hashCode, 'noseStyle') as NoseStyleType
      : (userConfig.noseStyle || pickRandomFromList(defaultOptions.noseStyle));
  response.mouthStyle =
    isSeedConfig
      ? pickByHashCode(hashCode, 'mouthStyle') as MouthStyleType
      : (userConfig.mouthStyle || pickRandomFromList(defaultOptions.mouthStyle));
  response.shirtStyle =
    isSeedConfig
      ? pickByHashCode(hashCode, 'shirtStyle') as ShirtStyleType
      : (userConfig.shirtStyle || pickRandomFromList(defaultOptions.shirtStyle));
  response.glassesStyle =
    isSeedConfig
      ? pickByHashCode(hashCode, 'glassesStyle', { usually: ['none'] }) as GlassesStyleType
      : (userConfig.glassesStyle ||
        pickRandomFromList(defaultOptions.glassesStyle, { usually: ['none'] }));

  // Hair
  let hairColorAvoidList: string[] = [];
  let hairColorUsually: string[] = [];
  if (isSeedConfig || !userConfig.hairColor) {
    switch (response.sex) {
      case 'woman': {
        hairColorAvoidList =
          (response.faceColor === defaultOptions.faceColor[1] && ['#77311D']) ||
          [];
        break;
      }
      case 'man': {
        hairColorUsually = ['#000'];
      }
    }
  }
  response.hairColor =
    isSeedConfig
      ? pickByHashCode(hashCode, 'hairColor', {
        avoidList: hairColorAvoidList,
        usually: hairColorUsually
      })
      : (userConfig.hairColor ||
        pickRandomFromList(defaultOptions.hairColor, {
          avoidList: hairColorAvoidList,
          usually: hairColorUsually,
        }));

  if (isSeedConfig || !userConfig.hairStyle) {
    switch (response.sex) {
      case 'man': {
        response.hairStyle =
          isSeedConfig
            ? (pickByHashCode(hashCode, 'hairStyleMan', {
              usually: ["normal", "thick"]
            })) as HairStyleManType
            : (pickRandomFromList(defaultOptions.hairStyleMan, {
              usually: ['normal', 'thick'],
            }));
        break;
      }
      case 'woman': {
        response.hairStyle =
          isSeedConfig
            ? pickByHashCode(hashCode, 'hairStyleWoman') as HairStyleWomanType
            : (pickRandomFromList(defaultOptions.hairStyleWoman));
        break;
      }
    }
  } else {
    response.hairStyle = userConfig.hairStyle;
  }

  // Hat
  response.hatStyle = isSeedConfig
    ? pickByHashCode(hashCode, 'hatStyle', { usually: ["none"] }) as HatStyleType
    : (userConfig.hatStyle ||
      pickRandomFromList(defaultOptions.hatStyle, { usually: ['none'] }));
  response.hatColor = isSeedConfig
    ? pickByHashCode(hashCode, 'hatColor')
    : (userConfig.hatColor || pickRandomFromList(defaultOptions.hatColor));
  const _hairOrHatColor =
    (response.hatStyle === 'none' && response.hairColor) || response.hatColor;

  // Eyebrow
  if (!isSeedConfig && userConfig.eyeBrowStyle) {
    response.eyeBrowStyle = userConfig.eyeBrowStyle;
  } else {
    response.eyeBrowStyle =
      response.sex === 'woman'
        ? isSeedConfig
          ? pickByHashCode(hashCode, 'eyeBrowWoman') as EyeBrowStyleType
          : pickRandomFromList(defaultOptions.eyeBrowWoman)
        : 'up';
  }

  // Shirt color
  response.shirtColor = isSeedConfig
    ? pickByHashCode(hashCode, 'shirtColor', { avoidList: [_hairOrHatColor] })
    : (userConfig.shirtColor ||
      pickRandomFromList(defaultOptions.shirtColor, {
        avoidList: [_hairOrHatColor],
      }));

  // Background color
  if (!isSeedConfig && userConfig.isGradient) {
    response.bgColor =
      userConfig.bgColor || pickRandomFromList(defaultOptions.gradientBgColor);
  } else {
    response.bgColor = isSeedConfig
      ? pickByHashCode(hashCode, 'bgColor', { avoidList: [_hairOrHatColor, response.shirtColor] })
      : (userConfig.bgColor ||
        pickRandomFromList(defaultOptions.bgColor, {
          avoidList: [_hairOrHatColor, response.shirtColor],
        }));
  }

  return response;
};
