package com.sap.kyma.sample.orders.domain.command;

import io.micronaut.core.annotation.Introspected;

import javax.validation.constraints.NotBlank;

@Introspected
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
