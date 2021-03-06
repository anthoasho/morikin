import React, {Component} from "react";
import MessageList from "../Messages/MessageList";
import UserSmall from "../LeftSideBar/UserSmall";
import {getUserProfile, followUser, getDiscoverUsers} from "../../store/actions/userProfile";
import { updateMessages } from "../../store/actions/messages";
import {clearAllPopUps, resizeFunction, setContext} from "../../store/actions/UI";
import LoaderIcon from "../../common/Loader";
import { withRouter} from "react-router-dom";
import {connect } from "react-redux";
import PopupDialog from "../../common/error";
import Discover from "../RightSideBar/Discover";
import PropTypes from "prop-types";

class Timeline extends Component{
  constructor(props) {
    super(props);
    this.getUserProfile = this.props.getUserProfile.bind(this)
    this.updateMessages = this.props.updateMessages.bind(this)
    this.handleBottom = this.handleBottom.bind(this);
  }
  urlData = this.props.match;
  paramsID = this.urlData.params.id;
  handleBottom = () => {
    let method = this.paramsID ? this.paramsID : ""
    let lastMessage = this.props.state[this.props.page].messages.data[this.props.state[this.props.page].messages.data.length -1]
    console.log(lastMessage)
    this.updateMessages(method, lastMessage._id);
  }
  componentWillMount(){
    window.addEventListener("resize", () => (this.props.resizeFunction(window.innerWidth)))
    this.props.setContext(this.props.page)
  }
  componentDidMount(){
    this.getUserProfile(this.props.fetcher);
      this.props.getDiscoverUsers();
  }
  componentWillUnmount(){
    window.removeEventListener("resize", this.handleResize)
    // clearInterval(this.refreshInterval);
  }
  render(){
    const { discover, loadingBool, page, currentUser} = this.props;
    const {url} = this.urlData;

    let messages = this.props.state[page].messages;
    let profile = this.props.state[page].profile;
    if((this.props.isMobile) && (this.props.page === "dashboard")){
      return     (<div className="timeline-container">
            {loadingBool && <Loading isMobile={this.props.isMobile}/> }
              <MessageList
                key={`messages ${url}`}
                messages = {messages}
                bottomClick={this.handleBottom}
              />
              <PopupDialog goBack={this.props.history.goBack}/>{/* This will later become a general popup dialog, not just errors*/}

            </div>)
    }
      return(
        <div className="timeline-container">
          {loadingBool && <Loading isMobile={this.props.isMobile} /> }
          {currentUser && <UserSmall
            key={`user ${this.props.state[page].username}`}
            profile={profile}

          /> }
          <MessageList
            key={`messages ${url}`}
            bottomClick={this.handleBottom}
            messages={messages}
          />
          <PopupDialog goBack={this.props.history.goBack}/>{/* This will later become a general popup dialog, not just errors*/}

          {(!this.props.isMobile &&  currentUser.isLoggedIn) &&<Discover users={discover.users}/>}
          </div>
      );
  }
}

Timeline.propTypes = {
  profile: PropTypes.object,
  messages: PropTypes.object,
  currentUser: PropTypes.object,
  errors: PropTypes.object,
  discover: PropTypes.object,
  loadingBool: PropTypes.bool,
  isMobile: PropTypes.bool,
  getUserProfile: PropTypes.func,
  followUser: PropTypes.func,
  updateMessages: PropTypes.func,
  clearAllPopUps: PropTypes.func,
  resizeFunction: PropTypes.func
}
const Loading = (props) => {
  return(
    <div className="loading" style={{background: props.isMobile ? "#fdfdfd" : "#fdfdfdcc"}}>
      <LoaderIcon />
    </div>
  )
}

function mapStateToProps(state){
  return {
    profile: state.userProfile,
    messages:state.messages,
    currentUser: state.myProfile.auth,
    discover: state.discover,
    loadingBool: state.ui.loading,
    isMobile: state.ui.isMobile,
    state: state
  };
}
export default withRouter(connect(mapStateToProps, {getUserProfile, followUser, updateMessages, getDiscoverUsers, clearAllPopUps, resizeFunction, setContext})(Timeline));


//Currently disabled refreshInterval, aim to replace with socket io (pushdata)
              // this.refreshInterval = setInterval(()=> {
              //   this.returnFetch();
              // }, 300000);
