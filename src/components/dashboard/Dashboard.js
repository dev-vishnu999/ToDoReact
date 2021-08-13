import React, { Component } from 'react';
import { withRouter,Link } from "react-router-dom";
import { connect } from "react-redux";
import Modal from 'react-modal';
import {
    userdetails,
    taskListings,
    userToken,
    myRoles
  } from "../../redux/actions/actions";
import { ApiRequest } from "../../apiServices/ApiRequest";
import { Apis } from "../../common";
import swal from 'sweetalert';
var moment = require('moment'); 
  const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        // backgroundColor: 'rgb(22,22,22)'
    }
};

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openTaskModal:false,
            modalType:'',
            // task_listing:[]
        }
        if(!this.props.user_details.hasOwnProperty('email')) {
            this.props.history.push("/");
        }
        
        this.closeTaskModal=this.closeTaskModal.bind(this);
        this.logout = this.logout.bind(this);
        this.UpsertTask = this.UpsertTask.bind(this);
        this.formHandler = this.formHandler.bind(this);
    }
    formHandler(ev) {
        this.setState({ [ev.target.name]: ev.target.value });
    }
    openTaskModal(modalType,upsertId) {
        if(upsertId) {
            if(this.props.task_listing.length > 0) {
                var allTasks = JSON.parse(this.props.task_listing);
                var res = allTasks.filter(item=>item.id === upsertId)
                this.setState({
                    task_title:res[0].title,
                    task_description:res[0].description,
                })
            }
        }
        
        this.setState({
            openTaskModal:true,
            modalType:modalType,
            upsertId:upsertId
        })
    }
    closeTaskModal() {
        this.setState({
            openTaskModal:false,
            task_title:'',
            task_description:''
        })
    }
    logout() {
        this.props.userdetails({});
        this.props.taskListings([]);
        this.props.userToken('');
        this.props.myRoles([]);
        this.props.history.push("/");
    }
    UpsertTask() {
        let task_title = this.state.task_title;
        let task_description = this.state.task_description;
        var valueErr = document.getElementsByClassName("err");
        for(var i = 0; i < valueErr.length; i++){
            valueErr[i].innerText="";
        }
        
        if(!task_title) {
            valueErr = document.getElementsByClassName("err_task_title");
            valueErr[0].innerText="This Field is Required";
        }
        if(!task_description) {
            valueErr = document.getElementsByClassName("err_task_description");
            valueErr[0].innerText="This Field is Required";
        }
        
        if(task_title && task_description) {
            // alert(this.state.modalType);
            // alert(Apis.UpsertTask);
            // alert('upsert id : '+this.state.upsertId );
            let upsertId = '';
            if(this.state.modalType == 'Add') {
                upsertId = 0;
            } else if(this.state.modalType == 'Edit') {
                upsertId = this.state.upsertId;
            }
            let requestData = {
                id:upsertId,
                title:task_title,
                description: task_description
            };
            var token = this.props.user_token;
            ApiRequest(requestData, Apis.UpsertTask, "POST",token)
                .then((res) => {
                    
                    this.setState({
                        openTaskModal:false
                    })
                    if(res.success) {
                        swal({
                            title: "Success",
                            text: res.message,
                            icon: "success",
                            successMode: true,
                        })
                        .then(willDelete => {
                            let requestData = {};
                            ApiRequest(requestData, Apis.GetTask, "GET",token)
                            .then((res) => {
                                this.props.taskListings(JSON.stringify(res.data));
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                        });
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }

    deleteTask(id) {
        if(id) {
            if(this.props.task_listing.length > 0) {
                var allTasks = JSON.parse(this.props.task_listing);
                var res = allTasks.filter(item=>item.id == id)
            }
            swal({
                // title: "Success",
                text: "Are you sure you want to delete this task.",
                icon: "warning",
                successMode: true,
            })
            .then(willDelete => {
                if(willDelete) {
                    
                        let requestData = {
                            id:id,
                            title:res[0].title,
                            description:res[0].description,
                            status:res[0].status
                        };
                        var token = this.props.user_token;
                        ApiRequest(requestData, Apis.DeteteTask, "POST",token)
                            .then((res) => {
                                
                                this.setState({
                                    openTaskModal:false
                                })
                                if(res.success) {
                                    swal({
                                        title: "Success",
                                        text: res.message,
                                        icon: "success",
                                        successMode: true,
                                    })
                                    .then(willDelete => {
                                        let requestData = {};
                                        ApiRequest(requestData, Apis.GetTask, "GET",token)
                                        .then((res) => {
                                            if(res.success) {
                                                if(res.data.length > 0) {
                                                  this.props.taskListings(JSON.stringify(res.data));
                                                } else {
                                                  this.props.taskListings([]);
                                                }
                                              
                                            } 
                                        })
                                        .catch((error) => {
                                            console.log(error);
                                        });
                                    });
                                }
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                    
                }
                
            });
        }
    }
    markComplete(id) {
        if(id) {
            if(this.props.task_listing.length > 0) {
                var allTasks = JSON.parse(this.props.task_listing);
                var res = allTasks.filter(item=>item.id === id)
                let requestData = {
                    id:id,
                    title:res[0].title,
                    description: res[0].description,
                    status:true
                };
                var token = this.props.user_token;
                ApiRequest(requestData, Apis.UpsertTask, "POST",token)
                    .then((res) => {
                        this.setState({
                            openTaskModal:false
                        })
                        if(res.success) {
                            swal({
                                title: "Success",
                                text: res.message,
                                icon: "success",
                                successMode: true,
                            })
                            .then(willDelete => {
                                let requestData = {};
                                ApiRequest(requestData, Apis.GetTask, "GET",token)
                                .then((res) => {
                                    this.props.taskListings(JSON.stringify(res.data));
                                })
                                .catch((error) => {
                                    console.log(error);
                                });
                            });
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        }
    }
    componentDidMount() {
        let requestData = {};
        var token = this.props.user_token;
        ApiRequest(requestData, Apis.GetTask, "GET",token)
        .then((res) => {
              if(res.success) {
                  if(res.data.length > 0) {
                    this.props.taskListings(JSON.stringify(res.data));
                  } else {
                    this.props.taskListings([]);
                  }
                
              } 
          })
          .catch((error) => {
            
          });
        
        
    }
    render() {
        return (
            <div className="wrapper ">
                <div className="main-panel dashboard-page-wrapper">
                    <div className="content">
                        <div className="container-fluid">

                            <div className="row">
                                <div className="">
                                    <h3 className="title">Welcome {(this.props.user_details.firstName && this.props.user_details.lastName) ? this.props.user_details.firstName+' '+this.props.user_details.lastName : 'user'}</h3>
                                    <h3 className="title"> My ToDO List
                                        <button type="button" className="btn btn-info btn-round add-TaskBtn m-l-10" onClick={this.logout}>Logout</button> 
                                        <button type="button" className="btn btn-info btn-round add-TaskBtn" onClick={this.openTaskModal.bind(this,'Add','')}>Add Task</button>
                                        
                                    </h3>
                                    
                                    <ul className="timeline timeline-simple">
                                        
                                    </ul>
                                    <ul className="timeline timeline-simple">
                                        {
                                            this.props.task_listing.length > 0 ?
                                            JSON.parse(this.props.task_listing).map((Data,Index)=>
                                                    Data.status ?
                                                        <li className="timeline-inverted">
                                                            <div className="timeline-badge success">
                                                                <i className="material-icons">check</i>
                                                            </div>
                                                            <div className="timeline-panel">
                                                                <div className="timeline-heading">
                                                                    <span className="text-success">{Data.title}</span>
                                                                    <span className="task-Completed text-success">Task Completed</span>
                                                                </div>
                                                                <div className="timeline-body">
                                                                    <p>{Data.description} </p>
                                                                </div>
                                                                <h6>
                                                                    <span>Complete At : </span>
                                                                    {moment(Data.modifedOn).format('DD-MMM-YYYY h:m')}
                                                                </h6>
                                                            </div>
                                                        </li> :
                                                    <li className="timeline-inverted" key={Index}>
                                                        <div className="timeline-badge danger">
                                                            <i className="material-icons">storage</i>
                                                        </div>
                                                        <div className="timeline-panel">
                                                            <div className="timeline-heading">
                                                                <span className="text-danger">{Data.title}</span>
                                                                <i class="material-icons to-do-edit-icon m-l-10" onClick={this.deleteTask.bind(this,Data.id)} title="Delete Task">delete</i>
                                                                <i className="material-icons to-do-edit-icon m-l-10" onClick={this.openTaskModal.bind(this,'Edit',Data.id)} title="Edit Task">edit</i>
                                                                <i className="material-icons to-do-edit-icon " title="Mark as Complete" onClick={this.markComplete.bind(this,Data.id)}>done</i>
                                                                
                                                            </div>
                                                            <div className="timeline-body">
                                                                <p>{Data.description} </p>
                                                            </div>
                                                            <span>
                                                                <h6>
                                                                    <span>Created At : </span>
                                                                    {moment(Data.createdAt).format('DD-MMM-YYYY')}
                                                                </h6><br />
                                                                <h6 className="modify-at">
                                                                    <span>Modify At : </span>
                                                                    {moment(Data.modifedOn).format('DD-MMM-YYYY')}
                                                                </h6>
                                                            </span>
                                                        </div>
                                                    </li>
                                                )
                                                
                                            :   <li className="timeline-inverted">
                                                    <div className="timeline-badge danger">
                                                        <i className="material-icons">close</i>
                                                    </div>
                                                    <div className="timeline-panel">
                                                        <div className="timeline-body">
                                                            <p>Not Have any Task Yet. </p>
                                                        </div>
                                                    </div>
                                                </li>
                                        }
                                        
                                        
                                    </ul>
                                    
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>

                <Modal
                    isOpen={this.state.openTaskModal}
                    onRequestClose={this.closeTaskModal}
                    style={customStyles}
                    contentLabel="Example Modal"
                    >
                        <div class="login-sec">
                            <div class="login-panel">
                                <div class="login-box">
                                    <div class="card">
                                        <div class="card-header card-header-primary">
                                            <h3 class="card-title"> {this.state.modalType} Task
                                                <i className="material-icons todo-close-icon" onClick={this.closeTaskModal}>close</i>
                                            </h3>
                                            
                                        </div>

                                        <div class="card-body">
                                            <div class="col-md-12">
                                                <div class="form-group">
                                                    <label class="bmd-label-floating">Title</label>
                                                    <input type="text" class="form-control" name="task_title" onChange={this.formHandler} value={this.state.task_title}/>
                                                    <span className="err err_task_title"></span>
                                                </div>
                                                <div class="form-group">
                                                    <label class="bmd-label-floating">Description</label>
                                                </div>
                                                <div class="form-group">
                                                    <textarea rows="5" cols="50" name="task_description" onChange={this.formHandler}>{this.state.task_description}</textarea>
                                                    <span className="err err_task_description"></span>
                                                </div>
                                                <div class="form-group">
                                                    <button class="btn custom-btn btn-primary full-width" onClick={this.UpsertTask}> <i class="fa fa-sign-in"></i> Submit</button>
                                                </div>
                                                
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal>
            </div>
        );
    }
}
const mapStateToProps = (state) => ({
    data: state,
    ...state,
  });
  
const mapDispatchToProps = (dispatch) => ({
    userdetails: (data) => dispatch(userdetails(data)),
    taskListings: (data) => dispatch(taskListings(data)),
    userToken: (data) => dispatch(userToken(data)),
    myRoles: (data) => dispatch(myRoles(data)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard));