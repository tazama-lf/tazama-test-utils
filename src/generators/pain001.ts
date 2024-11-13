import {
  AccountType,
  Pain001,
} from "@tazama-lf/frms-coe-lib/lib/interfaces";
import {
  createTimestamp,
  CREDITOR_ACCOUNT_TYPE,
  CREDITOR_AGENT_ID,
  CREDITOR_ID_TYPE,
  DEBTOR_ACCOUNT_TYPE,
  DEBTOR_AGENT_ID,
  DEBTOR_ID_TYPE,
  generateAmount,
  generateID,
} from "../utils";
import { faker } from "@faker-js/faker";
import { Person } from "../types/person";

export const generatePain001 = (): Pain001 => {
  let timestampPain001 = createTimestamp(3);

  const debtor = new Person(AccountType.DebtorAcct);
  const paymentInfId = generateID();
  const endToEndId = generateID();

  const transactionDescription = "Generic payment description";
  const transactionPurpose = 'TRANSFER';

  const amount = generateAmount().toString();
  const currency = "XTS";

  const creditor = new Person(AccountType.CreditorAcct);

  return {
    TxTp: "pain.001.001.11",
    CstmrCdtTrfInitn: {
      GrpHdr: {
        MsgId: generateID(),
        CreDtTm: `${timestampPain001}`,
        NbOfTxs: 1,
        InitgPty: {
          Nm: debtor.fullName(),
          Id: {
            PrvtId: {
              DtAndPlcOfBirth: {
                BirthDt: debtor.birthData.date,
                CityOfBirth: debtor.birthData.city,
                CtryOfBirth: debtor.birthData.country,
              },
              Othr: [
                {
                  Id: debtor.phoneNumber,
                  SchmeNm: {
                    Prtry: DEBTOR_ACCOUNT_TYPE,
                  },
                },
              ],
            },
          },
          CtctDtls: {
            MobNb: debtor.phoneNumber,
          },
        },
      },
      PmtInf: {
        PmtInfId: paymentInfId,
        PmtMtd: "TRA",
        ReqdAdvcTp: {
          DbtAdvc: {
            Cd: "ADWD",
            Prtry: "Advice with transaction details",
          },
        },
        ReqdExctnDt: {
          Dt: new Date("2023-06-02"),
          DtTm: new Date("2023-06-02T07:50:57.000Z"),
        },
        Dbtr: {
          Nm: debtor.fullName(),
          Id: {
            PrvtId: {
              DtAndPlcOfBirth: {
                BirthDt: debtor.birthData.date,
                CityOfBirth: debtor.birthData.city,
                CtryOfBirth: debtor.birthData.country,
              },
              Othr: [
                {
                  Id: debtor.id,
                  SchmeNm: {
                    Prtry: DEBTOR_ID_TYPE,
                  },
                },
              ],
            },
          },
          CtctDtls: {
            MobNb: debtor.phoneNumber,
          },
        },
        DbtrAcct: {
          Id: {
            Othr: [
              {
                Id: debtor.accountId,
                SchmeNm: {
                  Prtry: DEBTOR_ACCOUNT_TYPE,
                },
              },
            ],
          },
          Nm: `${debtor.firstName} ${debtor.lastName}`,
        },
        DbtrAgt: {
          FinInstnId: {
            ClrSysMmbId: {
              MmbId: DEBTOR_AGENT_ID,
            },
          },
        },
        CdtTrfTxInf: {
          PmtId: {
            EndToEndId: endToEndId,
          },
          PmtTpInf: {
            CtgyPurp: {
              Prtry: `${transactionPurpose}`,
            },
          },
          Amt: {
            InstdAmt: {
              Amt: {
                Amt: amount,
                Ccy: currency,
              },
            },
            EqvtAmt: {
              Amt: {
                Amt: amount,
                Ccy: currency,
              },
              CcyOfTrf: currency,
            },
          },
          ChrgBr: "DEBT",
          CdtrAgt: {
            FinInstnId: {
              ClrSysMmbId: {
                MmbId: CREDITOR_AGENT_ID,
              },
            },
          },
          Cdtr: {
            Nm: creditor.fullName(),
            Id: {
              PrvtId: {
                DtAndPlcOfBirth: {
                  BirthDt: creditor.birthData.date,
                  CityOfBirth: creditor.birthData.city,
                  CtryOfBirth: creditor.birthData.country,
                },
                Othr: [
                  {
                    Id: creditor.id,
                    SchmeNm: {
                      Prtry: CREDITOR_ID_TYPE,
                    },
                  },
                ],
              },
            },
            CtctDtls: {
              MobNb: creditor.phoneNumber,
            },
          },
          CdtrAcct: {
            Id: {
              Othr: [
                {
                  Id: creditor.accountId,
                  SchmeNm: {
                    Prtry: CREDITOR_ACCOUNT_TYPE,
                  },
                },
              ],
            },
            Nm: `${creditor.firstName} ${creditor.lastName}`,
          },
          Purp: {
            Cd: "MP2P",
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
                Dbtr: {
                  FrstNm: debtor.firstName,
                  MddlNm: debtor.middleName,
                  LastNm: debtor.lastName,
                  MrchntClssfctnCd: "BLANK",
                },
                Cdtr: {
                  FrstNm: creditor.firstName,
                  MddlNm: creditor.middleName,
                  LastNm: creditor.lastName,
                  MrchntClssfctnCd: "BLANK",
                },
                DbtrFinSvcsPrvdrFees: {
                  Ccy: `${currency}`,
                  Amt: (0.0).toString(),
                },
                Xprtn: new Date("2021-11-30T10:38:56.000Z"),
              },
            },
          },
        },
      },
      SplmtryData: {
        Envlp: {
          Doc: {
            InitgPty: {
              InitrTp: "CONSUMER",
              Glctn: {
                Lat: faker.location.latitude().toString(),
                Long: faker.location.longitude().toString(),
              },
            },
          },
        },
      },
    },
  };
};
