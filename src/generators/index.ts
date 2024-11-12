import type {
  DataCache,
  Pacs002,
  Pacs008,
  Pain001,
  Pain013,
} from "@tazama-lf/frms-coe-lib/lib/interfaces";
import { generateID } from "../utils";

// should return pains if quoting is true
//export const generateFullMessageSet = (
//  quoting?: boolean,
//): {
//  pacs008: Pacs008;
//  pacs002: Pacs002;
//  dataCache: DataCache;
//  pain001?: Pain001;
//  pain013?: Pain013;
//} => {
//  let endToEndId = generateID();
//};
