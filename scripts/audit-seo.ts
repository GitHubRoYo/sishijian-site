#!/usr/bin/env tsx
/**
 * SEO Audit Script
 * 
 * Checks SEO compliance across the site
 */

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import glob from 'fast-glob'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface SEOIssue {
  file: string
  type: 'error' | 'warning'
  message: string
}

async function auditSEO() {
  console.log('Running SEO audit...')
  
  const issues: SEOIssue[] = []
  
  // Find all page files
  const pageFiles = await glob('src/app/**/page.tsx', {
    cwd: path.join(__dirname, '..'),
    absolute: true,
  })
  
  for (const file of pageFiles) {
    const content = await fs.readFile(file, 'utf-8')
    
    // Check for generateMetadata
    if (!content.includes('generateMetadata')) {
      issues.push({
        file: path.relative(process.cwd(), file),
        type: 'error',
        message: 'Missing generateMetadata export',
      })
    }
    
    // Check for title
    const titleMatch = content.match(/title:\s*["'](.+?)["']/)
    if (titleMatch) {
      const title = titleMatch[1]
      if (title.length > 60) {
        issues.push({
          file: path.relative(process.cwd(), file),
          type: 'warning',
          message: `Title too long (${title.length} chars, max 60): "${title}"`,
        })
      }
    }
    
    // Check for description
    const descMatch = content.match(/description:\s*["'](.+?)["']/)
    if (descMatch) {
      const desc = descMatch[1]
      if (desc.length > 155) {
        issues.push({
          file: path.relative(process.cwd(), file),
          type: 'warning',
          message: `Description too long (${desc.length} chars, max 155)`,
        })
      }
    }
    
    // Check for h1 in component
    if (!content.includes('<h1')) {
      issues.push({
        file: path.relative(process.cwd(), file),
        type: 'error',
        message: 'Missing H1 heading',
      })
    }
    
    // Check for h2 in component
    if (!content.includes('<h2')) {
      issues.push({
        file: path.relative(process.cwd(), file),
        type: 'warning',
        message: 'Missing H2 headings',
      })
    }
  }
  
  // Report results
  console.log('\n--- SEO Audit Results ---\n')
  
  if (issues.length === 0) {
    console.log('All checks passed!')
    return 0
  }
  
  const errors = issues.filter(i => i.type === 'error')
  const warnings = issues.filter(i => i.type === 'warning')
  
  if (errors.length > 0) {
    console.log(`Errors (${errors.length}):`)
    for (const issue of errors) {
      console.log(`  [ERROR] ${issue.file}: ${issue.message}`)
    }
    console.log('')
  }
  
  if (warnings.length > 0) {
    console.log(`Warnings (${warnings.length}):`)
    for (const issue of warnings) {
      console.log(`  [WARN] ${issue.file}: ${issue.message}`)
    }
    console.log('')
  }
  
  console.log(`Total: ${errors.length} errors, ${warnings.length} warnings`)
  
  return errors.length > 0 ? 1 : 0
}

auditSEO().then(code => process.exit(code))
