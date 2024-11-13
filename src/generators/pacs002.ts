import { Pacs002 } from "@tazama-lf/frms-coe-lib/lib/interfaces";
import {
  createTimestamp,
  CREDITOR_AGENT_ID,
  DEBTOR_AGENT_ID,
  generateID,
} from "../utils";

export const generatePacs002 = (
  endToEndId: string,
  instrId: string,
  pacs002Sts: string = "ACCC",
): Pacs002 => {
  let timestampPacs002 = createTimestamp(0);

  return {
    TxTp: "pacs.002.001.12",
    FIToFIPmtSts: {
      GrpHdr: {
        MsgId: generateID(),
        CreDtTm: timestampPacs002,
      },
      TxInfAndSts: {
        OrgnlInstrId: "5ab4fc7355de4ef8a75b78b00a681ed2",
        OrgnlEndToEndId: endToEndId,
        TxSts: pacs002Sts,
        ChrgsInf: [
          {
            Amt: {
              Amt: 0.0,
              Ccy: "USD",
            },
            Agt: {
              FinInstnId: {
                ClrSysMmbId: {
                  MmbId: DEBTOR_AGENT_ID,
                },
              },
            },
          },
          {
            Amt: {
              Amt: 0.0,
              Ccy: "USD",
            },
            Agt: {
              FinInstnId: {
                ClrSysMmbId: {
                  MmbId: DEBTOR_AGENT_ID,
                },
              },
            },
          },
          {
            Amt: {
              Amt: 0.0,
              Ccy: "USD",
            },
            Agt: {
              FinInstnId: {
                ClrSysMmbId: {
                  MmbId: CREDITOR_AGENT_ID,
                },
              },
            },
          },
        ],
        AccptncDtTm: new Date("2023-06-02T07:52:31.000Z"),
        InstgAgt: {
          FinInstnId: {
            ClrSysMmbId: {
              MmbId: DEBTOR_AGENT_ID,
            },
          },
        },
        InstdAgt: {
          FinInstnId: {
            ClrSysMmbId: {
              MmbId: CREDITOR_AGENT_ID,
            },
          },
        },
      },
    },
  };
};
