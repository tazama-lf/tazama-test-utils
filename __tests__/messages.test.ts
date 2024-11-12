import { AccountType } from "@tazama-lf/frms-coe-lib/lib/interfaces";
import { generateID, generatePacs008, generatePacs002 } from "../src/";

describe("Generate ISO20022 Messages", () => {
  describe("Quoting disabled", () => {
    it("should generate a pacs008", () => {
      const result = generatePacs008();
      expect(result).toHaveProperty("FIToFICstmrCdtTrf");
    });
    it("should generate a pacs002", () => {
      const pacs008 = generatePacs008();
      const endToEndId = pacs008.FIToFICstmrCdtTrf.CdtTrfTxInf.PmtId.EndToEndId;
      const result = generatePacs002(endToEndId);
      expect(endToEndId).toBe(result.FIToFIPmtSts.TxInfAndSts.OrgnlEndToEndId);
    });
  });

  describe("Quoting enabled", () => {
    it("should generate a pacs008", () => {
      const now = new Date();
      const dob = new Date(now.getFullYear() - 20);
      const result = generatePacs008({
        endToEndId: generateID(),
        currency: "XTS",
        amount: 123,
        debtorDoB: dob,
        debtorAccountId: generateID({
          id: "account",
          entity: AccountType.DebtorAcct,
        }),
        creditorId: generateID({
          id: "entity",
          entity: AccountType.CreditorAcct,
        }),
        debtorId: generateID({ id: "entity", entity: AccountType.DebtorAcct }),
        creditorAccountId: generateID({
          id: "account",
          entity: AccountType.DebtorAcct,
        }),
        transactionDescription: "",
      });
      expect(result).toHaveProperty("FIToFICstmrCdtTrf");
    });
  });
});
