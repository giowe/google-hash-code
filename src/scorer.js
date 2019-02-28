module.exports = (parsedIn, out) => {
  const { photos } = parsedIn

  let score = 0

  const parsedPhotos = []

  for (let i = 1; i < out.length; i++) {
    A = out[i-1]
    B = out[i]

    if (A.length !== 1 && A.length !== 2) throw `slide ${i-1} has ${A.length} photos but photos must be 1 or 2`
    if (i === out.length-1 && B.length !== 1 && B.length !== 2) throw `slide ${i} has ${A.length} photos but photos must be 1 or 2`

    const tagsA = []
    const tagsB = []

    for (let photo of A) {
      if (parsedPhotos.includes(photo)) throw `trying to include photo ${photo} twice`
      parsedPhotos.push(photo)
      tagsA.push(...photos[photo].tags)
    }

    for (let photo of B) {
      tagsB.push(...photos[photo].tags)
    }

    const commonTags = tagsA.filter(value => tagsB.includes(value))

    score = score + Math.min(tagsA.length, tagsB.length, commonTags.length)
  }

  for (let photo of out[out.length-1]) {
    if (parsedPhotos.includes(photo)) throw `trying to include photo ${photo} twice`
  }

  return score.toString()
}
