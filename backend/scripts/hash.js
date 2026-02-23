const bcrypt = require("bcrypt");

async function main() {
  const pwd = process.argv[2];
  if (!pwd) {
    console.log("Usage: node scripts/hash.js <password>");
    process.exit(1);
  }
  const hash = await bcrypt.hash(pwd, 10);
  console.log(hash);
}
main();
