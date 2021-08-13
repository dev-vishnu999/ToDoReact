import React, { Component } from 'react';
import { withRouter,Link } from "react-router-dom";
import { connect } from "react-redux";
import Modal from 'react-modal';
import {
    userdetails,
    deleteSelected,
    taskListings,
    userToken,
    myRoles,
    userListing,
    roleListing
  } from "../../redux/actions/actions";

class Header extends Component {
    constructor(props) {
        super(props);
        if(!this.props.user_details.hasOwnProperty('email')) {
            this.props.history.push("/admin-login");
        }
        this.logout = this.logout.bind(this);
    }
    logout() {
        this.props.userdetails({});
        this.props.taskListings([]);
        this.props.userToken('');
        this.props.myRoles([]);
        this.props.userListing([]);
        this.props.roleListing([]);
        this.props.history.push("/admin-login");
    }
    render() {
        return (
            <div className="row">
                <div className="">
                    <h3 className="title"> Welcome {(this.props.user_details.firstName && this.props.user_details.lastName) ? this.props.user_details.firstName+' '+this.props.user_details.lastName : 'user'}
                        <button type="button" className="btn btn-info btn-round add-TaskBtn m-l-10" onClick={this.logout}>Logout</button>
                        <Link to="/role-listing" className="btn btn-info btn-round add-TaskBtn m-l-10">Roles</Link> 
                        <Link to="/admin-dashboard" className="btn btn-info btn-round add-TaskBtn">User Listing</Link>
                        
                    </h3>
                    
                    <ul className="timeline timeline-simple">
                        
                    </ul>
                    
                    
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
    taskListings: (data) => dispatch(taskListings(data)),
    userToken: (data) => dispatch(userToken(data)),
    myRoles: (data) => dispatch(myRoles(data)),
    userListing: (data) => dispatch(userListing(data)),
    roleListing: (data) => dispatch(roleListing(data)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));