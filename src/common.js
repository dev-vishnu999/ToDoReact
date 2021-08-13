const DynamicUrl = 'https://localhost:44309/';
export const Apis = {
    ApiRegistration:DynamicUrl+'api/Login/register',
    ApiLogin:DynamicUrl+'api/Login/login',
    GetTask:DynamicUrl+'api/ToDo/getItems',
    GetUsers:DynamicUrl+'api/Login/getUsers',
    GetRoles:DynamicUrl+'api/Login/getRoles',
    assignRoleToUser:DynamicUrl+'api/Login/assignRoleToUser',
    UpsertTask:DynamicUrl+'api/ToDo/upsertToDoItem',
    DeteteTask:DynamicUrl+'api/ToDo/deleteItem',
}