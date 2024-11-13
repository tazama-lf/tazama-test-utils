import { faker } from "@faker-js/faker";
import { generateDateOfBirth, generateID } from "../utils";
import { AccountType } from "@tazama-lf/frms-coe-lib/lib/interfaces";

export type BirthInformation = {
  city: string;
  date: Date;
  country: string;
};

export class Person {
  firstName: string;
  middleName: string;
  lastName: string;
  birthData: BirthInformation;
  phoneNumber: string;
  id: string;
  accountId: string;

  constructor(kind: AccountType) {
    this.firstName = faker.person.firstName();
    this.middleName = faker.person.middleName();
    this.lastName = faker.person.lastName();
    this.birthData = {
      city: faker.location.city(),
      date: generateDateOfBirth(),
      country: faker.location.countryCode(),
    };
    this.phoneNumber = faker.phone.number({ style: "international" });
    this.id = generateID({ entity: kind, id: "entity" });
    this.accountId = generateID({ entity: kind, id: "account" });
  }

  fullName(): string {
    return `${this.firstName} ${this.middleName} ${this.lastName}`;
  }
}
