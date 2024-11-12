import type {
  DataCache,
  Pacs002,
  Pacs008,
  Pain001,
  Pain013,
} from "@tazama-lf/frms-coe-lib/lib/interfaces";
import { generateID } from "../utils";
import { generatePacs008 } from "./pacs008";
import { generatePacs002 } from "./pacs002";

// should return pains if quoting is true
export const generateFullMessageSet = (
  quoting?: boolean,
): {
  pacs008: Pacs008;
  pacs002: Pacs002;
  //dataCache: DataCache;
  //pain001?: Pain001;
  //pain013?: Pain013;
} => {
  if (!quoting) {
    let pacs008 = generatePacs008();
    return {
      pacs008,
      pacs002: generatePacs002(
        pacs008.FIToFICstmrCdtTrf.CdtTrfTxInf.PmtId.EndToEndId,
      ),
    };
  } else {
    let pacs008 = generatePacs008();
    return {
      pacs008,
      pacs002: generatePacs002(
        pacs008.FIToFICstmrCdtTrf.CdtTrfTxInf.PmtId.EndToEndId,
      ),
    };
  }
};
