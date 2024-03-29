import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import * as bip32 from "bip32";
import { derivePath } from "ed25519-hd-key";
export const DERIVATION_PATH = {
  deprecated: undefined,
  bip44: "bip44",
  bip44Change: "bip44Change",
  bip44Root: "bip44Root", // Ledger only.
};

export function getAccountFromSeed(
  seed,
  walletIndex,
  dPath = undefined,
  accountIndex = 0
) {
  const derivedSeed = deriveSeed(seed, walletIndex, dPath, accountIndex);
  return Keypair.fromSecretKey(
    nacl.sign.keyPair.fromSeed(derivedSeed).secretKey
  );
}

function deriveSeed(seed, walletIndex, derivationPath, accountIndex) {
  switch (derivationPath) {
    case DERIVATION_PATH.deprecated:
      const path = `m/501'/${walletIndex}'/0/${accountIndex}`;
      return bip32.fromSeed(seed).derivePath(path).privateKey;
    case DERIVATION_PATH.bip44:
      const path44 = `m/44'/501'/${walletIndex}'`;
      return derivePath(path44, seed).key;
    case DERIVATION_PATH.bip44Change:
      const path44Change = `m/44'/501'/${walletIndex}'/0'`;
      return derivePath(path44Change, seed).key;
    default:
      throw new Error(`invalid derivation path: ${derivationPath}`);
  }
}
