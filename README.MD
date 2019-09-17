# Async-JSX

This package aims to give you the opportunity to use the JSX syntax introduced
by React, without using React at all.

Key differrences with React API:

- No VirtualDOM (less overhead, but also less reactivity)
- Everything is asynchronous
- No Component life-cycle

## Usage

### Get Started

```js
import { h } from "@aduh95/async-jsx";

const element = <div>Hello World</div>;

console.log(element instanceof Promise); // true

element.then(domElement => console.log(domElement instanceof HTMLElement)); // true

document.body.append(renderAsync(element));
```

It is recommanded to add this CSS to your page to avoid custom elements leaking
into your design:

```css
async-component,
conditional-element {
  display: contents;
}
dom-portal {
  display: none;
}
```

### Build tools

#### With Babel

You can use the `@babel/plugin-transform-react-jsx` package:

```json
{
  "plugins": [
    [
      "@babel/plugin-transform-react-jsx",
      { "pragma": "h", "pragmaFrag": "Fragment" }
    ]
  ]
}
```

#### With TypeScript

In the `tsconfig.json`:

```json
{
  "compilerOptions": {
    "jsx": "react",
    "jsxFactory": "h"
  }
}
```

### With dynamic imports

You can define a component in a separate file and lazy-load it:

```js
/* Greetings.js */
import { h } from "@aduh95/async-jsx";

// You can use an arrow function instead of a class
export default props => (
  <div className={props.className}>Hello {props.name}</div>
);
```

```js
/* App.js */
import {
  h,
  lazy,
  Component,
  Fragment,
  conditionalRendering,
} from "@aduh95/async-jsx";
const Greetings = lazy(() => import("./Greetings.js"));

export default class App extends Component {
  stateObservers = new Set();
  greetingName = "";

  _handleNewName = this.handleNewName.bind(this);

  handleNewName(ev) {
    const { target } = ev;
    this.greetingName = target.value;
    this.stateObservers.forEach(fn => fn("ready"));
  }

  render() {
    return (
      <>
        <h1>Welcome</h1>
        {conidtionalRendering(
          {
            ready: <Greetings name={this.greetingName} />,
            askForName: (
              <input
                autofocus
                onBlur={this._handleNewName}
                placeholder="What's your name"
              />
            ),
          },
          this.stateObservers,
          ready,
          console.error
        )}
      </>
    );
  }
}
```

### StatfulComponent

I have added a React-compatible `StatefulComponent`, which can be used the same
way as a `React.Component`. However, because of the lack of VirtualDOM, it can
be highly inneficient to use it. For example, let's take the Clocl example from
React docs:

```js
import { h, StatefulComponent } from "@aduh95/async-jsx";
class Clock extends StatefulComponent {
  constructor(props) {
    super(props);
    this.state = { date: new Date() };
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date(),
    });
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

document
  .getElementById("root")
  .append(renderAsync(<Clock />, null, console.error));
```

This will work apparently, but at each tick, 3 DOM elements are initiated. Perf
difference may not be visible on that small example, but you can imagine that
having a whole site re-render everytime something change will put a lot of
pressure on small-CPU clients.

### SVG Elements

Because SVG Elements cannot be created using `Document.prototype.createElement`,
but by `Document.prototype.createElementNS`, they cannot be created by the usual
`h` p(or `createElement`) function. pIf you want to create SVG elements using
JSX, you can put them in a separate module:

```js
// Logo.js
import { createSVGElement as h } from "../utils/jsx.js";

export default () => (
  <svg>
    <path />
  </svg>
);
```

Then you can import this module in another component:

```js
import { Component, h } from "../utils/jsx.js";
import Logo from "./Logo.js";

export default class Header extends Component {
  render() {
    return (
      <header>
        <Logo />
        <h1>Title</h1>
      </header>
    );
  }
}
```

## API

This repo is using TypeScript, you can use it to have access to the
documentation during development.

```

```
