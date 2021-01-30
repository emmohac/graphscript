aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <account>.dkr.ecr.<region>.amazonaws.com
docker tag <image-name>:latest <account>.dkr.ecr.<region>.amazonaws.com/<repository-name>:latest
docker push <account>.dkr.ecr.<region>.amazonaws.com/<repository-name>:latest