package handler

import (
	"context"
	"fmt"
	"strings"

	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"

	log "github.com/sirupsen/logrus"
)

func (c *Config) DeprovisionTenent() error {

	var err error
	err = c.deleteRouteResource()
	if err != nil {
		log.Error(err)
	}

	err = c.deleteAppAuthProxy()
	if err != nil {
		log.Error(err)
	}

	return err
}

func (c *Config) deleteAppAuthProxy() error {
	name := c.AppConfig.AppName + "-" + c.Tenant

	var err error
	err = c.deleteConfigMap(name)
	if err != nil {
		log.Error(err)
	}

	err = c.deleteDeployment(name)
	if err != nil {
		log.Error(err)
	}

	err = c.deleteService(name)
	if err != nil {
		log.Error(err)
	}

	err = c.deleteAPIRule(name, uint32(80))
	if err != nil {
		log.Error(err)
	}

	return err
}

func (c *Config) deleteRouteResource() error {

	for _, s := range c.AppConfig.AppAuthProxy.Routes {
		fmt.Println("Target: ", s.Target)

		var err error
		var appName string
		if len(s.K8Config.Image) != 0 {

			imageAndVersion := s.K8Config.Image[strings.LastIndex(s.K8Config.Image, "/")+1:]
			imageOnly := strings.Split(imageAndVersion, ":")[0]
			appName = imageOnly + "-" + c.Tenant

			log.Infof("Found Image - removing k8s resources: %s", appName)
			err = c.deleteDeployment(appName)
			if err != nil {
				log.Error(err)
			}

			err = c.deleteService(appName)
			if err != nil {
				log.Error(err)
			}

			if len(s.K8Config.Volumes) > 0 {
				var cmName string
				for i, s := range s.K8Config.Volumes {
					cmName = s.ConfigMap.Name + "-" + c.Tenant + "-" + fmt.Sprint(i)
					err = c.deleteConfigMap(cmName)
					if err != nil {
						log.Error(err)
					}
				}
			}

		} else {
			log.Infof("No Image Found - no deprovision necessary")
		}
	}
	return nil
}

func (c *Config) deleteDeployment(name string) error {
	log.Info("Deleting deployment...")

	deploymentsClient := c.AppConfig.K8Config.Clientset.AppsV1().Deployments(c.AppConfig.Namespace)

	deletePolicy := metav1.DeletePropagationForeground
	if err := deploymentsClient.Delete(context.TODO(), name, metav1.DeleteOptions{
		PropagationPolicy: &deletePolicy,
	}); err != nil {
		return err
	}
	log.Infof("Deleted deployment %s", name)

	return nil
}

func (c *Config) deleteConfigMap(name string) error {
	log.Info("Deleting Configmap...")

	cmClient := c.AppConfig.K8Config.Clientset.CoreV1().ConfigMaps(c.AppConfig.Namespace)

	deletePolicy := metav1.DeletePropagationForeground
	if err := cmClient.Delete(context.TODO(), name, metav1.DeleteOptions{
		PropagationPolicy: &deletePolicy,
	}); err != nil {
		return err
	}
	log.Infof("Deleted Configmap %s", name)

	return nil
}

func (c *Config) deleteService(name string) error {
	log.Info("Deleting service...")

	serviceClient := c.AppConfig.K8Config.Clientset.CoreV1().Services(c.AppConfig.Namespace)

	deletePolicy := metav1.DeletePropagationForeground
	if err := serviceClient.Delete(context.TODO(), name, metav1.DeleteOptions{
		PropagationPolicy: &deletePolicy,
	}); err != nil {
		return err
	}
	log.Infof("Deleted service %s", name)

	return nil
}

func (c *Config) deleteAPIRule(name string, port uint32) error {
	log.Info("Deleting APIRule...")

	apiRule := getAPIRule(name, c.AppConfig.Namespace, port)
	err := c.AppConfig.K8Config.APIRuleClientset.Delete(context.TODO(), apiRule)

	if err != nil {
		return err
	}

	log.Infof("Deleted APIRule %s", name)

	return nil
}
