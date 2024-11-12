import { AccountType, Pacs008 } from "@tazama-lf/frms-coe-lib/lib/interfaces";
import {
  CREDITOR_AGENT_ID,
  CREDITOR_ID_TYPE,
  DEBTOR_ACCOUNT_TYPE,
  DEBTOR_AGENT_ID,
  generateAmount,
  generateDateOfBirth,
  generateID,
  TIMESTAMP_INTERVAL,
} from "../utils";

export const generatePacs008 = (
  quoting?: {
    endToEndId: string;
    currency: string;
    amount: number;
    debtorDoB: Date;
    debtorAccountId: string;
    creditorId: string;
    debtorId: string;
    creditorAccountId: string;
    transactionDescription: string;
  },
  timestampEpoch: number = 0,
): Pacs008 => {
  let timestampPacs008 = new Date(
    new Date(Date.now() - timestampEpoch - TIMESTAMP_INTERVAL * 1),
  ).toISOString();

  let transactionPurpose = quoting ? "TRANSFER" : "MP2P";
  let endToEndId: string;
  let currency: string;
  let amount: number;
  let debtorDoB: Date;
  let debtorId: string;
  let debtorAccountId: string;
  let creditorId: string;
  let creditorAccountId: string;
  let transactionDescription: string;

  if (!quoting) {
    currency = "XTS";
    endToEndId = generateID();
    amount = generateAmount();
    debtorDoB = generateDateOfBirth();
    debtorId = generateID({ id: "entity", entity: AccountType.DebtorAcct });
    debtorAccountId = generateID({
      id: "account",
      entity: AccountType.DebtorAcct,
    });
    creditorId = generateID({ id: "entity", entity: AccountType.CreditorAcct });
    creditorAccountId = generateID({
      id: "account",
      entity: AccountType.CreditorAcct,
    });
    transactionDescription = "Generic Payment Description";
  } else {
    currency = quoting.currency;
    endToEndId = quoting.endToEndId;
    amount = quoting.amount;
    debtorDoB = quoting.debtorDoB;
    debtorId = quoting.debtorId;
    debtorAccountId = quoting.debtorAccountId;
    creditorId = quoting.creditorId;
    creditorAccountId = quoting.creditorAccountId;
    transactionDescription = quoting.transactionDescription;
  }

  return {
    TxTp: "pacs.008.001.10",
    FIToFICstmrCdtTrf: {
      GrpHdr: {
        MsgId: generateID(),
        CreDtTm: timestampPacs008,
        NbOfTxs: 1,
        SttlmInf: {
          SttlmMtd: "CLRG",
        },
      },
      CdtTrfTxInf: {
        PmtId: {
          InstrId: "5ab4fc7355de4ef8a75b78b00a681ed2",
          EndToEndId: endToEndId,
        },
        IntrBkSttlmAmt: {
          Amt: {
            Amt: `${amount}`,
            Ccy: currency,
          },
        },
        InstdAmt: {
          Amt: {
            Amt: `${amount}`,
            Ccy: currency,
          },
        },
        ChrgBr: "DEBT",
        ChrgsInf: {
          Amt: {
            Amt: "0.0",
            Ccy: currency,
          },
          Agt: {
            FinInstnId: {
              ClrSysMmbId: {
                MmbId: DEBTOR_AGENT_ID,
              },
            },
          },
        },
        InitgPty: {
          Nm: "April Blake Grant",
          Id: {
            PrvtId: {
              DtAndPlcOfBirth: {
                BirthDt: new Date("1968-02-01"),
                CityOfBirth: "Unknown",
                CtryOfBirth: "ZZ",
              },
              Othr: [
                {
                  Id: "+27730975224",
                  SchmeNm: {
                    Prtry: DEBTOR_ACCOUNT_TYPE,
                  },
                },
              ],
            },
          },
          CtctDtls: {
            MobNb: "+27-730975224",
          },
        },
        Dbtr: {
          Nm: "April Blake Grant",
          Id: {
            PrvtId: {
              DtAndPlcOfBirth: {
                BirthDt: debtorDoB,
                CityOfBirth: "Unknown",
                CtryOfBirth: "ZZ",
              },
              Othr: [
                {
                  Id: debtorId,
                  SchmeNm: {
                    Prtry: DEBTOR_ACCOUNT_TYPE,
                  },
                },
              ],
            },
          },
          CtctDtls: {
            MobNb: "+27-730975224",
          },
        },
        DbtrAcct: {
          Id: {
            Othr: [
              {
                Id: `${debtorAccountId}`,
                SchmeNm: {
                  Prtry: DEBTOR_ACCOUNT_TYPE,
                },
              },
            ],
          },
          Nm: "April Grant",
        },
        DbtrAgt: {
          FinInstnId: {
            ClrSysMmbId: {
              MmbId: DEBTOR_AGENT_ID,
            },
          },
        },
        CdtrAgt: {
          FinInstnId: {
            ClrSysMmbId: {
              MmbId: CREDITOR_AGENT_ID,
            },
          },
        },
        Cdtr: {
          Nm: "Felicia Easton Quill",
          Id: {
            PrvtId: {
              DtAndPlcOfBirth: {
                BirthDt: generateDateOfBirth(),
                CityOfBirth: "Unknown",
                CtryOfBirth: "ZZ",
              },
              Othr: [
                {
                  Id: `${creditorId}`,
                  SchmeNm: {
                    Prtry: CREDITOR_ID_TYPE,
                  },
                },
              ],
            },
          },
          CtctDtls: {
            MobNb: "+27-707650428",
          },
        },
        CdtrAcct: {
          Id: {
            Othr: [
              {
                Id: `${creditorAccountId}`,
                SchmeNm: {
                  Prtry: CREDITOR_ID_TYPE,
                },
              },
            ],
          },
          Nm: "Felicia Quill",
        },
        Purp: {
          Cd: `${transactionPurpose}`,
        },
      },
      RgltryRptg: {
        Dtls: {
          Tp: "BALANCE OF PAYMENTS",
          Cd: "100",
        },
      },
      RmtInf: {
        Ustrd: `${transactionDescription}`,
      },
      SplmtryData: {
        Envlp: {
          Doc: {
            Xprtn: new Date("2021-11-30T10:38:56.000Z"),
          },
        },
      },
    },
  };
};
