package com.sap.kyma.sample.orders.domain.command;

import io.micronaut.core.annotation.Introspected;

import javax.validation.constraints.NotBlank;

@Introspected
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
