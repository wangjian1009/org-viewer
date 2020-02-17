build-image:
	docker build -t registry.cn-hangzhou.aliyuncs.com/adups/org-viewer .

run-image:
	docker run -p 30080:8080 registry.cn-hangzhou.aliyuncs.com/adups/org-viewer

push-image:
	docker login --username=adups-sfox@adups-sfox --password adups369 registry.cn-hangzhou.aliyuncs.com
	docker push registry.cn-hangzhou.aliyuncs.com/adups/org-viewer
