# Rockey React

<img src="http://i.imgur.com/ULoeOL4.png" height="16"/> [CSS in JS. Rockey](https://medium.com/@tuchk4/css-in-js-rockey-890ebbbd16e7)

```bash
npm i --save rockey-react
```

![Rockey tests](https://api.travis-ci.org/tuchk4/rockey.svg?branch=master) ![rockey-react gzip size](http://img.badgesize.io/https://unpkg.com/rockey-react@0.0.12/rockey-react.min.js?compression=gzip&label=rockey%20react%20gzip)

## Api

- [Flexible Rockey Higher Order Component](#flexible-rockey-higher-order-component)
- [Shortcuts](#shortcuts)
- [Dynamic CSS — props](#dynamic-cssprops)
- [Dynamic CSS — Event Handlers](#dynamic-csseventhandlers)
- [Looks](#looks)
- [Recompose shortcut](#recompose-shortcut)
- [Examples](#examples)

### Flexible Rockey Higher Order Component

```js
import rockey from 'rocket-react';

const Component = rockey(BaseComponent)`
  color: green;
`;
```

Now *Component* could be used as React component:

```js
<Component/>
```

Or extend it and create anonymous child component with additional styles:

```js
const Child = Component`
  text-decoration: underline;
`;
```

By default *rockey-react* try to use *BaseComponent.displayName* to generate classname. But sometimes it is more useful to set name manually.

```js
const Child = Component('MySuperChild')`
  text-decoration: underline;
`;
```


#### Shortcuts

Available all valid html tags. Create anonymus component from shortcuts:

```js
import rockey from 'rockey-react';

const Block = rockey.div`
  padding: 5px;
  border: 1px solid #000;
`;
```

Create named component from shortcuts:

```js
import rockey from 'rockey-react';

const Block = rockey.div('Block')`
  padding: 5px;
  border: 1px solid #000;
`;
```

### Dynamic CSS — props

```js
import when from 'rockey/when';
```

Write CSS that depends on components props. Same as [rockey.when](https://github.com/tuchk4/rockey/tree/master/packages/rockey#when)

Demo: [Buttons look with mixins](https://www.webpackbin.com/bins/-Kiu3e_2HuGQx3vtnf0m)

```js
const Button = rockey.div`
   color: black;
   ${when('isPrimary', props => props.primary)`
     color: green;
   `}

   font-size: ${props => `${0.9 * props.scale}em`};
`;
```

### Dynamic CSS — Event Handlers

```js
import handler from 'rockey-react/handler';
```

Write CSS mixins that are triggered along with events handlers.

Demos:
- [Input styles for specific value](https://www.webpackbin.com/bins/-Ki22k9ewZ6gh3Rw87d-)
- [Div background depends on mouse X and Y](https://www.webpackbin.com/bins/-Ki1G10UY-sXlden2XSS)

```js
import rockey from 'rockey-react';

const Input = rockey.input`
  font-size: 25px;
  border: none;
  border-bottom: 2px solid #000;
  padding: 0 0 5px 0;
  outline: none;
  font-family: monospace;
  ${rockey.handler('onChange', e => e.target.value === 'rockey')`
    color: green;
  `}
`;
```

### Looks

Split component into different looks.

Demos:
- [Buttons look](https://www.webpackbin.com/bins/-Ki4mYd1WoxNaYl5pH1I)
- [Card and PrimaryCard look](https://www.webpackbin.com/bins/-KfkcTYPzpyglHKfmuKh)

Most component features could be implemented as component’s prop or as Higher Order Component.

```js
<Button primary={true}>I am m Button</Button>
<PrimaryButton>I am PrimaryButton</PrimaryButton>
```

There is the approach that helps to make more correct decision what approach use

| Button   | raised | disabled  | success | warning | primary | ripple |
| ---------|--------|-----------|---------|---------|---------|--------|   
| raised   |   -    |     ✅    |   ✅    |   ✅    |   ✅      |   ✅    |
| disabled |   ✅   |     -     |   ✅    |   ✅    |   ✅      |   ✅    |
| success  |   ✅   |     ✅     |   -    |   ❌    |   ❌      |    ✅    |
| warning  |   ✅   |     ✅     |   ❌    |   -    |   ❌      |   ✅    |
| primary  |   ✅   |     ✅     |   ❌    |   ❌    |  -       |    ✅    |
| ripple   |   ✅   |     ✅     |   ✅    |   ✅    |   ✅      |   -    |

- *ripple* - could be used in any state. So it should be used as prop.
- *disabled* - could be used in any state. So it should be used as prop.
- *success* - could **NOT*** be used along with *warning* and *primary*. So it should be implemented as Higher Order Component.
- and so on.

If there is no ❌ — feature should be implemented as props. If there is a least one ❌ — feature should be implemented as Higher Order Component.

And rockey *look* feature helps with this.

```js
import look from 'rockey-react/look';

const { Button, PrimaryButton, SuccessButton } = look.button`
  Button {
    padding: 5px;
    background: none;
  }

  PrimaryButton {
    color: blue;
  }

  SuccessButton {
    color: green;
  }
`;
```

This is the same as:

```js
import rockey from 'rockey-react';

const Button = rockey.button`
  padding: 5px;
  background: none;
`;

const PrimryButton = Button('PrimryButton')`
  color: blue;
`;

const SuccessButton = Button('SuccessButton')`
  color: green;
`;
```

Demos:

> NOTE: difference only in generated CSS class names

- [Named Extending: raised Button / PrimaryButton / SuccessButton](https://www.webpackbin.com/bins/-Ki4zp8QqriEj4VSKgvg)
- [Anonymous Extending: raised Button / PrimaryButton / SuccessButton](https://www.webpackbin.com/bins/-Ki0oy6hS3vdQZluouKZ)

or:

```js
import rockey from 'rockey-react';

const Button = rockey.button`
  padding: 5px;
  background: none;
`;

const { PrimaryButton, SuccessButton } = Button.look`
  PrimaryButton {
    color: blue;
  }

  SuccessButton {
    color: green;
  }
`;

<PrimaryButton />
// or
<Button.PrimaryButton />
```

### Recompose shortcut

```js
import recompose from 'rockey-react/recompose';
```

Currently we use recompose in each React application. Recompose helps to write less code and share features between components. This shortcut helps to save time and code when using rockey + recompose. 
Great thanks to Andrew Clark for [recompose](https://github.com/acdlite/recompose)!

```js
import rockempose from 'rockey-react/recompose';
import withProps from 'recompose/withProps';

const Line = rockempose.span(
  withProps(props => ({
    long: props.value && props.value.length > 140
  }))
)`
  font-size: 15px;

  ${when(props => props.long)`
    font-size: 10px;
  `}
`;
```

# Examples

- [Card example](https://www.webpackbin.com/bins/-KfkcTYPzpyglHKfmuKh)
- [Warning Card example](https://www.webpackbin.com/bins/-Ki-AMdS7Q0bzkSyZ81f)
- [Buttons look with mixins](https://www.webpackbin.com/bins/-Kiu3e_2HuGQx3vtnf0m)
- [Buttons example](https://www.webpackbin.com/bins/-KflMmHbcVU01PD6h43F)
- [Button / PrimaryButton / SuccessButton with raised mixin](https://www.webpackbin.com/bins/-Ki2_Te-1y_OiIbQB5bO)
- [Buttons look](https://www.webpackbin.com/bins/-Ki4mYd1WoxNaYl5pH1I)
- [Anonymous Extending: raised Button / PrimaryButton / SuccessButton](https://www.webpackbin.com/bins/-Ki0oy6hS3vdQZluouKZ)
- [Anonymous Buttons example](https://www.webpackbin.com/bins/-Ki-Jk6OoMnFSFshKib6)
- [Material TextField](https://www.webpackbin.com/bins/-Ki-KJQAQOJEmTECJUoE)
- [Primary and Raised Blocks](https://www.webpackbin.com/bins/-KflpZuJTEet-ECpPpWE)
- [Input styles for specific value](https://www.webpackbin.com/bins/-Ki22k9ewZ6gh3Rw87d-)
- [Div background depends on mouse X and Y](https://www.webpackbin.com/bins/-Ki1G10UY-sXlden2XSS)
- [Animated divs](https://www.webpackbin.com/bins/-KflkDbSVrccxSkAAFZq)
- [Themed Buttons](https://www.webpackbin.com/bins/-Kflsy2FIkQy4n27qeLc)

## Feedback wanted

This is a very new approach and library and not all features are implemented yet. Feel free to [file issue or suggest feature](https://github.com/tuchk4/rockey/issues/new) to help me to make rockey better.
Or ping me on twitter [@tuchk4](https://twitter.com/tuchk4).

🎉

Upcoming plans:

- Make disadvantages list as shorter as possible
- Medium post *"Rockey Under the Hood"*. Topic about how rockey works — how to make batch CSS rules insert, how to parse and auto optimize parser, how dynamic CSS works
- Medium post *"Rockey — tips and tricks"*. There are too lot of tips and tricks that I want to share with you
- *"Components kit"* — library with easiest way to develop React components using rockey and [recompose](https://github.com/acdlite/recompose)
