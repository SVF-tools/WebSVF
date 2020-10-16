import React from "react";
import "./dashboard.scss";
import { db, auth } from "../../../services/firebase";
import Iframe from "../../Iframe/index.js";
import Loader from "../../Loader/index.js";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: auth().currentUser,
      publicIP: null,
      port: null,
      source: null,
    };
    this.setPublicIP = this.setPublicIP.bind(this);
    this.setPort = this.setPort.bind(this);
    this.setSource = this.setSource.bind(this);
  }

  componentDidMount() {
    console.log(`component did mount fired`);
    this.publicIPRef = db.ref("users/" + this.state.user.uid).child("publicIP");
    this.portRef = db.ref("users/" + this.state.user.uid).child("port");
    console.log(this.sourceRef);

    this.publicIPRef.on("value", (dataSnapshot) => {
      console.log(dataSnapshot.val());

      this.setPublicIP(dataSnapshot.val());
    });

    this.portRef.on("value", (dataSnapshot) => {
      console.log(dataSnapshot.val());

      this.setPort(dataSnapshot.val());
    });

    if (this.state.port && this.state.publicIP) {
      var source = `${this.state.publicIP}:${this.state.port}`;
      this.setSource(source);
    }
  }

  setPublicIP(value) {
    console.log(`setting public IP as ${value}`);
    this.setState({
      publicIP: value,
    });
  }

  setPort(value) {
    console.log(`setting port as ${value}`);
    this.setState({
      port: value,
    });
  }

  setSource(value) {
    console.log(`source is about to set as ${value}`);
    this.setState({
      source: value,
    });
  }

  render() {
    return (
      <div>
        {this.state.publicIP && this.state.port ? (
          <Iframe source={`https://${this.state.publicIP}:${this.state.port}`} />
        ) : (
          <Loader />
        )}
      </div>
    );
  }
}

export default Dashboard;
