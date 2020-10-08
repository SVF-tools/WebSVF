//everytime there is a new sign up, a new task is executed for that service

import React from "react";

import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: "AKIAR33FGB6S5ZZRDKDA",
  secretAccessKey: "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",
  region: "ap-southeast-2",
});

const ecs = new AWS.ECS();
// var containerArnG = "";

// export const getCreatedContainerArn = () => {
//     return containerArnG;
// }

var params = {
  cluster: "websvf-cluster",
  launchType: "EC2",
  taskDefinition: "websvf-ec2-td:6",
  //placements templates
};

export const awsRunTaskpromise = ecs.runTask(params).promise();

export const awsRunTask = () => {
  var arn = "";
  //var valueSet = false;
  awsRunTaskpromise.then(
    (data) => {
      var tmp;
      data.tasks.forEach((task) => {
        task.containers.forEach((container) => {
          tmp = container.containerArn;
        });
      });
      arn = tmp;
      return arn;
    }
    //this.valueSet = true
  );

  if (arn === "") {
    setTimeout(function () {
      return arn;
    }, 10000);
  } else {
    return arn;
  }
};

// export async function awsRunTask() {
//     var arn;
//     awsRunTaskpromise.then(
//         data => {

//             console.log(data);

//             arn = getArn(data);

//         //     return (
//         //         data.tasks.map((value) => {
//         //             (
//         //                 value.containers.map((value) => {
//         //                     arn = value.containerArn;
//         //                     console.log(arn);
//         //                 return value.containerArn;
//         //                 })
//         //             )
//         //         })
//         //     )

//         return arn;
//          }
//     )

//     setTimeout(function () {
//         return arn;
//     }, 4000)
// }

// function getArn(data) {
//     return (
//         data.tasks.map((value) => {
//             (
//                 value.containers.map((value) => {
//                     // arn = value.containerArn;
//                     // console.log(arn);
//                     return value.containerArn;
//                 })
//             )
//         })
//     )
// }

// export const awsRunTask =  awsRunTaskpromise.then(
//     data => {
//         return (
//             data.tasks.map((value) => {
//                 return (
//                     value.containers.map((value) => {

//                         return value.containerArn;
//                     })
//                 )
//             })
//         )
//     }
// )

// export const awsRunTask = () => {

//         const ecs = new AWS.ECS().;
//         //var containerArnG = "";
//         var params = {
//             cluster: "websvf-cluster",
//             launchType: "EC2",
//             taskDefinition: "websvf-ec2-td:6",
//             //placements templates
//         }

//         ecs.runTask(params, function (err, data) {
//             if (err) {
//                 console.log(err, err.stack);
//                 reject(err);
//             } else {
//                 //write a funtion to handle failiure
//                 //write function which checks for failure, if failure reason is resource memory.... then scale it up and then run this function again

//                 console.log(data);
//                 resolve(data)
//                 // data.tasks.map((task) => {
//                 //     task.containers.map((container) => {
//                 //         var containerArnG = container.containerArn.split('/').pop();
//                 //         console.log(containerArnG);
//                 //         resolve(containerArnG);
//                 //     })
//                 // })

//             }
//         })//runtask

// var params = {
//     cluster: "websvf-cluster",
//     launchType: "EC2",
//     taskDefinition: "websvf-ec2-td:6",
//     //placements templates
// }

// await ecs.runTask (params, function (err, data) {
//     if (err){
//         console.log(err, err.stack);
//     } else {
//         //write a funtion to handle failiure
//         //write function which checks for failure, if failure reason is resource memory.... then scale it up and then run this function again

//         console.log(data);

//             data.tasks.map((task) => {
//                 task.containers.map((container) => {
//                     var containerArnG = container.containerArn.split('/').pop();
//                     console.log(containerArnG);
//                     return containerArnG;
//                 })
//             })

//     }
// })//runtask

// setTimeout(() => {
//     console.log("global" + containerArnG);
// return containerArnG;
// },4000)
