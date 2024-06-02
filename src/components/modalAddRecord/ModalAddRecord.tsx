import {DatePicker, Modal, Input, Form, Flex, Select, FormInstance, Radio} from "antd";
import dayjs from "dayjs";
import { FormState, Records } from "../../types";
import styles from './ModalAddRecord.module.scss'
import {emotions, emotionGroups, weights} from "../../consts";
import {adaptData, transformData} from "../../utils";
import {useEffect} from "react";

const { TextArea } = Input;


type ModalAddRecordProps = {
  isOpen: boolean;
  onClose: () => void;
  onOk: (records: Records) => void;
}

export function ModalAddRecord({ isOpen, onClose, onOk }: ModalAddRecordProps) {
  const initialValues = { date: dayjs() };
  const [form] = Form.useForm<FormInstance<FormState>>();
  const emotionGroup = Form.useWatch('emotionGroup', form);

  console.log(dayjs().format('HH:mm:ss'));

  useEffect(() => {
    form.resetFields(['date']);
  }, [isOpen]);

  useEffect(() => {
    form.resetFields(['emotions'])
  }, [emotionGroup]);

  const handleAdd = () => {
    console.log(form.getFieldsValue(true));

    fetch('api/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: transformData(form.getFieldsValue(true))
    })
      .then(res => res.json())
      .then(data => onOk(adaptData(data.data)))
      .finally(() => {
        form.resetFields();
        onClose();
      });
  }

  return (
    <Modal
      title="Добавление записи"
      open={isOpen}
      onClose={onClose}
      onCancel={onClose}
      onOk={handleAdd}
      okText="Отправить"
      cancelText="Отмена"
    >
      <Form form={form} layout="vertical" initialValues={initialValues}>
        <Form.Item className={styles.formItem} label="Дата и время" name="date">
          <Flex>
            <DatePicker
              className={styles.formItem__full}
              showTime
              defaultValue={dayjs()}
            />
          </Flex>
        </Form.Item>

        <Form.Item className={styles.formItem} label="Ситуация/Триггер (Когда? Где? С кем? Что произошло?)" name="trigger">
          <TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
        </Form.Item>

        <Flex align="flex-start" gap={16}>
          <Form.Item className={styles.formItem__group} label="Группа" name="emotionGroup">
            <Select options={emotionGroups} />
          </Form.Item>

          <Form.Item className={styles.formItem__full} label="Эмоция" name="emotions">
            {/* @ts-ignore */}
            <Select options={emotions[emotionGroup]} mode="multiple" maxTagCount={2} />
          </Form.Item>
        </Flex>

        <Form.Item className={styles.formItem} label="Мысли (Какие мысли проносились у Вас в голове в этой ситуации? Не анализируйте их, просто запишите" name="thoughts">
          <TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
        </Form.Item>

        <Form.Item className={styles.formItem} label="Поведение (Что Вы стали делать сразу после этого?)" name="behavior">
          <TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
        </Form.Item>

        <Form.Item className={styles.formItem} label="Насколько волнует ситуация?" name="weight">
          <Radio.Group rootClassName={styles.radio} options={weights} optionType="button" buttonStyle="solid"></Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  )
}