import { useEffect, useState } from "react";
import dayjs from "dayjs";
import {Affix, Button, DatePicker, Flex, Input, Tag} from "antd";
import { DeleteOutlined, EditOutlined} from "@ant-design/icons";
import FieldTimeOutlined from "@ant-design/icons/FieldTimeOutlined";
import PlusCircleOutlined from "@ant-design/icons/PlusCircleOutlined";

import { Records } from "./types";
import { adaptData, formatEmotions, keyBy, sortBy, sortLocalCompare } from "./utils";
import styles from './App.module.scss'
import { ModalAddRecord } from "./components";
import {weights} from "./consts";

const { RangePicker } = DatePicker;

function App() {
  const [data, setData] = useState<Records>({});
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    fetch('/api').then(res => {
      if (res.ok) {
        res.json().then(data => setData(adaptData(data.data)));
      } else {
        console.log('Ошибка')
      }
    })
  }, []);

  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => setIsOpen(false);

  const handleDelete = (id: string) => {
    fetch(`api/delete/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then(data => setData(adaptData(data.data)))
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
                <RangePicker defaultValue={[dayjs(), dayjs()]} className={styles.input} placeholder={['Дата От', 'Дата По']}/>
              </Flex>
              <Flex gap={16}>
                <Button icon={<FieldTimeOutlined />}>За сегодня</Button>
                <Button icon={<FieldTimeOutlined />}>За неделю</Button>
                <Button icon={<FieldTimeOutlined />}>За месяц</Button>
                <Button icon={<FieldTimeOutlined />}>За все время</Button>
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
