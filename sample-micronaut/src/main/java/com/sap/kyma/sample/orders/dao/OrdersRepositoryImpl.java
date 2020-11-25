package com.sap.kyma.sample.orders.dao;

import com.sap.kyma.sample.orders.domain.command.UpdateOrder;
import io.micronaut.transaction.annotation.ReadOnly;
import com.sap.kyma.sample.orders.domain.model.Order;

import javax.inject.Singleton;
import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.transaction.Transactional;
import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.Optional;

@Singleton
public class OrdersRepositoryImpl implements OrdersRepository {
    private final EntityManager entityManager;

    public OrdersRepositoryImpl(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    @ReadOnly
    public Optional<Order> findById(@NotNull Long id) {
        return Optional.ofNullable(entityManager.find(Order.class, id));
    }

    @Override
    @Transactional
    public Order save(@NotNull Order order) {
        entityManager.persist(order);
        return order;
    }

    @Override
    @ReadOnly
    public List<Order> findAll() {
        String queryString = "SELECT o from Order as o";
        TypedQuery<Order> query = entityManager.createQuery(queryString, Order.class);
        return query.getResultList();
    }

    @Override
    @Transactional
    public int update(UpdateOrder order, Long orderId) {
        return entityManager.createQuery("UPDATE Order o set description = :description where orderId = :orderId")
                .setParameter("description", order.getDescription())
                .setParameter("orderId", orderId)
                .executeUpdate();
    }

    @Override
    @Transactional
    public void deleteById(@NotNull Long id) {
        findById(id).ifPresent(entityManager::remove);
    }
}
