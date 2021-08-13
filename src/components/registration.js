import React, { Component } from 'react';
import { withRouter,Link } from "react-router-dom";
import { connect } from "react-redux";
import {
    userdetails
  } from "../redux/actions/actions";
import { ApiRequest } from "../apiServices/ApiRequest";
import { Apis } from "../common";
import swal from 'sweetalert';
import loadingImg from '../assets/img/loading.gif';

class Registration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            overlay: false,
        }
        this.formHandler = this.formHandler.bind(this);
        this.Registration = this.Registration.bind(this);
    }

    formHandler(ev) {
        this.setState({ [ev.target.name]: ev.target.value });
    }

    Registration() {
        let first_name = this.state.first_name;
        let last_name = this.state.last_name;
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
        if(!first_name) {
            valueErr = document.getElementsByClassName("err_first_name");
            valueErr[0].innerText="This Field is Required";
        }
        if(!last_name) {
            valueErr = document.getElementsByClassName("err_last_name");
            valueErr[0].innerText="This Field is Required";
        }
        if(email && password && validEmail == 'on' && first_name && last_name) {
            this.setState({
                overlay:true
            })
            let requestData = {
                Email: email,
                Password: password,
                FirstName:first_name,
                LastName:last_name
            };
            ApiRequest(requestData, Apis.ApiRegistration, "POST")
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
                    this.props.history.push("/");
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
                                    <h3 class="card-title"> Registration</h3>
                                </div>

                                <div class="card-body">
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label class="bmd-label-floating">First Name</label>
                                            <input type="text" class="form-control" name="first_name" onChange={this.formHandler}/>
                                            <span className="err err_first_name"></span>
                                        </div>
                                        <div class="form-group">
                                            <label class="bmd-label-floating">Last Name</label>
                                            <input type="text" class="form-control" name="last_name" onChange={this.formHandler}/>
                                            <span className="err err_last_name"></span>
                                        </div>
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
                                            <button class="btn custom-btn btn-primary full-width" onClick={this.Registration}> <i class="fa fa-sign-in"></i> Registration</button>
                                        </div>
                                        <p class="text-center"> Already account ? <Link to={'/'}> Login</Link> </p>
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
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Registration));