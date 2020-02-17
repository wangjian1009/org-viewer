node("master") {
    checkout scm
    tag = sh(returnStdout: true, script: "git log -n 1 --pretty=format:'%h'").trim()
    image = "registry.cn-hangzhou.aliyuncs.com/adups/org-viewer:${tag}"

    stage('build') {
      sh "docker build -t ${image} ."
    }

    stage('deploy') {
      dir('helm/org-viewer') {
        withKubeConfig(contextName: "dev-test", credentialsId: 'kubernetes-config') {
            sh "helm upgrade org-viewer --install --set image.tag=${tag} ."
        }
      }
    }
}
