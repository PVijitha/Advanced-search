
export enum SearchOperator {
  CONTAINS = 'Contains',
  EQUALS = 'Equals',
  NOT_CONTAINS = 'Not Contains'
}

export enum LogicalOperator {
  AND = 'AND',
  OR = 'OR'
}

export interface SearchCondition {
  id: string;
  operator: SearchOperator;
  value: string;
  logicalNext?: LogicalOperator;
}

export interface PreFilters {
  procedureTitle: boolean;
  procedureText: boolean;
  includeInvisible: boolean;
  includeHiddenAccounts: boolean;
  category: string;
  sortBy: string;
}

export interface PostFilters {
  cid: string;
  sid: string;
  pid: string;
  accountName: string;
  relationshipManager: string;
}

export interface Procedure {
  id: string;
  title: string;
  accountName: string;
  cid: string;
  pid: string;
  sid: string;
  category: string;
  relationshipManager: string;
  snippet: string;
}

export enum Tab {
  PROCEDURES = 'Procedures',
  SECTIONS = 'Sections',
  QUESTIONS = 'Questions',
  QUESTION_DETAILS = 'Question Details'
}
