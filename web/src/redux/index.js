import { createStore } from 'redux'

function reducer(state, action) {
    switch (action.type) {
      case 'USERINFO':
        return { ...state, userInfo: action.data }
      case 'MENU':
        return { ...state, menu: action.data }
      default:
        return state
    }
  }
let store = createStore(reducer, {
  menu: null,
  userInfo: null
});

export default store;