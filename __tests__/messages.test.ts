import {
  generatePain001,
  generatePain013,
  generatePacs008,
  generatePacs002,
  generateFullMessageSet,
} from "../src/";

describe("Generate ISO20022 Messages", () => {
  describe("Quoting disabled", () => {
    it("should generate a pacs008", () => {
      const result = generatePacs008();
      expect(result).toHaveProperty("FIToFICstmrCdtTrf");
    });
    it("should generate a pacs002", () => {
      const pacs008 = generatePacs008();
      const endToEndId = pacs008.FIToFICstmrCdtTrf.CdtTrfTxInf.PmtId.EndToEndId;
      const instrId = pacs008.FIToFICstmrCdtTrf.CdtTrfTxInf.PmtId.InstrId;
      const result = generatePacs002(endToEndId, instrId);
      expect(endToEndId).toBe(result.FIToFIPmtSts.TxInfAndSts.OrgnlEndToEndId);
    });
    it("should generate all messages", () => {
      const { pain001, pain013 } = generateFullMessageSet();

      expect(pain001).toBeUndefined();
      expect(pain013).toBeUndefined();
    });
  });

  describe("Quoting enabled", () => {
    it("should generate all messages", () => {
      const { pain001, pain013 } = generateFullMessageSet(true);

      expect(pain001).toBeDefined();
      expect(pain013).toBeDefined();

      expect(pain001?.CstmrCdtTrfInitn.PmtInf.PmtInfId).toBe(
        pain013?.CdtrPmtActvtnReq.PmtInf.PmtInfId,
      );
    });
    it("should have the same end to end id and inf id", () => {
      const firstPain = generatePain001();
      const secondPain = generatePain013(firstPain);

      expect(firstPain.CstmrCdtTrfInitn.PmtInf.PmtInfId).toBe(
        secondPain.CdtrPmtActvtnReq.PmtInf.PmtInfId,
      );

      expect(
        firstPain.CstmrCdtTrfInitn.PmtInf.CdtTrfTxInf.PmtId.EndToEndId,
      ).toBe(secondPain.CdtrPmtActvtnReq.PmtInf.CdtTrfTxInf.PmtId.EndToEndId);

      const result = generatePacs008(secondPain);

      expect(result.FIToFICstmrCdtTrf.CdtTrfTxInf.PmtId.EndToEndId).toBe(
        firstPain.CstmrCdtTrfInitn.PmtInf.CdtTrfTxInf.PmtId.EndToEndId,
      );

      expect(result.FIToFICstmrCdtTrf.CdtTrfTxInf.PmtId.InstrId).toBe(
        firstPain.CstmrCdtTrfInitn.PmtInf.PmtInfId,
      );
    });
  });
});
