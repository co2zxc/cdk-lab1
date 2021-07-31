import * as cdk from '@aws-cdk/core';
import * as patterns from 'cdk-fargate-patterns';
import * as acm from '@aws-cdk/aws-certificatemanager';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as path from 'path';


export class Lab1Stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    const nginxTask = new ecs.FargateTaskDefinition(this, 'Task', {
      cpu: 256,
      memoryLimitMiB: 512,
    })
    
    nginxTask.addContainer('nginx', {
      
      image: ecs.ContainerImage.fromAsset(path.join(__dirname, '../src/laravel-ming')),
      //image: ecs.ContainerImage.fromRegistry('nginx:latest'),
      portMappings: [ { containerPort: 80 }]
    })
    
    const cert = acm.Certificate.fromCertificateArn(this, 'MyCert', 'arn:aws:acm:us-east-2:863936362823:certificate/d63ab075-42f1-4edd-bb0f-c3c9fc95eb4a')
    
    
    new patterns.DualAlbFargateService(this, 'MingService', {
      spot: true,
      tasks: [
        {
          task: nginxTask,
          external: { port: 443, certificate: [cert] },
        }
      ]
    })
  
 }
  
}
