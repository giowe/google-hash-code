const gulp = require("gulp")
const zip = require("gulp-zip")
const replace = require("gulp-replace")
const del = require("del")
const { downloadTopScores } = require("./src/modules/s3")
const rename = require("gulp-rename")
const filter = require("gulp-filter")
const { join } = require("path")
const e = module.exports

e.clean = () => del("dist.zip", { force:true })

e.dist = () => {
  return e.clean()
    .then(() => {
      const f = filter("src/**/*", { restore: true })
      return gulp.src(["src/**/*", "./package.json", ".gitignore", ".editorconfig"])
        .pipe(replace("src/", "app/"))
        .pipe(f)
        .pipe(rename(path => path.dirname = join("app", path.dirname)))
        .pipe(f.restore)
        .pipe(zip("dist.zip"))
        .pipe(gulp.dest("./"))
    })
}

e.test = () => require("./src/test")

e.getScores = () => {
  del.sync("outFilesS3", { force: true })
  return downloadTopScores()
}

e.default = () => e.dist()
