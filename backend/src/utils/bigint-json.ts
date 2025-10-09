// This ensures BigInt serializes as string in JSON.stringify
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};
