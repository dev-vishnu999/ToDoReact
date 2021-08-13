const defaultState = {
  testState: "Initial Data",
  user_details : {},
  user_listing:[],
  role_listing:[],
  task_listing:[],
  user_token:'',
  my_roles:[]
};

function reducer(state = defaultState, action) {
  // console.log('action ', action.type,' --===>>>', action.payload)
  switch (action.type) {
    case "TEST":
      return {
        ...state,
        testState: action.payload,
      };
      break;
    case "USERDETAILS":
      return {
        ...state,
        user_details: action.payload,
      };
      break;
    case "USERLISTING":
      return {
        ...state,
        user_listing: action.payload,
      };
      break;
    case "ROLELISTING":
        return {
          ...state,
          role_listing: action.payload,
        };
        break;
    case "MYROLES":
      return {
        ...state,
        my_roles: action.payload,
      };
      break;
    case "TASKLISTING":
      console.log('action 111', action.type,' --===>>>', action.payload)
      return {
        ...state,
        task_listing: action.payload,
      };
      break;
    case "USERTOKEN":
      return {
        ...state,
        user_token: action.payload,
      };
      break;
    default:
      return state;
  }
}

export default reducer;
