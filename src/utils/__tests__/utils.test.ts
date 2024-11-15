import { AccountType } from "@tazama-lf/frms-coe-lib/lib/interfaces";
import {
  generateID,
  generateAmount,
  generateRandomAge,
  generateDateOfBirth,
} from "..";
import { v4 } from "uuid";

describe("Utility Functions", () => {
  describe("generateID function", () => {
    it("should generate a random ID when no idType is provided", () => {
      const result = generateID();
      expect(result.length).toBe(v4().replace(/-/g, "").length);
    });

    it("should generate a debtor entity ID when idType is provided with debtor account", () => {
      let initial = "dbtr_";
      const result = generateID({
        entity: AccountType.DebtorAcct,
        id: "entity",
      });
      expect(result.startsWith(initial)).toBe(true);

      expect(result.slice(initial.length).length).toBe(generateID().length);
    });

    it("should generate a debtor account ID when idType is provided with debtor account and account type", () => {
      let initial = "dbtrAcct_";
      const result = generateID({
        entity: AccountType.DebtorAcct,
        id: "account",
      });
      expect(result.startsWith(initial)).toBe(true);

      expect(result.slice(initial.length).length).toBe(generateID().length);
    });

    it("should generate a creditor entity ID when idType is provided with creditor account", () => {
      let initial = "cdtr_";
      const result = generateID({
        entity: AccountType.CreditorAcct,
        id: "entity",
      });
      expect(result.startsWith(initial)).toBe(true);

      expect(result.slice(initial.length).length).toBe(generateID().length);
    });

    it("should generate a creditor account ID when idType is provided with creditor account and account type", () => {
      let initial = "cdtrAcct_";
      const result = generateID({
        entity: AccountType.CreditorAcct,
        id: "account",
      });

      expect(result.startsWith(initial)).toBe(true);

      expect(result.slice(initial.length).length).toBe(generateID().length);
    });
  });

  describe("generateAmount function", () => {
    it("should generate a random amount between 100 and 1000", () => {
      const result = generateAmount();
      expect(result).toBeLessThanOrEqual(1000);
      expect(result).toBeGreaterThanOrEqual(100);
    });
  });

  describe("generateRandomAge function", () => {
    it("should generate a random age between 18 and 99", () => {
      const result = generateRandomAge();
      expect(result).toBeLessThanOrEqual(99);
      expect(result).toBeGreaterThanOrEqual(18);
    });
  });

  describe("generateDateOfBirth function", () => {
    it("should generate a date of birth for a specific age [FLAKY TEST!]", () => {
      const thisYear = new Date().getFullYear();
      const age = 30;

      const dob = generateDateOfBirth(age).getFullYear();

      expect(thisYear - age).toBe(dob);
    });

    it("should generate a date of birth for a random age when no age is provided", () => {
      const currentYear = new Date().getFullYear();

      const result = generateDateOfBirth().getFullYear();
      expect(currentYear - result).toBeGreaterThanOrEqual(18);
      expect(currentYear - result).toBeLessThanOrEqual(99);
    });
  });
});
