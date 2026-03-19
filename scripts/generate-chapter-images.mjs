/**
 * Batch image generation for a chapter.
 * Calls the local /api/generate/image endpoint for each scene,
 * saves the result as webp into public/images/chapitres/<slug>/,
 * and updates the chapter JSON (isPlaceholder → false).
 *
 * Usage: node scripts/generate-chapter-images.mjs <slug>
 * Example: node scripts/generate-chapter-images.mjs le-secret-dalex
 */

import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

const API_URL = 'http://localhost:3000/api/generate/image'
const DELAY_MS = 5000

const slug = process.argv[2]
if (!slug) {
  console.error('Usage: node scripts/generate-chapter-images.mjs <slug>')
  process.exit(1)
}

const chaptersDir = path.join(process.cwd(), 'data', 'chapters')
const files = fs.readdirSync(chaptersDir).filter(f => f.startsWith(slug))
if (files.length === 0) {
  console.error(`No chapter file found for slug: ${slug}`)
  process.exit(1)
}

const chapterPath = path.join(chaptersDir, files[0])
const chapter = JSON.parse(fs.readFileSync(chapterPath, 'utf-8'))
console.log(`\n📖 Chapter: ${chapter.metadata.title} (${files[0]})`)
console.log(`   ${chapter.images.length} images to generate\n`)

const outputDir = path.join(process.cwd(), 'public', 'images', 'chapitres', slug)
fs.mkdirSync(outputDir, { recursive: true })

const scenePrompts = buildDetailedPrompts(chapter)

let generated = 0
let failed = 0

const startFrom = parseInt(process.argv[3] || '0', 10)

for (let i = 0; i < chapter.images.length; i++) {
  const img = chapter.images[i]
  const sceneNum = String(i + 1).padStart(2, '0')
  const outputFile = path.join(outputDir, `scene_${sceneNum}.webp`)
  const promptData = scenePrompts[i]

  if (!img.isPlaceholder && startFrom === 0) {
    console.log(`\n[${i + 1}/${chapter.images.length}] ⏭️  scene_${sceneNum} — already generated, skipping`)
    continue
  }

  if (startFrom > 0 && (i + 1) < startFrom) {
    console.log(`\n[${i + 1}/${chapter.images.length}] ⏭️  scene_${sceneNum} — skipping (start from ${startFrom})`)
    continue
  }

  console.log(`\n[${i + 1}/${chapter.images.length}] 🎨 scene_${sceneNum} — ${img.sceneKey}`)
  console.log(`   ${promptData.prompt.slice(0, 100)}...`)

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(promptData),
    })

    const data = await response.json()

    if (data.success && data.imageData && !data.isPlaceholder) {
      const base64 = data.imageData.replace(/^data:image\/\w+;base64,/, '')
      const pngPath = path.join(outputDir, `scene_${sceneNum}.png`)
      fs.writeFileSync(pngPath, Buffer.from(base64, 'base64'))

      try {
        execSync(`cwebp -q 85 "${pngPath}" -o "${outputFile}"`, { stdio: 'pipe' })
        fs.unlinkSync(pngPath)
      } catch {
        fs.renameSync(pngPath, outputFile.replace('.webp', '.png'))
        console.log(`   ⚠️  cwebp failed, kept as PNG`)
      }

      img.isPlaceholder = false
      generated++
      console.log(`   ✅ Generated & saved`)
    } else {
      console.log(`   ⚠️  Placeholder returned: ${data.error || 'no image data'}`)
      failed++
    }
  } catch (err) {
    console.error(`   ❌ Error: ${err.message}`)
    failed++
  }

  if (i < chapter.images.length - 1) {
    await sleep(DELAY_MS)
  }
}

chapter._savedAt = new Date().toISOString()
fs.writeFileSync(chapterPath, JSON.stringify(chapter, null, 2))

console.log(`\n${'═'.repeat(50)}`)
console.log(`✅ Generated: ${generated}`)
console.log(`⚠️  Failed/placeholder: ${failed}`)
console.log(`📁 Output: ${outputDir}`)
console.log(`💾 Chapter JSON updated: ${files[0]}`)

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function buildDetailedPrompts(chapter) {
  const dialogue = chapter.dialogue
  const prompts = []
  let imgIdx = 0

  for (const [sceneKey, lines] of Object.entries(dialogue)) {
    for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
      const line = lines[lineIdx]
      const imgDef = chapter.images[imgIdx]

      const characters = detectCharacters(line, lines, lineIdx)
      const style = detectStyle(sceneKey, line)
      const shotType = detectShot(line, lineIdx, lines)

      const richPrompt = buildRichPrompt(line, sceneKey, lineIdx, lines, chapter)

      prompts.push({
        prompt: richPrompt,
        sceneContext: `Chapitre "${chapter.metadata.title}" — Scène: ${sceneKey}, ligne ${lineIdx + 1}/${lines.length}. Droit #${chapter.metadata.right.id}: ${chapter.metadata.right.title}`,
        style,
        aspectRatio: '16:9',
        characters,
        emotion: line.emotion || 'neutre',
        shotType,
        referenceImages: [
          '/images/jeune_reflechi.webp',
          '/images/cafeteria_dialogue.webp',
        ],
      })

      imgIdx++
    }
  }

  return prompts
}

function buildRichPrompt(line, sceneKey, lineIdx, allLines, chapter) {
  const speaker = line.speaker
  const text = line.text
  const emotion = line.emotion || 'neutre'

  const locationMap = {
    intro: 'cafétéria du centre jeunesse, tables avec chaises colorées, néons, grandes fenêtres, comptoir de service',
    branche_a: 'bureau de Sophie l\'intervenante, ambiance feutrée, lampe de bureau, diplômes aux murs, fauteuils confortables, plantes',
    branche_b: 'couloir du centre jeunesse, murs bicolores bleu-orange, néons fluorescents, babillards avec affiches',
    branche_c: 'cafétéria puis chambre d\'Alex au centre, ambiance mélancolique',
    resolution_a: 'bureau formel de la directrice Diane Tremblay, drapeau du Québec, diplômes encadrés, bureau professionnel en bois',
    resolution_b: 'bureau formel de la directrice Diane Tremblay, rencontre officielle, atmosphère solennelle',
    fin_positive: 'couloir du centre jeunesse, ambiance lumineuse et positive, affiches sur les droits au babillard',
    fin_neutre: 'salle commune du centre, sofas, TV, ambiance détendue, lumière d\'après-midi',
    fin_negative: 'chambre d\'Alex, isolé, lumière grise par la fenêtre, murs blancs/beige, lit simple',
  }

  const location = locationMap[sceneKey] || 'centre jeunesse'

  const charDescriptions = {
    alex: 'Alex (16 ans, garçon, cheveux bruns mi-longs en désordre, yeux bleus, taches de rousseur, veste bleue claire style denim, t-shirt blanc, jeans)',
    sophie: 'Sophie Lavoie (32 ans, femme, cheveux noirs en queue de cheval, yeux bruns chaleureux, blazer beige, blouse sobre, badge du centre)',
    david: 'David (éducateur début trentaine, homme, air amical, vêtements casual-professionnels, nouveau au centre)',
    karim: 'Karim (16 ans, garçon, cheveux noirs courts bien coiffés, peau brune, polo ou chemise casual, jeans propres)',
    diane: 'Diane Tremblay (52 ans, femme, cheveux gris-blanc coupe courte, yeux gris-bleu perçants, tailleur bleu marine, lunettes, badge de direction)',
    narrateur: '',
  }

  const mainChar = charDescriptions[speaker] || ''

  const contextLines = allLines
    .slice(Math.max(0, lineIdx - 1), lineIdx + 1)
    .map(l => `${l.speaker}: "${l.text}"`)
    .join(' → ')

  let sceneAction = ''
  if (sceneKey === 'intro' && lineIdx <= 1) sceneAction = 'Alex et Karim mangent à la cafétéria quand David arrive à leur table'
  else if (sceneKey === 'intro' && lineIdx === 2) sceneAction = 'Les autres jeunes se retournent, Alex est choqué que ses secrets aient été révélés'
  else if (sceneKey === 'intro' && lineIdx >= 4) sceneAction = 'Alex doit faire un choix crucial: aller voir Sophie, confronter David, ou laisser faire'
  else if (sceneKey === 'branche_a') sceneAction = 'Alex est dans le bureau de Sophie, il raconte ce qui s\'est passé et découvre ses droits'
  else if (sceneKey === 'branche_b') sceneAction = 'Alex confronte David dans le couloir du centre, tension et confrontation directe'
  else if (sceneKey === 'branche_c') sceneAction = 'Alex choisit de ne rien faire, Karim essaie de le convaincre, Alex se replie sur lui-même'
  else if (sceneKey.startsWith('resolution')) sceneAction = 'Rencontre formelle dans le bureau de la directrice, résolution du conflit'
  else if (sceneKey === 'fin_positive') sceneAction = 'Le centre a changé grâce à Alex, affiche sur la confidentialité, victoire'
  else if (sceneKey === 'fin_neutre') sceneAction = 'Résolution partielle, Alex a appris mais n\'est pas allé jusqu\'au bout'
  else if (sceneKey === 'fin_negative') sceneAction = 'Alex isolé, conséquences de l\'inaction, mais Sophie offre une porte de sortie'

  return `${location}. ${mainChar ? mainChar + '. ' : ''}${sceneAction}. Dialogue: "${text}". Émotion: ${emotion}. Style: semi-réaliste graphic novel inspiré Life is Strange/Telltale, palette chaude bleus-oranges-terres, éclairage cinématique, linework net. Ambiance droit à la confidentialité: tons feutrés, intimité, ombres expressives. AUCUN texte, bulle de dialogue, logo ou watermark.`
}

function detectCharacters(line, allLines, lineIdx) {
  const chars = new Set()
  const names = ['alex', 'sophie', 'david', 'karim', 'diane']

  if (line.speaker && line.speaker !== 'narrateur') chars.add(line.speaker)

  const nearby = allLines.slice(Math.max(0, lineIdx - 1), Math.min(allLines.length, lineIdx + 2))
  for (const l of nearby) {
    if (l.speaker && l.speaker !== 'narrateur') chars.add(l.speaker)
    const textLower = l.text.toLowerCase()
    for (const n of names) {
      if (textLower.includes(n)) chars.add(n)
    }
  }

  return [...chars]
}

function detectStyle(sceneKey, line) {
  if (['branche_a', 'resolution_a'].includes(sceneKey)) return 'bureau'
  if (['intro', 'branche_c'].includes(sceneKey)) return 'cafeteria'
  if (sceneKey === 'branche_b') return 'centre_jeunesse'
  if (sceneKey.startsWith('resolution')) return 'bureau'
  return 'centre_jeunesse'
}

function detectShot(line, lineIdx, allLines) {
  if (line.choices) return 'medium'
  if (line.emotion === 'choque' || line.emotion === 'en_colere') return 'closeup_character'
  if (lineIdx === 0 && allLines.length > 3) return 'establishing'

  const text = line.text.toLowerCase()
  if (text.includes('gros plan') || text.includes('visage')) return 'closeup_character'
  if (text.includes('document') || text.includes('dossier') || text.includes('affiche')) return 'closeup_object'

  const speakers = new Set()
  const nearby = allLines.slice(Math.max(0, lineIdx - 1), Math.min(allLines.length, lineIdx + 2))
  for (const l of nearby) {
    if (l.speaker !== 'narrateur') speakers.add(l.speaker)
  }
  if (speakers.size >= 2) return 'two_shot'

  return 'medium'
}
