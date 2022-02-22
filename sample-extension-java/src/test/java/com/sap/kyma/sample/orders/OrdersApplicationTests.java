package com.sap.kyma.sample.orders;

import com.sap.kyma.sample.orders.domain.command.CreateOrder;
import com.sap.kyma.sample.orders.domain.command.UpdateOrder;
import com.sap.kyma.sample.orders.domain.model.Order;
import org.json.JSONException;
import org.json.JSONObject;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.*;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class OrdersApplicationTests {
    private static final String BASE_PATH = "/orders";
    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    public void shouldDoCRUDOperations() throws JSONException {
        CreateOrder requestObj = new CreateOrder().setDescription("1");

        Order respObj = verifyCreate(requestObj);

        verifyGetList(respObj);

        verifyGet(respObj);

        verifyPut(respObj);

        verifyDelete(respObj);
    }

    private void verifyDelete(Order requestObj) {
        ResponseEntity<Integer> rowsDeleted = restTemplate.exchange(BASE_PATH + "/" + requestObj.getOrderId(),
                HttpMethod.DELETE, null, Integer.class);
        assertThat(rowsDeleted.getBody()).isEqualTo(1);
        Order[] ordersAfterDelete = restTemplate.getForObject(BASE_PATH, Order[].class);
        assertThat(ordersAfterDelete.length).isEqualTo(0);
    }

    private void verifyPut(Order requestObj) {
        UpdateOrder modified = new UpdateOrder().setDescription("2");
        restTemplate.put(BASE_PATH + "/" + requestObj.getOrderId(), modified);

        Order[] ordersAfterPut = restTemplate.getForObject(BASE_PATH, Order[].class);
        assertThat(ordersAfterPut.length).isEqualTo(1);
        assertThat(ordersAfterPut[0].getDescription()).isEqualTo(modified.getDescription());
        assertThat(ordersAfterPut[0].getCreated()).isNotNull();
        assertThat(ordersAfterPut[0].getOrderId()).isEqualTo(requestObj.getOrderId());
    }

    private void verifyGetList(Order respObj) {
        Order[] orders = restTemplate.getForObject(BASE_PATH, Order[].class);
        assertThat(orders.length).isEqualTo(1);
        compareOrders(respObj, orders[0]);
    }

    private void verifyGet(Order respObj) {
        Order getObj = restTemplate.getForObject(BASE_PATH + "/" + respObj.getOrderId(), Order.class);
        assertThat(getObj).isNotNull();
        compareOrders(respObj, getObj);
    }

    private Order verifyCreate(CreateOrder order) throws JSONException {
        HttpEntity<String> requestBody = map(order);
        Order respObj = restTemplate.postForObject(BASE_PATH + "/", requestBody, Order.class);
        assertThat(respObj.getCreated()).isNotNull();
        assertThat(respObj.getDescription()).isEqualTo(order.getDescription());
        assertThat(respObj.getOrderId()).isNotNull();
        return respObj;
    }

    private HttpEntity<String> map(CreateOrder order) throws JSONException {
        JSONObject obj = new JSONObject();
        obj.put("description", order.getDescription());
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        return new HttpEntity<>(obj.toString(), headers);
    }

    private HttpEntity<String> map(UpdateOrder order) throws JSONException {
        JSONObject obj = new JSONObject();
        obj.put("description", order.getDescription());
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        return new HttpEntity<>(obj.toString(), headers);
    }

    private void compareOrders(Order expected, Order actual) {
        assertThat(actual.getDescription()).isEqualTo(expected.getDescription());
    }
}
