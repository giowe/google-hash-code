const { _ : [test, p] } = require("simple-argv")
require("shelljs/global")

const command = `node . ${test} ${ p ? `-p="${p}"` : ""} --s3`
console.log("EXECUTING", command)
while (true) {
  exec(command)
}
