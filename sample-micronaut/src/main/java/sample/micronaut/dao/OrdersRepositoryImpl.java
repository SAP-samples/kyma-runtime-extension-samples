package sample.micronaut.dao;

import io.micronaut.transaction.annotation.ReadOnly;
import sample.micronaut.domain.Order;

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
    public Optional<Order> findById(@NotNull String id) {
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
    public int update(@NotNull Order order) {
        return entityManager.createQuery("UPDATE Order o set description = :description where orderId = :orderId")
                .setParameter("description", order.getDescription())
                .setParameter("orderId", order.getOrderId())
                .executeUpdate();
    }

    @Override
    @Transactional
    public void deleteById(@NotNull String id) {
        findById(id).ifPresent(entityManager::remove);
    }
}
