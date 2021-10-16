import { generateMnemonicAndSeed } from "./wallet-seed.js";
import { getAccountFromSeed, DERIVATION_PATH } from "./account.js";
import chalk from "chalk";
import yargs from "yargs";
const arg = yargs(process.argv[2]).argv;

process.on("message", (msg) => {
  if (msg.stop) {
    process.exit(0);
  }
});

(async () => {
  await mintWallet(arg.p);
  process.send("found");
})();

async function mintWallet(prefix) {
  try {
    let i = 0;
    while (true) {
      const seed = await generateMnemonicAndSeed();
      const account = getAccountFromSeed(
        seed.seed,
        0,
        DERIVATION_PATH.bip44Change
      );
      const address = account.publicKey.toBase58();
      if (address.toLowerCase().startsWith(prefix)) {
        console.log(chalk.bgMagenta("found!"));
        console.log("Seed: ", chalk.green(seed.mnemonic));
        console.log("Wallet mint:", chalk.green(address));
        break;
      }
      i++;
    }
    console.log(`total iterations: ${i}`);
  } catch (error) {
    console.log(error);
  }
}
