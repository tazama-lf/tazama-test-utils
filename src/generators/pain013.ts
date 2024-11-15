import { Pain001, Pain013 } from "@tazama-lf/frms-coe-lib/lib/interfaces";
import { createTimestamp, generateID } from "../utils";
import { PartialCustomTransaction } from "../types/custom-transaction";

export const generatePain013 = (
  base: Pain001,
  opts?: PartialCustomTransaction,
): Pain013 => {
  let timestampPain013 = createTimestamp(2, opts?.firstSetTime);

  return {
    TxTp: "pain.013.001.09",
    CdtrPmtActvtnReq: {
      GrpHdr: {
        MsgId: generateID(),
        CreDtTm: `${timestampPain013}`,
        NbOfTxs: 1,
        InitgPty: base.CstmrCdtTrfInitn.GrpHdr.InitgPty,
      },
      PmtInf: {
        PmtInfId: base.CstmrCdtTrfInitn.PmtInf.PmtInfId,
        PmtMtd: base.CstmrCdtTrfInitn.PmtInf.PmtMtd,
        ReqdAdvcTp: base.CstmrCdtTrfInitn.PmtInf.ReqdAdvcTp,
        ReqdExctnDt: {
          DtTm: new Date("2023-06-02T07:51:48.000Z"),
        },
        XpryDt: {
          DtTm: new Date("2021-11-30T10:38:56.000Z"),
        },
        Dbtr: base.CstmrCdtTrfInitn.PmtInf.Dbtr,
        DbtrAcct: {
          Id: {
            Othr: [
              {
                Nm: base.CstmrCdtTrfInitn.PmtInf.DbtrAcct.Nm,
                Id: base.CstmrCdtTrfInitn.PmtInf.DbtrAcct.Id.Othr[0].Id,
                SchmeNm:
                  base.CstmrCdtTrfInitn.PmtInf.DbtrAcct.Id.Othr[0].SchmeNm,
              },
            ],
          },
        },
        DbtrAgt: base.CstmrCdtTrfInitn.PmtInf.DbtrAgt,
        CdtTrfTxInf: {
          ...base.CstmrCdtTrfInitn.PmtInf.CdtTrfTxInf,
          SplmtryData: {
            Envlp: {
              Doc: {
                PyeeRcvAmt: {
                  Amt: {
                    Amt: (0.0).toString(),
                    Ccy: base.CstmrCdtTrfInitn.PmtInf.CdtTrfTxInf.Amt.InstdAmt
                      .Amt.Ccy,
                  },
                },
                PyeeFinSvcsPrvdrFee: {
                  Amt: {
                    Amt: (0.0).toString(),
                    Ccy: base.CstmrCdtTrfInitn.PmtInf.CdtTrfTxInf.Amt.InstdAmt
                      .Amt.Ccy,
                  },
                },
                PyeeFinSvcsPrvdrComssn: {
                  Amt: {
                    Amt: (0.0).toString(),
                    Ccy: base.CstmrCdtTrfInitn.PmtInf.CdtTrfTxInf.Amt.InstdAmt
                      .Amt.Ccy,
                  },
                },
              },
            },
          },
        },
      },
      SplmtryData: {
        Envlp: {
          Doc: {
            InitgPty: {
              Glctn: base.CstmrCdtTrfInitn.SplmtryData.Envlp.Doc.InitgPty.Glctn,
            },
          },
        },
      },
    },
  };
};
