import React from 'react';
import { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { Table, Switch } from 'antd';
import { DeleteOutlined, StrikethroughOutlined } from '@ant-design/icons';

const Addlist = () => {
  const [text, setText] = useState('');
  const [todo, setTodo] = useState([]);

  const [title, setTitle] = useState('');

  const [titleText, setTitleText] = useState('');

  const [count, setCount] = useState({ active: 0, completed: 0 });

  const onChangeTodo = e => {
    setText(e.target.value);
  };
  const addTodo = async () => {
    try {
      await axios.post('/createtodo', { title: text });
      setText('');
      todoList();
    } catch (e) {
      console.log(e);
    }
  };
  const todoList = async (status = 'all') => {
    try {
      //const response = await axios.get('/todolist');
      const response = await axios.get('/todolist', {
        params: { status },
      });
      setTodo(response.data.todos);
      setCount({
        active: response.data.totalActive,
        completed: response.data.totalCompleted,
      });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    todoList();
  }, []);

  const columns = [
    {
      title: 'Sl.No',
      render: (_, __, index) => index + 1,
    },

    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (val, row) => {
        return (
          <>
            {titleText == row._id ? (
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                onKeyDown={e => onEnterTitle(e, row._id)}
              />
            ) : (
              <span
                onDoubleClick={() => {
                  setTitleText(row._id);
                  setTitle(row.title);
                }}
                style={{
                  textDecoration: row.status ? 'line-through' : 'none',
                  color: row.status ? 'grey' : 'black',
                  cursor: 'pointer',
                }}
              >
                {row.title}
              </span>
            )}
          </>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: val =>
        val === false ? <span>Active</span> : <span>Completed</span>,
    },
    {
      title: 'Actions',
      key: 'status',
      render: a => {
        return (
          <>
            <Switch
              onChange={e => onChangeToggle(e, a._id)}
              checked={a.status}
              title="Update Status"
            />
            <DeleteOutlined
              onClick={() => handleDelete(a._id)}
              title="Delete"
              style={{
                marginLeft: 20,
                color: 'red',
                cursor: 'pointer',
                fontSize: 20,
              }}
            />
          </>
        );
      },
    },
  ];

  const handleDelete = async id => {
    try {
      await axios.delete(`/deleteTodo/${id}`);
      todoList();
    } catch (e) {
      console.log(e);
    }
  };
  const clearAll = async () => {
    try {
      await axios.delete('/deleteTodo/clearAll', {
        params: { status: true },
      });
      todoList();
    } catch (e) {
      console.log(e);
    }
  };
  const onChangeToggle = async (checked, id) => {
    console.log(`switch to ${checked}`, id);
    try {
      await axios.patch(`/updatetodo/${id}`, {
        status: checked,
      });
      todoList();
    } catch (e) {
      console.log(e);
    }
  };
  const onEnterTitle = async (e, id) => {
    if (e.key == 'Enter') {
      try {
        await axios.patch(`/updatetodo/${id}`, {
          title: e.target.value,
        });
        setTitleText('');
        todoList();
      } catch (e) {
        console.log(e);
      }
    }
  };
  const onFilter = value => {
    todoList(value);
  };

  return (
    <>
      <div className="container">
        <div className="row">
          <h1>Add Todo</h1>
          <div className="col-md-6">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Enter todo"
                value={text}
                onChange={onChangeTodo}
              />
              <button className="btn btn-primary" onClick={addTodo}>
                Add
              </button>
            </div>
          </div>
        </div>
        <h1></h1>
        <div className="row">
          <div className="col-2">
            <h5>Active : {count.active}</h5>
          </div>
          <div className="col-2">
            <h5>Completed : {count.completed}</h5>
          </div>
          <div className="col-2">
            <select
              className="form-control"
              onChange={e => onFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="false">Active</option>
              <option value="true">Completed</option>
            </select>
          </div>
          <div className="col-4">
            <button className="btn btn-danger" onClick={clearAll}>
              Clear All Completed
            </button>
          </div>
        </div>
        <Table dataSource={todo} columns={columns} rowKey="_id" />
      </div>
    </>
  );
};

export default Addlist;
