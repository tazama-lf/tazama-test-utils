import { AccountType } from "@tazama-lf/frms-coe-lib/lib/interfaces";
import {
  generatePain001,
  generatePain013,
  generatePacs008,
  generatePacs002,
  generateFullMessageSet,
} from "../src/";
import { Person } from "../src/types/person";

let debtor: Person;
let creditor: Person;
beforeEach(() => {
  debtor = new Person(AccountType.DebtorAcct);
  creditor = new Person(AccountType.CreditorAcct);
});

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
      const messages = generateFullMessageSet(false, {
        amount: 500,
      });
      expect(messages.length).toBe(1);

      const { pain001, pain013 } = messages[0];

      expect(pain001).toBeUndefined();
      expect(pain013).toBeUndefined();
    });
  });

  describe("Quoting enabled", () => {
    it("should generate all messages", () => {
      const { pain001, pain013 } = generateFullMessageSet(true)[0];

      expect(pain001).toBeDefined();
      expect(pain013).toBeDefined();

      expect(pain001?.CstmrCdtTrfInitn.PmtInf.PmtInfId).toBe(
        pain013?.CdtrPmtActvtnReq.PmtInf.PmtInfId,
      );
    });
    it("should have the same end to end id and inf id", () => {
      const firstPain = generatePain001(debtor, creditor);
      const secondPain = generatePain013(firstPain);

      expect(firstPain.CstmrCdtTrfInitn.PmtInf.PmtInfId).toBe(
        secondPain.CdtrPmtActvtnReq.PmtInf.PmtInfId,
      );

      expect(
        firstPain.CstmrCdtTrfInitn.PmtInf.CdtTrfTxInf.PmtId.EndToEndId,
      ).toBe(secondPain.CdtrPmtActvtnReq.PmtInf.CdtTrfTxInf.PmtId.EndToEndId);

      const result = generatePacs008(debtor, creditor, secondPain);

      expect(result.FIToFICstmrCdtTrf.CdtTrfTxInf.PmtId.EndToEndId).toBe(
        firstPain.CstmrCdtTrfInitn.PmtInf.CdtTrfTxInf.PmtId.EndToEndId,
      );

      expect(result.FIToFICstmrCdtTrf.CdtTrfTxInf.PmtId.InstrId).toBe(
        firstPain.CstmrCdtTrfInitn.PmtInf.PmtInfId,
      );
    });
  });
});
