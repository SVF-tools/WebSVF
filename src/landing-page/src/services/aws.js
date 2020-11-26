import AWS from 'aws-sdk'

//authentication using IAM user
// AWS.config.update({
//     accessKeyId: "AKIAR33FGB6S5ZZRDKDA",
//     secretAccessKey: "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",
//     region: "ap-southeast-2",
//   });



  //ecs object
export const ecs = new AWS.ECS();
export const ec2 = new AWS.EC2();
  