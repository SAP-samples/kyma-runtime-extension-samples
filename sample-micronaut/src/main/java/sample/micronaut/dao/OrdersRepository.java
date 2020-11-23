package sample.micronaut.dao;

import sample.micronaut.domain.command.UpdateOrder;
import sample.micronaut.domain.model.Order;

import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.Optional;

public interface OrdersRepository {
    Optional<Order> findById(@NotNull String id);

    Order save(@NotNull Order order);

    List<Order> findAll();

    int update(UpdateOrder order, Long id);

    void deleteById(@NotNull String id);

}
