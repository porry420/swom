import { atom } from 'jotai';

type State = {
  session: null | string;
  user: { email: string };
  showMobileMenu: boolean;
  noUser: boolean;
  imgUploadPopUp: boolean;
  isSubscribed: boolean;
  loggedInUser: null | string;
  activeNavButtons: boolean;
};

// A helper function to work with localStorage and JSON serialization for the entire application state
const atomWithLocalStorage = (key: string, initialValue: any) => {
  const getInitialValue = () => {
    if (typeof window !== 'undefined') {
      const item = localStorage.getItem(key);
      if (item !== null) {
        try {
          return JSON.parse(item);
        } catch {
          console.error('Could not parse the stored value in localStorage.');
        }
      }
    }
    return initialValue;
  };

  const baseAtom = atom(getInitialValue());
  const derivedAtom = atom(
    (get) => get(baseAtom),
    (get, set, update: ((prevState: State) => State) | State) => {
      const nextValue =
        typeof update === 'function' ? update(get(baseAtom)) : update;
      set(baseAtom, nextValue);
      localStorage.setItem(key, JSON.stringify(nextValue));
    }
  );

  return derivedAtom;
};

// Define your initial state
const initialState: State = {
  session: null,
  user: { email: '' },
  showMobileMenu: false,
  noUser: false,
  imgUploadPopUp: false,
  isSubscribed: false,
  loggedInUser: null,
  activeNavButtons: false,
};

// Create an atom with local storage persistence for the entire application state
export const globalStateAtom = atomWithLocalStorage(
  'globalState',
  initialState
);
