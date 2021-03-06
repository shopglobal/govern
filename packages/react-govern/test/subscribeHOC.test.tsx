import * as React from 'react'
import * as Govern from 'govern'
import * as ReactTestRenderer from 'react-test-renderer'

import { subscribe } from '../src'


class TestController extends Govern.Component<any, any> {
  state = { value: this.props.defaultValue }

  publish() {
    return {
      value: this.state.value,
      change: (value) => this.setState({ value })
    }
  }
}

class TestComponent extends React.Component<any> {
  render() {
    return String(this.props.value)
  }
}


test('injects initial value', () => {
  let decorator = subscribe(
    props => Govern.createElement(TestController, { defaultValue: props.defaultValue }),
  )
  let DecoratedComponent = decorator(TestComponent)
  let renderer = ReactTestRenderer.create(
    <DecoratedComponent defaultValue={1} />
  )
  expect(renderer.toJSON()).toEqual("1")
})

test('allows for elements as first argument', () => {
  let decorator = subscribe(
    Govern.createElement(TestController, { defaultValue: 1 })
  )
  let DecoratedComponent = decorator(TestComponent)
  let renderer = ReactTestRenderer.create(
    <DecoratedComponent defaultValue={1} />
  )
  expect(renderer.toJSON()).toEqual("1")
})

test('allows for components as first argument', () => {
  let decorator = subscribe(TestController)
  let DecoratedComponent = decorator(TestComponent)
  let renderer = ReactTestRenderer.create(
    <DecoratedComponent defaultValue={1} />
  )
  expect(renderer.toJSON()).toEqual("1")
})

test('injects subsequent outputs', () => {
  let store = Govern.instantiate(
    Govern.createElement(TestController, { defaultValue: 1 }),
  )
  let decorator = subscribe(props => store)
  let DecoratedComponent = decorator(TestComponent)
  let renderer = ReactTestRenderer.create(
    <DecoratedComponent defaultValue={1} />
  )
  expect(renderer.toJSON()).toEqual("1")
  store.UNSAFE_dispatch(() => {
    store.getValue().change(2)
  })
  expect(renderer.toJSON()).toEqual("2")
})
