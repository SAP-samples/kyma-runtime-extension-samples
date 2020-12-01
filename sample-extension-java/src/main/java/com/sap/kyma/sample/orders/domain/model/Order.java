package com.sap.kyma.sample.orders.domain.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.sap.kyma.sample.orders.domain.command.CreateOrder;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.time.LocalDateTime;

import static org.springframework.format.annotation.DateTimeFormat.ISO.DATE_TIME;

@Entity
@Table(name = "orders")
public class Order {
    @Id
    @JsonProperty("order_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId;

    private String description;

    @DateTimeFormat(iso = DATE_TIME)
    private LocalDateTime created;

    public Long getOrderId() {
        return orderId;
    }

    public Order setOrderId(Long orderId) {
        this.orderId = orderId;
        return this;
    }

    public String getDescription() {
        return description;
    }

    public Order setDescription(String description) {
        this.description = description;
        return this;
    }

    public LocalDateTime getCreated() {
        return created;
    }

    public Order setCreated(LocalDateTime created) {
        this.created = created;
        return this;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Order order = (Order) o;

        if (!orderId.equals(order.orderId)) return false;
        if (!description.equals(order.description)) return false;
        return created.equals(order.created);
    }

    @Override
    public int hashCode() {
        int result = orderId.hashCode();
        result = 31 * result + description.hashCode();
        result = 31 * result + created.hashCode();
        return result;
    }

    public static Order to(CreateOrder createOrder) {
        return new Order()
                .setDescription(createOrder.getDescription())
                .setCreated(LocalDateTime.now());
    }
}
