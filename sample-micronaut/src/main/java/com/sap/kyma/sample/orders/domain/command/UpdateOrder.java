package com.sap.kyma.sample.orders.domain.command;

import javax.validation.constraints.NotBlank;

public class UpdateOrder {
    public UpdateOrder() {

    }

    public UpdateOrder(String description) {
        this.description = description;
    }

    @NotBlank
    private String description;

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
