import {useEffect, useState} from "react";
import './App.css'

function App() {
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({});

  useEffect(() => {
    fetch('http://localhost:3001').then(res => {
      if (res.ok) {
        res.json().then(data => setData(data.data));
      } else {
        setError('Ошибка')
      }
    })
  }, []);

  const handleAdd = () => {
    fetch('http://localhost:3001/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(data => setData(data.data));
  }

  const handleInput = (e, key: string) => {
    setForm({...form, [key]: e.target.value});
  }

  console.log(form)

  return (
    <>
      <table border={1}>
        <thead>
          <tr>
            <th>Дата</th>
            <th>Тригер</th>
            <th>Эмоции</th>
            <th>Мысли</th>
            <th>Поведение</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item, idx) => (
            <tr key={idx}>
              {Object.keys(item).map((field, idx) => (
                <td key={idx}>{item[field]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <input type="date" onChange={(e) => handleInput(e, 'date')}/>
        <input type="input" onChange={(e) => handleInput(e, 'trigger')}/>
        <input type="input" onChange={(e) => handleInput(e, 'emotion')}/>
        <input type="input" onChange={(e) => handleInput(e, 'thoughts')}/>
        <input type="input" onChange={(e) => handleInput(e, 'behavior')}/>
        <button type="button" onClick={handleAdd}>Send</button>
      </div>
    </>
  )
}

export default App
