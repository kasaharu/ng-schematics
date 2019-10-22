import { createAction, createReducer, on, union } from '@ngrx/store';

// NOTE: State
export interface State {
  <%= camelize(name) %>: any;
}

export const initialState: State = {
  <%= camelize(name) %>: null,
};

// NOTE: Actions
export const save<%= classify(name) %> = createAction('[<%= classify(name) %>] save', (payload: any) => ({ payload }));

const actions = { save<%= classify(name) %> };
const actionsUnion = union(actions);
export const <%= camelize(name) %>StoreActoins = actions;

// NOTE: Reducer
const <%= camelize(name) %>Reducer = createReducer(initialState, on(save<%= classify(name) %>, (state, action) => ({ ...state, <%= camelize(name) %>: action.payload })));

export default function reducer(state: State, action: typeof actionsUnion): State {
  return <%= camelize(name) %>Reducer(state, action);
}

// NOTE: Selectors
export const featureName = '<%= camelize(name) %>';
