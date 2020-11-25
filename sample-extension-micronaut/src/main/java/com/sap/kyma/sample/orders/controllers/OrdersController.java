package com.sap.kyma.sample.orders.controllers;

import com.sap.kyma.sample.orders.dao.OrdersRepository;
import com.sap.kyma.sample.orders.domain.command.CreateOrder;
import com.sap.kyma.sample.orders.domain.command.UpdateOrder;
import com.sap.kyma.sample.orders.domain.model.Order;
import io.micronaut.http.HttpHeaders;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.*;
import io.micronaut.scheduling.TaskExecutors;
import io.micronaut.scheduling.annotation.ExecuteOn;

import java.net.URI;
import java.util.List;
import java.util.Optional;

@Controller("/orders")
@ExecuteOn(TaskExecutors.IO)
public class OrdersController {
    protected final OrdersRepository ordersRepository;

    public OrdersController(OrdersRepository ordersRepository) {
        this.ordersRepository = ordersRepository;
    }

    @Get("/{id}")
    public Optional<Order> getOrder(Long id) {
        return ordersRepository.findById(id);
    }

    @Put("/{id}")
    public HttpResponse<?> updateOrder(@PathVariable Long id, @Body UpdateOrder order) {
        int numberOfEntitiesUpdated = ordersRepository.update(order, id);
        return HttpResponse
                .noContent()
                .header(HttpHeaders.LOCATION, location(id).getPath());
    }

    @Post
    public HttpResponse<Order> addOrder(@Body CreateOrder order) {
        Order orderCreated = ordersRepository.save(Order.to(order));
        return HttpResponse
                .created(orderCreated)
                .headers(headers -> headers.location(location(orderCreated)));
    }

    @Get
    public List<Order> getOrders() {
        return ordersRepository.findAll();
    }

    @Delete("/{id}")
    public HttpResponse<Void> delete(Long id) {
        ordersRepository.deleteById(id);
        return HttpResponse.noContent();
    }

    protected URI location(Long id) {
        return URI.create("/orders/" + id);
    }

    protected URI location(Order order) {
        return location(order.getOrderId());
    }

}
