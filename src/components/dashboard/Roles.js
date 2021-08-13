import React, { Component } from 'react';
import { withRouter,Link } from "react-router-dom";
import { connect } from "react-redux";
import Modal from 'react-modal';
import Header from './Header';
import swal from 'sweetalert';
import {
    userdetails,
    deleteSelected,
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

class Roles extends Component {
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
        if(!this.props.user_details.hasOwnProperty('email')) {
            this.props.history.push("/");
        }
    }
    
    componentDidMount() {
        let requestData = {};
        var token = this.props.user_token;
        ApiRequest(requestData, Apis.GetRoles, "GET",token)
        .then((res) => {
            this.props.roleListing(JSON.stringify(res.data));
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
                                                <i class="material-icons">face</i>
                                            </div>
                                        </div>
                                        <div class="card-body">
                                            <h4 class="card-title">
                                                Role Listing 
                                            </h4>
                                            <div class="table-responsive">
                                                <table id="datatables" class="table table-striped table-no-bordered table-hover" cellspacing="0" width="100%">
                                                    <thead>
                                                        <tr>
                                                            <th>S.No</th>
                                                            <th>Role Name</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                    {
                                                        this.props.role_listing.length > 0 ?
                                                        JSON.parse(this.props.role_listing).map((Data,Index)=>
                                                        <tr key={Index}>
                                                            <td>{Index+1}</td>
                                                            <td>{Data.name}</td>
                                                        </tr> 
                                                        )
                                                        :
                                                        <tr>
                                                            <td colSpan="3">No user Found</td>
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
    roleListing: (data) => dispatch(roleListing(data)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Roles));