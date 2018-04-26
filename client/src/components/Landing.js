import React from "react";
import {Button} from "../common/Button";
import AuthForm from "../components/AuthForm";
import {Switch, Route} from "react-router-dom";
import {connect } from "react-redux";
import {authUser } from "../store/actions/auth";
import {animateEnter, animateEnterReverse, animateExit, animateExitReverse} from "../store/actions/animate";
import classNames from "classnames";
import "./Landing.css";

/*
---------------------------------------------
This no longer needs to be a component: TODO make a stateless function
DONE
---------------------------------------------
*/

const LandingPage = (props) =>{

  const handleClick = (e, type) =>{
    if(type==="next"){
      props.animateExit();
      props.animateEnter();
      props.history.push(e)
    }else if(type==="back"){
      props.animateExitReverse();
      props.animateEnterReverse();
      props.history.push(e)

  }
}
  const authThenRedirect = (...args) =>{
    props.authUser(...args).then(()=>{
      props.history.push("/");
      props.animateEnter();
    })
  }
  const {errors, animate} = props;
  return(
    <div className="landing-page">
    <Switch>
    <Route exact path = "/signin" render={props => {
      return(
        <AuthForm
          errors={errors}
          onAuth={authThenRedirect} {...props}
          buttonText="Log in"
          heading="Welcome!"
          backAction={handleClick.bind(this, "/", "back")}
        />
      );
    }} />
      <Route exact path = "/signup" render={props => {
        return(
          <AuthForm
            errors={errors}
            onAuth={authThenRedirect}
            signUp
            buttonText="Sign Up!"
            heading="Join today!"
            backAction={handleClick.bind(this, "/", "back")}
            {...props}
          />
        );
      }} />
      {/* This shouuld become its own fuction: */}
      <Route exact path = "/" render={props =>
          <div className={classNames({
            "home-box": true,
            "exit-animation": animate.exit,
            "exit-animation-reverse": animate.exitReverse,
            "enter-animation-reverse": animate.enterReverse,
            "enter-animation": animate.enter,
          })}>
          {console.log(animate)}
            <div className="welcome-title"><h2>Welcome to Kinkon</h2></div>
            <div className="signup-btn-div"> <Button onClick={handleClick.bind(this, "/signup", "next")} type="signup" text="Sign Up" /></div>
            <div className="signin-btn-div"> <Button onClick={handleClick.bind(this, "/signin", "next")} type="signin" value="value" text="Sign in"/></div>
        </div>
        }
      />
    </Switch>
    </div>
  )
}
function mapStateToProps(state){
  return {
    errors: state.errors,
    animate: state.animate
  };
}
export default connect(mapStateToProps, {authUser, animateEnter, animateEnterReverse, animateExit, animateExitReverse})(LandingPage);