import { describe, expect, it } from 'vitest'
import { demoData } from '../data/demo'
import { analyseData } from './ai'

describe('analyseData', () => {
  it('flags financial and reporting issues from workspace data', () => {
    const insights = analyseData(demoData, 'en')
    expect(insights.some((item) => item.id === 'flagged')).toBe(true)
    expect(insights.some((item) => item.id === 'reports')).toBe(true)
    expect(insights.some((item) => item.id === 'verified')).toBe(true)
  })
})
