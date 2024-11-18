import { AccountType } from "@tazama-lf/frms-coe-lib/lib/interfaces";
import { generatePacs008 } from "./pacs008";
import { generatePacs002 } from "./pacs002";
import { generatePain001 } from "./pain001";
import { generatePain013 } from "./pain013";
import { PartialCustomTransaction } from "../types/custom-transaction";
import {
  CREDITOR_ACCOUNT_TYPE,
  CREDITOR_ID_TYPE,
  DEBTOR_ACCOUNT_TYPE,
  DEBTOR_ID_TYPE,
} from "../utils";
import {
  prepGraphEntities,
  prepGraphAccounts,
  prepGraphTransactions,
  prepGraphAccountHolders,
} from "./graph";
import { Person } from "../types/person";
import { TransactionSet } from "../types/transaction-set";

// should return pains if quoting is true
export const generateFullMessageSet = (
  quoting?: boolean,
  options?: PartialCustomTransaction,
  additional?: { creditor: Person; debtor: Person; count: number },
): TransactionSet[] => {
  const debtor =
    additional?.debtor ??
    new Person(AccountType.DebtorAcct, options?.debtorAge);
  const creditor = additional?.creditor ?? new Person(AccountType.CreditorAcct);

  let retVals = [];
  let count = additional?.count ?? 1;

  for (let i = 0; i < count; i++) {
    if (quoting) {
      let pain001 = generatePain001(debtor, creditor, options);
      let pain013 = generatePain013(pain001, options);

      let pacs008 = generatePacs008(pain013, options);
      let pacs002 = generatePacs002(
        pacs008.FIToFICstmrCdtTrf.CdtTrfTxInf.PmtId.EndToEndId,
        pacs008.FIToFICstmrCdtTrf.CdtTrfTxInf.PmtId.InstrId,
        options,
      );
      retVals.push({
        pain001,
        pain013,
        pacs008,
        pacs002,
        debtor,
        creditor,
        dataCache: {
          dbtrId: `${pain001.CstmrCdtTrfInitn.PmtInf.Dbtr.Id.PrvtId.Othr[0].Id}${DEBTOR_ID_TYPE}`,
          cdtrId: `${pain001.CstmrCdtTrfInitn.PmtInf.CdtTrfTxInf.Cdtr.Id.PrvtId.Othr[0].Id}${CREDITOR_ID_TYPE}`,
          dbtrAcctId: `${pain001.CstmrCdtTrfInitn.PmtInf.DbtrAcct.Id.Othr[0].Id}${DEBTOR_ACCOUNT_TYPE}${pain001.CstmrCdtTrfInitn.PmtInf.DbtrAgt.FinInstnId.ClrSysMmbId.MmbId}`,
          cdtrAcctId: `${pain001.CstmrCdtTrfInitn.PmtInf.CdtTrfTxInf.CdtrAcct.Id.Othr[0].Id}${CREDITOR_ACCOUNT_TYPE}${pain001.CstmrCdtTrfInitn.PmtInf.CdtTrfTxInf.CdtrAgt.FinInstnId.ClrSysMmbId.MmbId}`,
          creDtTm: pain001.CstmrCdtTrfInitn.GrpHdr.CreDtTm,
          instdAmt: {
            amt: Number(
              pain001.CstmrCdtTrfInitn.PmtInf.CdtTrfTxInf.Amt.InstdAmt.Amt.Amt,
            ),
            ccy: pain001.CstmrCdtTrfInitn.PmtInf.CdtTrfTxInf.Amt.InstdAmt.Amt
              .Ccy,
          },
        },
      });
    } else {
      let pacs008 = generatePacs008(undefined, options);
      let pacs002 = generatePacs002(
        pacs008.FIToFICstmrCdtTrf.CdtTrfTxInf.PmtId.EndToEndId,
        pacs008.FIToFICstmrCdtTrf.CdtTrfTxInf.PmtId.InstrId,
        options,
      );
      retVals.push({
        pacs008,
        pacs002,
        debtor,
        creditor,
        dataCache: {
          dbtrId: `${pacs008.FIToFICstmrCdtTrf.CdtTrfTxInf.Dbtr.Id.PrvtId.Othr[0].Id}${DEBTOR_ID_TYPE}`,
          cdtrId: `${pacs008.FIToFICstmrCdtTrf.CdtTrfTxInf.Cdtr.Id.PrvtId.Othr[0].Id}${CREDITOR_ID_TYPE}`,
          dbtrAcctId: `${pacs008.FIToFICstmrCdtTrf.CdtTrfTxInf.DbtrAcct.Id.Othr[0].Id}${DEBTOR_ACCOUNT_TYPE}${pacs008.FIToFICstmrCdtTrf.CdtTrfTxInf.DbtrAgt.FinInstnId.ClrSysMmbId.MmbId}`,
          cdtrAcctId: `${pacs008.FIToFICstmrCdtTrf.CdtTrfTxInf.CdtrAcct.Id.Othr[0].Id}${CREDITOR_ACCOUNT_TYPE}${pacs008.FIToFICstmrCdtTrf.CdtTrfTxInf.CdtrAgt.FinInstnId.ClrSysMmbId.MmbId}`,
          creDtTm: pacs008.FIToFICstmrCdtTrf.GrpHdr.CreDtTm,
          instdAmt: {
            amt: Number(pacs008.FIToFICstmrCdtTrf.CdtTrfTxInf.InstdAmt.Amt.Amt),
            ccy: pacs008.FIToFICstmrCdtTrf.CdtTrfTxInf.InstdAmt.Amt.Ccy,
          },
        },
      });
    }
  }

  return retVals;
};

export {
  generatePain001,
  generatePain013,
  generatePacs002,
  generatePacs008,
  prepGraphAccounts,
  prepGraphEntities,
  prepGraphTransactions,
  prepGraphAccountHolders,
};
