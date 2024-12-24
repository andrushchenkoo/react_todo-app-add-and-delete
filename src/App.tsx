/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { Todo } from './types/Todo';
import { TodoHeader } from './components/TodoHeader';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';
import { addTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { Error } from './types/Error';
import { TodoItem } from './components/TodoItem';
import { Filter } from './types/Filter';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<Error | null>(null);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await getTodos();

        setTodos(data);
      } catch (error) {
        setErrorMessage(Error.LoadTodos);
      }
    })();
  }, []);

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      if (filter === Filter.All) {
        return true;
      }

      return filter === Filter.Completed ? todo.completed : !todo.completed;
    });
  }, [todos, filter]);

  const todosCounter: number = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const todosCompletedCounter: number = useMemo(() => {
    return todos.filter(todo => todo.completed).length;
  }, [todos]);

  const onAddTodo = async (todoTitle: string) => {
    setTempTodo({ id: 0, title: todoTitle, completed: false, userId: USER_ID });
    try {
      const newTodo = await addTodo({ title: todoTitle, completed: false });

      setTodos(prev => [...prev, newTodo]);
    } catch (err) {
      setErrorMessage(Error.AddTodos);
      throw err;
    } finally {
      setTempTodo(null);
    }
  };

  const onDeleteTodo = async (todoId: number) => {
    setLoadingIds(prev => [...prev, todoId]);
    try {
      await deleteTodo(todoId);

      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    } catch (err) {
      setErrorMessage(Error.DeleteTodos);
      throw err;
    } finally {
      setLoadingIds(prev => prev.filter(id => id !== todoId));
    }
  };

  const onClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => onDeleteTodo(todo.id));
  };

  // useEffect(() => {
  //   setFooterVisible(visibleTodos.length > 0);
  // }, [visibleTodos]);

  // useEffect(() => {
  //   setAreAllCompleted(visibleTodos.every(todo => todo.completed));
  // }, [visibleTodos]);

  // const handleToggleAllTodos = () => {
  //   setVisibleTodos(prevTodos =>
  //     prevTodos.map(todo => ({
  //       ...todo,
  //       completed: !areAllCompleted,
  //     })),
  //   );
  // };

  const handleToggleTodo = (todoId: number) => {
    setTodos((prevTodos: Todo[]): Todo[] =>
      prevTodos.map((todo: Todo) =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          onAddTodo={onAddTodo}
          setErrorMessage={setErrorMessage}
          isInputDisabled={!!tempTodo}
        />

        {todos.length > 0 && (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              {filteredTodos.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onDeleteTodo={onDeleteTodo}
                  isLoading={loadingIds.includes(todo.id)}
                  handleToggleTodo={handleToggleTodo}
                />
              ))}
              {tempTodo && (
                <TodoItem
                  todo={tempTodo}
                  onDeleteTodo={onDeleteTodo}
                  isLoading
                  handleToggleTodo={handleToggleTodo}
                />
              )}
            </section>
            <TodoFooter
              filter={filter}
              setFilter={setFilter}
              todosCounter={todosCounter}
              onClearCompleted={onClearCompleted}
              todosCompletedCounter={todosCompletedCounter}
            />
          </>
        )}
      </div>
      <ErrorNotification
        error={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
