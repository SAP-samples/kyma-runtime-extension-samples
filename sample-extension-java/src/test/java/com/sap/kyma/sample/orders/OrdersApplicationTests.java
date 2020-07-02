package com.sap.kyma.sample.orders;

import com.sap.kyma.sample.orders.model.Order;
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
        Order requestObj = new Order().setOrderId("1").setDescription("1");
        assertThat(requestObj.getCreated()).isNull();

        Order respObj = verifyCreate(requestObj);

        verifyGetLis(respObj);

        verifyGet(respObj);

        verifyPut(requestObj);

        verifyDelete(requestObj);
    }

    private void verifyDelete(Order requestObj) {
        ResponseEntity<Integer> rowsDeleted = restTemplate.exchange(BASE_PATH + "/" + requestObj.getOrderId(),
                HttpMethod.DELETE, null, Integer.class);
        assertThat(rowsDeleted.getBody()).isEqualTo(1);
        Order[] ordersAfterDelete = restTemplate.getForObject(BASE_PATH, Order[].class);
        assertThat(ordersAfterDelete.length).isEqualTo(0);
    }

    private void verifyPut(Order requestObj) {
        Order modified = requestObj.setDescription("2");
        restTemplate.put(BASE_PATH + "/" + requestObj.getOrderId(), modified);

        Order[] ordersAfterPut = restTemplate.getForObject(BASE_PATH, Order[].class);
        assertThat(ordersAfterPut.length).isEqualTo(1);
        assertThat(ordersAfterPut[0].getDescription()).isEqualTo(modified.getDescription());
        assertThat(ordersAfterPut[0].getCreated()).isNotNull();
        assertThat(ordersAfterPut[0].getOrderId()).isEqualTo(modified.getOrderId());
    }

    private void verifyGetLis(Order respObj) {
        Order[] orders = restTemplate.getForObject(BASE_PATH, Order[].class);
        assertThat(orders.length).isEqualTo(1);
        assertThat(orders[0]).isEqualTo(respObj);
    }

    private void verifyGet(Order respObj) {
        Order getObj = restTemplate.getForObject(BASE_PATH + "/" + respObj.getOrderId(), Order.class);
        assertThat(getObj).isNotNull();
        assertThat(getObj).isEqualTo(respObj);
    }

    private Order verifyCreate(Order order) throws JSONException {
        HttpEntity<String> requestBody = map(order);
        Order respObj = restTemplate.postForObject(BASE_PATH + "/", requestBody, Order.class);
        assertThat(respObj.getCreated()).isNotNull();
        assertThat(respObj.getDescription()).isEqualTo(order.getDescription());
        assertThat(respObj.getOrderId()).isEqualTo(order.getOrderId());
        return respObj;
    }

    private HttpEntity<String> map(Order order) throws JSONException {
        JSONObject obj = new JSONObject();
        obj.put("order_id", order.getOrderId());
        obj.put("description", order.getDescription());
        if (order.getCreated() != null) {
            obj.put("created", order.getCreated().toString());
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        return new HttpEntity<>(obj.toString(), headers);
    }

}
