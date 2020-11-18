package sample.micronaut.controllers;

import io.micronaut.http.HttpHeaders;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.*;
import io.micronaut.scheduling.TaskExecutors;
import io.micronaut.scheduling.annotation.ExecuteOn;
import sample.micronaut.dao.OrdersRepository;
import sample.micronaut.domain.Order;

import java.net.URI;
import java.time.LocalDateTime;
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
    public Optional<Order> getOrder(String id) {
        return ordersRepository.findById(id);
    }

    @Put("/{id}")
    public HttpResponse<?> updateOrder(@PathVariable String id, @Body Order order) {
        int numberOfEntitiesUpdated = ordersRepository.update(order);
        return HttpResponse
                .noContent()
                .header(HttpHeaders.LOCATION, location(order).getPath());
    }

    @Post
    public HttpResponse<Order> addOrder(@Body Order order) {
        Order orderCreated = ordersRepository.save(order.getCreated() == null ? order.setCreated(LocalDateTime.now()) : order);
        return HttpResponse
                .created(orderCreated)
                .headers(headers -> headers.location(location(order)));
    }

    @Get
    public List<Order> getOrders() {
        return ordersRepository.findAll();
    }

    @Delete("/{id}")
    public HttpResponse<Void> delete(String id) {
        ordersRepository.deleteById(id);
        return HttpResponse.noContent();
    }

    protected URI location(String id) {
        return URI.create("/orders/" + id);
    }

    protected URI location(Order order) {
        return location(order.getOrderId());
    }

}
