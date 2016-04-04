'use strict'

const React = require('react')
const ReactDOM = require('react-dom')
const Perf = require('react-addons-perf')
const PerfAnalysis = require('react/lib/ReactDefaultPerfAnalysis')
const jsdom = require('jsdom').jsdom
const bind = require('../')

const h = React.createElement
const render = ReactDOM.render
const findDOMNode = ReactDOM.findDOMNode

const document = jsdom('<html><body><div id="app"></div><body></html>')
global.window = document.defaultView

class SubWidget extends React.Component {
  constructor () {
    super()
    this.onClick = bind(this, this.onClick)
  }

  onClick (text, event) {
    text = text || "Yo"
    console.log(text)
  }

  render () {
    const message = "Hey"
    const altMessage = "Hello"

    return h('h1', {
      onClick: this.onClick.partial(message),
      onMouseEnter: this.onClick.partial(altMessage)
    }, 'hi')
  }
}

class Widget extends React.Component {
  constructor () {
    super()
    this.state = {
      i: 0
    }
  }

  componentDidMount () {
    this.timer = setInterval(() => {
      const i = this.state.i

      if (i < 20) {
        this.setState({ i: i + 1 })
      } else {
        Perf.stop()
        report(Perf.getLastMeasurements())

        clearInterval(this.timer)
      }
    }, 50)
  }

  render () {
    return h(SubWidget, {
      ref: Actor,
      value: this.state.i
    })
  }
}

class App extends React.Component {
  render () {
    return h('div', {}, h(Widget))
  }
}

const appRoot = document.getElementById('app')

Perf.start()
render(h(App), appRoot)

function Actor (ref) {
  const node = findDOMNode(ref)
  node.click()
}

function report (measurements) {
  const output = PerfAnalysis.getDOMSummary(measurements)
  console.log(output.filter(e => e.type === 'putListener').length)
}
