test('Jest-TypeScript 尝试运行', () => {
  expect(1+1).toBe(2) // Pass
})

test('Jest-TypeScript 尝试运行失败', () => {
  expect(1+2).toBe(2) // Failed
})
