export interface AccountGraph {
  _key: string;
}

export interface EntityGraph {
  _key: string;
  Id: string;
  CreDtTm: Date;
}

export interface GraphRelationship {
  _key: string;
  _from: string;
  _to: string;
  CreDtTm: Date;
}
