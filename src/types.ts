import { Dayjs } from "dayjs";

import {emotions} from "./consts";

export type FormState = {
  date?: Dayjs,
  trigger?: string,
  emotions?: string[],
  emotionGroup: keyof typeof emotions,
  thoughts?: string,
  behavior?: string
}

export type Fields = keyof TableRecord;

export type TableRecord = Omit<FormState, 'date'> & {
  id: string,
  date: string,
  time: string,
  weight?: string
}

export type Records = Record<string, TableRecord[]>;
