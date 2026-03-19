/**
 * Script pour générer les character sheets manquants via l'API locale
 * puis mettre à jour la bible personnages.json avec les nouvelles refs.
 *
 * Usage: npx tsx scripts/generate-character-sheets.ts
 */

const API = 'http://localhost:3000/api/generate/character-sheet'
const BIBLE_PATH = './data/bible/personnages.json'
const DELAY_MS = 5000

async function main() {
  // 1) Fetch character status
  console.log('📖 Chargement de la bible...')
  const statusRes = await fetch(API)
  const status = await statusRes.json()

  if (!status.apiConfigured) {
    console.error('❌ GEMINI_API_KEY non configurée — impossible de générer.')
    process.exit(1)
  }

  const needingSheets: { id: string; nom: string }[] = status.characters
    .filter((c: any) => c.needsCharacterSheet)

  if (needingSheets.length === 0) {
    console.log('✅ Tous les personnages ont déjà une image de référence!')
    return
  }

  console.log(`\n🎨 ${needingSheets.length} personnage(s) à générer:`)
  needingSheets.forEach(c => console.log(`  - ${c.nom} (${c.id})`))

  // 2) Generate each character sheet
  const results: { id: string; nom: string; imagePath: string }[] = []

  for (let i = 0; i < needingSheets.length; i++) {
    const char = needingSheets[i]
    console.log(`\n🖌️  [${i + 1}/${needingSheets.length}] Génération du character sheet de ${char.nom}...`)

    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ characterId: char.id }),
      })
      const data = await res.json()

      if (data.success) {
        console.log(`  ✅ Sauvegardé: ${data.imagePath}`)
        results.push({ id: char.id, nom: data.characterName, imagePath: data.imagePath })
      } else {
        console.error(`  ❌ Échec: ${data.error}`)
      }
    } catch (e: any) {
      console.error(`  ❌ Erreur réseau: ${e.message}`)
    }

    // Delay between requests
    if (i < needingSheets.length - 1) {
      console.log(`  ⏱️  Pause de ${DELAY_MS / 1000}s...`)
      await new Promise(r => setTimeout(r, DELAY_MS))
    }
  }

  // 3) Update the bible
  if (results.length > 0) {
    console.log(`\n📝 Mise à jour de la bible (${results.length} personnages)...`)
    const fs = await import('fs/promises')
    const raw = await fs.readFile(BIBLE_PATH, 'utf-8')
    const bible = JSON.parse(raw)

    for (const r of results) {
      if (bible[r.id]) {
        const refs: string[] = bible[r.id].references || []
        if (!refs.includes(r.imagePath)) {
          refs.push(r.imagePath)
        }
        bible[r.id].references = refs
        console.log(`  ✅ ${r.nom}: ajouté ${r.imagePath}`)
      }
    }

    await fs.writeFile(BIBLE_PATH, JSON.stringify(bible, null, 2) + '\n', 'utf-8')
    console.log('  💾 Bible sauvegardée!')
  }

  console.log(`\n🎉 Terminé! ${results.length}/${needingSheets.length} character sheets générés.`)
}

main().catch(e => {
  console.error('Fatal:', e)
  process.exit(1)
})
