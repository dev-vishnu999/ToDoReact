export const ApiRequest = (variables, endUrl, apiMethod, token, id) => {
  let headers = {};
  if(apiMethod === "GET") {
    if(token) {
      token = "Bearer "+token;
      headers = {
        "Content-type": "application/json",
        'Authorization': token 
      }
    } else {
      headers = {
        "Content-type": "application/json",
      }
    }
  } else {
    if(token) {
      token = "Bearer "+token;
      headers = {
        "Content-type": "application/json",
        'Authorization': token 
      }
    } else {
      headers = {
        "Content-type": "application/json",
      }
    }
  }
  
  var init =
      apiMethod === "GET"
        ? {
            method: "GET",
            headers: headers,
          }
        : {
            method: "POST",
            headers: headers,
            body: JSON.stringify(variables),
          };
  return fetch(endUrl, init)
  .then((res) =>
    res.json().then((data) => {
      return data;
    })
  )
  .catch((err) => {
    console.log(err);
    var apiData = {
      success: false,
      data: "Please check your internet connection",
    };
    return apiData;
  });
          
};
