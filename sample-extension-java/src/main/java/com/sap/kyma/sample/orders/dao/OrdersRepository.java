package com.sap.kyma.sample.orders.dao;

import com.sap.kyma.sample.orders.domain.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import javax.transaction.Transactional;

public interface OrdersRepository extends JpaRepository<Order, Long> {

    @Modifying(clearAutomatically = true)
    @Transactional
    @Query("update Order o set o.description = ?1 where o.orderId = ?2")
    int updateDescription(String description, Long orderId);

    @Modifying(clearAutomatically = true)
    @Transactional
    @Query("delete from Order o where o.orderId = ?1")
    int deleteOrderById(Long orderId);
}
