package com.sap.kyma.sample.orders.dao;

import com.sap.kyma.sample.orders.domain.command.UpdateOrder;
import com.sap.kyma.sample.orders.domain.model.Order;

import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.Optional;

public interface OrdersRepository {
    Optional<Order> findById(@NotNull Long id);

    Order save(@NotNull Order order);

    List<Order> findAll();

    int update(UpdateOrder order, Long id);

    void deleteById(@NotNull Long id);

}
