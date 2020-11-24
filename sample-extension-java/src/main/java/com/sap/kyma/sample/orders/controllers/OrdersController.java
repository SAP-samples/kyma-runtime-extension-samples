package com.sap.kyma.sample.orders.controllers;

import com.sap.kyma.sample.orders.dao.OrdersRepository;
import com.sap.kyma.sample.orders.domain.command.CreateOrder;
import com.sap.kyma.sample.orders.domain.command.UpdateOrder;
import com.sap.kyma.sample.orders.domain.model.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(path = "/orders")
public class OrdersController {

    private final OrdersRepository repository;

    @Autowired
    public OrdersController(OrdersRepository repository) {
        this.repository = repository;
    }

    @GetMapping()
    public List<Order> getOrders() {
        return repository.findAll();
    }

    @PostMapping()
    public Order addOrder(@RequestBody CreateOrder order) {
        return repository.save(Order.to(order));
    }

    @PutMapping(path = "/{id}")
    public int updateOrder(@PathVariable Long id, @RequestBody UpdateOrder order) {
        return repository.updateDescription(order.getDescription(), id);
    }

    @DeleteMapping(path = "/{id}")
    public int deleteOrder(@PathVariable Long id) {
        return repository.deleteOrderById(id);
    }

    @GetMapping(path = "/{id}")
    public Optional<Order> getOrder(@PathVariable Long id) {
        return repository.findById(id);
    }
}
