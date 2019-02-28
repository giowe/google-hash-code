module.exports = (parsedIn, out) => {
  const { photos } = parsedIn

  let score = 0

  if (out.length < 2) {
    console.log("Warning: output has only 1 slide")
    return score.toString()
  }

  const parsedPhotos = []

  for (let i = 1; i < out.length; i++) {
    A = out[i-1]
    B = out[i]

    if (A.length !== 1 && A.length !== 2) throw `slide ${i-1} has ${A.length} photos but photos must be 1 or 2`
    if (i === out.length-1 && B.length !== 1 && B.length !== 2) throw `slide ${i} has ${A.length} photos but photos must be 1 or 2`

    if (A.length === 1) {
      if (parsedIn.photos[A[0]].orientation !== "H") throw `photo ${A} is the single photo in its slide but it's not horizontal`
    }
    if (A.length === 2) {
      if (parsedIn.photos[A[0]].orientation !== "V" || parsedIn.photos[A[1]].orientation !== "V") throw `photos ${A} are together in their slide but one or both of them are not vertical`
    }

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
    parsedPhotos.push(photo)
  }

  if (parsedIn.N !== parsedPhotos.length) console.log(`Warning: input includes ${parsedIn.N} photos but ${parsedPhotos.length} were used`)
  if (parsedIn.N < parsedPhotos.length) throw `${parsedPhotos.length} photos were used but input includes ${parsedIn.N} photos`

  if (B.length === 1) {
      if (parsedIn.photos[B[0]].orientation !== "H") throw `photo ${B} is the single photo in its slide but it's not horizontal`
  }
  if (B.length === 2) {
      if (parsedIn.photos[B[0]].orientation !== "V" || parsedIn.photos[B[1]].orientation !== "V") throw `photos ${B} are together in their slide but one or both of them are not vertical`
  }

  return score.toString()
}
