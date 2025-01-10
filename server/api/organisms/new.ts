import { Organism } from '~/server/models/Organism'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) // Récupère le corps de la requête

  try {
    const newOrganism = new Organism({
      name: body.name,
      type: body.type,
      address: body.address,
      contact: {
        email: body.contact.email,
        phone: body.contact.phone
      }
    })

    // Sauvegarde l'organisme dans la base de données
    await newOrganism.save()

    return { message: 'Organisme ajouté avec succès', organism: newOrganism }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { message: 'Erreur lors de l\'ajout de l\'organisme', error: error.message }
    }
    return { message: 'Erreur lors de l\'ajout de l\'organisme', error: String(error) }
  }
})
