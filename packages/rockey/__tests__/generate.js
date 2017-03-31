import { styles } from './parse';

import parse from '../lib/css/parse';
import generateCss from '../lib/css/generateCss';
import * as getClassNameModule from '../lib/css/getClassName';

const getClassName = getClassNameModule.default;

console.warn = jest.fn();

const classname = className => `.${className}`;

describe('generate css', () => {
  it('empty', () => {
    const generated = generateCss(parse(styles.empty));
    expect(generated.css).toEqual({});
  });

  it('onlyStyles', () => {
    expect(() => generateCss(parse(styles.onlyStyles))).toThrow(
      '(generate css) root tree should not contain styles'
    );
  });

  it('withComponents', () => {
    const generated = generateCss(parse(styles.withComponents));
    const classNameMap = generated.classNameMap;

    expect(generated.css).toEqual({
      [classname(classNameMap.Button)]: {
        color: 'red',
      },
    });
  });

  it('withNestedComponents', () => {
    const generated = generateCss(parse(styles.withNestedComponents));
    const classNameMap = generated.classNameMap;

    expect(generated.css).toEqual({
      [classname(classNameMap.Button)]: {
        color: 'red',
      },
      [`${classname(classNameMap.Button)} ${getClassName('Icon')}`]: {
        color: 'blue',
      },
    });
  });

  it('withModificators', () => {
    const generated = generateCss(parse(styles.withModificators));
    const classNameMap = generated.classNameMap;

    expect(generated.css).toEqual({
      [classname(classNameMap.Button)]: {
        color: 'red',
      },
      [`${classname(classNameMap.Button)}:hover`]: {
        color: 'purple',
      },
      [`${classname(classNameMap.Button)}::before`]: {
        width: '16px',
      },
      [`${classname(classNameMap.Button)} ${getClassName('Icon')}`]: {
        color: 'blue',
      },
    });
  });

  it('withComponentsInsideModificators', () => {
    const generated = generateCss(
      parse(styles.withComponentsInsideModificators)
    );
    const classNameMap = generated.classNameMap;

    expect(generated.css).toEqual({
      [classname(classNameMap.Button)]: {
        color: 'red',
      },
      [`${classname(classNameMap.Button)}:hover`]: {
        color: 'purple',
      },
      [`${classname(classNameMap.Button)}:hover ${getClassName('Icon')}`]: {
        color: 'blue',
      },
    });
  });

  it('withModificatorsInsideComponents', () => {
    const generated = generateCss(
      parse(styles.withModificatorsInsideComponents)
    );
    const classNameMap = generated.classNameMap;

    expect(generated.css).toEqual({
      [classname(classNameMap.Button)]: {
        color: 'red',
      },
      [`${classname(classNameMap.Button)} ${getClassName('Icon')}`]: {
        color: 'blue',
      },
      [`${classname(classNameMap.Button)} ${getClassName('Icon')}:hover`]: {
        color: 'purple',
      },
    });
  });

  it('withModificatorsInsideComponents', () => {
    const generated = generateCss(
      parse(styles.withModificatorsInsideComponents)
    );
    const classNameMap = generated.classNameMap;

    expect(generated.css).toEqual({
      [classname(classNameMap.Button)]: {
        color: 'red',
      },
      [`${classname(classNameMap.Button)} ${getClassName('Icon')}`]: {
        color: 'blue',
      },
      [`${classname(classNameMap.Button)} ${getClassName('Icon')}:hover`]: {
        color: 'purple',
      },
    });
  });

  it('withMedia', () => {
    const generated = generateCss(parse(styles.withMedia));
    const classNameMap = generated.classNameMap;

    expect(generated.css).toEqual({
      [classname(classNameMap.Button)]: {
        color: 'red',
      },
      [`${classname(classNameMap.Button)} ${getClassName('Icon')}`]: {
        color: 'blue',
      },
      [`${classname(classNameMap.Button)} ${getClassName('Icon')}:hover`]: {
        color: 'purple',
      },
      '@media (max-width: 699px)': {
        [`${classname(classNameMap.Button)} ${getClassName('Icon')}`]: {
          background: 'green',
        },
        [`${classname(classNameMap.Button)} ${getClassName('Icon')}:hover`]: {
          color: 'purple',
        },
      },
      '@media screen and (max-width: 699px) and (min-width: 520px)': {
        [classname(classNameMap.Button)]: {
          background: 'yellow',
        },
      },
    });
  });

  it('multipleMediaAtOneLevel', () => {
    const generated = generateCss(parse(styles.multipleMediaAtOneLevel));
    const classNameMap = generated.classNameMap;

    expect(generated.css).toEqual({
      '@media (max-width: 699px)': {
        [classname(classNameMap.Button)]: {
          background: 'green',
        },
        [classname(classNameMap.Button2)]: {
          background: 'blue',
        },
        [`${classname(classNameMap.Button)}:hover`]: {
          color: 'green',
        },
        [`${classname(classNameMap.Button2)}:hover`]: {
          color: 'blue',
        },
      },
    });
  });

  it('withFallbackValues', () => {
    const generated = generateCss(parse(styles.withFallbackValues));
    const classNameMap = generated.classNameMap;

    expect(generated.css).toEqual({
      [classname(classNameMap.Button)]: {
        color: ['rgba(0, 255, 0, 0.3)', '#00ff00'],
      },
    });
  });

  it('withKeyframes', () => {
    let animationCounter = 0;

    const originalGenerateAnimationName = getClassNameModule.generateAnimationName;
    getClassNameModule.generateAnimationName = animationName => {
      return `${animationName}-a${++animationCounter}`;
    };

    const generated = generateCss(parse(styles.withKeyframes));
    const classNameMap = generated.classNameMap;

    expect(generated.css).toEqual({
      [classname(classNameMap.Button)]: {
        animation: 'example-first-a1 1s infinity',
      },

      [classname(classNameMap.Button2)]: {
        'animation-duraiton': '1s',
        'animation-iteration-count': 'infinity',
        'animation-name': 'example-second-a2',
      },

      '@keyframes example-first-a1': {
        '0%': { color: 'red' },
        '50%': { color: 'yellow' },
        '100%': { color: 'red' },
      },

      '@keyframes example-second-a2': {
        '0%': { color: 'purple' },
        '100%': { color: 'black' },
      },
    });

    getClassNameModule.generateAnimationName = originalGenerateAnimationName;
  });

  it('withTagSelectors', () => {
    const generated = generateCss(parse(styles.withTagSelectors));
    const classNameMap = generated.classNameMap;

    expect(generated.css).toEqual({
      [classname(classNameMap.Button)]: {
        color: 'red',
      },
      [`${classname(classNameMap.Button)} span.text`]: {
        color: 'black',
      },
      [`${classname(classNameMap.Button)} div#hardcode`]: {
        color: 'white',
      },
    });
  });

  it('withMostModificators', () => {
    const generated = generateCss(parse(styles.withMostModificators));
    const classNameMap = generated.classNameMap;

    expect(generated.css).toEqual({
      [classname(classNameMap.Button)]: {
        color: 'red',
      },
      [`${classname(classNameMap.Button)}::first-line`]: {
        'background-color': 'yellow',
      },
      [`${classname(classNameMap.Button)}:disabled`]: {
        color: 'green',
      },
      [`${classname(classNameMap.Button)}:hover`]: {
        color: 'blue',
      },
      [`${classname(classNameMap.Button)}::after`]: {
        color: 'purple',
      },
      [`${classname(classNameMap.Button)}:nth-child(2)`]: {
        color: 'white',
      },
      [`${classname(classNameMap.Button)}:not(.hardcodeClass)`]: {
        color: 'yellow',
      },
      [`${classname(classNameMap.Button)}:not(${getClassName('Icon')})`]: {
        color: 'orange',
      },
    });
  });
});

test('generate: customStyles', () => {
  const generated = generateCss(
    parse(
      `
    Button {
      font-size: 14px;
      line-height: 36px;
      box-sizing: border-box;
      text-transform: uppercase;
      border-radius: 3px;
      user-select: none;
      border: 0;
      font-weight: 500;
      letter-spacing: .010em;
      outline: 0;
      cursor: pointer;
      overflow: hidden;
      display: inline-block;
      white-space: nowrap;
      padding: 0 6px;
      margin: 6px 8px;
      min-height: 36px;
      min-width: 88px;
      text-align: center;
      transition:
        box-shadow .4s cubic-bezier(.25,.8,.25,1),
        background-color .4s cubic-bezier(.25,.8,.25,1);

      background: transparent;

      :not(:disabled):hover {
        background-color: transparent
      }

      :focus {
        outline: 0;
      }

      :disabled {
        color: #ccc;
        background: transparent;
      }
    }
  `
    )
  );

  expect(generated.css).toEqual({
    [classname(generated.classNameMap.Button)]: {
      background: 'transparent',
      border: '0',
      'border-radius': '3px',
      'box-sizing': 'border-box',
      cursor: 'pointer',
      display: 'inline-block',
      'font-size': '14px',
      'font-weight': '500',
      'letter-spacing': '.010em',
      'line-height': '36px',
      margin: '6px 8px',
      'min-height': '36px',
      'min-width': '88px',
      outline: '0',
      overflow: 'hidden',
      padding: '0 6px',
      'text-align': 'center',
      'text-transform': 'uppercase',
      transition: 'box-shadow .4s cubic-bezier(.25,.8,.25,1),        background-color .4s cubic-bezier(.25,.8,.25,1)',
      'user-select': 'none',
      'white-space': 'nowrap',
    },
    [classname(generated.classNameMap.Button) + ':disabled']: {
      background: 'transparent',
      color: '#ccc',
    },
    [classname(generated.classNameMap.Button) + ':focus']: {
      outline: '0',
    },
    [classname(generated.classNameMap.Button) + ':not(:disabled):hover']: {
      'background-color': 'transparent',
    },
  });
});
