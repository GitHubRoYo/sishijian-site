type LexicalNode = {
  type?: string
  text?: string
  children?: LexicalNode[]
}

const walk = (node: LexicalNode | undefined, acc: string[]) => {
  if (!node) return
  if (node.type === 'text' && typeof node.text === 'string') {
    acc.push(node.text)
  }
  if (Array.isArray(node.children)) {
    for (const child of node.children) walk(child, acc)
    if (node.type === 'paragraph' || node.type === 'heading') acc.push('\n')
  }
}

export const lexicalToPlainText = (state: any): string => {
  const acc: string[] = []
  const root = state?.root
  walk(root, acc)
  return acc.join('').replace(/\n{3,}/g, '\n\n').trim()
}

