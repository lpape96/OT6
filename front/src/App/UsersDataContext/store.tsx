import React, { createContext, useReducer, useEffect, useContext } from 'react';
import LoadingSpinner from '../common/LoadingSpinner';
// import userService from '../../api/user';
import { ResType } from '../App';

interface IProps {
  children: JSX.Element | JSX.Element[] | Array<JSX.Element | undefined>;
}

interface IContext {
  usersData: ResType[];
  dispatch: React.Dispatch<Action>;
}

interface Action {
  type: string;
  value: ResType[];
}

const store = createContext<IContext>({ usersData: [], dispatch: () => {} });
const { Provider } = store;

const UsersDataProvider = ({ children }: IProps) => {
  const [usersData, dispatch] = useReducer<React.Reducer<ResType[], Action>>(
    (state: ResType[], action: Action): ResType[] => {
      switch (action.type) {
        case 'addUser':
          const newState = [...state, ...action.value];
          return newState;
        default:
          throw new Error();
      }
    },
    []
  );

  useEffect(() => {
    getUsersData();
  }, []);

  const getUsersData = async () => {
    try {
      // const usersRes = await userService.getUserRes();
      console.log('inn');
      dispatch({ type: 'addUser', value: [] });
    } catch (e) {
      console.log(e);
    }
  };

  if (!usersData) {
    return <LoadingSpinner />;
  }
  return <Provider value={{ usersData, dispatch }}>{children}</Provider>;
};

export const useUsersDataContext = (): IContext => {
  const context = useContext(store);
  // tslint:disable-next-line: no-non-null-assertion
  return context;
};

export default UsersDataProvider;
