// Script de conversion des images en WebP
// Convertit toutes les images JPG et PNG du dossier public/images en format WebP
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const imagesDir = path.join(__dirname, '../public/images')

// Fonction récursive pour parcourir les dossiers
function getAllImageFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir)
  
  files.forEach(file => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    
    if (stat.isDirectory()) {
      getAllImageFiles(filePath, fileList)
    } else if (/\.(jpg|jpeg|png)$/i.test(file)) {
      fileList.push(filePath)
    }
  })
  
  return fileList
}

// Fonction pour convertir une image en WebP
async function convertToWebP(inputPath) {
  try {
    const ext = path.extname(inputPath).toLowerCase()
    const webpPath = inputPath.replace(/\.(jpg|jpeg|png)$/i, '.webp')
    
    // Vérifier si le fichier WebP existe déjà
    if (fs.existsSync(webpPath)) {
      console.log(`⏭️  ${path.basename(webpPath)} existe déjà, ignoré`)
      return
    }
    
    console.log(`🔄 Conversion de ${path.basename(inputPath)}...`)
    
    await sharp(inputPath)
      .webp({ quality: 85 })
      .toFile(webpPath)
    
    console.log(`✅ ${path.basename(webpPath)} créé`)
  } catch (error) {
    console.error(`❌ Erreur lors de la conversion de ${inputPath}:`, error.message)
  }
}

// Fonction principale
async function main() {
  console.log('🚀 Début de la conversion des images en WebP...\n')
  
  const imageFiles = getAllImageFiles(imagesDir)
  
  if (imageFiles.length === 0) {
    console.log('⚠️  Aucune image trouvée')
    return
  }
  
  console.log(`📸 ${imageFiles.length} image(s) trouvée(s)\n`)
  
  for (const imageFile of imageFiles) {
    await convertToWebP(imageFile)
  }
  
  console.log('\n✨ Conversion terminée!')
}

main().catch(console.error)

