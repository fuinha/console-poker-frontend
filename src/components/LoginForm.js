import React from 'react';
import { loginUser, authenticateViaGoogle } from '../redux/dispatchActions';
import { connect } from 'react-redux';
import Errors from './Errors';
import { Link } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';

class LoginForm extends React.Component {
    state = {
        email: "",
        password: ""
    }

    // componentDidMount() {
    //     var googleUser = {};
    //     var startApp = function() {
    //         gapi.load('auth2', function(){
    //         // Retrieve the singleton for the GoogleAuth library and set up the client.
    //         auth2 = gapi.auth2.init({
    //             client_id: 'YOUR_CLIENT_ID.apps.googleusercontent.com',
    //             cookiepolicy: 'single_host_origin',
    //             // Request scopes in addition to 'profile' and 'email'
    //             //scope: 'additional_scope'
    //         });
    //         attachSignin(document.getElementById('customBtn'));
    //         });
    //     };

    //     function attachSignin(element) {
    //         console.log(element.id);
    //         auth2.attachClickHandler(element, {},
    //             function(googleUser) {
    //             document.getElementById('name').innerText = "Signed in: " +
    //                 googleUser.getBasicProfile().getName();
    //             }, function(error) {
    //             alert(JSON.stringify(error, undefined, 2));
    //             });
    //     }
    // }

    changeHandler = event => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    submitHandler =  event => {
        event.preventDefault();
        console.log(this.state);
        this.props.loginUser(this.state, this.props.history)
    }

    renderRegister = () => {
        return (
            <>
                Don't have an account? <Link to="/register">Register!</Link>
            </>
        )
    }

    responseGoogle = googleAuth => {
        // console.log('hi');
        // console.log(googleAuth);
        // console.log(googleAuth.profileObj.email);
        // console.log(googleAuth.profileObj.name);
        this.props.authenticateViaGoogle(googleAuth.profileObj.email, googleAuth.profileObj.name, this.props.history);
    }

    render() {
        return(
            <div className="user_form">
                <h1 id="login_header"><i className="nes-octocat animate" id="octocat"></i>Console-Poker!</h1>
                <p>Chat and Play Holdem with Your Friends!</p><br/>
                CONTINUE WITH &nbsp;
                <GoogleLogin
                    clientId="785982233290-7m6jlqskqg3e7v93hg2a0t3fil69o19l.apps.googleusercontent.com"
                    buttonText="Login"
                    render={renderProps => (
                        // eslint-disable-next-line
                        <a href="#" onClick={renderProps.onClick} disabled={renderProps.disabled}><i className="nes-icon google is-medium"></i></a>
                      )}
                    onSuccess={googleAuth => this.responseGoogle(googleAuth)}
                    onFailure={this.responseGoogle}
                    cookiePolicy={'single_host_origin'}
                /><br/>
                <br/><br/>
                <Errors />
                <form onSubmit={this.submitHandler}>
                    <label>
                        Email*<br/>
                    <input className="nes-input form_input" onChange={this.changeHandler} type="text" name="email" value={this.state.email}/>
                    </label>
                    <label>
                        Password*<br/>
                    <input className="nes-input" onChange={this.changeHandler} type="password" name="password" value={this.state.password}/>
                    </label><br/>
                    <button className="nes-btn" type="submit" value="login">Log In</button><br/>
                    {this.renderRegister()}
                </form>
                <br/><br/>
                <span className="nes-text is-disabled">By continuing, you agree to our <Link to="/terms">Terms &#38; Conditions</Link></span>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loginUser: (state, history) => dispatch(loginUser(state, history)),
        authenticateViaGoogle: (email, name, history) => dispatch(authenticateViaGoogle(email, name, history))
    }
}

export default connect(null, mapDispatchToProps)(LoginForm);