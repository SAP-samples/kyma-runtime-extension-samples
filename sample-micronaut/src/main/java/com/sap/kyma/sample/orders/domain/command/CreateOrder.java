package com.sap.kyma.sample.orders.domain.command;

import javax.validation.constraints.NotBlank;

public class CreateOrder {
    @NotBlank
    private String description;

    public CreateOrder() {
    }

    public CreateOrder(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
