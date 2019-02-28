module.exports = (parsedIn, out) => {
  const { photos } = parsedIn

  let score = 0

  const parsedPhotos = []

  for (let i = 1; i < out.length; i++) {
    A = out[i-1]
    B = out[i]

    const tagsA = []
    const tagsB = []

    for (let photo of A) {
      tagsA.push(...photos[photo].tags)
    }

    parsedPhotos.push(...A)

    for (let photo of B) {
      if (parsedPhotos.includes(photo)) throw `trying to include photo ${photo} twice`
      tagsB.push(...photos[photo].tags)
    }

    const commonTags = tagsA.filter(value => tagsB.includes(value))

    score = score + Math.min(tagsA.length, tagsB.length, commonTags.length)

  }

  return score.toString()
}
