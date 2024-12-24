import React, { Dispatch, SetStateAction } from 'react';
import cn from 'classnames';
import { Filter } from '../types/Filter';

type Props = {
  filter: Filter;
  setFilter: Dispatch<SetStateAction<Filter>>;
  todosCounter: number;
  todosCompletedCounter: number;
  onClearCompleted: () => Promise<void>;
};

export const TodoFooter: React.FC<Props> = props => {
  const {
    filter,
    setFilter,
    todosCounter,
    onClearCompleted,
    todosCompletedCounter,
  } = props;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosCounter} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(Filter).map(filterStatus => (
          <a
            key={filterStatus}
            href={`#/${filterStatus === Filter.All ? '' : filterStatus.toLowerCase()}`}
            className={cn('filter__link', {
              selected: filter === filterStatus,
            })}
            data-cy={`FilterLink${filterStatus}`}
            onClick={() => {
              setFilter(filterStatus);
            }}
          >
            {filterStatus}
          </a>
        ))}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        // className={cn('todoapp__clear-completed', {
        //   hidden: !filteredTodos.some(todo => todo.completed),
        // })}
        disabled={todosCompletedCounter === 0}
        data-cy="ClearCompletedButton"
        onClick={() => {
          onClearCompleted();
        }}
        // disabled={!filteredTodos.some(todo => todo.completed)}
        // onClick={() => {
        //   setVisibleTodos(prevTodos =>
        //     prevTodos.filter(todo => !todo.completed),
        //   );
        // }}
      >
        Clear completed
      </button>
    </footer>
  );
};

// {footerVisible && ()
