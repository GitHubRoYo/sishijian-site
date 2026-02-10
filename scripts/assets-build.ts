#!/usr/bin/env tsx
/**
 * Assets Build Script
 * 
 * Scans user image folder, copies to public/assets/seed/
 * and generates content/assets-manifest.json
 */

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import glob from 'fast-glob'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const SOURCE_DIR = '/Users/vince/Documents/sishijian/assets/images'
const TARGET_DIR = path.join(__dirname, '../public/assets/seed')
const MANIFEST_PATH = path.join(__dirname, '../content/assets-manifest.json')

interface AssetInfo {
  filename: string
  originalPath: string
  targetPath: string
  dimensions: { width: number; height: number } | null
  sizeBytes: number
  mimeType: string
  suggestedUse: string[]
  recommendedPages: string[]
  altText: {
    'zh-HK': string
    'en': string
    'zh-Hans': string
  }
  canBeHero: boolean
}

async function getImageDimensions(filePath: string): Promise<{ width: number; height: number } | null> {
  try {
    const buffer = await fs.readFile(filePath)
    
    // Check for PNG
    if (buffer[0] === 0x89 && buffer[1] === 0x50) {
      const width = buffer.readUInt32BE(16)
      const height = buffer.readUInt32BE(20)
      return { width, height }
    }
    
    // Check for JPEG
    if (buffer[0] === 0xFF && buffer[1] === 0xD8) {
      let offset = 2
      while (offset < buffer.length) {
        if (buffer[offset] !== 0xFF) break
        const marker = buffer[offset + 1]
        if (marker === 0xD9) break
        if (marker === 0xC0 || marker === 0xC2) {
          return {
            height: buffer.readUInt16BE(offset + 5),
            width: buffer.readUInt16BE(offset + 7),
          }
        }
        const length = buffer.readUInt16BE(offset + 2)
        offset += 2 + length
      }
    }
    
    return null
  } catch {
    return null
  }
}

function getSuggestedUse(filename: string): string[] {
  const lower = filename.toLowerCase()
  const uses: string[] = []
  
  if (lower.includes('cover') || lower.includes('hero')) {
    uses.push('hero', 'banner')
  }
  if (lower.includes('slide') || lower.includes('presentation')) {
    uses.push('content', 'about')
  }
  if (lower.includes('charity')) {
    uses.push('culture-art', 'social-impact')
  }
  if (lower.includes('scenery') || lower.includes('hong-kong')) {
    uses.push('hero', 'location')
  }
  if (lower.includes('misc')) {
    uses.push('content', 'decorative')
  }
  
  if (uses.length === 0) {
    uses.push('content')
  }
  
  return uses
}

function getRecommendedPages(filename: string): string[] {
  const lower = filename.toLowerCase()
  const pages: string[] = []
  
  if (lower.includes('cover') || lower.includes('hero')) {
    pages.push('homepage')
  }
  if (lower.includes('slide') || lower.includes('presentation')) {
    pages.push('about', 'services')
  }
  if (lower.includes('charity')) {
    pages.push('culture-art')
  }
  if (lower.includes('scenery')) {
    pages.push('homepage', 'about')
  }
  
  if (pages.length === 0) {
    pages.push('general')
  }
  
  return pages
}

function generateAltText(filename: string): AssetInfo['altText'] {
  const baseName = filename.replace(/\.(png|jpg|jpeg|webp|gif)$/i, '').replace(/[-_]/g, ' ')
  
  const descriptions: Record<string, AssetInfo['altText']> = {
    'presentation cover': {
      'zh-HK': '四時鑑公司介紹簡報封面，展示品牌與中國文化推廣的商業賦能平台理念',
      'en': 'Sishijian company presentation cover, showcasing brand and Chinese culture promotion platform',
      'zh-Hans': '四时鉴公司介绍简报封面，展示品牌与中国文化推广的商业赋能平台理念',
    },
    'hong kong scenery': {
      'zh-HK': '香港城市景觀照片，展示維港兩岸的繁華景色',
      'en': 'Hong Kong cityscape photo showcasing Victoria Harbour',
      'zh-Hans': '香港城市景观照片，展示维港两岸的繁华景色',
    },
    'charity foundation': {
      'zh-HK': '公益基金會活動照片，展示社會創新與公益合作',
      'en': 'Charity foundation activity photo showing social innovation',
      'zh-Hans': '公益基金会活动照片，展示社会创新与公益合作',
    },
  }
  
  for (const [key, value] of Object.entries(descriptions)) {
    if (baseName.toLowerCase().includes(key)) {
      return value
    }
  }
  
  return {
    'zh-HK': `圖片：${baseName}`,
    'en': `Image: ${baseName}`,
    'zh-Hans': `图片：${baseName}`,
  }
}

function canBeHero(dimensions: { width: number; height: number } | null): boolean {
  if (!dimensions) return false
  const ratio = dimensions.width / dimensions.height
  return ratio >= 1.5 && ratio <= 3.5 && dimensions.width >= 1200
}

async function main() {
  console.log('Building assets...')
  
  try {
    await fs.mkdir(TARGET_DIR, { recursive: true })
    await fs.mkdir(path.dirname(MANIFEST_PATH), { recursive: true })
    
    const imageFiles = await glob(['**/*.{png,jpg,jpeg,webp,gif}'], {
      cwd: SOURCE_DIR,
      onlyFiles: true,
      dot: false,
    })
    
    const assets: AssetInfo[] = []
    
    for (const relativePath of imageFiles) {
      const filename = path.basename(relativePath)
      const sourcePath = path.join(SOURCE_DIR, relativePath)
      const targetPath = path.join(TARGET_DIR, relativePath)
      
      const stats = await fs.stat(sourcePath)
      const dimensions = await getImageDimensions(sourcePath)
      
      await fs.mkdir(path.dirname(targetPath), { recursive: true })
      await fs.copyFile(sourcePath, targetPath)
      
      const ext = path.extname(filename).toLowerCase()
      const mimeType: Record<string, string> = {
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.webp': 'image/webp',
        '.gif': 'image/gif',
      }
      
      assets.push({
        filename,
        originalPath: sourcePath,
        targetPath: `/assets/seed/${relativePath.replace(/\\/g, '/')}`,
        dimensions,
        sizeBytes: stats.size,
        mimeType: mimeType[ext] || 'image/jpeg',
        suggestedUse: getSuggestedUse(filename),
        recommendedPages: getRecommendedPages(filename),
        altText: generateAltText(filename),
        canBeHero: canBeHero(dimensions),
      })
      
      console.log(`Processed: ${relativePath}`)
    }
    
    const manifest = {
      generatedAt: new Date().toISOString(),
      totalAssets: assets.length,
      assets: assets.sort((a, b) => a.filename.localeCompare(b.filename)),
    }
    
    await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2))
    
    console.log(`\nBuild complete!`)
    console.log(`- Copied ${assets.length} assets to ${TARGET_DIR}`)
    console.log(`- Generated manifest at ${MANIFEST_PATH}`)
    console.log(`- Hero candidates: ${assets.filter(a => a.canBeHero).length}`)
    
  } catch (error) {
    console.error('Build failed:', error)
    process.exit(1)
  }
}

main()
