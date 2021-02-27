import React, { useContext } from "react";

import { GraphQLClient } from "graphql-request";
import { GoogleLogin } from "react-google-login";

import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import API_KEYS from "../../ENV";
import Context from "../../context";
import { BASE_URL } from "../../client";
import { ME_QUERY } from "../../graphql/queries";


const Login = ({ classes }) => {
  const { dispatch } = useContext(Context);

  const onFailure = error => {
    console.log("Error logging in:", error);
    dispatch({ type: "IS_LOGGED_IN", payload: false });
  };

  const onSuccess = async googleUser => {
    try {
      const idToken = googleUser.getAuthResponse().id_token;
      const client = new GraphQLClient(BASE_URL, {
        headers: { authorization: idToken }
      });
      const { me } = await client.request(ME_QUERY);
      dispatch({ type: "LOGIN_USER", payload: me });
      dispatch({ type: "IS_LOGGED_IN", payload: googleUser.isSignedIn() });
    } catch (error) {
      onFailure(error);
    }
  };

  return (
    <div className={classes.root}>
      <Typography
        component="h1"
        variant="h3"
        gutterBottom
        noWrap
        style={{ color: "rgb(66, 133, 234)" }}
      >
        Welcome
      </Typography>
      <GoogleLogin clientId={API_KEYS.OAUTH_CLIENT_ID}
                   onSuccess={onSuccess}
                   onFailure={onFailure}
                   isSignedIn={true}
                   theme="dark"
                   buttonText="Login with Google"
      />
    </div>
  );
};

const styles = {
  root: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center"
  }
};

export default withStyles(styles)(Login);
