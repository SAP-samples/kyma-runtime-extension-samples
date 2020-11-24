package com.sap.kyma.sample.orders.domain.command;

import javax.validation.constraints.NotBlank;

public class CreateOrder {

    @NotBlank
    private String description;

    public String getDescription() {
        return description;
    }

    public CreateOrder setDescription(String description) {
        this.description = description;
        return this;
    }
}
