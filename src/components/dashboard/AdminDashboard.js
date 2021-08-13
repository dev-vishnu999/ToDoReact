import React, { Component } from 'react';
import { withRouter,Link } from "react-router-dom";
import { connect } from "react-redux";
import Modal from 'react-modal';
import Header from './Header';
import swal from 'sweetalert';
import {
    userdetails,
    deleteSelected,
    userListing,
    roleListing
  } from "../../redux/actions/actions";
import { ApiRequest } from "../../apiServices/ApiRequest";
import { Apis } from "../../common";

  const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    }
};

class AdminDashboard extends Component {
    constructor(props) {
        super(props);
        let myRole = '';
        if(this.props.my_roles.length >0) {
            let role = JSON.parse(this.props.my_roles);
            myRole = role[0];
        }
        
        if(myRole == 'User' || myRole == '') {
            this.props.history.push("/dashboard");
        }
        this.state = {
            openUserModal:false,
            modalType:'',
            myRole:myRole
        }
        if(!this.props.user_details.hasOwnProperty('email')) {
            this.props.history.push("/admin-login");
        }
        this.closeUserModal=this.closeUserModal.bind(this);
        this.UpsertUser = this.UpsertUser.bind(this);
        this.formHandler = this.formHandler.bind(this);
    }
    formHandler(ev) {
        this.setState({ [ev.target.name]: ev.target.value });
    }
    openUserModal(modalType,upsertId,role) {
        this.setState({
            openUserModal:true,
            modalType:modalType,
            upsertId:upsertId,
            user_role:role
        })
    }
    closeUserModal() {
        this.setState({
            openUserModal:false,
            first_name:'',
            last_name:'',
            email:'',
            password:'',
            user_role:''
        })
    }
    UpsertUser() {
        
        let user_role = this.state.user_role;
        var valueErr = document.getElementsByClassName("err");
        for(var i = 0; i < valueErr.length; i++){
            valueErr[i].innerText="";
        }
        
        if(!user_role) {
            valueErr = document.getElementsByClassName("err_user_role");
            valueErr[0].innerText="This Field is Required";
        }
        
        if(user_role && this.state.upsertId) {
            let requestData = {
                userId:this.state.upsertId,
                roleName:user_role,
            };
            var token = this.props.user_token;
        ApiRequest(requestData, Apis.assignRoleToUser, "POST",token)
          .then((res) => {
            this.setState({
                openUserModal:false
            })
            if(res.success) {
                swal({
                    title: "Success",
                    text: res.message,
                    icon: "success",
                    successMode: true,
                })
                .then(willDelete => {
                    var token = this.props.user_token;
                    ApiRequest(requestData, Apis.GetUsers, "GET",token)
                    .then((res) => {
                        this.props.userListing(JSON.stringify(res.data));
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
    
    componentDidMount() {
        let requestData = {};
        var token = this.props.user_token;
        ApiRequest(requestData, Apis.GetUsers, "GET",token)
        .then((res) => {
              if(res.success) {
                this.props.userListing(JSON.stringify(res.data));
              }
          })
          .catch((error) => {
            console.log(error);
          });
        ApiRequest(requestData, Apis.GetRoles, "GET",token)
        .then((res) => { 
            if(res.success) {
                this.props.roleListing(JSON.stringify(res.data));
            }
        })
        .catch((error) => {
            console.log(error);
        });
        
        
    }
    render() {
        return (
            <div className="wrapper ">
                <div className="main-panel dashboard-page-wrapper">
                    <div className="content">
                        <div className="container-fluid">
                            <Header />
                            <div class="row">
                                <div class="col-md-12 ml-auto mr-auto">
                                    <div class="card">
                                        <div class="card-header card-header-primary card-header-icon">
                                            <div class="card-icon">
                                                <i class="material-icons">people</i>
                                            </div>
                                        </div>
                                        <div class="card-body">
                                            <h4 class="card-title"> 
                                                User Listing 
                                            </h4>
                                            <div class="table-responsive">
                                                <table id="datatables" class="table table-striped table-no-bordered table-hover" cellspacing="0" width="100%">
                                                    <thead>
                                                        <tr>
                                                            <th>S.No</th>
                                                            <th>First Name</th>
                                                            <th>Last Name</th>
                                                            <th>Email</th>
                                                            <th>Role</th>
                                                            <th class="disabled-sorting">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                    {
                                                        this.props.user_listing.length > 0 ?
                                                        JSON.parse(this.props.user_listing).map((Data,Index)=>
                                                        <tr key={Index}>
                                                            <td>{Index+1}</td>
                                                            <td>{Data.firstName}</td>
                                                            <td>{Data.lastName}</td>
                                                            <td>{Data.email}</td>
                                                            <td>{Data.roleName}</td>
                                                            <td>
                                                                {
                                                                    this.state.myRole == 'SuperAdmin' ?
                                                                    <button type="button" className="btn btn-info btn-round m-l-10" onClick={this.openUserModal.bind(this,'Edit',Data.userId,Data.roleName)} title="Assign Role"><i class="material-icons">edit</i>Assign Role</button> : <button type="button" className="btn btn-info btn-round m-l-10" disabled title="Assign Role"><i class="material-icons">edit</i>Assign Role</button>
                                                                }
                                                                
                                                            </td>
                                                        </tr>
                                                        ) :
                                                        <tr>
                                                            <td colSpan="5">No user Found</td>
                                                        </tr>
                                                    }
                                                    </tbody>
                                                </table>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Modal
                    isOpen={this.state.openUserModal}
                    onRequestClose={this.closeUserModal}
                    style={customStyles}
                    contentLabel="Example Modal"
                    >
                        <div class="login-sec">
                            <div class="login-panel">
                                <div class="login-box">
                                    <div class="card">
                                        <div class="card-header card-header-primary">
                                            <h3 class="card-title"> Assign Role
                                                <i className="material-icons todo-close-icon" onClick={this.closeUserModal}>close</i>
                                            </h3>
                                            
                                        </div>

                                        <div class="card-body">
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label class="bmd-label-floating">User Roles</label>
                                            <select class="form-control" name="user_role" onChange={this.formHandler}>
                                                <option value="">Select Role</option>
                                                {
                                                    this.props.role_listing.length > 0 ?
                                                    JSON.parse(this.props.role_listing).map((Data,Index)=>
                                                        <option value={Data.name} key={Index} selected={Data.name === this.state.user_role ? true : false}>{Data.name}</option>
                                                    ) : ''
                                                }
                                                
                                            </select>
                                            <span className="err err_user_role"></span>
                                        </div>
                                        
                                        <div class="form-group">
                                            <button class="btn custom-btn btn-primary full-width" onClick={this.UpsertUser}>Assign Role</button>
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
    deleteSelected: () => dispatch(deleteSelected()),
    userdetails: (data) => dispatch(userdetails(data)),
    userListing: (data) => dispatch(userListing(data)),
    roleListing: (data) => dispatch(roleListing(data)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AdminDashboard));