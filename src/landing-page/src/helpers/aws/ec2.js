//describeInstance to get the public
import { ec2 } from "../../services/aws";

var publicIp = "";
var currentEc2Id = "";
var currentEc2Status = "";

export const ec2IP = (instanceId) => {
  const params = {
    InstanceIds: [instanceId],
  };

  ec2.describeInstances(params, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      data.Reservations.forEach((value) => {
        value.Instances.forEach((value) => {
          console.log(value.PublicIpAddress);
          setPublicIP(value.PublicIpAddress);
        });
      });
    }
  });
};
//"lt-060bd836cd9bc2cea",
export const newEC2Instance = () => {
  console.log(`in newEC2Instancefunction`);
  const params = {
    LaunchTemplate: {
      LaunchTemplateId: "lt-060bd836cd9bc2cea",
    },
    MinCount: 1,
    MaxCount: 1,
  };

  ec2.runInstances(params, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log(data);
      data.Instances.forEach((value) => {
        currentEc2Id = value.InstanceId;
        console.log(
          currentEc2Status + "is the status before checkInstanceStatus"
        );
      });
      // console.log(
      //    value. + "is the status before checkInstanceStatus"
      // );
      checkInstanceStatus(currentEc2Id);
    }
  });
};

function checkInstanceStatus(Ec2Id) {
  var params = {
    InstanceIds: [Ec2Id],
  };
  console.log(Ec2Id);

  ec2.describeInstances(params, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      data.Reservations.forEach((value) => {
        value.Instances.forEach((value) => {
          currentEc2Status = value.State.Name;
          console.log("creating EC@ instance with status " + currentEc2Status);
          if (currentEc2Status === "running") {
            console.log("status is now " + currentEc2Status);
            currentEc2Status = "";
            console.log("status is now cleared " + currentEc2Status);
            //awsRunTask();
          } else {
            console.log(
              "ec2 is not running yet. status is: " + currentEc2Status
            );
            setTimeout(function () {
              checkInstanceStatus(Ec2Id);
            }, 5000);
          }
        });
      });
    }
  });
}

export function getCreatedEC2Status() {
  return currentEc2Status;
}

function setPublicIP(value) {
  publicIp = value;
  console.log(` public ip from set public ip function ${publicIp}`);
}

export function getPublicIP() {
  console.log(` public ip from get public ip function ${publicIp}`);
  return publicIp;
}
