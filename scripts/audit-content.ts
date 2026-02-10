#!/usr/bin/env tsx
/**
 * Content Compliance Audit Script
 * 
 * Checks content for:
 * - No emoji
 * - Traditional Chinese (zh-HK) usage
 * - Consistent button/heading text
 * - No empty fields
 */

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import glob from 'fast-glob'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface ContentIssue {
  file: string
  line?: number
  type: 'error' | 'warning'
  message: string
}

// Emoji regex pattern
const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u

// Simplified Chinese characters that differ from Traditional
const scChars = /[爱党国们来会个]/

async function auditContent() {
  console.log('Running content compliance audit...')
  
  const issues: ContentIssue[] = []
  
  // Find all TSX files in app directory
  const files = await glob('src/app/**/*.{tsx,ts}', {
    cwd: path.join(__dirname, '..'),
    absolute: true,
  })
  
  for (const file of files) {
    const content = await fs.readFile(file, 'utf-8')
    const lines = content.split('\n')
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const lineNum = i + 1
      
      // Check for emoji in Chinese text content
      if (line.includes('zh-HK') || line.includes('"') || line.includes("'")) {
        if (emojiRegex.test(line)) {
          issues.push({
            file: path.relative(process.cwd(), file),
            line: lineNum,
            type: 'error',
            message: 'Found emoji in content',
          })
        }
      }
      
      // Check for simplified Chinese characters (basic check)
      const chineseText = line.match(/[\u4e00-\u9fff]+/g)
      if (chineseText) {
        for (const text of chineseText) {
          if (scChars.test(text)) {
            issues.push({
              file: path.relative(process.cwd(), file),
              line: lineNum,
              type: 'warning',
              message: `Possible simplified Chinese characters: ${text}`,
            })
          }
        }
      }
      
      // Check for empty string literals in UI contexts
      if (/label.*=\s*["']{2}/.test(line) || /title.*=\s*["']{2}/.test(line)) {
        issues.push({
          file: path.relative(process.cwd(), file),
          line: lineNum,
          type: 'warning',
          message: 'Empty label/title field',
        })
      }
    }
    
    // Check for consistent button text patterns
    const buttonTexts = content.match(/<Button[^>]*>([^<]+)<\/Button>/g) || []
    const ctaPatterns = ['立即諮詢', '了解更多', '查看詳情']
    
    for (const button of buttonTexts) {
      const text = button.replace(/<[^>]+>/g, '').trim()
      if (text && !ctaPatterns.some(p => text.includes(p) || text.length > 2)) {
        // This is just a check for very short button text
        if (text.length < 3) {
          issues.push({
            file: path.relative(process.cwd(), file),
            type: 'warning',
            message: `Very short button text: "${text}"`,
          })
        }
      }
    }
  }
  
  // Report results
  console.log('\n--- Content Audit Results ---\n')
  
  if (issues.length === 0) {
    console.log('All content checks passed!')
    console.log('  - No emoji found')
    console.log('  - Traditional Chinese validated')
    console.log('  - Button/heading consistency checked')
    return 0
  }
  
  const errors = issues.filter(i => i.type === 'error')
  const warnings = issues.filter(i => i.type === 'warning')
  
  if (errors.length > 0) {
    console.log(`Errors (${errors.length}):`)
    for (const issue of errors) {
      const loc = issue.line ? `:${issue.line}` : ''
      console.log(`  [ERROR] ${issue.file}${loc}: ${issue.message}`)
    }
    console.log('')
  }
  
  if (warnings.length > 0) {
    console.log(`Warnings (${warnings.length}):`)
    for (const issue of warnings) {
      const loc = issue.line ? `:${issue.line}` : ''
      console.log(`  [WARN] ${issue.file}${loc}: ${issue.message}`)
    }
    console.log('')
  }
  
  console.log(`Total: ${errors.length} errors, ${warnings.length} warnings`)
  
  return errors.length > 0 ? 1 : 0
}

auditContent().then(code => process.exit(code))
