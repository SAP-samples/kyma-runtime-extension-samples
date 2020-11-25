package com.sap.kyma.sample.orders;

import com.sap.kyma.sample.orders.domain.command.CreateOrder;
import com.sap.kyma.sample.orders.domain.command.UpdateOrder;
import com.sap.kyma.sample.orders.domain.model.Order;
import io.micronaut.core.type.Argument;
import io.micronaut.http.HttpRequest;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.client.HttpClient;
import io.micronaut.http.client.annotation.Client;
import io.micronaut.test.extensions.junit5.annotation.MicronautTest;
import org.junit.jupiter.api.Test;

import javax.inject.Inject;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@MicronautTest
public class OrderControllerTest {

    @Inject
    @Client("/")
    private HttpClient httpClient;

    @Test
    void testCRUD() {
        CreateOrder createCommand = new CreateOrder("create-order");
        Order order = verifyCreate(createCommand);

        UpdateOrder updateCommand = new UpdateOrder("update-order");
        verifyUpdate(order, updateCommand);

        verifyGet(order, updateCommand);

        verifyGetList(order, updateCommand);
    }

    private void verifyGetList(Order order, UpdateOrder updateCommand) {
        List<Order> orders = httpClient.toBlocking().retrieve(HttpRequest.GET("/orders"),
                Argument.of(List.class, Order.class));
        assertEquals(orders.size(), 1);
        check(order, orders.get(0), updateCommand.getDescription());
    }

    private void verifyGet(Order order, UpdateOrder updateCommand) {
        Order retrievedOrder = httpClient.toBlocking().retrieve("/orders/" + order.getOrderId(), Order.class);
        String description = updateCommand.getDescription();
        check(order, retrievedOrder, description);
    }

    private void check(Order order, Order retrievedOrder, String description) {
        assertEquals(description, retrievedOrder.getDescription());
        assertNotNull(retrievedOrder.getCreated());
        assertEquals(retrievedOrder.getOrderId(), order.getOrderId());
    }

    private void verifyUpdate(Order order, UpdateOrder updateCommand) {
        HttpResponse<Object> response = httpClient.toBlocking().exchange(HttpRequest.PUT("/orders/" + order.getOrderId(), updateCommand));
        assertEquals(HttpStatus.NO_CONTENT, response.getStatus());
    }

    private Order verifyCreate(CreateOrder createCommand) {
        HttpRequest<CreateOrder> request = HttpRequest.POST("/orders", createCommand);
        HttpResponse<Order> response = httpClient.toBlocking().exchange(request, Order.class);
        assertEquals(HttpStatus.CREATED, response.getStatus());
        assertTrue(response.getBody().isPresent());
        assertEquals(response.body().getDescription(), createCommand.getDescription());
        assertNotNull(response.body().getCreated());
        return response.body();
    }
}
