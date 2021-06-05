import { sha256 } from "js-sha256";
import { schnorr } from "@zilliqa-js/crypto";

export default ({ message, publicKey, signature }) => {
    console.log({message, publicKey, signature})
  const hashStr = sha256(message);
  const hashBytes = Buffer.from(hashStr, "hex");
  const myZilPaySignature = signature;
  const parsedSig = schnorr.toSignature(myZilPaySignature);
  const verify = schnorr.verify(
    hashBytes,
    parsedSig,
    Buffer.from(publicKey, "hex")
  );
  return verify;
};
