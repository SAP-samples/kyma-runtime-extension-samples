package sample.micronaut.domain.command;

import javax.validation.constraints.NotBlank;

public class UpdateOrder {
    @NotBlank
    private String description;

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
