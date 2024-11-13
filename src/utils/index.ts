import { v4 as uuidv4 } from "uuid";
import { faker } from "@faker-js/faker";
import { AccountType } from "@tazama-lf/frms-coe-lib/lib/interfaces";

export const DEBTOR_AGENT_ID = "fsp001";
export const CREDITOR_AGENT_ID = "fsp002";
export const DEBTOR_ID_TYPE = "TAZAMA_EID";
export const DEBTOR_ACCOUNT_TYPE = "MSISDN";
export const CREDITOR_ID_TYPE = "TAZAMA_EID";
export const CREDITOR_ACCOUNT_TYPE = "MSISDN";

export const generateID = (idType?: {
  entity: AccountType;
  id: "entity" | "account";
}): string => {
  let id = uuidv4().replace(/-/g, "");
  if (!idType) {
    return id;
  } else {
    switch (idType.entity) {
      case AccountType.DebtorAcct:
        switch (idType.id) {
          case "entity":
            return `dbtr_${id}`;
          case "account":
            return `dbtrAcct_${id}`;
        }
      case AccountType.CreditorAcct:
        switch (idType.id) {
          case "entity":
            return `cdtr_${id}`;
          case "account":
            return `cdtrAcct_${id}`;
        }
    }
  }
};

export const generateAmount = (): number => {
  return Number(faker.finance.amount({ min: 10, max: 1000 }));
};

export const generateRandomAge = (): number => {
  return faker.number.int({
    min: 18,
    max: 99,
  });
};

export const generateDateOfBirth = (age?: number) => {
  return faker.date.birthdate({
    mode: "age",
    min: age ? age : 18,
    max: age ? age : 99,
  });
};

export const createTimestamp = (
  factor: number,
  timestampEpoch: number = 0,
): string => {
  const interval = 300000; // 300,000 milliseconds = 5 minutes
  return new Date(
    new Date(Date.now() - timestampEpoch - interval * factor),
  ).toISOString();
};
