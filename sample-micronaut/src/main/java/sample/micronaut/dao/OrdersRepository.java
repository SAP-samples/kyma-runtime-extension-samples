package sample.micronaut.dao;

import sample.micronaut.domain.Order;

import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.Optional;

public interface OrdersRepository {
    Optional<Order> findById(@NotNull String id);

    Order save(@NotNull Order order);

    List<Order> findAll();

    int update(@NotNull Order order);

    void deleteById(@NotNull String id);

}
