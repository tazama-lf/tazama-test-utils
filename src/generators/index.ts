import type {
  Pacs002,
  Pacs008,
  Pain001,
  Pain013,
} from "@tazama-lf/frms-coe-lib/lib/interfaces";
import { generatePacs008 } from "./pacs008";
import { generatePacs002 } from "./pacs002";
import { generatePain001 } from "./pain001";
import { generatePain013 } from "./pain013";

// should return pains if quoting is true
export const generateFullMessageSet = (
  quoting?: boolean,
): {
  pacs008: Pacs008;
  pacs002: Pacs002;
  pain001?: Pain001;
  pain013?: Pain013;
} => {
  if (!quoting) {
    let pacs008 = generatePacs008();
    return {
      pacs008,
      pacs002: generatePacs002(
        pacs008.FIToFICstmrCdtTrf.CdtTrfTxInf.PmtId.EndToEndId,
        pacs008.FIToFICstmrCdtTrf.CdtTrfTxInf.PmtId.InstrId,
      ),
    };
  } else {
    let pain001 = generatePain001();
    let pain013 = generatePain013(pain001);

    let pacs008 = generatePacs008(pain013);
    return {
      pain001,
      pain013,
      pacs008,
      pacs002: generatePacs002(
        pacs008.FIToFICstmrCdtTrf.CdtTrfTxInf.PmtId.EndToEndId,
        pacs008.FIToFICstmrCdtTrf.CdtTrfTxInf.PmtId.InstrId,
      ),
    };
  }
};

export { generatePain001, generatePain013, generatePacs002, generatePacs008 };
