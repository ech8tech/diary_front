import { useEffect, useState } from "react";
import dayjs, {Dayjs} from "dayjs";
import {Affix, Button, DatePicker, Flex, Input, Tag} from "antd";
import FieldTimeOutlined from "@ant-design/icons/FieldTimeOutlined";
import DeleteOutlined from "@ant-design/icons/DeleteOutlined";
import EditOutlined from "@ant-design/icons/EditOutlined";
import PlusCircleOutlined from "@ant-design/icons/PlusCircleOutlined";

import isoWeek from 'dayjs/plugin/isoWeek';

import { Records } from "./types";
import { adaptData, formatEmotions, keyBy, sortBy, sortLocalCompare } from "./utils";
import { ModalAddRecord } from "./components";
import {weights} from "./consts";
import styles from './App.module.scss'
import {apiBasePath} from "./api";

const { RangePicker } = DatePicker;

dayjs.extend(isoWeek);

// dayjs().locale('en').weekday(0);

function gesturestartEvent(event: Event) {
  event.preventDefault();
}

type PeriodType = 'today' | 'week' | 'month' | 'year';

const selectDate: Record<PeriodType, [Dayjs, Dayjs]> = {
  today: [dayjs(), dayjs()],
  week: [dayjs().startOf('isoWeek'), dayjs()],
  month: [dayjs().startOf('month'), dayjs()],
  year: [dayjs().startOf('year'), dayjs()]
}

function App() {
  const [data, setData] = useState<Records>({});
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [period, setPeriod] = useState<[Dayjs, Dayjs]>(selectDate.week);

  console.log(apiBasePath)

  useEffect(() => {
    document.addEventListener('gesturestart', gesturestartEvent, { passive: false });

    fetch(apiBasePath).then(res => {
      if (res.ok) {
        res.json().then(data => setData(adaptData(data.data)));
      } else {
        console.log('Ошибка')
      }
    })

    return () => {
      document.removeEventListener('gesturestart', gesturestartEvent)
    }
  }, []);

  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => setIsOpen(false);

  const handleDelete = (id: string) => {
    fetch(`${apiBasePath}/delete/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then(data => setData(adaptData(data.data)))
  }

  const handleSetPeriod = (periodType: PeriodType) => {
    setPeriod(selectDate[periodType])
  }

  return (
    <>
      <div className={styles.main}>
        <Affix offsetTop={0} rootClassName={styles.sticky}>
          <div className={styles.panel}>
            <Flex className={styles.top} justify="space-between" align="center">
              <h1 className={styles.title}>Шизо-Дневник</h1>

              <Button type="primary" onClick={handleOpenModal} icon={<PlusCircleOutlined />}>Добавить запись</Button>
            </Flex>

            <Flex className={styles.period} justify="space-between" align="center" gap={20} wrap="wrap">
              <Flex gap={16} align="center">
                <h3 className={styles.title}>Период</h3>
                <RangePicker defaultValue={selectDate.week} value={period} className={styles.input} placeholder={['Дата От', 'Дата По']}/>
              </Flex>
              <Flex gap={16}>
                <Button icon={<FieldTimeOutlined />} onClick={() => handleSetPeriod('today')}>За сегодня</Button>
                <Button icon={<FieldTimeOutlined />} onClick={() => handleSetPeriod('week')}>За неделю</Button>
                <Button icon={<FieldTimeOutlined />} onClick={() => handleSetPeriod('month')}>За месяц</Button>
                <Button icon={<FieldTimeOutlined />} onClick={() => handleSetPeriod('year')}>За год</Button>
              </Flex>
            </Flex>

            <Flex className={styles.search} gap={16} align="center">
              <Flex>
                <h3 className={styles.title}>Поиск</h3>
              </Flex>
              <Flex>
                <Input className={styles.input} placeholder="Поиск по подстроке"/>
              </Flex>
            </Flex>
          </div>
        </Affix>

        <div className={styles.card}>
          {keyBy(data).sort(sortLocalCompare).map(date => {
            const records = sortBy(data[date], 'time');

            return (
              <fieldset key={date} className={styles.card}>
                <legend>{date}</legend>

                {records.map(record => {
                  const tagParams = weights.find(weight => weight.value === record.weight);
                  const emotionsFormatted = formatEmotions(record.emotions, record.emotionGroup);

                  return (
                    <fieldset key={record.id} className={styles.record}>
                      <legend>{record.time}</legend>

                      <Flex justify="space-between" gap={32}>
                        <div>
                          <div>Триггер - {record.trigger}</div>
                          <div>Эмоция - {emotionsFormatted}</div>
                          <div>Мысли - {record.thoughts}</div>
                          <div>Поведение - {record.behavior}</div>
                        </div>
                        <Flex vertical justify="space-between" align="flex-end">
                          {tagParams && <Tag className={styles.tag} color={tagParams.color}>{tagParams.label}</Tag>}
                          <Flex gap={8}>
                            <Button type="primary" danger icon={<DeleteOutlined/>} onClick={() => handleDelete(record.id)}/>
                            <Button type="primary" icon={<EditOutlined />} />
                          </Flex>
                        </Flex>
                      </Flex>
                    </fieldset>
                  )}
                )}
              </fieldset>
            )
          })}
        </div>

        <ModalAddRecord isOpen={isOpen} onClose={handleCloseModal} onOk={setData}/>
      </div>
    </>
  )
}

export default App
