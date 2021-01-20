module github.com/SAP-samples/kyma-runtime-extension-samples/saas-provisioning

go 1.15

require (
	github.com/dgrijalva/jwt-go v3.2.0+incompatible
	github.com/getlantern/deepcopy v0.0.0-20160317154340-7f45deb8130a
	github.com/google/uuid v1.1.1
	github.com/gorilla/mux v1.8.0
	github.com/imdario/mergo v0.3.11 // indirect
	github.com/jinzhu/copier v0.2.3
	github.com/kyma-incubator/api-gateway v0.0.0-20201127140450-8af556cde95f
	github.com/ory/oathkeeper-maester v0.1.0
	github.com/sirupsen/logrus v1.7.0
	github.com/vrischmann/envconfig v1.3.0
	golang.org/x/time v0.0.0-20201208040808-7e3f01d25324 // indirect
	k8s.io/api v0.19.3
	k8s.io/apimachinery v0.19.3
	k8s.io/client-go v0.19.3
	k8s.io/utils v0.0.0-20201110183641-67b214c5f920 // indirect
	sigs.k8s.io/controller-runtime v0.6.0
)
