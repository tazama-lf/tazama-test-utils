import {
  AccountType,
  Pacs008,
  Pain013,
} from "@tazama-lf/frms-coe-lib/lib/interfaces";
import {
  createTimestamp,
  CREDITOR_AGENT_ID,
  CREDITOR_ID_TYPE,
  DEBTOR_ACCOUNT_TYPE,
  DEBTOR_AGENT_ID,
  generateAmount,
  generateID,
} from "../utils";
import { Person } from "../types/person";
import { PartialCustomTransaction } from "../types/custom-transaction";

export const generatePacs008 = (
  inheritedDebtor?: Person,
  inheritedCreditor?: Person,
  quoting?: Pain013,
  opts?: PartialCustomTransaction,
): Pacs008 => {
  let timestampPacs008 = createTimestamp(1, opts?.firstSetTime);

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

  let debtorFullName: string;
  let debtorCityOfBirth: string;
  let debtorCountryOfBirth: string;
  let debtorSimpleName: string;
  let debtorPhoneNumber: string;

  let creditorSimpleName: string;
  let creditorFullName: string;
  let creditorDoB: Date;
  let creditorPhoneNumber: string;
  let creditorCountryofBirth: string;
  let creditorCityofBirth: string;

  let paymentInfId: string;

  if (!quoting) {
    const debtor =
      inheritedDebtor ?? new Person(AccountType.DebtorAcct, opts?.debtorAge);
    const creditor = inheritedCreditor ?? new Person(AccountType.CreditorAcct);
    currency = opts?.currency ?? "XTS";
    endToEndId = generateID();
    amount = opts?.amount ?? generateAmount();

    debtorDoB = debtor.birthData.date;
    debtorId = debtor.id;
    debtorAccountId = debtor.accountId;

    transactionDescription = opts?.description ?? "Generic Payment Description";

    debtorFullName = debtor.fullName();
    debtorCityOfBirth = debtor.birthData.city;
    debtorCountryOfBirth = debtor.birthData.country;
    debtorSimpleName = `${debtor.firstName} ${debtor.lastName}`;
    debtorPhoneNumber = debtor.phoneNumber;

    creditorSimpleName = `${creditor.firstName} ${creditor.lastName}`;
    creditorId = creditor.id;
    creditorAccountId = creditor.accountId;
    creditorPhoneNumber = creditor.phoneNumber;
    creditorFullName = creditor.fullName();
    creditorCityofBirth = creditor.birthData.city;
    creditorCountryofBirth = creditor.birthData.country;
    creditorDoB = creditor.birthData.date;
    paymentInfId = generateID();
  } else {
    currency = quoting.CdtrPmtActvtnReq.PmtInf.CdtTrfTxInf.Amt.InstdAmt.Amt.Ccy;
    endToEndId = quoting.CdtrPmtActvtnReq.PmtInf.CdtTrfTxInf.PmtId.EndToEndId;
    amount = Number(
      quoting.CdtrPmtActvtnReq.PmtInf.CdtTrfTxInf.Amt.InstdAmt.Amt.Amt,
    );
    debtorDoB =
      quoting.CdtrPmtActvtnReq.PmtInf.Dbtr.Id.PrvtId.DtAndPlcOfBirth.BirthDt;
    debtorId = quoting.CdtrPmtActvtnReq.PmtInf.Dbtr.Id.PrvtId.Othr[0].Id;
    debtorAccountId = quoting.CdtrPmtActvtnReq.PmtInf.DbtrAcct.Id.Othr[0].Id;
    transactionDescription =
      quoting.CdtrPmtActvtnReq.PmtInf.CdtTrfTxInf.RmtInf.Ustrd;

    debtorFullName = quoting.CdtrPmtActvtnReq.PmtInf.Dbtr.Nm;

    debtorCityOfBirth =
      quoting.CdtrPmtActvtnReq.PmtInf.Dbtr.Id.PrvtId.DtAndPlcOfBirth
        .CityOfBirth;
    debtorCountryOfBirth =
      quoting.CdtrPmtActvtnReq.PmtInf.Dbtr.Id.PrvtId.DtAndPlcOfBirth
        .CtryOfBirth;

    let nameTokens = debtorFullName.split(" ");
    debtorSimpleName = `${nameTokens[0]} ${nameTokens[2]}`;
    debtorPhoneNumber = quoting.CdtrPmtActvtnReq.PmtInf.Dbtr.CtctDtls.MobNb;

    creditorFullName = quoting.CdtrPmtActvtnReq.PmtInf.CdtTrfTxInf.Cdtr.Nm;
    nameTokens = creditorFullName.split(" ");
    creditorSimpleName = `${nameTokens[0]} ${nameTokens[2]}`;
    creditorId =
      quoting.CdtrPmtActvtnReq.PmtInf.CdtTrfTxInf.Cdtr.Id.PrvtId.Othr[0].Id;
    creditorAccountId =
      quoting.CdtrPmtActvtnReq.PmtInf.CdtTrfTxInf.CdtrAcct.Id.Othr[0].Id;

    creditorPhoneNumber =
      quoting.CdtrPmtActvtnReq.PmtInf.CdtTrfTxInf.Cdtr.CtctDtls.MobNb;
    creditorDoB =
      quoting.CdtrPmtActvtnReq.PmtInf.CdtTrfTxInf.Cdtr.Id.PrvtId.DtAndPlcOfBirth
        .BirthDt;
    creditorCityofBirth =
      quoting.CdtrPmtActvtnReq.PmtInf.CdtTrfTxInf.Cdtr.Id.PrvtId.DtAndPlcOfBirth
        .CityOfBirth;
    creditorCountryofBirth =
      quoting.CdtrPmtActvtnReq.PmtInf.CdtTrfTxInf.Cdtr.Id.PrvtId.DtAndPlcOfBirth
        .CtryOfBirth;
    paymentInfId = quoting.CdtrPmtActvtnReq.PmtInf.PmtInfId;
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
          InstrId: paymentInfId,
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
          Nm: debtorFullName,
          Id: {
            PrvtId: {
              DtAndPlcOfBirth: {
                BirthDt: debtorDoB,
                CityOfBirth: debtorCityOfBirth,
                CtryOfBirth: debtorCountryOfBirth,
              },
              Othr: [
                {
                  Id: debtorPhoneNumber,
                  SchmeNm: {
                    Prtry: DEBTOR_ACCOUNT_TYPE,
                  },
                },
              ],
            },
          },
          CtctDtls: {
            MobNb: debtorPhoneNumber,
          },
        },
        Dbtr: {
          Nm: debtorFullName,
          Id: {
            PrvtId: {
              DtAndPlcOfBirth: {
                BirthDt: debtorDoB,
                CityOfBirth: debtorCityOfBirth,
                CtryOfBirth: debtorCountryOfBirth,
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
            MobNb: debtorPhoneNumber,
          },
        },
        DbtrAcct: {
          Id: {
            Othr: [
              {
                Id: debtorAccountId,
                SchmeNm: {
                  Prtry: DEBTOR_ACCOUNT_TYPE,
                },
              },
            ],
          },
          Nm: debtorSimpleName,
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
          Nm: creditorFullName,
          Id: {
            PrvtId: {
              DtAndPlcOfBirth: {
                BirthDt: creditorDoB,
                CityOfBirth: creditorCityofBirth,
                CtryOfBirth: creditorCountryofBirth,
              },
              Othr: [
                {
                  Id: creditorId,
                  SchmeNm: {
                    Prtry: CREDITOR_ID_TYPE,
                  },
                },
              ],
            },
          },
          CtctDtls: {
            MobNb: creditorPhoneNumber,
          },
        },
        CdtrAcct: {
          Id: {
            Othr: [
              {
                Id: creditorAccountId,
                SchmeNm: {
                  Prtry: CREDITOR_ID_TYPE,
                },
              },
            ],
          },
          Nm: creditorSimpleName,
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
