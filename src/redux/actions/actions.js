export const userdetails = (data) => (dispatch) => {
  dispatch({
    type: "USERDETAILS",
    payload: data,
  });
};
export const userListing = (data) => (dispatch) => {
  dispatch({
    type: "USERLISTING",
    payload: data,
  });
};
export const roleListing = (data) => (dispatch) => {
  dispatch({
    type: "ROLELISTING",
    payload: data,
  });
};
export const taskListings = (data) => (dispatch) => {
  dispatch({
    type: "TASKLISTING",
    payload: data,
  });
};
export const userToken = (data) => (dispatch) => {
  dispatch({
    type: "USERTOKEN",
    payload: data,
  });
};
export const myRoles = (data) => (dispatch) => {
  dispatch({
    type: "MYROLES",
    payload: data,
  });
};
export const deleteSelected = (data) => (dispatch) => {
  dispatch({
    type: "DELETESELECTED",
    payload: data,
  });
};

