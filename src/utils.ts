import {Fields, FormState, Records, TableRecord} from "./types";
import {emotions} from "./consts";

export function keyBy(records: Records) {
  return Object.keys(records);
}

export function sortLocalCompare(a: string = '', b: string = '') {
  return a?.localeCompare(b);
}

export function sortBy(records: TableRecord[], field: Fields) {
  return records.sort((a, b) => sortLocalCompare(a[field], b[field]));
}

export function transformData(form: FormState) {
  const date = form?.date?.format('YYYY-MM-DD');
  const time = form?.date?.format('HH:mm');

  return JSON.stringify({ ...form, date, time });
}

export function adaptData(records: TableRecord[]): Records {
  return  records.reduce((acc: Records, curr) => {
    return {
      ...acc,
      [curr.date]: [
        ...(acc[curr.date] || []),
        curr
      ]
    };
  }, {})
}


export function formatEmotions(emotionsResponse: string[] = [], emotionKey: string) {
  const list = emotions[emotionKey];

  return emotionsResponse.map(emotionResponse => list.find(item => item.value === emotionResponse).label);
}