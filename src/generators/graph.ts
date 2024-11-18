import {
  Pacs002,
  Pacs008,
  Pain001,
  Pain013,
} from "@tazama-lf/frms-coe-lib/lib/interfaces";
import { AccountGraph, EntityGraph, GraphRelationship } from "../types/graph";
import {
  CREDITOR_ACCOUNT_TYPE,
  CREDITOR_AGENT_ID,
  CREDITOR_ID_TYPE,
  DEBTOR_ACCOUNT_TYPE,
  DEBTOR_AGENT_ID,
  DEBTOR_ID_TYPE,
} from "../utils";

export const prepGraphAccounts = (
  debtorAccountId: string,
  creditorAccountId: string,
): AccountGraph[] => {
  const dAccId = `${debtorAccountId}${DEBTOR_ACCOUNT_TYPE}${DEBTOR_AGENT_ID}`;
  const cAccId = `${creditorAccountId}${CREDITOR_ACCOUNT_TYPE}${CREDITOR_AGENT_ID}`;

  return [
    {
      _key: dAccId,
    },
    {
      _key: cAccId
    },
  ];
};

export const prepGraphEntities = (
  debtorId: string,
  creditorId: string,
  timestamp: Date,
): EntityGraph[] => {
  let debtorKey = makeKey(debtorId, "debtor");
  let creditorKey = makeKey(creditorId, "creditor");
  return [
    {
      _key: debtorKey,
      Id: debtorKey,
      CreDtTm: new Date(timestamp),
    },
    {
      _key: creditorKey,
      Id: creditorKey,
      CreDtTm: new Date(timestamp),
    },
  ];
};

const makeKey = (id: string, kind: "debtor" | "creditor"): string => {
  return `${id}${kind === "debtor" ? DEBTOR_ID_TYPE : CREDITOR_ID_TYPE}`;
};

export const prepGraphAccountHolders = (
  debtorId: string,
  debtorAccountId: string,
  creditorId: string,
  creditorAccountId: string,
  timestamp: Date,
  prefixEntities?: string,
  prefixAccounts?: string,
): GraphRelationship[] => {
  const debtorKey = makeKey(debtorId, "debtor");
  const creditorKey = makeKey(creditorId, "creditor");

  const dAccId = `${debtorAccountId}${DEBTOR_ACCOUNT_TYPE}${DEBTOR_AGENT_ID}`;
  const cAccId = `${creditorAccountId}${CREDITOR_ACCOUNT_TYPE}${CREDITOR_AGENT_ID}`;

  const accountsPrefix = prefixAccounts ?? "accounts/";
  const entitiesPrefix = prefixEntities ?? "entities/";
  return [
    {
      _key: debtorKey + dAccId,
      _from: `${entitiesPrefix}${debtorKey}`,
      _to: `${accountsPrefix}${dAccId}`,
      CreDtTm: timestamp,
    },
    {
      _key: creditorKey + cAccId,
      _from: `${entitiesPrefix}${creditorKey}`,
      _to: `${accountsPrefix}${cAccId}`,
      CreDtTm: timestamp,
    },
  ];
};

const test = (pacs008: Pacs008, pacs002: Pacs002, pain001: Pain001, pain013: Pain013) => {
  let currency = pacs008.FIToFICstmrCdtTrf.CdtTrfTxInf.InstdAmt.Amt.Ccy;
  let amount = pacs008.FIToFICstmrCdtTrf.CdtTrfTxInf.InstdAmt.Amt.Amt;
  let endToEndId = pacs008.FIToFICstmrCdtTrf.CdtTrfTxInf.PmtId.EndToEndId;
  let timestampPacs008 = pacs008.FIToFICstmrCdtTrf.GrpHdr.CreDtTm;
  let messageIdPacs008 = pacs008.FIToFICstmrCdtTrf.GrpHdr.MsgId;

  let timestampPacs002 = pacs002.FIToFIPmtSts.GrpHdr.CreDtTm;
  let messageIdPacs002 = pacs002.FIToFIPmtSts.GrpHdr.MsgId;
  let pacs002Sts = pacs002.FIToFIPmtSts.TxInfAndSts.TxSts;

  const timestampPain001 = pain001.CstmrCdtTrfInitn.GrpHdr.CreDtTm;
  const messageIdPain001 = pain001.CstmrCdtTrfInitn.GrpHdr.MsgId;
  const timestampPain013 = pain013.CdtrPmtActvtnReq.GrpHdr.CreDtTm;
  const messageIdPain013 = pain013.CdtrPmtActvtnReq.GrpHdr.MsgId;
};

export const prepGraphTransactions = (
  debtorAccountId: string,
  creditorAccountId: string,
  currency: string,
  amount: number,
  endToEndId: string,
  timestampPacs008: Date,
  messageIdPacs008: string,
  timestampPacs002: Date,
  messageIdPacs002: string,
  pacs002Sts: string,
  quoting?: {
    timestampPain001: Date;
    messageIdPain001: string;
    timestampPain013: Date;
    messageIdPain013: string;
  },
  prefixAccounts?: string,
) => {
  const dAccId = `${debtorAccountId}${DEBTOR_ACCOUNT_TYPE}${DEBTOR_AGENT_ID}`;
  const cAccId = `${creditorAccountId}${CREDITOR_ACCOUNT_TYPE}${CREDITOR_AGENT_ID}`;

  const accountsPrefix = prefixAccounts ?? "accounts/";

  const transactions = [];

  if (quoting) {
    transactions.push({
      _from: `${accountsPrefix}${dAccId}`,
      _to: `${accountsPrefix}${cAccId}`,
      TxTp: "pain.001.001.11",
      CreDtTm: quoting.timestampPain001,
      Amt: amount,
      Ccy: currency,
      PmtInfId: quoting.messageIdPain001,
      EndToEndId: endToEndId,
    });
    transactions.push({
      _from: `${accountsPrefix}${cAccId}`,
      _to: `${accountsPrefix}${dAccId}`,
      TxTp: "pain.013.001.09",
      CreDtTm: quoting.timestampPain013,
      Amt: amount,
      Ccy: currency,
      PmtInfId: quoting.messageIdPain013,
      EndToEndId: endToEndId,
    });
  }

  transactions.push({
    _from: `${accountsPrefix}${debtorAccountId}`,
    _to: `${accountsPrefix}${creditorAccountId}`,
    TxTp: "pacs.008.001.10",
    CreDtTm: timestampPacs008,
    Amt: amount,
    Ccy: currency,
    PmtInfId: messageIdPacs008,
    EndToEndId: endToEndId,
  });

  if (typeof timestampPacs002 !== "undefined") {
    transactions.push({
      _from: `${accountsPrefix}${creditorAccountId}`,
      _to: `${accountsPrefix}${debtorAccountId}`,
      TxTp: "pacs.002.001.12",
      TxSts: pacs002Sts,
      CreDtTm: timestampPacs002,
      PmtInfId: messageIdPacs002,
      EndToEndId: endToEndId,
    });
  }

  return transactions;
};
