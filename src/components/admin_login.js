import React, { Component } from 'react';
import { withRouter,Link } from "react-router-dom";
import { connect } from "react-redux";
import {
    userdetails,
    userToken,
    myRoles
  } from "../redux/actions/actions";
import { ApiRequest } from "../apiServices/ApiRequest";
import { Apis } from "../common";
import loadingImg from '../assets/img/loading.gif';
import swal from 'sweetalert';
class AdminLogin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            overlay: false,
        }
        this.formHandler = this.formHandler.bind(this);
        this.Login = this.Login.bind(this);
    }
    formHandler(ev) {
        this.setState({ [ev.target.name]: ev.target.value });
    }
    Login() {
        let email = this.state.email;
        let password = this.state.password;
        var valueErr = document.getElementsByClassName("err");
        for(var i = 0; i < valueErr.length; i++){
            valueErr[i].innerText="";
        }
        if(!email) {
            valueErr = document.getElementsByClassName("err_email");
            valueErr[0].innerText="This Field is Required";
        }
        var reEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var validEmail = 'on';
         if(email && !email.match(reEmail)) {
             validEmail = 'off';
            valueErr = document.getElementsByClassName("err_email");
            valueErr[0].innerText="Please Enter the valid Email Address!"    
        }
        if(!password) {
            valueErr = document.getElementsByClassName("err_password");
            valueErr[0].innerText="This Field is Required";
        }
        
        if(email && password && validEmail === 'on') {
            let requestData = {
                Email: email,
                Password: password,
            };
            // this.props.userdetails(requestData);
            // this.props.history.push("/admin-dashboard");
            ApiRequest(requestData, Apis.ApiLogin, "POST")
          .then((res) => {
                this.setState({
                    overlay:false
                })
                if(res.success) {
                    swal({
                        title: "Success",
                        text: res.message,
                        icon: "success",
                        successMode: true,
                    })
                    .then(willDelete => {
                        this.props.userdetails(res.userDetail);
                        this.props.userToken(res.token);
                        if(res.roles && res.roles.length > 0) {
                            this.props.myRoles(JSON.stringify(res.roles));
                        }
                        this.props.history.push("/admin-dashboard");
                    });
                } else {
                    valueErr = document.getElementsByClassName("err_password");
                    valueErr[0].innerText=res.message;
                }
          })
          .catch((error) => {
            console.log(error);
          });
      
        }
    }
    
    render() {
        return (
            <div class="wrapper ">
            <div class="main-panel" style={{width:'100%'}}>
                <div class="login-sec">
                    <div class="login-panel">
                        <div class="login-box">
                            <div class="card">
                                <div class="card-header card-header-primary">
                                    <h3 class="card-title"> Admin Login</h3>
                                </div>

                                <div class="card-body">
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label class="bmd-label-floating">Email</label>
                                            <input type="email" class="form-control" name="email" onChange={this.formHandler}/>
                                            <span className="err err_email"></span>
                                        </div>
                                        <div class="form-group">
                                            <label class="bmd-label-floating">Password</label>
                                            <input type="password" class="form-control" name="password" onChange={this.formHandler}/>
                                            <span className="err err_password"></span>
                                        </div>
                                        
                                        <div class="form-group">
                                            <button class="btn custom-btn btn-primary full-width"  onClick={this.Login}> <i class="fa fa-sign-in"></i> Login</button>
                                        </div>
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <div className={this.state.overlay ? 'overlayShow' : 'overlayHide'}>
                <div className="loading_message round_bottom"> <img alt="loading" src={loadingImg} /></div>
            </div>
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
    userToken: (data) => dispatch(userToken(data)),
    myRoles: (data) => dispatch(myRoles(data)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AdminLogin));