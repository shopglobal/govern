import * as Observable from 'zen-observable'
import { createCounter } from './utils/createCounter'
import { map, source, sink, shape, createElement, createGovernor, Component, SFC } from '../src'

describe('Source', () => {
  it("outputs its initial value", () => {
    let governor = createGovernor(source({ a: 1, b: 2 }))
    let observable = governor.get()
    expect(observable.get()).toEqual({ a: 1, b: 2 })
  })

  it("outputs subsequent values", () => {
    let governor = createGovernor(source(shape({ a: 1, b: 2 })))
    let observable = governor.get()

    let test = Observable.of("red", "green", "blue")
    governor.setProps({ children: sink(test) })

    expect(observable.get()).toEqual("blue")
  })

  it("outputs changes to children", () => {
    let counter = createCounter()
    let governor = createGovernor(source(sink(counter)))
    let observable = governor.get()
    expect(observable.get().count).toEqual(0)
    counter.get().increase()
    expect(observable.get().count).toEqual(1)
  })
})