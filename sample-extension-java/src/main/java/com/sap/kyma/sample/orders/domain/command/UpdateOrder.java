package com.sap.kyma.sample.orders.domain.command;

import javax.validation.constraints.NotBlank;

public class UpdateOrder {
    @NotBlank
    private String description;

    public String getDescription() {
        return description;
    }

    public UpdateOrder setDescription(String description) {
        this.description = description;
        return this;
    }
}
