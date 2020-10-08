import { ecs } from "../../services/aws";
import { ec2IP, getPublicIP, newEC2Instance } from "./ec2";

export var containerId = null;
export var bindIP;
export var containerPort;
export var hostPort = null;
export var protocol;
export var publicIP = null;

const params = {
  cluster: "websvf-cluster",
  launchType: "EC2",
  taskDefinition: "websvf-ec2-td:6",
};

//function creates a new ECS task for slected ECS cluster
export const awsRunTask = () => {
  console.log("starting run task");
  ecs.runTask(params, (err, data) => {
    console.log("inside run task");
    if (err) {
      console.log(err);
    } else {
      console.log("inside else");
      console.log(data);
      console.log("data for each loop starts now");
      data.tasks.forEach((task) => {
        console.log("ec2 instance is " + task.containerInstanceArn);

        task.containers.forEach((container) => {
          console.log(
            "loggin from line 30 in awsruntask.js. container is " +
              container.taskArn
          );
          assignContainerValueToGlobal(container.taskArn);
          getNetworkBindings(containerId);
        });
        getIPAddress(task.containerInstanceArn);
      });
    }
  });
};
export const checkNumberOfRunningTasks = () => {
  var params = {
    cluster: "websvf-cluster",
  };

  ecs.listTasks(params, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log(data);

      var runningTasksChecker = data.taskArns.length;
      console.log(runningTasksChecker + "task current running");
      console.log(runningTasksChecker);
      if (runningTasksChecker % 2 === 0) {
        newEC2Instance();
      }
    }
  });
};

function getIPAddress(conatinerInstanceId) {
  const params = {
    cluster: "websvf-cluster",
    containerInstances: [conatinerInstanceId],
  };
  ecs.describeContainerInstances(params, (err, data) => {
    if (err) {
      console.log(
        `there were some errors describing conatiner instances \n ${err}`
      );
    } else {
      data.containerInstances.forEach((value) => {
        ec2IP(value.ec2InstanceId);
        assignPublicIpToGlobal();
      });
    }
  });
}

const getNetworkBindings = (taskArn) => {
  var params = {
    cluster: "websvf-cluster",
    tasks: [taskArn],
  };
  console.log(taskArn + "before describing task");

  ecs.describeTasks(params, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      data.tasks.forEach((value) => {
        if (
          value.lastStatus === "PROVISIONING" ||
          value.lastStatus === "PENDING" ||
          value.lastStatus === "ACTIVATING" ||
          value.lastStatus === "DEACTIVATING" ||
          value.lastStatus === "STOPPING" ||
          value.lastStatus === "DEPROVISIONING"
        ) {
          console.log(taskArn + " inside if " + value.lastStatus);
          setTimeout(function () {
            getNetworkBindings(taskArn);
          }, 3000);
        } else {
          value.containers.forEach((value) => {
            console.log(taskArn + " inside else");
            value.networkBindings.forEach((value) => {
              assignNetworkDataToGlobal(
                value.bindIP,
                value.containerPort,
                value.hostPort
              );
            });
          });
        }
      });
    }
  });

  //setters
  function assignNetworkDataToGlobal(pbindIP, pcontainerPort, phostPort) {
    bindIP = pbindIP;
    containerPort = pcontainerPort;
    hostPort = phostPort;

    console.log(`${bindIP}\n ${containerPort}\n${hostPort}`);
  }
};

function assignContainerValueToGlobal(container) {
  console.log(`assigning parameter ${container} to containerId now`);
  containerId = container.split("/").pop();
  console.log(`assigned ${containerId} to containerId: completed`);
  // getNetworkBindings(containerId);
}

function assignPublicIpToGlobal() {
  setTimeout(function () {
    publicIP = getPublicIP();
  }, 1000);
}
