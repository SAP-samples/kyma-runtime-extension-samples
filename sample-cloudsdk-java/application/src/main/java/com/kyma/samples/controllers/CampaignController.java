package com.kyma.samples.controllers;

import com.kyma.samples.config.ApplicationConfig;
import com.myshop.vdm.namespaces.campaigns.Campaign;
import com.myshop.vdm.services.DefaultCampaignsService;
import com.sap.cloud.sdk.cloudplatform.connectivity.DestinationAccessor;
import com.sap.cloud.sdk.s4hana.connectivity.DefaultErpHttpDestination;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/campaigns")
public class CampaignController {
    private final DefaultErpHttpDestination destination;
    private final DefaultCampaignsService campaignsService;

    @Autowired
    public CampaignController(ApplicationConfig applicationConfig) {
        this.destination = DestinationAccessor
                .getDestination(applicationConfig.getTenantName())
                .asHttp()
                .decorate(DefaultErpHttpDestination::new);
        this.campaignsService = new DefaultCampaignsService()
                .withServicePath(applicationConfig.getServicePath());
    }

    @RequestMapping(method = RequestMethod.GET)
    public List<Campaign> getCampaigns() {

        return this.campaignsService
                .getAllCampaign()
                .top(2)
                .select(
                        Campaign.CAMPAIGN_ID,
                        Campaign.NODE_ID,
                        Campaign.CATEGORY_NAME
                )
                .executeRequest(this.destination);
    }
}
