import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  _backendURL = "https://panda101-backend.herokuapp.com"; 
  // _backendURL = "http://localhost:3000"                    // this needs to point the backend API

  _retrieveTodoURL = this._backendURL + "/api/getTodo"
  _addTodoURL = this._backendURL + "/api/addTodo"
  _changeTodoStatusURL = this._backendURL + "/api/changeTodoStatus"
  _changeDeleteStatusURL = this._backendURL + "/api/changeDeleteStatus"
  _clearTrashURL = this._backendURL + "/api/clearTrash"
  _editTodoURL = this._backendURL + "/api/editTodo"
  _editProfileURL = this._backendURL + "/api/editProfile"


  constructor(
    private _http: HttpClient,
  ) { }

  // edit profile data
  editProfile(profileData: any) {
    return this._http.post(this._editProfileURL, profileData)
  }

  // get Todos from the DB
  getTodo() {
    return this._http.get(this._retrieveTodoURL)
  }

  // add a new Todo
  addTodo(todo: any) {
    return this._http.post(this._addTodoURL, todo)
  }

  // edit todo
  editTodo(todo: any) {
    return this._http.post(this._editTodoURL, todo);
  }

  // change the completion status
  changeTodoStatus(todo: any, checked: any) {

    let todoObj = Object.assign({}, todo);
    todoObj.completed = checked;

    return this._http.post(this._changeTodoStatusURL, todoObj)
  }

  // change the deleted status
  changeDeleteStatus(todo: any) {
    return this._http.post(this._changeDeleteStatusURL, todo)
  }

  // clear trash
  clearTrash() {
    return this._http.get(this._clearTrashURL)
  }


}
