import { H3Event } from 'h3'
import { Decompte } from '../../../models/Decompte'
import PDFDocument from 'pdfkit'

export default defineEventHandler(async (event: H3Event) => {
  try {
    const id = event.context.params?.id
    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'ID requis'
      })
    }

    const decompte = await Decompte.findById(id)
      .populate('organism')
      .populate('signatures.user')

    if (!decompte) {
      throw createError({
        statusCode: 404,
        message: 'Décompte non trouvé'
      })
    }

    // Vérifier que le décompte est signé
    if (decompte.status !== 'signed') {
      throw createError({
        statusCode: 400,
        message: 'Le décompte doit être signé avant l\'export'
      })
    }

    // Créer le PDF
    const doc = new PDFDocument()
    const buffers: Buffer[] = []

    doc.on('data', buffers.push.bind(buffers))
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers)
      return pdfData
    })

    // En-tête
    doc.fontSize(20).text('Décompte', { align: 'center' })
    doc.moveDown()

    // Informations du décompte
    const populatedDecompte = await Decompte.findById(decompte._id).populate('organism')
    doc.fontSize(12)
    doc.text(`Référence: ${decompte.reference}`)
    doc.text(`Titre: ${decompte.title}`)
    doc.text(`Montant: ${decompte.amount.toLocaleString('fr-FR')} FCFA`)
    doc.text(`Organisme: ${populatedDecompte?.organism ? (populatedDecompte.organism as any).name : 'Non spécifié'}`)
    doc.moveDown()

    // Signatures
    doc.text('Signatures:', { underline: true })
    decompte.signatures.forEach(sig => {
      doc.moveDown(0.5)
      if (sig.user && typeof sig.user !== 'string') {
        doc.text(`${sig.user.firstName || ''} ${sig.user.lastName || ''}`)
      } else {
        doc.text('Utilisateur non disponible')
      }
      doc.text(`Date: ${new Date(sig.date).toLocaleDateString('fr-FR')}`)
      // Ajouter l'image de la signature
      if (sig.signature) {
        doc.image(sig.signature, { width: 200 })
      }
    })

    doc.end()

    // Définir les en-têtes pour le téléchargement
    setHeaders(event, {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="decompte-${decompte.reference}.pdf"`
    })

    return buffers
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'Erreur lors de l\'export du décompte'
    })
  }
})